import { store } from '../core/store.js';
import { getTodayDate } from '../core/dates.js';
import { computeAnalytics } from '../core/analytics.js';
import { renderWeeklyBarChart, renderMonthlyTrendChart, renderHabitBreakdownList } from '../utils/charts.js';

export class StatisticsView {
  render(container) {
    const habits = store.getHabits();
    const records = store.getRecords();
    const today = getTodayDate();
    const analytics = computeAnalytics(habits, records, today);

    const mostConsistent = analytics.mostConsistentHabit;

    container.innerHTML = `
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>📊</span>
              <span>Performance Analytics</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Data-driven insights on your daily discipline and habit consistency.
            </p>
          </div>
        </div>

        <!-- Highlight & Key Insights Cards -->
        <div class="metrics-grid">
          <!-- Most Consistent Habit Card -->
          <div class="metric-card card-hover" style="border-color: rgba(16, 185, 129, 0.35); background: linear-gradient(135deg, var(--surface-primary) 0%, rgba(16, 185, 129, 0.06) 100%);">
            <div class="metric-header">
              <span class="metric-label">Most Consistent Habit</span>
              <span class="metric-icon" style="color: var(--accent-emerald); background: rgba(16, 185, 129, 0.15);">💎</span>
            </div>
            <div style="margin-top: 4px;">
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                <span>${mostConsistent ? mostConsistent.icon : '🎯'}</span>
                <span>${mostConsistent ? mostConsistent.name : 'No data yet'}</span>
              </div>
              <span class="metric-sub font-mono">
                ${mostConsistent ? `${mostConsistent.totalCompletedDays} days · ${mostConsistent.completionRate}% rate` : 'Start tracking'}
              </span>
            </div>
          </div>

          <!-- Total Active Days -->
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Total Active Days</span>
              <span class="metric-icon" style="color: var(--accent-indigo); background: rgba(99, 102, 241, 0.12);">📅</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${analytics.globalStreaks.totalCompletedDays}</span>
              <span class="metric-sub">distinct days logged</span>
            </div>
          </div>

          <!-- Current vs Best Streak -->
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Current vs Best Streak</span>
              <span class="metric-icon" style="color: var(--accent-amber); background: rgba(245, 158, 11, 0.12);">🔥</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${analytics.globalStreaks.currentStreak}d</span>
              <span class="metric-sub font-mono">/ ★ ${analytics.globalStreaks.longestStreak}d best</span>
            </div>
          </div>

          <!-- Overall Consistency -->
          <div class="metric-card card-hover">
            <div class="metric-header">
              <span class="metric-label">Overall Consistency</span>
              <span class="metric-icon" style="color: var(--accent-purple); background: rgba(139, 92, 246, 0.12);">🎯</span>
            </div>
            <div class="metric-value-wrapper">
              <span class="metric-value font-mono">${analytics.overallConsistencyRate}%</span>
              <span class="metric-sub">completion ratio</span>
            </div>
          </div>
        </div>

        <!-- Charts Grid (2 columns on desktop) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px; margin-bottom: 32px;">
          <!-- Weekly Completion Chart -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Weekly Completion Rate</h3>
                <span style="font-size: 0.82rem; color: var(--text-secondary);">Daily percentage over the past 7 days</span>
              </div>
              <span class="badge-category font-mono" style="--cat-color: var(--accent-emerald);">Last 7 Days</span>
            </div>
            <div id="chart-weekly-container" style="width: 100%;"></div>
          </div>

          <!-- Monthly Trendline Chart -->
          <div class="card" style="padding: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">4-Week Consistency Trend</h3>
                <span style="font-size: 0.82rem; color: var(--text-secondary);">Weekly aggregate performance trajectory</span>
              </div>
              <span class="badge-category font-mono" style="--cat-color: var(--accent-indigo);">Past 4 Weeks</span>
            </div>
            <div id="chart-monthly-container" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Habit-wise Completion Breakdown -->
        <div class="card" style="padding: 24px; margin-bottom: 32px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">Habit-Wise Completion Breakdown</h3>
              <span style="font-size: 0.85rem; color: var(--text-secondary);">Compare completion percentage and streaks across all habits</span>
            </div>
            <span class="font-mono" style="font-size: 0.85rem; color: var(--text-muted);">${habits.length} Habits</span>
          </div>

          <div id="chart-habits-breakdown"></div>
        </div>
      </div>
    `;

    // Render Charts into their containers
    const weeklyContainer = container.querySelector('#chart-weekly-container');
    if (weeklyContainer) {
      renderWeeklyBarChart(weeklyContainer, analytics.weeklyChartData);
    }

    const monthlyContainer = container.querySelector('#chart-monthly-container');
    if (monthlyContainer) {
      renderMonthlyTrendChart(monthlyContainer, analytics.monthlyWeeksData);
    }

    const breakdownContainer = container.querySelector('#chart-habits-breakdown');
    if (breakdownContainer) {
      renderHabitBreakdownList(breakdownContainer, analytics.habitStats);
    }
  }
}
