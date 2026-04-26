// =====================
//  Space Invaders v3.0
// =====================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bodyEl = document.body;
const gameWrapper = document.getElementById('game-wrapper');
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
const skinSelect = document.getElementById('skin-select');
const difficultySelect = document.getElementById('difficulty-select');
const modeSelect = document.getElementById('mode-select');
const vibrationToggle = document.getElementById('toggle-vibration');
const reducedEffectsToggle = document.getElementById('toggle-reduced-effects');
const highContrastToggle = document.getElementById('toggle-high-contrast');
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
const metaPanel = document.getElementById('meta-panel');
const statsSummaryEl = document.getElementById('stats-summary');
const statsHistoryEl = document.getElementById('stats-history');
const challengeSummaryEl = document.getElementById('challenge-summary');
const achievementSummaryEl = document.getElementById('achievement-summary');

const SETTINGS_KEY = 'si_settings';
const HISTORY_KEY = 'si_history';
const AGGREGATE_STATS_KEY = 'si_stats';
const META_KEY = 'si_meta';
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

const SKIN_THEMES = {
  classic: {
    label: 'NEON',
    player: '#00ff88',
    playerBullet: '#ffff00',
    enemyRows: ['#ff44cc', '#4488ff', '#ff8844'],
    ufo: '#ff0066',
    shield: '#00cc44',
    drone: '#7dffdb',
    accent: '#00ff88'
  },
  aurora: {
    label: 'AURORA',
    player: '#66e0ff',
    playerBullet: '#d9ff7d',
    enemyRows: ['#9a6cff', '#66e0ff', '#ffd966'],
    ufo: '#ff7dd1',
    shield: '#3ed4a8',
    drone: '#c8f7ff',
    accent: '#66e0ff'
  },
  crimson: {
    label: 'CRIMSON',
    player: '#ff7b6e',
    playerBullet: '#ffe06e',
    enemyRows: ['#ff5f98', '#ff8c42', '#ffd15c'],
    ufo: '#ff2f68',
    shield: '#44c47e',
    drone: '#ffc7b0',
    accent: '#ff5f98'
  }
};

const ACHIEVEMENT_DEFS = {
  first_boss: { title: 'PRIMER BOSS', copy: 'Derrota tu primer boss.' },
  combo_8: { title: 'COMBO X8', copy: 'Alcanza un combo de x8 o superior.' },
  level_5: { title: 'NIVEL 5', copy: 'Llega al nivel 5.' },
  sharpshooter: { title: 'FRANCOTIRADOR', copy: 'Termina una partida con 70% de precision y 35 disparos o mas.' },
  challenge_streak: { title: 'OPERATIVO', copy: 'Completa 3 desafios activos.' }
};

const CHALLENGE_DEFS = [
  {
    id: 'ufo_hunter',
    title: 'CAZADOR UFO',
    copy: 'Destruye 2 UFO en una sola partida.',
    progressText: run => `${Math.min(run.ufoDestroyed, 2)}/2 UFO`,
    isComplete: run => run.ufoDestroyed >= 2
  },
  {
    id: 'combo_rush',
    title: 'RACHA DE COMBATE',
    copy: 'Alcanza un combo x6 en la partida activa.',
    progressText: run => `COMBO x${Math.min(run.maxCombo, 6)}/x6`,
    isComplete: run => run.maxCombo >= 6
  },
  {
    id: 'marksman',
    title: 'PUNTERIA FINA',
    copy: 'Cierra la partida con 65% de precision y 30 disparos o mas.',
    progressText: run => `${getAccuracyPercent(run.shots, run.hits)}% · ${run.shots}/30`,
    isComplete: run => run.shots >= 30 && getAccuracyPercent(run.shots, run.hits) >= 65
  }
];

function normalizeDifficulty(value) {
  return Object.prototype.hasOwnProperty.call(DIFFICULTY_PRESETS, value) ? value : 'normal';
}

function normalizeGameMode(value) {
  return value === 'timeattack' ? 'timeattack' : 'classic';
}

function normalizeSkin(value) {
  return Object.prototype.hasOwnProperty.call(SKIN_THEMES, value) ? value : 'classic';
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return {
      difficulty: normalizeDifficulty(stored.difficulty),
      mode: normalizeGameMode(stored.mode),
      skin: normalizeSkin(stored.skin),
      vibration: stored.vibration !== false,
      reducedEffects: stored.reducedEffects === true,
      highContrast: stored.highContrast === true
    };
  } catch {
    return { difficulty: 'normal', mode: 'classic', skin: 'classic', vibration: true, reducedEffects: false, highContrast: false };
  }
}

