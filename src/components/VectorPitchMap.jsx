import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Compass } from 'lucide-react';

export default function VectorPitchMap() {
  const { telemetry } = useApp();
  const [bowlLevel, setBowlLevel] = useState('lower');

  const spots = {
    gateC: { x: 380, y: 320, label: 'Gate C' },
    gateD: { x: 500, y: 150, label: 'Gate D' },
    gateB: { x: 120, y: 180, label: 'Gate B' },
    block102: { x: 260, y: 220, label: 'Section 102' },
    block104: { x: 380, y: 180, label: 'Section 104' },
    medicalBay: { x: 150, y: 280, label: 'Medical Bay' }
  };

  return (
    <div className="flex flex-col bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden h-full shadow-xl">
      
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            MetLife Interactive Vector Map
          </h3>
          <p className="text-[10px] text-zinc-450">Operations-linked live crowd & routing overlay</p>
        </div>

        {/* Bowl Selector Toggles */}
        <div className="flex bg-zinc-900 border border-zinc-850 rounded-lg p-0.5 text-[10px] font-bold">
          {['lower', 'mezzanine', 'upper'].map((level) => (
            <button
              key={level}
              onClick={() => setBowlLevel(level)}
              className={`px-3 py-1 rounded-md transition-all uppercase ${
                bowlLevel === level 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive MetLife Stadium SVG */}
      <div className="flex-1 flex items-center justify-center min-h-[300px] relative">
        <svg viewBox="0 0 600 400" className="w-full h-full max-h-[360px] filter drop-shadow-[0_0_24px_rgba(16,185,129,0.05)]">
          <defs>
            <radialGradient id="heat-glow-red" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat-glow-orange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="stadium-glow" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Stadium Ambient Glow */}
          <circle cx="300" cy="200" r="280" fill="url(#stadium-glow)" />

          {/* Outer Stadium Perimeter wall */}
          <rect x="50" y="40" width="500" height="320" rx="160" fill="none" stroke="#27272a" strokeWidth="2" strokeDasharray="5 5" />

          {/* Seating Rings */}
          <rect 
            x="70" y="60" width="460" height="280" rx="140" 
            fill="none" 
            stroke={bowlLevel === 'upper' ? '#10b981' : '#18181b'} 
            strokeWidth={bowlLevel === 'upper' ? '4' : '2'} 
            className="transition-all duration-300 opacity-60" 
          />

          <rect 
            x="100" y="90" width="400" height="220" rx="110" 
            fill="none" 
            stroke={bowlLevel === 'mezzanine' ? '#10b981' : '#27272a'} 
            strokeWidth={bowlLevel === 'mezzanine' ? '4' : '2'} 
            className="transition-all duration-300" 
          />

          <rect 
            x="130" y="120" width="340" height="160" rx="80" 
            fill="none" 
            stroke={bowlLevel === 'lower' ? '#10b981' : '#3f3f46'} 
            strokeWidth={bowlLevel === 'lower' ? '4' : '2'} 
            className="transition-all duration-300" 
          />

          {/* Soccer Pitch Center Field */}
          <g transform="translate(180, 150)" opacity="0.85">
            <rect width="240" height="100" rx="4" fill="#064e3b" stroke="#047857" strokeWidth="2" />
            <line x1="120" y1="0" x2="120" y2="100" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
            <circle cx="120" cy="50" r="25" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
            <rect x="0" y="20" width="30" height="60" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
            <rect x="210" y="20" width="30" height="60" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
            <circle cx="120" cy="50" r="2" fill="#10b981" />
          </g>

          {/* Gate locations pins */}
          <circle cx={spots.gateB.x} cy={spots.gateB.y} r="6" fill="#1d4ed8" className="animate-ping opacity-45" />
          <circle cx={spots.gateB.x} cy={spots.gateB.y} r="4" fill="#3b82f6" />
          <text x={spots.gateB.x} y={spots.gateB.y - 10} textAnchor="middle" fill="#93c5fd" className="text-[8px] font-bold">Gate B</text>

          <circle cx={spots.gateC.x} cy={spots.gateC.y} r="6" fill="#047857" className="animate-ping opacity-45" />
          <circle cx={spots.gateC.x} cy={spots.gateC.y} r="4" fill="#10b981" />
          <text x={spots.gateC.x} y={spots.gateC.y + 16} textAnchor="middle" fill="#a7f3d0" className="text-[8px] font-bold">Gate C (Main Ingress)</text>

          <circle cx={spots.gateD.x} cy={spots.gateD.y} r="6" fill="#047857" className="animate-ping opacity-45" />
          <circle cx={spots.gateD.x} cy={spots.gateD.y} r="4" fill="#10b981" />
          <text x={spots.gateD.x} y={spots.gateD.y - 10} textAnchor="middle" fill="#a7f3d0" className="text-[8px] font-bold">Gate D</text>

          {/* Crowd Congestion Heatmap Overlays */}
          {telemetry.heatmapSpots && telemetry.heatmapSpots.map((spot, i) => (
            <g key={i}>
              <circle 
                cx={spot.x} 
                cy={spot.y} 
                r={spot.intensity > 0.7 ? "35" : "20"} 
                fill={spot.intensity > 0.7 ? "url(#heat-glow-red)" : "url(#heat-glow-orange)"} 
                className="animate-pulse" 
              />
              {spot.label && (
                <g>
                  <rect x={spot.x - 45} y={spot.y - 28} width="90" height="15" rx="3" fill="#09090b" stroke="#ef4444" strokeWidth="1" opacity="0.9" />
                  <text x={spot.x} y={spot.y - 18} textAnchor="middle" fill="#fca5a5" className="text-[7px] font-black uppercase tracking-wider">{spot.label}</text>
                </g>
              )}
            </g>
          ))}

          {/* Accessible Routing Path Line */}
          {telemetry.routingPath && (
            <path
              d={`M ${telemetry.routingPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="route-flow-line"
              filter="drop-shadow(0 0 8px rgba(16,185,129,0.8))"
            />
          )}

          {/* User's Location Spot */}
          <circle cx={spots.block104.x} cy={spots.block104.y} r="7" fill="#ef4444" className="animate-ping" />
          <circle cx={spots.block104.x} cy={spots.block104.y} r="4" fill="#f43f5e" />
          <text x={spots.block104.x} y={spots.block104.y - 10} textAnchor="middle" fill="#fca5a5" className="text-[8px] font-black">You (Sec 104)</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-zinc-900 grid grid-cols-3 gap-2 text-[8px] font-bold uppercase tracking-wider text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>Open Gates</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
          <span>Transit Hubs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          <span>Crowd Alert</span>
        </div>
      </div>
    </div>
  );
}
