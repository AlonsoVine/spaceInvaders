// =====================
//  Space Invaders v2.0
// =====================

const canvas    = document.getElementById('gameCanvas');
const ctx       = canvas.getContext('2d');
const scoreEl   = document.getElementById('score');
const livesEl   = document.getElementById('lives');
const levelEl   = document.getElementById('level');
const highscoreEl = document.getElementById('highscore');
const overlay   = document.getElementById('overlay');
const overlayMsg = document.getElementById('overlay-msg');
const btnStart  = document.getElementById('btn-start');

// ---- Récord ----
let highscore = parseInt(localStorage.getItem('si_hs') || '0');
highscoreEl.textContent = highscore;

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
function soundHit()   { beep(180, 0.12, 'sawtooth', 0.18); }
function soundDeath() { beep(150, 0.3, 'sawtooth', 0.2); setTimeout(() => beep(90, 0.35, 'sawtooth', 0.18), 160); }
function soundWin()   { [523,659,784,1047].forEach((f,i) => setTimeout(() => beep(f, 0.15, 'sine', 0.2), i*120)); }
let ufoBeepPhase = 0;
function soundUfo() {
  if (frameCount % 30 !== 0) return;
  const freqs = [330, 220];
  beep(freqs[ufoBeepPhase % 2], 0.18, 'sine', 0.06);
  ufoBeepPhase++;
}

// Ritmo del heartbeat (se acelera con menos enemigos)
let heartbeatTimer = 0;
const HEARTBEAT_NOTES = [160, 130, 100, 80];
let heartbeatIdx = 0;
function tickHeartbeat(aliveCount) {
  heartbeatTimer++;
  const interval = Math.max(8, Math.round(30 * (aliveCount / (COLS * ROWS))));
  if (heartbeatTimer >= interval) {
    heartbeatTimer = 0;
    beep(HEARTBEAT_NOTES[heartbeatIdx % 4], 0.04, 'square', 0.06);
    heartbeatIdx++;
  }
}

// ---- Estado ----
let score, lives, level, running, invincibleTimer, frameCount;
let showingLevelScreen = false;
let levelScreenTimer = 0;
const LEVEL_SCREEN_DURATION = 120;

// ---- Jugador ----
const player = { x: 0, y: canvas.height - 60, w: 40, h: 20, speed: 5, hit: false };

// ---- Teclas ----
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Enter' && !running && !showingLevelScreen) { initAudio(); startGame(); }
  if (e.code === 'Space') { e.preventDefault(); shoot(); }
  if ((e.code === 'KeyP' || e.code === 'Escape') && running) { e.preventDefault(); togglePause(); }
});
document.addEventListener('keyup', e => keys[e.code] = false);
btnStart.addEventListener('click', () => { initAudio(); startGame(); });

// ---- Bala jugador ----
let bullet = null;
function shoot() {
  if (!running || bullet || showingLevelScreen) return;
  bullet = { x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 14, speed: 9 };
  soundShoot();
}

// ---- Balas enemigas ----
const enemyBullets = [];
let enemyShootTimer = 0;

function getEnemyShootInterval() {
  return Math.max(40, 110 - (level - 1) * 10);
}

// ---- Explosiones y textos flotantes ----
const explosions = [];
const floatingTexts = [];
function spawnExplosion(x, y) {
  explosions.push({ x, y, timer: 20, maxTimer: 20 });
}
function spawnFloatingText(x, y, text, color) {
  floatingTexts.push({ x, y, text, color, timer: 50, maxTimer: 50 });
}

// ---- UFO ----
const ufo = { active: false, x: 0, y: 28, w: 50, h: 20, speed: 2, dir: 1, timer: 0 };
let ufoSpawnTimer = 0;
const UFO_SPAWN_INTERVAL = 700;

