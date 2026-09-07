'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import PageHeader from '@/components/layout/page-header';
import { adminService } from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setDoctors(await adminService.getDoctors()); } catch { /* empty */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Doctors" subtitle={`${doctors.length} doctors on staff`} />
      {loading ? (
        <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-6" hover>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={d.name} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-surface-800 dark:text-white">{d.name}</p>
                    <p className="text-xs text-surface-400">{d.specialty || 'General'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface-50 dark:bg-surface-800/60 rounded-xl p-2">
                    <p className="text-sm font-bold text-surface-800 dark:text-white">{d.patients || 0}</p>
                    <p className="text-[10px] text-surface-400">Patients</p>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-800/60 rounded-xl p-2">
                    <p className="text-sm font-bold text-surface-800 dark:text-white">{d.rating || '—'}</p>
                    <p className="text-[10px] text-surface-400">Rating</p>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-800/60 rounded-xl p-2">
                    <p className="text-sm font-bold text-surface-800 dark:text-white">{d.experience || '—'}</p>
                    <p className="text-[10px] text-surface-400">Exp</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant={d.available ? 'success' : 'danger'}>{d.available ? 'Available' : 'Unavailable'}</Badge>
                  <span className="text-xs text-surface-400">{d.room || '—'}</span>
                </div>
              </Card>
            </motion.div>
          ))}
          {doctors.length === 0 && <div className="col-span-3 text-center py-16 text-surface-400">No doctors on staff.</div>}
        </div>
      )}
    </div>
  );
}
