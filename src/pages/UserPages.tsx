import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, LogIn, Mail, Lock, History, Star, Bell, Settings, Heart, MessageSquare, ArrowRight, Info, Phone, Bus, Calendar, MapPin, QrCode } from 'lucide-react';
import { TravelHistoryDashboard } from './TravelHistoryDashboard';
import { UpcomingTrip, LiveTracker, TravelAnalytics, TravelHistoryChart, SmartRecommendations, WeatherAlerts, SavedRoutes, RecentReviews, Notifications, QuickActions, CrowdPrediction, Achievements } from '../components/dashboard/Widgets';
import { useLanguage } from '../utils/LanguageContext';

export function UserLoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <LogIn className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-center text-slate-800 mb-2 relative z-10">{t('welcomeBack')}</h1>
        <p className="text-center text-slate-500 mb-8 relative z-10">{t('signInToManage')}</p>
        
        <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 mb-6 relative z-10">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          {t('continueWithGoogle')}
        </button>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-sm text-slate-400 font-medium">{t('or')}</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('emailAddress')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="email" placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> {t('rememberMe')}
            </label>
            <a href="#" className="text-indigo-600 font-bold hover:underline">{t('forgotPassword')}</a>
          </div>
          <button type="button" onClick={() => navigate('/dashboard')} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors mt-4">
            {t('signIn')}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-8 relative z-10">
          {t('dontHaveAccount')} <Link to="/signup" className="text-indigo-600 font-bold hover:underline">{t('signUp')}</Link>
        </p>
      </div>
    </motion.div>
  );
}

export function UserSignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        <h1 className="text-3xl font-display font-bold text-center text-slate-800 mb-2 relative z-10">{t('createAccount')}</h1>
        <p className="text-center text-slate-500 mb-8 relative z-10">{t('joinToday')}</p>
        
        <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 mb-6 relative z-10">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          {t('signUpWithGoogle')}
        </button>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-sm text-slate-400 font-medium">{t('or')}</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('fullName')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('emailAddress')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="email" placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <button type="button" onClick={() => navigate('/dashboard')} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors mt-4">
            {t('createAccount')}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-8 relative z-10">
          {t('alreadyHaveAccount')} <Link to="/login" className="text-indigo-600 font-bold hover:underline">{t('signIn')}</Link>
        </p>
      </div>
    </motion.div>
  );
}

export function UserDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    totalSpent: 12450,
    trips: 15
  };

  const upcomingBuses = [
    { id: 'TNSTC-101', from: 'Chennai', to: 'Madurai', date: '15 Oct 2026', time: '08:30 PM', status: 'On Time', pnr: 'TNSTC-847291' },
    { id: 'TNSTC-205', from: 'Madurai', to: 'Coimbatore', date: '20 Oct 2026', time: '10:15 AM', status: 'Scheduled', pnr: 'TNSTC-938102' }
  ];

  const bookingHistory = [
    { id: '1', from: 'Chennai', to: 'Trichy', date: '01 Sep 2026', amount: 450, status: 'Completed' },
    { id: '2', from: 'Trichy', to: 'Madurai', date: '15 Aug 2026', amount: 320, status: 'Completed' },
    { id: '3', from: 'Madurai', to: 'Chennai', date: '10 Jul 2026', amount: 850, status: 'Completed' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-800">{t('dashboard')}</h1>
        <button onClick={() => navigate('/search')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
          {t('bookNewTicket')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Stats */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-slate-500 text-sm">{t('premiumMember')}</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-slate-400" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-lg text-white">
            <h3 className="text-lg font-medium opacity-90 mb-6">{t('travelSummary')}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm opacity-80 mb-1">{t('totalSpent')}</div>
                <div className="text-3xl font-bold">₹{user.totalSpent.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm opacity-80 mb-1">{t('totalTrips')}</div>
                <div className="text-3xl font-bold">{user.trips}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Buses */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Bus className="w-6 h-6 text-indigo-600" /> {t('upcomingJourneys')}
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingBuses.map((bus, idx) => (
                <div key={idx} className="p-6 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all bg-slate-50/50">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">{bus.date} • {bus.time}</div>
                        <div className="font-bold text-lg text-slate-800">{bus.from} <ArrowRight className="inline w-4 h-4 mx-1 text-slate-400" /> {bus.to}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">{t('pnr')}: {bus.pnr}</div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {bus.status}
                      </div>
                    </div>
                  </div>
                  
                  {idx === 0 && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 h-32 relative bg-slate-100">
                      {/* Simulated Map Background */}
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                      
                      {/* Route Line */}
                      <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-300 -translate-y-1/2 rounded-full"></div>
                      <div className="absolute top-1/2 left-10 right-1/3 h-1 bg-indigo-500 -translate-y-1/2 rounded-full"></div>
                      
                      {/* Points */}
                      <div className="absolute top-1/2 left-10 w-4 h-4 bg-indigo-600 border-4 border-white rounded-full -translate-y-1/2 -translate-x-1/2 shadow-sm"></div>
                      <div className="absolute top-1/2 right-10 w-4 h-4 bg-slate-400 border-4 border-white rounded-full -translate-y-1/2 translate-x-1/2 shadow-sm"></div>
                      
                      {/* Bus Icon */}
                      <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-white border-2 border-indigo-600 rounded-full -translate-y-1/2 translate-x-1/2 shadow-md flex items-center justify-center z-10 animate-pulse">
                        <Bus className="w-4 h-4 text-indigo-600" />
                      </div>
                      
                      {/* Labels */}
                      <div className="absolute top-1/2 left-10 mt-4 -translate-x-1/2 text-xs font-bold text-slate-600">{bus.from}</div>
                      <div className="absolute top-1/2 right-10 mt-4 translate-x-1/2 text-xs font-bold text-slate-600">{bus.to}</div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                        {t('liveTrackingActive')}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button onClick={() => navigate('/track')} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" /> {t('trackBus')}
                    </button>
                    <button onClick={() => navigate('/ticket')} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <QrCode className="w-4 h-4" /> {t('viewTicket')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <History className="w-6 h-6 text-slate-400" /> {t('bookingHistory')}
              </h2>
              <button onClick={() => navigate('/history')} className="text-indigo-600 font-bold text-sm hover:underline">{t('viewAll')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-sm">
                    <th className="pb-4 font-medium">{t('route')}</th>
                    <th className="pb-4 font-medium">{t('date')}</th>
                    <th className="pb-4 font-medium">{t('amount')}</th>
                    <th className="pb-4 font-medium">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {bookingHistory.map((booking, idx) => (
                    <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-medium text-slate-800">{booking.from} → {booking.to}</td>
                      <td className="py-4 text-slate-600">{booking.date}</td>
                      <td className="py-4 font-bold text-slate-800">₹{booking.amount}</td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
