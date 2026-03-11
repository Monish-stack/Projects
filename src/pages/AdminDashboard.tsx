import React, { useState, useEffect } from 'react';
import { Users, Bus, Map, Activity, Upload, Plus, Bell, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeRoutes: 1245,
    liveBuses: 856,
    totalStops: 15420,
    villagesCovered: 8930
  });

  const [announcement, setAnnouncement] = useState({ title: '', message: '', target_segment: 'All' });
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    fetch('/api/admin/feedback')
      .then(async res => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Server returned HTML:", text);
          throw new Error("Expected JSON but received HTML");
        }
        return res.json();
      })
      .then(data => setFeedbacks(data))
      .catch(err => console.error("API request failed:", err));

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement)
      });
      
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Server returned HTML:", text);
        throw new Error("Expected JSON but received HTML");
      }
      
      const data = await res.json();
      if (data.success) {
        socket?.emit('admin:broadcast_announcement', data.announcement);
        setAnnouncement({ title: '', message: '', target_segment: 'All' });
        alert('Announcement broadcasted successfully!');
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
    }
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/feedback/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Server returned HTML:", text);
        throw new Error("Expected JSON but received HTML");
      }
      
      await res.json();
      setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status } : f));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage routes, buses, and user feedback</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm">
            <Upload className="h-4 w-4" /> Upload CSV
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Route
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Map className="h-6 w-6 text-blue-600" />} title="Active Routes" value={stats.activeRoutes} bg="bg-blue-50" border="border-blue-100" />
        <StatCard icon={<Bus className="h-6 w-6 text-emerald-600" />} title="Live Buses" value={stats.liveBuses} bg="bg-emerald-50" border="border-emerald-100" />
        <StatCard icon={<Activity className="h-6 w-6 text-purple-600" />} title="Total Stops" value={stats.totalStops} bg="bg-purple-50" border="border-purple-100" />
        <StatCard icon={<Users className="h-6 w-6 text-orange-600" />} title="Villages Covered" value={stats.villagesCovered} bg="bg-orange-50" border="border-orange-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Announcements Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-60 pointer-events-none"></div>
          
          <h3 className="text-xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
            <Bell className="h-6 w-6 text-indigo-600" /> Broadcast Announcement
          </h3>
          <form onSubmit={handleSendAnnouncement} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
              <input
                type="text"
                value={announcement.title}
                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
              <textarea
                value={announcement.message}
                onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none h-28 resize-none bg-slate-50 hover:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Segment</label>
              <select
                value={announcement.target_segment}
                onChange={(e) => setAnnouncement({ ...announcement, target_segment: e.target.value })}
                className="w-full px-5 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors appearance-none"
              >
                <option value="All">All Users</option>
                <option value="Chennai">Chennai District</option>
                <option value="Coimbatore">Coimbatore District</option>
                <option value="Madurai">Madurai District</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all mt-2">
              Send Push Notification
            </button>
          </form>
        </div>

        {/* Feedback Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-60 pointer-events-none"></div>
          
          <h3 className="text-xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
            <MessageSquare className="h-6 w-6 text-emerald-600" /> User Feedback Reports
          </h3>
          <div className="space-y-4 overflow-y-auto flex-1 max-h-[450px] pr-2 relative z-10 custom-scrollbar">
            {feedbacks.length === 0 ? (
              <div className="text-center text-slate-500 py-12 flex flex-col items-center justify-center">
                <CheckCircle className="h-12 w-12 text-slate-200 mb-3" />
                <p>No feedback reports yet. All good!</p>
              </div>
            ) : (
              feedbacks.map((feedback, idx) => (
                <div 
                  key={feedback._id} 
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold text-slate-800 text-sm">{feedback.category}</div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      feedback.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      feedback.status === 'Reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{feedback.description}</p>
                  <div className="flex gap-3 pt-3 border-t border-slate-200/60">
                    {feedback.status !== 'Reviewed' && feedback.status !== 'Resolved' && (
                      <button 
                        onClick={() => updateFeedbackStatus(feedback._id, 'Reviewed')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Mark Reviewed
                      </button>
                    )}
                    {feedback.status !== 'Resolved' && (
                      <button 
                        onClick={() => updateFeedbackStatus(feedback._id, 'Resolved')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bg, border }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-2xl ${bg} border ${border}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">{title}</div>
        <div className="text-3xl font-display font-bold text-slate-800">{value.toLocaleString()}</div>
      </div>
    </div>
  );
}
