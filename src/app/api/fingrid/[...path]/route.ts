import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        // Get the path from the request
        const originalPath = params.path ? params.path.join('/') : '';
        console.log('Requested path:', originalPath);

        // Get API key - with careful error handling
        let apiKey = '';
        try {
            apiKey = process.env.FINGRID_API_KEY || '';
            console.log('API key length:', apiKey.length);
        } catch (envError) {
            console.error('Error accessing environment variables:', envError);
            return NextResponse.json(
                {
                    error: 'Error accessing environment variables',
                    message: 'There was a problem accessing the API key. Check server logs.'
                },
                { status: 500 }
            );
        }

        // Check for API key presence
        if (!apiKey || apiKey.length === 0) {
            console.error("Fingrid API key is missing from environment variables");
            return NextResponse.json(
                {
                    error: 'API key is not configured',
                    message: 'API key is not configured on the server. Check your .env.local file and restart the server.'
                },
                { status: 500 }
            );
        }

        // Get query parameters from the incoming request
        const url = new URL(request.url);
        const queryParams = url.search || '';

        // Determine the correct endpoint path
        let finalPath = originalPath;

        // If the path starts with 'datasets' and ends with 'data/latest', it's for latest data
        // If it starts with 'datasets' and ends with 'data', it's for historical data
        // Otherwise, use the original path

        // Build the Fingrid API URL
        const fingridUrl = `https://data.fingrid.fi/api/${finalPath}${queryParams}`;
        console.log(`Making request to Fingrid API: ${fingridUrl}`);

        try {
            // Make request to Fingrid API with proper error handling
            const fingridResponse = await fetch(
                fingridUrl,
                {
                    headers: {
                        'x-api-key': apiKey,
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                }
            );

            console.log('Fingrid response status:', fingridResponse.status);

            // Log headers in a TypeScript-compatible way
            const headerObj: Record<string, string> = {};
            // Use forEach instead of [...entries()] to avoid TypeScript downlevel iteration errors
            fingridResponse.headers.forEach((value, key) => {
                headerObj[key] = value;
            });
            console.log('Fingrid response headers:', headerObj);

            // If the response wasn't ok, handle error properly
            if (!fingridResponse.ok) {
                let errorMessage = '';

                try {
                    // Try to get error text
                    errorMessage = await fingridResponse.text();
                    console.error(`Fingrid API error (${fingridResponse.status}):`, errorMessage);
                } catch (textError) {
                    errorMessage = 'Could not read error response';
                    console.error('Error reading error response:', textError);
                }

                // Always return a properly formatted JSON response
                return NextResponse.json(
                    {
                        error: 'Failed to fetch data from Fingrid API',
                        status: fingridResponse.status,
                        message: errorMessage
                    },
                    { status: fingridResponse.status }
                );
            }

            // Get the data from the response safely
            try {
                const text = await fingridResponse.text();

                // Debug the response
                console.log('Response text preview:', text.substring(0, 100));

                let data;
                try {
                    data = JSON.parse(text);
                    console.log('Successfully parsed Fingrid API response');
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    return NextResponse.json(
                        {
                            error: 'Failed to parse Fingrid API response as JSON',
                            message: `Response was not valid JSON: ${text.substring(0, 100)}...`
                        },
                        { status: 502 }
                    );
                }

                // Return the response
                return NextResponse.json(data);
            } catch (responseError) {
                console.error('Error processing response from Fingrid API:', responseError);

                return NextResponse.json(
                    {
                        error: 'Error processing response from Fingrid API',
                        message: responseError instanceof Error ? responseError.message : 'Unknown error processing response'
                    },
                    { status: 502 }
                );
            }
        } catch (fetchError) {
            console.error('Fetch error when calling Fingrid API:', fetchError);

            return NextResponse.json(
                {
                    error: 'Network error when calling Fingrid API',
                    message: fetchError instanceof Error ? fetchError.message : 'Unknown network error'
                },
                { status: 503 }
            );
        }
    } catch (error) {
        // Catch all other errors and format as JSON
        console.error('Unhandled error in Fingrid API route:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error processing request'
            },
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
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        },
    });
}