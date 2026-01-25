import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { FiBell, FiInfo, FiTrash2, FiShield, FiArrowLeft, FiZap, FiActivity, FiGlobe } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [pref, setPref] = useState("instant");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const navigate = useNavigate();

  useEffect(() => {
  API.get("/api/users/me").then((res) => {
    setPref(res.data.notificationPreference || "instant");
    setIsConnected(res.data.telegramConnected);
    setLanguage(res.data.preferredLanguage || "English"); // Language load
  });
}, []);

  const handleUpdatePreference = async (newPref) => {
    setPref(newPref);
    try {
      await API.post("/api/users/settings", { notificationPreference: newPref });
    } catch (err) {
      console.error("Settings update failed");
    }
  };

  const disconnectTelegram = async () => {
    if (window.confirm("Are you sure you want to disconnect Telegram sync?")) {
      setLoading(true);
      try {
        await API.post("/api/users/settings", { telegramConnected: false });
        setIsConnected(false);
      } catch (err) {
        alert("Failed to disconnect");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLanguageChange = async (newLang) => {
  setLanguage(newLang);
  try {
    await API.post("/api/users/settings", { preferredLanguage: newLang }); // Backend update
  } catch (err) {
    console.error("Language update failed");
  }
};

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-12">
           <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all font-black text-[10px] uppercase tracking-[0.3em] mb-6"
          >
            <FiArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-5xl font-black tracking-tighter text-white">Neural Settings</h1>
        </header>

        <div className="space-y-10">
        <section className="bg-[#161B22]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem]">
  <div className="flex items-center gap-3 mb-8">
    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
      <FiGlobe size={24} />
    </div>
    <h3 className="text-xl font-bold text-white">Neural Language</h3>
  </div>
  <select 
    value={language}
    onChange={(e) => handleLanguageChange(e.target.value)}
    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-slate-300 focus:outline-none focus:border-emerald-500/40"
  >
    <option value="English">English</option>
    <option value="Hindi">Hindi (हिन्दी)</option>
    <option value="Spanish">Spanish</option>
    <option value="French">French</option>
  </select>
</section>
          
          {/* 1. Notification Frequency */}
          <section className="bg-[#161B22]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FiBell size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Notification Frequency</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Neural Alert Protocol</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['instant', 'daily', 'none'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleUpdatePreference(type)}
                  className={`py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-[0.2em] ${
                    pref === type 
                    ? "bg-emerald-500 text-black border-emerald-500" 
                    : "bg-black/20 border-white/5 text-slate-500 hover:border-white/20"
                  }`}
                >
                  {type} Alert
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-500 italic">
              * Instant alerts deliver articles as soon as they are indexed.
            </p>
          </section>

          {/* 2. Telegram Commands Help */}
          <section className="bg-[#161B22]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <FiInfo size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Bot Command Reference</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { cmd: "/summary [url]", desc: "Neural synthesis of the article" },
                { cmd: "/latest", desc: "Retrieve top 5 unread intelligence reports" },
                { cmd: "/connect [token]", desc: "Initialize account synchronization" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-white/5">
                  <code className="text-sky-400 font-mono font-bold tracking-tight">{item.cmd}</code>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Disconnect Section */}
          {isConnected && (
            <motion.section 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-red-500/5 border border-red-500/10 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiShield className="text-red-500" /> Danger Zone
                </h3>
                <p className="text-slate-500 text-sm mt-2">Permanently terminate the link with @InfoSphereMajorBot.</p>
              </div>
              <button 
                onClick={disconnectTelegram}
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-red-500 text-black font-black rounded-2xl hover:bg-red-600 transition-all text-[10px] uppercase tracking-widest"
              >
                {loading ? "Processing..." : "Disconnect Telegram"}
              </button>
            </motion.section>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;