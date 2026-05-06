"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
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
        console.log("AuthProvider: Initial check...");
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem("access");
        console.log("checkUserLoggedIn: Token found?", !!token);
        
        if (token) {
            try {
                const response = await api.get("/auth/users/me/");
                console.log("checkUserLoggedIn: User data received:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("checkUserLoggedIn: User validation failed", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            console.log("Login: Attempting login for", email);
            const response = await api.post("/auth/jwt/create/", { email, password });
            
            if (response.status === 200) {
                console.log("Login: Success! Saving tokens...");
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                
                // Wait for the user data to be fetched before redirecting
                console.log("Login: Fetching user details...");
                const userResponse = await api.get("/auth/users/me/");
                console.log("Login: User details received:", userResponse.data);
                setUser(userResponse.data);
                
                console.log("Login: Redirecting to dashboard...");
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login: failed", error);
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
                router.push("/login");
            }
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        console.log("Logout: Cleaning session...");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
