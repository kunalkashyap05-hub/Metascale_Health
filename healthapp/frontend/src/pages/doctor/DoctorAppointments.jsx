import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Trash2,
  Check,
  MessageSquare,
  ChevronRight,
  Stethoscope,
  History
} from 'lucide-react';
import api from '../../services/api';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/doctor');
      setAppointments(res.data.data);
    } catch (error) {
      console.error('Failed to load clinical schedule.', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await api.put(`/appointments/${id}/status`, { 
        status, 
        doctor_notes: noteMap[id] || '' 
      });
      fetchAppointments();
      setNoteMap({ ...noteMap, [id]: '' });
    } catch (error) {
      console.error('Error updating status', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  const pending = appointments.filter(a => a.status === 'pending');
  const upcoming = appointments.filter(a => a.status === 'confirmed');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Calendar className="text-primary-600" /> Clinic Schedule
           </h1>
           <p className="text-slate-500 font-medium">Manage patient consultations and update medical status.</p>
        </div>
      </div>

      {/* Pending Approval Section */}
      {pending.length > 0 && (
         <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
               <AlertCircle className="text-yellow-500" /> Pending Requests
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
               {pending.map(appt => (
                  <div key={appt.id} className="card border-l-4 border-l-yellow-500 shadow-xl shadow-yellow-50/50">
                     <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                              {appt.patient_name?.charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900">{appt.patient_name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{appt.age}Y • {appt.gender}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-slate-900">{new Date(appt.appt_date).toLocaleDateString()}</p>
                           <p className="text-xs text-slate-400 font-bold uppercase">{appt.appt_time}</p>
                        </div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl mb-6">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Reason for Visit</p>
                        <p className="text-sm font-medium text-slate-700 italic">" {appt.reason} "</p>
                     </div>
                     <div className="flex gap-3">
                        <button 
                          onClick={() => updateStatus(appt.id, 'confirmed')}
                          disabled={actionLoading === appt.id}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                        >
                           {actionLoading === appt.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                           Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(appt.id, 'cancelled')}
                          disabled={actionLoading === appt.id}
                          className="flex-1 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                        >
                           Refuse
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </section>
      )}

      {/* Main Schedule */}
      <div className="grid lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
               <CheckCircle2 className="text-primary-600" /> Confirmed Consultations
            </h2>
            {upcoming.length > 0 ? (
               <div className="space-y-4">
                  {upcoming.map(appt => (
                     <div key={appt.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all border-l-4 border-l-green-600">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                              {appt.patient_name?.charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900">{appt.patient_name}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-tight">
                                 <span>{new Date(appt.appt_date).toLocaleDateString()}</span>
                                 <span>•</span>
                                 <span>{appt.appt_time}</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex-1 max-w-sm">
                           <textarea 
                             placeholder="Add clinical notes..." 
                             value={noteMap[appt.id] || ''}
                             onChange={(e) => setNoteMap({ ...noteMap, [appt.id]: e.target.value })}
                             className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary-500 h-10 resize-none transition-all"
                           />
                        </div>

                        <div className="flex gap-2">
                           <button 
                             onClick={() => updateStatus(appt.id, 'completed')}
                             className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-100 flex items-center justify-center"
                             title="Mark as Completed"
                           >
                              <Check size={20} />
                           </button>
                           <button 
                             onClick={() => updateStatus(appt.id, 'cancelled')}
                             className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                             title="Cancel Appointment"
                           >
                              <Trash2 size={20} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="card bg-slate-50 border-dashed border-2 border-slate-200 py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-sm"><Stethoscope size={32} /></div>
                  <h3 className="text-lg font-bold text-slate-900">No Upcoming Visits</h3>
                  <p className="text-slate-500 font-medium text-sm">Once patient requests are approved, they will appear in your daily schedule here.</p>
               </div>
            )}
         </div>

         {/* Sidebar: Past Records Insight */}
         <div className="space-y-6">
            {/* Patient Insights card removed */}

            <div className="card space-y-4">
               <h3 className="font-bold text-slate-900 flex items-center gap-2"><History size={18} className="text-slate-400" /> Completed Visits</h3>
               <div className="space-y-3">
                  {past.slice(0, 3).map(p => (
                     <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100 font-bold text-[10px] uppercase">{p.patient_name?.charAt(0)}</div>
                           <div>
                              <p className="text-xs font-bold text-slate-700">{p.patient_name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{p.status}</p>
                           </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                     </div>
                  ))}
                  {past.length === 0 && <p className="text-xs text-slate-400 font-medium italic text-center py-4">No past records found.</p>}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
