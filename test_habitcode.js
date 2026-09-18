/**
 * Comprehensive Automated Test Suite for HabitCode
 */

import { DEFAULT_HABITS, CATEGORIES } from './src/core/defaultHabits.js';
import { formatDate, parseDate, getTodayDate, getYesterdayDate, addDays, getDaysDifference, getContributionCalendarDays } from './src/core/dates.js';
import { calculateHabitStreak, calculateGlobalStreaks } from './src/core/streak.js';
import { evaluateAchievements, BADGES } from './src/core/achievements.js';
import { getMotivationalMessage, calculateProductivityScores, computeAnalytics } from './src/core/analytics.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('=== 1. Testing Default Habits & Categories ===');
assert(DEFAULT_HABITS.length === 8, 'Has exactly 8 default habits');
const expectedHabits = [
  'Early Bed', 'Study', 'Coding', 'LeetCode', 
  'Meditation / Nam Jap', 'Healthy Food', 'Self Care', 'Less Screen Time'
];
expectedHabits.forEach(name => {
  const found = DEFAULT_HABITS.some(h => h.name === name);
  assert(found, `Contains default habit: ${name}`);
});
assert(CATEGORIES.length >= 6, 'Has all 6 required categories');

console.log('\n=== 2. Testing Date Utilities ===');
const today = getTodayDate();
assert(/^\d{4}-\d{2}-\d{2}$/.test(today), `Today is formatted YYYY-MM-DD: ${today}`);
const yesterday = getYesterdayDate(today);
assert(getDaysDifference(yesterday, today) === 1, 'Yesterday is exactly 1 day difference');
assert(addDays(today, 5) > today, 'addDays(today, 5) returns future date');
const calDays = getContributionCalendarDays(today);
assert(calDays.length >= 364, `Contribution calendar generates 52+ weeks (${calDays.length} days)`);

console.log('\n=== 3. Testing Streak Calculation Engine ===');
const habitId = 'habit_coding';
// Scenario A: 3 consecutive days completed ending today
const recordsA = {
  [addDays(today, -2)]: { [habitId]: { completed: true } },
  [addDays(today, -1)]: { [habitId]: { completed: true } },
  [today]: { [habitId]: { completed: true } }
};
const streakA = calculateHabitStreak(habitId, recordsA, addDays(today, -10), today);
assert(streakA.currentStreak === 3, `Current streak is 3 (got ${streakA.currentStreak})`);
assert(streakA.longestStreak === 3, `Longest streak is 3 (got ${streakA.longestStreak})`);
assert(streakA.isCompletedToday === true, 'isCompletedToday is true');

// Scenario B: Completed yesterday, not yet today -> streak remains alive
const recordsB = {
  [addDays(today, -2)]: { [habitId]: { completed: true } },
  [addDays(today, -1)]: { [habitId]: { completed: true } }
};
const streakB = calculateHabitStreak(habitId, recordsB, addDays(today, -10), today);
assert(streakB.currentStreak === 2, `Current streak alive pending today (got ${streakB.currentStreak})`);
assert(streakB.isCompletedToday === false, 'isCompletedToday is false');

// Scenario C: Missed yesterday and today -> streak is broken (0)
const recordsC = {
  [addDays(today, -4)]: { [habitId]: { completed: true } },
  [addDays(today, -3)]: { [habitId]: { completed: true } },
  [addDays(today, -2)]: { [habitId]: { completed: true } }
  // missed -1 and today
};
const streakC = calculateHabitStreak(habitId, recordsC, addDays(today, -10), today);
assert(streakC.currentStreak === 0, `Current streak is 0 after missing day (got ${streakC.currentStreak})`);
assert(streakC.longestStreak === 3, `Longest streak preserved as 3 (got ${streakC.longestStreak})`);

// Global Streaks
const globalStreak = calculateGlobalStreaks(DEFAULT_HABITS, recordsA, today);
assert(globalStreak.currentStreak === 3, `Global current streak is 3 (got ${globalStreak.currentStreak})`);
assert(globalStreak.todayCompletedCount === 1, `Today completed count is 1 (got ${globalStreak.todayCompletedCount})`);

console.log('\n=== 4. Testing Productivity Scores & Analytics ===');
const prodScores = calculateProductivityScores(DEFAULT_HABITS, recordsA, today);
assert(typeof prodScores.daily === 'number', `Daily score is a number: ${prodScores.daily}%`);
assert(typeof prodScores.weeklyAvg === 'number', `Weekly avg is a number: ${prodScores.weeklyAvg}%`);
assert(typeof prodScores.monthlyAvg === 'number', `Monthly avg is a number: ${prodScores.monthlyAvg}%`);

const motivation = getMotivationalMessage({
  todayCompleted: 6,
  totalActive: 8,
  currentStreak: 5,
  longestStreak: 10
});
assert(motivation.message.length > 0, `Motivational quote generated: "${motivation.message}"`);

const analytics = computeAnalytics(DEFAULT_HABITS, recordsA, today);
assert(analytics.weeklyChartData.length === 7, 'Weekly chart has 7 days of data');
assert(analytics.monthlyWeeksData.length === 4, 'Monthly trend has 4 weeks of data');
assert(analytics.habitStats.length === 8, 'Analytics includes all 8 habit stats');

console.log('\n=== 5. Testing Gamification & Badges ===');
assert(BADGES.length >= 10, `Has ${BADGES.length} total achievement badges`);
// Test 3-day streak unlock
const evalResult = evaluateAchievements({
  habits: DEFAULT_HABITS,
  records: recordsA,
  globalStreak: { longestStreak: 3, totalCompletedDays: 3 }
});
const streak3Badge = evalResult.badges.find(b => b.id === 'streak_3');
assert(streak3Badge && streak3Badge.unlocked === true, '3-Day streak badge unlocked!');

console.log(`\n================================`);
console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
