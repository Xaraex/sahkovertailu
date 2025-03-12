import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="container mx-auto py-16 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">404 - Sivua ei löydy</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl">
                Valitettavasti etsimääsi sivua ei löydy. On mahdollista, että osoite on kirjoitettu väärin tai sivu on poistettu.
            </p>
            <Button asChild size="lg">
                <Link href="/">Takaisin etusivulle</Link>
            </Button>
        </div>
    );
}