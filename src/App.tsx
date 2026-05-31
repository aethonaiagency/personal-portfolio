import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollStory from './components/ScrollStory';
import ProjectShowcase from './components/ProjectShowcase';
import ProcessTimeline from './components/ProcessTimeline';
import SkillsGrid from './components/SkillsGrid';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import BookModal from './components/BookModal';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

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
        <div className="relative min-h-screen bg-[#0b0b0b] text-[#f5f5f0] overflow-hidden selection:bg-[#c9a46c] selection:text-[#0b0b0b]">
          
          {/* Circular Cursor follow trailing effect */}
          <CustomCursor />

          {/* Sticky header controls */}
          <Navbar onOpenBookModal={() => setIsBookModalOpen(true)} />

          {/* Core main contents timeline */}
          <main>
            {/* Section 1: Cinematic Entry */}
            <Hero onOpenBookModal={() => setIsBookModalOpen(true)} />

            {/* Section 2: Architectural Pinning Storyteller */}
            <ScrollStory />

            {/* Section 3: Horizontal Carousel Masterpieces */}
            <ProjectShowcase />

            {/* Section 4: Vertical Milestones Step Progression */}
            <ProcessTimeline />

            {/* Section 5: Dual Infinitely Moving Expertise Marquees */}
            <SkillsGrid />

            {/* Section 6: Upward Scroll Reviews Grid */}
            <Testimonials />

            {/* Section 6.5: Frequently Asked Questions Accordion */}
            <FAQ />

            {/* Section 7: Lead Intake brief constructor with budget anchors */}
            <ContactSection />
          </main>

          {/* Persistent Floating Converters */}
          <FloatingActions onOpenBookModal={() => setIsBookModalOpen(true)} />

          {/* Shared luxury Footer */}
          <Footer />

          {/* Scheduling Modal overlays */}
          <BookModal 
            isOpen={isBookModalOpen} 
            onClose={() => setIsBookModalOpen(false)} 
          />

        </div>
      )}
    </>
  );
}
