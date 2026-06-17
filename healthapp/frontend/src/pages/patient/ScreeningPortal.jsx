import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  ArrowRight, 
  Info, 
  ShieldCheck,
  Zap,
  Database,
  ChevronRight
} from 'lucide-react';

const ScreeningPortal = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Metascale Health Portal</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          Select a specialized diagnostic module to initiate a clinical risk assessment powered by metascale health logic.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Liver Risk Card */}
        <div className="group relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-saffron to-saffron-deep rounded-[32px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
           <div className="relative card p-10 bg-white h-full flex flex-col justify-between border-slate-100 shadow-2xl shadow-slate-200 group-hover:shadow-saffron/20 transition-all duration-500 rounded-[28px]">
              <div>
                <div className="w-16 h-16 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500"><Activity size={32} /></div>
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Liver Diagnostic</h3>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">Systematic analysis of clinical markers to predict metabolic dysfunction-associated steatotic liver disease risk.</p>
                
                <div className="space-y-4 mb-10">
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-6 h-6 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"><ArrowRight size={14} /></div> Comprehensive Biomarker Audit
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-6 h-6 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"><ArrowRight size={14} /></div> Validated Assessment Logic
                   </div>
                </div>
              </div>
              
              <Link to="/patient/screening/liver" className="btn-primary flex items-center justify-center gap-2 py-4 text-lg">
                Initiate Screening <ChevronRight size={20} />
              </Link>
           </div>
        </div>

        {/* Diabetes Risk Card */}
        <div className="group relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-saffron-deep to-ink rounded-[32px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
           <div className="relative card p-10 bg-white h-full flex flex-col justify-between border-slate-100 shadow-2xl shadow-slate-200 group-hover:shadow-slate-900/10 transition-all duration-500 rounded-[28px]">
              <div>
                <div className="w-16 h-16 bg-saffron-light/20 text-saffron-deep rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500"><Database size={32} /></div>
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Diabetes Screening</h3>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">Integrated risk evaluation for Type 2 Diabetes utilizing systemic health variables and clinical history profile.</p>
                
                <div className="space-y-4 mb-10">
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-6 h-6 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"><ArrowRight size={14} /></div> Personalized Risk Stratification
                   </div>
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-6 h-6 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"><ArrowRight size={14} /></div> Instant Diagnostic Response
                   </div>
                </div>
              </div>
              
              <Link to="/patient/screening/diabetes" className="btn-primary flex items-center justify-center gap-2 py-4 text-lg">
                Initiate Screening <ChevronRight size={20} />
              </Link>
           </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-white/50 backdrop-blur-xl border border-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-100">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm"><ShieldCheck size={24} /></div>
            <div>
               <p className="font-bold text-slate-900">Clinical Data Isolation</p>
               <p className="text-sm text-slate-500 font-medium">Your medical parameters are processed under strict privacy protocols.</p>
            </div>
         </div>
         <div className="flex items-center gap-4 text-slate-400">
            <Info size={18} />
            <span className="text-xs font-bold uppercase tracking-widest leading-none">Diagnostic support tool only</span>
         </div>
      </div>
    </div>
  );
};

export default ScreeningPortal;
