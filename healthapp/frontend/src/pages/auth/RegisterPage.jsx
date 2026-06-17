import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Calendar, Phone, Eye, EyeOff } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';


const RegisterPage = () => {
  const location = useLocation();
  const initialRole = location.state?.role || 'patient';

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    role: initialRole,
    license_number: '',
    medical_council: '',
    years_of_experience: '',
    qualification: '',
    specialization: '',
    hospital: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await register({
        full_name: formData.full_name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password.trim(),
        age: formData.age,
        gender: formData.gender,
        role: formData.role,
        specialization: formData.specialization,
        hospital: formData.hospital,
        license_number: formData.license_number,
        medical_council: formData.medical_council,
        years_of_experience: formData.years_of_experience,
        qualification: formData.qualification
      });
      if (res.success) {
        if (formData.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error('Registration error detail:', err);
      const backendMessage = err.response?.data?.message;
      const errorMessage = backendMessage || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-20 overflow-hidden">
      {/* Signature Background Restoration with Dynamic Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden text-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffb472] via-[#f7f2ff] to-white opacity-40"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-saffron-light blur-[150px] rounded-full"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -50, 0],
            opacity: [0.1, 0.18, 0.1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-0 w-[600px] h-[600px] bg-lavender-light/40 blur-[130px] rounded-full"
        ></motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          {/* ORIGINAL LOGO RESTORATION */}
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-8 group">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="flex items-center gap-3 cursor-pointer"
            >
               <motion.div 
                 animate={{ 
                   boxShadow: ["0px 0px 0px rgba(247,147,30,0)", "0px 0px 20px rgba(247,147,30,0.3)", "0px 0px 0px rgba(247,147,30,0)"]
                 }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-10 h-10 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron-deep shadow-lg ring-2 ring-white/60 flex-shrink-0 relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rotate-45 transform -translate-x-full animate-[shimmer_3s_infinite]"></div>
               </motion.div>
               <div className="text-left">
                  <div className="font-bold text-[13px] uppercase tracking-[0.1em] text-slate-900 leading-none mb-1 font-mono">Metascale Health</div>
                  <div className="text-[10px] text-saffron-deep/80 font-bold uppercase tracking-tight">Register Portal</div>
               </div>
            </motion.div>
          </Link>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-4xl font-black text-slate-900 mb-2 tracking-tight"
          >
            Create Account
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-[20px] mb-8 max-w-[300px] mx-auto ring-1 ring-black/5 shadow-sm"
          >
             <button 
                type="button"
                onClick={() => setRole('patient')}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${formData.role === 'patient' ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-saffron-deep' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Patient
             </button>
             <button 
                type="button"
                onClick={() => setRole('doctor')}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${formData.role === 'doctor' ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-saffron-deep' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Doctor
             </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          className="backdrop-blur-2xl bg-white/45 p-8 md:p-12 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/60 ring-1 ring-black/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-start gap-2 overflow-hidden mx-auto"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="font-bold uppercase tracking-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="space-y-2"
              >
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
                  <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                    placeholder="Full Name"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="space-y-2"
              >
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Clinical Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                    placeholder="name@clinical.com"
                    required
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="space-y-2"
              >
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Age</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                    placeholder="Age"
                    required
                  />
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="space-y-2"
              >
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none appearance-none font-bold text-slate-700"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
            </div>

            <AnimatePresence>
            {formData.role === 'doctor' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 pt-6 mt-6 border-t border-black/5 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Medical License</label>
                    <input 
                      type="text" 
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                      placeholder="License #"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Council</label>
                    <input 
                      type="text" 
                      name="medical_council"
                      value={formData.medical_council}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                      placeholder="e.g. NMC"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Specialization</label>
                    <input 
                      type="text" 
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                      placeholder="e.g. Cardiologist"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Experience (Yrs)</label>
                    <input 
                      type="number" 
                      name="years_of_experience"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                      placeholder="Years"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Qualification</label>
                    <input 
                      type="text" 
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                      placeholder="e.g. MD"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Hospital Base</label>
                    <input 
                      type="text" 
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                      placeholder="Hopsital Name"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="space-y-2"
              >
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-saffron-deep transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, type: "spring" }}
                className="space-y-2"
              >
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-saffron-deep transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, type: "spring" }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(247,147,30,0.4)" }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-5 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group mt-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-10 pt-8 border-t border-black/5 text-center"
          >
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em]">Already Authorized? <Link to="/login" className="text-saffron-deep font-black hover:underline underline-offset-4 ml-1">Sign In</Link></p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
