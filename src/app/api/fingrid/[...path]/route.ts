import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache with expiration - pidemmät cache-ajat
const cache: Record<string, { data: any, timestamp: number }> = {};

// Seurataan API-kutsuja rate limitin hallintaan
const requestTimestamps: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 5; // Konservatiivinen raja-arvo

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

    return {
        data: entry.data,
        age: ageMs / 1000 // Age in seconds
    };
}

// Check if we can make a request based on rate limits
function canMakeRequest(): boolean {
    const now = Date.now();
    // Remove timestamps older than 1 minute
    while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
        requestTimestamps.shift();
    }
    return requestTimestamps.length < MAX_REQUESTS_PER_MINUTE;
}

// Record a request for rate limiting
function recordRequest(): void {
    requestTimestamps.push(Date.now());
}

// Common response headers including CORS
const commonHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        // Get the path from the request
        const path = params.path || [];
        const originalPath = path.join('/');

        // Check if this is a special dashboard request
        if (originalPath === 'dashboard') {
            return handleDashboardRequest(request);
        }

        // Standard endpoint handling
        // Get query parameters from the incoming request
        const url = new URL(request.url);
        const queryParams = url.search || '';

        // Create a cache key based on the full request
        const cacheKey = getCacheKey(path, queryParams);

        // Set cache duration based on endpoint type
        let cacheDuration = 600; // Default: 10 minutes

        if (originalPath.includes('data/latest')) {
            cacheDuration = 300; // 5 minutes for latest data
        } else if (originalPath.includes('/data') && queryParams.includes('start_time')) {
            cacheDuration = 1800; // 30 minutes for historical data
        }

        // Check if we have a cached response
        const cachedResponse = getCachedResponse(cacheKey, cacheDuration);
        if (cachedResponse) {
            console.log(`[API] Cache hit for ${originalPath}${queryParams} (age: ${cachedResponse.age.toFixed(1)}s)`);
            return NextResponse.json(cachedResponse.data, {
                headers: {
                    ...commonHeaders,
                    'X-Cache-Hit': 'true',
                    'X-Cache-Age': cachedResponse.age.toFixed(1)
                }
            });
        }

        // Check if we're at rate limit
        if (!canMakeRequest()) {
            console.log(`[API] Rate limit reached for ${originalPath}${queryParams}, returning 429`);
            return NextResponse.json(
                { error: 'Rate limit reached', message: 'Too many requests. Try again later.' },
                {
                    status: 429,
                    headers: {
                        ...commonHeaders,
                        'Retry-After': '60'
                    }
                }
            );
        }

        // Record this request for rate limiting
        recordRequest();

        // Get API key with error handling
        const apiKey = process.env.FINGRID_API_KEY || '';
        if (!apiKey) {
            console.error("Fingrid API key is missing");
            return NextResponse.json(
                { error: 'API key is not configured' },
                { status: 500, headers: commonHeaders }
            );
        }

        // Build Fingrid API URL
        const fingridUrl = `https://data.fingrid.fi/api/${originalPath}${queryParams}`;
        console.log(`[API] Making request to Fingrid: ${fingridUrl}`);

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
                    {
                        status: 429,
                        headers: {
                            ...commonHeaders,
                            'Retry-After': '60'
                        }
                    }
                );
            }

            return NextResponse.json(
                { error: `Fingrid API returned ${fingridResponse.status}`, message: errorText },
                { status: fingridResponse.status, headers: commonHeaders }
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
                { status: 502, headers: commonHeaders }
            );
        }

        // Store in cache with timestamp
        cache[cacheKey] = {
            data,
            timestamp: Date.now()
        };

        // Return successful response with CORS headers
        return NextResponse.json(data, {
            headers: {
                ...commonHeaders,
                'X-Cache-Hit': 'false'
            }
        });

    } catch (error) {
        console.error('Error in Fingrid API route:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500, headers: commonHeaders }
        );
    }
}

