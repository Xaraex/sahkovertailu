'use client';

import { useState, useEffect } from 'react';
import { TimeWindow, FingridDataPoint } from '@/lib/constants/datasets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils/date';
import { formatPricePerKwh } from '@/lib/utils/price';
import { Zap, Activity, AlertCircle, RefreshCw, Wind, Cpu, Info, Clock } from 'lucide-react';

// Cache data in memory
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export default function ApiTest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{
        consumption: FingridDataPoint[] | null,
        production: FingridDataPoint[] | null,
        co2Emissions: FingridDataPoint[] | null,
        regulationPrice: FingridDataPoint[] | null
    }>({
        consumption: null,
        production: null,
        co2Emissions: null,
        regulationPrice: null
    });
    const [timeWindow, setTimeWindow] = useState<TimeWindow>(TimeWindow.DAY);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [rateInfo, setRateInfo] = useState<string | null>(null);

    // Fetch all data in a single API call
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        setRateInfo(null);

        // Create a cache key based on the time window
        const cacheKey = `all-data-${timeWindow}`;

        // Check if we have cached data
        if (cache[cacheKey]) {
            const now = Date.now();
            if (now - cache[cacheKey].timestamp < CACHE_DURATION) {
                // Use cached data if it's still valid
                console.log('Using cached data');
                setData(cache[cacheKey].data);
                setLastUpdated(new Date(cache[cacheKey].timestamp));
                setLoading(false);
                return;
            }
        }

        try {
            // Get time range parameters
            const now = new Date();
            let startDate = new Date(now);

            switch (timeWindow) {
                case TimeWindow.DAY:
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case TimeWindow.WEEK:
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case TimeWindow.MONTH:
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                default:
                    startDate.setDate(startDate.getDate() - 1);
            }

            const startTime = encodeURIComponent(startDate.toISOString());
            const endTime = encodeURIComponent(now.toISOString());

            // Define dataset IDs
            const datasets = [
                { id: 193, key: 'consumption' },    // Consumption
                { id: 192, key: 'production' },     // Production
                { id: 265, key: 'co2Emissions' },   // CO2
                { id: 244, key: 'regulationPrice' } // Price
            ];

            // Prepare data structure matching our state type
            const newData = {
                consumption: null as FingridDataPoint[] | null,
                production: null as FingridDataPoint[] | null,
                co2Emissions: null as FingridDataPoint[] | null,
                regulationPrice: null as FingridDataPoint[] | null
            };

            let hasData = false;
            let hasError = false;

            // Process each dataset one by one to avoid rate limits
            for (const dataset of datasets) {
                try {
                    const latestUrl = `/api/fingrid/datasets/${dataset.id}/data/latest`;
                    console.log(`Fetching ${dataset.key} data from: ${latestUrl}`);

                    const response = await fetch(latestUrl);

                    if (!response.ok) {
                        console.error(`Error fetching ${dataset.key} data: ${response.status}`);
                        if (response.status === 429) {
                            setRateInfo('Rate limit exceeded. Using cached data if available.');
                            hasError = true;
                            break;
                        }
                        continue;
                    }

                    const latestData = await response.json();

                    // Convert to FingridDataPoint format and update specific data property
                    newData[dataset.key as keyof typeof newData] = [{
                        value: latestData.value,
                        start_time: latestData.startTime,
                        end_time: latestData.endTime
                    }];

                    hasData = true;
                } catch (err) {
                    console.error(`Error fetching ${dataset.key}:`, err);
                }

                // Wait a bit between requests to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            if (!hasData && hasError) {
                // If we have a cache entry, use it instead
                if (cache[cacheKey]) {
                    setData(cache[cacheKey].data);
                    setLastUpdated(new Date(cache[cacheKey].timestamp));
                    setRateInfo('Using cached data due to rate limits.');
                } else {
                    setError('No data could be fetched and no cached data available.');
                }
            } else if (hasData) {
                // Update state and cache the new data
                setData(newData);

                // Cache the results
                cache[cacheKey] = {
                    data: newData,
                    timestamp: Date.now()
                };

                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error('Error in fetchData:', err);
            setError(err instanceof Error ? err.message : 'Tuntematon virhe tapahtui');

            // Try to use cached data if available
            if (cache[cacheKey]) {
                setData(cache[cacheKey].data);
                setLastUpdated(new Date(cache[cacheKey].timestamp));
                setRateInfo('Using cached data due to error.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount and when time window changes
    useEffect(() => {
        fetchData();
    }, [timeWindow]);

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Fingrid API-tiedot</CardTitle>
                        <CardDescription>
                            Sähködata Fingrid API:sta
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-1"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Ladataan...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4" />
                                Päivitä
                            </>
                        )}
                    </Button>
                </div>

                {lastUpdated && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Päivitetty: {lastUpdated.toLocaleTimeString('fi-FI')}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {/* Rate Limit Warning */}
                {rateInfo && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mb-4 flex items-start">
                        <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-amber-800 dark:text-amber-300">{rateInfo}</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                Fingrid API-avaimesi sallii 10 pyyntöä minuutissa. Tietoja päivitetään harkitusti.
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="text-destructive p-6 rounded-md bg-destructive/10 border border-destructive/20 flex items-start mb-4">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium">Virhe tietojen haussa</h3>
                            <p className="text-sm mt-1">{error}</p>
                            <p className="text-sm mt-2 text-muted-foreground">
                                Tarkista, että API-avain on asetettu oikein .env.local-tiedostossa
                            </p>
                        </div>
                    </div>
                )}

                <Tabs defaultValue={timeWindow} onValueChange={(value) => setTimeWindow(value as TimeWindow)}>
                    <TabsList className="w-full grid grid-cols-3 mb-4">
                        <TabsTrigger value={TimeWindow.DAY}>Päivä</TabsTrigger>
                        <TabsTrigger value={TimeWindow.WEEK}>Viikko</TabsTrigger>
                        <TabsTrigger value={TimeWindow.MONTH}>Kuukausi</TabsTrigger>
                    </TabsList>

                    <div className="mt-4">
                        {loading ? (
                            <div className="text-center p-8 space-y-2">
                                <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-muted-foreground">Ladataan tietoja Fingrid API:sta...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Consumption */}
                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">Sähkön kulutus</h3>
                                    </div>
                                    {data.consumption && data.consumption.length > 0 ? (
                                        <div>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin kulutus:
                                                    <span className="ml-2 text-energy-blue-600 dark:text-energy-blue-400 font-bold">
                                                        {data.consumption[0].value.toLocaleString('fi-FI')} MW
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(data.consumption[0].start_time)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Ei dataa saatavilla</p>
                                    )}
                                </div>

                                {/* Production */}
                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Cpu className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">Sähkön tuotanto</h3>
                                    </div>
                                    {data.production && data.production.length > 0 ? (
                                        <div>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin tuotanto:
                                                    <span className="ml-2 text-energy-green-600 dark:text-energy-green-400 font-bold">
                                                        {data.production[0].value.toLocaleString('fi-FI')} MW
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(data.production[0].start_time)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Ei dataa saatavilla</p>
                                    )}
                                </div>

                                {/* CO2 Emissions */}
                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Wind className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">CO2-päästökerroin</h3>
                                    </div>
                                    {data.co2Emissions && data.co2Emissions.length > 0 ? (
                                        <div>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin arvo:
                                                    <span className="ml-2 text-energy-green-600 dark:text-energy-green-400 font-bold">
                                                        {data.co2Emissions[0].value.toLocaleString('fi-FI')} gCO2/kWh
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(data.co2Emissions[0].start_time)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Ei dataa saatavilla</p>
                                    )}
                                </div>

                                {/* Regulation Price */}
                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">Säätösähkön ylössäätöhinta</h3>
                                    </div>
                                    {data.regulationPrice && data.regulationPrice.length > 0 ? (
                                        <div>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin hinta:
                                                    <span className="ml-2 text-energy-blue-600 dark:text-energy-blue-400 font-bold">
                                                        {formatPricePerKwh(data.regulationPrice[0].value)}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(data.regulationPrice[0].start_time)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Ei dataa saatavilla</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}