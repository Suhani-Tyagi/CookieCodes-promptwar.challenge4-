import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  Users, ShieldAlert, Heart, Settings, Bell, 
  Activity, Shield, CheckCircle, Clock, AlertTriangle, 
  Send, Mic, Upload, Eye, Zap, Database, Key, HelpCircle,
  FileText, ShieldAlert as EvacIcon, Play, Radio
} from 'lucide-react';
import VectorPitchMap from './VectorPitchMap.jsx';

// -------------------------------------------------------------
// 1. FAN DASHBOARD VIEW
// -------------------------------------------------------------
export function FanDashboard({ matchHero, transitBoard, ecoPointsCard, seatLocator }) {
  const { t, userProfile } = useApp();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {matchHero}
        {seatLocator}
      </div>
      <div className="space-y-6">
        {ecoPointsCard}
        {transitBoard}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. VOLUNTEER DASHBOARD VIEW
// -------------------------------------------------------------
export function VolunteerDashboard() {
  const { telemetry, setTelemetry, complaints, addComplaint } = useApp();
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [visionReportType, setVisionReportType] = useState('Spill');
  const [visionImage, setVisionImage] = useState(null);
  const [visionClassifying, setVisionClassifying] = useState(false);
  const [visionResult, setVisionResult] = useState(null);

  // Simulated voice transcription
  const handleSimulateVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setVoiceText("Reporting debris blocking access ramp near block 102.");
      setIsListening(false);
    }, 2000);
  };

  const handleAddVoiceTask = () => {
    if (!voiceText) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: voiceText,
      status: 'Pending',
      priority: 'Medium'
    };
    setTelemetry(prev => ({
      ...prev,
      volunteerTasks: [newTask, ...prev.volunteerTasks]
    }));
    setVoiceText('');
  };

  // Simulated GLM Vision Triage
  const handleSimulateVision = () => {
    setVisionClassifying(true);
    setVisionResult(null);
    setTimeout(() => {
      let result = {};
      if (visionReportType === 'Spill') {
        result = {
          classification: "Liquid Spill / Slipping Hazard",
          confidence: "98.2%",
          severity: "Medium",
          resolution: "Janitorial dispatch recommended"
        };
      } else if (visionReportType === 'Seat') {
        result = {
          classification: "Broken Seating / Structural Damage",
          confidence: "95.6%",
          severity: "Low",
          resolution: "Maintenance crew notification"
        };
      } else {
        result = {
          classification: "Access Gate Obstruction",
          confidence: "92.4%",
          severity: "High",
          resolution: "Steward dispatch recommended"
        };
      }
      setVisionResult(result);
      setVisionClassifying(false);

      // Automatically log the issue to the incidents board!
      addComplaint({
        title: `GLM Vision: ${result.classification}`,
        category: result.classification,
        description: `Automated visual triage report. Severity: ${result.severity}. Action: ${result.resolution}`,
        severity: result.severity,
        location: "Block 104 Access Ramp"
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Task Checklist Panel */}
      <div className="lg:col-span-2 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            GPS-Prioritized Tasks
          </h3>
          <p className="text-[10px] text-zinc-400">Assigned live updates based on active ingress zone</p>
        </div>

        <div className="space-y-2">
          {telemetry.volunteerTasks.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">All tasks completed. Monitoring turnstiles...</p>
          ) : (
            telemetry.volunteerTasks.map((t) => (
              <div key={t.id} className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-200">{t.title}</p>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                    t.priority === 'High' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {t.priority}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setTelemetry(prev => ({
                      ...prev,
                      volunteerTasks: prev.volunteerTasks.filter(x => x.id !== t.id)
                    }));
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                >
                  Resolve
                </button>
              </div>
            ))
          )}
        </div>

        {/* Voice Note Transcription Widget */}
        <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-col gap-3">
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Voice-to-Task Transcriber</h4>
            <p className="text-[9px] text-zinc-400">Record a brief verbal update to generate a task</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSimulateVoice}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${
                isListening 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-850'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              {isListening ? 'Listening...' : 'Simulate Voice'}
            </button>
            <input
              type="text"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Spoken task details will appear here..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleAddVoiceTask}
              disabled={!voiceText}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Multimodal AI Triage / GLM Vision Panel */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-500" />
            GLM Vision Triage
          </h3>
          <p className="text-[10px] text-zinc-400">Classify incident visuals using multimodal model</p>
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase">Select Incident Type</label>
          <select
            value={visionReportType}
            onChange={(e) => setVisionReportType(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
          >
            <option value="Spill">Liquid Spill (Slipping Hazard)</option>
            <option value="Seat">Broken Seat (Structural Damage)</option>
            <option value="Obstruction">Access Obstruction (Security Risk)</option>
          </select>

          {/* Simulate Image Upload Area */}
          <div className="h-28 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1.5 p-4 text-center cursor-pointer hover:border-emerald-500/50 transition-all bg-zinc-900/40">
            <Upload className="w-5 h-5 text-zinc-550" />
            <span className="text-[10px] text-zinc-400 font-bold">Simulated Image Frame</span>
            <span className="text-[9px] text-zinc-500">Auto-injects mock photo matching type</span>
          </div>

          <button
            onClick={handleSimulateVision}
            disabled={visionClassifying}
            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black"
          >
            {visionClassifying ? 'Classifying image...' : 'Run Vision AI Classifier'}
          </button>

          {/* Classification result */}
          {visionResult && (
            <div className="mt-2 p-3 bg-zinc-900/80 border border-emerald-500/20 rounded-xl space-y-1.5 animate-fade-in text-[11px]">
              <p className="font-bold text-emerald-400 text-xs">Classification Report:</p>
              <p><span className="text-zinc-500">Label:</span> <span className="font-semibold text-zinc-200">{visionResult.classification}</span></p>
              <p><span className="text-zinc-500">Confidence:</span> <span className="font-semibold text-zinc-200">{visionResult.confidence}</span></p>
              <p><span className="text-zinc-500">Risk Severity:</span> <span className="font-bold text-amber-500">{visionResult.severity}</span></p>
              <p><span className="text-zinc-500">Dispatch recommendation:</span> <span className="font-semibold text-zinc-350">{visionResult.resolution}</span></p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// -------------------------------------------------------------
// 3. OPERATIONS DASHBOARD VIEW
// -------------------------------------------------------------
export function OperationsDashboard() {
  const { telemetry, setTelemetry, simulatorAct, triggerSimulatorAct } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Telemetry Board & Map */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* SVG Stadium Map */}
        <div className="flex-1 min-h-[350px]">
          <VectorPitchMap />
        </div>
      </div>

      {/* Control Console */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500" />
            Operations Telemetry
          </h3>
          <p className="text-[10px] text-zinc-400">Live feed summaries & sandbox overrides</p>
        </div>

        {/* Telemetry stats list */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl">
            <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1">Active Visitors</span>
            <p className="text-lg font-black text-zinc-100">{telemetry.activeVisitors.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl">
            <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1">Gate C Turnstiles</span>
            <p className={`text-lg font-black ${telemetry.gateCWait > 15 ? 'text-rose-500' : 'text-zinc-100'}`}>{telemetry.gateCWait}m</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl">
            <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1">Gate D Turnstiles</span>
            <p className="text-lg font-black text-zinc-100">{telemetry.gateDWait}m</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl">
            <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1">Gate B Inflow</span>
            <p className="text-lg font-black text-zinc-100">{telemetry.gateBWait}m</p>
          </div>
        </div>

        {/* Sandbox Override Sliders */}
        <div className="space-y-4 pt-4 border-t border-zinc-900">
          <div>
            <h4 className="text-xs font-bold text-zinc-200">AI "What-If" Simulation Sandbox</h4>
            <p className="text-[9px] text-zinc-550">Override telemetry parameters in real time</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-450">
                <span>Inflow Rate Multiplier</span>
                <span>{telemetry.activeVisitors > 70000 ? 'Peak' : 'Normal'}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="90000"
                step="5000"
                value={telemetry.activeVisitors}
                onChange={(e) => setTelemetry(prev => ({ ...prev, activeVisitors: parseInt(e.target.value) }))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-450">
                <span>Gate C Turnstile Throttle</span>
                <span>{telemetry.gateCWait}m</span>
              </div>
              <input
                type="range"
                min="1"
                max="45"
                value={telemetry.gateCWait}
                onChange={(e) => setTelemetry(prev => ({ ...prev, gateCWait: parseInt(e.target.value) }))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

// -------------------------------------------------------------
// 4. SECURITY DASHBOARD VIEW
// -------------------------------------------------------------
export function SecurityDashboard() {
  const { telemetry, setTelemetry } = useApp();
  const [passcode, setPasscode] = useState('');
  const [overrideUnlocked, setOverrideUnlocked] = useState(false);
  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideMessage, setOverrideMessage] = useState('');

  const handleUnlockOverride = () => {
    if (passcode === 'FIFA2026') {
      setOverrideUnlocked(true);
      setOverrideMessage('Passcode verified. Ready to trigger evacuation.');
    } else {
      setOverrideMessage('INVALID PASSCODE. Enter "FIFA2026".');
    }
  };

  const handleTriggerOverride = () => {
    setOverrideActive(!overrideActive);
    if (!overrideActive) {
      setOverrideMessage('CRITICAL: EVACUATION SIRENS TRIGGERED');
    } else {
      setOverrideMessage('Override deactivated. All clear.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left panel: Priority Threats & Drone Camera */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Threat tracker */}
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
              Priority Threat Board
            </h3>
            <p className="text-[10px] text-zinc-400">Real-time anomaly & safety threat detection alerts</p>
          </div>

          <div className="space-y-2">
            {telemetry.securityIncidents.length === 0 ? (
              <p className="text-xs text-emerald-500/80 font-bold bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl text-center">
                All zones cleared. No safety threats active.
              </p>
            ) : (
              telemetry.securityIncidents.map((s) => (
                <div key={s.id} className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-rose-500">{s.type}</span>
                    <p className="text-xs font-bold text-zinc-200 mt-0.5">{s.details}</p>
                    <span className="text-[8px] text-zinc-500 block mt-1">Status: {s.status}</span>
                  </div>
                  <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border ${
                    s.severity === 'Critical' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 animate-pulse' 
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}>
                    {s.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drone feed visualizer */}
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              Patrol Drone Feed Simulator
            </h3>
            <p className="text-[10px] text-zinc-400">Autonomous patrol drone camera feed metadata</p>
          </div>

          <div className="h-44 bg-black border border-zinc-850 rounded-xl overflow-hidden relative flex items-center justify-center">
            {/* Visual placeholder mimicking drone layout */}
            <div className="absolute inset-0 border border-emerald-500/10 pointer-events-none z-10"></div>
            <div className="absolute top-2 left-2 flex gap-1 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[8px] text-rose-500 font-black tracking-wider bg-black/50 px-2 py-0.5 rounded">REC LIVE</span>
            </div>
            
            <div className="text-center p-4">
              <Radio className="w-8 h-8 text-zinc-650 mx-auto animate-pulse mb-2" />
              <p className="text-xs font-mono font-bold text-zinc-200">Drone Patrol Cam - METLIFE GATE C</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-1">Telemetry: H:{telemetry.activeVisitors > 50000 ? '120m' : '80m'} | GPS: 40.8135° N, 74.0743° W</p>
            </div>

            {telemetry.droneStatus !== 'Stationary' && (
              <div className="absolute bottom-0 inset-x-0 bg-zinc-950/90 border-t border-emerald-500/20 p-2.5 text-[10px] font-mono leading-tight z-10 text-emerald-400">
                <span className="font-bold">STATUS: {telemetry.droneStatus}</span>
                <p className="text-zinc-350 text-[9px] mt-0.5">{telemetry.droneReport}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right panel: Evacuation Override Panel */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <EvacIcon className="w-4 h-4 text-rose-500 animate-pulse" />
            Evacuation Override Console
          </h3>
          <p className="text-[10px] text-zinc-400">Secure operations panic button trigger</p>
        </div>

        <div className="space-y-4">
          {!overrideUnlocked ? (
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-400 leading-normal">
                To unlock the evacuation override safety, enter the emergency security passcode <code className="text-rose-400 bg-rose-950/20 px-1 py-0.5 rounded">FIFA2026</code>:
              </p>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                onClick={handleUnlockOverride}
                className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-black"
              >
                Unlock Emergency Controls
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-28 border border-dashed border-rose-500/25 rounded-xl bg-rose-950/5 flex flex-col items-center justify-center p-4 text-center">
                <EvacIcon className="w-8 h-8 text-rose-500 animate-pulse mb-1.5" />
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Controls Unlocked</span>
              </div>

              <button
                onClick={handleTriggerOverride}
                className={`w-full py-3 rounded-xl text-white text-xs font-black transition-all ${
                  overrideActive 
                    ? 'bg-rose-700 hover:bg-rose-800 animate-pulse' 
                    : 'bg-zinc-900 hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                {overrideActive ? 'DISMISS SIRENS / CLEAR ALL' : 'ACTIVATE SIRENS / EVACUATE'}
              </button>
            </div>
          )}

          {overrideMessage && (
            <div className={`p-3 rounded-xl border text-xs text-center font-bold font-mono leading-tight ${
              overrideActive 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}>
              {overrideMessage}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// -------------------------------------------------------------
// 5. MEDICAL DASHBOARD VIEW
// -------------------------------------------------------------
export function MedicalDashboard() {
  const { telemetry, setTelemetry } = useApp();
  const [patientName, setPatientName] = useState('');
  const [injuryType, setInjuryType] = useState('Heat Exhaustion');
  const [location, setLocation] = useState('Block 102');
  const [triageResult, setTriageResult] = useState(null);

  const handleSimulateTriage = () => {
    if (!patientName) return;
    
    let triage = '';
    let recommendation = '';
    
    if (injuryType === 'Heat Exhaustion') {
      triage = 'Red';
      recommendation = 'Critical. Dispatch stretcher team immediately via Elevator Route.';
    } else if (injuryType === 'Dehydration') {
      triage = 'Yellow';
      recommendation = 'Moderate. Dispatch volunteer with rehydration fluid.';
    } else {
      triage = 'Green';
      recommendation = 'Minor. Suggest walking to First Aid room near Section 112.';
    }

    const newPatient = {
      id: `med-${Date.now()}`,
      name: `${patientName} (${location})`,
      issue: injuryType,
      priority: triage,
      status: triage === 'Red' ? 'Stretcher En-Route (Accessible Route)' : 'Assigned'
    };

    setTelemetry(prev => ({
      ...prev,
      medicalTriage: [newPatient, ...prev.medicalTriage],
      // If critical, auto draw stretcher path on map!
      routingPath: triage === 'Red' ? [{ x: 380, y: 180 }, { x: 300, y: 190 }, { x: 260, y: 220 }] : prev.routingPath
    }));

    setTriageResult({ triage, recommendation });
    setPatientName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Triage queue panel */}
      <div className="lg:col-span-2 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Patient Triage Priority Queue
          </h3>
          <p className="text-[10px] text-zinc-400">Live operational dispatch status of medical emergencies</p>
        </div>

        <div className="space-y-2">
          {telemetry.medicalTriage.length === 0 ? (
            <p className="text-xs text-emerald-500/80 font-bold bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl text-center">
              All sectors clear. No active medical dispatches.
            </p>
          ) : (
            telemetry.medicalTriage.map((p) => (
              <div key={p.id} className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-200">{p.name}</p>
                  <span className="text-[8px] text-zinc-450 block mt-1">Issue: {p.issue} | Status: {p.status}</span>
                </div>
                <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border ${
                  p.priority === 'Red' 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' 
                    : p.priority === 'Yellow'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {p.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Triage & Stretcher Routing Assistant */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-500" />
            AI Injury Triage Assistant
          </h3>
          <p className="text-[10px] text-zinc-400">Classify safety hazard and plan stretcher routing</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-zinc-450 uppercase">Spectator Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Liam Smith"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-zinc-450 uppercase">Select Incident Type</label>
            <select
              value={injuryType}
              onChange={(e) => setInjuryType(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="Heat Exhaustion">Heat Exhaustion / Syncope</option>
              <option value="Dehydration">Dehydration / Fatigue</option>
              <option value="Sprained Ankle">Sprained Ankle / Minor Trauma</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-zinc-450 uppercase">Location / Seat Block</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Block 102"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSimulateTriage}
            disabled={!patientName}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black"
          >
            Run AI Triage Recommendation
          </button>

          {triageResult && (
            <div className="mt-2 p-3 bg-zinc-900/80 border border-emerald-500/20 rounded-xl space-y-1 animate-fade-in text-[10px]">
              <p><span className="text-zinc-500">Triage level:</span> <span className={`font-black uppercase ${triageResult.triage === 'Red' ? 'text-rose-400 animate-pulse' : 'text-zinc-200'}`}>{triageResult.triage}</span></p>
              <p><span className="text-zinc-500">Instruction:</span> <span className="font-semibold text-zinc-300">{triageResult.recommendation}</span></p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// -------------------------------------------------------------
// 6. ADMIN DASHBOARD VIEW
// -------------------------------------------------------------
export function AdminDashboard() {
  const { userProfile, settings } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* AI Observability & Performance metrics */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Latency & Token Usage metrics */}
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              AI Observability Telemetry
            </h3>
            <p className="text-[10px] text-zinc-400">Generative model response latencies & token quotas</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-center">
              <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1">AI Latency</span>
              <p className="text-base font-black text-emerald-400">1.82s</p>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-center">
              <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1">Prompt Tokens</span>
              <p className="text-base font-black text-zinc-100">1,402</p>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-center">
              <span className="text-[8px] font-black uppercase text-zinc-500 block mb-1">Output Tokens</span>
              <p className="text-base font-black text-zinc-100">388</p>
            </div>
          </div>

          {/* Model Status details */}
          <div className="p-3.5 bg-zinc-900/60 border border-zinc-850 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-zinc-200">Gemini 1.5 Pro Engine Status</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Service: Normal</span>
          </div>
        </div>

        {/* Prompt Inspection Console */}
        <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              Prompt Inspection Console
            </h3>
            <p className="text-[10px] text-zinc-400">Review structural system instructions and prompt configurations</p>
          </div>

          <div className="bg-black/85 border border-zinc-850 rounded-xl p-3 text-[10px] font-mono text-zinc-450 leading-relaxed max-h-44 overflow-y-auto dark-scroll">
            <span className="text-emerald-400 font-black"># SYSTEM INSTRUCTIONS:</span>
            <p className="mt-1">
              "You are ArenaAssist, an AI-powered smart stadium operations companion. Your objective is to assist World Cup stadium stakeholders (Fans, Volunteers, Command Staff, Security, Medical) by providing turnstile flow predictions, accessible path generation, automated multimodal incident triage, and rules simplification. Format responses strictly in markdown..."
            </p>
            <span className="text-rose-400 font-black block mt-3"># ROLE PARAMETERS:</span>
            <p className="mt-1">
              Active Role: {userProfile.role} | Active Language: {userProfile.preferredLanguage} | Active MatchID: MOR-FRA-2026
            </p>
          </div>
        </div>

      </div>

      {/* Admin settings: API Key / System configs */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-black text-zinc-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-500" />
            API Key Provisioning
          </h3>
          <p className="text-[10px] text-zinc-400">Configure global Gemini AI engine keys</p>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-[10px] text-zinc-450 leading-normal">
            Status: <span className="text-emerald-400 font-bold">API Mode Configured ({settings.apiMode})</span>
          </p>
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-zinc-550 block">Gemini API Key</span>
            <input
              type="text"
              readOnly
              value={settings.geminiApiKey ? settings.geminiApiKey.replace(/./g, '*') : 'No Key Provided'}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-400 focus:outline-none"
            />
          </div>
          <p className="text-[9px] text-zinc-550 leading-normal">
            Keys are stored in browser localStorage. Toggles are managed in Settings Panel.
          </p>
        </div>

      </div>

    </div>
  );
}
