import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export function SOSButton() {
  const [isSending, setIsSending] = useState(false);

  const handleSOS = async () => {
    if (isSending) return;
    setIsSending(true);
    
    // Get location
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        await fetch('/api/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 'current_user_id', // Should be dynamic
            bus_number: 'TN-01-1234', // Should be dynamic
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        });
        alert('SOS Alert Sent!');
      } catch (error) {
        alert('Failed to send SOS');
      } finally {
        setIsSending(false);
      }
    }, (error) => {
      alert('Failed to get location');
      setIsSending(false);
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleSOS}
      className="fixed bottom-6 right-6 z-[1000] bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
    >
      <AlertTriangle className="h-6 w-6" />
    </motion.button>
  );
}
