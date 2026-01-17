import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiArrowLeft, FiClock, FiShare2, FiZap, FiExternalLink, FiBookOpen, FiHash } from "react-icons/fi";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchAndTrack = async () => {
      try {
        // 1. Fetch Article Data
        const res = await API.get(`/api/articles/${id}`, { withCredentials: true });
        setArticle(res.data);

        // 2. 🔥 Interest Tracking & Mark as Read
        // Jaise hi user page par aayega, backend ko signal jayega
        await API.patch(`/api/articles/${id}/read`, {}, { withCredentials: true });
        console.log("Intelligence tracked: User interest updated.");

      } catch (err) {
        console.error("Failed to fetch or track article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndTrack();
  }, [id]);

  if (loading) return <div className="h-screen bg-[#0D1117] flex items-center justify-center">...</div>;

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-200">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[60]" style={{ scaleX }} />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              {article?.sourceName || "Intelligence Report"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-white mb-6">
            {article?.title}
          </h1>

          {/* ✨ KEYWORDS TAGS SECTION */}
          {article?.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.keywords.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400/70 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
                >
                  <FiHash size={10} /> {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* AI Synthesis Box */}
        <motion.section className="relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-[#C89B3C] rounded-[2rem] blur opacity-20 transition duration-1000"></div>
          <div className="relative bg-[#161B22] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 text-emerald-400">
              <FiZap className="fill-emerald-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">AI Synthesis</span>
            </div>
            <p className="text-lg md:text-xl leading-relaxed text-slate-200 font-medium">
              {article?.summary || "Analyzing intelligence..."}
            </p>
          </div>
        </motion.section>

        {/* Full Content */}
        <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed">
          {article?.content}
        </div>
      </main>
    </div>
  );
}