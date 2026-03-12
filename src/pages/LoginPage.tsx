import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bus, Mail, Phone, ArrowRight, Chrome, ShieldCheck } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [method, setMethod] = useState<'google' | 'phone'>('google');
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    await login(method, identifier);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20 rotate-3">
            <Bus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Your journey across Tamil Nadu continues here.</p>
        </div>

        <div className="flex p-1 bg-slate-800/50 rounded-2xl mb-8">
          <button 
            onClick={() => setMethod('google')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${method === 'google' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Chrome className="h-4 w-4" /> Google
          </button>
          <button 
            onClick={() => setMethod('phone')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${method === 'phone' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Phone className="h-4 w-4" /> Mobile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              {method === 'google' ? 'Gmail Address' : 'Mobile Number'}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                {method === 'google' ? <Mail className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
              </div>
              <input 
                type={method === 'google' ? 'email' : 'tel'}
                placeholder={method === 'google' ? 'name@gmail.com' : '+91 98765 43210'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Secure, encrypted connection
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 w-full text-center text-slate-600 text-xs font-bold uppercase tracking-[0.3em] pointer-events-none">
        TNSTC Smart Transit System
      </div>
    </div>
  );
}
