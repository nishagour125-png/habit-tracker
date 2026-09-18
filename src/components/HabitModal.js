import { store } from '../core/store.js';
import { CATEGORIES } from '../core/defaultHabits.js';

const POPULAR_EMOJIS = [
  '💻', '📚', '🌅', '🧘', '🥗', '❤️', '📵', '💧', '🏃', '🏋️', 
  '🎯', '⚡', '🧠', '🧩', '🚀', '📝', '🥑', '🚴', '📖', '✨'
];

export class HabitModal {
  constructor() {
    this.root = null;
    this.currentEditingId = null;
    this.selectedEmoji = '🎯';
    this.selectedCategory = 'Coding';
    this.selectedColor = '#6366F1';
    this.ensureRoot();
  }

  ensureRoot() {
    let el = document.getElementById('habit-modal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'habit-modal-root';
      document.body.appendChild(el);
    }
    this.root = el;
  }

  open(habitToEdit = null) {
    this.currentEditingId = habitToEdit ? habitToEdit.id : null;
    this.selectedEmoji = habitToEdit ? habitToEdit.icon : '🎯';
    this.selectedCategory = habitToEdit ? habitToEdit.category : 'Coding';
    this.selectedColor = habitToEdit ? (habitToEdit.color || '#6366F1') : '#6366F1';

    const isEdit = Boolean(habitToEdit);
    const title = isEdit ? 'Edit Habit' : 'Create New Habit';

    this.root.innerHTML = `
      <div class="modal-overlay active" id="habit-modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="icon-btn" id="btn-close-modal">✕</button>
          </div>

          <form id="habit-form">
            <div class="modal-body">
              <!-- Habit Name -->
              <div class="form-group">
                <label class="form-label" for="input-habit-name">Habit Name *</label>
                <input type="text" id="input-habit-name" class="form-input" 
                       placeholder="e.g. Read 20 Pages, Drink 3L Water" required 
                       value="${habitToEdit ? habitToEdit.name : ''}" />
              </div>

              <!-- Emoji Selection -->
              <div class="form-group">
                <label class="form-label">Icon / Emoji</label>
                <div class="emoji-picker-row" id="emoji-picker-row">
                  ${POPULAR_EMOJIS.map(em => `
                    <button type="button" class="emoji-opt-btn ${this.selectedEmoji === em ? 'selected' : ''}" data-emoji="${em}">
                      ${em}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Category -->
              <div class="form-group">
                <label class="form-label" for="select-habit-category">Category</label>
                <select id="select-habit-category" class="form-select">
                  ${CATEGORIES.map(c => `
                    <option value="${c.id}" ${this.selectedCategory === c.id ? 'selected' : ''}>
                      ${c.icon} ${c.label}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label" for="textarea-habit-desc">Short Description / Cue</label>
                <textarea id="textarea-habit-desc" class="form-textarea" rows="2" 
                          placeholder="Why is this habit important? When will you do it?">${habitToEdit ? (habitToEdit.description || '') : ''}</textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancel</button>
              <button type="submit" class="btn btn-primary" id="btn-submit-habit">
                ${isEdit ? 'Save Changes' : 'Create Habit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Bind events
    const overlay = this.root.querySelector('#habit-modal-overlay');
    const closeBtn = this.root.querySelector('#btn-close-modal');
    const cancelBtn = this.root.querySelector('#btn-cancel-modal');
    const form = this.root.querySelector('#habit-form');

    const close = () => {
      overlay.classList.remove('active');
      setTimeout(() => { this.root.innerHTML = ''; }, 200);
    };

    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Emoji clicks
    this.root.querySelectorAll('.emoji-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedEmoji = btn.dataset.emoji;
        this.root.querySelectorAll('.emoji-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.root.querySelector('#input-habit-name').value.trim();
      const description = this.root.querySelector('#textarea-habit-desc').value.trim();
      const category = this.root.querySelector('#select-habit-category').value;

      if (!name) return;

      const catObj = CATEGORIES.find(c => c.id === category);
      const color = catObj ? catObj.color : '#6366F1';

      if (this.currentEditingId) {
        store.updateHabit(this.currentEditingId, {
          name,
          icon: this.selectedEmoji,
          category,
          description,
          color
        });
      } else {
        store.addHabit({
          name,
          icon: this.selectedEmoji,
          category,
          description,
          color
        });
      }

      close();
    });

    setTimeout(() => {
      const input = this.root.querySelector('#input-habit-name');
      if (input) input.focus();
    }, 100);
  }
}

export const habitModal = new HabitModal();
