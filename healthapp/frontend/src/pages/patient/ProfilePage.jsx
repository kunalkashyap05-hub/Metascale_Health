import React, { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Settings,
  Camera,
  Fingerprint,
  Zap,
  Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    hospital: user?.hospital || '',
    specialization: user?.specialization || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/update', profileData);
      if (res.data.success) {
        setUser(res.data.data);
        setSuccess('Clinical profile synchronized successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setError('Credential parity failed: New passwords do not match');
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/change-password', passwordData);
      if (res.data.success) {
        setSuccess('Security credentials updated');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Credential update failed.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20 max-w-6xl mx-auto"
    >
      {/* Dynamic Profile Header */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-slate-900 rounded-[48px] p-8 md:p-16 text-white shadow-3xl border border-white/5"
      >
         {/* Animated Background Mesh */}
         <div className="absolute inset-0 bg-mesh-clinical opacity-30"></div>
         <div className="absolute -top-24 -left-24 w-64 h-64 bg-saffron/20 blur-[120px] animate-pulse"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
               <div className="w-32 h-32 md:w-44 md:h-44 bg-white/10 backdrop-blur-3xl rounded-[40px] flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden relative">
                  {user?.full_name ? (
                    <span className="text-6xl font-display font-black text-white group-hover:scale-110 transition-transform">
                      {user.full_name.charAt(0)}
                    </span>
                  ) : <UserCircle size={80} />}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 cursor-pointer">
                     <Camera size={24} className="mb-2" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">Update <br/> Identity</span>
                  </div>
               </div>
               <div className="absolute -bottom-2 -right-2 bg-saffron w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border-4 border-slate-900">
                  <ShieldCheck size={18} className="text-slate-900" />
               </div>
            </div>

            <div className="text-center md:text-left space-y-4">
               <div>
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <Star size={14} className="text-saffronFill" /> Verified {user?.role} Profile
                  </div>
                  <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white">{user?.full_name}</h1>
                  <p className="text-white/40 font-medium text-lg mt-2 flex items-center justify-center md:justify-start gap-4 uppercase tracking-widest text-xs">
                     <Mail size={16} className="text-saffron" /> {user?.email}
                     {user?.created_at && !isNaN(new Date(user.created_at).getTime()) && (
                       <>
                         <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                         <Calendar size={16} className="text-saffron" /> Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                       </>
                     )}
                  </p>
               </div>
            </div>
         </div>
      </motion.div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-[32px] border backdrop-blur-xl flex items-center gap-6 shadow-2xl relative z-20 ${error ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}
          >
             {error ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
             <p className="font-display font-black uppercase tracking-widest text-sm">{error || success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Settings Sidebar */}
         <div className="lg:col-span-1 space-y-8">
             <motion.div variants={itemVariants} className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-[40px] shadow-3xl">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 pl-1">Account Settings</h3>
                <div className="space-y-2">
                   {[
                     { icon: <UserCircle size={18} />, label: 'Profile Details', active: true }
                   ].map((item) => (
                     <button key={item.label} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${item.active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
                        {item.icon}
                        {item.label}
                     </button>
                   ))}
                </div>
             </motion.div>
 
             <motion.div variants={itemVariants} className="bg-mesh-saffron rounded-[40px] p-10 text-white shadow-3xl relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform">
                   <ShieldCheck size={200} />
                </div>
                <div className="relative z-10 space-y-6">
                   <h4 className="font-display font-black text-2xl uppercase tracking-tighter leading-tight">Secure Clinical Storage</h4>
                   <p className="text-white/70 text-xs font-medium leading-relaxed uppercase tracking-widest">Metascale employs industry-standard encryption for clinical data. Your information is protected and private.</p>
                   <button className="bg-white text-saffron-deep px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95">
                      Privacy Policy
                   </button>
                </div>
             </motion.div>
         </div>

         {/* Configuration Forms */}
         <div className="lg:col-span-2 space-y-12">
            <motion.section variants={itemVariants} className="space-y-6">
               <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                  Clinical Synchronization
                  <div className="h-px flex-1 bg-slate-100"></div>
               </h3>
               <div className="card !bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[48px] shadow-3xl">
                  <form onSubmit={handleProfileUpdate} className="space-y-10">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                           <input 
                             type="text" 
                             value={profileData.full_name}
                             onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                             className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep transition-all font-display font-black text-slate-700 tracking-tight"
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical ID (Email)</label>
                           <div className="relative">
                              <input 
                                type="email" 
                                value={profileData.email} disabled
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[24px] text-slate-400 font-medium cursor-not-allowed pr-14"
                              />
                              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Age Cluster</label>
                              <input 
                                type="number" 
                                value={profileData.age}
                                onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                                className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[24px] outline-none transition-all font-medium"
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bio Gender</label>
                              <select 
                                value={profileData.gender}
                                onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                                className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[24px] outline-none transition-all font-medium font-sans"
                              >
                                 <option value="male">Male</option>
                                 <option value="female">Female</option>
                              </select>
                           </div>
                        </div>
                        {user?.role === 'doctor' && (
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Expert Domain</label>
                              <input 
                                type="text" 
                                value={profileData.specialization}
                                onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                                className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-saffron/10 focus:border-saffron-deep transition-all font-medium capitalize"
                              />
                           </div>
                        )}
                     </div>
                     <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loading} className="bg-mesh-saffron text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 disabled:opacity-50">
                           {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                           {loading ? 'Syncing...' : 'Synchronize Identity'}
                        </button>
                     </div>
                  </form>
               </div>
            </motion.section>

             <motion.section variants={itemVariants} className="space-y-6">
                {/* Security section removed for streamlining */}
             </motion.section>
         </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
