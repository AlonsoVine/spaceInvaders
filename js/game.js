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
const btnMenu = document.getElementById('btn-menu');
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
const gameSettingsPanel = document.getElementById('game-settings-panel');
const visualSettingsPanel = document.getElementById('visual-settings-panel');
const startSummaryPanel = document.getElementById('start-summary-panel');
const startObjectivesPanel = document.getElementById('start-objectives-panel');
const startObjectivesCountEl = document.getElementById('start-objectives-count');
const runPanel = document.getElementById('run-panel');
const runPanelTitle = document.getElementById('run-panel-title');
const runPanelBadge = document.getElementById('run-panel-badge');
const runStatsGridEl = document.getElementById('run-stats-grid');
const aggregatePanel = document.getElementById('aggregate-panel');
const historyPanel = document.getElementById('history-panel');
const metaPanel = document.getElementById('meta-panel');
const statsSummaryEl = document.getElementById('stats-summary');
const statsHistoryEl = document.getElementById('stats-history');
const startSummaryEl = document.getElementById('start-summary');
const startObjectiveEl = document.getElementById('start-objective');
const startAchievementsEl = document.getElementById('start-achievements');
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
  },
  solar: {
    label: 'SOLAR',
    player: '#ffd866',
    playerBullet: '#fff4a6',
    enemyRows: ['#ff8f4d', '#ffd866', '#8cf0ff'],
    ufo: '#ff5c7a',
    shield: '#72f0a6',
    drone: '#fff0c2',
    accent: '#ffd866'
  },
  eclipse: {
    label: 'ECLIPSE',
    player: '#b9c6ff',
    playerBullet: '#f2a7ff',
    enemyRows: ['#8d7dff', '#ff7db2', '#7ef2d5'],
    ufo: '#ff4d88',
    shield: '#7ef2d5',
    drone: '#d8dfff',
    accent: '#b9c6ff'
  }
};

const BADGE_DEFS = {
  rookie: { label: 'ROOKIE', copy: 'Has firmado tu primera salida.' },
  vanguard: { label: 'VANGUARD', copy: 'Ya controlas la transición al nivel 2.' },
  ace: { label: 'ACE', copy: 'Mantienes sesiones con profundidad real.' },
  legend: { label: 'LEGEND', copy: 'Tu progresión ya se siente seria.' },
  striker: { label: 'STRIKER', copy: 'Has empezado a jugar con ritmo y presión.' },
  berserker: { label: 'BERSERKER', copy: 'Tus combos ya imponen respeto.' },
  scope: { label: 'SCOPE', copy: 'Tu puntería empieza a destacar.' },
  raider: { label: 'RAIDER', copy: 'Los UFO dejan de ser un extra ocasional.' },
  scavenger: { label: 'SCAVENGER', copy: 'Exprimes el sistema de power-ups.' },
  sentinel: { label: 'SENTINEL', copy: 'Los bosses ya forman parte de tu rutina.' },
  chrono: { label: 'CHRONO', copy: 'Has entrado en el ritmo del contrarreloj.' },
  operative: { label: 'OPERATIVE', copy: 'Cumples objetivos activos con constancia.' },
  commander: { label: 'COMMANDER', copy: 'Tu disciplina meta ya es visible.' }
};

const ACHIEVEMENT_DEFS = [
  {
    id: 'first_sortie',
    title: 'PRIMERA SALIDA',
    copy: 'Termina tu primera partida para activar el perfil del piloto.',
    category: 'INICIO',
    tier: 'BASE',
    reward: { type: 'badge', id: 'rookie' },
    track: 'profile',
    status: ctx => buildCountStatus(ctx.aggregate.gamesPlayed, 1, 'PARTIDA')
  },
  {
    id: 'level_2',
    title: 'ROMPEOLEADAS',
    copy: 'Alcanza el nivel 2. El primer escalón debe enganchar, no expulsar.',
    category: 'INICIO',
    tier: 'BASE',
    reward: { type: 'badge', id: 'vanguard' },
    track: 'live',
    status: ctx => buildLevelStatus(ctx.bestLevel, 2)
  },
  {
    id: 'first_boss',
    title: 'PRIMER BOSS',
    copy: 'Derrota tu primer boss y desbloquea una skin de progresión real.',
    category: 'PROGRESION',
    tier: 'HITO',
    reward: { type: 'skin', id: 'aurora' },
    track: 'live',
    status: ctx => buildCountStatus(ctx.totalBossesDefeated, 1, 'BOSS')
  },
  {
    id: 'level_5',
    title: 'NIVEL 5',
    copy: 'Llega al nivel 5 para demostrar consistencia más allá del arranque.',
    category: 'PROGRESION',
    tier: 'CORE',
    reward: { type: 'badge', id: 'ace' },
    track: 'live',
    status: ctx => buildLevelStatus(ctx.bestLevel, 5)
  },
  {
    id: 'level_8',
    title: 'SECTOR 8',
    copy: 'Cruza el nivel 8. Aquí ya no vale con una buena racha aislada.',
    category: 'PROGRESION',
    tier: 'ELITE',
    reward: { type: 'badge', id: 'legend' },
    track: 'live',
    status: ctx => buildLevelStatus(ctx.bestLevel, 8)
  },
  {
    id: 'combo_4',
    title: 'COMBO X4',
    copy: 'Encadena un combo x4. Es el punto donde empieza a sentirse el flow.',
    category: 'HABILIDAD',
    tier: 'BASE',
    reward: { type: 'badge', id: 'striker' },
    track: 'live',
    status: ctx => buildComboStatus(ctx.bestCombo, 4)
  },
  {
    id: 'combo_8',
    title: 'COMBO X8',
    copy: 'Alcanza un combo x8 o superior y desbloquea una skin agresiva.',
    category: 'HABILIDAD',
    tier: 'CORE',
    reward: { type: 'skin', id: 'crimson' },
    track: 'live',
    status: ctx => buildComboStatus(ctx.bestCombo, 8)
  },
  {
    id: 'combo_12',
    title: 'COMBO X12',
    copy: 'Mantén una cadena x12. Ya no es suerte: es control total.',
    category: 'HABILIDAD',
    tier: 'ELITE',
    reward: { type: 'badge', id: 'berserker' },
    track: 'live',
    status: ctx => buildComboStatus(ctx.bestCombo, 12)
  },
  {
    id: 'marksman_60',
    title: 'PULSO FIRME',
    copy: 'Cierra una partida con 60% de precisión y al menos 25 disparos.',
    category: 'HABILIDAD',
    tier: 'CORE',
    reward: { type: 'badge', id: 'scope' },
    track: 'end',
    status: ctx => buildPercentStatus(ctx.bestAccuracy25, 60, 25)
  },
  {
    id: 'sharpshooter',
    title: 'FRANCOTIRADOR',
    copy: 'Termina una partida con 70% de precisión y 35 disparos o más.',
    category: 'HABILIDAD',
    tier: 'ELITE',
    reward: { type: 'skin', id: 'solar' },
    track: 'end',
    status: ctx => buildPercentStatus(ctx.bestAccuracy35, 70, 35)
  },
  {
    id: 'ufo_5',
    title: 'CAZADOR UFO',
    copy: 'Destruye 5 UFO en total para dominar el objetivo más rentable.',
    category: 'COLECCION',
    tier: 'CORE',
    reward: { type: 'badge', id: 'raider' },
    track: 'profile',
    status: ctx => buildCountStatus(ctx.totalUfoDestroyed, 5, 'UFO')
  },
  {
    id: 'power_12',
    title: 'ARSENAL VIVO',
    copy: 'Recoge 12 power-ups en total y exprime mejor el sandbox del juego.',
    category: 'COLECCION',
    tier: 'CORE',
    reward: { type: 'badge', id: 'scavenger' },
    track: 'profile',
    status: ctx => buildCountStatus(ctx.totalPowerUpsCollected, 12, 'POWER-UP')
  },
  {
    id: 'boss_3',
    title: 'CAZABOSSES',
    copy: 'Derrota 3 bosses en total para abrir la capa media del progreso.',
    category: 'PROGRESION',
    tier: 'ELITE',
    reward: { type: 'badge', id: 'sentinel' },
    track: 'profile',
    status: ctx => buildCountStatus(ctx.totalBossesDefeated, 3, 'BOSS')
  },
  {
    id: 'time_pilot',
    title: 'PILOTO CRONO',
    copy: 'Cierra tu primera partida en contrarreloj y entra en otro ritmo.',
    category: 'MODOS',
    tier: 'BASE',
    reward: { type: 'badge', id: 'chrono' },
    track: 'end',
    status: ctx => buildCountStatus(ctx.aggregate.totalTimeAttackGames, 1, 'RUN')
  },
  {
    id: 'time_master',
    title: 'MAESTRO DEL TIEMPO',
    copy: 'Alcanza 1800 puntos en contrarreloj para desbloquear una skin premium.',
    category: 'MODOS',
    tier: 'ELITE',
    reward: { type: 'skin', id: 'eclipse' },
    track: 'end',
    status: ctx => buildScoreStatus(ctx.aggregate.bestTimeAttackScore, 1800)
  },
  {
    id: 'challenge_streak',
    title: 'OPERATIVO',
    copy: 'Completa 3 desafíos activos. Es la puerta de entrada a la meta persistente.',
    category: 'META',
    tier: 'CORE',
    reward: { type: 'badge', id: 'operative' },
    track: 'meta',
    status: ctx => buildCountStatus(ctx.meta.challengeCompletions, 3, 'SELLO')
  },
  {
    id: 'challenge_7',
    title: 'COMANDANCIA',
    copy: 'Completa 7 desafíos activos y consolida tu perfil a largo plazo.',
    category: 'META',
    tier: 'ELITE',
    reward: { type: 'badge', id: 'commander' },
    track: 'meta',
    status: ctx => buildCountStatus(ctx.meta.challengeCompletions, 7, 'SELLO')
  }
];

const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENT_DEFS.map(def => [def.id, def]));
const ACHIEVEMENT_CATEGORIES = ['INICIO', 'PROGRESION', 'HABILIDAD', 'MODOS', 'COLECCION', 'META'];

