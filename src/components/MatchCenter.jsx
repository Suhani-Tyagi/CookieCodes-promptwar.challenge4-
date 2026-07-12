import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Trophy, Calendar, Play, Tv, GitBranch, Star, Search } from 'lucide-react';
import ActiveMatchCard from './ActiveMatchCard.jsx';
import BracketTreeTab from './BracketTreeTab.jsx';
import StandingsTab from './StandingsTab.jsx';
import PlayerLeaderboards from './PlayerLeaderboards.jsx';
import HighlightsVideoModal from './HighlightsVideoModal.jsx';

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

  // Matches tab search and filter states
  const [stageFilter, setStageFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated video player state
  const [highlightsMatch, setHighlightsMatch] = useState(null);
  const initiatingVideoRef = useRef(null);

  const openHighlights = (match) => {
    initiatingVideoRef.current = document.activeElement;
    setHighlightsMatch(match);
  };

  const closeHighlights = () => {
    setHighlightsMatch(null);
  };

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
            aria-label="Toggle live scoring simulation"
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

      {/* Tab headers */}
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

      {/* TAB CONTENT AREA */}
      {sportsTab === 'matches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="lg:col-span-2 space-y-6">
            <ActiveMatchCard 
              activeMatch={activeMatch} 
              liveDemoActive={liveDemoActive} 
              openHighlights={openHighlights} 
            />

            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
              
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
                    <option value="Jun 13">June 13</option>
                    <option value="Jun 14">June 14</option>
                    <option value="Jun 15">June 15</option>
                  </select>
                </div>
              </div>

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
                            ? 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-355 dark:border-zinc-705 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start text-[10px] text-zinc-455 font-bold border-b border-zinc-200/50 dark:border-zinc-850 pb-1.5">
                          <span>{m.date} • {m.time}</span>
                          <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                            m.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-200 text-zinc-655 dark:bg-zinc-800 dark:text-zinc-400'
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
                              className="text-[9px] text-emerald-600 dark:text-emerald-455 font-bold hover:underline flex items-center gap-0.5"
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

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-805 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span>Next Stage Kickoff</span>
              </h3>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-655 dark:text-zinc-400 leading-relaxed font-semibold">
                The Quarter-Finals commence on **Friday, July 10, 2026** at Gillette Stadium in Boston with France vs Morocco. Group standings are fully completed.
              </div>
            </div>
          </div>
        </div>
      )}

      {sportsTab === 'bracket' && <BracketTreeTab />}

      {sportsTab === 'standings' && <StandingsTab allGroupsStandings={allGroupsStandings} />}

      {sportsTab === 'stats' && <PlayerLeaderboards topStatsData={topStatsData} />}

      {highlightsMatch && (
        <HighlightsVideoModal 
          highlightsMatch={highlightsMatch} 
          closeHighlights={closeHighlights} 
          initiatingVideoRef={initiatingVideoRef}
        />
      )}

    </div>
  );
}
