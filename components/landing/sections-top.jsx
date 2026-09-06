'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight, Bot, Calendar, FileText, Clock, Stethoscope,
  ChevronRight, Sparkles, Heart, Brain, Zap,
  CheckCircle2, MessageSquare, Send, Menu, X, Bell
} from 'lucide-react';
import { useState } from 'react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export function Navbar() {
  const { loginAs } = useAuth();
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold text-white tracking-tight">MediSync<span className="text-accent-400">.ai</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-400">
          <a href="#features" className="hover:text-white transition-colors">Product</a>
          <a href="#ai" className="hover:text-white transition-colors">Solutions</a>
          <a href="#journey" className="hover:text-white transition-colors">How it works</a>
          <a href="#patients" className="hover:text-white transition-colors">For Patients</a>
          <a href="#doctors" className="hover:text-white transition-colors">For Doctors</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white transition-colors">Sign In</Link>
          <Link href="/login" onClick={() => loginAs('patient')} className="btn-primary px-5 py-2.5 text-sm font-medium text-white rounded-xl inline-flex items-center gap-1.5">Get Started <ArrowRight size={14} /></Link>
        </div>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl hover:bg-white/10">
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileMenu && (
        <div className="md:hidden glass-dark border-t border-white/5 px-6 py-4 space-y-3">
          {[['Product','features'],['Solutions','ai'],['How it works','journey'],['For Patients','patients'],['For Doctors','doctors']].map(([l,id]) => (
            <a key={l} href={`#${id}`} onClick={() => setMobileMenu(false)} className="block text-sm font-medium text-surface-300 py-2">{l}</a>
          ))}
          <Link href="/login" onClick={() => loginAs('patient')} className="block btn-primary text-center text-white text-sm font-medium px-5 py-2.5 rounded-xl mt-2">Get Started</Link>
        </div>
      )}
    </nav>
  );
}

