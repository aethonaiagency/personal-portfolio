import { motion } from 'motion/react';
import { Star, Quote, Heart } from 'lucide-react';
import { Testimonial } from '../types';

const reviews: Testimonial[] = [
  {
    quote: "Nashiat completely reinvented our online booking system. The bespoke Barbercrop layout captures our heritage grooming vibe perfectly and immediately increased our client bookings by +140%. Extremely skilled in React.",
    author: "Marcus Vance",
    role: "Founder & Master Barber",
    company: "Barbercrop Studio",
    avatarSeed: "marcus",
    rating: 5.0,
    planName: "Growth Package"
  },
  {
    quote: "A masterwork of visual storytelling. Nashiat combined fluid front-end animations with a robust reservation engine for our vineyard. Our customer engagement went up by +185% and digital feedback is phenomenal.",
    author: "Elena Rostova",
    role: "Creative Director",
    company: "Wize Winemakers",
    avatarSeed: "elena",
    rating: 4.9,
    planName: "Premium Package"
  },
  {
    quote: "Our table reservations went up 4.8x since launching the new site! Nashiat's dark, image-first culinary layout displays our sushi artistry beautifully, making 예약 booking effortless for our guests.",
    author: "David Sameul",
    role: "Executive Head Chef",
    company: "Hush Modern Japanese Sushi",
    avatarSeed: "david",
    rating: 5.0,
    planName: "Premium Package"
  },
  {
    quote: "Nashiat understands elite real estate presentation constraints. They crafted a clean, premium grid system that has driven 220% more high-trust inbound leads and broker inquiries. Incredible design sense.",
    author: "Sarah Jenkins",
    role: "VP of Product Development",
    company: "Housify Match",
    avatarSeed: "sarah",
    rating: 4.9,
    planName: "Growth Package"
  },
  {
    quote: "The rugged, charcoal adventure ecommerce interface Nashiat built has tripled our seasonal engagement. The checkout feels lightning-fast and handles our apparel assets with zero lags.",
    author: "Dave Miller",
    role: "E-Commerce Operations Lead",
    company: "TuranOutfit Wilderness",
    avatarSeed: "dave",
    rating: 4.8,
    planName: "Premium Package"
  },
  {
    quote: "By ditching standard Web3 gradient clichés for a serif-based elite layout, Nashiat gave our creative studio a premium identity. Plus, our web performance speed score hit a perfect 99 on mobile devices.",
    author: "Alex Rivera",
    role: "Managing Partner",
    company: "Wen Launch Agency",
    avatarSeed: "alex",
    rating: 5.0,
    planName: "Starter Package"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-[#0b0b0b] py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-[#8b5cf6]/10">
      
      {/* Background visual highlight */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.02)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8b5cf6] block mb-3">
            Client Consensus
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
            Trusted by the <span className="serif-display text-[#8b5cf6] font-light italic">Bespoke</span>
          </h3>
          <p className="text-sm text-[#f5f5f0]/50 font-sans mt-3">
            Don’t just take my word. Read the verbatim feedback log from commercial directors who trusted my handcrafted code.
          </p>
        </div>

        {/* Testimonials Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-8 rounded-[4px] bg-[#121212]/95 border border-white/5 hover:border-[#8b5cf6]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Background elegant SVG quote mark */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#8b5cf6]/5 pointer-events-none" />

              <div>
                {/* Score Stars & Pricing Plan */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rating = review.rating || 5;
                      const isHalf = i === Math.floor(rating) && rating % 1 !== 0;
                      const isFilled = i < Math.floor(rating);
                      return (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            isFilled 
                              ? 'fill-[#8b5cf6] text-[#8b5cf6]' 
                              : isHalf 
                                ? 'fill-[#8b5cf6]/50 text-[#8b5cf6]' 
                                : 'text-[#8b5cf6]/25'
                          }`} 
                        />
                      );
                    })}
                    <span className="text-[10px] font-mono font-medium text-[#f5f5f0]/50 ml-1">
                      {review.rating?.toFixed(1) || "5.0"}
                    </span>
                  </div>

                  {review.planName && (
                    <span className="text-[8px] font-mono tracking-wider bg-[#8b5cf6]/10 text-[#8b5cf6] px-2 py-0.5 rounded-[2px] border border-[#8b5cf6]/20 font-medium">
                      {review.planName}
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm text-[#f5f5f0]/80 font-sans font-light leading-relaxed italic mb-8 relative z-10 text-left">
                  “ {review.quote} ”
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/5 text-left">
                <img 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${review.avatarSeed}&backgroundColor=0b0b0b&textColor=8b5cf6`}
                  alt={review.author}
                  className="w-10 h-10 rounded-full bg-[#0b0b0b] border border-[#8b5cf6]/20"
                  referrerPolicy="no-referrer"
                />
                
                <div>
                  <p className="text-xs font-semibold text-[#f5f5f0] uppercase tracking-wider">
                    {review.author}
                  </p>
                  <p className="text-[10px] font-mono text-[#8b5cf6]">
                    {review.role}, <span className="text-[#f5f5f0]/50">{review.company}</span>
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Small Trust Metrics Accent */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#8b5cf6]" />
            <span className="font-mono text-[10px] text-[#f5f5f0]/40 uppercase tracking-widest">
              100% Customer satisfaction retention rate
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
