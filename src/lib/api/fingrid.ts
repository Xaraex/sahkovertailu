import { FINGRID_DATASETS, FingridResponse, TimeWindow } from '@/lib/constants/datasets';

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

/**
 * Fetch data from Fingrid API via our Next.js API route
 * @param datasetId - The ID of the dataset to fetch
 * @param timeWindow - The time window to fetch data for
 * @returns Promise with the Fingrid API response
 */
export const fetchFingridData = async (
    datasetId: number,
    timeWindow: TimeWindow = TimeWindow.DAY
): Promise<FingridResponse> => {
    const { startTime, endTime } = getTimeRange(timeWindow);

    try {
        // Use Next.js API route which handles the API key on the server side
        const response = await fetch(
            `/api/fingrid/variable/${datasetId}?start_time=${startTime}&end_time=${endTime}`
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || `HTTP error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data: FingridResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data from Fingrid API:', error);
        throw error;
    }
};

/**
 * Helper function to fetch electricity consumption data
 * @param timeWindow - Time window for the query
 * @returns Promise with consumption data
 */
export const fetchConsumption = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.CONSUMPTION.id, timeWindow);
};

/**
 * Helper function to fetch electricity production data
 * @param timeWindow - Time window for the query
 * @returns Promise with production data
 */
export const fetchProduction = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.PRODUCTION.id, timeWindow);
};

/**
 * Helper function to fetch regulation price data
 * @param timeWindow - Time window for the query
 * @returns Promise with regulation price data
 */
export const fetchUpRegulationPrice = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.UP_REGULATION_PRICE.id, timeWindow);
};

/**
 * Helper function to fetch CO2 emission data for consumption
 * @param timeWindow - Time window for the query
 * @returns Promise with CO2 emissions data
 */
export const fetchCO2EmissionsConsumption = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.CO2_EMISSIONS_CONSUMPTION.id, timeWindow);
};

/**
 * Helper function to fetch data for production mix
 * @param timeWindow - Time window for the query
 * @returns Combined dataset with production by source
 */
export const fetchProductionMix = async (timeWindow: TimeWindow = TimeWindow.DAY) => {
    try {
        const [nuclear, hydro, wind, industrialCHP, districtHeatingCHP] = await Promise.all([
            fetchFingridData(FINGRID_DATASETS.NUCLEAR.id, timeWindow),
            fetchFingridData(FINGRID_DATASETS.HYDRO.id, timeWindow),
            fetchFingridData(FINGRID_DATASETS.WIND.id, timeWindow),
            fetchFingridData(FINGRID_DATASETS.INDUSTRIAL_CHP.id, timeWindow),
            fetchFingridData(FINGRID_DATASETS.DISTRICT_HEATING_CHP.id, timeWindow),
        ]);

        // Return combined data from different sources
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