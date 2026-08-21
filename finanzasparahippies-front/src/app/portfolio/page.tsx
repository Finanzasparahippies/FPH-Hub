import React from "react";
import Link from "next/link";
import { Layout } from "../../components/layout/Layout";

export const metadata = {
    title: "Portfolio — Finanzas para Hippies",
    description: "Personal site — portfolio, projects and contact.",
};

export default function PortfolioPage(): React.ReactElement {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-4 sm:p-8 my-10 bg-background">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-16 pb-8 border-b-4 border-foreground border-dashed gap-6">
                    <div className="animate-float">
                        <div className="bg-primary cartoon-border px-6 py-2 rotate-[-3deg] inline-block mb-2">
                            <span className="font-black uppercase text-xs tracking-widest text-foreground">Creativo & Humano</span>
                        </div>
                        <h1 className="text-5xl font-black text-foreground uppercase leading-none">Portafolio</h1>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-3">
                        <Link href="#about" className="btn-cartoon bg-primary text-xs font-black">Sobre mí</Link>
                        <Link href="#projects" className="btn-cartoon bg-tertiary text-xs font-black">Proyectos</Link>
                        <Link href="#contact" className="btn-cartoon bg-secondary text-white text-xs font-black">Contacto</Link>
                    </nav>
                </header>

                <section className="cartoon-card bg-tertiary p-8 mb-12 rotate-1 animate-float">
                    <p className="text-3xl font-black text-foreground leading-tight uppercase">
                        ¡Hola! Soy un creador enfocado en construir <span className="text-secondary">herramientas financieras</span> humanas y simples.
                    </p>
                    <p className="mt-6 text-foreground/80 font-bold text-lg leading-relaxed">
                        Mejora tus hábitos sobre el dinero con guías concisas, código abierto y explicaciones amigables sin venderte el alma.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <section id="about" className="cartoon-card bg-white p-8 -rotate-1">
                        <div className="bg-secondary cartoon-border px-4 py-1 inline-block -rotate-2 mb-6">
                            <h2 className="text-2xl font-black text-white uppercase m-0">Acerca de mí</h2>
                        </div>
                        <p className="text-foreground font-bold text-lg leading-relaxed">
                            Construyo aplicaciones web, escribo sobre finanzas personales con empatía y lanzo utilidades open-source
                            para hacer el manejo del dinero menos intimidante. Busco una UX clara y honesta.
                        </p>
                    </section>

                    <section id="diagrams" className="cartoon-card bg-primary p-8 rotate-1 group hover:scale-105 transition-all">
                        <div className="bg-white cartoon-border px-4 py-1 inline-block rotate-2 mb-6">
                            <h2 className="text-2xl font-black text-foreground uppercase m-0">Diagramas Hippies</h2>
                        </div>
                        <p className="text-foreground font-bold text-lg mb-6 leading-relaxed">
                            Crea flujos de trabajo, embudos de venta o planes de ahorro visuales con nuestra herramienta integrada.
                        </p>
                        <Link href="/dashboard/diagramas" className="btn-cartoon bg-white text-xs font-black uppercase group-hover:bg-secondary group-hover:text-white">
                            Crear Diagrama 🛠
                        </Link>
                    </section>
                </div>

                <section id="projects" className="cartoon-card bg-white p-8 mb-12">
                    <div className="bg-primary cartoon-border px-6 py-2 inline-block rotate-1 mb-10">
                        <h2 className="text-3xl font-black text-foreground uppercase m-0">Proyectos Destacados</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { title: "Tierra Viva", desc: "WebApp para el rescate animal, abejas y venta de productos orgánicos.", color: "var(--primary)", link: "https://www.tierraviva.com.mx" },
                            { title: "GVHC", desc: "Backend con Django, Celery e IA para monitorización en tiempo real.", color: "var(--secondary)", link: "https://www.gvhc.netlify.app" },
                            { title: "Budget Starter", desc: "App minimalista para rastrear objetivos y gastos sin complicaciones.", color: "var(--tertiary)", link: "#" },
                            { title: "Open Guides", desc: "Ensayos prácticos sobre mentalidad financiera y ahorro consciente.", color: "var(--accent)", link: "#" }
                        ].map((proj, i) => (
                            <a 
                                key={i}
                                href={proj.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 cartoon-border hover:bg-background transition-all"
                            >
                                <div>
                                    <h3 className="text-2xl font-black uppercase group-hover:text-secondary transition-colors" style={{ color: proj.color }}>{proj.title}</h3>
                                    <p className="font-bold text-foreground/70">{proj.desc}</p>
                                </div>
                                <span className="mt-4 sm:mt-0 btn-cartoon py-2 px-4 text-xs font-black bg-white group-hover:bg-primary">Ver Proyecto ↗</span>
                            </a>
                        ))}
                    </div>
                </section>

                <section id="contact" className="cartoon-card bg-tertiary p-10 rotate-1 mb-20 text-center">
                    <div className="bg-white cartoon-border px-8 py-2 inline-block -rotate-2 mb-8">
                        <h2 className="text-4xl font-black text-foreground uppercase m-0 tracking-tighter">¿Hablamos?</h2>
                    </div>
                    <p className="text-foreground font-black text-2xl mb-8">
                        Para colaboraciones o un saludo hippie:
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <a href="mailto:contacto@finanzasparahippies.com" className="btn-cartoon bg-white hover:bg-secondary hover:text-white py-4 px-8 font-black uppercase tracking-widest">
                            Email ✉
                        </a>
                        <a href="https://github.com/Finanzasparahippies" target="_blank" rel="noopener noreferrer" className="btn-cartoon bg-foreground text-white hover:bg-secondary py-4 px-8 font-black uppercase tracking-widest">
                            GitHub 🐙
                        </a>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
