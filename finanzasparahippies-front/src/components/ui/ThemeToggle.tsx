'use client';
import React, { useEffect, useState } from 'react';

export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 cartoon-border bg-white dark:bg-primary text-foreground hover:bg-tertiary transition-all animate-wobble flex items-center justify-center w-10 h-10"
            aria-label="Toggle Theme"
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
};
