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

/* ── GESTION DU FOND DE PARTICULES (EFFET NEIGE ACCENTUÉ) ── */
const cv = document.getElementById('bg-canvas');
const cx = cv.getContext('2d');
function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

// On augmente drastiquement le nombre, la taille et la vitesse des particules
const pts = Array.from({ length: 80 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.4,       // Balancement horizontal accentué
  vy: Math.random() * 0.6 + 0.2,         // Chute plus rapide
  r: Math.random() * 2 + 0.5,            // Particules plus grosses
  a: Math.random() * 0.5 + 0.15,         // Particules plus brillantes
  life: Math.random() * 400,
  max: Math.random() * 300 + 200
}));

(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  pts.forEach(p => {
    // Mouvement avec effet de vent/vague
    p.x += p.vx + Math.sin(p.life * 0.015) * 0.4; 
    p.y += p.vy;
    p.life++;
    
    // Scintillement
    const a = p.a * Math.sin((p.life / p.max) * Math.PI);
    
    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(0,255,255,${a})`; // On passe les flocons en cyan
    cx.fill();
    
    // Réapparition en haut quand elles sortent de l'écran
    if (p.life > p.max || p.y > cv.height + 10)
