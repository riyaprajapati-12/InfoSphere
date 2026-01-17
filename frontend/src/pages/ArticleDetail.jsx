import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiArrowLeft, FiClock, FiShare2, FiZap, FiExternalLink, FiHash, FiLoader } from "react-icons/fi";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Article Fetch Karein
        const res = await API.get(`/api/articles/${id}`);
        setArticle(res.data);

        // 2. 🔥 Interest Tracking & Mark as Read
        // Backend controller khud keywords track karega jab ye hit hoga
        await API.patch(`/api/articles/${id}/read`);
        
      } catch (err) {
        // 'ot' error se bachne ke liye detailed logging
        console.error("Failed to fetch or track article:", err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-4">
      <FiLoader className="text-4xl text-emerald-500 animate-spin" />
      <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Decrypting Intelligence...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-200">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[60]" style={{ scaleX }} />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors mb-10 font-bold text-xs uppercase tracking-widest"
        >
          <FiArrowLeft /> Back to Neural Feed
        </button>

        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-white mb-6">
            {article?.title}
          </h1>

          {/* ✨ KEYWORDS AS TAGS */}
          {article?.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.keywords.map((tag, index) => (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                >
                  <FiHash size={10} /> {tag}
                </motion.span>
              ))}
            </div>
          )}
        </header>

        {/* AI SUMMARY BOX */}
        <section className="relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
          <div className="relative bg-[#161B22] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 text-emerald-400">
              <FiZap className="fill-emerald-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Neural Summary</span>
            </div>
            <p className="text-lg md:text-xl leading-relaxed text-slate-300 font-medium">
              {article?.summary || "Summary is being processed by the AI engine..."}
            </p>
          </div>
        </section>

        {/* ORIGINAL CONTENT */}
        <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-lg">
          {article?.content}
        </div>
      </main>
    </div>
  );
}