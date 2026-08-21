"use client";

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { MediaPlayer } from '../../components/ui/MediaPlayer';

interface Podcast {
    id: number;
    title: string;
    slug: string;
    description: string;
    spotify_url?: string;
    audio_file?: string;
    published_at: string;
}

export default function PodcastsPage() {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const response = await api.get('/media/podcasts/');
                setPodcasts(response.data);
            } catch (error) {
                console.error("Failed to fetch podcasts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPodcasts();
    }, []);

    return (
        <Layout>
            <div className="bg-background py-24 sm:py-32 selection:bg-primary">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-20 animate-float">
                        <div className="inline-block bg-primary cartoon-border px-6 py-2 mb-6 rotate-2">
                            <span className="font-black uppercase tracking-tighter text-foreground">Sintonía Hippie</span>
                        </div>
                        <h2 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl uppercase leading-none">
                            POD<span className="text-secondary">CASTS</span>
                        </h2>
                        <p className="mt-6 text-xl leading-8 text-foreground/70 font-bold max-w-lg mx-auto">
                            Escucha sabiduría financiera mientras caminas, cocinas o simplemente fluyes.
                        </p>
                    </div>

                    {/* Spotify Show Embed */}
                    <div className="mb-20 cartoon-card bg-secondary p-6 rotate-1 max-w-4xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div className="bg-white cartoon-border p-1 -rotate-2">
                                <span className="font-black uppercase tracking-widest text-xs px-2">Podcast Completo 🎙</span>
                            </div>
                            <a 
                                href="https://open.spotify.com/show/7rDoid7DddkqTPpbYWDN45" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-cartoon bg-primary text-[10px] py-2 px-4 hover:scale-105"
                            >
                                Sintonizar en Spotify ↗
                            </a>
                        </div>
                        <iframe 
                            src="https://open.spotify.com/embed/show/7rDoid7DddkqTPpbYWDN45?utm_source=generator&theme=0" 
                            width="100%" 
                            height="600" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            className="cartoon-border shadow-cartoon-sm"
                        ></iframe>
                        <p className="mt-4 text-xs font-black text-white/80 uppercase tracking-widest text-center">
                            Desliza para explorar la biblioteca completa de episodios
                        </p>
                    </div>
                    
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh]">
                            <div className="h-16 w-16 bg-tertiary cartoon-border animate-float flex items-center justify-center">
                                <div className="h-8 w-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="mt-6 font-black uppercase tracking-widest">Sintonizando frecuencias...</p>
                        </div>
                    ) : (
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            {podcasts.map((podcast, index) => (
                                <article 
                                    key={podcast.id} 
                                    className="flex flex-col items-start justify-between cartoon-card bg-white hover:rotate-1 transition-all"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="relative w-full mb-8 cartoon-border bg-tertiary p-2 -rotate-1">
                                        {podcast.spotify_url ? (
                                            <MediaPlayer url={podcast.spotify_url} type="podcast" />
                                        ) : podcast.audio_file ? (
                                            <div className="p-4 bg-white cartoon-border">
                                                <audio controls className="w-full">
                                                    <source src={podcast.audio_file} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        ) : (
                                            <div className="p-8 bg-white cartoon-border text-center font-black uppercase text-accent">
                                                Audio no disponible
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center gap-x-4 text-xs font-black uppercase mb-4">
                                            <time dateTime={podcast.published_at} className="bg-primary px-3 py-1 cartoon-border">
                                                {new Date(podcast.published_at).toLocaleDateString()}
                                            </time>
                                            <span className="text-secondary">Episodio de la tribu</span>
                                        </div>
                                        <div className="group relative">
                                            <h3 className="text-3xl font-black leading-tight text-foreground uppercase group-hover:text-secondary transition-colors">
                                                {podcast.title}
                                            </h3>
                                            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-foreground/70 font-bold">{podcast.description}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                            {podcasts.length === 0 && (
                                <div className="text-center col-span-2 cartoon-card bg-tertiary/20 border-dashed py-20">
                                    <p className="text-2xl font-black uppercase opacity-40">Aún no hay podcasts en el aire</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
