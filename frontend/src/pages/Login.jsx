import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import API from "../api/axios";
export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/users/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/api/users/google-login", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      navigate("/dashboard");
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden relative px-4 bg-[#0D1117] text-slate-200">

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-[#4F6F64]/10 blur-[140px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-[#C89B3C]/5 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[size:30px_30px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
      </div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md scale-[0.97] sm:scale-100"
      >
        <div className="bg-[#161B22]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-8 py-7 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
            <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Welcome Back
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Access <span className="text-emerald-400 font-semibold">InfoSphere</span>
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-center text-sm bg-red-400/10 py-2 rounded-xl border border-red-400/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-3.5 rounded-xl font-bold text-black bg-white hover:bg-emerald-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Authorizing..." : "Sign In"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 text-center text-xs uppercase tracking-widest text-slate-500">
            or continue with
          </div>

          {/* Google */}
          <div className="flex justify-center scale-95">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              theme="filled_black"
              shape="pill"
              width="300"
            />
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 mt-4 text-xs">
            New here?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-white font-semibold hover:text-emerald-400 underline"
            >
              Create account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
