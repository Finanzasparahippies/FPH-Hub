'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export const NavBar = () => {
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-4 px-4">
            <div className="max-w-7xl mx-auto cartoon-card bg-white dark:bg-tertiary backdrop-blur-md py-4 px-6 sm:px-10 !p-0">
                <div className="flex justify-between items-center h-16 px-4">
                    <div className="flex-shrink-0 flex items-center gap-3">
                        {/* Logo */}
                        <div className="relative h-10 w-10 cartoon-border bg-white overflow-hidden rotate-[-2deg]">
                            <img
                                src="/assets/img/Logo.png"
                                alt="Finanzas Para Hippies Logo"
                                className="object-cover h-full w-full"
                            />
                        </div>
                        <Link href="/" className="font-black text-xl text-foreground tracking-tight hover:text-secondary transition-colors uppercase">
                            FPH <span className="hidden sm:inline">HUB</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center font-black text-foreground uppercase text-xs tracking-wider">
                        <Link href="/blog" className="hover:text-primary transition-all animate-wobble">
                            Blog
                        </Link>
                        <a href="https://www.tierraviva.com.mx/shop" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all animate-wobble">
                            Tienda
                        </a>
                        <Link href="/podcasts" className="hover:text-primary transition-all animate-wobble">
                            Podcasts
                        </Link>
                        <Link href="/videos" className="hover:text-primary transition-all animate-wobble">
                            Videos
                        </Link>
                        <Link href="/dashboard/diagramas" className="hover:text-primary transition-all animate-wobble flex items-center gap-2">
                            Laboratorio <span className="text-[10px] bg-secondary text-white px-1.5 py-0.5 rounded-full">Pro</span>
                        </Link>
                        <Link href="/portfolio" className="hover:text-primary transition-all animate-wobble">
                            Portafolio
                        </Link>
                        <ThemeToggle />
                        <div className="h-4 w-[2px] bg-foreground rotate-12 mx-2"></div>
                        
                        {user ? (
                            <Link href="/dashboard/perfil" className="group flex items-center gap-3 pl-2">
                                <div className="h-8 w-8 rounded-full bg-primary cartoon-border flex items-center justify-center text-xs group-hover:rotate-12 transition-transform">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[11px] font-black group-hover:text-secondary transition-colors">Mi Perfil</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="hover:text-secondary transition-all">
                                    Log in
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" className="py-2 px-6 text-xs font-black">
                                        Unirse
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-tertiary transition-colors cartoon-border"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-background border-t-4 border-foreground rounded-b-2xl overflow-hidden">
                        <div className="px-4 pt-4 pb-6 space-y-2 font-black uppercase text-sm">
                            <Link href="/blog" className="block px-3 py-3 rounded-xl hover:bg-primary transition-colors">
                                Blog
                            </Link>
                            <a href="https://www.tierraviva.com.mx/shop" target="_blank" rel="noopener noreferrer" className="block px-3 py-3 rounded-xl hover:bg-primary transition-colors">
                                Tienda
                            </a>
                            <Link href="/podcasts" className="block px-3 py-3 rounded-xl hover:bg-primary transition-colors">
                                Podcasts
                            </Link>
                            <Link href="/videos" className="block px-3 py-3 rounded-xl hover:bg-primary transition-colors">
                                Videos
                            </Link>
                            <Link href="/dashboard/diagramas" className="block px-3 py-3 rounded-xl hover:bg-primary transition-colors">
                                Laboratorio <span className="ml-2 text-[10px] bg-secondary text-white px-2 py-0.5 rounded-full">Pro</span>
                            </Link>
                            <Link href="/portfolio" className="block px-3 py-3 rounded-xl hover:bg-primary transition-colors">
                                Portafolio
                            </Link>
                            <div className="border-t-2 border-foreground my-4 pt-4">
                                {user ? (
                                    <Link href="/dashboard/perfil" className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-secondary hover:text-white transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-primary cartoon-border flex items-center justify-center font-black text-foreground">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm">{user.username}</p>
                                            <p className="text-[10px] opacity-60 uppercase">Ver mi Perfil</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="space-y-4">
                                        <Link href="/login" className="block px-3 py-3 rounded-xl hover:bg-secondary hover:text-white transition-colors">
                                            Log in
                                        </Link>
                                        <div className="mt-4 px-3">
                                            <Link href="/register">
                                                <Button fullWidth variant="primary">Unirse</Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
