'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    currentPath: string;
}

// Styled navigation link component
function NavLink({ href, children, currentPath }: NavLinkProps) {
    const isActive = currentPath === href;

    return (
        <Link href={href} passHref>
            <span className={`px-4 py-2 rounded-md transition-colors ${isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-primary/10'
                }`}>
                {children}
            </span>
        </Link>
    );
}

export function Navbar() {
    const pathname = usePathname();
    const { setTheme, theme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            {/* Header */}
            <header className="border-b sticky top-0 z-10 bg-background">
                <div className="container mx-auto py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href="/">
                            <h1 className="text-xl font-bold">SähköVertailu</h1>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-2">
                        <NavLink href="/kojelauta" currentPath={pathname}>Kojelauta</NavLink>
                        <NavLink href="/vertailu" currentPath={pathname}>Hintavertailu</NavLink>
                        <NavLink href="/tietoa" currentPath={pathname}>Tietoa</NavLink>
                    </nav>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={toggleTheme}>
                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Vaihda teema</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className="md:hidden border-b bg-background">
                <nav className="container mx-auto py-2 grid grid-cols-3 gap-1 text-center text-sm">
                    <NavLink href="/kojelauta" currentPath={pathname}>Kojelauta</NavLink>
                    <NavLink href="/vertailu" currentPath={pathname}>Vertailu</NavLink>
                    <NavLink href="/tietoa" currentPath={pathname}>Tietoa</NavLink>
                </nav>
            </div>
        </>
    );
}