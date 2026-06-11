import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRight, MessageSquare, Globe, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import Magnetic from './Magnetic';

interface NavbarProps {
  onOpenBookModal: () => void;
}

export default function Navbar({ onOpenBookModal }: NavbarProps) {
  const [scrolledVal, setScrolledVal] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Keep a live tick of user's or studio's timezone for elegant editorial detailing
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(now) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledVal(Math.min(window.scrollY / 180, 1));
    };
    window.addEventListener('scroll', handleScroll);
    
    // Auto-detect currently visible section using IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -35% 0px',
      threshold: 0,
    };

    const targetSections = ['about', 'work', 'story', 'process', 'expertise', 'testimonials', 'pricing', 'faq', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    targetSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Soft lock body zoom/scroll when global menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 88; // height of navbar
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

  const menuItems = [
    { label: 'About Studio', target: 'about', desc: 'Craft ethos & digital philosophy' },
    { label: 'Selected Work', target: 'work', desc: 'High-end production case studies' },
    { label: 'Development Story', target: 'story', desc: 'Saturating milestones and tech stacks' },
    { label: 'Strategic Process', target: 'process', desc: 'Structured, sprint-based executions' },
    { label: 'Core Expertise', target: 'expertise', desc: 'Hardened web & client-side architectures' },
    { label: 'Real Reviews', target: 'testimonials', desc: 'Client trust and professional approvals' },
    { label: 'Pricing Plans', target: 'pricing', desc: 'Standardized tier specifications' },
    { label: 'Frequent Queries', target: 'faq', desc: 'Answers to crucial architectural thoughts' },
    { label: 'Initiate Brief', target: 'contact', desc: 'Say hello and define your custom project' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundColor: `rgba(11, 11, 11, ${scrolledVal * 0.85})`,
          backdropFilter: `blur(${scrolledVal * 16}px)`,
          borderBottom: `1px solid rgba(139, 92, 246, ${scrolledVal * 0.12})`,
        }}
        className="fixed top-0 left-0 right-0 z-40 py-4 sm:py-5 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <Magnetic range={40} strength={0.25}>
            <div 
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-baseline gap-1 cursor-pointer group select-none py-1.5"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tighter text-[#f5f5f0] group-hover:text-[#8b5cf6] transition-colors duration-300">
                NASHIAT<span className="text-[#8b5cf6] font-light">.</span>
              </span>
            </div>
          </Magnetic>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Elegant Status Indicator (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2.5 bg-[#121212] border border-white/5 px-4 py-2 select-none rounded-[4px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] font-medium text-[#f5f5f0]/80">
                Available for Contract
              </span>
            </div>

            {/* Book Call CTA (Desktop Only) */}
            <div className="hidden sm:block">
              <Magnetic>
                <button
                  onClick={onOpenBookModal}
                  className="px-4.5 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-[10px] uppercase tracking-widest font-bold rounded flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  Book Call
                </button>
              </Magnetic>
            </div>

            {/* THREE-LINE EXQUISITE MENU BUTTON (Show everywhere to consolidate sections) */}
            <button
              id="global-menu-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] border border-white/10 hover:border-[#8b5cf6]/40 transition-all duration-300 rounded-full cursor-pointer select-none group min-h-[40px] z-50 pointer-events-auto"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#f5f5f0]/80 group-hover:text-[#8b5cf6]">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
              
              {/* Three animated lines custom stack */}
              <div className="flex flex-col gap-[4px] w-4 items-end justify-center">
                <motion.span 
                  animate={menuOpen ? { rotate: 45, y: 5.5, width: "16px" } : { rotate: 0, y: 0, width: "16px" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[1.5px] bg-[#f5f5f0] group-hover:bg-[#8b5cf6] block rounded"
                />
                <motion.span 
                  animate={menuOpen ? { opacity: 0, width: "0px" } : { opacity: 1, width: "11px" }}
                  transition={{ duration: 0.2 }}
                  className="h-[1.5px] bg-[#f5f5f0] group-hover:bg-[#8b5cf6] block rounded"
                />
                <motion.span 
                  animate={menuOpen ? { rotate: -45, y: -5.5, width: "16px" } : { rotate: 0, y: 0, width: "16px" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[1.5px] bg-[#f5f5f0] group-hover:bg-[#8b5cf6] block rounded"
                />
              </div>
            </button>
          </div>

        </div>
      </motion.header>

      {/* LUXURY SLIDE-OUT DRAWER FOR DIRECTORY STRUCTURE */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#070707] z-30 flex flex-col justify-between overflow-hidden"
          >
            {/* Absolute background patterns */}
            <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none -z-10" />
            
            {/* Subtle premium scanning lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.005)_50%)] bg-[length:100%_4px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 h-[calc(100vh-100px)] overflow-y-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* Left Column: Studio branding & contacts */}
              <div className="lg:col-span-4 hidden lg:flex flex-col justify-between h-full space-y-12 pr-6 border-r border-white/5">
                
                {/* Meta details */}
                <div className="space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 font-mono text-[8px] uppercase tracking-widest text-[#8b5cf6] font-bold">
                    <Globe className="w-2.5 h-2.5 animate-spin-slow" />
                    <span>Sync Status Connected</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">Time Metrics</span>
                    <span className="text-sm font-mono text-white/95 font-medium">{localTime}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">Corporate Base</span>
                    <span className="text-xs text-white/80 leading-relaxed font-sans flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#8b5cf6]" /> Dhaka, Bangladesh
                    </span>
                  </div>
                </div>

                {/* Live Contacts block */}
                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8b5cf6] font-bold block">Digital Inboxes</span>
                  
                  <a
                    href="mailto:nashiathossain@gmail.com"
                    className="group flex items-center gap-3 text-xs font-mono text-white/70 hover:text-[#8b5cf6] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#8b5cf6]/60 group-hover:text-[#8b5cf6]" />
                    <span>nashiathossain@gmail.com</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300 text-[#8b5cf6]" />
                  </a>

                  <div className="pt-2">
                    <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase block mb-1">Response Guarantee</span>
                    <span className="text-[10px] font-sans text-emerald-400 font-semibold">// Within 12 operational hours</span>
                  </div>
                </div>

                <div className="space-y-2 pt-6 text-left border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                  <span>Nashiat Hossain Portfolio</span>
                  <p>© 2026 Studio. All rights reserved.</p>
                </div>
              </div>

              {/* Right Column: Dynamic Directory Sections */}
              <div className="lg:col-span-8 flex flex-col space-y-6">
                <span className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#8b5cf6] font-mono border-b border-[#8b5cf6]/20 pb-2 text-left font-bold flex justify-between items-center select-none">
                  <span>DIRECTORY NAVIGATION INDEX</span>
                  <span className="text-emerald-400/80 font-normal">[{menuItems.length} SECTIONS ACTIVE]</span>
                </span>

                <nav className="flex flex-col divide-y divide-white/[0.04]">
                  {menuItems.map((item, index) => {
                    const isFullyActive = activeSection === item.target;
                    return (
                      <motion.button
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        key={item.target}
                        onClick={() => scrollToSection(item.target)}
                        className="group flex flex-col md:flex-row md:items-center justify-between text-left py-4 px-2 hover:bg-white/[0.02] rounded-lg transition-all cursor-pointer w-full border-none bg-transparent"
                      >
                        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-8">
                          {/* Staggered Index designator */}
                          <div className="font-mono text-[9px] sm:text-[10px] tracking-wider text-white/30 group-hover:text-[#8b5cf6]/80 font-bold w-6 sm:w-8 select-none">
                            0{index + 1}.
                          </div>

                          {/* Navigation title with spring dynamic font scales */}
                          <div className="space-y-0.5">
                            <span className={`text-[#f5f5f0] group-hover:text-[#8b5cf6] text-base sm:text-lg md:text-xl font-medium tracking-tight transition-all duration-300 block ${
                              isFullyActive ? 'text-[#8b5cf6] font-bold translate-x-1 border-l-2 border-l-[#8b5cf6] pl-2' : ''
                            }`}>
                              {item.label}
                            </span>
                            <span className="text-[10px] text-white/40 block font-normal group-hover:text-[#f5f5f0]/60 transition-colors">
                              {item.desc}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto mt-2 md:mt-0 font-mono text-[9px] uppercase tracking-wider text-white/20 group-hover:text-[#8b5cf6] transition-colors select-none">
                          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-sans">
                            VIEW MODULE
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform text-white/30 group-hover:text-[#8b5cf6]" />
                        </div>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

            </div>

            {/* Bottom Panel Drawer Actions (Mobile Only) */}
            <div className="lg:hidden p-6 bg-[#0a0a0a] border-t border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenBookModal();
                  }}
                  className="py-3 px-3 bg-[#8b5cf6] text-white font-mono text-[10px] uppercase tracking-widest font-bold rounded flex items-center justify-center gap-1.5 transform active:scale-98 transition-transform cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Call
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToSection('contact');
                  }}
                  className="py-3 px-3 bg-white/[0.04] text-white border border-white/10 font-mono text-[10px] uppercase tracking-widest font-bold rounded flex items-center justify-center gap-1.5 transform active:scale-98 transition-transform cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  Contact
                </button>
              </div>

              <div className="flex justify-between items-center text-[8px] font-mono text-white/30 select-none">
                <span>Daka local time: {localTime}</span>
                <span>NASHIAT © 2026</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
