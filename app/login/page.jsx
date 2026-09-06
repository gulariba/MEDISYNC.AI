'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Eye, EyeOff, Stethoscope, Shield, User } from 'lucide-react';

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const { login, loginAs } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => { e.preventDefault(); login('demo@medisync.ai', 'demo'); router.push('/patient'); };
  const demoAs = (role) => { loginAs(role); router.push(`/${role}`); };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-950 items-center justify-center p-12 overflow-hidden grain">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(37,99,235,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_70%,rgba(6,182,212,0.08),transparent)]" />
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold text-white tracking-tight">MediSync<span className="text-accent-400">.ai</span></span>
          </Link>
          <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight">Healthcare intelligence,<br />at your fingertips.</h2>
          <p className="mt-4 text-surface-400 leading-relaxed">AI-powered conversations, smart scheduling, real-time queue tracking, and intelligent report summaries.</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success-500 pulse-ring" />
            <span className="text-sm text-surface-400">System Online — All services operational</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface-50 dark:bg-surface-950">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-lg font-bold text-surface-900 dark:text-white">MediSync<span className="text-primary-500">.ai</span></span>
          </Link>

          <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 mb-8">Sign in to access your healthcare dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" defaultValue="demo@medisync.ai" />
            <div className="relative">
              <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Enter your password" defaultValue="demo" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] p-1 text-surface-400 hover:text-surface-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-surface-500">
                <input type="checkbox" className="rounded border-surface-300" defaultChecked /> Remember me
              </label>
              <Link href="/forgot-password" className="text-primary-500 font-medium hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" size="lg" className="w-full">Sign In</Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-800" />
            <span className="text-xs text-surface-400">or try a demo</span>
            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-800" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'patient', icon: User, label: 'Patient' },
              { role: 'doctor', icon: Stethoscope, label: 'Doctor' },
              { role: 'admin', icon: Shield, label: 'Admin' },
            ].map(d => (
              <button key={d.role} onClick={() => demoAs(d.role)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors group">
                <d.icon size={18} className="text-surface-400 group-hover:text-primary-500 transition-colors" />
                <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{d.label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don&apos;t have an account? <Link href="/signup" className="text-primary-500 font-medium hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
