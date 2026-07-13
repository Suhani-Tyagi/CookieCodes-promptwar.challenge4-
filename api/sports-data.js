// Serverless function to fetch, cache, and serve FIFA 2026 World Cup data from API-SPORTS
// with strict daily quota limit (90 requests/day safety cut-off) and custom TTL caches.

const rateLimitMap = new Map();
const LIMIT = 20; // max 20 requests per minute per IP
const WINDOW = 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW });
    return false;
  }
  const entry = rateLimitMap.get(ip);
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + WINDOW;
    return false;
  }
  entry.count++;
  return entry.count > LIMIT;
}

// In-Memory Caches & TTLs (20 mins for fixtures, 60 mins for standings & stats)
const FIXTURES_TTL = 20 * 60 * 1000;
const STANDINGS_TTL = 60 * 60 * 1000;
const STATS_TTL = 60 * 60 * 1000;

let cache = {
  fixtures: null,
  fixturesTime: 0,
  standings: null,
  standingsTime: 0,
  stats: null,
  statsTime: 0
};

// Daily quota tracking (UTC day based)
let dailyCallCount = 0;
let lastResetDate = "";

function checkAndResetDailyQuota() {
  const now = new Date();
  const todayUTC = now.toISOString().split('T')[0];
  if (lastResetDate !== todayUTC) {
    dailyCallCount = 0;
    lastResetDate = todayUTC;
    console.log(`[API-SPORTS] Daily call counter reset for UTC day: ${todayUTC}`);
  }
}

// Hardcoded World Cup League ID for API-SPORTS (World Cup is league 1)
const LEAGUE_ID = 1;
const SEASON = 2026;

// Mock Fallback Data matching AppContext expected shapes
const mockMatches = [
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
];

const mockAllGroupsStandings = {
  "Group A": [
    { rank: 1, team: "Mexico 🇲🇽", played: 3, won: 2, gd: 3, points: 7 },
    { rank: 2, team: "South Korea 🇰🇷", played: 3, won: 1, gd: 2, points: 5 },
    { rank: 3, team: "Czechia 🇨🇿", played: 3, won: 1, gd: -1, points: 3 },
    { rank: 4, team: "South Africa 🇿🇦", played: 3, won: 0, gd: -4, points: 1 }
  ],
  "Group B": [
    { rank: 1, team: "Switzerland 🇨🇭", played: 3, won: 2, gd: 2, points: 7 },
    { rank: 2, team: "Canada 🇨🇦", played: 3, won: 2, gd: 3, points: 6 },
    { rank: 3, team: "Qatar 🇶🇦", played: 3, won: 1, gd: -2, points: 3 },
    { rank: 4, team: "Bosnia & Herz. 🇧🇦", played: 3, won: 0, gd: -3, points: 1 }
  ],
  "Group C": [
    { rank: 1, team: "Morocco 🇲🇦", played: 3, won: 3, gd: 6, points: 9 },
    { rank: 2, team: "Brazil 🇧🇷", played: 3, won: 2, gd: 4, points: 6 },
    { rank: 3, team: "Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿", played: 3, won: 1, gd: -2, points: 3 },
    { rank: 4, team: "Haiti 🇭🇹", played: 3, won: 0, gd: -8, points: 0 }
  ],
  "Group D": [
    { rank: 1, team: "Belgium 🇧🇪", played: 3, won: 2, gd: 4, points: 7 },
    { rank: 2, team: "United States 🇺🇸", played: 3, won: 1, gd: 2, points: 5 },
    { rank: 3, team: "Paraguay 🇵🇾", played: 3, won: 1, gd: 0, points: 4 },
    { rank: 4, team: "Australia 🇦🇺", played: 3, won: 0, gd: -6, points: 0 }
  ]
};

