import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { X, ArrowRight, ExternalLink, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Verdant AI Enterprise Engine',
    niche: 'Organic AI Grow & Telemetry Platform',
    tools: ['React v19', 'Tailwind CSS', 'Framer Motion', 'WebSockets'],
    description: 'A dark green organic dashboard tailored to visualize deep enterprise soil telemetry, automated growth prediction, and active carbon index monitoring.',
    fullChallenge: 'Verdant requested a clean, hyper-immersive monitoring console representing automated soil intelligence, organic conditions, and neural trends. They required custom translucent layered widgets that bypass traditional clinical layouts for dynamic, mossy visual depths.',
    fullOutcome: 'I designed dark glassmorphic cards carrying lime glow vectors, integrated live telemetry pushes via WebSockets, and optimized animation nodes. The resultant system boasts zero dome rendering jitter, driving an immense 42% surge in inbound enterprise customer confidence and brand conversion rate.',
    image: '/src/assets/images/verdant_mockup_1780199592763.png',
    liveUrl: 'https://verdant.ai.nashiat.dev',
    duration: '7 Weeks Production',
    role: 'Lead UI/UX Craft Developer'
  },
  {
    id: '2',
    title: 'Cryptox Decentralized Ledger Suite',
    niche: 'Web3 Futures & High-Velocity Algorithmic Trading Console',
    tools: ['React v19', 'D3.js Charts', 'Tailwind v4', 'Web Workers'],
    description: 'An intense, neon-orange glowing high-performance interface displaying live cryptocurrency volatility, asset books, and margin transaction routing.',
    fullChallenge: 'Cryptox required a supercomputer cockpit dashboard capable of streaming live cryptocurrency feeds and global transaction metrics under 4ms. The design needed to feel like an imposing, technical financial console while maintaining absolute responsiveness.',
    fullOutcome: 'Integrated lightweight background Web Workers to compute data feeds dynamically. Wrapped in a stunning customized futuristic ambient glow theme with responsive tracking grids, transaction latency collapsed by 29.5% with pristine physical framerate stability.',
    image: '/src/assets/images/cryptox_mockup_1780199575468.png',
    liveUrl: 'https://cryptox.exchange.nashiat.dev',
    duration: '5 Weeks Production',
    role: 'Full Stack Systems Architect'
  },
  {
    id: '3',
    title: 'Glasshaven Modern Architect Showcase',
    niche: 'High-End Architectural Portfolio & Structural Planning Hub',
    tools: ['Vite', 'SVG Blueprints', 'Framer Motion Props', 'Tailwind CSS'],
    description: 'A whisper-quiet, ultra-minimalist catalog showcasing award-winning glass villas, property outlines, and custom floor plans with fluid kinetic transition velocity.',
    fullChallenge: 'Glasshaven requested an elegant showcase representing high-end physical architectural designs. The constraints called for meticulous spacing, Swiss display typography, and interactive modern floorplan panels designed to influence high-net-worth real estate buyers.',
    fullOutcome: 'Authored an editorial, space-friendly grid layout, loaded SVG interactive layout coordinates, and tailored smooth spring scrolling. Visual load thresholds are maintained under 150ms, provoking a spectacular 51.6% uptick in premium property design commissions.',
    image: '/src/assets/images/glasshaven_mockup_1780199607688.png',
    liveUrl: 'https://glasshaven.architects.nashiat.dev',
    duration: '6 Weeks Production',
    role: 'Lead Creative Developer'
  },
  {
    id: '4',
    title: 'Devialet Symphonic Storefront',
    niche: 'Luxury Hardware E-Commerce Experience',
    tools: ['React v19', 'Web Audio API', 'Stripe API', 'Tailwind CSS'],
    description: 'An editorial luxury audio store featuring smooth fluid hardware scrolling, true acoustics simulation wave layers, and high-fidelity product imagery.',
    fullChallenge: 'Devialet requested an immersive Web Audio commerce layer that mimics physical hardware acoustic precision while maintaining zero frame drops during interactive 3D hardware catalogue rotation.',
    fullOutcome: 'I developed a bespoke audio-compressor layer connected to customized mouse scroll animations, accelerating item selection and checkout completion rates by 48.3% with peak physical responsiveness.',
    image: '/src/assets/images/devialet_mockup_1780211564112.png',
    liveUrl: 'https://devialet.audio.nashiat.dev',
    duration: '8 Weeks Production',
    role: 'Creative Motion Lead'
  },
  {
    id: '5',
    title: 'NeoVision Spatial Universe',
    niche: 'Futuristic MR/VR Virtual Ecosystem Hub',
    tools: ['React v19', 'Three.js WebGL', 'Framer Motion', 'Tailwind CSS'],
    description: 'A dark, cinematic hardware landing platform detailed with beautiful physical interactive wireframes, biometric feeds, and holographic visualizer decks.',
    fullChallenge: 'NeoVision requested an imposing spatial system showcase displaying futuristic mixed-reality wearables and tactile biometric data matrices without dragging framerates on low-end device displays.',
    fullOutcome: 'Engineered lightweight modular viewport containers built over responsive lazy-load logic, maintaining a lightning-fast average loading timestamp of 180ms with 100% immersive interface fidelity.',
    image: '/src/assets/images/neovision_mockup_1780211587549.png',
    liveUrl: 'https://neovision.future.nashiat.dev',
    duration: '5 Weeks Production',
    role: 'Full Stack Interaction Engineer'
  }
];

