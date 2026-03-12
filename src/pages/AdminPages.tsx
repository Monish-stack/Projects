import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Bus, Map, TrendingUp, Settings, Plus, Edit, Trash2, 
  Search, Filter, Download, Zap, X, Check, AlertCircle, Save,
  DollarSign, Activity
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface BusData {
  id: string;
  no: string;
  type: string;
  route: string;
  seats: number;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

interface RouteData {
  id: string;
  name: string;
  distance: string;
  duration: string;
  stops: number;
  status: 'Active' | 'Proposed';
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  trips: number;
  status: 'Active' | 'Suspended';
}

interface RoleData {
  id: string;
  name: string;
  permissions: string;
  users: number;
}

interface ApiKeyData {
  id: string;
  name: string;
  key: string;
  status: 'Active' | 'Inactive';
}

export function AdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  
  // State for CRUD operations
  const [buses, setBuses] = useState<BusData[]>([
    { id: '1', no: 'TNSTC 1024', type: 'Express', route: 'Chennai - Madurai', seats: 40, status: 'Active' },
    { id: '2', no: 'TNSTC 2048', type: 'Ultra Deluxe', route: 'Coimbatore - Chennai', seats: 36, status: 'Active' },
    { id: '3', no: 'TNSTC 4096', type: 'AC Sleeper', route: 'Trichy - Chennai', seats: 30, status: 'Maintenance' },
    { id: '4', no: 'TNSTC 8192', type: 'Deluxe', route: 'Salem - Madurai', seats: 45, status: 'Active' },
  ]);

  const [routes, setRoutes] = useState<RouteData[]>([
    { id: '1', name: 'Chennai - Madurai', distance: '462 km', duration: '8h 30m', stops: 12, status: 'Active' },
    { id: '2', name: 'Coimbatore - Chennai', distance: '510 km', duration: '9h 15m', stops: 15, status: 'Active' },
    { id: '3', name: 'Salem - Tirunelveli', distance: '320 km', duration: '6h 00m', stops: 8, status: 'Proposed' },
  ]);

  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', trips: 15, status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 87654 32109', trips: 8, status: 'Active' },
    { id: '3', name: 'Mike Ross', email: 'mike@example.com', phone: '+91 76543 21098', trips: 2, status: 'Suspended' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'bus' | 'route' | 'user' | 'role' | 'apiKey' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Settings State
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    autoOptimization: true,
    realTimeTracking: true,
    emailNotifications: true
  });

  const [adminRoles, setAdminRoles] = useState<RoleData[]>([
    { id: '1', name: 'Super Admin', permissions: 'All Access', users: 2 },
    { id: '2', name: 'Route Manager', permissions: 'Routes, Buses', users: 5 },
    { id: '3', name: 'Support Agent', permissions: 'Users, Tickets', users: 12 },
  ]);

  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([
    { id: '1', name: 'Mobile App Production', key: 'pk_live_********************', status: 'Active' },
    { id: '2', name: 'Testing Environment', key: 'pk_test_********************', status: 'Active' },
  ]);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: string, id: string } | null>(null);

  const [pendingDangerAction, setPendingDangerAction] = useState<string | null>(null);

  // Modal Handlers
  const openModal = (type: 'bus' | 'route' | 'user' | 'role' | 'apiKey', item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType(null);
  };

  const handleDelete = (type: string, id: string) => {
    setDeleteConfirmation({ type, id });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    const { type, id } = deleteConfirmation;
    
    if (type === 'bus') setBuses(buses.filter(b => b.id !== id));
    if (type === 'route') setRoutes(routes.filter(r => r.id !== id));
    if (type === 'user') setUsers(users.filter(u => u.id !== id));
    if (type === 'role') setAdminRoles(adminRoles.filter(r => r.id !== id));
    if (type === 'apiKey') setApiKeys(apiKeys.filter(k => k.id !== id));
    
    setDeleteConfirmation(null);
  };

  const handleExport = (type: string) => {
    let dataToExport: any[] = [];
    if (type === 'buses') dataToExport = buses;
    if (type === 'routes') dataToExport = routes;
    if (type === 'users') dataToExport = users;
    
    if (dataToExport.length === 0) {
      alert('No data to export.');
      return;
    }
    
    const headers = Object.keys(dataToExport[0]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + dataToExport.map(row => headers.map(h => `"${row[h]}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (modalType === 'bus') {
      if (editingItem) {
        setBuses(buses.map(b => b.id === editingItem.id ? { ...b, ...data } as BusData : b));
      } else {
        setBuses([...buses, { id: Date.now().toString(), ...data, seats: Number(data.seats) } as BusData]);
      }
    } else if (modalType === 'route') {
      if (editingItem) {
        setRoutes(routes.map(r => r.id === editingItem.id ? { ...r, ...data } as RouteData : r));
      } else {
        setRoutes([...routes, { id: Date.now().toString(), ...data, stops: Number(data.stops) } as RouteData]);
      }
    } else if (modalType === 'user') {
      if (editingItem) {
        setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...data } as UserData : u));
      } else {
        setUsers([...users, { id: Date.now().toString(), ...data, trips: 0 } as UserData]);
      }
    } else if (modalType === 'role') {
      if (editingItem) {
        setAdminRoles(adminRoles.map(r => r.id === editingItem.id ? { ...r, ...data } as unknown as RoleData : r));
      } else {
        setAdminRoles([...adminRoles, { id: Date.now().toString(), ...data, users: 0 } as unknown as RoleData]);
      }
    } else if (modalType === 'apiKey') {
      if (editingItem) {
        setApiKeys(apiKeys.map(k => k.id === editingItem.id ? { ...k, ...data } as unknown as ApiKeyData : k));
      } else {
        setApiKeys([...apiKeys, { id: Date.now().toString(), ...data, status: 'Active' } as unknown as ApiKeyData]);
      }
    }
    closeModal();
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDangerAction = (action: string) => {
    setPendingDangerAction(action);
  };

  const confirmDangerAction = () => {
    if (pendingDangerAction) {
      alert(`Action "${pendingDangerAction}" executed successfully.`);
      setPendingDangerAction(null);
    }
  };

  const runOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setAiRecommendations([]);

    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          setAiRecommendations([
            { id: 'rec1', source: 'Salem', destination: 'Tirunelveli', demand: 'High', potential: 92, suggestedPrice: 450, reason: 'High demand gap in the southern corridor. 15% increase in search volume detected.' },
            { id: 'rec2', source: 'Erode', destination: 'Chennai', demand: 'Medium', potential: 78, suggestedPrice: 520, reason: 'Industrial hub connectivity requirement. Current connecting routes are over-saturated.' },
            { id: 'rec3', source: 'Madurai', destination: 'Vellore', demand: 'High', potential: 85, suggestedPrice: 480, reason: 'Medical tourism surge detected. Direct connectivity will reduce travel time by 2 hours.' },
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDeployRoute = (rec: any) => {
    const newRoute: RouteData = {
      id: Date.now().toString(),
      name: `${rec.source} - ${rec.destination}`,
      distance: '350 km', // Mock distance
      duration: '6h 30m', // Mock duration
      stops: 10,
      status: 'Active'
    };
    setRoutes([...routes, newRoute]);
    setAiRecommendations(aiRecommendations.filter(r => r.id !== rec.id));
    alert(`Route ${newRoute.name} has been successfully deployed and is now live!`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-4 md:p-0">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-4 flex items-center justify-center relative z-10">
            <Settings className="h-8 w-8 text-indigo-300" />
          </div>
          <h3 className="font-bold text-lg relative z-10">{t('adminPortal') || 'Admin Portal'}</h3>
          <p className="text-xs text-slate-400 relative z-10">System Management</p>
        </div>
        
        <nav className="space-y-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><TrendingUp className="h-5 w-5" /> {t('overview') || 'Overview'}</button>
          <button onClick={() => setActiveTab('optimization')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'optimization' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Zap className="h-5 w-5 text-amber-500" /> AI Optimization</button>
          <button onClick={() => setActiveTab('buses')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'buses' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Bus className="h-5 w-5" /> Manage Buses</button>
          <button onClick={() => setActiveTab('routes')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'routes' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Map className="h-5 w-5" /> Manage Routes</button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Users className="h-5 w-5" /> Passengers</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}><Settings className="h-5 w-5" /> System Settings</button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {activeTab === 'optimization' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-800">AI Route Optimization</h2>
                <p className="text-slate-500">Intelligent network expansion and demand forecasting</p>
              </div>
              <button 
                onClick={runOptimization}
                disabled={isOptimizing}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                {isOptimizing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="h-5 w-5" />}
                {isOptimizing ? 'Analyzing Network...' : 'Run New Analysis'}
              </button>
            </div>

            {isOptimizing && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-600">Optimization Progress</span>
                  <span className="text-sm font-bold text-indigo-600">{optimizationProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${optimizationProgress}%` }}
                    className="h-full bg-indigo-600"
                  />
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Scanning Traffic Patterns', 'Analyzing Demand Gaps', 'Calculating Profitability', 'Simulating Network Load'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${optimizationProgress > (i + 1) * 25 ? 'bg-emerald-500' : 'bg-slate-300 animate-pulse'}`} />
                      <span className="text-xs font-medium text-slate-500">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isOptimizing && aiRecommendations.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Top Opportunities Detected
                  </h3>
                  <div className="space-y-4">
                    {aiRecommendations.map((rec) => (
                      <motion.div 
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase tracking-wider">
                                {rec.demand} Demand
                              </div>
                              <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black rounded-full uppercase tracking-wider">
                                {rec.potential}% Score
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-slate-800">{rec.source} &rarr; {rec.destination}</h4>
                              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{rec.reason}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">Suggested: ₹{rec.suggestedPrice}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">Est. 450+ Daily</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center gap-2">
                            <button 
                              onClick={() => handleDeployRoute(rec)}
                              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
                            >
                              Deploy Route
                            </button>
                            <button className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all whitespace-nowrap">
                              Run Simulation
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-30"></div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                      <Activity className="h-5 w-5 text-indigo-400" />
                      Network Impact
                    </h3>
                    <div className="space-y-6 relative z-10">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Coverage Increase</span>
                          <span className="text-emerald-400 font-bold">+12.4%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[65%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Revenue Projection</span>
                          <span className="text-indigo-400 font-bold">+₹2.4M</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-[45%]" />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-slate-400 italic">
                          * Projections based on historical data and seasonal trends.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      AI Insights
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                          Peak demand detected during weekend evenings. Consider dynamic pricing for the Chennai corridor.
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                          Connecting routes via Trichy are showing 95% occupancy. AI suggests adding 2 more express buses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isOptimizing && aiRecommendations.length === 0 && (
              <div className="bg-white p-16 rounded-[3rem] shadow-sm border border-slate-100 text-center space-y-6">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-12 w-12 text-indigo-600" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-black text-slate-800">Ready to Optimize?</h3>
                  <p className="text-slate-500 mt-2">Run our AI engine to scan for new route opportunities and network improvements.</p>
                </div>
                <button 
                  onClick={runOptimization}
                  className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30"
                >
                  Run Analysis Now
                </button>
              </div>
            )}
          </motion.div>
        )}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Revenue</div>
                <div className="text-3xl font-bold text-slate-800 relative z-10">₹1.2M</div>
                <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="h-3 w-3" /> +14% this month</div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full blur-xl -mr-8 -mt-8"></div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Active Routes</div>
                <div className="text-3xl font-bold text-slate-800 relative z-10">{routes.length}</div>
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
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">System Health</div>
                <div className="text-3xl font-bold text-slate-800 relative z-10">99.9%</div>
                <div className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1 relative z-10"><Check className="h-3 w-3" /> All systems normal</div>
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
                  onClick={() => setActiveTab('optimization')}
                  className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap"
                >
                  Run Optimization
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                  Popular Routes
                  <button onClick={() => setActiveTab('routes')} className="text-sm text-indigo-600 hover:underline">View All</button>
                </h3>
                <div className="space-y-4">
                  {routes.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.stops} stops • {item.distance}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${item.status === 'Active' ? 'text-emerald-600' : 'text-amber-500'}`}>{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                  Recent Users
                  <button onClick={() => setActiveTab('users')} className="text-sm text-indigo-600 hover:underline">View All</button>
                </h3>
                <div className="space-y-4">
                  {users.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800 text-sm">{item.trips} trips</div>
                        <div className={`text-xs font-bold ${item.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'}`}>{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                  Recent Activity
                  <button onClick={() => setActiveTab('settings')} className="text-sm text-indigo-600 hover:underline">View Logs</button>
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Bus TNSTC 1024 updated', time: '2 mins ago', icon: Bus, color: 'text-indigo-600' },
                    { action: 'New route proposed', time: '15 mins ago', icon: Map, color: 'text-emerald-600' },
                    { action: 'User account suspended', time: '1 hour ago', icon: Users, color: 'text-rose-600' },
                    { action: 'System backup completed', time: '3 hours ago', icon: Check, color: 'text-blue-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className={`mt-1 ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">{item.action}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.time}</div>
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
              <button onClick={() => openModal('bus')} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4" /> Add Bus
              </button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search buses..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                </div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg outline-none text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button 
                  onClick={() => handleExport('buses')}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" /> Export CSV
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
                    {buses
                      .filter(b => b.no.toLowerCase().includes(searchTerm.toLowerCase()))
                      .filter(b => filterStatus === 'All' || b.status === filterStatus)
                      .map((bus) => (
                      <tr key={bus.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{bus.no}</td>
                        <td className="p-4 text-sm text-slate-600">{bus.type}</td>
                        <td className="p-4 text-sm text-slate-600">{bus.route}</td>
                        <td className="p-4 text-sm text-slate-600">{bus.seats}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${bus.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : bus.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                            {bus.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openModal('bus', bus)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete('bus', bus.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'routes' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-slate-800">Manage Routes</h2>
              <button onClick={() => openModal('route')} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4" /> Add Route
              </button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search routes..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                </div>
                <button 
                  onClick={() => handleExport('routes')}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <th className="p-4">Route Name</th>
                      <th className="p-4">Distance</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Stops</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {routes
                      .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((route) => (
                      <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{route.name}</td>
                        <td className="p-4 text-sm text-slate-600">{route.distance}</td>
                        <td className="p-4 text-sm text-slate-600">{route.duration}</td>
                        <td className="p-4 text-sm text-slate-600">{route.stops}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${route.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {route.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openModal('route', route)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete('route', route.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-slate-800">Manage Passengers</h2>
              <button onClick={() => openModal('user')} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4" /> Add User
              </button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search passengers..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  />
                </div>
                <button 
                  onClick={() => handleExport('users')}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <th className="p-4">User</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Trips</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users
                      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div className="font-bold text-slate-800">{user.name}</div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          <div>{user.email}</div>
                          <div className="text-xs text-slate-400">{user.phone}</div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{user.trips}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => openModal('user', user)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete('user', user.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-800">System Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-4">General Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Maintenance Mode</div>
                      <div className="text-sm text-slate-500">Disable bookings for maintenance</div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('maintenanceMode')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Auto-Optimization</div>
                      <div className="text-sm text-slate-500">AI-driven route adjustments</div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('autoOptimization')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${settings.autoOptimization ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.autoOptimization ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Real-time Tracking</div>
                      <div className="text-sm text-slate-500">Enable GPS tracking for all buses</div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('realTimeTracking')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${settings.realTimeTracking ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.realTimeTracking ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-4">Security & Access</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-slate-800">Admin Roles</div>
                      <button onClick={() => openModal('role')} className="text-xs text-indigo-600 font-bold hover:underline">+ Add Role</button>
                    </div>
                    <div className="space-y-2">
                      {adminRoles.map(role => (
                        <div key={role.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{role.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">{role.users} users</span>
                            <button onClick={() => openModal('role', role)} className="text-indigo-600 hover:text-indigo-800"><Edit className="h-3 w-3" /></button>
                            <button onClick={() => handleDelete('role', role.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="h-3 w-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-slate-800">API Access Keys</div>
                      <button onClick={() => openModal('apiKey')} className="text-xs text-indigo-600 font-bold hover:underline">+ Generate Key</button>
                    </div>
                    <div className="space-y-2">
                      {apiKeys.map(key => (
                        <div key={key.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{key.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-600">Active</span>
                            <button onClick={() => openModal('apiKey', key)} className="text-indigo-600 hover:text-indigo-800"><Edit className="h-3 w-3" /></button>
                            <button onClick={() => handleDelete('apiKey', key.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="h-3 w-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-4">System Logs</h3>
                <div className="space-y-3">
                  {[
                    { event: 'Admin Login', user: 'Super Admin', time: '10 mins ago', status: 'Success' },
                    { event: 'Route Updated', user: 'Route Manager', time: '45 mins ago', status: 'Success' },
                    { event: 'API Key Generated', user: 'Super Admin', time: '2 hours ago', status: 'Success' },
                    { event: 'Failed Login Attempt', user: 'Unknown', time: '5 hours ago', status: 'Warning' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
                      <div>
                        <div className="font-bold text-slate-800">{log.event}</div>
                        <div className="text-xs text-slate-500">{log.user} • {log.time}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                  <button className="w-full py-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-xl transition-colors">Download Full Logs</button>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-900">Danger Zone</h3>
                  <p className="text-rose-700 text-sm mb-4">These actions are irreversible and will affect the entire system.</p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => handleDangerAction('Reset System Data')}
                      className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors text-sm"
                    >
                      Reset System Data
                    </button>
                    <button 
                      onClick={() => handleDangerAction('Purge Logs')}
                      className="px-4 py-2 bg-white border border-rose-200 text-rose-600 font-bold rounded-lg hover:bg-rose-50 transition-colors text-sm"
                    >
                      Purge Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingItem ? 'Edit' : 'Add New'} {
                    modalType === 'bus' ? 'Bus' : 
                    modalType === 'route' ? 'Route' : 
                    modalType === 'user' ? 'User' : 
                    modalType === 'role' ? 'Role' : 
                    'API Key'
                  }
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {modalType === 'bus' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Bus Number</label>
                      <input name="no" defaultValue={editingItem?.no} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                        <select name="type" defaultValue={editingItem?.type} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Express</option>
                          <option>Ultra Deluxe</option>
                          <option>AC Sleeper</option>
                          <option>Deluxe</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Seats</label>
                        <input name="seats" type="number" defaultValue={editingItem?.seats} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Route</label>
                      <input name="route" defaultValue={editingItem?.route} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                      <select name="status" defaultValue={editingItem?.status} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Active</option>
                        <option>Maintenance</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {modalType === 'route' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Route Name</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Distance</label>
                        <input name="distance" defaultValue={editingItem?.distance} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                        <input name="duration" defaultValue={editingItem?.duration} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Stops</label>
                        <input name="stops" type="number" defaultValue={editingItem?.stops} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                        <select name="status" defaultValue={editingItem?.status} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Active</option>
                          <option>Proposed</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'user' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                      <input name="email" type="email" defaultValue={editingItem?.email} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                      <input name="phone" defaultValue={editingItem?.phone} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                      <select name="status" defaultValue={editingItem?.status} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Active</option>
                        <option>Suspended</option>
                      </select>
                    </div>
                  </>
                )}

                {modalType === 'role' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Role Name</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Permissions</label>
                      <input name="permissions" defaultValue={editingItem?.permissions} placeholder="e.g. Routes, Buses, Users" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </>
                )}

                {modalType === 'apiKey' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Key Name</label>
                      <input name="name" defaultValue={editingItem?.name} placeholder="e.g. Production App" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">API Key</label>
                      <input name="key" defaultValue={editingItem?.key || `pk_${Math.random().toString(36).substring(2, 15)}`} readOnly className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 font-mono text-sm" />
                      <p className="text-[10px] text-slate-400">This key is generated automatically for security.</p>
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmation(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Delete</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete this {deleteConfirmation.type}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Danger Action Confirmation Modal */}
      <AnimatePresence>
        {pendingDangerAction && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setPendingDangerAction(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Critical Action</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to <strong>{pendingDangerAction}</strong>? This action is irreversible and will affect the entire system.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPendingDangerAction(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDangerAction}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

