'use client';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Bell, Search, Menu } from 'lucide-react';
import Avatar from '@/components/ui/avatar';

export default function TopBar({ onMenuClick }) {
  const { dark, toggle } = useTheme();
  const { user, role } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/60 dark:border-surface-800">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <Menu size={20} className="text-surface-600 dark:text-surface-400" />
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/60 w-72">
          <Search size={16} className="text-surface-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none outline-none text-sm text-surface-700 dark:text-surface-300 placeholder:text-surface-400 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggle} className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          {dark ? <Sun size={18} className="text-surface-400" /> : <Moon size={18} className="text-surface-500" />}
        </button>
        <button onClick={() => router.push(`/${role}/notifications`)} className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <Bell size={18} className="text-surface-500 dark:text-surface-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-surface-200 dark:border-surface-700">
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-surface-800 dark:text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-surface-400 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
