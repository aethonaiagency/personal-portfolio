import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, MessageSquare, PhoneCall, HelpCircle, Sparkles, Star } from 'lucide-react';
import { LeadSubmission } from '../types';
import { ProfileData } from '../App';

interface ContactSectionProps {
  profile?: ProfileData;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [budget, setBudget] = useState('$5k - $10k');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [allLeads, setAllLeads] = useState<LeadSubmission[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nashiat_portfolio_leads');
      if (stored) {
        setAllLeads(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse cached leads:', e);
    }
  }, []);

  const budgetOptions = [
    '$3k - $5k',
    '$5k - $10k',
    '$10k - $25k',
    '$25k+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          businessName: businessName || 'Sovereign Brand',
          budget,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned error status context');
      }

      const resData = await response.json();
      const newLead: LeadSubmission = resData.lead || {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        businessName: businessName || 'Sovereign Brand',
        budget,
        message,
        timestamp: new Date().toISOString()
      };

      const updated = [newLead, ...allLeads];
      setAllLeads(updated);
      localStorage.setItem('nashiat_portfolio_leads', JSON.stringify(updated));

      setSubmitSuccess(true);
      
      // Clear out input fields
      setName('');
      setEmail('');
      setBusinessName('');
      setMessage('');
    } catch (err) {
      console.error('Lead brief submit error', err);
      alert('Handshake interrupted. Please connect to your online server or try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-[#0d0d0d] py-24 px-6 overflow-hidden border-b border-[#c9a46c]/10">
      
      {/* Background visual graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Side: Conversion Pitch */}
          <div className="lg:col-span-5 text-left">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
              Let's Build Something Unforgettable
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#f5f5f0] mb-6 leading-tight">
              Ready to claim your <span className="serif-display text-[#c9a46c] font-light italic">digital empire?</span>
            </h2>
            <p className="text-sm md:text-base text-[#f5f5f0]/60 leading-relaxed font-light mb-10">
              I only partner with a maximum of three clients at any given time to protect absolute draft quality and operational speed. Secure your slot now.
            </p>

            <div className="space-y-6 max-w-sm mb-12">
              <div className="flex items-start gap-4">
                <span className="p-3 bg-[#121212] border border-white/5 text-[#c9a46c] rounded-xl self-start">
                  <Star className="w-5 h-5 fill-[#c9a46c]" />
                </span>
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#f5f5f0] tracking-wider mb-1">
                    Direct WhatsApp Communication
                  </h4>
                  <a 
                    href={`https://wa.me/${profile?.whatsappPhone || '8801625418838'}?text=Hi%20${profile?.fullName?.split(' ')[0] || 'Nashiat'},%20I'm%20interested%20in%20building%20a%20premium%20website`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-bold text-[#c9a46c] hover:underline flex items-center gap-1.5"
                  >
                    🚀 Reach out on WhatsApp immediately
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="p-3 bg-[#121212] border border-white/5 text-[#c9a46c] rounded-xl self-start">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#f5f5f0] tracking-wider mb-1">
                    Book Discovery Call
                  </h4>
                  <p className="text-xs text-[#f5f5f0]/50 font-sans leading-relaxed">
                    Prefer direct voice chat? Use the floating call scheduler to instantly block a calendar slot on my planner.
                  </p>
                </div>
              </div>
            </div>

            {/* Display local lead submission statistics if user has submitted before */}
            {allLeads.length > 0 && (
              <div className="p-4 bg-[#121212]/50 border border-white/5 rounded-xl">
                <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/40 uppercase block mb-2">
                  My Active Enquiries ({allLeads.length})
                </span>
                <div className="max-h-24 overflow-y-auto space-y-2 pr-2">
                  {allLeads.map((lead) => (
                    <div key={lead.id} className="flex justify-between items-center text-[10px] font-mono bg-[#0b0b0b] p-2 rounded">
                      <span className="text-[#c9a46c] font-bold">✨ Project Recieved</span>
                      <span className="text-[#f5f5f0]/40">{lead.budget}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: High Converting Layout Form */}
          <div className="lg:col-span-7 bg-[#121212]/90 border border-[#c9a46c]/15 hover:border-[#c9a46c]/30 rounded-[4px] p-6 md:p-8 shadow-2xl relative">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-[#0b0b0b] hover:font-bold border border-white/5 rounded-[2px] select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[8px] font-mono text-[#f5f5f0]/40 tracking-widest">
                DIRECT LINK ACTIVE
              </span>
            </div>

            <h3 className="text-xl font-serif font-black text-[#f5f5f0] text-left mb-6">
              Project Parameters Brief
            </h3>

            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#c9a46c] mx-auto mb-4 animate-bounce" />
                  <p className="text-2xl font-display font-medium text-[#f5f5f0] mb-2">
                    Enquiry Handshake Complete
                  </p>
                  <p className="text-xs text-[#f5f5f0]/50 max-w-sm mx-auto leading-relaxed mb-8">
                    Your brief was stored in client log. I have received your request and will generate a customized strategic cost analysis on your brand inbox within the next 4 hours.
                  </p>
                  
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2.5 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-bold rounded-[2px] cursor-pointer"
                  >
                    Send another brief
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  
                  {/* Two Column Name and Email Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-2">
                        My Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-[2px] text-xs md:text-sm focus:outline-none focus:border-[#c9a46c] transition-colors font-sans"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-2">
                        Brand Email *
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@brand.com"
                        className="w-full px-4 py-3 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-[2px] text-xs md:text-sm focus:outline-none focus:border-[#c9a46c] transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* Brand business descriptor */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-2">
                      Business Name <span className="text-[#f5f5f0]/30">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Aura Fragrances LLC"
                      className="w-full px-4 py-3 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-[2px] text-xs md:text-sm focus:outline-none focus:border-[#c9a46c] transition-colors font-sans"
                    />
                  </div>

                  {/* Dynamic Clickable Luxury Budget Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-3">
                      Approximate Capital Allocation Goal
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setBudget(opt)}
                          className={`py-3 px-2 text-center rounded-[2px] border font-mono text-[10px] cursor-pointer transition-all ${
                            budget === opt
                              ? 'bg-[#c9a46c] border-[#c9a46c] text-[#0b0b0b] font-bold scale-[1.03]'
                              : 'bg-[#0b0b0b] border-white/5 text-[#f5f5f0]/60 hover:border-white/25'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message body */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-2">
                      Project Parameters Brief *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Outline your commercial targets, current visual hurdles, and desired launch date targets..."
                      className="w-full px-4 py-3 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-[2px] text-xs md:text-sm focus:outline-none focus:border-[#c9a46c] transition-colors font-sans h-32 resize-none"
                    />
                  </div>

                  {/* Submit Conversion Action */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-[0.25em] font-bold rounded-[2px] flex items-center justify-center gap-2 transition-all ${
                      isSubmitting ? 'opacity-80 cursor-wait' : 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                        <span>Filing Handshake Data...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Project Brief</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[9px] font-mono text-[#f5f5f0]/30 uppercase tracking-widest">
                      🔒 Your budget parameters are stored strictly locally under system rules
                    </span>
                  </div>

                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

    </section>
  );
}
