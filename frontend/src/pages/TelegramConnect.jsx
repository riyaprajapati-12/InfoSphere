import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCopy, FiCheckCircle, FiLoader, FiExternalLink, FiShield } from "react-icons/fi";

const TelegramConnect = () => {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
    <div className="min-h-screen bg-[#0D1117] text-slate-200">
     
      
      {/* ─── BACKGROUND AMBIANCE ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <div className="bg-[#161B22]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-4xl mb-6 shadow-[0_0_30px_rgba(14,165,233,0.15)]">
                <FiSend className={connected ? "" : "animate-bounce"} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
                {connected ? "Nexus Established" : "Telegram Sync"}
              </h1>
              <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">
                {connected ? "Connection Secure" : "Awaiting Authorization"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10">
                  <FiLoader className="text-4xl text-sky-500 animate-spin mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Checking Neural Link...</p>
                </motion.div>
              ) : connected ? (
                <motion.div 
                  key="connected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black tracking-tight">
                    <FiCheckCircle /> LINK ACTIVE
                  </div>
                  <p className="text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Your Telegram is now synced with InfoSphere. You will receive real-time intelligence reports directly in your DM.
                  </p>
                  <button className="text-sky-400 font-bold text-sm hover:underline flex items-center gap-2 mx-auto mt-4">
                    Open Telegram <FiExternalLink />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="token" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  
                  {/* Steps */}
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-sky-400">1</div>
                      <p className="text-slate-300 text-sm flex-1 leading-relaxed">
                        Open our official bot <span className="text-white font-bold">@InfoSphere_Bot</span> on Telegram.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-sky-400">2</div>
                      <p className="text-slate-300 text-sm flex-1 leading-relaxed">
                        Copy the encrypted command below and send it to the bot.
                      </p>
                    </div>
                  </div>

                  {/* Token Box */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative flex flex-col md:flex-row items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md">
                      <code className="flex-1 text-sky-400 font-mono text-lg font-bold p-2 tracking-tight overflow-hidden">
                        /connect {token}
                      </code>
                      <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          copied ? "bg-emerald-500 text-black" : "bg-white text-black hover:bg-sky-400"
                        }`}
                      >
                        {copied ? <><FiCheckCircle /> Copied</> : <><FiCopy /> Copy Link</>}
                      </button>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 opacity-60">
                    <FiShield className="text-sky-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Token expires in 15 minutes • One-time secure use
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Bottom Link */}
          <button 
            onClick={() => window.history.back()}
            className="mt-8 text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 w-full"
          >
            ← Return to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TelegramConnect;