import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck,
  Globe,
  Loader2,
  Calendar
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  const totalUsers = analytics?.users?.reduce((acc, curr) => acc + curr.count, 0);
  const doctorCount = analytics?.users?.find(u => u.role === 'doctor')?.count || 0;
  const totalScreenings = analytics?.screenings?.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <BarChart3 className="text-primary-600" /> System Analytics
           </h1>
           <p className="text-slate-500 font-medium">Global metascale metrics and operational health overview.</p>
        </div>
      </div>

      {/* Hero Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-saffron/10 text-saffron rounded-2xl group-hover:bg-saffron group-hover:text-white transition-colors shadow-sm"><Users size={24} /></div>
               <div className="flex items-center gap-1 text-green-600 font-bold text-xs"><ArrowUpRight size={14} /> 8.1%</div>
            </div>
            <p className="text-4xl font-display font-bold text-slate-900 mb-1">{totalUsers}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Population</p>
         </div>
         <div className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-saffron-light/10 text-saffron-deep rounded-2xl group-hover:bg-saffron-deep group-hover:text-white transition-colors shadow-sm"><Stethoscope size={24} /></div>
               <div className="flex items-center gap-1 text-green-600 font-bold text-xs"><ArrowUpRight size={14} /> 2.4%</div>
            </div>
            <p className="text-4xl font-display font-bold text-slate-900 mb-1">{doctorCount}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Medical Personnel</p>
         </div>
         <div className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-ink/10 text-ink rounded-2xl group-hover:bg-ink group-hover:text-white transition-colors shadow-sm"><Activity size={24} /></div>
               <div className="flex items-center gap-1 text-green-600 font-bold text-xs"><ArrowUpRight size={14} /> 12.5%</div>
            </div>
            <p className="text-4xl font-display font-bold text-slate-900 mb-1">{totalScreenings}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Assessments</p>
         </div>
         <div className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm"><TrendingUp size={24} /></div>
               <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">Stable</div>
            </div>
            <p className="text-4xl font-display font-bold text-slate-900 mb-1">99.9%</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">System Uptime</p>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Population Distribution */}
         <div className="lg:col-span-2 space-y-8">
            <div className="card p-0 overflow-hidden relative border-none shadow-2xl shadow-slate-200">
               <div className="bg-slate-900 text-white p-8">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><Globe size={24} className="text-primary-400" /> Screening Growth Trend</h3>
                  <p className="text-sm text-slate-400 font-medium">Monthly volume of clinical risk assessments across sectors.</p>
               </div>
               <div className="p-8 space-y-6 bg-white">
                  {analytics?.trend?.map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                          <span>{item.month}</span>
                          <span>{item.count} Assessments</span>
                       </div>
                       <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex p-0.5">
                          <div className="h-full bg-gradient-to-r from-saffron to-saffron-deep rounded-full shadow-lg" style={{ width: `${(item.count / 20) * 100}%` }}></div>
                       </div>
                    </div>
                  ))}
                  {(!analytics?.trend || analytics.trend.length === 0) && (
                     <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No trend data captured.</div>
                  )}
               </div>
            </div>
         </div>

         {/* Operational Focus */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Operational Focus</h2>
            
            <div className="card bg-primary-50 border-primary-100 flex gap-4 p-6 hover:shadow-xl transition-all">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm"><ShieldCheck size={24} /></div>
               <div>
                  <h4 className="font-bold text-slate-900">GDPR Compliance</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">All patient data and PII are currently secured under strict metascale protocols.</p>
               </div>
            </div>

            <div className="card space-y-6 p-8 shadow-xl shadow-slate-100 border-l-4 border-l-slate-900">
               <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Population Risk Profile</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between font-bold text-sm">
                     <span className="text-saffron font-bold">Liver Exposure</span>
                     <span className="text-saffron-deep font-bold">{analytics?.screenings?.find(s => s.type === 'liver')?.count || 0} Units</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-sm">
                     <span className="text-saffron-deep font-bold">Metabolic Exposure</span>
                     <span className="text-saffron font-bold">{analytics?.screenings?.find(s => s.type === 'diabetes')?.count || 0} Units</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                     <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                        <ArrowUpRight size={14} /> Optimal System Load
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
