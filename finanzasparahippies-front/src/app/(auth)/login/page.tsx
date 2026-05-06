"use client";

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { Layout } from '../../../components/layout/Layout';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <Layout>
            <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background selection:bg-primary">
                <div className="w-full max-w-md space-y-8 cartoon-card bg-tertiary p-10 my-10 animate-float">
                    <div className="text-center">
                        <div className="h-16 w-16 bg-primary cartoon-border mx-auto flex items-center justify-center mb-6 rotate-3">
                            <svg className="h-8 w-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground uppercase leading-none">
                            ¡Bienvenido <br /> de vuelta!
                        </h2>
                        <p className="mt-4 text-foreground/70 font-bold">Inicia sesión en la tribu</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 ml-1">Correo electrónico</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full cartoon-border bg-white py-4 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-bold px-6 transition-all focus:translate-x-1 focus:translate-y-1"
                                    placeholder="hola@hippie.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 ml-1">Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full cartoon-border bg-white py-4 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-bold px-6 transition-all focus:translate-x-1 focus:translate-y-1"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-accent/10 border-2 border-accent p-4 rounded-xl text-accent font-black text-center rotate-1 animate-wobble">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full btn-cartoon bg-secondary text-white py-5 text-xl font-black uppercase tracking-widest"
                        >
                            Entrar 🚀
                        </button>

                        <div className="text-center mt-8">
                            <Link href="/register" className="font-black text-foreground hover:text-secondary border-b-4 border-primary transition-colors pb-1">
                                ¿No tienes cuenta? Únete aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
