import { store } from '../core/store.js';
import { calculateHabitStreak } from '../core/streak.js';
import { sound } from '../utils/audio.js';
import { triggerConfetti } from '../utils/confetti.js';

export function createHabitCard(habit, records, today) {
  const stats = calculateHabitStreak(habit.id, records, habit.createdAt, today);
  const isCompleted = stats.isCompletedToday;

  const card = document.createElement('div');
  card.className = `habit-card ${isCompleted ? 'completed' : ''}`;
  card.style.setProperty('--habit-color', habit.color || 'var(--accent-indigo)');
  card.id = `habit-card-${habit.id}`;

  card.innerHTML = `
    <div class="habit-card-top">
      <div class="habit-title-area">
        <div class="habit-icon-box" style="border-color: ${isCompleted ? 'var(--accent-emerald)' : 'var(--border-subtle)'}">
          ${habit.icon}
        </div>
        <div class="habit-info">
          <span class="habit-name">${habit.name}</span>
          <span class="badge-category" style="--cat-color: ${habit.color || 'var(--accent-indigo)'}">
            ${habit.category}
          </span>
        </div>
      </div>
    </div>

    <p class="habit-description">${habit.description || 'Consistency beats intensity.'}</p>

    <div class="habit-card-bottom">
      <div class="habit-stats-pills">
        <div class="streak-tag ${stats.currentStreak > 0 ? 'pulse' : ''}" title="Current continuous streak">
          <span>🔥</span>
          <span class="font-mono">${stats.currentStreak}d</span>
        </div>
        <span class="best-streak-tag font-mono" title="Longest streak achieved">
          ★ Best: ${stats.longestStreak}d
        </span>
        <span class="completion-rate-tag font-mono" title="Historical completion percentage">
          ${stats.completionRate}%
        </span>
      </div>

      <button class="btn-toggle-habit ${isCompleted ? 'is-completed' : ''}" id="btn-toggle-${habit.id}">
        <span class="btn-toggle-icon">
          ${isCompleted ? '✓' : ''}
        </span>
        <span class="btn-toggle-label">${isCompleted ? 'Completed' : 'Complete'}</span>
      </button>
    </div>
  `;

  // Toggle Event Listener
  const toggleBtn = card.querySelector(`#btn-toggle-${habit.id}`);
  toggleBtn.addEventListener('click', (e) => {
    const rect = toggleBtn.getBoundingClientRect();
    const result = store.toggleHabitCompletion(habit.id, today);

    // Audio & Visual celebratory feedback
    const settings = store.getSettings();
    if (result.completed) {
      if (settings.soundEnabled) sound.playComplete();
      triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
      card.classList.add('anim-pop');
      setTimeout(() => card.classList.remove('anim-pop'), 400);
    } else {
      if (settings.soundEnabled) sound.playUncheck();
    }
  });

  return card;
}
