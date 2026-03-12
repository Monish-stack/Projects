import React from 'react';
import { motion } from 'motion/react';
import { MapPin, DollarSign, Bus, Award, ArrowRight, CloudRain, Star, Bell, Zap, Users } from 'lucide-react';
import { DashboardWidget } from '../DashboardWidget';
import { useLanguage } from '../../utils/LanguageContext';

export const UpcomingTrip = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('upcomingTrip') || "Upcoming Trip"} className="md:col-span-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xl font-bold">Chennai → Madurai</div>
          <div className="text-sm text-slate-500">12 Oct 2026 • 08:30 PM</div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">{t('track') || "Track"}</button>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold">{t('ticket') || "Ticket"}</button>
        </div>
      </div>
    </DashboardWidget>
  );
};

export const LiveTracker = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('liveBusTracker') || "Live Bus Tracker"} className="md:col-span-2">
      <div className="h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        [Google Maps Placeholder]
      </div>
    </DashboardWidget>
  );
};

export const TravelAnalytics = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('travelAnalytics') || "Travel Analytics"} className="md:col-span-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center"><div className="text-2xl font-bold">42</div><div className="text-xs text-slate-500">{t('trips') || "Trips"}</div></div>
        <div className="text-center"><div className="text-2xl font-bold">12k</div><div className="text-xs text-slate-500">{t('km') || "KM"}</div></div>
      </div>
    </DashboardWidget>
  );
};

export const TravelHistoryChart = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('travelHistory') || "Travel History"} className="md:col-span-2">
      <div className="h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        [Chart.js Placeholder]
      </div>
    </DashboardWidget>
  );
};

export const SmartRecommendations = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('recommendations') || "Recommendations"}>
      <div className="text-sm font-bold">Chennai → Coimbatore</div>
      <div className="text-xs text-slate-500">06:30 AM • ₹420</div>
    </DashboardWidget>
  );
};

export const WeatherAlerts = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('weatherAlerts') || "Weather Alerts"}>
      <div className="flex items-center gap-2 text-amber-600">
        <CloudRain className="h-5 w-5" />
        <span className="text-sm font-bold">Heavy rain near Salem.</span>
      </div>
    </DashboardWidget>
  );
};

export const SavedRoutes = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('savedRoutes') || "Saved Routes"}>
      <div className="text-sm">Chennai ↔ Coimbatore</div>
    </DashboardWidget>
  );
};

export const RecentReviews = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('recentReviews') || "Recent Reviews"}>
      <div className="flex text-amber-400"><Star className="h-4 w-4 fill-current" /> <span className="text-slate-800 ml-2">Great!</span></div>
    </DashboardWidget>
  );
};

export const Notifications = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('notifications') || "Notifications"}>
      <div className="flex items-center gap-2 text-sm"><Bell className="h-4 w-4" /> Bus delayed</div>
    </DashboardWidget>
  );
};

export const QuickActions = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('quickActions') || "Quick Actions"}>
      <div className="grid grid-cols-2 gap-2">
        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{t('book') || "Book"}</button>
        <button className="p-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">{t('track') || "Track"}</button>
      </div>
    </DashboardWidget>
  );
};

export const CrowdPrediction = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('crowdPrediction') || "Crowd Prediction"}>
      <div className="text-sm font-bold">Medium 🟡</div>
    </DashboardWidget>
  );
};

export const Achievements = () => {
  const { t } = useLanguage();
  return (
    <DashboardWidget title={t('achievements') || "Achievements"}>
      <div className="flex items-center gap-2"><Award className="h-5 w-5 text-amber-500" /> <span className="text-sm font-bold">{t('explorer') || "Explorer"}</span></div>
    </DashboardWidget>
  );
};
