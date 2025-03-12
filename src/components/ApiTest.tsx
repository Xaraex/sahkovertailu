'use client';

import { useState, useEffect } from 'react';
import { TimeWindow, FingridDataPoint } from '@/lib/constants/datasets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils/date';
import { formatPricePerKwh } from '@/lib/utils/price';
import { Zap, Activity, AlertCircle, RefreshCw, Wind, Cpu, Info, Clock } from 'lucide-react';

// Käytetään local storagea cachen tukena
const CACHE_KEY_PREFIX = 'fingrid_dashboard_';

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
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Fetch all data through the dashboard endpoint
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        setStatusMessage('Haetaan dataa...');

        try {
            const cacheKey = `${CACHE_KEY_PREFIX}${timeWindow}`;

            // Check browser's localStorage cache first
            try {
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    const { data: storedData, timestamp } = JSON.parse(cachedData);
                    const cacheAge = Date.now() - timestamp;

                    // Use cache if less than 2 minutes old
                    if (cacheAge < 2 * 60 * 1000) {
                        console.log('Using cached data from localStorage');

                        // Apply cached data immediately while fetching fresh data
                        processDataFromApi(storedData);
                        setLastUpdated(new Date(timestamp));
                        setStatusMessage('Näytetään välimuistissa oleva data...');
                    }
                }
            } catch (e) {
                console.warn('Error reading from localStorage cache', e);
            }

            // Fetch from the dashboard API (which combines multiple datasets)
            const response = await fetch('/api/fingrid/dashboard?type=all');

            if (!response.ok) {
                if (response.status === 429) {
                    setStatusMessage('API rate limit ylitetty. Kokeile myöhemmin uudelleen.');
                    throw new Error('API rate limit exceeded');
                }
                throw new Error(`HTTP error ${response.status}`);
            }

            const dashboardData = await response.json();

            // Save to localStorage cache
            try {
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: dashboardData,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.warn('Error writing to localStorage cache', e);
            }

            // Process the dashboard data
            processDataFromApi(dashboardData);

            // Show errors from the API if any
            if (dashboardData.errors) {
                const errorCount = Object.keys(dashboardData.errors).length;
                if (errorCount > 0) {
                    setStatusMessage(`${errorCount} datasettiä ei voitu hakea. Jotkin tiedot puuttuvat.`);
                } else {
                    setStatusMessage(null);
                }
            } else {
                setStatusMessage(null);
            }

            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'Tuntematon virhe tapahtui');
        } finally {
            setLoading(false);
        }
    };

    // Process received data from the API
    const processDataFromApi = (apiData: any) => {
        // Create map for dataset IDs to our state properties
        const datasetIdMap: { [key: number]: keyof typeof data } = {
            193: 'consumption',
            192: 'production',
            265: 'co2Emissions',
            244: 'regulationPrice'
        };

        // Create new data object
        const newData = { ...data };

        // Process each dataset we received
        Object.entries(apiData.datasets).forEach(([datasetId, dataValue]) => {
            const id = Number(datasetId);
            const dataKey = datasetIdMap[id];

            if (dataKey) {
                // Convert API format to our FingridDataPoint format
                newData[dataKey] = [{
                    value: (dataValue as any).value,
                    start_time: (dataValue as any).startTime,
                    end_time: (dataValue as any).endTime
                }];
            }
        });

        // Update state with new data
        setData(newData);
    };

    // Fetch data on mount and when time window changes
    useEffect(() => {
        fetchData();

        // Auto-refresh every 5 minutes
        const interval = setInterval(() => {
            fetchData();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
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
                {/* Status Message */}
                {statusMessage && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4 flex items-start">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">{statusMessage}</p>
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
                        {loading && !data.consumption && !data.production ? (
                            <div className="text-center p-8 space-y-2">
                                <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-muted-foreground">Ladataan tietoja Fingrid API:sta...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Consumption */}
                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Zap className="h-5 w-5 text-primary" />
                                            <h3 className="font-medium">Sähkön kulutus</h3>
                                        </div>
                                        {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Cpu className="h-5 w-5 text-primary" />
                                            <h3 className="font-medium">Sähkön tuotanto</h3>
                                        </div>
                                        {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Wind className="h-5 w-5 text-primary" />
                                            <h3 className="font-medium">CO2-päästökerroin</h3>
                                        </div>
                                        {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Activity className="h-5 w-5 text-primary" />
                                            <h3 className="font-medium">Säätösähkön ylössäätöhinta</h3>
                                        </div>
                                        {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
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