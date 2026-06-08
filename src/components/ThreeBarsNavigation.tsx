import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, MessageSquare, ArrowDown, Compass, Eye, ShieldCheck } from 'lucide-react';

export type MasterBarType = 'studio' | 'work' | 'client';

interface ThreeBarsNavigationProps {
  activeBar: MasterBarType;
  onChangeBar: (bar: MasterBarType) => void;
}

interface BarOption {
  id: MasterBarType;
  index: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentText: string;
}

const barOptions: BarOption[] = [
  {
    id: 'studio',
    index: '01',
    label: 'The Studio',
    description: 'Aesthetic Story, Philosophy & Expert Skillset',
    icon: <Compass className="w-5 h-5 text-[#8b5cf6]" />,
    accentText: 'BIOGRAPHY & ARCHITECTURE'
  },
  {
    id: 'work',
    index: '02',
    label: 'The Showcase',
    description: 'High-Fidelity Replicas, Systems & Reviews',
    icon: <Eye className="w-5 h-5 text-[#8b5cf6]" />,
    accentText: 'EXPLORE LIVE PROTO-TEMPLATES'
  },
  {
    id: 'client',
    index: '03',
    label: 'The Pipeline',
    description: 'Bespoke Valuation, FAQ Answers & Client Intake',
    icon: <MessageSquare className="w-5 h-5 text-[#8b5cf6]" />,
    accentText: 'CUSTOM COMMISSION BRIEFS'
  }
];

export default function ThreeBarsNavigation({ activeBar, onChangeBar }: ThreeBarsNavigationProps) {
  
  const handleBarClick = (id: MasterBarType) => {
    onChangeBar(id);
    
    // Smooth scroll down to the content container past the busy Hero
    const element = document.getElementById('portfolio-content-root');
    if (element) {
      const offset = 80; // offset of navbar
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

  return (
    <div id="portfolio-content-root" className="sticky top-[68px] z-30 w-full bg-[#0b0b0b]/90 backdrop-blur-md border-y border-[#8b5cf6]/10 py-4 shadow-xl select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Helper title tag */}
        <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-[#f5f5f0]/30 uppercase mb-3 px-1">
          <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-[#8b5cf6]" /> Interactive Navigation Deck</span>
          <span>Switching updates content layouts instantly</span>
        </div>

        {/* The 3 Core Navigation Bars (Grid-based, premium interactive cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {barOptions.map((option) => {
            const isActive = activeBar === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleBarClick(option.id)}
                className={`relative group text-left px-5 py-4 border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 min-h-[84px] select-none flex flex-col justify-between ${
                  isActive 
                    ? 'bg-[#121212] border-[#8b5cf6] shadow-[0_4px_24px_rgba(139,92,246,0.15)]' 
                    : 'bg-[#121212]/30 border-white/5 hover:border-[#8b5cf6]/30 hover:bg-[#121212]/60'
                }`}
              >
                {/* Active Glowing underline slider effect */}
                {isActive && (
                  <motion.div 
                    layoutId="activeBarHighlight"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-[#8b5cf6]"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}

                {/* Top horizontal line details */}
                <div className="flex items-center justify-between w-full h-fit gap-2">
                  <span className={`text-[10px] font-mono tracking-widest ${isActive ? 'text-[#8b5cf6] font-bold' : 'text-white/30'}`}>
                    BAR {option.index} // {option.accentText}
                  </span>
                  
                  {/* Glowing active indicator light */}
                  {isActive ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]"></span>
                    </span>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-[#8b5cf6]/35 transition-colors" />
                  )}
                </div>

                {/* Active Text Title */}
                <div className="flex items-center gap-3 mt-1.5">
                  <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]' : 'bg-[#161616] text-white/40 group-hover:text-[#8b5cf6]/70'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-sans font-bold tracking-tight transition-colors ${isActive ? 'text-[#f5f5f0]' : 'text-[#f5f5f0]/60 group-hover:text-[#f5f5f0]'}`}>
                      {option.label}
                    </h4>
                    <p className={`text-[10.5px] font-sans font-light tracking-wide line-clamp-1 leading-snug ${isActive ? 'text-[#f5f5f0]/80' : 'text-[#f5f5f0]/40 group-hover:text-[#f5f5f0]/50'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>

              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
