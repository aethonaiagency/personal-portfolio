import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Activity, Layers, Coins, Search } from 'lucide-react';
import { Skill } from '../types';

const coreSkills: (Skill & { icon: ReactNode; explanation: string; benefit: string })[] = [
  {
    name: 'Next.js & React 19',
    category: 'core',
    icon: <Layers className="w-5 h-5 text-[#c9a46c]" />,
    explanation: 'Leveraging Server Components, high performance caching structures, and incremental regeneration mechanisms.',
    benefit: 'Saves 40% on layout compilation times, driving instantaneous interaction responses.'
  },
  {
    name: 'Tailwind CSS v4',
    category: 'design',
    icon: <Sparkles className="w-5 h-5 text-[#c9a46c]" />,
    explanation: 'Sleek utility definitions, precompiled build-time CSS variables, and fluid container definitions.',
    benefit: 'Creates zero unused style overhead, delivering lightweight stylesheets under 15kb.'
  },
  {
    name: 'Framer Motion / Motion',
    category: 'design',
    icon: <Activity className="w-5 h-5 text-[#c9a46c]" />,
    explanation: 'Physically calculated hover springs, touch gestures, and smooth viewport tracking triggers.',
    benefit: 'Keeps frame rate steady at 60fps, giving digital products an expensive, tactile momentum.'
  },
  {
    name: 'Conversion Focused Landing Pages',
    category: 'core',
    icon: <Coins className="w-5 h-5 text-[#c9a46c]" />,
    explanation: 'Deploying direct attention grids, clear budget visual tiers, and distraction-free forms.',
    benefit: 'Enhances client pipeline actions by an average of 200% over template portfolios.'
  },
  {
    name: 'Technical SEO Optimization',
    category: 'backend',
    icon: <Search className="w-5 h-5 text-[#c9a46c]" />,
    explanation: 'Handwritten semantic schema files, meta parameters, responsive hydration tags, and blazing load states.',
    benefit: 'Gains maximum ranking score natively without expensive visual advertisement retainers.'
  },
  {
    name: 'System Deployment & Vercel',
    category: 'backend',
    icon: <Terminal className="w-5 h-5 text-[#c9a46c]" />,
    explanation: 'Advanced edge-routing optimization, reliable CDN caching, and instantaneous git recovery logs.',
    benefit: 'Uptime guarantee of 99.99% with active monitoring diagnostics for secure operations.'
  },
];

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
    <section id="expertise" className="relative bg-[#0d0d0d] py-16 sm:py-24 select-none overflow-hidden border-b border-[#c9a46c]/10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-16">
        <div className="text-left max-w-xl">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
            Core Stacks
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
            Handcrafted <span className="serif-display text-[#c9a46c] font-light italic">Competence</span>
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
              <span className="w-2 h-2 rounded-full bg-[#c9a46c]" />
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a46c]/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid layout with Skills Detail Interactive pop out */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Skills Cards List */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreSkills.map((skill) => (
              <div
                key={skill.name}
                onClick={() => setSelectedSkill(skill)}
                className={`p-6 rounded-[4px] border text-left cursor-pointer transition-all duration-300 ${
                  selectedSkill?.name === skill.name
                    ? 'bg-lux-card border-[#c9a46c] shadow-lg gold-glow'
                    : 'bg-[#121212]/50 border-white/5 hover:border-[#c9a46c]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-[2px] bg-[#0b0b0b] border border-[#c9a46c]/20">
                    {skill.icon}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-[#c9a46c] uppercase">
                    {skill.category}
                  </span>
                </div>
                
                <h4 className="text-lg font-serif font-bold text-[#f5f5f0] mb-2">
                  {skill.name}
                </h4>
                <p className="text-xs text-[#f5f5f0]/60 leading-relaxed font-light">
                  {skill.explanation.slice(0, 90)}...
                </p>
                
                <div className="flex justify-end gap-2 mt-4 items-center font-mono text-[9px] text-[#c9a46c]">
                  <span>EXPAND SPECS</span>   
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Technical Specifications Board */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 bg-[#121212]/30 border border-white/5 rounded-[4px] p-6 md:p-8 text-left">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a46c] mb-6">
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
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#c9a46c]/60 block mb-1">
                        Architecture details
                      </span>
                      <p className="bg-[#0b0b0b] p-3 rounded border border-white/5 text-[#f5f5f0]/80">
                        {selectedSkill.explanation}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#c9a46c]/60 block mb-1">
                        Commercial Client Impact
                      </span>
                      <p className="bg-[#c9a46c]/5 p-3 rounded border border-[#c9a46c]/10 text-white font-medium">
                        {selectedSkill.benefit}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="w-full mt-6 py-2 bg-transparent text-[#f5f5f0]/50 hover:text-[#c9a46c] border border-white/10 hover:border-[#c9a46c]/30 rounded font-mono text-[10px] tracking-widest uppercase transition-colors"
                  >
                    Close Specs
                  </button>
                </motion.div>
              ) : (
                <div className="h-44 flex flex-col justify-center items-center text-center opacity-40">
                  <Terminal className="w-8 h-8 text-[#c9a46c] mb-3 animate-pulse" />
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
