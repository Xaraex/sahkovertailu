import { Metadata } from 'next';
import ApiTest from '@/components/ApiTest';
import MinimalApiTest from '@/components/MinimalApiTest';
import { Activity, BarChart3, Cpu, Wind, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Kojelauta | SähköVertailu',
    description: 'Sähkön hinnan, kulutuksen ja tuotannon kojelauta | SähköVertailu',
};

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Sähkön hinta -kojelauta</h1>
                <p className="text-lg text-center text-muted-foreground">
                    Tarkastele reaaliaikaisia tietoja Suomen sähkömarkkinoista, hinnoista ja tuotannosta.
                </p>
            </div>

            {/* Minimal API Test Component to debug connection issues */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">API-yhteyden testeri</h2>
                <div className="flex justify-center">
                    <MinimalApiTest />
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nykyinen spot-hinta</p>
                                <h3 className="text-2xl font-bold mt-1">4.23 snt/kWh</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <span className="inline-block mr-1">↓</span> 12% edellisestä tunnista
                                </p>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sähkön kulutus</p>
                                <h3 className="text-2xl font-bold mt-1">8,230 MW</h3>
                                <p className="text-xs text-blue-600 mt-1 flex items-center">
                                    <span className="inline-block mr-1">↑</span> 3% edellisestä tunnista
                                </p>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sähkön tuotanto</p>
                                <h3 className="text-2xl font-bold mt-1">7,850 MW</h3>
                                <p className="text-xs text-orange-600 mt-1 flex items-center">
                                    <span className="inline-block mr-1">↓</span> 2% edellisestä tunnista
                                </p>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Cpu className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">CO2-päästökerroin</p>
                                <h3 className="text-2xl font-bold mt-1">84 g/kWh</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <span className="inline-block mr-1">↓</span> 8% edellisestä tunnista
                                </p>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Wind className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visualizations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Sähkön hinnan kehitys</CardTitle>
                        <CardDescription>Spot-hinnan kehitys viimeisen 24 tunnin aikana</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground">Hintakäyrä tulossa pian</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kulutus ja tuotanto</CardTitle>
                        <CardDescription>Sähkön kulutuksen ja tuotannon vertailu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground">Kulutus/tuotanto -käyrä tulossa pian</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Full API Test Component */}
            <div className="mt-8 border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Fingrid API-tiedot</h2>
                <p className="mb-6 text-muted-foreground">
                    Alla olevat tiedot haetaan suoraan Fingridin rajapinnasta. Voit valita eri aikaikkunoita tietojen tarkasteluun.
                </p>
                <ApiTest />
            </div>
        </div>
    );
}