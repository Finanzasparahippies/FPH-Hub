import React from 'react';
import { NavBar } from './NavBar';
import Link from 'next/link';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-foreground">
            <NavBar />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <footer className="mt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto cartoon-card bg-white p-12 -rotate-1 group hover:rotate-0 transition-all duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
                        <div className="md:col-span-1">
                            <div className="inline-block bg-primary cartoon-border px-4 py-1 mb-6 rotate-[-3deg]">
                                <span className="font-black uppercase tracking-tighter text-foreground">La Tribu</span>
                            </div>
                            <p className="text-3xl font-black text-foreground uppercase leading-none mb-6">
                                FINANZAS PARA <br /> <span className="text-secondary">HIPPIES</span>
                            </p>
                            <p className="text-foreground/60 font-bold leading-relaxed">
                                Herramientas, educación y comunidad para construir riqueza sin perder tu esencia en el camino.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 md:col-span-2">
                            <div>
                                <h4 className="font-black uppercase tracking-widest text-secondary mb-6">Mapa</h4>
                                <ul className="space-y-4 font-bold text-foreground/80">
                                    <li><Link href="/blog" className="hover:text-primary transition-colors">Sabiduría (Blog)</Link></li>
                                    <li><Link href="/tienda" className="hover:text-primary transition-colors">Tesoros (Tienda)</Link></li>
                                    <li><Link href="/podcasts" className="hover:text-primary transition-colors">Vibras (Podcasts)</Link></li>
                                    <li><Link href="/videos" className="hover:text-primary transition-colors">Visiones (Videos)</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-black uppercase tracking-widest text-secondary mb-6">Conecta</h4>
                                <ul className="space-y-4 font-bold text-foreground/80">
                                    <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Twitter (X)</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">TikTok</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 pt-10 border-t-4 border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-xs font-black uppercase tracking-widest text-foreground/40 italic">
                            Hecho con consciencia y un poco de psicodelia digital.
                        </p>
                        <div className="bg-tertiary cartoon-border px-6 py-2 rotate-2">
                            <p className="text-xs font-black uppercase tracking-tighter text-foreground">
                                &copy; {new Date().getFullYear()} - FPH HUB
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
