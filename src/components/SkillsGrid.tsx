import { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Activity, Layers, Coins, Search } from 'lucide-react';
import { Skill } from '../types';

const coreSkills: (Skill & { icon: ReactNode; explanation: string; benefit: string })[] = [
  {
    name: 'Next.js & React 19',
    category: 'core',
    icon: <Layers className="w-5 h-5 text-[#8b5cf6]" />,
    explanation: 'Leveraging Server Components, high performance caching structures, and incremental regeneration mechanisms.',
    benefit: 'Saves 40% on layout compilation times, driving instantaneous interaction responses.'
  },
  {
    name: 'Tailwind CSS v4',
    category: 'design',
    icon: <Sparkles className="w-5 h-5 text-[#8b5cf6]" />,
    explanation: 'Sleek utility definitions, precompiled build-time CSS variables, and fluid container definitions.',
    benefit: 'Creates zero unused style overhead, delivering lightweight stylesheets under 15kb.'
  },
  {
    name: 'Framer Motion / Motion',
    category: 'design',
    icon: <Activity className="w-5 h-5 text-[#8b5cf6]" />,
    explanation: 'Physically calculated hover springs, touch gestures, and viewport tracking triggers.',
    benefit: 'Keeps frame rate steady at 60fps, giving digital products an expensive, tactile momentum.'
  },
  {
    name: 'Conversion Focused Landing Pages',
    category: 'core',
    icon: <Coins className="w-5 h-5 text-[#8b5cf6]" />,
    explanation: 'Deploying direct attention grids, clear budget visual tiers, and distraction-free forms.',
    benefit: 'Enhances client pipeline actions by an average of 200% over template portfolios.'
  },
  {
    name: 'Technical SEO Optimization',
    category: 'backend',
    icon: <Search className="w-5 h-5 text-[#8b5cf6]" />,
    explanation: 'Handwritten semantic schema files, meta parameters, responsive hydration tags, and blazing load states.',
    benefit: 'Gains maximum ranking score natively without expensive visual advertisement retainers.'
  },
  {
    name: 'System Deployment & Vercel',
    category: 'backend',
    icon: <Terminal className="w-5 h-5 text-[#8b5cf6]" />,
    explanation: 'Advanced edge-routing optimization, reliable CDN caching, and instantaneous git recovery logs.',
    benefit: 'Uptime guarantee of 99.99% with active monitoring diagnostics for secure operations.'
  },
];

interface SkillCardProps {
  skill: typeof coreSkills[0];
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

function SkillCard({ skill, isSelected, onClick, index }: SkillCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative p-6 rounded-xl border text-left cursor-pointer transition-all duration-500 overflow-hidden ${
        isSelected
          ? 'bg-[#121212] border-[#8b5cf6] shadow-[0_0_30px_rgba(139,92,246,0.15)] scale-[1.02]'
          : 'bg-[#121212]/30 border-white/5 hover:border-[#8b5cf6]/35 hover:scale-[1.01] hover:shadow-[0_15px_35px_rgba(139,92,246,0.06)]'
      }`}
    >
      {/* Target dynamic spotlight canvas gradient */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(130px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(139,92,246,0.11) 0%, transparent 100%)`,
        }}
      />
      
      {/* Animated subtle border glow layer hover */}
      <div 
        className="absolute inset-[1px] rounded-[11px] pointer-events-none border border-[#8b5cf6]/15 transition-opacity duration-500 z-0"
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              animate={isHovered ? { rotate: [0, 10, -10, 0], scale: 1.06 } : {}}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="p-2.5 rounded-[4px] bg-[#0b0b0b] border border-[#8b5cf6]/20"
            >
              {skill.icon}
            </motion.div>
            <span className="text-[9px] font-mono tracking-widest text-[#8b5cf6] uppercase font-bold">
              {skill.category}
            </span>
          </div>
          
          <h4 className="text-lg font-serif font-bold text-[#f5f5f0] mb-2 group-hover:text-[#8b5cf6] transition-colors duration-300">
            {skill.name}
          </h4>
          <p className="text-xs text-[#f5f5f0]/60 leading-relaxed font-light font-sans mb-4">
            {skill.explanation.slice(0, 95)}...
          </p>
        </div>
        
        <div className="flex justify-end gap-1.5 items-center font-mono text-[9px] text-[#8b5cf6] font-bold tracking-widest">
          <span>EXPAND SPECS</span>   
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.div>
  );
}

const marqueeSkillsLeft = [
  'Next.js', 'Tailwind CSS', 'Framer Motion', 'Conversion Optimization', 'SEO Architecture', 'Vercel CDN', 'UI/UX Design', 'React 19'
];

