import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const path = params.path.join('/');
        const apiKey = process.env.FINGRID_API_KEY;

        if (!apiKey) {
            console.error("Fingrid API key is missing from environment variables");
            return NextResponse.json(
                { error: 'API key is not configured on the server' },
                { status: 500 }
            );
        }

        // Get query parameters from the incoming request
        const url = new URL(request.url);
        const queryParams = url.search;

        // Log for debugging (these logs are only visible on the server)
        console.log(`Making request to Fingrid API: /variable/${path}${queryParams}`);

        // Make request to Fingrid API
        const fingridResponse = await fetch(
            `https://api.fingrid.fi/v1/avoindata-api/${path}${queryParams}`,
            {
                headers: {
                    'x-api-key': apiKey,
                    'Accept': 'application/json',
                },
            }
        );

        // If the response wasn't ok, return the error
        if (!fingridResponse.ok) {
            const errorText = await fingridResponse.text();
            console.error(`Fingrid API error (${fingridResponse.status}): ${errorText}`);

            return NextResponse.json(
                {
                    error: 'Failed to fetch data from Fingrid API',
                    status: fingridResponse.status,
                    message: errorText
                },
                { status: fingridResponse.status }
            );
        }

        // Get the data from the response
        const data = await fingridResponse.json();

        // Return the response
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in Fingrid API route:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}