export function Hero() {
  const { loginAs } = useAuth();
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-hero-dark grain">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-500/6 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div {...fade()}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-accent-400 bg-accent-500/10 border border-accent-500/20 rounded-full mb-8">
                <Sparkles size={14} /> AI-POWERED HEALTHCARE PLATFORM
              </span>
            </motion.div>
            <motion.h1 {...fade(0.1)} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Healthcare,<br />Connected by<br />
              <span className="text-grad-light">Intelligence.</span>
            </motion.h1>
            <motion.p {...fade(0.2)} className="mt-6 text-lg text-surface-400 leading-relaxed max-w-lg">
              MediSync brings your care journey together — from intelligent conversations and medical records to appointments, queues and follow-ups.
            </motion.p>
            <motion.div {...fade(0.3)} className="mt-10 flex flex-wrap gap-3">
              <Link href="/login" onClick={() => loginAs('patient')} className="btn-glow px-8 py-4 text-sm font-semibold text-white rounded-xl inline-flex items-center gap-2">
                GET STARTED <ArrowRight size={16} />
              </Link>
              <a href="#features" className="px-8 py-4 text-sm font-semibold text-surface-300 border border-surface-700 hover:border-surface-500 hover:text-white rounded-xl transition-all inline-flex items-center gap-2">
                EXPLORE MEDISYNC
              </a>
            </motion.div>
          </div>
          <motion.div {...fade(0.2)} className="relative hidden lg:block">
            <div className="relative w-full max-w-[520px] ml-auto">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} className="glass-dark rounded-2xl p-6 relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center text-white text-xs font-bold">M</div>
                    <div><p className="text-sm font-semibold text-white">MediSync Intelligence</p><p className="text-xs text-surface-400">Good morning, Sarah</p></div>
                  </div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success-500 pulse-ring" /><span className="text-xs text-success-400 font-medium">Active</span></div>
                </div>
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                  <Heart size={14} className="text-accent-400" /><span className="text-xs text-surface-300">Health journey</span><span className="ml-auto text-xs font-semibold text-success-400">Active</span>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-3">
                  <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Next Appointment</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center"><Stethoscope size={18} className="text-primary-400" /></div>
                    <div className="flex-1"><p className="text-sm font-semibold text-white">Dr. Ahmed Khan</p><p className="text-xs text-surface-400">Cardiology</p></div>
                    <div className="text-right"><p className="text-sm font-bold text-white">Sep 04</p><p className="text-xs text-accent-400">10:30 AM</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                    <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Live Queue</p>
                    <p className="text-2xl font-extrabold text-white">#04</p>
                    <p className="text-xs text-surface-400 mt-1">3 ahead · 18 min</p>
                  </div>
                  <div className="rounded-xl bg-accent-500/10 border border-accent-500/15 p-4 glow-cyan">
                    <p className="text-[10px] font-semibold text-accent-400 uppercase tracking-wider mb-2">AI Insight</p>
                    <p className="text-xs text-surface-300 leading-relaxed">Your CBC report is ready to review.</p>
                    <button className="mt-2 text-xs font-semibold text-accent-400 hover:text-accent-300">View Summary →</button>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                  <Sparkles size={14} className="text-accent-400 shrink-0" /><span className="text-sm text-surface-500">Ask MediSync...</span><Send size={14} className="ml-auto text-surface-500" />
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, -8, 0], x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }} className="absolute -top-4 -right-4 glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 z-20">
                <Sparkles size={14} className="text-accent-400" /><span className="text-xs font-semibold text-white">AI Summary Ready</span>
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0], x: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }} className="absolute -bottom-3 -left-6 glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 z-20">
                <CheckCircle2 size={14} className="text-success-400" /><span className="text-xs font-semibold text-white">Appointment Confirmed</span>
              </motion.div>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1.5 }} className="absolute top-1/2 -left-10 glass-dark rounded-xl px-3 py-2 flex items-center gap-2 z-20">
                <Clock size={12} className="text-accent-400" /><span className="text-xs font-semibold text-surface-300">Queue Updated</span>
              </motion.div>
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full scale-110" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function BigStatement() {
  return (
    <section id="features" className="py-28 bg-section-dark relative grain">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2 {...fade()} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
          One intelligent layer<br />between <span className="text-grad-light">patients</span>,<br />
          <span className="text-grad-light">doctors</span> and <span className="text-grad-light">care</span>.
        </motion.h2>
        <motion.div {...fade(0.2)} className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[{ label: 'Patients', icon: Heart },{ label: 'Doctors', icon: Stethoscope },{ label: 'Records', icon: FileText },{ label: 'Appointments', icon: Calendar }].map((item, i) => (
            <div key={item.label} className="flex items-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><item.icon size={24} className="text-accent-400" /></div>
                <span className="text-sm font-semibold text-surface-300">{item.label}</span>
              </div>
              {i < 3 && <ChevronRight size={18} className="text-surface-700 hidden sm:block ml-6 sm:ml-10" />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function AIShowcase() {
  return (
    <section id="ai" className="py-28 bg-hero-dark relative grain overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,108,247,0.12),transparent)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fade()}>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">Just ask.</h2>
            <p className="mt-4 text-lg text-surface-400 leading-relaxed">MediSync understands what patients need — and turns conversations into action.</p>
            <div className="mt-8 flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-success-500 pulse-ring" /><span className="text-sm font-medium text-surface-300">MediSync AI — Ready</span></div>
          </motion.div>
          <motion.div {...fade(0.2)} className="glass-dark rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center text-white text-xs font-bold">AI</div>
              <div><p className="text-sm font-semibold text-white">MediSync Assistant</p><p className="text-xs text-success-400">Online</p></div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-primary-400">You</span></div>
                <div className="bg-white/5 rounded-xl rounded-tl-sm px-4 py-3 max-w-[280px]"><p className="text-sm text-surface-300">Show me my latest blood report.</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-white">AI</span></div>
                <div className="bg-accent-500/10 border border-accent-500/15 rounded-xl rounded-tl-sm px-4 py-3 max-w-[300px]">
                  <p className="text-sm text-surface-300">I found your CBC report from August 28.</p>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 mb-2"><Sparkles size={12} className="text-accent-400" /><span className="text-[10px] font-semibold text-accent-400 uppercase">AI Summary</span></div>
                    <p className="text-xs text-surface-400 leading-relaxed">Your report is ready for review. I can also send the summary to your doctor.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                <input className="flex-1 bg-transparent border-none outline-none text-sm text-surface-300 placeholder:text-surface-600" placeholder="Ask MediSync AI..." readOnly />
                <Send size={16} className="text-accent-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ReportIntelligence() {
  return (
    <section className="py-28 bg-section-dark relative grain">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fade()} className="text-center mb-16">
          <span className="text-xs font-semibold text-accent-400 uppercase tracking-widest">Report Intelligence</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">AI reads your reports.<br /><span className="text-grad-light">So you don&apos;t have to.</span></h2>
        </motion.div>
        <motion.div {...fade(0.1)} className="grid lg:grid-cols-2 gap-0 glass-dark rounded-2xl overflow-hidden max-w-5xl mx-auto">
          <div className="p-8 border-b lg:border-b-0 lg:border-r border-white/5">
            <div className="flex items-center gap-2 mb-6"><FileText size={18} className="text-primary-400" /><span className="text-sm font-semibold text-white">CBC Report — Aug 28, 2026</span></div>
            <div className="space-y-3">
              {[{ label: 'Hemoglobin', value: '14.2 g/dL', status: 'Normal' },{ label: 'WBC Count', value: '7,200/μL', status: 'Normal' },{ label: 'Platelet Count', value: '250,000/μL', status: 'Normal' },{ label: 'RBC Count', value: '5.1 M/μL', status: 'Normal' },{ label: 'Hematocrit', value: '42%', status: 'Normal' }].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-sm text-surface-400">{row.label}</span>
                  <div className="flex items-center gap-2"><span className="text-sm font-medium text-white">{row.value}</span><span className="text-[10px] font-semibold text-success-400 bg-success-500/10 px-2 py-0.5 rounded-md">{row.status}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 bg-accent-500/5">
            <div className="flex items-center gap-2 mb-6"><Sparkles size={18} className="text-accent-400" /><span className="text-sm font-semibold text-accent-400">AI Intelligence</span></div>
            <div className="space-y-5">
              <div><p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Summary</p><p className="text-sm text-surface-300 leading-relaxed">All CBC parameters are within normal reference ranges. No abnormalities detected in red blood cells, white blood cells, or platelets.</p></div>
              <div><p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Key Findings</p>
                <div className="space-y-2">
                  {['Hemoglobin and hematocrit optimal','WBC count healthy — no infection indicators','Platelet count normal — no clotting concerns'].map(f => (
                    <div key={f} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-success-400 shrink-0 mt-0.5" /><span className="text-xs text-surface-400">{f}</span></div>
                  ))}
                </div>
              </div>
              <div><p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Doctor Review</p><p className="text-xs text-surface-400 italic">AI-generated summary requires professional clinical review before any medical decisions.</p></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
