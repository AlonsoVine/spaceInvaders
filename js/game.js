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
const shipSkinSelect = document.getElementById('ship-skin-select');
const difficultySelect = document.getElementById('difficulty-select');
const modeSelect = document.getElementById('mode-select');
const startLevelSelectorEl = document.getElementById('start-level-selector');
const startLevelStatusEl = document.getElementById('start-level-status');
const vibrationToggle = document.getElementById('toggle-vibration');
const reducedEffectsToggle = document.getElementById('toggle-reduced-effects');
const highContrastToggle = document.getElementById('toggle-high-contrast');
const btnMusic = document.getElementById('btn-music');
const btnFullscreen = document.getElementById('btn-fullscreen');
const musicVolumeEl = document.getElementById('music-volume');
const fxVolumeEl = document.getElementById('fx-volume');
const musicVolumeValueEl = document.getElementById('music-volume-value');
const fxVolumeValueEl = document.getElementById('fx-volume-value');
const btnOpenTutorial = document.getElementById('btn-open-tutorial');
const btnResetProfile = document.getElementById('btn-reset-profile');
const fullscreenTarget = document.body;
const gameSettingsPanel = document.getElementById('game-settings-panel');
const visualSettingsPanel = document.getElementById('visual-settings-panel');
const startSummaryPanel = document.getElementById('start-summary-panel');
const startObjectivesPanel = document.getElementById('start-objectives-panel');
const bestiaryPanel = document.getElementById('bestiary-panel');
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
const bestiaryBrowserEl = document.getElementById('bestiary-browser');
const shipPreviewCanvas = document.getElementById('ship-preview-canvas');
const shipPreviewCtx = shipPreviewCanvas ? shipPreviewCanvas.getContext('2d') : null;
const challengeSummaryEl = document.getElementById('challenge-summary');
const achievementSummaryEl = document.getElementById('achievement-summary');
const overlayDialog = document.getElementById('overlay-dialog');
const overlayDialogTitle = document.getElementById('overlay-dialog-title');
const overlayDialogBadge = document.getElementById('overlay-dialog-badge');
const overlayDialogBody = document.getElementById('overlay-dialog-body');
const btnDialogSecondary = document.getElementById('btn-dialog-secondary');
const btnDialogPrimary = document.getElementById('btn-dialog-primary');

const SETTINGS_KEY = 'si_settings';
const HISTORY_KEY = 'si_history';
const AGGREGATE_STATS_KEY = 'si_stats';
const META_KEY = 'si_meta';
const MAX_LIVES = 5;
const LEVEL_SCREEN_DURATION = 120;
const TIME_ATTACK_DURATION_MS = 90000;
const TIME_ATTACK_WAVE_BONUS_MS = 7000;
const TIME_ATTACK_BOSS_BONUS_MS = 12000;
const TIME_ATTACK_MAX_MS = 120000;
const MAX_START_LEVEL_OPTION = 24;
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

const SHIP_SKIN_DEFS = {
  classic: {
    label: 'CLASSIC',
    copy: 'La silueta base del arcade.'
  },
  arrow: {
    label: 'ARROW',
    copy: 'Perfil estrecho y más agresivo.'
  },
  bulwark: {
    label: 'BULWARK',
    copy: 'Casco ancho y pesado para runs largas.'
  },
  nova: {
    label: 'NOVA',
    copy: 'Cabina afilada para sesiones de precisión.'
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
  commander: { label: 'COMMANDER', copy: 'Tu disciplina meta ya es visible.' },
  spotter: { label: 'SPOTTER', copy: 'Reconoces todas las siluetas base del frente.' },
  radar: { label: 'RADAR', copy: 'Ya lees el tráfico UFO como un patrón conocido.' },
  breacher: { label: 'BREACHER', copy: 'Las élites dejan de parecer encuentros aislados.' },
  archivist: { label: 'ARCHIVIST', copy: 'Tu archivo de amenazas ya tiene criterio real.' },
  breaker: { label: 'BREAKER', copy: 'Sabes desarmar lo más duro del tablero.' }
};

const BESTIARY_CATEGORY_LABELS = {
  invaders: 'INVADERS',
  ufo: 'UFO',
  elite: 'ELITES',
  boss: 'BOSSES'
};

const BESTIARY_CATEGORIES = ['invaders', 'ufo', 'elite', 'boss'];

const BESTIARY_DEFS = {
  enemy_classic: {
    id: 'enemy_classic',
    category: 'invaders',
    title: 'CLASSIC',
    copy: 'La base de la oleada. Sigue siendo la referencia del ritmo clásico.',
    preview: { kind: 'enemy', type: 'classic' },
    stats: ['VIDA 1', 'ATAQUE BASE', 'MOVILIDAD ESTANDAR', '10-30 PTS'],
    tipTitle: 'INVADER BASE',
    tipCopy: 'El clásico define el ritmo de la formación. Aprende su cadencia antes de perseguir objetivos más raros.'
  },
  enemy_shooter: {
    id: 'enemy_shooter',
    category: 'invaders',
    title: 'SHOOTER',
    copy: 'Prioridad táctica. Dispara más y aprieta columnas enteras si lo dejas vivo.',
    preview: { kind: 'enemy', type: 'shooter' },
    stats: ['VIDA 1', 'ATAQUE ALTO', 'MOVILIDAD ESTANDAR', '+35% PTS'],
    tipTitle: 'SHOOTER DETECTADO',
    tipCopy: 'Si una columna se ensucia, limpia primero al shooter. Es el tipo que más castiga el desorden.'
  },
  enemy_scout: {
    id: 'enemy_scout',
    category: 'invaders',
    title: 'SCOUT',
    copy: 'Silueta ligera y más nerviosa. Sube la lectura de espacio en oleadas vivas.',
    preview: { kind: 'enemy', type: 'scout' },
    stats: ['VIDA 1', 'ATAQUE MEDIO', 'MOVILIDAD ALTA', '+25% PTS'],
    tipTitle: 'SCOUT ENTRANTE',
    tipCopy: 'El scout no aguanta mucho, pero acelera la sensación de presión. Córtalo antes de que cierre huecos.'
  },
  enemy_tank: {
    id: 'enemy_tank',
    category: 'invaders',
    title: 'TANK',
    copy: 'Blindado corto pero molesto. Exige dos impactos y rompe inercias de limpieza rápida.',
    preview: { kind: 'enemy', type: 'tank' },
    stats: ['VIDA 2', 'ATAQUE BAJO', 'MOVILIDAD BAJA', '+80% PTS'],
    tipTitle: 'TANK LOCALIZADO',
    tipCopy: 'El tank pide dos impactos. Tenlo presente al disparar desde huecos cortos o perderás tempo.'
  },
  ufo_bonus: {
    id: 'ufo_bonus',
    category: 'ufo',
    title: 'BONUS UFO',
    copy: 'El objetivo clásico de puntos. Merece atención cuando el campo está bajo control.',
    preview: { kind: 'ufo', type: 'bonus' },
    stats: ['VIDA 1', 'ATAQUE NULO', 'VELOCIDAD ALTA', '150 PTS'],
    tipTitle: 'UFO BONUS',
    tipCopy: 'Si la línea está limpia, ve a por él. No rompe la partida, pero premia reflejos y lectura.'
  },
  ufo_cargo: {
    id: 'ufo_cargo',
    category: 'ufo',
    title: 'CARGO UFO',
    copy: 'Variante de apoyo. Su destrucción garantiza power-up y cambia el valor de la persecución.',
    preview: { kind: 'ufo', type: 'cargo' },
    stats: ['VIDA 1', 'ATAQUE NULO', 'VELOCIDAD MEDIA', '110 PTS + DROP'],
    tipTitle: 'CARGO UFO',
    tipCopy: 'El cargo siempre compensa si puedes abrir hueco. Es la ruta rápida hacia más herramientas.'
  },
  ufo_disruptor: {
    id: 'ufo_disruptor',
    category: 'ufo',
    title: 'DISRUPTOR UFO',
    copy: 'No dispara, pero castiga si escapa acelerando la presión general de la oleada.',
    preview: { kind: 'ufo', type: 'disruptor' },
    stats: ['VIDA 1', 'ATAQUE INDIRECTO', 'VELOCIDAD ALTA', '170 PTS'],
    tipTitle: 'DISRUPTOR UFO',
    tipCopy: 'Si este se va, la oleada se vuelve más incómoda. Vale la pena priorizarlo aunque no dé drop.'
  },
  ufo_jackpot: {
    id: 'ufo_jackpot',
    category: 'ufo',
    title: 'JACKPOT UFO',
    copy: 'Raro, rápido y rentable. Condensa puntos y tiempo extra en una sola ventana corta.',
    preview: { kind: 'ufo', type: 'jackpot' },
    stats: ['VIDA 1', 'ATAQUE NULO', 'VELOCIDAD MUY ALTA', '280 PTS + TIEMPO'],
    tipTitle: 'JACKPOT UFO',
    tipCopy: 'Aparece poco y cruza rápido. Si lo lees a tiempo, puede cambiar la economía de la run.'
  },
  elite_escort: {
    id: 'elite_escort',
    category: 'elite',
    title: 'ESCORT',
    copy: 'Escolta ligera del miniboss. Mete presión lateral y sostiene el encuentro si la ignoras.',
    preview: { kind: 'elite', type: 'escort' },
    stats: ['VIDA 2', 'ATAQUE MEDIO', 'VELOCIDAD MEDIA', '90 PTS'],
    tipTitle: 'ESCOLTA ELITE',
    tipCopy: 'Las escorts abren ángulos raros. Si el líder dura demasiado, ellas convierten el encuentro en una trampa.'
  },
  elite_prong: {
    id: 'elite_prong',
    category: 'elite',
    title: 'PRONG',
    copy: 'Ala exclusiva de TRIDENT. Entra con una silueta más afilada, abre la formación y castiga mejor los laterales.',
    preview: { kind: 'elite', type: 'prong' },
    stats: ['VIDA 3', 'ATAQUE MEDIO+', 'VELOCIDAD MEDIA', '90 PTS'],
    tipTitle: 'PRONG DETECTADA',
    tipCopy: 'Las PRONG no sostienen: pinchan. Si TRIDENT abre ángulo, córtalas antes de que conviertan la pantalla en una tenaza.'
  },
  elite_leader: {
    id: 'elite_leader',
    category: 'elite',
    title: 'MINI LEADER',
    copy: 'Centro de la escuadra élite. Aguanta mucho más y marca un pico intermedio de tensión.',
    preview: { kind: 'elite', type: 'leader' },
    stats: ['VIDA 7', 'ATAQUE ALTO', 'VELOCIDAD MEDIA', '220 PTS'],
    tipTitle: 'MINIBOSS LOCALIZADO',
    tipCopy: 'La escuadra élite entra para romper la linealidad. Corta escorts si el campo se cierra y vuelve al líder.'
  },
  elite_trident: {
    id: 'elite_trident',
    category: 'elite',
    title: 'TRIDENT',
    copy: 'Variante más agresiva del líder élite. Abre la escuadra, aprieta más con ráfagas y aguanta mejor el castigo.',
    preview: { kind: 'elite', type: 'trident' },
    stats: ['VIDA 9', 'ATAQUE EN RAFAGA', 'VELOCIDAD MEDIA+', '220 PTS'],
    tipTitle: 'TRIDENT EN PANTALLA',
    tipCopy: 'TRIDENT castiga más los ángulos laterales. Si la formación se abre, limpia escoltas rápido antes de volver al centro.'
  },
  boss_striker: {
    id: 'boss_striker',
    category: 'boss',
    title: 'STRIKER',
    copy: 'Boss agresivo y directo. Su patrón horizontal pide reflejos y limpieza de timing.',
    preview: { kind: 'boss', type: 'striker' },
    stats: ['VIDA ESCALADA', 'ATAQUE ALTO', 'MOVIMIENTO AGRESIVO', '500+ PTS'],
    tipTitle: 'BOSS STRIKER',
    tipCopy: 'El Striker premia la lectura rápida. Mantén centro limpio y evita gastar balas cuando se abre demasiado.'
  },
  boss_pulse: {
    id: 'boss_pulse',
    category: 'boss',
    title: 'PULSE',
    copy: 'Boss de ráfagas y pulsos. Castiga más por ritmo que por velocidad pura.',
    preview: { kind: 'boss', type: 'pulse' },
    stats: ['VIDA ESCALADA', 'ATAQUE EN RAFAGAS', 'MOVIMIENTO MEDIO', '500+ PTS'],
    tipTitle: 'BOSS PULSE',
    tipCopy: 'El Pulse no corre tanto, pero cambia la cadencia. Dispara entre ráfagas, no contra ellas.'
  },
  boss_warden: {
    id: 'boss_warden',
    category: 'boss',
    title: 'WARDEN',
    copy: 'Boss más pesado y controlador. Cierra espacio con menos prisa y más presencia.',
    preview: { kind: 'boss', type: 'warden' },
    stats: ['VIDA ESCALADA', 'ATAQUE DE CONTROL', 'MOVIMIENTO BAJO', '500+ PTS'],
    tipTitle: 'BOSS WARDEN',
    tipCopy: 'El Warden no corre, pero te encierra. Prioriza posiciones seguras y no te dejes arrastrar a los bordes.'
  },
  boss_overlord: {
    id: 'boss_overlord',
    category: 'boss',
    title: 'OVERLORD',
    copy: 'Boss de mando total. Mezcla presencia, ráfagas amplias y control central para cerrar encuentros largos.',
    preview: { kind: 'boss', type: 'overlord' },
    stats: ['VIDA ESCALADA', 'ATAQUE HIBRIDO', 'MOVIMIENTO ALTO', '500+ PTS'],
    tipTitle: 'BOSS OVERLORD',
    tipCopy: 'Overlord mezcla presión lateral y centro cargado. No te fijes solo en el patrón: lee la siguiente salva antes de disparar.'
  }
};

const TUTORIAL_SLIDES = [
  {
    title: 'CONTROLES BASE',
    copy: 'Muévete con flechas o táctil, dispara con espacio y pausa con P o ESC cuando necesites leer la situación.'
  },
  {
    title: 'POWER-UPS',
    copy: 'Corazón, escudo y mejoras temporales cambian tu margen. No recojas por recoger: intenta hacerlo cuando te den tempo real.'
  },
  {
    title: 'UFO Y EVENTOS',
    copy: 'No todos los UFO valen lo mismo. Cargo, disruptor o jackpot cambian puntos, drops y ritmo de la run.'
  },
  {
    title: 'ELITES Y BOSSES',
    copy: 'Las escuadras élite y los bosses rompen la rutina. Prioriza lectura, espacio libre y ventanas de disparo, no solo daño bruto.'
  },
  {
    title: 'META Y ARCHIVO',
    copy: 'Objetivos, bestiario y colección te dicen qué perseguir después. Usa la portada para entrar a cada partida con un propósito claro.'
  }
];

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
    id: 'boss_5',
    title: 'MURALLA DE ACERO',
    copy: 'Derrota 5 bosses en total y desbloquea un chasis pesado para la nave.',
    category: 'PROGRESION',
    tier: 'MASTER',
    reward: { type: 'shipSkin', id: 'bulwark' },
    track: 'profile',
    status: ctx => buildCountStatus(ctx.totalBossesDefeated, 5, 'BOSS')
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
    id: 'vector_precise',
    title: 'VECTOR FINO',
    copy: 'Cierra una partida con 55% de precisión y 20 disparos o más para desbloquear una nave ágil.',
    category: 'HABILIDAD',
    tier: 'CORE',
    reward: { type: 'shipSkin', id: 'arrow' },
    track: 'end',
    status: ctx => buildPercentStatus(ctx.bestAccuracy25, 55, 20)
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
    id: 'time_vector',
    title: 'VECTOR NOVA',
    copy: 'Lleva el contrarreloj a 2400 puntos para desbloquear una nueva silueta de nave.',
    category: 'MODOS',
    tier: 'MASTER',
    reward: { type: 'shipSkin', id: 'nova' },
    track: 'end',
    status: ctx => buildScoreStatus(ctx.aggregate.bestTimeAttackScore, 2400)
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
  },
  {
    id: 'bestiary_invaders',
    title: 'GUIA DE FRENTE',
    copy: 'Descubre los 4 tipos de invader y abre la capa base del bestiario.',
    category: 'COLECCION',
    tier: 'BASE',
    reward: { type: 'badge', id: 'spotter' },
    track: 'meta',
    status: ctx => buildCountStatus(countBestiarySeen(ctx.meta, ['enemy_classic', 'enemy_shooter', 'enemy_scout', 'enemy_tank']), 4, 'TIPOS')
  },
  {
    id: 'bestiary_ufo',
    title: 'TRAFICO INTERCEPTADO',
    copy: 'Registra las 4 variantes de UFO para leer mejor sus ventanas de valor.',
    category: 'COLECCION',
    tier: 'CORE',
    reward: { type: 'badge', id: 'radar' },
    track: 'meta',
    status: ctx => buildCountStatus(countBestiarySeen(ctx.meta, ['ufo_bonus', 'ufo_cargo', 'ufo_disruptor', 'ufo_jackpot']), 4, 'UFO')
  },
  {
    id: 'mini_squad',
    title: 'BRECHA ELITE',
    copy: 'Derrota a la escuadra élite una vez y desbloquea la lectura de encuentros intermedios.',
    category: 'PROGRESION',
    tier: 'CORE',
    reward: { type: 'badge', id: 'breacher' },
    track: 'meta',
    status: ctx => buildCountStatus(getBestiaryDefeatCount(ctx.meta, 'elite_leader'), 1, 'SQUAD')
  },
  {
    id: 'boss_archive',
    title: 'ARCHIVO BOSS',
    copy: 'Derrota al menos una vez a Striker, Pulse y Warden para completar el archivo principal.',
    category: 'COLECCION',
    tier: 'ELITE',
    reward: { type: 'badge', id: 'archivist' },
    track: 'meta',
    status: ctx => buildCountStatus(countBestiaryDefeated(ctx.meta, ['boss_striker', 'boss_pulse', 'boss_warden', 'boss_overlord']), 4, 'PERFILES')
  },
  {
    id: 'tank_breaker',
    title: 'ROMPETANQUES',
    copy: 'Elimina 20 tanks para demostrar que controlas el ritmo frente a armaduras cortas.',
    category: 'HABILIDAD',
    tier: 'CORE',
    reward: { type: 'badge', id: 'breaker' },
    track: 'meta',
    status: ctx => buildCountStatus(getBestiaryDefeatCount(ctx.meta, 'enemy_tank'), 20, 'TANKS')
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
    guaranteePowerUp: false,
    escapeEffect: null
  },
  cargo: {
    label: 'CARGO',
    points: 110,
    speed: 1.7,
    color: '#7ef2d5',
    guaranteePowerUp: true,
    escapeEffect: null
  },
  disruptor: {
    label: 'DISRUPTOR',
    points: 170,
    speed: 2.35,
    color: '#9e8bff',
    guaranteePowerUp: false,
    escapeEffect: 'disrupt'
  },
  jackpot: {
    label: 'JACKPOT',
    points: 280,
    speed: 3.25,
    color: '#ffd966',
    guaranteePowerUp: false,
    escapeEffect: 'jackpot'
  }
};

