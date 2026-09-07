'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '@/components/ui/avatar';
import { chatService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Bot, Send, Plus, Search, MessageSquare, Sparkles, Paperclip, Mic, AlertTriangle, Clock, Loader2 } from 'lucide-react';

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([{ id: 'welcome', role: 'assistant', content: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm your MediSync healthcare assistant. How can I help you today?`, timestamp: new Date().toISOString() }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [searchConvo, setSearchConvo] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => { chatService.getConversations().then(setConversations).catch(() => {}); }, []);

  const send = async () => {
    if (!input.trim()) return;
    const msg = { id: Date.now().toString(), role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setTyping(true);
    try {
      const resp = await chatService.sendMessage(msg.content);
      setMessages(prev => [...prev, { ...resp, id: (Date.now() + 1).toString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date().toISOString() }]);
    }
    setTyping(false);
  };

  const filteredConvos = conversations.filter(c => c.title.toLowerCase().includes(searchConvo.toLowerCase()));

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-0 -m-4 lg:-m-8">
      <div className="hidden lg:flex flex-col w-[280px] border-r border-surface-200/60 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="p-4"><button className="w-full flex items-center gap-2 px-4 py-2.5 btn-gradient text-white text-sm font-medium rounded-xl shadow-lg shadow-primary-600/20"><Plus size={16} /> New Conversation</button></div>
        <div className="px-4 mb-3"><div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/60"><Search size={14} className="text-surface-400" /><input value={searchConvo} onChange={e => setSearchConvo(e.target.value)} placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-surface-700 dark:text-surface-300 placeholder:text-surface-400 w-full" /></div></div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <p className="px-2 text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-2">Recent</p>
          {filteredConvos.map(c => (
            <button key={c.id} className="w-full text-left px-3 py-2.5 rounded-xl text-sm hover:bg-surface-100 dark:hover:bg-surface-800/60 transition-colors mb-0.5 group">
              <div className="flex items-center gap-2"><MessageSquare size={14} className="text-surface-400 shrink-0" /><span className="text-surface-700 dark:text-surface-200 font-medium truncate">{c.title}</span></div>
              <p className="text-xs text-surface-400 ml-6 mt-0.5">{c.date}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-surface-50 dark:bg-surface-950">
        <div className="px-6 py-4 border-b border-surface-200/60 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white text-xs font-bold">AI</div>
          <div><h2 className="text-sm font-semibold text-surface-900 dark:text-white">MediSync Assistant</h2><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success-500" /><span className="text-xs text-success-600 dark:text-success-500">Online — Ready to help</span></div></div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center text-white mb-4"><Sparkles size={28} /></div>
              <h3 className="text-lg font-bold text-surface-800 dark:text-white">How can I help you today?</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 max-w-md">Ask about your reports, appointments, prescriptions, or any health question.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {['Show my latest report', 'Book an appointment', 'Check my queue status', 'Summarize my health'].map(s => (
                  <button key={s} onClick={() => setInput(s)} className="px-4 py-2 text-xs font-medium bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">{s}</button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' ? (
                  <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shrink-0 text-white text-[10px] font-bold">AI</div>
                ) : (<Avatar name={user?.name || 'User'} size="sm" />)}
                <div className={`max-w-[70%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'btn-gradient text-white rounded-tr-sm' : 'surface-elevated text-surface-700 dark:text-surface-200 rounded-tl-sm'}`}>{msg.content}</div>
                  <p className="text-[10px] text-surface-400 mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shrink-0 text-white text-[10px] font-bold">AI</div>
              <div className="surface-elevated rounded-2xl rounded-tl-sm px-4 py-3"><div className="flex gap-1">{[0, 1, 2].map(i => (<motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} className="w-2 h-2 rounded-full bg-primary-500" />))}</div></div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-6 py-2"><div className="flex items-center gap-2 text-xs text-surface-400 bg-warning-50/60 dark:bg-warning-50/5 px-3 py-2 rounded-lg"><AlertTriangle size={12} className="text-warning-500 shrink-0" /><span>AI responses are for informational purposes and should not replace professional medical advice.</span></div></div>

        <div className="px-4 sm:px-8 pb-6 pt-2">
          <div className="flex items-center gap-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl px-4 py-3 shadow-lg shadow-surface-900/5">
            <button className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-400"><Paperclip size={16} /></button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Ask MediSync AI anything..." className="flex-1 bg-transparent border-none outline-none text-sm text-surface-700 dark:text-surface-200 placeholder:text-surface-400" />
            <button className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-400"><Mic size={16} /></button>
            <button onClick={send} disabled={!input.trim()} className="p-2 rounded-xl btn-gradient text-white disabled:opacity-30 transition-opacity"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
