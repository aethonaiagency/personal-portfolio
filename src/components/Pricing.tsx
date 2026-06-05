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
    <section id="pricing" className="relative py-16 sm:py-24 bg-[#0b0b0b] border-b border-[#c9a46c]/10 overflow-hidden select-none">
      {/* Decorative premium radial gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(201,164,108,0.01)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-left mb-10 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
            Investment Structure
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
            Bespoke Plans & <span className="serif-display text-[#c9a46c] font-light italic">Services</span>
          </h2>
          <p className="text-sm text-[#f5f5f0]/60 font-sans mt-3 max-w-2xl leading-relaxed font-light">
            Clear, value-driven investment brackets constructed to scale conversions. Fully covered by our milestone guarantees and expert deployment pipelines.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex justify-start mb-12">
          <div className="bg-[#121212] p-1 rounded-[4px] border border-white/5 flex items-center relative gap-1">
            <button
              onClick={() => setCurrency('BDT')}
              className={`relative px-4 py-2 rounded-[2px] text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5 select-none cursor-pointer ${
                currency === 'BDT' ? 'text-[#0b0b0b] font-bold z-10' : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0]'
              }`}
            >
              {currency === 'BDT' && (
                <motion.div
                  layoutId="activePricingCurrency"
                  className="absolute inset-0 bg-[#c9a46c] rounded-[2px]"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-20 flex items-center gap-1">
                <span>🇧🇩</span> BDT (৳)
              </span>
            </button>

            <button
              onClick={() => setCurrency('USD')}
              className={`relative px-4 py-2 rounded-[2px] text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5 select-none cursor-pointer ${
                currency === 'USD' ? 'text-[#0b0b0b] font-bold z-10' : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0]'
              }`}
            >
              {currency === 'USD' && (
                <motion.div
                  layoutId="activePricingCurrency"
                  className="absolute inset-0 bg-[#c9a46c] rounded-[2px]"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-20 flex items-center gap-1">
                <span>🌍</span> USD ($)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <AnimatePresence mode="wait">
            {activePlans.map((plan, index) => {
              const isMiddle = plan.popular;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`relative p-6 flex flex-col justify-between rounded-[4px] transition-all duration-300 ${
                    isMiddle
                      ? 'bg-[#141412] border border-[#c9a46c]/40 z-20 shadow-[0_0_30px_rgba(201,164,108,0.1)]'
                      : 'bg-[#121212]/90 border border-white/5 hover:border-[#c9a46c]/30'
                  }`}
                >
                  {/* Most Popular Glowing Aura Badge */}
                  {isMiddle && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-[#c9a46c] text-[#0b0b0b] font-mono font-bold tracking-widest text-[8px] uppercase py-1 px-2.5 rounded-[2px] shadow-[0_0_15px_rgba(201,164,108,0.3)] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 fill-current" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Package Meta Info */}
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-heading font-semibold text-[#f5f5f0] tracking-tight">
                        {plan.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#f5f5f0]/60 font-sans leading-relaxed mb-6 min-h-[36px] font-light">
                      {plan.subtitle}
                    </p>

                    {/* Price */}
                    <div className="mb-6 flex items-baseline">
                      <span className="text-3xl md:text-4xl font-display font-medium text-[#f5f5f0] tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-[#f5f5f0]/40 text-[9px] font-mono uppercase tracking-wider ml-1.5">
                        / project
                      </span>
                    </div>

                    {/* Features checklist separator */}
                    <div className="border-t border-white/5 pt-4 mb-6">
                      <p className="text-[9px] font-mono tracking-widest text-[#c9a46c] uppercase mb-3">
                        Key Deliverables:
                      </p>
                      <ul className="space-y-2.5">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-xs text-[#f5f5f0]/85 font-light">
                            <span className="mr-2 mt-0.5 w-3.5 h-3.5 rounded-full bg-[#1c1c1a] border border-[#c9a46c]/20 flex items-center justify-center flex-shrink-0 text-[#c9a46c]">
                              <Check className="w-2 h-2 stroke-[2.5]" />
                            </span>
                            <span className="leading-snug font-sans">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Engagement triggers */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <button
                      onClick={() => onSelectPackage(`${plan.name} — ${plan.price}`)}
                      className={`w-full py-3.5 px-4 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer transition-all rounded-[2px] min-h-[44px] touch-manipulation ${
                        isMiddle
                          ? 'bg-[#c9a46c] text-[#0b0b0b] hover:bg-[#b08e59]'
                          : 'bg-[#1c1c1a] hover:bg-[#c9a46c] text-[#f5f5f0] hover:text-[#0b0b0b] border border-white/5 hover:border-[#c9a46c]'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3" />
                    </button>
                    <p className="text-[9px] text-center text-[#f5f5f0]/30 font-sans mt-2.5">
                      Milestone contracts & 100% satisfaction guarantee
                    </p>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom micro-copy helper block */}
        <div className="mt-12 text-center max-w-2xl mx-auto p-4 bg-[#121212]/30 border border-white/5 rounded-[4px]">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#f5f5f0]/50 text-xs font-light">
            <span className="flex items-center gap-1 text-[#c9a46c] font-mono text-[9px] uppercase tracking-wider">
              <Shield className="w-3 h-3" /> 30-Day Post-Launch Support Warranty
            </span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span>Unsure which to choose? </span>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#c9a46c] hover:underline font-mono uppercase text-[9px] tracking-wider cursor-pointer"
            >
              Get Custom Quote
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