const WAVE_EVENT_DEFS = {
  standard: {
    id: 'standard',
    label: 'GRID ESTANDAR',
    copy: 'Oleada limpia y ritmo base.',
    tickFactor: 1,
    shootFactor: 1,
    ufoFactor: 1,
    powerUpFactor: 1
  },
  hunter: {
    id: 'hunter',
    label: 'CAZA ABIERTA',
    copy: 'Más tiradores activos y presión sostenida.',
    tickFactor: 1,
    shootFactor: 0.9,
    ufoFactor: 0.95,
    powerUpFactor: 1
  },
  armored: {
    id: 'armored',
    label: 'CAPA BLINDADA',
    copy: 'Más frontales duros, menos ritmo bruto.',
    tickFactor: 1.08,
    shootFactor: 1.08,
    ufoFactor: 1.05,
    powerUpFactor: 1.1
  },
  bonus: {
    id: 'bonus',
    label: 'RUTA BONUS',
    copy: 'Menos presión, más UFO y más drops.',
    tickFactor: 1.1,
    shootFactor: 1.12,
    ufoFactor: 0.72,
    powerUpFactor: 1.4
  }
};

const MINI_BOSS_PROFILES = {
  squad_basic: {
    id: 'squad_basic',
    label: 'MINI SQUAD',
    leaderHp: 7,
    escortHp: 2,
    speedBase: 2.15,
    reward: 420,
    horizontalSpan: 76,
    escortFireChance: 0.45,
    shootIntervalBase: 92,
    leaderVolleyOffsets: [0],
    escortWave: 'steady',
    enrageThreshold: 0
  },
  squad_basic_plus: {
    id: 'squad_basic_plus',
    label: 'MINI SQUAD',
    leaderHp: 8,
    escortHp: 3,
    speedBase: 2.22,
    reward: 470,
    horizontalSpan: 78,
    escortFireChance: 0.52,
    shootIntervalBase: 88,
    leaderVolleyOffsets: [0],
    escortWave: 'steady',
    enrageThreshold: 0.45
  },
  squad_trident: {
    id: 'squad_trident',
    label: 'TRIDENT',
    leaderHp: 9,
    wingHp: 3,
    speedBase: 2.32,
    reward: 520,
    horizontalSpan: 84,
    escortFireChance: 0.62,
    shootIntervalBase: 84,
    leaderVolleyOffsets: [-10, 10],
    escortWave: 'opening',
    enrageThreshold: 0.6
  },
  squad_trident_plus: {
    id: 'squad_trident_plus',
    label: 'TRIDENT',
    leaderHp: 10,
    wingHp: 3,
    speedBase: 2.42,
    reward: 580,
    horizontalSpan: 88,
    escortFireChance: 0.68,
    shootIntervalBase: 80,
    leaderVolleyOffsets: [-12, 0, 12],
    escortWave: 'opening',
    enrageThreshold: 0.65
  },
  squad_trident_apex: {
    id: 'squad_trident_apex',
    label: 'TRIDENT',
    leaderHp: 11,
    wingHp: 4,
    speedBase: 2.52,
    reward: 640,
    horizontalSpan: 92,
    escortFireChance: 0.74,
    shootIntervalBase: 76,
    leaderVolleyOffsets: [-14, 0, 14],
    escortWave: 'opening',
    enrageThreshold: 0.72
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
  },
  overlord: {
    id: 'overlord',
    label: 'OVERLORD',
    hpBase: 34,
    hpStep: 7,
    speedBase: 1.92,
    speedStep: 0.06,
    baseY: 72,
    movePattern: 'overlord',
    volley: 'hybrid',
    rewardMultiplier: 1.38
  }
};

const MINI_BOSS_CAMPAIGN_LEVELS = {
  4: 'squad_basic',
  9: 'squad_basic_plus',
  11: 'squad_trident',
  15: 'squad_trident_plus',
  17: 'squad_trident_plus',
  21: 'squad_trident_apex'
};

const BOSS_CAMPAIGN_LEVELS = {
  6: 'striker',
  12: 'pulse',
  18: 'warden',
  24: 'overlord'
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

function normalizeShipSkin(value) {
  return Object.prototype.hasOwnProperty.call(SHIP_SKIN_DEFS, value) ? value : 'classic';
}

function normalizeAudioVolume(value, fallback = 0.22) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.min(0.6, Math.max(0, parsed)) : fallback;
}

function normalizeStartLevel(value, maxUnlocked = MAX_START_LEVEL_OPTION) {
  const parsed = Math.max(1, Math.min(MAX_START_LEVEL_OPTION, Number.parseInt(value, 10) || 1));
  return Math.min(parsed, Math.max(1, maxUnlocked || 1));
}

function formatVolumePercent(value) {
  return `${Math.round((normalizeAudioVolume(value, 0) / 0.6) * 100)}%`;
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return {
      difficulty: normalizeDifficulty(stored.difficulty),
      mode: normalizeGameMode(stored.mode),
      startLevel: normalizeStartLevel(stored.startLevel),
      skin: normalizeSkin(stored.skin),
      shipSkin: normalizeShipSkin(stored.shipSkin),
      vibration: stored.vibration !== false,
      fxVolume: normalizeAudioVolume(stored.fxVolume, 0.22),
      reducedEffects: stored.reducedEffects === true,
      highContrast: stored.highContrast === true
    };
  } catch {
    return { difficulty: 'normal', mode: 'classic', startLevel: 1, skin: 'classic', shipSkin: 'classic', vibration: true, fxVolume: 0.22, reducedEffects: false, highContrast: false };
  }
}

