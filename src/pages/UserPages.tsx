import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, LogIn, Mail, Lock, History, Star, Bell, Settings, Heart, MessageSquare, ArrowRight, Info } from 'lucide-react';
import { TravelHistoryDashboard } from './TravelHistoryDashboard';
import { UpcomingTrip, LiveTracker, TravelAnalytics, TravelHistoryChart, SmartRecommendations, WeatherAlerts, SavedRoutes, RecentReviews, Notifications, QuickActions, CrowdPrediction, Achievements } from '../components/dashboard/Widgets';

export function UserLoginPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <LogIn className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-center text-slate-800 mb-2 relative z-10">Welcome Back</h1>
        <p className="text-center text-slate-500 mb-8 relative z-10">Sign in to manage your bookings</p>
        
        <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 mb-6 relative z-10">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-sm text-slate-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="email" placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Remember me
            </label>
            <a href="#" className="text-indigo-600 font-bold hover:underline">Forgot password?</a>
          </div>
          <button type="button" onClick={() => navigate('/dashboard')} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors mt-4">
            Sign In
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-8 relative z-10">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </motion.div>
  );
}

export function UserSignupPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        <h1 className="text-3xl font-display font-bold text-center text-slate-800 mb-2 relative z-10">Create Account</h1>
        <p className="text-center text-slate-500 mb-8 relative z-10">Join TNBusTrack today</p>
        
        <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 mb-6 relative z-10">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          Sign up with Google
        </button>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-sm text-slate-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="email" placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <button type="button" onClick={() => navigate('/dashboard')} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors mt-4">
            Create Account
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-500 mt-8 relative z-10">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}

export function UserDashboard() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>
        <button onClick={() => navigate('/search')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
          Book a new ticket
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UpcomingTrip />
        <LiveTracker />
        <TravelAnalytics />
        <TravelHistoryChart />
        <SmartRecommendations />
        <WeatherAlerts />
        <SavedRoutes />
        <RecentReviews />
        <Notifications />
        <QuickActions />
        <CrowdPrediction />
        <Achievements />
      </div>
    </motion.div>
  );
}
