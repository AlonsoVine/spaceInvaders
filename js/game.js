// =====================
//  Space Invaders v3.0
// =====================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');
const highscoreEl = document.getElementById('highscore');
const modeLabelEl = document.getElementById('mode-label');
const timerEl = document.getElementById('timer');
const powerupStatusEl = document.getElementById('powerup-status');
const bossStatusEl = document.getElementById('boss-status');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayKicker = document.getElementById('overlay-kicker');
const overlayMsg = document.getElementById('overlay-msg');
const btnStart = document.getElementById('btn-start');
const difficultySelect = document.getElementById('difficulty-select');
const modeSelect = document.getElementById('mode-select');
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

const SETTINGS_KEY = 'si_settings';
const HISTORY_KEY = 'si_history';
const AGGREGATE_STATS_KEY = 'si_stats';
const MAX_LIVES = 3;
const LEVEL_SCREEN_DURATION = 120;
const TIME_ATTACK_DURATION_MS = 90000;
const TIME_ATTACK_WAVE_BONUS_MS = 7000;
const TIME_ATTACK_BOSS_BONUS_MS = 12000;
const TIME_ATTACK_MAX_MS = 120000;
const RAPID_FIRE_DURATION_MS = 9000;
const POWERUP_DROP_CHANCE = 0.14;
const PLAYER_BASE_COOLDOWN = 16;
const RAPID_FIRE_COOLDOWN = 7;

const DIFFICULTY_PRESETS = {
  easy: { startLives: 3, playerSpeed: 5.8, enemyTickFactor: 1.18, enemyShootFactor: 1.18, enemyBulletBase: 3.4, enemyBulletStep: 0.45, ufoSpawnInterval: 820 },
  normal: { startLives: 3, playerSpeed: 5.0, enemyTickFactor: 1.0, enemyShootFactor: 1.0, enemyBulletBase: 4.0, enemyBulletStep: 0.5, ufoSpawnInterval: 700 },
  hard: { startLives: 2, playerSpeed: 4.6, enemyTickFactor: 0.82, enemyShootFactor: 0.82, enemyBulletBase: 4.8, enemyBulletStep: 0.6, ufoSpawnInterval: 560 }
};

function normalizeDifficulty(value) {
  return Object.prototype.hasOwnProperty.call(DIFFICULTY_PRESETS, value) ? value : 'normal';
}

function normalizeGameMode(value) {
  return value === 'timeattack' ? 'timeattack' : 'classic';
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return {
      difficulty: normalizeDifficulty(stored.difficulty),
      mode: normalizeGameMode(stored.mode),
      vibration: stored.vibration !== false
    };
  } catch {
    return { difficulty: 'normal', mode: 'classic', vibration: true };
  }
}

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
      mode: 'classic',
      powerUpsCollected: 0,
      bossesDefeated: 0,
      playedAt: null,
      durationMs: 0,
      reason: 'defeat'
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
    mode: normalizeGameMode(entry.mode),
    powerUpsCollected: Math.max(0, Number(entry.powerUpsCollected) || 0),
    bossesDefeated: Math.max(0, Number(entry.bossesDefeated) || 0),
    playedAt: typeof entry.playedAt === 'string' ? entry.playedAt : null,
    durationMs: Math.max(0, Number(entry.durationMs) || 0),
    reason: entry.reason === 'timeout' ? 'timeout' : 'defeat'
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
      totalPowerUpsCollected: Math.max(0, Number(stored.totalPowerUpsCollected) || 0),
      totalBossesDefeated: Math.max(0, Number(stored.totalBossesDefeated) || 0),
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
      totalPowerUpsCollected: 0,
      totalBossesDefeated: 0,
      bestLevel: 0,
      bestCombo: 1,
      totalTimeMs: 0
    };
  }
}

function createRunStats() {
  return {
    startedAt: 0,
    shots: 0,
    hits: 0,
    enemiesDestroyed: 0,
    ufoDestroyed: 0,
    powerUpsCollected: 0,
    bossesDefeated: 0,
    maxCombo: 1,
    difficulty: gameSettings.difficulty,
    mode: gameSettings.mode
  };
}

function persistGameSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings));
}

function saveAggregateStats() {
  localStorage.setItem(AGGREGATE_STATS_KEY, JSON.stringify(aggregateStats));
}

