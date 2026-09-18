import { store } from '../core/store.js';
import { getTodayDate, addDays, getDaysDifference, formatReadableDate } from '../core/dates.js';
import { calculateHabitStreak, calculateGlobalStreaks } from '../core/streak.js';

export class HistoryView {
  constructor() {
    this.selectedHabitId = 'all';
    this.selectedTimeframe = 'this-month'; // 'today' | 'this-week' | 'this-month' | 'last-3-months' | 'all-time'
  }

  render(container) {
    const habits = store.getHabits();
    const records = store.getRecords();
    const today = getTodayDate();

    // Calculate dates based on timeframe
    let daysBack = 30;
    if (this.selectedTimeframe === 'today') daysBack = 1;
    else if (this.selectedTimeframe === 'this-week') daysBack = 7;
    else if (this.selectedTimeframe === 'this-month') daysBack = 30;
    else if (this.selectedTimeframe === 'last-3-months') daysBack = 90;
    else if (this.selectedTimeframe === 'all-time') {
      const allDates = Object.keys(records).sort();
      const earliest = allDates.length > 0 ? allDates[0] : today;
      daysBack = Math.max(30, getDaysDifference(earliest, today) + 1);
    }

    // Selected habit stats
    let currentStreak = 0;
    let longestStreak = 0;
    let totalCompletions = 0;
    let weeklyRate = 0;
    let monthlyRate = 0;

    if (this.selectedHabitId === 'all') {
      const global = calculateGlobalStreaks(habits, records, today);
      currentStreak = global.currentStreak;
      longestStreak = global.longestStreak;
      
      // Calculate total habit logs
      for (const d in records) {
        for (const h in records[d]) {
          if (records[d][h]?.completed) totalCompletions++;
        }
      }

      // 7-day rate
      let weekDone = 0;
      let weekPossible = 7 * Math.max(1, habits.length);
      for (let i = 0; i < 7; i++) {
        const d = addDays(today, -i);
        if (records[d]) {
          weekDone += Object.values(records[d]).filter(r => r && r.completed).length;
        }
      }
      weeklyRate = Math.min(100, Math.round((weekDone / weekPossible) * 100));

      // 30-day rate
      let monthDone = 0;
      let monthPossible = 30 * Math.max(1, habits.length);
      for (let i = 0; i < 30; i++) {
        const d = addDays(today, -i);
        if (records[d]) {
          monthDone += Object.values(records[d]).filter(r => r && r.completed).length;
        }
      }
      monthlyRate = Math.min(100, Math.round((monthDone / monthPossible) * 100));
    } else {
      const habit = habits.find(h => h.id === this.selectedHabitId);
      if (habit) {
        const hStats = calculateHabitStreak(habit.id, records, habit.createdAt, today);
        currentStreak = hStats.currentStreak;
        longestStreak = hStats.longestStreak;
        totalCompletions = hStats.totalCompletedDays;

        // Weekly rate for this habit
        let wCount = 0;
        for (let i = 0; i < 7; i++) {
          const d = addDays(today, -i);
          if (records[d]?.[habit.id]?.completed) wCount++;
        }
        weeklyRate = Math.round((wCount / 7) * 100);

        // Monthly rate for this habit
        let mCount = 0;
        for (let i = 0; i < 30; i++) {
          const d = addDays(today, -i);
          if (records[d]?.[habit.id]?.completed) mCount++;
        }
        monthlyRate = Math.round((mCount / 30) * 100);
      }
    }

    // Build timeline rows for the selected timeframe
    const timelineRows = [];
    for (let i = 0; i < daysBack; i++) {
      const dateStr = addDays(today, -i);
      const dayRecord = records[dateStr] || {};
      const readable = formatReadableDate(dateStr, 'full');

      if (this.selectedHabitId === 'all') {
        const completedHabits = habits.filter(h => dayRecord[h.id]?.completed);
        const count = completedHabits.length;
        timelineRows.push({
          date: dateStr,
          readable,
          isCompleted: count > 0,
          count,
          total: habits.length,
          habits: completedHabits
        });
      } else {
        const isDone = Boolean(dayRecord[this.selectedHabitId]?.completed);
        timelineRows.push({
          date: dateStr,
          readable,
          isCompleted: isDone,
          count: isDone ? 1 : 0,
          total: 1,
          habits: []
        });
      }
    }

    // Render HTML
    container.innerHTML = `
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>📜</span>
              <span>Habit Completion History</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Review your historical track record and consistency trends.
            </p>
          </div>

          <!-- Habit Selector Dropdown -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <label class="form-label" style="margin-bottom: 0;">Habit:</label>
            <select class="form-select font-mono" id="history-habit-select" style="min-width: 180px;">
              <option value="all" ${this.selectedHabitId === 'all' ? 'selected' : ''}>🌟 All Habits</option>
              ${habits.map(h => `
                <option value="${h.id}" ${this.selectedHabitId === h.id ? 'selected' : ''}>
                  ${h.icon} ${h.name}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="history-filters-bar">
          <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; margin-right: 4px;">Timeframe:</span>
          ${[
            { id: 'today', label: 'Today' },
            { id: 'this-week', label: 'This Week' },
            { id: 'this-month', label: 'This Month' },
            { id: 'last-3-months', label: 'Last 3 Months' },
            { id: 'all-time', label: 'All Time' }
          ].map(f => `
            <button class="filter-btn ${this.selectedTimeframe === f.id ? 'active' : ''}" data-timeframe="${f.id}">
              ${f.label}
            </button>
          `).join('')}
        </div>

        <!-- History Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Current Streak</span>
              <span class="metric-icon" style="color: var(--accent-amber); background: rgba(245, 158, 11, 0.12);">🔥</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${currentStreak}</span>
              <span class="metric-sub">days</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Longest Streak</span>
              <span class="metric-icon" style="color: var(--accent-indigo); background: rgba(99, 102, 241, 0.12);">🏆</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${longestStreak}</span>
              <span class="metric-sub">days personal best</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Total Completions</span>
              <span class="metric-icon" style="color: var(--accent-emerald); background: rgba(16, 185, 129, 0.12);">✓</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${totalCompletions}</span>
              <span class="metric-sub">logged entries</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Weekly Rate</span>
              <span class="metric-icon" style="color: var(--accent-purple); background: rgba(139, 92, 246, 0.12);">📊</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${weeklyRate}%</span>
              <span class="metric-sub">last 7 days</span>
            </div>
          </div>

          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Monthly Rate</span>
              <span class="metric-icon" style="color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12);">📈</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${monthlyRate}%</span>
              <span class="metric-sub">last 30 days</span>
            </div>
          </div>
        </div>

        <!-- History Log Table / Cards -->
        <div class="card" style="padding: 20px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; color: var(--text-primary);">
            Daily Activity Log
          </h3>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${timelineRows.length === 0 ? `
              <div class="empty-state">
                <span class="empty-icon">📜</span>
                <h4 class="empty-title">No history records found</h4>
                <p class="empty-text">Start completing habits today to see your historical timeline.</p>
              </div>
            ` : timelineRows.map(row => `
              <div class="habit-stat-row">
                <div style="display: flex; align-items: center; gap: 14px; min-width: 220px;">
                  <span style="font-size: 1.1rem;">${row.isCompleted ? '🟢' : '⚪'}</span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${row.readable}</div>
                    <div class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">${row.date}</div>
                  </div>
                </div>

                <div style="flex: 1; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  ${this.selectedHabitId === 'all' ? (
                    row.habits.length > 0 ? row.habits.map(h => `
                      <span class="badge-category font-mono" style="--cat-color: ${h.color || '#6366F1'}; font-size: 0.75rem;">
                        ${h.icon} ${h.name}
                      </span>
                    `).join('') : '<span style="color: var(--text-muted); font-size: 0.85rem;">No habits completed</span>'
                  ) : (
                    row.isCompleted 
                      ? '<span class="badge-category font-mono" style="--cat-color: #10B981;">Completed</span>' 
                      : '<span style="color: var(--text-muted); font-size: 0.85rem;">Missed</span>'
                  )}
                </div>

                <div class="font-mono" style="font-weight: 700; font-size: 0.9rem; color: ${row.isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)'}; min-width: 60px; text-align: right;">
                  ${this.selectedHabitId === 'all' ? `${row.count}/${row.total}` : (row.isCompleted ? '100%' : '0%')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Dropdown change listener
    const select = container.querySelector('#history-habit-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.selectedHabitId = e.target.value;
        this.render(container);
      });
    }

    // Timeframe click listeners
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedTimeframe = btn.dataset.timeframe;
        this.render(container);
      });
    });
  }
}
