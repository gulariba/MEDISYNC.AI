'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import PageHeader from '@/components/layout/page-header';
import { adminService } from '@/services/api';
import { Search, Loader2 } from 'lucide-react';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try { setPatients(await adminService.getPatients()); } catch { /* empty */ }
      setLoading(false);
    })();
  }, []);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Patients" subtitle={`${patients.length} registered patients`} />
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 mb-6 max-w-sm">
        <Search size={16} className="text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="bg-transparent border-none outline-none text-sm text-surface-700 dark:text-surface-300 placeholder:text-surface-400 w-full" />
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 dark:border-surface-800">
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Blood</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Gender</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-12"><Loader2 size={24} className="animate-spin text-surface-400 mx-auto" /></td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors">
                  <td className="px-6 py-3.5 flex items-center gap-3"><Avatar name={p.name} size="sm" /><span className="font-medium text-surface-800 dark:text-white">{p.name}</span></td>
                  <td className="px-6 py-3.5 text-surface-500">{p.email || `Patient #${p.id}`}</td>
                  <td className="px-6 py-3.5"><Badge variant="primary">{p.bloodGroup || '—'}</Badge></td>
                  <td className="px-6 py-3.5 text-surface-500">{p.gender || '—'}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-surface-400">No patients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
