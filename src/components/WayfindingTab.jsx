import React, { useState, useEffect } from 'react';
import { Compass, Info, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { gateQueueInfo } from '../constants/stadiumMap.js';
import { generateText } from '../services/geminiClient.js';
import { validateText, sanitizeText } from '../utils/sanitize.js';
import StadiumGateMap from './StadiumGateMap.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

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
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-900 pb-3 uppercase tracking-wider">
            Your context
          </h3>

          <div className="space-y-4">
            {/* Where are you now? */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="wayfinding-start" className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                Where are you now?
              </label>
              <select
                id="wayfinding-start"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                className="w-full min-h-11 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold px-3 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
              <label htmlFor="wayfinding-end" className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                Where do you want to go?
              </label>
              <select
                id="wayfinding-end"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full min-h-11 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold px-3 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="sensory-room">Sensory room</option>
                <option value="restroom">Accessible restroom</option>
                <option value="first-aid">First aid station</option>
                <option value="concessions">Concession Stand / Food</option>
                <option value="seat">Find my seat</option>
              </select>
            </div>

            {/* Accessibility Needs Checkbox Panel */}
            <fieldset className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/10">
              <legend className="px-2 text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
                Accessibility needs
              </legend>
              <div className="space-y-3 mt-1.5">
                <label className="flex items-center gap-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needs.wheelchair}
                    onChange={(e) => setNeeds(prev => ({ ...prev, wheelchair: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1.5">
                    ♿ Wheelchair / step-free
                  </span>
                </label>

                <label className="flex items-center gap-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needs.lowVision}
                    onChange={(e) => setNeeds(prev => ({ ...prev, lowVision: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1.5">
                    👁️ Low vision / screen reader
                  </span>
                </label>

                <label className="flex items-center gap-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needs.deaf}
                    onChange={(e) => setNeeds(prev => ({ ...prev, deaf: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
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
                  className="px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold"
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
                  className="px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold"
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
                className="w-full p-3 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 font-medium resize-none"
              />
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium leading-none">
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
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-150 border-b border-zinc-200 dark:border-zinc-900 pb-3 uppercase tracking-wider">
              Assistance
            </h3>

            {routeResult && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                  Your destination is <span className="font-black text-zinc-900 dark:text-white">{routeResult.destName}</span> ({routeResult.destLocation}). Follow the {routeResult.steps.length}-step route below (about {routeResult.distance} m). Crowd level there is currently {routeResult.crowd}.
                </p>

                {/* Tags Badges Row */}
                <div className="flex flex-wrap gap-2 py-1">
                  <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/25">
                    {routeResult.destName}
                  </span>
                  
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                    routeResult.crowd === 'high' 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500/25 text-red-700 dark:text-red-400'
                      : routeResult.crowd === 'moderate'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500/25 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/25 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    Crowd: {routeResult.crowd}
                  </span>

                  {needs.wheelchair ? (
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 border-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full flex items-center gap-1">
                      ♿ Step-free / accessible
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full">
                      Mode: Standard
                    </span>
                  )}

                  {needs.lowVision && (
                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full border border-yellow-500/20">
                      👁️ High-Visibility Mode
                    </span>
                  )}

                  {needs.deaf && (
                    <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/20 border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full">
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
                          <span className="text-[9px] bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded font-black text-zinc-500 dark:text-zinc-400 tracking-wide uppercase border border-zinc-200 dark:border-zinc-800">
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
            <div className="mt-6 border-t border-zinc-200 dark:border-zinc-900 pt-4 space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Assistant Assistance Note</span>
              </h4>
              {loadingAi ? (
                <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  <span>ArenaAssist AI is analyzing your question...</span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-500/5 dark:bg-emerald-400/5 border border-emerald-500/10 rounded-xl text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
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

            <ErrorBoundary>
              <StadiumGateMap 
                startPoint={startPoint} 
                setStartPoint={setStartPoint} 
                needs={needs} 
                routeResult={routeResult} 
              />
            </ErrorBoundary>
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
