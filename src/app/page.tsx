import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, Zap, Lightbulb, LineChart, TrendingDown } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-sm">
              Löydä edullisin sähkösopimus helposti
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              SähköVertailu auttaa sinua vertailemaan spot-hintaisen ja kiinteähintaisen
              sähkösopimuksen kustannuksia oman kulutusprofiilisi perusteella.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/vertailu" className="flex items-center">
                  Aloita vertailu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/kojelauta">
                  Tutustu kojelautaan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="energy-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Miksi käyttää SähköVertailua?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className="energy-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-energy-blue-100 dark:bg-energy-blue-900/30 flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-energy-blue-600 dark:text-energy-blue-400" />
                </div>
                <CardTitle>Reaaliaikainen data</CardTitle>
                <CardDescription>
                  Hyödynnä ajantasaista tietoa sähkömarkkinoilta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Sovelluksemme hakee tiedot suoraan Fingridin ja ENTSO-E:n rajapinnoista, joten näet aina ajantasaisen tilanteen Suomen sähkömarkkinoilla.</p>
              </CardContent>
            </Card>

            <Card className="energy-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-energy-green-100 dark:bg-energy-green-900/30 flex items-center justify-center mb-2">
                  <LineChart className="h-6 w-6 text-energy-green-600 dark:text-energy-green-400" />
                </div>
                <CardTitle>Henkilökohtainen analyysi</CardTitle>
                <CardDescription>
                  Räätälöity analyysi oman kulutuksesi perusteella
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Voit helposti verrata, olisiko sinulle edullisempaa spot-hintainen vai kiinteähintainen sähkösopimus juuri sinun kulutusprofiilisi perusteella.</p>
              </CardContent>
            </Card>

            <Card className="energy-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-energy-blue-100 dark:bg-energy-blue-900/30 flex items-center justify-center mb-2">
                  <TrendingDown className="h-6 w-6 text-energy-blue-600 dark:text-energy-blue-400" />
                </div>
                <CardTitle>Selkeät visualisoinnit</CardTitle>
                <CardDescription>
                  Ymmärrä sähkön hintakehitys yhdellä silmäyksellä
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Sovelluksemme tarjoaa selkeät kaaviot ja visualisoinnit, joiden avulla ymmärrät helposti sähkön hinnan vaihtelut ja trendit eri ajanjaksoilla.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted energy-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Näin SähköVertailu toimii</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Syötä kulutustietosi</h3>
              <p className="text-muted-foreground">Lataa kulutustiedot omasta sähköyhtiöstäsi tai syötä arviot käsin.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Valitse sopimustyypit</h3>
              <p className="text-muted-foreground">Valitse vertailtavat sopimustyypit ja niiden hinnat vertailuun.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Tarkastele analyysiä</h3>
              <p className="text-muted-foreground">Näe kuinka paljon olisit säästänyt tai maksanut eri sopimustyypeillä.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Saa suosituksia</h3>
              <p className="text-muted-foreground">Saa dataan pohjautuvia suosituksia sopivimmasta sopimustyypistä.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="energy-section">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-energy-blue-50 dark:bg-energy-blue-900/20 rounded-2xl p-8 md:p-12">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Aloita säästäminen jo tänään</h2>
            <p className="text-lg mb-6">
              Sähkön hinnat vaihtelevat merkittävästi, ja oikean sopimustyypin valinta voi
              säästää sinulle satoja euroja vuodessa. Ota sähkölaskusi hallintaan!
            </p>
            <Button size="lg" className="mt-2">
              <Link href="/comparison" className="flex items-center">
                Siirry vertailemaan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}