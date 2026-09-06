'use client';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { adminStats, appointmentsOverTime, patientRegistrations, queueActivityData, appointments } from '@/lib/mock-data';
import { Users, Stethoscope, Calendar, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fadeIn = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.06 },
});

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader title="Admin Dashboard" subtitle="System overview and analytics" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Patients', value: adminStats.totalPatients.toLocaleString(), sub: '+45 this month', iconColor: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-500/10', trend: '+12%' },
          { icon: Stethoscope, label: 'Doctors', value: adminStats.totalDoctors, sub: '5 specialties', iconColor: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-50/10', trend: '+2' },
          { icon: Calendar, label: "Today's Appts", value: adminStats.todayAppointments, sub: '12 completed', iconColor: 'text-success-500', bg: 'bg-success-50 dark:bg-success-50/10', trend: '+8%' },
          { icon: Activity, label: 'Active Queues', value: adminStats.activeQueues, sub: 'Avg 5 min wait', iconColor: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-50/10', trend: '-3%' },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i)}>
            <Card className="p-5" hover>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon size={18} className={s.iconColor} />
                </div>
                <Badge variant={s.trend.startsWith('+') ? 'success' : 'danger'}>{s.trend}</Badge>
              </div>
              <p className="text-2xl font-bold text-surface-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-surface-400">{s.label}</p>
              <p className="text-xs text-surface-400 mt-0.5">{s.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeIn(2)} className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-white">Appointments Trend</h3>
              <Badge variant="primary">Monthly</Badge>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={appointmentsOverTime}>
                  <defs>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b6cf7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b6cf7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111827', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="appointments" stroke="#3b6cf7" strokeWidth={2} fill="url(#colorAppts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeIn(3)}>
          <Card>
            <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-semibold text-surface-900 dark:text-white">Registrations</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={patientRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111827', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="registrations" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Queue Activity + Recent */}
      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div {...fadeIn(4)} className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-semibold text-surface-900 dark:text-white">Queue Activity</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={queueActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#111827', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="active" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeIn(5)} className="lg:col-span-3">
          <Card>
            <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
              <h3 className="font-semibold text-surface-900 dark:text-white">Recent Appointments</h3>
            </div>
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {appointments.slice(0, 5).map(a => (
                <div key={a.id} className="px-6 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 dark:text-white truncate">{a.patientName} → {a.doctorName}</p>
                    <p className="text-xs text-surface-400">{a.date} at {a.time}</p>
                  </div>
                  <Badge variant={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
