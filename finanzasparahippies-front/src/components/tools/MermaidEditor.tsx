"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { Save, Download, RefreshCw, Image as ImageIcon, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface MermaidEditorProps {
    initialTitle?: string;
    initialCode?: string;
    onSave: (title: string, code: string) => void;
    isSaving?: boolean;
}

const DEFAULT_CODE = `graph TD
    A[Idea] -->|Analizar| B(Plan)
    B --> C{Viable?}
    C -->|Sí| D[Desarrollar]
    C -->|No| E[Descartar]
    D --> F[Lanzar]`;

export const MermaidEditor: React.FC<MermaidEditorProps> = ({ 
    initialTitle = 'Nuevo Diagrama', 
    initialCode = DEFAULT_CODE, 
    onSave, 
    isSaving = false 
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [code, setCode] = useState(initialCode);
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
    const [svgContent, setSvgContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const svgContainerRef = useRef<HTMLDivElement>(null);

    // Initialize mermaid
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                primaryColor: '#b9f1d6', // tertiary (mint) for nodes
                primaryTextColor: '#0d0f36', // foreground
                primaryBorderColor: '#0d0f36',
                lineColor: '#0d0f36',
                secondaryColor: '#69d2cd', // primary (turquoise)
                tertiaryColor: '#ffffff',
                fontFamily: 'Luckiest Guy, cursive',
                edgeLabelBackground: '#ffffff', // High contrast for "Sí/No"
                nodeBorder: '3px'
            },
            securityLevel: 'loose',
            flowchart: { 
                curve: 'basis',
                htmlLabels: true,
                useMaxWidth: false // Crucial for zoom/pan
            }
        });
    }, []);

    const renderDiagram = useCallback(async () => {
        if (!code.trim()) {
            setSvgContent('');
            setError(null);
            return;
        }
        try {
            // Generate a unique ID for the diagram
            const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
            const { svg } = await mermaid.render(id, code);
            setSvgContent(svg);
            setError(null);
        } catch (err: any) {
            // Error handling: mermaid throws strings or errors
            setError(err?.message || "Error de sintaxis en el diagrama");
        }
    }, [code]);

    // Render automatically when code changes (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            renderDiagram();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [code, renderDiagram]);

    const handleExportSVG = () => {
        if (!svgContent) return;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '_')}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportPNG = () => {
        if (!svgContainerRef.current) return;
        
        const svgElement = svgContainerRef.current.querySelector('svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        // Convert SVG string to base64
        const svg64 = btoa(unescape(encodeURIComponent(svgData)));
        const b64Start = 'data:image/svg+xml;base64,';
        const image64 = b64Start + svg64;

        img.onload = function() {
            // Set canvas size to match SVG
            canvas.width = img.width * 2; // High DPI
            canvas.height = img.height * 2;
            
            if (ctx) {
                // Background color (white instead of transparent)
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw image scaled up
                ctx.scale(2, 2);
                ctx.drawImage(img, 0, 0);
                
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `${title.replace(/\s+/g, '_')}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };
        img.src = image64;
    };

    return (
        <div className="flex flex-col h-full bg-background cartoon-card overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b-4 border-foreground bg-primary gap-6 selection:bg-secondary">
                <div className="flex-1 w-full max-w-lg animate-float">
                    <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Título del diagrama"
                        className="font-black text-2xl bg-white cartoon-border py-4 px-6 uppercase tracking-tight focus:translate-x-1 focus:translate-y-1 transition-transform"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button 
                        variant="secondary" 
                        onClick={() => setIsEditorCollapsed(!isEditorCollapsed)} 
                        className="btn-cartoon bg-white py-3 px-4 text-xs font-black"
                        title={isEditorCollapsed ? "Mostrar Editor" : "Ocultar Editor"}
                    >
                        {isEditorCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        <span className="ml-2 hidden sm:inline">{isEditorCollapsed ? 'Editor' : 'Colapsar'}</span>
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick={renderDiagram} 
                        className="btn-cartoon bg-white py-3 px-4 text-xs font-black"
                    >
                        <RefreshCw className="w-4 h-4 mr-2 stroke-[3]" /> Actualizar
                    </Button>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={handleExportSVG} 
                            disabled={!svgContent} 
                            className="btn-cartoon bg-white py-3 px-4 text-xs font-black"
                        >
                            <Download className="w-4 h-4 mr-2" /> SVG
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleExportPNG} 
                            disabled={!svgContent} 
                            className="btn-cartoon bg-white py-3 px-4 text-xs font-black"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" /> PNG
                        </Button>
                    </div>
                    <Button 
                        onClick={() => onSave(title, code)} 
                        disabled={isSaving || !code.trim() || !title.trim()}
                        className="btn-cartoon bg-secondary text-white py-4 px-8 font-black uppercase tracking-widest"
                    >
                        <Save className="w-4 h-4 mr-2 stroke-[3]" /> {isSaving ? 'Guardando...' : 'Guardar ✨'}
                    </Button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col lg:flex-row flex-1 bg-background p-6 gap-6 overflow-hidden relative">
                {/* Editor Pane */}
                <div className={`transition-all duration-500 ease-in-out ${isEditorCollapsed ? 'w-0 opacity-0 pointer-events-none translate-x-[-100%]' : 'w-full lg:w-1/2 opacity-100 translate-x-0'} flex flex-col cartoon-card bg-white relative selection:bg-tertiary`}>
                    <div className="bg-secondary text-white text-[10px] font-black px-4 py-2 uppercase flex justify-between items-center border-b-2 border-foreground whitespace-nowrap">
                        <span className="tracking-widest">Código Mermaid</span>
                        <a href="https://mermaid.js.org/syntax/flowchart.html" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            Guía de Sintaxis ↗
                        </a>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 w-full p-8 font-mono text-base resize-none focus:outline-none bg-transparent font-bold text-foreground/80 leading-relaxed"
                        spellCheck="false"
                        placeholder="graph TD\n    A[Inicio] --> B[Fin]..."
                    />
                </div>

                {/* Preview Pane */}
                <div className={`transition-all duration-500 ease-in-out ${isEditorCollapsed ? 'w-full' : 'w-full lg:w-1/2'} flex flex-col cartoon-card bg-white relative overflow-hidden`}>
                    <div className="bg-tertiary text-foreground text-[10px] font-black px-4 py-2 uppercase flex justify-between items-center border-b-2 border-foreground z-10">
                        <span className="tracking-widest">Vista Previa Interactiva</span>
                        <div className="flex items-center gap-2">
                            {error && <span className="bg-accent text-white px-2 py-0.5 cartoon-border text-[8px]">Error de vibra</span>}
                            <span className="text-[8px] opacity-50 uppercase">Usa el mouse para mover/zoom</span>
                        </div>
                    </div>
                    
                    <div 
                        className="flex-1 flex flex-col items-center justify-center relative min-h-0 w-full bg-[#f8fafc] overflow-hidden"
                        ref={previewRef}
                    >
                        {error ? (
                            <div className="cartoon-card bg-accent/10 text-accent p-8 max-w-lg border-dashed font-mono text-sm whitespace-pre-wrap animate-wobble z-10">
                                <strong className="font-black uppercase block mb-4">¡Opps! La vibra no fluye:</strong>
                                {error}
                            </div>
                        ) : (
                            <TransformWrapper
                                initialScale={1}
                                minScale={0.2}
                                maxScale={3}
                                centerOnInit={true}
                            >
                                {({ zoomIn, zoomOut, resetTransform }) => (
                                    <>
                                        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
                                            <button onClick={() => zoomIn()} className="p-1.5 bg-white cartoon-border hover:bg-primary transition-colors shadow-cartoon-sm" title="Zoom In">
                                                <ZoomIn className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => zoomOut()} className="p-1.5 bg-white cartoon-border hover:bg-primary transition-colors shadow-cartoon-sm" title="Zoom Out">
                                                <ZoomOut className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => resetTransform()} className="p-1.5 bg-white cartoon-border hover:bg-secondary hover:text-white transition-colors shadow-cartoon-sm" title="Reset View">
                                                <Maximize2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <TransformComponent wrapperClass="!w-full !h-full cursor-grab active:cursor-grabbing">
                                            <div 
                                                ref={svgContainerRef}
                                                className="mermaid-preview-container p-20"
                                                dangerouslySetInnerHTML={{ __html: svgContent }}
                                            />
                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                        )}
                        
                        {!code.trim() && !error && (
                            <div className="text-foreground/20 font-black text-4xl uppercase tracking-tighter text-center opacity-50 rotate-[-5deg]">
                                El lienzo está listo <br/> <span className="text-sm tracking-widest opacity-40">Escribe algo increíble</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
