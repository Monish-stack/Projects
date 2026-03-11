import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Bus, Clock, AlertCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export function LiveBusTrackingPage() {
  const [liveBuses, setLiveBuses] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    fetch('/api/live-buses')
      .then(res => res.json())
      .then(data => setLiveBuses(data))
      .catch(err => console.error(err));

    newSocket.on('passenger:bus_location', (data) => {
      setLiveBuses(prev => {
        const existing = prev.findIndex(b => b.bus_id === data.bus_id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], ...data };
          return updated;
        }
        return [...prev, data];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-3">
            <Navigation className="h-8 w-8 text-indigo-600" /> Live Tracking
          </h1>
          <p className="text-slate-500 mt-1">Track your bus in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-slate-100 rounded-3xl border border-slate-200 h-[600px] relative overflow-hidden flex items-center justify-center">
          <div className="text-center text-slate-400">
            <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="font-bold text-lg">Interactive Map View</p>
            <p className="text-sm">Google Maps integration goes here</p>
          </div>
          
          {/* Mock Bus Markers */}
          {liveBuses.map((bus, i) => (
            <div 
              key={bus.bus_id}
              className="absolute w-12 h-12 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white transition-all duration-1000"
              style={{ 
                left: `${(bus.longitude - 79) * 20}%`, 
                top: `${(14 - bus.latitude) * 20}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Bus className="h-5 w-5" />
            </div>
          ))}
        </div>

        {/* Live Bus List */}
        <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
          <h3 className="text-xl font-bold text-slate-800 mb-4 sticky top-0 bg-slate-50 py-2 z-10">Active Buses</h3>
          
          {liveBuses.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center text-slate-500">
              <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p>No buses currently active</p>
            </div>
          ) : (
            liveBuses.map((bus) => (
              <div key={bus.bus_id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-slate-800">{bus.bus_id}</div>
                    <div className={`text-xs font-bold mt-1 ${bus.status === 'Delayed' ? 'text-red-500' : 'text-emerald-600'}`}>
                      {bus.status || 'On Time'}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Speed</span>
                    <span className="font-bold text-slate-800">{bus.speed} km/h</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Next Stop</span>
                    <span className="font-bold text-slate-800">{bus.next_stop || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between text-indigo-600 font-medium bg-indigo-50 p-2 rounded-lg mt-2">
                    <span>ETA</span>
                    <span className="font-bold">{bus.eta_next_stop || 'Updating...'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
