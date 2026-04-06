/* ── GESTION DU CURSEUR UNIQUE ── */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});

(function loop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

/* Interaction du curseur avec les éléments cliquables */
document.querySelectorAll('a, .node, .v-cell, .obj-col, .nav-dot').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.width = '50px';
    ring.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '30px';
    ring.style.height = '30px';
  });
});

/* ── GESTION DU FOND DE PARTICULES (OPACITÉ BOOSTÉE) ── */
const cv = document.getElementById('bg-canvas');
const cx = cv.getContext('2d');
function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const pts = Array.from({ length: 280 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.3,
  vy: Math.random() * 0.7 + 0.3,
  r: Math.random() * 2.5 + 0.8,          // Flocons légèrement plus gros
  a: Math.random() * 0.5 + 0.5,          // OPACITÉ BOOSTÉE (entre 50% et 100%)
  life: Math.random() * 400,
  max: Math.random() * 300 + 200
}));

(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  pts.forEach(p => {
    p.x += p.vx + Math.sin(p.life * 0.015) * 0.3;
    p.y += p.vy;
    p.life++;

    // Le scintillement garde les flocons bien visibles
    const a = p.a * Math.sin((p.life / p.max) * Math.PI);

    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(0, 255, 255, ${a})`; 
    cx.fill();

    if (p.life > p.max || p.y > cv.height + 10) {
      p.x = Math.random() * cv.width;
      p.y = -5;
      p.life = 0;
      p.max = Math.random() * 300 + 200;
      p.vx = (Math.random() - 0.5) * 0.3;
      p.vy = Math.random() * 0.7 + 0.3;
      p.r = Math.random() * 2.5 + 0.8;       // Flocons légèrement plus gros
      p.a = Math.random() * 0.5 + 0.5;       // OPACITÉ BOOSTÉE
    }
  });

  requestAnimationFrame(draw);
})();

/* ── GESTION DES ANIMATIONS D'APPARITION (AU CHARGEMENT) ── */
setTimeout(() => {
  if (document.getElementById('hero-name')) document.getElementById('hero-name').classList.add('on');
  if (document.getElementById('intro-text')) document.getElementById('intro-text').classList.add('on');
  if (document.getElementById('node-center')) document.getElementById('node-center').classList.add('sharp');
  document.querySelectorAll('.story-line, .v-cell, .obj-col, .cloture-box').forEach((el, i) => setTimeout(() => el.classList.add('on'), i * 150));
  document.querySelectorAll('.node').forEach((el, i) => setTimeout(() => el.classList.add('sharp'), i * 150));
}, 200);
