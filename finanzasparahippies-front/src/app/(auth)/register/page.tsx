"use client";

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { Layout } from '../../../components/layout/Layout';
import { Turnstile } from '@marsidev/react-turnstile';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function RegisterPage() {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!turnstileToken) {
            setError("Por favor, completa la verificación de seguridad (CAPTCHA).");
            setLoading(false);
            return;
        }

        if (password !== rePassword) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        try {
            await register(email, password, rePassword, username, turnstileToken);
        } catch (err: any) {
            setError('Error al registrar: ' + (JSON.stringify(err.response?.data) || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background selection:bg-primary">
                <div className="w-full max-w-md space-y-8 cartoon-card bg-tertiary p-10 my-10 animate-float">
                    <div className="text-center">
                        <div className="h-16 w-16 bg-primary cartoon-border mx-auto flex items-center justify-center mb-6 -rotate-3">
                            <svg className="h-8 w-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground uppercase leading-none">
                            Únete a <br /> la tribu
                        </h2>
                        <p className="mt-4 text-foreground/70 font-bold uppercase text-[10px] tracking-[0.3em]">Crea tu cuenta gratuita</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                label="Tu apodo hippie"
                                id="username"
                                name="username"
                                type="text"
                                required
                                placeholder="p.ej. GirasolVibrante"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Contraseña"
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Input
                                    label="Repetir"
                                    id="re-password"
                                    name="re-password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={rePassword}
                                    onChange={(e) => setRePassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center my-6 border-3 border-foreground p-2 bg-background rounded-xl">
                            <Turnstile
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADCsJG83VRk3vr2l"}
                                onSuccess={(token) => setTurnstileToken(token)}
                                options={{ theme: 'light' }}
                            />
                        </div>

                        {error && (
                            <div className="bg-accent/10 border-3 border-foreground p-4 rounded-xl text-foreground font-black text-xs text-center -rotate-1 animate-wobble">
                                <span className="text-accent">AVISO:</span> {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full text-xl shadow-[10px_10px_0px_0px_var(--foreground)]"
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Regístrate 🤘'}
                        </Button>

                        <div className="text-center mt-10">
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
                                ¿Ya tienes cuenta?{' '}
                                <Link href="/login" className="text-secondary hover:text-primary transition-colors border-b-2 border-primary">
                                    Entra aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
