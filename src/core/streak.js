import { getTodayDate, getYesterdayDate, addDays, getDaysDifference, parseDate } from './dates.js';

/**
 * Calculates current streak, longest streak, and stats for a single habit.
 * 
 * @param {string} habitId 
 * @param {Object} records - Keyed by 'YYYY-MM-DD', contains { [habitId]: { completed: boolean } }
 * @param {string} habitCreatedAt - 'YYYY-MM-DD'
 * @param {string} referenceDate - defaults to today
 */
export function calculateHabitStreak(habitId, records = {}, habitCreatedAt = null, referenceDate = null) {
  const today = referenceDate || getTodayDate();
  const yesterday = getYesterdayDate(today);

  // Collect all dates where this habit was completed, sorted ascending
  const completedDates = Object.keys(records)
    .filter(dateStr => records[dateStr] && records[dateStr][habitId] && records[dateStr][habitId].completed)
    .sort();

  const completedSet = new Set(completedDates);
  const totalCompletedDays = completedDates.length;

  // 1. Calculate Current Streak
  let currentStreak = 0;
  const isCompletedToday = completedSet.has(today);
  const isCompletedYesterday = completedSet.has(yesterday);

  if (isCompletedToday) {
    currentStreak = 1;
    let checkDate = yesterday;
    while (completedSet.has(checkDate)) {
      currentStreak++;
      checkDate = getYesterdayDate(checkDate);
    }
  } else if (isCompletedYesterday) {
    // Streak is alive from yesterday; completing today will advance it
    currentStreak = 1;
    let checkDate = getYesterdayDate(yesterday);
    while (completedSet.has(checkDate)) {
      currentStreak++;
      checkDate = getYesterdayDate(checkDate);
    }
  } else {
    currentStreak = 0;
  }

  // 2. Calculate Longest Streak in history
  let longestStreak = 0;
  if (completedDates.length > 0) {
    let tempStreak = 0;
    let prevDate = null;

    for (const dateStr of completedDates) {
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diff = getDaysDifference(prevDate, dateStr);
        if (diff === 1) {
          tempStreak++;
        } else if (diff > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevDate = dateStr;
    }
  }

  // Ensure longest streak is at least current streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // 3. Calculate Completion Percentage
  // From habitCreatedAt to today (or last 30 days if creation date is in future)
  const startDate = habitCreatedAt && habitCreatedAt <= today ? habitCreatedAt : (completedDates[0] || today);
  const totalDaysSpan = Math.max(1, getDaysDifference(startDate, today) + 1);
  const completionRate = Math.min(100, Math.round((totalCompletedDays / totalDaysSpan) * 100));

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays,
    completionRate,
    isCompletedToday
  };
}

/**
 * Calculates global activity streaks across all active habits.
 * A day is considered active if at least 1 habit was completed.
 */
export function calculateGlobalStreaks(habits = [], records = {}, referenceDate = null) {
  const today = referenceDate || getTodayDate();
  const yesterday = getYesterdayDate(today);

  // Filter active habits
  const activeHabitIds = new Set(habits.filter(h => h.enabled !== false).map(h => h.id));
  if (activeHabitIds.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletedDays: 0,
      todayCompletedCount: 0,
      activeHabitsCount: 0,
      todayCompletionRate: 0
    };
  }

  // Find all dates with at least 1 active habit completed
  const allDates = Object.keys(records).sort();
  const activeDates = [];
  const dailyCounts = {};

  for (const dateStr of allDates) {
    const dayRecord = records[dateStr];
    if (!dayRecord) continue;
    let count = 0;
    for (const habitId of activeHabitIds) {
      if (dayRecord[habitId] && dayRecord[habitId].completed) {
        count++;
      }
    }
    dailyCounts[dateStr] = count;
    if (count > 0) {
      activeDates.push(dateStr);
    }
  }

  const activeDateSet = new Set(activeDates);

  // Global Current Streak
  let currentStreak = 0;
  const isTodayActive = activeDateSet.has(today);
  const isYesterdayActive = activeDateSet.has(yesterday);

  if (isTodayActive) {
    currentStreak = 1;
    let checkDate = yesterday;
    while (activeDateSet.has(checkDate)) {
      currentStreak++;
      checkDate = getYesterdayDate(checkDate);
    }
  } else if (isYesterdayActive) {
    currentStreak = 1;
    let checkDate = getYesterdayDate(yesterday);
    while (activeDateSet.has(checkDate)) {
      currentStreak++;
      checkDate = getYesterdayDate(checkDate);
    }
  } else {
    currentStreak = 0;
  }

  // Global Longest Streak
  let longestStreak = 0;
  if (activeDates.length > 0) {
    let tempStreak = 0;
    let prevDate = null;
    for (const dateStr of activeDates) {
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diff = getDaysDifference(prevDate, dateStr);
        if (diff === 1) {
          tempStreak++;
        } else if (diff > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevDate = dateStr;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  const todayCompletedCount = dailyCounts[today] || 0;
  const activeHabitsCount = activeHabitIds.size;
  const todayCompletionRate = activeHabitsCount > 0 
    ? Math.round((todayCompletedCount / activeHabitsCount) * 100) 
    : 0;

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays: activeDates.length,
    todayCompletedCount,
    activeHabitsCount,
    todayCompletionRate
  };
}
