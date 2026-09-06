'use client';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
