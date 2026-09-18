/**
 * Date utilities for HabitCode
 * Handles local date strings (YYYY-MM-DD) avoiding timezone shifting bugs.
 */

export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function getTodayDate() {
  return formatDate(new Date());
}

export function getYesterdayDate(referenceDateStr = null) {
  const d = referenceDateStr ? parseDate(referenceDateStr) : new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

export function addDays(dateStr, numDays) {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + numDays);
  return formatDate(d);
}

export function getDaysDifference(dateStr1, dateStr2) {
  const d1 = parseDate(dateStr1);
  const d2 = parseDate(dateStr2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatReadableDate(dateStr, formatType = 'full') {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  
  if (formatType === 'short') {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  if (formatType === 'month-year') {
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }
  if (formatType === 'weekday') {
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }
  // full: "Friday, Sep 18, 2026"
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Returns a 52-week grid (364-371 days) ending on the current week's Saturday (or Sunday)
 * suitable for GitHub/LeetCode style contribution calendar.
 */
export function getContributionCalendarDays(endDateStr = null) {
  const endDate = endDateStr ? parseDate(endDateStr) : new Date();
  // Ensure we complete the last week (e.g. end on Saturday)
  const dayOfWeek = endDate.getDay(); // 0 = Sun, 6 = Sat
  const daysToEndOfWeek = 6 - dayOfWeek;
  const gridEnd = new Date(endDate);
  gridEnd.setDate(gridEnd.getDate() + daysToEndOfWeek);

  // We want approximately 52-53 weeks (52 * 7 = 364 days + remainder)
  const totalDays = 53 * 7;
  const gridStart = new Date(gridEnd);
  gridStart.setDate(gridStart.getDate() - (totalDays - 1));

  const days = [];
  const current = new Date(gridStart);

  while (current <= gridEnd) {
    const formatted = formatDate(current);
    days.push({
      date: formatted,
      dayOfWeek: current.getDay(),
      month: current.getMonth(),
      year: current.getFullYear(),
      isFuture: current > endDate
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function isSameDay(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}
