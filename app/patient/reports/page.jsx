'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Tabs from '@/components/ui/tabs';
import Modal from '@/components/ui/modal';
import PageHeader from '@/components/layout/page-header';
import { reports } from '@/lib/mock-data';
import { FileText, Search, Sparkles, AlertTriangle, Download } from 'lucide-react';

const myReports = reports.filter(r => r.patientId === 'p1');

export default function Reports() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAI, setShowAI] = useState(true);

  const tabs = [
    { id: 'all', label: 'All', count: myReports.length },
    { id: 'Blood', label: 'Blood', count: myReports.filter(r => r.type === 'Blood').length },
    { id: 'Imaging', label: 'Imaging', count: myReports.filter(r => r.type === 'Imaging').length },
    { id: 'ECG', label: 'ECG', count: myReports.filter(r => r.type === 'ECG').length },
  ];
  const filtered = myReports.filter(r => tab === 'all' || r.type === tab).filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Medical Reports" subtitle="View and manage your health records" />
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 flex-1 max-w-sm"><Search size={16} className="text-surface-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." className="bg-transparent border-none outline-none text-sm text-surface-700 dark:text-surface-300 placeholder:text-surface-400 w-full" /></div>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>
      <div className="grid gap-3">
        {filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-5 cursor-pointer" hover onClick={() => setSelected(r)}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0"><FileText size={20} className="text-primary-500" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-surface-800 dark:text-white truncate">{r.name}</p><p className="text-xs text-surface-400">{r.hospital} — {r.doctorName}</p></div>
                <div className="hidden sm:block text-right"><p className="text-sm font-medium text-surface-700 dark:text-surface-200">{r.date}</p><Badge variant={r.status === 'ready' ? 'success' : 'warning'}>{r.status}</Badge></div>
                <Badge variant="primary">{r.type}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-16 text-surface-400">No reports found.</div>}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} size="xl">
        {selected && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-surface-800 dark:text-white mb-3 flex items-center gap-2"><FileText size={16} className="text-primary-500" /> Original Report</h4>
              <div className="bg-surface-50 dark:bg-surface-800/60 rounded-xl p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-surface-400 text-xs">Date</span><p className="font-medium text-surface-800 dark:text-white">{selected.date}</p></div>
                  <div><span className="text-surface-400 text-xs">Type</span><p className="font-medium text-surface-800 dark:text-white">{selected.type}</p></div>
                  <div><span className="text-surface-400 text-xs">Doctor</span><p className="font-medium text-surface-800 dark:text-white">{selected.doctorName}</p></div>
                  <div><span className="text-surface-400 text-xs">Status</span><Badge variant="success" className="mt-0.5">{selected.status}</Badge></div>
                </div>
                <div className="border-t border-surface-200 dark:border-surface-700 pt-3"><p className="text-xs text-surface-400 mb-1">Findings</p><p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed">{selected.findings}</p></div>
                <Button variant="secondary" size="sm" className="mt-2"><Download size={14} /> Download PDF</Button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-surface-800 dark:text-white flex items-center gap-2"><Sparkles size={16} className="text-accent-500" /> AI Summary</h4>
                <button onClick={() => setShowAI(!showAI)} className="text-xs font-medium text-primary-500 hover:underline">{showAI ? 'Hide' : 'Show'}</button>
              </div>
              {showAI ? (
                <div className="bg-primary-50/60 dark:bg-primary-500/10 rounded-xl p-5 space-y-3">
                  <p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed">{selected.aiSummary}</p>
                  <div className="flex items-start gap-2 pt-2 border-t border-primary-200/40 dark:border-primary-800/30"><AlertTriangle size={14} className="text-warning-500 shrink-0 mt-0.5" /><p className="text-xs text-surface-400 leading-relaxed">AI-generated summaries are for informational support and must be reviewed by a qualified healthcare professional.</p></div>
                </div>
              ) : (<div className="bg-surface-100 dark:bg-surface-800/40 rounded-xl p-8 text-center text-surface-400 text-sm">AI summary is hidden. Click &quot;Show&quot; to view.</div>)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
