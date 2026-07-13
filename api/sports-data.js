// Serverless function to fetch, cache, and serve FIFA 2026 World Cup data from API-SPORTS
// using Vercel KV to survive cold starts and sync daily quotas across instances.

import { kv } from '@vercel/kv';

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

// TTLs in seconds for Vercel KV expiration
const FIXTURES_TTL_SECS = 20 * 60; // 20 minutes
const STANDINGS_TTL_SECS = 60 * 60; // 60 minutes
const STATS_TTL_SECS = 60 * 60; // 60 minutes

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
    stadium: "SoFi Stadium, Los Angeles",
    status: "UPCOMING",
    minute: "QF 2",
    scoreA: 0,
    scoreB: 0,
    events: [],
    bestPlayer: "Lamine Yamal",
    bestPlayerDetails: {
      name: "Lamine Yamal",
      jerseyColor: "#C1272D",
      number: "19",
      stats: "2 Goals, 4 Assists, Rating 9.1",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lamine_Yamal_2024.jpg"
    },
    opponentBestPlayerDetails: {
      name: "Kevin De Bruyne",
      jerseyColor: "#000000",
      number: "7",
      stats: "2 Goals, 3 Assists, Rating 8.7",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg"
    },
    details: "Quarter-Final match 2 at SoFi Stadium."
  },
  {
    id: "M3",
    teamA: "Germany",
    teamAFlag: "🇩🇪",
    teamB: "Argentina",
    teamBFlag: "🇦🇷",
    teamAColors: { primary: "#FFFFFF", secondary: "#000000", accent: "#FFCC00", name: "Germany White" },
    teamBColors: { primary: "#75AADB", secondary: "#FFFFFF", accent: "#75AADB", name: "Argentina Albiceleste" },
    time: "16:00 Local",
    date: "Jul 12, 2026",
    stadium: "MetLife Stadium, NJ",
    status: "UPCOMING",
    minute: "QF 3",
    scoreA: 0,
    scoreB: 0,
    events: [],
    bestPlayer: "Jamal Musiala",
    bestPlayerDetails: {
      name: "Jamal Musiala",
      jerseyColor: "#FFFFFF",
      number: "10",
      stats: "4 Goals, Rating 9.2",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Jamal_Musiala_2022.jpg"
    },
    opponentBestPlayerDetails: {
      name: "Lionel Messi",
      jerseyColor: "#75AADB",
      number: "10",
      stats: "3 Goals, 3 Assists, Rating 9.0",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg"
    },
    details: "Quarter-Final match 3 at MetLife Stadium."
  },
  {
    id: "M4",
    teamA: "Norway",
    teamAFlag: "🇳🇴",
    teamB: "England",
    teamBFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    teamAColors: { primary: "#BA0C2F", secondary: "#00205B", accent: "#FFFFFF", name: "Norway Red" },
    teamBColors: { primary: "#FFFFFF", secondary: "#CF0820", accent: "#00205B", name: "England White" },
    time: "19:00 Local",
    date: "Jul 13, 2026",
    stadium: "Arrowhead Stadium, Kansas City",
    status: "UPCOMING",
    minute: "QF 4",
    scoreA: 0,
    scoreB: 0,
    events: [],
    bestPlayer: "Erling Haaland",
    bestPlayerDetails: {
      name: "Erling Haaland",
      jerseyColor: "#BA0C2F",
      number: "9",
      stats: "6 Goals, Golden Boot Leader, Rating 9.4",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg"
    },
    opponentBestPlayerDetails: {
      name: "Jude Bellingham",
      jerseyColor: "#FFFFFF",
      number: "10",
      stats: "2 Goals, 3 Assists, Rating 8.8",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg"
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
    scoreB: 2,
    teamAColors: { primary: "#006847", secondary: "#D00C27", accent: "#FFFFFF", name: "Mexico Green" },
    teamBColors: { primary: "#000000", secondary: "#007A4B", accent: "#F4A900", name: "South Africa Gold & Green" },
    events: [
      { minute: "12'", player: "S. Giménez (MEX)", type: "Goal" },
      { minute: "40'", player: "P. Tau (RSA)", type: "Goal" }
    ],
    bestPlayer: "Santiago Giménez",
    bestPlayerDetails: { name: "Santiago Giménez", jerseyColor: "#006847", number: "9", stats: "1 Goal, Rating 8.0", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Santiago_Gim%C3%A9nez.png" },
    opponentBestPlayerDetails: { name: "Percy Tau", jerseyColor: "#000000", number: "10", stats: "1 Goal, Rating 7.8", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Percy_Tau_2019.jpg" },
    details: "Opening fixture ended in a hard-fought draw at Estadio Azteca.",
    videoUrl: "https://www.youtube.com/embed/simulated-mex-rsa"
  }
];

const mockAllGroupsStandings = {
  "Group A": [
    { rank: 1, team: "Mexico 🇲🇽", played: 3, won: 2, drawn: 1, lost: 0, gd: 4, points: 7 },
    { rank: 2, team: "South Africa 🇿🇦", played: 3, won: 1, drawn: 2, lost: 0, gd: 2, points: 5 },
    { rank: 3, team: "Canada 🇨🇦", played: 3, won: 1, drawn: 1, lost: 1, gd: -1, points: 4 },
    { rank: 4, team: "New Zealand 🇳🇿", played: 3, won: 0, drawn: 0, lost: 3, gd: -5, points: 0 }
  ],
  "Group B": [
    { rank: 1, team: "France 🇫🇷", played: 3, won: 3, drawn: 0, lost: 0, gd: 6, points: 9 },
    { rank: 2, team: "Morocco 🇲🇦", played: 3, won: 2, drawn: 0, lost: 1, gd: 3, points: 6 },
    { rank: 3, team: "USA 🇺🇸", played: 3, won: 1, drawn: 0, lost: 2, gd: -2, points: 3 },
    { rank: 4, team: "Peru 🇵🇪", played: 3, won: 0, drawn: 0, lost: 3, gd: -7, points: 0 }
  ]
};

const mockTopStatsData = {
  goals: [
    { rank: 1, name: "Erling Haaland", country: "Norway 🇳🇴", value: "8 goals", subtext: "2 Assists, Rating 9.40", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Erling_Haaland_Morocco_v_Norway_7_June_2026-51.jpg", jerseyColor: "#BA0C2F", number: "9" },
    { rank: 2, name: "Kylian Mbappé", country: "France 🇫🇷", value: "6 goals", subtext: "1 Assist, Rating 8.90", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Kylian_Mbappé_2018.jpg", jerseyColor: "#002395", number: "10" },
    { rank: 3, name: "Lionel Messi", country: "Argentina 🇦🇷", value: "5 goals", subtext: "3 Assists, Rating 9.10", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg", jerseyColor: "#75AADB", number: "10" }
  ],
  assists: [
    { rank: 1, name: "Lamine Yamal", country: "Spain 🇪🇸", value: "5 assists", subtext: "2 Goals, Rating 9.10", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lamine_Yamal_2024.jpg", jerseyColor: "#C1272D", number: "19" },
    { rank: 2, name: "Antoine Griezmann", country: "France 🇫🇷", value: "4 assists", subtext: "1 Goal, Rating 8.50", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Antoine_Griezmann_2021_%28cropped%29.jpg", jerseyColor: "#002395", number: "7" }
  ],
  cleanSheets: [
    { rank: 1, name: "Mike Maignan", country: "France 🇫🇷", value: "4 clean sheets", subtext: "5 Matches, 15 Saves", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Mike_Maignan_2021.jpg", jerseyColor: "#002395", number: "1" },
    { rank: 2, name: "Emiliano Martínez", country: "Argentina 🇦🇷", value: "3 clean sheets", subtext: "5 Matches, 12 Saves", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg", jerseyColor: "#75AADB", number: "23" }
  ],
  discipline: [
    { rank: 1, name: "Antonio Rüdiger", country: "Germany 🇩🇪", value: "3 yellow cards", subtext: "0 Red Cards, 8 Fouls", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Antonio_Rüdiger_2020.jpg", jerseyColor: "#FFFFFF", number: "2" }
  ]
};

const teamFlags = {
  "France": "🇫🇷", "Morocco": "🇲🇦", "Spain": "🇪🇸", "Belgium": "🇧🇪",
  "Germany": "🇩🇪", "Argentina": "🇦🇷", "Norway": "🇳🇴", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Canada": "🇨🇦", "Brazil": "🇧🇷", "Portugal": "🇵🇹", "Mexico": "🇲🇽",
  "USA": "🇺🇸", "South Africa": "🇿🇦", "Peru": "🇵🇪", "New Zealand": "🇳🇿"
};

const teamColors = {
  "France": { primary: "#002395", secondary: "#ED2939", accent: "#FFFFFF", name: "France Royal Blue" },
  "Morocco": { primary: "#006241", secondary: "#C1272D", accent: "#FFFFFF", name: "Morocco Green & Red" },
  "Spain": { primary: "#C1272D", secondary: "#FEDF00", accent: "#002395", name: "Spain Red & Gold" },
  "Belgium": { primary: "#000000", secondary: "#DD0000", accent: "#FEDF00", name: "Belgium Black & Red" },
  "Germany": { primary: "#FFFFFF", secondary: "#000000", accent: "#FFCC00", name: "Germany White" },
  "Argentina": { primary: "#75AADB", secondary: "#FFFFFF", accent: "#75AADB", name: "Argentina Albiceleste" },
  "Norway": { primary: "#BA0C2F", secondary: "#00205B", accent: "#FFFFFF", name: "Norway Red" },
  "England": { primary: "#FFFFFF", secondary: "#CF0820", accent: "#00205B", name: "England White" },
  "Canada": { primary: "#FF0000", secondary: "#FFFFFF", accent: "#FF0000", name: "Canada Red" },
  "Brazil": { primary: "#FEDF00", secondary: "#009B3A", accent: "#00205B", name: "Brazil Gold" },
  "Portugal": { primary: "#006600", secondary: "#FF0000", accent: "#FFFFFF", name: "Portugal Red" },
  "Mexico": { primary: "#006847", secondary: "#D00C27", accent: "#FFFFFF", name: "Mexico Green" },
  "USA": { primary: "#0A3161", secondary: "#B31942", accent: "#FFFFFF", name: "USA Blue & Red" },
  "South Africa": { primary: "#000000", secondary: "#007A4B", accent: "#F4A900", name: "South Africa Gold & Green" }
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

  const apiKey = process.env.SPORTS_DATA_API_KEY;
  const now = Date.now();

  const todayStr = new Date().toISOString().split('T')[0];
  const quotaKey = `sports_quota:${todayStr}`;

  // Read caches from Vercel KV
  let cachedFixtures = null;
  let cachedStandings = null;
  let cachedStats = null;
  let fixturesTime = now;
  let standingsTime = now;
  let statsTime = now;
  let currentQuota = 0;

  try {
    const fixturesCacheVal = await kv.get('sports_fixtures');
    if (fixturesCacheVal) {
      cachedFixtures = fixturesCacheVal.data;
      fixturesTime = fixturesCacheVal.updatedAt;
    }
    const standingsCacheVal = await kv.get('sports_standings');
    if (standingsCacheVal) {
      cachedStandings = standingsCacheVal.data;
      standingsTime = standingsCacheVal.updatedAt;
    }
    const statsCacheVal = await kv.get('sports_stats');
    if (statsCacheVal) {
      cachedStats = statsCacheVal.data;
      statsTime = statsCacheVal.updatedAt;
    }
    currentQuota = parseInt(await kv.get(quotaKey) || '0', 10);
  } catch (err) {
    console.error('Error reading from Vercel KV cache/quota:', err);
  }

  // If apiKey is missing, or we reached quota cutoff, serve fallback data
  if (!apiKey || currentQuota >= 90) {
    console.log(`[API-SPORTS] Serving simulated fallback. Key configured: ${!!apiKey}, dailyCallCount: ${currentQuota}/90`);
    return res.status(200).json({
      matchesList: cachedFixtures || mockMatches,
      allGroupsStandings: cachedStandings || mockAllGroupsStandings,
      topStatsData: cachedStats || mockTopStatsData,
      isSimulated: true,
      lastUpdated: fixturesTime || now
    });
  }

  const needFixtures = !cachedFixtures;
  const needStandings = !cachedStandings;
  const needStats = !cachedStats;

  // Calculate seconds to UTC midnight
  const utcNow = new Date();
  const utcMidnight = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), utcNow.getUTCDate() + 1, 0, 0, 0, 0));
  const secondsToMidnight = Math.max(1, Math.floor((utcMidnight.getTime() - utcNow.getTime()) / 1000));

  async function incrementQuota() {
    try {
      const val = await kv.incr(quotaKey);
      if (val === 1) {
        await kv.expire(quotaKey, secondsToMidnight);
      }
      return val;
    } catch (err) {
      console.error('Error incrementing quota in Vercel KV:', err);
      return 91; // Force fallback safety cutoff on database failure
    }
  }

  let hasError = false;

  try {
    const headers = { 'x-apisports-key': apiKey };

    if (needFixtures) {
      try {
        const nextQuota = await incrementQuota();
        console.log(`[API-SPORTS] Fetching fixtures. Daily count: ${nextQuota}/90`);
        if (nextQuota <= 90) {
          const fixturesRes = await fetch(`https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`, { headers });
          const fixturesData = await fixturesRes.json();
          
          if (fixturesData.response && fixturesData.response.length > 0) {
            const mappedFixtures = fixturesData.response.map((f, idx) => {
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
            cachedFixtures = mappedFixtures;
            fixturesTime = now;
            await kv.set('sports_fixtures', { data: mappedFixtures, updatedAt: now }, { ex: FIXTURES_TTL_SECS });
          }
        } else {
          hasError = true;
        }
      } catch (err) {
        console.error('[API-SPORTS] Fixtures fetch error:', err);
        hasError = true;
      }
    }

    if (needStandings) {
      try {
        const nextQuota = await incrementQuota();
        console.log(`[API-SPORTS] Fetching standings. Daily count: ${nextQuota}/90`);
        if (nextQuota <= 90) {
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
            cachedStandings = mappedStandings;
            standingsTime = now;
            await kv.set('sports_standings', { data: mappedStandings, updatedAt: now }, { ex: STANDINGS_TTL_SECS });
          }
        }
      } else {
        hasError = true;
      }
      } catch (err) {
        console.error('[API-SPORTS] Standings fetch error:', err);
        hasError = true;
      }
    }

    if (needStats) {
      try {
        const nextQuota = await incrementQuota();
        console.log(`[API-SPORTS] Fetching player stats. Daily count: ${nextQuota}/90`);
        if (nextQuota <= 90) {
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
            cachedStats = mappedStats;
            statsTime = now;
            await kv.set('sports_stats', { data: mappedStats, updatedAt: now }, { ex: STATS_TTL_SECS });
          }
        } else {
          hasError = true;
        }
      } catch (err) {
        console.error('[API-SPORTS] Stats fetch error:', err);
        hasError = true;
      }
    }

    return res.status(200).json({
      matchesList: cachedFixtures || mockMatches,
      allGroupsStandings: cachedStandings || mockAllGroupsStandings,
      topStatsData: cachedStats || mockTopStatsData,
      isSimulated: hasError || (!cachedFixtures && !cachedStandings && !cachedStats),
      lastUpdated: fixturesTime || now
    });

  } catch (error) {
    console.error('[API-SPORTS] Upstream error:', error);
    return res.status(200).json({
      matchesList: cachedFixtures || mockMatches,
      allGroupsStandings: cachedStandings || mockAllGroupsStandings,
      topStatsData: cachedStats || mockTopStatsData,
      isSimulated: true,
      lastUpdated: fixturesTime || now
    });
  }
}

export async function resetCacheForTesting() {
  try {
    await kv.del('sports_fixtures');
    await kv.del('sports_standings');
    await kv.del('sports_stats');
    const todayStr = new Date().toISOString().split('T')[0];
    await kv.del(`sports_quota:${todayStr}`);
  } catch (err) {
    console.error('Error resetting cache for testing:', err);
  }
}
