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
const btnMusic = document.getElementById('btn-music');
const btnFullscreen = document.getElementById('btn-fullscreen');
const musicVolumeEl = document.getElementById('music-volume');
const fullscreenTarget = document.body;

// ---- Récord e historial ----
let highscore = parseInt(localStorage.getItem('si_hs') || '0');
highscoreEl.textContent = highscore;
let scoreHistory = JSON.parse(localStorage.getItem('si_history') || '[]');

function saveScore(s) {
  scoreHistory.unshift(s);
  scoreHistory = scoreHistory.slice(0, 5);
  localStorage.setItem('si_history', JSON.stringify(scoreHistory));
  if (s > highscore) {
    highscore = s;
    highscoreEl.textContent = highscore;
    localStorage.setItem('si_hs', highscore);
  }
}

// ---- Audio ----
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let musicGain = null;
let musicLoop = null;
let musicStep = 0;
let musicEnabled = localStorage.getItem('si_music_enabled');
musicEnabled = musicEnabled === null ? true : musicEnabled === '1';
let musicVolume = parseFloat(localStorage.getItem('si_music_volume') || '0.35');
musicVolume = Number.isFinite(musicVolume) ? Math.min(0.6, Math.max(0, musicVolume)) : 0.35;

const NOTES = {
  C3: 130.81, E3: 164.81, G3: 196.00, A3: 220.00,
  C4: 261.63, E4: 329.63, G4: 392.00, A4: 440.00,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
};

const MUSIC_BASS = [
  NOTES.C3, null, NOTES.C3, null,
  NOTES.G3, null, NOTES.G3, null,
  NOTES.A3, null, NOTES.A3, null,
  NOTES.G3, null, NOTES.E3, null
];

const MUSIC_MELODY = [
  NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5,
  NOTES.G4, NOTES.E4, NOTES.C4, NOTES.D5,
  NOTES.E4, NOTES.G4, NOTES.A4, NOTES.G4,
  NOTES.E4, NOTES.C4, NOTES.G4, NOTES.E4
];

function updateMusicUI() {
  btnMusic.textContent = `MUSICA: ${musicEnabled ? 'ON' : 'OFF'}`;
  musicVolumeEl.value = musicVolume.toFixed(2);
}

function updateFullscreenUI() {
  btnFullscreen.textContent = document.fullscreenElement ? 'SALIR FS' : 'FULLSCREEN';
}

function persistMusicSettings() {
  localStorage.setItem('si_music_enabled', musicEnabled ? '1' : '0');
  localStorage.setItem('si_music_volume', musicVolume.toFixed(2));
}

function ensureMusicBus() {
  if (!audioCtx) return;
  if (!musicGain) {
    musicGain = audioCtx.createGain();
    musicGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    musicGain.connect(audioCtx.destination);
  }
  if (!musicLoop) {
    musicLoop = setInterval(() => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      tickMusic();
    }, 190);
  }
  syncMusicGain();
}

function syncMusicGain() {
  if (!audioCtx || !musicGain) return;
  const now = audioCtx.currentTime;
  const target = musicEnabled ? Math.max(0.0001, musicVolume) : 0.0001;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setValueAtTime(musicGain.gain.value || 0.0001, now);
  musicGain.gain.linearRampToValueAtTime(target, now + 0.12);
}

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  ensureMusicBus();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

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
  beep([330,220][ufoBeepPhase++ % 2], 0.18, 'sine', 0.06);
}

