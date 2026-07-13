import React from 'react';
import { Clock, Play } from 'lucide-react';
import PlayerPortrait from './PlayerPortrait.jsx';
import { computeMatchStatus } from '../utils/matchStatus.js';

export default function ActiveMatchCard({
  activeMatch,
  liveDemoActive,
  openHighlights
}) {
  const status = computeMatchStatus(activeMatch);

  return (
    <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 flex">
        <div className="h-full flex-1" style={{ background: activeMatch.teamAColors.primary }}></div>
        <div className="h-full flex-1" style={{ background: activeMatch.teamBColors.primary }}></div>
      </div>

      <div className="flex justify-between items-center text-xs border-b border-zinc-100 dark:border-zinc-900 pb-3">
        <div className="flex items-center gap-2 font-bold text-zinc-650 dark:text-zinc-400">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>Status: <span className={status === 'LIVE' ? 'text-red-500 animate-pulse font-black' : 'text-zinc-550'}>{status}</span></span>
          {status === 'LIVE' && <span>• {activeMatch.minute}</span>}
        </div>
        {liveDemoActive && (
          <span className="text-[9px] bg-red-100 dark:bg-red-955/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
            DEMO SIMULATION ACTIVE
          </span>
        )}
        <span className="text-[10px] text-zinc-450 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 rounded font-bold uppercase">
          {activeMatch.stadium}
        </span>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex-1 flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold shadow-md border-2 border-white/10" style={{ background: activeMatch.teamAColors.primary }}>
            {activeMatch.teamAFlag}
          </div>
          <h3 className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white">
            {activeMatch.teamA}
          </h3>
        </div>

        <div className="px-6 text-center">
          {status !== 'UPCOMING' ? (
            <div className="font-mono text-4xl font-black px-6 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800 tracking-wider flex items-center gap-2">
              <span className="text-zinc-900 dark:text-white">{activeMatch.scoreA}</span>
              <span className="opacity-40 text-2xl">:</span>
              <span className="text-zinc-900 dark:text-white">{activeMatch.scoreB}</span>
            </div>
          ) : (
            <span className="text-sm font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-500 px-3 py-1 rounded-lg">UPCOMING</span>
          )}
          <span className="text-[10px] block mt-2 text-zinc-400 font-semibold">{activeMatch.time}</span>
        </div>

        <div className="flex-1 flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold shadow-md border-2 border-white/10" style={{ background: activeMatch.teamBColors.primary }}>
            {activeMatch.teamBFlag}
          </div>
          <h3 className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white">
            {activeMatch.teamB}
          </h3>
        </div>
      </div>

      {/* Star Player Portraits */}
      {activeMatch.bestPlayerDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
          <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center gap-3">
            <PlayerPortrait 
              name={activeMatch.bestPlayerDetails.name} 
              jerseyColor={activeMatch.teamAColors.primary} 
              number={activeMatch.bestPlayerDetails.number} 
              flag={activeMatch.teamAFlag} 
              photoUrl={activeMatch.bestPlayerDetails.photoUrl} 
            />
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-bold">{activeMatch.teamA} Key Player</p>
              <h4 className="font-black text-zinc-800 dark:text-zinc-100 text-xs">{activeMatch.bestPlayerDetails.name}</h4>
              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{activeMatch.bestPlayerDetails.stats}</p>
            </div>
          </div>

          {activeMatch.opponentBestPlayerDetails && (
            <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center gap-3">
              <PlayerPortrait 
                name={activeMatch.opponentBestPlayerDetails.name} 
                jerseyColor={activeMatch.teamBColors.primary} 
                number={activeMatch.opponentBestPlayerDetails.number} 
                flag={activeMatch.teamBFlag} 
                photoUrl={activeMatch.opponentBestPlayerDetails.photoUrl} 
              />
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">{activeMatch.teamB} Key Player</p>
                <h4 className="font-black text-zinc-800 dark:text-zinc-100 text-xs">{activeMatch.opponentBestPlayerDetails.name}</h4>
                <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{activeMatch.opponentBestPlayerDetails.stats}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'COMPLETED' && (
        <button
          onClick={() => openHighlights(activeMatch)}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Watch Concluded Match Highlights & Goals</span>
        </button>
      )}
    </div>
  );
}
