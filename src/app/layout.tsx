import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Tähän tullaan lisäämään Tailwind CSS perustyyli
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

// Configure the Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SähköVertailu - Suomalainen sähkön hintavertailu',
  description: 'Vertaile spot-hintaista ja kiinteähintaista sähkösopimuksia Suomessa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}