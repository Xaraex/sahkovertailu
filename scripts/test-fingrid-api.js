/**
 * Script to test Fingrid API endpoints based on the correct API documentation
 * 
 * Usage:
 * node scripts/test-correct-endpoints.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Get the project root directory
const rootDir = process.cwd();

// Read API key from .env.local file
function getApiKey() {
    try {
        const envPath = path.join(rootDir, '.env.local');
        console.log('Looking for .env.local at:', envPath);

        if (!fs.existsSync(envPath)) {
            console.error('ERROR: .env.local file not found!');
            return null;
        }

        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');

        for (const line of lines) {
            if (line.startsWith('FINGRID_API_KEY=')) {
                const apiKey = line.substring('FINGRID_API_KEY='.length).trim();
                return apiKey;
            }
        }

        console.error('ERROR: API key not found in .env.local file');
        return null;
    } catch (error) {
        console.error('Error reading .env.local file:', error.message);
        return null;
    }
}

// Make an HTTPS request to the Fingrid API
function makeRequest(url, apiKey) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'x-api-key': apiKey,
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        };

        console.log('Testing URL:', url);

        const req = https.get(url, options, (res) => {
            console.log('Response status:', res.statusCode);

            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const jsonData = JSON.parse(data);
                            resolve({
                                statusCode: res.statusCode,
                                success: true,
                                data: jsonData
                            });
                        } catch (e) {
                            resolve({
                                statusCode: res.statusCode,
                                success: true,
                                data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
                            });
                        }
                    } else {
                        resolve({
                            statusCode: res.statusCode,
                            success: false,
                            error: data
                        });
                    }
                } catch (error) {
                    reject(new Error(`Failed to process response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.end();
    });
}

// Test the correct Fingrid API endpoints
async function testEndpoints() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error('Cannot test API without a valid API key');
        process.exit(1);
    }

    // Dataset IDs to test
    const datasetIds = [193, 192, 188, 181, 265]; // Consumption, Production, Nuclear, Wind, CO2

    // Create date range for historical data queries
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const startTime = yesterday.toISOString();
    const endTime = now.toISOString();

    console.log('API Key found, testing correct Fingrid API endpoints...\n');

    // Test notifications endpoint
    try {
        console.log('\n==== Testing notifications endpoint ====');
        const notificationsUrl = 'https://data.fingrid.fi/api/notifications/active';
        const notificationResult = await makeRequest(notificationsUrl, apiKey);

        if (notificationResult.success) {
            console.log('✅ Notifications endpoint works!');
            console.log('Response:', JSON.stringify(notificationResult.data, null, 2));
        } else {
            console.log('❌ Notifications endpoint failed:', notificationResult.error);
        }
    } catch (error) {
        console.error('Error testing notifications endpoint:', error.message);
    }

    // Test latest data endpoint for each dataset
    for (const datasetId of datasetIds) {
        try {
            console.log(`\n==== Testing latest data for dataset ${datasetId} ====`);
            const latestUrl = `https://data.fingrid.fi/api/datasets/${datasetId}/data/latest`;
            const latestResult = await makeRequest(latestUrl, apiKey);

            if (latestResult.success) {
                console.log(`✅ Latest data endpoint works for dataset ${datasetId}!`);
                console.log('Response:', JSON.stringify(latestResult.data, null, 2));
            } else {
                console.log(`❌ Latest data endpoint failed for dataset ${datasetId}:`, latestResult.error);
            }
        } catch (error) {
            console.error(`Error testing latest data for dataset ${datasetId}:`, error.message);
        }
    }

    // Test historical data endpoint for the first dataset
    try {
        console.log(`\n==== Testing historical data for dataset ${datasetIds[0]} ====`);
        const historicalUrl = `https://data.fingrid.fi/api/datasets/${datasetIds[0]}/data?start_time=${startTime}&end_time=${endTime}`;
        const historicalResult = await makeRequest(historicalUrl, apiKey);

        if (historicalResult.success) {
            console.log(`✅ Historical data endpoint works for dataset ${datasetIds[0]}!`);
            console.log(`Received ${Array.isArray(historicalResult.data) ? historicalResult.data.length : 'unknown'} data points`);
            if (Array.isArray(historicalResult.data) && historicalResult.data.length > 0) {
                console.log('First data point:', JSON.stringify(historicalResult.data[0], null, 2));
            }
        } else {
            console.log(`❌ Historical data endpoint failed for dataset ${datasetIds[0]}:`, historicalResult.error);
        }
    } catch (error) {
        console.error(`Error testing historical data for dataset ${datasetIds[0]}:`, error.message);
    }
}

// Run the test
testEndpoints().catch(error => {
    console.error('Unhandled error:', error);
});