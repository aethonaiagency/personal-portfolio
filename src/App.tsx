import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getApiUrl } from './utils/api';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import BackgroundEffects from './components/BackgroundEffects';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import ProjectShowcase from './components/ProjectShowcase';
import ProcessTimeline from './components/ProcessTimeline';
import SkillsGrid from './components/SkillsGrid';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import BookModal from './components/BookModal';

export interface ProfileData {
  fullName: string;
  roleTitle: string;
  bioIntroduction: string;
  bioLong: string;
  whatsappPhone: string;
  contactEmail: string;
  githubLink: string;
  linkedinLink: string;
  totalProjectsCount: number;
  handcraftedBuiltPercent: number;
  lighthouseTarget: string;
  designStandardName: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    }
  }, []);

  const [profile, setProfile] = useState<ProfileData>({
    fullName: 'Nashiat Hossain',
    roleTitle: 'Full-stack Web Developer & Creative UX Designer',
    bioIntroduction: 'Crafting websites that help brands stand out and convert.',
    bioLong: 'I design and build modern websites for businesses, startups, and personal brands that want a strong online presence. My focus is not just making websites look beautiful — but creating websites that feel premium, perform fast, and help convert visitors into clients.',
    whatsappPhone: '8801342272168',
    contactEmail: 'nashiathossain@gmail.com',
    githubLink: 'https://github.com/nashiathossain',
    linkedinLink: 'https://linkedin.com/in/nashiathossain',
    totalProjectsCount: 12,
    handcraftedBuiltPercent: 100,
    lighthouseTarget: '90+',
    designStandardName: 'Luxury'
  });

  useEffect(() => {
    fetch(getApiUrl('/api/profile'))
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.profile) {
          setProfile(data.profile);
        }
      })
      .catch((err) => console.error('Failed to parse portfolio profile data:', err));
  }, []);

  const handleSelectPackage = (packageName: string) => {
    setSelectedPackage(packageName);
    setIsBookModalOpen(true);
  };

  const handleOpenBookGeneral = () => {
    setSelectedPackage(undefined);
    setIsBookModalOpen(true);
  };

  useEffect(() => {
    // Control scroll behavior on body when loader curtain is active
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);


  return (
    <>
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#0b0b0b] text-[#f5f5f0] overflow-hidden selection:bg-[#8b5cf6] selection:text-[#0b0b0b]">
          
          {/* Circular Cursor follow trailing effect */}
          <CustomCursor />
          <SmoothScroll />
          <BackgroundEffects />

           {/* Sticky header controls */}
          <Navbar onOpenBookModal={handleOpenBookGeneral} />

          {/* Core main contents timeline */}
          <main>
            {/* 1. HERO - Cinematic Entry */}
            <Hero onOpenBookModal={handleOpenBookGeneral} profile={profile} />

            {/* 2. FEATURED PROJECTS - High Impact Case Studies */}
            <ProjectShowcase />

            {/* 3. PROOF / TESTIMONIALS - Belief Alignment, Credentials, Feedbacks */}
            <AboutMe profile={profile} />
            <Testimonials />

            {/* 4. SKILLS - Dual Moving Expertise Marquees */}
            <SkillsGrid />

            {/* 5. PROCESS - Vertical Milestones Steps Progress */}
            <ProcessTimeline />

            {/* 6. SERVICES / PRICING - Packages & Investments */}
            <Pricing onSelectPackage={handleSelectPackage} />

            {/* 7. FAQ - Objections Cleared */}
            <FAQ />

            {/* 8. CONTACT - Brief Intake Constructor */}
            <ContactSection profile={profile} />
          </main>

          {/* Persistent Floating Converters */}
          <FloatingActions onOpenBookModal={handleOpenBookGeneral} profile={profile} />

          {/* Shared luxury Footer */}
          <Footer profile={profile} />

          {/* Scheduling Modal overlays */}
          <BookModal 
            isOpen={isBookModalOpen} 
            onClose={() => setIsBookModalOpen(false)} 
            selectedPackage={selectedPackage}
          />

        </div>
      )}
    </>
  );
}
