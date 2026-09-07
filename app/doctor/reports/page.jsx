'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { doctorService } from '@/services/api';
import { FileText, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';

export default function DoctorReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setReports(await doctorService.getReports()); } catch { /* fallback empty */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Reports" subtitle="Review patient medical reports with AI summaries" />
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></div>
        ) : reports.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                  <FileText size={18} className="text-primary-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-surface-800 dark:text-white">{r.name}</p>
                  <p className="text-xs text-surface-400">{r.type} — {r.date} — {r.doctorName}</p>
                </div>
                <Badge variant="primary">#{r.patientId}</Badge>
                <Badge variant={r.status === 'ready' ? 'success' : 'warning'}>{r.status}</Badge>
              </div>
              <div className="bg-primary-50/60 dark:bg-primary-500/10 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={12} className="text-primary-500" />
                  <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400">AI Report Summary</span>
                </div>
                <p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed">{r.aiSummary || 'Pending AI generation'}</p>
                <div className="flex items-start gap-2 mt-3 pt-2 border-t border-primary-200/30 dark:border-primary-800/20">
                  <AlertTriangle size={12} className="text-warning-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-surface-400">AI output requires professional clinical review before making decisions.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {!loading && reports.length === 0 && <div className="text-center py-16 text-surface-400">No reports available.</div>}
      </div>
    </div>
  );
}
