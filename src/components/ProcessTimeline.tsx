import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Compass, Lightbulb, PenTool, Code, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { ProcessStep } from '../types';

const steps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery & Analytics Audit',
    description: 'I tear down historical performance, analyze competitor visual paths, and define direct key performance indicators.',
    details: ['Competitive benchmarking', 'High-value keyword outline', 'Technical bottleneck audit']
  },
  {
    number: '02',
    title: 'Interaction Strategy Matrix',
    description: 'Fleshing out information architecture, defining high-converting CTA zones, and scheduling the full wireframe map.',
    details: ['User psychological wireframing', 'Typography hierarchy check', 'Sitemap confirmation']
  },
  {
    number: '03',
    title: 'High-Fidelity Figma Styling',
    description: 'Delivering bespoke high-fidelity designs dressed in premium colorways, custom layouts, and custom-guided motion models.',
    details: ['Bespoke luxury desktop designs', 'Lightweight mobile layout maps', 'Interactive high-fi prototype']
  },
  {
    number: '04',
    title: 'Handcrafted TypeScript Code',
    description: 'Writing blazing-fast, semantic React / Next.js code with clean tailset utility structures and beautiful Framer Motion parameters.',
    details: ['Blazing 100ms load responses', 'Highly robust code hierarchy', 'Responsive viewport alignments']
  },
  {
    number: '05',
    title: 'Optimized Deployment & Launch',
    description: 'Conducting double-tier audits across performance engines, configuring analytical dashboards, and pressing standard domain releases.',
    details: ['Comprehensive double device check', 'Lighthouse score verification', 'Google Analytics dashboard link']
  },
];

const iconsList = [
  <Compass className="w-5 h-5 text-[#8b5cf6]" />,
  <Lightbulb className="w-5 h-5 text-[#8b5cf6]" />,
  <PenTool className="w-5 h-5 text-[#8b5cf6]" />,
  <Code className="w-5 h-5 text-[#8b5cf6]" />,
  <Rocket className="w-5 h-5 text-[#8b5cf6]" />,
];

// --- INTERACTIVE LAB WIDGETS ---

