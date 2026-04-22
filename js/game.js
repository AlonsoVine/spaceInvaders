// =====================
//  Space Invaders v2.0
// =====================

const canvas   = document.getElementById('gameCanvas');
const ctx      = canvas.getContext('2d');
const scoreEl  = document.getElementById('score');
const livesEl  = document.getElementById('lives');
const levelEl  = document.getElementById('level');
const overlay  = document.getElementById('overlay');
const overlayMsg = document.getElementById('overlay-msg');
const btnStart = document.getElementById('btn-start');

// ---- Audio ----
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
}

function beep(freq, duration, type = 'square', vol = 0.15) {
  if (!audioCtx) return;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function soundShoot()  { beep(880, 0.08, 'square', 0.1); }
function soundHit()    { beep(200, 0.15, 'sawtooth', 0.2); }
function soundDeath()  { beep(150, 0.4, 'sawtooth', 0.25); setTimeout(() => beep(100, 0.4, 'sawtooth', 0.2), 200); }
function soundWin()    { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.15, 'sine', 0.2), i * 120)); }

// ---- Estado ----
let score, lives, level, running, invincibleTimer;

// ---- Jugador ----
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  w: 40, h: 20,
  speed: 5,
  hit: false,
};

// ---- Teclas ----
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Enter' && !running) startGame();
  if (e.code === 'Space') { e.preventDefault(); shoot(); }
});
document.addEventListener('keyup', e => keys[e.code] = false);
btnStart.addEventListener('click', () => { initAudio(); startGame(); });

// ---- Bala jugador ----
let bullet = null;
function shoot() {
  if (!running || bullet) return;
  bullet = { x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 14, speed: 9 };
  soundShoot();
}

// ---- Balas enemigas ----
const enemyBullets = [];
let enemyShootTimer = 0;
const ENEMY_SHOOT_INTERVAL = 90; // frames

// ---- Enemigos ----
const enemies = [];
let enemyDir = 1;
let enemySpeed = 1;
let enemyDropPending = false;
const ENEMY_DROP = 20;

function spawnEnemies() {
  enemies.length = 0;
  const rows = 3, cols = 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      enemies.push({
        x: 50 + c * 68,
        y: 60 + r * 50,
        w: 36, h: 24,
        alive: true,
        row: r,
      });
    }
  }
  enemyDir = 1;
  enemySpeed = 1 + (level - 1) * 0.4;
}

// ---- Update ----
let frameCount = 0;

function update() {
  frameCount++;

  // Jugador
  if (keys['ArrowLeft']  && player.x > 0)                        player.x -= player.speed;
  if (keys['ArrowRight'] && player.x + player.w < canvas.width)  player.x += player.speed;

  // Invencibilidad tras golpe
  if (invincibleTimer > 0) invincibleTimer--;

  // Bala jugador
  if (bullet) {
    bullet.y -= bullet.speed;
    if (bullet.y + bullet.h < 0) { bullet = null; }
    else {
      for (const e of enemies) {
        if (!e.alive) continue;
        if (rectsOverlap(bullet, e)) {
          e.alive = false;
          bullet = null;
          score += (e.row === 0 ? 30 : e.row === 1 ? 20 : 10);
          scoreEl.textContent = score;
          soundHit();
          break;
        }
      }
    }
  }

  // Movimiento enemigos
  const alive = enemies.filter(e => e.alive);
  if (alive.length === 0) {
    level++;
    levelEl.textContent = level;
    soundWin();
    spawnEnemies();
    return;
  }

  const leftmost  = Math.min(...alive.map(e => e.x));
  const rightmost = Math.max(...alive.map(e => e.x + e.w));

  if (enemyDropPending) {
    alive.forEach(e => e.y += ENEMY_DROP);
    enemyDropPending = false;
  } else {
    alive.forEach(e => e.x += enemyDir * enemySpeed);
    if (rightmost >= canvas.width - 10 || leftmost <= 10) {
      enemyDir *= -1;
      enemyDropPending = true;
    }
  }

  // Enemigos llegan al fondo
  if (alive.some(e => e.y + e.h >= player.y)) {
    return triggerDeath();
  }

  // Disparos enemigos
  enemyShootTimer++;
  if (enemyShootTimer >= ENEMY_SHOOT_INTERVAL) {
    enemyShootTimer = 0;
    const shooters = alive.filter(e => {
      const col = Math.round((e.x - 50) / 68);
      return !alive.some(o => o !== e && Math.round((o.x - 50) / 68) === col && o.y > e.y);
    });
    if (shooters.length) {
      const s = shooters[Math.floor(Math.random() * shooters.length)];
      enemyBullets.push({ x: s.x + s.w / 2 - 2, y: s.y + s.h, w: 4, h: 12, speed: 4 });
    }
  }

  // Balas enemigas
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.y += b.speed;
    if (b.y > canvas.height) { enemyBullets.splice(i, 1); continue; }
    if (invincibleTimer === 0 && rectsOverlap(b, player)) {
      enemyBullets.splice(i, 1);
      triggerDeath();
    }
  }
}

