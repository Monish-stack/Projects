import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, X, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentModal({ amount, onSuccess, onCancel }: PaymentModalProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    
    const options = {
      key: "rzp_test_dummy_key", // Dummy key for simulation
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "TNSBN Bus Booking",
      description: "Secure Bus Ticket Payment",
      image: "https://picsum.photos/seed/bus/100/100",
      handler: function (response: any) {
        setLoading(false);
        onSuccess();
      },
      prefill: {
        name: "Passenger",
        email: "passenger@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#4f46e5" // indigo-600
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    // Use Razorpay if available, otherwise fallback to simulation
    if ((window as any).Razorpay) {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } else {
      // Fallback simulation
      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2500] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Secure Payment
          </h3>
          <button 
            onClick={onCancel} 
            className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Total Amount</p>
            <p className="text-4xl font-display font-bold text-slate-800">₹{amount}</p>
          </div>

          <div className="space-y-3 mb-8">
            <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'upi' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}>
              <input type="radio" name="payment" checked={method === 'upi'} onChange={() => setMethod('upi')} className="hidden" />
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'upi' ? 'border-indigo-600' : 'border-slate-300'}`}>
                {method === 'upi' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
              </div>
              <Smartphone className={`h-6 w-6 ${method === 'upi' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className={`font-bold ${method === 'upi' ? 'text-indigo-900' : 'text-slate-700'}`}>UPI (GPay, PhonePe)</span>
            </label>

            <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'card' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}>
              <input type="radio" name="payment" checked={method === 'card'} onChange={() => setMethod('card')} className="hidden" />
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'card' ? 'border-indigo-600' : 'border-slate-300'}`}>
                {method === 'card' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
              </div>
              <CreditCard className={`h-6 w-6 ${method === 'card' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className={`font-bold ${method === 'card' ? 'text-indigo-900' : 'text-slate-700'}`}>Credit / Debit Card</span>
            </label>

            <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'wallet' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'}`}>
              <input type="radio" name="payment" checked={method === 'wallet'} onChange={() => setMethod('wallet')} className="hidden" />
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === 'wallet' ? 'border-indigo-600' : 'border-slate-300'}`}>
                {method === 'wallet' && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
              </div>
              <Wallet className={`h-6 w-6 ${method === 'wallet' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className={`font-bold ${method === 'wallet' ? 'text-indigo-900' : 'text-slate-700'}`}>Wallets</span>
            </label>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:shadow-none"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              `Pay ₹${amount} Securely`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
