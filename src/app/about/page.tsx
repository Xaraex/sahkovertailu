import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Tietoa SähköVertailusta</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Projektin tavoite</CardTitle>
                        <CardDescription>Miksi SähköVertailu on kehitetty?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            SähköVertailu on web-sovellus, jonka tarkoituksena on auttaa suomalaisia sähkönkuluttajia
                            vertailemaan spot-hintaisen sähkön ja kiinteähintaisten sopimusten kustannuksia omien kulutustietojen perusteella.
                        </p>
                        <p>
                            Sovellus tarjoaa visualisointeja, analyysejä ja suosituksia optimaalisista sähkösopimuksista
                            huomioiden käyttäjän kulutusprofiilin ja sähkömarkkinoiden tilanteen.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kohderyhmä</CardTitle>
                        <CardDescription>Kenelle sovellus on tarkoitettu?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Suomalaiset sähkönkuluttajat, jotka harkitsevat siirtymistä spot-hintaiseen sähkösopimukseen</li>
                            <li>Nykyiset spot-hintaisen sähkön käyttäjät, jotka haluavat analysoida kustannuksiaan</li>
                            <li>Kuluttajat, jotka haluavat optimoida sähkönkäyttöään halvemmille tunneille</li>
                            <li>IT-rekrytoijat ja työnantajat (portfolionäkökulmasta)</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>Tekniset yksityiskohdat</CardTitle>
                    <CardDescription>Sovelluksen rakenne ja teknologiavalinnat</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Käytetyt teknologiat</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Frontend: React, Next.js</li>
                                <li>Tyylittely: Tailwind CSS, shadcn/ui komponenttikirjasto</li>
                                <li>Datavisualisointi: Recharts</li>
                                <li>Palvelintoiminnallisuus: Next.js API-reitit</li>
                                <li>Julkaisualusta: Vercel (ilmainen taso)</li>
                                <li>Versionhallinta: GitHub</li>
                                <li>Testaus: Jest, React Testing Library</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Ulkoiset datalähteet</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Fingrid API (sähkön tuotanto, kulutus, tuotantojakauma)</li>
                                <li>ENTSO-E Transparency Platform API (spot-hintadata)</li>
                            </ul>

                            <h3 className="text-lg font-medium mt-4 mb-2">Ominaisuudet</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Spot-hinnan vs. kiinteän hinnan kustannusvertailu</li>
                                <li>Hintatrendien visualisointi</li>
                                <li>Tuotantojakauman visualisointi</li>
                                <li>Säästöjen/lisäkustannusten visualisointi</li>
                                <li>Kulutuksen optimointisuositukset</li>
                                <li>Hintaennusteet lähitulevaisuudelle</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tietoa tekijästä</CardTitle>
                    <CardDescription>Projektin kehittäjä</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        SähköVertailu on osa henkilökohtaista portfoliotani, jolla osoitan osaamistani full-stack-kehittäjänä.
                        Projektin tarkoituksena on demonstroida taitojani API-integraatioissa, datan käsittelyssä,
                        visualisoinnissa sekä käyttöliittymäsuunnittelussa.
                    </p>
                    <p>
                        Sovellus on avoimesti saatavilla <a href="https://github.com/yourusername/sahko-vertailu" className="text-primary underline">GitHubissa</a>,
                        ja koodin arkkitehtuuri on suunniteltu skaalautuvaksi ja helposti ylläpidettäväksi.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}