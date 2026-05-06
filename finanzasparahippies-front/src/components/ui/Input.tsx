import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground opacity-60 ml-4">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-6 py-4 bg-background border-3 border-foreground rounded-2xl 
          focus:border-primary outline-none transition-all font-bold text-foreground
          placeholder:opacity-30 placeholder:font-medium
          ${error ? 'border-accent' : 'border-foreground'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-bold text-accent ml-4 mt-1 uppercase tracking-wider">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
