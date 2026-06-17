import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ClipboardCheck, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    latestLiver: null,
    latestDiabetes: null,
    upcomingAppt: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const historyRes = await api.get('/predict/history');
      const apptRes = await api.get('/appointments/patient');
      
      const history = historyRes.data.data;
      const latestLiver = history.find(h => h.type === 'liver');
      const latestDiabetes = history.find(h => h.type === 'diabetes');
      
      const upcomingAppt = apptRes.data.data.find(a => a.status === 'confirmed' || a.status === 'pending');

      setStats({
        total: history.length,
        latestLiver,
        latestDiabetes,
        upcomingAppt
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Card */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-10 text-white shadow-2xl shadow-slate-200">
         <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
            <HeartPulse size={160} />
         </div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-saffron/20 text-saffron px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-saffron/30">
               <Activity size={14} /> AI Health Monitor
            </div>
            <h1 className="text-4xl font-display font-bold mb-4 text-white">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
            <p className="text-slate-300 max-w-xl text-lg font-medium leading-relaxed">Your clinical data is being monitored. You have {stats.total} screening records in our secure vault.</p>
            <div className="mt-10 flex flex-wrap gap-4">
               <Link to="/patient/screening" className="btn-primary">
                  <ClipboardCheck size={20} className="mr-2" /> Start New Screening
               </Link>
               <Link to="/patient/appointments" className="btn-secondary !text-white !border-white/20 !bg-white/10 hover:!bg-white/20">
                  <Calendar size={20} className="mr-2" /> Book Consultation
               </Link>
            </div>
         </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="card flex items-center gap-4 border-l-4 border-l-saffron">
            <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-xl flex items-center justify-center"><Activity /></div>
            <div>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Screenings</p>
               <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
         </div>
         <div className="card flex items-center gap-4 border-l-4 border-l-saffron-deep">
            <div className="w-12 h-12 bg-saffron-deep/10 text-saffron-deep rounded-xl flex items-center justify-center"><TrendingUp /></div>
            <div>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Latest Liver</p>
               <p className="text-xl font-bold text-slate-900">{stats.latestLiver?.risk_band || 'N/A'}</p>
            </div>
         </div>
         <div className="card flex items-center gap-4 border-l-4 border-l-saffron">
            <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-xl flex items-center justify-center"><Activity /></div>
            <div>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Latest Diabetes</p>
               <p className="text-xl font-bold text-slate-900">{stats.latestDiabetes?.risk_band || 'N/A'}</p>
            </div>
         </div>
         <div className="card flex items-center gap-4 border-l-4 border-l-slate-900">
            <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center"><Calendar /></div>
            <div>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Next Appointment</p>
               <p className="text-lg font-bold text-slate-900 truncate">{stats.upcomingAppt?.appt_date ? new Date(stats.upcomingAppt.appt_date).toLocaleDateString() : 'None Scheduled'}</p>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Latest Screening Results */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Screening Snapshot</h2>
               <Link to="/patient/history" className="text-primary-600 font-bold flex items-center gap-1 hover:underline">View History <ArrowRight size={16} /></Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               {/* Liver Result Card */}
               <div className="card border-l-4 border-l-saffron group">
                  <div className="flex items-start justify-between mb-4">
                     <div className="bg-saffron/10 text-saffron p-2 rounded-lg"><Activity size={20} /></div>
                     <span className="text-xs text-slate-400 font-bold uppercase">{stats.latestLiver ? new Date(stats.latestLiver.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Liver Health</h3>
                  {stats.latestLiver ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          stats.latestLiver.risk_band === 'Minimal' ? 'bg-green-100 text-green-700' :
                          stats.latestLiver.risk_band === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {stats.latestLiver.risk_band} RISK
                        </span>
                        <span className="text-slate-400 text-xs font-medium">Confidence: {(stats.latestLiver.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2 mb-4">{stats.latestLiver.interpretation}</p>
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm mb-6">No screening data found. Complete a screening to see results here.</p>
                  )}
                  <Link to={stats.latestLiver? `/patient/history/detail/liver/${stats.latestLiver.id}` : "/patient/screening"} className="btn-secondary w-full flex items-center justify-center gap-2">
                     {stats.latestLiver ? 'View Full Report' : 'Take Screening'}
                  </Link>
               </div>

               {/* Diabetes Result Card */}
               <div className="card border-l-4 border-l-saffron-deep group">
                  <div className="flex items-start justify-between mb-4">
                     <div className="bg-saffron-deep/10 text-saffron-deep p-2 rounded-lg"><Activity size={20} /></div>
                     <span className="text-xs text-slate-400 font-bold uppercase">{stats.latestDiabetes? new Date(stats.latestDiabetes.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Diabetes Risk</h3>
                  {stats.latestDiabetes ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          stats.latestDiabetes.risk_band === 'Minimal' ? 'bg-green-100 text-green-700' :
                          stats.latestDiabetes.risk_band === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {stats.latestDiabetes.risk_band} RISK
                        </span>
                        <span className="text-slate-400 text-xs font-medium">Confidence: {(stats.latestDiabetes.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2 mb-4">{stats.latestDiabetes.interpretation}</p>
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm mb-6">No screening data found. Complete a screening to see results here.</p>
                  )}
                  <Link to={stats.latestDiabetes? `/patient/history/detail/diabetes/${stats.latestDiabetes.id}` : "/patient/screening"} className="btn-secondary w-full flex items-center justify-center gap-2">
                     {stats.latestDiabetes ? 'View Full Report' : 'Take Screening'}
                  </Link>
               </div>
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upcoming Consultations</h2>
            {stats.upcomingAppt ? (
               <div className="card bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Calendar /></div>
                     <div>
                        <p className="font-bold">{stats.upcomingAppt.doctor_name}</p>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{stats.upcomingAppt.specialization}</p>
                     </div>
                  </div>
                  <div className="space-y-3 mb-6">
                     <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-primary-400" />
                        <span>{new Date(stats.upcomingAppt.appt_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-primary-400" />
                        <span>{stats.upcomingAppt.appt_time}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={16} className={stats.upcomingAppt.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'} />
                        <span className="capitalize">{stats.upcomingAppt.status}</span>
                     </div>
                  </div>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">Reschedule</button>
               </div>
            ) : (
               <div className="card bg-slate-100 border-dashed border-2 border-slate-300 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-4"><Calendar /></div>
                  <p className="text-slate-500 font-bold mb-2">No Appointments</p>
                  <Link to="/patient/appointments" className="text-primary-600 text-sm font-bold hover:underline">Schedule one now</Link>
               </div>
            )}
            
            <div className="bg-ink-mid/5 rounded-2xl p-6 border border-ink/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Activity size={60} />
               </div>
               <h3 className="font-bold text-ink flex items-center gap-2 mb-2"><CheckCircle2 size={18} className="text-saffron" /> Daily Health Tip</h3>
               <p className="text-sm text-ink-mid leading-relaxed font-medium relative z-10">Monitoring your water intake and ensuring 7-8 hours of sound sleep are critical for both metabolic and liver health.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

// Simple Icon fallback
const HeartPulse = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);

export default PatientDashboard;
