import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLazyLoadImage } from '../hooks/useLazyLoadImage';
import { Project } from '../types';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: 'no-referrer' | 'unsafe-url' | 'origin';
}

function LazyImage({ src, alt, className = '', referrerPolicy }: LazyImageProps) {
  const [containerRef, shouldLoad] = useLazyLoadImage(src);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#121212]">
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#161616] animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-mono tracking-widest text-[#c9a46c]/40 uppercase">Loading Brand Asset...</span>
        </div>
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
import { ArrowRight, ExternalLink, ShieldCheck, Zap, Layers, Plus, Minus, CheckCircle, Flame } from 'lucide-react';

import verdantMockup from '../assets/images/verdant_mockup_1780199592763.png';
import cryptoxMockup from '../assets/images/cryptox_mockup_1780199575468.png';
import glasshavenMockup from '../assets/images/glasshaven_mockup_1780199607688.png';
import devialetMockup from '../assets/images/devialet_mockup_1780211564112.png';
import neovisionMockup from '../assets/images/neovision_mockup_1780211587549.png';

import agenvoMockup from '../assets/images/portfolio_agenvo_1780296855649.png';
import travelTimeMockup from '../assets/images/portfolio_travel_time_1780296871512.png';
import visitTokyoMockup from '../assets/images/portfolio_visit_tokyo_1780296887033.png';
import creativeDirectorMockup from '../assets/images/portfolio_creative_director_1780296901774.png';
import fitnessClubMockup from '../assets/images/portfolio_fitness_club_1780296928406.png';

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
    id: 'verdant',
    title: 'Verdant AI Enterprise Engine',
    niche: 'Organic AI Grow & Telemetry Platform',
    duration: '7 Weeks Production',
    role: 'Lead UI/UX Craft Developer',
    problem: 'Enterprise clients found standard environmental charts dry and complex, leading to low feature engagement and a high trial-to-paid dropoff rate.',
    solution: 'Engineered a dark glassmorphic telemetry console with live WebSocket updates, hardware-accelerated layouts, and intuitive sensor overlays that visualize predictions directly.',
    techStack: ['React v19', 'Tailwind CSS', 'Framer Motion', 'WebSockets'],
    impactMetric: '+42%',
    impactContext: 'Surge in Inbound Enterprise Accounts & Trial Confidence',
    image: verdantMockup,
    liveUrl: 'https://verdant.ai.nashiat.dev'
  },
  {
    id: 'devialet',
    title: 'Devialet Symphonic Storefront',
    niche: 'Luxury Hardware E-Commerce Experience',
    duration: '8 Weeks Production',
    role: 'Creative Motion Lead',
    problem: 'Standard rigid ecommerce grids failed to express luxury sound depth online, leaving ultra-luxury buyers disengaged and keeping conversion rates low.',
    solution: 'Developed a headless product catalog integrating the Web Audio API with mouse-scroll kinetic audio waveform layers that react directly to buyer scroll velocity.',
    techStack: ['React v19', 'Web Audio API', 'Stripe API', 'Tailwind CSS'],
    impactMetric: '+48.3%',
    impactContext: 'Immediate Lift in Checkout Conversions & Session Inquiries',
    image: devialetMockup,
    liveUrl: 'https://devialet.audio.nashiat.dev'
  },
  {
    id: 'agenvo',
    title: 'Agenvo Architect Gallery',
    niche: 'Sovereign Architectural Engineering & 3D planning Portal',
    duration: '6 Weeks Production',
    role: 'Principal UI/UX Architect',
    problem: 'Static architectural blueprints failed to engage premium property investors, leading to prolonged sales close windows and flat project registration indices.',
    solution: 'Designed an elegant golden-and-dark-charcoal virtual catalog presenting responsive vector blueprint configurations and animated coordinates overlays.',
    techStack: ['React v19', 'Tailwind CSS', 'Framer Motion', 'SVG Viewport'],
    impactMetric: '+54.2%',
    impactContext: 'Boost in High-Net-Worth Real Estate Bookings & Registrations',
    image: agenvoMockup,
    liveUrl: 'https://agenvo.architects.nashiat.dev'
  }
];

