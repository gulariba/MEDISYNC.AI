'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { adminService } from '@/services/api';
import { FileText, Loader2 } from 'lucide-react';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setReports(await adminService.getReports()); } catch { /* empty */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Reports" subtitle="All medical reports across the system" />
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></div>
        ) : reports.map((r, i) => (
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
                <Badge variant="primary">#{r.patientId}</Badge>
                <Badge variant={r.status === 'ready' ? 'success' : 'warning'}>{r.status}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
        {!loading && reports.length === 0 && <div className="text-center py-16 text-surface-400">No reports in the system.</div>}
      </div>
    </div>
  );
}