function loadMetaState() {
  try {
    const stored = JSON.parse(localStorage.getItem(META_KEY) || '{}');
    const unlockedSkins = Array.isArray(stored.unlockedSkins)
      ? stored.unlockedSkins.map(normalizeSkin).filter((value, index, array) => array.indexOf(value) === index)
      : ['classic'];
    if (!unlockedSkins.includes('classic')) unlockedSkins.unshift('classic');
    return {
      unlockedSkins,
      achievements: stored.achievements && typeof stored.achievements === 'object' ? stored.achievements : {},
      completedChallenges: stored.completedChallenges && typeof stored.completedChallenges === 'object' ? stored.completedChallenges : {},
      challengeCompletions: Math.max(0, Number(stored.challengeCompletions) || 0),
      latestUnlock: typeof stored.latestUnlock === 'string' ? stored.latestUnlock : ''
    };
  } catch {
    return {
      unlockedSkins: ['classic'],
      achievements: {},
      completedChallenges: {},
      challengeCompletions: 0,
      latestUnlock: ''
    };
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
    mode: gameSettings.mode,
    challengeId: currentChallenge?.id || 'ufo_hunter'
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
  refreshSkinOptions();
  skinSelect.value = gameSettings.skin;
  vibrationToggle.checked = gameSettings.vibration;
  reducedEffectsToggle.checked = gameSettings.reducedEffects;
  highContrastToggle.checked = gameSettings.highContrast;
  applyVisualPreferences();
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

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentChallengeDefinition() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return CHALLENGE_DEFS[dayOfYear % CHALLENGE_DEFS.length];
}

function getChallengeStamp(challengeId = currentChallenge.id) {
  return `${getLocalDateKey()}:${challengeId}`;
}

function getCurrentTheme() {
  return SKIN_THEMES[gameSettings.skin] || SKIN_THEMES.classic;
}

function persistMetaState() {
  localStorage.setItem(META_KEY, JSON.stringify(metaState));
}

function sanitizeSelectedSkin() {
  if (!metaState.unlockedSkins.includes(gameSettings.skin)) {
    gameSettings.skin = 'classic';
    persistGameSettings();
  }
}

function applyVisualPreferences() {
  bodyEl.dataset.skin = gameSettings.skin;
  bodyEl.classList.toggle('high-contrast', gameSettings.highContrast);
  bodyEl.classList.toggle('reduced-effects', gameSettings.reducedEffects);
}

function refreshSkinOptions() {
  const selected = gameSettings.skin;
  skinSelect.innerHTML = Object.entries(SKIN_THEMES).map(([key, theme]) => {
    const unlocked = metaState.unlockedSkins.includes(key);
    return `<option value="${key}"${unlocked ? '' : ' disabled'}>${theme.label}${unlocked ? '' : ' · BLOQUEADA'}</option>`;
  }).join('');
  skinSelect.value = metaState.unlockedSkins.includes(selected) ? selected : 'classic';
}

function getChallengeProgressText(runStats = currentRunStats) {
  return currentChallenge.progressText(runStats);
}

function isCurrentChallengeComplete(runStats = currentRunStats) {
  return currentChallenge.isComplete(runStats);
}

function awardAchievement(id) {
  if (metaState.achievements[id]) return false;
  metaState.achievements[id] = true;
  metaState.latestUnlock = ACHIEVEMENT_DEFS[id].title;
  persistMetaState();
  spawnFloatingText(canvas.width / 2, canvas.height * 0.28, ACHIEVEMENT_DEFS[id].title, '#ffef88');
  spawnShockwave(canvas.width / 2, canvas.height * 0.28, 'rgba(255,239,136,0.38)', 18, 3.2);
  spawnParticleBurst(canvas.width / 2, canvas.height * 0.28, {
    count: 18,
    color: '#ffef88',
    speedMin: 1.5,
    speedMax: 4.4,
    lifeMin: 24,
    lifeMax: 36
  });
  addScreenShake(3);
  return true;
}

function unlockSkin(id) {
  if (metaState.unlockedSkins.includes(id)) return false;
  metaState.unlockedSkins.push(id);
  metaState.latestUnlock = `SKIN ${SKIN_THEMES[id].label}`;
  persistMetaState();
  refreshSkinOptions();
  spawnFloatingText(canvas.width / 2, canvas.height * 0.34, SKIN_THEMES[id].label, '#ffffff');
  triggerCinematicFlash(0.08);
  return true;
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
  if (activeEffects.freeze > 0) labels.push(`FREEZE ${Math.ceil(activeEffects.freeze / 1000)}s`);
  if (activeEffects.piercing > 0) labels.push(`PIERCE ${Math.ceil(activeEffects.piercing / 1000)}s`);
  if (activeEffects.drone > 0) labels.push(`DRONES ${Math.ceil(activeEffects.drone / 1000)}s`);
  powerupStatusEl.textContent = labels.length ? labels.join(' · ') : 'SIN POWER-UPS';

  bossStatusEl.hidden = !boss.active;
  if (boss.active) bossStatusEl.textContent = `BOSS ${boss.hp}/${boss.maxHp}`;
  gameWrapper.classList.toggle('is-boss-fight', boss.active);
  gameWrapper.classList.toggle('is-critical-time', activeMode === 'timeattack' && running && timeLeftMs <= 15000);
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

function renderMetaPanel() {
  const unlockedAchievements = Object.keys(metaState.achievements).filter(id => metaState.achievements[id]);
  const challengeCompleted = !!metaState.completedChallenges[getChallengeStamp()];
  challengeSummaryEl.innerHTML = `
    <div class="challenge-box">
      <div class="challenge-line">
        <strong class="challenge-title">${currentChallenge.title}</strong>
        <span class="challenge-copy">${currentChallenge.copy}</span>
        <span class="challenge-progress${challengeCompleted ? ' is-complete' : ''}">${challengeCompleted ? 'COMPLETADO HOY' : getChallengeProgressText()}</span>
      </div>
      <div class="challenge-line">
        <strong class="challenge-title">SKINS</strong>
        <span class="challenge-copy">${metaState.unlockedSkins.map(id => SKIN_THEMES[id].label).join(' · ')}</span>
        <span class="challenge-progress">ACTIVA ${SKIN_THEMES[gameSettings.skin].label}</span>
      </div>
    </div>
  `;

  const latestAchievements = Object.keys(ACHIEVEMENT_DEFS).slice(0, 5).map(id => {
    const unlocked = !!metaState.achievements[id];
    return `
      <div class="achievement-line">
        <strong class="achievement-title">${ACHIEVEMENT_DEFS[id].title}</strong>
        <span class="achievement-copy">${ACHIEVEMENT_DEFS[id].copy}</span>
        <span class="achievement-meta${unlocked ? ' is-unlocked' : ''}">${unlocked ? 'DESBLOQUEADO' : 'PENDIENTE'}</span>
      </div>
    `;
  }).join('');

  achievementSummaryEl.innerHTML = `
    <div class="achievement-box">
      <div class="achievement-line">
        <strong class="achievement-title">LOGROS</strong>
        <span class="achievement-copy">${unlockedAchievements.length}/${Object.keys(ACHIEVEMENT_DEFS).length} desbloqueados</span>
        <span class="achievement-meta">${metaState.latestUnlock || 'SIN NUEVOS DESBLOQUEOS'}</span>
      </div>
      ${latestAchievements}
    </div>
  `;
}

function completeCurrentChallengeIfNeeded() {
  const stamp = getChallengeStamp();
  if (!metaState.completedChallenges[stamp] && isCurrentChallengeComplete()) {
    metaState.completedChallenges[stamp] = true;
    metaState.challengeCompletions += 1;
    metaState.latestUnlock = currentChallenge.title;
    persistMetaState();
    spawnFloatingText(canvas.width / 2, canvas.height * 0.24, currentChallenge.title, '#9ed8ff');
    spawnShockwave(canvas.width / 2, canvas.height * 0.24, 'rgba(158,216,255,0.34)', 16, 2.8);
    spawnParticleBurst(canvas.width / 2, canvas.height * 0.24, {
      count: 16,
      color: '#9ed8ff',
      speedMin: 1.4,
      speedMax: 4.0,
      lifeMin: 20,
      lifeMax: 34
    });
    if (metaState.challengeCompletions >= 3) {
      awardAchievement('challenge_streak');
    }
    renderMetaPanel();
  }
}

function checkMidRunMilestones() {
  if (currentRunStats.maxCombo >= 8) {
    if (awardAchievement('combo_8')) unlockSkin('crimson');
  }
  if (level >= 5) {
    awardAchievement('level_5');
  }
  completeCurrentChallengeIfNeeded();
}

function setOverlayMode(mode, entry = null) {
  overlayMode = mode;
  overlay.dataset.mode = mode;
  renderStatsPanel();
  renderMetaPanel();

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
    setPanelVisibility(metaPanel, true);
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
    setPanelVisibility(metaPanel, true);
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
    setPanelVisibility(metaPanel, true);
  }

  overlay.classList.add('visible');
}

let gameSettings = loadSettings();
let metaState = loadMetaState();
sanitizeSelectedSkin();
let currentChallenge = getCurrentChallengeDefinition();
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
let screenShake = 0;
let cinematicFlash = 0;

const activeEffects = { rapid: 0, freeze: 0, piercing: 0, drone: 0 };
const player = { x: 0, y: canvas.height - 60, w: 40, h: 20, speed: 5, hit: false };
const particles = [];
const shockwaves = [];
const stars = Array.from({ length: 52 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() < 0.18 ? 2 : 1,
  alpha: 0.2 + Math.random() * 0.5,
  speed: 0.08 + Math.random() * 0.35,
  tint: ['#00ff88', '#66e0ff', '#ffd966'][Math.floor(Math.random() * 3)]
}));

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
skinSelect.addEventListener('change', event => {
  const nextSkin = normalizeSkin(event.target.value);
  if (!metaState.unlockedSkins.includes(nextSkin)) {
    refreshSkinOptions();
    return;
  }
  gameSettings.skin = nextSkin;
  persistGameSettings();
  applySettingsUI();
  renderMetaPanel();
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
reducedEffectsToggle.addEventListener('change', event => {
  gameSettings.reducedEffects = !!event.target.checked;
  persistGameSettings();
  applySettingsUI();
});
highContrastToggle.addEventListener('change', event => {
  gameSettings.highContrast = !!event.target.checked;
  persistGameSettings();
  applySettingsUI();
});
document.addEventListener('fullscreenchange', updateFullscreenUI);

const playerBullets = [];
let playerShotCooldown = 0;
let autoShootTimer = 0;

function getPlayerBulletLimit() {
  if (activeEffects.drone > 0) return 4;
  return activeEffects.rapid > 0 ? 2 : 1;
}

function getPlayerShotCooldown() {
  return activeEffects.rapid > 0 ? RAPID_FIRE_COOLDOWN : PLAYER_BASE_COOLDOWN;
}

function shoot() {
  if (!running || showingLevelScreen || paused) return;
  if (playerShotCooldown > 0 || playerBullets.length >= getPlayerBulletLimit()) return;

  const baseSpeed = activeEffects.rapid > 0 ? 10.5 : 9;
  const piercingShots = activeEffects.piercing > 0 ? 3 : 1;
  playerBullets.push({
    x: player.x + player.w / 2 - 2,
    y: player.y,
    w: 4,
    h: 14,
    speed: baseSpeed,
    pierces: piercingShots,
    source: 'player'
  });

  if (activeEffects.drone > 0) {
    const droneOffsets = [-18, 18];
    for (const offset of droneOffsets) {
      playerBullets.push({
        x: player.x + player.w / 2 - 2 + offset,
        y: player.y + 6,
        w: 4,
        h: 12,
        speed: baseSpeed - 0.6,
        pierces: activeEffects.piercing > 0 ? 2 : 1,
        source: 'drone'
      });
    }
  }

  playerShotCooldown = getPlayerShotCooldown();
  currentRunStats.shots++;
  soundShoot();
}

const enemyBullets = [];
let enemyShootTimer = 0;

function getFreezeFactor() {
  return activeEffects.freeze > 0 ? 0.38 : 1;
}

function getEnemyShootInterval() {
  const preset = getDifficultyConfig();
  return Math.max(36, Math.round((110 - (level - 1) * 10) * preset.enemyShootFactor * (activeEffects.freeze > 0 ? 2.25 : 1)));
}

const explosions = [];
const floatingTexts = [];

function spawnExplosion(x, y, radius = 20) {
  explosions.push({ x, y, timer: 20, maxTimer: 20, radius });
}

function spawnFloatingText(x, y, text, color) {
  floatingTexts.push({ x, y, text, color, timer: 50, maxTimer: 50 });
}

function spawnParticleBurst(x, y, {
  count = 10,
  color = '#ff8800',
  spread = Math.PI * 2,
  speedMin = 1.4,
  speedMax = 4.4,
  sizeMin = 1,
  sizeMax = 3,
  gravity = 0.02,
  lifeMin = 18,
  lifeMax = 34,
  drag = 0.97
} = {}) {
  const scaledCount = Math.max(2, Math.round(count * (gameSettings.reducedEffects ? 0.45 : 1)));
  for (let i = 0; i < scaledCount; i++) {
    const angle = (spread === Math.PI * 2 ? Math.random() * spread : -spread / 2 + Math.random() * spread) - Math.PI / 2;
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    const life = lifeMin + Math.random() * (lifeMax - lifeMin);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      color,
      gravity,
      drag,
      life,
      maxLife: life
    });
  }
}

