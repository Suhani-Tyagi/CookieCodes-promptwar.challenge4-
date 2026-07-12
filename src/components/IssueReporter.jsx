import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { validateText, sanitizeText } from '../utils/sanitize.js';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User, 
  Plus, 
  CheckCircle, 
  X, 
  Sliders, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Shield, 
  Truck, 
  UserCheck, 
  AlertCircle,
  Activity,
  Luggage,
  Heart,
  Globe,
  Accessibility,
  Camera
} from 'lucide-react';

const stadiumLocations = [
  "Gate 3 Turnstiles, Entrance Concourse",
  "Section 104 Main Tier, Row 12",
  "Concourse A Food Court, Sector 2",
  "Upper Tier Ramp 3B Escalator",
  "Restroom Zone C Lobby, Level 1",
  "Lot K Rideshare Pickup Zone",
  "West Plaza ADA ramp entry"
];

// High-fidelity Offline Vector Graphic Illustrations simulating real life photos
function IncidentGraphics({ category, className = "w-14 h-14 rounded-lg shrink-0 flex items-center justify-center border" }) {
  switch (category) {
    case "Crowd Congestion":
      return (
        <div className={`${className} bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 overflow-hidden`}>
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="crowdBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#Fee2e2" />
                <stop offset="100%" stopColor="#Fecaca" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" rx="12" fill="url(#crowdBg)" />
            <g fill="#ef4444" opacity="0.6">
              <circle cx="40" cy="55" r="10" /> 
              <path d="M25 70 C25 65, 55 65, 55 70 L50 95 L30 95 Z" />
              <circle cx="70" cy="50" r="9" /> 
              <path d="M58 63 C58 58, 82 58, 82 63 L78 95 L62 95 Z" fill="#3b82f6" />
              <circle cx="100" cy="52" r="11" /> 
              <path d="M85 68 C85 62, 115 62, 115 68 L110 95 L90 95 Z" fill="#10b981" />
              <circle cx="130" cy="48" r="8" /> 
              <path d="M120 60 C120 56, 140 56, 140 60 L136 95 L124 95 Z" fill="#f59e0b" />
              <circle cx="160" cy="55" r="10" /> 
              <path d="M145 70 C145 65, 175 65, 175 70 L170 95 L150 95 Z" />
            </g>
            <g stroke="#4b5563" strokeWidth="3" fill="none">
              <line x1="20" y1="85" x2="180" y2="85" />
              <line x1="50" y1="85" x2="50" y2="115" />
              <line x1="100" y1="85" x2="100" y2="115" />
              <line x1="150" y1="85" x2="150" y2="115" />
            </g>
            <rect x="55" y="15" width="90" height="20" rx="6" fill="#ef4444" />
            <text x="100" y="29" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">HIGH DENSITY (78%)</text>
          </svg>
        </div>
      );

    case "Slipping Hazard / Liquid Spill":
      return (
        <div className={`${className} bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 overflow-hidden`}>
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="spillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFbeb" />
                <stop offset="100%" stopColor="#Fef3c7" />
              </linearGradient>
              <linearGradient id="puddleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F59e0b" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" rx="12" fill="url(#spillGrad)" />
            <path d="M30 85 C 50 75, 70 95, 110 80 C 140 85, 170 70, 160 95 C 150 110, 100 105, 50 100 Z" fill="url(#puddleGrad)" opacity="0.8" />
            <circle cx="150" cy="80" r="4" fill="#d97706" />
            <circle cx="165" cy="90" r="3" fill="#d97706" />
            <g transform="translate(110, 60) rotate(45)">
              <rect x="0" y="0" width="18" height="30" rx="2" fill="#ef4444" />
              <ellipse cx="9" cy="0" rx="9" ry="3" fill="#f87171" />
              <line x1="2" y1="30" x2="16" y2="30" stroke="#b91c1c" strokeWidth="2" />
            </g>
            <g transform="translate(75, 25)">
              <path d="M15 70 L 25 15 L 30 15 L 40 70 Z" fill="#d97706" />
              <path d="M10 70 L 20 10 L 35 10 L 45 70 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <rect x="23" y="5" width="9" height="6" rx="2" fill="#d97706" />
              <path d="M 27 30 L 25 45 M 23 52 L 32 52" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
              <circle cx="27" cy="25" r="2.5" fill="#9a3412" />
              <path d="M 22 42 L 32 37" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case "Broken Seating / Facility Repair":
      return (
        <div className={`${className} bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 overflow-hidden`}>
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="seatBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#Dbeafe" />
                <stop offset="100%" stopColor="#Bfdbfe" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" rx="12" fill="url(#seatBg)" />
            <g transform="translate(40, 25)" fill="#3b82f6">
              <rect x="0" y="0" width="35" height="40" rx="6" />
              <rect x="0" y="32" width="35" height="20" rx="6" fill="#1d4ed8" />
              <rect x="5" y="52" width="5" height="20" fill="#475569" />
              <rect x="25" y="52" width="5" height="20" fill="#475569" />
            </g>
            <g transform="translate(100, 25) rotate(-15)" fill="#94a3b8">
              <rect x="0" y="0" width="35" height="40" rx="6" fill="#ef4444" />
              <rect x="5" y="28" width="35" height="20" rx="6" fill="#b91c1c" transform="rotate(25)" />
              <rect x="5" y="52" width="5" height="20" fill="#475569" />
              <rect x="25" y="52" width="5" height="20" fill="#475569" />
            </g>
            <circle cx="155" cy="85" r="16" fill="#f59e0b" />
            <path d="M155 76 L155 86 M155 91 L155 93" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "Lost Item / Luggage Check":
      return (
        <div className={`${className} bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/30 overflow-hidden`}>
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="lostBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0e7ff" />
                <stop offset="100%" stopColor="#C7d2fe" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" rx="12" fill="url(#lostBg)" />
            <g transform="translate(70, 25)" fill="#4f46e5">
              <rect x="10" y="15" width="40" height="50" rx="8" />
              <rect x="18" y="5" width="24" height="10" rx="2" fill="none" stroke="#4338ca" strokeWidth="4" />
              <rect x="18" y="35" width="24" height="20" rx="4" fill="#3730a3" />
              <line x1="30" y1="20" x2="30" y2="30" stroke="#e0e7ff" strokeWidth="2" />
            </g>
            <g transform="translate(100, 50)">
              <circle cx="25" cy="25" r="14" fill="none" stroke="#f59e0b" strokeWidth="4" />
              <line x1="35" y1="35" x2="50" y2="50" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case "Medical / First Aid Help":
      return (
        <div className={`${className} bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 overflow-hidden`}>
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="medBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#Ffe4e6" />
                <stop offset="100%" stopColor="#Fecdd3" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" rx="12" fill="url(#medBg)" />
            <g transform="translate(65, 25)">
              <rect width="70" height="60" rx="8" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
              <rect x="25" y="5" width="20" height="8" rx="2" fill="#ef4444" />
              <rect x="30" y="20" width="10" height="30" rx="2" fill="#ef4444" />
              <rect x="20" y="30" width="30" height="10" rx="2" fill="#ef4444" />
            </g>
          </svg>
        </div>
      );

    case "Accessibility Support":
      return (
        <div className={`${className} bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 overflow-hidden`}>
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="accBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D1fae5" />
                <stop offset="100%" stopColor="#A7f3d0" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" rx="12" fill="url(#accBg)" />
            <g transform="translate(75, 25)" fill="#065f46">
              <circle cx="25" cy="12" r="6" />
              <path d="M38 32 C35 25, 28 22, 22 22 C12 22, 6 30, 6 40 C6 50, 14 58, 24 58 C32 58, 38 52, 40 44 L32 42 C30 46, 26 48, 22 48 C16 48, 12 44, 12 38 C12 32, 17 28, 22 28 C26 28, 30 30, 31 34 Z" />
              <path d="M26 20 L38 28 L46 22" fill="none" stroke="#065f46" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case "Translation / Language Help":
    default:
      return (
        <div className={`${className} bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30 overflow-hidden`}>
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="langBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0f2fe" />
                <stop offset="100%" stopColor="#Bae6fd" />
              </linearGradient>
            </defs>
            <rect width="200" height="120" rx="12" fill="url(#langBg)" />
            <g transform="translate(45, 25)">
              <path d="M 0 25 C 0 10, 50 10, 50 25 C 50 40, 35 40, 30 45 L 20 40 L 0 40 Z" fill="#0284c7" />
              <text x="25" y="30" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
              <path d="M 60 40 C 60 25, 110 25, 110 40 C 110 55, 95 55, 90 60 L 80 55 L 60 55 Z" fill="#0369a1" />
              <text x="85" y="46" fill="#ffffff" fontSize="11" textAnchor="middle">あ</text>
            </g>
          </svg>
        </div>
      );
  }
}

export default function IssueReporter() {
  const { 
    complaints, 
    addComplaint, 
    updateComplaintStatus, 
    userProfile,
    t 
  } = useApp();

  const [selectedComplaint, setSelectedComplaint] = useState(complaints[0] || null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // New complaint form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Crowd Congestion');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const initiatingButtonRef = useRef(null);
  const modalRef = useRef(null);

  // Administrative simulation panel states
  const [simStatus, setSimStatus] = useState('In Progress');
  const [simDetail, setSimDetail] = useState('');
  const [simResolution, setSimResolution] = useState('');

  // Escape key listener & focus management for accessible dialog
  useEffect(() => {
    if (modalOpen) {
      initiatingButtonRef.current = document.activeElement;
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setModalOpen(false);
          setImageError('');
          setSubmitError('');
        }
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
              if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Auto-focus first input element inside modal
      setTimeout(() => {
        if (modalRef.current) {
          const firstInput = modalRef.current.querySelector('select, input, textarea, button');
          if (firstInput) firstInput.focus();
        }
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (initiatingButtonRef.current) {
          initiatingButtonRef.current.focus();
        }
      };
    }
  }, [modalOpen]);

  // Handle local image file uploads and convert to Base64 Data URL
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageError('');
    if (file) {
      // 2MB limit (production deployments need server-side re-validation before persisting uploaded images)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("File exceeds 2MB size limit.");
        return;
      }
      // MIME check
      if (!file.type.startsWith('image/')) {
        setImageError("Only image files are allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle location auto-detect simulation
  const handleDetectLocation = () => {
    setIsDetectingLoc(true);
    setTimeout(() => {
      const randomLoc = stadiumLocations[Math.floor(Math.random() * stadiumLocations.length)];
      setLocation(randomLoc);
      setIsDetectingLoc(false);
    }, 800);
  };

  // Submit new complaint
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!title.trim() || !description.trim() || !location.trim()) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    // Call validateText on free-text inputs
    const titleVal = validateText(title);
    if (!titleVal.valid) {
      setSubmitError(`Title: ${titleVal.message}`);
      return;
    }

    const descVal = validateText(description);
    if (!descVal.valid) {
      setSubmitError(`Description: ${descVal.message}`);
      return;
    }

    const locVal = validateText(location);
    if (!locVal.valid) {
      setSubmitError(`Location: ${locVal.message}`);
      return;
    }

    // Use uploaded base64 data URL if available, otherwise default to svg key
    const selectedImage = image || "svg";

    addComplaint({
      title: sanitizeText(title),
      category,
      description: sanitizeText(description),
      severity,
      location: sanitizeText(location),
      image: selectedImage
    });

    // Close and reset form
    setModalOpen(false);
    setTitle('');
    setCategory('Crowd Congestion');
    setDescription('');
    setSeverity('Medium');
    setLocation('');
    setImage('');
    setImageError('');
    setSubmitError('');
  };

  // Admin update simulation trigger
  const triggerAdminUpdate = () => {
    if (!selectedComplaint) return;
    
    let detail = simDetail.trim();
    if (!detail) {
      const defaults = {
        'In Triage': 'Incident assigned to local zone steward division.',
        'In Progress': 'Dispatched safety response crew and venue volunteers to coordinates.',
        'Resolved': 'Restoration confirmed. Site inspected and turnstiles verified operational.'
      };
      detail = defaults[simStatus] || "Steward operations updated progress.";
    }

    updateComplaintStatus(selectedComplaint.id, simStatus, detail, simResolution);
    
    setSelectedComplaint(prev => {
      const updatedTimeline = [...prev.timeline, {
        status: simStatus,
        date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        description: detail
      }];
      return {
        ...prev,
        status: simStatus,
        timeline: updatedTimeline,
        resolutionSummary: simResolution || prev.resolutionSummary
      };
    });

    setSimDetail('');
    setSimResolution('');
  };

  const isStaffOrOrganizer = userProfile.role === 'Venue Staff' || userProfile.role === 'Organizer';

  // Helper to render incident graphics (renders user uploaded base64 img or falls back to vectors)
  const renderIncidentThumb = (c, sizeClass = "w-12 h-12 rounded-xl shrink-0 border shadow-sm") => {
    if (c.image && c.image.startsWith('data:image/')) {
      return (
        <img 
          src={c.image} 
          alt={c.title} 
          className={`${sizeClass} object-cover`} 
        />
      );
    }
    return <IncidentGraphics category={c.category} className={`${sizeClass} flex items-center justify-center`} />;
  };

  const renderIncidentDetailImage = (c) => {
    if (c.image && c.image.startsWith('data:image/')) {
      return (
        <img 
          src={c.image} 
          alt={c.title} 
          className="w-full h-36 object-cover rounded-xl border border-zinc-200 dark:border-zinc-850 shadow-sm" 
        />
      );
    }
    return <IncidentGraphics category={c.category} className="w-full h-32 rounded-xl flex items-center justify-center border shadow-sm" />;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{t('navComplaints')}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Report safety hazards, crowd bottlenecks, broken seating, or check dispatch statuses.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newComplaintBtn')}</span>
        </button>
      </div>

      {/* Grid of Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Incident List (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-555 flex items-center gap-1.5 font-sans">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>{t('reportedIssues')} ({complaints.length})</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold font-sans">Click an incident to view dispatch history</span>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => {
              const isActiveSelection = selectedComplaint?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${
                    isActiveSelection
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/60 shadow-sm'
                      : 'bg-white dark:bg-[#0c0c0f] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    {/* Render uploader preview or vector fallback */}
                    {renderIncidentThumb(c, "w-12 h-12 rounded-xl shrink-0 border")}
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                          {c.category}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          c.severity === 'High' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                        }`}>
                          {c.severity}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{c.title}</h4>
                      <p className="text-[11px] text-zinc-555 dark:text-zinc-400 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{c.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100 dark:border-zinc-900">
                    <span className="text-[10px] text-zinc-400">{c.date}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      c.status === 'Resolved' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-450'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Dispatch Progress Track (col-span-1) */}
        <div className="space-y-6">
          
          {selectedComplaint && (
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
              
              {/* Card Header */}
              <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3 flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 block uppercase">Ticket ID: {selectedComplaint.id}</span>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-150 leading-tight">
                    {selectedComplaint.title}
                  </h3>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  selectedComplaint.status === 'Resolved' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                }`}>
                  {selectedComplaint.status}
                </span>
              </div>

              {/* Photos & description */}
              <div className="space-y-3">
                {/* Render uploaded image preview or vector fallback */}
                {renderIncidentDetailImage(selectedComplaint)}
                <p className="text-xs text-zinc-655 dark:text-zinc-450 leading-relaxed font-medium">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Operations Triage Timeline */}
              <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                <h4 className="font-bold text-xs text-zinc-555 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <span>{t('trackStatus')}</span>
                </h4>

                <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200 dark:before:bg-zinc-800">
                  {selectedComplaint.timeline.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                        step.status === 'Resolved' 
                          ? 'bg-emerald-500 border-white dark:border-[#0c0c0f]' 
                          : step.status === 'In Progress'
                          ? 'bg-blue-500 border-white dark:border-[#0c0c0f]'
                          : 'bg-amber-500 border-white dark:border-[#0c0c0f]'
                      }`}></span>
                      <div className="flex justify-between font-bold text-[10px] text-zinc-450">
                        <span>{step.status}</span>
                        <span>{step.date}</span>
                      </div>
                      <p className="text-zinc-655 dark:text-zinc-400 mt-0.5 leading-relaxed font-medium">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Summary */}
              {selectedComplaint.status === 'Resolved' && selectedComplaint.resolutionSummary && (
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl text-xs space-y-1">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Resolution Summary</span>
                  </h4>
                  <p className="text-zinc-650 dark:text-zinc-400 leading-relaxed font-medium">{selectedComplaint.resolutionSummary}</p>
                </div>
              )}

              {/* ADMINISTRATIVE TRIAGE CONTROL PANEL (Staff and Organizer only) */}
              {isStaffOrOrganizer && selectedComplaint.status !== 'Resolved' && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
                  <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-250 flex items-center gap-1.5 border-b border-zinc-150 dark:border-zinc-850 pb-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Command Dispatch Triage Desk</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    {/* Status Select */}
                    <div className="flex flex-col">
                      <label className="font-semibold text-zinc-550 mb-1">Set Incident Status</label>
                      <select
                        value={simStatus}
                        onChange={(e) => setSimStatus(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 text-xs font-semibold focus:outline-none"
                      >
                        <option value="In Triage">In Triage</option>
                        <option value="In Progress">In Progress (Dispatch)</option>
                        <option value="Resolved">Resolved (Close ticket)</option>
                      </select>
                    </div>

                    {/* Progress Detail */}
                    <div className="flex flex-col">
                      <label className="font-semibold text-zinc-550 mb-1">Log Progress Detail</label>
                      <input
                        type="text"
                        placeholder="e.g. Dispatched janitorial crew to clean floor..."
                        value={simDetail}
                        onChange={(e) => setSimDetail(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                      />
                    </div>

                    {/* Resolution Summary (only if setting to resolved) */}
                    {simStatus === 'Resolved' && (
                      <div className="flex flex-col">
                        <label className="font-semibold text-zinc-550 mb-1">Resolution Summary Details</label>
                        <textarea
                          placeholder="e.g. Hazard cleared using hazard cones, clean verified."
                          value={simResolution}
                          onChange={(e) => setSimResolution(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 text-xs font-medium focus:outline-none h-16 resize-none"
                        />
                      </div>
                    )}

                    <button
                      onClick={triggerAdminUpdate}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Dispatch Operational Update</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>      {/* NEW INCIDENT REPORT MODAL */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            ref={modalRef}
            className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl animate-fade-in"
          >
            
            {/* Header */}
            <div className="fifa-strip shrink-0"></div>
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
              <h3 id="modal-title" className="font-extrabold text-sm text-zinc-900 dark:text-zinc-550 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-500" />
                <span>{t('newComplaintBtn')}</span>
              </h3>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setImageError('');
                  setSubmitError('');
                }}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-zinc-555">
              
              {submitError && (
                <div className="p-3 bg-red-550/10 text-red-500 border border-red-500/20 rounded-xl font-bold">
                  {submitError}
                </div>
              )}

              {/* Category */}
              <div className="flex flex-col">
                <label htmlFor="issue-category-select" className="font-semibold text-zinc-500 mb-1">{t('issueCategory')}</label>
                <select
                  id="issue-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-255 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none"
                >
                  <option value="Crowd Congestion">Crowd Congestion</option>
                  <option value="Slipping Hazard / Liquid Spill">Slipping Hazard / Liquid Spill</option>
                  <option value="Broken Seating / Facility Repair">Broken Seating / Facility Repair</option>
                  <option value="Lost Item / Luggage Check">Lost Item / Luggage Check</option>
                  <option value="Medical / First Aid Help">Medical / First Aid Help</option>
                  <option value="Accessibility Support">Accessibility Support</option>
                  <option value="Translation / Language Help">Translation / Language Help</option>
                </select>
              </div>

              {/* Title */}
              <div className="flex flex-col">
                <label htmlFor="issue-title-input" className="font-semibold text-zinc-500 mb-1">Brief Summary Title</label>
                <input
                  type="text"
                  id="issue-title-input"
                  required
                  placeholder="e.g. Bottleneck outside Gate 3 access turnstile"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none font-medium"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label htmlFor="issue-desc-textarea" className="font-semibold text-zinc-500 mb-1">{t('issueDescription')}</label>
                <textarea
                  id="issue-desc-textarea"
                  required
                  placeholder="Describe the stadium incident, specific row/seat details, or support needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none h-20 resize-none font-medium"
                />
              </div>

              {/* Real Photo Upload Input (Reads file as Base64 Data URL) */}
              <div className="flex flex-col">
                <label htmlFor="issue-image-file" className="font-semibold text-zinc-500 mb-1">Upload Real Incident Photo</label>
                <div className="border-2 border-dashed border-zinc-250 dark:border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition-colors relative">
                  <input
                    id="issue-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {image ? (
                    <div className="space-y-2">
                      <img src={image} alt="Upload preview" className="h-16 mx-auto rounded-lg object-cover border" />
                      <span className="text-[10px] text-emerald-500 block font-bold">✓ Real Photo Attached Successfully!</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Camera className="w-5 h-5 mx-auto text-zinc-400" />
                      <span className="text-[10px] text-zinc-500 block">Click to select or drag real photo here</span>
                      <span className="text-[8px] text-zinc-400 block font-normal">PNG, JPG formats accepted</span>
                    </div>
                  )}
                </div>
                {imageError && (
                  <span className="text-[10px] text-red-500 font-bold mt-1 block">{imageError}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Severity */}
                <div className="flex flex-col">
                  <label htmlFor="issue-severity-select" className="font-semibold text-zinc-500 mb-1">{t('issueSeverity')}</label>
                  <select
                    id="issue-severity-select"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-255 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none"
                  >
                    <option value="Low">Low (Informational)</option>
                    <option value="Medium">Medium (Attention needed)</option>
                    <option value="High">Critical (Dispatch dispatch)</option>
                  </select>
                </div>

                {/* Location */}
                <div className="flex flex-col relative">
                  <label htmlFor="issue-location-input" className="font-semibold text-zinc-550 mb-1">{t('issueLocation')}</label>
                  <input
                    type="text"
                    id="issue-location-input"
                    required
                    placeholder="e.g. Section 104 Row 12"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="px-3 py-2 pr-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLoc}
                    className="absolute right-2.5 top-7 text-zinc-400 hover:text-emerald-500 transition-colors"
                    title="Simulate locating via GPS"
                  >
                    <MapPin className={`w-4 h-4 ${isDetectingLoc ? 'animate-bounce text-emerald-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setImageError('');
                    setSubmitError('');
                  }}
                  className="px-4 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow"
                >
                  {t('submitBtn')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