const getProjectCategory = (project: Project): 'E-Commerce' | 'Analytics' | 'Portfolio' => {
  if (project.id === '1') return 'Analytics';
  if (project.id === '2') return 'Analytics';
  if (project.id === '3') return 'Portfolio';
  if (project.id === '4') return 'E-Commerce';
  return 'Portfolio';
};

const categories = ['All', 'E-Commerce', 'Analytics', 'Portfolio'] as const;
type Category = typeof categories[number];

export default function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeftNav = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRightNav = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const filteredProjects = mockProjects.filter((project) => {
    if (selectedCategory === 'All') return true;
    return getProjectCategory(project) === selectedCategory;
  });

  return (
    <section id="work" className="relative bg-[#0d0d0d] py-24 select-none border-b border-[#c9a46c]/10">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
              Case Studies
            </span>
            <h3 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
              Featured <span className="serif-display text-[#c9a46c] font-light italic">Masterpieces</span>
            </h3>
            <p className="text-xs md:text-sm text-[#f5f5f0]/50 font-sans mt-2 max-w-md">
              A curated collection of web products developed to elevate consumer trust and generate revenue.
            </p>
          </div>

          {/* Slider Controllers */}
          <div className="flex items-center gap-4">
            <button
              onClick={scrollLeftNav}
              className="w-12 h-12 rounded-full border border-white/10 hover:border-[#c9a46c]/50 flex items-center justify-center font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              ←
            </button>
            <button
              onClick={scrollRightNav}
              className="w-12 h-12 rounded-full border border-white/10 hover:border-[#c9a46c]/50 flex items-center justify-center font-bold text-[#c9a46c] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              →
            </button>
          </div>

        </div>
      </div>

      {/* Category Filter Toggle Row */}
      <div className="max-w-7xl mx-auto px-6 mb-10 text-left">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/40 mr-4 select-none">
            Filter Niche:
          </span>
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 relative cursor-pointer rounded-[2px] ${
                  isActive
                    ? 'text-[#0b0b0b] bg-[#c9a46c] font-bold border border-[#c9a46c] shadow-lg scale-[1.02]'
                    : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] border border-white/5 hover:border-white/20 bg-[#121212]/30'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Slides Container (Handles horizontal dragging and navigation) */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto px-6 md:px-[calc((100vw-min(1280px,100vw))/2+24px)] no-scrollbar pb-12 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        data-cursor="drag"
        data-cursor-text="Swipe"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedProject(project)}
              className="flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[600px] bg-[#121212]/90 rounded-[4px] border border-white/5 hover:border-[#c9a46c]/30 overflow-hidden group hover:shadow-2xl transition-all duration-300 snap-center cursor-pointer p-4"
            >
            {/* Project Image Frame with zoom zoom logic */}
            <div className="relative aspect-video rounded-[2px] overflow-hidden mb-5">
              <img 
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute top-4 right-4 bg-[#0b0b0b]/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-[2px]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#c9a46c]">
                  {project.duration}
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="px-2 pb-2">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c9a46c]">
                  {project.niche}
                </span>
                <span className="font-mono text-[9px] text-[#f5f5f0]/40">
                  {project.role}
                </span>
              </div>

              <h4 className="text-xl md:text-2xl font-serif font-black text-[#f5f5f0] group-hover:text-[#c9a46c] transition-colors mb-3">
                {project.title}
              </h4>

              <p className="text-xs md:text-sm text-[#f5f5f0]/60 leading-relaxed font-light mb-5 line-clamp-2">
                {project.description}
              </p>

              {/* Tools Badges */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#f5f5f0]/5">
                {project.tools.map((tool) => (
                  <span 
                    key={tool} 
                    className="text-[9px] font-mono px-2 py-0.5 bg-[#1a1a1a] border border-white/5 rounded text-[#f5f5f0]/50"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      <div className="text-center mt-4">
        <span className="font-mono text-[10px] text-[#f5f5f0]/30 uppercase tracking-widest">
          💡 TIP: Mouse drag to explore the complete horizontal slide deck
        </span>
      </div>

      {/* Modal View Details */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0b]/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-[#121212] border border-[#c9a46c]/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8 relative"
            >
              {/* Close Button Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-[#0b0b0b] hover:bg-[#c9a46c] rounded-full text-[#f5f5f0] hover:text-[#0b0b0b] transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Banner */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-white/5">
                <img 
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Headings */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a46c] block mb-2">
                    {selectedProject.niche}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-heading font-semibold text-[#f5f5f0]">
                    {selectedProject.title}
                  </h3>
                </div>
                <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-3 text-left min-w-[200px]">
                  <p className="text-[10px] font-mono text-[#f5f5f0]/40">TIMELINE: {selectedProject.duration}</p>
                  <p className="text-xs font-mono text-[#c9a46c] font-bold mt-1">ROLE: {selectedProject.role}</p>
                </div>
              </div>

              {/* Tabs Content Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5 text-left mb-6">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>THE DESTRUCTIVE CHALLENGE</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#f5f5f0]/70 leading-relaxed font-light font-sans">
                    {selectedProject.fullChallenge}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#c9a46c] font-semibold text-sm">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span>HIGH CONVERSION OUTCOME</span>
                  </div>
                  <p className="text-xs md:text-sm text-[#f5f5f0]/80 leading-relaxed font-light font-sans">
                    {selectedProject.fullOutcome}
                  </p>
                </div>

              </div>

              {/* Technical Specifications list */}
              <div className="bg-[#0b0b0b] rounded-xl p-4 border border-white/5 text-left mb-8">
                <span className="text-[10px] font-mono tracking-wider text-[#f5f5f0]/40 uppercase block mb-3">
                  Delivered Tech Suite
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tools.map((tech) => (
                    <span 
                      key={tech}
                      className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#161616] border border-[#c9a46c]/10 text-[#c9a46c]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal footer CTA triggers */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#c9a46c] animate-ping" />
                  <span className="text-[10px] font-mono text-[#f5f5f0]/40">
                    REAL CASE STUDY APPROVED
                  </span>
                </div>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 sm:flex-none px-6 py-3 bg-[#1c1c1c] hover:bg-[#2a2a2a] rounded-lg font-mono text-xs uppercase tracking-widest text-white transition-all cursor-pointer"
                  >
                    Close Case
                  </button>
                  
                  <nav className="flex-1 sm:flex-none">
                    <a 
                      href="#contact"
                      onClick={() => {
                        setSelectedProject(null);
                        const contactSel = document.getElementById('contact');
                        if (contactSel) contactSel.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] hover:font-bold rounded-lg font-mono text-xs uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Request Similar
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </nav>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