function loadMetaState() {
  try {
    const stored = JSON.parse(localStorage.getItem(META_KEY) || '{}');
    const unlockedSkins = Array.isArray(stored.unlockedSkins)
      ? stored.unlockedSkins.map(normalizeSkin).filter((value, index, array) => array.indexOf(value) === index)
      : ['classic'];
    if (!unlockedSkins.includes('classic')) unlockedSkins.unshift('classic');
    const unlockedShipSkins = Array.isArray(stored.unlockedShipSkins)
      ? stored.unlockedShipSkins.map(normalizeShipSkin).filter((value, index, array) => array.indexOf(value) === index)
      : ['classic'];
    if (!unlockedShipSkins.includes('classic')) unlockedShipSkins.unshift('classic');
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
    const bestiary = stored.bestiary && typeof stored.bestiary === 'object'
      ? {
          seen: stored.bestiary.seen && typeof stored.bestiary.seen === 'object'
            ? Object.fromEntries(Object.keys(BESTIARY_DEFS).map(id => [id, stored.bestiary.seen[id] === true]))
            : {},
          defeated: stored.bestiary.defeated && typeof stored.bestiary.defeated === 'object'
            ? Object.fromEntries(Object.keys(BESTIARY_DEFS).map(id => [id, Math.max(0, Number(stored.bestiary.defeated[id]) || 0)]))
            : {}
        }
      : { seen: {}, defeated: {} };
    const tutorialFlags = stored.tutorialFlags && typeof stored.tutorialFlags === 'object'
      ? Object.fromEntries(Object.entries(stored.tutorialFlags).map(([key, value]) => [key, value === true]))
      : {};
    return {
      unlockedSkins,
      unlockedShipSkins,
      unlockedBadges,
      achievements,
      completedChallenges,
      challengeCompletions: Math.max(0, Number(stored.challengeCompletions) || 0),
      unlockLog,
      bestiary,
      tutorialFlags
    };
  } catch {
    return {
      unlockedSkins: ['classic'],
      unlockedShipSkins: ['classic'],
      unlockedBadges: [],
      achievements: {},
      completedChallenges: {},
      challengeCompletions: 0,
      unlockLog: [],
      bestiary: { seen: {}, defeated: {} },
      tutorialFlags: {}
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

function fillModelRect(ctxRef, x, y, w, h, rx, ry, rw, rh) {
  const px = Math.round(x + rx * w);
  const py = Math.round(y + ry * h);
  const pw = Math.max(2, Math.round(rw * w));
  const ph = Math.max(2, Math.round(rh * h));
  ctxRef.fillRect(px, py, pw, ph);
}

function fillShipRect(ctxRef, x, y, w, h, rx, ry, rw, rh) {
  fillModelRect(ctxRef, x, y, w, h, rx, ry, rw, rh);
}

function drawPlayerShipModel(ctxRef, x, y, w, h, model = gameSettings.shipSkin, color = '#00ff88', { glow = 0 } = {}) {
  if (!ctxRef) return;
  ctxRef.save();
  ctxRef.fillStyle = color;
  if (glow > 0) {
    ctxRef.shadowBlur = glow;
    ctxRef.shadowColor = color;
  }

  switch (normalizeShipSkin(model)) {
    case 'arrow':
      fillShipRect(ctxRef, x, y, w, h, 0.42, 0.0, 0.16, 0.44);
      fillShipRect(ctxRef, x, y, w, h, 0.29, 0.42, 0.42, 0.28);
      fillShipRect(ctxRef, x, y, w, h, 0.12, 0.54, 0.18, 0.18);
      fillShipRect(ctxRef, x, y, w, h, 0.70, 0.54, 0.18, 0.18);
      fillShipRect(ctxRef, x, y, w, h, 0.03, 0.66, 0.14, 0.16);
      fillShipRect(ctxRef, x, y, w, h, 0.83, 0.66, 0.14, 0.16);
      break;
    case 'bulwark':
      fillShipRect(ctxRef, x, y, w, h, 0.18, 0.0, 0.18, 0.3);
      fillShipRect(ctxRef, x, y, w, h, 0.64, 0.0, 0.18, 0.3);
      fillShipRect(ctxRef, x, y, w, h, 0.26, 0.26, 0.48, 0.28);
      fillShipRect(ctxRef, x, y, w, h, 0.06, 0.54, 0.88, 0.24);
      fillShipRect(ctxRef, x, y, w, h, 0.0, 0.66, 0.16, 0.18);
      fillShipRect(ctxRef, x, y, w, h, 0.84, 0.66, 0.16, 0.18);
      break;
    case 'nova':
      fillShipRect(ctxRef, x, y, w, h, 0.42, 0.0, 0.16, 0.36);
      fillShipRect(ctxRef, x, y, w, h, 0.3, 0.22, 0.4, 0.18);
      fillShipRect(ctxRef, x, y, w, h, 0.14, 0.42, 0.72, 0.2);
      fillShipRect(ctxRef, x, y, w, h, 0.0, 0.56, 0.18, 0.18);
      fillShipRect(ctxRef, x, y, w, h, 0.82, 0.56, 0.18, 0.18);
      fillShipRect(ctxRef, x, y, w, h, 0.22, 0.68, 0.16, 0.16);
      fillShipRect(ctxRef, x, y, w, h, 0.62, 0.68, 0.16, 0.16);
      break;
    case 'classic':
    default:
      fillShipRect(ctxRef, x, y, w, h, 0.2, 0.4, 0.6, 0.6);
      fillShipRect(ctxRef, x, y, w, h, 0.425, 0.0, 0.15, 0.5);
      fillShipRect(ctxRef, x, y, w, h, 0.0, 0.6, 0.25, 0.2);
      fillShipRect(ctxRef, x, y, w, h, 0.75, 0.6, 0.25, 0.2);
      break;
  }
  ctxRef.restore();
}

function drawEnemyModel(ctxRef, x, y, w, h, type = 'classic', color = '#00ff88', { glow = 4, pose = 0, flash = false } = {}) {
  if (!ctxRef) return;
  ctxRef.save();
  ctxRef.fillStyle = color;
  if (glow > 0) {
    ctxRef.shadowBlur = glow;
    ctxRef.shadowColor = color;
  }

  if (type === 'scout') {
    fillModelRect(ctxRef, x, y, w, h, 0.17, 0.19, 0.66, 0.56);
    fillModelRect(ctxRef, x, y, w, h, 0.28, 0.06, 0.11, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.61, 0.06, 0.11, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.06, 0.75, 0.22, 0.19);
    fillModelRect(ctxRef, x, y, w, h, 0.72, 0.75, 0.22, 0.19);
  } else if (type === 'shooter') {
    fillModelRect(ctxRef, x, y, w, h, 0.14, 0.16, 0.72, 0.59);
    fillModelRect(ctxRef, x, y, w, h, 0.39, -0.03, 0.22, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.44, 0.78, 0.11, 0.22);
    fillModelRect(ctxRef, x, y, w, h, 0.11, 0.69, 0.17, 0.16);
    fillModelRect(ctxRef, x, y, w, h, 0.72, 0.69, 0.17, 0.16);
  } else if (type === 'tank') {
    fillModelRect(ctxRef, x, y, w, h, 0.08, 0.13, 0.84, 0.63);
    fillModelRect(ctxRef, x, y, w, h, 0.22, 0, 0.56, 0.22);
    fillModelRect(ctxRef, x, y, w, h, 0.03, 0.78, 0.28, 0.22);
    fillModelRect(ctxRef, x, y, w, h, 0.69, 0.78, 0.28, 0.22);
    ctxRef.fillStyle = flash ? '#fff6db' : 'rgba(255,244,210,0.7)';
    fillModelRect(ctxRef, x, y, w, h, 0.28, 0.31, 0.44, 0.13);
  } else if (pose === 0) {
    fillModelRect(ctxRef, x, y, w, h, 0.11, 0.13, 0.78, 0.63);
    fillModelRect(ctxRef, x, y, w, h, 0.17, 0, 0.11, 0.19);
    fillModelRect(ctxRef, x, y, w, h, 0.72, 0, 0.11, 0.19);
    fillModelRect(ctxRef, x, y, w, h, 0, 0.75, 0.22, 0.19);
    fillModelRect(ctxRef, x, y, w, h, 0.78, 0.75, 0.22, 0.19);
  } else {
    fillModelRect(ctxRef, x, y, w, h, 0.11, 0.13, 0.78, 0.63);
    fillModelRect(ctxRef, x, y, w, h, 0.22, 0, 0.11, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.67, 0, 0.11, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.06, 0.81, 0.22, 0.13);
    fillModelRect(ctxRef, x, y, w, h, 0.72, 0.81, 0.22, 0.13);
  }
  ctxRef.restore();
}

function drawUfoModel(ctxRef, x, y, w, h, variantId = 'bonus', color = '#ff4f8f', { glow = 8, showPoints = false, points = 0 } = {}) {
  if (!ctxRef) return;
  const variant = getUfoVariantDef(variantId);
  ctxRef.save();
  ctxRef.fillStyle = color;
  if (glow > 0) {
    ctxRef.shadowBlur = glow;
    ctxRef.shadowColor = color;
  }
  fillModelRect(ctxRef, x, y, w, h, 0.17, 0.25, 0.66, 0.58);
  fillModelRect(ctxRef, x, y, w, h, 0, 0.5, 1, 0.33);
  fillModelRect(ctxRef, x, y, w, h, 0.4, 0, 0.2, 0.33);
  if (variant.id === 'cargo') {
    fillModelRect(ctxRef, x, y, w, h, 0.33, 0.17, 0.17, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.67, 0.17, 0.17, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.43, 0.63, 0.13, 0.25);
  } else if (variant.id === 'disruptor') {
    fillModelRect(ctxRef, x, y, w, h, 0.13, 0.17, 0.13, 0.33);
    fillModelRect(ctxRef, x, y, w, h, 0.74, 0.17, 0.13, 0.33);
    fillModelRect(ctxRef, x, y, w, h, 0.47, 0.08, 0.07, 0.92);
  } else if (variant.id === 'jackpot') {
    fillModelRect(ctxRef, x, y, w, h, 0.07, 0.42, 0.1, 0.42);
    fillModelRect(ctxRef, x, y, w, h, 0.83, 0.42, 0.1, 0.42);
    ctxRef.fillStyle = '#fff4b3';
    fillModelRect(ctxRef, x, y, w, h, 0.33, 0.21, 0.34, 0.21);
    ctxRef.fillStyle = color;
  }
  ctxRef.restore();

  if (showPoints) {
    ctxRef.save();
    ctxRef.fillStyle = color;
    ctxRef.font = '10px Courier New';
    ctxRef.textAlign = 'center';
    ctxRef.fillText(`${points || variant.points}`, x + w / 2, y - 2);
    ctxRef.restore();
  }
}

function drawMiniBossShipModel(ctxRef, x, y, w, h, role = 'escort', color = '#7be6ff', { glow = 8, flash = false, variant = 'squad_basic' } = {}) {
  if (!ctxRef) return;
  const baseColor = flash ? '#ffffff' : color;
  ctxRef.save();
  ctxRef.fillStyle = baseColor;
  if (glow > 0) {
    ctxRef.shadowBlur = glow;
    ctxRef.shadowColor = baseColor;
  }
  if (role === 'leader' && variant === 'squad_trident') {
    fillModelRect(ctxRef, x, y, w, h, 0.14, 0.3, 0.72, 0.28);
    fillModelRect(ctxRef, x, y, w, h, 0.06, 0.52, 0.88, 0.18);
    fillModelRect(ctxRef, x, y, w, h, 0.18, 0.08, 0.14, 0.34);
    fillModelRect(ctxRef, x, y, w, h, 0.43, 0.0, 0.14, 0.48);
    fillModelRect(ctxRef, x, y, w, h, 0.68, 0.08, 0.14, 0.34);
    fillModelRect(ctxRef, x, y, w, h, 0.12, 0.72, 0.18, 0.16);
    fillModelRect(ctxRef, x, y, w, h, 0.7, 0.72, 0.18, 0.16);
    ctxRef.fillStyle = flash ? '#ffffff' : '#fff2bf';
    fillModelRect(ctxRef, x, y, w, h, 0.46, 0.18, 0.08, 0.18);
  } else if (role === 'leader') {
    fillModelRect(ctxRef, x, y, w, h, 0.13, 0.24, 0.74, 0.41);
    fillModelRect(ctxRef, x, y, w, h, 0.04, 0.53, 0.92, 0.24);
    fillModelRect(ctxRef, x, y, w, h, 0.42, 0.06, 0.17, 0.29);
    fillModelRect(ctxRef, x, y, w, h, 0.13, 0.76, 0.17, 0.18);
    fillModelRect(ctxRef, x, y, w, h, 0.7, 0.76, 0.17, 0.18);
  } else if (role === 'prong') {
    fillModelRect(ctxRef, x, y, w, h, 0.1, 0.34, 0.8, 0.28);
    fillModelRect(ctxRef, x, y, w, h, 0.03, 0.52, 0.94, 0.18);
    fillModelRect(ctxRef, x, y, w, h, 0.12, 0.1, 0.14, 0.28);
    fillModelRect(ctxRef, x, y, w, h, 0.42, 0.02, 0.16, 0.42);
    fillModelRect(ctxRef, x, y, w, h, 0.74, 0.1, 0.14, 0.28);
    ctxRef.fillStyle = flash ? '#ffffff' : '#dffcff';
    fillModelRect(ctxRef, x, y, w, h, 0.45, 0.2, 0.1, 0.12);
  } else {
    fillModelRect(ctxRef, x, y, w, h, 0.12, 0.25, 0.76, 0.5);
    fillModelRect(ctxRef, x, y, w, h, 0.06, 0.5, 0.88, 0.25);
    fillModelRect(ctxRef, x, y, w, h, 0.41, 0.08, 0.18, 0.25);
  }
  ctxRef.restore();
}

function drawBossModel(ctxRef, x, y, w, h, profileId = 'striker', color = '#ff5f98', { glow = 16, flash = false } = {}) {
  if (!ctxRef) return;
  const baseColor = flash ? '#ffeef6' : color;
  ctxRef.save();
  ctxRef.fillStyle = baseColor;
  if (glow > 0) {
    ctxRef.shadowBlur = glow;
    ctxRef.shadowColor = flash ? '#ffffff' : color;
  }
  if (profileId === 'overlord') {
    fillModelRect(ctxRef, x, y, w, h, 0.1, 0.16, 0.8, 0.24);
    fillModelRect(ctxRef, x, y, w, h, 0.04, 0.34, 0.92, 0.24);
    fillModelRect(ctxRef, x, y, w, h, 0.42, 0.0, 0.16, 0.28);
    fillModelRect(ctxRef, x, y, w, h, 0.16, 0.62, 0.14, 0.16);
    fillModelRect(ctxRef, x, y, w, h, 0.7, 0.62, 0.14, 0.16);
    fillModelRect(ctxRef, x, y, w, h, 0.18, 0.52, 0.12, 0.12);
    fillModelRect(ctxRef, x, y, w, h, 0.7, 0.52, 0.12, 0.12);
    ctxRef.fillStyle = '#efe3ff';
    fillModelRect(ctxRef, x, y, w, h, 0.24, 0.24, 0.12, 0.12);
    fillModelRect(ctxRef, x, y, w, h, 0.64, 0.24, 0.12, 0.12);
    fillModelRect(ctxRef, x, y, w, h, 0.45, 0.42, 0.1, 0.18);
  } else {
    fillModelRect(ctxRef, x, y, w, h, 0.15, 0.18, 0.7, 0.32);
    fillModelRect(ctxRef, x, y, w, h, 0.08, 0.36, 0.84, 0.24);
    fillModelRect(ctxRef, x, y, w, h, 0.4, 0.03, 0.2, 0.2);
    fillModelRect(ctxRef, x, y, w, h, 0.15, 0.61, 0.15, 0.17);
    fillModelRect(ctxRef, x, y, w, h, 0.7, 0.61, 0.15, 0.17);
  }
  if (profileId === 'pulse') {
    ctxRef.fillStyle = '#fff0b5';
    fillModelRect(ctxRef, x, y, w, h, 0.25, 0.27, 0.5, 0.11);
    fillModelRect(ctxRef, x, y, w, h, 0.46, 0.52, 0.08, 0.23);
  } else if (profileId === 'warden') {
    ctxRef.fillStyle = '#dff7ff';
    fillModelRect(ctxRef, x, y, w, h, 0.22, 0.27, 0.15, 0.17);
    fillModelRect(ctxRef, x, y, w, h, 0.63, 0.27, 0.15, 0.17);
    fillModelRect(ctxRef, x, y, w, h, 0.4, 0.48, 0.2, 0.09);
  } else if (profileId === 'overlord') {
    ctxRef.fillStyle = '#d9b7ff';
    fillModelRect(ctxRef, x, y, w, h, 0.12, 0.24, 0.12, 0.14);
    fillModelRect(ctxRef, x, y, w, h, 0.76, 0.24, 0.12, 0.14);
  } else {
    ctxRef.fillStyle = '#ffc6da';
    fillModelRect(ctxRef, x, y, w, h, 0.32, 0.39, 0.1, 0.09);
    fillModelRect(ctxRef, x, y, w, h, 0.58, 0.39, 0.1, 0.09);
  }
  ctxRef.restore();
}

function renderShipPreview() {
  if (!shipPreviewCtx || !shipPreviewCanvas) return;
  const theme = getCurrentTheme();
  const { width, height } = shipPreviewCanvas;
  shipPreviewCtx.clearRect(0, 0, width, height);

  const gradient = shipPreviewCtx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(1,18,11,0.96)');
  gradient.addColorStop(1, 'rgba(1,7,5,0.98)');
  shipPreviewCtx.fillStyle = gradient;
  shipPreviewCtx.fillRect(0, 0, width, height);

  shipPreviewCtx.strokeStyle = 'rgba(0,255,136,0.14)';
  shipPreviewCtx.strokeRect(0.5, 0.5, width - 1, height - 1);
  shipPreviewCtx.fillStyle = 'rgba(0,255,136,0.06)';
  for (let row = 0; row < 5; row++) {
    shipPreviewCtx.fillRect(12, 18 + row * 12, width - 24, 1);
  }

  drawPlayerShipModel(shipPreviewCtx, width / 2 - 42, 22, 84, 42, gameSettings.shipSkin, theme.player, { glow: 10 });

  shipPreviewCtx.fillStyle = theme.playerBullet;
  shipPreviewCtx.fillRect(width / 2 - 2, 10, 4, 8);
  shipPreviewCtx.fillStyle = '#9ad9b8';
  shipPreviewCtx.font = '10px Courier New';
  shipPreviewCtx.textAlign = 'center';
  shipPreviewCtx.fillText(getShipSkinLabel(gameSettings.shipSkin), width / 2, height - 10);
  shipPreviewCtx.textAlign = 'left';
}

function applySettingsUI() {
  syncStartLevelSetting();
  difficultySelect.value = gameSettings.difficulty;
  modeSelect.value = gameSettings.mode;
  refreshSkinOptions();
  refreshShipSkinOptions();
  if (skinSelect) skinSelect.value = gameSettings.skin;
  if (shipSkinSelect) shipSkinSelect.value = gameSettings.shipSkin;
  vibrationToggle.checked = gameSettings.vibration;
  if (fxVolumeEl) fxVolumeEl.value = gameSettings.fxVolume.toFixed(2);
  if (reducedEffectsToggle) reducedEffectsToggle.checked = gameSettings.reducedEffects;
  if (highContrastToggle) highContrastToggle.checked = gameSettings.highContrast;
  renderStartLevelGrid();
  applyVisualPreferences();
  renderShipPreview();
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

function getMaxUnlockedStartLevel() {
  return Math.max(1, Math.min(MAX_START_LEVEL_OPTION, aggregateStats?.bestLevel || 1));
}

function syncStartLevelSetting() {
  const maxUnlocked = getMaxUnlockedStartLevel();
  gameSettings.startLevel = normalizeStartLevel(gameSettings.startLevel, maxUnlocked);
}

function renderStartLevelGrid() {
  if (!startLevelSelectorEl) return;
  syncStartLevelSetting();
  const maxUnlocked = getMaxUnlockedStartLevel();
  const isTimeAttack = gameSettings.mode === 'timeattack';
  if (startLevelStatusEl) {
    startLevelStatusEl.textContent = isTimeAttack
      ? 'Contrarreloj arranca en 1'
      : `Desbloqueado hasta ${maxUnlocked}`;
  }

  startLevelSelectorEl.innerHTML = Array.from({ length: MAX_START_LEVEL_OPTION }, (_, index) => {
    const levelValue = index + 1;
    const unlocked = levelValue <= maxUnlocked;
    const disabled = isTimeAttack || !unlocked;
    const active = !isTimeAttack && levelValue === gameSettings.startLevel;
    return `
      <button
        type="button"
        class="start-level-btn${active ? ' is-active' : ''}${disabled ? ' is-locked' : ''}"
        data-start-level="${levelValue}"
        ${disabled ? 'disabled aria-disabled="true"' : ''}
        aria-pressed="${active ? 'true' : 'false'}"
      >${levelValue}</button>
    `;
  }).join('');
}

function getThreatLevel(currentLevel = level) {
  if (currentLevel <= 4) return currentLevel;
  return 4 + (currentLevel - 4) * 0.72;
}

function shouldSpawnMiniBossForLevel(currentLevel) {
  return Boolean(MINI_BOSS_CAMPAIGN_LEVELS[currentLevel]);
}

function getMiniBossProfileForLevel(currentLevel) {
  const profileId = MINI_BOSS_CAMPAIGN_LEVELS[currentLevel];
  return MINI_BOSS_PROFILES[profileId] || MINI_BOSS_PROFILES.squad_basic;
}

function getWaveEventForLevel(currentLevel, mode = gameSettings.mode) {
  if (currentLevel <= 2) return WAVE_EVENT_DEFS.standard;
  const cycle = (currentLevel + (mode === 'timeattack' ? 1 : 0)) % 5;
  if (currentLevel >= 4 && cycle === 0) return WAVE_EVENT_DEFS.bonus;
  if (currentLevel >= 5 && cycle === 2) return WAVE_EVENT_DEFS.hunter;
  if (currentLevel >= 6 && cycle === 4) return WAVE_EVENT_DEFS.armored;
  return WAVE_EVENT_DEFS.standard;
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
  const eventId = currentWaveEvent.id;

  if (currentLevel >= 3 && row === 0) weightedRoles.push(['shooter', mode === 'timeattack' ? 4 : 3]);
  if (currentLevel >= 4 && (pattern.id === 'staggered' || isOuter)) weightedRoles.push(['scout', pattern.id === 'staggered' ? 4 : 2]);
  if (currentLevel >= 6 && pattern.id === 'split_wings' && isOuter) weightedRoles.push(['shooter', 2]);
  if (currentLevel >= 7 && ((pattern.id === 'fortress' && row > 0 && isCenter) || (pattern.id === 'spearhead' && row === 2 && isCenter))) {
    weightedRoles.push(['tank', 4]);
  }
  if (currentLevel >= 8 && mode === 'timeattack') weightedRoles.push(['scout', 2]);
  if (eventId === 'hunter' && currentLevel >= 4) weightedRoles.push(['shooter', row === 0 ? 5 : 3]);
  if (eventId === 'armored' && currentLevel >= 5 && row >= 1) weightedRoles.push(['tank', row === 2 ? 5 : 3]);

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
  const scriptedProfileId = BOSS_CAMPAIGN_LEVELS[currentLevel];
  if (scriptedProfileId) return BOSS_PROFILES[scriptedProfileId];

  const lateCycle = Math.max(0, Math.floor((currentLevel - 24) / 6));
  const lateSequence = mode === 'timeattack'
    ? ['overlord', 'pulse', 'striker', 'warden']
    : ['overlord', 'striker', 'pulse', 'warden'];
  return BOSS_PROFILES[lateSequence[lateCycle % lateSequence.length]] || BOSS_PROFILES.overlord;
}

function getBossBaseReward(profile) {
  return Math.round((500 + level * 50) * profile.rewardMultiplier);
}

function getLevelEncounterPreviewText(currentLevel, mode = running ? currentRunStats.mode : gameSettings.mode) {
  if (shouldSpawnBossForLevel(currentLevel)) {
    return `${getBossProfileForLevel(currentLevel, mode).label} ENTRA EN ESCENA`;
  }
  if (shouldSpawnMiniBossForLevel(currentLevel)) {
    return `${getMiniBossProfileForLevel(currentLevel).label} ENTRANTE`;
  }
  return 'Prepárate...';
}

function rollUfoVariant(currentLevel, mode = gameSettings.mode) {
  const weighted = [['bonus', 5]];
  if (currentLevel >= 3) weighted.push(['cargo', mode === 'timeattack' ? 2 : 3]);
  if (currentLevel >= 5) weighted.push(['disruptor', mode === 'timeattack' ? 3 : 2]);
  if (currentLevel >= 6) weighted.push(['jackpot', mode === 'timeattack' ? 2 : 1.5]);
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
  if (profileId === 'overlord') return '#d5a6ff';
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

function getBestiaryDefeatCount(meta, id) {
  return Math.max(0, Number(meta?.bestiary?.defeated?.[id]) || 0);
}

function countBestiarySeen(meta, ids) {
  return ids.filter(id => meta?.bestiary?.seen?.[id] === true).length;
}

function countBestiaryDefeated(meta, ids) {
  return ids.filter(id => getBestiaryDefeatCount(meta, id) > 0).length;
}

function getShipSkinLabel(id) {
  return SHIP_SKIN_DEFS[id]?.label || SHIP_SKIN_DEFS.classic.label;
}

function getRewardLabel(reward) {
  if (!reward) return 'SIN RECOMPENSA EXTRA';
  if (reward.type === 'skin' && SKIN_THEMES[reward.id]) return `SKIN ${SKIN_THEMES[reward.id].label}`;
  if (reward.type === 'shipSkin' && SHIP_SKIN_DEFS[reward.id]) return `NAVE ${SHIP_SKIN_DEFS[reward.id].label}`;
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

function queueTutorialPrompt(key, title, copy, duration = 240) {
  if (hasTutorialSeen(key) || activeTutorialPrompt?.key === key || pendingTutorialPromptQueue.some(entry => entry.key === key)) return false;
  markTutorialSeen(key);
  const prompt = { key, title, copy, timer: duration, maxTimer: duration };
  pendingTutorialPromptQueue.push(prompt);
  return true;
}

function updateTutorialPromptQueue() {
  if (!running || paused) return;
  if (!activeTutorialPrompt && pendingTutorialPromptQueue.length) {
    activeTutorialPrompt = pendingTutorialPromptQueue.shift();
  }
  if (!activeTutorialPrompt) return;
  activeTutorialPrompt.timer -= 1;
  if (activeTutorialPrompt.timer <= 0) {
    activeTutorialPrompt = null;
  }
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
      ${unlocked ? '' : renderProgressMeter(progress.ratio)}
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

function hasTutorialSeen(key) {
  return metaState.tutorialFlags?.[key] === true;
}

function markTutorialSeen(key) {
  if (!metaState.tutorialFlags) metaState.tutorialFlags = {};
  if (metaState.tutorialFlags[key]) return false;
  metaState.tutorialFlags[key] = true;
  persistMetaState();
  return true;
}

function hasSeenBestiaryEntry(id) {
  return metaState.bestiary?.seen?.[id] === true;
}

function markBestiarySeen(id, { showTip = true } = {}) {
  const def = BESTIARY_DEFS[id];
  if (!def) return false;
  if (!metaState.bestiary) metaState.bestiary = { seen: {}, defeated: {} };
  if (metaState.bestiary.seen[id] === true) return false;
  metaState.bestiary.seen[id] = true;
  persistMetaState();
  if (showTip && def.tipTitle && def.tipCopy) {
    queueTutorialPrompt(`bestiary:${id}`, def.tipTitle, def.tipCopy);
  }
  evaluateAchievements('meta');
  return true;
}

function incrementBestiaryDefeat(id, amount = 1) {
  const def = BESTIARY_DEFS[id];
  if (!def) return;
  if (!metaState.bestiary) metaState.bestiary = { seen: {}, defeated: {} };
  metaState.bestiary.defeated[id] = Math.max(0, Number(metaState.bestiary.defeated[id]) || 0) + amount;
  persistMetaState();
  evaluateAchievements('meta');
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
    if (def.reward.type === 'shipSkin' && SHIP_SKIN_DEFS[def.reward.id] && !metaState.unlockedShipSkins.includes(def.reward.id)) {
      metaState.unlockedShipSkins.push(def.reward.id);
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

function sanitizeSelectedShipSkin() {
  if (!metaState.unlockedShipSkins.includes(gameSettings.shipSkin)) {
    gameSettings.shipSkin = 'classic';
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

function refreshShipSkinOptions() {
  if (!shipSkinSelect) return;
  const selected = gameSettings.shipSkin;
  shipSkinSelect.innerHTML = Object.entries(SHIP_SKIN_DEFS).map(([key, def]) => {
    const unlocked = metaState.unlockedShipSkins.includes(key);
    return `<option value="${key}"${unlocked ? '' : ' disabled'}>${def.label}${unlocked ? '' : ' · BLOQUEADA'}</option>`;
  }).join('');
  shipSkinSelect.value = metaState.unlockedShipSkins.includes(selected) ? selected : 'classic';
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

function unlockShipSkin(id, { silent = false } = {}) {
  if (!SHIP_SKIN_DEFS[id] || metaState.unlockedShipSkins.includes(id)) return false;
  metaState.unlockedShipSkins.push(id);
  if (!silent) {
    pushUnlockLog(createUnlockLogEntry('ship', SHIP_SKIN_DEFS[id].label, 'Modelo de nave desbloqueado.', `NAVE ${SHIP_SKIN_DEFS[id].label}`));
  }
  refreshShipSkinOptions();
  if (!silent) {
    spawnFloatingText(canvas.width / 2, canvas.height * 0.34, `NAVE ${SHIP_SKIN_DEFS[id].label}`, '#ffffff');
    triggerCinematicFlash(0.08);
  }
  return true;
}

function grantReward(reward, { silent = false } = {}) {
  if (!reward) return false;
  if (reward.type === 'skin') {
    return unlockSkin(reward.id, { silent });
  }
  if (reward.type === 'shipSkin') {
    return unlockShipSkin(reward.id, { silent });
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
  refreshShipSkinOptions();
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
  if (currentWaveEvent?.id && currentWaveEvent.id !== 'standard' && running) labels.push(`EVENTO ${currentWaveEvent.label}`);
  if (waveDisruptTimer > 0) labels.push(`DISRUPTOR ${Math.ceil(waveDisruptTimer / 1000)}s`);
  powerupStatusEl.textContent = labels.length ? labels.join(' · ') : 'SIN POWER-UPS';

  bossStatusEl.hidden = !boss.active && !miniBossSquad.active;
  if (boss.active) bossStatusEl.textContent = `BOSS ${boss.label} P${boss.phaseIndex} ${boss.hp}/${boss.maxHp}`;
  else if (miniBossSquad.active) {
    const leader = miniBossSquad.ships.find(ship => ship.role === 'leader');
    bossStatusEl.textContent = `${miniBossSquad.label} ${leader ? `${leader.hp}/${leader.maxHp}` : '0/0'}`;
  }
  gameWrapper.classList.toggle('is-boss-fight', boss.active || miniBossSquad.active);
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

function renderAchievementOverviewCard({ unlockedAchievements, pendingAchievements }) {
  return `
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
  `;
}

function drawBestiaryEnemyPreview(ctxRef, type, color) {
  drawEnemyModel(ctxRef, 12, 10, 72, 36, type, color, { glow: 10, pose: 0 });
}

function drawBestiaryUfoPreview(ctxRef, type, color) {
  drawUfoModel(ctxRef, 12, 12, 72, 30, type, color, { glow: 10 });
}

function drawBestiaryElitePreview(ctxRef, type, color) {
  if (type === 'trident') {
    drawMiniBossShipModel(ctxRef, 16, 10, 64, 36, 'leader', color, { glow: 10, variant: 'squad_trident' });
    return;
  }
  if (type === 'prong') {
    drawMiniBossShipModel(ctxRef, 16, 10, 64, 36, 'prong', color, { glow: 10, variant: 'squad_trident' });
    return;
  }
  drawMiniBossShipModel(ctxRef, 16, 10, 64, 36, type, color, { glow: 10 });
}

function drawBestiaryBossPreview(ctxRef, type, color) {
  drawBossModel(ctxRef, 8, 8, 80, 40, type, color, { glow: 12 });
}

function renderBestiaryPreviews() {
  if (!bestiaryBrowserEl) return;
  const theme = getCurrentTheme();
  bestiaryBrowserEl.querySelectorAll('.bestiary-preview').forEach(canvasEl => {
    const previewId = canvasEl.dataset.bestiaryId;
    const def = BESTIARY_DEFS[previewId];
    if (!def) return;
    const ctxRef = canvasEl.getContext('2d');
    if (!ctxRef) return;
    const { width, height } = canvasEl;
    ctxRef.clearRect(0, 0, width, height);
    const gradient = ctxRef.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(1,18,11,0.98)');
    gradient.addColorStop(1, 'rgba(1,7,5,0.98)');
    ctxRef.fillStyle = gradient;
    ctxRef.fillRect(0, 0, width, height);
    ctxRef.strokeStyle = 'rgba(0,255,136,0.12)';
    ctxRef.strokeRect(0.5, 0.5, width - 1, height - 1);
    ctxRef.fillStyle = 'rgba(0,255,136,0.05)';
    for (let row = 0; row < 4; row++) {
      ctxRef.fillRect(12, 14 + row * 12, width - 24, 1);
    }
    const accent = def.preview.kind === 'enemy'
      ? (def.preview.type === 'tank' ? '#ffa165' : def.preview.type === 'scout' ? '#6cf5ff' : def.preview.type === 'shooter' ? '#ffe36b' : theme.enemyRows[0])
      : def.preview.kind === 'ufo'
        ? getUfoVariantDef(def.preview.type).color
        : def.preview.kind === 'elite'
          ? (def.preview.type === 'leader' || def.preview.type === 'trident' ? '#ffb35a' : def.preview.type === 'prong' ? '#a7f4ff' : '#7be6ff')
          : getBossAccentColor(def.preview.type);
    ctxRef.shadowBlur = 10;
    ctxRef.shadowColor = accent;
    if (def.preview.kind === 'enemy') drawBestiaryEnemyPreview(ctxRef, def.preview.type, accent);
    else if (def.preview.kind === 'ufo') drawBestiaryUfoPreview(ctxRef, def.preview.type, accent);
    else if (def.preview.kind === 'elite') drawBestiaryElitePreview(ctxRef, def.preview.type, accent);
    else drawBestiaryBossPreview(ctxRef, def.preview.type, accent);
    ctxRef.shadowBlur = 0;
  });
}

function renderBestiaryEntry(def) {
  const seen = hasSeenBestiaryEntry(def.id);
  const defeated = getBestiaryDefeatCount(metaState, def.id);
  return `
    <article class="bestiary-entry${seen ? '' : ' is-unseen'}">
      <canvas class="bestiary-preview" data-bestiary-id="${def.id}" width="96" height="56" aria-hidden="true"></canvas>
      <div class="bestiary-copy">
        <div class="bestiary-head">
          <div class="bestiary-title-wrap">
            <span class="objective-kicker">${BESTIARY_CATEGORY_LABELS[def.category]}</span>
            <strong class="objective-title">${def.title}</strong>
          </div>
          <span class="achievement-state${seen ? ' is-unlocked' : ''}">${seen ? 'VISTO' : 'NO VISTO'}</span>
        </div>
        <span class="objective-copy">${def.copy}</span>
        <div class="bestiary-stat-grid">
          ${def.stats.map(stat => `<span class="bestiary-stat">${stat}</span>`).join('')}
        </div>
        <div class="start-objective-item-meta">
          <span class="objective-progress${defeated > 0 ? ' is-complete' : ''}">${defeated > 0 ? `Derrotado x${defeated}` : 'Aún sin derrotas'}</span>
        </div>
      </div>
    </article>
  `;
}

function getRewardUnlockSource(type, id) {
  const achievement = ACHIEVEMENT_DEFS.find(def => def.reward?.type === type && def.reward.id === id);
  if (achievement) return achievement.title;
  if (id === 'classic') return 'BASE';
  return 'POR DESCUBRIR';
}

function getCollectionUnlockLabel(type, id, unlocked) {
  const source = getRewardUnlockSource(type, id);
  if (source === 'BASE') return 'Disponible desde el inicio';
  if (source === 'POR DESCUBRIR') {
    return unlocked ? 'Ya forma parte de tu hangar.' : 'Sigue avanzando para revelar su reto.';
  }
  return unlocked ? `Desbloqueada por ${source}` : `Desbloquea: ${source}`;
}

function renderCollectionItem({ title, copy, unlocked, active = false, source, previewMarkup = '' }) {
  return `
    <article class="collection-item${unlocked ? ' is-unlocked' : ' is-locked'}${active ? ' is-active' : ''}">
      ${previewMarkup}
      <div class="collection-item-head">
        <div class="collection-item-copy">
          <strong class="achievement-title">${title}</strong>
          <span class="achievement-copy">${copy}</span>
        </div>
        <span class="achievement-state${unlocked ? ' is-unlocked' : ''}">${active ? 'ACTIVA' : unlocked ? 'DESBLOQUEADA' : 'BLOQUEADA'}</span>
      </div>
      <span class="achievement-meta">${source}</span>
    </article>
  `;
}

function renderCollectionPreviews() {
  if (!bestiaryBrowserEl) return;
  const activeTheme = getCurrentTheme();
  bestiaryBrowserEl.querySelectorAll('.collection-preview-canvas').forEach(canvasEl => {
    const ctxRef = canvasEl.getContext('2d');
    if (!ctxRef) return;
    const { width, height } = canvasEl;
    const previewKind = canvasEl.dataset.collectionKind;
    const previewId = canvasEl.dataset.collectionId;
    const unlocked = canvasEl.dataset.unlocked === 'true';
    ctxRef.clearRect(0, 0, width, height);

    const gradient = ctxRef.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(1,18,11,0.98)');
    gradient.addColorStop(1, 'rgba(1,7,5,0.98)');
    ctxRef.fillStyle = gradient;
    ctxRef.fillRect(0, 0, width, height);
    ctxRef.strokeStyle = 'rgba(0,255,136,0.12)';
    ctxRef.strokeRect(0.5, 0.5, width - 1, height - 1);
    ctxRef.fillStyle = 'rgba(0,255,136,0.05)';
    for (let row = 0; row < 4; row++) {
      ctxRef.fillRect(14, 18 + row * 13, width - 28, 1);
    }

    ctxRef.save();
    if (!unlocked) {
      ctxRef.globalAlpha = 0.4;
    }
    if (previewKind === 'skin') {
      const theme = SKIN_THEMES[normalizeSkin(previewId)];
      drawPlayerShipModel(ctxRef, width / 2 - 42, 20, 84, 42, 'classic', theme.player, { glow: unlocked ? 10 : 4 });
      ctxRef.fillStyle = theme.playerBullet;
      ctxRef.fillRect(width / 2 - 2, 8, 4, 10);
    } else {
      drawPlayerShipModel(ctxRef, width / 2 - 42, 20, 84, 42, normalizeShipSkin(previewId), activeTheme.player, { glow: unlocked ? 10 : 4 });
      ctxRef.fillStyle = activeTheme.playerBullet;
      ctxRef.fillRect(width / 2 - 2, 8, 4, 10);
    }
    ctxRef.restore();
  });
}

function renderCollectionPanel() {
  const activeCollectionTab = collectionTab === 'ships' ? 'ships' : 'skins';
  const skinItems = Object.entries(SKIN_THEMES).map(([id, def]) => renderCollectionItem({
    title: def.label,
    copy: `Tema de cabina con acento ${def.accent}.`,
    unlocked: metaState.unlockedSkins.includes(id),
    active: gameSettings.skin === id,
    source: getCollectionUnlockLabel('skin', id, metaState.unlockedSkins.includes(id)),
    previewMarkup: `
      <div class="collection-preview-frame">
        <canvas
          class="collection-preview-canvas"
          data-collection-kind="skin"
          data-collection-id="${id}"
          data-unlocked="${metaState.unlockedSkins.includes(id)}"
          width="180"
          height="90"
          aria-hidden="true"
        ></canvas>
      </div>
    `
  })).join('');

  const shipItems = Object.entries(SHIP_SKIN_DEFS).map(([id, def]) => renderCollectionItem({
    title: def.label,
    copy: def.copy,
    unlocked: metaState.unlockedShipSkins.includes(id),
    active: gameSettings.shipSkin === id,
    source: getCollectionUnlockLabel('shipSkin', id, metaState.unlockedShipSkins.includes(id)),
    previewMarkup: `
      <div class="collection-preview-frame">
        <canvas
          class="collection-preview-canvas"
          data-collection-kind="ship"
          data-collection-id="${id}"
          data-unlocked="${metaState.unlockedShipSkins.includes(id)}"
          width="180"
          height="90"
          aria-hidden="true"
        ></canvas>
      </div>
    `
  })).join('');

  return `
    <div class="collection-shell">
      <div class="bestiary-overview">
        <div class="bestiary-overview-copy">
          <span class="achievement-kicker">COLECCION META</span>
          <strong class="achievement-title">EQUIPACION DESBLOQUEADA</strong>
          <span class="achievement-copy">Previsualiza las cabinas y siluetas que ya forman parte de tu hangar o siguen esperando a que las ganes.</span>
        </div>
        <div class="bestiary-overview-stats">
          <div class="achievement-overview-stat">
            <span class="achievement-overview-label">Skins</span>
            <strong>${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length}</strong>
          </div>
          <div class="achievement-overview-stat">
            <span class="achievement-overview-label">Naves</span>
            <strong>${metaState.unlockedShipSkins.length}/${Object.keys(SHIP_SKIN_DEFS).length}</strong>
          </div>
        </div>
      </div>
      <div class="bestiary-tabs" role="tablist" aria-label="Categorias de equipacion">
        <button type="button" class="bestiary-tab${activeCollectionTab === 'skins' ? ' is-active' : ''}" data-collection-tab="skins" role="tab" aria-selected="${activeCollectionTab === 'skins'}">
          SKINS
          <span>${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length}</span>
        </button>
        <button type="button" class="bestiary-tab${activeCollectionTab === 'ships' ? ' is-active' : ''}" data-collection-tab="ships" role="tab" aria-selected="${activeCollectionTab === 'ships'}">
          NAVES
          <span>${metaState.unlockedShipSkins.length}/${Object.keys(SHIP_SKIN_DEFS).length}</span>
        </button>
      </div>
      <div class="collection-grid">
        ${activeCollectionTab === 'skins' ? `
          <section class="collection-group">
            <div class="collection-group-head">
              <strong>SKINS</strong>
              <span>${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} disponibles</span>
            </div>
            <div class="collection-card-grid">${skinItems}</div>
          </section>
        ` : `
          <section class="collection-group">
            <div class="collection-group-head">
              <strong>NAVES</strong>
              <span>${metaState.unlockedShipSkins.length}/${Object.keys(SHIP_SKIN_DEFS).length} disponibles</span>
            </div>
            <div class="collection-card-grid">${shipItems}</div>
          </section>
        `}
      </div>
    </div>
  `;
}

function renderBestiaryPanel() {
  if (!bestiaryBrowserEl) return;
  const panelIntro = bestiaryPanel?.querySelector('.card-intro');
  const guideTabs = `
    <div class="guide-tabs" role="tablist" aria-label="Archivo de juego">
      <button type="button" class="guide-tab${guidePanelTab === 'bestiary' ? ' is-active' : ''}" data-guide-tab="bestiary" role="tab" aria-selected="${guidePanelTab === 'bestiary'}">BESTIARIO</button>
      <button type="button" class="guide-tab${guidePanelTab === 'collection' ? ' is-active' : ''}" data-guide-tab="collection" role="tab" aria-selected="${guidePanelTab === 'collection'}">EQUIPACION</button>
    </div>
  `;

  if (guidePanelTab === 'collection') {
    if (panelIntro) {
      panelIntro.textContent = 'Previsualiza las skins y naves que ya forman parte de tu hangar y detecta qué piezas siguen bloqueadas.';
    }
    bestiaryBrowserEl.innerHTML = `
      <div class="guide-shell">
        ${guideTabs}
        ${renderCollectionPanel()}
      </div>
    `;
    renderCollectionPreviews();
    return;
  }

  if (panelIntro) {
    panelIntro.textContent = 'Consulta enemigos, UFOs, élites y bosses con sus rasgos clave y tu historial frente a ellos.';
  }

  const activeCategory = BESTIARY_CATEGORIES.includes(bestiaryTab) ? bestiaryTab : 'invaders';
  const categoryEntries = Object.values(BESTIARY_DEFS).filter(def => def.category === activeCategory);
  const seenCount = countBestiarySeen(metaState, Object.keys(BESTIARY_DEFS));
  const totalDefeats = Object.keys(BESTIARY_DEFS).reduce((sum, id) => sum + getBestiaryDefeatCount(metaState, id), 0);
  const categorySeen = countBestiarySeen(metaState, categoryEntries.map(def => def.id));

  bestiaryBrowserEl.innerHTML = `
    <div class="guide-shell">
      ${guideTabs}
      <div class="bestiary-shell">
        <div class="bestiary-overview">
          <div class="bestiary-overview-copy">
            <span class="achievement-kicker">GUIA DE AMENAZAS</span>
            <strong class="achievement-title">ARCHIVO DE COMBATE</strong>
            <span class="achievement-copy">Cada ficha resume vida, presión ofensiva, movilidad y el número de veces que ya la has derribado.</span>
          </div>
          <div class="bestiary-overview-stats">
            <div class="achievement-overview-stat">
              <span class="achievement-overview-label">Entradas vistas</span>
              <strong>${seenCount}/${Object.keys(BESTIARY_DEFS).length}</strong>
            </div>
            <div class="achievement-overview-stat">
              <span class="achievement-overview-label">Categoría activa</span>
              <strong>${categorySeen}/${categoryEntries.length}</strong>
            </div>
            <div class="achievement-overview-stat">
              <span class="achievement-overview-label">Derrotados totales</span>
              <strong>${totalDefeats}</strong>
            </div>
          </div>
        </div>
        <div class="bestiary-tabs" role="tablist" aria-label="Categorias del bestiario">
          ${BESTIARY_CATEGORIES.map(category => `
            <button type="button" class="bestiary-tab${activeCategory === category ? ' is-active' : ''}" data-bestiary-tab="${category}" role="tab" aria-selected="${activeCategory === category}">
              ${BESTIARY_CATEGORY_LABELS[category]}
              <span>${countBestiarySeen(metaState, Object.values(BESTIARY_DEFS).filter(def => def.category === category).map(def => def.id))}/${Object.values(BESTIARY_DEFS).filter(def => def.category === category).length}</span>
            </button>
          `).join('')}
        </div>
        <div class="bestiary-grid">
          ${categoryEntries.map(renderBestiaryEntry).join('')}
        </div>
      </div>
    </div>
  `;
  renderBestiaryPreviews();
}

function openOverlayDialog(state) {
  if (!overlayDialog || !overlayDialogBody || !overlayDialogTitle || !overlayDialogBadge) return;
  if (overlay) {
    overlay.scrollTop = 0;
    if (typeof overlay.scrollTo === 'function') {
      overlay.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
  overlayDialogState = state;
  renderOverlayDialog();
  overlayDialog.hidden = false;
}

function closeOverlayDialog() {
  if (!overlayDialog) return;
  overlayDialog.hidden = true;
  overlayDialogState = null;
}

function renderOverlayDialog() {
  if (!overlayDialogState || !overlayDialogBody || !overlayDialogTitle || !overlayDialogBadge) return;
  if (overlayDialogState.type === 'tutorial') {
    const slide = TUTORIAL_SLIDES[overlayDialogState.step] || TUTORIAL_SLIDES[0];
    overlayDialogTitle.textContent = slide.title;
    overlayDialogBadge.textContent = `${overlayDialogState.step + 1}/${TUTORIAL_SLIDES.length}`;
    overlayDialogBody.innerHTML = `
      <div class="dialog-copy">
        <p>${slide.copy}</p>
      </div>
    `;
    btnDialogSecondary.textContent = overlayDialogState.step === 0 ? 'CERRAR' : 'ANTERIOR';
    btnDialogPrimary.textContent = overlayDialogState.step === TUTORIAL_SLIDES.length - 1 ? 'LISTO' : 'SIGUIENTE';
  } else if (overlayDialogState.type === 'reset') {
    overlayDialogTitle.textContent = 'REINICIAR PERFIL';
    overlayDialogBadge.textContent = 'CONFIRMACION';
    overlayDialogBody.innerHTML = `
      <div class="dialog-copy">
        <p>Se borrarán récord, historial, estadísticas, logros, bestiario, colección e insignias.</p>
        <p>Tus ajustes de partida y audio se mantendrán, pero la skin y la nave activas volverán a la base si dejan de estar desbloqueadas.</p>
      </div>
    `;
    btnDialogSecondary.textContent = 'CANCELAR';
    btnDialogPrimary.textContent = 'REINICIAR';
  }
}

function openTutorialOverlay() {
  openOverlayDialog({ type: 'tutorial', step: 0 });
}

function createDefaultAggregateStats() {
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
    bestLevel: 1,
    bestCombo: 1,
    bestTimeAttackScore: 0,
    bestAccuracy25: 0,
    bestAccuracy35: 0,
    totalTimeMs: 0
  };
}

function resetProfileProgress() {
  localStorage.removeItem('si_hs');
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(AGGREGATE_STATS_KEY);
  localStorage.removeItem(META_KEY);
  highscore = 0;
  highscoreEl.textContent = '0';
  scoreHistory = [];
  aggregateStats = createDefaultAggregateStats();
  metaState = loadMetaState();
  currentChallenge = getCurrentChallengeDefinition();
  progressPanelTab = 'pending';
  startObjectivesTab = 'pending';
  guidePanelTab = 'bestiary';
  collectionTab = 'skins';
  bestiaryTab = 'invaders';
  sanitizeSelectedSkin();
  sanitizeSelectedShipSkin();
  gameSettings.startLevel = 1;
  gameSettings.skin = 'classic';
  gameSettings.shipSkin = 'classic';
  persistGameSettings();
  applySettingsUI();
  renderMetaPanel();
  renderStartScreenPanels();
  updateHudStatus();
  closeOverlayDialog();
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawTutorialPrompt() {
  if (!activeTutorialPrompt) return;
  const elapsed = activeTutorialPrompt.maxTimer - activeTutorialPrompt.timer;
  const alpha = Math.max(0, Math.min(1, elapsed / 14, activeTutorialPrompt.timer / 24));
  const cardWidth = Math.min(canvas.width - 48, 470);
  const cardX = (canvas.width - cardWidth) / 2;
  const copyMaxWidth = cardWidth - 34;
  const lineHeight = 16;
  ctx.save();
  ctx.font = "bold 13px 'Courier New', monospace";
  const lines = wrapCanvasText(ctx, activeTutorialPrompt.copy, copyMaxWidth);
  const cardHeight = 54 + lines.length * lineHeight;
  const cardY = Math.max(54, canvas.height * 0.1);
  const accent = activeTutorialPrompt.key.startsWith('bestiary:boss_')
    ? '#ff8cb8'
    : activeTutorialPrompt.key.startsWith('bestiary:ufo_')
      ? '#ffe36b'
      : activeTutorialPrompt.key.startsWith('bestiary:elite_')
        ? '#ffb35a'
        : '#00ff88';

  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(1,8,5,0.92)';
  ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
  ctx.strokeStyle = 'rgba(0,255,136,0.24)';
  ctx.strokeRect(cardX + 0.5, cardY + 0.5, cardWidth - 1, cardHeight - 1);
  ctx.fillStyle = accent;
  ctx.fillRect(cardX + 10, cardY + 10, cardWidth - 20, 3);
  ctx.shadowBlur = 14;
  ctx.shadowColor = accent;
  ctx.fillStyle = '#f4fff8';
  ctx.textAlign = 'left';
  ctx.fillText(activeTutorialPrompt.title, cardX + 16, cardY + 28);
  ctx.shadowBlur = 0;
  ctx.font = "12px 'Courier New', monospace";
  ctx.fillStyle = '#b6d4c1';
  lines.forEach((line, index) => {
    ctx.fillText(line, cardX + 16, cardY + 48 + index * lineHeight);
  });
  ctx.restore();
}

function renderMetaPanel() {
  const context = buildAchievementContext({ live: overlayMode === 'pause' });
  const unlockedAchievements = countUnlockedAchievements();
  const pendingAchievements = ACHIEVEMENT_DEFS.length - unlockedAchievements;
  const unlockedSkins = metaState.unlockedSkins.map(id => SKIN_THEMES[id].label).join(' · ');
  const unlockedShipSkins = metaState.unlockedShipSkins.map(id => getShipSkinLabel(id)).join(' · ');
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
          <strong class="challenge-title">INVENTARIO META</strong>
          <span class="challenge-state">${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} skins · ${metaState.unlockedShipSkins.length}/${Object.keys(SHIP_SKIN_DEFS).length} naves · ${metaState.unlockedBadges.length}/${Object.keys(BADGE_DEFS).length} insignias</span>
        </div>
        <span class="challenge-copy">Skins: ${unlockedSkins}</span>
        <span class="challenge-copy">Naves: ${unlockedShipSkins}</span>
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
      ${renderAchievementOverviewCard({ unlockedAchievements, pendingAchievements })}
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
  renderStartLevelGrid();
  const globalAccuracy = getAccuracyPercent(aggregateStats.totalShots, aggregateStats.totalHits);
  const latestSession = scoreHistory.length ? scoreHistory[0] : null;
  const unlockedAchievements = countUnlockedAchievements();
  const pendingAchievements = ACHIEVEMENT_DEFS.length - unlockedAchievements;
  const averageScore = aggregateStats.gamesPlayed ? Math.round(aggregateStats.totalScore / aggregateStats.gamesPlayed) : 0;
  const bestLevel = aggregateStats.bestLevel || 1;
  const bestCombo = aggregateStats.bestCombo || 1;
  const startContext = buildAchievementContext();
  const pendingGroups = getPendingAchievementsByCategory(startContext);
  const completedGroups = getCompletedAchievementsByCategory();

  const modeNoteEl = document.getElementById('mode-note');
  const difficultyNoteEl = document.getElementById('difficulty-note');
  const startLevelNoteEl = document.getElementById('start-level-note');
  const skinNoteEl = document.getElementById('skin-note');
  const shipNoteEl = document.getElementById('ship-note');
  const settingsNoteEl = document.getElementById('settings-note');
  const audioNoteEl = document.getElementById('audio-note');
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
  if (startLevelNoteEl) {
    startLevelNoteEl.textContent = gameSettings.mode === 'timeattack'
      ? 'Contrarreloj siempre empieza en el nivel 1 para mantener su economía y presión originales.'
      : `Empieza en cualquier nivel ya conquistado. Ahora puedes practicar del 1 al ${getMaxUnlockedStartLevel()}.`;
  }
  if (skinNoteEl) {
    skinNoteEl.textContent = `Skin activa ${SKIN_THEMES[gameSettings.skin].label}. ${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} skins de cabina desbloqueadas.`;
  }
  if (shipNoteEl) {
    shipNoteEl.textContent = `Nave activa ${getShipSkinLabel(gameSettings.shipSkin)}. ${metaState.unlockedShipSkins.length}/${Object.keys(SHIP_SKIN_DEFS).length} modelos desbloqueados por logros.`;
  }
  if (settingsNoteEl) {
    settingsNoteEl.textContent = 'La preview se actualiza al instante y la nave se usa en la siguiente partida.';
  }
  if (audioNoteEl) {
    audioNoteEl.textContent = `Música ${musicEnabled ? 'activa' : 'silenciada'} al ${formatVolumePercent(musicVolume)} · FX al ${formatVolumePercent(gameSettings.fxVolume)}.`;
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
        <span class="summary-meta">${aggregateStats.totalPowerUpsCollected} power-ups · ${metaState.unlockedBadges.length} insignias · ${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} skins · ${metaState.unlockedShipSkins.length}/${Object.keys(SHIP_SKIN_DEFS).length} naves</span>
      </div>
    </div>
    <div class="summary-ribbon">
      <span class="summary-ribbon-label">ACTIVA</span>
      <strong class="summary-ribbon-value">${formatModeLabel(gameSettings.mode)} · ${formatDifficultyLabel(gameSettings.difficulty)} · ${SKIN_THEMES[gameSettings.skin].label} · ${getShipSkinLabel(gameSettings.shipSkin)}</strong>
      <span class="summary-ribbon-copy">${metaState.unlockedSkins.length}/${Object.keys(SKIN_THEMES).length} skins de cabina · ${metaState.unlockedShipSkins.length}/${Object.keys(SHIP_SKIN_DEFS).length} naves · ${aggregateStats.totalTimeAttackGames} runs contrarreloj</span>
    </div>
  `;

  if (startObjectiveEl) {
    startObjectiveEl.innerHTML = '';
  }

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
      ${renderAchievementOverviewCard({ unlockedAchievements, pendingAchievements })}
      <div class="start-objective-tabs-shell">
        <div class="start-objective-tabs" role="tablist" aria-label="Estado de objetivos">
          <button type="button" class="start-objective-tab${startObjectivesTab === 'pending' ? ' is-active' : ''}" data-start-objectives-tab="pending" role="tab" aria-selected="${startObjectivesTab === 'pending'}">PENDIENTES <span>${pendingAchievements}</span></button>
          <button type="button" class="start-objective-tab${startObjectivesTab === 'completed' ? ' is-active' : ''}" data-start-objectives-tab="completed" role="tab" aria-selected="${startObjectivesTab === 'completed'}">LOGRADOS <span>${unlockedAchievements}</span></button>
        </div>
        <span class="start-objective-tabs-caption">${startObjectivesTab === 'pending' ? 'El primer bloque pendiente marca tu siguiente hito más cercano y mejor recompensado.' : 'Consulta los hitos ya conseguidos y la recompensa que ya forma parte de tu perfil.'}</span>
      </div>
      <div class="start-objective-tab-panel" data-active-tab="${startObjectivesTab}">
        ${startObjectivesTab === 'pending' ? pendingTabBody : completedTabBody}
      </div>
    </div>
  `;

  refreshSkinOptions();
  refreshShipSkinOptions();
  renderShipPreview();
  renderBestiaryPanel();
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
  closeOverlayDialog();
  activeTutorialPrompt = null;
  pendingTutorialPromptQueue.length = 0;
  pendingIntroTutorial = false;
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
  closeOverlayDialog();
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
    setPanelVisibility(bestiaryPanel, true);
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
    setPanelVisibility(bestiaryPanel, false);
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
    setPanelVisibility(bestiaryPanel, false);
    setPanelVisibility(runPanel, true);
    setPanelVisibility(aggregatePanel, true);
    setPanelVisibility(historyPanel, true);
    setPanelVisibility(metaPanel, false);
  }

  overlay.classList.add('visible');
}

let gameSettings = loadSettings();
let metaState = loadMetaState();
syncUnlockedRewardsFromAchievements();
sanitizeSelectedSkin();
sanitizeSelectedShipSkin();
let currentChallenge = getCurrentChallengeDefinition();
let scoreHistory = loadScoreHistory();
let aggregateStats = loadAggregateStats();
let currentRunStats = createRunStats();
let overlayMode = 'start';
let progressPanelTab = 'pending';
let startObjectivesTab = 'pending';
let guidePanelTab = 'bestiary';
let collectionTab = 'skins';
let bestiaryTab = 'invaders';
let activeTutorialPrompt = null;
let pendingTutorialPromptQueue = [];
let pendingIntroTutorial = false;
let overlayDialogState = null;
evaluateAchievements('profile', { silent: true });
evaluateAchievements('end', { silent: true });
evaluateAchievements('meta', { silent: true });
persistMetaState();

let highscore = parseInt(localStorage.getItem('si_hs') || '0', 10);
highscoreEl.textContent = highscore;

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let musicGain = null;
let fxGain = null;
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
  if (btnMusic) btnMusic.textContent = `MUSICA: ${musicEnabled ? 'ON' : 'OFF'}`;
  if (musicVolumeEl) musicVolumeEl.value = musicVolume.toFixed(2);
  if (fxVolumeEl) fxVolumeEl.value = gameSettings.fxVolume.toFixed(2);
  if (musicVolumeValueEl) musicVolumeValueEl.textContent = formatVolumePercent(musicVolume);
  if (fxVolumeValueEl) fxVolumeValueEl.textContent = formatVolumePercent(gameSettings.fxVolume);
  if (musicVolumeEl) musicVolumeEl.setAttribute('aria-valuetext', formatVolumePercent(musicVolume));
  if (fxVolumeEl) fxVolumeEl.setAttribute('aria-valuetext', formatVolumePercent(gameSettings.fxVolume));
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
  if (!fxGain) {
    fxGain = audioCtx.createGain();
    fxGain.gain.setValueAtTime(Math.max(0.0001, gameSettings.fxVolume), audioCtx.currentTime);
    fxGain.connect(audioCtx.destination);
  }
  if (!musicLoop) {
    musicLoop = setInterval(() => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      tickMusic();
    }, 190);
  }
  syncMusicGain();
  syncFxGain();
}

function syncMusicGain() {
  if (!audioCtx || !musicGain) return;
  const now = audioCtx.currentTime;
  const target = musicEnabled ? Math.max(0.0001, musicVolume) : 0.0001;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setValueAtTime(musicGain.gain.value || 0.0001, now);
  musicGain.gain.linearRampToValueAtTime(target, now + 0.12);
}

function syncFxGain() {
  if (!audioCtx || !fxGain) return;
  const now = audioCtx.currentTime;
  const target = Math.max(0.0001, gameSettings.fxVolume);
  fxGain.gain.cancelScheduledValues(now);
  fxGain.gain.setValueAtTime(fxGain.gain.value || 0.0001, now);
  fxGain.gain.linearRampToValueAtTime(target, now + 0.08);
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
  gain.connect(fxGain || audioCtx.destination);
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
let miniBossEncounteredThisLevel = false;
let screenShake = 0;
let cinematicFlash = 0;
let waveDisruptTimer = 0;

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
if (fxVolumeEl) {
  fxVolumeEl.addEventListener('input', event => {
    initAudio();
    gameSettings.fxVolume = normalizeAudioVolume(event.target.value, gameSettings.fxVolume);
    persistGameSettings();
    updateMusicUI();
    syncFxGain();
    renderStartScreenPanels();
  });
}
if (btnOpenTutorial) {
  btnOpenTutorial.addEventListener('click', openTutorialOverlay);
}
if (btnResetProfile) {
  btnResetProfile.addEventListener('click', () => {
    openOverlayDialog({ type: 'reset' });
  });
}
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
if (shipSkinSelect) {
  shipSkinSelect.addEventListener('change', event => {
    const nextShipSkin = normalizeShipSkin(event.target.value);
    if (!metaState.unlockedShipSkins.includes(nextShipSkin)) {
      refreshShipSkinOptions();
      return;
    }
    gameSettings.shipSkin = nextShipSkin;
    persistGameSettings();
    applySettingsUI();
    renderMetaPanel();
    renderStartScreenPanels();
  });
}
modeSelect.addEventListener('change', event => {
  gameSettings.mode = normalizeGameMode(event.target.value);
  persistGameSettings();
  applySettingsUI();
  updateHudStatus();
  renderStartScreenPanels();
});
if (startLevelSelectorEl) {
  startLevelSelectorEl.addEventListener('click', event => {
    const trigger = event.target.closest('[data-start-level]');
    if (!trigger || gameSettings.mode === 'timeattack') return;
    gameSettings.startLevel = normalizeStartLevel(trigger.dataset.startLevel, getMaxUnlockedStartLevel());
    persistGameSettings();
    applySettingsUI();
    renderStartScreenPanels();
  });
}
vibrationToggle.addEventListener('change', event => {
  gameSettings.vibration = !!event.target.checked;
  persistGameSettings();
  renderStartScreenPanels();
});
if (reducedEffectsToggle) {
  reducedEffectsToggle.addEventListener('change', event => {
    gameSettings.reducedEffects = !!event.target.checked;
    persistGameSettings();
    applySettingsUI();
    renderStartScreenPanels();
  });
}
if (highContrastToggle) {
  highContrastToggle.addEventListener('change', event => {
    gameSettings.highContrast = !!event.target.checked;
    persistGameSettings();
    applySettingsUI();
    renderStartScreenPanels();
  });
}
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
if (bestiaryBrowserEl) {
  bestiaryBrowserEl.addEventListener('click', event => {
    const guideTrigger = event.target.closest('[data-guide-tab]');
    if (guideTrigger) {
      const nextGuideTab = guideTrigger.dataset.guideTab === 'collection' ? 'collection' : 'bestiary';
      if (guidePanelTab !== nextGuideTab) {
        guidePanelTab = nextGuideTab;
        renderBestiaryPanel();
      }
      return;
    }
    const collectionTrigger = event.target.closest('[data-collection-tab]');
    if (collectionTrigger) {
      const nextCollectionTab = collectionTrigger.dataset.collectionTab === 'ships' ? 'ships' : 'skins';
      if (collectionTab !== nextCollectionTab) {
        collectionTab = nextCollectionTab;
        renderBestiaryPanel();
      }
      return;
    }
    const trigger = event.target.closest('[data-bestiary-tab]');
    if (!trigger) return;
    const nextTab = BESTIARY_CATEGORIES.includes(trigger.dataset.bestiaryTab) ? trigger.dataset.bestiaryTab : 'invaders';
    if (bestiaryTab === nextTab) return;
    bestiaryTab = nextTab;
    renderBestiaryPanel();
  });
}
if (btnDialogSecondary) {
  btnDialogSecondary.addEventListener('click', () => {
    if (!overlayDialogState) {
      closeOverlayDialog();
      return;
    }
    if (overlayDialogState.type === 'tutorial' && overlayDialogState.step > 0) {
      overlayDialogState.step -= 1;
      renderOverlayDialog();
      return;
    }
    closeOverlayDialog();
  });
}
if (btnDialogPrimary) {
  btnDialogPrimary.addEventListener('click', () => {
    if (!overlayDialogState) {
      closeOverlayDialog();
      return;
    }
    if (overlayDialogState.type === 'tutorial') {
      if (overlayDialogState.step >= TUTORIAL_SLIDES.length - 1) {
        closeOverlayDialog();
      } else {
        overlayDialogState.step += 1;
        renderOverlayDialog();
      }
      return;
    }
    if (overlayDialogState.type === 'reset') {
      resetProfileProgress();
    }
  });
}
if (overlayDialog) {
  overlayDialog.addEventListener('click', event => {
    if (event.target === overlayDialog) {
      closeOverlayDialog();
    }
  });
}
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
  const eventFactor = currentWaveEvent?.shootFactor || 1;
  const disruptFactor = waveDisruptTimer > 0 ? 0.78 : 1;
  return Math.max(42, Math.round((110 - (threatLevel - 1) * 8) * preset.enemyShootFactor * eventFactor * disruptFactor * (activeEffects.freeze > 0 ? 2.25 : 1)));
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
    ? ['rapid', 'shield', 'heart', 'heart', 'freeze', 'piercing', 'drone']
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
  if (Math.random() > POWERUP_DROP_CHANCE * (currentWaveEvent?.powerUpFactor || 1)) return;
  spawnPowerUp(x, y);
}

function collectPowerUp(powerUp) {
  currentRunStats.powerUpsCollected++;
  queueTutorialPrompt('intro:powerup', 'POWER-UP', 'Recógelo para activar una ventaja temporal. Corazón, escudo o disparo alteran tu margen y tu ritmo.');
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
    shieldCharges = Math.min(3, shieldCharges + 1);
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
  return Math.round(getDifficultyConfig().ufoSpawnInterval * (currentWaveEvent?.ufoFactor || 1));
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
let currentWaveEvent = WAVE_EVENT_DEFS.standard;

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
  baseY: 68,
  phaseIndex: 1
};

const miniBossSquad = {
  active: false,
  x: 0,
  y: 0,
  dir: 1,
  speed: MINI_BOSS_PROFILES.squad_basic.speedBase,
  phase: 0,
  shootTimer: 0,
  entryTimer: 0,
  ships: [],
  profileId: 'squad_basic',
  label: MINI_BOSS_PROFILES.squad_basic.label,
  reward: MINI_BOSS_PROFILES.squad_basic.reward,
  horizontalSpan: MINI_BOSS_PROFILES.squad_basic.horizontalSpan
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
  boss.phaseIndex = 1;
}

function resetMiniBossSquad() {
  miniBossSquad.active = false;
  miniBossSquad.x = 0;
  miniBossSquad.y = 0;
  miniBossSquad.dir = 1;
  miniBossSquad.speed = MINI_BOSS_PROFILES.squad_basic.speedBase;
  miniBossSquad.phase = 0;
  miniBossSquad.shootTimer = 0;
  miniBossSquad.entryTimer = 0;
  miniBossSquad.ships = [];
  miniBossSquad.profileId = 'squad_basic';
  miniBossSquad.label = MINI_BOSS_PROFILES.squad_basic.label;
  miniBossSquad.reward = MINI_BOSS_PROFILES.squad_basic.reward;
  miniBossSquad.horizontalSpan = MINI_BOSS_PROFILES.squad_basic.horizontalSpan;
}

function shouldSpawnBossForLevel(currentLevel) {
  return Boolean(BOSS_CAMPAIGN_LEVELS[currentLevel]);
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
  return Math.max(3, Math.round(base * preset.enemyTickFactor * (currentWaveEvent?.tickFactor || 1) * (alive / Math.max(1, currentWaveEnemyCount)) * (activeEffects.freeze > 0 ? 2.4 : 1)));
}

function getAliveEnemyBounds(enemyList = enemies) {
  const active = enemyList.filter(enemy => enemy.alive);
  if (!active.length) return null;
  return {
    left: Math.min(...active.map(enemy => enemy.x)),
    right: Math.max(...active.map(enemy => enemy.x + enemy.w))
  };
}

function shouldOmitEarlyEnemy(currentLevel, row, col, maskedOut) {
  if (maskedOut) return true;

  if (currentLevel === 1) {
    if (row === 0) return col !== 3 && col !== 4;
    if (row >= 1 && (col === 0 || col === COLS - 1)) return true;
    return false;
  }

  if (currentLevel >= 2 && currentLevel <= 9) {
    if (row === ROWS - 1 && (col === 0 || col === COLS - 1)) return true;
  }

  return false;
}

function spawnEnemies() {
  enemies.length = 0;
  currentWavePattern = getWavePatternForLevel(level, currentRunStats.mode || gameSettings.mode);
  currentWaveEvent = getWaveEventForLevel(level, currentRunStats.mode || gameSettings.mode);
  const { marginX, gapX, gapY, startY } = getEnemyLayout(currentWavePattern);
  let aliveCount = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const rowMask = currentWavePattern.masks?.[row] || '11111111';
      const maskedOut = rowMask[col] === '0';
      const alive = !shouldOmitEarlyEnemy(level, row, col, maskedOut);
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
      if (alive) {
        markBestiarySeen(`enemy_${role}`, { showTip: role !== 'classic' });
      }
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

function spawnMiniBossSquad() {
  const profile = getMiniBossProfileForLevel(level);
  miniBossEncounteredThisLevel = true;
  markBestiarySeen(profile.id === 'squad_trident' ? 'elite_trident' : 'elite_leader');
  markBestiarySeen(profile.id === 'squad_trident' ? 'elite_prong' : 'elite_escort', { showTip: false });
  miniBossSquad.active = true;
  miniBossSquad.profileId = profile.id;
  miniBossSquad.label = profile.label;
  miniBossSquad.reward = profile.reward;
  miniBossSquad.horizontalSpan = profile.horizontalSpan;
  miniBossSquad.speed = profile.speedBase + Math.min(0.9, (getThreatLevel() - 1) * 0.05);
  miniBossSquad.dir = Math.random() < 0.5 ? -1 : 1;
  miniBossSquad.phase = Math.random() * Math.PI * 2;
  miniBossSquad.shootTimer = 0;
  miniBossSquad.entryTimer = 56;
  miniBossSquad.x = canvas.width / 2;
  miniBossSquad.y = -84;
  miniBossSquad.ships = [
    {
      role: profile.id === 'squad_trident' ? 'prong' : 'escort',
      side: -1,
      x: canvas.width / 2 - 62,
      y: -58,
      w: 34,
      h: 22,
      hp: profile.id === 'squad_trident' ? profile.wingHp : profile.escortHp,
      maxHp: profile.id === 'squad_trident' ? profile.wingHp : profile.escortHp,
      flashTimer: 0,
      color: profile.id === 'squad_trident' ? '#a7f4ff' : '#7be6ff'
    },
    { role: 'leader', side: 0, x: canvas.width / 2 - 24, y: -76, w: 48, h: 34, hp: profile.leaderHp, maxHp: profile.leaderHp, flashTimer: 0, color: '#ffb35a' },
    {
      role: profile.id === 'squad_trident' ? 'prong' : 'escort',
      side: 1,
      x: canvas.width / 2 + 28,
      y: -58,
      w: 34,
      h: 22,
      hp: profile.id === 'squad_trident' ? profile.wingHp : profile.escortHp,
      maxHp: profile.id === 'squad_trident' ? profile.wingHp : profile.escortHp,
      flashTimer: 0,
      color: profile.id === 'squad_trident' ? '#a7f4ff' : '#7be6ff'
    }
  ];
  playerBullets.length = 0;
  enemyBullets.length = 0;
  spawnFloatingText(canvas.width / 2, 92, profile.label, '#ffd966');
  spawnShockwave(canvas.width / 2, canvas.height * 0.28, 'rgba(255,214,102,0.38)', 18, 3.4);
  addScreenShake(7);
  triggerCinematicFlash(0.12);
  updateHudStatus();
}

function getMiniBossAliveShips() {
  return miniBossSquad.ships.filter(ship => ship.hp > 0);
}

function defeatMiniBossSquad() {
  score += miniBossSquad.reward + level * 20;
  scoreEl.textContent = score;
  syncHighscore();
  spawnShockwave(miniBossSquad.x, miniBossSquad.y, 'rgba(255,214,102,0.5)', 24, 4.1);
  spawnParticleBurst(miniBossSquad.x, miniBossSquad.y, {
    count: 24,
    color: '#ffd966',
    speedMin: 1.8,
    speedMax: 5.4,
    lifeMin: 24,
    lifeMax: 40
  });
  spawnFloatingText(miniBossSquad.x, miniBossSquad.y - 12, `+${miniBossSquad.reward + level * 20}`, '#ffd966');
  resetMiniBossSquad();
  completeLevel();
}

function startBossFight() {
  const profile = getBossProfileForLevel(level, currentRunStats.mode || gameSettings.mode);
  const threatLevel = getThreatLevel();
  bossEncounteredThisLevel = true;
  markBestiarySeen(`boss_${profile.id}`);
  waveDisruptTimer = 0;
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
  boss.phaseIndex = 1;
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
  miniBossEncounteredThisLevel = false;
  waveDisruptTimer = 0;
  soundWin();
  showingLevelScreen = true;
  levelScreenTimer = 0;
  resetBoss();
  resetMiniBossSquad();
  updateHudStatus();
}

function defeatBoss() {
  const reward = getBossBaseReward(BOSS_PROFILES[boss.profileId] || BOSS_PROFILES.striker);
  currentRunStats.bossesDefeated++;
  incrementBestiaryDefeat(`boss_${boss.profileId}`);
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
          incrementBestiaryDefeat(`enemy_${enemy.type}`);
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

    if (!hit && miniBossSquad.active) {
      for (const ship of miniBossSquad.ships) {
        if (ship.hp <= 0) continue;
        if (rectsOverlap(bullet, ship)) {
          hit = true;
          currentRunStats.hits++;
          ship.hp = Math.max(0, ship.hp - 1);
          ship.flashTimer = 5;
          spawnParticleBurst(ship.x + ship.w / 2, ship.y + ship.h / 2, {
            count: ship.role === 'leader' ? 10 : 6,
            color: ship.color,
            speedMin: 1.2,
            speedMax: 3.8,
            lifeMin: 14,
            lifeMax: 28
          });
          if (ship.hp <= 0) {
            incrementBestiaryDefeat(ship.role === 'leader'
              ? (miniBossSquad.profileId === 'squad_trident' ? 'elite_trident' : 'elite_leader')
              : (ship.role === 'prong' ? 'elite_prong' : 'elite_escort'));
            score += ship.role === 'leader' ? 220 : 90;
            scoreEl.textContent = score;
            syncHighscore();
            spawnExplosion(ship.x + ship.w / 2, ship.y + ship.h / 2, ship.role === 'leader' ? 24 : 14);
            spawnFloatingText(ship.x + ship.w / 2, ship.y - 4, ship.role === 'leader' ? '+220' : '+90', ship.color);
          } else {
            spawnFloatingText(ship.x + ship.w / 2, ship.y - 4, `${ship.hp}/${ship.maxHp}`, ship.color);
          }
          soundHit();
          bullet.pierces -= 1;
          bullet.y -= 8;
          if (bullet.pierces <= 0) playerBullets.splice(index, 1);
          if (!getMiniBossAliveShips().length) {
            defeatMiniBossSquad();
            return;
          }
          updateHudStatus();
          break;
        }
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
      markBestiarySeen(`ufo_${variant.id}`, { showTip: variant.id !== 'bonus' });
      currentRunStats.hits++;
      currentRunStats.ufoDestroyed++;
      incrementBestiaryDefeat(`ufo_${variant.id}`);
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
      if (variant.guaranteePowerUp) spawnPowerUp(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2);
      if (variant.id === 'jackpot') {
        awardTimeBonus(4000);
        spawnFloatingText(ufo.x + ufo.w / 2, ufo.y + 12, 'JACKPOT', '#fff1a8');
      }
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
  if (boss.phaseIndex === 1 && boss.hp <= Math.ceil(boss.maxHp * 0.5)) {
    boss.phaseIndex = 2;
    boss.speed += 0.28;
    spawnFloatingText(boss.x + boss.w / 2, boss.y - 10, 'PHASE 2', getBossAccentColor(profile.id));
    spawnShockwave(boss.x + boss.w / 2, boss.y + boss.h / 2, 'rgba(255,255,255,0.26)', 16, 3.2);
    addScreenShake(5);
    triggerCinematicFlash(0.09);
    updateHudStatus();
  }
  if (profile.movePattern === 'pulse') {
    boss.x += boss.dir * boss.speed * 0.82 * freezeFactor;
    boss.y = boss.baseY + Math.sin(boss.phase * 1.4) * 14;
  } else if (profile.movePattern === 'warden') {
    boss.x += boss.dir * boss.speed * 0.68 * freezeFactor;
    boss.y = boss.baseY + Math.sin(boss.phase * 0.8) * 7;
  } else if (profile.movePattern === 'overlord') {
    boss.x += boss.dir * boss.speed * 0.88 * freezeFactor;
    boss.y = boss.baseY + Math.sin(boss.phase * 1.05) * 12;
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
  const shootIntervalBase = profile.volley === 'wall' ? 88 : profile.volley === 'burst' ? 64 : profile.volley === 'hybrid' ? 70 : 72;
  const shootInterval = Math.max(34, Math.round((shootIntervalBase * preset.enemyShootFactor - (boss.maxHp - boss.hp) * 1.05) * (activeEffects.freeze > 0 ? 2.35 : 1)));
  if (boss.shootTimer >= shootInterval) {
    boss.shootTimer = 0;
    let spread = [-28, 28];
    if (profile.volley === 'burst') {
      spread = boss.hp <= Math.ceil(boss.maxHp / 2) ? [-34, 0, 34] : [-18, 18];
    } else if (profile.volley === 'wall') {
      spread = [-48, -20, 0, 20, 48];
    } else if (profile.volley === 'hybrid') {
      spread = boss.hp <= Math.ceil(boss.maxHp / 2) ? [-44, -18, 0, 18, 44] : [-34, 0, 34];
    } else if (boss.hp <= Math.ceil(boss.maxHp / 2)) {
      spread = [-36, 0, 36];
    }
    if (boss.phaseIndex === 2 && profile.volley !== 'wall') spread = [...new Set([...spread, 0])];
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

function updateMiniBossSquad() {
  if (!miniBossSquad.active) return;
  const freezeFactor = getFreezeFactor();
  const profile = MINI_BOSS_PROFILES[miniBossSquad.profileId] || MINI_BOSS_PROFILES.squad_basic;
  const leader = miniBossSquad.ships.find(ship => ship.role === 'leader' && ship.hp > 0);
  const aliveWings = miniBossSquad.ships.filter(ship => ship.role !== 'leader' && ship.hp > 0).length;
  const leaderRatio = leader ? leader.hp / leader.maxHp : 0;
  const isEnraged = profile.enrageThreshold > 0 && (aliveWings <= 1 || leaderRatio <= profile.enrageThreshold);

  if (miniBossSquad.entryTimer > 0) {
    miniBossSquad.entryTimer--;
    miniBossSquad.y += (96 - miniBossSquad.y) * 0.12;
    for (const ship of miniBossSquad.ships) {
      const targetY = ship.role === 'leader' ? 88 : 110;
      ship.y += (targetY - ship.y) * 0.08;
    }
    return;
  }

  miniBossSquad.phase += (profile.id === 'squad_trident' ? 0.052 : 0.04) * freezeFactor;
  const movementSpeed = miniBossSquad.speed + (isEnraged ? 0.3 : 0);
  miniBossSquad.x += miniBossSquad.dir * movementSpeed * freezeFactor;
  const horizontalSpan = profile.id === 'squad_trident'
    ? miniBossSquad.horizontalSpan + Math.sin(miniBossSquad.phase * 1.25) * 18 + (isEnraged ? 10 : 0)
    : miniBossSquad.horizontalSpan;
  if (miniBossSquad.x <= 70 || miniBossSquad.x >= canvas.width - 70) {
    miniBossSquad.dir *= -1;
  }

  for (const ship of miniBossSquad.ships) {
    if (ship.hp <= 0) continue;
    const offsetX = ship.role === 'leader' ? 0 : horizontalSpan * ship.side;
    const bob = ship.role === 'leader'
      ? Math.sin(miniBossSquad.phase) * (profile.id === 'squad_trident' ? 7 : 6)
      : Math.cos(miniBossSquad.phase + (ship.side < 0 ? 0.6 : -0.6)) * (profile.id === 'squad_trident' ? 7 : 5);
    ship.x = miniBossSquad.x + offsetX - ship.w / 2;
    ship.y = (ship.role === 'leader' ? 88 : 110) + bob;
  }

  miniBossSquad.shootTimer++;
  const threatLevel = getThreatLevel();
  const shootInterval = Math.max(40, Math.round(profile.shootIntervalBase - threatLevel * (profile.id === 'squad_trident' ? 4.6 : 4) - (isEnraged ? 6 : 0)));
  if (miniBossSquad.shootTimer >= shootInterval) {
    miniBossSquad.shootTimer = 0;
    const aliveShips = getMiniBossAliveShips();
    for (const ship of aliveShips) {
      const canFire = ship.role === 'leader' || Math.random() < profile.escortFireChance;
      if (!canFire) continue;
      const volleyOffsets = ship.role === 'leader'
        ? profile.leaderVolleyOffsets
        : (profile.id === 'squad_trident' ? [ship.side * -6] : [0]);
      for (const offset of volleyOffsets) {
        enemyBullets.push({
          x: ship.x + ship.w / 2 + offset - 2,
          y: ship.y + ship.h,
          w: 4,
          h: 12,
          speed: getDifficultyConfig().enemyBulletBase + 0.6 + (ship.role === 'leader' ? 0.35 : 0) + (profile.id === 'squad_trident' ? 0.12 : 0),
          fromBoss: false,
          tint: ship.color
        });
      }
    }
  }

  if (miniBossSquad.ships.some(ship => ship.hp > 0 && ship.y + ship.h >= player.y - 8) && invincibleTimer === 0) {
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
  for (const ship of miniBossSquad.ships) {
    ship.flashTimer = Math.max(0, (ship.flashTimer || 0) - 1);
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
  updateTutorialPromptQueue();

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
  if (waveDisruptTimer > 0) {
    waveDisruptTimer = Math.max(0, waveDisruptTimer - Math.min(50, lastDeltaMs));
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
  if (!boss.active && !miniBossSquad.active && aliveEnemies.length === 0) {
    if (shouldSpawnBossForLevel(level) && !bossEncounteredThisLevel) {
      startBossFight();
      return;
    }
    if (shouldSpawnMiniBossForLevel(level) && !miniBossEncounteredThisLevel) {
      spawnMiniBossSquad();
      return;
    }
    completeLevel();
    return;
  }

  if (!boss.active && !miniBossSquad.active) {
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
  } else if (boss.active) {
    updateBoss();
  } else if (miniBossSquad.active) {
    updateMiniBossSquad();
  }

  updateEnemyBullets();
  if (!running) return;
  updatePowerUps();

  ufoSpawnTimer++;
  if (!ufo.active && !boss.active && !miniBossSquad.active && ufoSpawnTimer >= getUfoSpawnInterval()) {
    ufoSpawnTimer = 0;
    const variant = getUfoVariantDef(rollUfoVariant(level, currentRunStats.mode || gameSettings.mode));
    markBestiarySeen(`ufo_${variant.id}`, { showTip: variant.id !== 'bonus' });
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
    if (ufo.x > canvas.width + ufo.w || ufo.x < -ufo.w * 2) {
      const variant = getUfoVariantDef();
      if (variant.escapeEffect === 'disrupt') {
        waveDisruptTimer = 7000;
        spawnFloatingText(canvas.width / 2, 72, 'DISRUPTOR ACTIVO', '#b1a2ff');
        addScreenShake(3);
      } else if (variant.escapeEffect === 'jackpot') {
        score += 80;
        scoreEl.textContent = score;
        syncHighscore();
      }
      ufo.active = false;
      updateHudStatus();
    }
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
  drawEnemyModel(ctx, enemy.x, enemy.y, enemy.w, enemy.h, enemy.type, color, {
    glow: enemy.type === 'tank' ? 8 : 4,
    pose: enemy.pose,
    flash: enemy.flashTimer > 0
  });
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
  const accent = getBossAccentColor();
  drawBossModel(ctx, boss.x, boss.y, boss.w, boss.h, boss.profileId, accent, {
    glow: boss.entryTimer > 0 ? 26 : 16,
    flash: boss.flashTimer > 0
  });

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

function drawMiniBossSquad() {
  if (!miniBossSquad.active) return;
  for (const ship of miniBossSquad.ships) {
    if (ship.hp <= 0) continue;
    drawMiniBossShipModel(ctx, ship.x, ship.y, ship.w, ship.h, ship.role, ship.color, {
      glow: ship.role === 'leader' ? 12 : 8,
      flash: ship.flashTimer > 0,
      variant: miniBossSquad.profileId
    });
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
    const previewEvent = getWaveEventForLevel(level, running ? currentRunStats.mode : gameSettings.mode);
    ctx.fillStyle = theme.accent;
    ctx.shadowBlur = 20;
    ctx.shadowColor = theme.accent;
    ctx.font = `bold ${Math.floor(canvas.width / 20)}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(`— NIVEL ${level} —`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = `${Math.floor(canvas.width / 40)}px Courier New`;
    ctx.fillStyle = '#aaa';
    ctx.fillText(getLevelEncounterPreviewText(level), canvas.width / 2, canvas.height / 2 + 24);
    if (previewEvent.id !== 'standard') {
      ctx.fillStyle = '#ffd966';
      ctx.fillText(previewEvent.label, canvas.width / 2, canvas.height / 2 + 56);
    }
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
    drawPlayerShipModel(ctx, player.x, player.y, player.w, player.h, gameSettings.shipSkin, theme.player, { glow: 8 });
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
    drawUfoModel(ctx, ufo.x, ufo.y, ufo.w, ufo.h, variant.id, variant.color, {
      glow: 8,
      showPoints: true,
      points: variant.points
    });
  }

  drawMiniBossSquad();
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

  drawTutorialPrompt();
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
  activeTutorialPrompt = null;
  pendingTutorialPromptQueue.length = 0;
  pendingIntroTutorial = false;
  resetBoss();
  resetMiniBossSquad();
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
  const startingLevel = gameSettings.mode === 'classic'
    ? normalizeStartLevel(gameSettings.startLevel, getMaxUnlockedStartLevel())
    : 1;
  closeOverlayDialog();
  currentChallenge = getCurrentChallengeDefinition();
  currentRunStats = createRunStats();
  currentRunStats.startedAt = Date.now();
  currentRunStats.difficulty = gameSettings.difficulty;
  currentRunStats.mode = gameSettings.mode;
  currentRunStats.challengeId = currentChallenge.id;

  score = 0;
  lives = Math.min(MAX_LIVES, preset.startLives);
  level = startingLevel;
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
  miniBossEncounteredThisLevel = false;
  waveDisruptTimer = 0;
  heartbeatTimer = 0;
  heartbeatIdx = 0;
  currentWavePattern = WAVE_PATTERNS.classic_grid;
  currentWaveEvent = WAVE_EVENT_DEFS.standard;
  currentWaveEnemyCount = TOTAL_ENEMIES;
  activeTutorialPrompt = null;
  pendingTutorialPromptQueue.length = 0;
  pendingIntroTutorial = aggregateStats.gamesPlayed === 0 && !hasTutorialSeen('intro:controls');
  playerBullets.length = 0;
  enemyBullets.length = 0;
  powerUps.length = 0;
  explosions.length = 0;
  floatingTexts.length = 0;
  particles.length = 0;
  shockwaves.length = 0;
  resetBoss();
  resetMiniBossSquad();

  scoreEl.textContent = '0';
  levelEl.textContent = String(level);
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
  if (pendingIntroTutorial) {
    queueTutorialPrompt(
      'intro:controls',
      'PRIMERA SALIDA',
      'Muevete con flechas o tactil y dispara con espacio. La primera ronda esta pensada para entrar rapido en ritmo.',
      320
    );
    pendingIntroTutorial = false;
  }
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
