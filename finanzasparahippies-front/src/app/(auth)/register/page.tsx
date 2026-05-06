"use client";

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { Layout } from '../../../components/layout/Layout';
import { Turnstile } from '@marsidev/react-turnstile';

export default function RegisterPage() {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [error, setError] = useState('');
    const [turnstileToken, setTurnstileToken] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!turnstileToken) {
            setError("Por favor, completa la verificación de seguridad (CAPTCHA).");
            return;
        }

        if (password !== rePassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            await register(email, password, rePassword, username, turnstileToken);
        } catch (err: any) {
            setError('Error al registrar: ' + (JSON.stringify(err.response?.data) || err.message));
        }
    };

    return (
        <Layout>
            <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background selection:bg-primary">
                <div className="w-full max-w-md space-y-8 cartoon-card bg-white p-10 my-10 animate-float">
                    <div className="text-center">
                        <div className="h-16 w-16 bg-primary cartoon-border mx-auto flex items-center justify-center mb-6 -rotate-3">
                            <svg className="h-8 w-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground uppercase leading-none">
                            Únete a <br /> la tribu
                        </h2>
                        <p className="mt-4 text-foreground/70 font-bold">Empieza tu viaje financiero</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 ml-1 text-foreground">Usuario</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full cartoon-border bg-background py-4 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-bold px-6 transition-all focus:translate-x-1 focus:translate-y-1"
                                    placeholder="Tu apodo hippie"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase mb-2 ml-1 text-foreground">Correo electrónico</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full cartoon-border bg-background py-4 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-bold px-6 transition-all focus:translate-x-1 focus:translate-y-1"
                                    placeholder="hola@hippie.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-black uppercase mb-2 ml-1 text-foreground">Contraseña</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full cartoon-border bg-background py-4 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-bold px-6 transition-all focus:translate-x-1 focus:translate-y-1"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black uppercase mb-2 ml-1 text-foreground">Repetir</label>
                                    <input
                                        id="re-password"
                                        name="re-password"
                                        type="password"
                                        required
                                        className="block w-full cartoon-border bg-background py-4 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-bold px-6 transition-all focus:translate-x-1 focus:translate-y-1"
                                        placeholder="••••••••"
                                        value={rePassword}
                                        onChange={(e) => setRePassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center my-6 cartoon-border p-2 bg-foreground/5">
                            <Turnstile
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADCsJG83VRk3vr2l"}
                                onSuccess={(token) => setTurnstileToken(token)}
                                options={{ theme: 'light' }}
                            />
                        </div>

                        {error && (
                            <div className="bg-accent border-2 border-white p-4 rounded-xl text-white font-black text-center -rotate-1 animate-wobble">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full btn-cartoon bg-primary text-foreground py-5 text-xl font-black uppercase tracking-widest"
                        >
                            Regístrate 🤘
                        </button>

                        <div className="text-center mt-8">
                            <Link href="/login" className="font-black text-foreground hover:text-primary border-b-4 border-primary transition-colors pb-1">
                                ¿Ya tienes cuenta? Entra aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
