'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Signup() {
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    setBusy(true); setError('');
    try {
      const res = await register({ email, password, name, role: 'patient' });
      router.push(`/${res.role}`);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold text-surface-900 dark:text-white">MediSync<span className="text-primary-500">.ai</span></span>
        </Link>

        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight text-center">Create your account</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 mb-8 text-center">Start your intelligent healthcare journey.</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-danger-50 dark:bg-danger-50/10 border border-danger-500/20 text-sm text-danger-600 dark:text-danger-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative">
            <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] p-1 text-surface-400 hover:text-surface-600">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account? <Link href="/login" className="text-primary-500 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
