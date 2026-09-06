'use client';
const styles = {
  default: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400',
  success: 'bg-success-50 text-success-600 dark:bg-success-50/10 dark:text-success-500',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-50/10 dark:text-warning-500',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-50/10 dark:text-danger-500',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-50/10 dark:text-accent-400',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