// ---- Escudos ----
const shields = [];
const SHIELD_COLS = 4;
function buildShields() {
  shields.length = 0;
  const shieldW = 60, shieldH = 40, blockSize = 6;
  const positions = [80, 220, 360, 500];
  for (const sx of positions) {
    const sy = canvas.height - 130;
    // Forma de búnker: matriz de bloques con hueco en el centro-bajo
    for (let r = 0; r < shieldH / blockSize; r++) {
      for (let c = 0; c < shieldW / blockSize; c++) {
        // Hueco en la parte inferior-centro (entrada del búnker)
        const isGap = r >= 4 && c >= 3 && c <= 6;
        if (!isGap) {
          shields.push({ x: sx + c * blockSize, y: sy + r * blockSize, w: blockSize, h: blockSize, alive: true });
        }
      }
    }
  }
}

// ---- Enemigos ----
const enemies = [];
let enemyDir = 1;
const ENEMY_STEP_X = 10;
const ENEMY_STEP_Y = 20;
let enemyTickTimer = 0;
let pendingDrop = false;
let enemyAnimFrame = 0;

const COLS = 8, ROWS = 3;
const E_W = 36, E_H = 24;
const MARGIN_X = 55, MARGIN_Y = 65, GAP_X = 74, GAP_Y = 52;
const TOTAL_ENEMIES = COLS * ROWS;

function getEnemyTickInterval() {
  const alive = enemies.filter(e => e.alive).length;
  const base = Math.max(4, 26 - (level - 1) * 2);
  return Math.max(3, Math.round(base * (alive / TOTAL_ENEMIES)));
}

function getStartY() {
  // Cada nivel los enemigos empiezan más abajo (hasta un máximo)
  return Math.min(65 + (level - 1) * 15, 140);
}

function spawnEnemies() {
  enemies.length = 0;
  const startY = getStartY();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      enemies.push({ x: MARGIN_X + c * GAP_X, y: startY + r * GAP_Y, w: E_W, h: E_H, alive: true, row: r, pose: 0 });
    }
  }
  enemyDir = 1;
  enemyTickTimer = 0;
  pendingDrop = false;
  enemyAnimFrame = 0;
}

