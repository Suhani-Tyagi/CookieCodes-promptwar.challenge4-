import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Eye } from 'lucide-react';
import WayfindingTab from './WayfindingTab.jsx';
import VenueGuidesTab from './VenueGuidesTab.jsx';

export default function ServiceDirectory() {
  const { language, setLanguage, t } = useApp();
  
  // Tab/Mode Selector: 'wayfinding' or 'guides'
  const [activeMode, setActiveMode] = useState('wayfinding');
  
  // High Visibility Toggle
  const [highVisibility, setHighVisibility] = useState(false);

  return (
    <div className={`space-y-6 ${highVisibility ? 'text-black bg-white dark:bg-zinc-100 p-2 rounded-2xl border-4 border-yellow-450 font-sans' : ''}`}>
      
      {/* STADIUM MATE BRAND HEADER BAR */}
      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-[#064e3b] text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl border border-white/20 select-none animate-pulse">
            ⚽
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              ArenaAssist
              <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                A11y
              </span>
            </h2>
            <p className="text-xs text-emerald-200">
              Accessible wayfinding for FIFA World Cup 2026
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <span className="opacity-80 select-none text-white">Language:</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)} 
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer font-bold font-sans"
              id="wayfinding-locale"
              aria-label="Select Wayfinding Language"
            >
              <option value="en" className="text-black">English</option>
              <option value="es" className="text-black">Español</option>
              <option value="fr" className="text-black">Français</option>
              <option value="pt" className="text-black">Português</option>
              <option value="ar" className="text-black">العربية</option>
              <option value="hi" className="text-black">हिंदी</option>
            </select>
          </div>

          <button
            onClick={() => setHighVisibility(!highVisibility)}
            className={`px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 border ${
              highVisibility
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_10px_#facc15]'
                : 'bg-emerald-950/40 border-white/10 hover:bg-emerald-900/40 text-white'
            }`}
            aria-pressed={highVisibility}
          >
            <Eye className="w-4 h-4" />
            <span>High-visibility / screen-reader mode</span>
          </button>
        </div>
      </div>

      {/* SUBTAB ROUTING MODE SELECTOR */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-px">
        <button
          onClick={() => setActiveMode('wayfinding')}
          className={`px-5 py-2.5 text-xs font-black tracking-wider uppercase border-b-2 transition-colors ${
            activeMode === 'wayfinding'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          🗺️ Wayfinding Assistant
        </button>
        <button
          onClick={() => setActiveMode('guides')}
          className={`px-5 py-2.5 text-xs font-black tracking-wider uppercase border-b-2 transition-colors ${
            activeMode === 'guides'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          📚 Operational Guides
        </button>
      </div>

      {/* RENDER MODES */}
      {activeMode === 'wayfinding' && <WayfindingTab highVisibility={highVisibility} />}
      {activeMode === 'guides' && <VenueGuidesTab />}

    </div>
  );
}
