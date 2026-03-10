import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Globe, Moon, Sun, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

export default function LoginPage() {
  const { language, setLanguage, t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [method, setMethod] = useState<'google' | 'phone'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ta' : 'en');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setIsOtpSent(true);
    }, 1500);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      if (otp.join('') === '123456') {
        setSuccess(true);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">B</div>
          <span className="font-bold text-xl tracking-tight">SmartBus</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleLanguage} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            <Globe className="h-4 w-4" /> {language === 'en' ? 'EN' : 'TA'}
          </button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center p-6 min-h-[calc(100vh-100px)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome to Smart Bus App</h1>
          <p className="text-slate-500 mb-8">Track buses, book tickets, and travel smarter</p>

          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <span className="text-6xl">🚌</span>
            </div>
          </div>

          {!success ? (
            <div className="space-y-6">
              {!isOtpSent ? (
                <>
                  <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                    <span className="text-slate-400 text-sm">OR</span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                  </div>
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input 
                        type="tel" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 Phone Number"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-500">
                      <input type="checkbox" className="rounded border-slate-300" /> Remember Me
                    </label>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <p className="text-sm">Enter the OTP sent to {phoneNumber}</p>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input 
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const newOtp = [...otp];
                          newOtp[i] = e.target.value;
                          setOtp(newOtp);
                        }}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ))}
                  </div>
                  {error && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</p>}
                  <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-8">
              <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-500 text-sm p-6">
        <div className="flex justify-center gap-4 mb-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
        <p>© 2026 Government Transport Authority</p>
      </footer>
    </div>
  );
}
