import { store } from '../core/store.js';
import { getTodayDate } from '../core/dates.js';
import { calculateHabitStreak } from '../core/streak.js';
import { habitModal } from './HabitModal.js';

export class MyHabitsView {
  render(container) {
    const habits = store.getHabits();
    const records = store.getRecords();
    const today = getTodayDate();

    container.innerHTML = `
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>✅</span>
              <span>Manage Habits</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Customize your daily routine, enable/disable habits, or add new challenges.
            </p>
          </div>

          <button class="btn btn-primary" id="btn-manage-add-habit">
            <span>+</span>
            <span>New Habit</span>
          </button>
        </div>

        <!-- Habits List Container -->
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 20px;">
          ${habits.length === 0 ? `
            <div class="empty-state">
              <span class="empty-icon">🌱</span>
              <h4 class="empty-title">No habits created yet</h4>
              <p class="empty-text">Click "New Habit" above to add your first daily discipline.</p>
            </div>
          ` : habits.map(habit => {
            const stats = calculateHabitStreak(habit.id, records, habit.createdAt, today);
            const isEnabled = habit.enabled !== false;

            return `
              <div class="card card-hover" style="padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 18px; border-left: 4px solid ${habit.color || 'var(--accent-indigo)'}; opacity: ${isEnabled ? '1' : '0.6'};">
                <div style="display: flex; align-items: center; gap: 16px; min-width: 260px;">
                  <div class="habit-icon-box" style="font-size: 1.5rem;">
                    ${habit.icon}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${habit.name}</h4>
                      <span class="badge-category" style="--cat-color: ${habit.color || 'var(--accent-indigo)'}; font-size: 0.72rem;">
                        ${habit.category}
                      </span>
                      ${!isEnabled ? '<span class="badge-category font-mono" style="--cat-color: #64748B; background: rgba(100, 116, 139, 0.15);">Disabled</span>' : ''}
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">${habit.description || 'No description provided.'}</p>
                  </div>
                </div>

                <!-- Stats summary -->
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="streak-tag ${stats.currentStreak > 0 ? 'pulse' : ''}" title="Current Streak">
                    <span>🔥</span>
                    <span class="font-mono">${stats.currentStreak}d</span>
                  </div>

                  <span class="font-mono" style="font-size: 0.82rem; color: var(--text-muted);" title="Best Streak">
                    ★ Best: ${stats.longestStreak}d
                  </span>

                  <span class="font-mono" style="font-size: 0.82rem; color: var(--text-secondary);" title="Total Completed Days">
                    ✓ ${stats.totalCompletedDays} days
                  </span>
                </div>

                <!-- Actions -->
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="btn btn-secondary btn-edit-habit" data-id="${habit.id}" title="Edit habit details">
                    ✏️ Edit
                  </button>

                  <button class="btn btn-secondary btn-toggle-enable-habit" data-id="${habit.id}" title="${isEnabled ? 'Disable habit temporarily' : 'Enable habit'}">
                    ${isEnabled ? '⏸️ Pause' : '▶️ Resume'}
                  </button>

                  <button class="btn btn-danger btn-delete-habit" data-id="${habit.id}" data-name="${habit.name}" title="Delete habit and history">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Delete Confirmation Modal Root -->
      <div id="delete-confirm-root"></div>
    `;

    // New Habit button
    const addBtn = container.querySelector('#btn-manage-add-habit');
    if (addBtn) {
      addBtn.addEventListener('click', () => habitModal.open());
    }

    // Edit buttons
    container.querySelectorAll('.btn-edit-habit').forEach(btn => {
      btn.addEventListener('click', () => {
        const habitId = btn.dataset.id;
        const habit = habits.find(h => h.id === habitId);
        if (habit) habitModal.open(habit);
      });
    });

    // Toggle enabled buttons
    container.querySelectorAll('.btn-toggle-enable-habit').forEach(btn => {
      btn.addEventListener('click', () => {
        const habitId = btn.dataset.id;
        store.toggleHabitEnabled(habitId);
      });
    });

    // Delete buttons
    container.querySelectorAll('.btn-delete-habit').forEach(btn => {
      btn.addEventListener('click', () => {
        const habitId = btn.dataset.id;
        const habitName = btn.dataset.name;
        this.confirmDelete(habitId, habitName);
      });
    });
  }

  confirmDelete(habitId, habitName) {
    const root = document.getElementById('delete-confirm-root');
    if (!root) return;

    root.innerHTML = `
      <div class="modal-overlay active" id="delete-modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title" style="color: var(--accent-rose);">Delete Habit</h3>
            <button class="icon-btn" id="btn-close-delete-modal">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-primary); font-size: 1rem;">
              Are you sure you want to permanently delete <strong>"${habitName}"</strong>?
            </p>
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 8px;">
              This will remove all historical streak and completion records for this habit. This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel-delete">Cancel</button>
            <button class="btn btn-danger" id="btn-confirm-delete">Yes, Delete Habit</button>
          </div>
        </div>
      </div>
    `;

    const overlay = root.querySelector('#delete-modal-overlay');
    const closeBtn = root.querySelector('#btn-close-delete-modal');
    const cancelBtn = root.querySelector('#btn-cancel-delete');
    const confirmBtn = root.querySelector('#btn-confirm-delete');

    const close = () => {
      overlay.classList.remove('active');
      setTimeout(() => { root.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    confirmBtn.addEventListener('click', () => {
      store.deleteHabit(habitId);
      close();
    });
  }
}
