import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCopy, FiCheckCircle, FiLoader, FiExternalLink, FiShield, FiArrowLeft, FiZap, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TelegramConnect = () => {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const botLink = "https://t.me/InfoSphereMajorBot";

  const fetchToken = async () => {
    try {
      const res = await API.post("/api/users/telegram/token");
      if (res.data.connected) {
        setConnected(true);
      } else {
        setToken(res.data.token);
      }
    } catch (err) {
      console.error("Telegram status error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`/connect ${token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-200 overflow-x-hidden relative">
      
      {/* ─── AMBIENT BACKGROUND (FULL WINDOW) ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col px-8 md:px-16 py-12">
        
        {/* Navigation Header */}
        <header className="flex justify-between items-center mb-20">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-slate-500 hover:text-emerald-400 transition-all font-black text-xs uppercase tracking-[0.4em]"
          >
            <FiArrowLeft size={16} /> Neural Dashboard
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Ready</span>
          </div>
        </header>

        {/* ─── MAIN CONTENT AREA (FULL SPREAD) ─── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto w-full">
          
          {/* LEFT SECTION: Branding & Info (Col-span 7) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest">
              <FiSend /> Secure Neural Sync
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
              Connect to the <br /> 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-white to-emerald-400">
                Major Bot.
              </span>
            </h1>

            <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Integrate your personal sphere with Telegram to receive real-time intelligence, 
              instant summaries, and command-line access to your data vault.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div className="space-y-3">
                <FiBell className="text-emerald-400 text-2xl" />
                <h4 className="text-white font-bold text-lg">Push Intelligence</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Never miss a critical update. Get instant notifications the second a new source is indexed.</p>
              </div>
              <div className="space-y-3">
                <FiZap className="text-sky-400 text-2xl" />
                <h4 className="text-white font-bold text-lg">Remote Commands</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Summarize long-form articles or query your recent feed directly from the Telegram interface.</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SECTION: Action Panel (Col-span 5) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-[#161B22]/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl">
              
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="py-20 flex flex-col items-center gap-6">
                    <FiLoader className="text-5xl text-sky-500 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Initializing Link...</p>
                  </div>
                ) : connected ? (
                  <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-4xl mx-auto mb-6">
                      <FiCheckCircle />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Sync Established</h2>
                      <p className="text-slate-400 font-medium">Your account is fully integrated with @InfoSphereMajorBot.</p>
                    </div>
                    <a 
                      href={botLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="block w-full py-5 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all shadow-lg"
                    >
                      Enter Neural Bot <FiExternalLink className="inline ml-2" />
                    </a>
                  </motion.div>
                ) : (
                  <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Establish Link</h3>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <span className="text-sky-400 font-black">01.</span>
                          <p className="text-slate-300 text-sm">Open <a href={botLink} target="_blank" rel="noreferrer" className="text-white font-bold hover:text-sky-400 underline decoration-sky-500/30">t.me/InfoSphereMajorBot</a></p>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-sky-400 font-black">02.</span>
                          <p className="text-slate-300 text-sm">Send the neural access command:</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/60 border border-white/5 rounded-3xl p-6 group">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Neural Command Token</p>
                       <div className="flex flex-col gap-4">
                          <div className="bg-white/5 p-4 rounded-xl text-sky-400 font-mono text-xl font-bold tracking-tighter text-center">
                            /connect {token}
                          </div>
                          <button 
                            onClick={handleCopy}
                            className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                              copied ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-white text-black hover:bg-sky-400"
                            }`}
                          >
                            {copied ? "Sync Ready!" : "Copy Command"}
                          </button>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                      <FiShield className="text-slate-600" />
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">
                        Link Expires in 15m • Secure Protocol
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>

        {/* Footer info (Full Window spread) */}
        <footer className="mt-auto pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">InfoSphere Neural Network v2.0</p>
           <div className="flex gap-8 text-slate-600 text-[10px] font-black uppercase tracking-widest">
              <span className="hover:text-emerald-400 cursor-pointer">Encryption Log</span>
              <span className="hover:text-emerald-400 cursor-pointer">Bot Status</span>
              <span className="hover:text-emerald-400 cursor-pointer">Support</span>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default TelegramConnect;