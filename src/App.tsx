/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bus, Globe } from 'lucide-react';
import PassengerApp from './pages/PassengerApp';
import DriverApp from './pages/DriverApp';
import { AdminDashboard } from './pages/AdminPages';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import { BusSearchPage, BusResultsPage, SeatSelectionPage, TicketBookingPage, BookingConfirmationPage, TicketQRCodePage } from './pages/BookingFlow';
import { UserLoginPage, UserSignupPage, UserDashboard } from './pages/UserPages';
import { LiveBusTrackingPage } from './pages/TrackingPages';
import SidebarMenu from './components/SidebarMenu';
import { LanguageProvider, useLanguage } from './utils/LanguageContext';

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

import { LiveTracker } from './pages/LiveTracker';

import { SOSButton } from './components/SOSButton';
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-200 selection:text-indigo-900">
          <SOSButton />
          <Chatbot />
          <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                  <SidebarMenu />
                  <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                      <Bus className="h-6 w-6" />
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight">TNBusTrack</span>
                  </Link>
                </div>
                <div className="flex items-center">
                  <LanguageSelector />
                  <Link to="/login" className="ml-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">Login</Link>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
            <Routes>
              <Route path="/" element={<PassengerApp />} />
              <Route path="/search" element={<BusSearchPage />} />
              <Route path="/results" element={<BusResultsPage />} />
              <Route path="/seats/:busId" element={<SeatSelectionPage />} />
              <Route path="/checkout" element={<TicketBookingPage />} />
              <Route path="/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/ticket" element={<TicketQRCodePage />} />
              
              <Route path="/login" element={<UserLoginPage />} />
              <Route path="/signup" element={<UserSignupPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              
              <Route path="/track" element={<LiveTracker />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/driver" element={<DriverApp />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

