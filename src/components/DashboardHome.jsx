import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import ReactECharts from 'echarts-for-react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle,
  Compass,
  Award,
  Users,
  Leaf,
  Bus,
  Shield,
  Activity,
  ChevronRight,
  TrendingUp,
  MapPin,
  HelpCircle,
  Wrench,
  AlertCircle,
  Trophy,
  Tv
} from 'lucide-react';

// Golden World Cup Trophy Vector SVG
function WorldCupTrophy() {
  return (
    <svg viewBox="0 0 100 150" className="w-12 h-18 sm:w-16 sm:h-24 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.7)] shrink-0 animate-pulse">
      {/* Gold base */}
      <path d="M 33 130 L 67 130 L 62 145 L 38 145 Z" fill="#78350f" />
      <rect x="35" y="112" width="30" height="18" fill="#d97706" rx="1.5" />
      <rect x="35" y="117" width="30" height="3" fill="#047857" />
      <rect x="35" y="123" width="30" height="3" fill="#047857" />
      {/* Gold stem */}
      <path d="M 40 112 L 44 75 L 56 75 L 60 112 Z" fill="#f59e0b" />
      <path d="M 44 75 Q 50 105 56 75" fill="#fbbf24" />
      {/* Human figures holding globe */}
      <path d="M 38 92 C 38 72, 44 68, 50 82 C 56 68, 62 72, 62 92 Z" fill="#fbbf24" />
      {/* Globe */}
      <circle cx="50" cy="46" r="20" fill="#fbbf24" />
      {/* Continent outlines */}
      <path d="M 36 42 Q 42 34 47 42 M 54 38 Q 62 46 54 52 M 40 50 Q 48 57 52 49" stroke="#d97706" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

// Spectacular Head-to-Head Hero Match Visualizer Card (Replicates user's design layout)
function MatchHeroVisualizer({ match, onToggleLive, liveActive }) {
  const [leftImgError, setLeftImgError] = useState(false);
  const [rightImgError, setRightImgError] = useState(false);

  const teamA = match.teamA;
  const teamB = match.teamB;
  const starA = match.bestPlayerDetails;
  const starB = match.opponentBestPlayerDetails;

  const stageText = match.minute.includes("QF") ? "GRAND" : "ROUND OF 16";
  const stageSuffix = match.minute.includes("QF") ? "FINAL" : "MATCH";

  useEffect(() => {
    setLeftImgError(false);
    setRightImgError(false);
  }, [match.id]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-800 bg-[#060608] shadow-2xl h-[380px] sm:h-[450px] flex flex-col justify-between p-6 sm:p-8 transition-all duration-500">
      
      {/* Note: Match hero keyframe animations are defined in index.css (floatSpark, slideInLeftHero, slideInRightHero, pulseGlowVS) */}


      {/* Dynamic split smoke gradients (rivalry backgrounds) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex">
        <div className="w-1/2 h-full opacity-65" style={{ background: `radial-gradient(circle at 10% 50%, ${match.teamAColors.primary}, transparent 75%)` }}></div>
        <div className="w-1/2 h-full opacity-65" style={{ background: `radial-gradient(circle at 90% 50%, ${match.teamBColors.primary}, transparent 75%)` }}></div>
      </div>
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-t from-[#060608] via-transparent to-black/75"></div>

      {/* Angled Glowing Electric Laser Divider (fierce rivalry look) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent shadow-[0_0_20px_#d946ef] transform -rotate-[15deg] z-0 pointer-events-none opacity-50" />

      {/* Floating Spark/Embers particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-[2.5px] h-[2.5px] rounded-full"
            style={{
              left: `${15 + (i * 5.8)}%`,
              bottom: '-20px',
              backgroundColor: i % 2 === 0 ? '#fb923c' : '#ef4444',
              opacity: 0.8,
              animation: `floatSpark ${4 + (i % 3) * 1.5}s linear infinite`,
              animationDelay: `${i * 0.4}s`,
              boxShadow: i % 2 === 0 ? '0 0 6px #f97316, 0 0 10px #f97316' : '0 0 6px #dc2626, 0 0 10px #dc2626'
            }}
          />
        ))}
      </div>

      {/* "CLASH OF TITANS" Glowing Rivalry Badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <span className="text-[9px] sm:text-[10px] font-black tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-fuchsia-400 to-blue-400 bg-black/75 px-4 py-1.5 rounded-full border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.25)] uppercase">
          CLASH OF TITANS
        </span>
      </div>

      {/* Main split: Star Player A vs Star Player B flanking the Trophy */}
      <div className="relative z-10 grid grid-cols-3 h-full items-center">
        
        {/* Left Side: Team A Star Player half-body cutout */}
        <div className="relative h-full flex flex-col justify-end items-center pb-6">
          <div className="absolute inset-0 flex items-center justify-center bottom-12">
            <div className="relative w-28 h-40 sm:w-40 sm:h-56 md:w-48 md:h-64 flex items-end justify-center overflow-hidden">
              {leftImgError || !starA || !starA.photoUrl ? (
                /* Fallback SVG */
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-lg text-4xl">
                  👤
                </div>
              ) : (
                <div className="relative w-full h-full flex items-end justify-center">
                  <img 
                    src={starA.photoUrl} 
                    onError={() => setLeftImgError(true)} 
                    alt={starA.name} 
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain object-bottom transform hover:scale-105 transition-all duration-500"
                    style={{
                      animation: 'slideInLeftHero 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      filter: `drop-shadow(0 0 15px ${match.teamAColors.primary}bb) drop-shadow(0 0 35px ${match.teamAColors.primary}44) brightness(1.05) contrast(1.1) saturate(1.15)`,
                      maskImage: 'linear-gradient(to top, transparent 8%, black 35%)',
                      WebkitMaskImage: 'linear-gradient(to top, transparent 8%, black 35%)'
                    }}
                  />
                  {/* Blending Gradient Overlay - tints the bottom half with team color */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none select-none" 
                    style={{
                      background: `linear-gradient(to top, ${match.teamAColors.primary}50, transparent)`,
                      maskImage: 'linear-gradient(to top, transparent 8%, black 35%)',
                      WebkitMaskImage: 'linear-gradient(to top, transparent 8%, black 35%)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="relative z-20 border-2 border-fuchsia-500 shadow-[0_0_12px_#d946ef] bg-black text-white font-black uppercase text-center px-4 py-2 w-full max-w-[140px] sm:max-w-[180px] rounded-sm transform -skew-x-6">
            <span className="block text-xs sm:text-sm tracking-wider">{teamA}</span>
            <span className="block text-[8px] sm:text-[9px] text-zinc-400 font-bold tracking-tight normal-case italic mt-0.5">{starA?.name}</span>
          </div>
        </div>

        {/* Center: Trophy, Stage Lines, VS, Flags */}
        <div className="h-full flex flex-col justify-between items-center py-4">
          
          {/* Neon stage title with flanking lines */}
          <div className="flex items-center justify-center gap-2 w-full mt-10">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-fuchsia-500"></div>
            <span className="text-[9px] sm:text-[10px] font-black text-white tracking-widest uppercase flex items-center gap-1 whitespace-nowrap">
              <span className="text-fuchsia-400">{stageText}</span>
              <span className="text-zinc-200">{stageSuffix}</span>
            </span>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-fuchsia-500"></div>
          </div>

          {/* Central World Cup Trophy */}
          <div className="my-auto flex flex-col items-center">
            <div className="relative transform hover:scale-110 transition-transform duration-300">
              <WorldCupTrophy />
              {/* Pulsating background aura for the trophy */}
              <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full -z-10" />
            </div>
            
            {/* Rounded flags with central VS */}
            <div className="flex items-center gap-4 mt-5 bg-black/75 px-5 py-2 rounded-full border border-fuchsia-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(217,70,239,0.2)]">
              <span className="text-2xl sm:text-3xl shadow-sm leading-none transform hover:rotate-12 transition-transform duration-300 select-none">{match.teamAFlag}</span>
              <span 
                className="text-base sm:text-lg font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-fuchsia-500 tracking-wider font-mono select-none"
                style={{ animation: 'pulseGlowVS 2s ease-in-out infinite' }}
              >
                VS
              </span>
              <span className="text-2xl sm:text-3xl shadow-sm leading-none transform hover:-rotate-12 transition-transform duration-300 select-none">{match.teamBFlag}</span>
            </div>
          </div>

          {/* Bottom text: FIFA World Cup 2026 */}
          <div className="text-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
              FIFA WORLD CUP 2026
            </span>
            <span className="text-[8px] sm:text-[9px] text-zinc-500 block font-mono mt-0.5">
              {match.stadium}
            </span>
          </div>

        </div>

        {/* Right Side: Team B Star Player half-body cutout */}
        <div className="relative h-full flex flex-col justify-end items-center pb-6">
          <div className="absolute inset-0 flex items-center justify-center bottom-12">
            <div className="relative w-28 h-40 sm:w-40 sm:h-56 md:w-48 md:h-64 flex items-end justify-center overflow-hidden">
              {rightImgError || !starB || !starB.photoUrl ? (
                /* Fallback SVG */
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-lg text-4xl">
                  👤
                </div>
              ) : (
                <div className="relative w-full h-full flex items-end justify-center">
                  <img 
                    src={starB.photoUrl} 
                    onError={() => setRightImgError(true)} 
                    alt={starB.name} 
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain object-bottom transform hover:scale-105 transition-all duration-500"
                    style={{
                      animation: 'slideInRightHero 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                      filter: `drop-shadow(0 0 15px ${match.teamBColors.primary}bb) drop-shadow(0 0 35px ${match.teamBColors.primary}44) brightness(1.05) contrast(1.1) saturate(1.15)`,
                      maskImage: 'linear-gradient(to top, transparent 8%, black 35%)',
                      WebkitMaskImage: 'linear-gradient(to top, transparent 8%, black 35%)'
                    }}
                  />
                  {/* Blending Gradient Overlay - tints the bottom half with team color */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none select-none" 
                    style={{
                      background: `linear-gradient(to top, ${match.teamBColors.primary}50, transparent)`,
                      maskImage: 'linear-gradient(to top, transparent 8%, black 35%)',
                      WebkitMaskImage: 'linear-gradient(to top, transparent 8%, black 35%)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="relative z-20 border-2 border-fuchsia-500 shadow-[0_0_12px_#d946ef] bg-black text-white font-black uppercase text-center px-4 py-2 w-full max-w-[140px] sm:max-w-[180px] rounded-sm transform skew-x-6">
            <span className="block text-xs sm:text-sm tracking-wider">{teamB}</span>
            <span className="block text-[8px] sm:text-[9px] text-zinc-400 font-bold tracking-tight normal-case italic mt-0.5">{starB?.name}</span>
          </div>
        </div>

      </div>

      {/* Bottom score and countdown details */}
      <div className="relative z-20 border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="text-center sm:text-left">
          <p className="text-zinc-550 font-medium">Kickoff timing:</p>
          <strong className="text-zinc-300 font-bold">{match.date} • {match.time} (IST)</strong>
        </div>

        {match.status !== 'UPCOMING' ? (
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-xl text-center">
            <span className="text-[9px] text-zinc-455 block uppercase font-bold">Match Score</span>
            <span className="font-mono text-base font-black text-white tracking-widest">{match.scoreA} : {match.scoreB}</span>
          </div>
        ) : (
          <span className="text-[10px] bg-emerald-950/30 border border-emerald-500/20 text-emerald-450 px-3 py-1.5 rounded-lg font-black uppercase tracking-wider">
            UPCOMING MATCH
          </span>
        )}

        <button 
          onClick={onToggleLive}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            liveActive
              ? 'bg-red-955/40 border-red-500/40 text-red-405'
              : 'bg-emerald-955/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{liveActive ? 'Stop Live Update Sim' : 'Simulate Match Live'}</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { 
    complaints, 
    userProfile, 
    setActiveTab, 
    theme,
    addEcoPoints,
    matchesList,
    selectedMatchId,
    setSelectedMatchId,
    activeMatch,
    liveDemoActive,
    setLiveDemoActive,
    t 
  } = useApp();

  const [simulatedVolunteerCheckin, setSimulatedVolunteerCheckin] = useState(false);
  const [volTasksCompleted, setVolTasksCompleted] = useState({
    ticketScan: false,
    wheelchairGuide: false,
    recycleCups: false
  });

  // Calculate statistics
  const totalIssues = complaints.length;
  const resolvedIssues = complaints.filter(c => c.status === 'Resolved').length;
  const inProgressIssues = complaints.filter(c => c.status === 'In Progress').length;
  const underReviewIssues = complaints.filter(c => c.status === 'In Triage' || c.status === 'Submitted').length;

  // ECharts Configurations for Organizer Dashboard
  const getGateFlowOption = () => ({
    title: {
      text: 'Gate Flow Rates (Fans / min)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme === 'dark' ? '#1e1e24' : '#e4e4e7' } },
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    yAxis: {
      type: 'category',
      data: ['Gate 5', 'Gate 4', 'Gate 3 (Issue)', 'Gate 2', 'Gate 1'],
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    series: [
      {
        name: 'Inflow',
        type: 'bar',
        data: [120, 140, 45, 110, 130],
        itemStyle: {
          color: (params) => {
            return params.dataIndex === 2 ? '#ef4444' : '#10b981';
          },
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  });

  const getZoneDensityOption = () => ({
    title: {
      text: 'Zone Crowd Density (%)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Density',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: theme === 'dark' ? '#0c0c0f' : '#ffffff',
          borderWidth: 2
        },
        label: { show: true, color: theme === 'dark' ? '#a1a1aa' : '#71717a' },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        data: [
          { value: 85, name: 'Concourse A (High)' },
          { value: 65, name: 'Concourse B (Med)' },
          { value: 40, name: 'Concourse C (Low)' },
          { value: 92, name: 'Concourse D (Critical)' }
        ],
        color: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']
      }
    ]
  });

  const getSustainabilityOption = () => ({
    title: {
      text: 'Sustainability Index (Tons Saved)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Recycled Plastic', 'Composted Food', 'Water Saved', 'Carbon offset'],
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a', rotate: 15 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme === 'dark' ? '#1e1e24' : '#e4e4e7' } },
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    series: [
      {
        name: 'Tons',
        type: 'bar',
        data: [12.4, 8.2, 15.6, 5.1],
        itemStyle: { color: '#059669', borderRadius: [4, 4, 0, 0] }
      }
    ]
  });

  const getTransitOption = () => ({
    title: {
      text: 'Transit Queue Wait Times (mins)',
      left: 'center',
      textStyle: { color: theme === 'dark' ? '#fafafa' : '#09090b', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Rideshare Zone', 'Metro Link', 'North Shuttle', 'South Shuttle'],
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme === 'dark' ? '#1e1e24' : '#e4e4e7' } },
      axisLabel: { color: theme === 'dark' ? '#a1a1aa' : '#71717a' }
    },
    series: [
      {
        name: 'Wait Time (Min)',
        type: 'line',
        data: [15, 25, 8, 35],
        smooth: true,
        lineStyle: { width: 3, color: '#3b82f6' },
        itemStyle: { color: '#1d4ed8' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        }
      }
    ]
  });

  const handleVolunteerCheckin = () => {
    setSimulatedVolunteerCheckin(!simulatedVolunteerCheckin);
  };

  const toggleVolTask = (taskKey) => {
    setVolTasksCompleted(prev => {
      const updated = { ...prev, [taskKey]: !prev[taskKey] };
      if (updated[taskKey]) {
        addEcoPoints(25);
      }
      return updated;
    });
  };

  // 1. FAN DASHBOARD VIEW
  const renderFanDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none" style={{ background: activeMatch.teamAColors.primary }}></div>
        <div className="absolute left-1/3 bottom-0 w-24 h-24 opacity-10 rounded-full blur-xl pointer-events-none" style={{ background: activeMatch.teamBColors.primary }}></div>
        
        <div className="space-y-1">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-955/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
            FIFA Fans Portal
          </span>
          <h2 className="text-xl font-extrabold tracking-tight mt-2">
            Welcome to the Pitch, {userProfile.name}! ⚽
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Get instant stadium navigation, transit timings, sustainability rewards, and multi-lingual help from the <strong className="text-emerald-600 dark:text-emerald-450 font-semibold">{t('navCompanion')}</strong>.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('companion')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors w-fit shadow-sm z-10"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Ask AI Assistant</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Match Day Theme Selector */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm space-y-2">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Select Active Match Day Theme</span>
        <div className="flex flex-wrap gap-2">
          {matchesList.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMatchId(m.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-2 transition-all ${
                selectedMatchId === m.id
                  ? 'bg-zinc-150 border-zinc-350 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white ring-1 ring-emerald-500'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400'
              }`}
            >
              <span>{m.teamAFlag} vs {m.teamBFlag}</span>
              <span className="opacity-75">({m.teamA} v {m.teamB})</span>
              {m.status === 'LIVE' && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column - Spectacular Hero Match Card & Seat guidance */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* MatchHeroVisualizer - Replicates user's requested layout */}
          <MatchHeroVisualizer 
            match={activeMatch} 
            liveActive={liveDemoActive} 
            onToggleLive={() => setLiveDemoActive(!liveDemoActive)} 
          />

          {/* Seat Locator Guide */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Smart Seat Locator & Navigation Guidance</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 font-semibold uppercase">Your Ticket Assignment</p>
                  <h4 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{userProfile.seatNumber}</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Access Level: <strong>{userProfile.ticketCategory}</strong>. Fast-track ingress through <strong>Gate C</strong>.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('services')}
                  className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline w-fit"
                >
                  <span>View Concourse Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-40 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50/20 dark:bg-zinc-900/5 relative overflow-hidden">
                <div className="w-28 h-28 rounded-full border-[8px] border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
                  <div className="w-16 h-10 bg-emerald-600/10 dark:bg-emerald-400/5 border border-emerald-500/20 rounded flex flex-col items-center justify-center">
                    <span className="text-[8px] font-bold text-zinc-450 uppercase leading-none">Pitch</span>
                    <span className="text-[10px] font-black text-emerald-500">FIELD</span>
                  </div>
                  <div className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0c0c0f] animate-ping"></div>
                  <div className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0c0c0f]"></div>
                  <span className="absolute -top-1.5 text-[8px] bg-emerald-500 text-white font-bold px-1.5 rounded-full">Sec 104</span>
                </div>
                <span className="absolute bottom-2 left-2 text-[9px] text-zinc-400">Gate C Entrance Direction</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right column - sustainability hub & transit status */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>Fan Eco-Points Hub</span>
              </h3>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">Green Fan</span>
            </div>

            <div className="text-center py-2 space-y-1">
              <Award className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-[10px] text-zinc-400 font-medium">Current Eco Points Balance</p>
              <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{userProfile.ecoPoints || 0} pts</h4>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between font-medium">
                <span>Free Beverage Reward</span>
                <span className="text-zinc-500">350 / 400 pts</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '87.5%' }}></div>
              </div>
              <p className="text-[9px] text-zinc-450 mt-1">Dispose of your cup at a Smart Bin to earn +50 pts and unlock this reward!</p>
            </div>

            <button 
              onClick={() => setActiveTab('services')}
              className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold transition-colors text-center block text-zinc-700 dark:text-zinc-300"
            >
              Learn Recycling & Eco-Points Rules
            </button>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <Bus className="w-4 h-4 text-blue-500" />
              <span>Real-Time Transit Board</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100/50 dark:border-zinc-800/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold">Metro Link (Express)</span>
                </div>
                <span className="text-zinc-500 font-medium">Running on Time</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100/50 dark:border-zinc-800/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="font-bold">North Park-and-Ride Shuttle</span>
                </div>
                <span className="text-amber-500 font-bold">10m Wait Delay</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100/50 dark:border-zinc-800/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold">Ridesharing Pickup Hub</span>
                </div>
                <span className="text-zinc-500 font-medium">12m Queue Wait</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('services')}
              className="w-full text-center text-xs font-semibold text-blue-500 hover:underline flex items-center justify-center gap-1"
            >
              <span>Explore Shuttle Schedules</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  // 2. VOLUNTEER DASHBOARD VIEW
  const renderVolunteerDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none" style={{ background: '#10b981' }}></div>
        <div className="space-y-1">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-805 dark:bg-emerald-955/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Volunteer Duty Node
          </span>
          <h2 className="text-xl font-extrabold tracking-tight mt-2">
            Welcome to Shift, {userProfile.name}! 👋
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            You are logged in as a Volunteer. Help fans with ticket validation, accessibility directions, and coordinate with supervisors directly.
          </p>
        </div>
        <button 
          onClick={handleVolunteerCheckin}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            simulatedVolunteerCheckin 
              ? 'bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-955/30 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900/30' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent'
          }`}
        >
          {simulatedVolunteerCheckin ? "Check-out of Shift" : "Check-in to Duty Shift"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Today's Shift Assignment</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-155 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10">
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">Duty Details</p>
                <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-100 mt-1">Gate 3 Access Control & Queue Support</h4>
                <p className="text-xs text-zinc-500 mt-2">
                  Assist stewards in managing ticket scanner queues. Ensure wheelchair-accessible fans are directed to Ramp 3B.
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-zinc-650 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>Shift B (12:00 - 18:00)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-155 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-3">
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">Shift Task Checklist</p>
                
                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={volTasksCompleted.ticketScan} 
                    onChange={() => toggleVolTask('ticketScan')} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 rounded" 
                  />
                  <span className={volTasksCompleted.ticketScan ? 'line-through text-zinc-400' : ''}>Help scan 50 tickets at Turnstiles (+25 pts)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={volTasksCompleted.wheelchairGuide} 
                    onChange={() => toggleVolTask('wheelchairGuide')} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 rounded" 
                  />
                  <span className={volTasksCompleted.wheelchairGuide ? 'line-through text-zinc-400' : ''}>Escort accessibility fan to Section 105 (+25 pts)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={volTasksCompleted.recycleCups} 
                    onChange={() => toggleVolTask('recycleCups')} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 rounded" 
                  />
                  <span className={volTasksCompleted.recycleCups ? 'line-through text-zinc-400' : ''}>Distribute eco-cups at Section 102 (+25 pts)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Operations Broadcast Channel</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-350">
                <div className="flex justify-between items-center font-bold mb-1">
                  <span>URGENT: TURNSTILE OUTAGE GATE 3</span>
                  <span>10 mins ago</span>
                </div>
                <p>Gate 3 Ticket Scanner Turnstile #4 is offline. Scanner queues are building. Nearby volunteers at Sectors 1-3 please move to Gate 3 to assist stewards with crowd dispersal.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col h-full">
          <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Duty Supervisor Radio</span>
          </h3>

          <div className="flex-1 max-h-60 overflow-y-auto space-y-3 px-1 py-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-850/80 text-zinc-800 dark:text-zinc-300 w-4/5">
              <p className="font-bold text-[10px] text-zinc-450">Supervisor Sarah</p>
              <p className="mt-0.5">Volunteers at Gate 3, Turnstile #4 is currently being fixed by engineering. Stewards are moving to handheld ticket scanners. Please guide fans to the rightmost lanes.</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Radio supervisor..." 
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Send</button>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. VENUE STAFF DASHBOARD VIEW
  const renderVenueStaffDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none" style={{ background: '#3b82f6' }}></div>
        <div className="space-y-1">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-955/20 dark:text-blue-400 border border-blue-200 dark:border-blue-850">
            Operations Venue Staff
          </span>
          <h2 className="text-xl font-extrabold tracking-tight mt-2">
            MetLife Operations Hub, {userProfile.name}! 🔧
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Review active maintenance reports, monitor emergency protocols, and report facilities/safety issues directly.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('complaints')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors w-fit shadow-sm z-10"
        >
          <Wrench className="w-4 h-4" />
          <span>Go to Incident Desk</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-455 uppercase font-semibold">Triage Queue</span>
              <p className="text-2xl font-black text-amber-500">{underReviewIssues}</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-455 uppercase font-semibold">Active Dispatch</span>
              <p className="text-2xl font-black text-blue-500">{inProgressIssues}</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-[10px] text-zinc-455 uppercase font-semibold">Closed Tickets</span>
              <p className="text-2xl font-black text-emerald-500">{resolvedIssues}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Concourse Facility Inspections</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-850 dark:text-zinc-100">Section 104 - Concourse Restroom Inspection</h4>
                  <p className="text-[10px] text-zinc-455 mt-0.5">Status: Verified clean & supplies stocked by Staff #14</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-955/20 dark:text-emerald-400 font-bold uppercase">Passed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Emergency Protocols Channel</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl text-red-850 dark:text-red-400">
              <h4 className="font-bold uppercase mb-1">Gate 3 High Traffic warning</h4>
              <p className="leading-relaxed">Crowd density at Gate 3 access has triggered a level 2 crowd bottleneck alarm. Deploy crowd control team with barriers to split lanes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 4. ORGANIZER COMMAND DASHBOARD VIEW
  const renderOrganizerDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-455 dark:text-zinc-400">Triage Queue Issues</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-500">{underReviewIssues}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-955/20 text-amber-800 dark:text-amber-400 font-bold">Needs Dispatch</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-455 dark:text-zinc-400">Active Responses</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-500">{inProgressIssues}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-955/20 text-blue-850 dark:text-blue-400 font-bold">On-Site</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-455 dark:text-zinc-400">Resolved Incidents</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-500">{resolvedIssues}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-955/20 text-emerald-805 dark:text-emerald-400 font-bold">Resolved</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-455 dark:text-zinc-400">Total Stadium Density</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-850 dark:text-zinc-100">76%</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-955/20 text-emerald-805 dark:text-emerald-400 font-bold">Optimal</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={getGateFlowOption()} style={{ height: '300px' }} />
        </div>
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={getZoneDensityOption()} style={{ height: '300px' }} />
        </div>
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={getSustainabilityOption()} style={{ height: '300px' }} />
        </div>
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={getTransitOption()} style={{ height: '300px' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {(userProfile.role === 'Fan' || userProfile.role === 'Fan (Guest)') && renderFanDashboard()}
      {userProfile.role === 'Volunteer' && renderVolunteerDashboard()}
      {userProfile.role === 'Venue Staff' && renderVenueStaffDashboard()}
      {userProfile.role === 'Organizer' && renderOrganizerDashboard()}
    </div>
  );
}
