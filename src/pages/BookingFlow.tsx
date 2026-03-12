import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bus, MapPin, Calendar, Search, ArrowRight, Clock, CreditCard, CheckCircle, Download, QrCode, Users, Tag, ShieldCheck, Smartphone, Building } from 'lucide-react';
import { DistrictAutocomplete } from '../components/DistrictAutocomplete';
import { WeatherAlert } from '../components/WeatherAlert';
import { useLanguage } from '../utils/LanguageContext';

export function BusSearchPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      navigate(`/results?from=${from}&to=${to}&date=${date}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        <h1 className="text-4xl font-display font-bold text-slate-800 mb-2 relative z-10">{t('whereTo')}</h1>
        <p className="text-slate-500 mb-8 relative z-10">{t('bookNextJourney')}</p>
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          <div className="relative">
            <DistrictAutocomplete 
              label={t('from')}
              value={from}
              onChange={setFrom}
              placeholder={t('egChennai')}
            />
          </div>
          <div className="relative">
            <DistrictAutocomplete 
              label={t('to')}
              value={to}
              onChange={setTo}
              placeholder={t('egMadurai')}
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('date')}</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
            </div>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
              <Search className="h-5 w-5" /> {t('search')}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export function BusResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/search-buses?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => {
        setBuses(data.buses || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [from, to]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-3">
            {from} <ArrowRight className="h-6 w-6 text-slate-400" /> {to}
          </h1>
          <p className="text-slate-500 mt-1">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => navigate('/search')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">{t('modifySearch')}</button>
      </div>

      <WeatherAlert city={to} />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-100 rounded-lg w-1/3 animate-pulse"></div>
                  <div className="h-6 bg-slate-100 rounded-lg w-1/4 animate-pulse"></div>
                </div>
                <div className="h-12 bg-slate-50 rounded-2xl w-full animate-pulse"></div>
              </div>
              <div className="w-full md:w-32 h-12 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : buses.length === 0 ? (
        <div className="space-y-8">
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-slate-100">
            <Bus className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('noBusesFound')}</h3>
            <p className="text-slate-500 mb-6">{t('noBusesDesc')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => navigate('/results?from=Chennai&to=Coimbatore&date=' + date)} className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full text-sm font-medium transition-colors border border-slate-100">Chennai → Coimbatore</button>
              <button onClick={() => navigate('/results?from=Chennai&to=Madurai&date=' + date)} className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full text-sm font-medium transition-colors border border-slate-100">Chennai → Madurai</button>
              <button onClick={() => navigate('/results?from=Madurai&to=Coimbatore&date=' + date)} className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full text-sm font-medium transition-colors border border-slate-100">Madurai → Coimbatore</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {buses.map((bus, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.05 }}
              key={bus.id} 
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all flex flex-col md:flex-row gap-6 items-center group"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">{t('busNo')}: {bus.bus_no}</span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">{t('type')}: {bus.type}</span>
                      {bus.isConnecting && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" /> 1 {t('transferAt')} {bus.connections[0].to}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-400 font-medium flex items-center gap-1 justify-end"><Tag className="h-3 w-3" /> {t('price')}</div>
                      <div className="text-xl font-bold text-slate-900">₹{bus.price}</div>
                    </div>
                    <div className="text-right border-l border-slate-100 pl-4">
                      <div className="text-sm text-slate-400 font-medium flex items-center gap-1 justify-end"><Users className="h-3 w-3" /> {t('seatsAvailable')}</div>
                      <div className="text-xl font-bold text-emerald-600">{bus.seats}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute left-12 right-12 top-1/2 h-px border-t border-dashed border-slate-200 -z-10"></div>
                  
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('departure')}</div>
                    <div className="text-xl font-bold text-slate-900">{bus.departure}</div>
                    <div className="text-sm font-medium text-slate-500">{bus.source}</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{bus.duration}</div>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      <Bus className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('arrival')}</div>
                    <div className="text-xl font-bold text-slate-900">{bus.arrival}</div>
                    <div className="text-sm font-medium text-slate-500">{bus.destination}</div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                <button 
                  onClick={() => navigate(`/seats/${bus.id}?date=${date}`)}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all whitespace-nowrap shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95"
                >
                  {t('viewSeats')}
                </button>
                <button 
                  onClick={() => navigate(`/seats/${bus.id}?date=${date}`)}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all whitespace-nowrap active:scale-95"
                >
                  {t('bookTicket')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function SeatSelectionPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { busId } = useParams();
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/seats/${busId}?date=${new Date().toISOString().split('T')[0]}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch seats');
        return res.json();
      })
      .then(data => {
        setSeats(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load seat availability. Please try again.');
        setIsLoading(false);
      });
  }, [busId]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const autoSelect = () => {
    const recommended = seats.find(s => s.isRecommended && !s.is_booked);
    if (recommended) {
      setSelectedSeats([recommended.seat_number]);
    }
  };

  const handleProceed = () => {
    navigate('/checkout', { 
      state: { 
        selectedSeats, 
        baseFare: selectedSeats.length * 450,
        taxes: selectedSeats.length * 45,
        total: selectedSeats.length * 495
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-red-500 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Retry</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-slate-800">{t('selectSeats')}</h2>
          <button onClick={autoSelect} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100">
            {t('autoSelectBestSeat')}
          </button>
        </div>
        
        <div className="flex gap-6 mb-8 justify-center text-xs flex-wrap">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></div><span>{t('available')}</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div><span>{t('booked')}</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-400 border border-amber-500"></div><span>{t('selected')}</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-500 border border-blue-600"></div><span>{t('recommended')}</span></div>
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 max-w-sm mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {seats.map(seat => (
              <button 
                key={seat.seat_number}
                disabled={seat.is_booked}
                onClick={() => toggleSeat(seat.seat_number)}
                className={`p-2 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  seat.is_booked ? 'bg-red-100 border-red-200 text-red-400 cursor-not-allowed' :
                  selectedSeats.includes(seat.seat_number) ? 'bg-amber-400 border-amber-500 text-white' :
                  seat.isRecommended ? 'bg-blue-500 border-blue-600 text-white shadow-sm shadow-blue-500/20' :
                  'bg-emerald-100 border-emerald-200 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {seat.seat_number}
                {seat.isRecommended && <span className="text-[8px]">⭐</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-24">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{t('bookingSummary')}</h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500">{t('selectedSeats')}</span>
            <span className="font-bold text-slate-800">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('baseFare')}</span>
            <span className="font-bold text-slate-800">₹{selectedSeats.length * 450}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('taxes')}</span>
            <span className="font-bold text-slate-800">₹{selectedSeats.length * 45}</span>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-800">{t('total')}</span>
            <span className="text-2xl font-bold text-indigo-600">₹{selectedSeats.length * 495}</span>
          </div>
        </div>
        <button 
          disabled={selectedSeats.length === 0}
          onClick={handleProceed}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('proceedToPay')}
        </button>
      </div>
    </motion.div>
  );
}

