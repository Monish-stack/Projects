/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bus, MapPin, Navigation, Settings, Globe, Ticket } from 'lucide-react';
import PassengerApp from './pages/PassengerApp';
import DriverApp from './pages/DriverApp';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import LoginPage from './pages/LoginPage';
import { LanguageProvider, useLanguage } from './utils/LanguageContext';
import { Language } from './utils/translations';

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="relative group ml-4">
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium">
        <Globe className="h-4 w-4" />
        <span className="uppercase">{language}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100 overflow-hidden z-[5000]">
        <button onClick={() => setLanguage('en')} className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${language === 'en' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}>English</button>
        <button onClick={() => setLanguage('ta')} className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${language === 'ta' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}>தமிழ்</button>
        <button onClick={() => setLanguage('hi')} className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${language === 'hi' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}>हिंदी</button>
      </div>
    </div>
  );
}

function NavLinks() {
  const location = useLocation();
  
  const links = [
    { path: '/', label: 'Passenger', icon: MapPin },
    { path: '/driver', label: 'Driver', icon: Navigation },
    { path: '/admin', label: 'Admin', icon: Settings },
    { path: '/bookings', label: 'My Bookings', icon: Ticket },
  ];

  return (
    <nav className="hidden md:flex space-x-1">
      {links.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <Link 
            key={path}
            to={path} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive 
                ? 'bg-white/20 text-white shadow-sm backdrop-blur-md' 
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-200 selection:text-indigo-900">
          <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Bus className="h-6 w-6" />
                  </div>
                  <span className="font-display font-bold text-2xl tracking-tight">TNBusTrack</span>
                </Link>
                <div className="flex items-center">
                  <NavLinks />
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
            <Routes>
              <Route path="/" element={<PassengerApp />} />
              <Route path="/driver" element={<DriverApp />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

