import React from 'react';
import { Trophy } from 'lucide-react';

export default function StandingsTab({ allGroupsStandings }) {
  return (
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
                <tr className="text-zinc-400 border-b border-zinc-100/50 dark:border-zinc-855 pb-1">
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
  );
}