// ---- Update ----
function update() {
  frameCount++;

  // Pantalla de nivel
  if (showingLevelScreen) {
    levelScreenTimer++;
    if (levelScreenTimer >= LEVEL_SCREEN_DURATION) {
      showingLevelScreen = false;
      spawnEnemies();
      buildShields();
      enemyBullets.length = 0;
    }
    return;
  }

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
      // Colisión con enemigos
      let hit = false;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (rectsOverlap(bullet, e)) {
          e.alive = false; bullet = null; hit = true;
          score += e.row === 0 ? 30 : e.row === 1 ? 20 : 10;
          scoreEl.textContent = score;
          if (score > highscore) { highscore = score; highscoreEl.textContent = highscore; localStorage.setItem('si_hs', highscore); }
          spawnExplosion(e.x + e.w/2, e.y + e.h/2);
          const pts = e.row === 0 ? 30 : e.row === 1 ? 20 : 10;
          spawnFloatingText(e.x + e.w/2, e.y, '+' + pts, '#ffff00');
          soundHit();
          break;
        }
      }
      // Colisión con UFO
      if (!hit && bullet && ufo.active && rectsOverlap(bullet, ufo)) {
        score += 150; scoreEl.textContent = score;
        if (score > highscore) { highscore = score; highscoreEl.textContent = highscore; localStorage.setItem('si_hs', highscore); }
        spawnExplosion(ufo.x + ufo.w/2, ufo.y + ufo.h/2);
        spawnFloatingText(ufo.x + ufo.w/2, ufo.y, '+150', '#ff66cc');
        ufo.active = false; bullet = null; soundHit();
        hit = true;
      }
      // Colisión con escudos
      if (!hit && bullet) {
        for (const s of shields) {
          if (!s.alive) continue;
          if (rectsOverlap(bullet, s)) { s.alive = false; bullet = null; break; }
        }
      }
    }
  }

  const alive = enemies.filter(e => e.alive);

  // Victoria de nivel
  if (alive.length === 0) {
    level++; levelEl.textContent = level;
    soundWin();
    showingLevelScreen = true;
    levelScreenTimer = 0;
    return;
  }

  // Heartbeat
  tickHeartbeat(alive.length);

  // Paso de enemigos
  enemyTickTimer++;
  if (enemyTickTimer >= getEnemyTickInterval()) {
    enemyTickTimer = 0;
    enemyAnimFrame++;
    if (pendingDrop) {
      enemies.forEach(e => { if (e.alive) e.y += ENEMY_STEP_Y; });
      enemyDir *= -1;
      pendingDrop = false;
    } else {
      enemies.forEach(e => { if (e.alive) { e.x += enemyDir * ENEMY_STEP_X; e.pose = enemyAnimFrame % 2; } });
      const leftmost  = Math.min(...alive.map(e => e.x));
      const rightmost = Math.max(...alive.map(e => e.x + e.w));
      if (rightmost >= canvas.width - 8 || leftmost <= 8) pendingDrop = true;
    }
  }

  // Enemigos al suelo
  if (alive.some(e => e.y + e.h >= player.y)) triggerDeath();

  // Disparos enemigos
  enemyShootTimer++;
  if (enemyShootTimer >= getEnemyShootInterval()) {
    enemyShootTimer = 0;
    const cols = {};
    for (const e of alive) {
      const col = Math.round(e.x / GAP_X);
      if (!cols[col] || e.y > cols[col].y) cols[col] = e;
    }
    const shooters = Object.values(cols);
    if (shooters.length) {
      const s = shooters[Math.floor(Math.random() * shooters.length)];
      enemyBullets.push({ x: s.x + s.w/2 - 2, y: s.y + s.h, w: 4, h: 12, speed: 4 + (level-1)*0.5 });
    }
  }

  // Balas enemigas
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.y += b.speed;
    if (b.y > canvas.height) { enemyBullets.splice(i, 1); continue; }
    // Colisión con escudos
    let blocked = false;
    for (const s of shields) {
      if (!s.alive) continue;
      if (rectsOverlap(b, s)) { s.alive = false; enemyBullets.splice(i, 1); blocked = true; break; }
    }
    if (blocked) continue;
    if (invincibleTimer === 0 && rectsOverlap(b, player)) {
      enemyBullets.splice(i, 1); triggerDeath();
    }
  }

  // UFO
  ufoSpawnTimer++;
  if (!ufo.active && ufoSpawnTimer >= UFO_SPAWN_INTERVAL) {
    ufoSpawnTimer = 0;
    ufo.active = true;
    ufo.dir = Math.random() < 0.5 ? 1 : -1;
    ufo.x = ufo.dir === 1 ? -ufo.w : canvas.width;
  }
  if (ufo.active) {
    ufo.x += ufo.dir * ufo.speed;
    soundUfo();
    if (ufo.x > canvas.width + ufo.w || ufo.x < -ufo.w * 2) ufo.active = false;
  }

  // Textos flotantes
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].timer--;
    floatingTexts[i].y -= 0.5;
    if (floatingTexts[i].timer <= 0) floatingTexts.splice(i, 1);
  }

  // Explosiones
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].timer--;
    if (explosions[i].timer <= 0) explosions.splice(i, 1);
  }
}

let paused = false;
function togglePause() {
  if (!running) return;
  paused = !paused;
  if (!paused) loop();
}

