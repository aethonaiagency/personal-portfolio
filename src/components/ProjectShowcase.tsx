import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLazyLoadImage } from '../hooks/useLazyLoadImage';
import { ArrowRight, ExternalLink, Plus, Minus, CheckCircle, Flame, Eye, Maximize2 } from 'lucide-react';

import barbercropMockup from '../assets/images/barbercrop_template_1780834445279.png';
import hushSushiMockup from '../assets/images/hush_sushi_template_1780834466272.png';
import housifyMockup from '../assets/images/housify_template_1780834483302.png';
import turanOutfitMockup from '../assets/images/turanoutfit_template_1780834503086.png';
import wenLaunchMockup from '../assets/images/wen_launch_template_1780834519251.png';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: 'no-referrer' | 'unsafe-url' | 'origin';
  onClick?: () => void;
}

function LazyImage({ src, alt, className = '', referrerPolicy, onClick }: LazyImageProps) {
  const [containerRef, shouldLoad] = useLazyLoadImage(src);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#121212]">
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#161616] animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-mono tracking-widest text-[#8b5cf6]/40 uppercase">Loading Brand Asset...</span>
        </div>
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          onClick={onClick}
          className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

interface CaseStudy {
  id: string;
  title: string;
  niche: string;
  duration: string;
  role: string;
  problem: string;
  solution: string;
  techStack: string[];
  impactMetric: string;
  impactContext: string;
  image: string;
  liveUrl: string;
}

const featuredCaseStudies: CaseStudy[] = [
  {
    id: 'barbercrop',
    title: 'Barbercrop Barbershop Studio',
    niche: 'Men\'s Grooming & Salon Web Platform',
    duration: 'Ready Premium Template',
    role: 'Exclusive UI/UX Layout Design',
    problem: 'Traditional barber studio pages are standard, generic directories that fail to capture the sensory-rich premium heritage of vintage shaving and precision styling.',
    solution: 'Curated a bold visual framework using deep charcoals, vintage red coordinates, high-resolution header sections, and custom-structured menus for service transparency.',
    techStack: ['Vite', 'React v19', 'Tailwind CSS', 'Framer Motion'],
    impactMetric: '100%',
    impactContext: 'Pixel-perfect replica of the premium Barbercrop template design layout',
    image: barbercropMockup,
    liveUrl: '#'
  },
  {
    id: 'hush-sushi',
    title: 'Hush Modern Japanese Sushi Restaurant',
    niche: 'High-End Culinary & Reservation Platform',
    duration: 'Ready Premium Template',
    role: 'Sleek Front-End Developer',
    problem: 'Culinary storefronts typically lack visual focus on the dish quality, hiding actual visual menus behind frustrating PDF links or standard table indices.',
    solution: 'Developed a bold image-first layout framing ultra-saturated raw dish captures with a dark minimalist space, complete with structured hours metrics and real-time contact portals.',
    techStack: ['React v19', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons'],
    impactMetric: '100%',
    impactContext: 'Faithful restoration of the modern, ultra-luxury Hush Sushi aesthetic',
    image: hushSushiMockup,
    liveUrl: '#'
  },
  {
    id: 'housify',
    title: 'Housify Premium Property Match',
    niche: 'High-Net-Worth Property Listing Hub',
    duration: 'Ready Premium Template',
    role: 'Lead Visual Designer',
    problem: 'Aggregator sites feel cluttered and crowded, confusing buyers with millions of low-quality tiny cards.',
    solution: 'Crafted a majestic space-rich grid layout that elevates every listing to a distinct architectural masterwork, complete with bold price banners and high-trust agent metrics.',
    techStack: ['Sass', 'React v19', 'Tailwind CSS', 'CSS Grid Modules'],
    impactMetric: '100%',
    impactContext: 'Elite Swiss-style typography pairing and architectural layout alignment',
    image: housifyMockup,
    liveUrl: '#'
  },
  {
    id: 'turanoutfit',
    title: 'TuranOutfit Explorer Store',
    niche: 'Rugged Wilderness Gear E-Commerce',
    duration: 'Ready Premium Template',
    role: 'SaaS Storefront Architect',
    problem: 'Standard ecommerce websites present endless scrolling catalogs with no thematic styling, diluting the sense of adventure and product durability.',
    solution: 'Wrapped high-end product lists in a consistent charcoal-leather palette, featuring a cinematic mountain explorer hero banner and clean card structures for quick action conversions.',
    techStack: ['React v19', 'Tailwind CSS', 'Lucide Gear', 'AnimatePresence'],
    impactMetric: '100%',
    impactContext: 'Pristine, distraction-free product catalog layout with clear discount conversion hooks',
    image: turanOutfitMockup,
    liveUrl: '#'
  },
  {
    id: 'wenlaunch',
    title: 'Wen Launch Web3 Creative Agency',
    niche: 'Decentralized Multi-Service Tech Studio',
    duration: 'Ready Premium Template',
    role: 'Web3 Interface Pioneer',
    problem: 'SaaS and Web3 studios struggle to differentiate themselves, relying on bright purple gradients that have become a generic tech stereotype.',
    solution: 'Engineered a highly refined, cinematic workspace using classic serif typography paired with hyper-detailed 3D elements for elite modern clients.',
    techStack: ['React v19', 'Tailwind CSS', 'Framer Motion', '3D asset framing'],
    impactMetric: '100%',
    impactContext: 'True-to-source implementation of the high-contrast violet Web3 agency design',
    image: wenLaunchMockup,
    liveUrl: '#'
  }
];

export default function ProjectShowcase() {
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [activeLightboxTitle, setActiveLightboxTitle] = useState<string>('');

  return (
    <section id="work" className="relative bg-[#0d0d0d] py-16 sm:py-24 select-none border-b border-[#8b5cf6]/10 overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      {/* Spacing alignment matches modern 8px rules: py-24 (96px), px-6 (24px) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8b5cf6] block mb-3 text-left">
          Exclusive Portfolio
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold tracking-tight text-[#f5f5f0] text-left">
          Website Template <span className="serif-display text-[#8b5cf6] font-light italic">Showcase</span>
        </h2>
        <p className="text-sm md:text-base text-[#f5f5f0]/60 max-w-2xl text-left leading-relaxed mt-4 font-light">
          A curate exhibit of exquisite, multi-industry high-fidelity website templates. Move your cursor over the mockup cards to automatically scroll through full page structures, or click to expand at 100% resolution.
        </p>
      </div>

      {/* Case Studies Loop with Hover Scroll Previews & Lightbox Zoom */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {featuredCaseStudies.map((study, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start border-b border-white/5 pb-16 sm:pb-20 last:border-b-0 last:pb-0"
            >
              {/* Image Column - Alternates Left/Right to keep aesthetic rhythm */}
              <div className={`col-span-1 lg:col-span-6 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                {/* Scrolling Preview Mockup Container */}
                <div className="relative w-full h-[400px] sm:h-[485px] bg-[#121212] overflow-hidden rounded-[8px] border border-white/10 group flex items-start shadow-md hover:border-[#8b5cf6]/30 hover:shadow-[0_12px_32px_rgba(139,92,246,0.12)] transition-all duration-500">
                  
                  {/* Mock browser bar at the top with windows circles */}
                  <div className="absolute top-0 left-0 right-0 h-9 z-10 bg-[#161616] border-b border-white/5 flex items-center justify-between px-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/70" />
                    </div>
                    {/* Tiny responsive URL bar */}
                    <div className="w-2/3 max-w-[240px] h-4 bg-[#121212] border border-white/5 rounded-[3px] flex items-center justify-center select-none text-[7px] font-mono tracking-widest text-[#f5f5f0]/30 font-light">
                      templates.nashiat.dev/{study.id}
                    </div>
                    <div className="w-4 h-1" />
                  </div>
                  
                  {/* Floating helpful instruction element */}
                  <div className="absolute bottom-4 right-4 z-10 font-mono text-[8px] tracking-widest text-[#8b5cf6]/90 bg-[#0b0b0b]/90 border border-[#8b5cf6]/20 rounded-[2px] px-2.5 py-1.5 select-none pointer-events-none uppercase opacity-100 group-hover:opacity-0 transition-opacity duration-300 shadow-lg flex items-center gap-1.5">
                    <Maximize2 className="w-2.5 h-2.5" />
                    Hover to Scroll / Click to Zoom
                  </div>

                  {/* Scrollable image segment */}
                  <div className="w-full h-full pt-9 overflow-hidden relative">
                    <img
                      src={study.image}
                      alt={study.title}
                      onClick={() => {
                        setActiveLightboxImg(study.image);
                        setActiveLightboxTitle(study.title);
                      }}
                      className="absolute top-9 left-0 w-full h-auto cursor-zoom-in transition-transform duration-[7000ms] ease-in-out hover:translate-y-[calc(-100%+400px)] sm:hover:translate-y-[calc(-100%+485px-36px)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Tech Stack Horizontal track */}
                <div className="flex flex-wrap gap-2 pt-1 justify-start">
                  {study.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-mono tracking-wider px-2 py-1 bg-[#161616] border border-white/5 text-[#f5f5f0]/60 rounded-[2px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Text narrative and bento metrics column */}
              <div className={`col-span-1 lg:col-span-6 text-left flex flex-col justify-between ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-[10px] font-mono tracking-wider text-[#8b5cf6] uppercase">
                      {study.niche}
                    </span>
                    <span className="text-[9px] font-mono text-[#f5f5f0]/30">•</span>
                    <span className="text-[10px] font-mono text-[#f5f5f0]/50 tracking-wider uppercase">
                      {study.role}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif font-black text-[#f5f5f0] mb-4 sm:mb-6">
                    {study.title}
                  </h3>

                  {/* Problem & Solution breakdown layout */}
                  <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                    <div className="p-4 bg-[#121212]/80 border border-white/5 rounded-[4px]">
                      <h4 className="text-xs font-mono tracking-widest text-[#f5f5f0]/40 uppercase mb-1.5 flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        TEMPLATE PURPOSE
                      </h4>
                      <p className="text-xs md:text-sm text-[#f5f5f0]/70 font-sans font-light leading-relaxed">
                        {study.problem}
                      </p>
                    </div>

                    <div className="p-4 bg-[#121212]/80 border border-white/5 rounded-[4px]">
                      <h4 className="text-xs font-mono tracking-widest text-[#8b5cf6] uppercase mb-1.5 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#8b5cf6]" />
                        VISUAL LAYOUT DETAILS
                      </h4>
                      <p className="text-xs md:text-sm text-[#f5f5f0]/70 font-sans font-light leading-relaxed">
                        {study.solution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Outcome highlighting metric card */}
                <div className="bg-[#141416]/60 border border-[#8b5cf6]/20 p-4 rounded-[4px] flex items-center gap-4 justify-between">
                  <div className="text-left flex-1 pr-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/40 uppercase block mb-1">
                      LAYOUT RESOLUTION STATUS
                    </span>
                    <span className="text-xs sm:text-sm font-sans text-[#f5f5f0]/80 leading-snug">
                      {study.impactContext}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl sm:text-3xl font-display font-semibold text-[#8b5cf6] block leading-none">
                      {study.impactMetric}
                    </span>
                  </div>
                </div>

                {/* View Controls */}
                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-4 justify-start">
                  <button
                    onClick={() => {
                      setActiveLightboxImg(study.image);
                      setActiveLightboxTitle(study.title);
                    }}
                    className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b5cf6] hover:text-[#f5f5f0] transition-colors cursor-pointer touch-manipulation min-h-[36px]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8b5cf6]" />
                    View Full 1:1 Page Preview
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Breathtaking Portal Lightbox Modal for 100% Uncropped Previews */}
      <AnimatePresence>
        {activeLightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImg(null)}
            className="fixed inset-0 z-50 bg-[#0b0b0be3]/98 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl cursor-default overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/5 bg-[#121212]">
                <span className="text-xs font-mono font-bold tracking-widest text-[#8b5cf6] uppercase">
                  {activeLightboxTitle} — Mockup Layout Review
                </span>
                <button
                  onClick={() => setActiveLightboxImg(null)}
                  className="text-[#f5f5f0]/60 hover:text-[#8b5cf6] transition-all text-[11px] font-mono uppercase tracking-widest p-2 cursor-pointer border border-white/5 bg-[#161616] rounded hover:border-[#8b5cf6]/30"
                >
                  Close [X]
                </button>
              </div>
              
              {/* Core uncropped preview viewport with elegant scroll rails */}
              <div className="overflow-y-auto flex-1 p-4 sm:p-8 bg-[#040404] custom-scrollbar focus:outline-none">
                <div className="max-w-2xl mx-auto">
                  <img
                    src={activeLightboxImg}
                    alt={activeLightboxTitle}
                    className="w-full h-auto object-contain rounded-[4px] shadow-2xl select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between px-6 py-3.5 bg-[#121212] border-t border-white/5 text-[9px] font-mono text-[#f5f5f0]/40">
                <span>Use your mouse scroll or trackpad gesture to verify full layout design</span>
                <span className="text-[#8b5cf6]">100% VISUAL PRESERVATION</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
