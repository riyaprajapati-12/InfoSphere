import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiRss, FiActivity, FiGlobe, FiLoader } from "react-icons/fi";

const ManageFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    try {
      const res = await API.get("/api/feeds", { withCredentials: true });
      setFeeds(res.data);
    } catch (err) {
      console.error("Fetch feeds failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const deleteFeed = async (id) => {
    if (!window.confirm("Are you sure you want to disconnect this source?")) return;
    try {
      await API.delete(`/api/feeds/${id}`, { withCredentials: true });
      setFeeds((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      alert("Failed to delete feed");
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#161B22]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl h-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FiActivity className="text-emerald-400" /> Manage Sources
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            {feeds.length} Active Connections
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
           <FiGlobe className="animate-pulse" />
        </div>
      </div>

      {/* Feed List Container */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
            <FiLoader className="text-4xl animate-spin text-emerald-500" />
            <p className="font-bold tracking-widest text-xs uppercase">Syncing Database...</p>
          </div>
        ) : (
          <AnimatePresence>
            {feeds.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl"
              >
                <FiRss className="mx-auto text-4xl text-slate-700 mb-4" />
                <p className="text-slate-500 font-medium">No external sources linked yet.</p>
              </motion.div>
            ) : (
              feeds.map((feed, idx) => (
                <motion.div
                  key={feed._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex justify-between items-center bg-black/20 border border-white/5 hover:border-emerald-500/30 px-5 py-4 rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <FiRss />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-white tracking-tight truncate">
                        {feed.name || "Untitled Source"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px] mt-1 italic">
                        {feed.feedUrl}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteFeed(feed._id)}
                    className="p-3 rounded-xl bg-red-500/5 text-red-500/70 hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                    title="Disconnect Feed"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#161B22] to-transparent pointer-events-none" />
    </div>
  );
};

export default ManageFeeds;