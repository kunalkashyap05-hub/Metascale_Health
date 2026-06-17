/* eslint-disable */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  Stethoscope,
  Info,
  HeartPulse,
  Radar
} from 'lucide-react';
import { useMotionValue, useTransform, useSpring, motion } from 'framer-motion';

import { useRipple } from '../hooks/useRipple';
import { useParallaxDirective } from '../hooks/useParallaxDirective';


const LandingPage = () => {
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  /* Auth & state intentionally omitted for Landing Page production stability */
  
  // Angular Directive (3D Parallax Logic)
  useParallaxDirective(heroRef, 30);
  
  // Angular Material Ripple Effect
  const ripples = useRipple(ctaRef);

  // Mouse Tracking for 3D Orb & Grid
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  
  const gridRotateX = useTransform(springY, [-300, 300], [60, 50]);
  const gridTranslateZ = useTransform(springY, [-300, 300], [0, 50]);
  
  // satisfying lint for springX
  const _forceX = springX;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden bg-transparent"
    >
      {/* 3D Grid Floor Background */}
      <div className="absolute inset-0 pointer-events-none z-0 perspective-[1000px]">
        <motion.div 
          style={{ 
            rotateX: gridRotateX,
            translateZ: gridTranslateZ,
            backgroundImage: `linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
          className="absolute inset-0 origin-center w-[200%] h-[200%] -left-1/2 -top-1/2"
        ></motion.div>
      </div>
      {/* Navbar - Matching Prototype */}
      <header className="fixed top-0 w-full z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
             <div>
                <div className="font-bold text-[13px] uppercase tracking-[0.1em] text-slate-900 leading-none mb-1 font-mono">Metascale Health</div>
                <div className="text-[10px] text-saffron-deep/80 font-bold uppercase tracking-tight">Liver & Diabetes Screener</div>
             </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8 text-[13px] font-bold text-slate-600 uppercase tracking-widest">
              <a href="#features" className="hover:text-saffron-deep transition-colors">Features</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered Layout */}
      <section className="pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="inline-flex items-center gap-2 bg-saffron-light/20 text-saffron-deep px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-saffron-light/30 shadow-sm"
           >
              <HeartPulse size={14} className="animate-pulse" /> Health Awareness Initiative
           </motion.div>
           
           <motion.div 
             ref={heroRef}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="text-5xl lg:text-[6rem] font-display font-bold text-slate-900 leading-[0.95] mb-12 tracking-[-0.04em] [text-shadow:_0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-100 ease-out"
           >
              Health insight for India, <br />
              <span className="text-saffron-deep relative inline-block drop-shadow-[0_5px_15px_rgba(247,147,30,0.3)]">
                before
                <motion.span 
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-2 bg-saffron-light/40 blur-2xl rounded-full -z-10"
                ></motion.span>
              </span> disease.
           </motion.div>
           
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="text-xl text-slate-600 font-medium leading-relaxed mb-16 max-w-2xl mx-auto"
           >
              A free, private risk screen for liver and diabetes — built for everyday Indians to understand their health markers.
           </motion.p>
           
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 100 }}
             className="flex flex-col items-center justify-center gap-6 relative z-10"
           >
              <div className="relative inline-block group">
                <Link 
                  ref={ctaRef}
                  to="/register" 
                  state={{ role: "patient" }} 
                  className="btn-primary min-w-[280px] text-lg py-5 shadow-[0_20px_50px_rgba(247,147,30,0.3)] hover:shadow-[0_20px_60px_rgba(247,147,30,0.5)] transition-all transform hover:-translate-y-1 overflow-hidden relative"
                >
                   {ripples}
                   Start free screening <ArrowRight className="ml-2" size={24} />
                </Link>
                
              </div>
            </motion.div>

        </div>

        {/* 3D Decorative Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-24 h-24 bg-gradient-to-br from-saffron/20 to-transparent rounded-full blur-2xl opacity-60 -z-10"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl opacity-40 -z-10"
        ></motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Clinical Guidance. Built for Humans.</h2>
             <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Early detection is the key to longevity. Metascale combines health assessments with lifestyle data to keep you ahead.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Liver Risk Assessment', 
                desc: 'Analyzes Bilirubin, proteins, and liver enzymes for signs of fatty liver or cirrhosis markers.', 
                icon: Database,
                accent: 'bg-saffron'
              },
              { 
                title: 'Diabetes Risk Assessment', 
                desc: 'Estimates diabetes risk using dietary patterns, genetic history, and metabolic indicators.', 
                icon: Stethoscope,
                accent: 'bg-green-600'
              },
              { 
                title: 'Clinical Interface', 
                desc: 'Doctors can review screenings in real-time, providing medical notes and follow-up guidance.', 
                icon: ShieldCheck,
                accent: 'bg-slate-900'
              }
            ].map((feature, i) => (
              <PerspectiveCard 
                key={i} 
                feature={feature}
              />
            ))}
          </div>
        </div>
      </section>
      

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-12">
            <div className="col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-saffron shadow-lg shadow-saffron/20"></div>
                  <span className="font-display font-bold text-2xl tracking-tight">Metascale Health</span>
               </div>
               <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-8">
                  Empowering 1.4 billion people with personalized health risk awareness. Built with precision and a focus on Indian healthcare data.
               </p>
            </div>
            <div>
               <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 mb-6">Resources</h4>
               <ul className="space-y-4 text-slate-400 font-medium text-sm">
                  <li><a href="#" className="hover:text-saffron transition-colors">Clinical FAQ</a></li>
                  <li><a href="#" className="hover:text-saffron transition-colors">Privacy Charter</a></li>
                  <li><a href="#" className="hover:text-saffron transition-colors">Institutional Access</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 mb-6">Portal Access</h4>
               <ul className="space-y-4 text-slate-400 font-medium text-sm">
                  <li><Link to="/login" state={{ role: 'doctor' }} className="hover:text-saffron transition-colors">Doctor Login</Link></li>
                  <li><Link to="/login" state={{ role: 'admin' }} className="hover:text-saffron transition-colors">Admin Dashboard</Link></li>
                  <li><Link to="/register" state={{ role: 'patient' }} className="hover:text-saffron transition-colors">Patient Screening</Link></li>
               </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-xs text-slate-500 font-medium">© 2026 Metascale Health. All risk analyses are awareness-focused and not medical diagnoses.</p>
             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-saffron-deep bg-saffron-light/5 px-4 py-2 rounded-full border border-saffron-light/10">
                <Info size={14} /> Knowledge Hub for Health Risk
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PerspectiveCard = ({ feature }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div 
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="card hover:shadow-3xl transition-all duration-500 group border-white/40 backdrop-blur-sm bg-white/60 text-left relative overflow-hidden"
    >
       <div className={`w-14 h-14 ${feature.accent} text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]`}>
          <feature.icon size={28} />
       </div>
       <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
       <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
};

export default LandingPage;
