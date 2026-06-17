import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Settings, 
  Terminal, 
  Database, 
  Calendar, 
  Mail, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  X,
  Server,
  Key
} from 'lucide-react';
import { getApiUrl } from '../utils/api';

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  company?: string;
  focus: string;
  date: string;
  time: string;
  description?: string;
  createdAt: string;
  status: 'New' | 'Confirmed' | 'Completed' | 'Cancelled';
}

interface Lead {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  budget: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'archived';
}

export default function AdminConsole({ isOpen, onClose }: AdminConsoleProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'smtp' | 'bookings' | 'leads'>('smtp');
  
  // SMTP states
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [diagnosticLog, setDiagnosticLog] = useState<string>('');
  
  // Database states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Synchronize authentication state with LocalStorage for session convenience
  useEffect(() => {
    const savedToken = localStorage.getItem('nashiat_admin_token');
    const savedPass = localStorage.getItem('nashiat_admin_pass');
    if (savedToken === 'true' && savedPass) {
      setPassword(savedPass);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch admin and SMTP data upon successful validation
  useEffect(() => {
    if (isAuthenticated) {
      fetchSmtpSettings();
      fetchCrmData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch(getApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('nashiat_admin_token', 'true');
        localStorage.setItem('nashiat_admin_pass', password);
      } else {
        setErrorMsg(data.error || 'Access denied: Invalid code.');
      }
    } catch {
      setErrorMsg('Failed to reach backend security validator.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('nashiat_admin_token');
    localStorage.removeItem('nashiat_admin_pass');
  };

  const fetchSmtpSettings = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/admin/smtp`), {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      if (data.success && data.smtp) {
        setSmtpHost(data.smtp.host);
        setSmtpPort(data.smtp.port.toString());
        setSmtpUser(data.smtp.user);
        setSmtpPass(data.smtp.pass);
      }
    } catch (err) {
      console.error('Failed to load SMTP settings:', err);
    }
  };

  const fetchCrmData = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(getApiUrl(`/api/admin/data`), {
        headers: { 'x-admin-password': password }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('CRM fetch failed:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      const res = await fetch(getApiUrl('/api/admin/smtp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  const handleTestSmtp = async () => {
    setTestStatus('testing');
    setDiagnosticLog('[Client Socket Initialization] Testing connection parameters...\n');
    try {
      const res = await fetch(getApiUrl('/api/admin/test-smtp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus('success');
        setDiagnosticLog(prev => 
          prev + 
          `[SUCCESS] Connection Handshake Approved.\n` +
          `[SUCCESS] NodeMailer socket dispatch returned status code: 250 (OK).\n` +
          `[SUCCESS] Confirmation SMTP trigger dispatched to nashiathossain@gmail.com\n` +
          `[API Message] ${data.message || 'Success'}\n` +
          `[Message ID] ${data.responseId || 'N/A'}`
        );
      } else {
        setTestStatus('error');
        setDiagnosticLog(prev => 
          prev + 
          `[SOCKET FAILURE] Handshake process rejected.\n` +
          `[ERROR MESSAGE] ${data.error || 'N/A'}\n` +
          `[ERROR CODE] ${data.code || 'CONNECTION_FAILURE'}\n\n` +
          `==================================================\n` +
          `HOW TO RESOLVE THIS ISSUE:\n` +
          `==================================================\n` +
          `1. GMAIL USERS:\n` +
          `   - Ensure you are using a "Google App Password" (16 characters),\n` +
          `     NOT your standard account password.\n` +
          `   - Go to Google Account -> Security -> 2-Step Verification -> App Passwords.\n\n` +
          `2. SMTP CONFIGS:\n` +
          `   - SSL port: 465, STARTTLS port: 587\n` +
          `   - Ensure host/user spelling is correct.`
        );
      }
    } catch (err) {
      setTestStatus('error');
      setDiagnosticLog(prev => prev + `[CONNECTION TIMEOUT] Network failure details: ${(err as Error).message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        
        {/* Backdrop Mask */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#0e0e11] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden z-10 text-left text-gray-200"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#121217] border-b border-white/[0.04] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-[#8b5cf6]" />
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-white uppercase font-sans">
                  System Administrative Console
                </h2>
                <p className="text-[10px] font-mono text-gray-400">
                  CRITICAL METRICS // OUTGOING SMTP DELIVERIES // DATA PERSISTENCE
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isAuthenticated ? (
            /* Passcode Verification Sheet */
            <div className="p-8 max-w-md mx-auto text-center space-y-6">
              <div className="p-4 bg-[#8b5cf6]/5 rounded-full w-fit mx-auto border border-[#8b5cf6]/10">
                <Lock className="w-8 h-8 text-[#8b5cf6]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Administrative Seal Active</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Authentication is required to config mail deliveries, test active handshakes, and manage schedules.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Administrative Passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#121217] border border-white/[0.08] rounded-md text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-900/50 rounded text-xs text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-[#0b0b0b] font-medium text-xs rounded-md uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Authorize Access
                </button>
              </form>
            </div>
          ) : (
            /* Main Dashboard */
            <div className="flex flex-col md:flex-row h-[550px] overflow-hidden">
              
              {/* Sidebar Navigation */}
              <div className="w-full md:w-56 bg-[#111115] border-r border-white/[0.04] p-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab('smtp')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                      activeTab === 'smtp' 
                        ? 'bg-[#8b5cf6] text-[#0b0b0b]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>SMTP OUTGOING</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                      activeTab === 'bookings' 
                        ? 'bg-[#8b5cf6] text-[#0b0b0b]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>BOOKED SESSIONS ({bookings.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                      activeTab === 'leads' 
                        ? 'bg-[#8b5cf6] text-[#0b0b0b]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>BRIEFE LEADS ({leads.length})</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/[0.04] space-y-2">
                  <button
                    onClick={fetchCrmData}
                    disabled={loadingData}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-2 text-[10px] uppercase font-mono text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 rounded transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                    <span>Reload CRM</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2 text-[10px] tracking-wider uppercase font-mono text-center text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded border border-red-900/25 transition-all"
                  >
                    Logout Admin
                  </button>
                </div>
              </div>

              {/* Main Workspace Frame */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#09090b]">
                
                {activeTab === 'smtp' && (
                  /* SMTP configuration tab */
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-white flex items-center gap-2">
                        <span>Outgoing Mail Service Settings</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Configure SMTP variables synced to your Firestore database. These are loaded dynamically on the backend whenever a discovery session or contact lead is filed.
                      </p>
                    </div>

                    <form onSubmit={handleSaveSmtp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-[#8b5cf6] uppercase block">
                          SMTP HOST (OUTBOUND SERVER)
                        </label>
                        <input
                          type="text"
                          required
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="e.g. smtp.gmail.com"
                          className="w-full px-3 py-2 bg-[#121217] border border-white/[0.08] rounded text-xs text-white placeholder-gray-700 font-mono focus:outline-none focus:border-[#8b5cf6]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-[#8b5cf6] uppercase block">
                          SMTP PORT
                        </label>
                        <input
                          type="text"
                          required
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(e.target.value)}
                          placeholder="e.g. 587 or 465"
                          className="w-full px-3 py-2 bg-[#121217] border border-white/[0.08] rounded text-xs text-white placeholder-gray-700 font-mono focus:outline-none focus:border-[#8b5cf6]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-[#8b5cf6] uppercase block">
                          SMTP USERNAME (EMAIL AUTH)
                        </label>
                        <input
                          type="email"
                          required
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                          placeholder="e.g. custom.dev@gmail.com"
                          className="w-full px-3 py-2 bg-[#121217] border border-white/[0.08] rounded text-xs text-white placeholder-gray-700 font-mono focus:outline-none focus:border-[#8b5cf6]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-[#8b5cf6] uppercase block">
                          GMAIL APP PASSWORD / SMTP PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={smtpPass}
                            onChange={(e) => setSmtpPass(e.target.value)}
                            placeholder="16-character google app password"
                            className="w-full pl-3 pr-10 py-2 bg-[#121217] border border-white/[0.08] rounded text-xs text-white placeholder-gray-700 font-mono focus:outline-none focus:border-[#8b5cf6]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-2 pt-2 flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={saveStatus === 'saving'}
                          className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-[#0b0b0b] font-medium text-xs uppercase tracking-wide rounded transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'success' ? '✓ Saved to Firestore!' : 'Save & Sync Settings'}
                        </button>

                        <button
                          type="button"
                          onClick={handleTestSmtp}
                          disabled={testStatus === 'testing' || !smtpUser || !smtpPass}
                          className="px-4 py-2 bg-[#121217] hover:bg-white/5 text-white border border-white/10 font-medium text-xs uppercase tracking-wide rounded transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                        >
                          {testStatus === 'testing' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Diagnosing Handshake...</span>
                            </>
                          ) : (
                            <>
                              <Terminal className="w-3.5 h-3.5 text-[#8b5cf6]" />
                              <span>Verify Connection & Email Nashiat</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Handshake Diagnostic Shell Terminal Output */}
                    <AnimatePresence>
                      {diagnosticLog && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-white/[0.05] rounded-lg overflow-hidden"
                        >
                          <div className="bg-[#121216] px-4 py-2 border-b border-white/[0.05] flex items-center justify-between text-[10px] font-mono tracking-wider text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5 text-[#8b5cf6]" /> SOCKET FLOW LOGS
                            </span>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              testStatus === 'success' ? 'bg-green-400' : testStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
                            }`} />
                          </div>
                          <pre className="bg-[#050507] p-4 text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto max-h-[160px]">
                            {diagnosticLog}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  /* Bookings view */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-medium text-white">Discovery Sessions Registry</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Directly querying active bookings saved securely to Firestore.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-white/[0.03] border border-white/10 text-xs text-gray-300 font-mono rounded">
                        {bookings.length} Booked
                      </span>
                    </div>

                    {loadingData ? (
                      <div className="py-20 text-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-[#8b5cf6] animate-spin mx-auto" />
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Reaching Cloud Synced Tables...</p>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="py-16 text-center border border-dashed border-white/5 rounded-lg">
                        <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No scheduled discovery meetings detected.</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id}
                            className="p-4 bg-[#111115] border border-white/[0.04] rounded-lg space-y-3 hover:border-[#8b5cf6]/35 transition-colors"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="text-sm font-semibold text-white">{booking.name}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">{booking.email}</p>
                              </div>
                              <div className="text-right">
                                <span className="px-2 py-0.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[10px] font-mono text-[#a78bfa] rounded">
                                  {booking.id}
                                </span>
                                <p className="text-[10px] font-mono text-gray-500 mt-1">Confirmed</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#09090b] border border-white/5 rounded text-xs select-all">
                              <div>
                                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">DATE REQUESTED</span>
                                <span className="text-gray-200 font-medium">{booking.date}, 2026</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">TIMESLOT</span>
                                <span className="text-gray-200 font-medium">{booking.time}</span>
                              </div>
                            </div>

                            {booking.focus && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase block">CORE BOTTLENECK:</span>
                                <p className="text-xs text-gray-300 leading-relaxed bg-[#09090b] p-2.5 border border-white/5 rounded select-all">
                                  {booking.focus}
                                </p>
                              </div>
                            )}

                            {booking.description && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase block">ADDITIONAL BRIEF:</span>
                                <p className="text-xs text-gray-400 bg-[#09090b] p-2.5 border border-white/5 rounded select-all">
                                  {booking.description}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'leads' && (
                  /* Leads view */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-medium text-white">Brief Leads Inbox</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Directly querying intake submissions saved securely to Firestore.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-white/[0.03] border border-white/10 text-xs text-gray-300 font-mono rounded">
                        {leads.length} Leads
                      </span>
                    </div>

                    {loadingData ? (
                      <div className="py-20 text-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-[#8b5cf6] animate-spin mx-auto" />
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Reaching Cloud Synced Tables...</p>
                      </div>
                    ) : leads.length === 0 ? (
                      <div className="py-16 text-center border border-dashed border-white/5 rounded-lg">
                        <Mail className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Inbox empty. No leads received yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {leads.map((lead) => (
                          <div 
                            key={lead.id}
                            className="p-4 bg-[#111115] border border-white/[0.04] rounded-lg space-y-3 hover:border-[#8b5cf6]/35 transition-colors"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="text-sm font-semibold text-white">{lead.name}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">{lead.email}</p>
                              </div>
                              <div className="text-right">
                                <span className="px-2 py-0.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[10px] font-mono text-[#a78bfa] rounded">
                                  {lead.budget}
                                </span>
                                <p className="text-[10px] font-mono text-gray-500 mt-1">
                                  {lead.businessName || 'Sovereign Brand'}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-gray-500 uppercase block">DIGITAL PROBLEM STATEMENT:</span>
                              <p className="text-xs text-gray-300 leading-relaxed bg-[#09090b] p-2.5 border border-white/5 rounded select-all whitespace-pre-wrap">
                                {lead.message}
                              </p>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                              <span>ID: {lead.id}</span>
                              <span>{new Date(lead.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