const archiveProjects: Project[] = [
  {
    id: 'cryptox',
    title: 'Cryptox Decentralized Ledger Suite',
    niche: 'Web3 Futures Algorithmic Trading Console',
    tools: ['React v19', 'D3.js Charts', 'Tailwind v4', 'Web Workers'],
    description: 'An intense, neon-orange glowing high-performance interface displaying live cryptocurrency volatility, asset books, and margin transaction routing.',
    fullChallenge: 'Cryptox required a supercomputer cockpit dashboard capable of streaming live cryptocurrency feeds and global transaction metrics under 4ms.',
    fullOutcome: 'Integrated lightweight background Web Workers to compute data feeds dynamically. Wrapped in a stunning customized futuristic ambient glow theme, transaction latency collapsed by 29.5%.',
    image: cryptoxMockup,
    liveUrl: 'https://cryptox.exchange.nashiat.dev',
    duration: '5 Weeks Production',
    role: 'Full Stack Systems Architect'
  },
  {
    id: 'glasshaven',
    title: 'Glasshaven Modern Architect Showcase',
    niche: 'High-End Architectural Portfolio & Structural Planning Hub',
    tools: ['Vite', 'SVG Blueprints', 'Framer Motion Code', 'Tailwind CSS'],
    description: 'A whisper-quiet, ultra-minimalist catalog showcasing award-winning glass villas, property outlines, and custom floor plans with fluid kinetic transition velocity.',
    fullChallenge: 'Glasshaven requested an elegant showcase representing high-end physical architectural designs targeting premium buyers.',
    fullOutcome: 'Authored an editorial, space-friendly grid layout, loaded SVG interactive blueprint coordinates, and tailored smooth spring scrolling.',
    image: glasshavenMockup,
    liveUrl: 'https://glasshaven.architects.nashiat.dev',
    duration: '6 Weeks Production',
    role: 'Lead Creative Developer'
  },
  {
    id: 'neovision',
    title: 'NeoVision Spatial Universe',
    niche: 'Futuristic MR/VR Virtual Ecosystem Hub',
    tools: ['React v19', 'Three.js WebGL', 'Framer Motion', 'Tailwind CSS'],
    description: 'A dark, cinematic hardware landing platform detailed with beautiful physical interactive wireframes, biometric feeds, and holographic visualizer decks.',
    fullChallenge: 'NeoVision requested an imposing spatial system showcase displaying futuristic mixed-reality wearables without dragging framerates on lower-end devices.',
    fullOutcome: 'Engineered lightweight modular viewport containers built over responsive lazy-load logic, maintaining a lightning-fast average loading timestamp of 180ms.',
    image: neovisionMockup,
    liveUrl: 'https://neovision.future.nashiat.dev',
    duration: '5 Weeks Production',
    role: 'Full Stack Interaction Engineer'
  },
  {
    id: 'traveltime',
    title: 'Travel Time Expeditions',
    niche: 'Experiential Travel Booking Hub & Destination Catalog',
    tools: ['Vite / TS', 'Tailwind CSS', 'Motion React', 'Mapbox Core'],
    description: 'An immersive adventure exploration portal highlighting misty highlands, scenic excursions, and streamlined bookings with responsive, crisp typography.',
    fullChallenge: 'Travel Time aimed to create an atmospheric, high-resolution media-focused platform to connect travel seekers with tours.',
    fullOutcome: 'I designed an organic, scenery-immersive grid using responsive cards and soft animations. Integrated a state-managed scheduling pipeline that boosted booking conversions by 38.6%.',
    image: travelTimeMockup,
    liveUrl: 'https://traveltime.tours.nashiat.dev',
    duration: '4 Weeks Production',
    role: 'Lead Interactive Developer'
  },
  {
    id: 'visittokyo',
    title: 'Visit Tokyo Tourist Guide',
    niche: 'Cultural Travel Showcase & Itinerary Planner',
    tools: ['React v19', 'Framer Motion', 'Vite', 'Tailwind v4'],
    description: 'An elegant dark-themed tourist portal displaying iconic Japanese landmarks, cherry blossom highlights, and custom itinerary paths.',
    fullChallenge: 'The tourism board requested a traditional-meets-modern digital portal showcasing pagodas, geographic highlights, and immersive evening landmarks in high resolution.',
    fullOutcome: 'Created a gorgeous dark visual theme featuring smooth canvas overlays, traditional calligraphy typography accents, producing a 61.5% increase in user retention.',
    image: visitTokyoMockup,
    liveUrl: 'https://tokyo.tours.nashiat.dev',
    duration: '5 Weeks Production',
    role: 'Creative Experience Lead'
  },
  {
    id: 'creativedirector',
    title: 'Creative Director Portfolio',
    niche: 'High-End Brand Strategy & Product Design Showcase',
    tools: ['React v19', 'Tailwind CSS', 'Framer Motion', 'Web Audio API'],
    description: 'A bold, avant-garde personal brand portfolio using fiery crimson-to-orange gradient backdrops, crisp Swiss typography, and clean product galleries.',
    fullChallenge: 'A top-tier designer requested an outstanding, distraction-free landing page designed to instantly capture high-luxury clothing and cosmetic brand partnerships.',
    fullOutcome: 'I designed a highly stylized, warm-glow studio landing card using responsive CSS borders, premium typography hierarchy, and smooth layout entering nodes.',
    image: creativeDirectorMockup,
    liveUrl: 'https://creativedirector.design.nashiat.dev',
    duration: '4 Weeks Production',
    role: 'Design Engineer'
  },
  {
    id: 'fitnessclub',
    title: 'Fitness Club Aesthetic Hub',
    niche: 'High-Intensity Gym Membership & Coaching Platform',
    tools: ['React v19', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    description: 'A high-impact athletic dark mode interface with neon-red accents, dramatic studio shadow overlays, and automated onboarding funnels.',
    fullChallenge: 'The luxury gym franchise requested a bold digital experience that mimics the high-intensity, premium energy of their locations to grow virtual membership sales.',
    fullOutcome: 'Engineered a high-contrast energetic athletic UI featuring crisp typography, interactive performance calculators, and fluid checkout cards. Online membership sign-ups grew by 47.9%.',
    image: fitnessClubMockup,
    liveUrl: 'https://fitnessclub.gym.nashiat.dev',
    duration: '5 Weeks Production',
    role: 'Full Stack Front-End Engineer'
  }
];

export default function ProjectShowcase() {
  const [showArchive, setShowArchive] = useState(false);

  return (
    <section id="work" className="relative bg-[#0d0d0d] py-16 sm:py-24 select-none border-b border-[#c9a46c]/10 overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.02)_0%,transparent_70%)] pointer-events-none" />

      {/* Spacing alignment matches modern 8px rules: py-24 (96px), px-6 (24px) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3 text-left">
          Featured Work
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold tracking-tight text-[#f5f5f0] text-left">
          Case Studies in <span className="serif-display text-[#c9a46c] font-light italic">Impact</span>
        </h2>
        <p className="text-sm md:text-base text-[#f5f5f0]/60 max-w-2xl text-left leading-relaxed mt-4 font-light">
          Deep-dives into actual engineering challenges. These projects demonstrate structured problem-solving, world-class aesthetic control, and measurable commercial results.
        </p>
      </div>

      {/* Featured Case Studies Loop */}
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
                <div className="relative aspect-video bg-[#121212] overflow-hidden rounded-[4px] border border-white/10 group">
                  <LazyImage
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 ease-out hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] tracking-wider uppercase text-[#c9a46c] px-3 py-1.5 bg-[#0b0b0b]/90 border border-[#c9a46c]/20 backdrop-blur-md rounded-[2px]">
                    {study.duration}
                  </div>
                </div>

                {/* Tech Stack Horizontal Track */}
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
                    <span className="text-[10px] font-mono tracking-wider text-[#c9a46c] uppercase">
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
                        PROBLEM
                      </h4>
                      <p className="text-xs md:text-sm text-[#f5f5f0]/70 font-sans font-light leading-relaxed">
                        {study.problem}
                      </p>
                    </div>

                    <div className="p-4 bg-[#121212]/80 border border-white/5 rounded-[4px]">
                      <h4 className="text-xs font-mono tracking-widest text-[#c9a46c] uppercase mb-1.5 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#c9a46c]" />
                        SOLUTION & ENGINEERING APPROACH
                      </h4>
                      <p className="text-xs md:text-sm text-[#f5f5f0]/70 font-sans font-light leading-relaxed">
                        {study.solution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Outcome highlighting metric card */}
                <div className="bg-[#1a1a14]/60 border border-[#c9a46c]/20 p-4 rounded-[4px] flex items-center gap-4 justify-between">
                  <div className="text-left flex-1 pr-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/40 uppercase block mb-1">
                      MEASURABLE OUTCOME
                    </span>
                    <span className="text-xs sm:text-sm font-sans text-[#f5f5f0]/80 leading-snug">
                      {study.impactContext}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-[#c9a46c] block leading-none">
                      {study.impactMetric}
                    </span>
                  </div>
                </div>

                {/* Live System link */}
                <div className="mt-5 sm:mt-6 flex justify-start">
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a46c] hover:text-[#f5f5f0] transition-colors touch-manipulation min-h-[36px]"
                  >
                    Launch Live Service
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* OPTIONAL: Archive Projects Folder / Drawer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 sm:mt-28 border-t border-white/10 pt-12 sm:pt-16">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] mb-3">
            Exploration Labs
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-[#f5f5f0]">
            Other Work & Interactive Demos
          </h3>
          <p className="text-xs text-[#f5f5f0]/50 mt-2 mb-6">
            Browse through additional prototypes, design systems, and specialized niche tools developed under customized specifications.
          </p>

          <button
            onClick={() => setShowArchive(!showArchive)}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 text-white font-mono text-[10px] uppercase tracking-[0.2em] cursor-pointer transition-all flex items-center justify-center gap-3 rounded-[2px] min-h-[44px] touch-manipulation"
          >
            {showArchive ? (
              <>
                Hide Archive Projects
                <Minus className="w-3.5 h-3.5 text-[#c9a46c]" />
              </>
            ) : (
              <>
                Explore Archive Projects ({archiveProjects.length})
                <Plus className="w-3.5 h-3.5 text-[#c9a46c]" />
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showArchive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mt-12 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {archiveProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#121212]/95 border border-white/5 hover:border-[#c9a46c]/30 rounded-[4px] p-5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video rounded-[2px] overflow-hidden mb-4 border border-white/5">
                        <LazyImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-[#c9a46c]">
                          {project.niche}
                        </span>
                        <span className="text-[8px] font-mono text-[#f5f5f0]/40 uppercase">
                          {project.duration}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-black text-[#f5f5f0] mb-2">
                        {project.title}
                      </h4>
                      <p className="text-xs text-[#f5f5f0]/60 leading-relaxed font-light mb-4">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                      <span className="text-[9px] font-mono text-[#c9a46c]/80 uppercase">
                        {project.role}
                      </span>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#f5f5f0]/60 hover:text-[#c9a46c] transition-colors"
                      >
                        Launch Service
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
