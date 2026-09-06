'use client';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <motion.div
        className={`${sizes[size]} rounded-full border-2 border-surface-200 dark:border-surface-700 border-t-primary-500`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
    </div>
  );
}

export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton rounded-lg h-4 ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`surface rounded-2xl p-6 space-y-3 ${className}`}>
      <SkeletonLine className="w-1/3 h-5" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-2/3" />
    </div>
  );
}
