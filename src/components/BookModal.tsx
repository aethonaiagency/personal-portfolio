import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Sparkles, User, Mail, Globe, CheckCircle } from 'lucide-react';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookModal({ isOpen, onClose }: BookModalProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [focus, setFocus] = useState('E-Commerce Conversion');
  const [isSuccess, setIsSuccess] = useState(false);

  // Simple active days list representative of next few working days
  const availableDays = [
    { label: 'Mon', day: 1, date: 'June 1' },
    { label: 'Tue', day: 2, date: 'June 2' },
    { label: 'Wed', day: 3, date: 'June 3' },
    { label: 'Thu', day: 4, date: 'June 4' },
    { label: 'Fri', day: 5, date: 'June 5' },
  ];

  const timeslots = [
    '10:00 AM (EST)',
    '11:30 AM (EST)',
    '02:00 PM (EST)',
    '04:30 PM (EST)',
  ];

  const focusOptions = [
    'E-Commerce Conversion',
    'Custom Landing Web Asset',
    'Creative Agency Showcase',
    '1-on-1 Strategy Consulting'
  ];

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || selectedDate === null || !selectedTime) return;

    const formattedDate = availableDays.find(d => d.day === selectedDate)?.date || '';

    const bookingData = {
      name,
      email,
      focus,
      date: formattedDate,
      time: selectedTime
    };

    setIsSuccess(true);
    
    // Save to local booking storage and call API notifier
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      const resData = await response.json();
      console.log('Server dispatch response:', resData);

      const activeBookings = JSON.parse(localStorage.getItem('nashiat_portfolio_calls') || '[]');
      localStorage.setItem('nashiat_portfolio_calls', JSON.stringify([{
        ...bookingData,
        timestamp: new Date().toISOString()
      }, ...activeBookings]));
    } catch (err) {
      console.error('Storage booking block failed:', err);
    }
  };

  const resetState = () => {
    setName('');
    setEmail('');
    setSelectedDate(null);
    setSelectedTime(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0b]/90 backdrop-blur-md"
        >
          {/* Main frame overlay */}
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-[#121212] border border-[#c9a46c]/20 max-w-lg w-full rounded-2xl shadow-2xl p-6 relative overflow-hidden"
          >
            {/* Absolute Ambient Sphere decoration inside popup */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.04)_0%,transparent_70%)] pointer-events-none" />

            {/* Header elements */}
            <div className="flex justify-between items-start mb-6 text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#c9a46c] uppercase block mb-1">
                  Private Session
                </span>
                <h3 className="text-xl font-heading font-semibold text-[#f5f5f0]">
                  Calendar Selection
                </h3>
              </div>
              <button
                onClick={resetState}
                className="p-1 text-[#f5f5f0]/60 hover:text-white bg-[#0b0b0b] hover:bg-[#c9a46c] hover:text-[#0b0b0b] transition-colors rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center text-left-mobile"
              >
                <CheckCircle className="w-12 h-12 text-[#c9a46c] mx-auto mb-4 animate-pulse" />
                <h4 className="text-xl font-display font-medium text-[#f5f5f0] mb-2">
                  Discovery Call Confirmed
                </h4>
                <p className="text-xs text-[#f5f5f0]/60 leading-relaxed mb-6 max-w-sm mx-auto font-sans">
                  Excellent! An instant calendar handshake loop (.ics invite) was filed to your inbox <span className="text-white font-semibold font-mono">{email}</span>.
                </p>

                {/* Simulated Ticket Details Summary */}
                <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-4 text-left space-y-3 mb-6">
                  <div className="flex justify-between text-xs border-b border-white/[0.04] pb-2">
                    <span className="text-white/40">HOST / CONSULTANT</span>
                    <span className="text-[#c9a46c] font-bold font-mono">NASHIAT</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/[0.04] pb-2">
                    <span className="text-white/40">DATE COORDINATES</span>
                    <span className="text-white font-mono font-medium">{availableDays.find(d => d.day === selectedDate)?.date}, 2026</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-white/[0.04] pb-2">
                    <span className="text-white/40">SESSION TIMESLOT</span>
                    <span className="text-white font-mono font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-1">
                    <span className="text-white/40">TARGET GOAL</span>
                    <span className="text-white font-medium">{focus}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetState}
                    className="flex-1 py-3 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-bold rounded-lg cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleBookSubmit} className="space-y-5 text-left">
                
                {/* Available Date gridpicker */}
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase block mb-3">
                    Step 1: Pick a Date coordinates (June 2026)
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {availableDays.map((day) => (
                      <div
                        key={day.day}
                        onClick={() => setSelectedDate(day.day)}
                        className={`p-2.5 text-center select-none rounded-lg border cursor-pointer transition-all ${
                          selectedDate === day.day
                            ? 'bg-[#c9a46c] border-[#c9a46c] text-[#0b0b0b]'
                            : 'bg-[#0b0b0b] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <p className="text-[9px] uppercase font-mono opacity-60 leading-none mb-1">
                          {day.label}
                        </p>
                        <p className={`text-sm font-heading font-medium leading-none ${
                          selectedDate === day.day ? 'font-bold' : ''
                        }`}>
                          {day.day}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Hours listpicker */}
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase block mb-3">
                    Step 2: Choose session hours
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {timeslots.map((slot) => (
                      <div
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 text-center select-none rounded-lg border cursor-pointer transition-colors ${
                          selectedTime === slot
                            ? 'bg-[#c9a46c] border-[#c9a46c] text-[#0b0b0b] font-mono font-bold text-xs'
                            : 'bg-[#0b0b0b] border-white/5 hover:border-white/20 font-mono text-[10px] text-[#f5f5f0]/70'
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Targets List options drop */}
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase block mb-2">
                    Step 3: What is your primary project bottleneck?
                  </span>
                  <select
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="w-full bg-[#0b0b0b] text-[#f5f5f0]/80 border border-white/5 px-3 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#c9a46c]"
                  >
                    {focusOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#121212]">{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Inline contact captures */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase block">
                    Step 4: Who is attending?
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My Name"
                      className="w-full px-3 py-2.5 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-lg text-xs focus:outline-none focus:border-[#c9a46c]"
                    />
                    
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="My Email"
                      className="w-full px-3 py-2.5 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-lg text-xs focus:outline-none focus:border-[#c9a46c]"
                    />
                  </div>
                </div>

                {/* Action CTA triggers */}
                <button
                  type="submit"
                  disabled={selectedDate === null || !selectedTime || !name || !email}
                  className="w-full py-3.5 mt-4 bg-[#c9a46c] disabled:bg-[#333] disabled:text-[#777] disabled:cursor-not-allowed text-[#0b0b0b] hover:bg-[#b08e59] font-mono text-xs uppercase tracking-widest font-bold rounded-lg flex items-center justify-center gap-2 transition-transform cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  Request Meeting Confirmation
                </button>

              </form>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
