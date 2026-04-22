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
function initAudio() { if (!audioCtx) audioCtx = new AudioCtx(); }
function beep(freq, duration, type = 'square', vol = 0.12) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start(); osc.stop(audioCtx.currentTime + duration);
}
function soundShoot() { beep(880, 0.08, 'square', 0.1); }
function soundHit()   { beep(180, 0.15, 'sawtooth', 0.18); }
function soundDeath() { beep(150, 0.35, 'sawtooth', 0.2); setTimeout(() => beep(90, 0.4, 'sawtooth', 0.18), 180); }
function soundWin()   { [523,659,784,1047].forEach((f,i) => setTimeout(() => beep(f, 0.15, 'sine', 0.2), i*120)); }

// ---- Estado ----
let score, lives, level, running, invincibleTimer, frameCount;

// ---- Jugador ----
const player = { x: 0, y: canvas.height - 60, w: 40, h: 20, speed: 5, hit: false };

// ---- Teclas ----
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Enter' && !running) { initAudio(); startGame(); }
  if (e.code === 'Space') { e.preventDefault(); shoot(); }
});
document.addEventListener('keyup', e => keys[e.code] = false);
btnStart.addEventListener('click', () => { initAudio(); startGame(); });

// ---- Bala jugador ----
let bullet = null;
function shoot() {
  if (!running || bullet) return;
  bullet = { x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 14, speed: 9 };
  soundShoot();
}

// ---- Balas enemigas ----
const enemyBullets = [];
let enemyShootTimer = 0;
const ENEMY_SHOOT_INTERVAL = 100;

// ---- Enemigos ----
// Lógica clásica Space Invaders:
// - Todo el grupo se mueve a la vez en pasos discretos
// - Cuando alguno toca el borde, en el SIGUIENTE paso bajan todos y cambian dirección
// - Velocidad = función del número de enemigos vivos (menos = más rápido)
const enemies = [];
let enemyDir = 1;       // 1 = derecha, -1 = izquierda
const ENEMY_STEP_X = 10;  // píxeles por paso horizontal
const ENEMY_STEP_Y = 20;  // píxeles que bajan al tocar el borde
let enemyTickTimer = 0;
let pendingDrop = false;

const COLS = 8, ROWS = 3;
const E_W = 36, E_H = 24;
const MARGIN_X = 55, MARGIN_Y = 65, GAP_X = 74, GAP_Y = 52;
const TOTAL_ENEMIES = COLS * ROWS;

// Intervalo entre pasos: 60 frames con todos vivos → 6 frames con 1 vivo
function getEnemyTickInterval() {
  const alive = enemies.filter(e => e.alive).length;
  const base = Math.max(4, 28 - (level - 1) * 2);
  return Math.max(4, Math.round(base * (alive / TOTAL_ENEMIES)));
}

function spawnEnemies() {
  enemies.length = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      enemies.push({ x: MARGIN_X + c * GAP_X, y: MARGIN_Y + r * GAP_Y, w: E_W, h: E_H, alive: true, row: r });
    }
  }
  enemyDir = 1;
  enemyTickTimer = 0;
  pendingDrop = false;
}

