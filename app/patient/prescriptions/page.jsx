'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Tabs from '@/components/ui/tabs';
import PageHeader from '@/components/layout/page-header';
import { prescriptions } from '@/lib/mock-data';
import { Pill, Calendar, Info } from 'lucide-react';

export default function Prescriptions() {
  const [tab, setTab] = useState('active');
  const myRx = prescriptions.filter(p => p.patientId === 'p1');
  const tabs = [{ id: 'active', label: 'Active', count: myRx.filter(p => p.status === 'active').length }, { id: 'completed', label: 'Completed', count: myRx.filter(p => p.status === 'completed').length }];
  const filtered = myRx.filter(p => p.status === tab);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Prescriptions" subtitle="Your active and past medications" />
      <div className="mb-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
      <div className="grid gap-3">
        {filtered.map((rx, i) => (
          <motion.div key={rx.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-5"><div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0"><Pill size={20} className="text-primary-500" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="text-sm font-semibold text-surface-800 dark:text-white">{rx.medicine}</p><Badge variant={rx.status === 'active' ? 'success' : 'default'}>{rx.status}</Badge></div>
                <p className="text-xs text-surface-400 mt-0.5">{rx.dosage} — {rx.frequency} — {rx.duration}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-surface-500 dark:text-surface-400">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {rx.date}</span>
                  <span className="flex items-center gap-1"><Info size={12} /> {rx.instructions}</span>
                  <span>Dr. {rx.doctorName.replace('Dr. ', '')}</span>
                </div>
              </div>
            </div></Card>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-16 text-surface-400">No {tab} prescriptions.</div>}
      </div>
    </div>
  );
}
