import { useState } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiShield, FiRefreshCw } from "react-icons/fi";

// Modern Notification Component
function Notification({ message, type }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center gap-2 p-4 rounded-2xl mb-6 text-sm font-bold border ${
        type === "success"
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
      }`}
    >
      {type === "success" ? <FiCheckCircle /> : <FiXCircle />}
      {message}
    </motion.div>
  );
}

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const navigate = useNavigate();
  const { email } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ message: "", type: "" });

    if (!email) {
      setNotification({ message: "Email not found. Redirecting...", type: "error" });
      setTimeout(() => navigate("/signup"), 2000);
      return;
    }

    try {
      const res = await API.post("/api/users/verify-otp", { email, otp });

      if (res.data.success) {
        setNotification({ message: "Identity verified! Welcome to the sphere.", type: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setNotification({ message: "Invalid code. Please check and try again.", type: "error" });
      }
    } catch {
      setNotification({ message: "Verification failed. Connection error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setNotification({ message: "Sending a new code...", type: "success" });
    try {
      await API.post("/api/users/resend-otp", { email });
      setNotification({ message: "A fresh code has been sent to your inbox.", type: "success" });
    } catch {
      setNotification({ message: "Resend failed. Try again later.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-[#0D1117] text-slate-200">
      
      {/* ─── DYNAMIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#4F6F64]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C89B3C]/5 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[size:30px_30px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
      </div>

      {/* ─── VERIFICATION CARD ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#161B22]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center">
          
          {/* Icon Header */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <FiShield />
            </div>
          </div>

          <h2 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 mb-4">
            Verify Identity
          </h2>
          
          <p className="text-slate-400 mb-8 font-medium">
            We've sent a 6-digit code to <br />
            <span className="text-white font-bold break-all opacity-90">{email}</span>
          </p>

          <AnimatePresence mode="wait">
            <Notification message={notification.message} type={notification.type} />
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="0 0 0 0 0 0"
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] text-emerald-400 placeholder-slate-800 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-4 rounded-2xl font-bold text-black bg-white hover:bg-emerald-400 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-white"
            >
              {loading ? "Validating..." : "Verify & Continue"}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={handleResend}
              className="group flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-400 transition-colors"
            >
              <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
              Resend Code
            </button>
            
            <button
              onClick={() => navigate("/signup")}
              className="text-xs font-bold text-slate-600 hover:text-white transition-colors"
            >
              Entered wrong email?
            </button>
          </div>
        </div>

        {/* System Footnote */}
        <p className="text-center mt-8 text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase">
          Secure Verification Protocol • InfoSphere v2.0
        </p>
      </motion.div>
    </div>
  );
}