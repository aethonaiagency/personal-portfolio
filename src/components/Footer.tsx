import React, { useState } from 'react';
import { Github, Linkedin, Mail, PhoneCall, ArrowUp, Send } from 'lucide-react';
import { ProfileData } from '../App';

interface FooterProps {
  profile?: ProfileData;
}

export default function Footer({ profile }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const scrollBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }, 1200);
  };

  return (
    <footer className="relative bg-[#0b0b0b] pt-16 pb-12 px-6 overflow-hidden border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 text-left mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-1 select-none">
              <span className="text-2xl font-bold tracking-tighter text-[#f5f5f0]">
                {profile?.fullName?.split(' ')[0].toUpperCase() || 'NASHIAT'}<span className="text-[#c9a46c] font-light">.</span>
              </span>
            </div>
            <p className="text-xs text-[#f5f5f0]/50 font-sans leading-relaxed max-w-xs">
              Handcrafting luxury web platforms with clean TypeScript logic, focused animations, and performance ratios geared to secure visitor conversions.
            </p>
          </div>

          {/* Column 2: Directory */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#c9a46c]">
              Directory
            </h4>
            <ul className="space-y-2 text-xs text-[#f5f5f0]/60">
              <li>
                <a href="#work" className="hover:text-[#c9a46c] transition-colors">Case Studies</a>
              </li>
              <li>
                <a href="#story" className="hover:text-[#c9a46c] transition-colors">Digital Mission</a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#c9a46c] transition-colors">Workflow Methods</a>
              </li>
              <li>
                <a href="#expertise" className="hover:text-[#c9a46c] transition-colors">Expertise Stacks</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Communication Channels */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#c9a46c]">
              Transmission
            </h4>
            <ul className="space-y-2 text-xs text-[#f5f5f0]/60">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c9a46c]" />
                <a href={`mailto:${profile?.contactEmail || 'nashiathossain@gmail.com'}`} className="hover:text-[#c9a46c] transition-colors">
                  {profile?.contactEmail || 'nashiathossain@gmail.com'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#c9a46c]" />
                <a href={`https://wa.me/${profile?.whatsappPhone || '8801625418838'}`} target="_blank" rel="noreferrer" className="hover:text-[#c9a46c] transition-colors">
                  +{profile?.whatsappPhone || '8801625418838'} WhatsApp Direct
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Digest */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#c9a46c]">
              Insights Digest
            </h4>
            <p className="text-[11px] text-[#f5f5f0]/50 font-sans leading-normal max-w-[200px]">
              Subscribe to quarterly research exploring premium visual design & server-side engineering.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative max-w-[220px] mt-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                className="w-full pl-3 pr-10 py-2.5 bg-[#121212] border border-white/5 rounded-[2px] text-xs font-sans text-[#f5f5f0] placeholder-[#f5f5f0]/30 focus:outline-none focus:border-[#c9a46c]/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="absolute right-0.5 top-0.5 bottom-0.5 w-8 bg-[#c9a46c] hover:bg-[#b08e59] disabled:bg-[#1e1e1d] disabled:text-[#f5f5f0]/20 text-[#0b0b0b] flex items-center justify-center rounded-[1px] transition-colors cursor-pointer"
                aria-label="Subscribe to Insights Digest"
              >
                {status === 'loading' ? (
                  <div className="w-3 h-3 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </button>
            </form>

            {status === 'success' && (
              <span className="block text-[9px] font-mono tracking-wider text-[#c9a46c] uppercase animate-pulse mt-1.5 select-none">
                ✓ Success. Added to Registry.
              </span>
            )}
          </div>

          {/* Column 5: Location Specs */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#c9a46c]">
              Availability
            </h4>
            <div className="p-3 bg-[#121212] border border-white/5 rounded-lg">
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 block mb-1">
                ● CURRENT STATUS
              </span>
              <p className="text-[10px] text-[#f5f5f0]/70 font-sans leading-normal">
                Open for booking (Q3 // Q4 2026 retainers)
              </p>
            </div>
          </div>

        </div>

        {/* bottom subfooter with social hooks and back to top indicator */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center pt-8 border-t border-white/[0.05] text-[10px] font-mono text-[#f5f5f0]/40">
          
          <div className="flex items-center gap-6">
            <a 
              href={profile?.githubLink || "https://github.com"} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-[#121212] hover:bg-[#c9a46c] hover:text-[#0b0b0b] text-[#f5f5f0]/60 rounded-full border border-white/5 transition-all cursor-pointer"
            >
              <Github className="w-4 h-4" />
            </a>
            
            <a 
              href={profile?.linkedinLink || "https://linkedin.com"} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-[#121212] hover:bg-[#c9a46c] hover:text-[#0b0b0b] text-[#f5f5f0]/60 rounded-full border border-white/5 transition-all cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <div>
            <span>{(profile?.fullName || 'NASHIAT').toUpperCase()} © 2026 — DIGITAL BUILDER PORTFOLIO. ALL RIGHTS PRESERVED</span>
          </div>

          <button
            onClick={scrollBackToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-[#c9a46c]/10 text-[#f5f5f0] border border-white/5 rounded-full transition-colors cursor-pointer"
          >
            <span>BACK TO CHRONICLE</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#c9a46c]" />
          </button>

        </div>
      </div>
    </footer>
  );
}
