import React, { useState, useEffect } from 'react';
import { Tv } from 'lucide-react';

/**
 * WorldCupTrophy component rendering a custom golden SVG trophy.
 * @returns {React.ReactElement} The rendered World Cup Trophy SVG.
 */
export const WorldCupTrophy = React.memo(function WorldCupTrophy() {
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
});

/**
 * MatchHeroVisualizer component to visualize a head-to-head match matchup.
 * @param {object} props The component props.
 * @param {object} props.match The active match object.
 * @param {function} props.onToggleLive Callback to simulate/toggle live status.
 * @param {boolean} props.liveActive Flag indicating whether live simulation is active.
 * @returns {React.ReactElement} The rendered Match Hero Visualizer.
 */
export const MatchHeroVisualizer = React.memo(function MatchHeroVisualizer({ match, onToggleLive, liveActive }) {
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
        <span className="text-xs font-black tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-fuchsia-400 to-blue-400 bg-black/75 px-4 py-1.5 rounded-full border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.25)] uppercase">
          CLASH OF TITANS
        </span>
      </div>

      {/* Main split: Star Player A vs Star Player B flanking the Trophy */}
      <div className="relative z-10 grid grid-cols-3 h-full items-center">
        
        {/* Left Side: Team A Star Player half-body cutout */}
        <div className="relative h-full flex flex-col justify-end items-center pb-6">
          <div className="absolute inset-0 flex items-center justify-center bottom-12">
            <div className="relative w-28 h-40 sm:w-40 sm:h-56 md:w-48 md:h-64 flex items-end justify-center overflow-hidden">
              {leftImgError || !starA || !starA.photoUrl || starA.photoUrl.includes('undefined') || starA.photoUrl.includes('null') || starA.photoUrl.endsWith('/0.png') ? (
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
            <span className="block text-xs text-zinc-400 font-bold tracking-tight normal-case italic mt-0.5">{starA?.name}</span>
          </div>
        </div>

        {/* Center: Trophy, Stage Lines, VS, Flags */}
        <div className="h-full flex flex-col justify-between items-center py-4">
          
          <div className="flex items-center justify-center gap-2 w-full mt-10">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-fuchsia-500"></div>
            <span className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-1 whitespace-nowrap">
              <span className="text-fuchsia-400">{stageText}</span>
              <span className="text-zinc-205">{stageSuffix}</span>
            </span>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-fuchsia-500"></div>
          </div>

          <div className="my-auto flex flex-col items-center">
            <div className="relative transform hover:scale-110 transition-transform duration-300">
              <WorldCupTrophy />
              <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full -z-10" />
            </div>
            
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

          <div className="text-center">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
              FIFA WORLD CUP 2026
            </span>
            <span className="text-xs text-zinc-500 block font-mono mt-0.5">
              {match.stadium}
            </span>
          </div>

        </div>

        {/* Right Side: Team B Star Player half-body cutout */}
        <div className="relative h-full flex flex-col justify-end items-center pb-6">
          <div className="absolute inset-0 flex items-center justify-center bottom-12">
            <div className="relative w-28 h-40 sm:w-40 sm:h-56 md:w-48 md:h-64 flex items-end justify-center overflow-hidden">
              {rightImgError || !starB || !starB.photoUrl || starB.photoUrl.includes('undefined') || starB.photoUrl.includes('null') || starB.photoUrl.endsWith('/0.png') ? (
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
            <span className="block text-xs text-zinc-400 font-bold tracking-tight normal-case italic mt-0.5">{starB?.name}</span>
          </div>
        </div>

      </div>

      {/* Bottom score and countdown details */}
      <div className="relative z-20 border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="text-center sm:text-left">
          <p className="text-zinc-500 font-medium">Kickoff timing:</p>
          <strong className="text-zinc-300 font-bold">{match.date} • {match.time} (IST)</strong>
        </div>

        {match.status !== 'UPCOMING' ? (
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-xl text-center">
            <span className="text-xs text-zinc-400 block uppercase font-bold">Match Score</span>
            <span className="font-mono text-base font-black text-white tracking-widest">{match.scoreA} : {match.scoreB}</span>
          </div>
        ) : (
          <span className="text-xs bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-wider">
            UPCOMING MATCH
          </span>
        )}

        <button 
          onClick={onToggleLive}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            liveActive
              ? 'bg-red-900/40 border-red-500/40 text-red-400'
              : 'bg-emerald-900/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{liveActive ? 'Stop Live Update Sim' : 'Simulate Match Live'}</span>
        </button>
      </div>
    </div>
  );
});
