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
