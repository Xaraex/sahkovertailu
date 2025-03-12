import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Code, Database, GitBranch, GitFork, LineChart, Zap, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Tietoa | SähköVertailu',
    description: 'Tietoa SähköVertailu-sovelluksesta ja sen toiminnasta',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Tietoa SähköVertailusta</h1>
                <p className="text-lg text-center text-muted-foreground">
                    Tutustu projektin taustoihin, tavoitteisiin ja teknisiin yksityiskohtiin
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card>
                    <CardHeader className="pb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Projektin tavoite</CardTitle>
                        <CardDescription>Miksi SähköVertailu on kehitetty?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            SähköVertailu on portfolioprojekti, jonka tarkoituksena on visualisoida ja analysoida
                            spot-hintaisen sähkön ja kiinteähintaisten sopimusten eroja suomalaisilla sähkömarkkinoilla.
                        </p>
                        <p>
                            Sovellus tarjoaa visualisointeja ja analyysejä sähkön hintakehityksestä,
                            tuotantojakaumasta ja kustannuksista erilaisten esimerkkikulutusprofiilien pohjalta.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Kohderyhmä</CardTitle>
                        <CardDescription>Kenelle sovellus on tarkoitettu?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2 mt-1">•</span>
                                <span>Sähkömarkkinoista kiinnostuneet datan visualisoinnin harrastajat</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 mt-1">•</span>
                                <span>Nykyiset spot-hintaisen sähkön käyttäjät, jotka haluavat analysoida markkinatilannetta</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 mt-1">•</span>
                                <span>Kuluttajat, jotka haluavat ymmärtää sähkömarkkinoiden toimintaa</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 mt-1">•</span>
                                <span>IT-rekrytoijat ja työnantajat (portfolionäkökulmasta)</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-12">
                <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Code className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Tekniset yksityiskohdat</CardTitle>
                    <CardDescription>Sovelluksen rakenne ja teknologiavalinnat</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <GitBranch className="h-5 w-5 mr-2 text-primary" />
                                Käytetyt teknologiat
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Frontend: React, Next.js</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Tyylittely: Tailwind CSS, shadcn/ui komponenttikirjasto</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Datavisualisointi: Recharts</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Palvelintoiminnallisuus: Next.js API-reitit</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Julkaisualusta: Vercel (ilmainen taso)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Versionhallinta: GitHub</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Testaus: Jest, React Testing Library</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <Database className="h-5 w-5 mr-2 text-primary" />
                                Ulkoiset datalähteet
                            </h3>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Fingrid API (sähkön tuotanto, kulutus, tuotantojakauma)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>ENTSO-E Transparency Platform API (spot-hintadata)</span>
                                </li>
                            </ul>

                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <LineChart className="h-5 w-5 mr-2 text-primary" />
                                Keskeiset ominaisuudet
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Spot-hinnan vs. kiinteän hinnan vertailu</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Hintatrendien visualisointi</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Tuotantojakauman visualisointi</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Reaaliaikaisen datan käsittely</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Rate limiting ja välimuistinhallinta</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <GitFork className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Tietoa tekijästä</CardTitle>
                    <CardDescription>Portfolioprojekti</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        SähköVertailu on <strong>Janne Kolehmaisen</strong> portfolioprojekti, joka demonstroi
                        full-stack-kehitystaitoja, kuten API-integraatioita, datan visualisointia ja käsittelyä sekä
                        käyttöliittymäsuunnittelua.
                    </p>
                    <p className="mb-6">
                        Projektin koodirakenne on suunniteltu skaalautuvaksi ja ylläpidettäväksi,
                        hyödyntäen moderneja web-teknologioita ja parhaita käytäntöjä.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button variant="outline" className="flex items-center gap-2" asChild>
                            <Link href="https://github.com/xaraex/sahko-vertailu" target="_blank">
                                <Github className="h-4 w-4" />
                                GitHub Repository
                            </Link>
                        </Button>

                        <Button variant="outline" className="flex items-center gap-2" asChild>
                            <Link href="https://www.linkedin.com/in/janne-kolehmainen-832924341" target="_blank">
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}