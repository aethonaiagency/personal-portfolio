import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Calendar, ArrowRight, MessageSquare, ChevronDown } from 'lucide-react';
import { MasterBarType } from './ThreeBarsNavigation';

interface NavbarProps {
  onOpenBookModal: () => void;
  activeBar: MasterBarType;
  setActiveBar: (bar: MasterBarType) => void;
}

interface NavigationGroup {
  id: MasterBarType;
  index: string;
  label: string;
  description: string;
  items: { label: string; target: string; desc: string }[];
}

const navigationGroups: NavigationGroup[] = [
  {
    id: 'studio',
    index: '01',
    label: 'Studio',
    description: 'Expertise, Story, Biography',
    items: [
      { label: 'Creative Biography', target: 'about', desc: 'Who is Nashiat' },
      { label: 'The Creative Story', target: 'story', desc: 'Step-by-step career path' },
      { label: 'Technical Expertise', target: 'expertise', desc: 'High-performance stack' }
    ]
  },
  {
    id: 'work',
    index: '02',
    label: 'Work',
    description: 'Case Studies & Process',
    items: [
      { label: 'Selected projects', target: 'work', desc: 'Slight zoom visual cases' },
      { label: 'Design Process', target: 'process', desc: 'Development milestones' },
      { label: 'Client Feedback', target: 'testimonials', desc: 'Client trust & reviews' }
    ]
  },
  {
    id: 'client',
    index: '03',
    label: 'Inquire',
    description: 'Pricing, FAQs & Contact',
    items: [
      { label: 'Investment Plans', target: 'pricing', desc: 'Transparent tiered packages' },
      { label: 'Common Objections', target: 'faq', desc: 'Curated FAQ list' },
      { label: 'Start Your Project', target: 'contact', desc: 'Interactive brief questionnaire' }
    ]
  }
];

export default function Navbar({ onOpenBookModal, activeBar, setActiveBar }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGroupClick = (id: MasterBarType) => {
    setActiveBar(id);
    
    // Scroll to section root container past Hero
    const element = document.getElementById('portfolio-content-root');
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

  const handleSubItemClick = (barId: MasterBarType, target: string) => {
    setActiveBar(barId);
    setMobileMenuOpen(false);
    
    // Tiny delay to allow state changes to mount target sections in DOM
    setTimeout(() => {
      const element = document.getElementById(target);
      if (element) {
        const offset = 145; // custom offset past the sticky controller deck
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'py-4 bg-[#0b0b0b]/80 backdrop-blur-md border-b border-[#8b5cf6]/10' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-baseline gap-1 cursor-pointer group select-none"
          >
            <span className="text-2xl font-bold tracking-tighter text-[#f5f5f0] group-hover:text-[#8b5cf6] transition-colors">
              NASHIAT<span className="text-[#8b5cf6] font-light">.</span>
            </span>
          </div>

          {/* Desktop Nav Actions: 3 Clean Master Dropdowns (3 Bars) */}
          <nav className="hidden lg:flex items-center gap-10">
            {navigationGroups.map((group) => {
              const isGroupActive = activeBar === group.id;

              return (
                <div 
                  key={group.id} 
                  className="relative group py-2"
                >
                  <button
                    onClick={() => handleGroupClick(group.id)}
                    className={`text-xs tracking-widest uppercase font-mono transition-colors relative flex items-center gap-1.5 cursor-pointer bg-transparent border-none py-1.5 ${
                      isGroupActive ? 'text-[#8b5cf6] font-bold' : 'text-[#f5f5f0]/80 hover:text-[#8b5cf6]'
                    }`}
                  >
                    <span className="text-[10px] text-[#8b5cf6]/60 font-semibold">{group.index}.</span>
                    {group.label}
                    <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:text-[#8b5cf6] transition-transform group-hover:rotate-180 duration-300 pointer-events-none" />
                    
                    {isGroupActive && (
                      <motion.span 
                        layoutId="activeNavIndicator" 
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#8b5cf6]" 
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>

                  {/* Dropdown Box Menu */}
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-72 bg-[#121212]/95 backdrop-blur-lg border border-[#8b5cf6]/10 rounded-xl p-3 shadow-2xl opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="border-b border-white/5 pb-2 mb-2 px-1 text-left">
                      <span className="text-[8px] font-mono tracking-widest text-[#8b5cf6]/60 uppercase font-black">
                        COMPONENTS // BAR {group.index}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {group.items.map((subItem) => (
                        <button
                          key={subItem.target}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubItemClick(group.id, subItem.target);
                          }}
                          className="w-full text-left p-2 rounded-lg hover:bg-[#8b5cf6]/10 hover:text-white transition-all text-xs font-mono text-white/70 flex flex-col gap-0.5 group/item cursor-pointer"
                        >
                          <span className="font-bold tracking-wider group-hover/item:text-[#8b5cf6] text-[#f5f5f0]/95 transition-colors">
                            {subItem.label}
                          </span>
                          <span className="text-[9.5px] text-[#f5f5f0]/40 font-light truncate">
                            {subItem.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Status Metrics + Booking Button */}
          <div className="hidden lg:flex items-center gap-6">
            
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
              className="px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-lg flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              Book Call
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            {/* Quick Available Dot */}
            <div className="flex items-center gap-1.5 bg-[#121212] border border-[#8b5cf6]/10 px-2 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] animate-pulse"></span>
              <span className="text-[8px] font-mono tracking-wider text-[#8b5cf6]">OPEN</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-[#f5f5f0] hover:text-[#8b5cf6]"
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
            <div className="absolute inset-x-0 top-0 h-96 bg-[linear-gradient(to_bottom,rgba(139,92,246,0.05)_0%,transparent_100%)] pointer-events-none -z-10" />

            <div className="flex flex-col gap-6 mt-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b5cf6] font-mono border-b border-[#8b5cf6]/10 pb-2 text-left font-bold">
                Categorized Directory (3 Groups)
              </span>
              
              <nav className="flex flex-col gap-6 text-left">
                {navigationGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <button
                      onClick={() => handleGroupClick(group.id)}
                      className={`text-xs uppercase tracking-widest font-mono font-bold flex items-center justify-between w-full border-b border-white/5 pb-1 ${
                        activeBar === group.id ? 'text-[#8b5cf6]' : 'text-white/40'
                      }`}
                    >
                      <span>{group.index}. {group.label}</span>
                      <span className="text-[8.5px] font-light text-white/20 uppercase font-mono">{group.description}</span>
                    </button>
                    <div className="grid grid-cols-1 gap-1.5 pl-3">
                      {group.items.map((subItem) => (
                        <button
                          key={subItem.target}
                          onClick={() => handleSubItemClick(group.id, subItem.target)}
                          className="text-left py-2 text-[#f5f5f0] hover:text-[#8b5cf6] flex items-center justify-between group touch-manipulation cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="text-base font-medium tracking-tight group-hover:text-[#8b5cf6] transition-colors">
                              {subItem.label}
                            </span>
                            <span className="text-[10px] font-mono text-white/30 lowercase pl-0.5">
                              #{subItem.target}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 text-[#8b5cf6]" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-3.5 mt-8 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookModal();
                }}
                className="w-full py-3.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-[4px] flex items-center justify-center gap-2 transform active:scale-98 transition-transform cursor-pointer touch-manipulation min-h-[44px]"
              >
                <Calendar className="w-4 h-4 text-white" />
                Schedule Consultation
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSubItemClick('client', 'contact');
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

