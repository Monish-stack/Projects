import React, { useState, useEffect, useRef } from 'react';
import { Search, Map as MapIcon, Clock, AlertCircle, Bell, MessageSquare, X, Calendar, ArrowRight, MapPin, Copy, Check, Ticket, AlertTriangle, Star } from 'lucide-react';
import { io } from 'socket.io-client';
import { useLanguage } from '../utils/LanguageContext';
import PaymentModal from '../components/PaymentModal';
import DigitalTicket from '../components/DigitalTicket';
import Chatbot from '../components/Chatbot';
import BuyBusTicket from '../components/BuyBusTicket';
import CustomerReviews from '../components/CustomerReviews';

const TAMIL_NADU_LOCATIONS = [
  // Districts
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
  "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", 
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", 
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
  // Major Towns & Villages
  "Poonamallee", "Tambaram", "Guindy", "Vadapalani", "Koyambedu", "Velachery", "Adyar",
  "Pollachi", "Mettupalayam", "Tiruttani", "Arakkonam", "Hosur", "Ambur", "Vaniyambadi",
  "Sivakasi", "Rajapalayam", "Kovilpatti", "Tiruchendur", "Palani", "Kodaikanal",
  "Ooty", "Coonoor", "Gobichettipalayam", "Sathyamangalam", "Bhavani", "Tiruchengode",
  "Rasipuram", "Attur", "Kumbakonam", "Pattukkottai", "Mannargudi", "Chidambaram",
  "Panruti", "Neyveli", "Tindivanam", "Villupuram", "Ulundurpet"
].sort();