// Widget 1: Audit Simulator
function Step1AuditWidget() {
  const [url, setUrl] = useState('');
  const [stage, setStage] = useState<'idle' | 'scanning' | 'results' | 'optimized'>('idle');
  const [progress, setProgress] = useState(0);

  const startAnalysis = (e: FormEvent) => {
    e.preventDefault();
    setStage('scanning');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStage('results');
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 60);
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 w-full max-w-sm mx-auto shadow-xl hover:border-[#8b5cf6]/20">
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8b5cf6] mb-2 block font-semibold">
        Live Performance Audit Lab
      </span>
      {stage === 'idle' && (
        <form onSubmit={startAnalysis} className="space-y-3">
          <p className="text-[11px] text-[#f5f5f0]/55 leading-relaxed font-sans">
            Audit your site metrics. See where you are losing up to 40% of conversion value before writing modular code.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. yourbrand.io" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#8b5cf6] transition-colors font-mono"
              required
            />
            <button 
              type="submit" 
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-3 py-1 rounded text-xs font-mono font-bold transition-all duration-200 shadow-md"
            >
              Scan
            </button>
          </div>
        </form>
      )}

      {stage === 'scanning' && (
        <div className="space-y-4 py-3">
          <div className="flex justify-between items-center text-xs font-mono text-[#f5f5f0]/60">
            <span>Analyzing {url || 'yourbrand.io'}...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="bg-[#8b5cf6] h-full" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#8b5cf6]/80 text-left space-y-1 h-12 overflow-hidden">
            {progress > 15 && <div className="animate-fade-in">&gt; Fetching asset cascade headers</div>}
            {progress > 50 && <div className="animate-fade-in">&gt; Testing LCP visual render blocks</div>}
            {progress > 80 && <div className="animate-fade-in">&gt; Assessing payload layout shifts</div>}
          </div>
        </div>
      )}

      {stage === 'results' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="bg-black/30 p-2 rounded border border-red-500/10 text-center">
              <span className="block text-red-400 text-lg sm:text-xl font-bold">58</span>
              <span className="text-[9px] font-mono text-[#f5f5f0]/50 uppercase">Perf</span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-yellow-500/10 text-center">
              <span className="block text-yellow-400 text-lg sm:text-xl font-bold">71</span>
              <span className="text-[9px] font-mono text-[#f5f5f0]/50 uppercase">Practices</span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-yellow-500/10 text-center">
              <span className="block text-yellow-500 text-lg sm:text-xl font-bold">69</span>
              <span className="text-[9px] font-mono text-[#f5f5f0]/50 uppercase">SEO</span>
            </div>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-md p-2.5 text-left">
            <span className="text-[10px] font-mono font-bold text-red-400 block mb-1">Key Bottlenecks:</span>
            <ul className="text-[9px] text-[#f5f5f0]/60 space-y-1 list-disc pl-3">
              <li>Heavy static assets triggering 3.4s LCP delay</li>
              <li>Unused CSS scripts blocking page load execution</li>
            </ul>
          </div>
          <button 
            onClick={() => setStage('optimized')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded text-xs font-mono font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" /> Optimize Engine Speed
          </button>
        </div>
      )}

      {stage === 'optimized' && (
        <div className="space-y-4 font-sans">
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="bg-black/30 p-2 rounded border border-emerald-500/20 text-center">
              <span className="block text-emerald-400 text-lg sm:text-xl font-bold text-glow">99</span>
              <span className="text-[9px] font-mono text-[#f5f5f0]/50 uppercase font-semibold">Perf</span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-emerald-500/20 text-center">
              <span className="block text-emerald-400 text-lg sm:text-xl font-bold text-glow">100</span>
              <span className="text-[9px] font-mono text-[#f5f5f0]/50 uppercase font-semibold">Practices</span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-emerald-500/20 text-center">
              <span className="block text-emerald-400 text-lg sm:text-xl font-bold text-glow">100</span>
              <span className="text-[9px] font-mono text-[#f5f5f0]/50 uppercase font-semibold">SEO</span>
            </div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-400/20 rounded-md p-2.5 text-left">
            <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-1">Live Rollout Verification:</span>
            <ul className="text-[9px] text-[#f5f5f0]/60 space-y-1 list-disc pl-3 font-mono">
              <li>Edge hydration delivery under 80ms</li>
              <li>Compiling code removes asset bulk bloating</li>
            </ul>
          </div>
          <button 
            onClick={() => { setStage('idle'); setUrl(''); }}
            className="w-full bg-[#121212] border border-white/10 hover:bg-white/5 text-[#f5f5f0] py-1 rounded text-xs font-mono transition-colors"
          >
            Reset Auditor
          </button>
        </div>
      )}
    </div>
  );
}

