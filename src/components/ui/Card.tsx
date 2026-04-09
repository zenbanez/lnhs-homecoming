import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'outline' | 'flat';
    hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass', hoverable = false, children, ...props }, ref) => {
        const variants = {
            glass: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl shadow-black/20',
            outline: 'bg-transparent border border-anniversary-gold/20 shadow-none',
            flat: 'bg-black/40 border border-white/5 shadow-none'
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl p-6 transition-all duration-300',
                    variants[variant],
                    hoverable && 'hover:bg-white/[0.08] hover:border-anniversary-gold/30 hover:-translate-y-1 hover:shadow-anniversary-gold/5',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
