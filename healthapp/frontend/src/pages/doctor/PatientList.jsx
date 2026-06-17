import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Phone, 
  Activity, 
  Stethoscope,
  Loader2,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import api from '../../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctor/patients');
        if (res.data.success) {
          setPatients(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (error) {
        console.error('Error fetching patients', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Users className="text-primary-600" /> Patient Registry
           </h1>
           <p className="text-slate-500 font-medium">Manage and review screening results for all your assigned patients.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name/email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
              />
           </div>
           <button className="btn-secondary px-4 py-2.5 flex items-center gap-2"><Filter size={18} /> Filters</button>
        </div>
      </div>

      {error ? (
        <div className="card bg-red-50 border-red-100 flex items-center gap-4 text-red-700">
           <AlertCircle /> <p className="font-bold">{error}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredPatients.map((patient) => (
              <div key={patient.id} className="card group hover:shadow-xl hover:border-primary-200 transition-all duration-300">
                 <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl ring-4 ring-primary-50 group-hover:bg-primary-600 group-hover:text-white transition-all">
                          {patient.full_name?.charAt(0)}
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-900 text-lg">{patient.full_name}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{patient.age}Y • {patient.gender}</p>
                       </div>
                    </div>
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><MoreVertical size={20} /></button>
                 </div>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                       <Mail size={16} className="text-slate-400" /> <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                       <Activity size={16} className="text-slate-400" /> 
                       <span>{patient.total_screenings || 0} Total Screenings</span>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex gap-2">
                       {Boolean(patient.has_liver) && <div className="text-saffron p-1 bg-saffron/10 rounded-lg" title="Liver Screening Available"><Activity size={16} /></div>}
                       {Boolean(patient.has_diabetes) && <div className="text-saffron-deep p-1 bg-saffron-deep/10 rounded-lg" title="Diabetes Screening Available"><Stethoscope size={16} /></div>}
                    </div>
                    <button 
                      onClick={() => navigate(`/doctor/patients/${patient.id}`)} 
                      className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-primary-600 flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                       Review History <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
           ))}
           {filteredPatients.length === 0 && (
              <div className="col-span-full card py-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed bg-slate-50/50">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mx-auto">
                    <Users size={40} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">No Patients Found</h3>
                 <p className="text-slate-500 max-w-xs font-medium">No results match your current search or filter criteria.</p>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default PatientList;
