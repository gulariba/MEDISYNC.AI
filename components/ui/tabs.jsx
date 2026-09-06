'use client';
import { motion } from 'framer-motion';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800/60 rounded-xl">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            active === t.id
              ? 'text-surface-900 dark:text-white'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
          }`}
        >
          {active === t.id && (
            <motion.div
              layoutId="tab-bg"
              className="absolute inset-0 bg-white dark:bg-surface-700 rounded-lg shadow-sm"
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />
          )}
          <span className="relative z-10">{t.label}</span>
          {t.count !== undefined && (
            <span className={`relative z-10 text-xs px-1.5 py-0.5 rounded-md ${
              active === t.id ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400' : 'bg-surface-200/60 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
            }`}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
