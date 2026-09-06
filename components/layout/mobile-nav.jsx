'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Bot, Calendar, FileText, Clock, Users, Activity, Shield } from 'lucide-react';

const patientLinks = [
  { to: '', icon: LayoutDashboard, label: 'Home' },
  { to: 'assistant', icon: Bot, label: 'AI' },
  { to: 'appointments', icon: Calendar, label: 'Book' },
  { to: 'reports', icon: FileText, label: 'Reports' },
  { to: 'queue', icon: Clock, label: 'Queue' },
];

const doctorLinks = [
  { to: '', icon: LayoutDashboard, label: 'Home' },
  { to: 'patients', icon: Users, label: 'Patients' },
  { to: 'reports', icon: FileText, label: 'Reports' },
  { to: 'appointments', icon: Calendar, label: 'Schedule' },
  { to: 'queue', icon: Activity, label: 'Queue' },
];

const adminLinks = [
  { to: '', icon: LayoutDashboard, label: 'Home' },
  { to: 'patients', icon: Users, label: 'Patients' },
  { to: 'doctors', icon: Shield, label: 'Doctors' },
  { to: 'appointments', icon: Calendar, label: 'Appts' },
  { to: 'settings', icon: Shield, label: 'Settings' },
];

export default function MobileNav() {
  const { role } = useAuth();
  const pathname = usePathname();
  const links = role === 'doctor' ? doctorLinks : role === 'admin' ? adminLinks : patientLinks;
  const prefix = `/${role}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-t border-surface-200/60 dark:border-surface-800 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {links.map(link => {
          const href = link.to === '' ? prefix : `${prefix}/${link.to}`;
          const active = link.to === '' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={link.to}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-[10px] font-medium transition-colors ${
                active ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500'
              }`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
