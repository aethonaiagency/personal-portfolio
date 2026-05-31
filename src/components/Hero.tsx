import { motion } from 'motion/react';
import { ArrowDown, Calendar, ArrowUpRight, TrendingUp, Cpu } from 'lucide-react';
import luxuryOrbImg from '../assets/images/luxury_glass_orb_1780125514755.png';

interface HeroProps {
  onOpenBookModal: () => void;
}

export default function Hero({ onOpenBookModal }: HeroProps) {
  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const textContainerParent = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      }
    }
  };

  const textChild = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 1.2 }
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0b0b0b] flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden">
      
      {/* Absolute Glow and Grid Ambiance Elements */}
      <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
      
      {/* Light Golden Backdrop Orb top right */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      
      {/* Medium Golden Glow bottom left */}
      <div className="absolute bottom-[5%] left-[-15%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.04)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* BACKGROUND DECOR */}
      <div className="absolute -left-20 top-40 text-[14rem] xl:text-[22rem] font-black opacity-[0.02] select-none pointer-events-none tracking-tighter text-[#f5f5f0]">
        BUILDER
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Side: Premium Copy & Actions (6 columns width) */}
        <motion.div 
          variants={textContainerParent}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Tagline Badge */}
          <motion.div 
            variants={textChild}
            className="text-[11px] uppercase tracking-[0.3em] text-[#c9a46c] font-semibold mb-6 flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a46c]"></span>
            Digital Craftsmanship • 2026
          </motion.div>

          <motion.h2 
            variants={textChild}
            className="text-4xl md:text-5xl xl:text-6.5xl font-display font-bold tracking-tight text-[#f5f5f0] leading-[1.05] mb-6"
          >
            Crafting websites that feel <span className="serif-display font-light text-glow text-[#c9a46c] italic">premium</span> & perform like machines.
          </motion.h2>

          <motion.p 
            variants={textChild}
            className="max-w-md text-base md:text-lg text-[#f5f5f0]/60 leading-relaxed font-sans font-light mb-10"
          >
            I design and build sleek, high-converting digital experiences for brands that refuse to settle for the ordinary.
          </motion.p>

          {/* Call To Action Buttons */}
          <motion.div 
            variants={textChild}
            className="flex flex-row gap-6 w-full sm:w-auto items-stretch"
          >
            <button
              onClick={scrollToWork}
              className="px-8 py-4 bg-[#f5f5f0] hover:bg-[#c9a46c] text-[#0b0b0b] font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 group font-mono rounded-[2px]"
            >
              View Selected Work
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            
            <button
              onClick={onOpenBookModal}
              className="px-8 py-4 border border-[#f5f5f0]/20 text-[#f5f5f0] hover:bg-white/5 font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 font-mono rounded-[2px]"
            >
              Book Strategy Call
            </button>
          </motion.div>

          {/* High-end metrics mini-banner */}
          <motion.div 
            variants={textChild}
            className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-[#f5f5f0]/10 w-full max-w-lg"
          >
            <div>
              <p className="text-xl md:text-2xl font-heading font-semibold text-[#c9a46c]">100%</p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Handcrafted code
              </p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-heading font-semibold text-[#f5f5f0]">90+</p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Lighthouse Score
              </p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-heading font-semibold text-[#f5f5f0]">Luxury</p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Design Standard
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Floating Abstract Visual Frame (5 columns width) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center items-center relative py-12"
        >
          {/* Animated decorative spinning luxury border ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full border border-dashed border-[#c9a46c]/15 pointer-events-none"
          />
          
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[290px] h-[290px] md:w-[380px] md:h-[380px] rounded-full border border-spacing-2 border-[#f5f5f0]/5 pointer-events-none"
          />

          {/* Floating glassmorphism visual shell */}
          <div className="relative z-20">
            <motion.div 
              animate={{ 
                y: [0, -12, 0],
                rotate: [0, 1.5, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="relative w-[280px] h-[380px] md:w-[320px] md:h-[430px] p-1 bg-[#1a1a1a] shadow-2xl relative border border-white/5 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10 pointer-events-none" />
              <div className="w-full h-full bg-[#1e1e1e] overflow-hidden relative">
                {/* The generated high-quality background graphic */}
                <img 
                  src={luxuryOrbImg}
                  alt="Premium interactive digital asset curated by Nashiat"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 pointer-events-none opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Project Title Inside Card bottom */}
              <div className="absolute bottom-8 left-8 z-20 flex flex-col pt-4">
                <span className="text-[10px] tracking-widest text-[#f5f5f0]/50 uppercase font-mono mb-1">
                  Active System // Orb 01
                </span>
                <span className="text-xl font-bold uppercase tracking-tight text-[#f5f5f0]">
                  ORB_ENGINE.<span className="serif-display text-[#c9a46c]">SYS</span>
                </span>
              </div>
            </motion.div>
            
            {/* STACKED LAYERS DECOR from Artistic Flair guidelines */}
            <div className="absolute -right-6 -bottom-6 w-full h-full border border-white/10 -z-10 rounded-[2px]" />
            <div className="absolute -left-6 -top-6 w-[120px] h-[120px] bg-[#c9a46c] opacity-10 blur-3xl -z-10" />
          </div>
        </motion.div>

      </div>

      {/* Underneath: Animated Mouse Scroll Indicator */}
      <div 
        onClick={scrollToWork}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity z-10"
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#f5f5f0]/50">
          Scroll to explore
        </span>
        <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center p-1.5">
          <motion.div 
            animate={{ 
              y: [0, 8, 0] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="w-1 h-2 bg-[#c9a46c] rounded-full"
          />
        </div>
      </div>

      {/* RIGHT SIDE: MOUSE SCROLL INDICATOR (Artistic Flair custom) */}
      <div className="absolute bottom-12 right-12 hidden xl:flex flex-col items-center gap-4 z-20">
        <div className="vertical-text text-[10px] tracking-[0.5em] opacity-30 uppercase font-mono">
          Scroll to Explore
        </div>
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#f5f5f0]/40 to-transparent"></div>
      </div>

    </section>
  );
}