function playMusicNote(freq, duration, type, vol) {
  if (!audioCtx || !musicGain || !musicEnabled || !freq) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;
  osc.connect(gain); gain.connect(musicGain);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

function tickMusic() {
  if (!running || paused || showingLevelScreen || !musicEnabled) return;
  const step = musicStep % MUSIC_MELODY.length;
  playMusicNote(MUSIC_BASS[step], 0.28, 'triangle', 0.12);
  playMusicNote(MUSIC_MELODY[step], 0.18, step % 4 === 3 ? 'square' : 'sine', 0.07);
  musicStep++;
}

// Heartbeat
let heartbeatTimer = 0, heartbeatIdx = 0;
const HEARTBEAT_NOTES = [160, 130, 100, 80];
function tickHeartbeat(aliveCount) {
  heartbeatTimer++;
  const interval = Math.max(6, Math.round(30 * (aliveCount / TOTAL_ENEMIES)));
  if (heartbeatTimer >= interval) {
    heartbeatTimer = 0;
    beep(HEARTBEAT_NOTES[heartbeatIdx++ % 4], 0.04, 'square', 0.06);
  }
}

// ---- Estado ----
let score, lives, level, running, invincibleTimer, frameCount;
let showingLevelScreen = false, levelScreenTimer = 0;
let paused = false;
let combo = 0, comboTimer = 0;
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
btnMusic.addEventListener('click', () => {
  initAudio();
  musicEnabled = !musicEnabled;
  persistMusicSettings();
  updateMusicUI();
  syncMusicGain();
});
btnFullscreen.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) {
      await fullscreenTarget.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.warn('No se pudo cambiar el modo fullscreen', err);
  } finally {
    updateFullscreenUI();
  }
});
musicVolumeEl.addEventListener('input', e => {
  initAudio();
  musicVolume = Math.min(0.6, Math.max(0, parseFloat(e.target.value) || 0));
  persistMusicSettings();
  updateMusicUI();
  syncMusicGain();
});
document.addEventListener('fullscreenchange', updateFullscreenUI);

// ---- Bala jugador ----
let bullet = null;
// Disparo automático en móvil: si se mueve y no hay bala, dispara cada 30 frames
let autoShootTimer = 0;
function shoot() {
  if (!running || bullet || showingLevelScreen || paused) return;
  bullet = { x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 14, speed: 9 };
  soundShoot();
}

// ---- Balas enemigas ----
const enemyBullets = [];
let enemyShootTimer = 0;
function getEnemyShootInterval() { return Math.max(40, 110 - (level-1)*10); }

// ---- Explosiones y textos flotantes ----
const explosions = [], floatingTexts = [];
function spawnExplosion(x, y) { explosions.push({ x, y, timer: 20, maxTimer: 20 }); }
function spawnFloatingText(x, y, text, color) { floatingTexts.push({ x, y, text, color, timer: 50, maxTimer: 50 }); }

// ---- UFO ----
const ufo = { active: false, x: 0, y: 28, w: 50, h: 20, speed: 2, dir: 1 };
let ufoSpawnTimer = 0;
const UFO_SPAWN_INTERVAL = 700;

// ---- Escudos ----
const shields = [];
function buildShields() {
  shields.length = 0;
  const W = canvas.width, blockSize = 6;
  const shieldW = 60, shieldH = 40;
  const gap = (W - 4 * shieldW) / 5;
  for (let i = 0; i < 4; i++) {
    const sx = gap + i * (shieldW + gap);
    const sy = canvas.height - 130;
    for (let r = 0; r < shieldH/blockSize; r++) {
      for (let c = 0; c < shieldW/blockSize; c++) {
        if (!(r >= 4 && c >= 3 && c <= 6))
          shields.push({ x: sx + c*blockSize, y: sy + r*blockSize, w: blockSize, h: blockSize, alive: true });
      }
    }
  }
}

// ---- Enemigos ----
const enemies = [];
let enemyDir = 1;
const ENEMY_STEP_X = 10, ENEMY_STEP_Y = 20;
let enemyTickTimer = 0, pendingDrop = false, enemyAnimFrame = 0;

const COLS = 8, ROWS = 3;
const E_W = 34, E_H = 22;
const TOTAL_ENEMIES = COLS * ROWS;

