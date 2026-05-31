import { motion } from 'motion/react';
import { Compass, Lightbulb, PenTool, Code, Rocket, ArrowRight } from 'lucide-react';
import { ProcessStep } from '../types';

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery & Analytics Audit',
    description: 'We tear down historical performance, analyze competitor visual paths, and define direct key performance indicators.',
    details: ['Competitive benchmarking', 'High-value keyword outline', 'Technical bottleneck audit']
  },
  {
    number: '02',
    title: 'Interaction Strategy Matrix',
    description: 'Fleshing out information architecture, defining high-converting CTA zones, and scheduling the full wireframe map.',
    details: ['User psychological wireframing', 'Typography hierarchy check', 'Sitemap confirmation']
  },
  {
    number: '03',
    title: 'High-Fidelity Figma Styling',
    description: 'Delivering bespoke high-fidelity designs dressed in premium colorways, custom layouts, and custom-guided motion models.',
    details: ['Bespoke luxury desktop designs', 'Lightweight mobile layout maps', 'Interactive high-fi prototype']
  },
  {
    number: '04',
    title: 'Handcrafted TypeScript Code',
    description: 'Writing blazing-fast, semantic React / Next.js code with clean tailset utility structures and beautiful Framer Motion parameters.',
    details: ['Blazing 100ms load responses', 'Highly robust code hierarchy', 'Responsive viewport alignments']
  },
  {
    number: '05',
    title: 'Optimized Deployment & Launch',
    description: 'Conducting double-tier audits across performance engines, configuring analytical dashboards, and pressing standard domain releases.',
    details: ['Comprehensive double device check', 'Lighthouse score verification', 'Google Analytics dashboard link']
  },
];

const iconsList = [
  <Compass className="w-5 h-5 text-[#c9a46c]" />,
  <Lightbulb className="w-5 h-5 text-[#c9a46c]" />,
  <PenTool className="w-5 h-5 text-[#c9a46c]" />,
  <Code className="w-5 h-5 text-[#c9a46c]" />,
  <Rocket className="w-5 h-5 text-[#c9a46c]" />,
];

export default function ProcessTimeline() {
  return (
    <section id="process" className="relative bg-[#0b0b0b] py-24 px-6 overflow-hidden border-b border-[#c9a46c]/10">
      
      {/* Background ambient gold orb */}
      <div className="absolute bottom-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.03)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
          The Workflow Blueprint
        </span>
        <h3 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
          How We <span className="serif-display text-[#c9a46c] font-light italic">Build Success</span>
        </h3>
        <p className="text-sm text-[#f5f5f0]/50 max-w-lg mx-auto font-sans mt-3">
          Our process eliminates random design drafts. Every phase is deliberate and benchmarked against your commercial expectations.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Vertical Central Line */}
        <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#c9a46c]/50 via-[#c9a46c]/10 to-transparent pointer-events-none md:-translate-x-1/2" />

        {/* Timeline blocks */}
        <div className="space-y-12 md:space-y-16">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0"
              >
                
                {/* Visual Icon Node in Center */}
                <div className="absolute left-[20px] md:left-1/2 w-10 h-10 -translate-x-[19px] md:-translate-x-5 rounded-full bg-[#121212] border-2 border-[#c9a46c] flex items-center justify-center z-10 shadow-lg gold-glow">
                  {iconsList[index]}
                </div>

                {/* Left block (Desktop Only) */}
                <div className={`hidden md:block w-[45%] text-left ${isEven ? 'md:text-right' : 'opacity-0 pointer-events-none'}`}>
                  {isEven && (
                    <div>
                      <span className="text-5xl font-display font-black text-[#c9a46c]/15 select-none tracking-widest block mb-1">
                        {step.number}
                      </span>
                      <h4 className="text-lg font-serif font-black text-[#f5f5f0] mb-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#f5f5f0]/50 font-sans max-w-sm ml-auto">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right block or Mobile unified block */}
                <div className="w-full md:w-[45%] pl-10 md:pl-0 text-left">
                  
                  {/* Mobile title elements */}
                  <div className="md:hidden">
                    <span className="text-3xl font-display font-black text-[#c9a46c] opacity-30 select-none block mb-1">
                      {step.number}
                    </span>
                    <h4 className="text-lg font-serif font-black text-[#f5f5f0] mb-2">
                      {step.title}
                    </h4>
                  </div>

                  {/* Desktop Right (isEven === false) */}
                  {!isEven && (
                    <div className="hidden md:block">
                      <span className="text-5xl font-display font-black text-[#c9a46c]/15 select-none tracking-widest block mb-1">
                        {step.number}
                      </span>
                      <h4 className="text-lg font-serif font-black text-[#f5f5f0] mb-2">
                        {step.title}
                      </h4>
                    </div>
                  )}

                  <p className="text-xs md:text-sm text-[#f5f5f0]/60 font-sans leading-relaxed mb-4 max-w-md">
                    {/* fallback mobile description */}
                    <span className="md:hidden block mb-3">{step.description}</span>
                    <span className="hidden md:block">{step.description}</span>
                  </p>

                  {/* Actionable deliverables nested list */}
                  <ul className="space-y-1.5 p-3 rounded-[4px] bg-[#121212]/80 border border-white/5 max-w-md">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2 text-[10px] font-mono text-[#f5f5f0]/70">
                        <ArrowRight className="w-2.5 h-2.5 text-[#c9a46c]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
