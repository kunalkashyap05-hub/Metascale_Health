import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight, 
  Download, 
  Activity, 
  Stethoscope,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/predict/history');
      if (res.data.success) {
        setHistory(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error('Fetch result error:', err);
      setError('Failed to fetch prediction details.');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (!item) return false;
    // Case-insensitive filtering with guaranteed null-safety
    const itemType = (item.type || 'unknown').toLowerCase();
    const itemRisk = (item.risk_band || 'unknown').toLowerCase();
    const searchLower = search.toLowerCase();
    
    const matchesFilter = filter === 'all' || itemType === filter.toLowerCase();
    const matchesSearch = itemRisk.includes(searchLower) || itemType.includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
      <Loader2 className="animate-spin text-primary-600" size={40} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading history...</p>
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <History className="text-primary-600" /> Screening History
           </h1>
           <p className="text-slate-500 font-medium">Coordinate your clinical data and monitor health trends over time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search history..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-64 shadow-sm"
              />
           </div>
           <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button 
                onClick={() => setFilter('all')}
                className={`flex-1 min-w-[70px] px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('liver')}
                className={`flex-1 min-w-[70px] px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'liver' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Liver
              </button>
              <button 
                onClick={() => setFilter('diabetes')}
                className={`flex-1 min-w-[70px] px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === 'diabetes' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Diabetes
              </button>
           </div>
        </div>
      </div>

      {error ? (
        <div className="card bg-red-50 border-red-100 flex items-center gap-4 text-red-700">
           <AlertCircle size={24} />
           <p className="font-bold">{error}</p>
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-100">
           <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
              <table className="w-full text-left border-collapse min-w-[800px]">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                       <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Type & Date</th>
                       <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Assessment</th>
                       <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Score / Confidence</th>
                       <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-6">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'liver' ? 'bg-saffron/10 text-saffron' : 'bg-saffron-deep/10 text-saffron-deep'}`}>
                                   {item.type === 'liver' ? <Activity size={20} /> : <Stethoscope size={20} />}
                                </div>
                                <div>
                                   <p className="font-bold text-slate-900 capitalize">{item.type} Screening</p>
                                   <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                      <Calendar size={12} /> {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                 item.risk_band === 'Minimal' ? 'bg-green-100 text-green-700' :
                                 item.risk_band === 'Elevated' ? 'bg-yellow-100 text-yellow-700' :
                                 item.risk_band === 'Severe' ? 'bg-orange-100 text-orange-700' :
                                 item.risk_band === 'Critical' ? 'bg-red-100 text-red-700' :
                                 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}>
                                 {item.risk_band || 'Unknown'} Risk
                              </span>
                          </td>
                          <td className="px-6 py-6 font-display font-bold text-slate-600">
                             {item.confidence ? (item.confidence * 100).toFixed(1) : '0.0'}% <span className="text-xs text-slate-400 font-sans uppercase">Confidence</span>
                          </td>
                          <td className="px-6 py-6 text-right">
                             <Link 
                               to={`/patient/history/detail/${item.type}/${item.id}`}
                               state={{ result: { riskBand: item.risk_band, interpretation: item.interpretation }, type: item.type }}
                               className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 group-hover:translate-x-1 transition-all"
                             >
                                Full Report <ChevronRight size={16} />
                             </Link>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      ) : (
        <div className="card bg-slate-50 border-dashed border-2 border-slate-200 py-20 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
              <History size={32} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 mb-2">No History Found</h3>
           <p className="text-slate-500 max-w-xs mb-8">You haven't completed any screenings yet. Take a moment to screen your health.</p>
           <Link to="/patient/screening" className="btn-primary flex items-center gap-2 px-8">
              Start Screening Now <ArrowRight size={18} />
           </Link>
        </div>
      )}

      {/* Analytics Card */}
      {history.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-primary-600 text-white flex flex-col justify-between min-h-[200px]">
               <div className="flex items-start justify-between">
                  <div className="p-2 bg-white/10 rounded-lg"><Activity size={24} /></div>
                  <div className="text-xs font-bold uppercase opacity-60">Status</div>
               </div>
               <div>
                  <p className="text-4xl font-display font-bold mb-1">Health Sync</p>
                  <p className="text-sm text-primary-100 font-medium">All clinical parameters are current.</p>
               </div>
            </div>
            <div className="card md:col-span-2">
               <h3 className="font-bold text-slate-900 mb-4">Screening Distribution</h3>
               <div className="flex items-center gap-8">
                  <div className="flex-1 space-y-4">
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                           <span>Liver Screening</span>
                           <span>{history.filter(h => h.type === 'liver').length} Assessments</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-saffron" style={{ width: `${(history.filter(h=>h.type==='liver').length / history.length) * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                           <span>Diabetes Evaluation</span>
                           <span>{history.filter(h => h.type === 'diabetes').length} Assessments</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-saffron-deep" style={{ width: `${(history.filter(h=>h.type==='diabetes').length / history.length) * 100}%` }}></div>
                        </div>
                     </div>
                  </div>
                  {/* Export button removed as requested */}
               </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
