export function computeMatchStatus(match, now = new Date()) {
  if (!match) return 'UPCOMING';
  if (match.status === 'LIVE') {
    return 'LIVE';
  }

  const timePart = match.time ? match.time.split(' ')[0] : '18:00';
  let matchDate = new Date(`${match.date} ${timePart}`);
  if (isNaN(matchDate.getTime())) {
    matchDate = new Date(match.date);
  }
  if (isNaN(matchDate.getTime())) {
    return match.status || 'UPCOMING';
  }

  const diffMs = now.getTime() - matchDate.getTime();
  const threeHoursMs = 3 * 60 * 60 * 1000;

  if (diffMs > threeHoursMs) {
    return 'COMPLETED';
  } else if (diffMs >= 0 && diffMs <= threeHoursMs) {
    return 'LIVE';
  } else {
    return 'UPCOMING';
  }
}
