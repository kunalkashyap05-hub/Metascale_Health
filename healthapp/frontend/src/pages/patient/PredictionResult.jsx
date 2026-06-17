import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2,
  Calendar,
  ClipboardList,
  Info,
  ChevronRight,
  Activity,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

const PredictionResult = () => {
  const location = useLocation();
  const { type: paramType, id } = useParams();
  const { result: passedResult } = location.state || {}; 
  const type = location.state?.type || paramType;
  
  const [activeResult, setActiveResult] = React.useState(passedResult);
  const [loadingContext, setLoadingContext] = React.useState(!passedResult?.features);

  React.useEffect(() => {
    const fetchFullContext = async () => {
       if (passedResult?.features) {
          setLoadingContext(false);
          return;
       }
       if (id && type) {
          try {
             const res = await api.get(`/predict/detail/${type}/${id}`);
             if (res.data.success) {
                const dbRec = res.data.data;
                const { 
                   id: _id, user_id, type: _t, prediction, confidence, risk_band, 
                   interpretation, recommendations, is_reviewed, doctor_comment, doctor_flag, created_at, updated_at,
                   ...rawFeatures 
                } = dbRec;
                
                setActiveResult(prev => ({
                   ...(prev || {}),
                   riskBand: prev?.riskBand || dbRec.risk_band,
                   interpretation: prev?.interpretation || dbRec.interpretation,
                   recommendations: prev?.recommendations || dbRec.recommendations,
                   features: rawFeatures
                }));
             }
          } catch (err) {
             console.error("Failed to fetch full clinical context", err);
          } finally {
             setLoadingContext(false);
          }
       } else {
          setLoadingContext(false);
       }
    };
    fetchFullContext();
  }, [id, type, passedResult]);

  if (loadingContext) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-pulse">
        <Loader2 className="animate-spin text-saffron" size={40} />
        <h2 className="text-2xl font-bold text-slate-900">Retrieving Clinical Telemetry...</h2>
      </div>
    );
  }

  if (!activeResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
           <ClipboardList size={40} />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold text-slate-900">No Result Found</h2>
           <p className="text-slate-500 max-w-sm">We couldn't find any screening result in this session. Please start a new screening.</p>
        </div>
        <Link to="/patient/screening" className="btn-primary flex items-center gap-2 px-8">
           <ArrowLeft size={18} /> Back to Screening Portal
        </Link>
      </div>
    );
  }

  const getRiskColor = (band) => {
    switch (band) {
      case 'Minimal': return 'bg-green-100 text-green-700 border-green-200';
      case 'Elevated': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Severe': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Service Offline': return 'bg-slate-100 text-slate-500 border-slate-200 opacity-80';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRiskIcon = (band) => {
    if (band === 'Minimal') return <CheckCircle2 className="text-green-600" size={32} />;
    if (band === 'Elevated') return <AlertTriangle className="text-yellow-600" size={32} />;
    if (band === 'Service Offline') return <Activity className="text-slate-400 animate-pulse" size={32} />;
    return <XCircle className="text-red-600" size={32} />;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateInsights = async () => {
    setLoadingAssessment(true);
    setAssessmentError('');
    try {
       const res = await api.post('/predict/explain', {
          type,
          data: result.features || {},
          result: {
             riskBand: result.riskBand,
             interpretation: result.interpretation
          }
       });
       setAssessmentInsights(res.data.data.explanation);
    } catch (err) {
      console.error('Assessment Error:', err);
      setAssessmentError('Failed to generate clinical assessment review. Please try again later.');
    } finally {
       setLoadingAssessment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Metascale Health - ${type.toUpperCase()} Screening Report`,
          text: `My ${type} screening result is ${result.riskBand}. View clinical details on the platform.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/patient/dashboard" className="text-slate-500 font-bold hover:text-primary-600 flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Return to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2 px-4 py-2 text-xs !bg-saffron !border-saffron-deep hover:!bg-saffron-deep shadow-md">
             <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200 print:shadow-none print:border-none">
         <div className="bg-slate-900 text-white p-8 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-saffron text-xs font-bold uppercase tracking-widest">
                     Screening Analysis Complete
                  </div>
                  <h1 className="text-4xl font-display font-bold">Metascale Health Report</h1>
                  <p className="text-slate-400 font-medium">Screening Type: <span className="text-white capitalize">{type} Disease Risk</span> • {new Date().toLocaleDateString()}</p>
               </div>
            </div>
         </div>

         <div className="p-8 lg:p-12 space-y-12 bg-white">
            {/* Risk Assessment */}
            <div className="grid md:grid-cols-5 gap-8 items-center">
               <div className="md:col-span-2 flex flex-col items-center text-center space-y-4 p-8 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                  <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                     {getRiskIcon(activeResult.riskBand)}
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">Risk Band</p>
                     <p className={`text-2xl font-bold py-1 px-4 rounded-full border ${getRiskColor(activeResult.riskBand)}`}>
                        {activeResult.riskBand} Risk
                     </p>
                  </div>
               </div>
               
               <div className="md:col-span-3 space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Interpretation</h2>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium text-lg">
                     "{activeResult.interpretation}"
                  </div>
               </div>
            </div>

            {/* Features/Parameters Display */}
            {activeResult.features && Object.keys(activeResult.features).length > 0 && (
               <div className="space-y-6 pt-6 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                     <Activity className="text-saffron" size={24} /> Clinical Parameters Submitted
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {Object.entries(activeResult.features).map(([key, value]) => (
                        <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                           <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest truncate" title={key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                           </p>
                           <p className="text-lg font-bold text-slate-900">{String(value)}</p>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Recommendations */}
            <div className="space-y-6">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="text-saffron" /> Recommendations & Next Steps
               </h3>
               <div className="grid md:grid-cols-2 gap-4">
                  {(activeResult.recommendations?.length > 0 ? activeResult.recommendations : [
                     "Schedule a formal consultation with a specialized clinician to review these preliminary insights.",
                     "Maintain a consistent biometric log (blood pressure, fasting glucose, weight) prior to your appointment.",
                     "Consider foundational nutritional guidance to stabilize metabolic volatility.",
                     "Ensure you perform at least 30 to 45 minutes of moderate aerobic activity to support cardiovascular parameters."
                  ]).map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                       <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                          {i + 1}
                       </div>
                       <p className="text-slate-700 font-medium leading-relaxed group-hover:text-slate-900">{rec}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-4 p-6 bg-saffron/5 rounded-2xl border border-saffron/20 text-slate-700">
               <Info className="shrink-0 mt-0.5 text-saffron-deep" size={20} />
               <p className="text-sm font-medium leading-relaxed italic">
                  <strong>Clinical Advisory:</strong> This risk profile is generated by a clinical diagnostic support tool. It is not a medical diagnosis. Please present this report to a qualified professional.
               </p>
            </div>
         </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-6 print:hidden">
         <div className="flex items-center gap-6">
            <Link 
              to="/patient/appointments" 
              state={{ prefill: { type, risk: activeResult.riskBand } }}
              className="flex items-center gap-2 text-saffron font-bold hover:underline"
            >
               Schedule Consultation <ChevronRight size={16} />
            </Link>
            <Link to="/patient/history" className="flex items-center gap-2 text-slate-600 font-bold hover:underline">
               View Full History <ChevronRight size={16} />
            </Link>
         </div>
         <Link to="/patient/dashboard" className="btn-primary px-8">
            Return to My Dashboard
         </Link>
      </div>
    </div>
  );
};

export default PredictionResult;