function triggerDeath() {
  lives--;
  livesEl.textContent = lives;
  soundDeath();
  if (lives <= 0) return gameOver();
  invincibleTimer = 120;
  player.hit = true;
  setTimeout(() => player.hit = false, 2000);
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// ---- Draw ----
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jugador (parpadea si está en invencibilidad)
  if (!player.hit || Math.floor(frameCount / 6) % 2 === 0) {
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00ff88';
    // Cuerpo
    ctx.fillRect(player.x + 8, player.y + 8, player.w - 16, player.h - 8);
    // Cañón
    ctx.fillRect(player.x + player.w / 2 - 3, player.y, 6, 10);
    // Alas
    ctx.fillRect(player.x, player.y + 12, 10, 8);
    ctx.fillRect(player.x + player.w - 10, player.y + 12, 10, 8);
    ctx.shadowBlur = 0;
  }

  // Bala jugador
  if (bullet) {
    ctx.fillStyle = '#ffff00';
    ctx.shadowBlur = 6; ctx.shadowColor = '#ffff00';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    ctx.shadowBlur = 0;
  }

  // Balas enemigas
  ctx.fillStyle = '#ff6600';
  for (const b of enemyBullets) ctx.fillRect(b.x, b.y, b.w, b.h);

  // Enemigos
  for (const e of enemies) {
    if (!e.alive) continue;
    const color = e.row === 0 ? '#ff44cc' : e.row === 1 ? '#ff4488' : '#ff6644';
    ctx.fillStyle = color;
    ctx.shadowBlur = 4; ctx.shadowColor = color;
    // Cuerpo alien
    ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);
    // Antenas
    ctx.fillRect(e.x + 6, e.y, 4, 6);
    ctx.fillRect(e.x + e.w - 10, e.y, 4, 6);
    // Patas
    ctx.fillRect(e.x, e.y + e.h - 6, 8, 6);
    ctx.fillRect(e.x + e.w - 8, e.y + e.h - 6, 8, 6);
    ctx.shadowBlur = 0;
  }
}

// ---- Loop ----
function loop() {
  update();
  draw();
  if (running) requestAnimationFrame(loop);
}

// ---- Game Over / Victoria ----
function gameOver() {
  running = false;
  overlayMsg.innerHTML = `💀 GAME OVER<br><br>Puntuación: <strong>${score}</strong><br><br>Pulsa <strong>ENTER</strong> para reintentar`;
  btnStart.textContent = 'REINTENTAR';
  overlay.classList.add('visible');
}

// ---- Start ----
function startGame() {
  score = 0; lives = 3; level = 1;
  scoreEl.textContent = 0;
  livesEl.textContent = 3;
  levelEl.textContent = 1;
  bullet = null;
  enemyBullets.length = 0;
  invincibleTimer = 0;
  player.x = canvas.width / 2 - 20;
  player.hit = false;
  frameCount = 0;
  enemyShootTimer = 0;
  spawnEnemies();
  overlay.classList.remove('visible');
  running = true;
  loop();
}

draw();

// ---- Controles táctiles ----
const touchState = { left: false, right: false };

function addTouchBtn(id, onStart, onEnd) {
  const btn = document.getElementById(id);
  if (!btn) return;
  ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, e => { e.preventDefault(); initAudio(); onStart(); }, { passive: false }));
  ['touchend','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, e => { e.preventDefault(); onEnd(); }, { passive: false }));
}

addTouchBtn('btn-left',  () => keys['ArrowLeft'] = true,  () => keys['ArrowLeft'] = false);
addTouchBtn('btn-right', () => keys['ArrowRight'] = true, () => keys['ArrowRight'] = false);
addTouchBtn('btn-fire',  () => shoot(), () => {});
