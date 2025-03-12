import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <section className="py-12 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Vertaile sähkösopimusten hintoja helposti
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl">
          SähköVertailu auttaa sinua vertailemaan spot-hintaisen sähkön ja kiinteähintaisten sopimusten kustannuksia kulutuksesi perusteella.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/vertailu">Aloita vertailu</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/kojelauta">Tutustu kojelautaan</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reaaliaikainen data</CardTitle>
            <CardDescription>
              Hyödynnä reaaliaikaista tietoa sähkön kulutuksesta ja tuotannosta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sovelluksemme hakee tiedot suoraan Fingridin avoimesta datasta, joten näet aina ajantasaisen tilanteen Suomen sähkömarkkinoilla.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kustannusvertailu</CardTitle>
            <CardDescription>
              Vertaile eri sähkösopimusmallien kustannuksia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Voit helposti verrata, olisiko sinulle edullisempaa spot-hintainen vai kiinteähintainen sähkösopimus oman kulutusprofiilisi perusteella.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selkeät visualisoinnit</CardTitle>
            <CardDescription>
              Ymmärrä sähkön hintakehitys yhdellä silmäyksellä
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sovelluksemme tarjoaa selkeät kaaviot ja visualisoinnit, joiden avulla ymmärrät helposti sähkön hinnan vaihtelut ja trendit.</p>
          </CardContent>
        </Card>
      </section>

      <section className="py-12 border-t border-b my-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Miksi vertailla sähkösopimuksia?</h2>
          <p className="text-lg mb-4">
            Sähkön hinnat ovat vaihdelleet viime vuosina merkittävästi, ja oikean sopimustyypin valinta voi säästää sinulle satoja euroja vuodessa.
          </p>
          <p className="text-lg">
            Spot-hintainen sopimus voi olla edullisempi pitkällä aikavälillä, mutta sisältää enemmän hintavaihtelua. Kiinteähintainen sopimus tarjoaa ennustettavuutta, mutta usein korkeammalla keskihinnalla.
          </p>
        </div>
      </section>
    </div>
  );
}