export function TicketBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const { selectedSeats = [], baseFare = 0, taxes = 0, total = 0 } = location.state || {};

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/confirmation', { state: { selectedSeats, total } });
    }, 2500);
  };

  if (isProcessing) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <ShieldCheck className="absolute inset-0 m-auto h-10 w-10 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Processing Payment</h2>
        <p className="text-slate-500">Please do not close this window or press back.</p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 py-2 px-4 rounded-full inline-flex">
          <ShieldCheck className="h-4 w-4" /> 100% Secure Payment
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-500" /> Safe Payment
            </h2>
            <div className="flex gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6 object-contain grayscale opacity-50" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain grayscale opacity-50" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain grayscale opacity-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button 
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
            >
              <Smartphone className={`h-8 w-8 ${paymentMethod === 'upi' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="font-bold text-sm">UPI</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
            >
              <CreditCard className={`h-8 w-8 ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="font-bold text-sm">Credit/Debit Card</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === 'netbanking' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
            >
              <Building className={`h-8 w-8 ${paymentMethod === 'netbanking' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="font-bold text-sm">Net Banking</span>
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            {paymentMethod === 'upi' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Enter UPI ID</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="username@upi" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  <button className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">Verify</button>
                </div>
                <p className="text-xs text-slate-500">A payment request will be sent to your UPI app.</p>
              </motion.div>
            )}

            {paymentMethod === 'card' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t('cardNumber')}</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('expiryDate')}</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('cvv')}</label>
                    <input type="password" placeholder="•••" maxLength={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name on Card</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </motion.div>
            )}

            {paymentMethod === 'netbanking' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Bank</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option value="">Select your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">You will be redirected to your bank's secure portal to complete the payment.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-24">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{t('bookingSummary')}</h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500">{t('selectedSeats')}</span>
            <span className="font-bold text-slate-800">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('baseFare')}</span>
            <span className="font-bold text-slate-800">₹{baseFare}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('taxes')}</span>
            <span className="font-bold text-slate-800">₹{taxes}</span>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-800">{t('total')}</span>
            <span className="text-2xl font-bold text-indigo-600">₹{total}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Your payment is secured with 256-bit encryption.</span>
        </div>

        <button 
          onClick={handlePayment}
          disabled={selectedSeats.length === 0}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck className="h-5 w-5" /> {t('payAndBook')}
        </button>
      </div>
    </motion.div>
  );
}

export function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const { selectedSeats = ['A1', 'A2'], total = 990 } = location.state || {};
  const pnrNumber = `TNSTC-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-white"></div>
        <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6 relative z-10" />
        <h1 className="text-3xl font-display font-bold text-slate-800 mb-2 relative z-10">{t('bookingConfirmed')}</h1>
        <p className="text-slate-500 mb-8 relative z-10">{t('ticketSent')}</p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left">
          <div className="text-sm text-slate-500 mb-1">{t('pnrNumber')}</div>
          <div className="text-xl font-mono font-bold text-slate-800 mb-4">{pnrNumber}</div>
          
          <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-4">
            <div>
              <div className="text-sm text-slate-500">{t('seats')}</div>
              <div className="font-bold text-slate-800">{selectedSeats.join(', ')}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">{t('amountPaid')}</div>
              <div className="font-bold text-slate-800">₹{total}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/ticket')} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5" /> {t('viewTicket')}
          </button>
          <button onClick={() => navigate('/')} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            {t('home')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { QRCodeSVG } from 'qrcode.react';

export function TicketQRCodePage() {
  const { t } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-display font-bold mb-1">{t('boardingPass')}</h2>
          <p className="text-indigo-200 text-sm">TNSTC Express</p>
        </div>
        
        <div className="p-8 text-center border-b border-dashed border-slate-300 relative">
          <div className="absolute -left-4 -bottom-4 w-8 h-8 bg-slate-50 rounded-full"></div>
          <div className="absolute -right-4 -bottom-4 w-8 h-8 bg-slate-50 rounded-full"></div>
          
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <div className="text-3xl font-bold text-slate-800">MAA</div>
              <div className="text-sm text-slate-500">Chennai</div>
            </div>
            <Bus className="h-6 w-6 text-slate-300" />
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">IXM</div>
              <div className="text-sm text-slate-500">Madurai</div>
            </div>
          </div>
          
          <div className="bg-white p-4 inline-block rounded-xl border border-slate-100 shadow-sm mb-4">
            <QRCodeSVG value="TNSTC-847291" size={192} />
          </div>
          <p className="font-mono text-slate-500 tracking-widest">TNSTC-847291</p>
        </div>
        
        <div className="p-6 bg-slate-50 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t('date')}</div>
            <div className="font-bold text-slate-800">12 Oct 2026</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time</div>
            <div className="font-bold text-slate-800">08:30 PM</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t('seats')}</div>
            <div className="font-bold text-slate-800">A1, A2</div>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-6 py-4 bg-white text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
        <Download className="h-5 w-5" /> {t('downloadPdf')}
      </button>
    </motion.div>
  );
}
