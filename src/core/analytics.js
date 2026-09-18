import { getTodayDate, getYesterdayDate, addDays, getDaysDifference, parseDate, formatReadableDate } from './dates.js';
import { calculateHabitStreak, calculateGlobalStreaks } from './streak.js';

/**
 * Computes the dynamic motivational message based on current progress & streaks.
 */
export function getMotivationalMessage({ todayCompleted, totalActive, currentStreak, longestStreak }) {
  if (totalActive === 0) {
    return {
      message: 'Create your first habit to begin your journey!',
      subtext: 'Every master started with a single step.',
      level: 'Getting Started'
    };
  }

  const ratio = totalActive > 0 ? todayCompleted / totalActive : 0;

  if (todayCompleted === 0) {
    if (currentStreak > 0) {
      return {
        message: `Your ${currentStreak}-day streak is waiting for you! 🔥`,
        subtext: 'Check off your first habit to keep the momentum going.',
        level: 'Streak at Risk'
      };
    }
    return {
      message: 'Start today and build your first streak 🔥',
      subtext: 'Small daily actions compound into extraordinary results.',
      level: 'Day Zero'
    };
  }

  if (ratio === 1) {
    return {
      message: 'Flawless execution! 100% Day Completed! 💎',
      subtext: `You crushed all ${totalActive} habits today. Rest well tonight!`,
      level: 'God Mode'
    };
  }

  if (todayCompleted === totalActive - 1) {
    return {
      message: 'Today is almost perfect! Just 1 habit left! ⭐',
      subtext: 'One more push to achieve 100% completion.',
      level: 'Near Perfection'
    };
  }

  if (ratio >= 0.75) {
    return {
      message: `Outstanding rhythm! ${todayCompleted}/${totalActive} habits done. 🚀`,
      subtext: 'Finish strong today!',
      level: 'High Momentum'
    };
  }

  if (ratio >= 0.5) {
    return {
      message: "You're building unstoppable consistency! 🔥",
      subtext: `Over halfway through today (${todayCompleted}/${totalActive}).`,
      level: 'Halfway There'
    };
  }

  return {
    message: 'Great start! Complete one more habit.',
    subtext: `${totalActive - todayCompleted} habits left to unlock full potential.`,
    level: 'Warming Up'
  };
}

/**
 * Calculates Productivity Scores:
 * - Daily Score (% of active habits completed today)
 * - Weekly Average (past 7 days)
 * - Monthly Average (past 30 days)
 */
export function calculateProductivityScores(habits, records, referenceDate = null) {
  const today = referenceDate || getTodayDate();
  const activeHabits = habits.filter(h => h.enabled !== false);
  const totalActive = activeHabits.length;

  if (totalActive === 0) {
    return { daily: 0, weeklyAvg: 0, monthlyAvg: 0 };
  }

  const activeIds = new Set(activeHabits.map(h => h.id));

  const getDayScore = (dateStr) => {
    const dayRecord = records[dateStr];
    if (!dayRecord) return 0;
    let completed = 0;
    for (const hId of activeIds) {
      if (dayRecord[hId] && dayRecord[hId].completed) {
        completed++;
      }
    }
    return Math.round((completed / totalActive) * 100);
  };

  // Daily Score
  const daily = getDayScore(today);

  // Weekly Average (past 7 days including today)
  let weekSum = 0;
  for (let i = 0; i < 7; i++) {
    const dStr = addDays(today, -i);
    weekSum += getDayScore(dStr);
  }
  const weeklyAvg = Math.round(weekSum / 7);

  // Monthly Average (past 30 days including today)
  let monthSum = 0;
  for (let i = 0; i < 30; i++) {
    const dStr = addDays(today, -i);
    monthSum += getDayScore(dStr);
  }
  const monthlyAvg = Math.round(monthSum / 30);

  return {
    daily,
    weeklyAvg,
    monthlyAvg
  };
}

