import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-anniversary-gold transition-colors">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'block w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-anniversary-gold transition-all duration-200 focus:ring-1 focus:ring-anniversary-gold/20',
                            leftIcon && 'pl-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
