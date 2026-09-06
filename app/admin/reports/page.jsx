'use client';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { reports } from '@/lib/mock-data';
import { FileText } from 'lucide-react';

export default function AdminReports() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Reports" subtitle="All medical reports across the system" />
      <div className="grid gap-3">
        {reports.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                  <FileText size={18} className="text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 dark:text-white">{r.name}</p>
                  <p className="text-xs text-surface-400">{r.type} — {r.date} — {r.doctorName}</p>
                </div>
                <Badge variant="primary">{r.patientId.toUpperCase()}</Badge>
                <Badge variant={r.status === 'ready' ? 'success' : 'warning'}>{r.status}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
