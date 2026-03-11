import React from 'react';
import { motion } from 'motion/react';
import { MapPin, DollarSign, Bus, Award, ArrowRight, CloudRain, Star, Bell, Zap, Users } from 'lucide-react';
import { DashboardWidget } from '../DashboardWidget';

export const UpcomingTrip = () => (
  <DashboardWidget title="Upcoming Trip" className="md:col-span-2">
    <div className="flex justify-between items-center">
      <div>
        <div className="text-xl font-bold">Chennai → Madurai</div>
        <div className="text-sm text-slate-500">12 Oct 2026 • 08:30 PM</div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">Track</button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold">Ticket</button>
      </div>
    </div>
  </DashboardWidget>
);

export const LiveTracker = () => (
  <DashboardWidget title="Live Bus Tracker" className="md:col-span-2">
    <div className="h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
      [Google Maps Placeholder]
    </div>
  </DashboardWidget>
);

export const TravelAnalytics = () => (
  <DashboardWidget title="Travel Analytics" className="md:col-span-2">
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center"><div className="text-2xl font-bold">42</div><div className="text-xs text-slate-500">Trips</div></div>
      <div className="text-center"><div className="text-2xl font-bold">12k</div><div className="text-xs text-slate-500">KM</div></div>
    </div>
  </DashboardWidget>
);

export const TravelHistoryChart = () => (
  <DashboardWidget title="Travel History" className="md:col-span-2">
    <div className="h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
      [Chart.js Placeholder]
    </div>
  </DashboardWidget>
);

export const SmartRecommendations = () => (
  <DashboardWidget title="Recommendations">
    <div className="text-sm font-bold">Chennai → Coimbatore</div>
    <div className="text-xs text-slate-500">06:30 AM • ₹420</div>
  </DashboardWidget>
);

export const WeatherAlerts = () => (
  <DashboardWidget title="Weather Alerts">
    <div className="flex items-center gap-2 text-amber-600">
      <CloudRain className="h-5 w-5" />
      <span className="text-sm font-bold">Heavy rain near Salem.</span>
    </div>
  </DashboardWidget>
);

export const SavedRoutes = () => (
  <DashboardWidget title="Saved Routes">
    <div className="text-sm">Chennai ↔ Coimbatore</div>
  </DashboardWidget>
);

export const RecentReviews = () => (
  <DashboardWidget title="Recent Reviews">
    <div className="flex text-amber-400"><Star className="h-4 w-4 fill-current" /> <span className="text-slate-800 ml-2">Great!</span></div>
  </DashboardWidget>
);

export const Notifications = () => (
  <DashboardWidget title="Notifications">
    <div className="flex items-center gap-2 text-sm"><Bell className="h-4 w-4" /> Bus delayed</div>
  </DashboardWidget>
);

export const QuickActions = () => (
  <DashboardWidget title="Quick Actions">
    <div className="grid grid-cols-2 gap-2">
      <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">Book</button>
      <button className="p-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">Track</button>
    </div>
  </DashboardWidget>
);

export const CrowdPrediction = () => (
  <DashboardWidget title="Crowd Prediction">
    <div className="text-sm font-bold">Medium 🟡</div>
  </DashboardWidget>
);

export const Achievements = () => (
  <DashboardWidget title="Achievements">
    <div className="flex items-center gap-2"><Award className="h-5 w-5 text-amber-500" /> <span className="text-sm font-bold">Explorer</span></div>
  </DashboardWidget>
);
