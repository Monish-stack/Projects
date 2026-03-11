import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function WeatherAlert({ city }: { city: string }) {
  const [alert, setAlert] = useState<{ isBadWeather: boolean; description: string; temp: number } | null>(null);

  useEffect(() => {
    fetch(`/api/weather/${city}`)
      .then(res => res.json())
      .then(data => {
        if (data.isBadWeather) {
          setAlert(data);
        }
      })
      .catch(console.error);
  }, [city]);

  if (!alert) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center gap-3 mb-4">
      <AlertTriangle className="h-6 w-6 text-amber-600" />
      <div>
        <h4 className="font-bold">Weather Alert: {alert.description}</h4>
        <p className="text-sm">Heavy weather detected near {city}. Possible bus delays.</p>
      </div>
    </div>
  );
}
