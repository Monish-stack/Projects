import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Bus, Star, Shield, Clock, Zap } from 'lucide-react';
import { DistrictAutocomplete } from '../components/DistrictAutocomplete';
import { useLanguage } from '../utils/LanguageContext';

export default function PassengerApp() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [date, setDate] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      navigate(`/results?from=${from}&to=${to}&date=${date}`);
    }
  };

  return (
    <div className="space-y-20 pb-20 min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 bg-[length:200%_200%] animate-gradient-slow">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-50/40 to-white/40 -z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-100/50 blur-3xl rounded-full -mr-64 -mt-32 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6 border border-indigo-200"
            >
              <Zap className="h-3 w-3 fill-indigo-700" /> AI-POWERED TRANSPORT ANALYTICS
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight"
            >
              {t('heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Tamil Nadu</span> {t('heroTitle2')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 mb-8"
            >
              {t('heroSubtitle')}
            </motion.p>
          </div>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl p-4 md:p-6 shadow-2xl shadow-indigo-900/5 border border-slate-100"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <DistrictAutocomplete 
                  value={from}
                  onChange={setFrom}
                  placeholder={t('leavingFrom')}
                />
              </div>
              <div className="flex-1">
                <DistrictAutocomplete 
                  value={to}
                  onChange={setTo}
                  placeholder={t('goingTo')}
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                </div>
                <input 
                  type="date" 
                  required 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800" 
                />
              </div>
              <button type="submit" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
                <Search className="h-5 w-5" /> {t('search')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">{t('whyChoose')}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{t('whyChooseDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Clock className="h-6 w-6 text-indigo-600" />, title: t('realTimeTracking'), desc: t('realTimeTrackingDesc') },
            { icon: <Shield className="h-6 w-6 text-emerald-600" />, title: t('secureBooking'), desc: t('secureBookingDesc') },
            { icon: <Star className="h-6 w-6 text-amber-500" />, title: t('smartRouting'), desc: t('smartRoutingDesc') },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${i === 0 ? 'bg-indigo-50' : i === 1 ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{t('popularRoutes')}</h2>
            <p className="text-slate-500">{t('popularRoutesDesc')}</p>
          </div>
          <button onClick={() => navigate('/search')} className="text-indigo-600 font-bold hover:text-indigo-700 hidden md:block">{t('viewAllRoutes')} &rarr;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { from: 'Chennai', to: 'Madurai', price: '₹850', time: '8h 30m' },
            { from: 'Coimbatore', to: 'Chennai', price: '₹950', time: '9h 15m' },
            { from: 'Trichy', to: 'Chennai', price: '₹600', time: '6h 00m' },
            { from: 'Salem', to: 'Madurai', price: '₹450', time: '4h 30m' },
          ].map((route, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors group cursor-pointer" onClick={() => navigate(`/results?from=${route.from}&to=${route.to}&date=${new Date().toISOString().split('T')[0]}`)}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Bus className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">{route.price}</div>
                  <div className="text-xs text-slate-400 font-medium">{t('startingFrom')}</div>
                </div>
              </div>
              <div className="font-bold text-slate-800 text-lg mb-1">{route.from}</div>
              <div className="text-slate-400 text-sm mb-1">{t('to')}</div>
              <div className="font-bold text-slate-800 text-lg mb-4">{route.to}</div>
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-xl w-fit">
                <Clock className="h-4 w-4" /> {route.time}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
