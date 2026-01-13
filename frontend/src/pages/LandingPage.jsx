import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiRss, FiZap, FiHeart, FiSearch, FiChevronDown } from "react-icons/fi";
import { useRef, useState, useEffect } from "react";

// ─── UNIQUE GEOMETRIC SPHERE LOGO ───
const UniqueLogo = () => (
  <div className="relative flex items-center justify-center mb-8">
    {/* Outer Glow Effect */}
    <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full scale-75" />
    
    <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <defs>
        <linearGradient id="sphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F6F64" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#C89B3C" />
        </linearGradient>
      </defs>

      {/* Orbital Rings */}
      <motion.ellipse 
        cx="50" cy="50" rx="45" ry="15" 
        stroke="rgba(52, 211, 153, 0.3)" strokeWidth="0.5" 
        style={{ rotate: '45deg', transformOrigin: 'center' }}
        animate={{ rotate: 405 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.ellipse 
        cx="50" cy="50" rx="45" ry="15" 
        stroke="rgba(200, 155, 60, 0.3)" strokeWidth="0.5" 
        style={{ rotate: '-45deg', transformOrigin: 'center' }}
        animate={{ rotate: -405 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Shattered Geometric Pieces (The Sphere) */}
      <g className="opacity-90">
        <path d="M50 10 L70 30 L50 50 L30 30 Z" fill="url(#sphereGrad)" />
        <path d="M75 35 L90 50 L75 65 L60 50 Z" fill="url(#sphereGrad)" fillOpacity="0.8" />
        <path d="M50 90 L30 70 L50 50 L70 70 Z" fill="url(#sphereGrad)" fillOpacity="0.6" />
        <path d="M25 35 L10 50 L25 65 L40 50 Z" fill="url(#sphereGrad)" fillOpacity="0.7" />
        
        {/* Central Core */}
        <circle cx="50" cy="50" r="8" fill="#white" className="animate-pulse" />
        <circle cx="50" cy="50" r="12" stroke="#C89B3C" strokeWidth="1" strokeDasharray="2 2" />
      </g>
    </svg>
  </div>
);

function FeatureCard({ icon, title, children, className }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      viewport={{ once: true }}
      className={`relative group overflow-hidden p-8 rounded-[2.5rem] border border-white/10 bg-[#161B22]/60 backdrop-blur-2xl shadow-2xl ${className}`}
    >
      <div className="absolute -right-6 -top-6 text-9xl text-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F6F64] to-[#2D433C] flex items-center justify-center text-emerald-400 text-2xl mb-8 border border-emerald-500/20 shadow-[0_0_20px_rgba(79,111,100,0.3)]">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed font-medium">
          {children}
        </p>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowArrow(window.scrollY < 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#0D1117] text-slate-200 selection:bg-emerald-500/30 font-sans">
      
      {/* ─── LUXURY BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#4F6F64]/20 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C89B3C]/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.15] bg-[size:40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
        
        {/* NEW UNIQUE LOGO */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
        >
          <UniqueLogo />
        </motion.div>

        

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.85] mb-10"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-slate-500">
            Info
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-tr from-[#4F6F64] via-emerald-400 to-[#C89B3C]">
            Sphere
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-2xl text-xl md:text-2xl text-slate-400 font-light leading-relaxed mb-12"
        >
          The future of knowledge management is here. <br />
          <span className="text-emerald-400/80 font-medium italic">Intelligent. Secure. Limitless.</span>
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <button
            onClick={() => navigate("/signup")}
            className="group relative px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl"
          >
            Get Started Free
            <div className="absolute inset-0 rounded-2xl bg-emerald-500 blur-xl opacity-0 group-hover:opacity-25 transition-opacity" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
          >
            Member Login
          </button>
        </motion.div>

        <AnimatePresence>
          {showArrow && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute bottom-10 text-emerald-500/50"
            >
              <FiChevronDown className="text-4xl animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── BENTO GRID FEATURES ─── */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
          <div className="md:col-span-8">
            <FeatureCard 
              icon={<FiZap />} 
              title="Neural Summaries" 
              className="h-full border-emerald-500/20"
            >
              AI processing that understands context and intent to deliver sharp, 
              actionable summaries from any data source instantly.
            </FeatureCard>
          </div>
          <div className="md:col-span-4">
            <FeatureCard icon={<FiRss />} title="Live Pulse" className="h-full">
              Stay ahead with real-time data streams that sync directly with your 
              personal knowledge vault.
            </FeatureCard>
          </div>
          <div className="md:col-span-4">
            <FeatureCard icon={<FiHeart />} title="Safe Vault" className="h-full">
              Military-grade encryption for your most sensitive thoughts and documents.
            </FeatureCard>
          </div>
          <div className="md:col-span-8">
            <FeatureCard 
              icon={<FiSearch />} 
              title="Semantic Discovery"
              className="h-full border-emerald-500/10"
            >
              Beyond keywords. Our vector search engine finds connections across 
              concepts, even when terminology differs.
            </FeatureCard>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-20 text-center">
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mx-auto mb-10" />
        <p className="text-slate-500 text-xs font-bold tracking-[0.4em] uppercase">
          INFOSPHERE SYSTEM • EST 2026
        </p>
      </footer>
    </div>
  );
}