'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import PageHeader from '@/components/layout/page-header';
import { appointments, reports, doctorSchedule, queueData } from '@/lib/mock-data';
import { Users, Calendar, FileText, Clock, ArrowRight, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

const fadeIn = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.06 },
});

export default function DoctorDashboard() {
  const router = useRouter();
  const todayAppts = appointments.filter(a => a.doctorId === 'd1' && a.status === 'upcoming');
  const pendingReports = reports.filter(r => r.status === 'pending' || r.patientId === 'p1');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader title="Doctor Dashboard" subtitle="Welcome back, Dr. Ahmed Khan" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Patients Today', value: '8', sub: '+2 from yesterday', iconColor: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
          { icon: Calendar, label: 'Appointments', value: String(todayAppts.length), sub: '3 remaining', iconColor: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-50/10' },
          { icon: Clock, label: 'Waiting', value: String(queueData.yourPosition - 1), sub: 'in queue', iconColor: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-50/10' },
          { icon: FileText, label: 'Reports to Review', value: '5', sub: '2 pending', iconColor: 'text-success-500', bg: 'bg-success-50 dark:bg-success-50/10' },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i)}>
            <Card className="p-5" hover>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon size={18} className={s.iconColor} />
                </div>
                <div>
                  <p className="text-xs text-surface-400">{s.label}</p>
                  <p className="text-xl font-bold text-surface-800 dark:text-white">{s.value}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{s.sub}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Patient Queue */}
        <motion.div {...fadeIn(2)} className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-semibold text-surface-900 dark:text-white">Patient Queue</h3>
              <Badge variant="accent">Live</Badge>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {doctorSchedule.slice(0, 6).map((s, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center gap-4">
                  <Avatar name={s.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-800 dark:text-white">{s.patient}</p>
                    <p className="text-xs text-surface-400">{s.type} — {s.time}</p>
                  </div>
                  <Badge variant={s.status === 'completed' ? 'default' : s.status === 'in-progress' ? 'primary' : 'success'}>
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div {...fadeIn(3)} className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-semibold text-surface-900 dark:text-white">Today&apos;s Schedule</h3>
            </div>
            <div className="p-4 space-y-3">
              {doctorSchedule.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${s.status === 'completed' ? 'bg-surface-300' : s.status === 'in-progress' ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700'}`} />
                  <div>
                    <p className="text-xs font-medium text-surface-700 dark:text-surface-200">{s.time} — {s.patient}</p>
                    <p className="text-xs text-surface-400">{s.type}</p>
                  </div>
                  {s.status === 'in-progress' && <Activity size={14} className="text-primary-500 ml-auto" />}
                  {s.status === 'completed' && <CheckCircle2 size={14} className="text-success-500 ml-auto" />}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* AI Report Summaries */}
      <motion.div {...fadeIn(4)}>
        <Card>
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800">
            <h3 className="font-semibold text-surface-900 dark:text-white flex items-center gap-2"><Sparkles size={16} className="text-accent-500" /> AI Report Summaries</h3>
            <button onClick={() => router.push('/doctor/reports')} className="text-xs font-medium text-primary-500 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {pendingReports.slice(0, 3).map(r => (
              <div key={r.id} className="bg-primary-50/60 dark:bg-primary-500/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-primary-500" />
                  <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 uppercase">AI Summary</span>
                </div>
                <p className="text-sm font-semibold text-surface-800 dark:text-white">{r.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">{r.aiSummary}</p>
                <p className="text-xs text-surface-400 mt-2 italic">Requires professional review.</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
