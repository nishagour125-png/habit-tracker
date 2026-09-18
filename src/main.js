import './styles/variables.css';
import './styles/reset.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/heatmap.css';
import './styles/animations.css';

import { store } from './core/store.js';
import { NavigationComponent } from './components/Navigation.js';
import { DashboardView } from './components/DashboardView.js';
import { HeatmapView } from './components/HeatmapView.js';
import { HistoryView } from './components/HistoryView.js';
import { StatisticsView } from './components/StatisticsView.js';
import { AchievementsView } from './components/AchievementsView.js';
import { MyHabitsView } from './components/MyHabitsView.js';
import { SettingsView } from './components/SettingsView.js';
import { habitModal } from './components/HabitModal.js';
import { sound } from './utils/audio.js';
import { triggerConfetti } from './utils/confetti.js';

class App {
  constructor() {
    this.currentViewId = 'dashboard';
    this.views = {
      dashboard: new DashboardView({
        onOpenHabitModal: () => habitModal.open()
      }),
      'my-habits': new MyHabitsView(),
      calendar: new HeatmapView(),
      history: new HistoryView(),
      statistics: new StatisticsView(),
      achievements: new AchievementsView(),
      settings: new SettingsView()
    };

    this.navComponent = new NavigationComponent({
      onNavigate: (viewId) => this.switchView(viewId)
    });

    this.init();
  }

  init() {
    // Render static shells
    const sidebarEl = document.getElementById('sidebar-container');
    const mobileNavEl = document.getElementById('mobile-nav-container');
    const topbarEl = document.getElementById('topbar-container');

    if (sidebarEl) this.navComponent.renderSidebar(sidebarEl);
    if (mobileNavEl) this.navComponent.renderMobileBottomBar(mobileNavEl);
    if (topbarEl) this.navComponent.renderTopBar(topbarEl);

    // Read initial route from URL hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash && this.views[hash]) {
      this.currentViewId = hash;
    }

    this.renderCurrentView();

    // Listen to hash change
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && this.views[h] && h !== this.currentViewId) {
        this.switchView(h, false);
      }
    });

    // Store reactive updates
    store.subscribe((event, payload) => {
      // Re-render current active view to reflect data changes
      this.renderCurrentView();
      if (topbarEl) this.navComponent.renderTopBar(topbarEl);
      if (sidebarEl) this.navComponent.updateHeaderStats();

      // Show Achievement celebration if any were newly unlocked
      if (payload?.newAchievements && payload.newAchievements.length > 0) {
        payload.newAchievements.forEach(badge => this.showAchievementToast(badge));
      }
      if (event === 'ACHIEVEMENTS_UPDATED' && payload?.newlyUnlocked) {
        payload.newlyUnlocked.forEach(badge => this.showAchievementToast(badge));
      }
    });
  }

  switchView(viewId, updateHash = true) {
    if (!this.views[viewId]) return;
    this.currentViewId = viewId;

    if (updateHash) {
      window.location.hash = viewId;
    }

    this.renderCurrentView();
  }

  renderCurrentView() {
    const container = document.getElementById('content-viewport');
    if (!container) return;

    const activeView = this.views[this.currentViewId];
    if (activeView && typeof activeView.render === 'function') {
      activeView.render(container);
    }
  }

  showAchievementToast(badge) {
    const settings = store.getSettings();
    if (settings.soundEnabled) sound.playAchievement();
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 3, 50);

    let toastContainer = document.getElementById('global-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'global-toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-item toast-achievement';
    toast.innerHTML = `
      <div style="font-size: 1.8rem;">${badge.icon}</div>
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent-amber); text-transform: uppercase;">
          Achievement Unlocked! 🏆
        </div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">
          ${badge.title}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">
          ${badge.description}
        </div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