function spawnShockwave(x, y, color = 'rgba(0,255,136,0.4)', radius = 18, grow = 2.2) {
  if (gameSettings.reducedEffects) {
    radius *= 0.78;
    grow *= 0.82;
  }
  shockwaves.push({
    x,
    y,
    radius,
    grow,
    life: 18,
    maxLife: 18,
    color
  });
}

function addScreenShake(amount = 8) {
  const adjusted = gameSettings.reducedEffects ? amount * 0.35 : amount;
  screenShake = Math.min(18, screenShake + adjusted);
}

function triggerCinematicFlash(amount = 0.16) {
  const adjusted = gameSettings.reducedEffects ? amount * 0.35 : amount;
  cinematicFlash = Math.min(0.28, cinematicFlash + adjusted);
}

const powerUps = [];

function rollPowerUpType() {
  const pool = lives < MAX_LIVES
    ? ['rapid', 'shield', 'heart', 'freeze', 'piercing', 'drone']
    : ['rapid', 'shield', 'freeze', 'piercing', 'drone', 'shield'];
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
  addScreenShake(2.5);
  triggerCinematicFlash(0.08);
  spawnShockwave(powerUp.x + powerUp.w / 2, powerUp.y + powerUp.h / 2, 'rgba(0,255,136,0.45)', 12, 2.8);
  spawnParticleBurst(powerUp.x + powerUp.w / 2, powerUp.y + powerUp.h / 2, {
    count: 14,
    color: powerUp.type === 'heart' ? '#ff6f9d' : powerUp.type === 'shield' ? '#66d9ff' : '#00ff88',
    speedMin: 1.1,
    speedMax: 3.5,
    lifeMin: 20,
    lifeMax: 38
  });

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
  } else if (powerUp.type === 'freeze') {
    activeEffects.freeze = 7000;
    spawnFloatingText(player.x + player.w / 2, player.y - 10, 'FREEZE', '#9ed8ff');
  } else if (powerUp.type === 'piercing') {
    activeEffects.piercing = 9000;
    spawnFloatingText(player.x + player.w / 2, player.y - 10, 'PIERCE', '#ffd966');
  } else if (powerUp.type === 'drone') {
    activeEffects.drone = 10000;
    spawnFloatingText(player.x + player.w / 2, player.y - 10, 'DRONES', '#ffd9f9');
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
  boss.entryTimer = 0;
  boss.flashTimer = 0;
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
  return Math.max(3, Math.round(base * preset.enemyTickFactor * (alive / TOTAL_ENEMIES) * (activeEffects.freeze > 0 ? 2.4 : 1)));
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
  boss.entryTimer = 84;
  boss.flashTimer = 0;
  boss.x = canvas.width / 2 - boss.w / 2;
  boss.y = -boss.h - 24;
  playerBullets.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;
  spawnFloatingText(canvas.width / 2, 92, 'BOSS FIGHT', '#ff7db3');
  spawnShockwave(canvas.width / 2, canvas.height * 0.32, 'rgba(255,70,135,0.32)', 26, 3.8);
  spawnParticleBurst(canvas.width / 2, canvas.height * 0.32, {
    count: 22,
    color: '#ff5f98',
    speedMin: 1.8,
    speedMax: 5.2,
    lifeMin: 24,
    lifeMax: 42
  });
  addScreenShake(10);
  triggerCinematicFlash(0.18);
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
  if (awardAchievement('first_boss')) unlockSkin('aurora');
  score += 500 + level * 50;
  scoreEl.textContent = score;
  syncHighscore();
  spawnExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, 36);
  spawnShockwave(boss.x + boss.w / 2, boss.y + boss.h / 2, 'rgba(255,95,152,0.55)', 30, 4.6);
  spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, {
    count: 30,
    color: '#ff6fa8',
    speedMin: 2.2,
    speedMax: 6.2,
    lifeMin: 26,
    lifeMax: 48
  });
  spawnFloatingText(boss.x + boss.w / 2, boss.y - 4, `+${500 + level * 50}`, '#ff7db3');
  awardTimeBonus(TIME_ATTACK_BOSS_BONUS_MS);
  addScreenShake(14);
  triggerCinematicFlash(0.22);
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
        spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, {
          count: 9,
          color: enemy.row === 0 ? '#ff44cc' : enemy.row === 1 ? '#4488ff' : '#ff8844',
          speedMin: 1.4,
          speedMax: 4.3,
          lifeMin: 16,
          lifeMax: 30
        });
        spawnShockwave(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 'rgba(255,180,80,0.22)', 10, 2.5);
        spawnFloatingText(enemy.x + enemy.w / 2, enemy.y, `${combo > 1 ? `x${combo} ` : ''}+${points}`, combo > 1 ? '#ff8800' : '#ffff00');
        maybeDropPowerUp(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
        addScreenShake(combo > 2 ? 4 : 2);
        soundHit();
        bullet.pierces -= 1;
        bullet.y -= 8;
        if (bullet.pierces <= 0) {
          playerBullets.splice(index, 1);
        }
        break;
      }
    }

    if (!hit && boss.active && rectsOverlap(bullet, boss)) {
      hit = true;
      currentRunStats.hits++;
      score += 25;
      scoreEl.textContent = score;
      syncHighscore();
      boss.hp = Math.max(0, boss.hp - 1);
      boss.flashTimer = 5;
      spawnExplosion(bullet.x, bullet.y, 12);
      spawnParticleBurst(bullet.x, bullet.y, {
        count: 7,
        color: '#ff88b8',
        speedMin: 1.2,
        speedMax: 3.2,
        lifeMin: 14,
        lifeMax: 26
      });
      spawnFloatingText(boss.x + boss.w / 2, boss.y - 6, '-1', '#ffb3d1');
      addScreenShake(1.6);
      soundHit();
      updateHudStatus();
      bullet.pierces -= 1;
      bullet.y -= 10;
      if (bullet.pierces <= 0) {
        playerBullets.splice(index, 1);
      }
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
      spawnParticleBurst(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2, {
        count: 12,
        color: '#ff66cc',
        speedMin: 1.6,
        speedMax: 4.6,
        lifeMin: 18,
        lifeMax: 34
      });
      spawnFloatingText(ufo.x + ufo.w / 2, ufo.y, '+150', '#ff66cc');
      ufo.active = false;
      hit = true;
      addScreenShake(4);
      soundHit();
      bullet.pierces = 0;
      playerBullets.splice(index, 1);
    }

    if (!hit) {
      for (const shield of shields) {
        if (!shield.alive) continue;
        if (rectsOverlap(bullet, shield)) {
          shield.alive = false;
          spawnParticleBurst(shield.x + shield.w / 2, shield.y + shield.h / 2, {
            count: 5,
            color: '#18c65a',
            speedMin: 0.8,
            speedMax: 2.4,
            lifeMin: 12,
            lifeMax: 22
          });
          bullet.pierces -= 1;
          bullet.y -= 6;
          if (bullet.pierces <= 0) {
            playerBullets.splice(index, 1);
          }
          break;
        }
      }
    }
  }
}

