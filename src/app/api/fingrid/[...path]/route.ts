import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache with expiration
const cache: Record<string, { data: any, timestamp: number }> = {};

// Function to get cache key from request
function getCacheKey(path: string[], queryParams: string): string {
    return `${path.join('/')}${queryParams}`;
}

// Function to check if cache is valid
function getCachedResponse(key: string, maxAgeSeconds: number = 600): any | null {
    const entry = cache[key];
    if (!entry) return null;

    const ageMs = Date.now() - entry.timestamp;
    if (ageMs > maxAgeSeconds * 1000) return null;

    return entry.data;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        // Get the path from the request
        const path = params.path || [];
        const originalPath = path.join('/');

        // Get query parameters from the incoming request
        const url = new URL(request.url);
        const queryParams = url.search || '';

        // Create a cache key based on the full request
        const cacheKey = getCacheKey(path, queryParams);

        // Set cache duration based on endpoint type
        // - Notifications: 10 minutes
        // - Latest data: 5 minutes
        // - Historical data: 30 minutes (this data doesn't change for past dates)
        let cacheDuration = 600; // Default: 10 minutes

        if (originalPath.includes('data/latest')) {
            cacheDuration = 300; // 5 minutes for latest data
        } else if (originalPath.includes('/data') && queryParams.includes('start_time')) {
            cacheDuration = 1800; // 30 minutes for historical data
        }

        // Check if we have a cached response
        const cachedData = getCachedResponse(cacheKey, cacheDuration);
        if (cachedData) {
            console.log(`[API] Cache hit for ${originalPath}${queryParams} (age: ${(Date.now() - cachedData.timestamp) / 1000}s)`);
            return NextResponse.json(cachedData.data);
        }

        // Get API key with error handling
        const apiKey = process.env.FINGRID_API_KEY || '';
        if (!apiKey) {
            console.error("Fingrid API key is missing");
            return NextResponse.json(
                { error: 'API key is not configured' },
                { status: 500 }
            );
        }

        // Build Fingrid API URL
        const fingridUrl = `https://data.fingrid.fi/api/${originalPath}${queryParams}`;
        console.log(`[API] Making request to Fingrid: ${originalPath}${queryParams}`);

        // Make request to Fingrid API
        const fingridResponse = await fetch(fingridUrl, {
            headers: {
                'x-api-key': apiKey,
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
        });

        // Handle non-OK responses
        if (!fingridResponse.ok) {
            const errorText = await fingridResponse.text();
            console.error(`Fingrid API error (${fingridResponse.status}):`, errorText);

            // Handle rate limiting specifically
            if (fingridResponse.status === 429) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded', message: 'Too many requests to Fingrid API' },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: `Fingrid API returned ${fingridResponse.status}`, message: errorText },
                { status: fingridResponse.status }
            );
        }

        // Parse response data
        const responseText = await fingridResponse.text();
        let data;

        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse Fingrid response as JSON');
            return NextResponse.json(
                { error: 'Invalid JSON response from Fingrid API' },
                { status: 502 }
            );
        }

        // Store in cache with timestamp
        cache[cacheKey] = {
            data,
            timestamp: Date.now()
        };

        // Return successful response
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
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        },
    });
}