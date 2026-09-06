'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Bot, Calendar, FileText, Pill, Users,
  Clock, Bell, Settings, LogOut, ChevronLeft, ChevronRight, Shield, Activity
} from 'lucide-react';

const patientLinks = [
  { to: '', icon: LayoutDashboard, label: 'Dashboard' },
  { to: 'assistant', icon: Bot, label: 'AI Assistant' },
  { to: 'appointments', icon: Calendar, label: 'Appointments' },
  { to: 'reports', icon: FileText, label: 'Reports' },
  { to: 'prescriptions', icon: Pill, label: 'Prescriptions' },
  { to: 'queue', icon: Clock, label: 'Queue' },
  { to: 'notifications', icon: Bell, label: 'Notifications' },
];

const doctorLinks = [
  { to: '', icon: LayoutDashboard, label: 'Dashboard' },
  { to: 'patients', icon: Users, label: 'Patients' },
  { to: 'reports', icon: FileText, label: 'Reports' },
  { to: 'appointments', icon: Calendar, label: 'Appointments' },
  { to: 'queue', icon: Activity, label: 'Queue' },
];

const adminLinks = [
  { to: '', icon: LayoutDashboard, label: 'Dashboard' },
  { to: 'patients', icon: Users, label: 'Patients' },
  { to: 'doctors', icon: Shield, label: 'Doctors' },
  { to: 'appointments', icon: Calendar, label: 'Appointments' },
  { to: 'reports', icon: FileText, label: 'Reports' },
  { to: 'queue', icon: Activity, label: 'Queue' },
  { to: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { role, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const links = role === 'doctor' ? doctorLinks : role === 'admin' ? adminLinks : patientLinks;
  const prefix = `/${role}`;

  const handleLogout = () => { logout(); router.push('/'); };

  const isActive = (to) => {
    const href = to === '' ? prefix : `${prefix}/${to}`;
    if (to === '') return pathname === href;
    return pathname.startsWith(href);
  };

  const linkClass = (to) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(to)
        ? 'nav-active text-primary-600 dark:text-primary-400'
        : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800/60'
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-surface-200/60 dark:border-surface-800 bg-white dark:bg-surface-900 transition-all duration-300 z-20 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-100 dark:border-surface-800 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">M</div>
            {!collapsed && <span className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">MediSync<span className="text-primary-500">.ai</span></span>}
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(link => (
            <Link key={link.to} href={link.to === '' ? prefix : `${prefix}/${link.to}`} className={linkClass(link.to)}>
              <link.icon size={20} className="shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t border-surface-100 dark:border-surface-800 pt-3">
          <Link href={`${prefix}/profile`} className={linkClass('profile')}>
            <Settings size={20} className="shrink-0" />
            {!collapsed && <span>Profile & Settings</span>}
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-50/10 transition-colors">
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full surface-elevated flex items-center justify-center text-surface-400 hover:text-surface-600 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm" onClick={onClose} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-[280px] h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col"
            >
              <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-100 dark:border-surface-800">
                <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm">M</div>
                <span className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">MediSync<span className="text-primary-500">.ai</span></span>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {links.map(link => (
                  <Link key={link.to} href={link.to === '' ? prefix : `${prefix}/${link.to}`} className={linkClass(link.to)} onClick={onClose}>
                    <link.icon size={20} className="shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="px-3 pb-4 space-y-1 border-t border-surface-100 dark:border-surface-800 pt-3">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-50/10 transition-colors">
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
