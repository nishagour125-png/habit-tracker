import { store } from '../core/store.js';
import { getTodayDate, getContributionCalendarDays, formatReadableDate } from '../core/dates.js';

export class HeatmapView {
  constructor() {
    this.tooltipEl = null;
    this.ensureTooltip();
  }

  ensureTooltip() {
    let el = document.getElementById('heatmap-global-tooltip');
    if (!el) {
      el = document.createElement('div');
      el.id = 'heatmap-global-tooltip';
      el.className = 'heatmap-tooltip';
      document.body.appendChild(el);
    }
    this.tooltipEl = el;
  }

  render(container) {
    const habits = store.getHabits();
    const activeHabits = habits.filter(h => h.enabled !== false);
    const records = store.getRecords();
    const today = getTodayDate();

    const calendarDays = getContributionCalendarDays(today);
    const totalActive = activeHabits.length;

    // Calculate level for each day
    // 0 = empty
    // 1-2 = low activity (level-1)
    // 3-4 = medium activity (level-2)
    // 5-6 = high activity (level-3)
    // 7-8 = maximum activity (level-4)
    const getLevel = (count) => {
      if (count === 0) return 0;
      if (count <= 2) return 1;
      if (count <= 4) return 2;
      if (count <= 6) return 3;
      return 4;
    };

    // Calculate month label positions
    // We determine the first day of each month in the calendarDays array
    const monthPositions = [];
    let lastMonth = -1;
    calendarDays.forEach((day, index) => {
      const colIndex = Math.floor(index / 7);
      if (day.dayOfWeek === 0 || index === 0) {
        if (day.month !== lastMonth) {
          monthPositions.push({
            name: new Date(day.year, day.month, 1).toLocaleDateString(undefined, { month: 'short' }),
            colIndex
          });
          lastMonth = day.month;
        }
      }
    });

    const monthsHtml = monthPositions.map(m => `
      <span class="heatmap-month-label" style="left: ${m.colIndex * 16.5}px;">${m.name}</span>
    `).join('');

    // Generate grid cells
    const cellsHtml = calendarDays.map((day) => {
      const dayRecord = records[day.date] || {};
      let completedCount = 0;
      activeHabits.forEach(h => {
        if (dayRecord[h.id] && dayRecord[h.id].completed) {
          completedCount++;
        }
      });

      const level = day.isFuture ? 0 : getLevel(completedCount);
      const percentage = totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;
      const formattedDate = formatReadableDate(day.date, 'full');

      return `
        <div class="heatmap-cell level-${level} ${day.isFuture ? 'future-day' : ''}"
             data-date="${day.date}"
             data-count="${completedCount}"
             data-total="${totalActive}"
             data-percentage="${percentage}"
             data-readable="${formattedDate}"
             tabindex="0"
             role="gridcell"
             aria-label="${formattedDate}: ${completedCount} of ${totalActive} habits completed">
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="heatmap-card anim-fade-in">
        <div class="heatmap-header">
          <div class="heatmap-title-group">
            <h3 class="heatmap-title">
              <span>📅</span>
              <span>12-Month Consistency Heatmap</span>
            </h3>
            <p class="heatmap-subtitle">Your coding & habit activity over the past 365 days</p>
          </div>

          <div class="heatmap-legend">
            <span>Less</span>
            <div class="legend-swatch level-0"></div>
            <div class="legend-swatch level-1"></div>
            <div class="legend-swatch level-2"></div>
            <div class="legend-swatch level-3"></div>
            <div class="legend-swatch level-4"></div>
            <span>More</span>
          </div>
        </div>

        <div class="heatmap-scroll-container" id="heatmap-scroll">
          <div class="heatmap-container">
            <div class="heatmap-months-row">
              ${monthsHtml}
            </div>

            <div class="heatmap-body">
              <div class="heatmap-weekdays-col">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              <div class="heatmap-grid" role="grid">
                ${cellsHtml}
              </div>
            </div>
          </div>
        </div>

        <div class="heatmap-footer">
          <span>💡 Tip: Hover or click any day to inspect completed habits.</span>
          <span class="font-mono">Total tracked habits: ${totalActive}</span>
        </div>
      </div>

      <!-- Day Details Modal (Container) -->
      <div id="day-inspect-modal-root"></div>
    `;

    // Scroll to rightmost (current date)
    const scrollContainer = container.querySelector('#heatmap-scroll');
    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth;
      }, 50);
    }

    // Attach hover & click listeners to heatmap cells
    const cells = container.querySelectorAll('.heatmap-cell:not(.future-day)');
    cells.forEach(cell => {
      cell.addEventListener('mouseenter', (e) => this.showTooltip(e, cell));
      cell.addEventListener('mouseleave', () => this.hideTooltip());
      cell.addEventListener('click', () => this.openDayModal(cell.dataset.date));
    });
  }

  showTooltip(event, cell) {
    const { date, count, total, percentage, readable } = cell.dataset;
    if (!this.tooltipEl) return;

    this.tooltipEl.innerHTML = `
      <div class="tooltip-date">${readable}</div>
      <div class="tooltip-stats">${count} / ${total} habits completed (${percentage}%)</div>
    `;

    const rect = cell.getBoundingClientRect();
    this.tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
    this.tooltipEl.style.top = `${rect.top - 8}px`;
    this.tooltipEl.classList.add('visible');
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.classList.remove('visible');
    }
  }

  openDayModal(dateStr) {
    this.hideTooltip();
    const habits = store.getActiveHabits();
    const records = store.getRecords();
    const dayRecord = records[dateStr] || {};
    const readable = formatReadableDate(dateStr, 'full');

    const modalRoot = document.getElementById('day-inspect-modal-root');
    if (!modalRoot) return;

    const listHtml = habits.map(h => {
      const completed = Boolean(dayRecord[h.id]?.completed);
      return `
        <div class="habit-stat-row" style="margin-bottom: 8px;">
          <div class="stat-habit-info">
            <span class="stat-habit-icon">${h.icon}</span>
            <span class="stat-habit-title">${h.name}</span>
          </div>
          <button class="btn ${completed ? 'btn-primary' : 'btn-secondary'} btn-day-toggle font-mono" 
                  data-habit-id="${h.id}" 
                  style="font-size: 0.85rem; padding: 6px 14px;">
            ${completed ? '✓ Completed' : 'Mark Done'}
          </button>
        </div>
      `;
    }).join('');

    modalRoot.innerHTML = `
      <div class="modal-overlay active" id="day-modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Activity on ${readable}</h3>
              <span class="font-mono font-medium" style="color: var(--text-muted); font-size: 0.85rem;">Date: ${dateStr}</span>
            </div>
            <button class="icon-btn" id="btn-close-day-modal">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px;">
              Inspect or update habit records for this date:
            </p>
            ${listHtml}
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" id="btn-done-day-modal">Done</button>
          </div>
        </div>
      </div>
    `;

    const overlay = modalRoot.querySelector('#day-modal-overlay');
    const closeBtn = modalRoot.querySelector('#btn-close-day-modal');
    const doneBtn = modalRoot.querySelector('#btn-done-day-modal');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => { modalRoot.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    modalRoot.querySelectorAll('.btn-day-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const habitId = btn.dataset.habitId;
        store.toggleHabitCompletion(habitId, dateStr);
        this.openDayModal(dateStr); // Re-render modal with updated states
      });
    });
  }
}
