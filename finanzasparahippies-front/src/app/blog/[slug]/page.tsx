"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface PostDetail {
    id: number;
    title: string;
    content: string;
    featured_image: string | null;
    published_at: string;
    author: {
        username: string;
        first_name: string;
        last_name: string;
    };
}
import { Layout } from '../../../components/layout/Layout';

export default function BlogPostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        const fetchPost = async () => {
            try {
                const response = await api.get(`/blog/posts/${slug}/`);
                setPost(response.data);
            } catch (error) {
                console.error("Failed to fetch post", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="h-16 w-16 bg-primary cartoon-border animate-float flex items-center justify-center">
                        <div className="h-8 w-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 font-black uppercase tracking-widest animate-pulse">Trayendo sabiduría...</p>
                </div>
            </Layout>
        );
    }

    if (!post) {
        return (
            <Layout>
                <div className="text-center py-20 cartoon-card bg-accent/10 border-dashed">
                    <p className="text-2xl font-black uppercase text-accent">Sabiduría no encontrada</p>
                    <Link href="/blog" className="mt-6 inline-block btn-cartoon bg-white">Volver al blog</Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-background py-16 selection:bg-primary">
                <article className="mx-auto max-w-4xl">
                    <div className="text-center mb-16 animate-float">
                        <div className="inline-block bg-primary cartoon-border px-6 py-2 mb-6 rotate-[-1deg]">
                            <time dateTime={post.published_at} className="font-black uppercase tracking-widest text-foreground">
                                {new Date(post.published_at).toLocaleDateString()}
                            </time>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-7xl uppercase leading-none px-4">
                            {post.title}
                        </h1>
                        <p className="mt-6 text-secondary font-black uppercase tracking-tight">
                            Por {post.author?.first_name} {post.author?.last_name}
                        </p>
                    </div>

                    {post.featured_image && (
                        <div className="cartoon-border bg-tertiary p-2 rotate-1 mb-16 overflow-hidden">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full aspect-[21/9] object-cover cartoon-border mix-blend-multiply"
                            />
                        </div>
                    )}

                    <div className="cartoon-card bg-white p-8 sm:p-12 -rotate-1 relative z-10">
                        <div
                            className="max-w-none prose prose-2xl prose-headings:font-black prose-headings:uppercase prose-p:font-bold prose-p:text-foreground/80 prose-strong:text-foreground prose-a:text-secondary prose-a:decoration-wavy prose-a:decoration-2"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    <div className="mt-20 text-center">
                        <Link href="/blog" className="btn-cartoon bg-secondary text-white py-4 px-10 font-black uppercase tracking-widest text-lg">
                            ← Volver a la tribu
                        </Link>
                    </div>
                </article>
            </div>
        </Layout>
    );
}
