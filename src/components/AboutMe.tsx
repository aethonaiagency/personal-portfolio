import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Sparkles, Code, Rocket, Award, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import portraitImg from '../assets/images/nashiat_portrait_1780227728956.png';
import { ProfileData } from '../App';

// Sub-component for counting up figures in stats cards
interface AnimatedStatProps {
  target: number;
  suffix?: string;
}

function AnimatedStat({ target, suffix = '' }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const duration = 1200; // Total count-up duration in ms
      const startTime = performance.now();

      const updateCount = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= duration) {
          setCount(target);
          return;
        }

        const progress = elapsedTime / duration;
        // Ease-out cubic formula for luxurious decelerating speed
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const nextValue = Math.floor(easeOutProgress * target);

        setCount(nextValue);
        requestAnimationFrame(updateCount);
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, target]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-display font-semibold text-[#8b5cf6]">
      {count}
      {suffix}
    </span>
  );
}

interface AboutMeProps {
  profile?: ProfileData;
}

export default function AboutMe({ profile }: AboutMeProps) {
  const features = [
    'Clean UI/UX design matching brand persona',
    'Interactive smooth animations (Framer Motion)',
    'Ultra-fast performance & PageSpeed optimization',
    'Perfect mobile responsiveness with adaptive grids',
    'High-converting user flows & layout anchors',
    'Premium user experience tailored with bespoke detail'
  ];

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="about" className="relative py-16 sm:py-28 bg-[#0b0b0b] border-b border-[#8b5cf6]/10 overflow-hidden">
      {/* Dynamic ambient background objects */}
      <div className="absolute top-1/4 right-[5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.03)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[10%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.01)_0%,transparent_60%)] blur-2xl pointer-events-none" />

      {/* Embedded subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading Label */}
        <div className="text-left mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-xs font-mono uppercase tracking-[0.3em] text-[#8b5cf6] mb-3 flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
            Get To Know Me
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-bold tracking-tight text-[#f5f5f0] max-w-3xl leading-[1.12]"
          >
            {profile?.bioIntroduction ? (
              <span>
                {profile.bioIntroduction.includes('stand out') ? (
                  <>
                    {profile.bioIntroduction.split('stand out')[0]}
                    <span className="serif-display text-[#8b5cf6] font-light italic">stand out</span>
                    {profile.bioIntroduction.split('stand out')[1] || ''}
                  </>
                ) : profile.bioIntroduction}
              </span>
            ) : (
              <>Crafting websites that help brands <span className="serif-display text-[#8b5cf6] font-light italic">stand out</span> and convert.</>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-[#f5f5f0]/60 font-sans font-light mt-4 sm:mt-6 max-w-2xl leading-relaxed"
          >
            {profile?.bioLong || (
              <>
                I design and build modern websites for businesses, startups, and personal brands that want a strong online presence.
                My focus is not just making websites look beautiful — but creating websites that feel premium, perform fast, and help convert visitors into clients.
              </>
            )}
          </motion.p>
        </div>

        {/* Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait Container with premium aesthetics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-start"
          >
            <div className="relative group w-full max-w-[340px] aspect-[3/4]">
              {/* Outer double gold/slate wireframe frame offset */}
              <div className="absolute inset-0 border border-white/5 bg-[#121212]/30 rounded-[4px]" />
              <div className="absolute -inset-2 border border-[#8b5cf6]/10 rounded-[6px] -z-10 group-hover:scale-[1.01] transition-transform duration-500" />
              <div className="absolute -right-3 -bottom-3 w-full h-full border border-dashed border-[#8b5cf6]/20 rounded-[4px] -z-20 transition-all duration-500 group-hover:-right-4 group-hover:-bottom-4" />

              {/* Glassmorphic border ring wrapper */}
              <div className="w-full h-full overflow-hidden rounded-[4px] border border-white/10 relative p-1.5 bg-gradient-to-br from-white/5 to-transparent shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 pointer-events-none" />
                
                {/* Visual Avatar generated image */}
                <img
                  src={portraitImg}
                  alt="Nashiat - Web Developer Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[2px] transform scale-102 group-hover:scale-106 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
                />

                {/* Micro branding stamp bottom left of photo */}
                <div className="absolute bottom-5 left-5 z-20 font-mono text-[9px] uppercase tracking-wider text-[#f5f5f0]/80">
                  <span className="text-[#8b5cf6] font-bold">FOUNDER</span> // {profile?.fullName?.split(' ')[0].toUpperCase() || 'NASHIAT'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-End Bio Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <span className="text-[10px] font-mono tracking-widest text-[#8b5cf6] uppercase mb-1">
              Introduction
            </span>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-[#f5f5f0] tracking-tight mb-4">
              Hi, I'm <span className="text-[#8b5cf6] font-medium">{profile?.fullName?.split(' ')[0] || 'Nashiat'}</span>
            </h3>
            
            <p className="text-sm md:text-base text-[#f5f5f0]/85 font-sans font-light leading-relaxed mb-6">
              {profile?.bioLong ? (
                <span>{profile.bioLong}</span>
              ) : (
                <>
                  I’m a web developer focused on building modern, sleek, and conversion-driven digital experiences. 
                  I work with local businesses, startups, and international clients to create websites that not only look premium but also help businesses grow online.
                </>
              )}
            </p>

            <blockquote className="border-l-2 border-[#8b5cf6] pl-4 my-6 italic text-[#f5f5f0]/90 text-sm font-light">
              "My goal is simple: Build websites that feel fast, modern, memorable, and built with purpose."
            </blockquote>

            <div className="mt-4">
              <p className="text-xs font-mono tracking-widest text-[#8b5cf6] uppercase mb-4">
                I pay close attention to:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#1c1c1a] border border-[#8b5cf6]/43 flex items-center justify-center flex-shrink-0 text-[#8b5cf6]">
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    </span>
                    <span className="text-xs md:text-sm text-[#f5f5f0]/80 font-sans leading-normal">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#f5f5f0]/50 font-sans mt-6">
              Every project is designed carefully to reflect the brand and turn visitors into real customers.
            </p>
          </motion.div>

        </div>

        {/* Stats Bento Block Section directly beneath copy */}
        <div className="mt-20 pt-16 border-t border-white/[0.04]">
          <h4 className="text-center text-[10px] font-mono tracking-[0.3em] uppercase text-[#8b5cf6] mb-12">
            Performance & Design Indices
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-[#121212]/40 rounded-[4px] border border-white/5 p-6 hover:border-[#8b5cf6]/20 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] relative"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#8b5cf6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#8b5cf6]">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-[#f5f5f0] mb-1">
                <AnimatedStat target={profile?.totalProjectsCount || 12} suffix="+" />
              </p>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#f5f5f0]/50 block">
                Projects Completed
              </span>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#121212]/40 rounded-[4px] border border-white/5 p-6 hover:border-[#8b5cf6]/20 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] relative"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#8b5cf6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#8b5cf6]">
                <Code className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-[#f5f5f0] mb-1">
                <AnimatedStat target={profile?.handcraftedBuiltPercent !== undefined ? profile.handcraftedBuiltPercent : 100} suffix="%" />
              </p>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#f5f5f0]/50 block">
                Custom Handcrafted Built
              </span>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#121212]/40 rounded-[4px] border border-white/5 p-6 hover:border-[#8b5cf6]/20 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] relative"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#8b5cf6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#8b5cf6]">
                <Rocket className="w-5 h-5" />
              </div>
              <p className="text-3xl font-display font-semibold text-[#8b5cf6] mb-1">
                {profile?.lighthouseTarget || 'Fast'}
              </p>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#f5f5f0]/50 block">
                Lighthouse Score
              </span>
            </motion.div>

            {/* Stat Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#121212]/40 rounded-[4px] border border-white/5 p-6 hover:border-[#8b5cf6]/20 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] relative"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#8b5cf6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#8b5cf6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-3xl font-display font-semibold text-[#8b5cf6] mb-1">
                {profile?.designStandardName || 'Modern'}
              </p>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#f5f5f0]/50 block">
                Design Standard
              </span>
            </motion.div>

          </div>
        </div>

        {/* Global CTA Trigger */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 sm:mt-16 flex justify-center w-full"
        >
          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4.5 bg-[#f5f5f0] hover:bg-[#8b5cf6] text-[#0b0b0b] font-bold text-xs uppercase tracking-[0.2em] cursor-pointer transition-colors flex items-center justify-center gap-3 group font-mono rounded-[2px] shadow-[0_4px_30px_rgba(139,92,246,0.1)] hover:shadow-[0_4px_35px_rgba(139,92,246,0.35)] min-h-[44px]"
          >
            Let's Work Together
            <ArrowRight className="w-4 h-4 group-hover:translate-y-1.5 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );

  function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
