'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import api from '../services/api';

export default function HomePage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/newsletter/subscribe/', { email });
            setStatus('success');
            setEmail('');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <Layout>
            {/* Hero Section with Floating Elements */}
            <div className="relative overflow-hidden pt-10 pb-20">
                <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8 lg:items-center">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0">
                        <h1 className="mt-10 text-5xl font-black tracking-tight text-foreground sm:text-7xl uppercase leading-none">
                            Domina tu dinero <br />
                            con <span className="text-primary underline decoration-secondary decoration-8 underline-offset-8">consciencia</span>
                        </h1>
                        <p className="mt-8 text-xl leading-8 text-foreground/80 font-medium max-w-lg">
                            Bienvenido al hub definitivo para hippies financieros. Herramientas, educación y comunidad para construir riqueza sin perder tu alma.
                        </p>
                        <div className="mt-12 flex flex-wrap items-center gap-6">
                            <Link href="/register">
                                <Button variant="accent" className="text-xl px-10 py-5">
                                    Empezar gratis
                                </Button>
                            </Link>
                            <Link href="/blog" className="text-lg font-black leading-6 text-foreground hover:text-secondary transition-colors flex items-center group">
                                Explorar artículos 
                                <span aria-hidden="true" className="ml-2 group-hover:translate-x-2 transition-transform inline-block">🚀</span>
                            </Link>
                        </div>
                    </div>
                    <div className="mx-auto mt-16 flex max-w-2xl lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                            <div className="cartoon-card bg-tertiary p-3 rotate-2 animate-float">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                                    alt="App screenshot"
                                    width={2432}
                                    height={1442}
                                    className="w-[30rem] rounded-xl border-[3px] border-foreground sm:w-[45rem]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid - Organic Look */}
            <div className="py-24 sm:py-32 relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-20">
                        <h2 className="text-xl font-black text-secondary uppercase tracking-widest mb-4">Todo en un solo lugar</h2>
                        <p className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                            Recursos para cada paso de tu viaje
                        </p>
                        <div className="h-2 w-24 bg-primary mx-auto mt-6 cartoon-border bg-primary"></div>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
                        <dl className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div className="cartoon-card group hover:rotate-1">
                                <div className="flex h-16 w-16 items-center justify-center cartoon-border bg-primary mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-8 w-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase">Blog Educativo</h3>
                                <p className="text-lg text-foreground/70 mb-6">Artículos profundos sobre filosofía financiera, ahorro y minimalismo.</p>
                                <Link href="/blog" className="btn-cartoon px-6 py-2 text-sm">Leer más</Link>
                            </div>

                            <div className="cartoon-card group hover:-rotate-1">
                                <div className="flex h-16 w-16 items-center justify-center cartoon-border bg-tertiary mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-8 w-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase">Tienda de Recursos</h3>
                                <p className="text-lg text-foreground/70 mb-6">Herramientas digitales, plantillas de presupuesto y cursos exclusivos.</p>
                                <Link href="/tienda" className="btn-cartoon px-6 py-2 text-sm">Explorar tienda</Link>
                            </div>

                            <div className="cartoon-card group hover:-rotate-1">
                                <div className="flex h-16 w-16 items-center justify-center cartoon-border bg-secondary mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase">Podcast</h3>
                                <p className="text-lg text-foreground/70 mb-6">Conversaciones inspiradoras para escuchar mientras caminas o conduces.</p>
                                <Link href="/podcasts" className="btn-cartoon px-6 py-2 text-sm">Escuchar episodios</Link>
                            </div>

                            <div className="cartoon-card group hover:rotate-1">
                                <div className="flex h-16 w-16 items-center justify-center cartoon-border bg-accent mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase">Videos</h3>
                                <p className="text-lg text-foreground/70 mb-6">Tutoriales visuales y análisis de mercado simplificados.</p>
                                <Link href="/videos" className="btn-cartoon px-6 py-2 text-sm">Ver tutoriales</Link>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Newsletter - Vibrant Accent */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-32">
                <div className="cartoon-card bg-accent text-white p-12 -rotate-1 relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-black mb-6 uppercase leading-none">Suscríbete al newsletter</h2>
                            <p className="text-xl font-bold mb-8 opacity-90">
                                Recibe semanalmente consejos de finanzas, análisis y recursos gratuitos directamente en tu bandeja de entrada.
                            </p>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    className="flex-auto cartoon-border bg-white text-foreground px-6 py-4 text-lg font-bold placeholder:text-gray-400 focus:outline-none" 
                                    placeholder="Tu correo electrónico" 
                                />
                                <Button type="submit" variant="secondary" className="px-10" disabled={status === 'loading'}>
                                    {status === 'loading' ? '...' : '¡Me apunto! 🤘'}
                                </Button>
                            </form>
                            {status === 'success' && <p className="mt-4 text-primary font-black text-lg">¡BIENVENIDO A LA TRIBU! ✌️</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-white/10 p-6 cartoon-border border-white/20">
                                <dt className="font-black text-xl mb-2 uppercase">Artículos</dt>
                                <dd className="opacity-80">Contenido fresco cada semana.</dd>
                            </div>
                            <div className="bg-white/10 p-6 cartoon-border border-white/20">
                                <dt className="font-black text-xl mb-2 uppercase">Sin Spam</dt>
                                <dd className="opacity-80">Respetamos tu paz mental.</dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}