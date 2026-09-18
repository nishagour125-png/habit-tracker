import { store } from '../core/store.js';

export class SettingsView {
  render(container) {
    const settings = store.getSettings();

    container.innerHTML = `
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>⚙️</span>
              <span>Preferences & Data Management</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Manage your appearance, notifications, backup, and storage.
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px; max-width: 800px;">
          <!-- Appearance & Audio Card -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 18px; color: var(--text-primary);">
              Appearance & Feedback
            </h3>

            <!-- Theme Switcher -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Application Theme</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Toggle between Carbon Dark and Slate Light mode</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-secondary'} btn-theme-choice font-mono" data-theme="dark">
                  🌙 Dark Mode
                </button>
                <button class="btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-secondary'} btn-theme-choice font-mono" data-theme="light">
                  ☀️ Light Mode
                </button>
              </div>
            </div>

            <!-- Sound Effects Switch -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Productivity Audio Effects</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Synthesized crystal chimes on habit completion and achievements</div>
              </div>
              <button class="btn ${settings.soundEnabled ? 'btn-primary' : 'btn-secondary'} font-mono" id="btn-toggle-sound">
                ${settings.soundEnabled ? '🔔 Enabled' : '🔕 Muted'}
              </button>
            </div>

            <!-- Notifications Preference -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Daily Consistency Reminders</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Receive in-browser reminders to protect your active streaks</div>
              </div>
              <button class="btn ${settings.notificationsEnabled ? 'btn-primary' : 'btn-secondary'} font-mono" id="btn-toggle-notifs">
                ${settings.notificationsEnabled ? '✓ Enabled' : '✕ Disabled'}
              </button>
            </div>
          </div>

          <!-- Quick Sample Demo Data Card -->
          <div class="card" style="padding: 24px; border-color: rgba(99, 102, 241, 0.3); background: linear-gradient(135deg, var(--surface-primary) 0%, rgba(99, 102, 241, 0.04) 100%);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
              <div>
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                  <span>🚀</span>
                  <span>Explore Demo Consistency Data</span>
                </div>
                <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">
                  Instantly populate 35 days of active habit data to preview the full contribution calendar heatmap, weekly/monthly analytics, and unlock gamified badges.
                </div>
              </div>

              <button class="btn btn-primary font-mono" id="btn-load-sample-data" style="flex-shrink: 0;">
                Load 35-Day Demo Data
              </button>
            </div>
          </div>

          <!-- Backup & Migration Card -->
          <div class="card" style="padding: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 18px; color: var(--text-primary);">
              Backup & Restore
            </h3>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Export Data (JSON)</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Download a complete backup of your habits, records, streaks, and settings</div>
              </div>
              <button class="btn btn-secondary font-mono" id="btn-export-data">
                📥 Export Backup
              </button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Import Data (JSON)</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Restore your habit history from a previously saved JSON file</div>
              </div>
              <div>
                <input type="file" id="input-import-file" accept=".json" style="display: none;" />
                <button class="btn btn-secondary font-mono" id="btn-trigger-import">
                  📤 Import Backup
                </button>
              </div>
            </div>
          </div>

          <!-- Danger Zone Card -->
          <div class="card" style="padding: 24px; border-color: rgba(244, 63, 94, 0.35);">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 18px; color: var(--accent-rose);">
              Danger Zone
            </h3>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Reset Today's Progress</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Clear all completions logged for today without losing your historical streaks</div>
              </div>
              <button class="btn btn-danger font-mono" id="btn-reset-today">
                Reset Today
              </button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 16px;">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">Clear All Application Data</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Reset all habits, streaks, history, and achievements back to initial defaults</div>
              </div>
              <button class="btn btn-danger font-mono" id="btn-clear-all">
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Confirmation Modal Root -->
      <div id="settings-confirm-root"></div>
    `;

    // Theme buttons
    container.querySelectorAll('.btn-theme-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        store.updateSettings({ theme });
        this.render(container);
      });
    });

    // Sound toggle
    const soundBtn = container.querySelector('#btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const cur = store.getSettings().soundEnabled;
        store.updateSettings({ soundEnabled: !cur });
        this.render(container);
      });
    }

    // Notifications toggle
    const notifBtn = container.querySelector('#btn-toggle-notifs');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        const cur = store.getSettings().notificationsEnabled;
        if (!cur && 'Notification' in window) {
          Notification.requestPermission().then(permission => {
            store.updateSettings({ notificationsEnabled: permission === 'granted' });
            this.render(container);
          });
        } else {
          store.updateSettings({ notificationsEnabled: !cur });
          this.render(container);
        }
      });
    }

    // Load Demo Data
    const sampleBtn = container.querySelector('#btn-load-sample-data');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        store.loadSampleData();
        alert('🎉 35 days of consistency data loaded! Check out your Calendar Heatmap and Statistics!');
      });
    }

    // Export JSON
    const exportBtn = container.querySelector('#btn-export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const jsonStr = store.exportData();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habitcode-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Import JSON
    const importTrigger = container.querySelector('#btn-trigger-import');
    const importInput = container.querySelector('#input-import-file');
    if (importTrigger && importInput) {
      importTrigger.addEventListener('click', () => importInput.click());
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = store.importData(event.target.result);
          if (result.success) {
            alert('✓ HabitCode data imported successfully!');
            this.render(container);
          } else {
            alert('✕ Error importing file: ' + result.error);
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset Today
    const resetTodayBtn = container.querySelector('#btn-reset-today');
    if (resetTodayBtn) {
      resetTodayBtn.addEventListener('click', () => {
        this.openConfirmModal({
          title: "Reset Today's Progress",
          message: "Are you sure you want to uncheck all habits completed today?",
          confirmText: "Yes, Reset Today",
          onConfirm: () => store.resetTodayProgress()
        });
      });
    }

    // Clear All
    const clearAllBtn = container.querySelector('#btn-clear-all');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        this.openConfirmModal({
          title: "Clear All Application Data",
          message: "Warning: This will permanently delete all your habit logs, streaks, and achievements. Return to factory state?",
          confirmText: "Yes, Clear Everything",
          onConfirm: () => store.clearAllData()
        });
      });
    }
  }

  openConfirmModal({ title, message, confirmText, onConfirm }) {
    const root = document.getElementById('settings-confirm-root');
    if (!root) return;

    root.innerHTML = `
      <div class="modal-overlay active" id="settings-confirm-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title" style="color: var(--accent-rose);">${title}</h3>
            <button class="icon-btn" id="btn-close-settings-modal">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-primary); font-size: 0.95rem;">${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel-settings">Cancel</button>
            <button class="btn btn-danger" id="btn-action-settings">${confirmText}</button>
          </div>
        </div>
      </div>
    `;

    const overlay = root.querySelector('#settings-confirm-overlay');
    const closeBtn = root.querySelector('#btn-close-settings-modal');
    const cancelBtn = root.querySelector('#btn-cancel-settings');
    const actionBtn = root.querySelector('#btn-action-settings');

    const close = () => {
      overlay.classList.remove('active');
      setTimeout(() => { root.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    actionBtn.addEventListener('click', () => {
      onConfirm();
      close();
    });
  }
}
