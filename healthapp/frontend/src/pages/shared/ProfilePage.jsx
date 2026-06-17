import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Zap, 
  ArrowLeft,
  Lock,
  Loader2,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    license_number: user?.license_number || '',
    medical_council: user?.medical_council || '',
    years_of_experience: user?.years_of_experience || '',
    qualification: user?.qualification || '',
    specialization: user?.specialization || '',
    hospital: user?.hospital || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/auth/profile', formData);
      setMessage({ type: 'success', text: 'Identity Vector Synchronized Successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Synchronization Interrupted' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add('app-dark-mode');
    return () => document.body.classList.remove('app-dark-mode');
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-16 pb-24 px-4 md:px-0"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-10">
         <div className="space-y-4">
            <button 
               onClick={() => navigate(-1)}
               className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-saffron transition-all"
            >
               <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Temporal HUB
            </button>
            <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
               Clinical <br />
               <span className="text-saffron italic font-sans font-medium lowercase">Identity</span>
            </h1>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
         <div className="lg:col-span-1 space-y-10">
            <div className="glass-dark p-12 rounded-[64px] border border-white/5 text-center space-y-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-saffron opacity-5"></div>
               <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[48px] mx-auto flex items-center justify-center text-saffron shadow-5xl group-hover:rotate-12 transition-transform relative z-10">
                  <User size={64} />
               </div>
               <div className="space-y-2 relative z-10">
                  <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight">{user?.full_name}</h3>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] font-display">{user?.role} Cluster</p>
               </div>
               <div className="pt-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-saffron/5 border border-saffron/20 text-saffron text-[10px] font-black uppercase tracking-widest">
                     <ShieldCheck size={14} /> Node: {user?.id}
                  </div>
               </div>
            </div>

            <div className="p-10 rounded-[56px] bg-white/5 border border-white/5 space-y-6 grayscale transition-all hover:grayscale-0 cursor-default">
               <div className="flex items-center gap-4 text-saffron">
                  <Lock size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Privacy Handshake</h4>
               </div>
               <p className="text-[9px] text-white/20 font-black uppercase tracking-widest leading-relaxed italic">Your clinical biovariables are cryptographically isolated from the public terminal.</p>
            </div>
         </div>

         <div className="lg:col-span-2 space-y-12">
            <form onSubmit={handleSubmit} className="glass-dark p-10 md:p-16 rounded-[72px] border border-white/5 shadow-5xl space-y-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-saffron/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-40"></div>
               
               <AnimatePresence>
                  {message.text && (
                     <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-6 rounded-[32px] text-[10px] font-black uppercase tracking-widest flex items-center gap-4 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
                     >
                        <Zap size={18} /> {message.text}
                     </motion.div>
                  )}
               </AnimatePresence>

               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-6">Legal Name</label>
                     <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none text-white font-medium shadow-inner" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-6">Endpoint</label>
                     <input type="email" name="email" value={formData.email} disabled className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none text-white/40 font-medium shadow-inner cursor-not-allowed" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-6">Cycle Age</label>
                     <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none text-white font-medium shadow-inner" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-6">Identity Vector</label>
                     <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none text-white font-black text-[10px] uppercase tracking-widest shadow-inner appearance-none">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Agnostic</option>
                     </select>
                  </div>
               </div>

               {user?.role === 'doctor' && (
                  <div className="space-y-12 pt-12 border-t border-white/5">
                     <h3 className="text-xl font-display font-black text-white uppercase tracking-tight flex items-center gap-4">
                        <Award className="text-saffron" size={20} /> Professional Credentials
                     </h3>
                     <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-6">License Protocol</label>
                           <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none text-white font-medium shadow-inner" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-6">Specialization</label>
                           <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[32px] outline-none text-white font-medium shadow-inner" />
                        </div>
                     </div>
                  </div>
               )}

               <button type="submit" disabled={loading} className="btn-primary w-full py-6 flex items-center justify-center gap-4 group">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : (
                     <>
                        Synchronize Core <Save size={20} className="group-hover:-translate-y-1 transition-transform" />
                     </>
                  )}
               </button>
            </form>
         </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
