import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useRef, useState } from 'react';
import { Compass, Target, Bolt, Sparkles } from 'lucide-react';

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Track scroll and update active highlighted segment to tell a progressive story
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.25) {
      setActiveSegment(0);
    } else if (latest < 0.5) {
      setActiveSegment(1);
    } else if (latest < 0.75) {
      setActiveSegment(2);
    } else {
      setActiveSegment(3);
    }
  });

  const stories = [
    {
      icon: <Compass className="w-5 h-5" />,
      tag: '01 / CREATIVE DIRECTION',
      highlight: 'I don’t just build websites.',
      body: 'I build digital experiences people remember. Experiences that pull users in, spark emotional alignment with your brand, and keep them engaged.',
    },
    {
      icon: <Target className="w-5 h-5 animate-pulse" />,
      tag: '02 / ARCHITECTURAL RIGOR',
      highlight: 'Every pixel has intention.',
      body: 'No stock layouts. No heavy widgets. Every border, image aspect, typography size, and color variable is tailored to capture luxury aesthetics.',
    },
    {
      icon: <Bolt className="w-5 h-5" />,
      tag: '03 / MOTION WITH PURPOSE',
      highlight: 'Every animation serves a purpose.',
      body: 'We avoid gratuitous bouncing. Animations act as directional signals, guiding attention to conversion zones, enhancing readability, and optimizing product discovery.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      tag: '04 / THE BOTTLENECK PROTOCOL',
      highlight: 'Built for speed. Built to convert. Built to feel premium.',
      body: 'Clean structured code renders under 100 milliseconds. Extreme speeds prevent customer bounces, establishing search engine authority and solidifying conversions.',
    }
  ];

  return (
    <section 
      id="story" 
      ref={containerRef}
      className="relative min-h-screen bg-[#0b0b0b] flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 border-b border-[#8b5cf6]/10"
    >
      {/* Background grid accents */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(270deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start relative z-10">
        
        {/* Left Side: Sticked Premium Title */}
        <div className="lg:col-span-4 lg:sticky lg:top-36 xl:top-40 self-start">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8b5cf6] block mb-3">
            Digital Vision
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-medium tracking-tight text-[#f5f5f0] mb-5 leading-tight">
            I build for brands that want to <span className="serif-display text-[#8b5cf6] font-light italic">leading-edge</span> the rest.
          </h3>
          <p className="text-[#f5f5f0]/60 text-sm md:text-base font-light font-sans max-w-sm leading-relaxed mb-6">
            A website shouldn't just look like a modern catalog. It is your ultimate 24/7 digital representative. I engineer luxury representations.
          </p>
 
          {/* Scrolling story tracking line */}
          <div className="flex gap-1.5 h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden mt-8">
            {stories.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-full flex-1 transition-all duration-500 rounded-full ${
                  activeSegment >= idx ? 'bg-[#8b5cf6]' : 'bg-[#2a2a2a]'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#f5f5f0]/40 mt-3">
            <span>DISCOVERY METRICS</span>
            <span>PHASE {activeSegment + 1} OF 4</span>
          </div>
        </div>
 
        {/* Right Side: Stacked scroll elements that respond */}
        <div className="lg:col-span-8 flex flex-col gap-8 md:gap-12 pl-0 lg:pl-12">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.15, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveSegment(idx)}
              className={`p-6 md:p-8 rounded-[4px] border transition-all duration-500 cursor-pointer ${
                activeSegment === idx 
                  ? 'bg-lux-card border-[#8b5cf6]/30 shadow-xl gold-glow' 
                  : 'bg-[#121212]/30 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`p-1.5 rounded-[2px] border transition-colors ${
                  activeSegment === idx 
                    ? 'text-[#8b5cf6] border-[#8b5cf6]/20 bg-[#8b5cf6]/5' 
                    : 'text-[#f5f5f0]/40 border-white/5'
                }`}>
                  {story.icon}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8b5cf6]">
                  {story.tag}
                </span>
              </div>

              <h4 className={`text-xl md:text-2xl font-serif font-black transition-colors mb-3 ${
                activeSegment === idx ? 'text-[#f5f5f0]' : 'text-[#f5f5f0]/70'
              }`}>
                {story.highlight}
              </h4>
              
              <p className={`text-sm md:text-base font-light leading-relaxed transition-all duration-500 ${
                activeSegment === idx ? 'text-[#f5f5f0]/80' : 'text-[#f5f5f0]/40'
              }`}>
                {story.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
