import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Search, 
  Info, 
  CheckCircle2, 
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  
  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];
  const endOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0, 12).toISOString().split('T')[0];
  const [newAppt, setNewAppt] = useState({
    doctor_id: '',
    appt_date: '',
    appt_time: '',
    reason: '',
    type: 'in-person'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, doctorRes] = await Promise.all([
        api.get('/appointments/patient'),
        api.get('/auth/doctors') // Public Specialist discovery
      ]);
      setAppointments(apptRes.data.data);
      setDoctors(doctorRes.data.data);
    } catch {
      console.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };
  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Time Scope Validation (8:00 AM - 9:00 PM)
    const [hours, minutes] = newAppt.appt_time.split(':').map(Number);
    if (hours < 8 || hours > 21 || (hours === 21 && minutes > 0)) {
      return setError('Clinical Hours: Consultations must be scheduled between 08:00 AM and 09:00 PM.');
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/appointments/book', newAppt);
      if (res.data.success) {
        setShowBooking(false);
        fetchData();
        setNewAppt({ doctor_id: '', appt_date: '', appt_time: '', reason: '', type: 'in-person' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking request failed. Please check clinical availability.');
      console.error('Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Calendar className="text-primary-600" /> Consultations
           </h1>
           <p className="text-slate-500 font-medium">Manage your appointments and medical consultations.</p>
        </div>
        <button 
          onClick={() => setShowBooking(!showBooking)}
          className="btn-primary flex items-center gap-2 px-6"
        >
          {showBooking ? <XCircle size={18} /> : <Plus size={18} />}
          {showBooking ? 'Cancel Booking' : 'Book Consultation'}
        </button>
      </div>

      {showBooking && (
        <div className="card shadow-2xl border-primary-100 animate-in zoom-in-95 duration-200">
           <h2 className="text-xl font-bold text-slate-900 mb-6">Schedule New Appointment</h2>
           <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">SELECT DOCTOR</label>
                 <select 
                   value={newAppt.doctor_id}
                   onChange={(e) => setNewAppt({...newAppt, doctor_id: e.target.value})}
                   required
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                 >
                    <option value="">Choose a Specialist</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.full_name} ({d.specialization})</option>
                    ))}
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">DATE</label>
                    <input 
                      type="date" 
                      min={today}
                      max={endOfMonth}
                      value={newAppt.appt_date}
                      onChange={(e) => setNewAppt({...newAppt, appt_date: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">TIME</label>
                    <input 
                      type="time" 
                      min="08:00"
                      max="21:00"
                      value={newAppt.appt_time}
                      onChange={(e) => setNewAppt({...newAppt, appt_time: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">CONSULTATION TYPE</label>
                 <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setNewAppt({...newAppt, type: 'in-person'})}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newAppt.type === 'in-person' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      In-Person
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewAppt({...newAppt, type: 'video'})}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newAppt.type === 'video' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Virtual
                    </button>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">REASON FOR VISIT</label>
                 <input 
                   type="text" 
                   value={newAppt.reason}
                   onChange={(e) => setNewAppt({...newAppt, reason: e.target.value})}
                   placeholder="e.g. Screening Report Review"
                   required
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                 />
              </div>
              {error && (
                 <div className="md:col-span-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in shake duration-300">
                    <AlertCircle size={18} />
                    {error}
                 </div>
              )}
              <div className="md:col-span-2 pt-4">
                 <button 
                   type="submit" 
                   disabled={bookingLoading}
                   className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2"
                 >
                   {bookingLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking Request'}
                 </button>
              </div>
           </form>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Schedule</h2>
            {appointments.length > 0 ? (
               <div className="space-y-4">
                  {appointments.map(appt => (
                     <div key={appt.id} className="card hover:shadow-md transition-all border-l-4 group" style={{ borderLeftColor: appt.status === 'confirmed' ? '#22c55e' : appt.status === 'pending' ? '#eab308' : '#ef4444' }}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                 <User size={24} />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900">{appt.doctor_name}</p>
                                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{appt.specialization}</p>
                              </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                 <Calendar size={16} className="text-primary-500" />
                                 {new Date(appt.appt_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                 <Clock size={16} className="text-primary-500" />
                                 {appt.appt_time}
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                 appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                 appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                 'bg-red-100 text-red-700'
                              }`}>
                                 {appt.status}
                              </div>
                           </div>
                        </div>
                        {appt.doctor_notes && (
                           <div className="mt-4 p-3 bg-saffron/10 rounded-xl border border-saffron/20 text-sm text-saffron-deep italic">
                             " {appt.doctor_notes} "
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            ) : (
               <div className="card bg-slate-50 border-dashed border-2 border-slate-200 py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto shadow-sm">
                     <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No Scheduled Appts</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium leading-relaxed">Schedule a consultation to discuss your screening results with a healthcare specialist.</p>
               </div>
            )}
         </div>

         <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Our Specialists</h2>
            <div className="space-y-4">
               {doctors.slice(0, 3).map(doctor => (
                  <div key={doctor.id} className="card p-4 hover:border-primary-200 transition-colors">
                     <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                           {doctor.full_name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-bold text-slate-900">{doctor.full_name}</p>
                           <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest">{doctor.specialization}</p>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500 flex items-center gap-1 font-medium"><MapPin size={12} /> {doctor.hospital || 'Multi-speciality Clinic'}</p>
                  </div>
               ))}
            </div>
            
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
               <div className="flex items-start gap-4 text-primary-700">
                  <Info className="shrink-0 mt-0.5" size={20} />
                  <div className="space-y-2">
                     <h4 className="font-bold text-sm">Consultation Guidelines</h4>
                     <p className="text-xs leading-relaxed font-medium">Please ensure you have your latest lab reports and screening ID ready before the consultation. Virtual meetings will be conducted via our secure platform.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
