'use client';

import { useState, useEffect } from 'react';
import { fetchConsumption, fetchProduction, fetchCO2EmissionsConsumption, fetchUpRegulationPrice } from '@/lib/api/fingrid';
import { TimeWindow, FingridDataPoint } from '@/lib/constants/datasets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils/date';
import { calculateAveragePrice, formatPrice, formatPricePerKwh } from '@/lib/utils/price';

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
                <CardTitle>Fingrid API-testi</CardTitle>
                <CardDescription>
                    Testaa yhteyttä Fingrid-rajapintaan ja datan hakua
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={timeWindow} onValueChange={(value) => setTimeWindow(value as TimeWindow)}>
                    <TabsList>
                        <TabsTrigger value={TimeWindow.DAY}>Päivä</TabsTrigger>
                        <TabsTrigger value={TimeWindow.WEEK}>Viikko</TabsTrigger>
                        <TabsTrigger value={TimeWindow.MONTH}>Kuukausi</TabsTrigger>
                    </TabsList>

                    <div className="mt-4">
                        {loading ? (
                            <div className="text-center p-4">Ladataan tietoja...</div>
                        ) : error ? (
                            <div className="text-red-500 p-4 border border-red-300 rounded-md">
                                <h3 className="font-bold">Virhe</h3>
                                <p>{error}</p>
                                <p className="text-sm mt-2">
                                    Tarkista, että API-avain on asetettu oikein .env.local-tiedostossa
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Sähkön kulutus</h3>
                                    <p>Datapisteiden määrä: {consumption.length}</p>
                                    {consumption.length > 0 && (
                                        <div className="mt-2">
                                            <p>Viimeisin kulutus: {consumption[consumption.length - 1].value} MW</p>
                                            <p>Aikaleima: {formatDate(consumption[consumption.length - 1].start_time)}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Sähkön tuotanto</h3>
                                    <p>Datapisteiden määrä: {production.length}</p>
                                    {production.length > 0 && (
                                        <div className="mt-2">
                                            <p>Viimeisin tuotanto: {production[production.length - 1].value} MW</p>
                                            <p>Aikaleima: {formatDate(production[production.length - 1].start_time)}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">CO2-päästökerroin</h3>
                                    <p>Datapisteiden määrä: {co2Emissions.length}</p>
                                    {co2Emissions.length > 0 && (
                                        <div className="mt-2">
                                            <p>Viimeisin arvo: {co2Emissions[co2Emissions.length - 1].value} gCO2/kWh</p>
                                            <p>Aikaleima: {formatDate(co2Emissions[co2Emissions.length - 1].start_time)}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Säätösähkön ylössäätöhinta</h3>
                                    <p>Datapisteiden määrä: {regulationPrice.length}</p>
                                    {regulationPrice.length > 0 && (
                                        <div className="mt-2">
                                            <p>Viimeisin hinta: {formatPricePerKwh(regulationPrice[regulationPrice.length - 1].value)}</p>
                                            <p>Keskihinta: {formatPricePerKwh(averagePrice)}</p>
                                            <p>Aikaleima: {formatDate(regulationPrice[regulationPrice.length - 1].start_time)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Tabs>
            </CardContent>
            <CardFooter>
                <Button onClick={handleRefresh} disabled={loading}>
                    {loading ? 'Ladataan...' : 'Päivitä tiedot'}
                </Button>
            </CardFooter>
        </Card>
    );
}