function triggerDeath() {
  lives--; livesEl.textContent = lives;
  soundDeath();
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
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
  if (e.pose === 0) {
    // Pose A
    ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);
    ctx.fillRect(e.x + 6, e.y, 4, 6);
    ctx.fillRect(e.x + e.w - 10, e.y, 4, 6);
    ctx.fillRect(e.x, e.y + e.h - 6, 8, 6);
    ctx.fillRect(e.x + e.w - 8, e.y + e.h - 6, 8, 6);
  } else {
    // Pose B (ligeramente diferente)
    ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);
    ctx.fillRect(e.x + 8, e.y, 4, 8);
    ctx.fillRect(e.x + e.w - 12, e.y, 4, 8);
    ctx.fillRect(e.x + 2, e.y + e.h - 4, 8, 4);
    ctx.fillRect(e.x + e.w - 10, e.y + e.h - 4, 8, 4);
  }
  ctx.shadowBlur = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Pantalla de nivel
  if (showingLevelScreen) {
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 20; ctx.shadowColor = '#00ff88';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`— NIVEL ${level} —`, canvas.width/2, canvas.height/2 - 20);
    ctx.font = '18px Courier New';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Prepárate...', canvas.width/2, canvas.height/2 + 20);
    ctx.shadowBlur = 0; ctx.textAlign = 'left';
    return;
  }

  // Escudos
  ctx.fillStyle = '#00cc44';
  shields.forEach(s => { if (s.alive) ctx.fillRect(s.x, s.y, s.w, s.h); });

  // Jugador
  if (!player.hit || Math.floor(frameCount / 5) % 2 === 0) {
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88';
    ctx.fillRect(player.x + 8, player.y + 8, player.w - 16, player.h - 8);
    ctx.fillRect(player.x + player.w/2 - 3, player.y, 6, 10);
    ctx.fillRect(player.x, player.y + 12, 10, 8);
    ctx.fillRect(player.x + player.w - 10, player.y + 12, 10, 8);
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

  // UFO
  if (ufo.active) {
    ctx.fillStyle = '#ff0066';
    ctx.shadowBlur = 8; ctx.shadowColor = '#ff0066';
    ctx.fillRect(ufo.x + 10, ufo.y + 6, ufo.w - 20, ufo.h - 10);
    ctx.fillRect(ufo.x, ufo.y + 12, ufo.w, 8);
    ctx.fillRect(ufo.x + ufo.w/2 - 6, ufo.y, 12, 8);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffaacc';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('150', ufo.x + ufo.w/2, ufo.y - 2);
    ctx.textAlign = 'left';
  }

  // Textos flotantes
  for (const ft of floatingTexts) {
    const ratio = ft.timer / ft.maxTimer;
    ctx.globalAlpha = ratio;
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  // Explosiones
  for (const ex of explosions) {
    const ratio = ex.timer / ex.maxTimer;
    const size = (1 - ratio) * 30 + 6;
    ctx.fillStyle = `rgba(255, ${Math.floor(200 * ratio)}, 0, ${ratio})`;
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff8800';
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, size/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ---- Loop ----
function loop() {
  if (paused) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 40px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width/2, canvas.height/2);
    ctx.font = '16px Courier New';
    ctx.fillStyle = '#aaa';
    ctx.fillText('P o ESC para continuar', canvas.width/2, canvas.height/2 + 40);
    ctx.textAlign = 'left';
    return;
  }
  update(); draw();
  if (running) requestAnimationFrame(loop);
}

// ---- Game Over ----
function gameOver() {
  running = false;
  overlayMsg.innerHTML = `💀 GAME OVER<br><br>Puntuación: <strong>${score}</strong> &nbsp;|&nbsp; Récord: <strong>${highscore}</strong><br><br>Pulsa <strong>ENTER</strong> para reintentar`;
  btnStart.textContent = 'REINTENTAR';
  overlay.classList.add('visible');
}

// ---- Start ----
function startGame() {
  score = 0; lives = 3; level = 1;
  scoreEl.textContent = 0; livesEl.textContent = 3; levelEl.textContent = 1;
  bullet = null; enemyBullets.length = 0; explosions.length = 0; floatingTexts.length = 0; paused = false;
  invincibleTimer = 0; frameCount = 0; enemyShootTimer = 0;
  ufo.active = false; ufoSpawnTimer = 0;
  heartbeatTimer = 0; heartbeatIdx = 0;
  showingLevelScreen = false;
  player.x = canvas.width / 2 - player.w / 2;
  player.hit = false;
  spawnEnemies();
  buildShields();
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
