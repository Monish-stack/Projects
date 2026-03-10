import { useState, useEffect } from 'react';
import { Navigation, MapPin, CheckCircle2, AlertCircle, Bus, Route as RouteIcon, Clock, Users } from 'lucide-react';
import { io } from 'socket.io-client';

export default function DriverApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [busId, setBusId] = useState('TN01AB1234');
  const [routeId, setRouteId] = useState('R001');
  const [location, setLocation] = useState({ lat: 13.0500, lng: 80.1000 });
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (isTracking) {
      const newSocket = io();
      setSocket(newSocket);

      // Simulate movement every 10 seconds
      const interval = setInterval(() => {
        setLocation(prev => {
          const newLat = prev.lat + (Math.random() - 0.5) * 0.01;
          const newLng = prev.lng + (Math.random() - 0.5) * 0.01;
          
          const data = {
            bus_id: busId,
            route_id: routeId,
            latitude: newLat,
            longitude: newLng,
            speed: Math.floor(Math.random() * 20) + 40,
            timestamp: new Date().toISOString()
          };

          newSocket.emit('driver:location_update', data);
          
          // Also send to REST API as requested
          fetch('/api/bus-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }).catch(console.error);

          return { lat: newLat, lng: newLng };
        });
      }, 10000);

      return () => {
        clearInterval(interval);
        newSocket.disconnect();
      };
    }
  }, [isTracking, busId, routeId]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mt-12 relative overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none"></div>
        
        <div className="flex justify-center mb-8 relative z-10">
          <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-inner">
            <Navigation className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-3xl font-display font-bold text-center text-slate-800 mb-2 relative z-10">Driver Portal</h2>
        <p className="text-center text-slate-500 mb-8 relative z-10">Sign in to start your shift</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Driver ID</label>
            <input type="text" defaultValue="D123" className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" defaultValue="password" className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors" required />
          </div>
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all mt-4">
            Login to Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Active Duty</h2>
            <p className="text-slate-500 mt-1">Welcome back, Ramesh</p>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border ${isTracking ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
            {isTracking ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Transmitting GPS
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                GPS Offline
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Bus className="h-4 w-4 text-indigo-500" /> Bus Number
            </label>
            <input 
              type="text" 
              value={busId} 
              onChange={(e) => setBusId(e.target.value)}
              disabled={isTracking}
              className="w-full px-5 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none disabled:opacity-60 transition-colors font-mono font-bold text-slate-800" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-indigo-500" /> Route ID
            </label>
            <input 
              type="text" 
              value={routeId} 
              onChange={(e) => setRouteId(e.target.value)}
              disabled={isTracking}
              className="w-full px-5 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none disabled:opacity-60 transition-colors font-mono font-bold text-slate-800" 
            />
          </div>
        </div>

        <button 
          onClick={() => setIsTracking(!isTracking)}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 relative z-10 ${
            isTracking 
              ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-sm' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20'
          }`}
        >
          {isTracking ? (
            <>
              <div className="w-3 h-3 rounded-sm bg-red-600"></div>
              Stop Tracking
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5" />
              Start Trip & Tracking
            </>
          )}
        </button>
      </div>

      {isTracking && (
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in slide-in-from-bottom-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-60 pointer-events-none"></div>
          
          <h3 className="text-xl font-display font-bold text-slate-800 mb-6 relative z-10">Current Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 relative z-10">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5" /> Speed
              </div>
              <div className="text-2xl font-bold text-slate-800 font-mono">45 <span className="text-sm text-slate-500 font-sans">km/h</span></div>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Next Stop
              </div>
              <div className="text-xl font-bold text-slate-800 truncate" title="Poonamallee">Poonamallee</div>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> ETA
              </div>
              <div className="text-2xl font-bold text-emerald-600 font-mono">12 <span className="text-sm text-emerald-600/70 font-sans">mins</span></div>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Passengers
              </div>
              <div className="text-2xl font-bold text-slate-800 font-mono">34<span className="text-slate-400">/50</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
