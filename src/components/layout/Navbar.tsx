'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, MenuIcon, XIcon, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    currentPath: string;
    onClick?: () => void;
}

// Styled navigation link component
function NavLink({ href, children, currentPath, onClick }: NavLinkProps) {
    const isActive = currentPath === href;

    return (
        <Link href={href} passHref>
            <span
                className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                onClick={onClick}
            >
                {children}
            </span>
        </Link>
    );
}

export function Navbar() {
    const pathname = usePathname();
    const { setTheme, theme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Header */}
            <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Zap size={24} className="text-primary" />
                            <h1 className="text-xl font-bold">SähköVertailu</h1>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <NavLink href="/" currentPath={pathname}>Etusivu</NavLink>
                        <NavLink href="/dashboard" currentPath={pathname}>Kojelauta</NavLink>
                        <NavLink href="/comparison" currentPath={pathname}>Hintavertailu</NavLink>
                        <NavLink href="/about" currentPath={pathname}>Tietoa</NavLink>
                    </nav>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Vaihda teema</span>
                        </Button>

                        {/* Mobile menu button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="md:hidden rounded-full"
                            onClick={toggleMobileMenu}
                        >
                            {mobileMenuOpen ?
                                <XIcon className="h-[1.2rem] w-[1.2rem]" /> :
                                <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                            }
                            <span className="sr-only">Valikko</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-30 bg-background pt-16">
                    <nav className="container mx-auto p-4 flex flex-col gap-2">
                        <NavLink href="/" currentPath={pathname} onClick={closeMobileMenu}>Etusivu</NavLink>
                        <NavLink href="/dashboard" currentPath={pathname} onClick={closeMobileMenu}>Kojelauta</NavLink>
                        <NavLink href="/comparison" currentPath={pathname} onClick={closeMobileMenu}>Hintavertailu</NavLink>
                        <NavLink href="/about" currentPath={pathname} onClick={closeMobileMenu}>Tietoa</NavLink>
                    </nav>
                </div>
            )}
        </>
    );
}