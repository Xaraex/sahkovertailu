// scripts/test-fingrid-direct.js
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.FINGRID_API_KEY;
console.log(`API key length: ${apiKey.length}`);
console.log(`First 3 chars: ${apiKey.substring(0, 3)}...`);

// Try a super simple request to the notifications endpoint
const options = {
    hostname: 'data.fingrid.fi',
    path: '/api/notifications/active',
    method: 'GET',
    headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json'
    }
};

console.log('Making request to Fingrid API...');
const req = https.request(options, (res) => {
    console.log(`Status code: ${res.statusCode}`);
    console.log('Headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response body:', data);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();