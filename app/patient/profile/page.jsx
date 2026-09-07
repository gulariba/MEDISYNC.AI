'use client';
import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/ui/avatar';
import PageHeader from '@/components/layout/page-header';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { patientService } from '@/services/api';
import { Sun, Moon, Bell, Globe, Shield, Save, CheckCircle2, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', date_of_birth: '', gender: '', blood_group: '', address: '' });

  useEffect(() => {
    (async () => {
      try {
        if (user?.role === 'patient') {
          const p = await patientService.getProfile();
          setProfile(p);
          setForm({ name: p.name || '', phone: p.phone || '', date_of_birth: p.dob || '', gender: p.gender || '', blood_group: p.bloodGroup || '', address: p.address || '' });
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user?.role === 'patient') {
        await patientService.updateProfile(form);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const displayName = profile?.name || user?.name || 'User';
  const displayEmail = user?.email || '';

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Profile & Settings" subtitle="Manage your account and preferences" />
      <Card className="mb-6">
        <div className="p-6 border-b border-surface-100 dark:border-surface-800 flex items-center gap-4">
          <Avatar name={displayName} size="xl" />
          <div><h3 className="text-lg font-bold text-surface-900 dark:text-white">{displayName}</h3><p className="text-sm text-surface-400">{displayEmail}</p><p className="text-xs text-surface-400 mt-0.5 capitalize">{user?.role || 'Patient'} Account</p></div>
        </div>
        {loading ? (
          <div className="p-6 text-center"><Loader2 size={20} className="animate-spin text-surface-400 mx-auto" /></div>
        ) : (
          <div className="p-6 grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" defaultValue={displayEmail} disabled />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
            <Input label="Blood Group" value={form.blood_group} onChange={e => setForm({ ...form, blood_group: e.target.value })} />
            <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
        )}
        <div className="px-6 pb-6 flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
          </Button>
          {saved && <span className="flex items-center gap-1 text-sm text-success-500"><CheckCircle2 size={14} /> Saved</span>}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800"><h3 className="font-semibold text-surface-900 dark:text-white">Preferences</h3></div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">{dark ? <Moon size={18} className="text-primary-500" /> : <Sun size={18} className="text-warning-500" />}<div><p className="text-sm font-medium text-surface-800 dark:text-white">Dark Mode</p><p className="text-xs text-surface-400">Switch between light and dark themes</p></div></div>
            <button onClick={toggle} className={`w-11 h-6 rounded-full transition-colors relative ${dark ? 'bg-primary-500' : 'bg-surface-300'}`}><span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${dark ? 'left-[22px]' : 'left-0.5'}`} /></button>
          </div>
          {[{ icon: Bell, label: 'Push Notifications', desc: 'Receive appointment and queue updates' }, { icon: Globe, label: 'Language', desc: 'English (US)' }, { icon: Shield, label: 'Privacy', desc: 'Your health information is protected' }].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3"><item.icon size={18} className="text-surface-400" /><div><p className="text-sm font-medium text-surface-800 dark:text-white">{item.label}</p><p className="text-xs text-surface-400">{item.desc}</p></div></div>
              <button className="w-11 h-6 rounded-full bg-primary-500 relative"><span className="absolute top-0.5 left-[22px] w-5 h-5 rounded-full bg-white shadow" /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
