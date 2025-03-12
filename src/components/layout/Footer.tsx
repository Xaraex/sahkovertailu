import Link from 'next/link';
import { Zap, Github, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t py-8 bg-muted/40">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Zap size={20} className="text-primary mr-2" />
                        <span className="font-semibold">SähköVertailu</span>
                    </div>

                    <div className="flex flex-col items-center md:flex-row md:gap-8 text-sm text-muted-foreground">
                        <div className="flex gap-6 mb-4 md:mb-0">
                            <Link href="/" className="hover:text-primary transition-colors">
                                Etusivu
                            </Link>
                            <Link href="/dashboard" className="hover:text-primary transition-colors">
                                Kojelauta
                            </Link>
                            <Link href="/comparison" className="hover:text-primary transition-colors">
                                Hintavertailu
                            </Link>
                            <Link href="/about" className="hover:text-primary transition-colors">
                                Tietoa
                            </Link>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href="https://github.com/xaraex/sahko-vertailu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Github size={16} />
                                <span>GitHub</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/janne-kolehmainen-832924341"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <Linkedin size={16} />
                                <span>LinkedIn</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} SähköVertailu - Suomalainen sähkön hintavertailutyökalu</p>
                    <p className="mt-1">
                        Tiedot tarjoaa <a href="https://www.fingrid.fi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Fingrid</a> ja
                        <a href="https://transparency.entsoe.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> ENTSO-E</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}