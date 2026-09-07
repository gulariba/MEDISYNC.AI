'use client';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import Tabs from '@/components/ui/tabs';
import { doctorService } from '@/services/api';
import { ArrowLeft, Calendar, FileText, Pill, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PatientDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState('reports');
  const [patient, setPatient] = useState(null);
  const [pReports, setPReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await doctorService.getPatientDetail(id);
        setPatient(res.patient);
        setPReports(res.reports);
      } catch { /* empty */ }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto text-center py-16"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></div>;
  if (!patient) return <div className="max-w-5xl mx-auto text-center py-16 text-surface-400">Patient not found.</div>;

  const tabs = [{ id: 'reports', label: 'Reports', count: pReports.length }];

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => router.push('/doctor/patients')} className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-4">
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <Card className="mb-6">
        <div className="p-6 flex items-center gap-5">
          <Avatar name={patient.name} size="xl" />
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">{patient.name}</h2>
            <p className="text-sm text-surface-400">{patient.email || `Patient #${patient.id}`} — {patient.phone || 'No phone'}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge variant="primary">{patient.bloodGroup || '—'}</Badge>
              <Badge variant="default">{patient.gender || '—'}</Badge>
              <span className="text-xs text-surface-400">DOB: {patient.dob || '—'}</span>
              <span className="text-xs text-surface-400">{patient.address || ''}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === 'reports' && (
        <div className="grid gap-3">
          {pReports.length === 0 ? (
            <div className="text-center py-12 text-surface-400">No reports for this patient.</div>
          ) : pReports.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center"><FileText size={18} className="text-primary-500" /></div>
                  <div className="flex-1"><p className="text-sm font-semibold text-surface-800 dark:text-white">{r.name}</p><p className="text-xs text-surface-400">{r.type} — {r.date}</p></div>
                  <Badge variant={r.status === 'ready' ? 'success' : 'warning'}>{r.status}</Badge>
                </div>
                {r.aiSummary && (
                  <div className="mt-3 bg-primary-50/60 dark:bg-primary-500/10 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1"><Sparkles size={12} className="text-primary-500" /><span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400">AI Summary</span></div>
                    <p className="text-xs text-surface-600 dark:text-surface-300">{r.aiSummary}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
