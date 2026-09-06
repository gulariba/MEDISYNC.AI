'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight, Bot, Calendar, FileText, Clock, Stethoscope,
  Sparkles, CheckCircle2, MessageSquare, Brain, Zap, Bell
} from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export function AppointmentsQueue() {
  return (
    <section className="py-28 bg-hero-dark relative grain">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div {...fade()}>
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-widest">Smart Appointments</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-8 tracking-tight">Book with<br /><span className="text-grad-light">confidence.</span></h2>
            <div className="glass-dark rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center"><Stethoscope size={20} className="text-primary-400" /></div>
                <div><p className="text-sm font-semibold text-white">Dr. Ahmed Khan</p><p className="text-xs text-surface-400">Cardiology</p></div>
              </div>
              <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-3">Availability</p>
              <div className="grid grid-cols-4 gap-2">
                {['09:30','10:30','11:30','14:00'].map((t,i) => (
                  <div key={t} className={`text-center py-3 rounded-xl text-sm font-medium transition-all ${i === 1 ? 'btn-glow text-white' : 'bg-white/5 text-surface-400 hover:bg-white/10 border border-white/5'}`}>{t}</div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div {...fade(0.15)}>
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-widest">Real-Time Queue</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-8 tracking-tight">Know your<br /><span className="text-grad-light">wait.</span></h2>
            <div className="glass-dark rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[{ label: 'Your Position', value: '#04', color: 'text-white' },{ label: 'Now Serving', value: '#01', color: 'text-success-400' },{ label: 'Est. Wait', value: '18 min', color: 'text-accent-400' }].map(s => (
                  <div key={s.label} className="text-center"><p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p><p className="text-[10px] text-surface-500 uppercase tracking-wider mt-1">{s.label}</p></div>
                ))}
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '25%' }} viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full btn-glow rounded-full" />
              </div>
              <div className="flex items-center justify-between mt-3">
                {['#01','#02','#03','#04','#05'].map((n, i) => (
                  <div key={n} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-success-500/20 text-success-400' : i === 3 ? 'btn-glow text-white' : 'bg-white/5 text-surface-500'}`}>{n.slice(1)}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function DoctorPreview() {
  const { loginAs } = useAuth();
  return (
    <section id="doctors" className="py-28 bg-section-dark relative grain">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade(0.1)} className="order-2 lg:order-1">
            <div className="glass-dark rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5"><Stethoscope size={18} className="text-primary-400" /><span className="text-sm font-semibold text-white">Clinical Workspace</span><span className="ml-auto text-xs text-success-400">Today</span></div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[{ v: '12', l: 'Patients' },{ v: '4', l: 'Reports' },{ v: '3', l: 'Waiting' }].map(s => (
                  <div key={s.l} className="bg-white/5 border border-white/5 rounded-xl p-3 text-center"><p className="text-xl font-bold text-white">{s.v}</p><p className="text-[10px] text-surface-500">{s.l}</p></div>
                ))}
              </div>
              <div className="space-y-2">
                {['Sarah Johnson','Michael Chen','Priya Patel'].map((n, i) => (
                  <div key={n} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${i === 0 ? 'from-primary-500 to-accent-500' : 'from-primary-600 to-primary-400'} flex items-center justify-center text-white text-[10px] font-bold`}>{n.split(' ').map(w=>w[0]).join('')}</div>
                    <div className="flex-1"><p className="text-sm font-medium text-white">{n}</p><p className="text-xs text-surface-500">{i === 0 ? 'In consultation' : i === 1 ? 'Waiting' : 'Scheduled 11:30'}</p></div>
                    {i === 0 && <span className="text-[10px] font-semibold text-success-400 bg-success-500/10 px-2 py-0.5 rounded-md">Active</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div {...fade()} className="order-1 lg:order-2">
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-widest">For Doctors</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight leading-tight">A clinical command<br />center built for<br /><span className="text-grad-light">modern medicine.</span></h2>
            <p className="mt-4 text-surface-400 leading-relaxed">AI patient summaries, streamlined scheduling, and real-time queue management.</p>
            <Link href="/login" onClick={() => loginAs('doctor')} className="mt-8 btn-primary px-6 py-3 text-sm font-semibold text-white rounded-xl inline-flex items-center gap-2">
              Try Doctor Portal <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CareJourney() {
  return (
    <section id="journey" className="py-28 bg-hero-dark relative grain">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div {...fade()}>
          <span className="text-xs font-semibold text-accent-400 uppercase tracking-widest">The Entire Care Journey</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">One connected path.</h2>
        </motion.div>
        <motion.div {...fade(0.2)} className="mt-16 flex flex-wrap items-start justify-center gap-4 sm:gap-0">
          {[
            { step: 'ASK', desc: 'Ask MediSync anything', icon: MessageSquare },
            { step: 'UNDERSTAND', desc: 'AI identifies your need', icon: Brain },
            { step: 'ACT', desc: 'Book, summarize, connect', icon: Zap },
            { step: 'CONNECT', desc: 'Link with your care team', icon: Stethoscope },
            { step: 'FOLLOW UP', desc: 'Stay informed always', icon: Bell },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center">
              <div className="flex flex-col items-center gap-3 w-32">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><s.icon size={22} className="text-accent-400" /></div>
                <p className="text-xs font-bold text-white tracking-wider">{s.step}</p>
                <p className="text-[10px] text-surface-500">{s.desc}</p>
              </div>
              {i < 4 && <div className="hidden sm:block w-12 h-px bg-gradient-to-r from-accent-500/40 to-transparent mx-2 -mt-8" />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function PatientsSection() {
  const { loginAs } = useAuth();
  return (
    <section id="patients" className="py-28 bg-section-dark relative grain">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade()}>
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-widest">For Patients</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight leading-tight">Your health,<br /><span className="text-grad-light">beautifully organized.</span></h2>
            <p className="mt-4 text-surface-400 leading-relaxed">Everything you need — appointments, reports, prescriptions, queue status, and AI insights — in one platform.</p>
            <ul className="mt-8 space-y-3">
              {['Real-time health overview','AI assistant always ready','Smart appointment booking','Queue position tracking','Intelligent report summaries'].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-surface-300"><CheckCircle2 size={16} className="text-success-400 shrink-0" />{f}</li>
              ))}
            </ul>
            <Link href="/login" onClick={() => loginAs('patient')} className="mt-8 btn-glow px-6 py-3 text-sm font-semibold text-white rounded-xl inline-flex items-center gap-2">
              Try Patient Portal <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div {...fade(0.2)} className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Next Appointment', value: 'Sep 4, 10:30 AM', sub: 'Dr. Ahmed Khan' },
              { icon: Clock, label: 'Queue Position', value: '#04', sub: '~18 min wait' },
              { icon: FileText, label: 'Latest Report', value: 'CBC — Normal', sub: 'Aug 28, 2026' },
              { icon: Bot, label: 'AI Assistant', value: 'Ready', sub: '3 new suggestions' },
            ].map(card => (
              <div key={card.label} className="glass-dark rounded-2xl p-5">
                <card.icon size={20} className="text-accent-400 mb-3" />
                <p className="text-xs text-surface-500 mb-1">{card.label}</p>
                <p className="text-lg font-bold text-white">{card.value}</p>
                <p className="text-xs text-surface-500 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const { loginAs } = useAuth();
  return (
    <section className="py-28 bg-hero-dark relative grain">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(6,182,212,0.08),transparent)]" />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div {...fade()}>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Ready to experience<br />the future of healthcare?</h2>
          <p className="mt-4 text-surface-400">Explore all three portals — Patient, Doctor, and Admin.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" onClick={() => loginAs('patient')} className="btn-glow px-8 py-4 text-sm font-semibold text-white rounded-xl inline-flex items-center gap-2">
              Launch Demo <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="px-8 py-4 text-sm font-semibold text-surface-300 border border-surface-700 hover:border-surface-500 hover:text-white rounded-xl transition-all inline-flex items-center gap-2">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-surface-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-lg font-bold text-white tracking-tight">MediSync<span className="text-accent-400">.ai</span></span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-surface-500">
            <a href="#features" className="hover:text-white transition-colors">Product</a>
            <a href="#ai" className="hover:text-white transition-colors">Solutions</a>
            <a href="#journey" className="hover:text-white transition-colors">How it works</a>
            <a href="#patients" className="hover:text-white transition-colors">Patients</a>
            <a href="#doctors" className="hover:text-white transition-colors">Doctors</a>
          </div>
          <p className="text-xs text-surface-600">Your health information is protected.</p>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-surface-600">
          MediSync.ai — Premium Healthcare AI Platform. Demo prototype with fictional data.
        </div>
      </div>
    </footer>
  );
}
