'use client';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import PageHeader from '@/components/layout/page-header';
import { queueData } from '@/lib/mock-data';
import { Clock, Users, Zap } from 'lucide-react';

export default function QueueStatus() {
  const { currentServing, yourPosition, estimatedWait, doctor, room, queue } = queueData;
  const progress = ((yourPosition - currentServing) / queue.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Queue Status" subtitle={`Live queue for ${doctor} — ${room}`} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden mb-6">
          <div className="btn-gradient p-8 text-center">
            <p className="text-white/70 text-sm font-medium mb-1">YOUR QUEUE POSITION</p>
            <p className="text-6xl font-extrabold text-white mb-2">#{String(yourPosition).padStart(2, '0')}</p>
            <div className="flex items-center justify-center gap-6 text-white/80 text-sm mt-4">
              <span className="flex items-center gap-1.5"><Zap size={14} /> Now serving #{String(currentServing).padStart(2, '0')}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> ~{estimatedWait} min</span>
              <span className="flex items-center gap-1.5"><Users size={14} /> {yourPosition - currentServing} ahead</span>
            </div>
          </div>
          <div className="p-6">
            <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${100 - progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full btn-gradient rounded-full" />
            </div>
          </div>
        </Card>
      </motion.div>

      <Card>
        <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800"><h3 className="font-semibold text-surface-900 dark:text-white">Queue Timeline</h3></div>
        <div className="p-6 space-y-3">
          {queue.map((q, i) => (
            <motion.div key={q.position} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-4 p-4 rounded-xl ${q.status === 'serving' ? 'bg-success-50 dark:bg-success-50/10 border border-success-500/20' : q.status === 'you' ? 'bg-primary-50 dark:bg-primary-500/10 border border-primary-500/20' : 'bg-surface-50 dark:bg-surface-800/40'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${q.status === 'serving' ? 'bg-success-500 text-white' : q.status === 'you' ? 'btn-gradient text-white pulse-ring' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'}`}>#{String(q.position).padStart(2, '0')}</div>
              <div className="flex-1"><p className="text-sm font-semibold text-surface-800 dark:text-white">{q.name}</p></div>
              <Badge variant={q.status === 'serving' ? 'success' : q.status === 'you' ? 'primary' : 'default'}>{q.status === 'serving' ? 'In Progress' : q.status === 'you' ? 'You' : 'Waiting'}</Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
