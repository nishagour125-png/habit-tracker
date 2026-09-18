/**
 * Lightweight Canvas Confetti & Particle Burst
 */

let canvas = null;
let ctx = null;
let particles = [];
let animationId = null;

function ensureCanvas() {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
}

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
}

const COLORS = [
  '#10B981', '#3B82F6', '#6366F1', '#F59E0B', 
  '#EC4899', '#8B5CF6', '#14B8A6', '#F43F5E'
];

export function triggerConfetti(originX = null, originY = null, count = 40) {
  ensureCanvas();

  const startX = originX !== null ? originX : window.innerWidth / 2;
  const startY = originY !== null ? originY : window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * Math.random());
    const velocity = 4 + Math.random() * 8;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2,
      gravity: 0.25,
      color,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      alpha: 1,
      decay: 0.015 + Math.random() * 0.015
    });
  }

  if (!animationId) {
    loop();
  }
}

function loop() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }

  if (particles.length > 0) {
    animationId = requestAnimationFrame(loop);
  } else {
    animationId = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
