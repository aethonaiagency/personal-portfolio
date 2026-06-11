import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Activity, Play, CheckCircle2, ShieldCheck, Sparkles, Settings, Terminal } from 'lucide-react';

interface HeroTechPanelProps {
  mouseXX?: any;
  mouseYY?: any;
}

export default function HeroTechPanel({ mouseXX, mouseYY }: HeroTechPanelProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'performance' | 'architecture'>('code');
  const [fps, setFps] = useState(60);
  const [serverPing, setServerPing] = useState(14);

  // Live metric fluctuations for realistic technical ambiance
  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.floor(59 + Math.random() * 2));
      setServerPing(Math.floor(12 + Math.random() * 4));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const codeSnippet = `// Next.js - Premium UI Optimization Engine
export async function generateStaticParams() {
  const products = await getLuxuryPortfolio();
  return products.map((item) => ({
    slug: item.slug,
    optimizationTime: "0.14s",
    animationFrameRate: "60fps",
    viewportReveal: true
  }));
}

const UIConfig = {
  gpuAcceleration: true,
  isomorphicLayout: "fluid",
  coreEngine: "framer-motion"
};`;

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square lg:aspect-auto lg:h-[460px] bg-[#121212]/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_30px_70px_rgba(139,92,246,0.15)] select-none">
      
      {/* 1. Header Chrome Menu Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0e0e0e]/50">
        <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-[#f5f5f0]/50 uppercase font-bold">
          <Terminal className="w-3 h-3 text-[#8b5cf6]" />
          <span>UI_ENGINE_V3.8</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ef4444]/30" />
          <span className="w-2 h-2 rounded-full bg-[#eab308]/30" />
          <span className="w-2 h-2 rounded-full bg-[#22c55e]/30" />
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex border-b border-white/5 bg-[#0b0b0b]/30">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-wider transition-colors border-r border-white/5 last:border-r-0 cursor-pointer ${
            activeTab === 'code' ? 'bg-[#181816]/70 text-[#8b5cf6] font-bold border-b-2 border-b-[#8b5cf6]' : 'text-[#f5f5f0]/40 hover:text-[#f5f5f0]/80'
          }`}
        >
          <Code2 className="w-3 h-3" />
          <span>Active Code</span>
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-wider transition-colors border-r border-white/5 last:border-r-0 cursor-pointer ${
            activeTab === 'performance' ? 'bg-[#181816]/70 text-[#8b5cf6] font-bold border-b-2 border-b-[#8b5cf6]' : 'text-[#f5f5f0]/40 hover:text-[#f5f5f0]/80'
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>Performance</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-wider transition-colors border-r border-white/5 last:border-r-0 cursor-pointer ${
            activeTab === 'architecture' ? 'bg-[#181816]/70 text-[#8b5cf6] font-bold border-b-2 border-b-[#8b5cf6]' : 'text-[#f5f5f0]/40 hover:text-[#f5f5f0]/80'
          }`}
        >
          <Settings className="w-3 h-3" />
          <span>Architecture</span>
        </button>
      </div>

      {/* 3. Central Dynamic Canvas Area */}
      <div className="relative p-5 h-[calc(100%-85px)] overflow-y-auto font-mono text-left bg-[#0c0c0c]/40">
        
        {/* Animated Background decorative scanlines */}
        <div className="absolute inset-0 scanline-ambient pointer-events-none opacity-[0.03] z-0" />

        <AnimatePresence mode="wait">
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] leading-relaxed text-[#f5f5f0]/80 overflow-x-auto relative z-10 select-all"
            >
              <pre className="text-emerald-400 font-sans text-[8px] tracking-wide mb-3 select-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                // LIVE COMPILING STYLED TRANSFORMS
              </pre>
              <span className="text-[#8b5cf6]">import</span> {'{'} motion {'}'} <span className="text-[#8b5cf6]">from</span> <span className="text-amber-300">"motion/react"</span>;
              <br />
              <code className="block mt-2 text-[#9ca3af] whitespace-pre font-mono">
                {codeSnippet}
              </code>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="perf"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col justify-between relative z-10"
            >
              <div className="grid grid-cols-2 gap-3">
                {/* Score Panel 1: Lighthouse */}
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col items-center justify-center text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* SVG Radial Progress */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#8b5cf6"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={175}
                        initial={{ strokeDashoffset: 175 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1.4, ease: 'easeOut' }}
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-[#f5f5f0]">100</span>
                  </div>
                  <span className="text-[8px] font-mono tracking-widest uppercase text-emerald-400 mt-2 font-bold select-none">
                    Lighthouse Perf
                  </span>
                </div>

                {/* Score Panel 2: Interactive metrics */}
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col justify-between">
                  <div>
                    <span className="text-[7px] text-[#f5f5f0]/40 uppercase tracking-widest block select-none">Target Framerate</span>
                    <span className="text-xl font-bold font-mono text-[#8b5cf6]">{fps} <span className="text-[9px] text-[#f5f5f0]/50">FPS</span></span>
                  </div>
                  <div className="mt-2 text-[8px] text-emerald-400/80 font-mono flex items-center gap-1 font-bold select-none">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Hardware Accel
                  </div>
                </div>
              </div>

              {/* Simulated Real-Time Canvas Render Timeline Graph */}
              <div className="mt-4 p-3 bg-white/[0.01] border border-white/5 rounded-lg flex-1 flex flex-col justify-between min-h-[90px]">
                <div className="flex justify-between items-center text-[7px] text-[#f5f5f0]/40 uppercase tracking-widest font-bold">
                  <span>Render Latency Timeline</span>
                  <span className="text-emerald-400 text-[8px] animate-pulse">Online</span>
                </div>
                
                {/* Bouncing Visual Columns Graph */}
                <div className="h-10 flex items-end gap-1 px-1 mt-2">
                  {[20, 45, 15, 30, 25, 40, 50, 30, 15, 20, 35, 45, 60, 20, 15].map((val, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: 4 }}
                      animate={{ height: [`${val * 0.4}px`, `${(val + (Math.random() - 0.5) * 15) * 0.5}px`, `${val * 0.4}px`] }}
                      transition={{
                        duration: 1.8 + Math.random() * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className={`flex-1 rounded-[1px] ${
                        idx === 12 ? 'bg-[#ef4444]' : idx % 3 === 0 ? 'bg-[#8b5cf6]/80' : 'bg-[#8b5cf6]/30'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center text-[7px] text-[#f5f5f0]/40 uppercase font-mono mt-2">
                  <span>Ping: {serverPing}ms</span>
                  <span>TBT: 0ms</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div
              key="arch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 relative z-10"
            >
              <div className="text-[8px] text-[#8b5cf6] font-bold tracking-widest uppercase mb-2">
                Deployment Specs & Integration
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#f5f5f0] block">Vercel CDN Edge</span>
                    <span className="text-[8px] text-[#f5f5f0]/40 block">Global static network distributions</span>
                  </div>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase select-none">Active</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#f5f5f0] block">Motion Canvas</span>
                    <span className="text-[8px] text-[#f5f5f0]/40 block">Intertial springs, hardware accelerated</span>
                  </div>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase select-none">60 FPS</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .scanline-ambient {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(139,92,246,0.15) 50%,
            rgba(139,92,246,0.15)
          );
          background-size: 100% 4px;
        }
      `}</style>
    </div>
  );
}
