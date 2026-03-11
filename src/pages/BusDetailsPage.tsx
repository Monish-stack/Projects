import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Clock, Bus, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function BusDetailsPage() {
  const { routeId } = useParams();
  const [route, setRoute] = useState<any>(null);
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/routes`)
      .then(res => res.json())
      .then(data => setRoute(data.find((r: any) => r._id === routeId)));
    
    fetch(`/api/stops/${routeId}`)
      .then(res => res.json())
      .then(data => setStops(data));
  }, [routeId]);

  if (!route) return <div>Loading...</div>;

  const path = stops.map((s: any) => [s.location.coordinates[1], s.location.coordinates[0]]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{route.bus_number} Route Visualization</h1>
      <div className="h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
        <MapContainer center={path[0] || [11.1271, 78.6569]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={path} color="blue" weight={5} />
          {stops.map((stop: any, i: number) => (
            <Marker key={i} position={[stop.location.coordinates[1], stop.location.coordinates[0]]}>
              <Popup>
                <div className="font-bold">{stop.name}</div>
                <div className="text-sm">Arrival: {stop.arrival_time || 'N/A'}</div>
                <div className="text-sm">Departure: {stop.departure_time || 'N/A'}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
}
