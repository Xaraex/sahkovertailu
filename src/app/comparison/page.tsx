import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Check, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Hintavertailu | SähköVertailu',
    description: 'Vertaile spot-hintaisen ja kiinteähintaisen sähkösopimuksen kustannuksia | SähköVertailu',
};

export default function ComparisonPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Sähkösopimuksen hintavertailu</h1>
                <p className="text-lg text-center text-muted-foreground">
                    Vertaile spot-hintaisen ja kiinteähintaisen sähkösopimuksen kustannuksia oman kulutusprofiilisi perusteella
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Lataa kulutustietosi</CardTitle>
                        <CardDescription>
                            Lataa kulutustiedot sähköyhtiösi palvelusta tai syötä arviot käsin
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-muted rounded-lg p-10 text-center">
                            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                            <p className="mb-2 font-medium">Raahaa tiedosto tähän tai</p>
                            <Button variant="outline" size="sm">Valitse tiedosto</Button>
                            <p className="mt-4 text-sm text-muted-foreground">
                                Tue formaatit: CSV, Excel. Maksimikoko: 10MB
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Syötä nykyisen sähkösopimuksesi tiedot</CardTitle>
                        <CardDescription>
                            Vertaamme sopimuksen kustannuksia spot-hintaiseen sähkösopimukseen
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-10">
                            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">Lomake tulossa pian!</p>
                            <p className="mt-2 text-muted-foreground">
                                Tähän tulee lomake, jossa voit syöttää nykyisen sähkösopimuksesi tiedot.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Vertailun tulokset</CardTitle>
                        <CardDescription>
                            Analyysi sopimustyyppien hintaeroista kulutusprofiilisi perusteella
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-10">
                            <Check className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">Vertailun tulokset näytetään tässä</p>
                            <p className="mt-2 text-muted-foreground">
                                Lataa ensin kulutustietosi ja syötä sähkösopimuksesi tiedot nähdäksesi vertailun tulokset.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button disabled className="w-full max-w-md">
                            Tee vertailu
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}