function getEnemyLayout() {
  const W = canvas.width;
  const totalW = COLS * E_W;
  const gapX = Math.floor((W - totalW - 20) / (COLS - 1));
  const marginX = 10;
  const startY = Math.min(65 + (level-1)*15, 140);
  const gapY = 46;
  return { marginX, gapX, gapY, startY };
}

function getEnemyTickInterval() {
  const alive = enemies.filter(e => e.alive).length;
  const base = Math.max(4, 26 - (level-1)*2);
  return Math.max(3, Math.round(base * (alive / TOTAL_ENEMIES)));
}

function spawnEnemies() {
  enemies.length = 0;
  const { marginX, gapX, gapY, startY } = getEnemyLayout();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      enemies.push({ x: marginX + c*(E_W+gapX), y: startY + r*(E_H+gapY), w: E_W, h: E_H, alive: true, row: r, pose: 0 });
  enemyDir = 1; enemyTickTimer = 0; pendingDrop = false; enemyAnimFrame = 0;
}

// ---- Update ----
function update() {
  frameCount++;

  // Pantalla entre niveles
  if (showingLevelScreen) {
    levelScreenTimer++;
    if (levelScreenTimer >= LEVEL_SCREEN_DURATION) {
      showingLevelScreen = false;
      spawnEnemies(); buildShields();
      enemyBullets.length = 0;
    }
    return;
  }

  // Jugador
  const moving = keys['ArrowLeft'] || keys['ArrowRight'];
  if (keys['ArrowLeft']  && player.x > 0)                       player.x -= player.speed;
  if (keys['ArrowRight'] && player.x + player.w < canvas.width) player.x += player.speed;

  // Disparo automático en móvil (si está moviendo con botones táctiles)
  if (window._touchActive && moving) {
    autoShootTimer++;
    if (autoShootTimer >= 28) { autoShootTimer = 0; shoot(); }
  } else {
    autoShootTimer = 0;
  }

  // Combo decay
  if (comboTimer > 0) { comboTimer--; if (comboTimer === 0) combo = 0; }

  if (invincibleTimer > 0) invincibleTimer--;

  // Bala jugador
  if (bullet) {
    bullet.y -= bullet.speed;
    if (bullet.y + bullet.h < 0) { bullet = null; }
    else {
      let hit = false;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (rectsOverlap(bullet, e)) {
          e.alive = false; bullet = null; hit = true;
          combo++; comboTimer = 90;
          const pts = (e.row === 0 ? 30 : e.row === 1 ? 20 : 10) * (combo > 1 ? combo : 1);
          score += pts; scoreEl.textContent = score;
          if (score > highscore) { highscore = score; highscoreEl.textContent = highscore; localStorage.setItem('si_hs', highscore); }
          spawnExplosion(e.x + e.w/2, e.y + e.h/2);
          spawnFloatingText(e.x + e.w/2, e.y, (combo > 1 ? `x${combo} ` : '') + '+' + pts, combo > 1 ? '#ff8800' : '#ffff00');
          soundHit(); break;
        }
      }
      if (!hit && bullet && ufo.active && rectsOverlap(bullet, ufo)) {
        score += 150; scoreEl.textContent = score;
        if (score > highscore) { highscore = score; highscoreEl.textContent = highscore; localStorage.setItem('si_hs', highscore); }
        spawnExplosion(ufo.x + ufo.w/2, ufo.y + ufo.h/2);
        spawnFloatingText(ufo.x + ufo.w/2, ufo.y, '+150', '#ff66cc');
        ufo.active = false; bullet = null; soundHit(); hit = true;
      }
      if (!hit && bullet) {
        for (const s of shields) {
          if (!s.alive) continue;
          if (rectsOverlap(bullet, s)) { s.alive = false; bullet = null; break; }
        }
      }
    }
  }

  const alive = enemies.filter(e => e.alive);
  if (alive.length === 0) {
    level++; levelEl.textContent = level;
    soundWin(); showingLevelScreen = true; levelScreenTimer = 0; return;
  }

  tickHeartbeat(alive.length);

  // Movimiento enemigos
  enemyTickTimer++;
  if (enemyTickTimer >= getEnemyTickInterval()) {
    enemyTickTimer = 0; enemyAnimFrame++;
    if (pendingDrop) {
      enemies.forEach(e => { if (e.alive) e.y += ENEMY_STEP_Y; });
      enemyDir *= -1; pendingDrop = false;
    } else {
      enemies.forEach(e => { if (e.alive) { e.x += enemyDir * ENEMY_STEP_X; e.pose = enemyAnimFrame % 2; } });
      const lx = Math.min(...alive.map(e => e.x));
      const rx = Math.max(...alive.map(e => e.x + e.w));
      if (rx >= canvas.width - 8 || lx <= 8) pendingDrop = true;
    }
  }

  if (alive.some(e => e.y + e.h >= player.y)) triggerDeath();

  // Disparos enemigos
  enemyShootTimer++;
  if (enemyShootTimer >= getEnemyShootInterval()) {
    enemyShootTimer = 0;
    const cols = {};
    for (const e of alive) {
      const col = Math.round(e.x / (E_W + 10));
      if (!cols[col] || e.y > cols[col].y) cols[col] = e;
    }
    const shooters = Object.values(cols);
    if (shooters.length) {
      const s = shooters[Math.floor(Math.random() * shooters.length)];
      enemyBullets.push({ x: s.x + s.w/2 - 2, y: s.y + s.h, w: 4, h: 12, speed: 4 + (level-1)*0.5 });
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.y += b.speed;
    if (b.y > canvas.height) { enemyBullets.splice(i, 1); continue; }
    let blocked = false;
    for (const s of shields) {
      if (!s.alive) continue;
      if (rectsOverlap(b, s)) { s.alive = false; enemyBullets.splice(i, 1); blocked = true; break; }
    }
    if (blocked) continue;
    if (invincibleTimer === 0 && rectsOverlap(b, player)) { enemyBullets.splice(i, 1); triggerDeath(); }
  }

  // UFO
  ufoSpawnTimer++;
  if (!ufo.active && ufoSpawnTimer >= UFO_SPAWN_INTERVAL) {
    ufoSpawnTimer = 0; ufo.active = true;
    ufo.dir = Math.random() < 0.5 ? 1 : -1;
    ufo.x = ufo.dir === 1 ? -ufo.w : canvas.width;
  }
  if (ufo.active) {
    ufo.x += ufo.dir * ufo.speed; soundUfo();
    if (ufo.x > canvas.width + ufo.w || ufo.x < -ufo.w*2) ufo.active = false;
  }

  for (let i = floatingTexts.length-1; i >= 0; i--) {
    floatingTexts[i].timer--; floatingTexts[i].y -= 0.5;
    if (floatingTexts[i].timer <= 0) floatingTexts.splice(i, 1);
  }
  for (let i = explosions.length-1; i >= 0; i--) {
    explosions[i].timer--;
    if (explosions[i].timer <= 0) explosions.splice(i, 1);
  }
}

