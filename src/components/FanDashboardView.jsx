import React from 'react';
import { Sparkles, ChevronRight, Compass, ArrowRight, Leaf, Award, Bus } from 'lucide-react';
import { MatchHeroVisualizer } from './MatchHeroVisualizer.jsx';

/**
 * FanDashboardView component rendering the personalized portal for fans.
 * @param {object} props The component props.
 * @param {object} props.userProfile The fan's profile object.
 * @param {object} props.activeMatch The active match object.
 * @param {Array} props.matchesList List of tournament matches.
 * @param {string} props.selectedMatchId The active selected match ID.
 * @param {function} props.setSelectedMatchId Callback to change selection.
 * @param {boolean} props.liveDemoActive Status flag for active scoring simulation.
 * @param {function} props.setLiveDemoActive Callback to toggle live scoring simulation.
 * @param {function} props.setActiveTab Callback to change primary view tab.
 * @param {function} props.t Translator dictionary helper function.
 * @returns {React.ReactElement} The rendered Fan Dashboard View.
 */
export default function FanDashboardView({
  userProfile,
  activeMatch,
  matchesList,
  selectedMatchId,
  setSelectedMatchId,
  liveDemoActive,
  setLiveDemoActive,
  setActiveTab,
  t
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none" style={{ background: activeMatch.teamAColors.primary }}></div>
        <div className="absolute left-1/3 bottom-0 w-24 h-24 opacity-10 rounded-full blur-xl pointer-events-none" style={{ background: activeMatch.teamBColors.primary }}></div>
        
        <div className="space-y-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-105 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
            FIFA Fans Portal
          </span>
          <h2 className="text-xl font-extrabold tracking-tight mt-2">
            Welcome to the Pitch, {userProfile.name}! ⚽
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Get instant stadium navigation, transit timings, sustainability rewards, and multi-lingual help from the <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('navCompanion')}</strong>.
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
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Select Active Match Day Theme</span>
        <div className="flex flex-wrap gap-2">
          {matchesList.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMatchId(m.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-2 transition-all ${
                selectedMatchId === m.id
                  ? 'bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white ring-1 ring-emerald-500'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400'
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
                  <p className="text-xs text-zinc-400 font-semibold uppercase">Your Ticket Assignment</p>
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
                    <span className="text-xs font-bold text-zinc-400 uppercase leading-none">Pitch</span>
                    <span className="text-xs font-black text-emerald-500">FIELD</span>
                  </div>
                  <div className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0c0c0f] animate-ping"></div>
                  <div className="absolute top-2 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0c0c0f]"></div>
                  <span className="absolute -top-1.5 text-xs bg-emerald-500 text-white font-bold px-1.5 rounded-full">Sec 104</span>
                </div>
                <span className="absolute bottom-2 left-2 text-xs text-zinc-400">Gate C Entrance Direction</span>
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
              <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">Green Fan</span>
            </div>

            <div className="text-center py-2 space-y-1">
              <Award className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-zinc-400 font-medium">Current Eco Points Balance</p>
              <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{userProfile.ecoPoints || 0} pts</h4>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span>Free Beverage Reward</span>
                <span className="text-zinc-500">350 / 400 pts</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '87.5%' }}></div>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Dispose of your cup at a Smart Bin to earn +50 pts and unlock this reward!</p>
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
}
