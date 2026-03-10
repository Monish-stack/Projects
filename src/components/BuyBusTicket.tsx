import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Bus, ArrowRight, Ticket, User, Phone, Mail, CreditCard, X } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import PaymentModal from './PaymentModal';
import DigitalTicket from './DigitalTicket';

const TAMIL_NADU_LOCATIONS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
  "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", 
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", 
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
].sort();

function AutocompleteInput({ label, value, onChange, placeholder, options, icon: Icon }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-indigo-500" />} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.trim() && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-all duration-200"
        required
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {filteredOptions.map((option, idx) => (
            <li 
              key={idx}
              onClick={() => handleSelect(option)}
              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-slate-700 font-medium transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
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

export default function BuyBusTicket() {
  const { t } = useLanguage();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [busType, setBusType] = useState('Government');
  
  const [loading, setLoading] = useState(false);
  const [availableBuses, setAvailableBuses] = useState<any[]>([]);
  
  // Booking Flow State
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState({ name: '', age: '', phone: '', email: '' });
  const [showPayment, setShowPayment] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to fetch available buses
    setTimeout(() => {
      const mockBuses = [
        { id: 1, operator: 'TNSTC', type: 'Government', departure: '08:00 AM', arrival: '12:30 PM', seats: 12, price: 250, busNumber: 'TN-01-AB-1234' },
        { id: 2, operator: 'SETC', type: 'Express', departure: '10:15 AM', arrival: '02:45 PM', seats: 5, price: 350, busNumber: 'TN-02-CD-5678' },
        { id: 3, operator: 'KPN Travels', type: 'Private AC', departure: '09:30 PM', arrival: '05:00 AM', seats: 20, price: 850, busNumber: 'TN-03-EF-9012' },
      ].filter(b => busType === 'All' || b.type.includes(busType) || (busType === 'Government' && b.operator === 'TNSTC'));
      
      setAvailableBuses(mockBuses.length > 0 ? mockBuses : [
        { id: 4, operator: 'SRS Travels', type: busType, departure: '11:00 AM', arrival: '04:00 PM', seats: 8, price: 500, busNumber: 'TN-04-GH-3456' }
      ]);
      setLoading(false);
    }, 1500);
  };

  const handleBookClick = (bus: any) => {
    setSelectedBus(bus);
    setShowPassengerForm(true);
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPassengerForm(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    
    // Generate Ticket
    const newTicket = {
      busNumber: selectedBus.busNumber,
      route: `${from} to ${to}`,
      seatNumber: `S${Math.floor(Math.random() * 40) + 1}`,
      date: date || new Date().toLocaleDateString(),
      time: selectedBus.departure,
      passengerName: passengerDetails.name,
      ticketId: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      price: selectedBus.price * parseInt(passengers)
    };
    
    // Save to localStorage
    const savedBookings = JSON.parse(localStorage.getItem('tnsbn_bookings') || '[]');
    localStorage.setItem('tnsbn_bookings', JSON.stringify([newTicket, ...savedBookings]));
    
    setGeneratedTicket(newTicket);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Ticket className="h-6 w-6" /> 🎟 Book Bus Tickets Instantly
        </h2>
        <p className="text-indigo-100 mt-1">Find the best routes and book your seats securely.</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <AutocompleteInput
              label="From"
              value={from}
              onChange={setFrom}
              placeholder="Leaving from"
              options={TAMIL_NADU_LOCATIONS}
              icon={MapPin}
            />
            
            <div className="hidden lg:flex items-center justify-center pt-8">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            <AutocompleteInput
              label="To"
              value={to}
              onChange={setTo}
              placeholder="Going to"
              options={TAMIL_NADU_LOCATIONS}
              icon={MapPin}
            />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" /> Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-all duration-200"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Bus className="h-4 w-4 text-indigo-500" /> Bus Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Government', 'Private', 'Express', 'AC'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBusType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      busType === type 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !from || !to || !date}
              className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none mt-6 md:mt-0"
            >
              <Search className="h-5 w-5" />
              {loading ? 'Searching...' : 'Search Buses'}
            </button>
          </div>
        </form>

        {/* Search Results */}
        {availableBuses.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Available Buses</h3>
            <div className="space-y-4">
              {availableBuses.map((bus) => (
                <div key={bus.id} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <Bus className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{bus.operator}</h4>
                      <p className="text-sm text-slate-500">{bus.type} • {bus.busNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-center">
                    <div className="text-center">
                      <div className="font-bold text-slate-800">{bus.departure}</div>
                      <div className="text-xs text-slate-500">{from}</div>
                    </div>
                    <div className="w-16 h-px bg-slate-300 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-white px-1">to</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-800">{bus.arrival}</div>
                      <div className="text-xs text-slate-500">{to}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6">
                    <div className="text-right">
                      <div className="font-bold text-xl text-indigo-600">₹{bus.price}</div>
                      <div className={`text-xs font-medium ${bus.seats < 10 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {bus.seats} seats left
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookClick(bus)}
                      className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Passenger Details Modal */}
      {showPassengerForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" /> Passenger Details
              </h3>
              <button 
                onClick={() => setShowPassengerForm(false)} 
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePassengerSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={passengerDetails.name}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={passengerDetails.age}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, age: e.target.value })}
                  placeholder="Age"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                  required
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={passengerDetails.phone}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                    placeholder="For ticket confirmation"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600 font-medium">Total Amount</span>
                  <span className="text-xl font-bold text-indigo-600">₹{selectedBus?.price * parseInt(passengers)}</span>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" /> Proceed to Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedBus && (
        <PaymentModal 
          amount={selectedBus.price * parseInt(passengers)} 
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
    </div>
  );
}