// Widget 2: Strategy Simulator
function Step2StrategyWidget() {
  const [strategy, setStrategy] = useState<'hybrid' | 'minimal' | 'ecommerce'>('hybrid');

  const strategies = [
    { id: 'hybrid', label: 'High CTR' },
    { id: 'minimal', label: 'Prestige' },
    { id: 'ecommerce', label: 'E-com/Sells' }
  ] as const;

  return (
    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 w-full max-w-sm mx-auto shadow-xl hover:border-[#8b5cf6]/20">
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8b5cf6] mb-3 block font-semibold">
        Interactive Wireframe Matrix
      </span>
      
      {/* Selector tabs */}
      <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded border border-white/5 mb-3.5">
        {strategies.map((s) => (
          <button
            key={s.id}
            onClick={() => setStrategy(s.id)}
            className={`text-[9px] font-mono py-1 rounded transition-all duration-200 ${
              strategy === s.id 
                ? 'bg-[#8b5cf6] text-white font-bold' 
                : 'text-[#f5f5f0]/40 hover:text-[#f5f5f0]/80'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Dynamic Mini Wireframe Card */}
      <div className="bg-black/60 border border-white/5 rounded-lg p-3 space-y-2 h-[120px] flex flex-col justify-between relative overflow-hidden font-mono text-[8px]">
        
        {/* Abstract Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <div className="w-8 h-2 bg-white/20 rounded" />
          <div className="flex gap-1">
            <div className="w-4 h-1.5 bg-white/10 rounded" />
            <div className="w-4 h-1.5 bg-[#8b5cf6]/50 rounded" />
          </div>
        </div>

        {/* Dynamic Inner Layout Body */}
        {strategy === 'hybrid' && (
          <motion.div key="hybrid" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 text-center my-auto">
            <div className="w-16 h-2 bg-[#8b5cf6]/40 mx-auto rounded" />
            <div className="w-24 h-1.5 bg-white/15 mx-auto rounded" />
            <div className="flex justify-center gap-1.5 pt-1">
              <div className="w-12 h-3.5 bg-[#8b5cf6] rounded flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20">
                <div className="w-5 h-1 bg-white rounded-full animate-pulse" />
              </div>
              <div className="w-8 h-3.5 bg-white/10 rounded" />
            </div>
          </motion.div>
        )}

        {strategy === 'minimal' && (
          <motion.div key="minimal" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5 text-center my-auto font-serif">
            <div className="w-20 h-2 bg-white/25 mx-auto rounded" />
            <div className="w-10 h-1 bg-white/10 mx-auto rounded" />
            <div className="pt-1.5">
              <div className="w-14 h-3 border border-white/30 rounded mx-auto" />
            </div>
          </motion.div>
        )}

        {strategy === 'ecommerce' && (
          <motion.div key="ecommerce" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5 my-auto">
            <div className="flex justify-between items-center gap-2">
              <div className="space-y-0.5 flex-1 text-left">
                <div className="w-12 h-2 bg-[#8b5cf6]/30 rounded" />
                <div className="w-8 h-1 bg-white/10 rounded" />
              </div>
              <div className="w-16 h-5.5 bg-[#8b5cf6] rounded flex items-center justify-center flex-shrink-0">
                <span className="text-[7.5px] text-white font-bold">BUY $49</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded flex items-center px-1.5 justify-between">
              <span className="text-[6.5px] text-yellow-400 font-bold uppercase tracking-wider">Only 3 slots remaining</span>
              <div className="w-1 h-1 bg-red-400 rounded-full animate-ping" />
            </div>
          </motion.div>
        )}

        {/* Footnotes */}
        <div className="border-t border-white/5 pt-1.5 flex justify-between items-center text-[7px] text-[#f5f5f0]/40">
          <span>Target Bottleneck Focus</span>
          {strategy === 'hybrid' && <span className="text-[#8b5cf6] font-semibold">Instant conversions</span>}
          {strategy === 'minimal' && <span className="text-white/60 font-semibold">Premium brand prestige</span>}
          {strategy === 'ecommerce' && <span className="text-yellow-400 font-semibold">Action scarcity engine</span>}
        </div>
      </div>
    </div>
  );
}

// Widget 3: Figma Playground
function Step3FigmaWidget() {
  const [themeColor, setThemeColor] = useState<'violet' | 'emerald' | 'amber' | 'mono'>('violet');
  const [font, setFont] = useState<'syne' | 'cormorant' | 'inter'>('syne');

  const themes = [
    { id: 'violet', label: 'Violet', bg: 'bg-[#8b5cf6]' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-[#10b981]' },
    { id: 'amber', label: 'Amber', bg: 'bg-[#f59e0b]' },
    { id: 'mono', label: 'Classic', bg: 'bg-[#f5f5f0]' }
  ] as const;

  const fonts = [
    { id: 'syne', label: 'Syne' },
    { id: 'cormorant', label: 'Cormorant' },
    { id: 'inter', label: 'Inter' }
  ] as const;

  return (
    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 w-full max-w-sm mx-auto shadow-xl hover:border-[#8b5cf6]/20">
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8b5cf6] mb-3 block font-semibold">
        Figma Rendering Playground
      </span>

      {/* Styled mockup card wrapper */}
      <div className="bg-black/60 border border-white/5 rounded-lg p-3 text-center relative overflow-hidden h-[120px] flex flex-col justify-center items-center mb-3.5 transition-all duration-300">
        
        {/* Blur orb shifting background */}
        <div className={`absolute w-[180px] h-[180px] rounded-full blur-2xl opacity-10 pointer-events-none transition-all duration-500 ${
          themeColor === 'violet' ? 'bg-[#8b5cf6] -right-10' :
          themeColor === 'emerald' ? 'bg-[#10b981] -left-10' :
          themeColor === 'amber' ? 'bg-[#f59e0b] right-10 -top-10' : 'bg-white -right-10'
        }`} />

        <div className="relative z-10 space-y-1.5">
          <span className={`text-[8px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${
            themeColor === 'violet' ? 'text-[#8b5cf6]' :
            themeColor === 'emerald' ? 'text-[#10b981]' :
            themeColor === 'amber' ? 'text-[#f59e0b]' : 'text-[#f5f5f0]/80'
          }`}>
            Luxury UI Style Map
          </span>
          
          <h5 className={`text-[13px] sm:text-[14px] font-bold tracking-tight text-[#f5f5f0] leading-none transition-all duration-300 ${
            font === 'syne' ? 'font-display' :
            font === 'cormorant' ? 'serif-display italic font-light' : 'font-sans'
          }`}>
            Creative Portfolio Portal
          </h5>
          
          <p className="text-[8.5px] text-[#f5f5f0]/50 max-w-[190px] mx-auto leading-relaxed font-sans">
            Tailoring bespoke mock layouts to secure maximum consumer attention.
          </p>

          <div className="pt-1 select-none">
            <span className={`inline-block text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-white/5 transition-all duration-300 ${
              themeColor === 'violet' ? 'bg-[#8b5cf6] text-white shadow-[#8b5cf6]/20 shadow-md' :
              themeColor === 'emerald' ? 'bg-[#10b981] text-white shadow-[#10b981]/20 shadow-md' :
              themeColor === 'amber' ? 'bg-[#f59e0b] text-white shadow-[#f59e0b]/20 shadow-md' : 'bg-white text-black'
            }`}>
              Live Sample Click
            </span>
          </div>
        </div>
      </div>

      {/* Control knobs */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[8.5px] font-mono text-[#f5f5f0]/40 w-12 flex-shrink-0">Color:</span>
          <div className="flex gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeColor(t.id)}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${t.bg} ${
                  themeColor === t.id ? 'border-[#8b5cf6] ring-2 ring-[#8b5cf6]/20 scale-125' : 'border-white/10'
                }`}
                title={t.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[8.5px] font-mono text-[#f5f5f0]/40 w-12 flex-shrink-0">Font Face:</span>
          <div className="flex bg-black/40 p-0.5 rounded border border-white/5 flex-1 justify-between">
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => setFont(f.id)}
                className={`text-[8.5px] font-mono px-2 py-0.5 rounded transition-all ${
                  font === f.id ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] font-bold' : 'text-[#f5f5f0]/50 hover:text-[#f5f5f0]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Widget 4: TypeScript Code Terminal Compile
function Step4CodeWidget() {
  const [isTypeScript, setIsTypeScript] = useState(true);

  return (
    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 w-full max-w-sm mx-auto shadow-xl hover:border-[#8b5cf6]/20">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8b5cf6] font-semibold">
          Modular Code Compiler
        </span>
        <button
          onClick={() => setIsTypeScript(!isTypeScript)}
          className="text-[8px] font-mono bg-black/40 hover:bg-black/80 text-[#8b5cf6] border border-[#8b5cf6]/20 px-2 py-0.5 rounded transition-all font-semibold"
        >
          Toggle Engine
        </button>
      </div>

      <div className="bg-black/60 border border-white/5 rounded-lg p-3 font-mono text-[9px] relative overflow-hidden h-[120px] flex flex-col justify-between">
        <div className="leading-tight">
          <div className="flex gap-1 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
          </div>

          {isTypeScript ? (
            <motion.div key="ts-code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0.5 text-[#f5f5f0]/80">
              <div><span className="text-[#8b5cf6]">import</span> &#123; motion &#125; <span className="text-[#8b5cf6]">from</span> <span className="text-emerald-400">'motion/react'</span>;</div>
              <div><span className="text-[#8b5cf6]">const</span> Portfolio = () =&gt; (</div>
              <div className="pl-3">&lt;<span className="text-amber-400">motion.div</span> <span className="text-purple-400">layoutId</span>=<span className="text-emerald-400">"grid"</span>&gt;</div>
              <div className="pl-6">&lt;<span className="text-amber-400">MainBox</span> speed="100ms" /&gt;</div>
              <div className="pl-3">&lt;/<span className="text-amber-400">motion.div</span>&gt;</div>
            </motion.div>
          ) : (
            <motion.div key="js-code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0.5 text-red-300">
              <div><span className="text-yellow-600">&lt;!-- Unoptimized Template --&gt;</span></div>
              <div>&lt;<span className="text-blue-400">div</span> <span className="text-purple-400">class</span>=<span className="text-red-400">"wp-bloat elementor"</span>&gt;</div>
              <div className="pl-3">&lt;<span className="text-blue-400">script</span> <span className="text-purple-400">src</span>=<span className="text-red-400">"heavy-jquer-v3.js"</span>&gt;&lt;/<span className="text-blue-400">script</span>&gt;</div>
              <div className="pl-3">&lt;<span className="text-blue-400">div</span> id="uncompressed-assets"&gt;</div>
              <div className="pl-6">&lt;<span className="text-blue-400">img</span> src="heavy-mock-4mb.png"&gt;</div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-white/5 pt-1.5 flex justify-between items-center bg-black/20 text-[8px]">
          <span className="text-[#f5f5f0]/40">Engine: {isTypeScript ? 'React 18 + ESM' : 'Legacy PHP Server'}</span>
          <span className={`font-bold uppercase ${isTypeScript ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`}>
            {isTypeScript ? 'Blazing 40ms' : 'Blocked 2400ms'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Widget 5: deployment live launcher
function Step5LaunchWidget() {
  const [launchState, setLaunchState] = useState<'idle' | 'building' | 'completed'>('idle');
  const [pipelineState, setPipelineState] = useState<number>(0);

  const startDeployment = () => {
    setLaunchState('building');
    setPipelineState(0);

    const check1 = setTimeout(() => {
      setPipelineState(1);
    }, 1000);
    const check2 = setTimeout(() => {
      setPipelineState(2);
    }, 2000);
    const check3 = setTimeout(() => {
      setLaunchState('completed');
      setPipelineState(3);
    }, 3200);

    return () => {
      clearTimeout(check1);
      clearTimeout(check2);
      clearTimeout(check3);
    };
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 w-full max-w-sm mx-auto shadow-xl hover:border-[#8b5cf6]/20 select-none">
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8b5cf6] mb-3 block font-semibold">
        Edge Launch Control Panel
      </span>

      <div className="bg-black/60 border border-white/5 rounded-lg p-3 h-[120px] flex flex-col justify-between relative overflow-hidden">
        {launchState === 'idle' && (
          <div className="my-auto space-y-3 text-center">
            <p className="text-[11px] text-[#f5f5f0]/50 max-w-[210px] mx-auto leading-relaxed font-sans">
              Optimized bundles certified. Trigger rollout live to fast-edge Cloud servers globally.
            </p>
            <button
              onClick={startDeployment}
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-5 py-1.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-1 mx-auto"
            >
              🚀 Global Release App
            </button>
          </div>
        )}

        {launchState === 'building' && (
          <div className="my-auto space-y-2 font-mono">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-purple-400 font-bold uppercase animate-pulse">
                {pipelineState === 0 ? 'Compiling bundle...' :
                 pipelineState === 1 ? 'Publishing edge Static...' : 'Routing DNS secure...'}
              </span>
              <span className="text-[#f5f5f0]/40">Step {pipelineState + 1}/3</span>
            </div>

            <div className="space-y-0.5 text-[8.5px] text-left text-[#f5f5f0]/70 pl-1">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${pipelineState >= 0 ? 'bg-[#8b5cf6]' : 'bg-white/10'}`} />
                <span>Minify bundles for edge CJS/ESM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${pipelineState >= 1 ? 'bg-[#8b5cf6]' : 'bg-white/10'}`} />
                <span>Synchronize with high-efficiency CDN cache</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${pipelineState >= 2 ? 'bg-[#8b5cf6]' : 'bg-white/10'}`} />
                <span>Deploy secure global SSL routes</span>
              </div>
            </div>
          </div>
        )}

        {launchState === 'completed' && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="my-auto text-center space-y-1 z-10 relative">
            <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-glow shadow-md">
              <span className="text-emerald-400 text-xs">✓</span>
            </div>
            <h6 className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider text-glow">
              PRODUCTION SECURED LIVE
            </h6>
            <p className="text-[8.5px] text-[#f5f5f0]/50 font-mono">
              Cloud CDN Edge • Latency: 42ms
            </p>
            <button
              onClick={() => setLaunchState('idle')}
              className="text-[8px] font-mono text-purple-400 hover:text-purple-300 underline block mx-auto"
            >
              Reset Controller
            </button>
          </motion.div>
        )}
        
        {launchState === 'completed' && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <motion.div animate={{ y: [-10, -80], x: [10, 30], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-1 h-1 bg-[#8b5cf6] rounded-full left-10 bottom-2" />
            <motion.div animate={{ y: [-10, -70], x: [-5, -20], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.7, delay: 0.2 }} className="absolute w-1 h-1 bg-[#8b5cf6] rounded-full right-16 bottom-4" />
          </div>
        )}
      </div>
    </div>
  );
}

// Dynamic Dispatcher for Steps
function InteractiveWidget({ stepIndex }: { stepIndex: number }) {
  switch (stepIndex) {
    case 0:
      return <Step1AuditWidget />;
    case 1:
      return <Step2StrategyWidget />;
    case 2:
      return <Step3FigmaWidget />;
    case 3:
      return <Step4CodeWidget />;
    case 4:
      return <Step5LaunchWidget />;
    default:
      return null;
  }
}

export default function ProcessTimeline() {
  return (
    <section id="process" className="relative bg-[#0b0b0b] py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-[#8b5cf6]/10">
      
      {/* Background ambient gold orb */}
      <div className="absolute bottom-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.03)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 relative z-10">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8b5cf6] block mb-3">
          The Workflow Blueprint
        </span>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold tracking-tight text-[#f5f5f0]">
          How I <span className="serif-display text-[#8b5cf6] font-light italic">Build Success</span>
        </h3>
        <p className="text-sm text-[#f5f5f0]/50 max-w-lg mx-auto font-sans mt-3 leading-relaxed">
          My process eliminates random design drafts. Every phase is deliberate and benchmarked against your commercial expectations.
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Vertical Central Line */}
        <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#8b5cf6]/50 via-[#8b5cf6]/10 to-transparent pointer-events-none md:-translate-x-1/2" />

        {/* Timeline blocks */}
        <div className="space-y-12 md:space-y-16">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0"
              >
                
                {/* Visual Icon Node in Center */}
                <div className="absolute left-[20px] md:left-1/2 w-10 h-10 -translate-x-[19px] md:-translate-x-5 rounded-full bg-[#121212] border-2 border-[#8b5cf6] flex items-center justify-center z-10 shadow-lg gold-glow">
                  {iconsList[index]}
                </div>

                {/* Left block (Desktop Only) - alternating with interactive simulators */}
                <div className="hidden md:block w-[45%] text-left">
                  {isEven ? (
                    <div className="md:text-right pr-2">
                      <span className="text-5xl font-display font-black text-[#8b5cf6]/15 select-none tracking-widest block mb-1">
                        {step.number}
                      </span>
                      <h4 className="text-lg font-serif font-black text-[#f5f5f0] mb-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#f5f5f0]/50 font-sans max-w-sm ml-auto leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ) : (
                    <div className="pr-4">
                      <InteractiveWidget stepIndex={index} />
                    </div>
                  )}
                </div>

                {/* Right block or Mobile unified block */}
                <div className="w-full md:w-[45%] pl-10 md:pl-0 text-left">
                  
                  {/* Mobile title elements */}
                  <div className="md:hidden">
                    <span className="text-3xl font-display font-black text-[#8b5cf6] opacity-30 select-none block mb-1">
                      {step.number}
                    </span>
                    <h4 className="text-lg font-serif font-black text-[#f5f5f0] mb-2 font-semibold">
                      {step.title}
                    </h4>
                  </div>

                  {/* Desktop Right (isEven === false) */}
                  {!isEven && (
                    <div className="hidden md:block">
                      <span className="text-5xl font-display font-black text-[#8b5cf6]/15 select-none tracking-widest block mb-1">
                        {step.number}
                      </span>
                      <h4 className="text-lg font-serif font-black text-[#f5f5f0] mb-2 font-semibold">
                        {step.title}
                      </h4>
                    </div>
                  )}

                  {/* Description paragraph */}
                  <p className="text-xs md:text-sm text-[#f5f5f0]/60 font-sans leading-relaxed mb-4 max-w-md">
                    {/* fallback mobile description */}
                    <span className="md:hidden block mb-3">{step.description}</span>
                    {/* On desktop, only show description on the right if it's Odd (since Even shows it on the left!) */}
                    {!isEven && <span className="hidden md:block">{step.description}</span>}
                  </p>

                  {/* Mobile embedded lab widget */}
                  <div className="md:hidden my-4">
                    <InteractiveWidget stepIndex={index} />
                  </div>
                  
                  {/* Desktop Right embedded lab widget for Even steps */}
                  {isEven && (
                    <div className="hidden md:block my-4 cursor-default pl-1">
                      <InteractiveWidget stepIndex={index} />
                    </div>
                  )}

                  {/* Actionable deliverables nested list */}
                  <ul className="space-y-1.5 p-3 rounded-[4px] bg-[#121212]/80 border border-white/5 max-w-md">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2 text-[10px] font-mono text-[#f5f5f0]/70">
                        <ArrowRight className="w-2.5 h-2.5 text-[#8b5cf6]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
