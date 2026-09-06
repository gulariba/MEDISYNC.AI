'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => { e.preventDefault(); login('demo@medisync.ai', 'demo'); router.push('/patient'); };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold text-surface-900 dark:text-white">MediSync<span className="text-primary-500">.ai</span></span>
        </Link>

        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight text-center">Create your account</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 mb-8 text-center">Start your intelligent healthcare journey.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="Your full name" />
          <Input label="Email" type="email" placeholder="you@example.com" />
          <div className="relative">
            <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Create a password" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[34px] p-1 text-surface-400 hover:text-surface-600">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button type="submit" size="lg" className="w-full">Create Account</Button>
        </form>

        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account? <Link href="/login" className="text-primary-500 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