function applySettingsUI() {
  difficultySelect.value = gameSettings.difficulty;
  modeSelect.value = gameSettings.mode;
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

function formatModeLabel(value) {
  return value === 'timeattack' ? 'CONTRARRELOJ' : 'CLASICO';
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

function updateLivesUI() {
  const hearts = Array.from({ length: MAX_LIVES }, (_, index) => {
    const filled = index < lives;
    return `<span class="life-heart${filled ? '' : ' is-empty'}" aria-hidden="true"></span>`;
  }).join('');
  livesEl.innerHTML = hearts;
  livesEl.setAttribute('aria-label', `${lives} vidas`);
}

function updateHudStatus() {
  const activeMode = running ? currentRunStats.mode : gameSettings.mode;
  const labels = [];

  modeLabelEl.textContent = formatModeLabel(activeMode);
  if (activeMode === 'timeattack') {
    timerEl.textContent = formatDuration(timeLeftMs);
    timerEl.classList.toggle('is-warning', running && timeLeftMs <= 15000);
  } else {
    timerEl.textContent = 'LIBRE';
    timerEl.classList.remove('is-warning');
  }

  if (shieldCharges > 0) labels.push(`ESCUDO x${shieldCharges}`);
  if (activeEffects.rapid > 0) labels.push(`RAPIDO ${Math.ceil(activeEffects.rapid / 1000)}s`);
  powerupStatusEl.textContent = labels.length ? labels.join(' · ') : 'SIN POWER-UPS';

  bossStatusEl.hidden = !boss.active;
  if (boss.active) bossStatusEl.textContent = `BOSS ${boss.hp}/${boss.maxHp}`;
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
    powerUpsCollected: currentRunStats.powerUpsCollected,
    bossesDefeated: currentRunStats.bossesDefeated,
    maxCombo: currentRunStats.maxCombo,
    accuracy: getAccuracyPercent(currentRunStats.shots, currentRunStats.hits),
    difficulty: currentRunStats.difficulty || gameSettings.difficulty,
    mode: currentRunStats.mode || gameSettings.mode,
    durationMs: currentRunStats.startedAt ? Math.max(0, Date.now() - currentRunStats.startedAt) : 0
  };
  const stats = mode === 'pause'
    ? [
        ['Puntuacion', `${currentEntry.score} pts`, `Nivel ${currentEntry.level} · ${formatModeLabel(currentEntry.mode)}`],
        ['Precision', `${currentEntry.accuracy}%`, `${currentEntry.hits}/${currentEntry.shots} impactos`],
        ['Objetivos', `${currentEntry.enemiesDestroyed} enemigos`, `${currentEntry.ufoDestroyed} UFO · ${currentEntry.bossesDefeated} boss`],
        ['Power-ups', `${currentEntry.powerUpsCollected} recogidos`, `Combo x${currentEntry.maxCombo}`],
        ['Sesion', formatDuration(currentEntry.durationMs), `${formatDifficultyLabel(currentEntry.difficulty)} · ${currentEntry.lives} vidas`]
      ]
    : [
        ['Puntuacion final', `${currentEntry.score} pts`, `Nivel ${currentEntry.level} · ${formatModeLabel(currentEntry.mode)}`],
        ['Precision', `${currentEntry.accuracy}%`, `${currentEntry.hits}/${currentEntry.shots} impactos`],
        ['Objetivos', `${currentEntry.enemiesDestroyed} enemigos`, `${currentEntry.ufoDestroyed} UFO · ${currentEntry.bossesDefeated} boss`],
        ['Power-ups', `${currentEntry.powerUpsCollected} recogidos`, `Combo x${currentEntry.maxCombo}`],
        ['Duracion', formatDuration(currentEntry.durationMs), `Record ${highscore} pts · ${formatDifficultyLabel(currentEntry.difficulty)}`]
      ];

  runStatsGridEl.innerHTML = stats.map(([label, value, subvalue]) => (
    `<div class="run-stat"><span class="run-stat-label">${label}</span><strong class="run-stat-value">${value}</strong><span class="run-stat-subvalue">${subvalue}</span></div>`
  )).join('');
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
        ['Power-ups', aggregateStats.totalPowerUpsCollected],
        ['Bosses vencidos', aggregateStats.totalBossesDefeated],
        ['Precision global', `${globalAccuracy}%`],
        ['Tiempo jugado', formatDuration(aggregateStats.totalTimeMs)]
      ].map(([label, value]) => `<div class="stats-line"><span>${label}</span><strong>${value}</strong></div>`).join('');

  statsHistoryEl.innerHTML = scoreHistory.length === 0
    ? '<div class="stats-empty">Aun no hay historial de partidas.</div>'
    : scoreHistory.slice(0, 5).map(entry => (
        `<div class="history-line"><span>${formatPlayedAt(entry.playedAt)} · ${formatDifficultyLabel(entry.difficulty)} · ${formatModeLabel(entry.mode)} · NIV ${entry.level}</span><strong>${entry.score} pts · ${entry.accuracy}%</strong></div>`
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
    runPanelBadge.textContent = formatModeLabel(currentRunStats.mode);
    renderRunStats(entry, mode);
    setPanelVisibility(settingsPanel, false);
    setPanelVisibility(runPanel, true);
    setPanelVisibility(aggregatePanel, true);
    setPanelVisibility(historyPanel, true);
  } else {
    const timeout = entry && entry.reason === 'timeout';
    overlayKicker.textContent = timeout ? 'CUENTA ATRAS AGOTADA' : 'SESION FINALIZADA';
    overlayTitle.textContent = timeout ? 'TIEMPO' : 'GAME OVER';
    overlayMsg.innerHTML = timeout
      ? 'El contrarreloj ha llegado a cero. Tienes el resumen y tus marcas listas para la siguiente partida.'
      : entry && entry.score >= highscore
        ? 'Has cerrado la partida con una gran marca. Revisa el resumen antes de volver a intentarlo.'
        : 'La partida ha terminado. Tienes el resumen y tu historial justo aqui, sin ruido extra.';
    btnStart.textContent = 'REINTENTAR';
    runPanelTitle.textContent = 'ULTIMA PARTIDA';
    runPanelBadge.textContent = formatModeLabel(entry?.mode || currentRunStats.mode);
    renderRunStats(entry, mode);
    setPanelVisibility(settingsPanel, false);
    setPanelVisibility(runPanel, true);
    setPanelVisibility(aggregatePanel, true);
    setPanelVisibility(historyPanel, true);
  }

  overlay.classList.add('visible');
}

let gameSettings = loadSettings();
let scoreHistory = loadScoreHistory();
let aggregateStats = loadAggregateStats();
let currentRunStats = createRunStats();
let overlayMode = 'start';

let highscore = parseInt(localStorage.getItem('si_hs') || '0', 10);
highscoreEl.textContent = highscore;

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
  C3: 130.81, E3: 164.81, G3: 196.0, A3: 220.0,
  C4: 261.63, E4: 329.63, G4: 392.0, A4: 440.0,
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

function toggleMusic() {
  initAudio();
  musicEnabled = !musicEnabled;
  persistMusicSettings();
  updateMusicUI();
  syncMusicGain();
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
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function soundShoot() { beep(880, 0.08, 'square', 0.1); }
function soundHit() { beep(180, 0.12, 'sawtooth', 0.18); }
function soundDeath() {
  beep(150, 0.3, 'sawtooth', 0.2);
  setTimeout(() => beep(90, 0.35, 'sawtooth', 0.18), 160);
}
function soundWin() {
  [523, 659, 784, 1047].forEach((freq, index) => setTimeout(() => beep(freq, 0.15, 'sine', 0.2), index * 120));
}
function soundPowerUp() {
  [784, 988, 1175].forEach((freq, index) => setTimeout(() => beep(freq, 0.09, 'square', 0.12), index * 70));
}

let ufoBeepPhase = 0;
function soundUfo() {
  if (frameCount % 30 !== 0) return;
  beep([330, 220][ufoBeepPhase++ % 2], 0.18, 'sine', 0.06);
}

function playMusicNote(freq, duration, type, vol) {
  if (!audioCtx || !musicGain || !musicEnabled || !freq) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;
  osc.connect(gain);
  gain.connect(musicGain);
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

let heartbeatTimer = 0;
let heartbeatIdx = 0;
const HEARTBEAT_NOTES = [160, 130, 100, 80];

function tickHeartbeat(aliveCount) {
  heartbeatTimer++;
  const interval = Math.max(6, Math.round(30 * (aliveCount / TOTAL_ENEMIES)));
  if (heartbeatTimer >= interval) {
    heartbeatTimer = 0;
    beep(HEARTBEAT_NOTES[heartbeatIdx++ % 4], 0.04, 'square', 0.06);
  }
}

let score = 0;
let lives = MAX_LIVES;
let level = 1;
let running = false;
let invincibleTimer = 0;
let frameCount = 0;
let showingLevelScreen = false;
let levelScreenTimer = 0;
let paused = false;
let combo = 0;
let comboTimer = 0;
let lastFrameTime = 0;
let timeLeftMs = 0;
let shieldCharges = 0;
let bossEncounteredThisLevel = false;

const activeEffects = { rapid: 0 };
const player = { x: 0, y: canvas.height - 60, w: 40, h: 20, speed: 5, hit: false };

const keys = {};
document.addEventListener('keydown', event => {
  if (event.repeat && (event.code === 'KeyM' || event.code === 'KeyF')) return;
  keys[event.code] = true;

  if (event.code === 'Enter' && paused) {
    event.preventDefault();
    togglePause();
  }
  if (event.code === 'Enter' && !running && !showingLevelScreen) {
    initAudio();
    startGame();
  }
  if (event.code === 'Space') {
    event.preventDefault();
    shoot();
  }
  if ((event.code === 'KeyP' || event.code === 'Escape') && running) {
    event.preventDefault();
    togglePause();
  }
  if (event.code === 'KeyM') {
    event.preventDefault();
    toggleMusic();
  }
  if (event.code === 'KeyF') {
    event.preventDefault();
    toggleFullscreen();
  }
});

document.addEventListener('keyup', event => {
  keys[event.code] = false;
});

btnStart.addEventListener('click', () => {
  initAudio();
  if (overlayMode === 'pause') togglePause();
  else startGame();
});
btnMusic.addEventListener('click', toggleMusic);
btnFullscreen.addEventListener('click', toggleFullscreen);
musicVolumeEl.addEventListener('input', event => {
  initAudio();
  musicVolume = Math.min(0.6, Math.max(0, parseFloat(event.target.value) || 0));
  persistMusicSettings();
  updateMusicUI();
  syncMusicGain();
});
difficultySelect.addEventListener('change', event => {
  gameSettings.difficulty = normalizeDifficulty(event.target.value);
  persistGameSettings();
  applySettingsUI();
});
modeSelect.addEventListener('change', event => {
  gameSettings.mode = normalizeGameMode(event.target.value);
  persistGameSettings();
  applySettingsUI();
  updateHudStatus();
});
vibrationToggle.addEventListener('change', event => {
  gameSettings.vibration = !!event.target.checked;
  persistGameSettings();
});
document.addEventListener('fullscreenchange', updateFullscreenUI);

const playerBullets = [];
let playerShotCooldown = 0;
let autoShootTimer = 0;

function getPlayerBulletLimit() {
  return activeEffects.rapid > 0 ? 2 : 1;
}

function getPlayerShotCooldown() {
  return activeEffects.rapid > 0 ? RAPID_FIRE_COOLDOWN : PLAYER_BASE_COOLDOWN;
}

function shoot() {
  if (!running || showingLevelScreen || paused) return;
  if (playerShotCooldown > 0 || playerBullets.length >= getPlayerBulletLimit()) return;

  playerBullets.push({
    x: player.x + player.w / 2 - 2,
    y: player.y,
    w: 4,
    h: 14,
    speed: activeEffects.rapid > 0 ? 10.5 : 9
  });
  playerShotCooldown = getPlayerShotCooldown();
  currentRunStats.shots++;
  soundShoot();
}

const enemyBullets = [];
let enemyShootTimer = 0;

function getEnemyShootInterval() {
  const preset = getDifficultyConfig();
  return Math.max(36, Math.round((110 - (level - 1) * 10) * preset.enemyShootFactor));
}

const explosions = [];
const floatingTexts = [];

function spawnExplosion(x, y, radius = 20) {
  explosions.push({ x, y, timer: 20, maxTimer: 20, radius });
}

function spawnFloatingText(x, y, text, color) {
  floatingTexts.push({ x, y, text, color, timer: 50, maxTimer: 50 });
}

const powerUps = [];

function rollPowerUpType() {
  const pool = lives < MAX_LIVES ? ['rapid', 'shield', 'heart'] : ['rapid', 'shield', 'shield'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function spawnPowerUp(x, y, type = rollPowerUpType()) {
  powerUps.push({
    x: x - 10,
    y: y - 10,
    w: 20,
    h: 20,
    speed: 1.5 + level * 0.05,
    type,
    phase: Math.random() * Math.PI * 2
  });
}

function maybeDropPowerUp(x, y) {
  if (Math.random() > POWERUP_DROP_CHANCE) return;
  spawnPowerUp(x, y);
}

function collectPowerUp(powerUp) {
  currentRunStats.powerUpsCollected++;
  soundPowerUp();

  if (powerUp.type === 'heart') {
    if (lives < MAX_LIVES) {
      lives = Math.min(MAX_LIVES, lives + 1);
      updateLivesUI();
      spawnFloatingText(player.x + player.w / 2, player.y - 10, '+1 VIDA', '#ff7ca8');
    } else {
      score += 75;
      scoreEl.textContent = score;
      spawnFloatingText(player.x + player.w / 2, player.y - 10, '+75', '#ffdd66');
    }
  } else if (powerUp.type === 'shield') {
    shieldCharges = Math.min(2, shieldCharges + 1);
    spawnFloatingText(player.x + player.w / 2, player.y - 10, 'ESCUDO', '#66e0ff');
  } else if (powerUp.type === 'rapid') {
    activeEffects.rapid = RAPID_FIRE_DURATION_MS;
    spawnFloatingText(player.x + player.w / 2, player.y - 10, 'RAPIDO', '#00ff88');
  }

  updateHudStatus();
}

const ufo = { active: false, x: 0, y: 28, w: 50, h: 20, speed: 2, dir: 1 };
let ufoSpawnTimer = 0;

function getUfoSpawnInterval() {
  return getDifficultyConfig().ufoSpawnInterval;
}

const shields = [];

function buildShields() {
  shields.length = 0;
  const blockSize = 6;
  const shieldW = 60;
  const shieldH = 40;
  const gap = (canvas.width - 4 * shieldW) / 5;

  for (let i = 0; i < 4; i++) {
    const sx = gap + i * (shieldW + gap);
    const sy = canvas.height - 130;
    for (let row = 0; row < shieldH / blockSize; row++) {
      for (let col = 0; col < shieldW / blockSize; col++) {
        if (!(row >= 4 && col >= 3 && col <= 6)) {
          shields.push({ x: sx + col * blockSize, y: sy + row * blockSize, w: blockSize, h: blockSize, alive: true });
        }
      }
    }
  }
}

const enemies = [];
let enemyDir = 1;
const ENEMY_STEP_X = 10;
const ENEMY_STEP_Y = 20;
let enemyTickTimer = 0;
let pendingDrop = false;
let enemyAnimFrame = 0;

const COLS = 8;
const ROWS = 3;
const E_W = 34;
const E_H = 22;
const TOTAL_ENEMIES = COLS * ROWS;

const boss = {
  active: false,
  x: 0,
  y: 72,
  w: 156,
  h: 58,
  hp: 0,
  maxHp: 0,
  dir: 1,
  speed: 2.2,
  phase: 0,
  shootTimer: 0
};

function resetBoss() {
  boss.active = false;
  boss.hp = 0;
  boss.maxHp = 0;
  boss.shootTimer = 0;
}

function shouldSpawnBossForLevel(currentLevel) {
  return currentLevel > 0 && currentLevel % 3 === 0;
}

function getEnemyLayout() {
  const totalW = COLS * E_W;
  const gapX = Math.floor((canvas.width - totalW - 20) / (COLS - 1));
  const marginX = 10;
  const startY = Math.min(65 + (level - 1) * 15, 140);
  const gapY = 46;
  return { marginX, gapX, gapY, startY };
}

function getEnemyTickInterval() {
  const preset = getDifficultyConfig();
  const alive = enemies.filter(enemy => enemy.alive).length;
  const base = Math.max(4, 26 - (level - 1) * 2);
  return Math.max(3, Math.round(base * preset.enemyTickFactor * (alive / TOTAL_ENEMIES)));
}

function spawnEnemies() {
  enemies.length = 0;
  const { marginX, gapX, gapY, startY } = getEnemyLayout();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const missingIntroEnemy = level === 1 && row === 0 && col % 2 === 1;
      enemies.push({
        x: marginX + col * (E_W + gapX),
        y: startY + row * (E_H + gapY),
        w: E_W,
        h: E_H,
        alive: !missingIntroEnemy,
        row,
        pose: 0
      });
    }
  }

  enemyDir = 1;
  enemyTickTimer = 0;
  pendingDrop = false;
  enemyAnimFrame = 0;
}

function syncHighscore() {
  if (score > highscore) {
    highscore = score;
    highscoreEl.textContent = highscore;
    localStorage.setItem('si_hs', String(highscore));
  }
}

function awardTimeBonus(ms) {
  if (currentRunStats.mode !== 'timeattack') return;
  timeLeftMs = Math.min(TIME_ATTACK_MAX_MS, timeLeftMs + ms);
}

function startBossFight() {
  bossEncounteredThisLevel = true;
  boss.active = true;
  boss.maxHp = 18 + Math.max(0, Math.floor(level / 3) - 1) * 6;
  boss.hp = boss.maxHp;
  boss.speed = 2.2 + Math.min(1.2, (level - 1) * 0.08);
  boss.dir = Math.random() < 0.5 ? -1 : 1;
  boss.phase = Math.random() * Math.PI * 2;
  boss.shootTimer = 0;
  boss.x = canvas.width / 2 - boss.w / 2;
  boss.y = 70;
  playerBullets.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;
  spawnFloatingText(canvas.width / 2, 92, 'BOSS FIGHT', '#ff7db3');
  updateHudStatus();
}

function completeLevel() {
  awardTimeBonus(TIME_ATTACK_WAVE_BONUS_MS);
  level++;
  levelEl.textContent = level;
  bossEncounteredThisLevel = false;
  soundWin();
  showingLevelScreen = true;
  levelScreenTimer = 0;
  resetBoss();
  updateHudStatus();
}

function defeatBoss() {
  currentRunStats.bossesDefeated++;
  score += 500 + level * 50;
  scoreEl.textContent = score;
  syncHighscore();
  spawnExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, 36);
  spawnFloatingText(boss.x + boss.w / 2, boss.y - 4, `+${500 + level * 50}`, '#ff7db3');
  awardTimeBonus(TIME_ATTACK_BOSS_BONUS_MS);
  resetBoss();
  completeLevel();
}

function updatePlayerBullets() {
  for (let index = playerBullets.length - 1; index >= 0; index--) {
    const bullet = playerBullets[index];
    bullet.y -= bullet.speed;

    if (bullet.y + bullet.h < 0) {
      playerBullets.splice(index, 1);
      continue;
    }

    let hit = false;
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (rectsOverlap(bullet, enemy)) {
        enemy.alive = false;
        playerBullets.splice(index, 1);
        hit = true;
        combo++;
        comboTimer = 90;
        currentRunStats.hits++;
        currentRunStats.enemiesDestroyed++;
        currentRunStats.maxCombo = Math.max(currentRunStats.maxCombo, combo);
        const points = (enemy.row === 0 ? 30 : enemy.row === 1 ? 20 : 10) * (combo > 1 ? combo : 1);
        score += points;
        scoreEl.textContent = score;
        syncHighscore();
        spawnExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
        spawnFloatingText(enemy.x + enemy.w / 2, enemy.y, `${combo > 1 ? `x${combo} ` : ''}+${points}`, combo > 1 ? '#ff8800' : '#ffff00');
        maybeDropPowerUp(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
        soundHit();
        break;
      }
    }

    if (!hit && boss.active && rectsOverlap(bullet, boss)) {
      playerBullets.splice(index, 1);
      hit = true;
      currentRunStats.hits++;
      score += 25;
      scoreEl.textContent = score;
      syncHighscore();
      boss.hp = Math.max(0, boss.hp - 1);
      spawnExplosion(bullet.x, bullet.y, 12);
      spawnFloatingText(boss.x + boss.w / 2, boss.y - 6, '-1', '#ffb3d1');
      soundHit();
      updateHudStatus();
      if (boss.hp <= 0) {
        defeatBoss();
        return;
      }
    }

    if (!hit && ufo.active && rectsOverlap(bullet, ufo)) {
      currentRunStats.hits++;
      currentRunStats.ufoDestroyed++;
      score += 150;
      scoreEl.textContent = score;
      syncHighscore();
      spawnExplosion(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2);
      spawnFloatingText(ufo.x + ufo.w / 2, ufo.y, '+150', '#ff66cc');
      ufo.active = false;
      playerBullets.splice(index, 1);
      hit = true;
      soundHit();
    }

    if (!hit) {
      for (const shield of shields) {
        if (!shield.alive) continue;
        if (rectsOverlap(bullet, shield)) {
          shield.alive = false;
          playerBullets.splice(index, 1);
          break;
        }
      }
    }
  }
}

function updateBoss() {
  if (!boss.active) return;

  boss.phase += 0.035;
  boss.x += boss.dir * boss.speed;
  boss.y = 68 + Math.sin(boss.phase) * 10;

  if (boss.x <= 18 || boss.x + boss.w >= canvas.width - 18) {
    boss.dir *= -1;
  }

  boss.shootTimer++;
  const preset = getDifficultyConfig();
  const shootInterval = Math.max(32, Math.round(72 * preset.enemyShootFactor - (boss.maxHp - boss.hp) * 1.2));
  if (boss.shootTimer >= shootInterval) {
    boss.shootTimer = 0;
    const spread = boss.hp <= Math.ceil(boss.maxHp / 2) ? [-36, 0, 36] : [-28, 28];
    for (const offset of spread) {
      enemyBullets.push({
        x: boss.x + boss.w / 2 + offset - 3,
        y: boss.y + boss.h - 2,
        w: 6,
        h: 14,
        speed: preset.enemyBulletBase + 1.1 + (level - 1) * 0.16,
        fromBoss: true
      });
    }
  }

  if (boss.y + boss.h >= player.y - 12 && invincibleTimer === 0) {
    triggerDeath();
  }
}

function updatePowerUps() {
  for (let index = powerUps.length - 1; index >= 0; index--) {
    const powerUp = powerUps[index];
    powerUp.phase += 0.08;
    powerUp.y += powerUp.speed;
    powerUp.x += Math.sin(powerUp.phase) * 0.45;

    if (powerUp.y > canvas.height + powerUp.h) {
      powerUps.splice(index, 1);
      continue;
    }

    if (rectsOverlap(powerUp, player)) {
      collectPowerUp(powerUp);
      powerUps.splice(index, 1);
    }
  }
}

function updateEnemyBullets() {
  for (let index = enemyBullets.length - 1; index >= 0; index--) {
    const bullet = enemyBullets[index];
    bullet.y += bullet.speed;

    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
      continue;
    }

    let blocked = false;
    for (const shield of shields) {
      if (!shield.alive) continue;
      if (rectsOverlap(bullet, shield)) {
        shield.alive = false;
        enemyBullets.splice(index, 1);
        blocked = true;
        break;
      }
    }
    if (blocked) continue;

    if (invincibleTimer === 0 && rectsOverlap(bullet, player)) {
      enemyBullets.splice(index, 1);
      triggerDeath();
    }
  }
}

let lastDeltaMs = 16;

function update() {
  frameCount++;

  if (showingLevelScreen) {
    levelScreenTimer++;
    if (levelScreenTimer >= LEVEL_SCREEN_DURATION) {
      showingLevelScreen = false;
      spawnEnemies();
      buildShields();
      playerBullets.length = 0;
      enemyBullets.length = 0;
      powerUps.length = 0;
      resetBoss();
      updateHudStatus();
    }
    return;
  }

  if (currentRunStats.mode === 'timeattack') {
    timeLeftMs = Math.max(0, timeLeftMs - Math.min(50, lastDeltaMs));
    if (timeLeftMs <= 0) {
      updateHudStatus();
      gameOver('timeout');
      return;
    }
  }

  if (activeEffects.rapid > 0) {
    activeEffects.rapid = Math.max(0, activeEffects.rapid - Math.min(50, lastDeltaMs));
  }

  const moving = keys.ArrowLeft || keys.ArrowRight;
  if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
  if (keys.ArrowRight && player.x + player.w < canvas.width) player.x += player.speed;

  if (window._touchActive && moving) {
    autoShootTimer += lastDeltaMs;
    const autoShootInterval = activeEffects.rapid > 0 ? 120 : 240;
    if (autoShootTimer >= autoShootInterval) {
      autoShootTimer = 0;
      shoot();
    }
  } else {
    autoShootTimer = 0;
  }

  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) combo = 0;
  }

  if (invincibleTimer > 0) invincibleTimer--;
  if (playerShotCooldown > 0) playerShotCooldown--;

  updatePlayerBullets();
  if (!running || showingLevelScreen) return;

  const aliveEnemies = enemies.filter(enemy => enemy.alive);
  if (!boss.active && aliveEnemies.length === 0) {
    if (shouldSpawnBossForLevel(level) && !bossEncounteredThisLevel) {
      startBossFight();
      return;
    }
    completeLevel();
    return;
  }

  if (!boss.active) {
    tickHeartbeat(aliveEnemies.length);
    enemyTickTimer++;

    if (enemyTickTimer >= getEnemyTickInterval()) {
      enemyTickTimer = 0;
      enemyAnimFrame++;

      if (pendingDrop) {
        enemies.forEach(enemy => {
          if (enemy.alive) enemy.y += ENEMY_STEP_Y;
        });
        enemyDir *= -1;
        pendingDrop = false;
      } else {
        enemies.forEach(enemy => {
          if (enemy.alive) {
            enemy.x += enemyDir * ENEMY_STEP_X;
            enemy.pose = enemyAnimFrame % 2;
          }
        });

        const leftX = Math.min(...aliveEnemies.map(enemy => enemy.x));
        const rightX = Math.max(...aliveEnemies.map(enemy => enemy.x + enemy.w));
        if (rightX >= canvas.width - 8 || leftX <= 8) pendingDrop = true;
      }
    }

    if (aliveEnemies.some(enemy => enemy.y + enemy.h >= player.y)) triggerDeath();
    if (!running) return;

    enemyShootTimer++;
    if (enemyShootTimer >= getEnemyShootInterval()) {
      enemyShootTimer = 0;
      const columns = {};
      for (const enemy of aliveEnemies) {
        const columnKey = Math.round(enemy.x / (E_W + 10));
        if (!columns[columnKey] || enemy.y > columns[columnKey].y) columns[columnKey] = enemy;
      }
      const shooters = Object.values(columns);
      if (shooters.length) {
        const shooter = shooters[Math.floor(Math.random() * shooters.length)];
        const preset = getDifficultyConfig();
        enemyBullets.push({
          x: shooter.x + shooter.w / 2 - 2,
          y: shooter.y + shooter.h,
          w: 4,
          h: 12,
          speed: preset.enemyBulletBase + (level - 1) * preset.enemyBulletStep,
          fromBoss: false
        });
      }
    }
  } else {
    updateBoss();
  }

  updateEnemyBullets();
  if (!running) return;
  updatePowerUps();

  ufoSpawnTimer++;
  if (!ufo.active && !boss.active && ufoSpawnTimer >= getUfoSpawnInterval()) {
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

  for (let index = floatingTexts.length - 1; index >= 0; index--) {
    floatingTexts[index].timer--;
    floatingTexts[index].y -= 0.5;
    if (floatingTexts[index].timer <= 0) floatingTexts.splice(index, 1);
  }

  for (let index = explosions.length - 1; index >= 0; index--) {
    explosions[index].timer--;
    if (explosions[index].timer <= 0) explosions.splice(index, 1);
  }

  updateHudStatus();
}

