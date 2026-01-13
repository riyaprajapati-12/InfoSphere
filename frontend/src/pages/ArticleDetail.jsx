import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiArrowLeft, FiClock, FiShare2, FiZap, FiExternalLink, FiBookOpen } from "react-icons/fi";


export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll Progress Bar Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/api/articles/${id}`, { withCredentials: true });
        setArticle(res.data);
      } catch (err) {
        console.error("Failed to fetch article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-200">
    

      {/* ─── READING PROGRESS BAR ─── */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[60]" style={{ scaleX }} />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* ─── BACK & ACTIONS ─── */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
          </button>
          
          <div className="flex gap-4">
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-400">
              <FiShare2 />
            </button>
            <a 
              href={article?.link} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-sm transition-all hover:scale-105"
            >
              Original <FiExternalLink />
            </a>
          </div>
        </div>

        {/* ─── ARTICLE HEADER ─── */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              {article?.sourceName || "Intelligence Report"}
            </span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <FiClock /> 6 Min Read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-white mb-6">
            {article?.title}
          </h1>
          
          <p className="text-xl text-slate-400 font-medium leading-relaxed italic border-l-2 border-emerald-500/30 pl-6">
            {article?.description}
          </p>
        </header>

        {/* ─── AI SUMMARY BOX (The USP) ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group mb-16"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-[#C89B3C] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#161B22] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 text-emerald-400">
              <FiZap className="fill-emerald-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">AI Synthesis</span>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg md:text-xl leading-relaxed text-slate-200 font-medium">
                {article?.content || article?.aiSummary || "The neural engine is synthesizing the insights for this report..."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confidence Score: 98.4%</p>
              <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500" />)}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── MAIN CONTENT ─── */}
        <article className="prose prose-invert prose-emerald max-w-none text-slate-300">
           {/* Yahan par baki ka content render hoga agar backend se aa raha hai */}
           <div className="flex flex-col items-center justify-center py-20 border-t border-white/5">
              <FiBookOpen size={40} className="text-slate-800 mb-4" />
              <p className="text-slate-600 font-bold uppercase tracking-[0.4em] text-[10px]">End of Intelligence Report</p>
           </div>
        </article>

      </main>

      {/* ─── DYNAMIC BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#4F6F64]/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-[#C89B3C]/5 blur-[100px]" />
      </div>
    </div>
  );
}