const marqueeSkillsRight = [
  'Bespoke Coding', 'Responsive Frameworks', 'Core Web Vitals', 'High Performance Systems', 'E-Commerce Engines', 'Stripe Systems', 'Figma Prototypes'
];

export default function SkillsGrid() {
  const [selectedSkill, setSelectedSkill] = useState<typeof coreSkills[0] | null>(null);

  // Triple duplicated items lists to ensure seamless smooth infinite animations
  const duplicatedLeft = [...marqueeSkillsLeft, ...marqueeSkillsLeft, ...marqueeSkillsLeft];
  const duplicatedRight = [...marqueeSkillsRight, ...marqueeSkillsRight, ...marqueeSkillsRight];

  return (
    <section id="expertise" className="relative bg-[#0d0d0d] py-16 sm:py-24 select-none overflow-hidden border-b border-[#8b5cf6]/10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-16">
        <div className="text-left max-w-xl">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8b5cf6] block mb-3">
            Core Stacks
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
            Handcrafted <span className="serif-display text-[#8b5cf6] font-light italic">Competence</span>
          </h3>
          <p className="text-sm text-[#f5f5f0]/50 font-sans mt-3">
            I don’t install bulky plugins or rely on bloated templates. Every technology in my toolkit is selected for raw speed, security, and rendering fluidity.
          </p>
        </div>
      </div>

      {/* Marquee Row Left */}
      <div className="border-t border-b border-white/[0.04] py-3.5 bg-[#0a0a0a] overflow-hidden flex w-full relative mb-3">
        <div className="flex animate-marquee gap-8 items-center whitespace-nowrap">
          {duplicatedLeft.map((skill, index) => (
            <div key={index} className="flex items-center gap-4 px-4 flex-shrink-0">
              <span className="text-sm md:text-lg font-heading font-bold text-[#f5f5f0] tracking-wide">
                {skill}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row Right */}
      <div className="border-b border-white/[0.04] py-3.5 bg-[#0a0a0a] overflow-hidden flex w-full relative mb-10 sm:mb-16">
        <div className="flex animate-marquee-reverse gap-8 items-center whitespace-nowrap">
          {duplicatedRight.map((skill, index) => (
            <div key={index} className="flex items-center gap-4 px-4 flex-shrink-0">
              <span className="text-sm md:text-lg font-heading font-medium text-[#f5f5f0]/40 tracking-wide lowercase italic">
                {skill}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid layout with Skills Detail Interactive pop out */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Skills Cards List */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreSkills.map((skill, index) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                index={index}
                isSelected={selectedSkill?.name === skill.name}
                onClick={() => setSelectedSkill(skill)}
              />
            ))}
          </div>

          {/* Dynamic Technical Specifications Board */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 bg-[#121212]/30 border border-white/5 rounded-[4px] p-6 md:p-8 text-left">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8b5cf6] mb-6">
              Diagnostic Deep-dive
            </h4>

            <AnimatePresence mode="wait">
              {selectedSkill ? (
                <motion.div
                  key={selectedSkill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-lg font-heading font-bold text-[#f5f5f0] mb-4">
                    {selectedSkill.name}
                  </p>

                  <div className="space-y-4 font-sans text-xs text-[#f5f5f0]/70 leading-relaxed font-light">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8b5cf6]/60 block mb-1">
                        Architecture details
                      </span>
                      <p className="bg-[#0b0b0b] p-3 rounded border border-white/5 text-[#f5f5f0]/80">
                        {selectedSkill.explanation}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8b5cf6]/60 block mb-1">
                        Commercial Client Impact
                      </span>
                      <p className="bg-[#8b5cf6]/5 p-3 rounded border border-[#8b5cf6]/10 text-white font-medium">
                        {selectedSkill.benefit}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="w-full mt-6 py-2 bg-transparent text-[#f5f5f0]/50 hover:text-[#8b5cf6] border border-white/10 hover:border-[#8b5cf6]/30 rounded font-mono text-[10px] tracking-widest uppercase transition-colors"
                  >
                    Close Specs
                  </button>
                </motion.div>
              ) : (
                <div className="h-44 flex flex-col justify-center items-center text-center opacity-40">
                  <Terminal className="w-8 h-8 text-[#8b5cf6] mb-3 animate-pulse" />
                  <p className="text-xs font-mono uppercase tracking-widest text-[#f5f5f0]/60">
                    Awaiting Input...
                  </p>
                  <p className="text-[10px] text-[#f5f5f0]/40 font-sans max-w-[180px] mt-1.5 leading-normal">
                    Click any expertise card to run a performance diagnostic scan
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
      
    </section>
  );
}
