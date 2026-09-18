/**
 * SVG-based Modern Chart Engine
 * Renders sleek, responsive, retina-sharp charts with no heavy third-party bundle.
 */

export function renderWeeklyBarChart(container, data) {
  if (!container) return;
  container.innerHTML = '';

  const width = 600;
  const height = 240;
  const padding = { top: 30, right: 20, bottom: 40, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const barWidth = Math.min(42, Math.floor(chartW / data.length) - 16);
  const gap = Math.floor((chartW - barWidth * data.length) / (data.length + 1));

  let barsSvg = '';
  let gridSvg = '';

  // Horizontal guide lines at 25%, 50%, 75%, 100%
  [0, 25, 50, 75, 100].forEach(val => {
    const y = padding.top + chartH - (val / 100) * chartH;
    gridSvg += `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
            stroke="var(--border-subtle)" stroke-dasharray="${val === 0 ? 'none' : '4 4'}" stroke-width="1" />
      <text x="${padding.left - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="var(--font-mono)">${val}%</text>
    `;
  });

  data.forEach((item, index) => {
    const x = padding.left + gap + index * (barWidth + gap);
    const barH = Math.max(4, (item.percentage / 100) * chartH);
    const y = padding.top + chartH - barH;
    const isToday = index === data.length - 1;

    const barGradient = isToday ? 'url(#barGradientActive)' : 'url(#barGradientNormal)';

    barsSvg += `
      <g class="chart-bar-group" data-tooltip="${item.shortDate}: ${item.completed}/${item.total} habits (${item.percentage}%)">
        <!-- Background track -->
        <rect x="${x}" y="${padding.top}" width="${barWidth}" height="${chartH}" rx="6" fill="var(--surface-hover)" opacity="0.5" />
        <!-- Filled bar -->
        <rect class="bar-rect" x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="${barGradient}">
          <animate attributeName="height" from="0" to="${barH}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="y" from="${padding.top + chartH}" to="${y}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </rect>
        <!-- Value label on top -->
        <text x="${x + barWidth / 2}" y="${y - 8}" fill="${isToday ? 'var(--accent-primary)' : 'var(--text-secondary)'}" 
              font-size="11" font-weight="600" text-anchor="middle" font-family="var(--font-mono)">
          ${item.percentage}%
        </text>
        <!-- X-axis label -->
        <text x="${x + barWidth / 2}" y="${height - padding.bottom + 20}" fill="${isToday ? 'var(--accent-primary)' : 'var(--text-muted)'}" 
              font-size="12" font-weight="${isToday ? '700' : '500'}" text-anchor="middle">
          ${item.label}
        </text>
      </g>
    `;
  });

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="barGradientNormal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="100%" stop-color="#1D4ED8" />
        </linearGradient>
        <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>
      ${gridSvg}
      ${barsSvg}
    </svg>
  `;

  container.innerHTML = svg;
}

export function renderMonthlyTrendChart(container, weeklyData) {
  if (!container) return;
  container.innerHTML = '';

  const width = 600;
  const height = 220;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  let gridSvg = '';
  [0, 50, 100].forEach(val => {
    const y = padding.top + chartH - (val / 100) * chartH;
    gridSvg += `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
            stroke="var(--border-subtle)" stroke-dasharray="${val === 0 ? 'none' : '4 4'}" stroke-width="1" />
      <text x="${padding.left - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="11" text-anchor="end" font-family="var(--font-mono)">${val}%</text>
    `;
  });

  if (weeklyData.length === 0) return;

  const points = weeklyData.map((w, idx) => {
    const x = padding.left + (idx / Math.max(1, weeklyData.length - 1)) * chartW;
    const y = padding.top + chartH - (w.percentage / 100) * chartH;
    return { x, y, data: w };
  });

  // Create smooth bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  let dotsSvg = '';
  points.forEach((p, idx) => {
    dotsSvg += `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--accent-indigo)" stroke="var(--surface-primary)" stroke-width="2.5" />
      <text x="${p.x}" y="${p.y - 12}" fill="var(--text-primary)" font-size="11" font-weight="600" text-anchor="middle" font-family="var(--font-mono)">
        ${p.data.percentage}%
      </text>
      <text x="${p.x}" y="${height - padding.bottom + 20}" fill="var(--text-muted)" font-size="12" text-anchor="middle">
        ${p.data.label}
      </text>
    `;
  });

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6366F1" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#6366F1" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridSvg}
      <path d="${areaD}" fill="url(#areaGradient)" />
      <path d="${pathD}" fill="none" stroke="#6366F1" stroke-width="3.5" stroke-linecap="round" />
      ${dotsSvg}
    </svg>
  `;

  container.innerHTML = svg;
}

export function renderHabitBreakdownList(container, habitStats) {
  if (!container) return;
  container.innerHTML = '';

  const html = habitStats.map(stat => {
    return `
      <div class="habit-stat-row">
        <div class="stat-habit-info">
          <span class="stat-habit-icon">${stat.icon}</span>
          <div class="stat-habit-names">
            <span class="stat-habit-title">${stat.name}</span>
            <span class="stat-habit-category badge-category" style="--cat-color: ${stat.color}">${stat.category}</span>
          </div>
        </div>

        <div class="stat-bar-container">
          <div class="stat-progress-bar">
            <div class="stat-progress-fill" style="width: ${stat.completionRate}%; background-color: ${stat.color}"></div>
          </div>
          <span class="stat-percentage font-mono">${stat.completionRate}%</span>
        </div>

        <div class="stat-streak-pill">
          <span class="streak-icon">🔥</span>
          <span class="font-mono">${stat.currentStreak}d</span>
          <span class="best-badge font-mono" title="Best streak">★ ${stat.longestStreak}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}
