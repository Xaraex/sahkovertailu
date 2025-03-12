'use client';

import { useState, useEffect } from 'react';
import { fetchConsumption, fetchProduction, fetchCO2EmissionsConsumption, fetchUpRegulationPrice } from '@/lib/api/fingrid';
import { TimeWindow, FingridDataPoint } from '@/lib/constants/datasets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils/date';
import { calculateAveragePrice, formatPrice, formatPricePerKwh } from '@/lib/utils/price';
import { Zap, Activity, AlertCircle, RefreshCw, Wind, Cpu } from 'lucide-react';

export default function ApiTest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [consumption, setConsumption] = useState<FingridDataPoint[]>([]);
    const [production, setProduction] = useState<FingridDataPoint[]>([]);
    const [co2Emissions, setCo2Emissions] = useState<FingridDataPoint[]>([]);
    const [regulationPrice, setRegulationPrice] = useState<FingridDataPoint[]>([]);
    const [timeWindow, setTimeWindow] = useState<TimeWindow>(TimeWindow.DAY);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch consumption data
            const consumptionData = await fetchConsumption(timeWindow);
            setConsumption(consumptionData.data);

            // Fetch production data
            const productionData = await fetchProduction(timeWindow);
            setProduction(productionData.data);

            // Fetch CO2 emissions data
            const co2Data = await fetchCO2EmissionsConsumption(timeWindow);
            setCo2Emissions(co2Data.data);

            // Fetch regulation price data
            const priceData = await fetchUpRegulationPrice(timeWindow);
            setRegulationPrice(priceData.data);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'Tuntematon virhe tapahtui');
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

    const averagePrice = calculateAveragePrice(regulationPrice);

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Fingrid API-tiedot</CardTitle>
                        <CardDescription>
                            Reaaliaikainen sähködata Fingrid API:sta
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-1"
                    >
                        <RefreshCw className="h-4 w-4" />
                        {loading ? 'Ladataan...' : 'Päivitä'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
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
                        ) : error ? (
                            <div className="text-destructive p-6 rounded-md bg-destructive/10 border border-destructive/20 flex items-start">
                                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium">Virhe tietojen haussa</h3>
                                    <p className="text-sm mt-1">{error}</p>
                                    <p className="text-sm mt-2 text-muted-foreground">
                                        Tarkista, että API-avain on asetettu oikein .env.local-tiedostossa
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">Sähkön kulutus</h3>
                                    </div>
                                    {consumption.length > 0 ? (
                                        <div>
                                            <p className="text-sm mb-1 text-muted-foreground">Datapisteiden määrä: {consumption.length}</p>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin kulutus:
                                                    <span className="ml-2 text-energy-blue-600 dark:text-energy-blue-400 font-bold">
                                                        {consumption[consumption.length - 1].value.toLocaleString('fi-FI')} MW
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(consumption[consumption.length - 1].start_time)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Ei dataa saatavilla</p>
                                    )}
                                </div>

                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Cpu className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">Sähkön tuotanto</h3>
                                    </div>
                                    {production.length > 0 ? (
                                        <div>
                                            <p className="text-sm mb-1 text-muted-foreground">Datapisteiden määrä: {production.length}</p>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin tuotanto:
                                                    <span className="ml-2 text-energy-green-600 dark:text-energy-green-400 font-bold">
                                                        {production[production.length - 1].value.toLocaleString('fi-FI')} MW
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(production[production.length - 1].start_time)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Ei dataa saatavilla</p>
                                    )}
                                </div>

                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Wind className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">CO2-päästökerroin</h3>
                                    </div>
                                    {co2Emissions.length > 0 ? (
                                        <div>
                                            <p className="text-sm mb-1 text-muted-foreground">Datapisteiden määrä: {co2Emissions.length}</p>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin arvo:
                                                    <span className="ml-2 text-energy-green-600 dark:text-energy-green-400 font-bold">
                                                        {co2Emissions[co2Emissions.length - 1].value.toLocaleString('fi-FI')} gCO2/kWh
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(co2Emissions[co2Emissions.length - 1].start_time)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Ei dataa saatavilla</p>
                                    )}
                                </div>

                                <div className="bg-card rounded-lg border p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">Säätösähkön ylössäätöhinta</h3>
                                    </div>
                                    {regulationPrice.length > 0 ? (
                                        <div>
                                            <p className="text-sm mb-1 text-muted-foreground">Datapisteiden määrä: {regulationPrice.length}</p>
                                            <div className="mt-3 space-y-1">
                                                <p className="font-medium">Viimeisin hinta:
                                                    <span className="ml-2 text-energy-blue-600 dark:text-energy-blue-400 font-bold">
                                                        {formatPricePerKwh(regulationPrice[regulationPrice.length - 1].value)}
                                                    </span>
                                                </p>
                                                <p className="font-medium">Keskihinta:
                                                    <span className="ml-2 text-energy-blue-600 dark:text-energy-blue-400 font-bold">
                                                        {formatPricePerKwh(averagePrice)}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(regulationPrice[regulationPrice.length - 1].start_time)}
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