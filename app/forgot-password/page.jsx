'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold text-surface-900 dark:text-white">MediSync<span className="text-primary-500">.ai</span></span>
        </Link>

        <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight text-center">Reset password</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 mb-8 text-center">We&apos;ll send a reset link to your email.</p>

        {!sent ? (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" defaultValue="demo@medisync.ai" />
            <Button type="submit" size="lg" className="w-full">Send Reset Link</Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-success-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">Check your email</h2>
            <p className="text-sm text-surface-500 mt-2">We&apos;ve sent a password reset link to your email address.</p>
          </div>
        )}

        <p className="text-center text-sm text-surface-500 mt-6">
          <Link href="/login" className="text-primary-500 font-medium hover:underline">Back to sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
