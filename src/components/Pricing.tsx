import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, Shield, ArrowRight, Zap, Globe, MessageSquare } from 'lucide-react';

interface PricingProps {
  onSelectPackage: (packageName: string) => void;
}

type CurrencyType = 'BDT' | 'USD';

export default function Pricing({ onSelectPackage }: PricingProps) {
  const [currency, setCurrency] = useState<CurrencyType>('BDT');

  const plans = {
    BDT: [
      {
        id: 'bdt-starter',
        name: 'Starter Website',
        price: '৳15,000',
        subtitle: 'Perfect for small local businesses or personal brands.',
        features: [
          'Custom modern responsive website',
          'Up to 5 pages',
          'Mobile optimized',
          'Contact form',
          'WhatsApp integration',
          'Fast loading',
          'Basic SEO setup',
          'Free deployment',
        ],
        cta: 'Get Started',
        popular: false,
        badge: '',
      },
      {
        id: 'bdt-growth',
        name: 'Business Growth',
        price: '৳25,000',
        subtitle: 'Most popular package built to capture organic incoming leads.',
        features: [
          'Everything in Starter',
          'Up to 8 pages',
          'Premium UI/UX design',
          'Scroll animations',
          'Booking/contact section',
          'Lead capture forms',
          'Performance optimization',
          'Advanced SEO structure',
          'Admin-editable sections',
        ],
        cta: 'Book This Package',
        popular: true,
        badge: 'Most Popular',
      },
      {
        id: 'bdt-premium',
        name: 'Premium Brand Experience',
        price: '৳35,000',
        subtitle: 'For serious businesses wanting premium, bespoke digital presence.',
        features: [
          'Everything in Business Growth',
          'Fully custom high-end design',
          'Advanced scroll-based animations',
          'Premium landing page sections',
          'Custom integrations',
          'Portfolio/case study pages',
          'Priority support',
          'Speed optimization',
          'Full launch support',
        ],
        cta: "Let's Build Together",
        popular: false,
        badge: '',
      }
    ],
    USD: [
      {
        id: 'usd-starter',
        name: 'Starter',
        price: '$299',
        subtitle: 'Modern responsive asset with elite aesthetic foundations.',
        features: [
          'Modern responsive website',
          'Up to 5 pages',
          'Mobile optimized',
          'Contact form',
          'Fast deployment',
          'Basic SEO',
        ],
        cta: 'Get Started',
        popular: false,
        badge: '',
      },
      {
        id: 'usd-growth',
        name: 'Growth',
        price: '$399',
        subtitle: 'Bespoke customer funnel engineered to scale conversions.',
        features: [
          'Everything in Starter',
          'Up to 8 pages',
          'Premium UI/UX',
          'Smooth scroll animations',
          'Lead capture forms',
          'Booking section',
          'SEO optimization',
          'Performance optimization',
        ],
        cta: 'Book Now',
        popular: true,
        badge: 'Most Popular',
      },
      {
        id: 'usd-premium',
        name: 'Premium',
        price: '$499',
        subtitle: 'Bespoke agency-grade system experience for high-end brands.',
        features: [
          'Everything in Growth',
          'Fully custom premium design',
          'Advanced animations',
          'Conversion-focused landing pages',
          'Custom integrations',
          'Priority support',
          'Full deployment assistance',
        ],
        cta: "Let's Work Together",
        popular: false,
        badge: '',
      }
    ]
  };

  const activePlans = plans[currency];

  return (
    <section id="pricing" className="relative py-28 bg-[#0b0b0b] border-b border-[#c9a46c]/10 overflow-hidden select-none">
      {/* Decorative premium radial gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(201,164,108,0.02)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.01)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
            Investment Structure
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-[#f5f5f0]">
            Pricing <span className="serif-display text-[#c9a46c] font-light italic">Plans</span>
          </h2>
          <p className="text-sm text-[#f5f5f0]/50 font-sans mt-4 max-w-xl mx-auto leading-relaxed">
            Choose the perfect package for your business. Built for startups, local businesses, and brands ready to grow online.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#121212] p-1.5 rounded-full border border-white/5 shadow-inner flex items-center relative gap-1">
            <button
              onClick={() => setCurrency('BDT')}
              className={`relative px-6 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider transition-colors duration-300 flex items-center gap-2 select-none cursor-pointer ${
                currency === 'BDT' ? 'text-[#0b0b0b] font-bold z-10' : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0]'
              }`}
            >
              {currency === 'BDT' && (
                <motion.div
                  layoutId="activePricingCurrency"
                  className="absolute inset-0 bg-[#c9a46c] rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-20 flex items-center gap-1.5">
                <span>🇧🇩</span> Bangladesh (BDT)
              </span>
            </button>

            <button
              onClick={() => setCurrency('USD')}
              className={`relative px-6 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider transition-colors duration-300 flex items-center gap-2 select-none cursor-pointer ${
                currency === 'USD' ? 'text-[#0b0b0b] font-bold z-10' : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0]'
              }`}
            >
              {currency === 'USD' && (
                <motion.div
                  layoutId="activePricingCurrency"
                  className="absolute inset-0 bg-[#c9a46c] rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-20 flex items-center gap-1.5">
                <span>🌍</span> International (USD)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activePlans.map((plan, index) => {
              const isMiddle = plan.popular;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 120,
                    damping: 18
                  }}
                  whileHover={{ 
                    y: isMiddle ? -12 : -8,
                    scale: isMiddle ? 1.04 : 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className={`relative rounded-3xl p-8 transition-all duration-300 shadow-2xl flex flex-col justify-between ${
                    isMiddle
                      ? 'bg-[#141412] border-2 border-[#c9a46c] lg:py-12 lg:px-10 z-20 shadow-[0_0_40px_rgba(201,164,108,0.15)] ring-1 ring-[#c9a46c]/40'
                      : 'bg-[#121212]/50 border border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Glassmorphic Ambient card highlight */}
                  <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(201,164,108,0.03)_0%,transparent_50%)] pointer-events-none" />

                  {/* Most Popular Glowing Aura Badge */}
                  {isMiddle && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-[#c9a46c] text-[#0b0b0b] font-mono font-bold tracking-widest text-[10px] uppercase py-1.5 px-4 rounded-full shadow-[0_0_20px_rgba(201,164,108,0.4)] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-current" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Package Meta Info */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-heading font-semibold text-[#f5f5f0] tracking-tight">
                        {plan.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#f5f5f0]/50 font-sans leading-relaxed mb-6 min-h-[32px]">
                      {plan.subtitle}
                    </p>

                    {/* Price with animations */}
                    <div className="mb-8 flex items-baseline">
                      <span className="text-4xl lg:text-5xl font-display font-bold text-[#f5f5f0] tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-[#f5f5f0]/40 text-xs font-mono uppercase tracking-wider ml-2">
                        / project
                      </span>
                    </div>

                    {/* Features checklist separator */}
                    <div className="border-t border-white/[0.04] pt-6 mb-8">
                      <p className="text-[10px] font-mono tracking-widest text-[#c9a46c] uppercase mb-4">
                        Key Deliverables:
                      </p>
                      <ul className="space-y-3.5">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-xs text-[#f5f5f0]/80">
                            <span className="mr-3 mt-0.5 w-4 h-4 rounded-full bg-[#1c1c1a] border border-[#c9a46c]/30 flex items-center justify-center flex-shrink-0 text-[#c9a46c]">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                            <span className="leading-normal font-sans">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Engagement triggers */}
                  <div className="mt-4 pt-4 border-t border-white/[0.04]">
                    <button
                      onClick={() => onSelectPackage(`${plan.name} — ${plan.price}`)}
                      className={`w-full py-4 px-6 rounded-xl font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isMiddle
                          ? 'bg-[#c9a46c] text-[#0b0b0b] hover:bg-[#b08e59] shadow-[0_4px_24px_rgba(201,164,108,0.25)] hover:shadow-[0_4px_30px_rgba(201,164,108,0.4)]'
                          : 'bg-[#1c1c1a] hover:bg-[#c9a46c] text-[#f5f5f0] hover:text-[#0b0b0b] border border-white/5 hover:border-[#c9a46c] shadow'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="text-[10px] text-center text-[#f5f5f0]/30 font-sans mt-3">
                      Secure milestone contract terms &middot; 100% moneyback guarantee
                    </p>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom micro-copy helper block */}
        <div className="mt-16 text-center max-w-xl mx-auto p-4 bg-[#121212]/30 border border-white/5 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#f5f5f0]/50 text-xs">
            <span className="flex items-center gap-1.5 text-white/70 font-mono text-[10px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#c9a46c]" /> 30-Day Post-Launch Warranty
            </span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span>Looking for custom scales (SaaS)? </span>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#c9a46c] hover:underline font-medium underline-offset-4 cursor-pointer"
            >
              Get Custom Quote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
