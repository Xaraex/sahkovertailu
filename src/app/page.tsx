import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, Zap, FileCode, LineChart, TrendingDown, Github, Code, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - parempi kontrasti ja visuaalisuus */}
      <section className="bg-gradient-to-br from-primary to-primary-foreground/10 text-white">
        <div className="container mx-auto py-24 md:py-32 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-sm font-medium">Portfolioprojekti • Web-kehitys</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 drop-shadow-md">
              SähköVertailu
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed max-w-2xl mx-auto">
              Next.js-pohjainen datanvisualisointiprojekti, joka vertailee spot-hintaista ja kiinteähintaista
              sähkösopimusta reaaliaikaisella datalla.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-medium text-base shadow-lg">
                <Link href="/dashboard" className="flex items-center">
                  Tutustu kojelautaan <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {/* Korjattu Github-nappi paremmalla kontrastilla */}
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/20 font-medium text-base shadow-lg"
              >
                <Link href="https://github.com/yourusername/sahkovertailu" className="flex items-center" target="_blank">
                  <Github className="mr-2 h-5 w-5" /> GitHub-repo
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Hero-osion aaltoileva alaosa */}
        <div className="h-24 bg-white relative">
          <svg className="absolute -top-24 left-0 w-full h-24 text-white fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,96L60,85.3C120,75,240,53,360,53.3C480,53,600,75,720,90.7C840,107,960,117,1080,112C1200,107,1320,85,1380,74.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Tekninen osio - parempi asettelu ja visuaalinen kiinnostavuus */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tekninen toteutus</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              SähköVertailu on rakennettu modernilla teknologiastackilla ja esittelee datan
              hakemista, prosessointia ja visualisointia selkeällä tavalla.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
            <Card className="bg-card border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <FileCode className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Moderni Web Stack</CardTitle>
                <CardDescription className="text-base">
                  Rakennettu Next.js 14:llä ja React 18:lla
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>TypeScript tyyppiturvalliseen kehitykseen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Tailwind CSS ja shadcn/ui komponentit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Next.js App Router -arkkitehtuuri</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>React Server Components ja Client Components</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Datanvisualisointi</CardTitle>
                <CardDescription className="text-base">
                  Interaktiivisten kuvaajien ja kaavioiden toteutus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Recharts-visualisointikirjasto</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Reaaliaikaiset päivitykset ja animaatiot</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Responsiivinen suunnittelu kaikille laitteille</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Saavutettavat kaaviot värikoodauksella</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">API-integraatiot</CardTitle>
                <CardDescription className="text-base">
                  Ulkoisten rajapintojen integrointi ja optimointi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Fingrid API -integraatio reaaliaikadataan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Kehittynyt välimuistinhallinta (caching)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>API-pyyntöjen optimointi (rate limiting)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-primary font-bold">•</span>
                    <span>Virheenkäsittely ja varmistusmekanismit</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ominaisuudet - parempi visuaalinen ilme */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Projektin ominaisuudet</h2>
          <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            SähköVertailu demonstroi erilaisia web-sovelluskehityksen näkökohtia ja moderneja toteutustekniikoita.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
            <Card className="bg-card border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3 text-primary" />
                  Reaaliaikainen data
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <p className="text-lg">
                  Sovellus hakee dataa suoraan Fingridin rajapinnoista, demonstroiden API-integraatioita
                  ja datan prosessointia. Koodi sisältää esimerkkejä optimoidusta välimuistinhallinnasta
                  API-pyyntöjen rajoitusten huomioimiseksi.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90" asChild>
                  <Link href="/dashboard" className="flex items-center justify-center">
                    Kokeile kojelautaa <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <LineChart className="h-6 w-6 mr-3 text-primary" />
                  Hintavertailutyökalu
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <p className="text-lg">
                  Projekti sisältää työkalun spot-hintojen ja kiinteiden hintojen vertailuun käyttäen
                  esimerkkidataa. Tämä demonstroi React-komponenttien interaktiivisuutta, käyttäjäsyötteiden
                  hallintaa ja laskentalogiikkaa.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90" asChild>
                  <Link href="/comparison" className="flex items-center justify-center">
                    Kokeile vertailutyökalua <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio CTA Section - parempi visuaalinen ilme */}
      <section className="py-20 md:py-28 bg-white dark:bg-black relative overflow-hidden">
        {/* Taustakuvio */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full">
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto bg-card border border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl p-10 md:p-14">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Tutustu projektin toteutukseen</h2>
            <p className="text-xl mb-10 text-center">
              SähköVertailu on henkilökohtainen portfolioprojekti, joka näyttää osaamistani
              web-kehityksessä, datan käsittelyssä ja API-integraatioissa. Kaikki lähdekoodi on
              vapaasti saatavilla GitHubissa.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="flex-1 bg-primary text-white hover:bg-primary/90 text-lg py-7 shadow-lg" asChild>
                <Link href="/dashboard" className="flex items-center justify-center">
                  Kokeile sovellusta <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 text-lg py-7 shadow-lg"
                asChild
              >
                <Link href="https://github.com/xaraex/sahkovertailu" className="flex items-center justify-center" target="_blank">
                  <Github className="mr-2 h-5 w-5" /> GitHub-repo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tekninen käyttötapausesimerkki - paranneltu ulkoasu */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Kuinka se toimii</h2>
            <div className="bg-black text-white p-8 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-gray-400">fingrid-api.ts</div>
              </div>
              <pre className="text-sm md:text-base overflow-x-auto font-mono">
                <code className="text-blue-400">
                  {`// Esimerkki API-kutsusta Fingrid-dataan
const fetchElectricityData = async (datasetId) => {
  // Käytetään välimuistia rate limit -rajoitusten välttämiseksi
  const cacheKey = \`fingrid_\${datasetId}_\${new Date().toDateString()}\`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Haetaan data Fingrid API:sta
  const response = await fetch(\`/api/fingrid/datasets/\${datasetId}/data/latest\`);
  
  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`);
  }
  
  const data = await response.json();
  
  // Tallennetaan välimuistiin
  localStorage.setItem(cacheKey, JSON.stringify(data));
  
  return data;
}`}
                </code>
              </pre>
            </div>
            <p className="text-center mt-8 text-muted-foreground text-lg">
              Tutustu koko lähdekoodiin GitHubissa nähdäksesi tarkemman toteutuksen!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}