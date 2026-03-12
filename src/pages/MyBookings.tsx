import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, MapPin, Bus, Search } from 'lucide-react';
import DigitalTicket from '../components/DigitalTicket';
import { useLanguage } from '../utils/LanguageContext';

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('tnsbn_bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight flex items-center gap-3 mb-6">
          <Ticket className="h-8 w-8 text-indigo-600" /> {t('myBookings')}
        </h2>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('noBookingsFound')}</h3>
            <p className="text-slate-500">{t('noBookingsDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((ticket, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedTicket(ticket)}
                className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    <Bus className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                    {ticket.ticketId}
                  </span>
                </div>
                
                <h4 className="font-bold text-slate-800 text-lg mb-1">{ticket.route}</h4>
                <p className="text-sm text-slate-500 mb-4">{ticket.busNumber}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{ticket.date} • {ticket.time}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-indigo-100/50 mt-4">
                    <span className="text-slate-500">{t('seat')}: <strong className="text-slate-800">{ticket.seatNumber}</strong></span>
                    <span className="text-indigo-600 font-bold">{t('viewTicket')} &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <DigitalTicket 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  );
}
