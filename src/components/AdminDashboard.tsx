import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  Mail,
  User,
  Building,
  RefreshCw,
  AlertTriangle,
  Globe,
  Video,
  ExternalLink,
  SlidersHorizontal,
  FolderOpen,
  CalendarDays,
  Inbox,
  Sparkles
} from 'lucide-react';
import { Booking, Lead, AdminSettings } from '../../db';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Loaded DB data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Active Screen
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'messages' | 'analytics' | 'calendar' | 'settings'>('dashboard');

  // Search & Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'All' | 'New' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [leadFilter, setLeadFilter] = useState<'All' | 'unread' | 'read' | 'archived'>('All');
  const [leadSearch, setLeadSearch] = useState('');

  // Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 5, 1)); // June 2026 as per local clock
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<Booking | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<string[]>([]);

  // Local Settings Edit Form
  const [localSettings, setLocalSettings] = useState<AdminSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // Authentication Status Check on load
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/status');
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchDBData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Auth verification crash', e);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchDBData = async () => {
    setIsDataLoading(true);
    try {
      const [bRes, lRes, sRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/leads'),
        fetch('/api/admin/settings')
      ]);

      if (bRes.ok && lRes.ok && sRes.ok) {
        const bData = await bRes.json();
        const lData = await lRes.json();
        const sData = await sRes.json();

        setBookings(bData.bookings || []);
        setLeads(lData.leads || []);
        setSettings(sData.settings || null);
        setLocalSettings(sData.settings || null);

        // Compute instant smart notifications
        const unreadMsgCount = lData.leads?.filter((l: Lead) => l.status === 'unread').length || 0;
        const newBookingCount = bData.bookings?.filter((b: Booking) => b.status === 'New').length || 0;

        const newNotice: string[] = [];
        if (newBookingCount > 0) {
          newNotice.push(`You have ${newBookingCount} unconfirmed booking proposal${newBookingCount > 1 ? 's' : ''}!`);
        }
        if (unreadMsgCount > 0) {
          newNotice.push(`You have ${unreadMsgCount} unread project message${unreadMsgCount > 1 ? 's' : ''} in your lead inbox.`);
        }
        setNotifications(newNotice);
      }
    } catch (error) {
      console.error('Error fetching admin details', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchDBData();
      } else {
        let errMsg = 'Access denied';
        try {
          const data = await response.json();
          errMsg = data.error || errMsg;
        } catch (parseErr) {
          errMsg = `HTTP Error ${response.status}: ${response.statusText || 'Access Denied'}`;
        }
        setLoginError(errMsg);
      }
    } catch (e) {
      console.error('Login dynamic error:', e);
      setLoginError(`Server connection failure: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setBookings([]);
      setLeads([]);
      setSettings(null);
    } catch (e) {
      console.error('Sign out error', e);
    }
  };

  // Actions: Booking Update
  const handleUpdateBookingStatus = async (id: string, nextStatus: Booking['status']) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchDBData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this booking transaction?')) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDBData();
        if (selectedCalendarEvent?.id === id) {
          setSelectedCalendarEvent(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions: Lead Update
  const handleUpdateLeadStatus = async (id: string, nextStatus: Lead['status']) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchDBData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Permanently remove this layout lead inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDBData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions: Settings save
  const handleSaveSettings = async (updatedObj: AdminSettings) => {
    setIsSavingSettings(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedObj)
      });
      if (response.ok) {
        const result = await response.json();
        setSettings(result.settings);
        setLocalSettings(result.settings);
        alert('Credentials and operational availability settings synchronised successfully.');
      }
    } catch (err) {
      console.error('Settings save failure', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleToggleDay = (day: keyof AdminSettings['availableDays']) => {
    if (!localSettings) return;
    const nextDays = {
      ...localSettings.availableDays,
      [day]: !localSettings.availableDays[day]
    };
    const next = { ...localSettings, availableDays: nextDays };
    setLocalSettings(next);
  };

  const handleAddBlockedDate = () => {
    if (!localSettings || !newBlockedDate) return;
    if (localSettings.blockedDates.includes(newBlockedDate)) return;
    const next = {
      ...localSettings,
      blockedDates: [...localSettings.blockedDates, newBlockedDate].sort()
    };
    setLocalSettings(next);
    setNewBlockedDate('');
  };

  const handleRemoveBlockedDate = (targetDate: string) => {
    if (!localSettings) return;
    const next = {
      ...localSettings,
      blockedDates: localSettings.blockedDates.filter(d => d !== targetDate)
    };
    setLocalSettings(next);
  };

  const handleAddTimeSlot = () => {
    if (!localSettings || !newTimeSlot) return;
    if (localSettings.timeSlots.includes(newTimeSlot)) return;
    const next = {
      ...localSettings,
      timeSlots: [...localSettings.timeSlots, newTimeSlot]
    };
    setLocalSettings(next);
    setNewTimeSlot('');
  };

  const handleRemoveTimeSlot = (slot: string) => {
    if (!localSettings) return;
    const next = {
      ...localSettings,
      timeSlots: localSettings.timeSlots.filter(s => s !== slot)
    };
    setLocalSettings(next);
  };

  // Calendar Helper methods
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonthIndex = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday, etc. Adjust so Monday is 0 if desired, let's keep Sunday=0
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const startDayIndex = getFirstDayOfMonthIndex(year, month);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const grid = [];
    // Spacers for blank days at beginning
    for (let i = 0; i < startDayIndex; i++) {
      grid.push(<div key={`blank-${i}`} className="min-h-24 bg-[#0d0d0d]/30 border border-white/5 opacity-30 select-none"></div>);
    }

    // Days with values
    for (let d = 1; d <= totalDays; d++) {
      // Find bookings on this specific day in June 2026
      // E.g. booking.date looks like "June 5"
      const dateStringMatch = `${monthNames[month]} ${d}`;
      const dayBookings = bookings.filter(b => b.date && b.date.toLowerCase().includes(dateStringMatch.toLowerCase()));

      grid.push(
        <div key={`day-${d}`} className="min-h-[110px] bg-[#121212] border border-white/5 p-2 text-left relative flex flex-col justify-between group hover:bg-[#161616] transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-[#f5f5f0]/50 group-hover:text-[#c9a46c] transition-colors">
              {d}
            </span>
            {dayBookings.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a46c]" />
            )}
          </div>
          
          <div className="mt-1 space-y-1 flex-grow overflow-y-auto max-h-[80px] custom-scrollbar">
            {dayBookings.slice(0, 3).map(bk => (
              <div
                key={bk.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCalendarEvent(bk);
                }}
                className={`text-[9px] truncate px-1.5 py-0.5 rounded-[2px] font-mono border cursor-pointer select-none transition-transform active:scale-95 ${
                  bk.status === 'New' ? 'bg-[#c9a46c]/10 border-[#c9a46c]/30 text-[#c9a46c]' :
                  bk.status === 'Confirmed' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                  bk.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                  'bg-rose-500/10 border-rose-500/30 text-rose-300 line-through'
                }`}
                title={`${bk.name} - ${bk.focus}`}
              >
                {bk.name.split(' ')[0]}: {bk.focus}
              </div>
            ))}
            {dayBookings.length > 3 && (
              <div className="text-[8px] text-[#f5f5f0]/30 font-mono text-center">
                + {dayBookings.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#0b0b0b] rounded-[4px] border border-white/10 overflow-hidden">
        {/* Calendar Nav */}
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#121212]">
          <h3 className="font-serif text-lg text-[#f5f5f0] flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#c9a46c]" />
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentCalendarDate(new Date(year, month - 1, 1))}
              className="p-1 px-2.5 bg-[#0b0b0b] hover:bg-[#1c1c1c] rounded-[2px] text-xs font-mono border border-white/10 text-[#f5f5f0]/60 active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentCalendarDate(new Date(year, month + 1, 1))}
              className="p-1 px-2.5 bg-[#0b0b0b] hover:bg-[#1c1c1c] rounded-[2px] text-xs font-mono border border-white/10 text-[#f5f5f0]/60 active:scale-95"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days Name Header */}
        <div className="grid grid-cols-7 text-center py-2 bg-[#0d0d0d] border-b border-white/5 font-mono text-[9px] text-[#f5f5f0]/40 tracking-wider font-bold">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* Board Calendar Grid */}
        <div className="grid grid-cols-7">
          {grid}
        </div>
      </div>
    );
  };

  // Metrics computation helper
  const totalVisitors = 764; // Simulated analytics counts
  const totalBookingsCount = bookings.length;
  const totalLeadsCount = leads.length;
  const unreadMessagesCount = leads.filter(l => l.status === 'unread').length;
  const currentMonthBookings = bookings.filter(b => b.date && b.date.toLowerCase().includes('june')).length;
  const conversionRate = totalBookingsCount > 0 ? ((totalBookingsCount / totalVisitors) * 100).toFixed(1) : '0';

  // Guard loading UI
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#c9a46c] animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-[#f5f5f0]/40 uppercase tracking-widest">
            Handshaking Secure Workspace...
          </p>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#f5f5f0] flex items-center justify-center p-6 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a46c]/40 to-transparent" />
        
        {/* Soft elegant neon glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,164,108,0.025)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#c9a46c] mb-1 block">
              Sovereign Handshake
            </span>
            <h1 className="text-3xl font-serif font-black tracking-tight text-[#f5f5f0]">
              ADMIN <span className="text-[#c9a46c] italic font-light">PANEL</span>
            </h1>
            <p className="text-xs tracking-wider font-mono text-[#f5f5f0]/30 mt-2">
              EXCLUSIVE PORTAL ACCESS GATEWAY
            </p>
          </div>

          <div className="bg-[#121212]/95 border border-[#c9a46c]/20 rounded-[4px] p-6 shadow-2xl backdrop-blur-xl">
            {loginError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-mono rounded-[2px] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-[9px] font-mono uppercase tracking-widest text-[#f5f5f0]/40 block mb-1.5">
                  Secure Admin Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#f5f5f0]/30">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nashiat.dev"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-[2px] text-xs font-mono focus:outline-none focus:border-[#c9a46c] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono uppercase tracking-widest text-[#f5f5f0]/40 block mb-1.5">
                  Protected Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#f5f5f0]/30">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0b0b0b] text-[#f5f5f0] border border-white/5 rounded-[2px] text-xs font-mono focus:outline-none focus:border-[#c9a46c] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-4 py-3 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-bold rounded-[2px] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>VERIFYING SESSION...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>AUTHENTICATE KEY</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-6 text-[10px] font-mono text-[#f5f5f0]/30">
            <p>Configured password protected securely server-side.</p>
            <p className="mt-1 text-[#c9a46c]/40 hover:text-[#c9a46c]/80 cursor-help select-none flex items-center justify-center gap-1" onClick={() => alert('Default system administrator access:\nEmail: admin@nashiat.dev\nPassword: NashiatSuccess2026!\n\nPlease save in environment variables ADMIN_EMAIL and ADMIN_PASSWORD to customize.')}>
              <Sparkles className="w-2.5 h-2.5 text-[#c9a46c]" /> Reference Default Setup
            </p>
          </div>
        </div>
      </div>
    );
  }

  // PANEL DASHBOARD PAGE
  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f0] flex flex-col md:flex-row font-sans selection:bg-[#c9a46c] selection:text-[#0b0b0b]">
      
      {/* 1. Sidebar Container */}
      <aside className="w-full md:w-64 bg-[#0c0c0c] border-b md:border-b-0 md:border-r border-white/5 flex flex-col flex-shrink-0">
        
        {/* Sidebar Header Brand */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-[#f5f5f0] font-serif font-black tracking-tight flex items-center gap-2">
              <span className="text-[#c9a46c] font-black tracking-widest">NASH</span> CORES
            </h2>
            <span className="text-[8px] font-mono text-emerald-500 tracking-widest block uppercase mt-0.5">
              Secure Engine v1.0
            </span>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Dynamic Sidebar Links */}
        <nav className="flex-grow p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[3px] font-mono text-xs cursor-pointer text-left transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#c9a46c] text-[#0b0b0b] font-bold'
                : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#121212]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[3px] font-mono text-xs cursor-pointer text-left transition-colors relative ${
              activeTab === 'bookings'
                ? 'bg-[#c9a46c] text-[#0b0b0b] font-bold'
                : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#121212]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Bookings</span>
            {bookings.filter(b => b.status === 'New').length > 0 && (
              <span className="absolute right-4 px-1.5 py-0.5 text-[8px] font-mono rounded bg-[#c9a46c]/20 text-[#c9a46c] font-bold">
                {bookings.filter(b => b.status === 'New').length} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[3px] font-mono text-xs cursor-pointer text-left transition-colors relative ${
              activeTab === 'messages'
                ? 'bg-[#c9a46c] text-[#0b0b0b] font-bold'
                : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#121212]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Leads inbox</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute right-4 px-1.5 py-0.5 text-[8px] font-mono rounded bg-blue-500/10 text-blue-300 font-bold border border-blue-500/20">
                {unreadMessagesCount} unread
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[3px] font-mono text-xs cursor-pointer text-left transition-colors ${
              activeTab === 'analytics'
                ? 'bg-[#c9a46c] text-[#0b0b0b] font-bold'
                : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#121212]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[3px] font-mono text-xs cursor-pointer text-left transition-colors ${
              activeTab === 'calendar'
                ? 'bg-[#c9a46c] text-[#0b0b0b] font-bold'
                : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#121212]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendar View</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[3px] font-mono text-xs cursor-pointer text-left transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#c9a46c] text-[#0b0b0b] font-bold'
                : 'text-[#f5f5f0]/60 hover:text-[#f5f5f0] hover:bg-[#121212]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer User State */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-[#161616] border border-white/10 flex items-center justify-center font-mono font-black text-[#c9a46c] text-xs uppercase">
              N
            </span>
            <div className="truncate text-left">
              <p className="text-[10px] font-mono font-bold text-[#f5f5f0] truncate">Nashiat Hossain</p>
              <span className="text-[9px] font-mono text-[#f5f5f0]/40 uppercase tracking-widest block">DEVELOPER</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-mono text-[10px] uppercase tracking-wider font-bold rounded-[3px] cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Terminal Panel area */}
      <main className="flex-grow flex flex-col min-w-0 bg-[#080808]">
        
        {/* Main top sticky navbar */}
        <header className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a]">
          <div className="text-left">
            <h1 className="text-2xl font-serif font-black tracking-tight text-[#f5f5f0]">
              {activeTab === 'dashboard' && 'SYSTEM SUMMARY'}
              {activeTab === 'bookings' && 'MEETING INBOX'}
              {activeTab === 'messages' && 'LEADS LOG'}
              {activeTab === 'analytics' && 'METRICS MATRIX'}
              {activeTab === 'calendar' && 'OPERATIONAL TIMELINE'}
              {activeTab === 'settings' && 'SYSTEM PARAMETERS'}
            </h1>
            <p className="text-xs text-[#f5f5f0]/40 font-mono tracking-wider mt-0.5">
              SECURE ADMIN CONTROL CENTER
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-1 bg-[#121212] border border-white/5 rounded-[2px] text-[#f5f5f0]/50">
              LOCATION: <span className="text-[#c9a46c]">/admin</span>
            </span>
            <button
              onClick={fetchDBData}
              disabled={isDataLoading}
              className="p-1.5 bg-[#121212] hover:bg-[#1c1c1c] border border-white/5 rounded-[2px] text-[#c9a46c] hover:text-[#f5f5f0] cursor-pointer active:scale-95 transition-transform"
              title="Refresh engine state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDataLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* 3. Panel content block routing */}
        <div className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* TOAST SYSTEM NOTIFICATION FEED */}
          {notifications.length > 0 && (
            <div className="mb-6 space-y-2">
              {notifications.map((note, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#c9a46c]/5 border border-[#c9a46c]/20 p-3 rounded-[3px] text-xs font-mono text-[#c9a46c] text-left">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse text-[#c9a46c]" />
                    <span>{note}</span>
                  </div>
                  <button onClick={() => setNotifications(notifications.filter((_, i) => i !== idx))} className="text-[#c9a46c]/40 hover:text-[#c9a46c] text-[10px] ml-4 font-bold uppercase tracking-wider">
                    DISMISS
                  </button>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                <div>
                  <h2 className="text-3xl font-serif font-black tracking-tight text-[#f5f5f0]">
                    Welcome back, Nashiat
                  </h2>
                  <p className="text-sm text-[#f5f5f0]/50 font-light mt-1">
                    Manage bookings, leads, messages, and website activity.
                  </p>
                </div>

                {/* Dashboard Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  
                  {/* Card 1 */}
                  <div className="col-span-2 lg:col-span-2 bg-[#121212]/90 border border-white/5 rounded-[4px] p-5 shadow-lg relative overflow-hidden group hover:border-[#c9a46c]/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Globe className="w-16 h-16 text-[#c9a46c]" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider text-[#f5f5f0]/40 uppercase block mb-3">
                      Total Visitors
                    </span>
                    <h3 className="text-4xl font-serif font-black text-[#f5f5f0] mb-1">
                      {totalVisitors}
                    </h3>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold block">
                      ✦ LIVE PORTFOLIO DISPATCH
                    </span>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#121212]/90 border border-white/5 rounded-[4px] p-5 shadow-lg relative overflow-hidden group hover:border-[#c9a46c]/30 transition-all">
                    <span className="text-[10px] font-mono tracking-wider text-[#f5f5f0]/40 uppercase block mb-3">
                      Total Bookings
                    </span>
                    <h3 className="text-4xl font-serif font-black text-[#c9a46c] mb-1">
                      {totalBookingsCount}
                    </h3>
                    <span className="text-[9px] font-mono text-[#f5f5f0]/30 block">
                      {bookings.filter(b => b.status === 'Confirmed').length} Confirmed
                    </span>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#121212]/90 border border-white/5 rounded-[4px] p-5 shadow-lg relative overflow-hidden group hover:border-[#c9a46c]/30 transition-all">
                    <span className="text-[10px] font-mono tracking-wider text-[#f5f5f0]/40 uppercase block mb-3">
                      Total Leads
                    </span>
                    <h3 className="text-4xl font-serif font-black text-[#f5f5f0] mb-1">
                      {totalLeadsCount}
                    </h3>
                    <span className="text-[9px] font-mono text-[#f5f5f0]/30 block">
                      {unreadMessagesCount} unread message{unreadMessagesCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-[#121212]/90 border border-white/5 rounded-[4px] p-5 shadow-lg relative overflow-hidden group hover:border-[#c9a46c]/30 transition-all">
                    <span className="text-[10px] font-mono tracking-wider text-[#f5f5f0]/40 uppercase block mb-3">
                      Conversion Rate
                    </span>
                    <h3 className="text-4xl font-serif font-black text-[#f5f5f0] mb-1">
                      {conversionRate}%
                    </h3>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold block">
                      ✦ ULTRA HIGH CONVERSION
                    </span>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-[#121212]/90 border border-white/5 rounded-[4px] p-5 shadow-lg relative overflow-hidden group hover:border-[#c9a46c]/30 transition-all">
                    <span className="text-[10px] font-mono tracking-wider text-[#f5f5f0]/40 uppercase block mb-3">
                      Bookings This Month
                    </span>
                    <h3 className="text-4xl font-serif font-black text-[#f5f5f0] mb-1">
                      {currentMonthBookings}
                    </h3>
                    <span className="text-[9px] font-mono text-[#f5f5f0]/30 block">
                      In month of June 2026
                    </span>
                  </div>
                </div>

                {/* Dashboard layout blocks splitting bookings & leads */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left block - recent bookings summary */}
                  <div className="lg:col-span-7 bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                          Incoming Schedule Handshakes
                        </h3>
                        <p className="text-xs text-[#f5f5f0]/40 font-mono">Pending discovery sessions</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-[10px] font-mono font-bold text-[#c9a46c] uppercase tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Inbox ({bookings.length})</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((bk) => (
                        <div key={bk.id} className="p-4 bg-[#121212] border border-white/5 hover:border-white/10 rounded-[3px] transition-colors relative flex justify-between items-center gap-4">
                          <div className="truncate text-left space-y-1">
                            <div className="flex items-center gap-2 py-0.5">
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                bk.status === 'New' ? 'bg-[#c9a46c]' :
                                bk.status === 'Confirmed' ? 'bg-indigo-400' :
                                bk.status === 'Completed' ? 'bg-emerald-400' : 'bg-red-400'
                              }`} />
                              <h4 className="text-xs font-mono font-bold text-[#f5f5f0] truncate">
                                {bk.name}
                              </h4>
                              {bk.company && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 text-[#f5f5f0]/50 rounded cursor-default uppercase">
                                  {bk.company}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#f5f5f0]/50 truncate font-mono">
                              {bk.focus}
                            </p>
                            <span className="text-[10px] font-mono text-[#c9a46c] block">
                              Proposed: {bk.date} @ {bk.time}
                            </span>
                          </div>

                          <div className="flex gap-1.5 shrink-0">
                            {bk.status === 'New' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, 'Confirmed')}
                                className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-mono text-[9px] uppercase tracking-wider font-bold rounded-[2px]"
                              >
                                Accept
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedCalendarEvent(bk);
                                setActiveTab('calendar');
                              }}
                              className="px-2 py-1 bg-[#0b0b0b] hover:bg-[#1a1a1a] text-[#f5f5f0]/60 hover:text-[#f5f5f0] border border-white/5 font-mono text-[9px] uppercase tracking-wider font-bold rounded-[2px]"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}

                      {bookings.length === 0 && (
                        <div className="py-12 text-center border border-dashed border-white/5 rounded-[4px]">
                          <CalendarIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
                          <p className="text-xs font-mono text-[#f5f5f0]/30">No bookings logged yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right block - recent leads brief summary */}
                  <div className="lg:col-span-5 bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                          Live Client Project Briefs
                        </h3>
                        <p className="text-xs text-[#f5f5f0]/40 font-mono">Incoming leads stack</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="text-[10px] font-mono font-bold text-[#c9a46c] uppercase tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Manage Inquiries</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {leads.slice(0, 3).map((ld) => (
                        <div key={ld.id} className="p-4 bg-[#121212] border border-white/5 rounded-[3px] space-y-2 text-left relative overflow-hidden">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-xs font-mono font-bold text-[#f5f5f0]">
                                {ld.name}
                              </h4>
                              <span className="text-[9px] font-mono text-[#f5f5f0]/40 uppercase tracking-widest block">
                                {ld.businessName}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#c9a46c]/10 text-[#c9a46c] border border-[#c9a46c]/15">
                              {ld.budget}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#f5f5f0]/60 line-clamp-2">
                            "{ld.message}"
                          </p>

                          <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <span className="text-[9px] font-mono text-[#f5f5f0]/30">
                              {new Date(ld.timestamp).toLocaleDateString()}
                            </span>
                            {ld.status === 'unread' && (
                              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" title="Unread Lead Brief" />
                            )}
                          </div>
                        </div>
                      ))}

                      {leads.length === 0 && (
                        <div className="py-12 text-center border border-dashed border-white/5 rounded-[4px]">
                          <Inbox className="w-10 h-10 text-white/10 mx-auto mb-3" />
                          <p className="text-xs font-mono text-[#f5f5f0]/30">No contact leads submitted yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB: BOOKINGS PANEL */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                {/* Bookings navigation and searching bar */}
                <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-[4px] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-lg">
                  
                  {/* Search input bar */}
                  <div className="relative flex-grow max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#f5f5f0]/30">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      placeholder="Search bookings by client, email, topic..."
                      className="w-full pl-9 pr-4 py-2 bg-[#080808] border border-white/5 rounded-[2px] text-xs font-mono text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c] transition-colors"
                    />
                  </div>

                  {/* Filter selector badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-mono text-[#f5f5f0]/40 uppercase tracking-widest flex items-center gap-1 select-none">
                      <Filter className="w-3 h-3" /> Filter:
                    </span>
                    {(['All', 'New', 'Confirmed', 'Completed', 'Cancelled'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setBookingFilter(f)}
                        className={`px-3 py-1.5 rounded-[2px] border text-[10px] font-mono cursor-pointer transition-colors ${
                          bookingFilter === f
                            ? 'bg-[#c9a46c]/10 border-[#c9a46c] text-[#c9a46c] font-bold'
                            : 'bg-[#080808] border-white/5 text-[#f5f5f0]/50 hover:border-white/20 hover:text-[#f5f5f0]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Bookings stack feed */}
                <div className="space-y-3">
                  {bookings
                    .filter(b => {
                      const matchesF = bookingFilter === 'All' || b.status === bookingFilter;
                      const matchesS = [b.name, b.email, b.focus, b.company || '']
                        .some(fVal => fVal.toLowerCase().includes(bookingSearch.toLowerCase()));
                      return matchesF && matchesS;
                    })
                    .map(bk => (
                      <div
                        key={bk.id}
                        className="p-6 bg-[#0c0c0c] border border-white/5 hover:border-[#c9a46c]/20 rounded-[4px] relative overflow-hidden transition-all text-left"
                      >
                        {/* Vertical status color anchor accent */}
                        <div className={`absolute top-0 bottom-0 left-0 w-[3px] ${
                          bk.status === 'New' ? 'bg-[#c9a46c]' :
                          bk.status === 'Confirmed' ? 'bg-indigo-500' :
                          bk.status === 'Completed' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* Col 1: client particulars & date info */}
                          <div className="lg:col-span-4 space-y-2">
                            <div>
                              <span className="text-[9px] font-mono text-[#c9a46c] border border-[#c9a46c]/30 rounded px-1.5 py-0.5 bg-[#c9a46c]/5 uppercase tracking-wider select-none">
                                {bk.status}
                              </span>
                              <h3 className="text-base font-serif font-black text-[#f5f5f0] mt-2 leading-tight">
                                {bk.name}
                              </h3>
                              <p className="text-xs text-[#f5f5f0]/40 font-mono mt-0.5 truncate" title={bk.email}>
                                {bk.email}
                              </p>
                              {bk.company && (
                                <p className="text-[10px] text-[#f5f5f0]/60 font-mono flex items-center gap-1.5 mt-1 select-none">
                                  <Building className="w-3.5 h-3.5" /> {bk.company}
                                </p>
                              )}
                            </div>

                            <div className="p-2.5 bg-[#121212] border border-white/5 rounded-[2px] space-y-1">
                              <span className="text-[8px] font-mono text-[#f5f5f0]/30 uppercase block">SCHEDULE TIME WINDOW</span>
                              <p className="text-xs font-bold text-[#c9a46c]">
                                {bk.date}, 2026
                              </p>
                              <p className="text-[10px] font-mono text-[#f5f5f0]/50 select-none">
                                {bk.time}
                              </p>
                            </div>
                          </div>

                          {/* Col 2: message topic parameters details */}
                          <div className="lg:col-span-5 space-y-3 font-sans">
                            <div>
                              <span className="text-[9px] font-mono text-[#f5f5f0]/30 uppercase tracking-widest block">MEETING FOCUS FIELD</span>
                              <h4 className="text-xs font-mono font-bold text-[#f5f5f0] mt-1">
                                {bk.focus}
                              </h4>
                            </div>

                            {bk.description && (
                              <div>
                                <span className="text-[9px] font-mono text-[#f5f5f0]/30 uppercase tracking-widest block">CLIENT SPECIFICATIONS BRIEF</span>
                                <p className="text-xs text-[#f5f5f0]/60 mt-1 leading-relaxed bg-[#080808] p-3 rounded border border-white/5 font-light">
                                  "{bk.description}"
                                </p>
                              </div>
                            )}

                            <span className="text-[9px] font-mono text-[#f5f5f0]/20 block">
                              Created Handshake: {new Date(bk.createdAt).toLocaleString()}
                            </span>
                          </div>

                          {/* Col 3: operations controllers */}
                          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 justify-end lg:items-end w-full pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                            
                            {/* Actions Dropdown buttons */}
                            <div className="flex flex-wrap gap-1.5 justify-end">
                              {bk.status !== 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bk.id, 'Confirmed')}
                                  className="px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer transition-colors"
                                  title="Mark as Confirmed"
                                >
                                  Confirm
                                </button>
                              )}

                              {bk.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bk.id, 'Completed')}
                                  className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer transition-colors"
                                  title="Mark as Complete"
                                >
                                  Complete
                                </button>
                              )}

                              {bk.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bk.id, 'Cancelled')}
                                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer transition-colors"
                                  title="Mark as Cancelled"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteBooking(bk.id)}
                              className="px-2.5 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer flex items-center justify-center gap-1 mt-auto transition-colors align-bottom"
                              title="Delete permanently from core log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>

                          </div>

                        </div>
                      </div>
                    ))}

                  {bookings.filter(b => {
                    const matchesF = bookingFilter === 'All' || b.status === bookingFilter;
                    const matchesS = [b.name, b.email, b.focus, b.company || '']
                      .some(fVal => fVal.toLowerCase().includes(bookingSearch.toLowerCase()));
                    return matchesF && matchesS;
                  }).length === 0 && (
                    <div className="py-16 text-center border border-dashed border-white/5 rounded-[4px] bg-[#0c0c0c] text-[#f5f5f0]/30 font-mono">
                      <SlidersHorizontal className="w-12 h-12 text-white/5 mx-auto mb-4" />
                      <p className="text-xs">No bookings matched the active parameters grid.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: LEAD INBOX */}
            {activeTab === 'messages' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                {/* Search / Filter Control header */}
                <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-[4px] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-lg">
                  
                  {/* Search leads */}
                  <div className="relative flex-grow max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#f5f5f0]/30">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search leads by client name, email, budget..."
                      className="w-full pl-9 pr-4 py-2 bg-[#080808] border border-white/5 rounded-[2px] text-xs font-mono text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c] transition-colors"
                    />
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-mono text-[#f5f5f0]/40 uppercase tracking-widest flex items-center gap-1 select-none">
                      <Filter className="w-3 h-3" /> Status:
                    </span>
                    {(['All', 'unread', 'read', 'archived'] as const).map(fl => (
                      <button
                        key={fl}
                        onClick={() => setLeadFilter(fl)}
                        className={`px-3 py-1.5 rounded-[2px] border text-[10px] font-mono cursor-pointer transition-colors uppercase tracking-wider ${
                          leadFilter === fl
                            ? 'bg-[#c9a46c]/10 border-[#c9a46c] text-[#c9a46c] font-bold'
                            : 'bg-[#080808] border-white/5 text-[#f5f5f0]/50 hover:border-white/20 hover:text-[#f5f5f0]'
                        }`}
                      >
                        {fl}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Leads lists stack */}
                <div className="space-y-4">
                  {leads
                    .filter(l => {
                      const matchesF = leadFilter === 'All' || l.status === leadFilter;
                      const matchesS = [l.name, l.email, l.businessName || '', l.budget, l.message]
                        .some(fVal => fVal.toLowerCase().includes(leadSearch.toLowerCase()));
                      return matchesF && matchesS;
                    })
                    .map(ld => (
                      <div
                        key={ld.id}
                        className={`p-6 bg-[#0c0c0c] border rounded-[4px] relative transition-all text-left overflow-hidden ${
                          ld.status === 'unread' ? 'border-[#c9a46c]/30 shadow-lg shadow-[#c9a46c]/5' : 'border-white/5'
                        }`}
                      >
                        {ld.status === 'unread' && (
                          <div className="absolute top-0 right-0 p-3 select-none">
                            <span className="h-2 w-2 rounded-full bg-[#c9a46c] block animate-pulse" title="Unread project brief" />
                          </div>
                        )}

                        <div className="space-y-4 font-sans">
                          
                          {/* Header info bar */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h3 className="text-base font-serif font-black text-[#f5f5f0] flex items-center gap-2">
                                {ld.name}
                                {ld.status === 'unread' && (
                                  <span className="text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-[#c9a46c]/15 text-[#c9a46c] uppercase">NEW</span>
                                )}
                              </h3>
                              <p className="text-xs text-[#f5f5f0]/40 font-mono mt-0.5 uppercase tracking-wider">
                                Co: <span className="text-[#f5f5f0]/70 font-semibold">{ld.businessName || 'Sovereign Brand'}</span> | <span className="font-mono text-[10px] select-all lowercase">{ld.email}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[8px] font-mono text-[#f5f5f0]/40 uppercase tracking-widest select-none">PROPOSED ALLOCATION:</span>
                              <span className="px-3 py-1 bg-[#121212] border border-[#c9a46c]/20 text-[#c9a46c] font-mono text-xs font-black rounded-[2px] tracking-wider select-none">
                                {ld.budget}
                              </span>
                            </div>
                          </div>

                          {/* Message box */}
                          <div className="bg-[#080808] border border-white/5 p-4 rounded-[3px]">
                            <span className="text-[8px] font-mono text-[#f5f5f0]/30 uppercase tracking-widest block mb-2 select-none">PROJECT BRIEFING BRIEF</span>
                            <p className="text-xs text-[#f5f5f0]/70 leading-relaxed font-light whitespace-pre-wrap">
                              "{ld.message}"
                            </p>
                          </div>

                          {/* Bottom controls bar */}
                          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t border-white/5">
                            <span className="text-[10px] font-mono text-[#f5f5f0]/30">
                              Dispatched: {new Date(ld.timestamp).toLocaleString()}
                            </span>

                            <div className="flex items-center gap-2 justify-end">
                              
                              {ld.status === 'unread' ? (
                                <button
                                  onClick={() => handleUpdateLeadStatus(ld.id, 'read')}
                                  className="px-2.5 py-1.5 bg-[#121212] hover:bg-[#1c1c1c] text-[#c9a46c] border border-[#c9a46c]/20 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer transition-colors"
                                >
                                  Mark read
                                </button>
                              ) : ld.status === 'read' ? (
                                <button
                                  onClick={() => handleUpdateLeadStatus(ld.id, 'archived')}
                                  className="px-2.5 py-1.5 bg-[#121212] hover:bg-[#1c1c1c] text-[#f5f5f0]/50 border border-white/5 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer transition-colors"
                                >
                                  Archive
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateLeadStatus(ld.id, 'unread')}
                                  className="px-2.5 py-1.5 bg-[#121212] hover:bg-[#1c1c1c] text-[#f5f5f0]/50 border border-white/5 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer transition-colors"
                                >
                                  Unarchive
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteLead(ld.id)}
                                className="p-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-rose-400 font-mono text-[10px] rounded cursor-pointer transition-colors"
                                title="Delete inquiry permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </div>

                        </div>
                      </div>
                    ))}

                  {leads.filter(l => {
                    const matchesF = leadFilter === 'All' || l.status === leadFilter;
                    const matchesS = [l.name, l.email, l.businessName || '', l.budget, l.message]
                      .some(fVal => fVal.toLowerCase().includes(leadSearch.toLowerCase()));
                    return matchesF && matchesS;
                  }).length === 0 && (
                    <div className="py-16 text-center border border-dashed border-white/5 rounded-[4px] bg-[#0c0c0c] text-[#f5f5f0]/30 font-mono">
                      <FolderOpen className="w-12 h-12 text-white/5 mx-auto mb-4" />
                      <p className="text-xs">Perfect. Lead inbox completely clean under active status filter.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: CALENDAR */}
            {activeTab === 'calendar' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Calendar render grid */}
                  <div className="lg:col-span-8">
                    {renderCalendar()}
                  </div>

                  {/* Booking details drawer sidebar panel */}
                  <div className="lg:col-span-4 bg-[#0c0c0c] border border-white/5 rounded-[3px] p-6 shadow-xl space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#f5f5f0] border-b border-white/5 pb-3">
                      Selected Booking Profile
                    </h3>

                    <AnimatePresence mode="wait">
                      {selectedCalendarEvent ? (
                        <motion.div
                          key={selectedCalendarEvent.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4 font-sans text-xs"
                        >
                          <div className="flex justify-between items-start">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono text-center border uppercase tracking-wider ${
                              selectedCalendarEvent.status === 'New' ? 'bg-[#c9a46c]/10 border-[#c9a46c]/30 text-[#c9a46c]' :
                              selectedCalendarEvent.status === 'Confirmed' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                              selectedCalendarEvent.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                              'bg-rose-500/10 border-rose-500/30 text-rose-300 line-through'
                            }`}>
                              {selectedCalendarEvent.status}
                            </span>
                            <button
                              onClick={() => setSelectedCalendarEvent(null)}
                              className="text-[#f5f5f0]/30 hover:text-[#f5f5f0] text-[10px] font-mono tracking-widest uppercase"
                            >
                              Clear
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <span className="text-[8px] font-mono text-[#f5f5f0]/40 uppercase tracking-widest">CLIENT NAME</span>
                              <p className="text-sm font-bold text-[#f5f5f0] mt-0.5">{selectedCalendarEvent.name}</p>
                              <span className="text-[10px] font-mono text-white/40 block mt-0.5 select-all">{selectedCalendarEvent.email}</span>
                              {selectedCalendarEvent.company && (
                                <span className="text-[10px] font-mono text-[#c9a46c] hover:underline flex items-center gap-1 uppercase mt-0.5 font-bold">
                                  <Building className="w-3 h-3" /> {selectedCalendarEvent.company}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-[#121212] p-3 rounded border border-white/5">
                              <div>
                                <span className="text-[8px] font-mono text-[#f5f5f0]/30 uppercase">SELECTED DATE</span>
                                <p className="text-xs font-bold text-[#c9a46c] mt-0.5">{selectedCalendarEvent.date}, 2026</p>
                              </div>
                              <div>
                                <span className="text-[8px] font-mono text-[#f5f5f0]/30 uppercase">TIMESLOT</span>
                                <p className="text-[11px] font-mono text-[#f5f5f0]/70 mt-0.5">{selectedCalendarEvent.time}</p>
                              </div>
                            </div>

                            <div>
                              <span className="text-[8px] font-mono text-[#f5f5f0]/40 uppercase tracking-widest">MEETING BOTTLENECK TOPIC</span>
                              <p className="text-xs text-[#f5f5f0]/80 font-mono mt-1 font-bold">{selectedCalendarEvent.focus}</p>
                            </div>

                            {selectedCalendarEvent.description && (
                              <div className="bg-[#080808] p-3 rounded border border-white/5">
                                <span className="text-[8px] font-mono text-[#f5f5f0]/30 uppercase block mb-1">CLIENT BRIEF DESCRIPTION</span>
                                <p className="text-[11px] text-[#f5f5f0]/60 leading-relaxed font-light font-sans">
                                  "{selectedCalendarEvent.description}"
                                </p>
                              </div>
                            )}

                            <span className="text-[9px] font-mono text-[#f5f5f0]/20 block">
                              LOGGED: {new Date(selectedCalendarEvent.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="pt-4 border-t border-white/5 flex gap-2">
                            {selectedCalendarEvent.status === 'New' && (
                              <button
                                onClick={() => {
                                  handleUpdateBookingStatus(selectedCalendarEvent.id, 'Confirmed');
                                  setSelectedCalendarEvent({ ...selectedCalendarEvent, status: 'Confirmed' });
                                }}
                                className="flex-grow py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-mono text-[9px] uppercase tracking-wider font-bold rounded cursor-pointer"
                              >
                                Confirm Seat
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDeleteBooking(selectedCalendarEvent.id);
                              }}
                              className="px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 font-mono text-[9px] uppercase font-bold rounded cursor-pointer"
                            >
                              Delete Booking
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="py-16 text-center text-[#f5f5f0]/30 font-mono text-xs">
                          <p>Click any event code inline on calendar grid to load dynamic specs sheet details here instantly.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB: ANALYTICS VIEW */}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                {/* Simulated Web Metrics charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Chart 1: Conversion rate */}
                  <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                    <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                      Discovery Handshakes Funnel
                    </h3>
                    <p className="text-xs text-[#f5f5f0]/40 font-mono">Conversion metrics distribution</p>

                    <div className="py-8 space-y-4">
                      {/* Funnel chart using pure HTML/CSS */}
                      <div className="space-y-2">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-[#f5f5f0]/50">UTM Total Raw Visitors</span>
                          <span>{totalVisitors}</span>
                        </div>
                        <div className="w-full bg-white/5 h-3 rounded-[1px] overflow-hidden">
                          <div className="bg-[#f5f5f0]/40 h-full w-full" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-[#f5f5f0]/50">Brief Leads Contact Handshakes</span>
                          <span>{totalLeadsCount} ({((totalLeadsCount / totalVisitors) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-white/5 h-3 rounded-[1px] overflow-hidden">
                          <div className="bg-[#c9a46c]/40 h-full" style={{ width: `${(totalLeadsCount / totalVisitors) * 100}%` }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-[#f5f5f0]/50">Committed Scheduler Bookings</span>
                          <span>{totalBookingsCount} ({conversionRate}%)</span>
                        </div>
                        <div className="w-full bg-white/5 h-3 rounded-[1px] overflow-hidden">
                          <div className="bg-[#c9a46c] h-full" style={{ width: `${(totalBookingsCount / totalVisitors) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart 2: Booking categories */}
                  <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                    <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                      Meeting Core Topics Focus
                    </h3>
                    <p className="text-xs text-[#f5f5f0]/40 font-mono">Volume breakdown by bottlenecks</p>

                    <div className="py-6 space-y-4 font-mono text-xs">
                      {/* List down categories and render distribution bar */}
                      {(() => {
                        const topics: Record<string, number> = {};
                        bookings.forEach(b => {
                          topics[b.focus] = (topics[b.focus] || 0) + 1;
                        });

                        const entries = Object.entries(topics).sort((a,b) => b[1] - a[1]);
                        const maxCount = Math.max(...entries.map(e => e[1]), 1);

                        if (entries.length === 0) {
                          return (
                            <div className="text-center py-6 text-white/20">
                              <p>No booking topics logged to display chart indicators.</p>
                            </div>
                          );
                        }

                        return entries.map(([topic, count]) => (
                          <div key={topic} className="space-y-1.5 text-left">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-[#f5f5f0]/70 truncate max-w-[200px]">{topic}</span>
                              <span className="text-[#c9a46c] font-bold">{count} ({((count / bookings.length) * 100).toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-[1.5px] overflow-hidden">
                              <div className="bg-[#c9a46c] h-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                </div>

                {/* Status breakdown table */}
                <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                    Audit Quality State Matrices
                  </h3>
                  <p className="text-xs text-[#f5f5f0]/40 font-mono">Status verification matrix ledger</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/10 text-[#f5f5f0]/30">
                          <th className="py-3 px-4">PARAMETER</th>
                          <th className="py-3 px-4 text-center">NEW</th>
                          <th className="py-3 px-4 text-center">CONFIRMED</th>
                          <th className="py-3 px-4 text-center">COMPLETED</th>
                          <th className="py-3 px-4 text-center">CANCELLED</th>
                          <th className="py-3 px-4 text-right">TOTAL RECORDED</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="py-4 px-4 font-black">Meeting Bookings Count</td>
                          <td className="py-4 px-4 text-center text-[#c9a46c]">
                            {bookings.filter(b => b.status === 'New').length}
                          </td>
                          <td className="py-4 px-4 text-center text-indigo-300">
                            {bookings.filter(b => b.status === 'Confirmed').length}
                          </td>
                          <td className="py-4 px-4 text-center text-emerald-300">
                            {bookings.filter(b => b.status === 'Completed').length}
                          </td>
                          <td className="py-4 px-4 text-center text-rose-300">
                            {bookings.filter(b => b.status === 'Cancelled').length}
                          </td>
                          <td className="py-4 px-4 text-right font-black text-[#c9a46c]">{bookings.length}</td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4 font-black">Lead Inbox Messages</td>
                          <td className="py-4 px-4 text-center text-blue-300">
                            {leads.filter(l => l.status === 'unread').length} <span className="text-[9px] text-white/30 block">Unread</span>
                          </td>
                          <td className="py-4 px-4 text-center text-[#f5f5f0]/50" colSpan={3}>
                            {leads.filter(l => l.status === 'read').length} Read | {leads.filter(l => l.status === 'archived').length} Archived
                          </td>
                          <td className="py-4 px-4 text-right font-black text-[#f5f5f0]/70">{leads.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: SETTINGS & AVAILABILITY */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                {localSettings ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: available days and time slots */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Card 1: Available Days */}
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                        <h3 className="font-serif text-lg font-bold text-[#f5f5f0] flex items-center gap-2">
                          <SlidersHorizontal className="w-5 h-5 text-[#c9a46c]" />
                          Booking Day Invariants
                        </h3>
                        <p className="text-xs text-[#f5f5f0]/40 font-mono">Select days available for client scheduling handshakes</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                          {daysOfWeek.map(day => {
                            const isAvail = localSettings.availableDays[day];
                            return (
                              <div
                                key={day}
                                onClick={() => handleToggleDay(day)}
                                className={`p-3.5 border rounded-[2.5px] cursor-pointer text-center font-mono text-xs transition-colors select-none ${
                                  isAvail
                                    ? 'bg-[#c9a46c]/10 border-[#c9a46c] text-[#c9a46c] font-black'
                                    : 'bg-[#080808] border-white/5 text-[#f5f5f0]/30 hover:border-white/10'
                                }`}
                              >
                                {day}
                                <span className={`block text-[9px] mt-1 font-bold ${isAvail ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {isAvail ? 'ON' : 'OFF'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card 2: Time slots list manager */}
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                        <h3 className="font-serif text-lg font-bold text-[#f5f5f0] flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[#c9a46c]" />
                          Proposed Hours Allocation Slots
                        </h3>
                        <p className="text-xs text-[#f5f5f0]/40 font-mono">Create or remove precise active time brackets</p>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTimeSlot}
                            onChange={(e) => setNewTimeSlot(e.target.value)}
                            placeholder="e.g. 10:00 AM (EST)"
                            className="bg-[#080808] border border-white/5 rounded-[2px] px-3 py-2 text-xs font-mono text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c] max-w-xs w-full"
                          />
                          <button
                            onClick={handleAddTimeSlot}
                            className="px-4 py-2 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-black rounded-[2px] active:scale-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {localSettings.timeSlots.map(slot => (
                            <span
                              key={slot}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#121212] border border-white/10 font-mono text-xs text-[#f5f5f0]/80 select-default"
                            >
                              <span>{slot}</span>
                              <button
                                onClick={() => handleRemoveTimeSlot(slot)}
                                className="text-rose-400 hover:text-rose-500 font-bold ml-1 text-xs"
                                title="Remove slot"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card 3: Manual Blocked list dates */}
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                        <h3 className="font-serif text-lg font-bold text-[#f5f5f0] flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5 text-[#c9a46c]" />
                          Manually Blocked Dates Exception Layout
                        </h3>
                        <p className="text-xs text-[#f5f5f0]/40 font-mono">Flag specific absolute dates completely closed for scheduling</p>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newBlockedDate}
                            onChange={(e) => setNewBlockedDate(e.target.value)}
                            placeholder="e.g. 2026-06-12"
                            className="bg-[#080808] border border-white/5 rounded-[2px] px-3 py-2 text-xs font-mono text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c] max-w-xs w-full"
                          />
                          <button
                            onClick={handleAddBlockedDate}
                            className="px-4 py-2 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-black rounded-[2px] active:scale-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Block</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {localSettings.blockedDates.map(bDate => (
                            <span
                              key={bDate}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/10 border border-rose-900/30 font-mono text-xs text-rose-300"
                            >
                              <span>Unavailable: {bDate}</span>
                              <button
                                onClick={() => handleRemoveBlockedDate(bDate)}
                                className="text-rose-400 hover:text-rose-500 font-bold ml-1 text-xs"
                                title="Remove blocked date"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card: Personal Profile Customizer */}
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                          <User className="w-5 h-5 text-[#c9a46c]" />
                          <h3 className="font-serif text-lg font-bold text-[#f5f5f0]">
                            Personal Profile Information
                          </h3>
                        </div>
                        <p className="text-xs text-[#f5f5f0]/40 font-mono">Modify live identity information populated across the website frontend</p>

                        <div className="space-y-4 font-sans text-xs">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={localSettings.profile?.fullName || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), fullName: e.target.value }
                                } as any)}
                                className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c]"
                              />
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                                Professional Persona Title
                              </label>
                              <input
                                type="text"
                                value={localSettings.profile?.roleTitle || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), roleTitle: e.target.value }
                                } as any)}
                                className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                              High-Level Bio Introduction Headline
                            </label>
                            <input
                              type="text"
                              value={localSettings.profile?.bioIntroduction || ''}
                              onChange={(e) => setLocalSettings({
                                ...localSettings,
                                profile: { ...(localSettings.profile || {}), bioIntroduction: e.target.value }
                                } as any)}
                              className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                              Detailed Biography Description
                            </label>
                            <textarea
                              rows={5}
                              value={localSettings.profile?.bioLong || ''}
                              onChange={(e) => setLocalSettings({
                                ...localSettings,
                                profile: { ...(localSettings.profile || {}), bioLong: e.target.value }
                                } as any)}
                              className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] h-28 resize-none focus:outline-none focus:border-[#c9a46c]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                                WhatsApp Direct Number (No spaces, e.g. 88016xxxxxxxx)
                              </label>
                              <input
                                type="text"
                                value={localSettings.profile?.whatsappPhone || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), whatsappPhone: e.target.value }
                                } as any)}
                                className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c]"
                              />
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                                Contact Email Address
                              </label>
                              <input
                                type="email"
                                value={localSettings.profile?.contactEmail || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), contactEmail: e.target.value }
                                } as any)}
                                className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                                GitHub Profile Link
                              </label>
                              <input
                                type="text"
                                value={localSettings.profile?.githubLink || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), githubLink: e.target.value }
                                } as any)}
                                className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c]"
                              />
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-[#f5f5f0]/50 block mb-1.5 font-bold">
                                LinkedIn Profile Link
                              </label>
                              <input
                                type="text"
                                value={localSettings.profile?.linkedinLink || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), linkedinLink: e.target.value }
                                } as any)}
                                className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2.5 text-xs text-[#f5f5f0] focus:outline-none focus:border-[#c9a46c]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080808] p-4 border border-white/5 rounded">
                            <div>
                              <label className="text-[8px] font-mono uppercase tracking-wider text-[#f5f5f0]/40 block mb-1 font-bold">
                                Projects Completed
                              </label>
                              <input
                                type="number"
                                value={localSettings.profile?.totalProjectsCount || 0}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), totalProjectsCount: parseInt(e.target.value) || 0 }
                                } as any)}
                                className="w-full bg-[#060606] border border-white/5 rounded-[2px] p-2 text-xs text-[#f5f5f0] focus:outline-none"
                              />
                            </div>
                            
                            <div>
                              <label className="text-[8px] font-mono uppercase tracking-wider text-[#f5f5f0]/40 block mb-1 font-bold">
                                Handcrafted Built %
                              </label>
                              <input
                                type="number"
                                value={localSettings.profile?.handcraftedBuiltPercent || 100}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), handcraftedBuiltPercent: parseInt(e.target.value) || 0 }
                                } as any)}
                                className="w-full bg-[#060606] border border-white/5 rounded-[2px] p-2 text-xs text-[#f5f5f0] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[8px] font-mono uppercase tracking-wider text-[#f5f5f0]/40 block mb-1 font-bold">
                                Lighthouse Ideal
                              </label>
                              <input
                                type="text"
                                value={localSettings.profile?.lighthouseTarget || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), lighthouseTarget: e.target.value }
                                } as any)}
                                className="w-full bg-[#060606] border border-white/5 rounded-[2px] p-2 text-xs text-[#f5f5f0] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[8px] font-mono uppercase tracking-wider text-[#f5f5f0]/40 block mb-1 font-bold">
                                Design Code Name
                              </label>
                              <input
                                type="text"
                                value={localSettings.profile?.designStandardName || ''}
                                onChange={(e) => setLocalSettings({
                                  ...localSettings,
                                  profile: { ...(localSettings.profile || {}), designStandardName: e.target.value }
                                } as any)}
                                className="w-full bg-[#060606] border border-white/5 rounded-[2px] p-2 text-xs text-[#f5f5f0] focus:outline-none"
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Right Column: General specs inputs */}
                    <div className="lg:col-span-4 space-y-6 text-xs">
                      
                      {/* Card 4: Global specifications settings */}
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-4">
                        <h3 className="font-serif text-base font-bold text-[#f5f5f0] border-b border-white/5 pb-3">
                          Operational Targets
                        </h3>

                        <div className="space-y-4 font-sans text-left">
                          
                          <div>
                            <label className="text-[9px] font-mono uppercase tracking-widest text-[#f5f5f0]/40 block mb-1.5">
                              Notification Brand Email
                            </label>
                            <input
                              type="email"
                              value={localSettings.notificationEmail}
                              onChange={(e) => setLocalSettings({ ...localSettings, notificationEmail: e.target.value })}
                              className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2 text-xs font-mono text-[#f5f5f0]"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-mono uppercase tracking-widest text-[#f5f5f0]/40 block mb-1.5">
                              Local Timezone Indicator Description
                            </label>
                            <input
                              type="text"
                              value={localSettings.timezone}
                              onChange={(e) => setLocalSettings({ ...localSettings, timezone: e.target.value })}
                              className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2 text-xs font-mono text-[#f5f5f0]"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-mono uppercase tracking-widest text-[#f5f5f0]/40 block mb-1.5">
                              Google Meet / Schedule Link Set
                            </label>
                            <input
                              type="text"
                              value={localSettings.googleMeetLink}
                              onChange={(e) => setLocalSettings({ ...localSettings, googleMeetLink: e.target.value })}
                              className="w-full bg-[#080808] border border-white/5 rounded-[2px] p-2 text-xs font-mono text-[#f5f5f0]"
                            />
                          </div>

                        </div>

                        <button
                          onClick={() => handleSaveSettings(localSettings)}
                          disabled={isSavingSettings}
                          className="w-full py-3 mt-4 bg-[#c9a46c] hover:bg-[#b08e59] text-[#0b0b0b] font-mono text-xs uppercase tracking-widest font-black rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isSavingSettings ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>SAVING DETAILS...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>SAVE AND SECURE SETTINGS</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Card 5: Security Info */}
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-[4px] p-6 shadow-xl space-y-3 font-mono text-[10px] text-[#f5f5f0]/40">
                        <div className="flex items-center gap-2 text-[#c9a46c] font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>CREDENTIALS NOTICE</span>
                        </div>
                        <p className="leading-relaxed text-left text-[9px]">
                          Admin account particulars and passwords are encrypted securely. Modify your system credentials by exporting keys `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your hosting configurations.
                        </p>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="py-16 text-center text-white/30 font-mono">
                    <p>Failed to parse local server settings properties matrix.</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

    </div>
  );
}
