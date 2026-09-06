'use client';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { appointments } from '@/lib/mock-data';

export default function AdminAppointments() {
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
              {appointments.map(a => (
                <tr key={a.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-surface-800 dark:text-white">{a.patientName}</td>
                  <td className="px-6 py-3.5 text-surface-500">{a.doctorName}</td>
                  <td className="px-6 py-3.5 text-surface-500">{a.date} — {a.time}</td>
                  <td className="px-6 py-3.5 text-surface-500">{a.type}</td>
                  <td className="px-6 py-3.5"><Badge variant={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
