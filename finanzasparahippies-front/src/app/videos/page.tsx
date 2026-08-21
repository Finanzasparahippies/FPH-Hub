"use client";

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import { MediaPlayer } from '../../components/ui/MediaPlayer';

interface Video {
    id: number;
    title: string;
    slug: string;
    description: string;
    url: string;
    published_at: string;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Adjust if your API differs
                const response = await api.get('/media/videos/');
                setVideos(response.data);
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    return (
        <Layout>
            <div className="bg-background py-24 sm:py-32 selection:bg-primary">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-20 animate-float">
                        <div className="inline-block bg-secondary cartoon-border px-6 py-2 mb-6 rotate-[-2deg]">
                            <span className="font-black uppercase tracking-tighter text-white">Cine Hippie</span>
                        </div>
                        <h2 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl uppercase leading-none">
                            VIDE<span className="text-primary">OS</span>
                        </h2>
                        <p className="mt-6 text-xl leading-8 text-foreground/70 font-bold max-w-lg mx-auto">
                            Aprende visualmente. Clases, análisis y tutoriales con mucha onda.
                        </p>
                    </div>

                    {/* YouTube Featured Section */}
                    <div className="mb-20 cartoon-card bg-primary p-6 -rotate-1 max-w-4xl mx-auto text-center">
                        <div className="bg-white cartoon-border p-1 mb-6 inline-block rotate-2">
                            <span className="font-black uppercase tracking-widest text-xs px-2">Contenido en YouTube 📺</span>
                        </div>
                        <h3 className="text-3xl font-black text-foreground mb-6 uppercase">Clases y Directos Semanales</h3>
                        <p className="text-foreground/80 font-bold mb-8 max-w-xl mx-auto">
                            Suscríbete a nuestro canal para no perderte ninguna sesión en vivo y tutoriales extendidos sobre libertad financiera.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <a 
                                href="https://www.youtube.com/@FinanzasparaHippies" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-cartoon bg-secondary text-white py-4 px-8 font-black uppercase tracking-widest hover:scale-105"
                            >
                                Visitar Canal de YouTube ↗
                            </a>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh]">
                            <div className="h-16 w-16 bg-primary cartoon-border animate-float flex items-center justify-center">
                                <div className="h-8 w-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="mt-6 font-black uppercase tracking-widest">Cargando visuales...</p>
                        </div>
                    ) : (
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            {videos.map((video, index) => (
                                <article 
                                    key={video.id} 
                                    className="flex flex-col items-start justify-between cartoon-card bg-white hover:-rotate-1 transition-all group"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="relative w-full mb-8 cartoon-border bg-foreground p-1 rotate-1 group-hover:rotate-0 transition-transform">
                                        <MediaPlayer url={video.url} type="video" />
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center gap-x-4 text-xs font-black uppercase mb-4">
                                            <time dateTime={video.published_at} className="bg-tertiary px-3 py-1 cartoon-border">
                                                {new Date(video.published_at).toLocaleDateString()}
                                            </time>
                                            <span className="text-primary">Video de la tribu</span>
                                        </div>
                                        <div className="group relative">
                                            <h3 className="text-3xl font-black leading-tight text-foreground uppercase group-hover:text-primary transition-colors">
                                                {video.title}
                                            </h3>
                                            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-foreground/70 font-bold">{video.description}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                            {videos.length === 0 && (
                                <div className="text-center col-span-2 cartoon-card bg-primary/10 border-dashed py-20">
                                    <p className="text-2xl font-black uppercase opacity-40">Aún no hay videos en cartelera</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
