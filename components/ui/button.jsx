'use client';
import { motion } from 'framer-motion';

const variants = {
  primary: 'btn-primary text-white',
  glow: 'btn-glow text-white',
  secondary: 'bg-white text-surface-700 border border-surface-200 hover:bg-surface-50 dark:bg-surface-800 dark:text-surface-200 dark:border-surface-700 dark:hover:bg-surface-700/80',
  ghost: 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800/60',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
  accent: 'bg-accent-500 text-white hover:bg-accent-600',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
