'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Calendar, Clock, FileText, Bot, ArrowRight, Activity, Pill, Send } from 'lucide-react';
import { appointments, reports, queueData, activityTimeline } from '@/lib/mock-data';
import { useState } from 'react';

const fadeIn = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.06 },
});

export default function PatientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const myAppts = appointments.filter(a => a.patientId === 'p1' && a.status === 'upcoming');
  const myReports = reports.filter(r => r.patientId === 'p1');
  const nextAppt = myAppts[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div {...fadeIn()}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">Good morning, {user?.name?.split(' ')[0] || 'Sarah'}.</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Here&apos;s your health overview for today.</p>
      </motion.div>

      <motion.div {...fadeIn(1)}>
        <div className="surface-elevated rounded-2xl overflow-hidden">
          <div className="btn-gradient p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><Bot size={24} className="text-white" /></div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Ask MediSync AI</h3>
                <p className="text-white/70 text-sm mt-1">Your intelligent healthcare assistant is ready.</p>
                <div className="mt-4 flex items-center gap-2 bg-white/15 rounded-xl px-4 py-3">
                  <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && prompt && router.push('/patient/assistant')} placeholder="How can I help you today?" className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50" />
                  <button onClick={() => prompt && router.push('/patient/assistant')} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"><Send size={16} className="text-white" /></button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Show my latest report', 'Book an appointment', 'Check my queue', 'Summarize my report'].map(s => (
                    <button key={s} onClick={() => router.push('/patient/assistant')} className="px-3 py-1.5 text-xs font-medium text-white/80 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Next Appointment', value: nextAppt ? nextAppt.date : 'None', sub: nextAppt?.doctorName, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10' },
          { icon: Clock, label: 'Queue Position', value: `#${queueData.yourPosition}`, sub: `~${queueData.estimatedWait} min`, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-50/10' },
          { icon: FileText, label: 'Reports', value: myReports.length, sub: 'All reviewed', color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-50/10' },
          { icon: Pill, label: 'Active Rx', value: '3', sub: 'All on track', color: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-50/10' },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i + 2)}>
            <Card className="p-5" hover>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}><s.icon size={18} className={s.color} /></div>
                <div><p className="text-xs text-surface-400">{s.label}</p><p className="text-lg font-bold text-surface-800 dark:text-white">{s.value}</p><p className="text-xs text-surface-400 mt-0.5">{s.sub}</p></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div {...fadeIn(3)} className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-semibold text-surface-900 dark:text-white">Upcoming Appointments</h3>
              <button onClick={() => router.push('/patient/appointments')} className="text-xs font-medium text-primary-500 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></button>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {myAppts.slice(0, 3).map(a => (
                <div key={a.id} className="px-6 py-4 flex items-center gap-4">
                  <Avatar name={a.doctorName} />
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-surface-800 dark:text-white truncate">{a.doctorName}</p><p className="text-xs text-surface-400">{a.specialty} — {a.type}</p></div>
                  <div className="text-right shrink-0"><p className="text-sm font-medium text-surface-700 dark:text-surface-200">{a.date}</p><p className="text-xs text-surface-400">{a.time}</p></div>
                  <Badge variant="success">{a.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeIn(4)} className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800"><h3 className="font-semibold text-surface-900 dark:text-white">Recent Activity</h3></div>
            <div className="px-6 py-3 space-y-4">
              {activityTimeline.slice(0, 5).map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5"><Activity size={14} className="text-surface-400" /></div>
                  <div><p className="text-sm font-medium text-surface-700 dark:text-surface-200">{item.title}</p><p className="text-xs text-surface-400">{item.time}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeIn(5)}>
        <Card>
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800">
            <h3 className="font-semibold text-surface-900 dark:text-white">Recent Reports</h3>
            <button onClick={() => router.push('/patient/reports')} className="text-xs font-medium text-primary-500 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {myReports.slice(0, 4).map(r => (
              <div key={r.id} className="bg-surface-50 dark:bg-surface-800/60 rounded-xl p-4 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer" onClick={() => router.push('/patient/reports')}>
                <FileText size={18} className="text-primary-500 mb-2" />
                <p className="text-sm font-semibold text-surface-800 dark:text-white truncate">{r.name}</p>
                <p className="text-xs text-surface-400 mt-1">{r.date}</p>
                <Badge variant="success" className="mt-2">Ready</Badge>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
