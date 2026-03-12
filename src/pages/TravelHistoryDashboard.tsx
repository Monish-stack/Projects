import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { MapPin, DollarSign, Bus, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export function TravelHistoryDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Mock user ID for now
    fetch('/api/user/analytics/USER123')
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, []);

  if (!analytics) return <div>{t('loading')}</div>;

  const badge = analytics.totalTrips >= 50 ? t('superTraveler') : analytics.totalTrips >= 10 ? t('explorer') : t('newbie');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('travelHistory')}</h1>
        <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <Award className="h-5 w-5" /> {badge}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm">{t('totalTrips')}</div>
          <div className="text-3xl font-bold">{analytics.totalTrips}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm">{t('distanceTraveled')}</div>
          <div className="text-3xl font-bold">{analytics.totalDistance} km</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm">{t('totalSpent')}</div>
          <div className="text-3xl font-bold">₹{analytics.totalMoneySpent}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-sm">{t('favoriteRoute')}</div>
          <div className="text-lg font-bold">{analytics.favoriteRoute}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4">{t('recentTrips')}</h3>
          <div className="space-y-4">
            {analytics.recentTrips.map((trip: any, i: number) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-bold">{trip.source} → {trip.destination}</div>
                  <div className="text-sm text-slate-500">{new Date(trip.travelDate).toLocaleDateString()}</div>
                </div>
                <div className="font-bold">₹{trip.totalPrice}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Charts would go here, using analytics data */}
      </div>
    </motion.div>
  );
}
