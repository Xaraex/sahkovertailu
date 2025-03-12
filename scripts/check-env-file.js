/**
 * Script to check if your .env.local file exists and has the correct format
 * 
 * Usage: 
 * node scripts/check-env-file.js
 */

const fs = require('fs');
const path = require('path');

// Current working directory
const cwd = process.cwd();
console.log('Current working directory:', cwd);

// Expected location of .env.local
const envPath = path.join(cwd, '.env.local');
console.log('Looking for .env.local at:', envPath);

// Check if file exists
if (!fs.existsSync(envPath)) {
    console.error('\n❌ ERROR: .env.local file not found!');
    console.log('\nPlease create a file named ".env.local" in your project root with this content:');
    console.log('\nFINGRID_API_KEY=your_actual_api_key_here');
    process.exit(1);
}

console.log('✅ .env.local file found!');

// Read the file
try {
    const fileContent = fs.readFileSync(envPath, 'utf8');
    console.log('\nFile content analysis:');

    // Print file content with sensitive data masked
    const lines = fileContent.split('\n');
    let hasApiKey = false;
    let apiKeyValue = '';

    lines.forEach(line => {
        const trimmedLine = line.trim();

        if (trimmedLine === '') {
            console.log('  <empty line>');
        } else if (trimmedLine.startsWith('#')) {
            console.log(`  Comment: ${trimmedLine}`);
        } else if (trimmedLine.startsWith('FINGRID_API_KEY=')) {
            hasApiKey = true;
            apiKeyValue = trimmedLine.substring('FINGRID_API_KEY='.length);

            // Mask the API key but show diagnostics
            const maskedValue = apiKeyValue.length > 0
                ? (apiKeyValue.length <= 6
                    ? apiKeyValue.charAt(0) + '...' + apiKeyValue.charAt(apiKeyValue.length - 1)
                    : apiKeyValue.substring(0, 3) + '...' + apiKeyValue.substring(apiKeyValue.length - 3))
                : '<empty>';

            console.log(`  FINGRID_API_KEY=${maskedValue} (length: ${apiKeyValue.length})`);
        } else {
            // Other environment variables
            const parts = trimmedLine.split('=');
            if (parts.length >= 2) {
                const key = parts[0];
                const value = parts.slice(1).join('=');
                console.log(`  ${key}=<value> (length: ${value.length})`);
            } else {
                console.log(`  Invalid line: ${trimmedLine} (missing "=")`);
            }
        }
    });

    console.log('\nDiagnostics:');

    if (!hasApiKey) {
        console.error('❌ ERROR: FINGRID_API_KEY not found in .env.local');
        console.log('   Make sure the variable name is exactly "FINGRID_API_KEY" (case sensitive)');
    } else {
        console.log('✅ FINGRID_API_KEY found in file');

        // Check for common issues with the API key
        if (apiKeyValue.length === 0) {
            console.error('❌ ERROR: FINGRID_API_KEY is empty');
        } else if (apiKeyValue.startsWith('"') || apiKeyValue.endsWith('"') ||
            apiKeyValue.startsWith("'") || apiKeyValue.endsWith("'")) {
            console.error('❌ ERROR: FINGRID_API_KEY has quotes around it');
            console.log('   Remove the quotes. The correct format is: FINGRID_API_KEY=abc123def456');
        } else if (apiKeyValue.includes(' ')) {
            console.error('❌ ERROR: FINGRID_API_KEY contains spaces');
            console.log('   Remove any spaces from the API key');
        } else if (apiKeyValue.length < 10) {
            console.warn('⚠️ WARNING: FINGRID_API_KEY seems too short');
            console.log('   Most API keys are longer. Check if it was copied correctly');
        } else {
            console.log('✅ FINGRID_API_KEY format looks good');
        }
    }

    // Check file encoding
    const buffer = fs.readFileSync(envPath);
    if (buffer.includes(Buffer.from([0xEF, 0xBB, 0xBF]))) {
        console.warn('⚠️ WARNING: File has UTF-8 BOM encoding');
        console.log('   This can cause issues. Save the file with UTF-8 encoding without BOM');
    } else {
        console.log('✅ File encoding looks good');
    }

    // Check file permissions
    try {
        const stats = fs.statSync(envPath);
        const permissions = stats.mode & 0o777;
        console.log(`✅ File permissions: ${permissions.toString(8)}`);
    } catch (error) {
        console.warn(`⚠️ WARNING: Could not check file permissions: ${error.message}`);
    }

    console.log('\nNext step: Run the API test script:');
    console.log('node scripts/test-fingrid-api.js');

} catch (error) {
    console.error(`\n❌ ERROR reading .env.local file: ${error.message}`);
}