// Serverless function to fetch, cache, and serve FIFA 2026 World Cup data from API-SPORTS
// using Vercel KV to survive cold starts and sync daily quotas across instances.

import { kv } from '@vercel/kv';
import { computeMatchStatus } from '../src/utils/matchStatus.js';
import { mockMatches } from '../src/utils/relativeMatchDates.js';

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
    { rank: 1, name: "Lamine Yamal", country: "Spain 🇪🇸", value: "5 assists", subtext: "2 Goals, Rating 9.10", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Lamine_Yamal_in_2025.jpg", jerseyColor: "#C1272D", number: "19" },
    { rank: 2, name: "Antoine Griezmann", country: "France 🇫🇷", value: "4 assists", subtext: "1 Goal, Rating 8.50", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Antoine_Griezmann_%2851100409504%29_%28cropped%29.jpg", jerseyColor: "#002395", number: "7" }
  ],
  cleanSheets: [
    { rank: 1, name: "Mike Maignan", country: "France 🇫🇷", value: "4 clean sheets", subtext: "5 Matches, 15 Saves", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Mike_Maignan_France_v_Norway_26_June_26-132_%28cropped%29.jpg", jerseyColor: "#002395", number: "1" },
    { rank: 2, name: "Emiliano Martínez", country: "Argentina 🇦🇷", value: "3 clean sheets", subtext: "5 Matches, 12 Saves", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg", jerseyColor: "#75AADB", number: "23" }
  ],
  discipline: [
    { rank: 1, name: "Antonio Rüdiger", country: "Germany 🇩🇪", value: "3 yellow cards", subtext: "0 Red Cards, 8 Fouls", photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/Antonio_Rudiger_Ecuador_v_Germany_25_June_2026-055_%28cropped%29.jpg", jerseyColor: "#FFFFFF", number: "2" }
  ]
};

const teamFlags = {
  "France": "🇫🇷", "Morocco": "🇲🇦", "Spain": "🇪🇸", "Belgium": "🇧🇪",
  "Germany": "🇩🇪", "Argentina": "🇦🇷", "Norway": "🇳🇴", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Canada": "🇨🇦", "Brazil": "🇧🇷", "Portugal": "🇵🇹", "Mexico": "🇲🇽",
  "USA": "🇺🇸", "South Africa": "🇿🇦", "Peru": "🇵🇪", "New Zealand": "🇳🇿",
  "Qatar": "🇶🇦", "Ecuador": "🇪🇨", "Senegal": "🇸🇳", "Netherlands": "🇳🇱",
  "Iran": "🇮🇷", "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Saudi Arabia": "🇸🇦", "Poland": "🇵🇱",
  "Australia": "🇦🇺", "Denmark": "🇩🇰", "Tunisia": "🇹🇳", "Costa Rica": "🇨🇷",
  "Japan": "🇯🇵", "Croatia": "🇭🇷", "Switzerland": "🇨🇭", "Cameroon": "🇨🇲",
  "Serbia": "🇷🇸", "Uruguay": "🇺🇾", "South Korea": "🇰🇷", "Ghana": "🇬🇭"
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
  "South Africa": { primary: "#000000", secondary: "#007A4B", accent: "#F4A900", name: "South Africa Gold & Green" },
  "Qatar": { primary: "#8A1538", secondary: "#FFFFFF", accent: "#8A1538", name: "Qatar Maroon" },
  "Ecuador": { primary: "#FFDD00", secondary: "#2F509E", accent: "#DD2534", name: "Ecuador Yellow" },
  "Senegal": { primary: "#00853F", secondary: "#FDEF42", accent: "#E31B23", name: "Senegal Green" },
  "Netherlands": { primary: "#F36C21", secondary: "#FFFFFF", accent: "#21468B", name: "Netherlands Orange" },
  "Iran": { primary: "#239E46", secondary: "#FFFFFF", accent: "#DA3832", name: "Iran Green" },
  "Wales": { primary: "#C8102E", secondary: "#00AB4E", accent: "#FFFFFF", name: "Wales Red" },
  "Saudi Arabia": { primary: "#006C35", secondary: "#FFFFFF", accent: "#006C35", name: "Saudi Arabia Green" },
  "Poland": { primary: "#FFFFFF", secondary: "#DC143C", accent: "#FFFFFF", name: "Poland White & Red" },
  "Australia": { primary: "#002F6C", secondary: "#FFCD00", accent: "#008751", name: "Australia Blue & Gold" },
  "Denmark": { primary: "#C8102E", secondary: "#FFFFFF", accent: "#C8102E", name: "Denmark Red & White" },
  "Tunisia": { primary: "#E70013", secondary: "#FFFFFF", accent: "#E70013", name: "Tunisia Red" },
  "Costa Rica": { primary: "#C8102E", secondary: "#002B49", accent: "#FFFFFF", name: "Costa Rica Red" },
  "Japan": { primary: "#00005C", secondary: "#FFFFFF", accent: "#D30000", name: "Japan Blue Samurai" },
  "Croatia": { primary: "#C8102E", secondary: "#FFFFFF", accent: "#1D2B58", name: "Croatia Checkers" },
  "Switzerland": { primary: "#D52B1E", secondary: "#FFFFFF", accent: "#D52B1E", name: "Switzerland Red" },
  "Cameroon": { primary: "#007A5E", secondary: "#CE1126", accent: "#FCD116", name: "Cameroon Green" },
  "Serbia": { primary: "#C8102E", secondary: "#0C4076", accent: "#FFFFFF", name: "Serbia Red" },
  "Uruguay": { primary: "#55B3FF", secondary: "#FFFFFF", accent: "#FFDD00", name: "Uruguay Sky Blue" },
  "South Korea": { primary: "#E4002B", secondary: "#000000", accent: "#115740", name: "South Korea Red" },
  "Ghana": { primary: "#FFFFFF", secondary: "#FCD116", accent: "#CE1126", name: "Ghana White" }
};

const defaultColors = { primary: "#71717a", secondary: "#e4e4e7", accent: "#ffffff", name: "Default Gray" };

const starPlayers = {
  "Qatar": { name: "Almoez Ali", number: "19", id: 22223, stats: "1 Goal, 2 Shots, Rating 7.2" },
  "Ecuador": { name: "Enner Valencia", number: "13", id: 2682, stats: "3 Goals, Rating 8.4" },
  "Senegal": { name: "Sadio Mané", number: "10", id: 13, stats: "1 Goal, Rating 7.8" },
  "Netherlands": { name: "Cody Gakpo", number: "8", id: 184, stats: "3 Goals, Rating 8.2" },
  "England": { name: "Harry Kane", number: "9", id: 184, stats: "2 Goals, 3 Assists, Rating 8.4" },
  "Iran": { name: "Mehdi Taremi", number: "9", id: 367, stats: "2 Goals, Rating 7.6" },
  "USA": { name: "Christian Pulisic", number: "10", id: 368, stats: "1 Goal, 1 Assist, Rating 8.1" },
  "Wales": { name: "Gareth Bale", number: "11", id: 172, stats: "1 Goal, Rating 7.0" },
  "Argentina": { name: "Lionel Messi", number: "10", id: 154, stats: "7 Goals, 3 Assists, Rating 9.0" },
  "Saudi Arabia": { name: "Salem Al-Dawsari", number: "10", id: 2314, stats: "2 Goals, Rating 7.5" },
  "Mexico": { name: "Guillermo Ochoa", number: "13", id: 2378, stats: "1 Penalty Save, Rating 7.8" },
  "Poland": { name: "Robert Lewandowski", number: "9", id: 521, stats: "2 Goals, 1 Assist, Rating 7.9" },
  "France": { name: "Kylian Mbappé", number: "10", id: 278, stats: "8 Goals, 2 Assists, Rating 8.9" },
  "Australia": { name: "Craig Goodwin", number: "23", id: 2884, stats: "1 Goal, Rating 7.3" },
  "Denmark": { name: "Christian Eriksen", number: "10", id: 190, stats: "1 Assist, Rating 7.4" },
  "Tunisia": { name: "Wahbi Khazri", number: "10", id: 41, stats: "1 Goal, Rating 7.6" },
  "Spain": { name: "Álvaro Morata", number: "7", id: 147, stats: "3 Goals, 1 Assist, Rating 8.0" },
  "Costa Rica": { name: "Keylor Navas", number: "1", id: 735, stats: "1 Clean Sheet, Rating 7.5" },
  "Germany": { name: "Kai Havertz", number: "7", id: 105, stats: "2 Goals, Rating 7.7" },
  "Japan": { name: "Ritsu Doan", number: "8", id: 1221, stats: "2 Goals, Rating 7.8" },
  "Belgium": { name: "Michy Batshuayi", number: "23", id: 622, stats: "1 Goal, Rating 7.1" },
  "Canada": { name: "Alphonso Davies", number: "19", id: 191, stats: "1 Goal, Rating 7.4" },
  "Morocco": { name: "Hakim Ziyech", number: "7", id: 2289, stats: "1 Goal, 1 Assist, Rating 8.2" },
  "Croatia": { name: "Luka Modrić", number: "10", id: 752, stats: "1 Assist, Rating 8.1" },
  "Switzerland": { name: "Breel Embolo", number: "7", id: 128, stats: "2 Goals, Rating 7.5" },
  "Cameroon": { name: "Vincent Aboubakar", number: "10", id: 1845, stats: "2 Goals, 1 Assist, Rating 8.0" },
  "Brazil": { name: "Neymar Jr", number: "10", id: 276, stats: "2 Goals, 1 Assist, Rating 8.3" },
  "Serbia": { name: "Aleksandar Mitrović", number: "9", id: 202, stats: "2 Goals, Rating 7.4" },
  "Uruguay": { name: "Giorgian de Arrascaeta", number: "10", id: 213, stats: "2 Goals, Rating 7.9" },
  "South Korea": { name: "Son Heung-min", number: "7", id: 186, stats: "1 Assist, Rating 7.5" },
  "Portugal": { name: "Bruno Fernandes", number: "8", id: 211, stats: "2 Goals, 3 Assists, Rating 8.6" },
  "Ghana": { name: "Mohammed Kudus", number: "20", id: 187, stats: "2 Goals, Rating 7.8" }
};

function getStarPlayer(teamName) {
  const player = starPlayers[teamName] || { name: `${teamName} Player`, number: "10", id: 0, stats: "Active Rating 7.0" };
  return {
    name: player.name,
    jerseyColor: teamColors[teamName]?.primary || "#71717a",
    number: player.number,
    stats: player.stats,
    photoUrl: player.id ? `https://media.api-sports.io/football/players/${player.id}.png` : ""
  };
}

function mapStatus(shortStatus) {
  const liveCodes = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'INT'];
  const completedCodes = ['FT', 'AET', 'PEN', 'AWD'];
  if (liveCodes.includes(shortStatus)) return 'LIVE';
  if (completedCodes.includes(shortStatus)) return 'COMPLETED';
  return 'UPCOMING';
}

export default async function handler(req, res) {
  if (process.env.NODE_ENV !== 'production' && ((req.query && req.query.debug === 'dump') || (req.url && req.url.includes('debug=dump')))) {
    const todayStr = new Date().toISOString().split('T')[0];
    const quotaKey = `sports_quota:${todayStr}`;
    try {
      const sports_fixtures = await kv.get('sports_fixtures');
      const sports_standings = await kv.get('sports_standings');
      const sports_stats = await kv.get('sports_stats');
      const sports_quota = await kv.get(quotaKey);
      return res.status(200).json({
        sports_fixtures,
        sports_standings,
        sports_stats,
        sports_quota,
        quotaKey
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to dump KV keys', message: err.message || String(err) });
    }
  }

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
  let fallbackReason = '';

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
      matchesList: (cachedFixtures || mockMatches).map(m => ({ ...m, status: computeMatchStatus(m) })),
      allGroupsStandings: cachedStandings || mockAllGroupsStandings,
      topStatsData: cachedStats || mockTopStatsData,
      isSimulated: true,
      lastUpdated: fixturesTime || now,
      debug: {
        cacheHitFixtures: !!cachedFixtures,
        cacheHitStandings: !!cachedStandings,
        cacheHitStats: !!cachedStats,
        dailyCallCount: currentQuota,
        hasError: false,
        isSimulated: true,
        reason: !apiKey ? "missing_api_key" : "quota_exceeded",
        leagueId: LEAGUE_ID,
        season: SEASON
      }
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
          
          if (fixturesData.errors && Object.keys(fixturesData.errors).length > 0) {
            console.warn('[API-SPORTS] Fixtures query returned errors:', fixturesData.errors);
            fallbackReason = JSON.stringify(fixturesData.errors);
            hasError = true;
          }
          
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
                bestPlayer: getStarPlayer(home).name,
                bestPlayerDetails: getStarPlayer(home),
                opponentBestPlayerDetails: getStarPlayer(away),
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
          
          if (standingsData.errors && Object.keys(standingsData.errors).length > 0) {
            console.warn('[API-SPORTS] Standings query returned errors:', standingsData.errors);
            fallbackReason = JSON.stringify(standingsData.errors);
            hasError = true;
          }
          
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

          if (scorersData.errors && Object.keys(scorersData.errors).length > 0) {
            console.warn('[API-SPORTS] Scorers query returned errors:', scorersData.errors);
            fallbackReason = JSON.stringify(scorersData.errors);
            hasError = true;
          }
          if (assistsData.errors && Object.keys(assistsData.errors).length > 0) {
            console.warn('[API-SPORTS] Assists query returned errors:', assistsData.errors);
            fallbackReason = JSON.stringify(assistsData.errors);
            hasError = true;
          }

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
                photoUrl: item.player.photo || (item.player.id ? `https://media.api-sports.io/football/players/${item.player.id}.png` : ''),
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
                photoUrl: item.player.photo || (item.player.id ? `https://media.api-sports.io/football/players/${item.player.id}.png` : ''),
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
      matchesList: (cachedFixtures || mockMatches).map(m => ({ ...m, status: computeMatchStatus(m) })),
      allGroupsStandings: cachedStandings || mockAllGroupsStandings,
      topStatsData: cachedStats || mockTopStatsData,
      isSimulated: hasError || (!cachedFixtures && !cachedStandings && !cachedStats),
      lastUpdated: fixturesTime || now,
      debug: {
        cacheHitFixtures: !needFixtures,
        cacheHitStandings: !needStandings,
        cacheHitStats: !needStats,
        dailyCallCount: currentQuota,
        hasError,
        isSimulated: hasError || (!cachedFixtures && !cachedStandings && !cachedStats),
        reason: fallbackReason || (!apiKey ? "missing_api_key" : (currentQuota >= 90 ? "quota_exceeded" : "")),
        leagueId: LEAGUE_ID,
        season: SEASON
      }
    });

  } catch (error) {
    console.error('[API-SPORTS] Upstream error:', error);
    return res.status(200).json({
      matchesList: (cachedFixtures || mockMatches).map(m => ({ ...m, status: computeMatchStatus(m) })),
      allGroupsStandings: cachedStandings || mockAllGroupsStandings,
      topStatsData: cachedStats || mockTopStatsData,
      isSimulated: true,
      lastUpdated: fixturesTime || now,
      debug: {
        cacheHitFixtures: !!cachedFixtures,
        cacheHitStandings: !!cachedStandings,
        cacheHitStats: !!cachedStats,
        dailyCallCount: currentQuota,
        hasError: true,
        rawError: error.message || String(error),
        isSimulated: true,
        reason: fallbackReason || (!apiKey ? "missing_api_key" : (currentQuota >= 90 ? "quota_exceeded" : "upstream_catch_error")),
        leagueId: LEAGUE_ID,
        season: SEASON
      }
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
