"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import api from '../../../services/api';
import { User, Lock, Save, ShieldCheck, Mail, UserCircle } from 'lucide-react';

export default function PerfilPage() {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: ''
    });
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        re_new_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.patch('/auth/users/me/', {
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name
            });
            setMessage({ type: 'success', text: '¡Perfil actualizado con éxito! ✌️' });
        } catch (error: any) {
            console.error("Error updating profile", error);
            setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.re_new_password) {
            setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
            return;
        }
        setPassLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/auth/users/set_password/', passwords);
            setMessage({ type: 'success', text: '¡Contraseña cambiada! No la olvides. 🔐' });
            setPasswords({ current_password: '', new_password: '', re_new_password: '' });
        } catch (error: any) {
            console.error("Error changing password", error);
            setMessage({ type: 'error', text: 'Error: Verifica tu contraseña actual.' });
        } finally {
            setPassLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto selection:bg-primary py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8 animate-float">
                <div>
                    <div className="inline-block bg-secondary cartoon-border px-6 py-1 mb-4 rotate-[-2deg]">
                        <span className="font-black uppercase tracking-tighter text-white text-sm">Ajustes de la Tribu</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase tracking-tight text-foreground leading-none">
                        Tu <span className="text-primary">Perfil</span>
                    </h1>
                    <p className="mt-4 text-foreground/70 font-bold">Administra tu identidad digital y mantén tu cuenta segura.</p>
                </div>
                <Button 
                    onClick={logout} 
                    className="btn-cartoon bg-accent text-white py-4 px-8 font-black uppercase tracking-widest hover:rotate-2 transition-transform"
                >
                    Cerrar Sesión 👋
                </Button>
            </div>

            {message.text && (
                <div className={`mb-10 cartoon-card ${message.type === 'success' ? 'bg-primary' : 'bg-accent'} p-6 rotate-1 animate-wobble text-center`}>
                    <p className="font-black uppercase text-foreground">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* User Info Section */}
                <section className="cartoon-card bg-white p-8 -rotate-1">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 bg-tertiary cartoon-border flex items-center justify-center -rotate-6">
                            <UserCircle className="w-6 h-6 text-foreground stroke-[2.5]" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Información General</h2>
                    </div>
                    
                    <form onSubmit={handleInfoSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase mb-2 ml-1 opacity-50">Nombre de Usuario</label>
                            <Input 
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="bg-background cartoon-border font-bold text-lg p-4"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase mb-2 ml-1 opacity-50">Nombre</label>
                                <Input 
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                    className="bg-background cartoon-border font-bold text-lg p-4"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2 ml-1 opacity-50">Apellidos</label>
                                <Input 
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                    className="bg-background cartoon-border font-bold text-lg p-4"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase mb-2 ml-1 opacity-50">Email (No editable)</label>
                            <div className="flex items-center gap-3 p-4 bg-foreground/5 cartoon-border border-dashed">
                                <Mail className="w-5 h-5 opacity-30" />
                                <span className="font-bold text-foreground/50">{formData.email}</span>
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-cartoon bg-primary text-foreground py-5 font-black uppercase tracking-widest mt-4"
                        >
                            <Save className="w-5 h-5 mr-2 stroke-[3]" /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </form>
                </section>

                {/* Security Section */}
                <section className="cartoon-card bg-white p-8 rotate-1">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 bg-secondary cartoon-border flex items-center justify-center rotate-6">
                            <Lock className="w-6 h-6 text-white stroke-[2.5]" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Seguridad</h2>
                    </div>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase mb-2 ml-1 opacity-50">Contraseña Actual</label>
                            <Input 
                                type="password"
                                value={passwords.current_password}
                                onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
                                className="bg-background cartoon-border font-bold text-lg p-4"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="border-t-2 border-foreground/5 pt-6 space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase mb-2 ml-1 opacity-50">Nueva Contraseña</label>
                                <Input 
                                    type="password"
                                    value={passwords.new_password}
                                    onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                                    className="bg-background cartoon-border font-bold text-lg p-4"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase mb-2 ml-1 opacity-50">Repetir Nueva Contraseña</label>
                                <Input 
                                    type="password"
                                    value={passwords.re_new_password}
                                    onChange={(e) => setPasswords({...passwords, re_new_password: e.target.value})}
                                    className="bg-background cartoon-border font-bold text-lg p-4"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            disabled={passLoading}
                            className="w-full btn-cartoon bg-secondary text-white py-5 font-black uppercase tracking-widest mt-4"
                        >
                            <ShieldCheck className="w-5 h-5 mr-2 stroke-[3]" /> {passLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </Button>
                    </form>
                </section>
            </div>
        </div>
    );
}
