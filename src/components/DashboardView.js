import { store } from '../core/store.js';
import { getTodayDate } from '../core/dates.js';
import { calculateGlobalStreaks } from '../core/streak.js';
import { getMotivationalMessage, calculateProductivityScores, computeAnalytics } from '../core/analytics.js';
import { createHabitCard } from './HabitCard.js';

export class DashboardView {
  constructor({ onAddHabit, onOpenHabitModal }) {
    this.onAddHabit = onAddHabit;
    this.onOpenHabitModal = onOpenHabitModal;
    this.selectedCategory = 'All';
  }

  render(container) {
    const habits = store.getHabits();
    const activeHabits = habits.filter(h => h.enabled !== false);
    const records = store.getRecords();
    const today = getTodayDate();

    const globalStreaks = calculateGlobalStreaks(habits, records, today);
    const productivity = calculateProductivityScores(habits, records, today);
    const analytics = computeAnalytics(habits, records, today);
    const motivation = getMotivationalMessage({
      todayCompleted: globalStreaks.todayCompletedCount,
      totalActive: globalStreaks.activeHabitsCount,
      currentStreak: globalStreaks.currentStreak,
      longestStreak: globalStreaks.longestStreak
    });

    // Circular progress SVG for productivity
    const circumference = 2 * Math.PI * 26; // r=26
    const strokeDashoffset = circumference - (productivity.daily / 100) * circumference;

    container.innerHTML = `
      <!-- Motivational Hero Banner -->
      <div class="hero-motivation-banner anim-fade-in">
        <div class="motivation-content">
          <div class="motivation-tag">
            <span>✨</span>
            <span>${motivation.level}</span>
          </div>
          <h2 class="motivation-title">${motivation.message}</h2>
          <p class="motivation-subtext">${motivation.subtext}</p>
        </div>

        <div class="motivation-score-widget" title="Daily Productivity Score (% of today's habits completed)">
          <div class="score-circular">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-medium)" stroke-width="5" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--accent-emerald)" stroke-width="5"
                      stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
                      stroke-linecap="round" transform="rotate(-90 32 32)"
                      style="transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);" />
            </svg>
            <span class="score-text font-mono">${productivity.daily}%</span>
          </div>
          <div class="score-info">
            <span class="score-title">Productivity Score</span>
            <span class="score-sub font-mono">Week: ${productivity.weeklyAvg}% · Month: ${productivity.monthlyAvg}%</span>
          </div>
        </div>
      </div>

      <!-- Core Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Current Streak</span>
            <span class="metric-icon" style="color: var(--accent-amber); background: rgba(245, 158, 11, 0.12);">🔥</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono" id="metric-current-streak">${globalStreaks.currentStreak}</span>
            <span class="metric-sub">consecutive days</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Longest Streak</span>
            <span class="metric-icon" style="color: var(--accent-indigo); background: rgba(99, 102, 241, 0.12);">🏆</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono" id="metric-longest-streak">${globalStreaks.longestStreak}</span>
            <span class="metric-sub">days personal best</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Today's Completion</span>
            <span class="metric-icon" style="color: var(--accent-emerald); background: rgba(16, 185, 129, 0.12);">🎯</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono">${globalStreaks.todayCompletedCount}/${globalStreaks.activeHabitsCount}</span>
            <span class="metric-sub">${globalStreaks.todayCompletionRate}% completed</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Overall Completion</span>
            <span class="metric-icon" style="color: var(--accent-purple); background: rgba(139, 92, 246, 0.12);">📈</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono">${analytics.overallConsistencyRate}%</span>
            <span class="metric-sub">lifetime consistency</span>
          </div>
        </div>

        <div class="metric-card card-hover">
          <div class="metric-header">
            <span class="metric-label">Total Habit Logs</span>
            <span class="metric-icon" style="color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12);">⚡</span>
          </div>
          <div class="metric-value-wrapper">
            <span class="metric-value font-mono">${analytics.totalCompletionsCount}</span>
            <span class="metric-sub">habits crushed</span>
          </div>
        </div>
      </div>

      <!-- Today's Habits Section -->
      <div class="section-header">
        <h3 class="section-title">
          <span>⚡</span>
          <span>Today's Habits</span>
          <span class="brand-badge font-mono">${activeHabits.length} Active</span>
        </h3>

        <div class="section-actions">
          <button class="btn btn-primary" id="btn-quick-add-habit">
            <span>+</span>
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-chips" style="margin-bottom: 20px;">
        ${['All', 'Coding', 'Study', 'Health', 'Productivity', 'Mindfulness', 'Lifestyle'].map(cat => `
          <button class="category-chip ${this.selectedCategory === cat ? 'selected' : ''}" data-cat="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Habit Cards Container -->
      <div class="habits-grid" id="dashboard-habits-grid">
        <!-- Rendered dynamically -->
      </div>
    `;

    // Category filter click listener
    container.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.cat;
        container.querySelectorAll('.category-chip').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.renderHabitsList(container, activeHabits, records, today);
      });
    });

    // Add Habit Button
    const addBtn = container.querySelector('#btn-quick-add-habit');
    if (addBtn && this.onOpenHabitModal) {
      addBtn.addEventListener('click', () => this.onOpenHabitModal());
    }

    this.renderHabitsList(container, activeHabits, records, today);
  }

  renderHabitsList(container, activeHabits, records, today) {
    const grid = container.querySelector('#dashboard-habits-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = this.selectedCategory === 'All'
      ? activeHabits
      : activeHabits.filter(h => h.category.toLowerCase() === this.selectedCategory.toLowerCase());

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <span class="empty-icon">🎯</span>
          <h4 class="empty-title">No habits found in "${this.selectedCategory}"</h4>
          <p class="empty-text">Create your first habit to begin tracking your consistency.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(habit => {
      const card = createHabitCard(habit, records, today);
      grid.appendChild(card);
    });
  }
}
