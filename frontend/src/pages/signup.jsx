import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

// Notification
function Notification({ message, type }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl mb-4 text-xs font-bold border ${
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

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ message: "", type: "" });

    try {
      await API.post("/api/users/signup", formData);
      setNotification({
        message: "Account created! Redirecting...",
        type: "success",
      });
      setTimeout(() => navigate(`/verify-otp/${formData.email}`), 1200);
    } catch (err) {
      setNotification({
        message: err.response?.data?.msg || "Signup failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden relative px-4 bg-[#0D1117] text-slate-200">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-[#4F6F64]/10 blur-[140px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-[#C89B3C]/5 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[size:30px_30px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md scale-[0.96] sm:scale-100"
      >
        <div className="bg-[#161B22]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-8 py-7 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Create Account
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Join <span className="text-emerald-400 font-semibold">InfoSphere</span>
            </p>
          </div>

          <AnimatePresence mode="wait">
            <Notification
              message={notification.message}
              type={notification.type}
            />
          </AnimatePresence>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-3.5 mt-2 rounded-xl font-bold text-black bg-white hover:bg-emerald-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Get Started"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 text-center text-xs uppercase tracking-widest text-slate-500">
            or sign up with
          </div>

          {/* Google */}
          <div className="flex justify-center scale-95">
            <GoogleLogin
              onSuccess={() =>
                setNotification({
                  message: "Google signup successful!",
                  type: "success",
                })
              }
              onError={() =>
                setNotification({
                  message: "Google signup failed",
                  type: "error",
                })
              }
              theme="filled_black"
              shape="pill"
              width="300"
            />
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 mt-4 text-xs">
            Already a member?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-white font-semibold hover:text-emerald-400 underline"
            >
              Log in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
