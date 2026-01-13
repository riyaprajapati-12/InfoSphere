import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRss, FiX, FiLink, FiLoader } from "react-icons/fi";

const AddFeedModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [feedUrl, setFeedUrl] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedUrl);
    setFeedUrl("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* ─── OVERLAY ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#000]/60 backdrop-blur-md"
          />

          {/* ─── MODAL ─── */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden bg-[#161B22]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            {/* Top Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <FiRss />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                      Add Source
                    </h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                      Neural Feed Sync
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Body */}
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Connect a new RSS or Atom feed. Our AI will automatically index the content for your personalized sphere.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type="url"
                    placeholder="https://news.ycombinator.com/rss"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[1.5] relative group overflow-hidden px-6 py-4 rounded-2xl font-black text-black bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Indexing...
                        </>
                      ) : (
                        "Sync Feed"
                      )}
                    </span>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </form>
            </div>
            
            {/* Bottom Tip */}
            <div className="bg-black/20 p-4 text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Pro Tip: Most blogs have an /rss or /feed endpoint
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddFeedModal;