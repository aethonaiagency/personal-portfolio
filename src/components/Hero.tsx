import { motion } from 'motion/react';
import { ArrowDown, Calendar, ArrowUpRight, TrendingUp, Cpu } from 'lucide-react';
import luxuryOrbImg from '../assets/images/luxury_glass_orb_1780125514755.png';
import { ProfileData } from '../App';

interface HeroProps {
  onOpenBookModal: () => void;
  profile?: ProfileData;
}

export default function Hero({ onOpenBookModal, profile }: HeroProps) {
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
    <section className="relative min-h-screen bg-[#0b0b0b] flex items-center justify-center pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
      
      {/* Absolute Glow and Grid Ambiance Elements */}
      <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
      
      {/* Light Golden Spendable Orb top right - Dimmed */}
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.03)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      
      {/* Medium Golden Glow bottom left - Dimmed */}
      <div className="absolute bottom-[5%] left-[-15%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.02)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* BACKGROUND DECOR - Barely visible to reduce clutter */}
      <div className="absolute -left-20 top-40 text-[14rem] xl:text-[22rem] font-black opacity-[0.01] select-none pointer-events-none tracking-tighter text-[#f5f5f0]">
        BUILDER
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Side: Premium Wording (7 columns width) */}
        <motion.div 
          variants={textContainerParent}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Tagline Badge */}
          <motion.div 
            variants={textChild}
            className="text-[10px] uppercase tracking-[0.25em] text-[#c9a46c] font-semibold mb-4 sm:mb-6 flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a46c]"></span>
            React & Next.js Expert • UI Engineering
          </motion.div>

          {/* Value Prop Wording */}
          <motion.h1 
            variants={textChild}
            className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-display font-bold tracking-tight text-[#f5f5f0] space-y-1 leading-[1.12] mb-5 max-w-2xl"
          >
            I build <span className="serif-display font-light text-glow text-[#c9a46c] italic">high-performance</span> Web Apps that convert traffic into revenue.
          </motion.h1>

          <motion.p 
            variants={textChild}
            className="max-w-xl text-sm sm:text-base md:text-lg text-[#f5f5f0]/70 leading-relaxed font-sans font-light mb-8"
          >
            Specializing in modern React, Next.js, and bespoke UI engineering. I craft ultra-fast, premium-grade digital interfaces designed specifically for SaaS products and luxury brands to maximize conversion and engagement.
          </motion.p>

          {/* Call To Action Buttons with strict hierarchy */}
          <motion.div 
            variants={textChild}
            className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto items-stretch"
          >
            <button
              onClick={scrollToWork}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#f5f5f0] hover:bg-[#c9a46c] text-[#0b0b0b] font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 group font-mono rounded-[2px] w-full sm:w-auto min-h-[44px] touch-manipulation"
            >
              View My Work
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
            
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 sm:px-8 py-3.5 sm:py-4 border border-[#f5f5f0]/30 text-[#f5f5f0] hover:bg-white/5 font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 font-mono rounded-[2px] w-full sm:w-auto min-h-[44px] touch-manipulation"
            >
              Contact Me
            </button>
          </motion.div>

          {/* High-end metrics mini-banner */}
          <motion.div 
            variants={textChild}
            className="grid grid-cols-3 gap-4 sm:gap-6 pt-10 mt-10 border-t border-[#f5f5f0]/10 w-full max-w-lg"
          >
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-[#c9a46c]">
                {profile?.handcraftedBuiltPercent !== undefined ? `${profile.handcraftedBuiltPercent}%` : '100%'}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Handcrafted code
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-[#f5f5f0]">
                {profile?.lighthouseTarget || '90+'}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Lighthouse Score
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-[#f5f5f0]">
                {profile?.designStandardName || 'Luxury'}
              </p>
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
          className="lg:col-span-5 flex justify-center items-center relative py-6 lg:py-12"
        >
          {/* Animated decorative spinning luxury border ring - softened and reduced */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full border border-dashed border-[#c9a46c]/5 pointer-events-none"
          />
          
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[200px] h-[200px] md:w-[290px] md:h-[290px] rounded-full border border-white/[0.02] pointer-events-none"
          />

          {/* Floating glassmorphism visual shell - toned down and made smaller */}
          <div className="relative z-20">
            <motion.div 
              animate={{ 
                y: [0, -6, 0],
                rotate: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="relative w-[190px] h-[260px] md:w-[250px] md:h-[340px] p-1 bg-[#121212]/90 shadow-2xl border border-white/5 group rounded-[4px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
              <div className="w-full h-full bg-[#121212] overflow-hidden relative rounded-[2px]">
                {/* The generated high-quality background graphic - dim and grayscale by default to let text pop */}
                <img 
                  src={luxuryOrbImg}
                  alt="Premium interactive digital asset curated by Nashiat"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-750 pointer-events-none"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Project Title Inside Card bottom */}
              <div className="absolute bottom-6 left-6 z-20 flex flex-col pt-2">
                <span className="text-[8px] tracking-widest text-[#f5f5f0]/40 uppercase font-mono mb-1">
                  Active Asset // Orb 01
                </span>
                <span className="text-sm font-bold uppercase tracking-tight text-[#f5f5f0]/80">
                  INTERFACE.<span className="serif-display text-[#c9a46c]">CORE</span>
                </span>
              </div>
            </motion.div>
            
            {/* STACKED LAYERS DECOR - softened */}
            <div className="absolute -right-4 -bottom-4 w-full h-full border border-white/[0.03] -z-10 rounded-[4px]" />
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
