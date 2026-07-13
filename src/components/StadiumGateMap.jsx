import React from 'react';
import { gateQueueInfo } from '../constants/stadiumMap.js';

/**
 * StadiumGateMap component that renders the interactive SVG map of stadium gates and path routing.
 * Wrapped in React.memo for rendering performance optimization.
 * @param {object} props The component props.
 * @param {string} props.startPoint The active starting gate ID.
 * @param {function} props.setStartPoint Callback to set the active starting gate.
 * @param {object} props.needs Object containing accessibility needs (wheelchair, lowVision, deaf).
 * @param {object} [props.routeResult] The active calculated route result.
 * @returns {React.ReactElement} The rendered Stadium Gate Map SVG.
 */
const StadiumGateMap = React.memo(function StadiumGateMap({
  startPoint,
  setStartPoint,
  needs,
  routeResult
}) {
  return (
    <svg viewBox="-240 -230 480 460" className="w-full h-auto select-none">
      <defs>
        {/* Soccer Pitch Stripe Pattern */}
        <pattern id="pitchStripes" width="20" height="70" patternUnits="userSpaceOnUse">
          <rect width="10" height="70" fill="#15803d" />
          <rect x="10" width="10" height="70" fill="#166534" />
        </pattern>
      </defs>

      {/* Compass HUD outer circle ticks */}
      <circle r="215" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.15" />
      <circle r="195" fill="none" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 20" />
      
      {/* Compass Cardinal Points */}
      <text x="0" y="-202" textAnchor="middle" fontSize="9" fontWeight="900" fill="#22c55e" fillOpacity="0.6">N</text>
      <text x="202" y="3" textAnchor="middle" fontSize="9" fontWeight="900" fill="#22c55e" fillOpacity="0.6">E</text>
      <text x="0" y="209" textAnchor="middle" fontSize="9" fontWeight="900" fill="#22c55e" fillOpacity="0.6">S</text>
      <text x="-202" y="3" textAnchor="middle" fontSize="9" fontWeight="900" fill="#22c55e" fillOpacity="0.6">W</text>

      {/* Concentric Stadium Outlines */}
      <circle r="175" fill="none" stroke="#e4e4e7" className="dark:stroke-zinc-800" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle r="145" fill="none" stroke="#f4f4f5" className="dark:stroke-zinc-900" strokeWidth="1" />
      <circle r="115" fill="none" stroke="#e4e4e7" className="dark:stroke-zinc-850" strokeWidth="1" strokeDasharray="2 4" />
      
      {/* Detailed Soccer Pitch Center */}
      <g>
        {/* Pitch green grass background */}
        <rect x="-55" y="-35" width="110" height="70" rx="2" fill="url(#pitchStripes)" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
        {/* Midfield line */}
        <line x1="0" y1="-35" x2="0" y2="35" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
        {/* Midfield center circle */}
        <circle r="15" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
        <circle r="1" fill="#ffffff" />
        {/* Penalty areas */}
        <rect x="-55" y="-18" width="18" height="36" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
        <rect x="37" y="-18" width="18" height="36" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
        {/* Goal areas */}
        <rect x="-55" y="-8" width="6" height="16" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
        <rect x="49" y="-8" width="6" height="16" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
      </g>
      
      {/* Detailed Multi-Tier Stadium Seating blocks */}
      {/* North Sector blocks */}
      <path d="M 85 -100 A 130 130 0 0 0 -85 -100 L -60 -70 A 90 90 0 0 1 60 -70 Z" fill="#27272a" className="dark:fill-zinc-900/60" stroke="#3f3f46" strokeWidth="1" />
      <path d="M 80 -105 A 135 135 0 0 0 30 -131 L 20 -95 A 95 95 0 0 1 60 -75 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />
      <path d="M -30 -131 A 135 135 0 0 0 -80 -105 L -60 -75 A 95 95 0 0 1 -20 -95 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />

      {/* East Sector blocks */}
      <path d="M 100 85 A 130 130 0 0 0 100 -85 L 70 -60 A 90 90 0 0 1 70 60 Z" fill="#27272a" className="dark:fill-zinc-900/60" stroke="#3f3f46" strokeWidth="1" />
      <path d="M 105 80 A 135 135 0 0 0 131 30 L 95 20 A 95 95 0 0 1 75 60 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />
      <path d="M 131 -30 A 135 135 0 0 0 105 -80 L 75 -60 A 95 95 0 0 1 95 -20 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />

      {/* South Sector blocks */}
      <path d="M -85 100 A 130 130 0 0 0 85 100 L 60 70 A 90 90 0 0 1 -60 70 Z" fill="#27272a" className="dark:fill-zinc-900/60" stroke="#3f3f46" strokeWidth="1" />
      <path d="M 80 105 A 135 135 0 0 1 30 131 L 20 95 A 95 95 0 0 0 60 75 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />
      <path d="M -30 131 A 135 135 0 0 1 -80 105 L -60 75 A 95 95 0 0 0 -20 95 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />

      {/* West Sector blocks */}
      <path d="M -100 -85 A 130 130 0 0 0 -100 85 L -70 60 A 90 90 0 0 1 -70 -60 Z" fill="#27272a" className="dark:fill-zinc-900/60" stroke="#3f3f46" strokeWidth="1" />
      <path d="M -105 80 A 135 135 0 0 1 -131 30 L -95 20 A 95 95 0 0 0 -75 60 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />
      <path d="M -131 -30 A 135 135 0 0 1 -105 -80 L -75 -60 A 95 95 0 0 0 -95 -20 Z" fill="#18181b" className="dark:fill-zinc-850/40" stroke="#3f3f46" strokeWidth="0.8" />

      {/* Dynamic Route Highlight Line */}
      {routeResult && (
        <g>
          <path 
            d={
              startPoint === 'gate-a' ? "M 0,-184 L 0,-130 C 0,-90 -30,-70 -30,-50" :
              startPoint === 'gate-b' ? "M 130,-130 L 98,-98 C 80,-80 60,-60 40,-45" :
              startPoint === 'gate-c' ? "M 184,0 L 130,0 C 100,0 70,20 50,30" :
              startPoint === 'gate-d' ? "M 130,130 L 98,98 C 80,80 60,60 40,45" :
              startPoint === 'gate-e' ? "M 0,184 L 0,130 C 0,90 30,70 30,50" :
              startPoint === 'gate-f' ? "M -130,130 L -98,98 C -80,80 -60,60 -40,45" :
              startPoint === 'gate-g' ? "M -184,0 L -130,0 C -100,0 -70,-20 -50,-30" :
              /* gate-h */ "M -130,-130 L -98,-98 C -80,-80 -60,-60 -40,-45"
            } 
            fill="none" 
            stroke={needs.wheelchair ? "#3b82f6" : "#d946ef"} 
            strokeWidth="4" 
            className="route-flow-line" 
            style={{ filter: needs.wheelchair ? 'drop-shadow(0 0 6px rgba(59,130,246,0.8))' : 'drop-shadow(0 0 6px rgba(217,70,239,0.8))' }}
          />

          {/* Blinking Pin indicator at the route destination */}
          <circle 
            cx={
              startPoint === 'gate-a' ? -30 :
              startPoint === 'gate-b' ? 40 :
              startPoint === 'gate-c' ? 50 :
              startPoint === 'gate-d' ? 40 :
              startPoint === 'gate-e' ? 30 :
              startPoint === 'gate-f' ? -40 :
              startPoint === 'gate-g' ? -50 :
              /* gate-h */ -40
            } 
            cy={
              startPoint === 'gate-a' ? -50 :
              startPoint === 'gate-b' ? -45 :
              startPoint === 'gate-c' ? 30 :
              startPoint === 'gate-d' ? 45 :
              startPoint === 'gate-e' ? 50 :
              startPoint === 'gate-f' ? 45 :
              startPoint === 'gate-g' ? -30 :
              /* gate-h */ -45
            } 
            r="8" 
            fill={needs.wheelchair ? "#3b82f6" : "#d946ef"} 
            className="animate-ping" 
            style={{ transformOrigin: 'center' }}
          />
          <circle 
            cx={
              startPoint === 'gate-a' ? -30 :
              startPoint === 'gate-b' ? 40 :
              startPoint === 'gate-c' ? 50 :
              startPoint === 'gate-d' ? 40 :
              startPoint === 'gate-e' ? 30 :
              startPoint === 'gate-f' ? -40 :
              startPoint === 'gate-g' ? -50 :
              /* gate-h */ -40
            } 
            cy={
              startPoint === 'gate-a' ? -50 :
              startPoint === 'gate-b' ? -45 :
              startPoint === 'gate-c' ? 30 :
              startPoint === 'gate-d' ? 45 :
              startPoint === 'gate-e' ? 50 :
              startPoint === 'gate-f' ? 45 :
              startPoint === 'gate-g' ? -30 :
              /* gate-h */ -45
            } 
            r="4" 
            fill="#ffffff" 
          />
        </g>
      )}

      {/* INTERACTIVE GATES A to H */}
      {/* Gate A (North) */}
      <g 
        onClick={() => setStartPoint('gate-a')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate A. queue is ${gateQueueInfo['gate-a'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-a') : null}
      >
        {startPoint === 'gate-a' && <circle cx="0" cy="-184" r="18" fill={gateQueueInfo['gate-a'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="-14" y="-193" width="28" height="18" rx="4" fill={startPoint === 'gate-a' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-a'].color} strokeWidth={startPoint === 'gate-a' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-a' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="0" y="-184" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">A</text>
      </g>

      {/* Gate B (North-East) */}
      <g 
        onClick={() => setStartPoint('gate-b')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate B. queue is ${gateQueueInfo['gate-b'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-b') : null}
      >
        {startPoint === 'gate-b' && <circle cx="130" cy="-130" r="18" fill={gateQueueInfo['gate-b'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="116" y="-139" width="28" height="18" rx="4" fill={startPoint === 'gate-b' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-b'].color} strokeWidth={startPoint === 'gate-b' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-b' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="130" y="-130" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">B</text>
      </g>

      {/* Gate C (East) */}
      <g 
        onClick={() => setStartPoint('gate-c')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate C. queue is ${gateQueueInfo['gate-c'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-c') : null}
      >
        {startPoint === 'gate-c' && <circle cx="184" cy="0" r="18" fill={gateQueueInfo['gate-c'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="170" y="-9" width="28" height="18" rx="4" fill={startPoint === 'gate-c' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-c'].color} strokeWidth={startPoint === 'gate-c' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-c' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="184" y="0" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">C</text>
      </g>

      {/* Gate D (South-East) */}
      <g 
        onClick={() => setStartPoint('gate-d')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate D. queue is ${gateQueueInfo['gate-d'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-d') : null}
      >
        {startPoint === 'gate-d' && <circle cx="130" cy="130" r="18" fill={gateQueueInfo['gate-d'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="116" y="121" width="28" height="18" rx="4" fill={startPoint === 'gate-d' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-d'].color} strokeWidth={startPoint === 'gate-d' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-d' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="130" y="130" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">D</text>
      </g>

      {/* Gate E (South) */}
      <g 
        onClick={() => setStartPoint('gate-e')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate E. queue is ${gateQueueInfo['gate-e'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-e') : null}
      >
        {startPoint === 'gate-e' && <circle cx="0" cy="184" r="18" fill={gateQueueInfo['gate-e'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="-14" y="175" width="28" height="18" rx="4" fill={startPoint === 'gate-e' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-e'].color} strokeWidth={startPoint === 'gate-e' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-e' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="0" y="184" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">E</text>
      </g>

      {/* Gate F (South-West) */}
      <g 
        onClick={() => setStartPoint('gate-f')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate F. queue is ${gateQueueInfo['gate-f'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-f') : null}
      >
        {startPoint === 'gate-f' && <circle cx="-130" cy="130" r="18" fill={gateQueueInfo['gate-f'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="-144" y="121" width="28" height="18" rx="4" fill={startPoint === 'gate-f' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-f'].color} strokeWidth={startPoint === 'gate-f' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-f' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="-130" y="130" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">F</text>
      </g>

      {/* Gate G (West) */}
      <g 
        onClick={() => setStartPoint('gate-g')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate G. queue is ${gateQueueInfo['gate-g'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-g') : null}
      >
        {startPoint === 'gate-g' && <circle cx="-184" cy="0" r="18" fill={gateQueueInfo['gate-g'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="-198" y="-9" width="28" height="18" rx="4" fill={startPoint === 'gate-g' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-g'].color} strokeWidth={startPoint === 'gate-g' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-g' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="-184" y="0" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">G</text>
      </g>

      {/* Gate H (North-West) */}
      <g 
        onClick={() => setStartPoint('gate-h')}
        className="cursor-pointer group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded"
        role="button"
        tabIndex="0"
        aria-label={`Select Gate H. queue is ${gateQueueInfo['gate-h'].percentage}% full`}
        onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? setStartPoint('gate-h') : null}
      >
        {startPoint === 'gate-h' && <circle cx="-130" cy="-130" r="18" fill={gateQueueInfo['gate-h'].color} fillOpacity="0.25" className="animate-ping" />}
        <rect x="-144" y="-139" width="28" height="18" rx="4" fill={startPoint === 'gate-h' ? '#22c55e' : '#18181b'} stroke={gateQueueInfo['gate-h'].color} strokeWidth={startPoint === 'gate-h' ? '2.5' : '1.5'} style={{ filter: startPoint === 'gate-h' ? 'drop-shadow(0 0 5px #22c55e)' : 'none' }} />
        <text x="-130" y="-130" textAnchor="middle" dominantBaseline="central" fontSize="9" fontWeight="900" fill="#ffffff">H</text>
      </g>
    </svg>
  );
});

export default StadiumGateMap;
