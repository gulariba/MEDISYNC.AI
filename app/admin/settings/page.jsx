'use client';
import { useState } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/layout/page-header';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Bell, Shield, Save, CheckCircle2, Database, Mail } from 'lucide-react';

export default function AdminSettings() {
  const { dark, toggle } = useTheme();
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="System Settings" subtitle="Configure platform settings" />

      <Card className="mb-6">
        <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
          <h3 className="font-semibold text-surface-900 dark:text-white">General</h3>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <Input label="Hospital Name" defaultValue="MediSync Central Hospital" />
          <Input label="Admin Email" type="email" defaultValue="admin@medisync.com" />
          <Input label="Phone" defaultValue="+92-21-1234567" />
          <Input label="Timezone" defaultValue="Asia/Karachi (UTC+5)" />
        </div>
        <div className="px-6 pb-6 flex items-center gap-3">
          <Button onClick={handleSave}><Save size={16} /> Save Settings</Button>
          {saved && <span className="flex items-center gap-1 text-sm text-success-500"><CheckCircle2 size={14} /> Saved</span>}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="px-6 py-4 border-b border-surface-100 dark:border-surface-800">
          <h3 className="font-semibold text-surface-900 dark:text-white">Preferences</h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {dark ? <Moon size={18} className="text-primary-500" /> : <Sun size={18} className="text-warning-500" />}
              <div><p className="text-sm font-medium text-surface-800 dark:text-white">Dark Mode</p><p className="text-xs text-surface-400">Toggle dark theme</p></div>
            </div>
            <button onClick={toggle} className={`w-11 h-6 rounded-full transition-colors relative ${dark ? 'bg-primary-500' : 'bg-surface-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${dark ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          {[
            { icon: Bell, label: 'System Notifications', desc: 'Admin alerts and notifications' },
            { icon: Shield, label: 'Security', desc: 'Two-factor authentication enabled' },
            { icon: Database, label: 'Data Retention', desc: '90-day data retention policy' },
            { icon: Mail, label: 'Email Reports', desc: 'Weekly summary reports' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-surface-400" />
                <div><p className="text-sm font-medium text-surface-800 dark:text-white">{item.label}</p><p className="text-xs text-surface-400">{item.desc}</p></div>
              </div>
              <button className="w-11 h-6 rounded-full bg-primary-500 relative">
                <span className="absolute top-0.5 left-[22px] w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
