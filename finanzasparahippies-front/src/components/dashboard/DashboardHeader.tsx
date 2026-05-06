"use client";

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';

export const DashboardHeader = () => {
    return (
        <header className="h-20 bg-white/80 dark:bg-tertiary/80 backdrop-blur-md border-b-4 border-foreground flex items-center justify-between px-10 z-30">
            <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-secondary animate-pulse"></div>
                <span className="font-black uppercase text-[10px] tracking-widest text-foreground opacity-60">FPH HUB / Dashboard</span>
            </div>
            <div className="flex items-center gap-6">
                <Link href="/" className="text-[10px] font-black uppercase hover:text-secondary transition-colors border-b-2 border-transparent hover:border-secondary pb-1">Ver Sitio</Link>
                <Link href="/blog" className="text-[10px] font-black uppercase hover:text-secondary transition-colors border-b-2 border-transparent hover:border-secondary pb-1">Blog</Link>
                <div className="h-4 w-[2px] bg-foreground/10 rotate-12"></div>
                <ThemeToggle />
            </div>
        </header>
    );
};
