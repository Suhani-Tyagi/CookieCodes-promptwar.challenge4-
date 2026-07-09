import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  Trophy, 
  Clock, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Award,
  ChevronRight,
  User,
  Zap,
  Activity,
  UserCheck,
  Play,
  Pause,
  Maximize2,
  Volume2,
  X,
  Tv,
  List,
  GitBranch,
  Star,
  Search,
  Filter,
  Sparkles,
  AlertTriangle
} from 'lucide-react';


// Player portrait component featuring real-life photos from Wikimedia and automatic SVG fallback
function PlayerPortrait({ name, jerseyColor, number, flag, photoUrl, className = "w-12 h-12 shrink-0" }) {
  const [hasError, setHasError] = useState(!photoUrl);

  useEffect(() => {
    setHasError(!photoUrl);
  }, [photoUrl]);

  const getFallbackFace = () => {
    switch (name) {
      case "Lionel Messi":
        return { hairColor: "#78350f", hasBeard: true, beardColor: "#78350f", skinTone: "#fed7aa", hairStyle: "messy" };
      case "Kylian Mbappé":
        return { hairColor: "#1e1b4b", hasBeard: false, beardColor: "transparent", skinTone: "#a16207", hairStyle: "buzzcut" };
      case "Hakim Ziyech":
        return { hairColor: "#0f172a", hasBeard: true, beardColor: "#0f172a", skinTone: "#ffedd5", hairStyle: "fade" };
      case "Erling Haaland":
        return { hairColor: "#fef08a", hasBeard: false, beardColor: "transparent", skinTone: "#fee2e2", hairStyle: "manbun" };
      case "Jude Bellingham":
        return { hairColor: "#1e1b4b", hasBeard: false, beardColor: "transparent", skinTone: "#78350f", hairStyle: "flat-top" };
      case "Dani Olmo":
        return { hairColor: "#7c2d12", hasBeard: false, beardColor: "transparent", skinTone: "#ffedd5", hairStyle: "short" };
      case "Kevin De Bruyne":
        return { hairColor: "#fbbf24", hasBeard: false, beardColor: "transparent", skinTone: "#fee2e2", hairStyle: "parted" };
      default:
        return { hairColor: "#4b5563", hasBeard: false, beardColor: "transparent", skinTone: "#f3f4f6", hairStyle: "standard" };
    }
  };

  const face = getFallbackFace();

  return (
    <div className={`${className} rounded-full border-2 border-zinc-250 dark:border-zinc-800 bg-gradient-to-tr from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center relative overflow-hidden shadow-sm shrink-0`}>
      {hasError ? (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="42" y="50" width="16" height="15" fill={face.skinTone} />
          <circle cx="50" cy="38" r="18" fill={face.skinTone} />
          <circle cx="43" cy="35" r="2" fill="#1e293b" />
          <circle cx="57" cy="35" r="2" fill="#1e293b" />
          {face.hasBeard && (
            <path d="M 32 38 Q 50 60 68 38 L 65 48 Q 50 56 35 48 Z" fill={face.beardColor} opacity="0.85" />
          )}
          {face.hairStyle === "messy" && <path d="M 30 30 Q 50 15 70 30 Q 75 18 50 18 Q 25 18 30 30" fill={face.hairColor} />}
          {face.hairStyle === "buzzcut" && <path d="M 32 30 C 32 20, 68 20, 68 30" stroke={face.hairColor} strokeWidth="4" fill="none" />}
          {face.hairStyle === "fade" && <path d="M 30 32 Q 50 20 70 32" stroke={face.hairColor} strokeWidth="3" fill="none" />}
          {face.hairStyle === "manbun" && (
            <>
              <path d="M 30 32 Q 50 18 70 32 Z" fill={face.hairColor} />
              <circle cx="50" cy="14" r="5" fill={face.hairColor} />
            </>
          )}
          {face.hairStyle === "flat-top" && <path d="M 31 26 L 69 26 L 68 35 L 32 35 Z" fill={face.hairColor} />}
          {face.hairStyle === "parted" && <path d="M 30 30 Q 42 16 50 24 Q 58 16 70 30 Z" fill={face.hairColor} />}
          {face.hairStyle === "short" && <path d="M 31 30 Q 50 21 69 30 Z" fill={face.hairColor} />}
          
          <path d="M 20 90 C 20 72, 30 60, 50 60 C 70 60, 80 72, 80 90 Z" fill={jerseyColor} />
          <path d="M 38 60 L 50 73 L 62 60 Z" fill={face.skinTone} />
          <text x="50" y="85" fill="#ffffff" fontSize="20" fontWeight="black" textAnchor="middle">{number}</text>
        </svg>
      ) : (
        <img 
          src={photoUrl} 
          onError={() => setHasError(true)} 
          alt={name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
        />
      )}
      
      <span className="absolute bottom-0 right-0 text-[10px] bg-white dark:bg-zinc-950 px-1 py-0.5 rounded-tl border-t border-l border-zinc-200 dark:border-zinc-855 font-bold leading-none">
        {flag}
      </span>
    </div>
  );
}

export default function MatchCenter() {
  const { 
    matchesList, 
    selectedMatchId, 
    setSelectedMatchId, 
    activeMatch,
    allGroupsStandings,
    topStatsData,
    liveDemoActive,
    setLiveDemoActive 
  } = useApp();

  const [sportsTab, setSportsTab] = useState('matches');

  // Sub-category filters for stats tab
  const [statsCategory, setStatsCategory] = useState('goals');

  // Matches tab search and filter states
  const [stageFilter, setStageFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated video player states
  const [highlightsMatch, setHighlightsMatch] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(48);

  const openHighlights = (match) => {
    setHighlightsMatch(match);
    setIsPlaying(true);
    setCurrentTime(32);
  };

  const closeHighlights = () => {
    setHighlightsMatch(null);
  };

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


  // Filter matches based on user inputs
  const filteredMatches = matchesList.filter(m => {
    const matchesStage = stageFilter === 'ALL' || m.minute.toUpperCase().includes(stageFilter.toUpperCase());
    const matchesDate = dateFilter === 'ALL' || m.date.includes(dateFilter);
    const matchesSearch = searchQuery === '' || 
      m.teamA.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.teamB.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.stadium.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesDate && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header section with live demo switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">FIFA World Cup 2026 Match Center</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time live scores, brackets, standings, and player statistics.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
          <Tv className="w-4 h-4 text-emerald-500" />
          <div className="leading-tight">
            <span className="block font-bold">Simulate Live Match</span>
            <span className="text-[9px] text-zinc-450">Toggles live scoring demo</span>
          </div>
          <button
            onClick={() => setLiveDemoActive(!liveDemoActive)}
            className={`w-10 h-6 rounded-full transition-all relative ${
              liveDemoActive ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-800'
            }`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${
              liveDemoActive ? 'translate-x-4' : 'translate-x-0'
            }`}></span>
          </button>
        </div>
      </div>

      {/* Bing Sports-style Tab headers */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-1.5 scrollbar-none overflow-x-auto">
        <button
          onClick={() => setSportsTab('matches')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            sportsTab === 'matches'
              ? 'border-emerald-500 text-emerald-605 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Matches (Schedule)</span>
        </button>

        <button
          onClick={() => setSportsTab('bracket')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            sportsTab === 'bracket'
              ? 'border-emerald-500 text-emerald-605 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Bracket (Tree)</span>
        </button>

        <button
          onClick={() => setSportsTab('standings')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            sportsTab === 'standings'
              ? 'border-emerald-500 text-emerald-605 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Standings (Groups)</span>
        </button>

        <button
          onClick={() => setSportsTab('stats')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            sportsTab === 'stats'
              ? 'border-emerald-500 text-emerald-605 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Player Stats (Golden Boot)</span>
        </button>
      </div>

      {/* --- TAB CONTENT AREA --- */}

      {/* TAB 1: MATCHES (WITH FILTERS & SEARCH) */}
      {sportsTab === 'matches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Active match scoreboard displaying details */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="h-full flex-1" style={{ background: activeMatch.teamAColors.primary }}></div>
                <div className="h-full flex-1" style={{ background: activeMatch.teamBColors.primary }}></div>
              </div>

              <div className="flex justify-between items-center text-xs border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <div className="flex items-center gap-2 font-bold text-zinc-650 dark:text-zinc-400">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>Status: <span className={activeMatch.status === 'LIVE' ? 'text-red-500 animate-pulse font-black' : 'text-zinc-550'}>{activeMatch.status}</span></span>
                  {activeMatch.status === 'LIVE' && <span>• {activeMatch.minute}</span>}
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
                  {activeMatch.status !== 'UPCOMING' ? (
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

              {activeMatch.status === 'COMPLETED' && (
                <button
                  onClick={() => openHighlights(activeMatch)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Concluded Match Highlights & Goals</span>
                </button>
              )}
            </div>

            {/* Schedule Explorer Panel */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
              
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search teams, cities, or stadiums..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none font-bold"
                  >
                    <option value="ALL">All Stages</option>
                    <option value="Group">Group Stage</option>
                    <option value="Round of 16">Round of 16</option>
                    <option value="QF">Quarter-Finals</option>
                  </select>

                  <select 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none font-bold"
                  >
                    <option value="ALL">All Dates</option>
                    <option value="Jun 11">June 11</option>
                    <option value="Jun 12">June 12</option>
                    <option value="Jul 04">July 4</option>
                    <option value="Jul 05">July 5</option>
                    <option value="Jul 06">July 6</option>
                    <option value="Jul 07">July 7</option>
                    <option value="Jul 10">July 10</option>
                    <option value="Jul 11">July 11</option>
                  </select>
                </div>
              </div>

              {/* Matches List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((m) => {
                    const isActive = selectedMatchId === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMatchId(m.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden ${
                          isActive
                            ? 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-350 dark:border-zinc-700 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start text-[10px] text-zinc-455 font-bold border-b border-zinc-200/50 dark:border-zinc-850 pb-1.5">
                          <span>{m.date} • {m.time}</span>
                          <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                            m.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-200 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>{m.status}</span>
                        </div>

                        <div className="flex items-center justify-between my-2">
                          <span className="font-extrabold text-xs flex items-center gap-1.5 text-zinc-800 dark:text-zinc-100">
                            <span className="text-xl leading-none">{m.teamAFlag}</span>
                            <span>{m.teamA}</span>
                          </span>
                          {m.status !== 'UPCOMING' ? (
                            <span className="font-mono font-bold text-xs bg-zinc-250 dark:bg-zinc-800 px-2 py-0.5 rounded">
                              {m.scoreA} - {m.scoreB}
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-455 font-black">VS</span>
                          )}
                          <span className="font-extrabold text-xs flex items-center gap-1.5 text-zinc-800 dark:text-zinc-100 text-right justify-end">
                            <span>{m.teamB}</span>
                            <span className="text-xl leading-none">{m.teamBFlag}</span>
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-1 border-t border-zinc-100 dark:border-zinc-900 pt-1">
                          <p className="text-[8px] text-zinc-400 truncate max-w-[120px]">{m.stadium.split(',')[0]}</p>
                          {m.status === 'COMPLETED' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openHighlights(m);
                              }}
                              className="text-[9px] text-emerald-600 dark:text-emerald-450 font-bold hover:underline flex items-center gap-0.5"
                            >
                              <Play className="w-2.5 h-2.5 fill-emerald-600 dark:fill-emerald-450" />
                              <span>Highlights</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-8 text-zinc-455 text-xs font-semibold">
                    No matching matches found for the selected filters.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span>Next Stage Kickoff</span>
              </h3>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
                The Quarter-Finals commence on **Friday, July 10, 2026** at Gillette Stadium in Boston with France vs Morocco. Group standings are fully completed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL BRACKET TREE & AI SCHEDULER */}
      {sportsTab === 'bracket' && (
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
                  : 'bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-450 border-emerald-250 dark:border-emerald-900/50'
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
                    <span className="text-[10px] uppercase font-black tracking-wider text-zinc-450">Semi-Final 1</span>
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
                    <span className="text-[10px] uppercase font-black tracking-wider text-zinc-450">Semi-Final 2</span>
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
                    <span className="text-[10px] uppercase font-black tracking-wider text-zinc-450">World Cup Final</span>
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
      )}

      {/* TAB 3: STANDINGS (ALL 12 GROUPS A TO L GRID) */}
      {sportsTab === 'standings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-500" />
              <span>FIFA World Cup 2026 Standings (Group Stage A-L)</span>
            </h3>
            <p className="text-xs text-zinc-500">Official point positions of all 48 participating countries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.keys(allGroupsStandings).map((groupName) => (
              <div key={groupName} className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-black text-xs text-emerald-650 dark:text-emerald-400 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                  {groupName}
                </h4>
                
                <table className="w-full text-left text-[11px] font-medium">
                  <thead>
                    <tr className="text-zinc-400 border-b border-zinc-100/50 dark:border-zinc-850 pb-1">
                      <th className="pb-1.5">Pos</th>
                      <th className="pb-1.5">Team</th>
                      <th className="pb-1.5 text-center">P</th>
                      <th className="pb-1.5 text-center">GD</th>
                      <th className="pb-1.5 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allGroupsStandings[groupName].map((t) => (
                      <tr key={t.rank} className="border-b border-zinc-100/50 dark:border-zinc-900/30 text-zinc-700 dark:text-zinc-300">
                        <td className="py-2 font-bold">{t.rank}</td>
                        <td className="py-2 font-extrabold truncate max-w-[100px]">{t.team}</td>
                        <td className="py-2 text-center font-mono">{t.played}</td>
                        <td className="py-2 text-center font-mono text-zinc-500">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                        <td className="py-2 text-center font-bold text-emerald-600 dark:text-emerald-450">{t.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PLAYER STATS (GOALS, ASSISTS, CLEAN SHEETS, DISCIPLINE SUB-CATEGORIES) */}
      {sportsTab === 'stats' && (
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm animate-fade-in space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-150 dark:border-zinc-850 pb-4">
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
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
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
      )}

      {/* SIMULATED VIDEO PLAYER OVERLAY MODAL */}
      {highlightsMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-fade-in">
            
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/50">
              <span className="font-extrabold text-xs text-zinc-700 dark:text-zinc-300">
                Watching Highlights: {highlightsMatch.teamAFlag} {highlightsMatch.teamA} vs {highlightsMatch.teamBFlag} {highlightsMatch.teamB} (Final: {highlightsMatch.scoreA} - {highlightsMatch.scoreB})
              </span>
              <button 
                onClick={closeHighlights} 
                className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-455 hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport Area */}
            <div className="aspect-video bg-zinc-950 relative flex items-center justify-center overflow-hidden border-b border-zinc-200 dark:border-zinc-850">
              
              <div className="absolute inset-0 opacity-80 bg-[#15803d] flex items-center justify-center">
                <div className="absolute inset-4 border-2 border-white/20"></div>
                <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/25"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/25"></div>
                
                {isPlaying && (
                  <div className="absolute w-6 h-6 bg-white rounded-full border-2 border-black animate-ping-custom shadow-md flex items-center justify-center text-[10px]">⚽</div>
                )}
                
                {currentTime > 15 && currentTime < 28 && (
                  <div className="absolute bg-amber-500 text-white font-black text-2xl px-6 py-2 rounded-xl shadow-lg border border-white animate-bounce z-10 tracking-widest">
                    ⚽ GOAL! ⚽
                  </div>
                )}

                <div className="absolute bottom-12 left-4 text-[10px] text-white bg-black/60 px-2 py-1 rounded font-bold">
                  Simulated Playback • Goal highlight event
                </div>
              </div>

              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>
                </div>
              )}

            </div>

            {/* Video Controls bar */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 space-y-3 text-xs">
              
              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-450 font-semibold">
                  <span>0:{currentTime.toString().padStart(2, '0')}</span>
                  <span>1:20</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative cursor-pointer">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / 80) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-zinc-650 dark:text-zinc-200 hover:text-emerald-500"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <Volume2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                </div>
                <Maximize2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </div>

              {/* highlights markers timeline */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex flex-wrap gap-2">
                <span className="text-[10px] font-bold text-zinc-450 w-full uppercase">Goal Timeline Seek:</span>
                {highlightsMatch.events.map((ev, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentTime(15 + i * 20);
                      setIsPlaying(true);
                    }}
                    className="px-2 py-0.5 rounded bg-zinc-200 hover:bg-emerald-50 dark:bg-zinc-850 dark:hover:bg-emerald-950/20 border border-transparent dark:hover:border-emerald-900/30 text-[9px] font-bold text-zinc-700 dark:text-zinc-300"
                  >
                    {ev.minute} {ev.player} ({ev.type})
                  </button>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