const CHALLENGE_DEFS = [
  {
    id: 'ufo_hunter',
    title: 'CAZADOR UFO',
    copy: 'Destruye 2 UFO en una sola partida.',
    rewardCopy: 'RECOMPENSA: +1 sello de reto',
    progressRatio: run => Math.min(1, run.ufoDestroyed / 2),
    progressText: run => `${Math.min(run.ufoDestroyed, 2)}/2 UFO`,
    isComplete: run => run.ufoDestroyed >= 2
  },
  {
    id: 'combo_rush',
    title: 'RACHA DE COMBATE',
    copy: 'Alcanza un combo x6 en la partida activa.',
    rewardCopy: 'RECOMPENSA: +1 sello de reto',
    progressRatio: run => Math.min(1, run.maxCombo / 6),
    progressText: run => `COMBO x${Math.min(run.maxCombo, 6)}/x6`,
    isComplete: run => run.maxCombo >= 6
  },
  {
    id: 'marksman',
    title: 'PUNTERIA FINA',
    copy: 'Cierra la partida con 65% de precision y 30 disparos o mas.',
    rewardCopy: 'RECOMPENSA: +1 sello de reto',
    progressRatio: run => {
      const accuracyRatio = Math.min(1, getAccuracyPercent(run.shots, run.hits) / 65);
      const shotsRatio = Math.min(1, run.shots / 30);
      return Math.min(accuracyRatio, shotsRatio);
    },
    progressText: run => `${getAccuracyPercent(run.shots, run.hits)}% · ${run.shots}/30`,
    isComplete: run => run.shots >= 30 && getAccuracyPercent(run.shots, run.hits) >= 65
  },
  {
    id: 'power_surge',
    title: 'SOBRECARGA',
    copy: 'Recoge 3 power-ups en una sola partida.',
    rewardCopy: 'RECOMPENSA: +1 sello de reto',
    progressRatio: run => Math.min(1, run.powerUpsCollected / 3),
    progressText: run => `${Math.min(run.powerUpsCollected, 3)}/3 power-ups`,
    isComplete: run => run.powerUpsCollected >= 3
  },
  {
    id: 'field_survivor',
    title: 'LINEA CLARA',
    copy: 'Llega al nivel 4 sin abandonar la sesión.',
    rewardCopy: 'RECOMPENSA: +1 sello de reto',
    progressRatio: () => Math.min(1, level / 4),
    progressText: run => `NIV ${Math.min(level, 4)}/4`,
    isComplete: () => level >= 4
  }
];

const ENEMY_ROLE_DEFS = {
  classic: {
    label: 'CLASSIC',
    hp: 1,
    shootWeight: 1,
    moveBoost: 0,
    bulletSpeedBonus: 0,
    scoreMultiplier: 1
  },
  shooter: {
    label: 'SHOOTER',
    hp: 1,
    shootWeight: 2.5,
    moveBoost: 0.4,
    bulletSpeedBonus: 0.45,
    scoreMultiplier: 1.35
  },
  scout: {
    label: 'SCOUT',
    hp: 1,
    shootWeight: 1.1,
    moveBoost: 1.8,
    bulletSpeedBonus: 0.2,
    scoreMultiplier: 1.25
  },
  tank: {
    label: 'TANK',
    hp: 2,
    shootWeight: 0.7,
    moveBoost: -0.2,
    bulletSpeedBonus: -0.15,
    scoreMultiplier: 1.8
  }
};

const WAVE_PATTERNS = {
  classic_grid: {
    id: 'classic_grid',
    label: 'GRID',
    gapScaleX: 1,
    rowShifts: [0, 0, 0],
    masks: ['11111111', '11111111', '11111111']
  },
  split_wings: {
    id: 'split_wings',
    label: 'SPLIT WINGS',
    gapScaleX: 1.04,
    rowShifts: [0, 10, 0],
    masks: ['11100111', '11100111', '01100110']
  },
  spearhead: {
    id: 'spearhead',
    label: 'SPEARHEAD',
    gapScaleX: 0.98,
    rowShifts: [0, 0, 0],
    masks: ['00011000', '00111100', '11111111']
  },
  staggered: {
    id: 'staggered',
    label: 'STAGGERED',
    gapScaleX: 0.95,
    rowShifts: [-18, 18, -10],
    masks: ['11111111', '11111111', '11111111']
  },
  fortress: {
    id: 'fortress',
    label: 'FORTRESS',
    gapScaleX: 0.72,
    rowShifts: [0, 0, 0],
    masks: ['01111110', '11100111', '01111110']
  }
};

const UFO_VARIANTS = {
  bonus: {
    label: 'BONUS',
    points: 150,
    speed: 2.05,
    color: '#ff66cc',
    guaranteePowerUp: false
  },
  cargo: {
    label: 'CARGO',
    points: 110,
    speed: 1.7,
    color: '#7ef2d5',
    guaranteePowerUp: true
  },
  phantom: {
    label: 'PHANTOM',
    points: 220,
    speed: 3.15,
    color: '#ffd966',
    guaranteePowerUp: false
  }
};

