import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiUser, FiSettings, FiChevronDown } from "react-icons/fi";

// ─── UNIQUE GEOMETRIC SPHERE LOGO (NAVBAR VERSION) ───
const NavLogo = () => (
  <div className="relative flex items-center justify-center">
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="navSphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F6F64" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#C89B3C" />
        </linearGradient>
      </defs>
      {/* Small Animated Ring */}
      <motion.ellipse 
        cx="50" cy="50" rx="40" ry="12" 
        stroke="rgba(52, 211, 153, 0.4)" strokeWidth="2" 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: 'center' }}
      />
      {/* Shattered Pieces */}
      <path d="M50 15 L65 35 L50 55 L35 35 Z" fill="url(#navSphereGrad)" />
      <path d="M70 40 L85 55 L70 70 L55 55 Z" fill="url(#navSphereGrad)" fillOpacity="0.7" />
      <path d="M30 40 L15 55 L30 70 L45 55 Z" fill="url(#navSphereGrad)" fillOpacity="0.7" />
      <circle cx="50" cy="50" r="6" fill="white" className="animate-pulse" />
    </svg>
  </div>
);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 rounded-2xl bg-[#161B22]/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        
        {/* Logo Section with Unique Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="transition-all"
          >
            <NavLogo />
          </motion.div>
          <h1 className="text-xl font-black tracking-tighter text-white">
            Info<span className="text-emerald-400">Sphere</span>
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-emerald-400 transition-colors">Feeds</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Vault</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">AI Insights</a>
        </div>

        {/* Profile Section */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-inner"
          >
            <div className="relative">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=10b981&color=fff`}
                alt="avatar"
                className="w-8 h-8 rounded-lg object-cover border border-emerald-500/20"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#161B22]" />
            </div>
            
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-none mb-1">
                {user?.name || "Member"}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium tracking-tighter uppercase opacity-80">
                Premium Plan
              </p>
            </div>
            <FiChevronDown className={`text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </motion.div>

          <AnimatePresence>
            {open && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-64 bg-[#161B22] border border-white/10 rounded-[1.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl"
                >
                  <div className="px-3 py-4 text-center border-b border-white/5 mb-2">
                    <p className="font-black text-white text-lg tracking-tight leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-1 font-mono">
                      {user?.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-sm font-bold">
                      <FiUser className="text-emerald-400" />
                      View Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all text-sm font-bold">
                      <FiSettings className="text-emerald-400" />
                      Settings
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-black"
                    >
                      <FiLogOut />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;