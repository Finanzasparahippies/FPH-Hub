"use client";

import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="cartoon-card bg-primary p-8 rotate-1">
                <h1 className="text-4xl font-black uppercase text-foreground">
                    ¡Qué onda, {user?.first_name || user?.username || 'Hippie'}! ✌️
                </h1>
                <p className="mt-2 font-bold text-foreground/80 uppercase tracking-widest text-xs">
                    Bienvenido a tu centro de mando financiero
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="cartoon-card bg-white dark:bg-tertiary p-6 -rotate-1 hover:rotate-0 transition-transform">
                    <h3 className="font-black uppercase text-xs opacity-60">Tu Rol</h3>
                    <p className="text-2xl font-black mt-2 text-secondary">{user?.role || 'ESTUDIANTE'}</p>
                </div>
                <div className="cartoon-card bg-white dark:bg-tertiary p-6 rotate-1 hover:rotate-0 transition-transform">
                    <h3 className="font-black uppercase text-xs opacity-60">Estado de Cuenta</h3>
                    <p className="text-2xl font-black mt-2 text-accent">ACTIVO</p>
                </div>
                <div className="cartoon-card bg-white dark:bg-tertiary p-6 -rotate-2 hover:rotate-0 transition-transform">
                    <h3 className="font-black uppercase text-xs opacity-60">Sincronización</h3>
                    <p className="text-2xl font-black mt-2 text-primary">EXITOSA</p>
                </div>
            </div>

            <div className="cartoon-card bg-white dark:bg-tertiary p-10">
                <h2 className="text-2xl font-black uppercase mb-6">Tu Actividad Reciente</h2>
                <div className="border-t-4 border-foreground pt-6 space-y-4">
                    <p className="font-bold opacity-50 italic">Todavía no has realizado ninguna acción. ¡Explora el laboratorio!</p>
                </div>
            </div>
        </div>
    );
}