const BOSS_PROFILES = {
  striker: {
    id: 'striker',
    label: 'STRIKER',
    hpBase: 18,
    hpStep: 4,
    speedBase: 2.7,
    speedStep: 0.09,
    baseY: 68,
    movePattern: 'striker',
    volley: 'spread',
    rewardMultiplier: 1
  },
  pulse: {
    id: 'pulse',
    label: 'PULSE',
    hpBase: 22,
    hpStep: 5,
    speedBase: 2.05,
    speedStep: 0.07,
    baseY: 78,
    movePattern: 'pulse',
    volley: 'burst',
    rewardMultiplier: 1.12
  },
  warden: {
    id: 'warden',
    label: 'WARDEN',
    hpBase: 28,
    hpStep: 6,
    speedBase: 1.55,
    speedStep: 0.05,
    baseY: 74,
    movePattern: 'warden',
    volley: 'wall',
    rewardMultiplier: 1.25
  }
};

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
    const unlockedBadges = Array.isArray(stored.unlockedBadges)
      ? stored.unlockedBadges.filter(id => BADGE_DEFS[id]).filter((value, index, array) => array.indexOf(value) === index)
      : [];
    const achievements = stored.achievements && typeof stored.achievements === 'object'
      ? Object.fromEntries(Object.entries(stored.achievements).map(([id, value]) => {
          if (!ACHIEVEMENT_MAP[id]) return [id, null];
          if (value && typeof value === 'object') {
            return [id, {
              unlocked: value.unlocked === true,
              unlockedAt: typeof value.unlockedAt === 'string' ? value.unlockedAt : null
            }];
          }
          return [id, {
            unlocked: value === true,
            unlockedAt: null
          }];
        }).filter(([, value]) => value))
      : {};
    const completedChallenges = stored.completedChallenges && typeof stored.completedChallenges === 'object'
      ? Object.fromEntries(Object.entries(stored.completedChallenges).map(([stamp, value]) => (
          [stamp, value && typeof value === 'object'
            ? {
                completedAt: typeof value.completedAt === 'string' ? value.completedAt : null,
                title: typeof value.title === 'string' ? value.title : ''
              }
            : {
                completedAt: null,
                title: ''
              }]
        )))
      : {};
    const unlockLog = Array.isArray(stored.unlockLog)
      ? stored.unlockLog.filter(entry => entry && typeof entry === 'object').map(entry => ({
          type: typeof entry.type === 'string' ? entry.type : 'meta',
          title: typeof entry.title === 'string' ? entry.title : 'DESBLOQUEO',
          detail: typeof entry.detail === 'string' ? entry.detail : '',
          reward: typeof entry.reward === 'string' ? entry.reward : '',
          at: typeof entry.at === 'string' ? entry.at : null
        })).slice(0, 12)
      : (typeof stored.latestUnlock === 'string' && stored.latestUnlock
          ? [{ type: 'legacy', title: stored.latestUnlock, detail: 'Desbloqueo heredado', reward: '', at: null }]
          : []);
    return {
      unlockedSkins,
      unlockedBadges,
      achievements,
      completedChallenges,
      challengeCompletions: Math.max(0, Number(stored.challengeCompletions) || 0),
      unlockLog
    };
  } catch {
    return {
      unlockedSkins: ['classic'],
      unlockedBadges: [],
      achievements: {},
      completedChallenges: {},
      challengeCompletions: 0,
      unlockLog: []
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
      totalClassicGames: Math.max(0, Number(stored.totalClassicGames) || 0),
      totalTimeAttackGames: Math.max(0, Number(stored.totalTimeAttackGames) || 0),
      bestLevel: Math.max(0, Number(stored.bestLevel) || 0),
      bestCombo: Math.max(1, Number(stored.bestCombo) || 1),
      bestTimeAttackScore: Math.max(0, Number(stored.bestTimeAttackScore) || 0),
      bestAccuracy25: Math.max(0, Number(stored.bestAccuracy25) || 0),
      bestAccuracy35: Math.max(0, Number(stored.bestAccuracy35) || 0),
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
      totalClassicGames: 0,
      totalTimeAttackGames: 0,
      bestLevel: 0,
      bestCombo: 1,
      bestTimeAttackScore: 0,
      bestAccuracy25: 0,
      bestAccuracy35: 0,
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

function getThreatLevel(currentLevel = level) {
  if (currentLevel <= 4) return currentLevel;
  return 4 + (currentLevel - 4) * 0.72;
}

function getWavePatternForLevel(currentLevel, mode = gameSettings.mode) {
  if (currentLevel <= 1) return WAVE_PATTERNS.classic_grid;
  const sequence = mode === 'timeattack'
    ? ['spearhead', 'split_wings', 'staggered', 'classic_grid', 'fortress']
    : ['split_wings', 'spearhead', 'staggered', 'classic_grid', 'fortress'];
  const unlockIndex = currentLevel >= 6 ? sequence.length : Math.max(1, Math.min(sequence.length - 1, currentLevel - 1));
  const pool = sequence.slice(0, unlockIndex);
  return WAVE_PATTERNS[pool[(currentLevel - 2) % pool.length]];
}

function pickWeightedValue(weightedEntries) {
  const totalWeight = weightedEntries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [value, weight] of weightedEntries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return weightedEntries[weightedEntries.length - 1][0];
}

function getEnemyRoleForSlot(row, col, pattern, currentLevel, mode = gameSettings.mode) {
  if (currentLevel <= 1) return 'classic';
  const isOuter = col <= 1 || col >= COLS - 2;
  const isCenter = col >= 2 && col <= COLS - 3;
  const weightedRoles = [['classic', 6]];

  if (currentLevel >= 3 && row === 0) weightedRoles.push(['shooter', mode === 'timeattack' ? 4 : 3]);
  if (currentLevel >= 4 && (pattern.id === 'staggered' || isOuter)) weightedRoles.push(['scout', pattern.id === 'staggered' ? 4 : 2]);
  if (currentLevel >= 6 && pattern.id === 'split_wings' && isOuter) weightedRoles.push(['shooter', 2]);
  if (currentLevel >= 7 && ((pattern.id === 'fortress' && row > 0 && isCenter) || (pattern.id === 'spearhead' && row === 2 && isCenter))) {
    weightedRoles.push(['tank', 4]);
  }
  if (currentLevel >= 8 && mode === 'timeattack') weightedRoles.push(['scout', 2]);

  return pickWeightedValue(weightedRoles);
}

function getEnemyBasePoints(row) {
  return row === 0 ? 30 : row === 1 ? 20 : 10;
}

function getEnemyScore(enemy) {
  const roleDef = ENEMY_ROLE_DEFS[enemy.type] || ENEMY_ROLE_DEFS.classic;
  return Math.round(getEnemyBasePoints(enemy.row) * roleDef.scoreMultiplier);
}

function getBossProfileForLevel(currentLevel, mode = gameSettings.mode) {
  const cycle = Math.max(0, Math.floor(currentLevel / 3) - 1);
  const sequence = mode === 'timeattack'
    ? ['pulse', 'striker', 'warden']
    : ['striker', 'pulse', 'warden'];
  return BOSS_PROFILES[sequence[cycle % sequence.length]];
}

function getBossBaseReward(profile) {
  return Math.round((500 + level * 50) * profile.rewardMultiplier);
}

function rollUfoVariant(currentLevel, mode = gameSettings.mode) {
  const weighted = [['bonus', 6]];
  if (currentLevel >= 3) weighted.push(['cargo', mode === 'timeattack' ? 2 : 3]);
  if (currentLevel >= 5) weighted.push(['phantom', mode === 'timeattack' ? 4 : 2]);
  return pickWeightedValue(weighted);
}

function getEnemyRoleColor(enemy) {
  const colors = getCurrentTheme().enemyRows;
  if (enemy.type === 'shooter') return '#ffe36b';
  if (enemy.type === 'scout') return '#6cf5ff';
  if (enemy.type === 'tank') return '#ffa165';
  return colors[enemy.row];
}

function getBossAccentColor(profileId = boss.profileId) {
  if (profileId === 'pulse') return '#ffd66f';
  if (profileId === 'warden') return '#8fe0ff';
  return '#ff5f98';
}

function getUfoVariantDef(variantId = ufo.variant) {
  const variant = UFO_VARIANTS[variantId] || UFO_VARIANTS.bonus;
  return { id: variantId in UFO_VARIANTS ? variantId : 'bonus', ...variant };
}

function createEnemyBullet(sourceEnemy, extra = {}) {
  const preset = getDifficultyConfig();
  const threatLevel = getThreatLevel();
  enemyBullets.push({
    x: sourceEnemy.x + sourceEnemy.w / 2 - 2,
    y: sourceEnemy.y + sourceEnemy.h,
    w: 4,
    h: 12,
    speed: preset.enemyBulletBase + (threatLevel - 1) * preset.enemyBulletStep + (sourceEnemy.bulletSpeedBonus || 0),
    fromBoss: false,
    tint: sourceEnemy.type === 'shooter' ? '#ffd666' : sourceEnemy.type === 'scout' ? '#7be6ff' : sourceEnemy.type === 'tank' ? '#ff9a5f' : '#ff6600',
    ...extra
  });
}

function formatPlayedAt(value) {
  if (!value) return 'sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'sin fecha';
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

function formatUnlockTimestamp(value) {
  if (!value) return 'sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'sin fecha';
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function buildCountStatus(value, target, unit) {
  const safeValue = Math.max(0, Number(value) || 0);
  return {
    value: safeValue,
    target,
    ratio: Math.min(1, safeValue / target),
    complete: safeValue >= target,
    label: `${Math.min(safeValue, target)}/${target} ${unit}`
  };
}

function buildLevelStatus(value, target) {
  const safeValue = Math.max(0, Number(value) || 0);
  return {
    value: safeValue,
    target,
    ratio: Math.min(1, safeValue / target),
    complete: safeValue >= target,
    label: `NIV ${Math.min(safeValue, target)}/${target}`
  };
}

function buildComboStatus(value, target) {
  const safeValue = Math.max(1, Number(value) || 1);
  return {
    value: safeValue,
    target,
    ratio: Math.min(1, safeValue / target),
    complete: safeValue >= target,
    label: `COMBO x${Math.min(safeValue, target)}/x${target}`
  };
}

function buildScoreStatus(value, target) {
  const safeValue = Math.max(0, Number(value) || 0);
  return {
    value: safeValue,
    target,
    ratio: Math.min(1, safeValue / target),
    complete: safeValue >= target,
    label: `${Math.min(safeValue, target)}/${target} PTS`
  };
}

function buildPercentStatus(value, target, shotsThreshold) {
  const safeValue = Math.max(0, Number(value) || 0);
  return {
    value: safeValue,
    target,
    ratio: Math.min(1, safeValue / target),
    complete: safeValue >= target,
    label: `${Math.min(safeValue, target)}%/${target}% · ${shotsThreshold}+ DISP`
  };
}

function getRewardLabel(reward) {
  if (!reward) return 'SIN RECOMPENSA EXTRA';
  if (reward.type === 'skin' && SKIN_THEMES[reward.id]) return `SKIN ${SKIN_THEMES[reward.id].label}`;
  if (reward.type === 'badge' && BADGE_DEFS[reward.id]) return `INSIGNIA ${BADGE_DEFS[reward.id].label}`;
  return 'RECOMPENSA META';
}

function createUnlockLogEntry(type, title, detail = '', reward = '') {
  return {
    type,
    title,
    detail,
    reward,
    at: new Date().toISOString()
  };
}

function pushUnlockLog(entry) {
  metaState.unlockLog.unshift(entry);
  metaState.unlockLog = metaState.unlockLog.slice(0, 12);
}

function getLatestUnlockEntry() {
  return metaState.unlockLog[0] || null;
}

function getAchievementState(id) {
  const stored = metaState.achievements[id];
  if (!stored || typeof stored !== 'object') {
    return { unlocked: false, unlockedAt: null };
  }
  return {
    unlocked: stored.unlocked === true,
    unlockedAt: typeof stored.unlockedAt === 'string' ? stored.unlockedAt : null
  };
}

function isAchievementUnlocked(id) {
  return getAchievementState(id).unlocked;
}

function setAchievementUnlocked(id, unlockedAt = new Date().toISOString()) {
  metaState.achievements[id] = { unlocked: true, unlockedAt };
}

function getLiveRunSnapshot() {
  const activeMode = running ? currentRunStats.mode : gameSettings.mode;
  return {
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
    mode: activeMode,
    durationMs: currentRunStats.startedAt ? Math.max(0, Date.now() - currentRunStats.startedAt) : 0
  };
}

function buildAchievementContext({ live = false } = {}) {
  const run = live ? getLiveRunSnapshot() : null;
  return {
    run,
    meta: metaState,
    aggregate: aggregateStats,
    totalUfoDestroyed: aggregateStats.totalUfoDestroyed + (run ? run.ufoDestroyed : 0),
    totalPowerUpsCollected: aggregateStats.totalPowerUpsCollected + (run ? run.powerUpsCollected : 0),
    totalBossesDefeated: aggregateStats.totalBossesDefeated + (run ? run.bossesDefeated : 0),
    bestLevel: Math.max(aggregateStats.bestLevel, run ? run.level : 0),
    bestCombo: Math.max(aggregateStats.bestCombo, run ? run.maxCombo : 1),
    bestAccuracy25: Math.max(aggregateStats.bestAccuracy25, run && run.shots >= 25 ? run.accuracy : 0),
    bestAccuracy35: Math.max(aggregateStats.bestAccuracy35, run && run.shots >= 35 ? run.accuracy : 0),
    bestTimeAttackScore: Math.max(aggregateStats.bestTimeAttackScore, run && run.mode === 'timeattack' ? run.score : 0)
  };
}

function getAchievementProgress(def, context = buildAchievementContext()) {
  return def.status(context);
}

function getAchievementProgressRatio(def, context = buildAchievementContext()) {
  return getAchievementProgress(def, context).ratio;
}

function countUnlockedAchievements() {
  return ACHIEVEMENT_DEFS.filter(def => isAchievementUnlocked(def.id)).length;
}

function countCategoryAchievements(category) {
  return ACHIEVEMENT_DEFS.filter(def => def.category === category).length;
}

function countUnlockedCategoryAchievements(category) {
  return ACHIEVEMENT_DEFS.filter(def => def.category === category && isAchievementUnlocked(def.id)).length;
}

function getNearestAchievements(limit = 3, context = buildAchievementContext()) {
  return ACHIEVEMENT_DEFS
    .filter(def => !isAchievementUnlocked(def.id))
    .map(def => ({ def, progress: getAchievementProgress(def, context) }))
    .sort((a, b) => b.progress.ratio - a.progress.ratio || a.progress.target - b.progress.target || a.def.title.localeCompare(b.def.title))
    .slice(0, limit);
}

function getRecentUnlockedAchievements(limit = 4) {
  return ACHIEVEMENT_DEFS
    .filter(def => isAchievementUnlocked(def.id))
    .map(def => ({ def, state: getAchievementState(def.id) }))
    .sort((a, b) => new Date(b.state.unlockedAt || 0) - new Date(a.state.unlockedAt || 0))
    .slice(0, limit);
}

function getPendingAchievementsByCategory(context = buildAchievementContext()) {
  return ACHIEVEMENT_CATEGORIES.map(category => {
    const items = ACHIEVEMENT_DEFS
      .filter(def => def.category === category && !isAchievementUnlocked(def.id))
      .map(def => ({ def, progress: getAchievementProgress(def, context) }))
      .sort((a, b) => b.progress.ratio - a.progress.ratio || a.progress.target - b.progress.target || a.def.title.localeCompare(b.def.title));
    return { category, items };
  }).filter(group => group.items.length);
}

function getCompletedAchievementsByCategory() {
  return ACHIEVEMENT_CATEGORIES.map(category => {
    const items = ACHIEVEMENT_DEFS
      .filter(def => def.category === category && isAchievementUnlocked(def.id))
      .map(def => ({ def, state: getAchievementState(def.id) }))
      .sort((a, b) => new Date(b.state.unlockedAt || 0) - new Date(a.state.unlockedAt || 0));
    return { category, items };
  }).filter(group => group.items.length);
}

function renderStartObjectiveEntry(def, { progress = null, unlocked = false, unlockedAt = null } = {}) {
  const stateLabel = unlocked ? 'LOGRADO' : progress.label;
  const rewardLabel = getRewardLabel(def.reward);
  return `
    <div class="start-objective-item${unlocked ? ' is-unlocked' : ''}">
      <div class="start-objective-item-head">
        <div class="start-objective-item-copy">
          <span class="objective-kicker">${def.category} · ${def.tier}</span>
          <strong class="objective-title">${def.title}</strong>
        </div>
        <span class="achievement-state${unlocked ? ' is-unlocked' : ''}">${stateLabel}</span>
      </div>
      <span class="objective-copy">${def.copy}</span>
      ${renderProgressMeter(unlocked ? 1 : progress.ratio)}
      <div class="start-objective-item-meta">
        <span class="objective-reward">${rewardLabel}</span>
        <span class="objective-progress${unlocked ? ' is-complete' : ''}">${unlocked ? `Desbloqueado ${formatUnlockTimestamp(unlockedAt)}` : 'Objetivo pendiente'}</span>
      </div>
    </div>
  `;
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

function grantBadge(id, { silent = false } = {}) {
  if (!BADGE_DEFS[id] || metaState.unlockedBadges.includes(id)) return false;
  metaState.unlockedBadges.push(id);
  if (!silent) {
    pushUnlockLog(createUnlockLogEntry('badge', BADGE_DEFS[id].label, BADGE_DEFS[id].copy, `INSIGNIA ${BADGE_DEFS[id].label}`));
  }
  return true;
}

function syncUnlockedRewardsFromAchievements() {
  for (const def of ACHIEVEMENT_DEFS) {
    if (!isAchievementUnlocked(def.id) || !def.reward) continue;
    if (def.reward.type === 'skin' && SKIN_THEMES[def.reward.id] && !metaState.unlockedSkins.includes(def.reward.id)) {
      metaState.unlockedSkins.push(def.reward.id);
    }
    if (def.reward.type === 'badge') {
      grantBadge(def.reward.id, { silent: true });
    }
  }
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

function unlockSkin(id, { silent = false } = {}) {
  if (!SKIN_THEMES[id] || metaState.unlockedSkins.includes(id)) return false;
  metaState.unlockedSkins.push(id);
  if (!silent) {
    pushUnlockLog(createUnlockLogEntry('skin', SKIN_THEMES[id].label, 'Skin desbloqueada.', `SKIN ${SKIN_THEMES[id].label}`));
  }
  refreshSkinOptions();
  if (!silent) {
    spawnFloatingText(canvas.width / 2, canvas.height * 0.34, SKIN_THEMES[id].label, '#ffffff');
    triggerCinematicFlash(0.08);
  }
  return true;
}

function grantReward(reward, { silent = false } = {}) {
  if (!reward) return false;
  if (reward.type === 'skin') {
    return unlockSkin(reward.id, { silent });
  }
  if (reward.type === 'badge') {
    return grantBadge(reward.id, { silent });
  }
  return false;
}

function awardAchievement(id, { silent = false } = {}) {
  const def = ACHIEVEMENT_MAP[id];
  if (!def || isAchievementUnlocked(id)) return false;
  setAchievementUnlocked(id);
  const rewardLabel = getRewardLabel(def.reward);
  grantReward(def.reward, { silent: true });
  if (!silent) {
    pushUnlockLog(createUnlockLogEntry('achievement', def.title, def.copy, rewardLabel));
  }
  persistMetaState();
  refreshSkinOptions();
  if (silent) return true;
  spawnFloatingText(canvas.width / 2, canvas.height * 0.28, def.title, '#ffef88');
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
  if (def.reward) {
    spawnFloatingText(canvas.width / 2, canvas.height * 0.34, rewardLabel, '#ffffff');
    triggerCinematicFlash(0.08);
  }
  return true;
}

function evaluateAchievements(track, { live = false, silent = false } = {}) {
  const context = buildAchievementContext({ live });
  let changed = false;
  for (const def of ACHIEVEMENT_DEFS) {
    if (def.track !== track || isAchievementUnlocked(def.id)) continue;
    const progress = getAchievementProgress(def, context);
    if (progress.complete) {
      changed = awardAchievement(def.id, { silent }) || changed;
    }
  }
  if (changed) {
    persistMetaState();
  }
  return changed;
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
  if (boss.active) bossStatusEl.textContent = `BOSS ${boss.label} ${boss.hp}/${boss.maxHp}`;
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
        ['Modos', `${aggregateStats.totalClassicGames} clasico · ${aggregateStats.totalTimeAttackGames} contrarreloj`],
        ['Puntos totales', aggregateStats.totalScore],
        ['Mejor nivel', aggregateStats.bestLevel],
        ['Mejor combo', `x${aggregateStats.bestCombo}`],
        ['Mejor contrarreloj', `${aggregateStats.bestTimeAttackScore} pts`],
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

function getChallengeMilestoneStatus() {
  if (metaState.challengeCompletions < 3) {
    return {
      title: 'OPERATIVO',
      copy: 'Al completar 3 desafíos desbloqueas una insignia meta.',
      progress: `${metaState.challengeCompletions}/3 sellos`,
      ratio: Math.min(1, metaState.challengeCompletions / 3),
      reward: getRewardLabel(ACHIEVEMENT_MAP.challenge_streak.reward)
    };
  }
  if (metaState.challengeCompletions < 7) {
    return {
      title: 'COMANDANCIA',
      copy: 'El siguiente gran escalón llega con 7 desafíos completados.',
      progress: `${metaState.challengeCompletions}/7 sellos`,
      ratio: Math.min(1, metaState.challengeCompletions / 7),
      reward: getRewardLabel(ACHIEVEMENT_MAP.challenge_7.reward)
    };
  }
  return {
    title: 'RUTA META COMPLETA',
    copy: 'Ya has desbloqueado los dos hitos principales de desafíos.',
    progress: `${metaState.challengeCompletions} sellos`,
    ratio: 1,
    reward: 'SIGUIENTE CAPA LISTA PARA EXPANDIR'
  };
}

function renderProgressMeter(ratio) {
  return `
    <span class="progress-meter" aria-hidden="true">
      <span class="progress-meter-fill" style="width:${Math.max(0, Math.min(100, ratio * 100))}%"></span>
    </span>
  `;
}

function renderAchievementPreview(def, progress, { compact = false } = {}) {
  const unlocked = isAchievementUnlocked(def.id);
  const state = getAchievementState(def.id);
  const rewardLabel = getRewardLabel(def.reward);
  return `
    <div class="achievement-preview${unlocked ? ' is-unlocked' : ''}${compact ? ' is-compact' : ''}">
      <div class="achievement-preview-head">
        <span class="achievement-kicker">${def.category} · ${def.tier}</span>
        <span class="achievement-chip${unlocked ? ' is-unlocked' : ''}">${unlocked ? 'COMPLETADO' : progress.label}</span>
      </div>
      <strong class="achievement-title">${def.title}</strong>
      <span class="achievement-copy">${def.copy}</span>
      ${renderProgressMeter(unlocked ? 1 : progress.ratio)}
      <span class="achievement-reward">${rewardLabel}</span>
      <span class="achievement-progress${unlocked ? ' is-unlocked' : ''}">${unlocked ? `Desbloqueado ${formatUnlockTimestamp(state.unlockedAt)}` : 'Objetivo activo'}</span>
    </div>
  `;
}

function renderMetaPanel() {
  const context = buildAchievementContext({ live: overlayMode === 'pause' });
  const unlockedAchievements = countUnlockedAchievements();
  const pendingAchievements = ACHIEVEMENT_DEFS.length - unlockedAchievements;
  const challengeCompleted = !!metaState.completedChallenges[getChallengeStamp()];
  const challengeRatio = challengeCompleted ? 1 : (currentChallenge.progressRatio ? currentChallenge.progressRatio(currentRunStats) : 0);
  const challengeMilestone = getChallengeMilestoneStatus();
  const unlockedSkins = metaState.unlockedSkins.map(id => SKIN_THEMES[id].label).join(' · ');
  const unlockedBadges = metaState.unlockedBadges.length
    ? metaState.unlockedBadges.map(id => BADGE_DEFS[id].label).slice(0, 6).join(' · ')
    : 'Aun sin insignias';
  const recentUnlocks = metaState.unlockLog.slice(0, 3).map(entry => `
    <div class="unlock-line">
      <strong>${entry.title}</strong>
      <span>${entry.reward || entry.detail}</span>
    </div>
  `).join('');

  challengeSummaryEl.innerHTML = `
    <div class="challenge-box">
      <div class="challenge-line">
        <div class="challenge-head">
          <strong class="challenge-title">${currentChallenge.title}</strong>
          <span class="challenge-state${challengeCompleted ? ' is-complete' : ''}">${challengeCompleted ? 'COMPLETADO HOY' : getChallengeProgressText()}</span>
        </div>
        <span class="challenge-copy">${currentChallenge.copy}</span>
        ${renderProgressMeter(challengeRatio)}
        <span class="challenge-progress">${currentChallenge.rewardCopy}</span>
      </div>
      <div class="challenge-line">
        <div class="challenge-head">
          <strong class="challenge-title">${challengeMilestone.title}</strong>
          <span class="challenge-state">${challengeMilestone.progress}</span>
        </div>
        <span class="challenge-copy">${challengeMilestone.copy}</span>
        ${renderProgressMeter(challengeMilestone.ratio)}
        <span class="challenge-progress">SIGUIENTE RECOMPENSA · ${challengeMilestone.reward}</span>
      </div>
      <div class="challenge-line">
        <div class="challenge-head">
          <strong class="challenge-title">INVENTARIO META</strong>
          <span class="challenge-state">${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} skins · ${metaState.unlockedBadges.length}/${Object.keys(BADGE_DEFS).length} insignias</span>
        </div>
        <span class="challenge-copy">Skins: ${unlockedSkins}</span>
        <span class="challenge-progress">Insignias: ${unlockedBadges}</span>
      </div>
    </div>
  `;

  const pendingGroupsHtml = getPendingAchievementsByCategory(context).map(({ category, items }) => `
    <div class="achievement-group">
      <div class="achievement-group-head">
        <strong>${category}</strong>
        <span>${items.length} por hacer</span>
      </div>
      ${items.map(({ def, progress }) => `
        <div class="achievement-line">
          <div class="achievement-head">
            <strong class="achievement-title">${def.title}</strong>
            <span class="achievement-state">${progress.label}</span>
          </div>
          <span class="achievement-copy">${def.copy}</span>
          ${renderProgressMeter(progress.ratio)}
          <span class="achievement-reward">${getRewardLabel(def.reward)}</span>
          <span class="achievement-meta">${def.category} · ${def.tier}</span>
        </div>
      `).join('')}
    </div>
  `).join('');

  const completedGroupsHtml = getCompletedAchievementsByCategory().map(({ category, items }) => `
    <div class="achievement-group">
      <div class="achievement-group-head">
        <strong>${category}</strong>
        <span>${items.length} completados</span>
      </div>
      ${items.map(({ def, state }) => `
        <div class="achievement-line is-unlocked">
          <div class="achievement-head">
            <strong class="achievement-title">${def.title}</strong>
            <span class="achievement-state is-unlocked">COMPLETADO</span>
          </div>
          <span class="achievement-copy">${def.copy}</span>
          ${renderProgressMeter(1)}
          <span class="achievement-reward">${getRewardLabel(def.reward)}</span>
          <span class="achievement-meta is-unlocked">Desbloqueado ${formatUnlockTimestamp(state.unlockedAt)}</span>
        </div>
      `).join('')}
    </div>
  `).join('');

  const tabBody = progressPanelTab === 'completed'
    ? (completedGroupsHtml || '<div class="achievement-empty">Todavía no has completado ningún logro en esta sesión de perfil.</div>')
    : (pendingGroupsHtml || '<div class="achievement-empty">Ya no quedan logros pendientes en el catálogo actual.</div>');

  achievementSummaryEl.innerHTML = `
    <div class="achievement-box">
      <div class="achievement-overview">
        <div class="achievement-overview-head">
          <div class="achievement-overview-copy">
            <span class="achievement-kicker">PANORAMA META</span>
            <strong class="achievement-title">PROGRESO GLOBAL</strong>
            <span class="achievement-copy">La meta ya distingue entre inicio, progresión, habilidad, modos, colección y capa persistente.</span>
          </div>
          <span class="achievement-state">${unlockedAchievements}/${ACHIEVEMENT_DEFS.length} logros</span>
        </div>
        <div class="achievement-overview-stats">
          <div class="achievement-overview-stat">
            <span class="achievement-overview-label">Pendientes</span>
            <strong>${pendingAchievements}</strong>
          </div>
          <div class="achievement-overview-stat">
            <span class="achievement-overview-label">Completados</span>
            <strong>${unlockedAchievements}</strong>
          </div>
          <div class="achievement-overview-stat">
            <span class="achievement-overview-label">Insignias</span>
            <strong>${metaState.unlockedBadges.length}</strong>
          </div>
        </div>
        <span class="achievement-meta">${getLatestUnlockEntry() ? `${getLatestUnlockEntry().title} · ${getLatestUnlockEntry().reward || getLatestUnlockEntry().detail}` : 'Todavía no hay desbloqueos recientes.'}</span>
      </div>
      ${recentUnlocks ? `<div class="unlock-log">${recentUnlocks}</div>` : ''}
      <div class="achievement-tabs-shell">
        <div class="achievement-tabs" role="tablist" aria-label="Filtro de progreso">
          <button type="button" class="achievement-tab${progressPanelTab === 'pending' ? ' is-active' : ''}" data-progress-tab="pending" role="tab" aria-selected="${progressPanelTab === 'pending'}">POR HACER <span>${pendingAchievements}</span></button>
          <button type="button" class="achievement-tab${progressPanelTab === 'completed' ? ' is-active' : ''}" data-progress-tab="completed" role="tab" aria-selected="${progressPanelTab === 'completed'}">COMPLETADOS <span>${unlockedAchievements}</span></button>
        </div>
        <span class="achievement-tabs-caption">${progressPanelTab === 'pending' ? 'Abre objetivos cercanos y recompensas pendientes.' : 'Consulta lo ya desbloqueado y cuándo se consiguió.'}</span>
      </div>
      <div class="achievement-tab-panel" data-active-tab="${progressPanelTab}">
        ${tabBody}
      </div>
    </div>
  `;
}

function renderStartScreenPanels() {
  const globalAccuracy = getAccuracyPercent(aggregateStats.totalShots, aggregateStats.totalHits);
  const latestSession = scoreHistory.length ? scoreHistory[0] : null;
  const challengeCompleted = !!metaState.completedChallenges[getChallengeStamp()];
  const unlockedAchievements = countUnlockedAchievements();
  const pendingAchievements = ACHIEVEMENT_DEFS.length - unlockedAchievements;
  const averageScore = aggregateStats.gamesPlayed ? Math.round(aggregateStats.totalScore / aggregateStats.gamesPlayed) : 0;
  const bestLevel = aggregateStats.bestLevel || 1;
  const bestCombo = aggregateStats.bestCombo || 1;
  const startContext = buildAchievementContext();
  const challengeMilestone = getChallengeMilestoneStatus();
  const pendingGroups = getPendingAchievementsByCategory(startContext);
  const completedGroups = getCompletedAchievementsByCategory();

  const modeNoteEl = document.getElementById('mode-note');
  const difficultyNoteEl = document.getElementById('difficulty-note');
  const skinNoteEl = document.getElementById('skin-note');
  if (startObjectivesCountEl) {
    startObjectivesCountEl.textContent = `${unlockedAchievements}/${ACHIEVEMENT_DEFS.length}`;
  }

  if (modeNoteEl) {
    modeNoteEl.textContent = gameSettings.mode === 'timeattack'
      ? 'Contrarreloj aprieta desde el segundo uno y premia decisiones rápidas.'
      : 'Clásico deja crecer la partida con power-ups, bosses y oleadas sin límite de tiempo.';
  }
  if (difficultyNoteEl) {
    difficultyNoteEl.textContent = gameSettings.difficulty === 'easy'
      ? 'Fácil acelera la entrada y deja margen para dominar el ritmo.'
      : gameSettings.difficulty === 'hard'
        ? 'Difícil reduce el margen de error y exprime mejor bosses y power-ups.'
        : 'Normal mantiene el equilibrio base entre presión, progreso y control.';
  }
  if (skinNoteEl) {
    skinNoteEl.textContent = `Skin activa ${SKIN_THEMES[gameSettings.skin].label}. ${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} desbloqueadas.`;
  }

  startSummaryEl.innerHTML = `
    <div class="summary-grid">
      <div class="summary-stat is-primary">
        <span class="summary-label">MEJOR MARCA</span>
        <strong class="summary-value">${highscore} pts</strong>
        <span class="summary-copy">Tu techo actual está en nivel ${bestLevel} con combo máximo x${bestCombo}.</span>
        <span class="summary-meta">${aggregateStats.totalTimeMs ? `Tiempo total ${formatDuration(aggregateStats.totalTimeMs)}` : 'Todavia sin tiempo acumulado relevante'}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">ULTIMA SESION</span>
        <strong class="summary-value">${latestSession ? `${latestSession.score} pts` : 'SIN DATOS'}</strong>
        <span class="summary-copy">${latestSession ? `Nivel ${latestSession.level} · ${latestSession.accuracy}% precisión · ${formatModeLabel(latestSession.mode)}` : 'Juega una partida para ver aquí tu cierre más reciente.'}</span>
        <span class="summary-meta">${latestSession ? `${formatDifficultyLabel(latestSession.difficulty)} · ${formatPlayedAt(latestSession.playedAt)}` : 'Tu última sesión aparecerá aquí automáticamente.'}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">PERFIL</span>
        <strong class="summary-value">${aggregateStats.gamesPlayed}</strong>
        <span class="summary-copy">${aggregateStats.gamesPlayed ? `${globalAccuracy}% global · media ${averageScore} pts · ${aggregateStats.totalBossesDefeated} bosses · ${aggregateStats.totalUfoDestroyed} UFO` : 'Aún no hay suficiente histórico para perfilar tu estilo.'}</span>
        <span class="summary-meta">${aggregateStats.totalPowerUpsCollected} power-ups · ${metaState.unlockedBadges.length} insignias · ${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} skins</span>
      </div>
    </div>
    <div class="summary-ribbon">
      <span class="summary-ribbon-label">ACTIVA</span>
      <strong class="summary-ribbon-value">${formatModeLabel(gameSettings.mode)} · ${formatDifficultyLabel(gameSettings.difficulty)} · ${SKIN_THEMES[gameSettings.skin].label}</strong>
      <span class="summary-ribbon-copy">${gameSettings.reducedEffects ? 'Efectos reducidos' : 'Visual completa'} · ${gameSettings.highContrast ? 'Alto contraste' : 'Contraste estándar'} · ${aggregateStats.totalTimeAttackGames} runs contrarreloj</span>
    </div>
  `;

  startObjectiveEl.innerHTML = `
    <div class="objective-card${challengeCompleted ? ' is-complete' : ''}">
      <span class="objective-kicker">OBJETIVO ACTUAL</span>
      <strong class="objective-title">${currentChallenge.title}</strong>
      <span class="objective-copy">${currentChallenge.copy}</span>
      <span class="objective-progress${challengeCompleted ? ' is-complete' : ''}">${challengeCompleted ? 'COMPLETADO HOY' : getChallengeProgressText()}</span>
      ${renderProgressMeter(challengeCompleted ? 1 : (currentChallenge.progressRatio ? currentChallenge.progressRatio(currentRunStats) : 0))}
      <span class="objective-reward">${currentChallenge.rewardCopy}</span>
    </div>
    <div class="objective-card">
      <span class="objective-kicker">RUTA META</span>
      <strong class="objective-title">${challengeMilestone.title}</strong>
      <span class="objective-copy">${challengeMilestone.copy}</span>
      <span class="objective-progress">${challengeMilestone.progress}</span>
      ${renderProgressMeter(challengeMilestone.ratio)}
      <span class="objective-reward">SIGUIENTE RECOMPENSA · ${challengeMilestone.reward}</span>
    </div>
  `;

  const pendingTabBody = pendingGroups.length
    ? pendingGroups.map(({ category, items }) => `
        <div class="start-objective-group">
          <div class="start-objective-group-head">
            <strong>${category}</strong>
            <span>${items.length} pendientes</span>
          </div>
          <div class="start-objective-list">
            ${items.map(({ def, progress }) => renderStartObjectiveEntry(def, { progress })).join('')}
          </div>
        </div>
      `).join('')
    : '<div class="achievement-empty">Ya no quedan hitos pendientes en el catálogo actual.</div>';

  const completedTabBody = completedGroups.length
    ? completedGroups.map(({ category, items }) => `
        <div class="start-objective-group">
          <div class="start-objective-group-head">
            <strong>${category}</strong>
            <span>${items.length} logrados</span>
          </div>
          <div class="start-objective-list">
            ${items.map(({ def, state }) => renderStartObjectiveEntry(def, { unlocked: true, unlockedAt: state.unlockedAt })).join('')}
          </div>
        </div>
      `).join('')
    : '<div class="achievement-empty">Todavía no has conseguido ningún objetivo.</div>';

  startAchievementsEl.innerHTML = `
    <div class="start-objectives-shell">
      <div class="start-objective-tabs-shell">
        <div class="start-objective-tabs" role="tablist" aria-label="Estado de objetivos">
          <button type="button" class="start-objective-tab${startObjectivesTab === 'pending' ? ' is-active' : ''}" data-start-objectives-tab="pending" role="tab" aria-selected="${startObjectivesTab === 'pending'}">PENDIENTES <span>${pendingAchievements}</span></button>
          <button type="button" class="start-objective-tab${startObjectivesTab === 'completed' ? ' is-active' : ''}" data-start-objectives-tab="completed" role="tab" aria-selected="${startObjectivesTab === 'completed'}">LOGRADOS <span>${unlockedAchievements}</span></button>
        </div>
        <span class="start-objective-tabs-caption">${startObjectivesTab === 'pending' ? 'Revisa todo lo que aún te queda por conseguir, empezando por lo más cercano.' : 'Consulta todos los hitos ya completados dentro de tu perfil actual.'}</span>
      </div>
      <div class="start-objective-tab-panel" data-active-tab="${startObjectivesTab}">
        ${startObjectivesTab === 'pending' ? pendingTabBody : completedTabBody}
      </div>
    </div>
  `;
}

function completeCurrentChallengeIfNeeded() {
  const stamp = getChallengeStamp();
  if (!metaState.completedChallenges[stamp] && isCurrentChallengeComplete()) {
    metaState.completedChallenges[stamp] = {
      completedAt: new Date().toISOString(),
      title: currentChallenge.title
    };
    metaState.challengeCompletions += 1;
    pushUnlockLog(createUnlockLogEntry('challenge', currentChallenge.title, 'Desafío activo completado.', '+1 sello de reto'));
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
    evaluateAchievements('meta');
    renderMetaPanel();
    renderStartScreenPanels();
  }
}

function checkMidRunMilestones() {
  evaluateAchievements('live', { live: true });
  completeCurrentChallengeIfNeeded();
}

function returnToMenu() {
  running = false;
  paused = false;
  showingLevelScreen = false;
  combo = 0;
  comboTimer = 0;
  screenShake = 0;
  cinematicFlash = 0;
  playerBullets.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;
  resetBoss();
  updateHudStatus();
  setOverlayMode('start');
  draw();
}

function setOverlayMode(mode, entry = null) {
  overlayMode = mode;
  overlay.dataset.mode = mode;
  renderStatsPanel();
  renderMetaPanel();
  renderStartScreenPanels();

  if (mode === 'start') {
    overlayKicker.textContent = 'ARCADE SESSION';
    overlayTitle.textContent = 'SPACE INVADERS';
    overlayMsg.innerHTML = 'Elige cómo vas a jugar, revisa tu progreso y entra con un objetivo claro desde el primer segundo.';
    btnStart.textContent = 'JUGAR';
    btnMenu.hidden = true;
    setPanelVisibility(gameSettingsPanel, true);
    setPanelVisibility(visualSettingsPanel, true);
    setPanelVisibility(startSummaryPanel, true);
    setPanelVisibility(startObjectivesPanel, true);
    setPanelVisibility(runPanel, false);
    setPanelVisibility(aggregatePanel, false);
    setPanelVisibility(historyPanel, false);
    setPanelVisibility(metaPanel, false);
  } else if (mode === 'pause') {
    overlayKicker.textContent = 'PARTIDA EN CURSO';
    overlayTitle.textContent = 'PAUSA';
    overlayMsg.innerHTML = 'Has detenido la partida. Revisa tu progreso y continua cuando quieras.';
    btnStart.textContent = 'CONTINUAR';
    btnMenu.hidden = true;
    runPanelTitle.textContent = 'PARTIDA ACTUAL';
    runPanelBadge.textContent = formatModeLabel(currentRunStats.mode);
    renderRunStats(entry, mode);
    setPanelVisibility(gameSettingsPanel, false);
    setPanelVisibility(visualSettingsPanel, false);
    setPanelVisibility(startSummaryPanel, false);
    setPanelVisibility(startObjectivesPanel, false);
    setPanelVisibility(runPanel, true);
    setPanelVisibility(aggregatePanel, true);
    setPanelVisibility(historyPanel, true);
    setPanelVisibility(metaPanel, true);
  } else {
    const timeout = entry && entry.reason === 'timeout';
    overlayKicker.textContent = timeout ? 'CUENTA ATRAS AGOTADA' : 'SESION FINALIZADA';
    overlayTitle.textContent = timeout ? 'TIEMPO' : 'GAME OVER';
    overlayMsg.innerHTML = timeout
      ? 'El contrarreloj ha llegado a cero. Tienes un cierre claro de la sesión, el progreso ganado y dos salidas rápidas para volver a entrar o reajustar la partida.'
      : entry && entry.score >= highscore
        ? 'Has firmado una gran marca. Revisa el cierre de la partida, los desbloqueos logrados y decide si relanzas otra run o vuelves al menú.'
        : 'La partida ha terminado. Aquí tienes el cierre completo, tu progreso y el siguiente paso claro sin ruido extra.';
    btnStart.textContent = 'REINTENTAR';
    btnMenu.hidden = false;
    runPanelTitle.textContent = 'ULTIMA PARTIDA';
    runPanelBadge.textContent = formatModeLabel(entry?.mode || currentRunStats.mode);
    renderRunStats(entry, mode);
    setPanelVisibility(gameSettingsPanel, false);
    setPanelVisibility(visualSettingsPanel, false);
    setPanelVisibility(startSummaryPanel, false);
    setPanelVisibility(startObjectivesPanel, false);
    setPanelVisibility(runPanel, true);
    setPanelVisibility(aggregatePanel, true);
    setPanelVisibility(historyPanel, true);
    setPanelVisibility(metaPanel, true);
  }

  overlay.classList.add('visible');
}

let gameSettings = loadSettings();
let metaState = loadMetaState();
syncUnlockedRewardsFromAchievements();
sanitizeSelectedSkin();
let currentChallenge = getCurrentChallengeDefinition();
let scoreHistory = loadScoreHistory();
let aggregateStats = loadAggregateStats();
let currentRunStats = createRunStats();
let overlayMode = 'start';
let progressPanelTab = 'pending';
let startObjectivesTab = 'pending';
evaluateAchievements('profile', { silent: true });
evaluateAchievements('end', { silent: true });
evaluateAchievements('meta', { silent: true });
persistMetaState();

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
  const densityBase = Math.max(1, currentWaveEnemyCount || TOTAL_ENEMIES);
  const interval = Math.max(6, Math.round(30 * (aliveCount / densityBase)));
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
btnMenu.addEventListener('click', returnToMenu);
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
  renderStartScreenPanels();
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
  renderStartScreenPanels();
});
modeSelect.addEventListener('change', event => {
  gameSettings.mode = normalizeGameMode(event.target.value);
  persistGameSettings();
  applySettingsUI();
  updateHudStatus();
  renderStartScreenPanels();
});
vibrationToggle.addEventListener('change', event => {
  gameSettings.vibration = !!event.target.checked;
  persistGameSettings();
  renderStartScreenPanels();
});
reducedEffectsToggle.addEventListener('change', event => {
  gameSettings.reducedEffects = !!event.target.checked;
  persistGameSettings();
  applySettingsUI();
  renderStartScreenPanels();
});
highContrastToggle.addEventListener('change', event => {
  gameSettings.highContrast = !!event.target.checked;
  persistGameSettings();
  applySettingsUI();
  renderStartScreenPanels();
});
achievementSummaryEl.addEventListener('click', event => {
  const trigger = event.target.closest('[data-progress-tab]');
  if (!trigger) return;
  const nextTab = trigger.dataset.progressTab === 'completed' ? 'completed' : 'pending';
  if (progressPanelTab === nextTab) return;
  progressPanelTab = nextTab;
  renderMetaPanel();
});
startAchievementsEl.addEventListener('click', event => {
  const trigger = event.target.closest('[data-start-objectives-tab]');
  if (!trigger) return;
  const nextTab = trigger.dataset.startObjectivesTab === 'completed' ? 'completed' : 'pending';
  if (startObjectivesTab === nextTab) return;
  startObjectivesTab = nextTab;
  renderStartScreenPanels();
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
  const threatLevel = getThreatLevel();
  return Math.max(42, Math.round((110 - (threatLevel - 1) * 8) * preset.enemyShootFactor * (activeEffects.freeze > 0 ? 2.25 : 1)));
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

const ufo = { active: false, x: 0, y: 28, w: 50, h: 20, speed: 2, dir: 1, variant: 'bonus', points: 150 };
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
let currentWaveEnemyCount = TOTAL_ENEMIES;
let currentWavePattern = WAVE_PATTERNS.classic_grid;

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
  shootTimer: 0,
  profileId: 'striker',
  label: 'STRIKER',
  baseY: 68
};

function resetBoss() {
  boss.active = false;
  boss.hp = 0;
  boss.maxHp = 0;
  boss.shootTimer = 0;
  boss.entryTimer = 0;
  boss.flashTimer = 0;
  boss.profileId = 'striker';
  boss.label = 'STRIKER';
  boss.baseY = 68;
}

function shouldSpawnBossForLevel(currentLevel) {
  return currentLevel > 0 && currentLevel % 3 === 0;
}

function getEnemyLayout(pattern = currentWavePattern) {
  const totalW = COLS * E_W;
  const patternScale = pattern?.gapScaleX || 1;
  const gapX = Math.floor(((canvas.width - totalW - 20) / (COLS - 1)) * patternScale);
  const marginX = 10;
  const startY = Math.min((pattern?.startYBase || 65) + (level - 1) * 15, pattern?.maxStartY || 140);
  const gapY = pattern?.gapY || 46;
  return { marginX, gapX, gapY, startY };
}

function getEnemyTickInterval() {
  const preset = getDifficultyConfig();
  const alive = enemies.filter(enemy => enemy.alive).length;
  const threatLevel = getThreatLevel();
  const base = Math.max(5, 26 - (threatLevel - 1) * 1.7);
  return Math.max(3, Math.round(base * preset.enemyTickFactor * (alive / Math.max(1, currentWaveEnemyCount)) * (activeEffects.freeze > 0 ? 2.4 : 1)));
}

function getAliveEnemyBounds(enemyList = enemies) {
  const active = enemyList.filter(enemy => enemy.alive);
  if (!active.length) return null;
  return {
    left: Math.min(...active.map(enemy => enemy.x)),
    right: Math.max(...active.map(enemy => enemy.x + enemy.w))
  };
}

function spawnEnemies() {
  enemies.length = 0;
  currentWavePattern = getWavePatternForLevel(level, currentRunStats.mode || gameSettings.mode);
  const { marginX, gapX, gapY, startY } = getEnemyLayout(currentWavePattern);
  let aliveCount = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const rowMask = currentWavePattern.masks?.[row] || '11111111';
      const maskedOut = rowMask[col] === '0';
      const introEaseOut = level === 1 && row === 0 && col % 2 === 1;
      const alive = !maskedOut && !introEaseOut;
      const role = alive ? getEnemyRoleForSlot(row, col, currentWavePattern, level, currentRunStats.mode || gameSettings.mode) : 'classic';
      const roleDef = ENEMY_ROLE_DEFS[role] || ENEMY_ROLE_DEFS.classic;
      if (alive) aliveCount++;
      enemies.push({
        x: marginX + col * (E_W + gapX) + (currentWavePattern.rowShifts?.[row] || 0),
        y: startY + row * (E_H + gapY),
        w: E_W,
        h: E_H,
        alive,
        row,
        col,
        pose: 0,
        type: role,
        hp: roleDef.hp,
        maxHp: roleDef.hp,
        shootWeight: roleDef.shootWeight,
        moveBoost: roleDef.moveBoost,
        bulletSpeedBonus: roleDef.bulletSpeedBonus,
        scoreValue: Math.round(getEnemyBasePoints(row) * roleDef.scoreMultiplier),
        flashTimer: 0
      });
    }
  }

  currentWaveEnemyCount = Math.max(1, aliveCount);
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
  const profile = getBossProfileForLevel(level, currentRunStats.mode || gameSettings.mode);
  const threatLevel = getThreatLevel();
  bossEncounteredThisLevel = true;
  boss.active = true;
  boss.profileId = profile.id;
  boss.label = profile.label;
  boss.maxHp = profile.hpBase + Math.max(0, Math.floor(threatLevel / 3) - 1) * profile.hpStep;
  boss.hp = boss.maxHp;
  boss.speed = profile.speedBase + Math.min(1.15, (threatLevel - 1) * profile.speedStep);
  boss.dir = Math.random() < 0.5 ? -1 : 1;
  boss.phase = Math.random() * Math.PI * 2;
  boss.shootTimer = 0;
  boss.entryTimer = 84;
  boss.flashTimer = 0;
  boss.baseY = profile.baseY;
  boss.x = canvas.width / 2 - boss.w / 2;
  boss.y = -boss.h - 24;
  playerBullets.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;
  spawnFloatingText(canvas.width / 2, 92, `${profile.label} BOSS`, getBossAccentColor(profile.id));
  spawnShockwave(canvas.width / 2, canvas.height * 0.32, 'rgba(255,70,135,0.32)', 26, 3.8);
  spawnParticleBurst(canvas.width / 2, canvas.height * 0.32, {
    count: 22,
    color: getBossAccentColor(profile.id),
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
  const reward = getBossBaseReward(BOSS_PROFILES[boss.profileId] || BOSS_PROFILES.striker);
  currentRunStats.bossesDefeated++;
  score += reward;
  scoreEl.textContent = score;
  syncHighscore();
  spawnExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, 36);
  spawnShockwave(boss.x + boss.w / 2, boss.y + boss.h / 2, 'rgba(255,95,152,0.55)', 30, 4.6);
  spawnParticleBurst(boss.x + boss.w / 2, boss.y + boss.h / 2, {
    count: 30,
    color: getBossAccentColor(),
    speedMin: 2.2,
    speedMax: 6.2,
    lifeMin: 26,
    lifeMax: 48
  });
  spawnFloatingText(boss.x + boss.w / 2, boss.y - 4, `+${reward}`, getBossAccentColor());
  awardTimeBonus(TIME_ATTACK_BOSS_BONUS_MS);
  addScreenShake(14);
  triggerCinematicFlash(0.22);
  resetBoss();
  evaluateAchievements('live', { live: true });
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
        hit = true;
        currentRunStats.hits++;
        enemy.hp = Math.max(0, enemy.hp - 1);
        enemy.flashTimer = 5;
        const enemyColor = getEnemyRoleColor(enemy);
        if (enemy.hp <= 0) {
          enemy.alive = false;
          combo++;
          comboTimer = 90;
          currentRunStats.enemiesDestroyed++;
          currentRunStats.maxCombo = Math.max(currentRunStats.maxCombo, combo);
          const points = getEnemyScore(enemy) * (combo > 1 ? combo : 1);
          score += points;
          scoreEl.textContent = score;
          syncHighscore();
          spawnExplosion(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
          spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, {
            count: enemy.type === 'tank' ? 13 : enemy.type === 'scout' ? 11 : 9,
            color: enemyColor,
            speedMin: 1.4,
            speedMax: 4.3,
            lifeMin: 16,
            lifeMax: 30
          });
          spawnShockwave(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 'rgba(255,180,80,0.22)', enemy.type === 'tank' ? 12 : 10, enemy.type === 'tank' ? 3.2 : 2.5);
          spawnFloatingText(enemy.x + enemy.w / 2, enemy.y, `${combo > 1 ? `x${combo} ` : ''}+${points}`, combo > 1 ? '#ff8800' : '#ffff00');
          maybeDropPowerUp(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
          addScreenShake(combo > 2 ? 4 : enemy.type === 'tank' ? 3 : 2);
        } else {
          spawnParticleBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, {
            count: 6,
            color: enemyColor,
            speedMin: 0.8,
            speedMax: 2.6,
            lifeMin: 12,
            lifeMax: 20
          });
          spawnFloatingText(enemy.x + enemy.w / 2, enemy.y - 2, `ARMOR ${enemy.hp}/${enemy.maxHp}`, '#ffd38a');
          addScreenShake(1.4);
        }
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
      const variant = getUfoVariantDef();
      currentRunStats.hits++;
      currentRunStats.ufoDestroyed++;
      score += variant.points;
      scoreEl.textContent = score;
      syncHighscore();
      spawnExplosion(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2);
      spawnParticleBurst(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2, {
        count: 12,
        color: variant.color,
        speedMin: 1.6,
        speedMax: 4.6,
        lifeMin: 18,
        lifeMax: 34
      });
      spawnFloatingText(ufo.x + ufo.w / 2, ufo.y, `+${variant.points}`, variant.color);
      if (variant.id === 'cargo') spawnPowerUp(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2);
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
  const profile = BOSS_PROFILES[boss.profileId] || BOSS_PROFILES.striker;
  const threatLevel = getThreatLevel();

  if (boss.entryTimer > 0) {
    boss.entryTimer--;
    boss.y += ((boss.baseY || 70) - boss.y) * 0.12;
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
  if (profile.movePattern === 'pulse') {
    boss.x += boss.dir * boss.speed * 0.82 * freezeFactor;
    boss.y = boss.baseY + Math.sin(boss.phase * 1.4) * 14;
  } else if (profile.movePattern === 'warden') {
    boss.x += boss.dir * boss.speed * 0.68 * freezeFactor;
    boss.y = boss.baseY + Math.sin(boss.phase * 0.8) * 7;
  } else {
    boss.x += boss.dir * boss.speed * freezeFactor;
    boss.y = boss.baseY + Math.sin(boss.phase) * 10;
  }
  boss.flashTimer = Math.max(0, (boss.flashTimer || 0) - 1);

  if (boss.x <= 18 || boss.x + boss.w >= canvas.width - 18) {
    boss.dir *= -1;
  }

  boss.shootTimer++;
  const preset = getDifficultyConfig();
  const shootIntervalBase = profile.volley === 'wall' ? 88 : profile.volley === 'burst' ? 64 : 72;
  const shootInterval = Math.max(34, Math.round((shootIntervalBase * preset.enemyShootFactor - (boss.maxHp - boss.hp) * 1.05) * (activeEffects.freeze > 0 ? 2.35 : 1)));
  if (boss.shootTimer >= shootInterval) {
    boss.shootTimer = 0;
    let spread = [-28, 28];
    if (profile.volley === 'burst') {
      spread = boss.hp <= Math.ceil(boss.maxHp / 2) ? [-34, 0, 34] : [-18, 18];
    } else if (profile.volley === 'wall') {
      spread = [-48, -20, 0, 20, 48];
    } else if (boss.hp <= Math.ceil(boss.maxHp / 2)) {
      spread = [-36, 0, 36];
    }
    for (const offset of spread) {
      enemyBullets.push({
        x: boss.x + boss.w / 2 + offset - 3,
        y: boss.y + boss.h - 2,
        w: 6,
        h: 14,
        speed: preset.enemyBulletBase + 1.1 + (threatLevel - 1) * 0.13 + (profile.volley === 'burst' ? 0.18 : profile.volley === 'wall' ? -0.08 : 0),
        fromBoss: true,
        tint: getBossAccentColor(profile.id)
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
  for (const enemy of enemies) {
    enemy.flashTimer = Math.max(0, (enemy.flashTimer || 0) - 1);
  }

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
          if (enemy.alive) {
            enemy.y += ENEMY_STEP_Y;
            enemy.pose = enemyAnimFrame % 2;
          }
        });
        enemyDir *= -1;
        pendingDrop = false;
      } else {
        const bounds = getAliveEnemyBounds(aliveEnemies);
        if (bounds) {
          const desiredStep = enemyDir * ENEMY_STEP_X;
          let appliedStep = desiredStep;

          if (enemyDir > 0 && bounds.right + desiredStep > canvas.width - 8) {
            appliedStep = canvas.width - 8 - bounds.right;
          } else if (enemyDir < 0 && bounds.left + desiredStep < 8) {
            appliedStep = 8 - bounds.left;
          }

          enemies.forEach(enemy => {
            if (enemy.alive) {
              enemy.x += appliedStep;
              enemy.pose = enemyAnimFrame % 2;
            }
          });

          const nextBounds = getAliveEnemyBounds(aliveEnemies);
          if (nextBounds && (nextBounds.right >= canvas.width - 8 || nextBounds.left <= 8)) {
            pendingDrop = true;
          }
        }
      }
    }

    if (aliveEnemies.some(enemy => enemy.y + enemy.h >= player.y)) triggerDeath();
    if (!running) return;

    enemyShootTimer++;
    if (enemyShootTimer >= getEnemyShootInterval()) {
      enemyShootTimer = 0;
      const columns = {};
      for (const enemy of aliveEnemies) {
        const columnKey = enemy.col;
        if (!columns[columnKey]) columns[columnKey] = [];
        columns[columnKey].push(enemy);
      }
      const shooters = Object.values(columns).map(columnEnemies => columnEnemies.reduce((lowest, enemy) => (
        enemy.y > lowest.y ? enemy : lowest
      )));
      if (shooters.length) {
        const weightedShooters = shooters.map(enemy => [enemy, enemy.shootWeight || 1]);
        const totalWeight = weightedShooters.reduce((sum, [, weight]) => sum + weight, 0);
        let roll = Math.random() * totalWeight;
        let primaryShooter = weightedShooters[0][0];
        for (const [enemy, weight] of weightedShooters) {
          roll -= weight;
          if (roll <= 0) {
            primaryShooter = enemy;
            break;
          }
        }
        createEnemyBullet(primaryShooter);
        if ((level >= 7 || currentRunStats.mode === 'timeattack') && shooters.length > 2 && Math.random() < (currentRunStats.mode === 'timeattack' ? 0.34 : 0.16)) {
          const secondaryPool = shooters.filter(enemy => enemy !== primaryShooter);
          if (secondaryPool.length) {
            const secondary = secondaryPool[Math.floor(Math.random() * secondaryPool.length)];
            createEnemyBullet(secondary, { speed: (getDifficultyConfig().enemyBulletBase + (getThreatLevel() - 1) * getDifficultyConfig().enemyBulletStep + (secondary.bulletSpeedBonus || 0)) * 0.92 });
          }
        }
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
    const variant = getUfoVariantDef(rollUfoVariant(level, currentRunStats.mode || gameSettings.mode));
    ufo.active = true;
    ufo.variant = variant.id;
    ufo.points = variant.points;
    ufo.speed = variant.speed;
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
  const color = enemy.flashTimer > 0 ? '#ffffff' : getEnemyRoleColor(enemy);
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowBlur = enemy.type === 'tank' ? 8 : 4;
  ctx.shadowColor = color;

  if (enemy.type === 'scout') {
    ctx.fillRect(enemy.x + 6, enemy.y + 6, enemy.w - 12, enemy.h - 10);
    ctx.fillRect(enemy.x + 10, enemy.y + 2, 4, 6);
    ctx.fillRect(enemy.x + enemy.w - 14, enemy.y + 2, 4, 6);
    ctx.fillRect(enemy.x + 2, enemy.y + enemy.h - 6, 8, 4);
    ctx.fillRect(enemy.x + enemy.w - 10, enemy.y + enemy.h - 6, 8, 4);
  } else if (enemy.type === 'shooter') {
    ctx.fillRect(enemy.x + 5, enemy.y + 5, enemy.w - 10, enemy.h - 9);
    ctx.fillRect(enemy.x + enemy.w / 2 - 4, enemy.y - 1, 8, 8);
    ctx.fillRect(enemy.x + enemy.w / 2 - 2, enemy.y + enemy.h - 2, 4, 7);
    ctx.fillRect(enemy.x + 4, enemy.y + enemy.h - 5, 6, 5);
    ctx.fillRect(enemy.x + enemy.w - 10, enemy.y + enemy.h - 5, 6, 5);
  } else if (enemy.type === 'tank') {
    ctx.fillRect(enemy.x + 3, enemy.y + 4, enemy.w - 6, enemy.h - 8);
    ctx.fillRect(enemy.x + 8, enemy.y, enemy.w - 16, 7);
    ctx.fillRect(enemy.x + 1, enemy.y + enemy.h - 7, 10, 7);
    ctx.fillRect(enemy.x + enemy.w - 11, enemy.y + enemy.h - 7, 10, 7);
    ctx.fillStyle = enemy.flashTimer > 0 ? '#fff6db' : 'rgba(255,244,210,0.7)';
    ctx.fillRect(enemy.x + 10, enemy.y + 10, enemy.w - 20, 4);
  } else if (enemy.pose === 0) {
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
  ctx.restore();
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
  const accent = getBossAccentColor();
  const bossColor = boss.flashTimer > 0 ? '#ffeef6' : accent;
  ctx.fillStyle = bossColor;
  ctx.shadowBlur = boss.entryTimer > 0 ? 26 : 16;
  ctx.shadowColor = boss.flashTimer > 0 ? '#ffffff' : accent;
  ctx.fillRect(boss.x + 18, boss.y + 12, boss.w - 36, 22);
  ctx.fillRect(boss.x + 10, boss.y + 24, boss.w - 20, 16);
  ctx.fillRect(boss.x + boss.w / 2 - 12, boss.y + 2, 24, 14);
  ctx.fillRect(boss.x + 18, boss.y + 40, 18, 12);
  ctx.fillRect(boss.x + boss.w - 36, boss.y + 40, 18, 12);
  if (boss.profileId === 'pulse') {
    ctx.fillStyle = '#fff0b5';
    ctx.fillRect(boss.x + 30, boss.y + 18, boss.w - 60, 8);
    ctx.fillRect(boss.x + boss.w / 2 - 5, boss.y + 34, 10, 16);
  } else if (boss.profileId === 'warden') {
    ctx.fillStyle = '#dff7ff';
    ctx.fillRect(boss.x + 26, boss.y + 18, 18, 12);
    ctx.fillRect(boss.x + boss.w - 44, boss.y + 18, 18, 12);
    ctx.fillRect(boss.x + 48, boss.y + 32, boss.w - 96, 6);
  } else {
    ctx.fillStyle = '#ffc6da';
    ctx.fillRect(boss.x + 38, boss.y + 26, 12, 6);
    ctx.fillRect(boss.x + boss.w - 50, boss.y + 26, 12, 6);
  }
  ctx.restore();

  const barWidth = 180;
  const ratio = boss.hp / boss.maxHp;
  const barX = canvas.width / 2 - barWidth / 2;
  const barY = 18;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(barX, barY, barWidth, 8);
  ctx.fillStyle = accent;
  ctx.fillRect(barX, barY, barWidth * ratio, 8);
  ctx.strokeStyle = boss.profileId === 'pulse' ? 'rgba(255,214,111,0.5)' : boss.profileId === 'warden' ? 'rgba(143,224,255,0.5)' : 'rgba(255,95,152,0.5)';
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
    ctx.fillStyle = bullet.tint || (bullet.fromBoss ? '#ff2f7d' : '#ff6600');
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });

  enemies.forEach(enemy => {
    if (enemy.alive) drawAlien(enemy);
  });

  if (ufo.active) {
    const variant = getUfoVariantDef();
    ctx.fillStyle = variant.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = variant.color;
    ctx.fillRect(ufo.x + 10, ufo.y + 6, ufo.w - 20, ufo.h - 10);
    ctx.fillRect(ufo.x, ufo.y + 12, ufo.w, 8);
    ctx.fillRect(ufo.x + ufo.w / 2 - 6, ufo.y, 12, 8);
    if (variant.id === 'cargo') {
      ctx.fillRect(ufo.x + 20, ufo.y + 4, 10, 6);
      ctx.fillRect(ufo.x + ufo.w - 30, ufo.y + 4, 10, 6);
    } else if (variant.id === 'phantom') {
      ctx.globalAlpha = 0.35;
      ctx.fillRect(ufo.x + 6, ufo.y + 10, ufo.w - 12, 6);
      ctx.globalAlpha = 1;
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = variant.color;
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`${variant.points}`, ufo.x + ufo.w / 2, ufo.y - 2);
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
    ctx.fillStyle = getBossAccentColor();
    ctx.font = `bold ${Math.floor(canvas.width / 18)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(`${boss.label} WARNING`, canvas.width / 2, canvas.height * 0.28);
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
  if (entry.mode === 'timeattack') aggregateStats.totalTimeAttackGames += 1;
  else aggregateStats.totalClassicGames += 1;
  aggregateStats.bestLevel = Math.max(aggregateStats.bestLevel, entry.level);
  aggregateStats.bestCombo = Math.max(aggregateStats.bestCombo, entry.maxCombo);
  if (entry.mode === 'timeattack') aggregateStats.bestTimeAttackScore = Math.max(aggregateStats.bestTimeAttackScore, entry.score);
  if (entry.shots >= 25) aggregateStats.bestAccuracy25 = Math.max(aggregateStats.bestAccuracy25, entry.accuracy);
  if (entry.shots >= 35) aggregateStats.bestAccuracy35 = Math.max(aggregateStats.bestAccuracy35, entry.accuracy);
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
  const finalSnapshot = getLiveRunSnapshot();
  const finalAccuracy = finalSnapshot.accuracy;
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
  evaluateAchievements('end');
  evaluateAchievements('profile');
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
  ufo.variant = 'bonus';
  ufo.points = UFO_VARIANTS.bonus.points;
  ufo.speed = UFO_VARIANTS.bonus.speed;
  ufoSpawnTimer = 0;
  bossEncounteredThisLevel = false;
  heartbeatTimer = 0;
  heartbeatIdx = 0;
  currentWavePattern = WAVE_PATTERNS.classic_grid;
  currentWaveEnemyCount = TOTAL_ENEMIES;
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
