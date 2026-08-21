"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Network, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DashboardSidebar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
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
                
                <SidebarLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" color="bg-primary" rotate="-rotate-3" />
                <SidebarLink href="/dashboard/diagramas" icon={<Network className="w-4 h-4" />} label="Laboratorio" color="bg-secondary" iconColor="text-white" rotate="rotate-2" />
                <SidebarLink href="/dashboard/perfil" icon={<User className="w-4 h-4" />} label="Mi Perfil" color="bg-accent" iconColor="text-white" rotate="-rotate-2" />
                
                <div className="pt-8 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-2">Ajustes</span>
                </div>
                <SidebarLink href="/dashboard/settings" icon={<Settings className="w-4 h-4" />} label="Configuración" color="bg-tertiary" rotate="rotate-1" />
            </nav>

            <div className="p-8 border-t-4 border-foreground bg-white/50 dark:bg-black/20">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 min-w-[40px] rounded-full bg-primary cartoon-border flex items-center justify-center font-black text-foreground text-sm">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-black text-xs uppercase truncate">{user.username}</p>
                            <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-tighter">Miembro VIP</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="p-2 hover:bg-accent/10 rounded-lg transition-colors group"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    color: string;
    iconColor?: string;
    rotate?: string;
}

const SidebarLink = ({ href, icon, label, color, iconColor = "text-foreground", rotate = "" }: SidebarLinkProps) => (
    <Link href={href} className="flex items-center gap-4 p-4 font-black uppercase text-xs tracking-widest text-foreground hover:bg-foreground/5 hover:translate-x-2 transition-all cartoon-border border-transparent hover:border-foreground group">
        <div className={`h-8 w-8 ${color} cartoon-border flex items-center justify-center ${rotate} group-hover:rotate-0 transition-transform ${iconColor}`}>
            {icon}
        </div>
        {label}
    </Link>
);
