import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-foreground border-3 border-foreground shadow-cartoon hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_var(--foreground)]",
    secondary: "bg-secondary text-white border-3 border-foreground shadow-cartoon hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_var(--foreground)]",
    accent: "bg-accent text-white border-3 border-foreground shadow-cartoon hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_var(--foreground)]",
    outline: "bg-transparent text-foreground border-3 border-foreground hover:bg-foreground/5",
    ghost: "bg-transparent text-foreground hover:bg-foreground/5 border-none shadow-none",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-lg",
    md: "px-8 py-4 text-xs rounded-xl",
    lg: "px-10 py-5 text-sm rounded-2xl",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
