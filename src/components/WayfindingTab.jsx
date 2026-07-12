import React, { useState, useEffect } from 'react';
import { Compass, Info, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { gateQueueInfo } from '../constants/wayfindingData.js';
import { generateText } from '../services/geminiClient.js';
import { validateText, sanitizeText } from '../utils/sanitize.js';

export default function WayfindingTab({ highVisibility }) {
  const { settings } = useApp();

  // --- StadiumMate Form States ---
  const [startPoint, setStartPoint] = useState('gate-b');
  const [destination, setDestination] = useState('sensory-room');
  
  const [needs, setNeeds] = useState({
    wheelchair: false,
    lowVision: false,
    deaf: false
  });
  
  const [ticketSection, setTicketSection] = useState('134');
  const [minutesToKickoff, setMinutesToKickoff] = useState('20');
  const [customQuestion, setCustomQuestion] = useState('');
  
  // Calculated Route Output
  const [routeResult, setRouteResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState('');
  
  // AI Question answer inside route
  const [aiAnswer, setAiAnswer] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // --- Call Gemini for custom wayfinding questions ---
  const getAIWayfindingHelp = async (question, destinationName, startingGate) => {
    const isLive = settings?.apiMode === 'live';

    const basePrompt = `You are "ArenaAssist", the official AI wayfinding assistant for the FIFA World Cup 2026.
Starting point: ${startingGate}
Destination: ${destinationName}
Ticket Section: ${ticketSection}
Minutes to kickoff: ${minutesToKickoff}
Accessibility options: Wheelchair: ${needs.wheelchair}, Low Vision: ${needs.lowVision}, Deaf: ${needs.deaf}.

Provide a highly concise, 2-3 sentence friendly helper note answering the fan's custom question:
"${question}"
Include specific landmarks or elevator locations in your response.`;

    if (isLive) {
      try {
        const text = await generateText(basePrompt);
        return text;
      } catch (err) {
        console.error("Gemini wayfinding error:", err);
        return `Gate elevator B and the concourse corridors are clear. Head directly towards the guest services booth near Section 112 for personal assistance.`;
      }
    } else {
      // Mock delayed response
      return new Promise((resolve) => {
        setTimeout(() => {
          let response = "";
          if (needs.wheelchair) {
            response = `Since you need step-free access, please use the elevator located near Section 112. The elevator is fully operational and will take you directly down to the accessible Restroom area.`;
          } else {
            response = `From ${startingGate}, you can find the nearest facilities by heading past Section 104. There is no queue at the concession counters currently, and security guides are posted along the route.`;
          }
          resolve(response + " [Simulated Wayfinding Liaison]");
        }, 1000);
      });
    }
  };

  // --- Dynamic Routing Logic ---
  const calculateRoute = async () => {
    if (customQuestion.trim()) {
      const validation = validateText(customQuestion);
      if (!validation.valid) {
        setAiAnswer(validation.message);
        return;
      }
    }

    setCalculating(true);
    setAiAnswer('');
    setLoadingAi(false);

    // Dynamic delay for realistic rendering
    setTimeout(async () => {
      const selectedStart = gateQueueInfo[startPoint] || { name: startPoint, crowd: "moderate" };
      const crowdLevel = selectedStart.crowd;

      let destName = "Sensory Room";
      let destLocation = "the quiet Sensory Room behind Section 130 (North-West)";
      let baseDistance = 160;

      if (destination === 'restroom') {
        destName = "Accessible Restroom";
        destLocation = "the step-free ADA Restroom at Sector 2 (Level 1)";
        baseDistance = 110;
      } else if (destination === 'first-aid') {
        destName = "First Aid Station";
        destLocation = "the Main Medical Desk next to Section 102";
        baseDistance = 190;
      } else if (destination === 'concessions') {
        destName = "Concessions Hall";
        destLocation = "the Food Court near Section 118";
        baseDistance = 140;
      } else if (destination === 'seat') {
        destName = `Section ${ticketSection || '104'}`;
        destLocation = `your assigned seating row in Section ${ticketSection || '104'}`;
        baseDistance = 220;
      }

      // Wheelchair detours increase walking distance slightly
      const finalDistance = needs.wheelchair ? Math.round(baseDistance * 1.25) : baseDistance;

      // Base Route steps
      let steps = [];
      if (needs.wheelchair) {
        steps = [
          { num: 1, text: `Head to Concourse Sector 2 elevator near ${selectedStart.name}. ELEVATOR` },
          { num: 2, text: "Take Elevator 2B to Level 1 Concourse and exit to the step-free corridor. ELEVATOR" },
          { num: 3, text: `Follow the wide accessible ramp path to ${destName} (${destLocation}). RAMP` }
        ];
      } else {
        steps = [
          { num: 1, text: `Walk to Lower Concourse from ${selectedStart.name}. WALK` },
          { num: 2, text: "Walk past the Section 120 ticketing gates. WALK" },
          { num: 3, text: `Continue towards ${destName} (${destLocation}). WALK` }
        ];
      }

      // Add low vision cues
      if (needs.lowVision) {
        steps = steps.map((s, idx) => {
          if (idx === 0) return { ...s, text: s.text + " (Follow yellow tactile floor pathing)" };
          if (idx === 2) return { ...s, text: s.text + " (Listen for audible beep beacon overhead)" };
          return s;
        });
      }

      // Add deaf cues
      if (needs.deaf) {
        steps = steps.map((s, idx) => {
          if (idx === 1) return { ...s, text: s.text + " (Look for green direction arrows on overhead displays)" };
          if (idx === 2) return { ...s, text: s.text + " (Visual flashing lights label the entry door)" };
          return s;
        });
      }

      const calculated = {
        destName,
        destLocation,
        distance: finalDistance,
        crowd: crowdLevel,
        steps,
        mode: needs.lowVision ? "High-Visibility" : "Standard"
      };

      setRouteResult(calculated);
      setCalculating(false);

      // Accessibility Announcement
      const announcement = `Route calculated to ${destName}. Follow the ${steps.length}-step route, approximately ${finalDistance} meters. Current crowd is ${crowdLevel}.`;
      setSrAnnouncement(announcement);

      // AI Assist Block: If a custom question is asked, invoke AI response
      if (customQuestion.trim()) {
        setLoadingAi(true);
        try {
          const answer = await getAIWayfindingHelp(customQuestion, destName, selectedStart.name);
          setAiAnswer(answer);
        } catch (e) {
          setAiAnswer("Could not fetch GenAI answer. Please check your network connection.");
        } finally {
          setLoadingAi(false);
        }
      }
    }, 800);
  };

  // Trigger calculations initially to preload
  useEffect(() => {
    calculateRoute();
  }, [startPoint, destination]);

  return (
    <div className="space-y-6">
      {/* SR Accessibility Announcements (screen-readers only) */}
      <div className="sr-only" role="status" aria-live="polite">
        {srAnnouncement}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT PANEL: YOUR CONTEXT */}
        <div className={`bg-white dark:bg-[#0c0c0f] border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 ${
          highVisibility ? 'border-4 border-black dark:border-zinc-900 bg-white text-black font-bold' : 'border-zinc-200 dark:border-zinc-800'
        }`}>
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-150 border-b border-zinc-150 dark:border-zinc-900 pb-3 uppercase tracking-wider">
            Your context
          </h3>

          <div className="space-y-4">
            {/* Where are you now? */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="wayfinding-start" className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
                Where are you now?
              </label>
              <select
                id="wayfinding-start"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                className="w-full min-h-11 rounded-lg border border-zinc-250 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold px-3 text-zinc-850 dark:text-zinc-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <optgroup label="Stadium Access Gates" className="text-zinc-900">
                  {Object.keys(gateQueueInfo).map(key => (
                    <option key={key} value={key}>{gateQueueInfo[key].name}</option>
                  ))}
                </optgroup>
                <optgroup label="Seating Sections" className="text-zinc-900">
                  <option value="section-101">Section 101</option>
                  <option value="section-104">Section 104</option>
                  <option value="section-112">Section 112</option>
                  <option value="section-118">Section 118</option>
                </optgroup>
              </select>
            </div>

            {/* Where do you want to go? */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="wayfinding-end" className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
                Where do you want to go?
              </label>
              <select
                id="wayfinding-end"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full min-h-11 rounded-lg border border-zinc-250 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold px-3 text-zinc-850 dark:text-zinc-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="sensory-room">Sensory room</option>
                <option value="restroom">Accessible restroom</option>
                <option value="first-aid">First aid station</option>
                <option value="concessions">Concession Stand / Food</option>
                <option value="seat">Find my seat</option>
              </select>
            </div>

            {/* Accessibility Needs Checkbox Panel */}
            <fieldset className="border border-zinc-205 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/10">
              <legend className="px-2 text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
                Accessibility needs
              </legend>
              <div className="space-y-3 mt-1.5">
                <label className="flex items-center gap-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needs.wheelchair}
                    onChange={(e) => setNeeds(prev => ({ ...prev, wheelchair: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-605 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1.5">
                    ♿ Wheelchair / step-free
                  </span>
                </label>

                <label className="flex items-center gap-3 text-xs font-bold text-zinc-805 dark:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needs.lowVision}
                    onChange={(e) => setNeeds(prev => ({ ...prev, lowVision: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-605 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1.5">
                    👁️ Low vision / screen reader
                  </span>
                </label>

                <label className="flex items-center gap-3 text-xs font-bold text-zinc-805 dark:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needs.deaf}
                    onChange={(e) => setNeeds(prev => ({ ...prev, deaf: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-605 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1.5">
                    🧏 Deaf / hard of hearing
                  </span>
                </label>
              </div>
            </fieldset>

            {/* Ticket section & Minutes to kickoff */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="wayfinding-ticket" className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
                  Ticket section (optional)
                </label>
                <input
                  type="text"
                  id="wayfinding-ticket"
                  value={ticketSection}
                  onChange={(e) => setTicketSection(e.target.value)}
                  placeholder="e.g. 134"
                  className="px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-xs text-zinc-850 dark:text-zinc-150 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="wayfinding-kickoff" className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
                  Minutes to kick-off
                </label>
                <input
                  type="text"
                  id="wayfinding-kickoff"
                  value={minutesToKickoff}
                  onChange={(e) => setMinutesToKickoff(e.target.value)}
                  placeholder="20"
                  className="px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-xs text-zinc-850 dark:text-zinc-150 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Ask a question */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <label htmlFor="wayfinding-query" className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
                  Ask a question (optional)
                </label>
                <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold shrink-0">
                  <Sparkles className="w-2.5 h-2.5" /> Powered by Gemini
                </span>
              </div>
              <textarea
                id="wayfinding-query"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. Where is the nearest step-free restroom?"
                rows="2"
                className="w-full p-3 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 font-medium resize-none"
              />
              <span className="text-[9px] text-zinc-450 dark:text-zinc-500 mt-0.5 font-medium leading-none">
                Free text is treated as data only and never as instructions.
              </span>
            </div>

            <button
              onClick={calculateRoute}
              disabled={calculating}
              className="w-full bg-[#064e3b] hover:bg-[#075e3d] text-white font-black text-xs uppercase tracking-wider min-h-11 rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {calculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calculating Route...</span>
                </>
              ) : (
                <span>Get help</span>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: ASSISTANCE ROUTE RESULTS */}
        <div className={`bg-white dark:bg-[#0c0c0f] border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[430px] ${
          highVisibility ? 'border-4 border-black dark:border-zinc-900 bg-white text-black font-bold' : 'border-zinc-200 dark:border-zinc-800'
        }`}>
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-150 border-b border-zinc-155 dark:border-zinc-900 pb-3 uppercase tracking-wider">
              Assistance
            </h3>

            {routeResult && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                  Your destination is <span className="font-black text-zinc-900 dark:text-white">{routeResult.destName}</span> ({routeResult.destLocation}). Follow the {routeResult.steps.length}-step route below (about {routeResult.distance} m). Crowd level there is currently {routeResult.crowd}.
                </p>

                {/* Tags Badges Row */}
                <div className="flex flex-wrap gap-2 py-1">
                  <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-955/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/25">
                    {routeResult.destName}
                  </span>
                  
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    routeResult.crowd === 'high' 
                      ? 'bg-red-50 dark:bg-red-955/20 border-red-500/25 text-red-650 dark:text-red-400'
                      : routeResult.crowd === 'moderate'
                        ? 'bg-amber-50 dark:bg-amber-955/20 border-amber-500/25 text-amber-650 dark:text-amber-450'
                        : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-505/25 text-emerald-650 dark:text-emerald-450'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    Crowd: {routeResult.crowd}
                  </span>

                  {needs.wheelchair ? (
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-955/20 border-blue-505/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full flex items-center gap-1">
                      ♿ Step-free / accessible
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 text-zinc-550 dark:text-zinc-400 px-3 py-1 rounded-full">
                      Mode: Standard
                    </span>
                  )}

                  {needs.lowVision && (
                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full border border-yellow-500/20">
                      👁️ High-Visibility Mode
                    </span>
                  )}

                  {needs.deaf && (
                    <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-955/20 border-purple-500/20 text-purple-655 dark:text-purple-400 px-3 py-1 rounded-full">
                      🔈 Flashing signs active
                    </span>
                  )}
                </div>

                {/* Route Steps List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                    Route
                  </h4>
                  <ol className="space-y-3.5">
                    {routeResult.steps.map((step) => (
                      <li key={step.num} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 font-extrabold text-[10px] shrink-0">
                          {step.num}
                        </span>
                        <div>
                          <span>{step.text.split(' ').slice(0, -1).join(' ')} </span>
                          <span className="text-[9px] bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded font-black text-zinc-550 dark:text-zinc-400 tracking-wide uppercase border border-zinc-200/55 dark:border-zinc-800/35">
                            {step.text.split(' ').pop()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* GenAI Answer Sub-Block */}
          {customQuestion.trim() && (
            <div className="mt-6 border-t border-zinc-150 dark:border-zinc-900 pt-4 space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-650 dark:text-emerald-450 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Assistant Assistance Note</span>
              </h4>
              {loadingAi ? (
                <div className="flex items-center gap-2 text-xs text-zinc-455 dark:text-zinc-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  <span>ArenaAssist AI is analyzing your question...</span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/5 dark:bg-emerald-400/5 border border-emerald-505/10 rounded-xl text-xs text-zinc-650 dark:text-zinc-355 leading-relaxed font-medium">
                  {sanitizeText(aiAnswer)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* INTERACTIVE STADIUM MAP (SVG) */}
      <div className={`bg-white dark:bg-[#0c0c0f] border rounded-2xl p-5 shadow-sm space-y-4 ${
        highVisibility ? 'border-4 border-black dark:border-zinc-900 bg-white text-black font-bold' : 'border-zinc-200 dark:border-zinc-800'
      }`}>
        <div>
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-150 flex items-center gap-2">
            <Compass className="w-4.5 h-4.5 text-emerald-500" />
            <span>ArenaAssist Live Telemetry Map</span>
          </h3>
          <p className="text-[10px] text-zinc-550 dark:text-zinc-400">
            Click any outer gate node to set your starting position. The mission-control HUD automatically calculates active waypoint trajectories.
          </p>
        </div>

        {/* Stadium Map Circle Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* SVG Map (col-span-2) */}
          <div className="lg:col-span-2 flex items-center justify-center max-w-[450px] mx-auto w-full bg-zinc-50/50 dark:bg-zinc-950/20 p-4 rounded-3xl border border-zinc-150 dark:border-zinc-900 relative overflow-hidden">
            
            {/* HUD Overlay Watermark */}
            <div className="absolute top-3 left-4 text-[8px] font-mono opacity-50 dark:opacity-30 select-none">
              SYSTEM: OPERATIONAL<br/>
              GRID: NY-METLIFE-W26<br/>
              GPS: 40.8135° N, 74.0745° W
            </div>

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
                className="cursor-pointer group outline-none"
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
                className="cursor-pointer group outline-none"
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
                className="cursor-pointer group outline-none"
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
                className="cursor-pointer group outline-none"
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
                className="cursor-pointer group outline-none"
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
                className="cursor-pointer group outline-none"
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
                className="cursor-pointer group outline-none"
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
                className="cursor-pointer group outline-none"
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
          </div>

          {/* HUD / Telemetry Details sidebar */}
          <div className="space-y-5">
            <div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest block mb-1">
                Live Node Telemetry
              </span>
              
              {/* Selected Gate HUD Card */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-855 p-4 rounded-2xl space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-200">
                    {startPoint.toUpperCase().replace('-', ' ')}
                  </span>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded font-black">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-650 dark:text-zinc-400 font-semibold">
                  <div className="flex justify-between">
                    <span>Congestion Status</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">{gateQueueInfo[startPoint].percentage}% Full</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wait Time</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-450 font-black">{gateQueueInfo[startPoint].wait} mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Checkpoint Security</span>
                    <span className="text-emerald-600 font-bold">Clear</span>
                  </div>
                </div>

                {/* Congestion Color progress bar */}
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${gateQueueInfo[startPoint].percentage}%`, 
                      backgroundColor: gateQueueInfo[startPoint].color 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest block">
                Queue Legend
              </span>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-3.5 rounded-md bg-[#166534] inline-block shrink-0"></span>
                  <span className="text-xs font-extrabold text-zinc-650 dark:text-zinc-350 font-mono">0-39% (Low delay)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-3.5 rounded-md bg-[#a16207] inline-block shrink-0"></span>
                  <span className="text-xs font-extrabold text-zinc-655 dark:text-zinc-355 font-mono">40-79% (Moderate wait)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-3.5 rounded-md bg-[#dc2626] inline-block shrink-0"></span>
                  <span className="text-xs font-extrabold text-zinc-650 dark:text-zinc-355 font-mono">80%+_ (Bottleneck)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-150 dark:border-zinc-900 pt-3 text-[10px] text-zinc-550 dark:text-zinc-450 leading-relaxed font-medium">
              Tapping gates dynamically modifies your start location and instantly recalibrates path directions. Alternate Gates are recommended if queues exceed 80%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