const mockTopStatsData = {
  goals: [
    { rank: 1, name: "Lionel Messi", country: "ARG 🇦🇷", value: "5 goals", subtext: "3 Assists, Rating 9.20", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg", jerseyColor: "#74ACDF", number: "10" },
    { rank: 2, name: "Erling Haaland", country: "NOR 🇳🇴", value: "4 goals", subtext: "1 Assist, Rating 9.05", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg", jerseyColor: "#BA0C2F", number: "9" },
    { rank: 3, name: "Kevin De Bruyne", country: "BEL 🇧🇪", value: "3 goals", subtext: "4 Assists, Rating 8.90", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg", jerseyColor: "#000000", number: "7" }
  ],
  assists: [
    { rank: 1, name: "Kevin De Bruyne", country: "BEL 🇧🇪", value: "4 assists", subtext: "3 Goals, Rating 8.90", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg", jerseyColor: "#000000", number: "7" },
    { rank: 2, name: "Lionel Messi", country: "ARG 🇦🇷", value: "3 assists", subtext: "5 Goals, Rating 9.20", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg", jerseyColor: "#74ACDF", number: "10" }
  ],
  cleanSheets: [
    { rank: 1, name: "Yann Sommer", country: "SUI 🇨🇭", value: "3 clean sheets", subtext: "8 Saves, Rating 8.80", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/FC_Salzburg_gegen_Inter_Mailand_%28Testspiel_2023-08-09%29_69.jpg", jerseyColor: "#D52B1E", number: "1" }
  ],
  discipline: [
    { rank: 1, name: "Granit Xhaka", country: "SUI 🇨🇭", value: "3 yellow cards", subtext: "0 Red, Rating 8.10", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Granit_Xhaka_%28cropped%29.jpg", jerseyColor: "#D52B1E", number: "10" }
  ]
};

const teamFlags = {
  "France": "🇫🇷", "Morocco": "🇲🇦", "Spain": "🇪🇸", "Belgium": "🇧🇪", "Norway": "🇳🇴",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Argentina": "🇦🇷", "Switzerland": "🇨🇭", "Canada": "🇨🇦",
  "Brazil": "🇧🇷", "Portugal": "🇵🇹", "Mexico": "🇲🇽", "South Korea": "🇰🇷",
  "Czechia": "🇨🇿", "South Africa": "🇿🇦", "Qatar": "🇶🇦", "Bosnia & Herz.": "🇧🇦",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Haiti": "🇭🇹", "United States": "🇺🇸", "USA": "🇺🇸", "Paraguay": "🇵🇾",
  "Australia": "🇦🇺", "Germany": "🇩🇪", "Ecuador": "🇪🇨", "Côte d'Ivoire": "🇨🇮",
  "Curaçao": "🇨🇼", "Netherlands": "🇳🇱", "Japan": "🇯🇵", "Sweden": "🇸🇪",
  "Tunisia": "🇹🇳", "Egypt": "🇪🇬", "Iran": "🇮🇷", "New Zealand": "🇳🇿",
  "Turkey": "🇹🇷", "Uruguay": "🇺🇾", "Saudi Arabia": "🇸🇦", "Cabo Verde": "🇨🇻",
  "Senegal": "🇸🇳", "Iraq": "🇮🇶", "Austria": "🇦🇹", "Algeria": "🇩🇿",
  "Jordan": "🇯🇴", "Colombia": "🇨🇴", "DR Congo": "🇨🇩", "Uzbekistan": "🇺🇿",
  "Croatia": "🇭🇷", "Ghana": "🇬🇭", "Panama": "🇵🇦"
};

const teamColors = {
  "France": { primary: "#002395", secondary: "#ED2939", accent: "#FFFFFF", name: "France Royal Blue" },
  "Morocco": { primary: "#006241", secondary: "#C1272D", accent: "#FFFFFF", name: "Morocco Green & Red" },
  "Spain": { primary: "#C1272D", secondary: "#FEDF00", accent: "#002395", name: "Spain Red & Gold" },
  "Belgium": { primary: "#000000", secondary: "#DD0000", accent: "#FEDF00", name: "Belgium Black & Red" },
  "Norway": { primary: "#BA0C2F", secondary: "#00205B", accent: "#FFFFFF", name: "Norway Red & Blue" },
  "England": { primary: "#FFFFFF", secondary: "#CF0820", accent: "#00205B", name: "England White & Red" },
  "Argentina": { primary: "#74ACDF", secondary: "#FFFFFF", accent: "#74ACDF", name: "Argentina Stripes" },
  "Switzerland": { primary: "#D52B1E", secondary: "#FFFFFF", accent: "#D52B1E", name: "Switzerland Red" },
  "Canada": { primary: "#FF0000", secondary: "#FFFFFF", accent: "#FF0000", name: "Canada Red" },
  "Brazil": { primary: "#FEDF00", secondary: "#009B3A", accent: "#00205B", name: "Brazil Gold" },
  "Portugal": { primary: "#006600", secondary: "#FF0000", accent: "#FFFFFF", name: "Portugal Red" },
  "Mexico": { primary: "#006847", secondary: "#D00C27", accent: "#FFFFFF", name: "Mexico Green" },
  "United States": { primary: "#0A3161", secondary: "#B31942", accent: "#FFFFFF", name: "USA Blue & Red" },
  "USA": { primary: "#0A3161", secondary: "#B31942", accent: "#FFFFFF", name: "USA Blue & Red" },
  "Paraguay": { primary: "#D52B1E", secondary: "#0038A8", accent: "#FFFFFF", name: "Paraguay Stripes" }
};
const defaultColors = { primary: "#71717a", secondary: "#e4e4e7", accent: "#ffffff", name: "Default Gray" };

function mapStatus(shortStatus) {
  const liveCodes = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'INT'];
  const completedCodes = ['FT', 'AET', 'PEN', 'AWD'];
  if (liveCodes.includes(shortStatus)) return 'LIVE';
  if (completedCodes.includes(shortStatus)) return 'COMPLETED';
  return 'UPCOMING';
}

export default async function handler(req, res) {
  // CORS & Origin Verification
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv ? allowedOriginsEnv.split(',').map(o => o.trim()) : [];
  const origin = req.headers.origin || '';

  if (allowedOrigins.length > 0) {
    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    if (origin) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Rate limit
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Daily quota reset
  checkAndResetDailyQuota();

  const apiKey = process.env.SPORTS_DATA_API_KEY;
  const now = Date.now();

  // If apiKey is missing, or we reached quota cutoff, serve fallback data
  if (!apiKey || dailyCallCount >= 90) {
    console.log(`[API-SPORTS] Serving simulated fallback. Key configured: ${!!apiKey}, dailyCallCount: ${dailyCallCount}/90`);
    return res.status(200).json({
      matchesList: cache.fixtures || mockMatches,
      allGroupsStandings: cache.standings || mockAllGroupsStandings,
      topStatsData: cache.stats || mockTopStatsData,
      isSimulated: true,
      lastUpdated: cache.fixturesTime || now
    });
  }

  // Determine which files/data we need to fetch
  const needFixtures = !cache.fixtures || (now - cache.fixturesTime > FIXTURES_TTL);
  const needStandings = !cache.standings || (now - cache.standingsTime > STANDINGS_TTL);
  const needStats = !cache.stats || (now - cache.statsTime > STATS_TTL);

  let hasError = false;

  try {
    const headers = { 'x-apisports-key': apiKey };

    if (needFixtures) {
      try {
        dailyCallCount++;
        console.log(`[API-SPORTS] Fetching fixtures. Daily count: ${dailyCallCount}/90`);
        const fixturesRes = await fetch(`https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`, { headers });
        const fixturesData = await fixturesRes.json();
        
        if (fixturesData.response && fixturesData.response.length > 0) {
          cache.fixtures = fixturesData.response.map((f, idx) => {
            const home = f.teams.home.name;
            const away = f.teams.away.name;
            return {
              id: `M${f.fixture.id || idx + 1}`,
              teamA: home,
              teamAFlag: teamFlags[home] || "🏳️",
              teamB: away,
              teamBFlag: teamFlags[away] || "🏳️",
              teamAColors: teamColors[home] || defaultColors,
              teamBColors: teamColors[away] || defaultColors,
              time: new Date(f.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Local',
              date: new Date(f.fixture.date).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }),
              stadium: f.fixture.venue.name ? `${f.fixture.venue.name}, ${f.fixture.venue.city || ''}` : "Stadium",
              status: mapStatus(f.fixture.status.short),
              minute: f.fixture.status.elapsed ? `${f.fixture.status.elapsed}'` : (f.league.round || ""),
              scoreA: f.goals.home ?? 0,
              scoreB: f.goals.away ?? 0,
              events: [],
              bestPlayer: "Player",
              bestPlayerDetails: {
                name: "Player",
                jerseyColor: teamColors[home]?.primary || "#000",
                number: "10",
                stats: "Active Rating 8.0"
              },
              opponentBestPlayerDetails: {
                name: "Opponent Player",
                jerseyColor: teamColors[away]?.primary || "#000",
                number: "7",
                stats: "Active Rating 7.8"
              },
              details: f.league.round || "Match"
            };
          });
          cache.fixturesTime = now;
        }
      } catch (err) {
        console.error('[API-SPORTS] Fixtures fetch error:', err);
        hasError = true;
      }
    }

    if (needStandings) {
      try {
        dailyCallCount++;
        console.log(`[API-SPORTS] Fetching standings. Daily count: ${dailyCallCount}/90`);
        const standingsRes = await fetch(`https://v3.football.api-sports.io/standings?league=${LEAGUE_ID}&season=${SEASON}`, { headers });
        const standingsData = await standingsRes.json();
        
        if (standingsData.response && standingsData.response.length > 0) {
          const rawStandings = standingsData.response[0].league.standings;
          const mappedStandings = {};
          if (rawStandings) {
            rawStandings.forEach((groupArray) => {
              groupArray.forEach((item) => {
                const groupName = item.group || "Group Stage";
                if (!mappedStandings[groupName]) {
                  mappedStandings[groupName] = [];
                }
                mappedStandings[groupName].push({
                  rank: item.rank,
                  team: item.team.name + ' ' + (teamFlags[item.team.name] || ''),
                  played: item.all.played,
                  won: item.all.win,
                  drawn: item.all.draw,
                  lost: item.all.lose,
                  gd: item.goalsDiff,
                  points: item.points
                });
              });
            });
          }
          if (Object.keys(mappedStandings).length > 0) {
            cache.standings = mappedStandings;
            cache.standingsTime = now;
          }
        }
      } catch (err) {
        console.error('[API-SPORTS] Standings fetch error:', err);
        hasError = true;
      }
    }

    if (needStats) {
      try {
        dailyCallCount++;
        console.log(`[API-SPORTS] Fetching player stats. Daily count: ${dailyCallCount}/90`);
        const scorersRes = await fetch(`https://v3.football.api-sports.io/players/topscorers?league=${LEAGUE_ID}&season=${SEASON}`, { headers });
        const scorersData = await scorersRes.json();

        const assistsRes = await fetch(`https://v3.football.api-sports.io/players/topassists?league=${LEAGUE_ID}&season=${SEASON}`, { headers });
        const assistsData = await assistsRes.json();

        const mappedStats = { goals: [], assists: [], cleanSheets: mockTopStatsData.cleanSheets, discipline: mockTopStatsData.discipline };

        if (scorersData.response && scorersData.response.length > 0) {
          mappedStats.goals = scorersData.response.slice(0, 5).map((item, idx) => {
            const stats = item.statistics[0];
            return {
              rank: idx + 1,
              name: item.player.name,
              country: item.player.nationality + ' ' + (teamFlags[item.player.nationality] || ''),
              value: `${stats.goals.total || 0} goals`,
              subtext: `${stats.goals.assists || 0} Assists, Rating ${stats.games.rating || '0.00'}`,
              photoUrl: item.player.photo,
              jerseyColor: teamColors[stats.team.name]?.primary || "#71717a",
              number: stats.games.number || "10"
            };
          });
        }
        if (assistsData.response && assistsData.response.length > 0) {
          mappedStats.assists = assistsData.response.slice(0, 5).map((item, idx) => {
            const stats = item.statistics[0];
            return {
              rank: idx + 1,
              name: item.player.name,
              country: item.player.nationality + ' ' + (teamFlags[item.player.nationality] || ''),
              value: `${stats.goals.assists || 0} assists`,
              subtext: `${stats.goals.total || 0} Goals, Rating ${stats.games.rating || '0.00'}`,
              photoUrl: item.player.photo,
              jerseyColor: teamColors[stats.team.name]?.primary || "#71717a",
              number: stats.games.number || "7"
            };
          });
        }

        if (mappedStats.goals.length > 0 || mappedStats.assists.length > 0) {
          cache.stats = mappedStats;
          cache.statsTime = now;
        }
      } catch (err) {
        console.error('[API-SPORTS] Stats fetch error:', err);
        hasError = true;
      }
    }

    return res.status(200).json({
      matchesList: cache.fixtures || mockMatches,
      allGroupsStandings: cache.standings || mockAllGroupsStandings,
      topStatsData: cache.stats || mockTopStatsData,
      isSimulated: hasError || (!cache.fixtures && !cache.standings && !cache.stats),
      lastUpdated: cache.fixturesTime || now
    });

  } catch (error) {
    console.error('[API-SPORTS] Upstream error:', error);
    return res.status(200).json({
      matchesList: cache.fixtures || mockMatches,
      allGroupsStandings: cache.standings || mockAllGroupsStandings,
      topStatsData: cache.stats || mockTopStatsData,
      isSimulated: true,
      lastUpdated: cache.fixturesTime || now
    });
  }
}

export function resetCacheForTesting() {
  cache.fixtures = null;
  cache.fixturesTime = 0;
  cache.standings = null;
  cache.standingsTime = 0;
  cache.stats = null;
  cache.statsTime = 0;
  dailyCallCount = 0;
  lastResetDate = "";
}
