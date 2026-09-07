'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { adminService } from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function AdminAppointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setAppts(await adminService.getAppointments()); } catch { /* empty */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Appointments" subtitle="All system appointments" />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-800">
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Doctor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></td></tr>
              ) : appts.map(a => (
                <tr key={a.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-surface-800 dark:text-white">{a.patientName}</td>
                  <td className="px-6 py-3.5 text-surface-500">{a.doctorName}</td>
                  <td className="px-6 py-3.5 text-surface-500">{a.date} — {a.time}</td>
                  <td className="px-6 py-3.5 text-surface-500">{a.type}</td>
                  <td className="px-6 py-3.5"><Badge variant={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.status}</Badge></td>
                </tr>
              ))}
              {!loading && appts.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-surface-400">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
