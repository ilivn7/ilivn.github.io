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

/* ── GESTION DU FOND DE PARTICULES (TEMPÊTE DE NEIGE OCCULTE) ── */
const cv = document.getElementById('bg-canvas');
const cx = cv.getContext('2d');
function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

// NOMBRE DE FLOCONS AUGMENTÉ DRASTIQUEMENT (TEMPÊTE)
// On passe de 80 à 280 particules pour un effet très dense
const pts = Array.from({ length: 280 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.3,       // Balancement horizontal
  vy: Math.random() * 0.7 + 0.3,         // Chute variée
  r: Math.random() * 1.8 + 0.3,          // Taille variée
  a: Math.random() * 0.6 + 0.15,         // Brillance variée
  life: Math.random() * 400,
  max: Math.random() * 300 + 200
}));

(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  pts.forEach(p => {
    // Mouvement avec effet de vent/vague
    p.x += p.vx + Math.sin(p.life * 0.015) * 0.3;
    p.y += p.vy;
    p.life++;

    // Scintillement
    const a = p.a * Math.sin((p.life / p.max) * Math.PI);

    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(0,255,255,${a})`; // flocons cyan
    cx.fill();

    // Réapparition en haut quand elles sortent de l'écran
    if (p.life > p.max || p.y > cv.height + 10) {
      p.x = Math.random() * cv.width;
      p.y = -5;
      p.life = 0;
      p.max = Math.random() * 300 + 200;
      p.vx = (Math.random() - 0.5) * 0.3;
      p.vy = Math.random() * 0.7 + 0.3;
      p.r = Math.random() * 1.8 + 0.3;
      p.a = Math.random() * 0.6 + 0.15;
    }
  });

  // NOTE TECHNIQUE : J'ai supprimé la boucle des connexions (toile d'araignée)
  // car avec 280 particules, cela ralentirait trop le site et masquerait la neige.
  // Maintenant, c'est une pure tempête de flocons.

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