function togglePause() {
  if (!running) return;
  paused = !paused;
  if (!paused) loop();
}

function triggerDeath() {
  lives--; livesEl.textContent = lives;
  soundDeath();
  if (navigator.vibrate) navigator.vibrate([100,50,100]);
  combo = 0; comboTimer = 0;
  if (lives <= 0) return gameOver();
  invincibleTimer = 120; player.hit = true;
  setTimeout(() => { player.hit = false; }, 2000);
}

function rectsOverlap(a, b) {
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

// ---- Draw ----
function drawAlien(e) {
  const colors = ['#ff44cc','#4488ff','#ff8844'];
  const c = colors[e.row];
  ctx.fillStyle = c; ctx.shadowBlur = 4; ctx.shadowColor = c;
  if (e.pose === 0) {
    ctx.fillRect(e.x+4, e.y+4, e.w-8, e.h-8);
    ctx.fillRect(e.x+6, e.y, 4, 6); ctx.fillRect(e.x+e.w-10, e.y, 4, 6);
    ctx.fillRect(e.x, e.y+e.h-6, 8, 6); ctx.fillRect(e.x+e.w-8, e.y+e.h-6, 8, 6);
  } else {
    ctx.fillRect(e.x+4, e.y+4, e.w-8, e.h-8);
    ctx.fillRect(e.x+8, e.y, 4, 8); ctx.fillRect(e.x+e.w-12, e.y, 4, 8);
    ctx.fillRect(e.x+2, e.y+e.h-4, 8, 4); ctx.fillRect(e.x+e.w-10, e.y+e.h-4, 8, 4);
  }
  ctx.shadowBlur = 0;
}

function drawLives() {
  // Iconitos de nave en lugar de número
  const iconW = 18, iconH = 10, gap = 6;
  let lx = canvas.width - (lives * (iconW + gap)) - 4;
  for (let i = 0; i < lives; i++) {
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(lx+4, lx > 0 ? player.y + 8 : 0, iconW-8, iconH-4);
    ctx.fillRect(lx + iconW/2 - 2, lx > 0 ? player.y : 0, 4, 6);
    lx += iconW + gap;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (showingLevelScreen) {
    ctx.fillStyle = '#00ff88'; ctx.shadowBlur = 20; ctx.shadowColor = '#00ff88';
    ctx.font = `bold ${Math.floor(canvas.width/20)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(`— NIVEL ${level} —`, canvas.width/2, canvas.height/2 - 20);
    ctx.font = `${Math.floor(canvas.width/40)}px Courier New`;
    ctx.fillStyle = '#aaa';
    ctx.fillText('Prepárate...', canvas.width/2, canvas.height/2 + 24);
    ctx.shadowBlur = 0; ctx.textAlign = 'left';
    return;
  }

  // Escudos
  ctx.fillStyle = '#00cc44';
  shields.forEach(s => { if (s.alive) ctx.fillRect(s.x, s.y, s.w, s.h); });

  // Jugador
  if (!player.hit || Math.floor(frameCount/5)%2 === 0) {
    ctx.fillStyle = '#00ff88'; ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88';
    ctx.fillRect(player.x+8, player.y+8, player.w-16, player.h-8);
    ctx.fillRect(player.x+player.w/2-3, player.y, 6, 10);
    ctx.fillRect(player.x, player.y+12, 10, 8);
    ctx.fillRect(player.x+player.w-10, player.y+12, 10, 8);
    ctx.shadowBlur = 0;
  }

  // Bala jugador
  if (bullet) {
    ctx.fillStyle = '#ffff00'; ctx.shadowBlur = 6; ctx.shadowColor = '#ffff00';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h); ctx.shadowBlur = 0;
  }

  // Balas enemigas
  ctx.fillStyle = '#ff6600';
  enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

  // Enemigos
  enemies.forEach(e => { if (e.alive) drawAlien(e); });

  // UFO
  if (ufo.active) {
    ctx.fillStyle = '#ff0066'; ctx.shadowBlur = 8; ctx.shadowColor = '#ff0066';
    ctx.fillRect(ufo.x+10, ufo.y+6, ufo.w-20, ufo.h-10);
    ctx.fillRect(ufo.x, ufo.y+12, ufo.w, 8);
    ctx.fillRect(ufo.x+ufo.w/2-6, ufo.y, 12, 8);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffaacc'; ctx.font = '10px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('150', ufo.x+ufo.w/2, ufo.y-2); ctx.textAlign = 'left';
  }

  // Textos flotantes
  for (const ft of floatingTexts) {
    ctx.globalAlpha = ft.timer / ft.maxTimer;
    ctx.fillStyle = ft.color;
    ctx.font = `bold ${Math.floor(canvas.width/55)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  }

  // Explosiones
  for (const ex of explosions) {
    const ratio = ex.timer / ex.maxTimer;
    ctx.fillStyle = `rgba(255,${Math.floor(200*ratio)},0,${ratio})`;
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff8800';
    ctx.beginPath(); ctx.arc(ex.x, ex.y, ((1-ratio)*30+6)/2, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Combo activo
  if (combo > 1 && comboTimer > 0) {
    ctx.globalAlpha = Math.min(1, comboTimer / 30);
    ctx.fillStyle = '#ff8800';
    ctx.font = `bold ${Math.floor(canvas.width/35)}px Courier New`;
    ctx.textAlign = 'right';
    ctx.fillText(`COMBO x${combo}`, canvas.width - 8, canvas.height - 8);
    ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  }
}

// ---- Loop ----
function loop() {
  if (paused) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#00ff88'; ctx.shadowBlur = 16; ctx.shadowColor = '#00ff88';
    ctx.font = `bold ${Math.floor(canvas.width/18)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText('⏸ PAUSA', canvas.width/2, canvas.height/2);
    ctx.font = `${Math.floor(canvas.width/45)}px Courier New`;
    ctx.fillStyle = '#aaa'; ctx.shadowBlur = 0;
    ctx.fillText('P o ESC para continuar', canvas.width/2, canvas.height/2+40);
    ctx.textAlign = 'left';
    return;
  }
  update(); draw();
  if (running) requestAnimationFrame(loop);
}

// ---- Game Over ----
function gameOver() {
  running = false;
  saveScore(score);
  const histHtml = scoreHistory.length > 1
    ? '<br><small style="color:#666">Últimas: ' + scoreHistory.join(' · ') + '</small>'
    : '';
  overlayMsg.innerHTML = `💀 GAME OVER<br><br>Puntuación: <strong>${score}</strong> &nbsp;|&nbsp; Récord: <strong>${highscore}</strong>${histHtml}<br><br>Pulsa <strong>ENTER</strong> para reintentar`;
  btnStart.textContent = 'REINTENTAR';
  overlay.classList.add('visible');
}

// ---- Start ----
function startGame() {
  score = 0; lives = 3; level = 1;
  scoreEl.textContent = 0; livesEl.textContent = 3; levelEl.textContent = 1;
  bullet = null; enemyBullets.length = 0; explosions.length = 0; floatingTexts.length = 0;
  paused = false; invincibleTimer = 0; frameCount = 0; enemyShootTimer = 0;
  ufo.active = false; ufoSpawnTimer = 0;
  heartbeatTimer = 0; heartbeatIdx = 0;
  combo = 0; comboTimer = 0; autoShootTimer = 0;
  showingLevelScreen = false;
  musicStep = 0;
  player.x = canvas.width/2 - player.w/2; player.hit = false;
  spawnEnemies(); buildShields();
  overlay.classList.remove('visible');
  running = true; loop();
}

updateMusicUI();
updateFullscreenUI();
draw();

// ---- Controles táctiles con disparo automático ----
window._touchActive = false;

function addTouchBtn(id, onStart, onEnd) {
  const btn = document.getElementById(id);
  if (!btn) return;
  ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, e => {
    e.preventDefault(); initAudio(); onStart();
  }, { passive: false }));
  ['touchend','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, e => {
    e.preventDefault(); onEnd();
  }, { passive: false }));
}

addTouchBtn('btn-left', () => { keys['ArrowLeft'] = true; window._touchActive = true; }, () => { keys['ArrowLeft'] = false; window._touchActive = !!(keys['ArrowRight']); });
addTouchBtn('btn-right', () => { keys['ArrowRight'] = true; window._touchActive = true; }, () => { keys['ArrowRight'] = false; window._touchActive = !!(keys['ArrowLeft']); });
addTouchBtn('btn-fire', () => shoot(), () => {});
