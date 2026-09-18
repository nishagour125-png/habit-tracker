import { DEFAULT_HABITS } from './defaultHabits.js';
import { getTodayDate, addDays, getYesterdayDate } from './dates.js';
import { calculateHabitStreak, calculateGlobalStreaks } from './streak.js';
import { evaluateAchievements } from './achievements.js';

const STORAGE_KEYS = {
  HABITS: 'habitcode_habits_v1',
  RECORDS: 'habitcode_records_v1',
  SETTINGS: 'habitcode_settings_v1',
  ACHIEVEMENTS: 'habitcode_achievements_v1'
};

class Store {
  constructor() {
    this.listeners = new Set();
    this.habits = [];
    this.records = {};
    this.settings = {
      theme: 'dark', // 'dark' | 'light'
      soundEnabled: true,
      notificationsEnabled: false
    };
    this.achievements = {}; // { [badgeId]: { unlockedAt: string } }
    this.init();
  }

  init() {
    try {
      // 1. Load habits
      const savedHabits = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (savedHabits) {
        this.habits = JSON.parse(savedHabits);
      } else {
        this.habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
        this.saveHabits();
      }

      // 2. Load records
      const savedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (savedRecords) {
        this.records = JSON.parse(savedRecords);
      } else {
        this.records = {};
        this.saveRecords();
      }

      // 3. Load settings
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      } else {
        this.saveSettings();
      }

      // 4. Load achievements
      const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (savedAchievements) {
        this.achievements = JSON.parse(savedAchievements);
      } else {
        this.achievements = {};
      }

      // Apply initial theme to document body/html
      document.documentElement.setAttribute('data-theme', this.settings.theme);
    } catch (e) {
      console.error('Failed to load HabitCode data from localStorage:', e);
      this.habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
      this.records = {};
    }
  }

  // Pub/Sub
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload = {}) {
    for (const listener of this.listeners) {
      try {
        listener(event, payload);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    }
  }

  // Persistence helpers
  saveHabits() {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(this.habits));
  }

  saveRecords() {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(this.records));
  }

  saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    document.documentElement.setAttribute('data-theme', this.settings.theme);
  }

  saveAchievements() {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(this.achievements));
  }

  // Getters
  getHabits() {
    return [...this.habits];
  }

  getActiveHabits() {
    return this.habits.filter(h => h.enabled !== false);
  }

  getRecords() {
    return { ...this.records };
  }

  getSettings() {
    return { ...this.settings };
  }

  getAchievements() {
    return { ...this.achievements };
  }

  // Actions
  toggleHabitCompletion(habitId, dateStr = null) {
    const targetDate = dateStr || getTodayDate();

    if (!this.records[targetDate]) {
      this.records[targetDate] = {};
    }

    const currentStatus = Boolean(this.records[targetDate][habitId]?.completed);
    const newStatus = !currentStatus;

    this.records[targetDate][habitId] = {
      completed: newStatus,
      updatedAt: new Date().toISOString()
    };

    // Clean up empty records if all false
    const hasAnyCompleted = Object.values(this.records[targetDate]).some(r => r && r.completed);
    if (!hasAnyCompleted) {
      delete this.records[targetDate];
    }

    this.saveRecords();

    // Check for newly unlocked achievements
    const achievementCheck = this.checkAchievements();

    this.notify('HABIT_TOGGLED', {
      habitId,
      date: targetDate,
      completed: newStatus,
      newAchievements: achievementCheck.newlyUnlocked
    });

    return {
      completed: newStatus,
      newAchievements: achievementCheck.newlyUnlocked
    };
  }

  checkAchievements() {
    const globalStreak = calculateGlobalStreaks(this.habits, this.records);
    const context = {
      habits: this.habits,
      records: this.records,
      globalStreak
    };

    const evaluation = evaluateAchievements(context, this.achievements);

    if (evaluation.newlyUnlocked.length > 0) {
      for (const badge of evaluation.newlyUnlocked) {
        this.achievements[badge.id] = {
          unlockedAt: badge.unlockedAt
        };
      }
      this.saveAchievements();
      this.notify('ACHIEVEMENTS_UPDATED', { newlyUnlocked: evaluation.newlyUnlocked });
    }

    return evaluation;
  }

  addHabit(habitData) {
    const newHabit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: habitData.name.trim(),
      icon: habitData.icon || '🎯',
      category: habitData.category || 'Productivity',
      description: habitData.description?.trim() || '',
      color: habitData.color || '#6366F1',
      createdAt: getTodayDate(),
      enabled: true
    };

    this.habits.push(newHabit);
    this.saveHabits();
    this.notify('HABIT_ADDED', { habit: newHabit });
    return newHabit;
  }

  updateHabit(habitId, updatedData) {
    const index = this.habits.findIndex(h => h.id === habitId);
    if (index === -1) return null;

    this.habits[index] = {
      ...this.habits[index],
      ...updatedData,
      name: updatedData.name ? updatedData.name.trim() : this.habits[index].name,
      description: updatedData.description !== undefined ? updatedData.description.trim() : this.habits[index].description
    };

    this.saveHabits();
    this.notify('HABIT_UPDATED', { habit: this.habits[index] });
    return this.habits[index];
  }

  deleteHabit(habitId) {
    this.habits = this.habits.filter(h => h.id !== habitId);
    // Remove habit records
    for (const date in this.records) {
      if (this.records[date][habitId]) {
        delete this.records[date][habitId];
        if (Object.keys(this.records[date]).length === 0) {
          delete this.records[date];
        }
      }
    }

    this.saveHabits();
    this.saveRecords();
    this.notify('HABIT_DELETED', { habitId });
  }

  toggleHabitEnabled(habitId) {
    const habit = this.habits.find(h => h.id === habitId);
    if (habit) {
      habit.enabled = !habit.enabled;
      this.saveHabits();
      this.notify('HABIT_UPDATED', { habit });
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.notify('SETTINGS_UPDATED', { settings: this.settings });
  }

  resetTodayProgress() {
    const today = getTodayDate();
    if (this.records[today]) {
      delete this.records[today];
      this.saveRecords();
      this.notify('DATA_CHANGED', { reason: 'RESET_TODAY' });
    }
  }

  clearAllData() {
    this.habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
    this.records = {};
    this.achievements = {};
    this.saveHabits();
    this.saveRecords();
    this.saveAchievements();
    this.notify('DATA_CHANGED', { reason: 'CLEAR_ALL' });
  }

  exportData() {
    const exportObject = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      habits: this.habits,
      records: this.records,
      achievements: this.achievements,
      settings: this.settings
    };
    return JSON.stringify(exportObject, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.habits || !Array.isArray(data.habits)) {
        throw new Error('Invalid format: missing habits array');
      }

      this.habits = data.habits;
      this.records = data.records || {};
      this.achievements = data.achievements || {};
      if (data.settings) {
        this.settings = { ...this.settings, ...data.settings };
      }

      this.saveHabits();
      this.saveRecords();
      this.saveAchievements();
      this.saveSettings();

      this.checkAchievements();
      this.notify('DATA_CHANGED', { reason: 'IMPORT' });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Generates sample consistency data (past 35 days of activity)
   * so the user can immediately experience the rich heatmap, streak flame,
   * charts, and achievements in action!
   */
  loadSampleData() {
    const today = getTodayDate();
    const habitIds = this.habits.map(h => h.id);
    const newRecords = {};

    // 35 consecutive days with high consistency (80%-100% completion)
    for (let i = 35; i >= 0; i--) {
      const dateStr = addDays(today, -i);
      newRecords[dateStr] = {};

      habitIds.forEach((hId, idx) => {
        // High completion chance, with realistic human variance
        const shouldComplete = i === 0 
          ? idx < 6 // today 6/8 habits done
          : (Math.random() > 0.15 || idx < 5);

        if (shouldComplete) {
          newRecords[dateStr][hId] = {
            completed: true,
            updatedAt: `${dateStr}T20:00:00.000Z`
          };
        }
      });
    }

    this.records = newRecords;
    this.saveRecords();
    this.checkAchievements();
    this.notify('DATA_CHANGED', { reason: 'SAMPLE_LOADED' });
  }
}

export const store = new Store();
