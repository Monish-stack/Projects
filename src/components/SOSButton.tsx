import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../utils/LanguageContext';

export function SOSButton() {
  const { t } = useLanguage();
  const [isSending, setIsSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSOS = async () => {
    if (isSending) return;
    setIsSending(true);
    setShowConfirm(false);
    
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
        setAlertMessage(t('sosAlertSent') || 'SOS Alert Sent Successfully! Help is on the way.');
      } catch (error) {
        setAlertMessage(t('failedToSendSOS') || 'Failed to send SOS. Please call emergency services directly.');
      } finally {
        setIsSending(false);
      }
    }, (error) => {
      setAlertMessage(t('failedToGetLocation') || 'Failed to get location. Please ensure location services are enabled.');
      setIsSending(false);
    });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 z-[1000] bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center animate-pulse hover:animate-none"
      >
        <AlertTriangle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full relative z-10 border border-slate-100"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">Emergency SOS</h3>
              <p className="text-center text-slate-600 mb-6">
                Are you sure you want to trigger an emergency SOS? This will send your live location to authorities and emergency contacts.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSOS}
                  disabled={isSending}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Trigger SOS'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {alertMessage && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setAlertMessage(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full relative z-10 border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Alert</h3>
              <p className="text-slate-600 mb-6">{alertMessage}</p>
              <button 
                onClick={() => setAlertMessage(null)}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
