# Luo README.md
cat > README.md << EOF
# SähköVertailu

Suomalainen web-sovellus sähkösopimusten vertailuun. Vertaa spot-hintaista ja kiinteähintaista sähkösopimusta kulutusprofiilisi perusteella.

## Ominaisuudet

- Reaaliaikainen sähkön hintatietojen haku Fingrid API:sta
- Spot-hintojen ja kiinteiden hintojen vertailu
- Visualisoinnit sähkön kulutuksesta ja tuotannosta
- CO2-päästökertoimet eri energiantuotantomuodoille
- Responsiivinen käyttöliittymä mobiili- ja työpöytälaitteille

## Teknologiat

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn/ui komponenttikirjasto
- Recharts visualisointeihin
- Fingrid API-integraatio

## Kehitys

### Vaatimukset

- Node.js (versio >= 18.x)
- npm (versio >= 9.x)

### Asennus

\`\`\`bash
# Kloonaa repositorio
git clone https://github.com/sinun-kayttajatunnuksesi/sahkovertailu.git
cd sahkovertailu

# Asenna riippuvuudet
npm install

# Luo .env.local tiedosto
cp .env.local.example .env.local

# Täytä API-avain .env.local tiedostoon
# FINGRID_API_KEY=sinun_api_avaimesi_tähän

# Käynnistä kehityspalvelin
npm run dev
\`\`\`

Sovellus käynnistyy osoitteeseen [http://localhost:3000](http://localhost:3000).

## Tuotantoversio

\`\`\`bash
# Rakenna sovellus
npm run build

# Käynnistä tuotantoversio
npm start
\`\`\`

## Käyttöönotto

Sovellus on suunniteltu käytettäväksi Vercel-palvelussa, mutta se on yhteensopiva myös muiden Next.js-palveluiden kanssa.

## Lisenssi

MIT
EOF