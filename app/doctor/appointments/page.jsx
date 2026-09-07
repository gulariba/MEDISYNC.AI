'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import PageHeader from '@/components/layout/page-header';
import { doctorService } from '@/services/api';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';

export default function DoctorAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setAppts(await doctorService.getAppointments()); } catch { /* fallback empty */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Appointments" subtitle="Your scheduled appointments" />
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></div>
        ) : appts.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-5">
              <div className="flex items-center gap-4">
                <Avatar name={a.patientName} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 dark:text-white">{a.patientName}</p>
                  <p className="text-xs text-surface-400">{a.type}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-500 dark:text-surface-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {a.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {a.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {a.location || 'Room TBD'}</span>
                  </div>
                </div>
                <Badge variant={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.status}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}
        {!loading && appts.length === 0 && <div className="text-center py-16 text-surface-400">No appointments scheduled.</div>}
      </div>
    </div>
  );
}