function updateBoss() {
  if (!boss.active) return;
  const freezeFactor = getFreezeFactor();

  if (boss.entryTimer > 0) {
    boss.entryTimer--;
    boss.y += (70 - boss.y) * 0.12;
    boss.phase += 0.05 * freezeFactor;
    boss.flashTimer = Math.max(0, (boss.flashTimer || 0) - 1);
    if (boss.entryTimer === 0) {
      spawnShockwave(boss.x + boss.w / 2, boss.y + boss.h / 2, 'rgba(255,95,152,0.4)', 20, 3.4);
      addScreenShake(8);
      triggerCinematicFlash(0.1);
    }
    return;
  }

  boss.phase += 0.035 * freezeFactor;
  boss.x += boss.dir * boss.speed * freezeFactor;
  boss.y = 68 + Math.sin(boss.phase) * 10;
  boss.flashTimer = Math.max(0, (boss.flashTimer || 0) - 1);

  if (boss.x <= 18 || boss.x + boss.w >= canvas.width - 18) {
    boss.dir *= -1;
  }

  boss.shootTimer++;
  const preset = getDifficultyConfig();
  const shootInterval = Math.max(32, Math.round((72 * preset.enemyShootFactor - (boss.maxHp - boss.hp) * 1.2) * (activeEffects.freeze > 0 ? 2.35 : 1)));
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
  const freezeFactor = getFreezeFactor();
  for (let index = enemyBullets.length - 1; index >= 0; index--) {
    const bullet = enemyBullets[index];
    bullet.y += bullet.speed * freezeFactor;

    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
      continue;
    }

    let blocked = false;
    for (const shield of shields) {
      if (!shield.alive) continue;
      if (rectsOverlap(bullet, shield)) {
        shield.alive = false;
        spawnParticleBurst(shield.x + shield.w / 2, shield.y + shield.h / 2, {
          count: bullet.fromBoss ? 7 : 4,
          color: bullet.fromBoss ? '#ff5f98' : '#18c65a',
          speedMin: 0.8,
          speedMax: 2.8,
          lifeMin: 12,
          lifeMax: 22
        });
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

function updateVisualEffects() {
  screenShake *= 0.84;
  if (screenShake < 0.08) screenShake = 0;
  cinematicFlash *= 0.9;
  if (cinematicFlash < 0.01) cinematicFlash = 0;

  for (const star of stars) {
    star.y += star.speed + (boss.active ? 0.18 : 0.04);
    if (star.y > canvas.height + 2) {
      star.y = -2;
      star.x = Math.random() * canvas.width;
    }
  }

  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];
    particle.vx *= particle.drag;
    particle.vy = particle.vy * particle.drag + particle.gravity;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 1;
    if (particle.life <= 0) particles.splice(index, 1);
  }

  for (let index = shockwaves.length - 1; index >= 0; index--) {
    const shockwave = shockwaves[index];
    shockwave.radius += shockwave.grow;
    shockwave.life -= 1;
    if (shockwave.life <= 0) shockwaves.splice(index, 1);
  }
}

let lastDeltaMs = 16;

function update() {
  frameCount++;

  if (showingLevelScreen) {
    updateVisualEffects();
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

  for (const effectKey of Object.keys(activeEffects)) {
    if (activeEffects[effectKey] > 0) {
      activeEffects[effectKey] = Math.max(0, activeEffects[effectKey] - Math.min(50, lastDeltaMs));
    }
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
    ufo.x += ufo.dir * ufo.speed * getFreezeFactor();
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

  checkMidRunMilestones();
  updateVisualEffects();
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
    spawnShockwave(player.x + player.w / 2, player.y + player.h / 2, 'rgba(102,224,255,0.34)', 14, 2.6);
    spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, {
      count: 10,
      color: '#66e0ff',
      speedMin: 1.2,
      speedMax: 3.6,
      lifeMin: 18,
      lifeMax: 30
    });
    addScreenShake(3);
    updateHudStatus();
    return;
  }

  lives = Math.max(0, lives - 1);
  updateLivesUI();
  soundDeath();
  if (gameSettings.vibration && navigator.vibrate) navigator.vibrate([100, 50, 100]);
  spawnShockwave(player.x + player.w / 2, player.y + player.h / 2, 'rgba(255,95,140,0.42)', 18, 3.4);
  spawnParticleBurst(player.x + player.w / 2, player.y + player.h / 2, {
    count: 18,
    color: '#ff5f8c',
    speedMin: 1.5,
    speedMax: 4.8,
    lifeMin: 22,
    lifeMax: 38
  });
  addScreenShake(12);
  triggerCinematicFlash(0.14);
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
  const colors = getCurrentTheme().enemyRows;
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

function drawDronePods(theme) {
  if (activeEffects.drone <= 0) return;
  const pulse = Math.sin(frameCount * 0.16) * 2;
  const pods = [
    { x: player.x - 18, y: player.y + 4 + pulse },
    { x: player.x + player.w + 6, y: player.y + 4 - pulse }
  ];
  ctx.save();
  ctx.fillStyle = theme.drone;
  ctx.shadowBlur = 10;
  ctx.shadowColor = theme.drone;
  for (const pod of pods) {
    ctx.fillRect(pod.x + 3, pod.y + 3, 10, 6);
    ctx.fillRect(pod.x, pod.y + 7, 16, 5);
    ctx.fillRect(pod.x + 6, pod.y, 4, 4);
  }
  ctx.restore();
}

function drawPowerUp(powerUp) {
  const colors = {
    rapid: '#00ff88',
    shield: '#66d9ff',
    heart: '#ff6f9d',
    freeze: '#9ed8ff',
    piercing: '#ffd966',
    drone: '#f6b3ff'
  };
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
    const glyph = powerUp.type === 'rapid' ? 'R' : powerUp.type === 'freeze' ? 'T' : powerUp.type === 'piercing' ? 'P' : 'D';
    ctx.fillText(glyph, powerUp.x + powerUp.w / 2, powerUp.y + 14);
    ctx.textAlign = 'left';
  }
  ctx.restore();
}

function drawBoss() {
  if (!boss.active) return;

  ctx.save();
  const bossColor = boss.flashTimer > 0 ? '#ffe4ee' : '#ff2f7d';
  ctx.fillStyle = bossColor;
  ctx.shadowBlur = boss.entryTimer > 0 ? 26 : 16;
  ctx.shadowColor = boss.flashTimer > 0 ? '#ffffff' : '#ff2f7d';
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

  if (boss.entryTimer > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.65, boss.entryTimer / 84);
    ctx.fillStyle = 'rgba(255,40,120,0.12)';
    ctx.fillRect(0, boss.y + boss.h * 0.4, canvas.width, 28);
    ctx.restore();
  }
}

