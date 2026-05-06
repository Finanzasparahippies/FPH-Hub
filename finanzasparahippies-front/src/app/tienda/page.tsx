'use client';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Layout } from '../../components/layout/Layout';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    image: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function TiendaPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products/'),
                    api.get('/products/categories/')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category?.slug === selectedCategory)
        : products;

    return (
        <Layout>
            <div className="bg-background py-16 sm:py-24 selection:bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-end md:justify-between mb-16 animate-float">
                        <div className="max-w-2xl">
                            <div className="inline-block bg-tertiary cartoon-border px-6 py-2 mb-6 rotate-[-2deg]">
                                <span className="font-black uppercase tracking-tighter text-foreground">Objetos con alma</span>
                            </div>
                            <h2 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl uppercase leading-none">
                                LA <span className="text-primary">TIENDA</span>
                            </h2>
                            <p className="mt-6 text-xl text-foreground/70 font-bold">
                                Productos seleccionados para una vida más simple y consciente.
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-3 md:mt-0">
                            <button
                                className={`btn-cartoon text-xs font-black uppercase tracking-widest ${!selectedCategory ? 'bg-secondary text-white' : 'bg-white text-foreground hover:bg-tertiary'}`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Todo
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`btn-cartoon text-xs font-black uppercase tracking-widest ${selectedCategory === category.slug ? 'bg-secondary text-white' : 'bg-white text-foreground hover:bg-tertiary'}`}
                                    onClick={() => setSelectedCategory(category.slug)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh]">
                            <div className="h-16 w-16 bg-primary cartoon-border animate-float flex items-center justify-center">
                                <div className="h-8 w-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="mt-6 font-black uppercase tracking-widest">Abriendo la tienda...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-y-12 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="group cartoon-card bg-white hover:-rotate-1 transition-all"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="w-full aspect-square cartoon-border bg-tertiary overflow-hidden group-hover:rotate-1 transition-transform relative">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-foreground/20 font-black text-2xl uppercase">
                                                Sin Imagen
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-primary cartoon-border px-3 py-1 font-black text-sm rotate-6">
                                            ${product.price}
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black uppercase leading-tight text-foreground group-hover:text-secondary transition-colors">
                                                    <Link href={`/tienda/${product.slug}`}>
                                                        {product.name}
                                                    </Link>
                                                </h3>
                                                <p className="mt-2 text-xs font-black uppercase text-secondary tracking-widest">
                                                    {product.category?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Link href={`/tienda/${product.slug}`}>
                                                <Button fullWidth variant="primary" className="py-3 text-xs uppercase font-black tracking-widest">
                                                    Ver detalles 👁
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="mt-20 text-center cartoon-card bg-tertiary/10 border-dashed py-20">
                            <p className="text-2xl font-black uppercase opacity-40">No hay tesoros en esta categoría por ahora</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
