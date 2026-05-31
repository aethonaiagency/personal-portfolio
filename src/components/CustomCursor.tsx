import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'drag' | 'click'>('default');
  const [cursorText, setCursorText] = useState('');
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 300, mass: 0.6 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch screens/mobile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleHoverStart = (e: Event) => {
      const target = e.target as HTMLElement;
      const type = target.getAttribute('data-cursor');
      const text = target.getAttribute('data-cursor-text') || '';
      
      if (type === 'drag') {
        setCursorType('drag');
      } else if (type === 'click' || target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('a') || target.closest('button')) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
      setCursorText(text);
    };

    const handleHoverEnd = () => {
      setCursorType('default');
      setCursorText('');
    };

    window.addEventListener('mousemove', moveMouse);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Delegate hover events to find cursor requests
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [visible, cursorX, cursorY]);

  if (!visible) return null;

  const size = cursorType === 'drag' ? 80 : cursorType === 'hover' ? 48 : 12;

  return (
    <>
      {/* Target trailing cursor element */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 flex items-center justify-center text-[10px] font-mono tracking-widest text-[#0b0b0b] font-bold select-none mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: size,
          height: size,
          backgroundColor: '#f5f5f0',
        }}
        animate={{
          scale: cursorType === 'click' ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        {cursorType === 'drag' && (
          <span className="text-[#0b0b0b] font-bold text-[8px] uppercase">
            {cursorText || 'DRAG'}
          </span>
        )}
        {cursorType === 'hover' && cursorText && (
          <span className="text-[#0b0b0b] font-bold text-[8px] uppercase">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Tiny direct dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#c9a46c] rounded-full pointer-events-none z-50 pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
}
