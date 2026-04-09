import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-anniversary-gold text-black hover:bg-yellow-500 shadow-lg shadow-yellow-900/20',
            secondary: 'bg-white/10 text-white hover:bg-white/20',
            outline: 'bg-transparent border border-anniversary-gold/50 text-anniversary-gold hover:bg-anniversary-gold/10',
            ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
            danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20'
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-4 py-2.5 text-sm',
            lg: 'px-6 py-3 text-base',
            icon: 'p-2'
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
