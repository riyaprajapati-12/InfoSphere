import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiClock, FiArrowRight, FiInbox, FiCircle } from "react-icons/fi";

const TABS = [
  { key: "latest", label: "Latest" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

const RecentArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [tab, setTab] = useState("latest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async (reset = false) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (tab === "read") params.isRead = true;
      if (tab === "unread") params.isRead = false;

      const res = await API.get("/api/articles", { params, withCredentials: true });
      const newArticles = res.data.articles || [];

      setArticles((prev) => (reset ? newArticles : [...prev, ...newArticles]));
      setHasMore(page < res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    fetchArticles(true);
  }, [tab]);

  useEffect(() => {
    if (page > 1) fetchArticles();
  }, [page]);

  return (
    <div className="bg-[#161B22]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
      
      {/* ─── HEADER & TABS ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <FiBookOpen className="text-emerald-400" /> Neural Feed
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Curated Intelligence</p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                tab === t.key ? "text-black" : "text-slate-500 hover:text-white"
              }`}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-400 rounded-xl z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── ARTICLES LIST ─── */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {articles.length === 0 && !loading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-slate-600"
            >
              <FiInbox size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">No Intel Found</p>
            </motion.div>
          ) : (
            articles.map((article, idx) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => navigate(`/article/${article._id}`)}
                className="group relative flex justify-between items-center bg-black/20 border border-white/5 p-6 rounded-[2rem] cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-emerald-500"
              >
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {article.sourceName || "Global Source"}
                    </span>
                    {!article.isRead && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-500">
                        <FiCircle size={8} className="fill-amber-500" /> New
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 tracking-tight">
                    {article.title}
                  </h3>

                  <p className="text-slate-400 text-sm mt-2 line-clamp-2 font-medium leading-relaxed opacity-70">
                    {article.description || "No summary available for this intelligence report."}
                  </p>

                  <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><FiClock /> 5 min read</span>
                    <span>• {new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:border-emerald-500/50 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <FiArrowRight size={20} />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* ─── PAGINATION / LOADING ─── */}
        <div className="pt-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : hasMore && articles.length > 0 ? (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full py-4 rounded-2xl border border-white/5 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 hover:text-white transition-all"
            >
              Load More Intelligence
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RecentArticles;