import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const location = useLocation();
  const isDoctorMode = location.state?.role === 'doctor';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const cleanPassword = password.trim();
      const res = await login({ email: cleanEmail, password: cleanPassword });
      if (res.success) {
        const role = res.data.user.role;
        if (role === 'patient') navigate('/patient/dashboard');
        else if (role === 'doctor') navigate('/doctor/dashboard');
        else if (role === 'admin') navigate('/admin/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Signature Background Restoration with Dynamic Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffb472] via-[#f7f2ff] to-white opacity-40"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-saffron-light blur-[120px] rounded-full"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [0, 50, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -left-20 w-[500px] h-[500px] bg-lavender-light/30 blur-[100px] rounded-full"
        ></motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.8 }}
        className="w-full max-w-md relative z-10"
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
                  <div className="text-[10px] text-saffron-deep/80 font-bold uppercase tracking-tight">Sign In Portal</div>
               </div>
            </motion.div>
          </Link>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-slate-900 mb-2 tracking-tight"
          >
            {isDoctorMode ? 'Doctor Portal' : 'Sign In'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 font-medium tracking-tight"
          >
            {isDoctorMode && 'Secured gateway for healthcare professionals.'}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="backdrop-blur-2xl bg-white/40 p-8 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/60 ring-1 ring-black/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-start gap-2 overflow-hidden"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="font-bold uppercase tracking-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Terminal</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border-0 rounded-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-saffron/40 transition-all outline-none font-bold placeholder:text-slate-300" 
                  placeholder="name@clinical.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between ml-1">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Key</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-deep transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(247,147,30,0.3)" }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 pt-6 border-t border-black/5 text-center"
          >
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">New to Metascale? <Link to="/register" className="text-saffron-deep font-black hover:underline underline-offset-4">Sign Up</Link></p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
