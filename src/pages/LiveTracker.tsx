import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, Search, Navigation, Info, Clock, Map as MapIcon, ChevronRight, X } from 'lucide-react';
import { WeatherAlert } from '../components/WeatherAlert';
import { useLanguage } from '../utils/LanguageContext';

// Custom Bus Icon using DivIcon for rotation
const createBusIcon = (rotation: number) => L.divIcon({
  html: `<div style="transform: rotate(${rotation}deg); transition: transform 0.5s linear;">
           <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" style="width: 32px; height: 32px;" />
         </div>`,
  className: 'bus-marker-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to handle map view updates
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Helper to calculate heading
const calculateHeading = (prev: any, curr: any) => {
  if (!prev) return 0;
  const dy = curr.lat - prev.lat;
  const dx = curr.lng - prev.lng;
  return Math.atan2(dy, dx) * 180 / Math.PI - 90;
};

export function LiveTracker() {
  const { t } = useLanguage();
  const [buses, setBuses] = useState<any[]>([]);
  const [prevBuses, setPrevBuses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.1271, 78.6569]);
  const [mapZoom, setMapZoom] = useState(7);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/tracking/buses')
      .then(res => res.json())
      .then(data => setBuses(data.buses || []))
      .catch(err => console.error('Failed to fetch buses:', err));

    socketRef.current = io();
    socketRef.current.on('passenger:bus_location', (updatedBus: any) => {
      setPrevBuses(prev => {
        const bus = prev.find(b => b.bus_number === updatedBus.bus_number);
        return bus ? prev : [...prev, updatedBus];
      });
      setBuses(prev => {
        const index = prev.findIndex(b => b.bus_number === updatedBus.bus_number);
        if (index === -1) return [...prev, updatedBus];
        const newBuses = [...prev];
        newBuses[index] = updatedBus;
        return newBuses;
      });
      if (selectedBus && selectedBus.bus_number === updatedBus.bus_number) {
        setSelectedBus(updatedBus);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [selectedBus, buses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const bus = buses.find(b => 
      b.bus_number.toLowerCase().includes(query) || 
      (b.route_id && b.route_id.toString().toLowerCase().includes(query))
    );
    if (bus) {
      setSelectedBus(bus);
      setMapCenter([bus.latitude, bus.longitude]);
      setMapZoom(12);
    }
  };

  const calculateETA = (bus: any) => {
    const nextStop = bus.route_path.find((p: any) => p.name === bus.next_stop);
    if (!nextStop) return t('arrivingSoon');
    const R = 6371;
    const dLat = (nextStop.lat - bus.latitude) * Math.PI / 180;
    const dLon = (nextStop.lng - bus.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(bus.latitude * Math.PI / 180) * Math.cos(nextStop.lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    const timeHours = distance / (bus.speed || 50);
    const timeMins = Math.max(1, Math.round(timeHours * 60));
    return `${timeMins} min${timeMins > 1 ? 's' : ''}`;
  };

  const getTraversedPath = (bus: any) => {
    const path = bus.route_path;
    const totalPoints = path.length;
    const pointsToShow = Math.max(1, Math.ceil(bus.progress * totalPoints));
    const traversed = path.slice(0, pointsToShow).map((p: any) => [p.lat, p.lng]);
    // Add current position as the final point for smoother visual
    traversed.push([bus.latitude, bus.longitude]);
    return traversed;
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-indigo-600" /> {t('liveTracking')}
            </div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
              {buses.length} {t('active')}
            </span>
          </h2>
          <form onSubmit={handleSearch} className="relative mb-4">
            <input 
              type="text" 
              placeholder={t('searchBusPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </form>

          <WeatherAlert city="Chennai" />

          <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
            {buses.map(bus => (
              <button 
                key={bus.bus_number}
                onClick={() => {
                  setSelectedBus(bus);
                  setMapCenter([bus.latitude, bus.longitude]);
                  setMapZoom(12);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  selectedBus?.bus_number === bus.bus_number 
                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Bus className={`h-5 w-5 ${selectedBus?.bus_number === bus.bus_number ? 'text-indigo-600' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">{bus.bus_number}</div>
                  <div className="text-xs text-slate-500 truncate">{bus.source} → {bus.destination}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedBus && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative"
            >
              <button 
                onClick={() => setSelectedBus(null)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="font-bold text-slate-800 mb-4">{t('busDetails')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t('status')}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">{t('running')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Clock className="h-4 w-4 text-indigo-500" /></div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{t('nextStop')}</div>
                    <div className="text-sm font-bold text-slate-800">{selectedBus.next_stop}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Info className="h-4 w-4 text-indigo-500" /></div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{t('estimatedArrival')}</div>
                    <div className="text-sm font-bold text-slate-800">{calculateETA(selectedBus)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1"><Navigation className="h-4 w-4 text-indigo-500" /></div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{t('currentSpeed')}</div>
                    <div className="text-sm font-bold text-slate-800">{selectedBus.speed} km/h</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          {buses.map(bus => {
            const prevBus = prevBuses.find(b => b.bus_number === bus.bus_number);
            const rotation = calculateHeading(prevBus, bus);
            return (
              <Marker 
                key={bus.bus_number} 
                position={[bus.latitude, bus.longitude]} 
                icon={createBusIcon(rotation)}
                eventHandlers={{
                  click: () => setSelectedBus(bus)
                }}
              />
            );
          })}

          {selectedBus && (
            <Polyline 
              key={selectedBus.bus_number}
              positions={getTraversedPath(selectedBus)}
              color="#e11d48"
              weight={6}
              opacity={0.9}
            />
          )}
        </MapContainer>

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <button onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-bold text-xl">+</button>
          <button onClick={() => setMapZoom(prev => Math.max(prev - 1, 5))} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-bold text-xl">-</button>
          <button onClick={() => { setMapCenter([11.1271, 78.6569]); setMapZoom(7); setSelectedBus(null); }} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"><MapIcon className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
}
