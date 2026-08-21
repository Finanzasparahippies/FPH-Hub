"use client";

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { Layout } from '../../../components/layout/Layout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError('Credenciales incorrectas. Revisa tu email y contraseña.');
        } finally {
            setLoading(false);
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
                        <p className="mt-4 text-foreground/70 font-bold uppercase text-[10px] tracking-[0.3em]">Acceso a la Tribu Hippie</p>
                    </div>

                    <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <Input
                                label="Correo electrónico"
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="hola@hippie.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                label="Tu llave secreta"
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-accent/10 border-3 border-foreground p-4 rounded-xl text-foreground font-black text-xs text-center rotate-1 animate-wobble">
                                <span className="text-accent">ERROR:</span> {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="secondary"
                            size="lg"
                            className="w-full text-xl shadow-[10px_10px_0px_0px_var(--foreground)]"
                            disabled={loading}
                        >
                            {loading ? 'Sincronizando...' : 'Entrar 🚀'}
                        </Button>

                        <div className="text-center mt-10">
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
                                ¿Eres nuevo por aquí?{' '}
                                <Link href="/register" className="text-secondary hover:text-primary transition-colors border-b-2 border-primary">
                                    Únete a la tribu
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
