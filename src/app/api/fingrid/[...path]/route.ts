import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const path = params.path.join('/');
        const apiKey = process.env.FINGRID_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key is not configured' },
                { status: 500 }
            );
        }

        // Get query parameters from the incoming request
        const url = new URL(request.url);
        const queryParams = url.search;

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

        // If the response wasn't ok, throw an error
        if (!fingridResponse.ok) {
            const errorText = await fingridResponse.text();
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

        // Return the response with appropriate CORS headers
        return NextResponse.json(data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        console.error('Error in Fingrid API route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
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