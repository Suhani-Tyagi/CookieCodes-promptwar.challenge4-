import React, { createContext, useContext, useState, useEffect } from 'react';

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
    return localStorage.getItem('theme') || 'dark';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing userProfile:", e);
      }
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

  const [settings, setSettings] = useState({
    apiMode: localStorage.getItem('gemini_api_mode') || "live", 
    geminiApiKey: localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ""
  });

  const [liveDemoActive, setLiveDemoActive] = useState(false);

  // --- COMPREHENSIVE MATCH DATABASE (Group stage to QFs) ---
  const [matchesList, setMatchesList] = useState([
    {
      id: "M1",
      teamA: "France",
      teamAFlag: "🇫🇷",
      teamB: "Morocco",
      teamBFlag: "🇲🇦",
      teamAColors: { primary: "#002395", secondary: "#ED2939", accent: "#FFFFFF", name: "France Royal Blue" },
      teamBColors: { primary: "#006241", secondary: "#C1272D", accent: "#FFFFFF", name: "Morocco Green & Red" },
      time: "17:00 Local",
      date: "Jul 10, 2026",
      stadium: "Boston Stadium, Boston",
      status: "UPCOMING",
      minute: "QF 1",
      scoreA: 0,
      scoreB: 0,
      events: [],
      bestPlayer: "Kylian Mbappé",
      bestPlayerDetails: {
        name: "Kylian Mbappé",
        jerseyColor: "#002395",
        number: "10",
        stats: "3 Goals in Tournament, Rating 8.9",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Kylian_Mbappé_2018.jpg"
      },
      opponentBestPlayerDetails: {
        name: "Hakim Ziyech",
        jerseyColor: "#006241",
        number: "7",
        stats: "3 Goals, 2 Assists, Rating 8.6",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hakim_Ziyech_2021.jpg"
      },
      details: "Quarter-Final match 1 at Boston Stadium."
    },
    {
      id: "M2",
      teamA: "Spain",
      teamAFlag: "🇪🇸",
      teamB: "Belgium",
      teamBFlag: "🇧🇪",
      teamAColors: { primary: "#C1272D", secondary: "#FEDF00", accent: "#002395", name: "Spain Red & Gold" },
      teamBColors: { primary: "#000000", secondary: "#DD0000", accent: "#FEDF00", name: "Belgium Black & Red" },
      time: "20:00 Local",
      date: "Jul 11, 2026",
      stadium: "Los Angeles Stadium, LA",
      status: "UPCOMING",
      minute: "QF 2",
      scoreA: 0,
      scoreB: 0,
      events: [],
      bestPlayer: "Dani Olmo",
      bestPlayerDetails: { 
        name: "Dani Olmo", 
        jerseyColor: "#C1272D", 
        number: "10", 
        stats: "1 Goal, 2 Assists, Rating 8.7",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Dani_Olmo_2022.jpg"
      },
      opponentBestPlayerDetails: { 
        name: "Kevin De Bruyne", 
        jerseyColor: "#000000", 
        number: "7", 
        stats: "3 Goals, 4 Assists, Rating 8.9",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg"
      },
      details: "Quarter-Final match 2 at SoFi Stadium."
    },
    {
      id: "M3",
      teamA: "Norway",
      teamAFlag: "🇳🇴",
      teamB: "England",
      teamBFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      teamAColors: { primary: "#BA0C2F", secondary: "#00205B", accent: "#FFFFFF", name: "Norway Red & Blue" },
      teamBColors: { primary: "#FFFFFF", secondary: "#CF0820", accent: "#00205B", name: "England White & Red" },
      time: "18:00 Local",
      date: "Jul 11, 2026",
      stadium: "Miami Stadium, Miami",
      status: "UPCOMING",
      minute: "QF 3",
      scoreA: 0,
      scoreB: 0,
      events: [],
      bestPlayer: "Erling Haaland",
      bestPlayerDetails: { 
        name: "Erling Haaland", 
        jerseyColor: "#BA0C2F", 
        number: "9", 
        stats: "4 Goals, Rating 9.0",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg"
      },
      opponentBestPlayerDetails: { 
        name: "Jude Bellingham", 
        jerseyColor: "#FFFFFF", 
        number: "10", 
        stats: "2 Goals, 3 Assists, Rating 8.5",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg"
      },
      details: "Quarter-Final match 3 at Hard Rock Stadium."
    },
    {
      id: "M4",
      teamA: "Argentina",
      teamAFlag: "🇦🇷",
      teamB: "Switzerland",
      teamBFlag: "🇨🇭",
      teamAColors: { primary: "#74ACDF", secondary: "#FFFFFF", accent: "#74ACDF", name: "Argentina Stripes" },
      teamBColors: { primary: "#D52B1E", secondary: "#FFFFFF", accent: "#D52B1E", name: "Switzerland Red" },
      time: "19:00 Local",
      date: "Jul 12, 2026",
      stadium: "Kansas City Stadium, KC",
      status: "UPCOMING",
      minute: "QF 4",
      scoreA: 0,
      scoreB: 0,
      events: [],
      bestPlayer: "Lionel Messi",
      bestPlayerDetails: { 
        name: "Lionel Messi", 
        jerseyColor: "#74ACDF", 
        number: "10", 
        stats: "5 Goals, 3 Assists, Rating 9.2",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg"
      },
      opponentBestPlayerDetails: { 
        name: "Granit Xhaka", 
        jerseyColor: "#D52B1E", 
        number: "10", 
        stats: "Rating 8.2",
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Granit_Xhaka_%28cropped%29.jpg"
      },
      details: "Quarter-Final match 4 at Arrowhead Stadium."
    },
    // Concluded matches (Round of 16 results)
    {
      id: "M5",
      teamA: "Morocco",
      teamAFlag: "🇲🇦",
      teamB: "Canada",
      teamBFlag: "🇨🇦",
      teamAColors: { primary: "#006241", secondary: "#C1272D", accent: "#FFFFFF", name: "Morocco Green" },
      teamBColors: { primary: "#FF0000", secondary: "#FFFFFF", accent: "#FF0000", name: "Canada Red" },
      time: "15:00 Local",
      date: "Jul 07, 2026",
      stadium: "BMO Field, Toronto",
      status: "COMPLETED",
      minute: "Round of 16",
      scoreA: 3,
      scoreB: 0,
      events: [
        { minute: "14'", player: "Y. En-Nesyri (MAR)", type: "Goal" },
        { minute: "32'", player: "Hakim Ziyech (MAR)", type: "Goal" },
        { minute: "75'", player: "S. Amallah (MAR)", type: "Goal" }
      ],
      bestPlayer: "Hakim Ziyech",
      bestPlayerDetails: { name: "Hakim Ziyech", jerseyColor: "#006241", number: "7", stats: "1 Goal, 1 Assist, Rating 9.0", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hakim_Ziyech_2021.jpg" },
      opponentBestPlayerDetails: { name: "Alphonso Davies", jerseyColor: "#FF0000", number: "19", stats: "3 Dribbles, Rating 6.8", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/27/Alphonso_Davies_Canada_v_Qatar_18_June_2026-007_%28cropped%29.jpg" },
      details: "Morocco cruised into the Quarter-Finals with a stellar 3-0 performance.",
      videoUrl: "https://www.youtube.com/embed/simulated-mor-can"
    },
    {
      id: "M6",
      teamA: "Norway",
      teamAFlag: "🇳🇴",
      teamB: "Brazil",
      teamBFlag: "🇧🇷",
      teamAColors: { primary: "#BA0C2F", secondary: "#00205B", accent: "#FFFFFF", name: "Norway Red" },
      teamBColors: { primary: "#FEDF00", secondary: "#009B3A", accent: "#00205B", name: "Brazil Gold" },
      time: "20:00 Local",
      date: "Jul 07, 2026",
      stadium: "MetLife Stadium, NJ",
      status: "COMPLETED",
      minute: "Round of 16",
      scoreA: 2,
      scoreB: 1,
      events: [
        { minute: "22'", player: "Erling Haaland (NOR)", type: "Goal" },
        { minute: "54'", player: "Vinícius Júnior (BRA)", type: "Goal" },
        { minute: "89'", player: "Erling Haaland (NOR)", type: "Goal" }
      ],
      bestPlayer: "Erling Haaland",
      bestPlayerDetails: { name: "Erling Haaland", jerseyColor: "#BA0C2F", number: "9", stats: "2 Goals, 5 Shots, Rating 9.3", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg" },
      opponentBestPlayerDetails: { name: "Vinícius Júnior", jerseyColor: "#FEDF00", number: "7", stats: "1 Goal, Rating 7.9", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg" },
      details: "Haaland's brace knocks out Brazil in a historic victory.",
      videoUrl: "https://www.youtube.com/embed/simulated-nor-bra"
    },
    {
      id: "M7",
      teamA: "Spain",
      teamAFlag: "🇪🇸",
      teamB: "Portugal",
      teamBFlag: "🇵🇹",
      teamAColors: { primary: "#C1272D", secondary: "#FEDF00", accent: "#002395", name: "Spain Red" },
      teamBColors: { primary: "#006600", secondary: "#FF0000", accent: "#FFFFFF", name: "Portugal Red" },
      time: "19:00 Local",
      date: "Jul 05, 2026",
      stadium: "Hard Rock Stadium, Miami",
      status: "COMPLETED",
      minute: "Round of 16",
      scoreA: 1,
      scoreB: 0,
      events: [
        { minute: "68'", player: "Dani Olmo (ESP)", type: "Goal" }
      ],
      bestPlayer: "Dani Olmo",
      bestPlayerDetails: { name: "Dani Olmo", jerseyColor: "#C1272D", number: "10", stats: "1 Goal, 2 Key Passes, Rating 8.7", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Dani_Olmo_2022.jpg" },
      opponentBestPlayerDetails: { name: "Cristiano Ronaldo", jerseyColor: "#006600", number: "7", stats: "2 Shots, Rating 6.9", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Cristiano_Ronaldo_2275_%28cropped%29.jpg" },
      details: "Spain edges out Portugal in an intense Iberian Derby.",
      videoUrl: "https://www.youtube.com/embed/simulated-esp-por"
    },
    {
      id: "M8",
      teamA: "England",
      teamAFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      teamB: "Mexico",
      teamBFlag: "🇲🇽",
      teamAColors: { primary: "#FFFFFF", secondary: "#CF0820", accent: "#00205B", name: "England White" },
      teamBColors: { primary: "#006847", secondary: "#D00C27", accent: "#FFFFFF", name: "Mexico Green" },
      time: "20:00 Local",
      date: "Jul 05, 2026",
      stadium: "Gillette Stadium, Boston",
      status: "COMPLETED",
      minute: "Round of 16",
      scoreA: 3,
      scoreB: 2,
      events: [
        { minute: "15'", player: "H. Kane (ENG)", type: "Goal" },
        { minute: "34'", player: "S. Giménez (MEX)", type: "Goal" },
        { minute: "48'", player: "J. Bellingham (ENG)", type: "Goal" },
        { minute: "72'", player: "H. Martin (MEX)", type: "Goal" },
        { minute: "87'", player: "B. Saka (ENG)", type: "Goal" }
      ],
      bestPlayer: "Jude Bellingham",
      bestPlayerDetails: { name: "Jude Bellingham", jerseyColor: "#FFFFFF", number: "10", stats: "1 Goal, 1 Assist, Rating 8.8", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg" },
      opponentBestPlayerDetails: { name: "Santiago Giménez", jerseyColor: "#006847", number: "9", stats: "1 Goal, Rating 7.5", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Santiago_Gim%C3%A9nez.png" },
      details: "A dramatic 5-goal thriller ended by Bukayo Saka's late strike.",
      videoUrl: "https://www.youtube.com/embed/simulated-eng-mex"
    },
    {
      id: "M9",
      teamA: "Belgium",
      teamAFlag: "🇧🇪",
      teamB: "USA",
      teamBFlag: "🇺🇸",
      time: "18:00 Local",
      date: "Jul 06, 2026",
      stadium: "SoFi Stadium, Los Angeles",
      status: "COMPLETED",
      minute: "Round of 16",
      scoreA: 4,
      scoreB: 1,
      teamAColors: { primary: "#000000", secondary: "#DD0000", accent: "#FEDF00", name: "Belgium Black" },
      teamBColors: { primary: "#0A3161", secondary: "#B31942", accent: "#FFFFFF", name: "USA Blue & Red" },
      events: [
        { minute: "8'", player: "R. Lukaku (BEL)", type: "Goal" },
        { minute: "24'", player: "K. De Bruyne (BEL)", type: "Goal" }
      ],
      bestPlayer: "Kevin De Bruyne",
      bestPlayerDetails: { name: "Kevin De Bruyne", jerseyColor: "#000000", number: "7", stats: "1 Goal, 2 Assists, Rating 9.4", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg" },
      opponentBestPlayerDetails: { name: "Christian Pulisic", jerseyColor: "#0A3161", number: "10", stats: "1 Goal, Rating 7.2", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Christian_Pulisic_USMNT_v_Belgium_Mar_28_2026-73_%28cropped%29.jpg" },
      details: "Belgium outclassed the USA with De Bruyne dictating the play.",
      videoUrl: "https://www.youtube.com/embed/simulated-bel-usa"
    },
    // Preloaded Group stage matches
    {
      id: "M13",
      teamA: "Mexico",
      teamAFlag: "🇲🇽",
      teamB: "South Africa",
      teamBFlag: "🇿🇦",
      time: "18:00 Local",
      date: "Jun 11, 2026",
      stadium: "Estadio Azteca, Mexico City",
      status: "COMPLETED",
      minute: "Group A",
      scoreA: 2,
      scoreB: 1,
      teamAColors: { primary: "#006847", secondary: "#D00C27", accent: "#FFFFFF", name: "Mexico Green" },
      teamBColors: { primary: "#007A33", secondary: "#F2A900", accent: "#FFFFFF", name: "South Africa Gold" },
      events: [{ minute: "12'", player: "S. Giménez (MEX)", type: "Goal" }, { minute: "88'", player: "H. Martin (MEX)", type: "Goal" }],
      bestPlayer: "Santiago Giménez",
      bestPlayerDetails: { name: "Santiago Giménez", jerseyColor: "#006847", number: "9", stats: "1 Goal, Rating 8.2", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Santiago_Gim%C3%A9nez.png" },
      opponentBestPlayerDetails: { name: "Percy Tau", jerseyColor: "#007A33", number: "10", stats: "Rating 7.0", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Percy_Tau_in_2019_%28cropped%29.jpg" },
      details: "Tournament opener in Mexico City."
    },
    {
      id: "M14",
      teamA: "United States",
      teamAFlag: "🇺🇸",
      teamB: "Paraguay",
      teamBFlag: "🇵🇾",
      time: "19:00 Local",
      date: "Jun 12, 2026",
      stadium: "SoFi Stadium, Los Angeles",
      status: "COMPLETED",
      minute: "Group D",
      scoreA: 1,
      scoreB: 1,
      teamAColors: { primary: "#0A3161", secondary: "#B31942", accent: "#FFFFFF", name: "USA Blue & Red" },
      teamBColors: { primary: "#D52B1E", secondary: "#0038A8", accent: "#FFFFFF", name: "Paraguay Stripes" },
      events: [{ minute: "41'", player: "C. Pulisic (USA)", type: "Goal" }],
      bestPlayer: "Christian Pulisic",
      bestPlayerDetails: { name: "Christian Pulisic", jerseyColor: "#0A3161", number: "10", stats: "1 Goal, Rating 8.0", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Christian_Pulisic_USMNT_v_Belgium_Mar_28_2026-73_%28cropped%29.jpg" },
      opponentBestPlayerDetails: { name: "Miguel Almirón", jerseyColor: "#D52B1E", number: "10", stats: "Rating 7.8", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Miguel_Almir%C3%B3n_Red_Bull_Atlanta_5.31.25-069_%28cropped%29.jpg" },
      details: "USA's opening Group D match."
    }
  ]);

  const [selectedMatchId, setSelectedMatchId] = useState("M1");

  const activeMatch = matchesList.find(m => m.id === selectedMatchId) || matchesList[0];

  // --- FULL 12 GROUPS STANDINGS (Group A to Group L) ---
  const allGroupsStandings = {
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
  const topStatsData = {
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

  const topPlayersStats = topStatsData.goals;

  // --- Live match updates simulation engine ---
  useEffect(() => {
    if (!liveDemoActive) return;

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
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync Profile details
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const t = (key) => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addComplaint = (newComplaint) => {
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
  };

  const updateComplaintStatus = (id, newStatus, detail, resolution = "") => {
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
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gemini_api_mode', newSettings.apiMode);
    if (newSettings.geminiApiKey) {
      localStorage.setItem('gemini_api_key', newSettings.geminiApiKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, active: false } : n));
  };

  const addEcoPoints = (points) => {
    setUserProfile(prev => ({
      ...prev,
      ecoPoints: (prev.ecoPoints || 0) + points
    }));
  };

  return (
    <AppContext.Provider value={{
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
      matchesList,
      selectedMatchId,
      setSelectedMatchId,
      activeMatch,
      groupStandings,
      allGroupsStandings,
      topStatsData,
      topPlayersStats,
      liveDemoActive,
      setLiveDemoActive,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
