import { FINGRID_DATASETS, FingridResponse, TimeWindow, FingridDataPoint } from '@/lib/constants/datasets';

// In-memory cache for API responses
const apiCache: { [key: string]: { data: any, timestamp: number } } = {};

// Rate limiting settings
const MAX_REQUESTS_PER_MINUTE = 9; // Keep slightly under the limit of 10
const requestTimestamps: number[] = [];

/**
 * Check if rate limit allows a new request
 * @returns True if within rate limit, false if exceeded
 */
const checkRateLimit = (): boolean => {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    // Remove timestamps older than 1 minute
    while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
        requestTimestamps.shift();
    }

    // Check if we've made too many requests in the last minute
    return requestTimestamps.length < MAX_REQUESTS_PER_MINUTE;
};

/**
 * Record a new API request timestamp for rate limiting
 */
const recordRequest = (): void => {
    requestTimestamps.push(Date.now());
};

/**
 * Make a rate-limited and cached request to the Fingrid API
 * @param url - API endpoint URL
 * @param cacheDuration - Cache duration in seconds (0 to disable caching)
 * @returns Promise with the API response
 */
const makeRequest = async <T>(url: string, cacheDuration: number = 60): Promise<T> => {
    // Check cache first if caching is enabled
    if (cacheDuration > 0 && apiCache[url]) {
        const cacheEntry = apiCache[url];
        const cacheAge = (Date.now() - cacheEntry.timestamp) / 1000;

        if (cacheAge < cacheDuration) {
            console.log(`Using cached response for ${url} (age: ${cacheAge.toFixed(1)}s)`);
            return cacheEntry.data as T;
        }
    }

    // Check rate limit
    if (!checkRateLimit()) {
        // Calculate wait time (with some randomness to avoid request bunching)
        const waitTime = 2000 + Math.random() * 1000;
        console.log(`Rate limit exceeded, waiting ${waitTime.toFixed(0)}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return makeRequest(url, cacheDuration);
    }

    // Record this request for rate limiting
    recordRequest();

    // Make the request
    const response = await fetch(url, {
        cache: 'no-store',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    });

    // Handle 429 rate limit errors with retries
    if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '2', 10);
        console.log(`Rate limited (429), retrying after ${retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return makeRequest(url, cacheDuration);
    }

    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${responseText.substring(0, 100)}`);
    }

    const data = await response.json();

    // Cache the response if caching is enabled
    if (cacheDuration > 0) {
        apiCache[url] = { data, timestamp: Date.now() };
    }

    return data as T;
};

/**
 * Generate ISO format date strings for API queries
 * @param window - Time window for the query
 * @returns Object with startTime and endTime as ISO strings
 */
export const getTimeRange = (window: TimeWindow): { startTime: string, endTime: string } => {
    const now = new Date();
    const endTime = now.toISOString();
    let startTime: string;

    switch (window) {
        case TimeWindow.DAY:
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            startTime = yesterday.toISOString();
            break;
        case TimeWindow.WEEK:
            const lastWeek = new Date(now);
            lastWeek.setDate(lastWeek.getDate() - 7);
            startTime = lastWeek.toISOString();
            break;
        case TimeWindow.MONTH:
            const lastMonth = new Date(now);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            startTime = lastMonth.toISOString();
            break;
        case TimeWindow.YEAR:
            const lastYear = new Date(now);
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            startTime = lastYear.toISOString();
            break;
        default:
            // Default to 24 hours
            const oneDayAgo = new Date(now);
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            startTime = oneDayAgo.toISOString();
    }

    return { startTime, endTime };
};

// Define the type for latest data
interface LatestDataResponse {
    datasetId: number;
    startTime: string;
    endTime: string;
    value: number;
}

/**
 * Fetch latest data for a Fingrid dataset, with caching (5 minutes)
 * @param datasetId - ID of the dataset to fetch
 * @returns Promise with the latest data for the dataset
 */
export const fetchLatestData = async (datasetId: number): Promise<FingridResponse> => {
    try {
        console.log(`Fetching latest data for dataset ${datasetId}`);

        // Using the GetLastDataByDataset endpoint
        const url = `/api/fingrid/datasets/${datasetId}/data/latest`;

        // Cache latest data for 5 minutes (300 seconds)
        const latestData = await makeRequest<LatestDataResponse>(url, 300);

        // Convert to FingridDataPoint format
        const dataPoint: FingridDataPoint = {
            value: latestData.value,
            start_time: latestData.startTime,
            end_time: latestData.endTime
        };

        return { data: [dataPoint] };
    } catch (error) {
        console.error(`Error fetching latest data for dataset ${datasetId}:`, error);
        throw error;
    }
};

/**
 * Fetch historical data for a Fingrid dataset within a time window, with caching
 * @param datasetId - ID of the dataset to fetch
 * @param timeWindow - Time window for the query
 * @returns Promise with the historical data for the dataset
 */
export const fetchHistoricalData = async (
    datasetId: number,
    timeWindow: TimeWindow = TimeWindow.DAY
): Promise<FingridResponse> => {
    const { startTime, endTime } = getTimeRange(timeWindow);

    try {
        console.log(`Fetching historical data for dataset ${datasetId} from ${startTime} to ${endTime}`);

        // Using the GetDatasetData endpoint
        const url = `/api/fingrid/datasets/${datasetId}/data?start_time=${startTime}&end_time=${endTime}`;

        // Cache durations based on time window
        const cacheDurations = {
            [TimeWindow.DAY]: 300,     // 5 minutes for daily data
            [TimeWindow.WEEK]: 1800,   // 30 minutes for weekly data
            [TimeWindow.MONTH]: 3600,  // 1 hour for monthly data
            [TimeWindow.YEAR]: 7200    // 2 hours for yearly data
        };

        const data = await makeRequest<FingridDataPoint[]>(url, cacheDurations[timeWindow] || 300);
        return { data };
    } catch (error) {
        console.error(`Error fetching historical data for dataset ${datasetId}:`, error);
        throw error;
    }
};

// Helper functions for specific datasets

/**
 * Fetch latest electricity consumption data
 * @returns Promise with the latest consumption data
 */
export const fetchLatestConsumption = () => {
    return fetchLatestData(FINGRID_DATASETS.CONSUMPTION.id);
};

/**
 * Fetch historical electricity consumption data
 * @param timeWindow - Time window for the query
 * @returns Promise with the historical consumption data
 */
export const fetchConsumption = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchHistoricalData(FINGRID_DATASETS.CONSUMPTION.id, timeWindow);
};

/**
 * Fetch latest electricity production data
 * @returns Promise with the latest production data
 */
export const fetchLatestProduction = () => {
    return fetchLatestData(FINGRID_DATASETS.PRODUCTION.id);
};

/**
 * Fetch historical electricity production data
 * @param timeWindow - Time window for the query
 * @returns Promise with the historical production data
 */
export const fetchProduction = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchHistoricalData(FINGRID_DATASETS.PRODUCTION.id, timeWindow);
};

/**
 * Fetch latest up-regulation price data
 * @returns Promise with the latest price data
 */
export const fetchLatestUpRegulationPrice = () => {
    return fetchLatestData(FINGRID_DATASETS.UP_REGULATION_PRICE.id);
};

/**
 * Fetch historical up-regulation price data
 * @param timeWindow - Time window for the query
 * @returns Promise with the historical price data
 */
export const fetchUpRegulationPrice = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchHistoricalData(FINGRID_DATASETS.UP_REGULATION_PRICE.id, timeWindow);
};

/**
 * Fetch latest CO2 emissions data for consumption
 * @returns Promise with the latest emissions data
 */
export const fetchLatestCO2EmissionsConsumption = () => {
    return fetchLatestData(FINGRID_DATASETS.CO2_EMISSIONS_CONSUMPTION.id);
};

/**
 * Fetch historical CO2 emissions data for consumption
 * @param timeWindow - Time window for the query
 * @returns Promise with the historical emissions data
 */
export const fetchCO2EmissionsConsumption = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchHistoricalData(FINGRID_DATASETS.CO2_EMISSIONS_CONSUMPTION.id, timeWindow);
};

/**
 * Fetch production mix data (multiple datasets) with smart batching to avoid rate limits
 * @param timeWindow - Time window for the query
 * @returns Promise with combined production mix data
 */
export const fetchProductionMix = async (timeWindow: TimeWindow = TimeWindow.DAY) => {
    try {
        // First check if we're about to exceed rate limit
        if (requestTimestamps.length > MAX_REQUESTS_PER_MINUTE - 5) {
            // Wait a bit if we're close to the limit
            console.log('Approaching rate limit, spacing out production mix requests...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Fetch datasets sequentially instead of in parallel to avoid rate limits
        const nuclear = await fetchHistoricalData(FINGRID_DATASETS.NUCLEAR.id, timeWindow);
        const hydro = await fetchHistoricalData(FINGRID_DATASETS.HYDRO.id, timeWindow);
        const wind = await fetchHistoricalData(FINGRID_DATASETS.WIND.id, timeWindow);
        const industrialCHP = await fetchHistoricalData(FINGRID_DATASETS.INDUSTRIAL_CHP.id, timeWindow);
        const districtHeatingCHP = await fetchHistoricalData(FINGRID_DATASETS.DISTRICT_HEATING_CHP.id, timeWindow);

        return {
            nuclear: nuclear.data,
            hydro: hydro.data,
            wind: wind.data,
            industrialCHP: industrialCHP.data,
            districtHeatingCHP: districtHeatingCHP.data,
        };
    } catch (error) {
        console.error('Error fetching production mix data:', error);
        throw error;
    }
};