'use client';
export function Input({ label, className = '', ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 dark:bg-surface-800/60 dark:border-surface-700 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({ label, options = [], className = '', ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{label}</label>}
      <select
        className={`w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 dark:bg-surface-800/60 dark:border-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${className}`}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 dark:bg-surface-800/60 dark:border-surface-700 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
