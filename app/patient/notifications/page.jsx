'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Tabs from '@/components/ui/tabs';
import Button from '@/components/ui/button';
import PageHeader from '@/components/layout/page-header';
import { notifications } from '@/lib/mock-data';
import { Bell, Calendar, FileText, Clock, MessageCircle, Settings, Trash2, CheckCircle2 } from 'lucide-react';

const iconMap = { appointment: Calendar, report: FileText, queue: Clock, doctor: MessageCircle, system: Settings };
const colorMap = {
  appointment: { iconColor: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
  report: { iconColor: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-50/10' },
  queue: { iconColor: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-50/10' },
  doctor: { iconColor: 'text-success-500', bg: 'bg-success-50 dark:bg-success-50/10' },
  system: { iconColor: 'text-surface-400', bg: 'bg-surface-100 dark:bg-surface-800' },
};

export default function Notifications() {
  const [items, setItems] = useState(notifications);
  const [tab, setTab] = useState('all');
  const tabs = [{ id: 'all', label: 'All', count: items.length }, { id: 'unread', label: 'Unread', count: items.filter(n => !n.read).length }];
  const filtered = items.filter(n => tab === 'unread' ? !n.read : true);
  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const remove = (id) => setItems(prev => prev.filter(n => n.id !== id));

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Notifications" subtitle="Stay updated with your healthcare" action={<Button variant="secondary" size="sm" onClick={markAllRead}><CheckCircle2 size={14} /> Mark all read</Button>} />
      <div className="mb-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
      <div className="grid gap-2">
        {filtered.map((n, i) => {
          const Icon = iconMap[n.type] || Bell;
          const style = colorMap[n.type] || colorMap.system;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={`p-4 ${!n.read ? 'border-l-2 border-l-primary-500' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}><Icon size={18} className={style.iconColor} /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-surface-900 dark:text-white' : 'font-medium text-surface-600 dark:text-surface-300'}`}>{n.title}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-surface-400 mt-1">{new Date(n.time).toLocaleDateString()} at {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!n.read && <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400"><CheckCircle2 size={14} /></button>}
                    <button onClick={() => remove(n.id)} className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-50/10 text-surface-400 hover:text-danger-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-16 text-surface-400">No notifications.</div>}
      </div>
    </div>
  );
}