function draw() {
  const theme = getCurrentTheme();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const shakeX = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
  const shakeY = screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, boss.active ? '#06010a' : '#010707');
  sky.addColorStop(0.55, '#020b08');
  sky.addColorStop(1, '#000000');
  ctx.fillStyle = sky;
  ctx.fillRect(-24, -24, canvas.width + 48, canvas.height + 48);

  for (const star of stars) {
    ctx.globalAlpha = star.alpha * (boss.active ? 1.3 : 1);
    ctx.fillStyle = star.tint;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(0,255,136,0.045)';
  for (let row = 0; row < 8; row++) {
    ctx.fillRect(0, canvas.height - 170 + row * 20, canvas.width, 1);
  }

  if (showingLevelScreen) {
    ctx.fillStyle = theme.accent;
    ctx.shadowBlur = 20;
    ctx.shadowColor = theme.accent;
    ctx.font = `bold ${Math.floor(canvas.width / 20)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(`— NIVEL ${level} —`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = `${Math.floor(canvas.width / 40)}px Courier New`;
    ctx.fillStyle = '#aaa';
    ctx.fillText(shouldSpawnBossForLevel(level) ? 'Se viene algo serio...' : 'Prepárate...', canvas.width / 2, canvas.height / 2 + 24);
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
    ctx.restore();
    drawOverlayFx();
    return;
  }

  ctx.fillStyle = theme.shield;
  shields.forEach(shield => {
    if (shield.alive) ctx.fillRect(shield.x, shield.y, shield.w, shield.h);
  });

  powerUps.forEach(drawPowerUp);

  if (!player.hit || Math.floor(frameCount / 5) % 2 === 0) {
    ctx.fillStyle = theme.player;
    ctx.shadowBlur = 8;
    ctx.shadowColor = theme.player;
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

  drawDronePods(theme);

  ctx.shadowBlur = 6;
  playerBullets.forEach(bullet => {
    ctx.fillStyle = bullet.source === 'drone' ? theme.drone : theme.playerBullet;
    ctx.shadowColor = bullet.source === 'drone' ? theme.drone : theme.playerBullet;
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });
  ctx.shadowBlur = 0;

  enemyBullets.forEach(bullet => {
    ctx.fillStyle = bullet.fromBoss ? '#ff2f7d' : '#ff6600';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });

  enemies.forEach(enemy => {
    if (enemy.alive) drawAlien(enemy);
  });

  if (ufo.active) {
    ctx.fillStyle = theme.ufo;
    ctx.shadowBlur = 8;
    ctx.shadowColor = theme.ufo;
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

  if (boss.active && boss.entryTimer > 0) {
    ctx.globalAlpha = Math.min(0.9, boss.entryTimer / 84);
    ctx.fillStyle = '#ff7db3';
    ctx.font = `bold ${Math.floor(canvas.width / 18)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText('WARNING', canvas.width / 2, canvas.height * 0.28);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  ctx.restore();
  drawOverlayFx();
}

function drawOverlayFx() {
  for (const shockwave of shockwaves) {
    ctx.save();
    ctx.globalAlpha = shockwave.life / shockwave.maxLife;
    ctx.strokeStyle = shockwave.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  for (const particle of particles) {
    ctx.save();
    ctx.globalAlpha = particle.life / particle.maxLife;
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = 0.08 + (boss.active ? 0.03 : 0);
  ctx.fillStyle = '#b8ffd8';
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 1);
  }
  ctx.restore();

  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.15,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.7
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (cinematicFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${cinematicFlash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
  const finalAccuracy = getAccuracyPercent(currentRunStats.shots, currentRunStats.hits);
  if (currentRunStats.shots >= 35 && finalAccuracy >= 70) {
    awardAchievement('sharpshooter');
  }
  completeCurrentChallengeIfNeeded();
  const entry = {
    score,
    level,
    accuracy: finalAccuracy,
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
  currentChallenge = getCurrentChallengeDefinition();
  currentRunStats = createRunStats();
  currentRunStats.startedAt = Date.now();
  currentRunStats.difficulty = gameSettings.difficulty;
  currentRunStats.mode = gameSettings.mode;
  currentRunStats.challengeId = currentChallenge.id;

  score = 0;
  lives = Math.min(MAX_LIVES, preset.startLives);
  level = 1;
  timeLeftMs = gameSettings.mode === 'timeattack' ? TIME_ATTACK_DURATION_MS : 0;
  shieldCharges = 0;
  Object.keys(activeEffects).forEach(key => { activeEffects[key] = 0; });
  screenShake = 0;
  cinematicFlash = 0;
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
  particles.length = 0;
  shockwaves.length = 0;
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