function togglePause() {
  if (!running) return;
  paused = !paused;
  if (paused) {
    setOverlayMode('pause');
  } else {
    overlay.classList.remove('visible');
    lastFrameTime = performance.now();
    loop(lastFrameTime);
  }
}

function triggerDeath() {
  if (shieldCharges > 0) {
    shieldCharges--;
    soundPowerUp();
    spawnFloatingText(player.x + player.w / 2, player.y - 8, 'BLOQUEADO', '#66e0ff');
    updateHudStatus();
    return;
  }

  lives = Math.max(0, lives - 1);
  updateLivesUI();
  soundDeath();
  if (gameSettings.vibration && navigator.vibrate) navigator.vibrate([100, 50, 100]);
  combo = 0;
  comboTimer = 0;

  if (lives <= 0) {
    gameOver('defeat');
    return;
  }

  invincibleTimer = 120;
  player.hit = true;
  setTimeout(() => { player.hit = false; }, 2000);
  updateHudStatus();
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function drawAlien(enemy) {
  const colors = ['#ff44cc', '#4488ff', '#ff8844'];
  const color = colors[enemy.row];
  ctx.fillStyle = color;
  ctx.shadowBlur = 4;
  ctx.shadowColor = color;
  if (enemy.pose === 0) {
    ctx.fillRect(enemy.x + 4, enemy.y + 4, enemy.w - 8, enemy.h - 8);
    ctx.fillRect(enemy.x + 6, enemy.y, 4, 6);
    ctx.fillRect(enemy.x + enemy.w - 10, enemy.y, 4, 6);
    ctx.fillRect(enemy.x, enemy.y + enemy.h - 6, 8, 6);
    ctx.fillRect(enemy.x + enemy.w - 8, enemy.y + enemy.h - 6, 8, 6);
  } else {
    ctx.fillRect(enemy.x + 4, enemy.y + 4, enemy.w - 8, enemy.h - 8);
    ctx.fillRect(enemy.x + 8, enemy.y, 4, 8);
    ctx.fillRect(enemy.x + enemy.w - 12, enemy.y, 4, 8);
    ctx.fillRect(enemy.x + 2, enemy.y + enemy.h - 4, 8, 4);
    ctx.fillRect(enemy.x + enemy.w - 10, enemy.y + enemy.h - 4, 8, 4);
  }
  ctx.shadowBlur = 0;
}

function drawPixelHeart(x, y, scale, color) {
  const heartPixels = [
    [1, 0], [2, 0], [4, 0], [5, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4],
    [3, 5]
  ];

  ctx.fillStyle = color;
  for (const [px, py] of heartPixels) {
    ctx.fillRect(x + px * scale, y + py * scale, scale, scale);
  }
}

function drawPowerUp(powerUp) {
  const colors = { rapid: '#00ff88', shield: '#66d9ff', heart: '#ff6f9d' };
  const color = colors[powerUp.type];
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(powerUp.x, powerUp.y, powerUp.w, powerUp.h);

  if (powerUp.type === 'heart') {
    drawPixelHeart(powerUp.x + 4, powerUp.y + 2, 2, color);
  } else if (powerUp.type === 'shield') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(powerUp.x + powerUp.w / 2, powerUp.y + 4);
    ctx.lineTo(powerUp.x + powerUp.w - 4, powerUp.y + 8);
    ctx.lineTo(powerUp.x + powerUp.w - 6, powerUp.y + powerUp.h - 4);
    ctx.lineTo(powerUp.x + powerUp.w / 2, powerUp.y + powerUp.h - 2);
    ctx.lineTo(powerUp.x + 6, powerUp.y + powerUp.h - 4);
    ctx.lineTo(powerUp.x + 4, powerUp.y + 8);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('R', powerUp.x + powerUp.w / 2, powerUp.y + 14);
    ctx.textAlign = 'left';
  }
  ctx.restore();
}

