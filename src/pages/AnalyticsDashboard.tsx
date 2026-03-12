import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { TrendingUp, AlertCircle, Lightbulb, Map, Activity, DollarSign } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface AnalyticsData {
  stats: {
    topSources: { city: string; count: number }[];
    topDestinations: { city: string; count: number }[];
    avgPrice: number;
    routeFrequency: { route: string; count: number }[];
  };
  demandGaps: {
    source: string;
    destination: string;
    reason: string;
    potentialScore: number;
  }[];
  recommendations: {
    route: string;
    expectedDemand: string;
    suggestedPrice: number;
    profitabilityScore: number;
  }[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7'];

export default function AnalyticsDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) return <div>Error loading analytics</div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">{t('aiAnalytics') || "AI Transport Analytics"}</h1>
          <p className="text-slate-500">Predictive engine for profitable bus routes</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <Activity className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-bold text-indigo-700">Engine Status: Active</span>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Average Ticket Price</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{data.stats.avgPrice.toFixed(2)}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Map className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Unique Cities</p>
              <h3 className="text-2xl font-bold text-slate-900">{data.stats.topSources.length + 10}+</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">New Opportunities</p>
              <h3 className="text-2xl font-bold text-slate-900">{data.recommendations.length} Routes</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Top 10 Busiest Routes</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stats.routeFrequency} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="route" type="category" width={150} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Ticket Price Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { range: '₹0-200', count: 120 },
                { range: '₹201-400', count: 250 },
                { range: '₹401-600', count: 180 },
                { range: '₹601-800', count: 90 },
                { range: '₹801+', count: 40 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Demand Gaps */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-800">Demand Gap Detection</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.demandGaps.map((gap, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="font-bold text-slate-800">{gap.source} &rarr; {gap.destination}</div>
                <div className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg">{gap.potentialScore}% Potential</div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{gap.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h3 className="text-xl font-bold text-slate-800">AI Recommended New Routes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Recommended Route</th>
                <th className="p-4">Expected Demand</th>
                <th className="p-4">Suggested Price</th>
                <th className="p-4">Profitability Score</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recommendations.map((rec, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{rec.route}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${rec.expectedDemand === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {rec.expectedDemand}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">₹{rec.suggestedPrice}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600" 
                          style={{ width: `${rec.profitabilityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{rec.profitabilityScore}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                      Deploy Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
