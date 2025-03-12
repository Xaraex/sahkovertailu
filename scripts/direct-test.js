/**
 * A very simple script to test the Fingrid API directly
 * This bypasses Next.js completely to verify the API key and endpoints
 * 
 * Usage: node scripts/direct-test.js
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

        console.log('Found .env.local file. Contents:');
        const envContent = fs.readFileSync(envPath, 'utf-8');

        // Print file content with API key masked
        const maskedContent = envContent.replace(/(FINGRID_API_KEY=)(.+)/, (match, p1, p2) => {
            return p1 + p2.substring(0, 3) + '...' + (p2.length > 6 ? p2.substring(p2.length - 3) : '');
        });
        console.log(maskedContent);

        // Extract API key
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

// Make a simple HTTPS request
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
        console.log('Using API key (length):', apiKey.length);
        console.log('First 2 chars of key:', apiKey.substring(0, 2));

        const req = https.get(url, options, (res) => {
            console.log('Response status:', res.statusCode);
            console.log('Response headers:', res.headers);

            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                // Show the response
                console.log('\nResponse preview:');
                console.log(data.substring(0, 200) + (data.length > 200 ? '...' : ''));

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        // Try to parse as JSON if possible
                        const jsonData = JSON.parse(data);
                        console.log('\nParsed JSON data:');
                        console.log(JSON.stringify(jsonData, null, 2).substring(0, 500) + '...');
                        resolve(jsonData);
                    } catch (e) {
                        console.log('\nNot valid JSON data');
                        resolve(data);
                    }
                } else {
                    reject(new Error(`API returned status code ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.end();
    });
}

async function main() {
    try {
        // Get API key
        const apiKey = getApiKey();
        if (!apiKey) {
            console.error('Cannot test API without a valid API key');
            process.exit(1);
        }

        console.log('\n==== Testing Fingrid API notifications endpoint ====');
        try {
            // Test the simplest endpoint first
            const notificationsResult = await makeRequest('https://data.fingrid.fi/api/notifications/active', apiKey);
            console.log('✅ Notifications endpoint works!');
        } catch (error) {
            console.error('❌ Error with notifications endpoint:', error.message);
        }

        // Define some dataset IDs to test
        const datasetIds = [193]; // Just test one to avoid rate limits

        // Get the current time and yesterday for the time range
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        for (const id of datasetIds) {
            console.log(`\n==== Testing dataset ${id} latest data ====`);
            try {
                const latestUrl = `https://data.fingrid.fi/api/datasets/${id}/data/latest`;
                const latestResult = await makeRequest(latestUrl, apiKey);
                console.log(`✅ Latest data endpoint works for dataset ${id}!`);
            } catch (error) {
                console.error(`❌ Error with latest data endpoint for dataset ${id}:`, error.message);
            }

            // Wait a bit to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`\n==== Testing dataset ${id} historical data ====`);
            try {
                const startTime = yesterday.toISOString();
                const endTime = now.toISOString();
                const historicalUrl = `https://data.fingrid.fi/api/datasets/${id}/data?start_time=${startTime}&end_time=${endTime}`;
                const historicalResult = await makeRequest(historicalUrl, apiKey);
                console.log(`✅ Historical data endpoint works for dataset ${id}!`);
            } catch (error) {
                console.error(`❌ Error with historical data endpoint for dataset ${id}:`, error.message);
            }
        }

        console.log('\nAll tests completed!');
    } catch (error) {
        console.error('Error in test script:', error);
    }
}

// Run the main function
main().catch(console.error);