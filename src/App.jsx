import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext.jsx';
import { 
  LayoutDashboard, 
  Sparkles, 
  Map, 
  AlertTriangle, 
  Settings, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LogOut,
  MapPin,
  Languages,
  Shield,
  Clock,
  Compass,
  Trophy,
  Utensils
} from 'lucide-react';

// Import Views
import DashboardHome from './components/DashboardHome.jsx';
import SmartCompanion from './components/SmartCompanion.jsx';
import ServiceDirectory from './components/ServiceDirectory.jsx';
import IssueReporter from './components/IssueReporter.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import MatchCenter from './components/MatchCenter.jsx';
import ConcessionsPanel from './components/ConcessionsPanel.jsx';

export default function App() {
  const { 
    activeTab, 
    setActiveTab, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    userProfile, 
    setUserProfile,
    notifications, 
    dismissNotification,
    activeMatch,
    t 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [countdown, setCountdown] = useState("01h 44m 32s");

  // Countdown simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const matchTime = new Date();
      matchTime.setHours(14, 0, 0, 0); // Simulated match start at 14:00 today

      const diff = matchTime - now;
      if (diff <= 0) {
        setCountdown("LIVE MATCH");
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(
          `${hrs.toString().padStart(2, '0')}h ${mins
            .toString()
            .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Active notifications count
  const activeNotiCount = notifications.filter(n => n.active).length;

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'scores', label: t('navScores') || "Match Center", icon: Trophy },
    { id: 'companion', label: t('navCompanion'), icon: Sparkles },
    { id: 'services', label: t('navServices'), icon: Map },
    { id: 'food', label: t('navFood') || "Food & Drink", icon: Utensils },
    { id: 'complaints', label: t('navComplaints'), icon: AlertTriangle },
    { id: 'settings', label: t('navSettings'), icon: Settings },
  ];

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'العربية' },
    { code: 'hi', label: 'हिंदी' }
  ];

  const rolesList = [
    { code: 'Fan', label: 'Fan (Guest)' },
    { code: 'Volunteer', label: 'Volunteer' },
    { code: 'Venue Staff', label: 'Venue Staff' },
    { code: 'Organizer', label: 'Organizer (Command)' }
  ];

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setUserProfile(prev => ({
      ...prev,
      role: selectedRole
    }));
  };

  // Get credentials info based on role
  const getRoleBadge = () => {
    switch (userProfile.role) {
      case 'Fan':
        return {
          label: userProfile.ticketCategory || "Category 1",
          detail: userProfile.seatNumber || "Sec 104, Row 12, Seat 15",
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          icon: Compass
        };
      case 'Volunteer':
        return {
          label: "Assigned Volunteer",
          detail: "Gate 3 Access Control",
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          icon: User
        };
      case 'Venue Staff':
        return {
          label: "Venue Staff ID #2026",
          detail: "Facilities & Safety",
          color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          icon: Shield
        };
      case 'Organizer':
      default:
        return {
          label: "Operations Command",
          detail: "All Gates Clearance",
          color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
          icon: Shield
        };
    }
  };

  const badge = getRoleBadge();
  const RoleIcon = badge.icon;

  // Dynamic jersey color stripe style based on the selected match
  const dynamicStripeStyle = {
    height: '5px',
    width: '100%',
    background: `linear-gradient(to right, ${activeMatch.teamAColors.primary} 0%, ${activeMatch.teamAColors.secondary} 45%, ${activeMatch.teamBColors.primary} 55%, ${activeMatch.teamBColors.secondary} 100%)`
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 transition-colors duration-300 font-sans">
      
      {/* Dynamic Jersey-themed colored header strip */}
      <div style={dynamicStripeStyle} className="shrink-0 transition-all duration-700"></div>
      
      <div className="flex-1 flex min-h-0">
        
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] z-20">
          
          {/* Brand Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden" style={{ background: activeMatch.teamAColors.primary }}>
              <div className="absolute right-0 top-0 bottom-0 w-1/2" style={{ background: activeMatch.teamBColors.primary }}></div>
              <span className="text-white font-black text-sm tracking-wider z-10">AA</span>
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-none text-zinc-900 dark:text-zinc-50">
                ArenaAssist
              </h1>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                Smart Operations 2026
              </span>
            </div>
          </div>

          {/* User Card */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800/50">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{userProfile.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span className="truncate">MetLife Stadium, NY/NJ</span>
                </div>
              </div>
            </div>
            
            {/* Dynamic Credentials Indicator */}
            <div className={`mt-3 p-2 rounded-lg border text-[10px] ${badge.color} flex items-start gap-2`}>
              <RoleIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold leading-none mb-1">{badge.label}</p>
                <p className="opacity-90">{badge.detail}</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="leading-tight">
                <span className="block text-[10px] text-zinc-450 font-semibold uppercase">{activeMatch.teamA} v {activeMatch.teamB}</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300 text-xs font-bold">{countdown}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden animate-fade-in">
            <aside className="w-64 h-full bg-white dark:bg-[#0c0c0f] border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 animate-slide-in-right">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">AA</div>
                  <span className="font-extrabold text-sm">ArenaAssist</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Row */}
          <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            
            {/* Left Action / Mobile trigger */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Welcome banner (desktop) */}
              <div className="hidden sm:block">
                <h2 className="text-xs font-bold text-zinc-950 dark:text-zinc-50">
                  {t('welcomeBack')} {userProfile.name}
                </h2>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-green"></span>
                  MetLife Stadium Operations Node (Live)
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Role Quick Selector */}
              <div className="relative">
                <select
                  value={userProfile.role}
                  onChange={handleRoleChange}
                  className="appearance-none bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer text-zinc-800 dark:text-zinc-200"
                >
                  {rolesList.map(role => (
                    <option key={role.code} value={role.code}>{role.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg pl-7 pr-6 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer text-zinc-800 dark:text-zinc-200"
                >
                  {languagesList.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
                <Languages className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                title={theme === 'dark' ? t('themeLight') : t('themeDark')}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-orange-450" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotiOpen(!notiOpen);
                    setProfileOpen(false);
                  }}
                  className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 relative"
                >
                  <Bell className="w-4 h-4" />
                  {activeNotiCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 pulse-blue"></span>
                  )}
                </button>

                {/* Notification Overlay Menu */}
                {notiOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-40 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                      <span className="font-bold text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                        {t('notificationTitle')} ({activeNotiCount})
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto px-2 py-1 space-y-1">
                      {notifications.length === 0 ? (
                        <p className="text-center text-xs text-zinc-400 py-6">No notifications</p>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            className={`p-2.5 rounded-lg border text-xs transition-all relative ${
                              n.active 
                                ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 font-medium' 
                                : 'bg-transparent border-transparent opacity-75'
                            }`}
                          >
                            <p className="text-zinc-850 dark:text-zinc-200 pr-4">{n.text}</p>
                            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 block mt-1">{n.time}</span>
                            {n.active && (
                              <button 
                                onClick={() => dismissNotification(n.id)}
                                className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
                                title="Dismiss"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotiOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-300 dark:border-zinc-700 cursor-pointer"
                >
                  <User className="w-4 h-4 text-zinc-650 dark:text-zinc-300" />
                </button>

                {/* Profile Overlay */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-40 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-900">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">{userProfile.name}</p>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate">{userProfile.email}</p>
                    </div>
                    <div className="px-2 py-1">
                      <button 
                        onClick={() => {
                          setActiveTab('settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-300"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>{t('navSettings')}</span>
                      </button>
                      <button 
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout (Simulation)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* Tab View Router */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
            {activeTab === 'dashboard' && <DashboardHome />}
            {activeTab === 'scores' && <MatchCenter />}
            {activeTab === 'companion' && <SmartCompanion />}
            {activeTab === 'services' && <ServiceDirectory />}
            {activeTab === 'food' && <ConcessionsPanel />}
            {activeTab === 'complaints' && <IssueReporter />}
            {activeTab === 'settings' && <SettingsPanel />}
          </main>
          
        </div>
      </div>
    </div>
  );
}
