import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Calendar, ArrowRight, MessageSquare, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenBookModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ onOpenBookModal, theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
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
    { label: 'About', target: 'about' },
    { label: 'Work', target: 'work' },
    { label: 'Story', target: 'story' },
    { label: 'Process', target: 'process' },
    { label: 'Expertise', target: 'expertise' },
    { label: 'Testimonials', target: 'testimonials' },
    { label: 'Pricing', target: 'pricing' },
    { label: 'FAQ', target: 'faq' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'py-4 bg-[#0b0b0b]/80 backdrop-blur-md border-b border-[#c9a46c]/10' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-baseline gap-1 cursor-pointer group select-none"
          >
            <span className="text-2xl font-bold tracking-tighter text-[#f5f5f0] group-hover:text-[#c9a46c] transition-colors">
              NASHIAT<span className="text-[#c9a46c] font-light">.</span>
            </span>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollToSection(item.target)}
                className="text-xs tracking-widest uppercase font-mono text-[#f5f5f0]/70 hover:text-[#c9a46c] transition-colors py-2 relative group cursor-pointer"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9a46c] transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Status Metrics + Booking Button */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-full border border-white/5 bg-[#121212] hover:bg-[#c9a46c] hover:text-[#0b0b0b] text-[#f5f5f0] transition-all cursor-pointer flex items-center justify-center shadow-sm hover:scale-105 active:scale-95"
              title={theme === 'dark' ? "Switch to Minimalist Light" : "Switch to Luxury Dark"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Elegant Status indicator */}
            <div className="flex items-center gap-2.5 bg-[#121212] border border-white/5 px-4 py-2.5 select-none rounded-[4px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-medium text-[#f5f5f0]/80">
                Available for hire
              </span>
            </div>

            <button
              onClick={onOpenBookModal}
              className="px-5 py-2.5 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-bold rounded-lg flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Call
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            {/* Quick Available Dot */}
            <div className="flex items-center gap-1.5 bg-[#121212] border border-[#c9a46c]/10 px-2 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a46c] animate-pulse"></span>
              <span className="text-[8px] font-mono tracking-wider text-[#c9a46c]">OPEN</span>
            </div>

            {/* Theme Toggle Button (Mobile) */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full border border-white/5 bg-[#121212] text-[#f5f5f0] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              title={theme === 'dark' ? "Switch to Minimalist Light" : "Switch to Luxury Dark"}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-[#f5f5f0] hover:text-[#c9a46c]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Curtain Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0b0b0b]/98 z-30 pt-24 px-6 md:px-10 flex flex-col justify-between pb-8 overflow-y-auto lg:hidden"
          >
            {/* Background design lines */}
            <div className="absolute inset-x-0 top-0 h-96 bg-[linear-gradient(to_bottom,rgba(201,164,108,0.05)_0%,transparent_100%)] pointer-events-none -z-10" />

            <div className="flex flex-col gap-5 mt-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a46c] font-mono border-b border-[#c9a46c]/10 pb-2 text-left">
                Navigation Directory
              </span>
              <nav className="flex flex-col gap-2.5 text-left">
                {menuItems.map((item) => (
                  <button
                    key={item.target}
                    onClick={() => scrollToSection(item.target)}
                    className="text-xl font-heading font-semibold text-[#f5f5f0] hover:text-[#c9a46c] text-left transition-colors flex items-center justify-between group py-2.5 cursor-pointer touch-manipulation"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-70 text-[#c9a46c]" />
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-3.5 mt-8 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookModal();
                }}
                className="w-full py-3.5 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-bold rounded-[4px] flex items-center justify-center gap-2 transform active:scale-98 transition-transform cursor-pointer touch-manipulation min-h-[44px]"
              >
                <Calendar className="w-4 h-4" />
                Schedule Consultation
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection('contact');
                }}
                className="w-full py-3.5 bg-transparent hover:bg-white/5 text-[#f5f5f0] border border-[#f5f5f0]/20 font-mono text-xs uppercase tracking-widest font-semibold rounded-[4px] flex items-center justify-center gap-2 transform active:scale-98 transition-transform cursor-pointer touch-manipulation min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4" />
                Drop me a line
              </button>
              
              <div className="flex justify-between items-center text-[9px] font-mono text-[#f5f5f0]/30 mt-4 pt-4 border-t border-[#f5f5f0]/10">
                <span>NASHIAT © 2026</span>
                <span>AVAILABLE WORLDWIDE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
