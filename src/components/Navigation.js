import { store } from '../core/store.js';
import { getTodayDate, formatReadableDate } from '../core/dates.js';
import { calculateGlobalStreaks } from '../core/streak.js';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'my-habits', label: 'My Habits', icon: '✅' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'history', label: 'History', icon: '📜' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

export class NavigationComponent {
  constructor({ onNavigate }) {
    this.onNavigate = onNavigate;
    this.currentView = 'dashboard';
    this.initListeners();
  }

  initListeners() {
    store.subscribe(() => {
      this.updateHeaderStats();
    });
  }

  renderSidebar(container) {
    const habits = store.getHabits();
    const records = store.getRecords();
    const globalStreak = calculateGlobalStreaks(habits, records);

    const navLinksHtml = NAV_ITEMS.map(item => `
      <button class="nav-item ${this.currentView === item.id ? 'active' : ''}" data-view="${item.id}" id="nav-btn-${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="sidebar-header">
        <div class="brand-logo">
          <div class="brand-icon">⚡</div>
          <span>HabitCode</span>
          <span class="brand-badge">PRO</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${navLinksHtml}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-streak-card">
          <span class="sidebar-streak-icon">🔥</span>
          <div class="sidebar-streak-info">
            <span class="sidebar-streak-label">Global Streak</span>
            <span class="sidebar-streak-value font-mono" id="sidebar-streak-count">${globalStreak.currentStreak} Days</span>
          </div>
        </div>
      </div>
    `;

    // Add navigation click listeners
    container.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.navigateTo(view);
      });
    });
  }

  renderMobileBottomBar(container) {
    const items = NAV_ITEMS.filter(i => ['dashboard', 'my-habits', 'calendar', 'statistics', 'achievements'].includes(i.id));

    const html = items.map(item => `
      <button class="mobile-nav-item ${this.currentView === item.id ? 'active' : ''}" data-view="${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </button>
    `).join('');

    container.innerHTML = html;

    container.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.navigateTo(view);
      });
    });
  }

  renderTopBar(container) {
    const habits = store.getHabits();
    const records = store.getRecords();
    const globalStreak = calculateGlobalStreaks(habits, records);
    const today = getTodayDate();
    const formattedDate = formatReadableDate(today, 'full');
    const settings = store.getSettings();

    container.innerHTML = `
      <div class="topbar-left">
        <div class="topbar-date">
          <span>📅</span>
          <span class="font-mono font-medium">${formattedDate}</span>
        </div>
      </div>

      <div class="topbar-right">
        <div class="topbar-stat-pill" title="Today's habit completion ratio">
          <span>🎯</span>
          <span class="font-mono" id="topbar-completion-ratio">${globalStreak.todayCompletedCount}/${globalStreak.activeHabitsCount}</span>
        </div>

        <div class="topbar-stat-pill" title="Current global active streak">
          <span class="streak-icon">🔥</span>
          <span class="font-mono" id="topbar-streak-count">${globalStreak.currentStreak}d</span>
        </div>

        <button class="theme-toggle-btn" id="theme-toggle-btn" title="Toggle theme">
          ${settings.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    `;

    const themeBtn = container.querySelector('#theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = store.getSettings().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        store.updateSettings({ theme: next });
        themeBtn.innerHTML = next === 'dark' ? '☀️' : '🌙';
      });
    }
  }

  updateHeaderStats() {
    const habits = store.getHabits();
    const records = store.getRecords();
    const globalStreak = calculateGlobalStreaks(habits, records);

    const topbarRatio = document.getElementById('topbar-completion-ratio');
    if (topbarRatio) {
      topbarRatio.textContent = `${globalStreak.todayCompletedCount}/${globalStreak.activeHabitsCount}`;
    }

    const topbarStreak = document.getElementById('topbar-streak-count');
    if (topbarStreak) {
      topbarStreak.textContent = `${globalStreak.currentStreak}d`;
    }

    const sidebarStreak = document.getElementById('sidebar-streak-count');
    if (sidebarStreak) {
      sidebarStreak.textContent = `${globalStreak.currentStreak} Days`;
    }
  }

  navigateTo(viewId) {
    this.currentView = viewId;

    // Update active classes
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewId);
    });
    document.querySelectorAll('.mobile-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewId);
    });

    if (this.onNavigate) {
      this.onNavigate(viewId);
    }
  }
}
