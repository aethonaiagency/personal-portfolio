import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLazyLoadImage } from '../hooks/useLazyLoadImage';
import { 
  ArrowRight, 
  Plus, 
  Minus, 
  CheckCircle, 
  Flame, 
  Eye, 
  Maximize2, 
  Layers, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Monitor,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

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
  categories: ('Web Design' | 'Branding' | 'UI/UX' | 'SaaS')[];
  shortDesc: string;
  featured?: boolean;
}

// Curated high quality portfolio mockups provided
const portfolioProjects: CaseStudy[] = [
  {
    id: 'barbercrop',
    title: 'Barbercrop Barbershop Studio',
    niche: 'Men\'s Grooming & Salon Web Platform',
    duration: 'Bespoke Premium Solution',
    role: 'Exclusive UI/UX & Layout Design',
    problem: 'Traditional barber studio web pages are standard, generic directories that fail to capture the sensory-rich heritage of vintage shaving and high-end styling.',
    solution: 'Curated a bold visual framework using rich charcoals, crimson coordinates, high-resolution header sections, and custom-structured menu pipelines.',
    techStack: ['React v19', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    impactMetric: '+140% Bookings',
    impactContext: 'Immediate booking conversion rate increase recorded within 30 days',
    image: barbercropMockup,
    liveUrl: '#',
    categories: ['Web Design', 'UI/UX'],
    shortDesc: 'Luxury men\'s grooming storefront layout built for hyper-conversion.',
    featured: true // Let's make Barbercrop the massive top horizontal showcase
  },
  {
    id: 'hush-sushi',
    title: 'Hush Modern Japanese Sushi',
    niche: 'High-End Culinary & Reservation Platform',
    duration: 'Rapid High-fidelity Build',
    role: 'Lead Visual Engineer',
    problem: 'Culinary storefronts typically lack visual focus on the food quality itself, hiding actual visual menus behind clunky PDF links or ugly column indices.',
    solution: 'Developed an elegant, image-first layout framing ultra-saturated dish views within dark spacing, complete with real-time 예약 booking portal overlays.',
    techStack: ['Vite', 'React v19', 'Tailwind CSS', 'Framer Motion'],
    impactMetric: '4.8x Bookings',
    impactContext: 'Table reservation actions tracked over organic mobile scroll traffic',
    image: hushSushiMockup,
    liveUrl: '#',
    categories: ['UI/UX', 'Web Design'],
    shortDesc: 'Sleek, atmospheric dining showcase which displays culinary mastery.'
  },
  {
    id: 'housify',
    title: 'Housify Premium Property Match',
    niche: 'High-Net-Worth Property Listing Hub',
    duration: 'Modular Portal Framework',
    role: 'SaaS UX Architect',
    problem: 'Real estate aggregator sites feel cluttered and crowded, confusing buyers with millions of low-quality tiny cards filled with text clutter.',
    solution: 'Crafted a majestic space-rich grid layout that elevates every listing to a distinct architectural masterwork, complete with high-trust agent channels.',
    techStack: ['React v19', 'Tailwind', 'Sass Modules', 'Lucide Icons'],
    impactMetric: '+220% Leads',
    impactContext: 'Broker inquiry rate climb observed following layout unification',
    image: housifyMockup,
    liveUrl: '#',
    categories: ['SaaS', 'Web Design'],
    shortDesc: 'Elite architectural property grid pairing layouts with performance.'
  },
  {
    id: 'turanoutfit',
    title: 'TuranOutfit Wilderness Store',
    niche: 'Rugged Adventure Apparel E-Commerce',
    duration: 'Fast Commerce Handshake',
    role: 'Full-stack Storefront developer',
    problem: 'Standard ecommerce websites present standard catalogs without matching thematic narratives, reducing the sense of adventure and product endurance.',
    solution: 'Wrapped high-end gear collections in a charcoal skin, featuring mountain explorer views and high-trust parameters for quick checkout actions.',
    techStack: ['React v19', 'Tailwind CSS', 'AnimatePresence', 'Lucide Gears'],
    impactMetric: '3x Engagement',
    impactContext: 'User cart addition velocity tracked through seasonal wilderness campaigns',
    image: turanOutfitMockup,
    liveUrl: '#',
    categories: ['Branding', 'SaaS'],
    shortDesc: 'Rugged wilderness gear explorer storefront with high-conversion checkout flow.'
  },
  {
    id: 'wenlaunch',
    title: 'Wen Launch Web3 Agency',
    niche: 'Decentralized Tech Creative Studio',
    duration: 'Custom Client Interface',
    role: 'Interface Architect',
    problem: 'Web3 studios struggle to differentiate themselves, relying on bright purple gradients that have become a highly generic tech stereotype.',
    solution: 'Engineered a cinematic workspace using classic serif typography paired with hyper-detailed dark frames for elite modern tech organizations.',
    techStack: ['React v19', 'Tailwind', '3D Asset Framing', 'Framer Motion'],
    impactMetric: '99 Speed Score',
    impactContext: 'Lighthouse mobile performance optimization score registered under server load',
    image: wenLaunchMockup,
    liveUrl: '#',
    categories: ['Branding', 'UI/UX'],
    shortDesc: 'Hyper-detailed futuristic workspace with crisp performance and 3D accents.'
  }
];

// Interactive depth tilt card component for 3D parallax feel
interface InteractiveCardProps {
  project: CaseStudy;
  onOpenCaseStudy: (project: CaseStudy) => void;
}

function InteractiveCard({ project, onOpenCaseStudy }: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate degree of tilt based on relative cursor position
    const rotX = ((y - centerY) / centerY) * -8; // max 8deg tilt to keep it premium
    const rotY = ((x - centerX) / centerX) * 8;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenCaseStudy(project)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className="group bg-[#121212]/50 hover:bg-[#121212]/90 border border-white/5 hover:border-[#8b5cf6]/30 rounded-xl overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_20px_40px_rgba(139,92,246,0.06)] h-full flex flex-col justify-between transition-all duration-500"
    >
      <div className="relative">
        {/* Mock Browser Header */}
        <div className="w-full bg-[#161616] border-b border-white/5 px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex gap-1.2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]/60" />
          </div>
          <div className="text-[7px] font-mono text-white/30 tracking-widest uppercase">
            templates.nashiat.dev/{project.id}
          </div>
          <div className="w-3 h-1" />
        </div>

        {/* Thumbnail Preview Window */}
        <div className="relative w-full h-[220px] overflow-hidden bg-[#080808]">
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/80 to-transparent z-10 opacity-60 pointer-events-none" />
          
          {/* Zoomable Image Wrapper */}
          <div className="w-full h-full scale-[1.01] group-hover:scale-105 transition-transform duration-[4000ms] ease-out">
            <LazyImage 
              src={project.image} 
              alt={project.title} 
              className="w-full h-auto object-cover object-top"
            />
          </div>

          {/* Metric badge at top-right */}
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider text-[#0b0b0b] bg-[#8b5cf6] rounded-md shadow-lg shadow-[#8b5cf6]/20 block">
              {project.impactMetric}
            </span>
          </div>

          {/* Full Dark Overlay Fade-in on Hover with Center Button CTA */}
          <div className="absolute inset-0 bg-[#0b0b0b]/80 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <motion.div 
              className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-mono text-white uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 hover:bg-[#8b5cf6] hover:text-[#0b0b0b] hover:border-transparent transition-all shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Case Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-5 text-left">
          {/* Categories tag ribbon */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {project.categories.map((c) => (
              <span key={c} className="text-[8px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/5 text-[#8b5cf6] rounded">
                {c.toUpperCase()}
              </span>
            ))}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#f5f5f0] tracking-tight group-hover:text-[#8b5cf6] transition-colors mb-2">
            {project.title}
          </h3>

          <p className="text-xs text-[#f5f5f0]/60 font-sans leading-relaxed line-clamp-1">
            {project.shortDesc}
          </p>
        </div>
      </div>

      {/* Footer Details Card */}
      <div className="px-5 pb-5 pt-0 border-t border-white/[0.03] mt-2 flex items-center justify-between text-left">
        <span className="text-[8.5px] font-mono tracking-widest text-white/30 uppercase">
          {project.role.split(' & ')[0]}
        </span>
        <span className="text-[10px] font-bold text-[#8b5cf6] font-mono flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
          Review Layout <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
}

export default function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Web Design' | 'Branding' | 'UI/UX' | 'SaaS'>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);

  // Filters logic
  const filteredProjects = portfolioProjects.filter((proj) => {
    if (activeCategory === 'All') return true;
    return proj.categories.includes(activeCategory as any);
  });

  // Crown Jewel project for Featured wide highlight
  const featuredProject = portfolioProjects.find((p) => p.featured) || portfolioProjects[0];

  return (
    <section id="work" className="relative bg-[#0b0b0b] py-24 sm:py-32 select-none border-b border-[#8b5cf6]/10 overflow-hidden">
      
      {/* Dynamic Background visual ornaments */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8b5cf6]/[0.03] filter blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#8b5cf6]/[0.01] filter blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        
        {/* Section Heading with large padding breathing space */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8b5cf6] block">
              Portfolio & Templates
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-black tracking-tight text-[#f5f5f0]">
              Featured <span className="serif-display text-[#8b5cf6] font-light italic">Projects</span>
            </h2>
            <p className="text-sm md:text-base text-[#f5f5f0]/60 leading-relaxed font-sans font-light">
              My engineering approach centers high visual elegance backed by lightweight system execution. Review my showcase of premium custom templates geared to convert visitors into customers immediately.
            </p>
          </div>

          {/* Interactive Filtering Tabs */}
          <div className="flex flex-wrap bg-[#121212]/60 p-1 border border-white/5 rounded-lg overflow-x-auto whitespace-nowrap self-start">
            {(['All', 'Web Design', 'UI/UX', 'SaaS', 'Branding'] as const).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-4 py-2 font-mono text-[10px] uppercase tracking-wider rounded-md transition-all duration-300 cursor-pointer ${
                    isActive ? 'text-[#0b0b0b] font-bold z-10' : 'text-[#f5f5f0]/50 hover:text-[#f5f5f0]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePortfolioTab"
                      className="absolute inset-0 bg-[#8b5cf6] rounded-md"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-20 flex items-center">
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            Featured horizontal highlight (Large Top Spotlight Card)
            ======================================================== */}
        <AnimatePresence mode="wait">
          {activeCategory === 'All' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#121212]/40 hover:bg-[#121212]/70 border border-[#8b5cf6]/15 hover:border-[#8b5cf6]/35 rounded-2xl p-6 md:p-8 transition-all duration-500 overflow-hidden cursor-pointer"
              onClick={() => setSelectedCaseStudy(featuredProject)}
            >
              {/* Featured left design previews */}
              <div className="col-span-1 lg:col-span-12 flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-4 mb-4">
                <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#8b5cf6] font-bold uppercase mb-2 sm:mb-0">
                  <Sparkles className="w-3.5 h-3.5" /> Spotlight Commission Showcase
                </span>
                <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">
                  TEMPLATE ENGINE • HIGH DENSITY
                </span>
              </div>

              {/* Left Column: text description */}
              <div className="col-span-1 lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 text-[8px] font-mono bg-white/5 text-[#8b5cf6] rounded tracking-wider uppercase border border-white/5">
                      {featuredProject.categories.join(' / ')}
                    </span>
                    <span className="text-[10px] font-mono text-[#f5f5f0]/40 font-bold flex items-center gap-1 bg-[#8b5cf6]/10 px-2 py-0.5 rounded border border-[#8b5cf6]/10">
                      <TrendingUp className="w-3 h-3 text-[#8b5cf6]" /> High-Impact Conversion
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f5f5f0] tracking-tight hover:text-[#8b5cf6] transition-colors leading-tight">
                    {featuredProject.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#f5f5f0]/70 leading-relaxed font-sans font-light">
                    {featuredProject.problem}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                  <div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block mb-0.5">Performance Impact</span>
                    <span className="text-lg sm:text-xl font-bold text-[#8b5cf6] block font-mono">{featuredProject.impactMetric}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block mb-0.5">Execution Methodology</span>
                    <span className="text-[10px] font-semibold text-white/60 block py-1.5">{featuredProject.duration}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {featuredProject.techStack.map((tech) => (
                    <span key={tech} className="text-[8.5px] font-mono tracking-wider px-2 py-1 bg-white/5 border border-white/5 text-white/50 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <button className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-[10px] uppercase tracking-widest font-black rounded-lg flex items-center gap-2 shadow-lg shadow-[#8b5cf6]/10 transform active:scale-98 transition-all">
                    <span>Explore Case study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: gorgeous visual browser scrolling mockup */}
              <div className="col-span-1 lg:col-span-7 relative h-[250px] sm:h-[380px] bg-[#000] border border-white/5 rounded-xl overflow-hidden group/featured">
                <div className="w-full h-full pt-9 overflow-hidden relative">
                  {/* Mock browser header */}
                  <div className="absolute top-0 left-0 right-0 h-9 z-10 bg-[#161616] border-b border-white/5 flex items-center justify-between px-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/70" />
                    </div>
                    <div className="w-2/3 h-4 bg-[#121212] border border-white/5 rounded-md flex items-center justify-center text-[7px] font-mono tracking-widest text-[#f5f5f0]/30 font-light select-none">
                      templates.nashiat.dev/{featuredProject.id}
                    </div>
                    <div className="w-4 h-1" />
                  </div>

                  {/* Float zoom helper */}
                  <div className="absolute bottom-4 right-4 z-10 font-mono text-[8px] tracking-widest text-[#8b5cf6] bg-[#0b0b0b]/90 border border-[#8b5cf6]/25 rounded-[3px] px-2.5 py-1.5 select-none pointer-events-none uppercase shadow-lg flex items-center gap-1.5">
                    <Monitor className="w-3 h-3" /> Auto-Scroll Hover Experience
                  </div>

                  {/* Full layout auto scaling image view */}
                  <img
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    className="absolute top-9 left-0 w-full h-auto cursor-zoom-in transition-transform duration-[8000ms] ease-in-out hover:translate-y-[calc(-100%+250px)] sm:hover:translate-y-[calc(-100%+380px-36px)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            Core Grid-based layout 
            Desktop: 3-column, Tablet: 2-column, Mobile: 1-column
            ======================================================== */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              // Avoid duplicate featured card under active 'All' filtering
              if (activeCategory === 'All' && project.featured) return null;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -20 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <InteractiveCard project={project} onOpenCaseStudy={setSelectedCaseStudy} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All Projects / Bottom conversion trigger */}
        <div className="mt-16 text-center select-none">
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 py-3.5 bg-transparent hover:bg-[#8b5cf6]/10 border border-white/10 hover:border-[#8b5cf6] text-[#f5f5f0] hover:text-[#8b5cf6] font-mono text-[10.5px] uppercase tracking-[0.25em] font-black rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            Request Bespoke Catalog Configuration
          </button>
          <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/30 uppercase mt-4">
            Curate unique frameworks and brand layouts under a personal consultation brief
          </p>
        </div>

      </div>

      {/* =============================================================
          Bespoke high-end custom modal detailing case study and specs
          ============================================================= */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCaseStudy(null)}
            className="fixed inset-0 z-50 bg-[#070707ef]/98 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 24 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl cursor-default overflow-hidden text-left"
            >
              {/* Header bar with controls */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#121212]/80 backdrop-blur-sm z-15">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#8b5cf6] uppercase">
                    Interactive Layout Review Panel
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-3.5 py-1.5 text-[#f5f5f0]/60 hover:text-white hover:bg-white/5 transition-all text-[9.5px] font-mono uppercase tracking-[0.15em] cursor-pointer border border-white/10 bg-[#161616] rounded-md"
                >
                  Close View [X]
                </button>
              </div>

              {/* Scrollable multi-density modal container */}
              <div className="overflow-y-auto flex-1 p-6 md:p-10 bg-[#09090a] space-y-10 custom-scrollbar">
                
                {/* Meta Summary Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left part of meta summary */}
                  <div className="col-span-1 lg:col-span-7 space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b5cf6] block">
                      {selectedCaseStudy.niche}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#f5f5f0]">
                      {selectedCaseStudy.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#f5f5f0]/70 leading-relaxed font-sans font-light">
                      {selectedCaseStudy.shortDesc}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedCaseStudy.techStack.map((tech) => (
                        <span key={tech} className="text-[9px] font-mono tracking-wider px-2 py-1 bg-[#121212] border border-white/5 text-[#8b5cf6] rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right part: statistics grid */}
                  <div className="col-span-1 lg:col-span-5 bg-[#121212]/50 border border-white/5 rounded-xl p-5 space-y-4">
                    <div>
                      <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase block mb-1">Impact Registered</span>
                      <p className="text-2xl font-bold text-[#8b5cf6] tracking-tight font-mono">{selectedCaseStudy.impactMetric}</p>
                      <p className="text-[10px] text-[#f5f5f0]/50 mt-0.5 leading-relaxed">{selectedCaseStudy.impactContext}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-4 text-left">
                      <div>
                        <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase block mb-0.5">Assigned Role</span>
                        <span className="text-[10.5px] font-bold text-white/80 block">{selectedCaseStudy.role}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase block mb-0.5">Timeline Scope</span>
                        <span className="text-[10.5px] font-bold text-[#8b5cf6] block">{selectedCaseStudy.duration}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Problem vs Solution Division block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#121212]/30 border border-red-500/10 p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-red-500/10">
                      <Flame className="w-16 h-16" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-red-400 uppercase block mb-2 font-bold">
                      Hurdle Statement
                    </span>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans font-light">
                      {selectedCaseStudy.problem}
                    </p>
                  </div>

                  <div className="bg-[#121212]/30 border border-[#8b5cf6]/20 p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-[#8b5cf6]/10">
                      <CheckCircle2 className="w-16 h-16" />
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-[#8b5cf6] uppercase block mb-2 font-bold">
                      Design Execution Solution
                    </span>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans font-light">
                      {selectedCaseStudy.solution}
                    </p>
                  </div>
                </div>

                {/* Vertical Full Page Layout Design View with Simulated Scroll Mockup */}
                <div className="space-y-4 pt-4">
                  <span className="text-[9px] font-mono tracking-widest text-white/35 uppercase block">
                    Full Resolution Layout Sheet (Uncropped Mockup Preview)
                  </span>

                  <div className="border border-white/10 rounded-xl overflow-hidden bg-[#040404] p-4 max-w-3xl mx-auto shadow-2xl relative">
                    <div className="w-full h-auto bg-[#121212] rounded-lg overflow-hidden border border-white/5 relative">
                      <img
                        src={selectedCaseStudy.image}
                        alt={selectedCaseStudy.title}
                        className="w-full h-auto object-contain object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action dialog prompt footer */}
              <div className="px-6 py-4.5 bg-[#121212] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-left">
                  <Lock className="w-3.5 h-3.5 text-[#8b5cf6]" /> Verified High fidelity pixel representation
                </span>
                <button
                  onClick={() => {
                    setSelectedCaseStudy(null);
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2.5 bg-[#8b5cf6] text-white hover:bg-[#7c3aed] uppercase tracking-wider font-bold rounded-lg cursor-pointer transform active:scale-98 transition-all flex items-center gap-1 min-h-[32px]"
                >
                  <span>Build custom layout like this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
