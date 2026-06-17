import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Sparkles, User, Mail, Globe, CheckCircle, ChevronDown, Search } from 'lucide-react';
import { getApiUrl } from '../utils/api';
import { saveBookingDirect } from '../utils/firebase';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
}

const timezoneOptions = [
  { id: 'Asia/Beirut', label: 'Lebanon Time' },
  { id: 'Asia/Damascus', label: 'Syria Time' },
  { id: 'Asia/Dhaka', label: 'Asia/Dhaka' },
  { id: 'Asia/Dubai', label: 'Dubai Time' },
  { id: 'America/New_York', label: 'New York (EDT)' },
  { id: 'Europe/London', label: 'London (BST)' },
  { id: 'Asia/Singapore', label: 'Singapore Time' },
  { id: 'Asia/Tokyo', label: 'Tokyo Time' },
  { id: 'Europe/Paris', label: 'Paris (CEST)' },
  { id: 'Australia/Sydney', label: 'Sydney Time' }
];

export default function BookModal({ isOpen, onClose, selectedPackage }: BookModalProps) {
  // Generate 7 days of the week dynamically starting from tomorrow
  const getInitialAvailableDays = () => {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    
    const baseDate = new Date();
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(baseDate.getDate() + i);
      
      days.push({
        label: weekdays[futureDate.getDay()],
        day: futureDate.getDate(),
        date: `${monthNames[futureDate.getMonth()]} ${futureDate.getDate()}`
      });
    }
    return days;
  };

  const [availableDays] = useState(getInitialAvailableDays());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [focus, setFocus] = useState('E-Commerce Conversion');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smtpWarning, setSmtpWarning] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Timezone states
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Dhaka');
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [timezoneSearch, setTimezoneSearch] = useState('');
  const [dhakaTimeStr, setDhakaTimeStr] = useState('');

  useEffect(() => {
    if (selectedPackage) {
      setFocus(selectedPackage);
    }
  }, [selectedPackage]);

  // Live host clock in Asia/Dhaka
  useEffect(() => {
    const updateDhakaTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        setDhakaTimeStr(formatter.format(new Date()).toLowerCase());
      } catch (err) {
        setDhakaTimeStr(new Date().toLocaleTimeString().toLowerCase());
      }
    };
    
    updateDhakaTime();
    const interval = setInterval(updateDhakaTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute timezone-converted timeslots representing Dhaka's 5:00 PM - 10:00 PM availability
  const getTimeslots = () => {
    const dhakaHours = [17, 18, 19, 20, 21, 22]; // 5:00 PM to 10:00 PM (Dhaka Time)
    const baseDate = new Date(); 
    
    return dhakaHours.map(hour => {
      // Dhaka is UTC+6
      const utcHour = hour - 6; 
      const d = new Date(Date.UTC(2026, 5, 17, utcHour, 0, 0)); // Baseline reference
      
      try {
        const timeStr = d.toLocaleTimeString('en-US', {
          timeZone: selectedTimezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        let label = 'BST';
        if (selectedTimezone === 'Asia/Dhaka') label = 'Asia/Dhaka';
        else if (selectedTimezone === 'Asia/Beirut') label = 'Beirut';
        else if (selectedTimezone === 'Asia/Damascus') label = 'Damascus';
        else if (selectedTimezone === 'Asia/Dubai') label = 'Dubai';
        else if (selectedTimezone === 'America/New_York') label = 'EDT';
        else if (selectedTimezone === 'Europe/London') label = 'BST';
        else if (selectedTimezone === 'Asia/Singapore') label = 'SGT';
        else if (selectedTimezone === 'Asia/Tokyo') label = 'JST';
        else if (selectedTimezone === 'Europe/Paris') label = 'CEST';
        else if (selectedTimezone === 'Australia/Sydney') label = 'AEST';
        else {
          label = selectedTimezone.split('/').pop()?.replace('_', ' ') || selectedTimezone;
        }
        
        return `${timeStr} (${label})`;
      } catch (err) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hr12 = hour > 12 ? hour - 12 : hour;
        return `${String(hr12).padStart(2, '0')}:00 ${ampm} (BST)`;
      }
    });
  };

  const timeslots = getTimeslots();

  // Current clock times for options in timezone selector
  const getTimeInTimezone = (tzId: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tzId,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return formatter.format(new Date()).toLowerCase().replace(' ', '');
    } catch (err) {
      return '';
    }
  };

  const filteredTimezones = timezoneOptions.filter(tz =>
    tz.label.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
    tz.id.toLowerCase().includes(timezoneSearch.toLowerCase())
  );

  const defaultFocusOptions = [
    'E-Commerce Conversion',
    'Custom Landing Web Asset',
    'Creative Agency Showcase',
    '1-on-1 Strategy Consulting'
  ];

  const focusOptions = selectedPackage && !defaultFocusOptions.includes(selectedPackage)
    ? [selectedPackage, ...defaultFocusOptions]
    : defaultFocusOptions;

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

    setIsSubmitting(true);
    setErrorMessage('');
    setSmtpWarning('');
    
    try {
      let isSaved = false;
      let emailDispatched = false;

      // 1. Attempt server notification API call
      try {
        const response = await fetch(getApiUrl('/api/book'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });

        if (response.ok) {
          const resData = await response.json();
          console.log('Server booking response:', resData);
          isSaved = true;
          emailDispatched = resData.emailSent;
          
          if (!emailDispatched) {
            setSmtpWarning('I will personally review your request and dispatch a custom Google Meet calendar invite shortly.');
          }
        } else {
          console.warn(`Server book endpoint returned status: ${response.status}`);
        }
      } catch (fetchErr) {
        console.warn('Backend server book request failed. Initiating database fallback...', fetchErr);
      }

      // 2. Fallback to client-side Firestore secure save if backend didn't save
      if (!isSaved) {
        console.log('Executing direct client-side Firestore booking fallback...');
        await saveBookingDirect(bookingData);
        setSmtpWarning('Your booking has been successfully secured in my database. I will follow up with you within 24 hours.');
      }

      // 3. Save to localStorage
      const activeBookings = JSON.parse(localStorage.getItem('nashiat_portfolio_calls') || '[]');
      localStorage.setItem('nashiat_portfolio_calls', JSON.stringify([{
        ...bookingData,
        timestamp: new Date().toISOString()
      }, ...activeBookings]));

      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to book session:', err);
      setErrorMessage((err as Error).message || 'Connection lost. Please check your network or reach out on Instagram.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setName('');
    setEmail('');
    setSelectedDate(null);
    setSelectedTime(null);
    setIsSuccess(false);
    setSmtpWarning('');
    setErrorMessage('');
    onClose();
  };

  const currentMonthYear = (() => {
    if (availableDays.length > 0) {
      const parts = availableDays[0].date.split(' ');
      return `${parts[0]} 2026`;
    }
    return 'June 2026';
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0b]/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-[#121212] border border-[#8b5cf6]/20 max-w-lg w-full rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Absolute Ambient Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_70%)] pointer-events-none" />

            {/* Header elements */}
            <div className="flex justify-between items-start mb-6 text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#8b5cf6] uppercase block mb-1">
                  Private Session
                </span>
                <h3 className="text-xl font-heading font-semibold text-[#f5f5f0]">
                  Calendar Selection
                </h3>
              </div>
              <button
                onClick={resetState}
                className="p-1 text-[#f5f5f0]/60 hover:text-white bg-[#0b0b0b] hover:bg-[#8b5cf6] hover:text-[#0b0b0b] transition-colors rounded-full cursor-pointer border-none"
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
                <CheckCircle className="w-12 h-12 text-[#8b5cf6] mx-auto mb-4 animate-pulse" />
                <h4 className="text-xl font-display font-medium text-[#f5f5f0] mb-2">
                  Discovery Call Confirmed
                </h4>
                <p className="text-xs text-[#f5f5f0]/60 leading-relaxed mb-4 max-w-sm mx-auto font-sans">
                  Excellent! Your meeting request has been filed for <span className="text-white font-semibold font-mono">{email}</span>.
                </p>
                {smtpWarning && (
                   <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/10 text-[#a78bfa] p-3 rounded-lg text-[10px] leading-relaxed max-w-sm mx-auto mb-4 text-center font-sans font-medium">
                     {smtpWarning}
                     <div className="mt-1.5 opacity-70 text-[9px]">
                       You can also reach me directly at <a href="https://www.instagram.com/_vxnash/" target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-[#8b5cf6]">@_vxnash</a> on Instagram to align.
                     </div>
                   </div>
                )}

                {/* Simulated Ticket Details Summary */}
                <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-4 text-left space-y-3 mb-6">
                  <div className="flex justify-between text-xs border-b border-white/[0.04] pb-2">
                    <span className="text-white/40">HOST / CONSULTANT</span>
                    <span className="text-[#8b5cf6] font-bold font-mono">NASHIAT</span>
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
                    className="flex-1 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-bold rounded-lg cursor-pointer border-none"
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
                    Step 1: Pick a Date coordinates ({currentMonthYear})
                  </span>
                  <div className="grid grid-cols-7 gap-1.5 bg-black/30 p-2 rounded-xl border border-white/5">
                    {availableDays.map((day) => (
                      <div
                        key={day.day}
                        onClick={() => setSelectedDate(day.day)}
                        className={`p-2 text-center select-none rounded-lg border cursor-pointer transition-all ${
                          selectedDate === day.day
                            ? 'bg-[#8b5cf6] border-[#8b5cf6] text-[#0b0b0b] shadow-lg shadow-[#8b5cf6]/10'
                            : 'bg-[#0b0b0b] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <p className="text-[8px] uppercase font-mono opacity-60 leading-none mb-1">
                          {day.label}
                        </p>
                        <p className={`text-xs font-heading font-medium leading-none ${
                          selectedDate === day.day ? 'font-bold' : ''
                        }`}>
                          {day.day}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Hours listpicker */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase block">
                      Step 2: Choose session hours
                    </span>
                    {dhakaTimeStr && (
                      <span className="text-[9.5px] text-[#8b5cf6] font-mono flex items-center gap-1 bg-[#8b5cf6]/5 px-2 py-0.5 rounded border border-[#8b5cf6]/10">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        Host Live: {dhakaTimeStr}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {timeslots.map((slot) => (
                      <div
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 text-center select-none rounded-lg border cursor-pointer transition-colors ${
                          selectedTime === slot
                            ? 'bg-[#8b5cf6] border-[#8b5cf6] text-[#0b0b0b] font-mono font-bold text-xs'
                            : 'bg-[#0b0b0b] border-white/5 hover:border-white/20 font-mono text-[10px] text-[#f5f5f0]/70'
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>

                  {/* Timezone Switcher Display */}
                  <div className="mt-3.5 flex justify-between items-center bg-[#0b0b0b] p-2.5 rounded-lg border border-white/5">
                    <div className="text-left">
                      <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest leading-none mb-1">Host Availability</p>
                      <p className="text-[10px] font-sans text-[#f5f5f0]/80 font-medium">Daily 5:00 PM - 10:00 PM (Asia/Dhaka)</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                      className="flex items-center gap-1.5 text-[#8b5cf6] hover:text-[#a78bfa] font-mono text-[10px] py-1 px-2.5 bg-[#8b5cf6]/5 border border-[#8b5cf6]/25 rounded transition-all cursor-pointer hover:border-[#8b5cf6]/50 shadow-sm"
                    >
                      <Globe className="w-3 h-3 text-[#8b5cf6]" />
                      <span>{selectedTimezone.split('/').pop()?.replace('_', ' ')}</span>
                      <ChevronDown className="w-3 h-3 transition-transform duration-200" style={{ transform: isTimezoneOpen ? 'rotate(180deg)' : 'none' }} />
                    </button>
                  </div>

                  {/* Absolute Timezone Selector Dropdown panel */}
                  <AnimatePresence>
                    {isTimezoneOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 z-30 mt-2 p-3 bg-[#121212] border border-blue-500/40 rounded-xl shadow-2xl select-none max-h-[260px] overflow-y-auto"
                      >
                        {/* Search Input Box */}
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
                          <input
                            type="text"
                            placeholder="Search timezone..."
                            value={timezoneSearch}
                            onChange={(e) => setTimezoneSearch(e.target.value)}
                            className="w-full bg-[#0b0b0b] text-[#f5f5f0] border-2 border-blue-500 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none placeholder-white/30 font-sans"
                            autoFocus
                          />
                        </div>
                        
                        {/* List */}
                        <div className="space-y-0.5 max-h-[160px] overflow-y-auto pr-1">
                          {filteredTimezones.map((tz) => {
                            const isSelected = selectedTimezone === tz.id;
                            return (
                              <div
                                key={tz.id}
                                onClick={() => {
                                  setSelectedTimezone(tz.id);
                                  setIsTimezoneOpen(false);
                                  setTimezoneSearch('');
                                  setSelectedTime(null);
                                }}
                                className={`flex justify-between items-center px-3 py-2 text-xs rounded transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'text-[#f5f5f0]/80 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span className="font-sans">{tz.label}</span>
                                <span className={`font-mono text-[9px] ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                                  {getTimeInTimezone(tz.id)}
                                </span>
                              </div>
                            );
                          })}
                          {filteredTimezones.length === 0 && (
                            <div className="text-center py-4 text-[10px] text-white/40 font-mono">
                              No matching zones found
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Project Targets List options drop */}
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#f5f5f0]/50 uppercase block mb-2">
                    Step 3: What is your primary project bottleneck?
                  </span>
                  <select
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="w-full bg-[#0b0b0b] text-[#f5f5f0]/80 border border-white/5 px-3 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#8b5cf6]"
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
                      className="w-full px-3 py-2.5 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-lg text-xs focus:outline-none focus:border-[#8b5cf6]"
                    />
                    
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="My Email"
                      className="w-full px-3 py-2.5 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-lg text-xs focus:outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                </div>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg text-xs font-mono text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Action CTA triggers */}
                <button
                  type="submit"
                  disabled={selectedDate === null || !selectedTime || !name || !email || isSubmitting}
                  className="w-full py-3.5 mt-4 bg-[#8b5cf6] disabled:bg-[#333] disabled:text-[#777] disabled:cursor-not-allowed text-[#0b0b0b] hover:bg-[#7c3aed] font-mono text-xs uppercase tracking-widest font-bold rounded-lg flex items-center justify-center gap-2 transition-transform cursor-pointer border-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-[#0b0b0b] border-t-transparent rounded-full animate-spin font-sans"></span>
                      DISPATCHING HANDSHAKE...
                    </span>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Request Meeting Confirmation
                    </>
                  )}
                </button>

              </form>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
