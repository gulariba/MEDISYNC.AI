'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './sidebar';
import TopBar from './topbar';
import MobileNav from './mobile-nav';

export default function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8"
        >
          {children}
        </motion.main>
      </div>
      <MobileNav />
    </div>
  );
}
