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
const overlayTitle = document.getElementById('overlay-title');
const overlayKicker = document.getElementById('overlay-kicker');
const overlayMsg = document.getElementById('overlay-msg');
const btnStart  = document.getElementById('btn-start');
const difficultySelect = document.getElementById('difficulty-select');
const vibrationToggle = document.getElementById('toggle-vibration');
const btnMusic = document.getElementById('btn-music');
const btnFullscreen = document.getElementById('btn-fullscreen');
const musicVolumeEl = document.getElementById('music-volume');
const fullscreenTarget = document.body;
const settingsPanel = document.getElementById('settings-panel');
const runPanel = document.getElementById('run-panel');
const runPanelTitle = document.getElementById('run-panel-title');
const runPanelBadge = document.getElementById('run-panel-badge');
const runStatsGridEl = document.getElementById('run-stats-grid');
const aggregatePanel = document.getElementById('aggregate-panel');
const historyPanel = document.getElementById('history-panel');
const statsSummaryEl = document.getElementById('stats-summary');
const statsHistoryEl = document.getElementById('stats-history');

// ---- Récord e historial ----
let highscore = parseInt(localStorage.getItem('si_hs') || '0');
highscoreEl.textContent = highscore;

// ---- Ajustes ----
const SETTINGS_KEY = 'si_settings';
const HISTORY_KEY = 'si_history';
const AGGREGATE_STATS_KEY = 'si_stats';
const DIFFICULTY_PRESETS = {
  easy:   { startLives: 4, playerSpeed: 5.8, enemyTickFactor: 1.18, enemyShootFactor: 1.18, enemyBulletBase: 3.4, enemyBulletStep: 0.45, ufoSpawnInterval: 820 },
  normal: { startLives: 3, playerSpeed: 5.0, enemyTickFactor: 1.00, enemyShootFactor: 1.00, enemyBulletBase: 4.0, enemyBulletStep: 0.50, ufoSpawnInterval: 700 },
  hard:   { startLives: 2, playerSpeed: 4.6, enemyTickFactor: 0.82, enemyShootFactor: 0.82, enemyBulletBase: 4.8, enemyBulletStep: 0.60, ufoSpawnInterval: 560 }
};

function normalizeDifficulty(value) {
  return Object.prototype.hasOwnProperty.call(DIFFICULTY_PRESETS, value) ? value : 'normal';
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return {
      difficulty: normalizeDifficulty(stored.difficulty),
      vibration: stored.vibration !== false
    };
  } catch {
    return { difficulty: 'normal', vibration: true };
  }
}

let gameSettings = loadSettings();

function normalizeHistoryEntry(entry) {
  if (typeof entry === 'number') {
    return {
      score: entry,
      level: 1,
      accuracy: 0,
      shots: 0,
      hits: 0,
      enemiesDestroyed: 0,
      ufoDestroyed: 0,
      maxCombo: 1,
      difficulty: 'normal',
      playedAt: null,
      durationMs: 0
    };
  }
  if (!entry || typeof entry !== 'object') return null;
  return {
    score: Number(entry.score) || 0,
    level: Number(entry.level) || 1,
    accuracy: Number(entry.accuracy) || 0,
    shots: Number(entry.shots) || 0,
    hits: Number(entry.hits) || 0,
    enemiesDestroyed: Number(entry.enemiesDestroyed) || 0,
    ufoDestroyed: Number(entry.ufoDestroyed) || 0,
    maxCombo: Math.max(1, Number(entry.maxCombo) || 1),
    difficulty: normalizeDifficulty(entry.difficulty),
    playedAt: typeof entry.playedAt === 'string' ? entry.playedAt : null,
    durationMs: Math.max(0, Number(entry.durationMs) || 0)
  };
}

function loadScoreHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.map(normalizeHistoryEntry).filter(Boolean).slice(0, 8);
  } catch {
    return [];
  }
}

