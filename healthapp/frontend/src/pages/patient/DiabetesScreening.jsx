import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const DiabetesScreening = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    familyDiabetes: false,
    highBP: false,
    physicallyActive: 'none',
    bmi: '',
    smoking: false,
    alcohol: false,
    sleepHours: '',
    soundSleep: '',
    regularMedicine: false,
    junkFood: 'rarely',
    stress: 'none',
    bpLevel: 'normal',
    pregnancies: 0,
    prediabetes: false,
    urinationFreq: 'notMuch'
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
      const res = await api.post('/predict/diabetes', formData);
      if (res.data.success) {
        navigate('/patient/screening/result', { state: { result: res.data.data, type: 'diabetes' } });
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
           <Stethoscope size={20} /> Diabetes Risk Module
        </div>
      </div>

      <div className="card shadow-xl border-white ring-1 ring-slate-200 p-8 lg:p-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Diabetes Risk Evaluation</h1>
          <p className="text-slate-600 max-w-xl mx-auto font-medium">Complete this detailed lifestyle and clinical history form to evaluate your diabetes risk profile.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-4">
            <AlertCircle className="shrink-0 mt-0.5" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Demographics & Physiological */}
          <div className="space-y-8">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-saffron" /> Demographics & Physiological
             </h3>
             <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 uppercase">Age Group</label>
                   <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none">
                      <option value="">Select</option>
                      <option value="below 40">Below 40</option>
                      <option value="40-49">40-49</option>
                      <option value="50-59">50-59</option>
                      <option value="60 or above">60 or above</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 uppercase">Gender</label>
                   <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 uppercase">BMI</label>
                   <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 24.5" />
                </div>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8 bg-slate-50 rounded-2xl p-6">
                <div className="space-y-4">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="familyDiabetes" checked={formData.familyDiabetes} onChange={handleChange} className="w-5 h-5 rounded-md accent-saffron-deep border-slate-300" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-saffron-deep transition-colors">Family History of Diabetes</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="highBP" checked={formData.highBP} onChange={handleChange} className="w-5 h-5 rounded-md accent-saffron-deep border-slate-300" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-saffron-deep transition-colors">History of High Blood Pressure</span>
                   </label>
                </div>
                <div className="space-y-4">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="prediabetes" checked={formData.prediabetes} onChange={handleChange} className="w-5 h-5 rounded-md accent-saffron-deep border-slate-300" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-saffron-deep transition-colors">Previous Prediabetes Diagnosis</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="regularMedicine" checked={formData.regularMedicine} onChange={handleChange} className="w-5 h-5 rounded-md accent-saffron-deep border-slate-300" />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-saffron-deep transition-colors">Taking Regular Medication</span>
                   </label>
                </div>
             </div>
          </div>

          {/* Section 2: Lifestyle & Habits */}
          <div className="space-y-8">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-saffron" /> Lifestyle & Habituation
             </h3>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Physical Activity</label>
                      <select name="physicallyActive" value={formData.physicallyActive} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none font-medium">
                         <option value="none">None / Sedentary</option>
                         <option value="lt30">Less than 30 mins/day</option>
                         <option value="30-60">30-60 mins/day</option>
                         <option value="gt60">More than 1 hour/day</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Sleep Duration (Hours)</label>
                      <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 7" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Sound Sleep Duration</label>
                      <input type="number" name="soundSleep" value={formData.soundSleep} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="e.g. 5" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Junk Food Frequency</label>
                      <select name="junkFood" value={formData.junkFood} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none font-medium">
                         <option value="rarely">Rarely</option>
                         <option value="occasionally">Occasionally (1-2 times/week)</option>
                         <option value="often">Often (3-4 times/week)</option>
                         <option value="veryOften">Daily / Very Often</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Stress Levels</label>
                      <select name="stress" value={formData.stress} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none font-medium">
                         <option value="none">Minimal Stress</option>
                         <option value="sometimes">Sometimes Stressed</option>
                         <option value="veryOften">Frequently Stressed</option>
                         <option value="always">Always Stressed</option>
                      </select>
                   </div>
                   <div className="flex gap-8 pt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" name="smoking" checked={formData.smoking} onChange={handleChange} className="w-5 h-5 rounded-md accent-saffron-deep-600" />
                         <span className="text-sm font-bold text-slate-700">Smoker</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                         <input type="checkbox" name="alcohol" checked={formData.alcohol} onChange={handleChange} className="w-5 h-5 rounded-md accent-saffron-deep-600" />
                         <span className="text-sm font-bold text-slate-700">Consumer Alcohol</span>
                      </label>
                   </div>
                </div>
             </div>
          </div>

          {/* Section 3: Metabolic Indicators */}
          <div className="space-y-8">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-saffron" /> Metabolic & Critical Indicators
             </h3>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Blood Pressure Level</label>
                      <select name="bpLevel" value={formData.bpLevel} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none font-medium">
                         <option value="low">Low BP</option>
                         <option value="normal">Normal BP</option>
                         <option value="high">High BP</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Urination Frequency</label>
                      <select name="urinationFreq" value={formData.urinationFreq} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none font-medium">
                         <option value="notMuch">Normal Frequency</option>
                         <option value="quiteOften">High Frequency (Nocturia)</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Pregnancies (If Applicable)</label>
                   <input type="number" name="pregnancies" value={formData.pregnancies} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-saffron/20 focus:border-saffron-deep outline-none" placeholder="0" />
                   <p className="text-xs text-slate-400 font-medium">Leave 0 if not applicable.</p>
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 md:max-w-md">
                <Info size={18} className="text-slate-400 mt-1 shrink-0" />
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Early detection of diabetes can prevent long-term complications. Please ensure honest reporting of lifestyle factors.</p>
             </div>
             <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-10 py-4 text-lg font-bold flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : 'Calculate Diabetes Risk'}
                {!loading && <CheckCircle2 size={20} />}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiabetesScreening;
