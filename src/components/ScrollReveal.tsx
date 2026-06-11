import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
}

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  yOffset = 40, 
  duration = 1.2 
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // custom premium cubic bezier curve (ultra-smooth decelerate)
      }}
    >
      {children}
    </motion.div>
  );
}
