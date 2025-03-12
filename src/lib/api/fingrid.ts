import { FINGRID_DATASETS, FingridResponse, TimeWindow } from '@/lib/constants/datasets';

/**
 * Generate ISO format date strings for API queries
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
 * Fetch data from Fingrid avoindata-api
 * @param datasetId - The ID of the dataset to fetch
 * @param timeWindow - The time window to fetch data for
 * @returns Promise with the Fingrid API response
 */
export const fetchFingridData = async (
    datasetId: number,
    timeWindow: TimeWindow = TimeWindow.DAY
): Promise<FingridResponse> => {
    const apiKey = process.env.FINGRID_API_KEY;

    if (!apiKey) {
        throw new Error('Fingrid API key is not defined in environment variables');
    }

    const { startTime, endTime } = getTimeRange(timeWindow);

    try {
        // Käytämme Next.js API-reittiä CORS-ongelmien välttämiseksi
        const response = await fetch(
            `/api/fingrid/variable/${datasetId}?start_time=${startTime}&end_time=${endTime}`,
            {
                headers: {
                    'x-api-key': apiKey,
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Fingrid API error: ${response.status} ${response.statusText}`);
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
 */
export const fetchConsumption = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.CONSUMPTION.id, timeWindow);
};

/**
 * Helper function to fetch electricity production data
 */
export const fetchProduction = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.PRODUCTION.id, timeWindow);
};

/**
 * Helper function to fetch regulation price data
 */
export const fetchUpRegulationPrice = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.UP_REGULATION_PRICE.id, timeWindow);
};

/**
 * Helper function to fetch CO2 emission data for consumption
 */
export const fetchCO2EmissionsConsumption = (timeWindow: TimeWindow = TimeWindow.DAY) => {
    return fetchFingridData(FINGRID_DATASETS.CO2_EMISSIONS_CONSUMPTION.id, timeWindow);
};

/**
 * Helper function to fetch data for production mix
 * Returns a combined dataset with production by source
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

        // This is just the raw data - in a real application, you'd want to process
        // this data to align timestamps and create a unified dataset
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