'use client';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { queueData, doctorSchedule } from '@/lib/mock-data';
import { Clock, Users, Activity } from 'lucide-react';

export default function DoctorQueue() {
  const { currentServing, queue } = queueData;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Queue Management" subtitle="Manage your patient queue in real-time" />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Activity, label: 'Now Serving', value: `#${String(currentServing).padStart(2, '0')}`, iconColor: 'text-success-500' },
          { icon: Users, label: 'Total in Queue', value: queue.length, iconColor: 'text-primary-500' },
          { icon: Clock, label: 'Avg Wait', value: '~5 min', iconColor: 'text-accent-500' },
        ].map(s => (
          <Card key={s.label} className="p-5 text-center">
            <s.icon size={20} className={`${s.iconColor} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-surface-800 dark:text-white">{s.value}</p>
            <p className="text-xs text-surface-400">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <h3 className="font-semibold text-surface-900 dark:text-white">Patient Queue</h3>
          <Badge variant="accent">Live</Badge>
        </div>
        <div className="p-6 space-y-3">
          {queue.map((q, i) => (
            <motion.div key={q.position} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                q.status === 'serving' ? 'bg-success-50 dark:bg-success-50/10 border border-success-500/20' :
                'bg-surface-50 dark:bg-surface-800/40'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                q.status === 'serving' ? 'bg-success-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}>
                #{String(q.position).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-surface-800 dark:text-white">{q.name}</p>
              </div>
              <Badge variant={q.status === 'serving' ? 'success' : 'default'}>
                {q.status === 'serving' ? 'In Progress' : 'Waiting'}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
