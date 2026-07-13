import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getRelativeMatchDate, MATCH_OFFSETS, mockMatches } from '../utils/relativeMatchDates.js';
import { computeMatchStatus } from '../utils/matchStatus.js';

export { computeMatchStatus };

const AppContext = createContext();

// Multilingual Dictionary for FIFA 2026
const translations = {
  en: {
    title: "ArenaAssist 2026",
    subtitle: "FIFA Smart Stadium Companion",
    navDashboard: "Dashboard",
    navCompanion: "AI Companion",
    navServices: "Stadium Services",
    navComplaints: "Incidents Board",
    navSettings: "Settings & Profile",
    navScores: "Match Center",
    navFood: "Food & Drink",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    searchPlaceholder: "Search gates, concessions, shuttles, or policies...",
    reportedIssues: "Active Stadium Incidents",
    resolvedIssues: "Resolved Tickets",
    inProgressIssues: "In Progress",
    underReviewIssues: "Under Triage",
    statusResolved: "Resolved",
    statusInProgress: "In Progress",
    statusInReview: "In Triage",
    statusSubmitted: "Submitted",
    severityHigh: "Critical",
    severityMedium: "Moderate",
    severityLow: "Low",
    newComplaintBtn: "Report Stadium Issue",
    submitBtn: "Submit Report",
    cancelBtn: "Cancel",
    welcomeBack: "Welcome back,",
    profileCompleted: "Fan Matchday Status",
    recommendedForYou: "Matchday Recommendations",
    viewDetails: "Details",
    aiAssistantHelp: "stadium operations assistant",
    voiceSimulate: "Voice Assistance",
    voiceListening: "Listening... speak now",
    sendBtn: "Send",
    simplifierTitle: "Rules & Policy Simplifier",
    simplifierPlaceholder: "Paste stadium rules, code of conduct, or prohibited items lists to summarize them...",
    simplifyBtn: "Simplify Regulations",
    documentAssistant: "Quick Rules & Checklist",
    requiredDocs: "What to Bring",
    eligibilityCriteria: "Important Rules",
    applyNow: "Open Directions",
    issueCategory: "Incident Category",
    issueDescription: "Incident Details",
    issueSeverity: "Severity Level",
    issueLocation: "Stadium Location / Block",
    issueUpload: "Incident Photo (Simulated)",
    uploadPlaceholder: "Click to select or drag photo here",
    trackStatus: "Track Incident Dispatch",
    timelineSubmitted: "Report Received",
    timelineReviewed: "Triage & Dispatched",
    timelineWorkStarted: "Response Team On-Site",
    timelineResolved: "Incident Resolved",
    settingsTitle: "Companion Settings",
    apiToggleLabel: "Gemini AI Engine Mode",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "Enter your Gemini API key (AIzaSy...)",
    saveBtn: "Save Configuration",
    simulatedEngine: "Simulated AI Engine (Offline)",
    liveEngine: "Live Gemini Engine",
    feedbackMsg: "Configuration saved!",
    notificationTitle: "Alerts & Notifications"
  },
  es: {
    title: "ArenaAssist 2026",
    subtitle: "FIFA Asistente Inteligente de Estadios",
    navDashboard: "Tablero",
    navCompanion: "Asistente IA",
    navServices: "Servicios del Estadio",
    navComplaints: "Panel de Incidentes",
    navSettings: "Perfil y Ajustes",
    navScores: "Centro de Partido",
    navFood: "Comida y Bebida",
    themeLight: "Modo Claro",
    themeDark: "Modo Oscuro",
    searchPlaceholder: "Buscar accesos, comida, transporte o reglas...",
    reportedIssues: "Incidentes Activos en el Estadio",
    resolvedIssues: "Resueltos",
    inProgressIssues: "En Progreso",
    underReviewIssues: "En Triaje",
    statusResolved: "Resuelto",
    statusInProgress: "En Progreso",
    statusInReview: "En Triaje",
    statusSubmitted: "Enviado",
    severityHigh: "Crítica",
    severityMedium: "Moderada",
    severityLow: "Baja",
    newComplaintBtn: "Reportar Incidente",
    submitBtn: "Enviar Reporte",
    cancelBtn: "Cancelar",
    welcomeBack: "Bienvenido,",
    profileCompleted: "Estado de Entrada de Fan",
    recommendedForYou: "Recomendaciones del Día",
    viewDetails: "Detalles",
    aiAssistantHelp: "asistente de operaciones",
    voiceSimulate: "Asistencia de Voz",
    voiceListening: "Escuchando... hable ahora",
    sendBtn: "Enviar",
    simplifierTitle: "Simplificador de Reglas",
    simplifierPlaceholder: "Pegue reglas del estadio o la lista de objetos prohibidos para resumir...",
    simplifyBtn: "Simplificar Reglas",
    documentAssistant: "Reglas Rápidas y Checklist",
    requiredDocs: "Qué Llevar",
    eligibilityCriteria: "Reglas Importantes",
    applyNow: "Abrir Indicaciones",
    issueCategory: "Categoría del Incidente",
    issueDescription: "Detalles del Incidente",
    issueSeverity: "Nivel de Gravedad",
    issueLocation: "Ubicación del Estadio / Bloque",
    issueUpload: "Foto del Incidente (Simulado)",
    uploadPlaceholder: "Arrastre o seleccione la foto aquí",
    trackStatus: "Seguimiento de Despacho",
    timelineSubmitted: "Reporte Recibido",
    timelineReviewed: "Triaje y Asignación",
    timelineWorkStarted: "Equipo en el Lugar",
    timelineResolved: "Incidente Resuelto",
    settingsTitle: "Ajustes del Asistente",
    apiToggleLabel: "Modo del Motor Gemini IA",
    apiKeyLabel: "Clave API de Gemini",
    apiKeyPlaceholder: "Ingrese su clave API de Gemini (AIzaSy...)",
    saveBtn: "Guardar Ajustes",
    simulatedEngine: "Motor IA Simulado (Offline)",
    liveEngine: "Motor Gemini en Vivo",
    feedbackMsg: "¡Ajustes guardados con éxito!",
    notificationTitle: "Alertas y Notificaciones"
  }
};

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error parsing userProfile from localStorage:", e);
    }
    return {
      name: "Marcus Miller",
      email: "marcus.miller@fifafan.com",
      phone: "+1 415-555-2026",
      city: "San Francisco",
      country: "United States",
      preferredLanguage: "en",
      ticketCategory: "Category 1 (Premium)",
      seatNumber: "Section 104, Row 12, Seat 15",
      role: "Organizer",
      ecoPoints: 350
    };
  });

  // Incidents board state
  const [complaints, setComplaints] = useState([
    {
      id: "INC-2026-102",
      title: "Liquid Spill near Concourse A",
      category: "Slipping Hazard / Liquid Spill",
      description: "A large soda spill has occurred near the food stalls on Concourse A, posing a sliding hazard for fans returning to their seats.",
      severity: "Medium",
      status: "In Progress",
      location: "Concourse A, near Gate 4 Concessions",
      date: "Jul 08, 2026",
      image: "spill",
      timeline: [
        { status: "Submitted", date: "Jul 08, 2026 11:15 AM", description: "Report registered by fan Marcus Miller." },
        { status: "In Triage", date: "Jul 08, 2026 11:22 AM", description: "Assigned to Venue Janitorial Team - Sector 2." },
        { status: "In Progress", date: "Jul 08, 2026 11:35 AM", description: "Cleaning staff dispatched with safety hazard signs." }
      ],
      resolutionSummary: ""
    },
    {
      id: "INC-2026-105",
      title: "Gate 3 Entrance Congestion",
      category: "Crowd Congestion",
      description: "Turnstile scanner #4 is offline at Gate 3. Inflow rates have dropped, causing a massive bottleneck outside the safety perimeter.",
      severity: "High",
      status: "In Triage",
      location: "Gate 3 Entrance / Access Ramp",
      date: "Jul 08, 2026",
      image: "crowd",
      timeline: [
        { status: "Submitted", date: "Jul 08, 2026 11:45 AM", description: "System automated alarm generated due to flow discrepancy." },
        { status: "In Triage", date: "Jul 08, 2026 11:50 AM", description: "Escalated to IT Stadium Hardware & Chief Steward Gate Operations." }
      ],
      resolutionSummary: ""
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "alert", text: "Gate 3 is experiencing delays. Fans are advised to redirect to Gate 4 or Gate 5.", time: "10 mins ago", active: true },
    { id: 2, type: "success", text: "Received 50 Eco-Points! Thanks for participating in the Cup Return Reward program.", time: "45 mins ago", active: true }
  ]);

  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Hello! I am your ArenaAssist Stadium Companion for the FIFA World Cup 2026.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [settings, setSettings] = useState(() => {
    try {
      return {
        apiMode: localStorage.getItem('gemini_api_mode') || "live"
      };
    } catch (e) {
      return {
        apiMode: "live"
      };
    }
  });

  const [liveDemoActive, setLiveDemoActive] = useState(false);

  // --- COMPREHENSIVE MATCH DATABASE (Group stage to QFs) ---
  const [matchesList, setMatchesList] = useState(mockMatches);

  const [selectedMatchId, setSelectedMatchId] = useState("M1");

  const computedMatchesList = useMemo(() => {
    return matchesList.map(m => ({
      ...m,
      status: computeMatchStatus(m, new Date(), liveDemoActive, selectedMatchId)
    }));
  }, [matchesList, liveDemoActive, selectedMatchId]);

  const activeMatch = useMemo(() => {
    return computedMatchesList.find(m => m.id === selectedMatchId) || computedMatchesList[0];
  }, [computedMatchesList, selectedMatchId]);

  // --- FULL 12 GROUPS STANDINGS (Group A to Group L) ---
  const initialAllGroupsStandings = {
    "Group A": [
      { rank: 1, team: "Mexico 🇲🇽", played: 3, won: 2, drawn: 1, lost: 0, gd: 3, points: 7 },
      { rank: 2, team: "South Korea 🇰🇷", played: 3, won: 1, drawn: 2, lost: 0, gd: 2, points: 5 },
      { rank: 3, team: "Czechia 🇨🇿", played: 3, won: 1, drawn: 0, lost: 2, gd: -1, points: 3 },
      { rank: 4, team: "South Africa 🇿🇦", played: 3, won: 0, drawn: 1, lost: 2, gd: -4, points: 1 }
    ],
    "Group B": [
      { rank: 1, team: "Switzerland 🇨🇭", played: 3, won: 2, drawn: 1, lost: 0, gd: 2, points: 7 },
      { rank: 2, team: "Canada 🇨🇦", played: 3, won: 2, drawn: 0, lost: 1, gd: 3, points: 6 },
      { rank: 3, team: "Qatar 🇶🇦", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
      { rank: 4, team: "Bosnia & Herz. 🇧🇦", played: 3, won: 0, drawn: 1, lost: 2, gd: -3, points: 1 }
    ],
    "Group C": [
      { rank: 1, team: "Morocco 🇲🇦", played: 3, won: 3, drawn: 0, lost: 0, gd: 6, points: 9 },
      { rank: 2, team: "Brazil 🇧🇷", played: 3, won: 2, drawn: 0, lost: 1, gd: 4, points: 6 },
      { rank: 3, team: "Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
      { rank: 4, team: "Haiti 🇭🇹", played: 3, won: 0, drawn: 0, lost: 3, gd: -8, points: 0 }
    ],
    "Group D": [
      { rank: 1, team: "Belgium 🇧🇪", played: 3, won: 2, drawn: 1, lost: 0, gd: 4, points: 7 },
      { rank: 2, team: "United States 🇺🇸", played: 3, won: 1, drawn: 2, lost: 0, gd: 2, points: 5 },
      { rank: 3, team: "Paraguay 🇵🇾", played: 3, won: 1, drawn: 1, lost: 1, gd: 0, points: 4 },
      { rank: 4, team: "Australia 🇦🇺", played: 3, won: 0, drawn: 0, lost: 3, gd: -6, points: 0 }
    ],
    "Group E": [
      { rank: 1, team: "Germany 🇩🇪", played: 3, won: 2, drawn: 1, lost: 0, gd: 5, points: 7 },
      { rank: 2, team: "Ecuador 🇪🇨", played: 3, won: 2, drawn: 0, lost: 1, gd: 2, points: 6 },
      { rank: 3, team: "Côte d'Ivoire 🇨🇮", played: 3, won: 1, drawn: 1, lost: 1, gd: 0, points: 4 },
      { rank: 4, team: "Curaçao 🇨🇼", played: 3, won: 0, drawn: 0, lost: 3, gd: -7, points: 0 }
    ],
    "Group F": [
      { rank: 1, team: "Netherlands 🇳🇱", played: 3, won: 3, drawn: 0, lost: 0, gd: 7, points: 9 },
      { rank: 2, team: "Japan 🇯🇵", played: 3, won: 2, drawn: 0, lost: 1, gd: 3, points: 6 },
      { rank: 3, team: "Sweden 🇸🇪", played: 3, won: 1, drawn: 0, lost: 2, gd: -3, points: 3 },
      { rank: 4, team: "Tunisia 🇹🇳", played: 3, won: 0, drawn: 0, lost: 3, gd: -7, points: 0 }
    ],
    "Group G": [
      { rank: 1, team: "Egypt 🇪🇬", played: 3, won: 2, drawn: 1, lost: 0, gd: 3, points: 7 },
      { rank: 2, team: "Iran 🇮🇷", played: 3, won: 2, drawn: 0, lost: 1, gd: 2, points: 6 },
      { rank: 3, team: "New Zealand 🇳🇿", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
      { rank: 4, team: "Turkey 🇹🇷", played: 3, won: 0, drawn: 1, lost: 2, gd: -3, points: 1 }
    ],
    "Group H": [
      { rank: 1, team: "Spain 🇪🇸", played: 3, won: 2, drawn: 1, lost: 0, gd: 4, points: 7 },
      { rank: 2, team: "Uruguay 🇺🇾", played: 3, won: 2, drawn: 0, lost: 1, gd: 2, points: 6 },
      { rank: 3, team: "Saudi Arabia 🇸🇦", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
      { rank: 4, team: "Cabo Verde 🇨🇻", played: 3, won: 0, drawn: 1, lost: 2, gd: -4, points: 1 }
    ],
    "Group I": [
      { rank: 1, team: "France 🇫🇷", played: 3, won: 3, drawn: 0, lost: 0, gd: 6, points: 9 },
      { rank: 2, team: "Norway 🇳🇴", played: 3, won: 2, drawn: 0, lost: 1, gd: 3, points: 6 },
      { rank: 3, team: "Senegal 🇸🇳", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
      { rank: 4, team: "Iraq 🇮🇶", played: 3, won: 0, drawn: 0, lost: 3, gd: -7, points: 0 }
    ],
    "Group J": [
      { rank: 1, team: "Argentina 🇦🇷", played: 3, won: 2, drawn: 1, lost: 0, gd: 5, points: 7 },
      { rank: 2, team: "Austria 🇦🇹", played: 3, won: 2, drawn: 0, lost: 1, gd: 1, points: 6 },
      { rank: 3, team: "Algeria 🇩🇿", played: 3, won: 1, drawn: 1, lost: 1, gd: 0, points: 4 },
      { rank: 4, team: "Jordan 🇯🇴", played: 3, won: 0, drawn: 0, lost: 3, gd: -6, points: 0 }
    ],
    "Group K": [
      { rank: 1, team: "Portugal 🇵🇹", played: 3, won: 2, drawn: 1, lost: 0, gd: 4, points: 7 },
      { rank: 2, team: "Colombia 🇨🇴", played: 3, won: 2, drawn: 0, lost: 1, gd: 3, points: 6 },
      { rank: 3, team: "DR Congo 🇨🇩", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
      { rank: 4, team: "Uzbekistan 🇺🇿", played: 3, won: 0, drawn: 1, lost: 2, gd: -5, points: 1 }
    ],
    "Group L": [
      { rank: 1, team: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 3, won: 3, drawn: 0, lost: 0, gd: 7, points: 9 },
      { rank: 2, team: "Croatia 🇭🇷", played: 3, won: 2, drawn: 0, lost: 1, gd: 2, points: 6 },
      { rank: 3, team: "Ghana 🇬🇭", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
      { rank: 4, team: "Panama 🇵🇦", played: 3, won: 0, drawn: 0, lost: 3, gd: -7, points: 0 }
    ]
  };

  const [allGroupsStandings, setAllGroupsStandings] = useState(initialAllGroupsStandings);

  // Group Standings shortcut
  const groupStandings = [
    { rank: 1, team: "Morocco 🇲🇦", won: 3, drawn: 1, lost: 0, goalsFor: 9, goalsAgainst: 2, points: 10 },
    { rank: 2, team: "France 🇫🇷", won: 3, drawn: 0, lost: 1, goalsFor: 7, goalsAgainst: 3, points: 9 },
    { rank: 3, team: "Belgium 🇧🇪", won: 2, drawn: 1, lost: 1, goalsFor: 8, goalsAgainst: 5, points: 7 },
    { rank: 4, team: "Argentina 🇦🇷", won: 2, drawn: 1, lost: 1, goalsFor: 8, goalsAgainst: 6, points: 7 },
    { rank: 5, team: "Spain 🇪🇸", won: 2, drawn: 1, lost: 1, goalsFor: 6, goalsAgainst: 4, points: 7 },
    { rank: 6, team: "Norway 🇳🇴", won: 2, drawn: 0, lost: 2, goalsFor: 5, goalsAgainst: 4, points: 6 }
  ];

  // Top player statistics split by Goals, Assists, Clean Sheets, Discipline
  const initialTopStatsData = {
    goals: [
      { rank: 1, name: "Lionel Messi", country: "ARG 🇦🇷", value: "5 goals", subtext: "3 Assists, Rating 9.20", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg", jerseyColor: "#74ACDF", number: "10" },
      { rank: 2, name: "Erling Haaland", country: "NOR 🇳🇴", value: "4 goals", subtext: "1 Assist, Rating 9.05", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg", jerseyColor: "#BA0C2F", number: "9" },
      { rank: 3, name: "Kevin De Bruyne", country: "BEL 🇧🇪", value: "3 goals", subtext: "4 Assists, Rating 8.90", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg", jerseyColor: "#000000", number: "7" },
      { rank: 4, name: "Hakim Ziyech", country: "MAR 🇲🇦", value: "3 goals", subtext: "2 Assists, Rating 8.65", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hakim_Ziyech_2021.jpg", jerseyColor: "#006241", number: "7" },
      { rank: 5, name: "Kylian Mbappé", country: "FRA 🇫🇷", value: "3 goals", subtext: "1 Assist, Rating 8.60", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Kylian_Mbappé_2018.jpg", jerseyColor: "#002395", number: "10" }
    ],
    assists: [
      { rank: 1, name: "Kevin De Bruyne", country: "BEL 🇧🇪", value: "4 assists", subtext: "3 Goals, Rating 8.90", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg", jerseyColor: "#000000", number: "7" },
      { rank: 2, name: "Lionel Messi", country: "ARG 🇦🇷", value: "3 assists", subtext: "5 Goals, Rating 9.20", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg", jerseyColor: "#74ACDF", number: "10" },
      { rank: 3, name: "Jude Bellingham", country: "ENG 🏴󠁧󠁢󠁥󠁮󠁧󠁿", value: "3 assists", subtext: "2 Goals, Rating 8.50", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg", jerseyColor: "#FFFFFF", number: "10" }
    ],
    cleanSheets: [
      { rank: 1, name: "Yann Sommer", country: "SUI 🇨🇭", value: "3 clean sheets", subtext: "8 Saves, Rating 8.80", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/FC_Salzburg_gegen_Inter_Mailand_%28Testspiel_2023-08-09%29_69.jpg", jerseyColor: "#D52B1E", number: "1" },
      { rank: 2, name: "Yassine Bounou", country: "MAR 🇲🇦", value: "3 clean sheets", subtext: "6 Saves, Rating 8.50", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Yassine_Bounou_Brazil_V_Morocco_13_June_2026-169.jpg", jerseyColor: "#006241", number: "1" }
    ],
    discipline: [
      { rank: 1, name: "Granit Xhaka", country: "SUI 🇨🇭", value: "3 yellow cards", subtext: "0 Red, Rating 8.10", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Granit_Xhaka_%28cropped%29.jpg", jerseyColor: "#D52B1E", number: "10" },
      { rank: 2, name: "Sofyan Amrabat", country: "MAR 🇲🇦", value: "2 yellow cards", subtext: "0 Red, Rating 8.30", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Sofyan_Amrabat_Brazil_V_Morocco_13_June_2026-63.jpg", jerseyColor: "#006241", number: "4" }
    ]
  };

  const [topStatsData, setTopStatsData] = useState(initialTopStatsData);
  const [isSportsDataSimulated, setIsSportsDataSimulated] = useState(true);
  const [sportsDataLastUpdated, setSportsDataLastUpdated] = useState(null);

  const refreshSportsData = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      const res = await fetch(`${origin}/api/sports-data`);
      if (!res.ok) throw new Error('API-SPORTS status error');
      const data = await res.json();
      if (data.matchesList) setMatchesList(data.matchesList);
      if (data.allGroupsStandings) setAllGroupsStandings(data.allGroupsStandings);
      if (data.topStatsData) setTopStatsData(data.topStatsData);
      setIsSportsDataSimulated(!!data.isSimulated);
      setSportsDataLastUpdated(data.lastUpdated);
    } catch (err) {
      console.warn('Failed to fetch live sports data, falling back to simulated:', err);
      setIsSportsDataSimulated(true);
      setSportsDataLastUpdated(Date.now());
    }
  };

  useEffect(() => {
    refreshSportsData();
  }, []);

  const topPlayersStats = topStatsData.goals;

  // --- Live match updates simulation engine ---
  useEffect(() => {
    if (!liveDemoActive || settings.apiMode !== 'simulated') return;

    const scoreInterval = setInterval(() => {
      setMatchesList(prevList => {
        return prevList.map(m => {
          if (m.id === selectedMatchId) {
            const currentMinStr = m.minute.includes("'") ? m.minute : "15'";
            const currentMin = parseInt(currentMinStr);
            
            if (currentMin >= 90) {
              return {
                ...m,
                status: 'COMPLETED',
                minute: 'Full Time'
              };
            }

            const nextMin = currentMin + 1;
            const updatedEvents = [...m.events];
            let newScoreA = m.scoreA;
            let newScoreB = m.scoreB;

            const rand = Math.random();
            if (rand < 0.15) {
              const eventType = Math.random() > 0.5 ? 'Goal' : 'Yellow Card';
              if (eventType === 'Goal') {
                const scoringTeam = Math.random() > 0.5 ? 'teamA' : 'teamB';
                if (scoringTeam === 'teamA') {
                  newScoreA += 1;
                  updatedEvents.push({
                    minute: `${nextMin}'`,
                    player: m.bestPlayerDetails ? m.bestPlayerDetails.name : "Team Player",
                    type: 'Goal'
                  });
                } else {
                  newScoreB += 1;
                  updatedEvents.push({
                    minute: `${nextMin}'`,
                    player: m.opponentBestPlayerDetails ? m.opponentBestPlayerDetails.name : "Opponent Player",
                    type: 'Goal'
                  });
                }
              } else {
                const offendingPlayer = Math.random() > 0.5 ? (m.bestPlayerDetails ? m.bestPlayerDetails.name : "Player") : (m.opponentBestPlayerDetails ? m.opponentBestPlayerDetails.name : "Player");
                updatedEvents.push({
                  minute: `${nextMin}'`,
                  player: offendingPlayer,
                  type: 'Yellow Card'
                });
              }
            }

            return {
              ...m,
              status: 'LIVE',
              minute: `${nextMin}'`,
              scoreA: newScoreA,
              scoreB: newScoreB,
              events: updatedEvents
            };
          }
          return m;
        });
      });
    }, 8000);

    return () => clearInterval(scoreInterval);
  }, [liveDemoActive, selectedMatchId]);

  // Sync Dark/Light Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn("theme localStorage sync failed:", e);
    }
  }, [theme]);

  // Sync Profile details
  useEffect(() => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn("userProfile localStorage sync failed:", e);
    }
  }, [userProfile]);

  const t = useCallback((key) => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  }, [language]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const addComplaint = useCallback((newComplaint) => {
    const id = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const fresh = {
      id,
      ...newComplaint,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: "Submitted",
      timeline: [
        {
          status: "Submitted",
          date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          description: "Incident reported through stadium portal."
        }
      ],
      resolutionSummary: ""
    };
    setComplaints(prev => [fresh, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now(),
        type: "success",
        text: `New incident registered: ${newComplaint.title}. Ticket ID: ${id}`,
        time: "Just now",
        active: true
      },
      ...prev
    ]);
  }, []);

  const updateComplaintStatus = useCallback((id, newStatus, detail, resolution = "") => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const updatedTimeline = [...c.timeline, {
          status: newStatus,
          date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          description: detail
        }];
        return {
          ...c,
          status: newStatus,
          timeline: updatedTimeline,
          resolutionSummary: resolution || c.resolutionSummary
        };
      }
      return c;
    }));
  }, []);

  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('gemini_api_mode', newSettings.apiMode);
    } catch (e) {
      console.warn("gemini_api_mode localStorage sync failed:", e);
    }
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, active: false } : n));
  }, []);

  const addEcoPoints = useCallback((points) => {
    setUserProfile(prev => ({
      ...prev,
      ecoPoints: (prev.ecoPoints || 0) + points
    }));
  }, []);

  // Live Storyline Simulator States
  const [simulatorAct, setSimulatorAct] = useState(1);
  const [telemetry, setTelemetry] = useState({
    gateCWait: 2,
    gateDWait: 3,
    gateBWait: 5,
    activeVisitors: 12000,
    heatmapSpots: [{ x: 380, y: 180, intensity: 0.3, label: 'Gate C' }],
    routingPath: null,
    volunteerTasks: [
      { id: 'task-1', title: 'Monitor Gate C Turnstiles', status: 'Pending', priority: 'Medium' }
    ],
    medicalTriage: [],
    securityIncidents: [],
    droneStatus: 'Stationary',
    droneReport: ''
  });

  const triggerSimulatorAct = (actNum) => {
    setSimulatorAct(actNum);
    const newNotiId = `noti-sim-${actNum}-${Date.now()}`;
    
    let nextTelemetry = {};
    let notiText = "";

    switch (actNum) {
      case 1:
        nextTelemetry = {
          gateCWait: 2,
          gateDWait: 3,
          gateBWait: 5,
          activeVisitors: 12000,
          heatmapSpots: [{ x: 380, y: 180, intensity: 0.3, label: 'Gate C' }],
          routingPath: null,
          volunteerTasks: [{ id: 'task-1', title: 'Monitor Gate C Turnstiles', status: 'Pending', priority: 'Medium' }],
          medicalTriage: [],
          securityIncidents: [],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 1: Stadium Gates open. Ingress commenced for fans.";
        break;
      case 2:
        nextTelemetry = {
          gateCWait: 25,
          gateDWait: 4,
          gateBWait: 6,
          activeVisitors: 34000,
          heatmapSpots: [{ x: 380, y: 180, intensity: 0.9, label: 'Gate C Bottleneck' }],
          routingPath: null,
          volunteerTasks: [{ id: 'task-1', title: 'Assist turnstile triage at Gate C', status: 'Pending', priority: 'High' }],
          medicalTriage: [],
          securityIncidents: [],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 2: Congestion peak at Gate C Turnstiles. Scanners throttling!";
        break;
      case 3:
        nextTelemetry = {
          gateCWait: 12,
          gateDWait: 9,
          gateBWait: 7,
          activeVisitors: 42000,
          heatmapSpots: [{ x: 380, y: 180, intensity: 0.6, label: 'Gate C' }, { x: 517, y: 189, intensity: 0.5, label: 'Gate D' }],
          routingPath: [{ x: 380, y: 180 }, { x: 450, y: 140 }, { x: 517, y: 189 }],
          volunteerTasks: [{ id: 'task-1', title: 'Assist turnstile triage at Gate C', status: 'In Progress', priority: 'High' }],
          medicalTriage: [],
          securityIncidents: [],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 3: AI Companion rerouted 4,500 incoming fans to Gate D.";
        break;
      case 4:
        nextTelemetry = {
          gateCWait: 5,
          gateDWait: 5,
          gateBWait: 5,
          activeVisitors: 58000,
          heatmapSpots: [{ x: 380, y: 180, intensity: 0.2 }, { x: 517, y: 189, intensity: 0.2 }],
          routingPath: null,
          volunteerTasks: [{ id: 'task-1', title: 'Assist turnstile triage at Gate C', status: 'Completed', priority: 'High' }, { id: 'task-2', title: 'Replenish Eco-Cup supplies at Stand 2', status: 'Pending', priority: 'Low' }],
          medicalTriage: [],
          securityIncidents: [],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 4: Volunteers deployed successfully. Gate C flow back to normal.";
        break;
      case 5:
        nextTelemetry = {
          gateCWait: 3,
          gateDWait: 3,
          gateBWait: 4,
          activeVisitors: 68000,
          heatmapSpots: [{ x: 260, y: 220, intensity: 0.8, label: 'Medical Emergency' }],
          routingPath: null,
          volunteerTasks: [{ id: 'task-2', title: 'Replenish Eco-Cup supplies at Stand 2', status: 'Pending', priority: 'Low' }],
          medicalTriage: [{ id: 'med-1', name: 'John Doe (Block 102)', issue: 'Heat Exhaustion', priority: 'Red', status: 'Awaiting Dispatch' }],
          securityIncidents: [],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 5: Medical Emergency reported in Block 102. Fan collapsed.";
        break;
      case 6:
        nextTelemetry = {
          gateCWait: 2,
          gateDWait: 3,
          gateBWait: 3,
          activeVisitors: 72000,
          heatmapSpots: [{ x: 260, y: 220, intensity: 0.8, label: 'Medical Emergency' }],
          routingPath: [{ x: 380, y: 180 }, { x: 300, y: 190 }, { x: 260, y: 220 }],
          volunteerTasks: [{ id: 'task-2', title: 'Replenish Eco-Cup supplies at Stand 2', status: 'In Progress', priority: 'Low' }],
          medicalTriage: [{ id: 'med-1', name: 'John Doe (Block 102)', issue: 'Heat Exhaustion', priority: 'Red', status: 'Stretcher En-Route (Accessible Elevator Route)' }],
          securityIncidents: [],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 6: Step-Free route generated. Stretcher team dispatched.";
        break;
      case 7:
        nextTelemetry = {
          gateCWait: 2,
          gateDWait: 2,
          gateBWait: 2,
          activeVisitors: 45200,
          heatmapSpots: [{ x: 180, y: 220, intensity: 0.85, label: 'Gate B Security Checkpoint' }],
          routingPath: null,
          volunteerTasks: [
            { id: 'task-5', title: 'Security support Gate B', status: 'In Progress', priority: 'Medium' }
          ],
          medicalTriage: [],
          securityIncidents: [{ id: 'sec-1', type: 'Prohibited Item', location: 'Gate B Scanner 2', details: 'Confiscated laser pointer', status: 'Active' }],
          droneStatus: 'Monitoring Gate B',
          droneReport: 'Gate B security checkpoint operations standard. Alert flag raised for Laser Point.'
        };
        notiText = "Act 7: Security alert. Prohibited item confiscated at Gate B scanner.";
        break;
      case 8:
        nextTelemetry = {
          gateCWait: 1,
          gateDWait: 1,
          gateBWait: 1,
          activeVisitors: 45200,
          heatmapSpots: [],
          routingPath: null,
          volunteerTasks: [
            { id: 'task-5', title: 'Security support Gate B', status: 'Completed', priority: 'Medium' }
          ],
          medicalTriage: [],
          securityIncidents: [{ id: 'sec-1', type: 'Prohibited Item', location: 'Gate B Scanner 2', details: 'Confiscated laser pointer', status: 'Resolved' }],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 8: Security incident resolved. Fan released with warning. Laser confiscated.";
        break;
      case 9:
        nextTelemetry = {
          gateCWait: 1,
          gateDWait: 1,
          gateBWait: 1,
          activeVisitors: 450,
          heatmapSpots: [],
          routingPath: null,
          volunteerTasks: [],
          medicalTriage: [],
          securityIncidents: [],
          droneStatus: 'Stationary',
          droneReport: ''
        };
        notiText = "Act 9: Egress completed. Operations clear. Success match day report.";
        break;
    }

    setTelemetry(nextTelemetry);

    setNotifications(prev => [
      {
        id: newNotiId,
        text: notiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        active: true
      },
      ...prev
    ]);
  };

  const providerValue = useMemo(() => ({
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    theme,
    toggleTheme,
    userProfile,
    setUserProfile,
    complaints,
    addComplaint,
    updateComplaintStatus,
    chatHistory,
    setChatHistory,
    notifications,
    dismissNotification,
    settings,
    saveSettings,
    addEcoPoints,
    matchesList: computedMatchesList,
    selectedMatchId,
    setSelectedMatchId,
    activeMatch,
    groupStandings,
    allGroupsStandings,
    topStatsData,
    topPlayersStats,
    liveDemoActive,
    setLiveDemoActive,
    isSportsDataSimulated,
    sportsDataLastUpdated,
    refreshSportsData,
    simulatorAct,
    setSimulatorAct,
    telemetry,
    setTelemetry,
    triggerSimulatorAct,
    t
  }), [
    activeTab,
    language,
    theme,
    userProfile,
    complaints,
    chatHistory,
    notifications,
    settings,
    computedMatchesList,
    selectedMatchId,
    activeMatch,
    groupStandings,
    allGroupsStandings,
    topStatsData,
    topPlayersStats,
    liveDemoActive,
    isSportsDataSimulated,
    sportsDataLastUpdated,
    refreshSportsData,
    simulatorAct,
    telemetry,
    triggerSimulatorAct,
    t
  ]);

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
