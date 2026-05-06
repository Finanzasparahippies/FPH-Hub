"use client";

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Link from 'next/link';
import { Layout } from '../../components/layout/Layout';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    published_at: string;
    author: {
        username: string;
        first_name: string;
        last_name: string;
    };
}

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/blog/posts/');
                setPosts(response.data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background">
                    <div className="h-20 w-20 bg-primary cartoon-border animate-float flex items-center justify-center">
                        <div className="h-10 w-10 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 font-black uppercase tracking-widest animate-pulse">Buscando sabiduría...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-background py-24 sm:py-32 selection:bg-primary">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-20 animate-float">
                        <div className="inline-block bg-tertiary cartoon-border px-6 py-2 mb-6 rotate-[-2deg]">
                            <span className="font-black uppercase tracking-tighter text-foreground">El rincón del saber</span>
                        </div>
                        <h2 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl uppercase leading-none">
                            BLOG <br /> <span className="text-secondary">HIPPIE</span>
                        </h2>
                        <p className="mt-6 text-xl leading-8 text-foreground/70 font-bold max-w-lg mx-auto">
                            Aprende sobre finanzas de una manera diferente, sin traje ni corbata.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <article 
                                key={post.id} 
                                className="flex flex-col items-start justify-between cartoon-card bg-white hover:-rotate-1 transition-all group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative w-full cartoon-border overflow-hidden mb-6 bg-tertiary rotate-1 group-hover:rotate-0 transition-transform">
                                    {post.featured_image ? (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="aspect-[16/9] w-full object-cover sm:aspect-[2/1] lg:aspect-[3/2] mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="aspect-[16/9] w-full bg-primary/20 flex items-center justify-center">
                                            <span className="font-black text-primary uppercase opacity-20 text-4xl">FPH</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full">
                                    <div className="flex items-center gap-x-4 text-xs font-black uppercase mb-4">
                                        <time dateTime={post.published_at} className="bg-tertiary px-3 py-1 cartoon-border">
                                            {new Date(post.published_at).toLocaleDateString()}
                                        </time>
                                        <span className="text-secondary">Por la tribu</span>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="text-3xl font-black leading-tight text-foreground group-hover:text-secondary transition-colors uppercase">
                                            <Link href={`/blog/${post.slug}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="mt-5 line-clamp-3 text-base leading-relaxed text-foreground/70 font-bold">{post.excerpt}</p>
                                    </div>
                                    <div className="relative mt-8 flex items-center gap-x-4 border-t-2 border-foreground/10 pt-6">
                                        <div className="h-10 w-10 cartoon-border bg-primary overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center font-black uppercase text-foreground">
                                                {post.author?.first_name?.[0] || 'H'}
                                            </div>
                                        </div>
                                        <div className="text-sm leading-6">
                                            <p className="font-black text-foreground uppercase tracking-tight">
                                                {post.author?.first_name} {post.author?.last_name}
                                            </p>
                                            <p className="text-secondary font-bold text-xs uppercase">Escritor de la tribu</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