function loadAggregateStats() {
  try {
    const stored = JSON.parse(localStorage.getItem(AGGREGATE_STATS_KEY) || '{}');
    return {
      gamesPlayed: Math.max(0, Number(stored.gamesPlayed) || 0),
      totalScore: Math.max(0, Number(stored.totalScore) || 0),
      totalShots: Math.max(0, Number(stored.totalShots) || 0),
      totalHits: Math.max(0, Number(stored.totalHits) || 0),
      totalEnemiesDestroyed: Math.max(0, Number(stored.totalEnemiesDestroyed) || 0),
      totalUfoDestroyed: Math.max(0, Number(stored.totalUfoDestroyed) || 0),
      bestLevel: Math.max(0, Number(stored.bestLevel) || 0),
      bestCombo: Math.max(1, Number(stored.bestCombo) || 1),
      totalTimeMs: Math.max(0, Number(stored.totalTimeMs) || 0)
    };
  } catch {
    return {
      gamesPlayed: 0,
      totalScore: 0,
      totalShots: 0,
      totalHits: 0,
      totalEnemiesDestroyed: 0,
      totalUfoDestroyed: 0,
      bestLevel: 0,
      bestCombo: 1,
      totalTimeMs: 0
    };
  }
}

let scoreHistory = loadScoreHistory();
let aggregateStats = loadAggregateStats();

function createRunStats() {
  return {
    startedAt: 0,
    shots: 0,
    hits: 0,
    enemiesDestroyed: 0,
    ufoDestroyed: 0,
    maxCombo: 1,
    difficulty: gameSettings.difficulty
  };
}

let currentRunStats = createRunStats();
let overlayMode = 'start';

function persistGameSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings));
}

function applySettingsUI() {
  difficultySelect.value = gameSettings.difficulty;
  vibrationToggle.checked = gameSettings.vibration;
}

function getDifficultyConfig() {
  return DIFFICULTY_PRESETS[gameSettings.difficulty] || DIFFICULTY_PRESETS.normal;
}

