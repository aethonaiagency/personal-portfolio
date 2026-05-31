import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, Layers, CreditCard, Cpu } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'Process' | 'Pricing' | 'Technical';
}

const faqData: FAQItem[] = [
  {
    category: "Process",
    question: "What are your standard development timelines?",
    answer: "Most bespoke web applications and high-fidelity design systems are conceptualized, built, and deployed within 4 to 8 weeks. Simple marketing engines or custom portfolios can be launched in as little as 3 weeks, while complex full-stack apps containing robust server-side processing may extend to 10 weeks."
  },
  {
    category: "Process",
    question: "How do you manage client revisions and drafts?",
    answer: "Every engagement includes dedicated staging access. You will view live, sandboxed builds of your application in real-time as components are authored. Adjustments are addressed concurrently during weekly iterative sprints to guarantee that the final execution matches your exact creative standards."
  },
  {
    category: "Pricing",
    question: "How is pricing structured for your commissions?",
    answer: "I work strictly under a fixed-scope, value-based pricing model. You receive a comprehensive, transparent quotation detailing every visual requirement and technical parameter before any development kicks off. This structure completely eliminates hourly billing surprises, with payments broken into key structural milestones (e.g., Launch, Engineering, Hand-off)."
  },
  {
    category: "Pricing",
    question: "Are there any hidden costs or extra hosting/maintenance fees?",
    answer: "No. Every cost—including API credentials, hosting setups, custom domains, and integrated fonts—is declared transparently upfront in the commission contract. You pay exactly what is agreed upon, with zero hidden overages or surprise subscription hikes."
  },
  {
    category: "Technical",
    question: "Do you build everything solo, or is there a team?",
    answer: "Every line of code and visual layer is handcrafted directly by me. I do not outsource, white-label, or pass work off to junior developers. This allows me to maintain absolute operational focus and strict performance thresholds. To guarantee this level of dedicated quality, I only partner with a maximum of three clients at any given time."
  },
  {
    category: "Technical",
    question: "What support is included after the application launches?",
    answer: "All builds include a standard 30-day post-launch warranty cover during which any performance, compatibility, or layout anomalies are solved immediately. Following the warranty lifecycle, you can opt for custom engineering retainers for continuous monthly feature additions, database optimization, or proactive framework upgrades."
  },
  {
    category: "Technical",
    question: "What standard backend security and technologies do you use?",
    answer: "I specialize in clean, modular TypeScript, auth protocols (Firebase Auth / OAuth), microservices, robust API proxies to mask keys, and lightning-fast edge delivery (Vite + Node.js/Express) backed by scalable NoSQL Firestore registries."
  }
];

type CategoryType = 'Process' | 'Pricing' | 'Technical';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Process');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const filteredFAQs = faqData.filter(item => item.category === activeCategory);
  const allCurrentExpanded = filteredFAQs.length > 0 && filteredFAQs.every(item => expandedQuestions[item.question]);

  const toggleItem = (question: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const handleToggleAll = () => {
    const nextState = !allCurrentExpanded;
    const updated = { ...expandedQuestions };
    filteredFAQs.forEach(item => {
      updated[item.question] = nextState;
    });
    setExpandedQuestions(updated);
  };

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'Process':
        return <Layers className="w-3.5 h-3.5 mr-2 inline-block" />;
      case 'Pricing':
        return <CreditCard className="w-3.5 h-3.5 mr-2 inline-block" />;
      case 'Technical':
        return <Cpu className="w-3.5 h-3.5 mr-2 inline-block" />;
    }
  };

  return (
    <section id="faq" className="relative bg-[#0b0b0b] py-24 select-none border-b border-[#c9a46c]/10 overflow-hidden">
      {/* Background visual geometric lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#c9a46c]/[0.02] filter blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-zinc-500/[0.01] filter blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#c9a46c] block mb-3">
            Hurdles Cleared
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-[#f5f5f0]">
            Frequently Asked <span className="serif-display text-[#c9a46c] font-light italic">Questions</span>
          </h2>
          <p className="text-sm text-[#f5f5f0]/50 font-sans mt-4 max-w-xl mx-auto leading-relaxed">
            Direct, transparent answers regarding budgets, timeline commitments, and craft methodologies. No sales fluff.
          </p>
        </div>

        {/* Dynamic Category Tabs & Toggle Actions Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          
          {/* Category Tabs */}
          <div className="flex bg-[#121212] p-1 rounded-[4px] border border-white/5 relative w-full sm:w-auto overflow-x-auto whitespace-nowrap">
            {(['Process', 'Pricing', 'Technical'] as CategoryType[]).map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-4 py-2.5 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-all duration-300 cursor-pointer flex items-center select-none ${
                    isActive ? 'text-[#0b0b0b] font-bold z-10' : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[#c9a46c] rounded-[2px]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-20 flex items-center">
                    {getCategoryIcon(category)}
                    {category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expand / Collapse All controller link */}
          <button
            onClick={handleToggleAll}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 rounded-[4px] text-[10px] font-mono uppercase tracking-widest text-[#c9a46c] hover:text-[#f5f5f0] transition-colors cursor-pointer select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a46c] animate-pulse" />
            {allCurrentExpanded ? 'Collapse All Category' : 'Expand All Category'}
          </button>
        </div>

        {/* FAQ Accordion List with animation layout elements */}
        <div className="space-y-4 min-h-[280px]">
          <AnimatePresence mode="popLayout">
            {filteredFAQs.map((item, index) => {
              const isOpen = !!expandedQuestions[item.question];
              return (
                <motion.div 
                  key={item.question}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group border border-white/5 hover:border-[#c9a46c]/30 rounded-[4px] bg-[#121212]/50 hover:bg-[#121212]/80 transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.question)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none"
                  >
                    <span className="text-sm md:text-base font-sans font-medium text-[#f5f5f0] group-hover:text-[#c9a46c] transition-colors pr-6">
                      {item.question}
                    </span>
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0b0b0b] border border-white/10 flex items-center justify-center text-[#c9a46c] group-hover:border-[#c9a46c]/43 transition-colors">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-[#f5f5f0]/60 leading-relaxed font-light border-t border-white/[0.02]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Secondary prompt for custom queries */}
        <div className="mt-12 text-center p-6 bg-[#121212]/30 border border-white/5 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <HelpCircle className="w-5 h-5 text-[#c9a46c] flex-shrink-0" />
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#f5f5f0]">Have a custom setup in mind?</p>
              <p className="text-[11px] text-[#f5f5f0]/40 font-sans mt-0.5">Let me sketch custom timelines and deliverables for your system specifications.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-4 py-2 bg-[#c9a46c]/10 hover:bg-[#c9a46c] border border-[#c9a46c]/30 text-[#c9a46c] hover:text-[#0b0b0b] font-mono text-[10px] uppercase tracking-widest font-bold rounded-[2px] transition-all cursor-pointer"
          >
            Ask Questions Direct
          </button>
        </div>

      </div>
    </section>
  );
}
