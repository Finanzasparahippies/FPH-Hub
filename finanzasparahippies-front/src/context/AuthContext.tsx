"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, re_password: string, username: string, turnstile_token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem("access");
        if (token) {
            try {
                const response = await api.get("/auth/users/me/");
                setUser(response.data);
            } catch (error) {
                console.error("User validation failed", error);
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post("/auth/jwt/create/", { email, password });
            if (response.status === 200) {
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                await checkUserLoggedIn();
                router.push("/blog");
            }
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (email: string, password: string, re_password: string, username: string, turnstile_token: string) => {
        try {
            const response = await api.post("/auth/users/", {
                email,
                password,
                re_password,
                username,
                turnstile_token
            });
            if (response.status === 201) {
                // Automatically login or redirect to login? 
                // Let's redirect to login for now
                router.push("/login");
            }
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        router.push("/login"); // or home
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