// ---- Update ----
function update() {
  frameCount++;

  // Jugador
  if (keys['ArrowLeft']  && player.x > 0)                       player.x -= player.speed;
  if (keys['ArrowRight'] && player.x + player.w < canvas.width) player.x += player.speed;

  // Invencibilidad
  if (invincibleTimer > 0) invincibleTimer--;

  // Bala jugador
  if (bullet) {
    bullet.y -= bullet.speed;
    if (bullet.y + bullet.h < 0) { bullet = null; }
    else {
      for (const e of enemies) {
        if (!e.alive) continue;
        if (rectsOverlap(bullet, e)) {
          e.alive = false; bullet = null;
          score += e.row === 0 ? 30 : e.row === 1 ? 20 : 10;
          scoreEl.textContent = score;
          soundHit();
          break;
        }
      }
    }
  }

  const alive = enemies.filter(e => e.alive);

  // Victoria
  if (alive.length === 0) {
    level++; levelEl.textContent = level;
    soundWin();
    spawnEnemies();
    return;
  }

  // Paso de enemigos (discreto, clásico)
  enemyTickTimer++;
  if (enemyTickTimer >= getEnemyTickInterval()) {
    enemyTickTimer = 0;

    if (pendingDrop) {
      // Bajar todos y cambiar dirección — solo ocurre una vez por borde tocado
      enemies.forEach(e => { if (e.alive) e.y += ENEMY_STEP_Y; });
      enemyDir *= -1;
      pendingDrop = false;
    } else {
      // Mover todo el grupo horizontalmente un paso
      enemies.forEach(e => { if (e.alive) e.x += enemyDir * ENEMY_STEP_X; });

      // Comprobar si algún enemigo toca el borde DESPUÉS de moverse
      const leftmost  = Math.min(...alive.map(e => e.x));
      const rightmost = Math.max(...alive.map(e => e.x + e.w));
      if (rightmost >= canvas.width - 8 || leftmost <= 8) {
        pendingDrop = true; // el drop ocurrirá en el SIGUIENTE tick
      }
    }
  }

  // Enemigos llegan al suelo
  if (alive.some(e => e.y + e.h >= player.y)) triggerDeath();

  // Disparos enemigos: solo los de la fila más baja por columna
  enemyShootTimer++;
  if (enemyShootTimer >= ENEMY_SHOOT_INTERVAL) {
    enemyShootTimer = 0;
    // Agrupar por columna aproximada y coger el más bajo
    const cols = {};
    for (const e of alive) {
      const col = Math.round(e.x / GAP_X);
      if (!cols[col] || e.y > cols[col].y) cols[col] = e;
    }
    const shooters = Object.values(cols);
    if (shooters.length) {
      const s = shooters[Math.floor(Math.random() * shooters.length)];
      enemyBullets.push({ x: s.x + s.w/2 - 2, y: s.y + s.h, w: 4, h: 12, speed: 4 });
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
  lives--; livesEl.textContent = lives;
  soundDeath();
  if (lives <= 0) return gameOver();
  invincibleTimer = 120;
  player.hit = true;
  setTimeout(() => { player.hit = false; }, 2000);
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ---- Draw ----
function drawAlien(e) {
  const colors = ['#ff44cc', '#ff4488', '#ff8844'];
  const c = colors[e.row];
  ctx.fillStyle = c;
  ctx.shadowBlur = 4; ctx.shadowColor = c;
  ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);   // cuerpo
  ctx.fillRect(e.x + 6, e.y,     4, 6);                  // antena izq
  ctx.fillRect(e.x + e.w - 10, e.y, 4, 6);               // antena der
  ctx.fillRect(e.x, e.y + e.h - 6, 8, 6);                // pata izq
  ctx.fillRect(e.x + e.w - 8, e.y + e.h - 6, 8, 6);     // pata der
  ctx.shadowBlur = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jugador (parpadea en invencibilidad)
  if (!player.hit || Math.floor(frameCount / 5) % 2 === 0) {
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88';
    ctx.fillRect(player.x + 8, player.y + 8, player.w - 16, player.h - 8);  // base
    ctx.fillRect(player.x + player.w/2 - 3, player.y, 6, 10);                // cañón
    ctx.fillRect(player.x, player.y + 12, 10, 8);                             // ala izq
    ctx.fillRect(player.x + player.w - 10, player.y + 12, 10, 8);            // ala der
    ctx.shadowBlur = 0;
  }

  // Bala jugador
  if (bullet) {
    ctx.fillStyle = '#ffff00'; ctx.shadowBlur = 6; ctx.shadowColor = '#ffff00';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    ctx.shadowBlur = 0;
  }

  // Balas enemigas
  ctx.fillStyle = '#ff6600';
  enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

  // Enemigos
  enemies.forEach(e => { if (e.alive) drawAlien(e); });
}

// ---- Loop ----
function loop() {
  update(); draw();
  if (running) requestAnimationFrame(loop);
}

// ---- Game Over ----
function gameOver() {
  running = false;
  overlayMsg.innerHTML = `💀 GAME OVER<br><br>Puntuación: <strong>${score}</strong><br><br>Pulsa <strong>ENTER</strong> para reintentar`;
  btnStart.textContent = 'REINTENTAR';
  overlay.classList.add('visible');
}

// ---- Start ----
function startGame() {
  score = 0; lives = 3; level = 1;
  scoreEl.textContent = 0; livesEl.textContent = 3; levelEl.textContent = 1;
  bullet = null; enemyBullets.length = 0;
  invincibleTimer = 0; frameCount = 0; enemyShootTimer = 0;
  player.x = canvas.width / 2 - player.w / 2;
  player.hit = false;
  spawnEnemies();
  overlay.classList.remove('visible');
  running = true;
  loop();
}

draw();

// ---- Controles táctiles ----
function addTouchBtn(id, onStart, onEnd) {
  const btn = document.getElementById(id);
  if (!btn) return;
  ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, e => { e.preventDefault(); initAudio(); onStart(); }, { passive: false }));
  ['touchend','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, e => { e.preventDefault(); onEnd(); }, { passive: false }));
}
addTouchBtn('btn-left',  () => keys['ArrowLeft'] = true,  () => keys['ArrowLeft'] = false);
addTouchBtn('btn-right', () => keys['ArrowRight'] = true, () => keys['ArrowRight'] = false);
addTouchBtn('btn-fire',  () => shoot(), () => {});
