"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Network } from 'lucide-react';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';

interface Diagram {
    id: number;
    title: string;
    description: string;
    updated_at: string;
}

export default function DiagramasListPage() {
    const [diagrams, setDiagrams] = useState<Diagram[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchDiagrams = async () => {
        try {
            const response = await api.get('/diagrams/');
            setDiagrams(response.data);
        } catch (error) {
            console.error("Error fetching diagrams", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiagrams();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este diagrama?')) return;
        try {
            await api.delete(`/diagrams/${id}/`);
            fetchDiagrams();
        } catch (error) {
            console.error("Error deleting diagram", error);
            alert("No se pudo eliminar el diagrama.");
        }
    };

    const handleCreateNew = async () => {
        try {
            const response = await api.post('/diagrams/', {
                title: 'Nuevo Diagrama',
                mermaid_code: 'graph TD\n    A[Inicio] --> B[Fin]',
            });
            router.push(`/dashboard/diagramas/${response.data.id}`);
        } catch (error) {
            console.error("Error creating diagram", error);
            alert("Error al crear el diagrama.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto selection:bg-primary">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-6 animate-float">
                <div>
                    <div className="inline-block bg-primary cartoon-border px-6 py-1 mb-4 rotate-[-2deg]">
                        <span className="font-black uppercase tracking-tighter text-foreground text-sm">Laboratorio Visual</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase tracking-tight text-foreground leading-none">
                        Tus <span className="text-secondary">Diagramas</span>
                    </h1>
                    <p className="mt-4 text-foreground/70 font-bold max-w-md">Diseña flujos de trabajo con la simplicidad de Mermaid y la vibra de la tribu.</p>
                </div>
                <Button 
                    onClick={handleCreateNew} 
                    className="btn-cartoon bg-primary text-foreground py-6 px-8 text-lg font-black uppercase tracking-widest"
                >
                    <Plus className="w-6 h-6 mr-2 stroke-[3]" /> Nuevo Diagrama
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="h-16 w-16 bg-tertiary cartoon-border animate-float flex items-center justify-center">
                        <div className="h-8 w-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-6 font-black uppercase tracking-widest">Cargando planos...</p>
                </div>
            ) : diagrams.length === 0 ? (
                <div className="cartoon-card bg-white p-16 text-center border-dashed flex flex-col items-center justify-center animate-float">
                    <div className="h-24 w-24 bg-tertiary cartoon-border flex items-center justify-center mb-8 rotate-12">
                        <Network className="w-12 h-12 text-foreground stroke-[2.5]" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground mb-4 uppercase">Aún no hay diagramas</h3>
                    <p className="text-foreground/60 font-bold mb-10 max-w-sm">Empieza a diseñar tu primer flujo hippie ahora mismo.</p>
                    <Button 
                        onClick={handleCreateNew} 
                        variant="secondary" 
                        className="py-5 px-10 text-lg font-black uppercase tracking-widest"
                    >
                        Crear el primero 🚀
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {diagrams.map((diagram, index) => (
                        <div 
                            key={diagram.id} 
                            className="cartoon-card bg-white p-8 flex flex-col justify-between group hover:-rotate-1 transition-all"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-tertiary cartoon-border flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
                                        <Network className="w-6 h-6 text-foreground stroke-[2.5]" />
                                    </div>
                                    <span className="bg-primary/20 text-secondary font-black text-[10px] uppercase tracking-widest px-2 py-1 cartoon-border">
                                        {new Date(diagram.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black mb-2 uppercase leading-tight group-hover:text-secondary transition-colors">
                                    {diagram.title}
                                </h3>
                                <p className="text-sm text-foreground/50 font-bold mb-6 italic">
                                    Modificado recientemente
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-4 pt-6 border-t-2 border-foreground/10">
                                <Link href={`/dashboard/diagramas/${diagram.id}`} className="flex-1">
                                    <Button className="w-full btn-cartoon bg-secondary text-white py-4 font-black uppercase text-xs tracking-widest">
                                        <Edit className="w-4 h-4 mr-2" /> Editar
                                    </Button>
                                </Link>
                                <Button 
                                    onClick={() => handleDelete(diagram.id)} 
                                    className="btn-cartoon bg-accent text-white py-4 px-4 font-black"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