function AutocompleteInput({ label, value, onChange, placeholder, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (val.trim()) {
      const filtered = options.filter((opt: string) => 
        opt.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.trim() && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-all duration-200"
        required
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {filteredOptions.map((option, idx) => (
            <li 
              key={idx}
              onClick={() => handleSelect(option)}
              className="px-5 py-3 hover:bg-indigo-50 cursor-pointer text-slate-700 font-medium transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
            >
              <MapPin className="h-4 w-4 text-indigo-400" />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PassengerApp() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'track' | 'ticket' | 'reviews'>('track');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [liveBuses, setLiveBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ 
    busNumber: '',
    route: '',
    category: 'Timing Inaccuracy', 
    description: '',
    photo: null as File | null
  });
  const [copiedRouteId, setCopiedRouteId] = useState<string | null>(null);
  
  // New State for Ticket & SOS
  const [selectedRouteForTicket, setSelectedRouteForTicket] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);

  const handleCopyRoute = (route: any) => {
    const text = `🚌 Bus: ${route.bus_number} (${route.operator})\n📍 Route: ${route.source} ➔ ${route.destination}\n📏 Distance: ${route.distance} km\n🛑 Stops: ${route.stops.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedRouteId(route._id);
    setTimeout(() => setCopiedRouteId(null), 2000);
  };

  const handleBookTicket = (route: any) => {
    setSelectedRouteForTicket(route);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Generate a random ticket
    const newTicket = {
      busNumber: selectedRouteForTicket.bus_number,
      route: `${selectedRouteForTicket.source} to ${selectedRouteForTicket.destination}`,
      seatNumber: `S${Math.floor(Math.random() * 40) + 1}`,
      date: new Date().toLocaleDateString(),
      time: selectedRouteForTicket.timings?.[0]?.departure_time || '10:00 AM',
      passengerName: 'Passenger', // In a real app, get from user profile
      ticketId: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    
    // Save to localStorage
    const savedBookings = JSON.parse(localStorage.getItem('tnsbn_bookings') || '[]');
    localStorage.setItem('tnsbn_bookings', JSON.stringify([newTicket, ...savedBookings]));
    
    setGeneratedTicket(newTicket);
  };

  const handleSOS = () => {
    setShowSOSConfirm(false);
    // Simulate sending SOS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("SOS Location:", position.coords.latitude, position.coords.longitude);
      });
    }
    alert("Emergency alert sent successfully to Transport Control Center!");
  };

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io();
    setSocket(newSocket);

    // Fetch initial live buses
    fetch('/api/live-buses')
      .then(res => res.json())
      .then(data => setLiveBuses(data));

    // Fetch initial announcements
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data));

    // Listen for real-time updates
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

    // Listen for real-time announcements
    newSocket.on('passenger:announcement', (data) => {
      setAnnouncements(prev => [data, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoutes([]);
    
    try {
      const res = await fetch(`/api/buses?from=${from}&to=${to}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch routes');
      }
      
      if (data.length === 0) {
        setError(`No direct buses found from ${from} to ${to}. Please try an alternate route.`);
      } else {
        setRoutes(data);
      }
    } catch (err: any) {
      console.error('Error fetching routes:', err);
      setError(err.message || 'An unexpected error occurred while searching for buses.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      const data = await res.json();
      if (data.success) {
        alert('Thank you for your feedback!');
        setShowFeedbackModal(false);
        setFeedback({ busNumber: '', route: '', category: 'Timing Inaccuracy', description: '', photo: null });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* SOS Button */}
      <button
        onClick={() => setShowSOSConfirm(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all duration-300 z-40 animate-pulse"
        title={t('sos')}
      >
        <AlertTriangle className="h-6 w-6" />
      </button>

      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm animate-in slide-in-from-top-4 duration-500">
          <div className="bg-indigo-100 p-2 rounded-full shrink-0">
            <Bell className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-bold text-indigo-900 text-base">{announcements[0].title}</h4>
            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">{announcements[0].message}</p>
          </div>
        </div>
      )}

      {/* Top Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-6 pb-2">
        <button 
          onClick={() => setActiveTab('track')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'track' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <MapPin className="h-5 w-5" /> Track Bus
        </button>
        <button 
          onClick={() => setActiveTab('ticket')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'ticket' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Ticket className="h-5 w-5" /> Buy Ticket
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === 'reviews' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          <Star className="h-5 w-5" /> Reviews
        </button>
      </div>

      {/* Customer Reviews Section */}
      {activeTab === 'reviews' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CustomerReviews />
        </div>
      )}

      {/* Buy Bus Ticket Section */}
      {activeTab === 'ticket' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <BuyBusTicket />
        </div>
      )}

      {/* Track Bus Section */}
      {activeTab === 'track' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {/* Search Section */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-20">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
        </div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">{t('findBus')}</h2>
            <p className="text-slate-500 mt-1">{t('searchDesc')}</p>
          </div>
          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-2 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <MessageSquare className="h-4 w-4" /> {t('reportIssue')}
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-start animate-in fade-in duration-300">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 font-medium">{error}</div>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-5 relative z-10">
          <AutocompleteInput
            label={t('from')}
            value={from}
            onChange={setFrom}
            placeholder={t('searchPlaceholder')}
            options={TAMIL_NADU_LOCATIONS}
          />
          <div className="hidden md:flex items-center justify-center pt-6">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <AutocompleteInput
            label={t('to')}
            value={to}
            onChange={setTo}
            placeholder={t('searchPlaceholder')}
            options={TAMIL_NADU_LOCATIONS}
          />
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
            >
              <Search className="h-5 w-5" />
              {loading ? t('searching') : t('searchBtn')}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Routes */}
        <div className="lg:col-span-1 space-y-5">
          <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
            <Clock className="h-6 w-6 text-indigo-600" /> {t('availableRoutes')}
          </h3>
          
          {routes.length === 0 && !loading && !error && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
              <MapIcon className="h-10 w-10 text-slate-200 mb-3" />
              <p>{t('noRoutes')}</p>
            </div>
          )}

          <div className="space-y-4">
            {routes.map((route, idx) => (
              <div 
                key={route._id} 
                className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom-4 relative overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-full blur-2xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg mb-2 border border-indigo-100 shadow-sm">
                      {route.operator}
                    </span>
                    <h4 className="font-display font-bold text-slate-800 text-2xl tracking-tight">{route.bus_number}</h4>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                      {route.distance} km
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyRoute(route); }}
                      className={`px-3 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs font-bold ${
                        copiedRouteId === route._id 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm scale-105' 
                          : 'bg-white text-slate-500 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm'
                      }`}
                      title="Copy Route Details"
                    >
                      {copiedRouteId === route._id ? (
                        <><Check className="h-3.5 w-3.5" /> {t('copied')}</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> {t('copy')}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-6 bg-gradient-to-r from-slate-50 to-white p-4 rounded-2xl border border-slate-100 shadow-sm relative z-10">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                    <div className="w-0.5 h-6 bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  <div className="flex flex-col justify-between h-full py-0.5 gap-4">
                    <span className="font-bold text-slate-700 text-base">{route.source}</span>
                    <span className="font-bold text-slate-700 text-base">{route.destination}</span>
                  </div>
                </div>

                <div className="mb-5 relative z-10">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('viaStops')}</div>
                  <div className="flex flex-wrap gap-2">
                    {route.stops.map((stop: string, i: number) => (
                      <span key={i} className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-200 hover:text-indigo-700 transition-colors">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Timings Section */}
                {route.timings && route.timings.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-100 relative z-10">
                    <div className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar className="h-4 w-4 text-indigo-500" /> {t('scheduledTimings')}
                    </div>
                    <div className="space-y-3">
                      {route.timings.map((timing: any) => (
                        <div key={timing._id} className="flex flex-col bg-white hover:bg-indigo-50/50 transition-colors p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100">
                          <div className="flex justify-between items-center text-sm mb-2">
                            <div className="font-bold text-slate-800 text-base">{timing.departure_time}</div>
                            <div className="h-px bg-slate-200 flex-1 mx-4 relative">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45"></div>
                            </div>
                            <div className="font-bold text-slate-800 text-base">{timing.arrival_time}</div>
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {t('runs')}: {timing.days_of_operation?.join(', ') || t('daily')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Ticket Button */}
                <div className="mt-5 relative z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBookTicket(route); }}
                    className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2 border border-indigo-100"
                  >
                    <Ticket className="h-5 w-5" /> {t('bookTicket')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Buses */}
        <div className="lg:col-span-2 space-y-5">
          <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-emerald-600" /> {t('liveBuses')}
          </h3>
          
          {liveBuses.length === 0 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
              <AlertCircle className="h-10 w-10 text-slate-200 mb-3" />
              <p>{t('noLive')}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {liveBuses.map((bus, idx) => (
              <div 
                key={bus.bus_id} 
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 relative overflow-hidden animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="font-display font-bold text-indigo-900 text-xl">{bus.bus_id}</div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>
                
                <div className="space-y-3 text-sm relative z-10">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-slate-500 font-medium">{t('speed')}</span>
                    <span className="font-bold text-slate-800">{bus.speed} km/h</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-slate-500 font-medium">{t('nextStop')}</span>
                    <span className="font-bold text-slate-800">{bus.next_stop}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/50">
                    <span className="text-emerald-700 font-medium">{t('eta')}</span>
                    <span className="font-bold text-emerald-600 text-base">{bus.eta_next_stop}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" /> {t('submitFeedback')}
              </h3>
              <button 
                onClick={() => setShowFeedbackModal(false)} 
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitFeedback} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Bus Number</label>
                  <input
                    type="text"
                    value={feedback.busNumber}
                    onChange={(e) => setFeedback({ ...feedback, busNumber: e.target.value })}
                    placeholder="e.g. TN-01-AB-1234"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Route</label>
                  <input
                    type="text"
                    value={feedback.route}
                    onChange={(e) => setFeedback({ ...feedback, route: e.target.value })}
                    placeholder="e.g. Chennai - Madurai"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('issueCategory')}</label>
                <select
                  value={feedback.category}
                  onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors appearance-none"
                >
                  <option value="Timing Inaccuracy">{t('timingInaccuracy')}</option>
                  <option value="Route Discrepancy">{t('routeDiscrepancy')}</option>
                  <option value="Driver Conduct">{t('driverConduct')}</option>
                  <option value="App Issue">{t('appIssue')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('description')}</label>
                <textarea
                  value={feedback.description}
                  onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
                  placeholder="Please provide details about the issue..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none h-24 resize-none bg-slate-50 hover:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFeedback({ ...feedback, photo: e.target.files ? e.target.files[0] : null })}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all"
                >
                  {t('submitReport')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOS Confirmation Modal */}
      {showSOSConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">Emergency SOS</h3>
            <p className="text-slate-500 mb-6">Are you sure you want to send an emergency alert? This will share your location with the transport control center.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSOSConfirm(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSOS}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedRouteForTicket && (
        <PaymentModal 
          amount={Math.floor(selectedRouteForTicket.distance * 1.5)} 
          onSuccess={handlePaymentSuccess} 
          onCancel={() => setShowPayment(false)} 
        />
      )}

      {/* Digital Ticket */}
      {generatedTicket && (
        <DigitalTicket 
          ticket={generatedTicket} 
          onClose={() => setGeneratedTicket(null)} 
        />
      )}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
