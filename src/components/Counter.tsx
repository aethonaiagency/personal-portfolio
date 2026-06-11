import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

interface CounterProps {
  value: number;
  duration?: number; // in ms
  suffix?: string;
  prefix?: string;
}

export default function Counter({ 
  value, 
  duration = 1800, 
  suffix = '', 
  prefix = '' 
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    function animate(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Luxurious easeOutCubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
