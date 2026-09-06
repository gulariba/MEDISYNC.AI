'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Tabs from '@/components/ui/tabs';
import Modal from '@/components/ui/modal';
import Avatar from '@/components/ui/avatar';
import PageHeader from '@/components/layout/page-header';
import { appointments, doctors, specialties, timeSlots } from '@/lib/mock-data';
import { appointmentService } from '@/services/api';
import { Calendar, Clock, MapPin, Plus, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';

export default function Appointments() {
  const [tab, setTab] = useState('upcoming');
  const [showBook, setShowBook] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({ specialty: '', doctor: '', date: '', time: '' });
  const [booked, setBooked] = useState(false);

  const myAppts = appointments.filter(a => a.patientId === 'p1');
  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: myAppts.filter(a => a.status === 'upcoming').length },
    { id: 'completed', label: 'Past', count: myAppts.filter(a => a.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: myAppts.filter(a => a.status === 'cancelled').length },
  ];
  const filtered = myAppts.filter(a => a.status === tab);
  const filteredDoctors = doctors.filter(d => booking.specialty ? d.specialty === booking.specialty : true);

  const handleBook = async () => {
    await appointmentService.book({ ...booking, patientId: 'p1', patientName: 'Sarah Khan', doctorName: booking.doctor, status: 'upcoming' });
    setBooked(true);
    setTimeout(() => { setShowBook(false); setBooked(false); setStep(1); setBooking({ specialty: '', doctor: '', date: '', time: '' }); }, 2000);
  };
  const handleCancel = async () => { await appointmentService.cancel(cancelId); setCancelId(null); };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Appointments" subtitle="Manage and book your appointments" action={<Button onClick={() => setShowBook(true)}><Plus size={16} /> Book Appointment</Button>} />
      <div className="mb-6"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
      <div className="grid gap-3">
        {filtered.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-5"><div className="flex items-center gap-4">
              <Avatar name={a.doctorName} />
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-surface-800 dark:text-white">{a.doctorName}</p><p className="text-xs text-surface-400">{a.specialty} — {a.type}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-500 dark:text-surface-400">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {a.date}</span><span className="flex items-center gap-1"><Clock size={12} /> {a.time}</span><span className="flex items-center gap-1"><MapPin size={12} /> {a.location}</span>
                </div>
              </div>
              <Badge variant={a.status === 'upcoming' ? 'success' : a.status === 'completed' ? 'primary' : 'danger'}>{a.status}</Badge>
              {a.status === 'upcoming' && <button onClick={() => setCancelId(a.id)} className="text-xs text-danger-500 hover:underline font-medium">Cancel</button>}
            </div></Card>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-16 text-surface-400">No {tab} appointments.</div>}
      </div>

      <Modal open={showBook} onClose={() => { setShowBook(false); setStep(1); setBooked(false); }} title="Book Appointment" size="lg">
        {booked ? (
          <div className="text-center py-8"><CheckCircle2 size={56} className="text-success-500 mx-auto mb-4" /><h3 className="text-lg font-bold text-surface-900 dark:text-white">Appointment Booked!</h3><p className="text-sm text-surface-500 mt-1">You&apos;ll receive a confirmation notification.</p></div>
        ) : (
          <div>
            <div className="flex items-center gap-1 mb-6">{['Specialty', 'Doctor', 'Date', 'Time'].map((s, i) => (
              <div key={s} className="flex items-center flex-1"><div className={`flex-1 text-center py-1.5 text-xs font-medium rounded-lg ${step > i + 1 ? 'bg-success-50 text-success-600' : step === i + 1 ? 'btn-gradient text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-400'}`}>{`0${i+1}`} {s}</div>{i < 3 && <ChevronRight size={14} className="text-surface-300 mx-1 shrink-0" />}</div>
            ))}</div>
            {step === 1 && <div className="grid grid-cols-2 gap-2">{specialties.map(s => (<button key={s} onClick={() => { setBooking({ ...booking, specialty: s }); setStep(2); }} className={`p-3 rounded-xl text-sm font-medium border transition-colors text-left ${booking.specialty === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600' : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'}`}><Stethoscope size={16} className="mb-1 text-primary-500" />{s}</button>))}</div>}
            {step === 2 && <div className="space-y-2">{filteredDoctors.map(d => (<button key={d.id} onClick={() => { setBooking({ ...booking, doctor: d.name }); setStep(3); }} className="w-full flex items-center gap-3 p-4 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors text-left"><Avatar name={d.name} /><div><p className="text-sm font-semibold text-surface-800 dark:text-white">{d.name}</p><p className="text-xs text-surface-400">{d.specialty} — {d.experience}</p></div><Badge variant={d.available ? 'success' : 'danger'} className="ml-auto">{d.available ? 'Available' : 'Unavailable'}</Badge></button>))}<button onClick={() => setStep(1)} className="text-sm text-primary-500 hover:underline mt-2">Back</button></div>}
            {step === 3 && <div><div className="grid grid-cols-3 gap-2 mb-4">{['2026-09-04','2026-09-05','2026-09-06','2026-09-08','2026-09-09','2026-09-10'].map(d => (<button key={d} onClick={() => { setBooking({ ...booking, date: d }); setStep(4); }} className={`p-3 rounded-xl text-sm font-medium border transition-colors ${booking.date === d ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'}`}>{d}</button>))}</div><button onClick={() => setStep(2)} className="text-sm text-primary-500 hover:underline">Back</button></div>}
            {step === 4 && <div><div className="grid grid-cols-4 gap-2 mb-6">{timeSlots.map(t => (<button key={t} onClick={() => setBooking({ ...booking, time: t })} className={`p-2.5 rounded-xl text-xs font-medium border transition-colors ${booking.time === t ? 'btn-gradient text-white border-transparent' : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'}`}>{t}</button>))}</div><div className="flex items-center gap-3"><button onClick={() => setStep(3)} className="text-sm text-primary-500 hover:underline">Back</button><Button onClick={handleBook} disabled={!booking.time} className="flex-1">Confirm Booking</Button></div></div>}
          </div>
        )}
      </Modal>

      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Appointment" size="sm">
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Are you sure you want to cancel this appointment? This action cannot be undone.</p>
        <div className="flex gap-3"><Button variant="secondary" onClick={() => setCancelId(null)} className="flex-1">Keep</Button><Button variant="danger" onClick={handleCancel} className="flex-1">Cancel Appointment</Button></div>
      </Modal>
    </div>
  );
}
