import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'accent';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'transition-all duration-300 cursor-pointer text-center animate-wobble';
    const variants = {
        primary: 'btn-cartoon',
        secondary: 'btn-cartoon bg-secondary text-white',
        accent: 'btn-accent',
        outline: 'btn-cartoon bg-white text-foreground'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
