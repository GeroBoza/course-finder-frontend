import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export default function Button({
    children,
    href,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
    const variants = {
        primary:
            'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-lg hover:shadow-xl',
        secondary:
            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500 shadow-md hover:shadow-lg',
        outline:
            'border-2 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 focus:ring-orange-500 shadow-sm hover:shadow-md',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={classes}>
            {children}
        </button>
    );
}

