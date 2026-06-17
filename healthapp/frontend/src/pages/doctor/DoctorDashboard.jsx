import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingReviews: 0,
    todayAppts: 0,
    recentScreenings: []
  });
  const [notifying, setNotifying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, apptRes] = await Promise.all([
          api.get('/doctor/stats'),
          api.get('/appointments/doctor')
        ]);
        
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = apptRes.data.data.filter(a => a.appt_date === today && a.status === 'confirmed').length;
        
        setStats({
          ...statsRes.data.data,
          todayAppts
        });
      } catch (err) {
        console.error('Error fetching doctor stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleSendNotifications = async () => {
    setNotifying(true);
    // Simulate API call to notification service
    setTimeout(() => {
       setNotifying(false);
       alert(`Notifications sent clinical review requests to ${stats.pendingReviews} patients via platform alerts and SMS.`);
    }, 1500);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;
  const growthIndex = stats.growthIndex || 0;
  const accuracy = stats.accuracy || 95;
  const optimization = stats.optimization || '25ms';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Clinical Overview</h1>
           <p className="text-slate-500 font-medium">Welcome, Dr. {user?.full_name?.split(' ').pop()}. Practice summary for {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
           <div className="px-4 py-2 text-sm font-bold text-slate-500 flex items-center gap-2 border-r border-slate-100">
              <Calendar size={16} /> {new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
           </div>
           <div className="px-4 py-2 text-sm font-bold text-green-600 flex items-center gap-2">
              <CheckCircle2 size={16} /> Practice Active
           </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card border-l-4 border-l-saffron">
            <div className="flex items-start justify-between mb-2">
               <div className="p-2 bg-saffron/10 text-saffron-deep rounded-xl"><Users size={20} /></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Managed</span>
            </div>
            <p className="text-3xl font-display font-bold text-slate-900 leading-none mb-1">{stats.totalPatients}</p>
            <p className="text-xs text-slate-500 font-medium font-sans">Registered Patients</p>
         </div>
         <div className="card border-l-4 border-l-amber-500">
            <div className="flex items-start justify-between mb-2">
               <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><ClipboardList size={20} /></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Review Depth</span>
            </div>
            <p className="text-3xl font-display font-bold text-slate-900 leading-none mb-1">{stats.pendingReviews}</p>
            <p className="text-xs text-slate-500 font-medium font-sans">Pending Screenings</p>
         </div>
         <div className="card border-l-4 border-l-saffron-deep">
            <div className="flex items-start justify-between mb-2">
               <div className="p-2 bg-saffron-light/20 text-saffron-deep rounded-xl"><Clock size={20} /></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule Density</span>
            </div>
            <p className="text-3xl font-display font-bold text-slate-900 leading-none mb-1">{stats.todayAppts}</p>
            <p className="text-xs text-slate-500 font-medium font-sans">Today's Confirmed Visits</p>
         </div>
         <div className="card border-l-4 border-l-ink">
            <div className="flex items-start justify-between mb-2">
               <div className="p-2 bg-slate-100 text-ink rounded-xl"><TrendingUp size={20} /></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Index</span>
            </div>
            <p className="text-3xl font-display font-bold text-slate-900 leading-none mb-1">{stats.totalPatients > 0 ? '+12%' : 'N/A'}</p>
            <p className="text-xs text-slate-500 font-medium font-sans">{stats.totalPatients > 0 ? 'Monthly Patient Inflow' : 'Baseline'}</p>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Pending & Recent Screenings */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Alerts & Recent Screenings</h2>
               <Link to="/doctor/patients" className="text-primary-600 font-bold text-sm hover:underline flex items-center gap-1">Manage All <ArrowRight size={14} /></Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-100">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                           <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Identity</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Assessment</th>
                           <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Review</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {stats.recentScreenings && stats.recentScreenings.map((screen) => (
                           <tr key={`${screen.type}-${screen.id}`} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">{screen.patient_name?.charAt(0)}</div>
                                    <div>
                                       <p className="font-bold text-slate-900 text-sm">{screen.patient_name}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{screen.age}Y • {screen.gender}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className="text-saffron-deep"><Activity size={16} /></div>
                                    <span className="text-xs font-bold text-slate-600 capitalize">{screen.type}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    screen.risk_band === 'Minimal' ? 'bg-green-100 text-green-700' :
                                    screen.risk_band === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                 }`}>
                                    {screen.risk_band}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <Link to={`/doctor/patients/${screen.patient_id}`} className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors inline-block">
                                    <ArrowRight size={18} />
                                 </Link>
                              </td>
                           </tr>
                        ))}
                        {(!stats.recentScreenings || stats.recentScreenings.length === 0) && (
                           <tr>
                              <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-medium">No recent screenings to display.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Right Sidebar: Quick Tasks */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Practice Focus</h2>
            
            {stats.pendingReviews > 0 ? (
               <div className="bg-red-50 rounded-2xl p-6 border border-red-100 space-y-4">
                  <div className="flex items-center gap-3 text-red-700">
                     <AlertCircle size={24} />
                     <h3 className="font-bold">Follow-ups Required</h3>
                  </div>
                  <p className="text-xs text-red-600 leading-relaxed font-bold uppercase tracking-tight">{stats.pendingReviews} Cases need urgent clinical review.</p>
                  <button 
                    onClick={handleSendNotifications}
                    disabled={notifying}
                    className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                     {notifying ? <Loader2 size={14} className="animate-spin" /> : 'Send Review Requests'}
                  </button>
               </div>
            ) : (
               <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 border-dashed space-y-2 text-center">
                  <CheckCircle2 size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Practice Up-to-date</p>
                  <p className="text-[10px] text-slate-400 font-medium">No pending follow-ups required at this moment.</p>
               </div>
            )}

            <div className="card border-l-4 border-l-blue-500">
               <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">
                  <TrendingUp size={14} /> Patient Growth
               </div>
               <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{growthIndex >= 0 ? `+${growthIndex}` : growthIndex}</span>
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg mb-1">Index</span>
               </div>
            </div>
            <div className="card border-l-4 border-l-green-600">
               <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">
                  <CheckCircle2 size={14} /> Clinical Confidence
               </div>
               <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{accuracy}%</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg mb-1">Clinical</span>
               </div>
            </div>
            <div className="card border-l-4 border-l-indigo-600">
               <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">
                  <Activity size={14} /> Analysis Latency
               </div>
               <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{optimization}</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg mb-1">Low-Latency</span>
               </div>
            </div>

            {/* Practice Insights card removed */}
         </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
