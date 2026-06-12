import { useRef, useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import HeroTechPanel from './HeroTechPanel';
import { ProfileData } from '../App';
import Magnetic from './Magnetic';
import { SplitText } from './TextReveal';

interface HeroProps {
  onOpenBookModal: () => void;
  profile?: ProfileData;
}

export default function Hero({ onOpenBookModal, profile }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // WebGL loop is fully enabled across devices for unified peak-fidelity premium aesthetics
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 v_texCoord;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    // Create animated flowing waves
    float color1 = sin(uv.x * 3.0 + u_time * 0.5) * 0.5 + 0.5;
    float color2 = sin(uv.y * 2.0 - u_time * 0.3) * 0.5 + 0.5;
    
    // Mixing dark base with neon purple and hints of red
    vec3 baseColor = vec3(0.04, 0.04, 0.06); // Very dark charcoal
    vec3 neonPurple = vec3(0.66, 0.33, 0.97); // #A855F7
    vec3 neonRed = vec3(0.94, 0.27, 0.27);    // #EF4444
    
    float mask = smoothstep(0.4, 0.6, color1 * color2);
    
    // Mouse interaction: glow around mouse
    float dist = length(uv - mouse);
    float mouseGlow = smoothstep(0.3, 0.0, dist) * 0.2;
    
    vec3 finalColor = mix(baseColor, neonPurple * 0.4, mask);
    finalColor += neonRed * 0.1 * (1.0 - mask);
    finalColor += neonPurple * mouseGlow;
    
    // Add some grain/noise for texture
    finalColor += (noise(uv + u_time * 0.01) - 0.5) * 0.03;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function cs(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;

    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    function render(t: number) {
      if (!gl || !canvas) return;
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      gl.deleteProgram(prog);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buf);
    };
  }, []);

  const orbX = useSpring(0, { damping: 40, stiffness: 180 });
  const orbY = useSpring(0, { damping: 40, stiffness: 180 });

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleParaMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - window.innerWidth / 2) * 0.05;
      const offsetY = (e.clientY - window.innerHeight / 2) * 0.05;
      orbX.set(offsetX);
      orbY.set(offsetY);
    };

    window.addEventListener('mousemove', handleParaMove);
    return () => window.removeEventListener('mousemove', handleParaMove);
  }, [orbX, orbY]);

  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const textContainerParent = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      }
    }
  };

  const textChild = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 1.2 }
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0b0b0b] flex items-center justify-center pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
      
      {/* Absolute Glow, Shader Canvas, and Grid Ambiance Elements */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />
      
      {/* Fallback ambient CSS gradient glow for touch/mobile devices when WebGL is bypassed */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.15)_0%,rgba(239,68,68,0.03)_50%,transparent_100%)] lg:hidden pointer-events-none z-0" />
      
      <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-20">
        
        {/* Left Side: Premium Wording */}
        <motion.div 
          variants={textContainerParent}
          initial="hidden"
          animate="show"
          className="lg:col-span-8 flex flex-col items-start text-left relative"
        >
          {/* Animated gradient glow slowly moving behind the hero content */}
          <div className="absolute -left-12 -top-12 w-96 h-96 bg-gradient-to-tr from-[#8b5cf6]/8 to-[#ef4444]/5 rounded-full blur-[100px] pointer-events-none select-none animate-[pulse_10s_infinite_alternate]" />
          {/* Tagline Badge */}
          <motion.div 
            variants={textChild}
            className="text-[10px] uppercase tracking-[0.25em] text-[#8b5cf6] font-semibold mb-4 sm:mb-6 flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
            React & Next.js Expert • UI Engineering
          </motion.div>

          {/* Value Prop Wording */}
          <motion.h1 
            variants={textChild}
            className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-display font-bold tracking-tight text-[#f5f5f0] leading-[1.12] mb-5 max-w-2xl"
          >
            <SplitText text="I build" />{' '}
            <motion.span 
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="serif-display font-light text-glow text-[#8b5cf6] italic inline-block mr-[0.22em]"
            >
              high-performance
            </motion.span>{' '}
            <SplitText text="Web Apps that convert traffic into revenue." delay={0.25} />
          </motion.h1>

          <motion.p 
            variants={textChild}
            className="max-w-xl text-sm sm:text-base md:text-lg text-[#f5f5f0]/70 leading-relaxed font-sans font-light mb-8"
          >
            Specializing in modern React, Next.js, and bespoke UI engineering. I craft ultra-fast, premium-grade digital interfaces designed specifically for SaaS products and luxury brands to maximize conversion and engagement.
          </motion.p>

          {/* Call To Action Buttons with strict hierarchy */}
          <motion.div 
            variants={textChild}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
          >
            <Magnetic>
              <button
                onClick={scrollToWork}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#f5f5f0] hover:bg-[#8b5cf6] text-[#0b0b0b] font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 group font-mono rounded-[2px] w-full sm:w-auto min-h-[44px] touch-manipulation"
              >
                View My Work
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>
            </Magnetic>
            
            <Magnetic>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 sm:px-8 py-3.5 sm:py-4 border border-[#f5f5f0]/30 text-[#f5f5f0] hover:bg-white/5 font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2 font-mono rounded-[2px] w-full sm:w-auto min-h-[44px] touch-manipulation"
              >
                Contact Me
              </button>
            </Magnetic>
          </motion.div>

          {/* High-end metrics mini-banner */}
          <motion.div 
            variants={textChild}
            className="grid grid-cols-3 gap-4 sm:gap-6 pt-10 mt-10 border-t border-[#f5f5f0]/10 w-full max-w-lg"
          >
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-[#8b5cf6]">
                {profile?.handcraftedBuiltPercent !== undefined ? `${profile.handcraftedBuiltPercent}%` : '100%'}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Handcrafted code
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-[#f5f5f0]">
                {profile?.lighthouseTarget || '90+'}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Lighthouse Score
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-[#f5f5f0]">
                {profile?.designStandardName || 'Luxury'}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase mt-1">
                Design Standard
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Interactive Developer Console Metrics UI Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.2, 1] }}
          className="lg:col-span-4 flex justify-center lg:justify-end relative w-full"
        >
          <div className="relative w-full max-w-md">
            {/* Ambient designer glows behind console */}
            <div className="absolute inset-0 bg-[#8b5cf6]/10 rounded-xl blur-[100px] pointer-events-none select-none" />
            
            {/* Parallax inertial motion offset box */}
            <motion.div style={{ x: orbX, y: orbY }} className="w-full relative z-10">
              <HeroTechPanel />
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Underneath: Animated Mouse Scroll Indicator */}
      <div 
        onClick={scrollToWork}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity z-10"
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#f5f5f0]/50">
          Scroll to explore
        </span>
        <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center p-1.5">
          <motion.div 
            animate={{ 
              y: [0, 8, 0] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="w-1 h-2 bg-[#8b5cf6] rounded-full"
          />
        </div>
      </div>

      {/* RIGHT SIDE: MOUSE SCROLL INDICATOR */}
      <div className="absolute bottom-12 right-12 hidden xl:flex flex-col items-center gap-4 z-20">
        <div className="vertical-text text-[10px] tracking-[0.5em] opacity-30 uppercase font-mono">
          Scroll to Explore
        </div>
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#f5f5f0]/40 to-transparent"></div>
      </div>

    </section>
  );
}
