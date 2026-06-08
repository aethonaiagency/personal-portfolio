import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollStory from './components/ScrollStory';
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
import AdminDashboard from './components/AdminDashboard';
import ThreeBarsNavigation, { MasterBarType } from './components/ThreeBarsNavigation';

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
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
  const [activeBar, setActiveBar] = useState<MasterBarType>('studio');

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
    whatsappPhone: '8801625418838',
    contactEmail: 'nashiathossain@gmail.com',
    githubLink: 'https://github.com/nashiathossain',
    linkedinLink: 'https://linkedin.com/in/nashiathossain',
    totalProjectsCount: 12,
    handcraftedBuiltPercent: 100,
    lighthouseTarget: '90+',
    designStandardName: 'Luxury'
  });

  useEffect(() => {
    // Detect sandbox route
    const checkPath = () => {
      setIsAdminRoute(window.location.pathname === '/admin');
    };
    checkPath();

    // Listen for back/forward navigation within client
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  useEffect(() => {
    if (isAdminRoute) return;
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.profile) {
          setProfile(data.profile);
        }
      })
      .catch((err) => console.error('Failed to parse portfolio profile data:', err));
  }, [isAdminRoute]);

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
    if (isLoading && !isAdminRoute) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading, isAdminRoute]);

  // Bypasses the entire portfolio loader if rendering admin panel
  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  return (
    <>
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#0b0b0b] text-[#f5f5f0] overflow-hidden selection:bg-[#8b5cf6] selection:text-[#0b0b0b]">
          
          {/* Circular Cursor follow trailing effect */}
          <CustomCursor />

           {/* Sticky header controls */}
          <Navbar 
            onOpenBookModal={handleOpenBookGeneral} 
            activeBar={activeBar}
            setActiveBar={setActiveBar}
          />

          {/* Core main contents timeline */}
          <main>
            {/* 1. HERO - Cinematic Entry */}
            <Hero onOpenBookModal={handleOpenBookGeneral} profile={profile} />

            {/* Sticky 3-Bar Navigation Switcher Board */}
            <ThreeBarsNavigation activeBar={activeBar} onChangeBar={setActiveBar} />

            {/* Dynamic Content Viewport with premium transitions */}
            <div className="relative w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBar}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  {activeBar === 'studio' && (
                    <>
                      <div id="about">
                        <AboutMe profile={profile} />
                      </div>
                      <div id="story">
                        <ScrollStory />
                      </div>
                      <div id="expertise">
                        <SkillsGrid />
                      </div>
                    </>
                  )}

                  {activeBar === 'work' && (
                    <>
                      <div id="work">
                        <ProjectShowcase />
                      </div>
                      <div id="process">
                        <ProcessTimeline />
                      </div>
                      <div id="testimonials">
                        <Testimonials />
                      </div>
                    </>
                  )}

                  {activeBar === 'client' && (
                    <>
                      <div id="pricing">
                        <Pricing onSelectPackage={handleSelectPackage} />
                      </div>
                      <div id="faq">
                        <FAQ />
                      </div>
                      <div id="contact">
                        <ContactSection profile={profile} />
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
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
