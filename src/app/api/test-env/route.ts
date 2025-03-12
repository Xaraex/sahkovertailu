import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Safely check environment variables
        const apiKey = process.env.FINGRID_API_KEY || '';

        // Create a response with debugging information
        return NextResponse.json({
            environment: process.env.NODE_ENV,
            apiKeyStatus: {
                exists: apiKey.length > 0,
                length: apiKey.length,
                // Show first and last character for verification without exposing the full key
                preview: apiKey.length > 0 ?
                    `${apiKey.charAt(0)}...${apiKey.charAt(apiKey.length - 1)}` :
                    'not set'
            },
            envVariables: Object.keys(process.env).filter(key =>
                !key.includes('SECRET') &&
                !key.includes('KEY') &&
                !key.includes('TOKEN') &&
                !key.includes('PASSWORD')
            ),
            // Add server runtime information
            serverInfo: {
                nodeVersion: process.version,
                platform: process.platform,
                cwd: process.cwd(),
                // NextJS puts some runtime info in process.env
                nextRuntime: process.env.NEXT_RUNTIME || 'unknown',
            },
            // Current timestamp for cache debugging
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in debug-env route:', error);
        return NextResponse.json(
            {
                error: 'Error checking environment variables',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}