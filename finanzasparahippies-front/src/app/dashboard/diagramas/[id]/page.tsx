"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import api from '../../../../services/api';
import { MermaidEditor } from '../../../../components/tools/MermaidEditor';


export default function DiagramEditorPage({ params }: { params: { id: string } }) {
    const [diagram, setDiagram] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchDiagram = async () => {
            try {
                const response = await api.get(`/diagrams/${params.id}/`);
                setDiagram(response.data);
            } catch (error) {
                console.error("Error fetching diagram", error);
                alert("No se pudo cargar el diagrama.");
                router.push('/dashboard/diagramas');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchDiagram();
        }
    }, [params.id, router]);

    const handleSave = async (title: string, code: string) => {
        setSaving(true);
        try {
            await api.patch(`/diagrams/${params.id}/`, {
                title,
                mermaid_code: code,
            });
        } catch (error) {
            console.error("Error saving diagram", error);
            alert("Error al guardar el diagrama.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="h-16 w-16 bg-primary cartoon-border animate-float flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 font-black uppercase tracking-widest">Abriendo el laboratorio...</p>
            </div>
        );
    }

    if (!diagram) {
        return null; 
    }

    return (
        <div className="flex flex-col h-[calc(100vh-13rem)] selection:bg-primary overflow-hidden">
            <div className="flex-1 overflow-hidden">
                <MermaidEditor 
                    initialTitle={diagram.title}
                    initialCode={diagram.mermaid_code}
                    onSave={handleSave}
                    isSaving={saving}
                />
            </div>
        </div>
    );
}
