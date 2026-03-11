import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Bus, Map, TrendingUp, Settings, Plus, Edit, Trash2, Search, Filter, Download, Zap } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-4 flex items-center justify-center relative z-10">
            <Settings className="h-8 w-8 text-indigo-300" />
          </div>
          <h3 className="font-bold text-lg relative z-10">Admin Portal</h3>
          <p className="text-xs text-slate-400 relative z-10">System Management</p>
        </div>
        
        <nav className="space-y-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><TrendingUp className="h-5 w-5" /> Overview</button>
          <button onClick={() => window.location.href='/analytics'} className="w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"><Zap className="h-5 w-5 text-amber-500" /> AI Analytics</button>
          <button onClick={() => setActiveTab('buses')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'buses' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Bus className="h-5 w-5" /> Manage Buses</button>
          <button onClick={() => setActiveTab('routes')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'routes' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Map className="h-5 w-5" /> Manage Routes</button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Users className="h-5 w-5" /> Passengers</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Settings className="h-5 w-5" /> System Settings</button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Revenue</div>
                <div className="text-3xl font-bold text-slate-800 relative z-10">₹1.2M</div>
                <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="h-3 w-3" /> +14% this month</div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Active Routes</div>
                <div className="text-3xl font-bold text-slate-800 relative z-10">4,892</div>
                <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="h-3 w-3" /> +2% this month</div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Bookings</div>
                <div className="text-3xl font-bold text-slate-800 relative z-10">15.4K</div>
                <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="h-3 w-3" /> +8% this month</div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Active Users</div>
                <div className="text-3xl font-bold text-slate-800 relative z-10">8.2K</div>
                <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="h-3 w-3" /> +12% this month</div>
              </div>
            </div>

            <div className="bg-indigo-600 p-8 rounded-3xl shadow-lg shadow-indigo-600/20 text-white mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-amber-400" /> AI Route Optimization
                  </h3>
                  <p className="text-indigo-100 max-w-xl">
                    Our AI engine has detected 10 new high-potential routes with an average profitability score of 84%. 
                    Expand your network to capture untapped demand in the Salem-Tirunelveli corridor.
                  </p>
                </div>
                <button 
                  onClick={() => window.location.href='/analytics'}
                  className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap"
                >
                  View AI Recommendations
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                  Popular Routes
                  <button className="text-sm text-indigo-600 hover:underline">View All</button>
                </h3>
                <div className="space-y-4">
                  {[
                    { route: 'Chennai - Madurai', bookings: 1240, revenue: '₹8.5L' },
                    { route: 'Coimbatore - Chennai', bookings: 980, revenue: '₹6.2L' },
                    { route: 'Trichy - Chennai', bookings: 850, revenue: '₹4.1L' },
                    { route: 'Salem - Madurai', bookings: 620, revenue: '₹2.8L' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div>
                        <div className="font-bold text-slate-800">{item.route}</div>
                        <div className="text-xs text-slate-500">{item.bookings} bookings</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-indigo-600">{item.revenue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                  Recent Bookings
                  <button className="text-sm text-indigo-600 hover:underline">View All</button>
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'TNSTC-847291', user: 'John Doe', route: 'Chennai - Madurai', status: 'Confirmed', amount: '₹990' },
                    { id: 'TNSTC-192837', user: 'Jane Smith', route: 'Coimbatore - Salem', status: 'Confirmed', amount: '₹450' },
                    { id: 'TNSTC-564738', user: 'Mike Johnson', route: 'Trichy - Chennai', status: 'Pending', amount: '₹680' },
                    { id: 'TNSTC-293847', user: 'Sarah Williams', route: 'Madurai - Kanyakumari', status: 'Cancelled', amount: '₹550' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{item.id}</div>
                        <div className="text-xs text-slate-500">{item.user} • {item.route}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800 text-sm">{item.amount}</div>
                        <div className={`text-xs font-bold ${item.status === 'Confirmed' ? 'text-emerald-600' : item.status === 'Pending' ? 'text-amber-500' : 'text-rose-500'}`}>{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'buses' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-slate-800">Manage Buses</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4" /> Add Bus
              </button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search buses..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                  <Filter className="h-4 w-4" /> Filter
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <th className="p-4">Bus Number</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Route</th>
                      <th className="p-4">Seats</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { no: 'TNSTC 1024', type: 'Express', route: 'Chennai - Madurai', seats: 40, status: 'Active' },
                      { no: 'TNSTC 2048', type: 'Ultra Deluxe', route: 'Coimbatore - Chennai', seats: 36, status: 'Active' },
                      { no: 'TNSTC 4096', type: 'AC Sleeper', route: 'Trichy - Chennai', seats: 30, status: 'Maintenance' },
                      { no: 'TNSTC 8192', type: 'Deluxe', route: 'Salem - Madurai', seats: 45, status: 'Active' },
                    ].map((bus, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{bus.no}</td>
                        <td className="p-4 text-sm text-slate-600">{bus.type}</td>
                        <td className="p-4 text-sm text-slate-600">{bus.route}</td>
                        <td className="p-4 text-sm text-slate-600">{bus.seats}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${bus.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {bus.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                          <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-500 text-center">
                Showing 1-4 of 1,204 buses
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
