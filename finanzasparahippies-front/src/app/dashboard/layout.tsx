"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';

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
                <div className="h-20 w-20 bg-primary cartoon-border animate-float flex items-center justify-center shadow-cartoon">
                    <div className="h-10 w-10 border-6 border-foreground border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 font-black uppercase tracking-widest text-foreground/50">Sincronizando el universo...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row selection:bg-primary">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    {children}
                </div>
                
                {/* Decorative background element style Nectar */}
                <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            </main>
        </div>
    );
}
