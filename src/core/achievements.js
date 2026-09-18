import { getTodayDate, getYesterdayDate, addDays, getDaysDifference } from './dates.js';

export const BADGES = [
  {
    id: 'streak_3',
    title: '3-Day Momentum',
    icon: '🔥',
    category: 'Streak',
    description: 'Maintain a 3-day active habit streak.',
    target: 3,
    check: (ctx) => {
      const current = ctx.globalStreak.longestStreak;
      return {
        unlocked: current >= 3,
        progress: Math.min(3, current),
        max: 3
      };
    }
  },
  {
    id: 'streak_7',
    title: '7-Day Warrior',
    icon: '⚡',
    category: 'Streak',
    description: 'Crush your habits for a full week straight.',
    target: 7,
    check: (ctx) => {
      const current = ctx.globalStreak.longestStreak;
      return {
        unlocked: current >= 7,
        progress: Math.min(7, current),
        max: 7
      };
    }
  },
  {
    id: 'streak_14',
    title: 'Fortnight Focus',
    icon: '🛡️',
    category: 'Streak',
    description: 'Keep the fire burning for 14 continuous days.',
    target: 14,
    check: (ctx) => {
      const current = ctx.globalStreak.longestStreak;
      return {
        unlocked: current >= 14,
        progress: Math.min(14, current),
        max: 14
      };
    }
  },
  {
    id: 'streak_30',
    title: '30-Day Master',
    icon: '👑',
    category: 'Streak',
    description: 'Achieve the legendary 30-day consistency streak.',
    target: 30,
    check: (ctx) => {
      const current = ctx.globalStreak.longestStreak;
      return {
        unlocked: current >= 30,
        progress: Math.min(30, current),
        max: 30
      };
    }
  },
  {
    id: 'days_50',
    title: 'Century Halfway',
    icon: '🏆',
    category: 'Milestone',
    description: 'Complete habits across 50 active days.',
    target: 50,
    check: (ctx) => {
      const current = ctx.globalStreak.totalCompletedDays;
      return {
        unlocked: current >= 50,
        progress: Math.min(50, current),
        max: 50
      };
    }
  },
  {
    id: 'days_100',
    title: 'Centurion Club',
    icon: '🎖️',
    category: 'Milestone',
    description: 'Complete habits across 100 distinct days.',
    target: 100,
    check: (ctx) => {
      const current = ctx.globalStreak.totalCompletedDays;
      return {
        unlocked: current >= 100,
        progress: Math.min(100, current),
        max: 100
      };
    }
  },
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    icon: '⭐',
    category: 'Perfection',
    description: 'Complete 100% of all active habits for 7 consecutive days.',
    target: 7,
    check: (ctx) => {
      let maxPerfectStreak = 0;
      let currentPerfectStreak = 0;
      const dates = Object.keys(ctx.records).sort();
      const activeHabits = ctx.habits.filter(h => h.enabled !== false);
      if (activeHabits.length === 0) return { unlocked: false, progress: 0, max: 7 };

      let prevDate = null;
      for (const date of dates) {
        const dayRecord = ctx.records[date] || {};
        const allCompleted = activeHabits.every(h => dayRecord[h.id] && dayRecord[h.id].completed);

        if (allCompleted) {
          if (!prevDate) {
            currentPerfectStreak = 1;
          } else {
            const diff = getDaysDifference(prevDate, date);
            if (diff === 1) {
              currentPerfectStreak++;
            } else {
              currentPerfectStreak = 1;
            }
          }
          if (currentPerfectStreak > maxPerfectStreak) {
            maxPerfectStreak = currentPerfectStreak;
          }
          prevDate = date;
        } else {
          currentPerfectStreak = 0;
          prevDate = null;
        }
      }
      return {
        unlocked: maxPerfectStreak >= 7,
        progress: Math.min(7, maxPerfectStreak),
        max: 7
      };
    }
  },
  {
    id: 'perfect_month',
    title: 'Perfect Month',
    icon: '💎',
    category: 'Perfection',
    description: 'Log active habit completions for 30 consecutive days.',
    target: 30,
    check: (ctx) => {
      const current = ctx.globalStreak.longestStreak;
      return {
        unlocked: current >= 30,
        progress: Math.min(30, current),
        max: 30
      };
    }
  },
  {
    id: 'ten_in_one_day',
    title: 'Super Surge',
    icon: '🚀',
    category: 'Productivity',
    description: 'Complete 8 or more habits in a single day.',
    target: 8,
    check: (ctx) => {
      let maxSingleDay = 0;
      for (const date in ctx.records) {
        const dayRecord = ctx.records[date];
        const count = Object.values(dayRecord).filter(r => r && r.completed).length;
        if (count > maxSingleDay) maxSingleDay = count;
      }
      return {
        unlocked: maxSingleDay >= 8,
        progress: Math.min(8, maxSingleDay),
        max: 8
      };
    }
  },
  {
    id: 'first_habit_completed',
    title: 'First Step',
    icon: '🌱',
    category: 'Milestone',
    description: 'Complete your very first habit on HabitCode.',
    target: 1,
    check: (ctx) => {
      let total = 0;
      for (const date in ctx.records) {
        total += Object.values(ctx.records[date]).filter(r => r && r.completed).length;
      }
      return {
        unlocked: total >= 1,
        progress: Math.min(1, total),
        max: 1
      };
    }
  },
  {
    id: 'code_discipline',
    title: 'Algorithm Grinder',
    icon: '💻',
    category: 'Discipline',
    description: 'Complete the LeetCode or Coding habit 10 times.',
    target: 10,
    check: (ctx) => {
      let count = 0;
      for (const date in ctx.records) {
        const r = ctx.records[date];
        if ((r.habit_coding && r.habit_coding.completed) || (r.habit_leetcode && r.habit_leetcode.completed)) {
          count++;
        }
      }
      return {
        unlocked: count >= 10,
        progress: Math.min(10, count),
        max: 10
      };
    }
  },
  {
    id: 'zen_mind',
    title: 'Inner Peace',
    icon: '🧘',
    category: 'Mindfulness',
    description: 'Complete the Meditation / Nam Jap habit 7 times.',
    target: 7,
    check: (ctx) => {
      let count = 0;
      for (const date in ctx.records) {
        const r = ctx.records[date];
        if (r.habit_meditation && r.habit_meditation.completed) {
          count++;
        }
      }
      return {
        unlocked: count >= 7,
        progress: Math.min(7, count),
        max: 7
      };
    }
  }
];

export function evaluateAchievements(context, storedUnlocked = {}) {
  const result = [];
  const newlyUnlocked = [];

  for (const badge of BADGES) {
    const status = badge.check(context);
    const wasAlreadyUnlocked = Boolean(storedUnlocked[badge.id]);

    let unlockedAt = storedUnlocked[badge.id]?.unlockedAt || null;

    if (status.unlocked && !wasAlreadyUnlocked) {
      unlockedAt = new Date().toISOString();
      newlyUnlocked.push({
        ...badge,
        unlockedAt
      });
    }

    result.push({
      ...badge,
      unlocked: status.unlocked || wasAlreadyUnlocked,
      progress: status.progress,
      max: status.max,
      unlockedAt: unlockedAt || (wasAlreadyUnlocked ? storedUnlocked[badge.id].unlockedAt : null)
    });
  }

  return {
    badges: result,
    newlyUnlocked
  };
}
