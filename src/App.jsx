import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext.jsx';
import { 
  LayoutDashboard, 
  Sparkles, 
  Map, 
  AlertTriangle, 
  Settings, 
  Shield, 
  Trophy, 
  Utensils,
  Compass,
  User
} from 'lucide-react';

// Import Views & Components
import DashboardHome from './components/DashboardHome.jsx';
import SmartCompanion from './components/SmartCompanion.jsx';
import ServiceDirectory from './components/ServiceDirectory.jsx';
import IssueReporter from './components/IssueReporter.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import MatchCenter from './components/MatchCenter.jsx';
import ConcessionsPanel from './components/ConcessionsPanel.jsx';
import ControlRoomView from './components/ControlRoomView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import { TABS } from './constants/tabs.js';

export default function App() {
  const { 
    activeTab, 
    setActiveTab, 
    userProfile, 
    activeMatch,
    t 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navItems = [
    { id: TABS.DASHBOARD, label: t('navDashboard'), icon: LayoutDashboard },
    { id: TABS.CONTROLROOM, label: "Operations Control", icon: Shield },
    { id: TABS.SCORES, label: t('navScores') || "Match Center", icon: Trophy },
    { id: TABS.COMPANION, label: t('navCompanion'), icon: Sparkles },
    { id: TABS.SERVICES, label: t('navServices'), icon: Map },
    { id: TABS.FOOD, label: t('navFood') || "Food & Drink", icon: Utensils },
    { id: TABS.COMPLAINTS, label: t('navComplaints'), icon: AlertTriangle },
    { id: TABS.SETTINGS, label: t('navSettings'), icon: Settings },
  ];

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

  // Dynamic jersey color stripe style based on the selected match
  const dynamicStripeStyle = {
    height: '5px',
    width: '100%',
    background: `linear-gradient(to right, ${activeMatch.teamAColors.primary} 0%, ${activeMatch.teamAColors.secondary} 45%, ${activeMatch.teamBColors.primary} 55%, ${activeMatch.teamBColors.secondary} 100%)`
  };

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-50 ${activeTab === TABS.CONTROLROOM ? 'dark:immersive-stadium-bg' : 'dark:bg-[#09090b]'} text-zinc-950 dark:text-zinc-50 transition-all duration-500 font-sans`}>
      
      {/* Dynamic Jersey-themed colored header strip */}
      <div style={dynamicStripeStyle} className="shrink-0 transition-all duration-700"></div>
      
      <div className="flex-1 flex min-h-0">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          activeMatch={activeMatch}
          countdown={countdown}
          navItems={navItems}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          badge={badge}
          t={t}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Row */}
          <Header
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            setActiveTab={setActiveTab}
          />

          {/* Tab View Router */}
          <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
            {activeTab === TABS.DASHBOARD && <ErrorBoundary><DashboardHome /></ErrorBoundary>}
            {activeTab === TABS.CONTROLROOM && <ErrorBoundary><ControlRoomView /></ErrorBoundary>}
            {activeTab === TABS.SCORES && <ErrorBoundary><MatchCenter /></ErrorBoundary>}
            {activeTab === TABS.COMPANION && <ErrorBoundary><SmartCompanion /></ErrorBoundary>}
            {activeTab === TABS.SERVICES && <ErrorBoundary><ServiceDirectory /></ErrorBoundary>}
            {activeTab === TABS.FOOD && <ErrorBoundary><ConcessionsPanel /></ErrorBoundary>}
            {activeTab === TABS.COMPLAINTS && <ErrorBoundary><IssueReporter /></ErrorBoundary>}
            {activeTab === TABS.SETTINGS && <ErrorBoundary><SettingsPanel /></ErrorBoundary>}
          </main>
          
        </div>
      </div>
    </div>
  );
}
