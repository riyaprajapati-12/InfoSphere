import { useState } from "react";
import AddFeedModal from "./AddFeedModal";
import API from "../api/axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSend, FiSettings, FiGrid, FiTrendingUp, FiHash } from "react-icons/fi";

const Sidebar = () => {
  const [openFeedModal, setOpenFeedModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddFeed = async (feedUrl) => {
    try {
      setLoading(true);
      const res = await API.post(
        "/api/feeds",
        { feedUrl },
        { withCredentials: true }
      );
      setOpenFeedModal(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add feed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <aside className="fixed left-4 top-24 bottom-4 w-64 z-40">
        <div className="h-full bg-[#161B22]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* ─── NAVIGATION ─── */}
          <div className="p-6">
            <div className="space-y-2 mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-2">
                Discovery
              </p>
              {[
                { name: "My Feed", icon: <FiGrid />, active: true },
                { name: "Trending", icon: <FiTrendingUp />, active: false },
                { name: "Topics", icon: <FiHash />, active: false },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                    item.active 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-2">
                Actions
              </p>
              
              {/* Telegram Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/connect-telegram")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-all font-bold text-sm"
              >
                <FiSend className="text-lg" />
                <span>Sync Telegram</span>
              </motion.button>

              {/* Add Feed Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenFeedModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500 text-black font-black text-sm transition-all"
              >
                <div className="bg-black/10 rounded-lg p-1">
                  <FiPlus className="text-lg text-black" />
                </div>
                <span>New Feed</span>
              </motion.button>
            </div>
          </div>

          {/* ─── BOTTOM SETTINGS ─── */}
          <div className="p-6 bg-black/20 border-t border-white/5">
            // Sidebar.jsx mein line 85 ke aas-paas
<motion.button
  whileHover={{ x: 5 }}
  onClick={() => navigate("/settings")} // Navigate to the new settings page
  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white transition-all font-bold text-sm"
>
  <FiSettings className="text-lg" />
  Settings
</motion.button>
            
            <div className="mt-4 px-4 py-3 rounded-2xl bg-gradient-to-br from-[#4F6F64]/20 to-transparent border border-emerald-500/10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">Storage</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-emerald-500" />
              </div>
              <p className="text-[9px] text-slate-500 mt-2 font-bold">7.2 GB / 10 GB</p>
            </div>
          </div>
        </div>
      </aside>

      <AddFeedModal
        isOpen={openFeedModal}
        onClose={() => setOpenFeedModal(false)}
        onSubmit={handleAddFeed}
        loading={loading}
      />
    </>
  );
};

export default Sidebar;