function drawBoss() {
  if (!boss.active) return;

  ctx.save();
  ctx.fillStyle = '#ff2f7d';
  ctx.shadowBlur = 16;
  ctx.shadowColor = '#ff2f7d';
  ctx.fillRect(boss.x + 18, boss.y + 12, boss.w - 36, 22);
  ctx.fillRect(boss.x + 10, boss.y + 24, boss.w - 20, 16);
  ctx.fillRect(boss.x + boss.w / 2 - 12, boss.y + 2, 24, 14);
  ctx.fillRect(boss.x + 18, boss.y + 40, 18, 12);
  ctx.fillRect(boss.x + boss.w - 36, boss.y + 40, 18, 12);
  ctx.fillStyle = '#ffc6da';
  ctx.fillRect(boss.x + 38, boss.y + 26, 12, 6);
  ctx.fillRect(boss.x + boss.w - 50, boss.y + 26, 12, 6);
  ctx.restore();

  const barWidth = 180;
  const ratio = boss.hp / boss.maxHp;
  const barX = canvas.width / 2 - barWidth / 2;
  const barY = 18;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(barX, barY, barWidth, 8);
  ctx.fillStyle = '#ff5f98';
  ctx.fillRect(barX, barY, barWidth * ratio, 8);
  ctx.strokeStyle = 'rgba(255,95,152,0.5)';
  ctx.strokeRect(barX, barY, barWidth, 8);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (showingLevelScreen) {
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff88';
    ctx.font = `bold ${Math.floor(canvas.width / 20)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(`— NIVEL ${level} —`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = `${Math.floor(canvas.width / 40)}px Courier New`;
    ctx.fillStyle = '#aaa';
    ctx.fillText(shouldSpawnBossForLevel(level) ? 'Se viene algo serio...' : 'Prepárate...', canvas.width / 2, canvas.height / 2 + 24);
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
    return;
  }

  ctx.fillStyle = '#00cc44';
  shields.forEach(shield => {
    if (shield.alive) ctx.fillRect(shield.x, shield.y, shield.w, shield.h);
  });

  powerUps.forEach(drawPowerUp);

  if (!player.hit || Math.floor(frameCount / 5) % 2 === 0) {
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00ff88';
    ctx.fillRect(player.x + 8, player.y + 8, player.w - 16, player.h - 8);
    ctx.fillRect(player.x + player.w / 2 - 3, player.y, 6, 10);
    ctx.fillRect(player.x, player.y + 12, 10, 8);
    ctx.fillRect(player.x + player.w - 10, player.y + 12, 10, 8);
    ctx.shadowBlur = 0;
  }

  if (shieldCharges > 0) {
    ctx.strokeStyle = 'rgba(102,224,255,0.95)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#66e0ff';
    ctx.strokeRect(player.x - 4, player.y - 4, player.w + 8, player.h + 8);
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = '#ffff00';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#ffff00';
  playerBullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h));
  ctx.shadowBlur = 0;

  enemyBullets.forEach(bullet => {
    ctx.fillStyle = bullet.fromBoss ? '#ff2f7d' : '#ff6600';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });

  enemies.forEach(enemy => {
    if (enemy.alive) drawAlien(enemy);
  });

  if (ufo.active) {
    ctx.fillStyle = '#ff0066';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff0066';
    ctx.fillRect(ufo.x + 10, ufo.y + 6, ufo.w - 20, ufo.h - 10);
    ctx.fillRect(ufo.x, ufo.y + 12, ufo.w, 8);
    ctx.fillRect(ufo.x + ufo.w / 2 - 6, ufo.y, 12, 8);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffaacc';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('150', ufo.x + ufo.w / 2, ufo.y - 2);
    ctx.textAlign = 'left';
  }

  drawBoss();

  for (const text of floatingTexts) {
    ctx.globalAlpha = text.timer / text.maxTimer;
    ctx.fillStyle = text.color;
    ctx.font = `bold ${Math.floor(canvas.width / 55)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(text.text, text.x, text.y);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  for (const explosion of explosions) {
    const ratio = explosion.timer / explosion.maxTimer;
    ctx.fillStyle = `rgba(255,${Math.floor(200 * ratio)},0,${ratio})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff8800';
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, ((1 - ratio) * explosion.radius + 6) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (combo > 1 && comboTimer > 0) {
    ctx.globalAlpha = Math.min(1, comboTimer / 30);
    ctx.fillStyle = '#ff8800';
    ctx.font = `bold ${Math.floor(canvas.width / 35)}px Courier New`;
    ctx.textAlign = 'right';
    ctx.fillText(`COMBO x${combo}`, canvas.width - 8, canvas.height - 8);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
}

function loop(timestamp = performance.now()) {
  if (paused) return;
  if (!lastFrameTime) lastFrameTime = timestamp;
  lastDeltaMs = Math.min(50, Math.max(8, timestamp - lastFrameTime));
  lastFrameTime = timestamp;
  update();
  draw();
  if (running) requestAnimationFrame(loop);
}

function saveScore(entry) {
  scoreHistory.unshift(entry);
  scoreHistory = scoreHistory.slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(scoreHistory));
  if (entry.score > highscore) {
    highscore = entry.score;
    highscoreEl.textContent = highscore;
    localStorage.setItem('si_hs', String(highscore));
  }
}

function updateAggregateStats(entry) {
  aggregateStats.gamesPlayed += 1;
  aggregateStats.totalScore += entry.score;
  aggregateStats.totalShots += entry.shots;
  aggregateStats.totalHits += entry.hits;
  aggregateStats.totalEnemiesDestroyed += entry.enemiesDestroyed;
  aggregateStats.totalUfoDestroyed += entry.ufoDestroyed;
  aggregateStats.totalPowerUpsCollected += entry.powerUpsCollected;
  aggregateStats.totalBossesDefeated += entry.bossesDefeated;
  aggregateStats.bestLevel = Math.max(aggregateStats.bestLevel, entry.level);
  aggregateStats.bestCombo = Math.max(aggregateStats.bestCombo, entry.maxCombo);
  aggregateStats.totalTimeMs += entry.durationMs;
  saveAggregateStats();
}

function gameOver(reason = 'defeat') {
  if (!running) return;
  running = false;
  paused = false;
  resetBoss();
  playerBullets.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;

  const durationMs = Math.max(0, Date.now() - currentRunStats.startedAt);
  const entry = {
    score,
    level,
    accuracy: getAccuracyPercent(currentRunStats.shots, currentRunStats.hits),
    shots: currentRunStats.shots,
    hits: currentRunStats.hits,
    enemiesDestroyed: currentRunStats.enemiesDestroyed,
    ufoDestroyed: currentRunStats.ufoDestroyed,
    powerUpsCollected: currentRunStats.powerUpsCollected,
    bossesDefeated: currentRunStats.bossesDefeated,
    maxCombo: currentRunStats.maxCombo,
    difficulty: currentRunStats.difficulty,
    mode: currentRunStats.mode,
    playedAt: new Date().toISOString(),
    durationMs,
    reason
  };

  saveScore(entry);
  updateAggregateStats(entry);
  setOverlayMode('gameover', entry);
  updateHudStatus();
}

function startGame() {
  const preset = getDifficultyConfig();
  currentRunStats = createRunStats();
  currentRunStats.startedAt = Date.now();
  currentRunStats.difficulty = gameSettings.difficulty;
  currentRunStats.mode = gameSettings.mode;

  score = 0;
  lives = Math.min(MAX_LIVES, preset.startLives);
  level = 1;
  timeLeftMs = gameSettings.mode === 'timeattack' ? TIME_ATTACK_DURATION_MS : 0;
  shieldCharges = 0;
  activeEffects.rapid = 0;
  combo = 0;
  comboTimer = 0;
  paused = false;
  invincibleTimer = 0;
  frameCount = 0;
  enemyShootTimer = 0;
  playerShotCooldown = 0;
  autoShootTimer = 0;
  showingLevelScreen = false;
  levelScreenTimer = 0;
  musicStep = 0;
  ufo.active = false;
  ufoSpawnTimer = 0;
  bossEncounteredThisLevel = false;
  heartbeatTimer = 0;
  heartbeatIdx = 0;
  playerBullets.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;
  explosions.length = 0;
  floatingTexts.length = 0;
  resetBoss();

  scoreEl.textContent = '0';
  levelEl.textContent = '1';
  player.x = canvas.width / 2 - player.w / 2;
  player.hit = false;
  player.speed = preset.playerSpeed;

  updateLivesUI();
  spawnEnemies();
  buildShields();
  overlay.classList.remove('visible');
  overlayMode = 'start';
  updateHudStatus();

  running = true;
  lastFrameTime = performance.now();
  loop(lastFrameTime);
}

applySettingsUI();
updateMusicUI();
updateFullscreenUI();
updateLivesUI();
updateHudStatus();
setOverlayMode('start');
draw();

window._touchActive = false;

function addTouchBtn(id, onStart, onEnd) {
  const button = document.getElementById(id);
  if (!button) return;
  ['touchstart', 'mousedown'].forEach(eventName => button.addEventListener(eventName, event => {
    event.preventDefault();
    initAudio();
    onStart();
  }, { passive: false }));
  ['touchend', 'mouseup', 'mouseleave'].forEach(eventName => button.addEventListener(eventName, event => {
    event.preventDefault();
    onEnd();
  }, { passive: false }));
}

addTouchBtn('btn-left', () => {
  keys.ArrowLeft = true;
  window._touchActive = true;
}, () => {
  keys.ArrowLeft = false;
  window._touchActive = !!keys.ArrowRight;
});

addTouchBtn('btn-right', () => {
  keys.ArrowRight = true;
  window._touchActive = true;
}, () => {
  keys.ArrowRight = false;
  window._touchActive = !!keys.ArrowLeft;
});

addTouchBtn('btn-fire', () => shoot(), () => {});
