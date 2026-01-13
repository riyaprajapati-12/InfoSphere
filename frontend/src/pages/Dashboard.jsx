import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RecentArticles from "../components/RecentArticles";
import ManageFeeds from "../components/ManageFeeds";
import { motion } from "framer-motion";
import { FiZap, FiActivity } from "react-icons/fi";

export default function Dashboard() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#0D1117] text-slate-200 overflow-hidden">
      
      {/* ─── AMBIENT BACKGROUND ORBS ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#4F6F64]/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#C89B3C]/5 blur-[100px]" />
      </div>

      {/* Top Navbar */}
      <Navbar />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-10 pt-20">

        {/* Floating Sidebar (Fixed width, 4rem left margin for floating look) */}
        <Sidebar />

        {/* Main Content (ML-72 compensates for Sidebar 64 + 8 spacing) */}
        <main className="flex-1 ml-72 p-6 overflow-y-auto custom-scrollbar h-full pb-20">

          {/* ─── HERO / OVERVIEW CARD ─── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-[2.5rem] bg-[#161B22]/60 backdrop-blur-2xl border border-white/10 p-8 flex items-center justify-between relative overflow-hidden shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />

            {/* Left Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  System Online
                </span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">
                  v2.0 Neural Engine
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
                Welcome to the <span className="text-emerald-400">Sphere</span>
              </h1>

              <p className="text-slate-400 font-medium max-w-xl leading-relaxed">
                Your neural workspace is ready. We've synthesized the latest updates from your 
                subscribed channels into focused intelligence reports.
              </p>

              <div className="flex gap-10 mt-8">
                <div className="group cursor-pointer">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">12</h2>
                    <FiActivity className="text-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Active Sources</p>
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-white group-hover:text-[#C89B3C] transition-colors">96<span className="text-lg">+</span></h2>
                    <FiZap className="text-[#C89B3C]" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">AI Summaries</p>
                </div>
              </div>
            </div>

            {/* Right Graphic */}
            <div className="relative hidden lg:block mr-10">
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="relative z-10 w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
               >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3845/3845731.png"
                    alt="rss"
                    className="h-20 w-20 grayscale brightness-200 contrast-125 opacity-80"
                  />
               </motion.div>
               {/* Decorative Ring */}
               <div className="absolute -inset-4 border border-white/5 rounded-[2rem] animate-spin-slow" />
            </div>
          </motion.div>

          {/* ─── GRID LAYOUT ─── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Recent Articles (Taking 8 columns) */}
            <div className="xl:col-span-8">
              <RecentArticles />
            </div>

            {/* Manage Feeds (Taking 4 columns) */}
            <div className="xl:col-span-4 h-full">
              <ManageFeeds />
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}