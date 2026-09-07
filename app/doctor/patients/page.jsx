'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import PageHeader from '@/components/layout/page-header';
import { doctorService } from '@/services/api';
import { Search, ChevronRight, Loader2 } from 'lucide-react';

export default function PatientList() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try { setPatients(await doctorService.getPatients()); } catch { /* empty */ }
      setLoading(false);
    })();
  }, []);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Patients" subtitle="Manage your patient roster" />
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 mb-6 max-w-sm">
        <Search size={16} className="text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="bg-transparent border-none outline-none text-sm text-surface-700 dark:text-surface-300 placeholder:text-surface-400 w-full" />
      </div>
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></div>
        ) : filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-5 cursor-pointer" hover onClick={() => router.push(`/doctor/patients/${p.id}`)}>
              <div className="flex items-center gap-4">
                <Avatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 dark:text-white">{p.name}</p>
                  <p className="text-xs text-surface-400">{p.email || `Patient #${p.id}`} — {p.phone || 'No phone'}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-surface-400">
                    <span>Blood: {p.bloodGroup || '—'}</span>
                    <span>DOB: {p.dob || '—'}</span>
                  </div>
                </div>
                <Badge variant="primary">{p.gender || '—'}</Badge>
                <ChevronRight size={16} className="text-surface-300" />
              </div>
            </Card>
          </motion.div>
        ))}
        {!loading && filtered.length === 0 && <div className="text-center py-16 text-surface-400">No patients found.</div>}
      </div>
    </div>
  );
}
