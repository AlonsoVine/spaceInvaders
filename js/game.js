// =====================
//  Space Invaders v2.0
//  Alpha — estructura base
// =====================

const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');
const overlay = document.getElementById('overlay');
const btnStart = document.getElementById('btn-start');

// --- Estado del juego ---
let score = 0, lives = 3, level = 1;
let running = false;
let animFrame;

// --- Jugador ---
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  w: 40, h: 20,
  speed: 5,
  color: '#00ff88',
};

// --- Teclas ---
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Enter' && !running) startGame();
  if (e.code === 'Space') { e.preventDefault(); shoot(); }
});
document.addEventListener('keyup', e => keys[e.code] = false);
btnStart.addEventListener('click', startGame);

// --- Bala del jugador ---
let bullet = null;

function shoot() {
  if (!running || bullet) return;
  bullet = { x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 12, speed: 8 };
}

// --- Enemigos (placeholder) ---
const enemies = [];
function spawnEnemies() {
  enemies.length = 0;
  const rows = 3, cols = 10;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      enemies.push({ x: 60 + c * 65, y: 60 + r * 50, w: 36, h: 24, alive: true });
    }
  }
}

// --- Update ---
function update() {
  // Mover jugador
  if (keys['ArrowLeft']  && player.x > 0)                   player.x -= player.speed;
  if (keys['ArrowRight'] && player.x + player.w < canvas.width) player.x += player.speed;

  // Mover bala
  if (bullet) {
    bullet.y -= bullet.speed;
    if (bullet.y + bullet.h < 0) bullet = null;

    // Colisión con enemigos
    if (bullet) {
      for (const e of enemies) {
        if (!e.alive) continue;
        if (bullet.x < e.x + e.w && bullet.x + bullet.w > e.x &&
            bullet.y < e.y + e.h && bullet.y + bullet.h > e.y) {
          e.alive = false;
          bullet = null;
          score += 10;
          scoreEl.textContent = score;
          break;
        }
      }
    }
  }

  // Comprobar victoria
  if (enemies.every(e => !e.alive)) {
    level++;
    levelEl.textContent = level;
    spawnEnemies();
  }
}

// --- Draw ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jugador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Bala
  if (bullet) {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  }

  // Enemigos
  for (const e of enemies) {
    if (!e.alive) continue;
    ctx.fillStyle = '#ff4488';
    ctx.fillRect(e.x, e.y, e.w, e.h);
  }
}

// --- Loop ---
function loop() {
  update();
  draw();
  if (running) animFrame = requestAnimationFrame(loop);
}

// --- Start ---
function startGame() {
  score = 0; lives = 3; level = 1;
  scoreEl.textContent = 0;
  livesEl.textContent = 3;
  levelEl.textContent = 1;
  bullet = null;
  spawnEnemies();
  overlay.classList.remove('visible');
  running = true;
  loop();
}

// Dibujo inicial
draw();
