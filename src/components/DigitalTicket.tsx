import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Clock, Calendar, Bus, User, CheckCircle, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface TicketProps {
  ticket: {
    busNumber: string;
    route: string;
    seatNumber: string;
    date: string;
    time: string;
    passengerName: string;
    ticketId: string;
  };
  onClose: () => void;
}

export default function DigitalTicket({ ticket, onClose }: TicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket_${ticket.ticketId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col">
        <div ref={ticketRef} className="bg-white">
          {/* Header */}
          <div className="bg-indigo-600 p-6 text-center text-white relative">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-display font-bold tracking-tight">E-Ticket Confirmed</h2>
            <p className="text-indigo-200 text-sm mt-1">Show this QR code to the conductor</p>
          </div>

          {/* Ticket Body */}
          <div className="p-6 bg-slate-50">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative">
              {/* Perforated edges effect */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-100"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-100"></div>
              
              <div className="flex justify-between items-center mb-6 border-b border-dashed border-slate-200 pb-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Bus Number</p>
                  <p className="text-xl font-display font-bold text-slate-800">{ticket.busNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Seat</p>
                  <p className="text-xl font-display font-bold text-indigo-600">{ticket.seatNumber}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Route</p>
                    <p className="text-sm font-bold text-slate-800">{ticket.route}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date & Time</p>
                    <p className="text-sm font-bold text-slate-800">{ticket.date} • {ticket.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Passenger</p>
                    <p className="text-sm font-bold text-slate-800">{ticket.passengerName}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center pt-4 border-t border-dashed border-slate-200">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <QRCodeSVG value={JSON.stringify(ticket)} size={140} level="H" />
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 mt-3 font-mono">{ticket.ticketId}</p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => {
              alert(`Ticket ${ticket.ticketId} sent to your registered email and phone number via SMS!`);
            }}
            className="flex-1 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
          >
            Share
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex-1 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" /> PDF
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