function getAccuracyPercent(shots, hits) {
  return shots > 0 ? Math.round((hits / shots) * 100) : 0;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatDifficultyLabel(value) {
  return value === 'easy' ? 'FACIL' : value === 'hard' ? 'DIFICIL' : 'NORMAL';
}

function formatPlayedAt(value) {
  if (!value) return 'sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'sin fecha';
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

function setPanelVisibility(panel, visible) {
  panel.hidden = !visible;
}

function renderRunStats(entry, mode = overlayMode) {
  const currentEntry = entry || {
    score: score || 0,
    level: level || 1,
    lives: lives || 0,
    shots: currentRunStats.shots,
    hits: currentRunStats.hits,
    enemiesDestroyed: currentRunStats.enemiesDestroyed,
    ufoDestroyed: currentRunStats.ufoDestroyed,
    maxCombo: currentRunStats.maxCombo,
    accuracy: getAccuracyPercent(currentRunStats.shots, currentRunStats.hits),
    difficulty: currentRunStats.difficulty || gameSettings.difficulty,
    durationMs: currentRunStats.startedAt ? Math.max(0, Date.now() - currentRunStats.startedAt) : 0
  };

  const stats = mode === 'pause'
    ? [
        ['Puntuacion', `${currentEntry.score} pts`, `Nivel ${currentEntry.level} · ${currentEntry.lives} vidas`],
        ['Precision', `${currentEntry.accuracy}%`, `${currentEntry.hits}/${currentEntry.shots} impactos`],
        ['Destruccion', `${currentEntry.enemiesDestroyed} enemigos`, `${currentEntry.ufoDestroyed} UFO · combo x${currentEntry.maxCombo}`],
        ['Sesion', formatDuration(currentEntry.durationMs), formatDifficultyLabel(currentEntry.difficulty)]
      ]
    : [
        ['Puntuacion final', `${currentEntry.score} pts`, `Nivel ${currentEntry.level} · ${formatDifficultyLabel(currentEntry.difficulty)}`],
        ['Precision', `${currentEntry.accuracy}%`, `${currentEntry.hits}/${currentEntry.shots} impactos`],
        ['Destruccion', `${currentEntry.enemiesDestroyed} enemigos`, `${currentEntry.ufoDestroyed} UFO · combo x${currentEntry.maxCombo}`],
        ['Duracion', formatDuration(currentEntry.durationMs), `Record ${highscore} pts`]
      ];

  runStatsGridEl.innerHTML = stats.map(([label, value, subvalue]) => (
    `<div class="run-stat"><span class="run-stat-label">${label}</span><strong class="run-stat-value">${value}</strong><span class="run-stat-subvalue">${subvalue}</span></div>`
  )).join('');
}

function saveAggregateStats() {
  localStorage.setItem(AGGREGATE_STATS_KEY, JSON.stringify(aggregateStats));
}

function saveScore(entry) {
  scoreHistory.unshift(entry);
  scoreHistory = scoreHistory.slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(scoreHistory));
  if (entry.score > highscore) {
    highscore = entry.score;
    highscoreEl.textContent = highscore;
    localStorage.setItem('si_hs', highscore);
  }
}

function updateAggregateStats(entry) {
  aggregateStats.gamesPlayed += 1;
  aggregateStats.totalScore += entry.score;
  aggregateStats.totalShots += entry.shots;
  aggregateStats.totalHits += entry.hits;
  aggregateStats.totalEnemiesDestroyed += entry.enemiesDestroyed;
  aggregateStats.totalUfoDestroyed += entry.ufoDestroyed;
  aggregateStats.bestLevel = Math.max(aggregateStats.bestLevel, entry.level);
  aggregateStats.bestCombo = Math.max(aggregateStats.bestCombo, entry.maxCombo);
  aggregateStats.totalTimeMs += entry.durationMs;
  saveAggregateStats();
}

function renderStatsPanel() {
  const globalAccuracy = getAccuracyPercent(aggregateStats.totalShots, aggregateStats.totalHits);
  statsSummaryEl.innerHTML = aggregateStats.gamesPlayed === 0
    ? '<div class="stats-empty">Todavia no hay partidas registradas.</div>'
    : [
        ['Partidas', aggregateStats.gamesPlayed],
        ['Puntos totales', aggregateStats.totalScore],
        ['Mejor nivel', aggregateStats.bestLevel],
        ['Mejor combo', `x${aggregateStats.bestCombo}`],
        ['Precision global', `${globalAccuracy}%`],
        ['Tiempo jugado', formatDuration(aggregateStats.totalTimeMs)]
      ].map(([label, value]) => `<div class="stats-line"><span>${label}</span><strong>${value}</strong></div>`).join('');

  statsHistoryEl.innerHTML = scoreHistory.length === 0
    ? '<div class="stats-empty">Aun no hay historial de partidas.</div>'
    : scoreHistory.slice(0, 5).map(entry => (
        `<div class="history-line"><span>${formatPlayedAt(entry.playedAt)} · ${formatDifficultyLabel(entry.difficulty)} · NIV ${entry.level}</span><strong>${entry.score} pts · ${entry.accuracy}%</strong></div>`
      )).join('');
}

function setOverlayMode(mode, entry = null) {
  overlayMode = mode;
  overlay.dataset.mode = mode;
  renderStatsPanel();

  if (mode === 'start') {
    overlayKicker.textContent = 'ARCADE SESSION';
    overlayTitle.textContent = 'SPACE INVADERS';
    overlayMsg.innerHTML = 'Pulsa <strong>ENTER</strong> o toca para empezar';
    btnStart.textContent = 'JUGAR';
    runPanelTitle.textContent = 'RESUMEN';
    runPanelBadge.textContent = 'PARTIDA';
    setPanelVisibility(settingsPanel, true);
    setPanelVisibility(runPanel, false);
    setPanelVisibility(aggregatePanel, false);
    setPanelVisibility(historyPanel, false);
  } else if (mode === 'pause') {
    overlayKicker.textContent = 'PARTIDA EN CURSO';
    overlayTitle.textContent = 'PAUSA';
    overlayMsg.innerHTML = 'Has detenido la partida. Revisa tu progreso y continua cuando quieras.';
    btnStart.textContent = 'CONTINUAR';
    runPanelTitle.textContent = 'PARTIDA ACTUAL';
    runPanelBadge.textContent = 'EN CURSO';
    renderRunStats(entry, mode);
    setPanelVisibility(settingsPanel, false);
    setPanelVisibility(runPanel, true);
    setPanelVisibility(aggregatePanel, true);
    setPanelVisibility(historyPanel, true);
  } else {
    overlayKicker.textContent = 'SESION FINALIZADA';
    overlayTitle.textContent = 'GAME OVER';
    overlayMsg.innerHTML = entry && entry.score >= highscore
      ? 'Has cerrado la partida con una gran marca. Revisa el resumen antes de volver a intentarlo.'
      : 'La partida ha terminado. Tienes el resumen y tu historial justo aqui, sin ruido extra.';
    btnStart.textContent = 'REINTENTAR';
    runPanelTitle.textContent = 'ULTIMA PARTIDA';
    runPanelBadge.textContent = 'FINAL';
    renderRunStats(entry, mode);
    setPanelVisibility(settingsPanel, false);
    setPanelVisibility(runPanel, true);
    setPanelVisibility(aggregatePanel, true);
    setPanelVisibility(historyPanel, true);
  }

  overlay.classList.add('visible');
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

function toggleMusic() {
  initAudio();
  musicEnabled = !musicEnabled;
  persistMusicSettings();
  updateMusicUI();
  syncMusicGain();
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

async function toggleFullscreen() {
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
  if (e.repeat && (e.code === 'KeyM' || e.code === 'KeyF')) return;
  keys[e.code] = true;
  if (e.code === 'Enter' && paused) { e.preventDefault(); togglePause(); }
  if (e.code === 'Enter' && !running && !showingLevelScreen) { initAudio(); startGame(); }
  if (e.code === 'Space') { e.preventDefault(); shoot(); }
  if ((e.code === 'KeyP' || e.code === 'Escape') && running) { e.preventDefault(); togglePause(); }
  if (e.code === 'KeyM') { e.preventDefault(); toggleMusic(); }
  if (e.code === 'KeyF') { e.preventDefault(); toggleFullscreen(); }
});
document.addEventListener('keyup', e => keys[e.code] = false);
btnStart.addEventListener('click', () => {
  initAudio();
  if (overlayMode === 'pause') togglePause();
  else startGame();
});
btnMusic.addEventListener('click', toggleMusic);
btnFullscreen.addEventListener('click', toggleFullscreen);
musicVolumeEl.addEventListener('input', e => {
  initAudio();
  musicVolume = Math.min(0.6, Math.max(0, parseFloat(e.target.value) || 0));
  persistMusicSettings();
  updateMusicUI();
  syncMusicGain();
});
difficultySelect.addEventListener('change', e => {
  gameSettings.difficulty = normalizeDifficulty(e.target.value);
  persistGameSettings();
  applySettingsUI();
});
vibrationToggle.addEventListener('change', e => {
  gameSettings.vibration = !!e.target.checked;
  persistGameSettings();
});
document.addEventListener('fullscreenchange', updateFullscreenUI);

// ---- Bala jugador ----
let bullet = null;
// Disparo automático en móvil: si se mueve y no hay bala, dispara cada 30 frames
let autoShootTimer = 0;
function shoot() {
  if (!running || bullet || showingLevelScreen || paused) return;
  bullet = { x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 14, speed: 9 };
  currentRunStats.shots++;
  soundShoot();
}

// ---- Balas enemigas ----
const enemyBullets = [];
let enemyShootTimer = 0;
function getEnemyShootInterval() {
  const preset = getDifficultyConfig();
  return Math.max(36, Math.round((110 - (level-1)*10) * preset.enemyShootFactor));
}

// ---- Explosiones y textos flotantes ----
const explosions = [], floatingTexts = [];
function spawnExplosion(x, y) { explosions.push({ x, y, timer: 20, maxTimer: 20 }); }
function spawnFloatingText(x, y, text, color) { floatingTexts.push({ x, y, text, color, timer: 50, maxTimer: 50 }); }

// ---- UFO ----
const ufo = { active: false, x: 0, y: 28, w: 50, h: 20, speed: 2, dir: 1 };
let ufoSpawnTimer = 0;
function getUfoSpawnInterval() {
  return getDifficultyConfig().ufoSpawnInterval;
}

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
  const preset = getDifficultyConfig();
  const alive = enemies.filter(e => e.alive).length;
  const base = Math.max(4, 26 - (level-1)*2);
  return Math.max(3, Math.round(base * preset.enemyTickFactor * (alive / TOTAL_ENEMIES)));
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
          currentRunStats.hits++;
          currentRunStats.enemiesDestroyed++;
          currentRunStats.maxCombo = Math.max(currentRunStats.maxCombo, combo);
          const pts = (e.row === 0 ? 30 : e.row === 1 ? 20 : 10) * (combo > 1 ? combo : 1);
          score += pts; scoreEl.textContent = score;
          if (score > highscore) { highscore = score; highscoreEl.textContent = highscore; localStorage.setItem('si_hs', highscore); }
          spawnExplosion(e.x + e.w/2, e.y + e.h/2);
          spawnFloatingText(e.x + e.w/2, e.y, (combo > 1 ? `x${combo} ` : '') + '+' + pts, combo > 1 ? '#ff8800' : '#ffff00');
          soundHit(); break;
        }
      }
      if (!hit && bullet && ufo.active && rectsOverlap(bullet, ufo)) {
        currentRunStats.hits++;
        currentRunStats.ufoDestroyed++;
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
      const preset = getDifficultyConfig();
      enemyBullets.push({
        x: s.x + s.w/2 - 2,
        y: s.y + s.h,
        w: 4,
        h: 12,
        speed: preset.enemyBulletBase + (level-1) * preset.enemyBulletStep
      });
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
  if (!ufo.active && ufoSpawnTimer >= getUfoSpawnInterval()) {
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
  if (paused) {
    setOverlayMode('pause');
  } else {
    overlay.classList.remove('visible');
    loop();
  }
}

function triggerDeath() {
  lives--; livesEl.textContent = lives;
  soundDeath();
  if (gameSettings.vibration && navigator.vibrate) navigator.vibrate([100,50,100]);
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
  if (paused) return;
  update(); draw();
  if (running) requestAnimationFrame(loop);
}

// ---- Game Over ----
function gameOver() {
  running = false;
  const durationMs = Math.max(0, Date.now() - currentRunStats.startedAt);
  const entry = {
    score,
    level,
    accuracy: getAccuracyPercent(currentRunStats.shots, currentRunStats.hits),
    shots: currentRunStats.shots,
    hits: currentRunStats.hits,
    enemiesDestroyed: currentRunStats.enemiesDestroyed,
    ufoDestroyed: currentRunStats.ufoDestroyed,
    maxCombo: currentRunStats.maxCombo,
    difficulty: currentRunStats.difficulty,
    playedAt: new Date().toISOString(),
    durationMs
  };
  saveScore(entry);
  updateAggregateStats(entry);
  setOverlayMode('gameover', entry);
}

// ---- Start ----
function startGame() {
  const preset = getDifficultyConfig();
  currentRunStats = createRunStats();
  currentRunStats.startedAt = Date.now();
  currentRunStats.difficulty = gameSettings.difficulty;
  score = 0; lives = preset.startLives; level = 1;
  scoreEl.textContent = 0; livesEl.textContent = lives; levelEl.textContent = 1;
  bullet = null; enemyBullets.length = 0; explosions.length = 0; floatingTexts.length = 0;
  paused = false; invincibleTimer = 0; frameCount = 0; enemyShootTimer = 0;
  ufo.active = false; ufoSpawnTimer = 0;
  heartbeatTimer = 0; heartbeatIdx = 0;
  combo = 0; comboTimer = 0; autoShootTimer = 0;
  showingLevelScreen = false;
  musicStep = 0;
  player.x = canvas.width/2 - player.w/2; player.hit = false; player.speed = preset.playerSpeed;
  spawnEnemies(); buildShields();
  overlay.classList.remove('visible');
  overlayMode = 'start';
  running = true; loop();
}

applySettingsUI();
updateMusicUI();
updateFullscreenUI();
setOverlayMode('start');
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
