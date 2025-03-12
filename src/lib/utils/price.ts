import { FingridDataPoint } from '@/lib/constants/datasets';

/**
 * Calculate the cost of electricity based on consumption and price
 * @param consumption Consumption in kWh
 * @param price Price in €/MWh
 * @returns Cost in euros
 */
export function calculateCost(consumption: number, price: number): number {
    // Convert price from €/MWh to €/kWh (divide by 1000)
    const pricePerKwh = price / 1000;

    return consumption * pricePerKwh;
}

/**
 * Calculate average price from a series of price data points
 * @param priceData Array of price data points
 * @returns Average price in €/MWh
 */
export function calculateAveragePrice(priceData: FingridDataPoint[]): number {
    if (priceData.length === 0) return 0;

    const sum = priceData.reduce((total, point) => total + point.value, 0);
    return sum / priceData.length;
}

/**
 * Calculate minimum price from a series of price data points
 * @param priceData Array of price data points
 * @returns Minimum price in €/MWh
 */
export function calculateMinPrice(priceData: FingridDataPoint[]): number {
    if (priceData.length === 0) return 0;

    return Math.min(...priceData.map(point => point.value));
}

/**
 * Calculate maximum price from a series of price data points
 * @param priceData Array of price data points
 * @returns Maximum price in €/MWh
 */
export function calculateMaxPrice(priceData: FingridDataPoint[]): number {
    if (priceData.length === 0) return 0;

    return Math.max(...priceData.map(point => point.value));
}

/**
 * Calculate cost comparison between regulation price and fixed price
 * @param consumption Consumption data in kWh
 * @param priceData Price data in €/MWh
 * @param fixedPrice Fixed price in €c/kWh
 * @returns Object with cost comparison data
 */
export function calculateCostComparison(
    consumption: number[],
    priceData: FingridDataPoint[],
    fixedPrice: number
): {
    variableCost: number;
    fixedCost: number;
    difference: number;
    percentageDifference: number;
} {
    // Ensure we have matching data points
    const dataPoints = Math.min(consumption.length, priceData.length);

    // Calculate total consumption
    const totalConsumption = consumption.slice(0, dataPoints).reduce((sum, value) => sum + value, 0);

    // Calculate cost with variable price
    let variableCost = 0;
    for (let i = 0; i < dataPoints; i++) {
        variableCost += calculateCost(consumption[i], priceData[i].value);
    }

    // Calculate cost with fixed price (convert from €c/kWh to €/kWh)
    const fixedPriceEurPerKwh = fixedPrice / 100;
    const fixedCost = totalConsumption * fixedPriceEurPerKwh;

    // Calculate difference (positive means variable price is cheaper)
    const difference = fixedCost - variableCost;

    // Calculate percentage difference
    const percentageDifference = fixedCost !== 0 ? (difference / fixedCost) * 100 : 0;

    return {
        variableCost,
        fixedCost,
        difference,
        percentageDifference
    };
}

/**
 * Format price as currency
 * @param price Price in euros
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
    return price.toLocaleString('fi-FI', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Format price per kWh
 * @param price Price in €/MWh
 * @returns Formatted price string in €c/kWh
 */
export function formatPricePerKwh(price: number): string {
    // Convert from €/MWh to €c/kWh
    const priceInCentsPerKwh = price / 10;

    return `${priceInCentsPerKwh.toFixed(2)} snt/kWh`;
}