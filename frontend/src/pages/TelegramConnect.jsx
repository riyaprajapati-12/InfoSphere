import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCopy, FiCheckCircle, FiLoader, FiExternalLink, FiShield, FiArrowLeft, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TelegramConnect = () => {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#0D1117] text-slate-200 overflow-x-hidden">
      
      {/* ─── BACKGROUND AMBIANCE ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] mb-12"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="bg-[#161B22]/80 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              
              {/* LEFT SIDE: Content & Status */}
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-4xl mb-8 shadow-[0_0_40px_rgba(14,165,233,0.15)]">
                  <FiSend className={connected ? "" : "animate-bounce"} />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 leading-tight">
                  Neural <br /> <span className="text-sky-400">Telegram</span> Sync
                </h1>
                
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-md">
                  Establish a secure encrypted link between your InfoSphere workspace and Telegram bot to receive real-time intelligence reports.
                </p>

                {connected && (
                  <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black tracking-widest text-sm uppercase"
                  >
                    <FiCheckCircle size={20} /> Connection Established
                  </motion.div>
                )}
              </div>

              {/* RIGHT SIDE: Interactive UI */}
              <div className="relative">
                <div className="absolute -inset-4 bg-white/5 rounded-[3rem] blur-xl opacity-50" />
                <div className="relative bg-black/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md">
                  
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10">
                        <FiLoader className="text-4xl text-sky-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Scanning Neural Link...</p>
                      </motion.div>
                    ) : connected ? (
                      <motion.div 
                        key="connected"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                      >
                        <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                          <p className="text-slate-300 leading-relaxed font-medium">
                            Your Nexus is active. You can now use the following commands in Telegram:
                          </p>
                          <ul className="mt-4 space-y-3 text-sm font-bold text-emerald-400">
                            <li className="flex items-center gap-2">/summary [link] - Generate AI summary</li>
                            <li className="flex items-center gap-2">/latest - Get recent articles</li>
                          </ul>
                        </div>
                        <button className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-sky-400 transition-colors">
                          Open Telegram Bot <FiExternalLink />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="token" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="space-y-6">
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-black shrink-0">1</div>
                            <p className="text-slate-300 text-sm font-medium">Find <span className="text-white font-bold">@InfoSphere_Bot</span> on Telegram and start the chat.</p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-black shrink-0">2</div>
                            <p className="text-slate-300 text-sm font-medium">Copy your unique connection token and send it to the bot.</p>
                          </div>
                        </div>

                        {/* Token Component */}
                        <div className="bg-black/60 border border-white/10 p-6 rounded-3xl group transition-all hover:border-sky-500/50">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Your Access Token</p>
                          <div className="flex flex-col md:flex-row gap-4 items-center">
                            <code className="flex-1 text-sky-400 font-mono text-xl font-bold tracking-tighter">
                              /connect {token}
                            </code>
                            <button 
                              onClick={handleCopy}
                              className={`w-full md:w-auto px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                copied ? "bg-emerald-500 text-black" : "bg-white text-black hover:bg-sky-400"
                              }`}
                            >
                              {copied ? "Copied!" : "Copy Token"}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-center py-4 px-6 rounded-2xl bg-white/5 border border-white/5">
                          <FiShield className="text-sky-500 shrink-0" />
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                            Token expires in 15 mins • One-time secure use protocol
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TelegramConnect;