import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Play, ShieldAlert, Cpu, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function StorylineSimulator() {
  const { simulatorAct, triggerSimulatorAct } = useApp();

  const actsList = [
    { num: 1, title: 'Gates Open', icon: Play, desc: 'Gates open, ingress commences.', resolution: 'Turnstiles & transit monitored.' },
    { num: 2, title: 'Peak Crowding', icon: ShieldAlert, desc: 'Gate C bottleneck peak.', resolution: 'Turnstile scanners bottleneck alert.' },
    { num: 3, title: 'AI Rerouting', icon: Cpu, desc: 'Rerouting fans to Gate D.', resolution: 'AI companion notifies fans.' },
    { num: 4, title: 'Dispatch', icon: HeartHandshake, desc: 'Volunteers deployed to Gate C.', resolution: 'Staff assists turnstile flow.' },
    { num: 5, title: 'Emergency', icon: ShieldAlert, desc: 'Spectator collapsed at Block 102.', resolution: 'Medical incident ticket generated.' },
    { num: 6, title: 'Stretcher Route', icon: Cpu, desc: 'Accessible path generated.', resolution: 'Medical team routed via elevator.' },
    { num: 7, title: 'Suspicious Object', icon: ShieldAlert, desc: 'Unattended backpack at Gate C.', resolution: 'Security drone dispatched.' },
    { num: 8, title: 'All Clear', icon: HeartHandshake, desc: 'Drone scan confirms gym bag.', resolution: 'Threat cleared, alarm resolved.' },
    { num: 9, title: 'Egress', icon: CheckCircle2, desc: 'Match clears successfully.', resolution: 'Success analytics report compiled.' }
  ];

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xs font-black tracking-wider text-zinc-400 uppercase">
            Live Matchday Storyline Simulator
          </h3>
          <p className="text-[10px] text-zinc-550">Simulate matchday timeline acts to trigger real-time telemetry changes & routing overlays</p>
        </div>

        {/* Timeline Horizontal Selector */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between gap-2 overflow-x-auto pb-2 dark-scroll">
          {actsList.map((act) => {
            const Icon = act.icon;
            const isCompleted = act.num < simulatorAct;
            const isActive = act.num === simulatorAct;
            
            return (
              <button
                key={act.num}
                onClick={() => triggerSimulatorAct(act.num)}
                aria-label={`Activate Simulator Act ${act.num}: ${act.title}`}
                className={`flex-1 min-w-[75px] sm:min-w-0 flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                  isActive 
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] scale-105' 
                    : isCompleted
                      ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400 opacity-80'
                      : 'bg-zinc-900/20 border-zinc-900/50 text-zinc-650 hover:border-zinc-800'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border text-[11px] font-extrabold ${
                  isActive 
                    ? 'bg-emerald-600 border-emerald-400 text-white' 
                    : isCompleted
                      ? 'bg-emerald-950/20 border-emerald-900 text-emerald-500'
                      : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                }`}>
                  {act.num}
                </div>
                <span className="text-[9px] font-black tracking-tight leading-tight truncate max-w-full">{act.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Act details display */}
        <div className="bg-zinc-900/50 border border-zinc-850 rounded-xl p-3 grid sm:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div>
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Timeline Event</span>
            <p className="font-bold text-zinc-200">{actsList[simulatorAct - 1].desc}</p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-zinc-850 pt-2 sm:pt-0 sm:pl-3">
            <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest block mb-1">AI Smart Ingress Response</span>
            <p className="text-zinc-350">{actsList[simulatorAct - 1].resolution}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
