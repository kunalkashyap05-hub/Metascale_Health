import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ShieldAlert, 
  Loader2,
  Mail,
  User,
  Activity,
  MoreVertical,
  Check
} from 'lucide-react';
import api from '../../services/api';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data.data);
    } catch {
      console.error('Failed to load portal personnel.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/doctors/${id}/approve`);
      fetchDoctors();
    } catch {
      console.error('Error fetching doctors');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/users/${id}/status`, { is_active: !currentStatus });
      fetchDoctors();
    } catch {
      console.error('Failed to fetch doctors');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Stethoscope className="text-primary-600" /> Clinical Personnel
           </h1>
           <p className="text-slate-500 font-medium">Verify and manage authorized medical practitioners on the platform.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search personnel..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
              />
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl shadow-sm border-2 border-inherit group-hover:scale-105 transition-transform ${doctor.is_approved ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                        {doctor.full_name?.charAt(0).toUpperCase()}
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{doctor.full_name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doctor.specialization || 'General Practitioner'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-full ${doctor.is_active ? 'bg-green-500 shadow-lg shadow-green-100 animate-pulse' : 'bg-red-500'}`} title={doctor.is_active ? 'Active' : 'Deactivated'}></div>
                     <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-300"><MoreVertical size={18} /></button>
                  </div>
               </div>

               <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                     <Mail size={16} className="text-slate-400" /> <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                     <Activity size={16} className="text-slate-400" /> <span className="truncate">{doctor.hospital || 'Multi-speciality Clinic'}</span>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-100">
                  {!doctor.is_approved ? (
                     <div className="flex gap-3">
                        <button 
                          onClick={() => handleApprove(doctor.id)}
                          disabled={actionLoading === doctor.id}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-primary-100 flex items-center justify-center gap-2"
                        >
                           {actionLoading === doctor.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />} Verify Credential
                        </button>
                        <button className="p-3 bg-red-50 hover:bg-red-200 text-red-600 rounded-xl transition-all"><Trash2 size={16} /></button>
                     </div>
                  ) : (
                     <button 
                       onClick={() => handleToggleStatus(doctor.id, doctor.is_active)}
                       disabled={actionLoading === doctor.id}
                       className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${doctor.is_active ? 'bg-white border border-slate-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100'}`}
                     >
                        {actionLoading === doctor.id ? <Loader2 size={14} className="animate-spin" /> : doctor.is_active ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                        {doctor.is_active ? 'Deactivate Personnel' : 'Reactivate Personnel'}
                     </button>
                  )}
               </div>
            </div>
         ))}

         {filteredDoctors.length === 0 && (
            <div className="col-span-full card py-24 flex flex-col items-center justify-center text-center space-y-4 border-dashed bg-slate-50/50">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mx-auto"><User size={40} /></div>
               <h3 className="text-xl font-bold text-slate-900">No personnel records found.</h3>
               <p className="text-slate-500 font-medium max-w-xs">Start by registering doctors or checking approval requests.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default DoctorManagement;
