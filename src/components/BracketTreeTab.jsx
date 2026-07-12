import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';

export default function BracketTreeTab() {
  // --- AI Match Scheduler States & Solver Logic ---
  const [schedulerStartDate, setSchedulerStartDate] = useState('2026-07-10');
  const [minRestDays, setMinRestDays] = useState(3);
  const [qfDates, setQfDates] = useState(['2026-07-10', '2026-07-11', '2026-07-12', '2026-07-13']);
  const [sfDates, setSfDates] = useState(['2026-07-15', '2026-07-17']);
  const [finalDate, setFinalDate] = useState('2026-07-21');
  const [schedulerAnnouncement, setSchedulerAnnouncement] = useState('');

  const [simulationTeams, setSimulationTeams] = useState([
    { id: 'T1', name: 'France', flag: '🇫🇷' },
    { id: 'T2', name: 'Morocco', flag: '🇲🇦' },
    { id: 'T3', name: 'Spain', flag: '🇪🇸' },
    { id: 'T4', name: 'Belgium', flag: '🇧🇪' },
    { id: 'T5', name: 'Argentina', flag: '🇦🇷' },
    { id: 'T6', name: 'Brazil', flag: '🇧🇷' },
    { id: 'T7', name: 'USA', flag: '🇺🇸' },
    { id: 'T8', name: 'Germany', flag: '🇩🇪' }
  ]);

  const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const getDaysDiff = (d1Str, d2Str) => {
    if (!d1Str || !d2Str) return 0;
    const d1 = new Date(d1Str);
    const d2 = new Date(d2Str);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Derived Rest Day calculations
  const sf1RestDays = Math.min(
    getDaysDiff(sfDates[0], qfDates[0]) - 1,
    getDaysDiff(sfDates[0], qfDates[1]) - 1
  );

  const sf2RestDays = Math.min(
    getDaysDiff(sfDates[1], qfDates[2]) - 1,
    getDaysDiff(sfDates[1], qfDates[3]) - 1
  );

  const finalRestDays = Math.min(
    getDaysDiff(finalDate, sfDates[0]) - 1,
    getDaysDiff(finalDate, sfDates[1]) - 1
  );

  const hasConflicts = sf1RestDays < minRestDays || sf2RestDays < minRestDays || finalRestDays < minRestDays;

  const autoResolveConflicts = () => {
    const minSf1Date = addDays(qfDates[1], minRestDays + 1);
    const minSf2Date = addDays(qfDates[3], minRestDays + 1);
    const minFinalDate = addDays(minSf2Date, minRestDays + 1);

    setSfDates([minSf1Date, minSf2Date]);
    setFinalDate(minFinalDate);

    const announcement = `AI Scheduler has successfully resolved all rest-day conflicts. Semi-Final 1 is scheduled on ${minSf1Date}, Semi-Final 2 on ${minSf2Date}, and Final on ${minFinalDate}. All teams have at least ${minRestDays} rest days.`;
    setSchedulerAnnouncement(announcement);
  };

  // Auto-generate default dates on tournament start date change
  useEffect(() => {
    const qf1 = schedulerStartDate;
    const qf2 = addDays(schedulerStartDate, 1);
    const qf3 = addDays(schedulerStartDate, 2);
    const qf4 = addDays(schedulerStartDate, 3);
    
    setQfDates([qf1, qf2, qf3, qf4]);
    setSfDates([addDays(schedulerStartDate, 5), addDays(schedulerStartDate, 7)]);
    setFinalDate(addDays(schedulerStartDate, 11));
  }, [schedulerStartDate]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Accessibility Live Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {schedulerAnnouncement}
      </div>

      {/* AI MATCH SCHEDULER PANEL */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-850 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-150 uppercase tracking-wider">
                AI Match Scheduler & Rest Planner
              </h3>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold">
                Auto-generates conflict-free tournament fixtures while enforcing WCAG-safe recovery rest days.
              </p>
            </div>
          </div>

          {/* Status Pill */}
          <div className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase flex items-center gap-1.5 border ${
            hasConflicts 
              ? 'bg-red-50 dark:bg-red-955/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/50' 
              : 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-455 border-emerald-250 dark:border-emerald-900/50'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasConflicts ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span>{hasConflicts ? 'Rest-Day Conflicts Found' : 'Rest-Day Rules Satisfied'}</span>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          
          {/* Start Date Selector */}
          <div className="space-y-1">
            <label htmlFor="start-date-input" className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">
              Tournament Start Date
            </label>
            <input 
              type="date"
              id="start-date-input"
              value={schedulerStartDate}
              onChange={(e) => setSchedulerStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Min Rest Days Selector */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-455 tracking-wider">
              <label htmlFor="rest-days-range">Min Recovery Gaps</label>
              <span className="font-mono text-emerald-600 dark:text-emerald-450 font-black">{minRestDays} Days</span>
            </div>
            <input 
              type="range"
              id="rest-days-range"
              min="2"
              max="5"
              value={minRestDays}
              onChange={(e) => setMinRestDays(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={autoResolveConflicts}
            disabled={!hasConflicts}
            className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              hasConflicts 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:scale-[1.01]' 
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-450 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed'
            }`}
            aria-label="Run AI Match Scheduler to resolve rest-day gaps automatically"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Resolve Conflicts</span>
          </button>

        </div>

        {/* Rest Gap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Semi-Final 1 Gap */}
          <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
            sf1RestDays < minRestDays 
              ? 'bg-red-500/5 border-red-500/20 text-red-900 dark:text-red-300' 
              : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-850'
          }`}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-455">Semi-Final 1</span>
                <span className="text-[10px] font-mono font-bold bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {sfDates[0]}
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-tight">
                Winner QF 1 vs Winner QF 2
              </p>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-500">Rest Gap:</span>
              <span className={`font-black font-mono ${sf1RestDays < minRestDays ? 'text-red-500' : 'text-emerald-500'}`}>
                {sf1RestDays} Days
              </span>
            </div>
            {sf1RestDays < minRestDays && (
              <div className="mt-2 flex items-center gap-1 text-[9px] text-red-500 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Rest Conflict!</span>
              </div>
            )}
          </div>

          {/* Semi-Final 2 Gap */}
          <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
            sf2RestDays < minRestDays 
              ? 'bg-red-500/5 border-red-500/20 text-red-900 dark:text-red-300' 
              : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-850'
          }`}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-455">Semi-Final 2</span>
                <span className="text-[10px] font-mono font-bold bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {sfDates[1]}
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-tight">
                Winner QF 3 vs Winner QF 4
              </p>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-500">Rest Gap:</span>
              <span className={`font-black font-mono ${sf2RestDays < minRestDays ? 'text-red-500' : 'text-emerald-500'}`}>
                {sf2RestDays} Days
              </span>
            </div>
            {sf2RestDays < minRestDays && (
              <div className="mt-2 flex items-center gap-1 text-[9px] text-red-500 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Rest Conflict!</span>
              </div>
            )}
          </div>

          {/* Final Gap */}
          <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
            finalRestDays < minRestDays 
              ? 'bg-red-500/5 border-red-500/20 text-red-900 dark:text-red-300' 
              : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-850'
          }`}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-455">World Cup Final</span>
                <span className="text-[10px] font-mono font-bold bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {finalDate}
                </span>
              </div>
              <p className="text-[9px] text-zinc-500 leading-tight">
                Winner SF 1 vs Winner SF 2
              </p>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-500">Rest Gap:</span>
              <span className={`font-black font-mono ${finalRestDays < minRestDays ? 'text-red-500' : 'text-emerald-500'}`}>
                {finalRestDays} Days
              </span>
            </div>
            {finalRestDays < minRestDays && (
              <div className="mt-2 flex items-center gap-1 text-[9px] text-red-500 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Rest Conflict!</span>
              </div>
            )}
          </div>

        </div>

        <div className="border-t border-zinc-150 dark:border-zinc-900 pt-3 text-[10px] text-zinc-500 dark:text-zinc-455 font-medium leading-normal">
          🛡️ **Safe Rest Policy Enforcement**: In tournament schedules, athletes need appropriate recovery intervals to prevent injury. Our scheduler enforces a WCAG-safe physical rest rule, flagging gaps below {minRestDays} days and auto-shifting subsequent rounds if requested.
        </div>
      </div>

      {/* VISUAL BRACKET TREE MAP */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
        <div className="min-w-[900px] grid grid-cols-5 gap-6 items-center">
          
          {/* Column 1: Round of 32 Winners */}
          <div className="space-y-4">
            <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest block border-b dark:border-zinc-850 pb-1.5">Round of 32 Winners</span>
            
            <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 text-xs">
              <div className="flex justify-between font-bold text-zinc-855 dark:text-zinc-200"><span>🇫🇷 France</span><span>2</span></div>
              <div className="flex justify-between text-zinc-450"><span>🇸🇳 Senegal</span><span>1</span></div>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 text-xs">
              <div className="flex justify-between font-bold text-zinc-855 dark:text-zinc-200"><span>🇲🇦 Morocco</span><span>2</span></div>
              <div className="flex justify-between text-zinc-450"><span>🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland</span><span>0</span></div>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 text-xs">
              <div className="flex justify-between font-bold text-zinc-855 dark:text-zinc-200"><span>🇪🇸 Spain</span><span>3</span></div>
              <div className="flex justify-between text-zinc-450"><span>🇺🇾 Uruguay</span><span>1</span></div>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 text-xs">
              <div className="flex justify-between font-bold text-zinc-855 dark:text-zinc-200"><span>🇧🇪 Belgium</span><span>2</span></div>
              <div className="flex justify-between text-zinc-450"><span>🇪🇬 Egypt</span><span>0</span></div>
            </div>
          </div>

          {/* Column 2: Round of 16 */}
          <div className="space-y-12">
            <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest block border-b dark:border-zinc-850 pb-1.5">Round of 16 Winners</span>
            
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-805 bg-zinc-50/30 dark:bg-zinc-900/10 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-zinc-800 dark:text-zinc-100"><span>🇫🇷 France</span><span>1</span></div>
              <div className="flex justify-between text-zinc-500"><span>🇵🇾 Paraguay</span><span>0</span></div>
            </div>

            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-805 bg-zinc-50/30 dark:bg-zinc-900/10 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-zinc-800 dark:text-zinc-100"><span>🇲🇦 Morocco</span><span>3</span></div>
              <div className="flex justify-between text-zinc-500"><span>🇨🇦 Canada</span><span>0</span></div>
            </div>
          </div>

          {/* Column 3: Quarter-Finals (Interactive Simulated dates!) */}
          <div className="space-y-16">
            <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest block border-b dark:border-zinc-850 pb-1.5">Quarter-Finals</span>
            
            {/* QF 1 */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 text-xs space-y-2">
              <div className="flex justify-between font-extrabold text-zinc-800 dark:text-zinc-100">
                <span>{simulationTeams[0].flag} {simulationTeams[0].name}</span>
                <span className="opacity-50">--</span>
              </div>
              <div className="flex justify-between font-extrabold text-zinc-800 dark:text-zinc-100">
                <span>{simulationTeams[1].flag} {simulationTeams[1].name}</span>
                <span className="opacity-50">--</span>
              </div>
              <span className="text-[8px] bg-zinc-150 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-black text-zinc-650 dark:text-zinc-350 block w-fit">
                {qfDates[0]}
              </span>
            </div>

            {/* QF 2 */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 text-xs space-y-2">
              <div className="flex justify-between font-extrabold text-zinc-800 dark:text-zinc-100">
                <span>{simulationTeams[2].flag} {simulationTeams[2].name}</span>
                <span className="opacity-50">--</span>
              </div>
              <div className="flex justify-between font-extrabold text-zinc-800 dark:text-zinc-100">
                <span>{simulationTeams[3].flag} {simulationTeams[3].name}</span>
                <span className="opacity-50">--</span>
              </div>
              <span className="text-[8px] bg-zinc-150 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-black text-zinc-650 dark:text-zinc-350 block w-fit">
                {qfDates[1]}
              </span>
            </div>
          </div>

          {/* Column 4: Semi-Finals (With rest days display) */}
          <div className="space-y-20">
            <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest block border-b dark:border-zinc-850 pb-1.5">Semi-Finals</span>
            
            {/* SF 1 */}
            <div className={`p-3 rounded-xl border text-xs space-y-2 ${
              sf1RestDays < minRestDays 
                ? 'border-red-400 bg-red-500/5' 
                : 'border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5'
            }`}>
              <div className="flex justify-between text-zinc-500"><span>Winner QF 1</span><span>--</span></div>
              <div className="flex justify-between text-zinc-500"><span>Winner QF 2</span><span>--</span></div>
              <div className="flex items-center justify-between gap-1 mt-1 border-t border-zinc-150/50 dark:border-zinc-850 pt-1.5">
                <span className="text-[8px] bg-zinc-150 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-black text-zinc-650 dark:text-zinc-350">{sfDates[0]}</span>
                <span className={`text-[8px] font-black ${sf1RestDays < minRestDays ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                  {sf1RestDays}d Rest
                </span>
              </div>
            </div>

            {/* SF 2 */}
            <div className={`p-3 rounded-xl border text-xs space-y-2 ${
              sf2RestDays < minRestDays 
                ? 'border-red-400 bg-red-500/5' 
                : 'border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5'
            }`}>
              <div className="flex justify-between text-zinc-500"><span>Winner QF 3</span><span>--</span></div>
              <div className="flex justify-between text-zinc-500"><span>Winner QF 4</span><span>--</span></div>
              <div className="flex items-center justify-between gap-1 mt-1 border-t border-zinc-150/50 dark:border-zinc-850 pt-1.5">
                <span className="text-[8px] bg-zinc-150 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-black text-zinc-650 dark:text-zinc-350">{sfDates[1]}</span>
                <span className={`text-[8px] font-black ${sf2RestDays < minRestDays ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                  {sf2RestDays}d Rest
                </span>
              </div>
            </div>
          </div>

          {/* Column 5: Grand Final */}
          <div className="space-y-20">
            <span className="text-[9px] font-black text-zinc-450 uppercase tracking-widest block border-b dark:border-zinc-850 pb-1.5">Grand Final</span>
            
            {/* Final */}
            <div className={`p-3 rounded-xl border text-xs space-y-2 ${
              finalRestDays < minRestDays 
                ? 'border-red-400 bg-red-500/5' 
                : 'border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5'
            }`}>
              <div className="flex justify-between text-zinc-500"><span>Winner SF 1</span><span>--</span></div>
              <div className="flex justify-between text-zinc-500"><span>Winner SF 2</span><span>--</span></div>
              <div className="flex items-center justify-between gap-1 mt-1 border-t border-zinc-150/50 dark:border-zinc-850 pt-1.5">
                <span className="text-[8px] bg-zinc-150 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-black text-zinc-650 dark:text-zinc-350">{finalDate}</span>
                <span className={`text-[8px] font-black ${finalRestDays < minRestDays ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                  {finalRestDays}d Rest
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
