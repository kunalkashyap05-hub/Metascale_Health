import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const LiverScreening = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    totalBilirubin: '',
    directBilirubin: '',
    alkalinePhosphotase: '',
    alamineAminotransferase: '',
    aspartateAminotransferase: '',
    totalProteins: '',
    albumin: '',
    albuminGlobulinRatio: '',
    alcoholPattern: 'none',
    priorLiverDiagnosis: false,
    liverTestResult: 'notsure'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/predict/liver', formData);
      if (res.data.success) {
        navigate('/patient/screening/result', { state: { result: res.data.data, type: 'liver' } });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit screening. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/patient/screening')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-saffron-deep transition-colors">
          <ArrowLeft size={20} /> Back to Screening Portal
        </button>
        <div className="flex items-center gap-2 text-saffron-deep font-bold">
           <Database size={20} /> Liver Screening Module
        </div>
      </div>

      <div className="card shadow-xl border-white ring-1 ring-slate-200 p-8 lg:p-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Liver Health Assessment</h1>
          <p className="text-slate-600 max-w-xl mx-auto font-medium">Please enter your clinical parameters based on your most recent lab report for accurate screening.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-4">
            <AlertCircle className="shrink-0 mt-0.5" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Info Group */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Basic Demographics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">AGE (YEARS)</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 45" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">GENDER</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">ALCOHOL CONSUMPTION PATTERN</label>
                 <select name="alcoholPattern" value={formData.alcoholPattern} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none">
                    <option value="none">Never</option>
                    <option value="social">Occasional (Social)</option>
                    <option value="regular">Regular (2-3 times/week)</option>
                    <option value="heavy">Heavy (Daily)</option>
                 </select>
              </div>
            </div>

            {/* Bilirubin & Proteins Group */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Bilirubin & Proteins</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">TOTAL BILIRUBIN</label>
                  <input type="number" step="0.01" name="totalBilirubin" value={formData.totalBilirubin} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="mg/dL" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">DIRECT BILIRUBIN</label>
                  <input type="number" step="0.01" name="directBilirubin" value={formData.directBilirubin} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="mg/dL" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">TOTAL PROTEINS</label>
                   <input type="number" step="0.01" name="totalProteins" value={formData.totalProteins} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="g/dL" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">ALBUMIN</label>
                   <input type="number" step="0.01" name="albumin" value={formData.albumin} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="g/dL" />
                 </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Liver Enzymes Group */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Liver Enzymes (U/L)</h3>
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ALKALINE PHOSPHOTASE (ALP)</label>
                  <input type="number" name="alkalinePhosphotase" value={formData.alkalinePhosphotase} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 110" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">SGPT / ALT</label>
                  <input type="number" name="alamineAminotransferase" value={formData.alamineAminotransferase} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 35" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">SGOT / AST</label>
                  <input type="number" name="aspartateAminotransferase" value={formData.aspartateAminotransferase} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 40" />
                </div>
              </div>
            </div>

            {/* Other Metrics Group */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Ratios & History</h3>
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ALBUMIN / GLOBULIN RATIO</label>
                  <input type="number" step="0.01" name="albuminGlobulinRatio" value={formData.albuminGlobulinRatio} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 0.90" />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 italic">ANY PRIOR LIVER DIAGNOSIS?</label>
                  <div className="flex items-center gap-6 pt-2">
                     <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="radio" name="priorLiverDiagnosis" checked={formData.priorLiverDiagnosis === true} onChange={() => setFormData({...formData, priorLiverDiagnosis: true})} className="accent-saffron-deep w-4 h-4" /> Yes
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                        <input type="radio" name="priorLiverDiagnosis" checked={formData.priorLiverDiagnosis === false} onChange={() => setFormData({...formData, priorLiverDiagnosis: false})} className="accent-saffron-deep w-4 h-4" /> No
                     </label>
                  </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 md:max-w-md">
                <Info size={18} className="text-slate-400 mt-1 shrink-0" />
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Ensure all parameters are entered accurately as they significantly impact the clinical assessment result.</p>
             </div>
             <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-10 py-4 text-lg font-bold flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : 'Analyze Risk Indicators'}
                {!loading && <CheckCircle2 size={20} />}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiverScreening;
