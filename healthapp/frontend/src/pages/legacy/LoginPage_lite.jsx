import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const location = useLocation();
  const isDoctorMode = location.state?.role === 'doctor';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron-deep shadow-lg ring-2 ring-white/60 flex-shrink-0"></div>
            <div>
                <div className="font-bold text-[13px] uppercase tracking-[0.1em] text-slate-900 leading-none mb-1 font-mono">Metascale Health</div>
                <div className="text-[10px] text-saffron-deep/80 font-bold uppercase tracking-tight">Clinical Portal</div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            {isDoctorMode ? 'Doctor Login' : 'Welcome Back'}
          </h1>
          <p className="text-slate-600">
            {isDoctorMode 
              ? 'Access clinical patient records and health screenings.' 
              : 'Access your personalized health dashboard and history.'}
          </p>
        </div>

        <div className="card shadow-xl border-white ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-shake">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all outline-none" 
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Password</label>
                <Link to="/forgot-password" size="sm" className="text-sm font-semibold text-saffron-deep hover:text-saffron">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all outline-none" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 group shadow-saffron/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 font-medium">New to Metascale? <Link to="/register" className="text-saffron-deep font-bold hover:underline">Create an account</Link></p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secured by Industry Standard Encryption</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
