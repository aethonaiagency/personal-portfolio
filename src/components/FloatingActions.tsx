import { motion } from 'motion/react';
import { Calendar, PhoneCall, MessageCircle } from 'lucide-react';
import { ProfileData } from '../App';

interface FloatingActionsProps {
  onOpenBookModal: () => void;
  profile?: ProfileData;
}

export default function FloatingActions({ onOpenBookModal, profile }: FloatingActionsProps) {
  const handleWhatsAppAction = () => {
    const waNumber = profile?.whatsappPhone || '8801625418838';
    const waName = profile?.fullName?.split(' ')[0] || 'Nashiat';
    window.open(
      `https://wa.me/${waNumber}?text=Hi%20${waName},%20I'm%20interested%20in%20building%20a%20premium%20website`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
      {/* WhatsApp Quick Link */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={handleWhatsAppAction}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-[#121212] border border-emerald-500/30 text-emerald-400 hover:text-[#0b0b0b] hover:bg-emerald-500 flex items-center justify-center shadow-lg cursor-pointer group relative"
          title="Ping Nashiat on WhatsApp"
        >
          {/* Subtle Custom Tooltip */}
          <div className="absolute right-14 px-3 py-1.5 bg-[#121212] border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-[0.2em] whitespace-nowrap rounded-[2px] opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 translate-x-2 pointer-events-none transition-all duration-300 shadow-2xl z-20">
            WhatsApp
          </div>

          {/* Subtle, smooth glowing pulse aura */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/30 pointer-events-none"
          />
          <MessageCircle className="w-5 h-5 group-hover:scale-105 transition-transform z-10" />
        </motion.button>
      </motion.div>

      {/* Book Call Selector Shortcut */}
      <motion.button
        onClick={onOpenBookModal}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.7, type: 'spring', stiffness: 260, damping: 20 }}
        className="w-12 h-12 rounded-full bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer group relative"
        title="Schedule Private Call consultation"
      >
        {/* Subtle Custom Tooltip */}
        <div className="absolute right-14 px-3 py-1.5 bg-[#121212] border border-[#c9a46c]/30 text-[#c9a46c] text-[10px] font-mono uppercase tracking-[0.16em] whitespace-nowrap rounded-[2px] opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 translate-x-2 pointer-events-none transition-all duration-300 shadow-2xl z-20">
          Schedule Call
        </div>

        <Calendar className="w-5 h-5 group-hover:scale-105 transition-transform" />
      </motion.button>
    </div>
  );
}