// Special handler for dashboard requests - combines multiple datasets in one response
async function handleDashboardRequest(request: NextRequest) {
    try {
        // Get the dashboard type from query params (defaults to "all")
        const url = new URL(request.url);
        const dashboardType = url.searchParams.get('type') || 'all';

        // Get requested datasets based on dashboard type
        let datasetIds: number[] = [];

        switch (dashboardType) {
            case 'consumption':
                datasetIds = [193]; // Just consumption
                break;
            case 'production':
                datasetIds = [192]; // Just production
                break;
            case 'emissions':
                datasetIds = [265]; // Just CO2
                break;
            case 'prices':
                datasetIds = [244]; // Just regulation price
                break;
            case 'all':
            default:
                datasetIds = [193, 192, 265, 244]; // All datasets
                break;
        }

        // Cache durations for different datasets
        const cacheDurations: Record<number, number> = {
            193: 300,  // Consumption: 5 minutes
            192: 300,  // Production: 5 minutes
            265: 900,  // CO2: 15 minutes
            244: 1800, // Price: 30 minutes
        };

        // Create a cache key for this combined request
        const cacheKey = `dashboard_${dashboardType}_${datasetIds.join('_')}`;

        // Check if we have a cached response for the entire dashboard
        const cachedDashboard = getCachedResponse(cacheKey, 120); // 2 minute cache for combined dashboard
        if (cachedDashboard) {
            console.log(`[API] Cache hit for dashboard ${dashboardType} (age: ${cachedDashboard.age.toFixed(1)}s)`);
            return NextResponse.json(cachedDashboard.data, {
                headers: {
                    ...commonHeaders,
                    'Cache-Control': 'public, max-age=60',
                    'X-Cache-Hit': 'true',
                    'X-Cache-Age': cachedDashboard.age.toFixed(1),
                }
            });
        }

        // Get API key with error handling
        const apiKey = process.env.FINGRID_API_KEY || '';
        if (!apiKey) {
            console.error("Fingrid API key is missing");
            return NextResponse.json(
                { error: 'API key is not configured' },
                { status: 500, headers: commonHeaders }
            );
        }

        // Initialize result object with dataset info
        const result: Record<number, any> = {};

        // Track errors
        const errors: Record<string, string> = {};

        // Process datasets one by one with delay between requests
        for (const datasetId of datasetIds) {
            // Check if we have a specific dataset in cache
            const datasetCacheKey = `dataset_${datasetId}_latest`;
            const cachedDataset = getCachedResponse(datasetCacheKey, cacheDurations[datasetId] || 300);

            if (cachedDataset) {
                console.log(`[API] Cache hit for dataset ${datasetId} (age: ${cachedDataset.age.toFixed(1)}s)`);
                result[datasetId] = cachedDataset.data;
                continue;
            }

            // Check if we can make a request (rate limit)
            if (!canMakeRequest()) {
                console.log(`[API] Rate limit reached, skipping request for dataset ${datasetId}`);
                errors[datasetId.toString()] = 'Rate limit reached, skipping request';
                continue;
            }

            try {
                // Record the request to track rate limits
                recordRequest();

                // Build Fingrid API URL
                const fingridUrl = `https://data.fingrid.fi/api/datasets/${datasetId}/data/latest`;
                console.log(`[API] Making request to Fingrid: ${fingridUrl}`);

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
                    console.error(`Fingrid API error (${fingridResponse.status}) for dataset ${datasetId}:`, errorText);

                    errors[datasetId.toString()] = `HTTP ${fingridResponse.status}: ${errorText}`;

                    // Handle rate limiting specifically
                    if (fingridResponse.status === 429) {
                        // Wait before next request
                        const waitTime = 3000; // 3 seconds
                        console.log(`[API] Rate limited, waiting ${waitTime}ms before next request`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }

                    continue;
                }

                // Parse response data
                const responseText = await fingridResponse.text();
                let data;

                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error(`Failed to parse Fingrid response as JSON for dataset ${datasetId}`);
                    errors[datasetId.toString()] = 'Invalid JSON response';
                    continue;
                }

                // Store in dataset-specific cache
                cache[datasetCacheKey] = {
                    data,
                    timestamp: Date.now()
                };

                // Add to result
                result[datasetId] = data;

                // Add a small delay between requests to avoid triggering rate limits
                if (datasetIds.indexOf(datasetId) < datasetIds.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                console.error(`Error fetching dataset ${datasetId}:`, error);
                errors[datasetId.toString()] = error instanceof Error ? error.message : 'Unknown error';
            }
        }

        // Prepare the final response with all datasets and errors
        const dashboardData = {
            datasets: result,
            errors: Object.keys(errors).length > 0 ? errors : null,
            timestamp: new Date().toISOString(),
            cacheInfo: {
                dashboardType,
                requestedDatasets: datasetIds,
                cachedDatasets: Object.keys(result).map(Number)
            }
        };

        // Cache the entire dashboard result
        cache[cacheKey] = {
            data: dashboardData,
            timestamp: Date.now()
        };

        // Return successful response
        return NextResponse.json(dashboardData, {
            headers: {
                ...commonHeaders,
                'Cache-Control': 'public, max-age=60',
                'X-Cache-Hit': 'false'
            }
        });

    } catch (error) {
        console.error('Error in dashboard API route:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500, headers: commonHeaders }
        );
    }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, { headers: commonHeaders });
}