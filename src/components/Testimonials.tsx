import { motion } from 'motion/react';
import { Star, Quote, Heart } from 'lucide-react';
import { Testimonial } from '../types';

const reviews: Testimonial[] = [
  {
    quote: "Nashiat understands luxury design. The headless architecture they built has drastically improved our load speeds. Our checkout completion rate grew by 34.2% within weeks. Fast delivery, professional communication.",
    author: "Maximilian Vane",
    role: "CEO & Co-Founder",
    company: "Aura Premium Scent Co.",
    avatarSeed: "vane"
  },
  {
    quote: "Usually, engineers talk about speed but ignore aesthetics. Nashiat combines extreme React and Vite optimizations with world-class graphic tastes. The Creator console they developed works flawlessly.",
    author: "Sonia Reed",
    role: "VP of Product",
    company: "Vibe Creator Suite",
    avatarSeed: "reed"
  },
  {
    quote: "Exactly what our brand needed to justify our boutique prices. The horizontal slider layout handles high-res creative assets with zero viewport lags on mobile or tablet frames. Highly recommended.",
    author: "Hiroshi Sato",
    role: "Executive Director",
    company: "Kinetic Media Studio",
    avatarSeed: "sato"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-[#0b0b0b] py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-[#c9a46c]/10">
      
      {/* Background visual highlight */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.02)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
            Client Consensus
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
            Trusted by the <span className="serif-display text-[#c9a46c] font-light italic">Bespoke</span>
          </h3>
          <p className="text-sm text-[#f5f5f0]/50 font-sans mt-3">
            Don’t just take my word. Read the verbatim feedback log from commercial directors who trusted my handcrafted code.
          </p>
        </div>

        {/* Testimonials Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-8 rounded-[4px] bg-[#121212]/95 border border-white/5 hover:border-[#c9a46c]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Background elegant SVG quote mark */}
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#c9a46c]/5 pointer-events-none" />

              <div>
                {/* Score Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#c9a46c] text-[#c9a46c]" />
                  ))}
                </div>

                <p className="text-xs md:text-sm text-[#f5f5f0]/80 font-sans font-light leading-relaxed italic mb-8 relative z-10 text-left">
                  “ {review.quote} ”
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/5 text-left">
                <img 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${review.avatarSeed}&backgroundColor=0b0b0b&textColor=c9a46c`}
                  alt={review.author}
                  className="w-10 h-10 rounded-full bg-[#0b0b0b] border border-[#c9a46c]/20"
                  referrerPolicy="no-referrer"
                />
                
                <div>
                  <p className="text-xs font-semibold text-[#f5f5f0] uppercase tracking-wider">
                    {review.author}
                  </p>
                  <p className="text-[10px] font-mono text-[#c9a46c]">
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
            <Heart className="w-4 h-4 text-[#c9a46c]" />
            <span className="font-mono text-[10px] text-[#f5f5f0]/40 uppercase tracking-widest">
              100% Customer satisfaction retention rate
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
