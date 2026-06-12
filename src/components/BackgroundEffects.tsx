import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function BackgroundEffects() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldAnimate(!prefersReduced);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
      
      {/* 1. Moving Radial Premium Light Sources (60FPS Hardware Accelerated) */}
      <motion.div
        animate={shouldAnimate ? {
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
        } : undefined}
        transition={shouldAnimate ? {
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        } : undefined}
        style={{
          willChange: shouldAnimate ? 'transform' : 'auto',
          transform: 'translate3d(0,0,0)',
        }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/[0.025] blur-[140px] translate-x-[-50%] translate-y-[-50%]"
      />
      <motion.div
        animate={shouldAnimate ? {
          x: [0, -100, 60, 0],
          y: [0, 80, -60, 0],
        } : undefined}
        transition={shouldAnimate ? {
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        } : undefined}
        style={{
          willChange: shouldAnimate ? 'transform' : 'auto',
          transform: 'translate3d(0,0,0)',
        }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#8b5cf6]/[0.015] blur-[160px] translate-x-[50%] translate-y-[50%]"
      />

      {/* 2. Soft Cinema Vignette Layer */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(11,11,11,0.55) 100%)',
        }}
      />

      {/* 3. Ultra-subtle Animated Vintage Grain Noise */}
      <div className="absolute inset-0 opacity-[0.14] noise-grain-premium pointer-events-none" />

      {/* Embedded Dynamic Premium Styling */}
      <style>{`
        .noise-grain-premium {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: grain-shift-anim 0.8s steps(6) infinite;
        }
        @keyframes grain-shift-anim {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(-2%, 2%); }
          30% { transform: translate(1%, -2%); }
          40% { transform: translate(-1%, 3%); }
          55% { transform: translate(2%, 1%); }
          75% { transform: translate(-2%, -3%); }
          90% { transform: translate(1%, 2%); }
        }
      `}</style>

    </div>
  );
}
