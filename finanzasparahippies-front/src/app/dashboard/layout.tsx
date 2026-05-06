"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Network } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-10">
                <div className="h-20 w-20 bg-primary cartoon-border animate-float flex items-center justify-center">
                    <div className="h-10 w-10 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 font-black uppercase tracking-widest text-foreground/50">Sincronizando el universo...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row selection:bg-primary">
            {/* Sidebar - Cartoon Style */}
            <aside className="w-full md:w-72 bg-white dark:bg-tertiary border-r-4 border-foreground z-40 flex flex-col relative">
                <div className="p-8 border-b-4 border-foreground bg-primary group">
                    <Link href="/" className="block transition-transform hover:-rotate-3 active:scale-95">
                        <div className="bg-white cartoon-border px-4 py-2 rotate-[-2deg] inline-block shadow-cartoon-sm">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground m-0 leading-none">
                                FPH <span className="text-secondary">Studio</span>
                            </h2>
                        </div>
                    </Link>
                </div>
                
                <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <div className="pb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-2">Navegación</span>
                    </div>
                    <Link href="/dashboard/diagramas" className="flex items-center gap-4 p-4 font-black uppercase text-xs tracking-widest text-foreground hover:bg-tertiary hover:translate-x-2 transition-all cartoon-border border-transparent hover:border-foreground">
                        <div className="h-8 w-8 bg-secondary cartoon-border flex items-center justify-center -rotate-6">
                            <Network className="w-4 h-4 text-white" />
                        </div>
                        Laboratorio
                    </Link>
                    <Link href="/dashboard/perfil" className="flex items-center gap-4 p-4 font-black uppercase text-xs tracking-widest text-foreground hover:bg-primary hover:translate-x-2 transition-all cartoon-border border-transparent hover:border-foreground">
                        <div className="h-8 w-8 bg-tertiary cartoon-border flex items-center justify-center rotate-6">
                            <LayoutDashboard className="w-4 h-4 text-foreground" />
                        </div>
                        Mi Perfil
                    </Link>
                </nav>

                <div className="p-8 border-t-4 border-foreground bg-white/50 dark:bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary cartoon-border flex items-center justify-center font-black text-foreground text-sm">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-black text-xs uppercase truncate">{user.username}</p>
                            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-tighter">Miembro de la Tribu</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                {/* Dashboard Header - Integrated NavBar feel */}
                <header className="h-20 bg-white/80 dark:bg-tertiary/80 backdrop-blur-md border-b-4 border-foreground flex items-center justify-between px-10 z-30">
                    <div className="flex items-center gap-4">
                        <div className="h-3 w-3 rounded-full bg-secondary animate-pulse"></div>
                        <span className="font-black uppercase text-[10px] tracking-widest text-foreground opacity-60">FPH HUB / Dashboard</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/blog" className="text-[10px] font-black uppercase hover:text-secondary transition-colors">Volver al Blog</Link>
                        <div className="h-4 w-[2px] bg-foreground/10 rotate-12"></div>
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
