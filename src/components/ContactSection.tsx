import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, MessageSquare, PhoneCall, HelpCircle, Sparkles, Star, Lock, AlertTriangle } from 'lucide-react';
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
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  
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
    
    // Client-side email validation check
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email) {
      setEmailError('Brand email is required to submit a proposal.');
      setEmailTouched(true);
      return;
    } else if (!isEmailValid) {
      setEmailError('Please enter a valid corporate email address (e.g. name@brand.com).');
      setEmailTouched(true);
      return;
    } else {
      setEmailError('');
    }

    if (!name || !message) return;

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
      setEmailError('');
      setEmailTouched(false);
    } catch (err) {
      console.error('Lead brief submit error', err);
      alert('Handshake interrupted. Please connect to your online server or try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-[#0d0d0d] py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-[#c9a46c]/10">
      
      {/* Background visual graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Left Side: Conversion Pitch */}
          <div className="lg:col-span-5 text-left">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
              Let's Build Something Unforgettable
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold tracking-tight text-[#f5f5f0] mb-5 sm:mb-6 leading-tight">
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
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Reach out on WhatsApp immediately</span>
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
                      <span className="text-[#c9a46c] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#c9a46c]" /> Project Received
                      </span>
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
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmail(val);
                          if (emailTouched) {
                            if (!val) {
                              setEmailError('Brand email is required to submit a proposal.');
                            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                              setEmailError('Please enter a valid corporate email address (e.g. name@brand.com).');
                            } else {
                              setEmailError('');
                            }
                          }
                        }}
                        onBlur={() => {
                          setEmailTouched(true);
                          if (!email) {
                            setEmailError('Brand email is required to submit a proposal.');
                          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                            setEmailError('Please enter a valid corporate email address (e.g. name@brand.com).');
                          } else {
                            setEmailError('');
                          }
                        }}
                        placeholder="john@brand.com"
                        className={`w-full px-4 py-3 bg-[#0b0b0b] text-[#f5f5f0] border rounded-[2px] text-xs md:text-sm focus:outline-none transition-colors font-sans ${
                          emailError 
                            ? 'border-red-500/50 focus:border-red-500 text-red-100' 
                            : 'border-white/5 focus:border-[#c9a46c]'
                        }`}
                      />
                      <AnimatePresence>
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="text-[10px] font-mono text-red-400 mt-1.5 flex items-center gap-1"
                          >
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              {emailError}
                            </span>
                          </motion.p>
                        )}
                      </AnimatePresence>
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
                    <span className="text-[9px] font-mono text-[#f5f5f0]/30 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-[#f5f5f0]/30" /> Your budget parameters are stored strictly locally under system rules
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
