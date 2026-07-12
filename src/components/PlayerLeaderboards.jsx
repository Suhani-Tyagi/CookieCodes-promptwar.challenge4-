import React, { useState } from 'react';
import { Star } from 'lucide-react';
import PlayerPortrait from './PlayerPortrait.jsx';

export default function PlayerLeaderboards({ topStatsData }) {
  const [statsCategory, setStatsCategory] = useState('goals');

  return (
    <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm animate-fade-in space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-155 dark:border-zinc-850 pb-4">
        <div>
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span>Tournament Top Player Leaderboards</span>
          </h3>
          <p className="text-[11px] text-zinc-455">Select statistics metric to view rankings list.</p>
        </div>
        
        {/* Category selection bar */}
        <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
          {['goals', 'assists', 'cleanSheets', 'discipline'].map((cat) => (
            <button
              key={cat}
              onClick={() => setStatsCategory(cat)}
              className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all capitalize ${
                statsCategory === cat
                  ? 'bg-white dark:bg-zinc-805 text-zinc-950 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              {cat === 'cleanSheets' ? 'Clean Sheets' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats category list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topStatsData[statsCategory]?.map((pl) => (
          <div key={pl.rank} className="flex justify-between items-center p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <PlayerPortrait 
                name={pl.name} 
                jerseyColor={pl.jerseyColor} 
                number={pl.number} 
                flag={pl.country.split(' ')[1]} 
                photoUrl={pl.photoUrl} 
                className="w-10 h-10"
              />
              <div>
                <h4 className="font-extrabold text-zinc-850 dark:text-zinc-105 text-xs">{pl.name}</h4>
                <p className="text-[9px] text-zinc-450 font-semibold">{pl.country} • {pl.subtext}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-emerald-600 dark:text-emerald-400 block text-xs">{pl.value}</span>
              <span className="text-[9px] text-zinc-450 block font-mono">Rank #{pl.rank}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
