export const MATCH_OFFSETS = {
  M1: { days: 2, time: "17:00 Local" },
  M2: { days: 3, time: "20:00 Local" },
  M3: { days: 3, time: "18:00 Local" },
  M4: { days: 4, time: "19:00 Local" },
  M5: { days: -6, time: "15:00 Local" },
  M6: { days: -6, time: "20:00 Local" },
  M7: { days: -8, time: "19:00 Local" },
  M8: { days: -8, time: "20:00 Local" },
  M9: { days: -7, time: "18:00 Local" },
  M13: { days: -32, time: "18:00 Local" },
  M14: { days: -31, time: "19:00 Local" }
};

export function getRelativeDateString(daysFromNow, now = new Date()) {
  const targetDate = new Date(now.getTime());
  targetDate.setDate(targetDate.getDate() + daysFromNow);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[targetDate.getMonth()];
  const day = String(targetDate.getDate()).padStart(2, '0');
  const year = targetDate.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

export function getRelativeMatchDate(matchId, now = new Date()) {
  const offset = MATCH_OFFSETS[matchId];
  if (!offset) return getRelativeDateString(0, now);
  return getRelativeDateString(offset.days, now);
}

export const mockMatches = [
  {
    id: "M1",
    teamA: "France",
    teamAFlag: "🇫🇷",
    teamB: "Morocco",
    teamBFlag: "🇲🇦",
    teamAColors: { primary: "#002395", secondary: "#ED2939", accent: "#FFFFFF", name: "France Royal Blue" },
    teamBColors: { primary: "#006241", secondary: "#C1272D", accent: "#FFFFFF", name: "Morocco Green & Red" },
    time: MATCH_OFFSETS.M1.time,
    date: getRelativeMatchDate("M1"),
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
    time: MATCH_OFFSETS.M2.time,
    date: getRelativeMatchDate("M2"),
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
    time: MATCH_OFFSETS.M3.time,
    date: getRelativeMatchDate("M3"),
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
    time: MATCH_OFFSETS.M4.time,
    date: getRelativeMatchDate("M4"),
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
    time: MATCH_OFFSETS.M5.time,
    date: getRelativeMatchDate("M5"),
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
    time: MATCH_OFFSETS.M6.time,
    date: getRelativeMatchDate("M6"),
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
    time: MATCH_OFFSETS.M7.time,
    date: getRelativeMatchDate("M7"),
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
    time: MATCH_OFFSETS.M8.time,
    date: getRelativeMatchDate("M8"),
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
    time: MATCH_OFFSETS.M9.time,
    date: getRelativeMatchDate("M9"),
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
    time: MATCH_OFFSETS.M13.time,
    date: getRelativeMatchDate("M13"),
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
    time: MATCH_OFFSETS.M14.time,
    date: getRelativeMatchDate("M14"),
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
