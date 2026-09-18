import { store } from '../core/store.js';
import { calculateGlobalStreaks } from '../core/streak.js';
import { evaluateAchievements } from '../core/achievements.js';
import { formatReadableDate } from '../core/dates.js';

export class AchievementsView {
  constructor() {
    this.selectedCategory = 'All';
  }

  render(container) {
    const habits = store.getHabits();
    const records = store.getRecords();
    const storedAchievements = store.getAchievements();
    const globalStreak = calculateGlobalStreaks(habits, records);

    const { badges } = evaluateAchievements({ habits, records, globalStreak }, storedAchievements);

    const unlockedCount = badges.filter(b => b.unlocked).length;
    const totalCount = badges.length;
    const unlockPercentage = Math.round((unlockedCount / totalCount) * 100);

    const categories = ['All', 'Streak', 'Milestone', 'Perfection', 'Discipline'];
    const filteredBadges = this.selectedCategory === 'All'
      ? badges
      : badges.filter(b => b.category === this.selectedCategory);

    container.innerHTML = `
      <div class="anim-fade-in">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <span>🏆</span>
              <span>Achievements & Milestones</span>
            </h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px;">
              Unlock badges and level up your consistency discipline.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="topbar-stat-pill font-mono" style="font-size: 0.95rem; border-color: rgba(245, 158, 11, 0.4);">
              <span>🔥</span>
              <span>${unlockedCount} / ${totalCount} Unlocked (${unlockPercentage}%)</span>
            </div>
          </div>
        </div>

        <!-- Overall Badge Progress Bar -->
        <div class="card" style="padding: 18px 24px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Mastery Progress</span>
            <span class="font-mono" style="font-size: 0.85rem; font-weight: 700; color: var(--accent-amber);">${unlockPercentage}%</span>
          </div>
          <div class="stat-progress-bar" style="height: 10px;">
            <div class="stat-progress-fill" style="width: ${unlockPercentage}%; background: linear-gradient(90deg, #F59E0B 0%, #10B981 100%);"></div>
          </div>
        </div>

        <!-- Filter Chips -->
        <div class="category-chips" style="margin-bottom: 24px;">
          ${categories.map(cat => `
            <button class="category-chip ${this.selectedCategory === cat ? 'selected' : ''}" data-cat="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Badges Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px;">
          ${filteredBadges.map(badge => {
            const isUnlocked = badge.unlocked;
            const progressRatio = Math.min(100, Math.round((badge.progress / badge.max) * 100));

            return `
              <div class="card card-hover" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; border-color: ${isUnlocked ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}; background: ${isUnlocked ? 'linear-gradient(135deg, var(--surface-primary) 0%, rgba(245, 158, 11, 0.05) 100%)' : 'var(--surface-primary)'}; opacity: ${isUnlocked ? '1' : '0.85'};">
                <div style="display: flex; align-items: flex-start; gap: 14px;">
                  <div style="width: 52px; height: 52px; border-radius: var(--radius-md); background-color: ${isUnlocked ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-secondary)'}; border: 1.5px solid ${isUnlocked ? 'var(--accent-amber)' : 'var(--border-subtle)'}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; filter: ${isUnlocked ? 'none' : 'grayscale(1) opacity(0.5)'}; box-shadow: ${isUnlocked ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none'};">
                    ${badge.icon}
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${badge.title}</h4>
                      ${isUnlocked ? '<span style="color: var(--accent-amber); font-size: 0.9rem;">✓</span>' : ''}
                    </div>
                    <span class="badge-category font-mono" style="--cat-color: #6366F1; font-size: 0.7rem;">${badge.category}</span>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${badge.description}</p>
                  </div>
                </div>

                <!-- Progress / Status Footer -->
                <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                  ${isUnlocked ? `
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span class="badge-category font-mono" style="--cat-color: var(--accent-amber); background: rgba(245, 158, 11, 0.12); font-size: 0.75rem;">
                        UNLOCKED 🏆
                      </span>
                      <span class="font-mono" style="font-size: 0.75rem; color: var(--text-muted);">
                        ${badge.unlockedAt ? formatReadableDate(badge.unlockedAt.split('T')[0], 'short') : 'Achieved'}
                      </span>
                    </div>
                  ` : `
                    <div>
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">In Progress</span>
                        <span class="font-mono" style="font-size: 0.75rem; color: var(--text-secondary);">${badge.progress} / ${badge.max}</span>
                      </div>
                      <div class="stat-progress-bar" style="height: 6px;">
                        <div class="stat-progress-fill" style="width: ${progressRatio}%; background-color: var(--accent-indigo);"></div>
                      </div>
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Category click listeners
    container.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.cat;
        this.render(container);
      });
    });
  }
}
