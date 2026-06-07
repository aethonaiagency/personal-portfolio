import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // Stage 1: "NASHIAT" (0s to 1.2s)
    // Stage 2: "Digital Experiences Built to Convert" (1.2s to 2.6s)
    // Stage 3: Slide up container (2.6s to 3.0s)
    
    const labelTimer = setTimeout(() => {
      setPhase(2);
    }, 1200);

    const finishTimer = setTimeout(() => {
      setPhase(3);
    }, 2800);

    const destTimer = setTimeout(() => {
      onComplete();
    }, 3300);

    return () => {
      clearTimeout(labelTimer);
      clearTimeout(finishTimer);
      clearTimeout(destTimer);
    };
  }, [onComplete]);

  const letterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const letterAnim = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {phase !== 3 && (
        <motion.div
          key="loader-curtain"
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            transition: { ease: [0.76, 0, 0.24, 1], duration: 0.8 } 
          }}
          className="fixed inset-0 bg-[#0b0b0b] z-50 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Subtle purple elegant radial ambiance in the background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)] pointer-events-none" />

          <div className="h-20 flex items-center justify-center">
            {phase === 1 && (
              <motion.h1
                variants={letterContainer}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } }}
                className="text-5xl md:text-8xl font-display font-bold tracking-[0.15em] text-[#f5f5f0]"
              >
                {['N', 'A', 'S', 'H', 'I', 'A', 'T'].map((char, index) => (
                  <motion.span key={index} variants={letterAnim} className="inline-block">
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            )}

            {phase === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                className="text-center max-w-xl px-4"
              >
                <span className="text-xs uppercase tracking-[0.3em] text-[#8b5cf6] mb-3 block font-mono">
                  Nashiat Studio
                </span>
                <p className="text-lg md:text-2xl font-heading text-[#f5f5f0] leading-relaxed">
                  Digital Experiences Built to Convert
                </p>
                
                {/* Visual geometric premium line loader indicator */}
                <div className="w-16 h-[1px] bg-[#8b5cf6]/30 mx-auto mt-6 relative overflow-hidden">
                  <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 w-8 bg-[#8b5cf6]"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Aesthetic technical detail footer */}
          <div className="absolute bottom-10 left-10 text-[8px] font-mono text-[#f5f5f0]/30 tracking-widest hidden md:block">
            N_SYSTEM_ONLINE : SYS_v5.0.4
          </div>
          <div className="absolute bottom-10 right-10 text-[8px] font-mono text-[#f5f5f0]/30 tracking-widest hidden md:block">
            CRAFTED // LUXURY PORTFOLIO
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