/**
 * Computes deep analytics for Statistics View
 */
export function computeAnalytics(habits, records, referenceDate = null) {
  const today = referenceDate || getTodayDate();
  const activeHabits = habits.filter(h => h.enabled !== false);
  const totalActive = activeHabits.length;

  // 1. Habit-wise statistics
  const habitStats = habits.map(habit => {
    const streakData = calculateHabitStreak(habit.id, records, habit.createdAt, today);
    return {
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      category: habit.category,
      color: habit.color || '#6366F1',
      enabled: habit.enabled !== false,
      ...streakData
    };
  });

  // 2. Find Most Consistent Habit
  let mostConsistentHabit = null;
  let highestRate = -1;
  let highestCompletions = -1;

  for (const stat of habitStats) {
    if (stat.totalCompletedDays > highestCompletions || 
       (stat.totalCompletedDays === highestCompletions && stat.completionRate > highestRate)) {
      highestCompletions = stat.totalCompletedDays;
      highestRate = stat.completionRate;
      mostConsistentHabit = stat;
    }
  }

  // 3. Past 7 days data for Weekly Chart
  const weeklyChartData = [];
  for (let i = 6; i >= 0; i--) {
    const dateStr = addDays(today, -i);
    const dayRecord = records[dateStr] || {};
    let completedCount = 0;
    activeHabits.forEach(h => {
      if (dayRecord[h.id] && dayRecord[h.id].completed) completedCount++;
    });
    const percentage = totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;
    
    weeklyChartData.push({
      date: dateStr,
      label: formatReadableDate(dateStr, 'weekday'),
      shortDate: formatReadableDate(dateStr, 'short'),
      completed: completedCount,
      total: totalActive,
      percentage
    });
  }

  // 4. Past 4 weeks data for Monthly Completion Chart
  const monthlyWeeksData = [];
  for (let w = 3; w >= 0; w--) {
    let weekCompleted = 0;
    let weekTotal = 0;
    const startDay = addDays(today, -(w * 7 + 6));
    const endDay = addDays(today, -(w * 7));

    for (let d = 0; d < 7; d++) {
      const cur = addDays(startDay, d);
      const dayRec = records[cur] || {};
      activeHabits.forEach(h => {
        if (dayRec[h.id] && dayRec[h.id].completed) weekCompleted++;
      });
      weekTotal += totalActive;
    }

    const rate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
    monthlyWeeksData.push({
      label: `Week ${4 - w}`,
      dateRange: `${formatReadableDate(startDay, 'short')} - ${formatReadableDate(endDay, 'short')}`,
      completed: weekCompleted,
      total: weekTotal,
      percentage: rate
    });
  }

  // 5. Total Completed Habits (sum of all habit completions ever)
  let totalCompletionsCount = 0;
  for (const date in records) {
    const dayRec = records[date] || {};
    for (const hId in dayRec) {
      if (dayRec[hId] && dayRec[hId].completed) {
        totalCompletionsCount++;
      }
    }
  }

  // 6. Global Streaks
  const globalStreaks = calculateGlobalStreaks(habits, records, today);

  // 7. Overall Consistency Percentage
  // Across the active span (all days since first record or 30 days)
  const allRecordedDates = Object.keys(records).sort();
  const earliestDate = allRecordedDates.length > 0 ? allRecordedDates[0] : today;
  const daysInSpan = Math.max(1, getDaysDifference(earliestDate, today) + 1);
  const potentialCompletions = daysInSpan * totalActive;
  const overallConsistencyRate = potentialCompletions > 0 
    ? Math.min(100, Math.round((totalCompletionsCount / potentialCompletions) * 100))
    : 0;

  return {
    habitStats,
    mostConsistentHabit,
    weeklyChartData,
    monthlyWeeksData,
    totalCompletionsCount,
    globalStreaks,
    overallConsistencyRate,
    activeHabitsCount: totalActive
  };
}
