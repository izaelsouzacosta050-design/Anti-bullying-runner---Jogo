(() => {
'use strict';

/* =========================================================
   ANTI-BULLYING RUNNER v2.0 ULTRA
   SCRIPT ÚNICO FUNCIONAL
========================================================= */

/* ==========================
   HELPERS
========================== */

const $ = (id) => document.getElementById(id);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/* ==========================
   SAVE
========================== */

const SAVE_KEY = 'anti_runner_ultra_v2';

const DEFAULT_SAVE = {
  player: {
    name: '',
    level: 1,
    xp: 0,
    coins: 0,
    gems: 0,
    avatar: '🧑‍🦱'
  },
  stats: {
    bestScore: 0,
    runs: 0
  },
  settings: {
    music: 70,
    sfx: 80,
    theme: 'arcade',
    lang: 'pt',
    muted: false
  },
  ranking: []
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return deepClone(DEFAULT_SAVE);

    const parsed = JSON.parse(raw);
    return {
      ...deepClone(DEFAULT_SAVE),
      ...parsed,
      player: {
        ...deepClone(DEFAULT_SAVE).player,
        ...(parsed.player || {})
      },
      stats: {
        ...deepClone(DEFAULT_SAVE).stats,
        ...(parsed.stats || {})
      },
      settings: {
        ...deepClone(DEFAULT_SAVE).settings,
        ...(parsed.settings || {})
      },
      ranking: Array.isArray(parsed.ranking) ? parsed.ranking : []
    };
  } catch (err) {
    return deepClone(DEFAULT_SAVE);
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(Game.save));
}

/* ==========================
   ESTADO GLOBAL
========================== */

const Game = {
  save: loadSave(),

  screen: 'loading',
  running: false,
  paused: false,
  over: false,

  canvas: null,
  ctx: null,
  loopId: 0,

  score: 0,
  coins: 0,
  gems: 0,
  speed: 1,
  lives: 3,

  width: 0,
  height: 0,
  groundY: 0,

  lastTime: 0
};

const LANES = [-140, 0, 140];

const Player = {
  lane: 1,
  targetLane: 1,
  x: 0,
  y: 0,
  vy: 0,
  width: 56,
  height: 92,
  jumpForce: -20,
  gravity: 1.1,
  jumping: false,
  sliding: false,
  slideTimer: 0
};

const Obstacles = [];
const Coins = [];
const Gems = [];

/* ==========================
   SCREENS
========================== */

const screenIds = [
  'loading',
  'menu',
  'howto',
  'shop',
  'settings',
  'ranking',
  'game'
];

function showScreen(name) {
  screenIds.forEach(id => {
    const el = $('screen-' + id);
    if (!el) return;
    el.classList.add('hidden');
    el.classList.remove('active');
  });

  const target = $('screen-' + name);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  Game.screen = name;
  toggleToolbar();
}

function toggleToolbar() {
  const toolbar = $('global-toolbar');
  if (!toolbar) return;

  if (Game.screen === 'game') {
    toolbar.classList.add('hidden');
  } else {
    toolbar.classList.remove('hidden');
  }
}

/* ==========================
   UI
========================== */

function applyTheme() {
  document.body.dataset.theme = Game.save.settings.theme || 'arcade';
}

function updateXPBars() {
  const xp = Game.save.player.xp;
  const level = Game.save.player.level;
  const need = level * 100;
  const pct = clamp((xp / need) * 100, 0, 100);

  if ($('menu-xp-fill')) $('menu-xp-fill').style.width = pct + '%';
  if ($('menu-xp-label')) $('menu-xp-label').textContent = `${Math.floor(xp)} / ${need} XP`;
  if ($('hud-xp-fill')) $('hud-xp-fill').style.width = pct + '%';
}

function updateMenu() {
  if ($('menu-player-name')) $('menu-player-name').textContent = Game.save.player.name || 'Jogador';
  if ($('menu-player-level')) $('menu-player-level').textContent = `Nível ${Game.save.player.level}`;
  if ($('menu-player-avatar')) $('menu-player-avatar').textContent = Game.save.player.avatar || '🧑‍🦱';

  if ($('menu-coins-amount')) $('menu-coins-amount').textContent = Game.save.player.coins;
  if ($('menu-gems-amount')) $('menu-gems-amount').textContent = Game.save.player.gems;

  if ($('shop-coins-amount')) $('shop-coins-amount').textContent = Game.save.player.coins;
  if ($('shop-gems-amount')) $('shop-gems-amount').textContent = Game.save.player.gems;

  if ($('input-player-name')) $('input-player-name').value = Game.save.player.name || '';

  if ($('slider-music')) $('slider-music').value = Game.save.settings.music;
  if ($('slider-sfx')) $('slider-sfx').value = Game.save.settings.sfx;

  updateXPBars();
  updateHUD();
}

function updateHUD() {
  if ($('hud-score')) $('hud-score').textContent = Math.floor(Game.score);
  if ($('hud-level')) $('hud-level').textContent = Game.save.player.level;
  if ($('hud-coins')) $('hud-coins').textContent = Game.coins;
  if ($('hud-gems')) $('hud-gems').textContent = Game.gems;

  updateLives();
  updateXPBars();
}

function updateLives() {
  $$('.heart').forEach((heart, i) => {
    heart.classList.toggle('lost', i >= Game.lives);
  });
}

function openMenu() {
  updateMenu();
  renderRanking();
  renderShop();
  showScreen('menu');
}

/* ==========================
   LOADING
========================== */

function startLoading() {
  let pct = 0;

  const fill = $('loading-bar-fill');
  const text = $('loading-bar-percent');
  const status = $('loading-status');
  const progress = $('loading-progressbar');

  const messages = [
    'Carregando recursos...',
    'Preparando mundo...',
    'Organizando pistas...',
    'Ajustando desafios...',
    'Finalizando...'
  ];

  const timer = setInterval(() => {
    pct += 5;

    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = pct + '%';
    if (progress) progress.setAttribute('aria-valuenow', String(pct));

    const idx = Math.min(messages.length - 1, Math.floor(pct / 20));
    if (status) status.textContent = messages[idx];

    if (pct >= 100) {
      clearInterval(timer);

      if (!Game.save.player.name) {
        $('modal-login')?.classList.remove('hidden');
      } else {
        openMenu();
      }
    }
  }, 40);
}

/* ==========================
   LOGIN / SETTINGS
========================== */

function confirmLogin() {
  const input = $('input-login-name');
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  Game.save.player.name = name;
  saveGame();
  $('modal-login')?.classList.add('hidden');
  openMenu();
}

function savePlayerName() {
  const input = $('input-player-name');
  if (!input) return;

  const name = input.value.trim();
  if (!name) return;

  Game.save.player.name = name;
  saveGame();
  updateMenu();
}

function bindSettings() {
  $('btn-save-name')?.addEventListener('click', savePlayerName);

  $('slider-music')?.addEventListener('input', (e) => {
    Game.save.settings.music = Number(e.target.value);
    saveGame();
  });

  $('slider-sfx')?.addEventListener('input', (e) => {
    Game.save.settings.sfx = Number(e.target.value);
    saveGame();
  });

  $$('#theme-options .settings-option').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#theme-options .settings-option').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');

      Game.save.settings.theme = btn.dataset.theme;
      applyTheme();
      saveGame();
    });
  });

  $$('#lang-options .settings-option').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#lang-options .settings-option').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');

      Game.save.settings.lang = btn.dataset.lang;
      document.body.dataset.lang = btn.dataset.lang;
      saveGame();
    });
  });

  $('btn-reset-data')?.addEventListener('click', () => {
    if (confirm('Apagar progresso?')) {
      localStorage.removeItem(SAVE_KEY);
      location.reload();
    }
  });
}

/* ==========================
   CANVAS
========================== */

function initCanvas() {
  Game.canvas = $('game-canvas');
  if (!Game.canvas) return;

  Game.ctx = Game.canvas.getContext('2d');
  resizeCanvas();
}

function resizeCanvas() {
  if (!Game.canvas) return;

  const app = $('app');
  const rect = app ? app.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };

  Game.width = Math.floor(rect.width);
  Game.height = Math.floor(rect.height);
  Game.groundY = Game.height - 160;

  Game.canvas.width = Game.width;
  Game.canvas.height = Game.height;
}

/* ==========================
   JOGO
========================== */

function resetPlayer() {
  Player.lane = 1;
  Player.targetLane = 1;
  Player.x = 0;
  Player.y = 0;
  Player.vy = 0;
  Player.jumping = false;
  Player.sliding = false;
  Player.slideTimer = 0;
}

function resetRun() {
  Game.score = 0;
  Game.coins = 0;
  Game.gems = 0;
  Game.speed = 1;
  Game.lives = 3;
  Game.over = false;
  Game.lastTime = 0;

  Obstacles.length = 0;
  Coins.length = 0;
  Gems.length = 0;

  resetPlayer();
  updateHUD();

  $('modal-gameover')?.classList.add('hidden');
  $('modal-pause')?.classList.add('hidden');
}

function startGame() {
  initCanvas();
  resizeCanvas();
  resetRun();

  Game.running = true;
  Game.paused = false;

  showScreen('game');
  startLoop();
}

function pauseGame() {
  if (!Game.running || Game.over) return;
  Game.paused = true;
  $('modal-pause')?.classList.remove('hidden');
}

function resumeGame() {
  if (!Game.running || Game.over) return;
  Game.paused = false;
  $('modal-pause')?.classList.add('hidden');
  startLoop();
}

function exitToMenu() {
  Game.running = false;
  Game.paused = false;
  cancelAnimationFrame(Game.loopId);
  $('modal-pause')?.classList.add('hidden');
  $('modal-gameover')?.classList.add('hidden');
  openMenu();
}

/* ==========================
   MOVIMENTO
========================== */

function moveLeft() {
  if (!Game.running || Game.paused) return;
  Player.targetLane = Math.max(0, Player.targetLane - 1);
}

function moveRight() {
  if (!Game.running || Game.paused) return;
  Player.targetLane = Math.min(2, Player.targetLane + 1);
}

function jump() {
  if (!Game.running || Game.paused) return;
  if (Player.jumping) return;

  Player.jumping = true;
  Player.vy = Player.jumpForce;
}

function slide() {
  if (!Game.running || Game.paused) return;
  if (Player.sliding) return;

  Player.sliding = true;
  Player.slideTimer = 28;
}

function updatePlayer() {
  Player.x += (LANES[Player.targetLane] - Player.x) * 0.18;

  Player.vy += Player.gravity;
  Player.y += Player.vy;

  if (Player.y > 0) {
    Player.y = 0;
    Player.vy = 0;
    Player.jumping = false;
  }

  if (Player.slideTimer > 0) {
    Player.slideTimer--;
  } else {
    Player.sliding = false;
  }
}

/* ==========================
   SPAWN
========================== */

function spawnObstacle() {
  if (Math.random() < 0.02) {
    Obstacles.push({
      lane: Math.floor(Math.random() * 3),
      z: -120,
      w: 70,
      h: 70 + Math.random() * 70
    });
  }
}

function spawnCoin() {
  if (Math.random() < 0.035) {
    Coins.push({
      lane: Math.floor(Math.random() * 3),
      z: -40
    });
  }
}

function spawnGem() {
  if (Math.random() < 0.006) {
    Gems.push({
      lane: Math.floor(Math.random() * 3),
      z: -50
    });
  }
}

/* ==========================
   COLISÃO
========================== */

function playerScreenY() {
  return Game.groundY - Player.height + Player.y;
}

function hitLane(lane) {
  return lane === Player.targetLane;
}

function damage() {
  if (Game.over) return;

  Game.lives--;
  updateLives();

  if (Game.lives <= 0) {
    gameOver();
  }
}

function checkObstacleCollision(o) {
  if (!hitLane(o.lane)) return false;

  const py = playerScreenY();
  const ph = Player.sliding ? 56 : Player.height;

  const playerTop = py + (Player.height - ph);
  const playerBottom = py + Player.height;

  const obsTop = o.z;
  const obsBottom = o.z + o.h;

  return obsBottom > playerTop && obsTop < playerBottom;
}

function checkItemCollision(item) {
  if (!hitLane(item.lane)) return false;

  const py = playerScreenY();
  return item.z > py - 30 && item.z < py + 100;
}

/* ==========================
   UPDATE OBJETOS
========================== */

function updateObstacles() {
  for (let i = Obstacles.length - 1; i >= 0; i--) {
    const o = Obstacles[i];
    o.z += 16 * Game.speed;

    if (checkObstacleCollision(o)) {
      Obstacles.splice(i, 1);
      damage();
      continue;
    }

    if (o.z > Game.height + 120) {
      Obstacles.splice(i, 1);
    }
  }
}

function updateCoins() {
  for (let i = Coins.length - 1; i >= 0; i--) {
    const c = Coins[i];
    c.z += 16 * Game.speed;

    if (checkItemCollision(c)) {
      Coins.splice(i, 1);
      Game.coins++;
      Game.score += 5;
      updateHUD();
      continue;
    }

    if (c.z > Game.height + 60) {
      Coins.splice(i, 1);
    }
  }
}

function updateGems() {
  for (let i = Gems.length - 1; i >= 0; i--) {
    const g = Gems[i];
    g.z += 16 * Game.speed;

    if (checkItemCollision(g)) {
      Gems.splice(i, 1);
      Game.gems++;
      Game.score += 20;
      updateHUD();
      continue;
    }

    if (g.z > Game.height + 60) {
      Gems.splice(i, 1);
    }
  }
}

/* ==========================
   XP / RANKING
========================== */

function addXP(amount) {
  Game.save.player.xp += amount;

  while (Game.save.player.xp >= Game.save.player.level * 100) {
    Game.save.player.xp -= Game.save.player.level * 100;
    Game.save.player.level++;
    showLevelUp();
  }

  saveGame();
  updateXPBars();
}

function showLevelUp() {
  const toast = $('toast-levelup');
  const text = $('toast-levelup-text');

  if (text) text.textContent = `Nível ${Game.save.player.level}`;
  if (toast) {
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2200);
  }
}

function saveRanking() {
  Game.save.ranking.push({
    name: Game.save.player.name || 'Jogador',
    score: Math.floor(Game.score),
    level: Game.save.player.level
  });

  Game.save.ranking.sort((a, b) => b.score - a.score);
  Game.save.ranking = Game.save.ranking.slice(0, 20);

  saveGame();
}

function renderRanking() {
  const list = $('ranking-list');
  const empty = $('ranking-empty');
  if (!list) return;

  list.innerHTML = '';

  const ranking = Game.save.ranking || [];

  if (!ranking.length) {
    empty?.classList.remove('hidden');
  } else {
    empty?.classList.add('hidden');
  }

  ranking.forEach((p, i) => {
    const tpl = $('template-ranking-row');
    if (!tpl) return;

    const row = tpl.content.firstElementChild.cloneNode(true);
    row.querySelector('.ranking-position').textContent = i + 1;
    row.querySelector('.ranking-name').textContent = p.name;
    row.querySelector('.ranking-level').textContent = 'Nv ' + p.level;
    row.querySelector('.ranking-score').textContent = p.score;
    list.appendChild(row);
  });

  $('podium-1-name').textContent = ranking[0]?.name || '—';
  $('podium-1-score').textContent = ranking[0]?.score || '0';
  $('podium-2-name').textContent = ranking[1]?.name || '—';
  $('podium-2-score').textContent = ranking[1]?.score || '0';
  $('podium-3-name').textContent = ranking[2]?.name || '—';
  $('podium-3-score').textContent = ranking[2]?.score || '0';
}

/* ==========================
   LOJA
========================== */

const SHOP = {
  skins: [
    { id: 'default', icon: '🧑‍🦱', name: 'Clássico', desc: 'Visual padrão.', price: 0 },
    { id: 'guardian', icon: '🛡️', name: 'Guardião', desc: 'Visual defensivo.', price: 120 },
    { id: 'runner', icon: '⚡', name: 'Ultra Runner', desc: 'Visual veloz.', price: 250 }
  ],
  powerups: [
    { id: 'shield', icon: '🛡️', name: 'Escudo', desc: 'Item especial.', price: 50 },
    { id: 'speed', icon: '⚡', name: 'Velocidade', desc: 'Item especial.', price: 70 },
    { id: 'magnet', icon: '🧲', name: 'Ímã', desc: 'Item especial.', price: 90 }
  ],
  themes: [
    { id: 'arcade', icon: '🎮', name: 'Arcade', desc: 'Tema padrão.', price: 0 },
    { id: 'forest', icon: '🌲', name: 'Floresta', desc: 'Tema verde.', price: 180 },
    { id: 'ocean', icon: '🌊', name: 'Oceano', desc: 'Tema azul.', price: 220 },
    { id: 'sunset', icon: '🌇', name: 'Pôr do Sol', desc: 'Tema quente.', price: 300 }
  ]
};

function renderShopCategory(type) {
  const grid = $('shop-grid-' + type);
  const tpl = $('template-shop-card');
  if (!grid || !tpl) return;

  grid.innerHTML = '';

  SHOP[type].forEach(item => {
    const card = tpl.content.firstElementChild.cloneNode(true);

    card.querySelector('.shop-card-icon').textContent = item.icon;
    card.querySelector('.shop-card-name').textContent = item.name;
    card.querySelector('.shop-card-desc').textContent = item.desc || '';
    card.querySelector('.buy-icon').textContent = '🪙';
    card.querySelector('.buy-price').textContent = item.price;

    const btn = card.querySelector('.shop-card-buy');
    btn.addEventListener('click', () => buyItem(type, item));

    grid.appendChild(card);
  });
}

function renderShop() {
  renderShopCategory('skins');
  renderShopCategory('powerups');
  renderShopCategory('themes');
}

function buyItem(type, item) {
  if (Game.save.player.coins < item.price) return;

  Game.save.player.coins -= item.price;

  if (type === 'themes') {
    Game.save.settings.theme = item.id;
    applyTheme();
  }

  saveGame();
  updateMenu();
  renderShop();
}

/* ==========================
   GAME OVER
========================== */

function gameOver() {
  Game.running = false;
  Game.over = true;
  cancelAnimationFrame(Game.loopId);

  const earnedXP = Math.floor(Game.score / 20);

  Game.save.player.coins += Game.coins;
  Game.save.player.gems += Game.gems;
  Game.save.stats.runs += 1;

  if (Game.score > Game.save.stats.bestScore) {
    Game.save.stats.bestScore = Math.floor(Game.score);
    $('gameover-newrecord')?.classList.remove('hidden');
  } else {
    $('gameover-newrecord')?.classList.add('hidden');
  }

  addXP(earnedXP);
  saveRanking();
  saveGame();

  $('gameover-score').textContent = Math.floor(Game.score);
  $('gameover-xp').textContent = earnedXP;
  $('gameover-coins').textContent = Game.coins;
  $('gameover-gems').textContent = Game.gems;

  $('modal-gameover')?.classList.remove('hidden');
  updateMenu();
}

/* ==========================
   DRAW
========================== */

function drawBackground() {
  const ctx = Game.ctx;
  const w = Game.width;
  const h = Game.height;

  ctx.fillStyle = '#0d0221';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#1a0b3d';
  ctx.fillRect(0, h - 180, w, 180);

  const cx = w / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 4;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + LANES[i], 0);
    ctx.lineTo(cx + LANES[i], h - 140);
    ctx.stroke();
  }
}

function drawPlayer() {
  const ctx = Game.ctx;
  const cx = Game.width / 2;
  const height = Player.sliding ? 56 : Player.height;

  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.roundRect(
    cx + Player.x - Player.width / 2,
    Game.groundY - height + Player.y,
    Player.width,
    height,
    14
  );
  ctx.fill();
}

function drawObstacles() {
  const ctx = Game.ctx;
  const cx = Game.width / 2;

  ctx.fillStyle = '#ff2e9a';

  Obstacles.forEach(o => {
    ctx.fillRect(
      cx + LANES[o.lane] - o.w / 2,
      o.z,
      o.w,
      o.h
    );
  });
}

function drawCoins() {
  const ctx = Game.ctx;
  const cx = Game.width / 2;
  ctx.font = '26px sans-serif';

  Coins.forEach(c => {
    ctx.fillText('🪙', cx + LANES[c.lane] - 13, c.z);
  });
}

function drawGems() {
  const ctx = Game.ctx;
  const cx = Game.width / 2;
  ctx.font = '26px sans-serif';

  Gems.forEach(g => {
    ctx.fillText('💎', cx + LANES[g.lane] - 13, g.z);
  });
}

function draw() {
  drawBackground();
  drawPlayer();
  drawObstacles();
  drawCoins();
  drawGems();
}

/* ==========================
   LOOP
========================== */

function update() {
  updatePlayer();
  spawnObstacle();
  spawnCoin();
  spawnGem();
  updateObstacles();
  updateCoins();
  updateGems();

  Game.score += 1 * Game.speed;
  Game.speed += 0.0008;

  updateHUD();
}

function loop() {
  if (!Game.running || Game.paused) return;

  draw();
  update();

  Game.loopId = requestAnimationFrame(loop);
}

function startLoop() {
  cancelAnimationFrame(Game.loopId);
  Game.loopId = requestAnimationFrame(loop);
}

/* ==========================
   INPUT
========================== */

function bindKeyboard() {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && Game.running && !Game.over) {
      if (Game.paused) {
        resumeGame();
      } else {
        pauseGame();
      }
      return;
    }

    if (!Game.running || Game.paused) return;

    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft();
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight();
        break;

      case 'ArrowUp':
      case 'KeyW':
        jump();
        break;

      case 'ArrowDown':
      case 'KeyS':
        slide();
        break;
    }
  });
}

function bindTouch() {
  const layer = $('touch-swipe-layer');
  if (!layer) return;

  let sx = 0;
  let sy = 0;

  layer.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = t.clientX;
    sy = t.clientY;
  }, { passive: true });

  layer.addEventListener('touchend', (e) => {
    if (!Game.running || Game.paused) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 40) moveRight();
      if (dx < -40) moveLeft();
    } else {
      if (dy < -40) jump();
      if (dy > 40) slide();
    }
  }, { passive: true });
}

/* ==========================
   EVENTOS UI
========================== */

function bindMenu() {
  $('btn-play')?.addEventListener('click', startGame);
  $('btn-howto')?.addEventListener('click', () => showScreen('howto'));
  $('btn-shop')?.addEventListener('click', () => showScreen('shop'));
  $('btn-settings')?.addEventListener('click', () => showScreen('settings'));
  $('btn-ranking')?.addEventListener('click', () => {
    renderRanking();
    showScreen('ranking');
  });

  $$('.btn-back').forEach(btn => {
    btn.addEventListener('click', openMenu);
  });

  $('btn-login-confirm')?.addEventListener('click', confirmLogin);

  $('btn-pause')?.addEventListener('click', pauseGame);
  $('btn-resume')?.addEventListener('click', resumeGame);
  $('btn-restart')?.addEventListener('click', startGame);
  $('btn-pause-exit')?.addEventListener('click', exitToMenu);
  $('btn-pause-settings')?.addEventListener('click', () => {
    $('modal-pause')?.classList.add('hidden');
    Game.paused = true;
    showScreen('settings');
  });

  $('btn-gameover-retry')?.addEventListener('click', startGame);
  $('btn-gameover-menu')?.addEventListener('click', () => {
    $('modal-gameover')?.classList.add('hidden');
    openMenu();
  });

  $$('.shop-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.shop-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      $$('.shop-panel').forEach(panel => panel.classList.remove('active'));

      const panel = $('panel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  $('btn-mute')?.addEventListener('click', () => {
    Game.save.settings.muted = !Game.save.settings.muted;
    $('btn-mute').dataset.state = Game.save.settings.muted ? 'muted' : 'unmuted';
    saveGame();
  });

  $('btn-fullscreen')?.addEventListener('click', async () => {
    const root = document.documentElement;
    if (!document.fullscreenElement) {
      try { await root.requestFullscreen(); } catch (_) {}
    } else {
      try { await document.exitFullscreen(); } catch (_) {}
    }
  });
}

/* ==========================
   BOOT
========================== */

function boot() {
  applyTheme();
  document.body.dataset.lang = Game.save.settings.lang || 'pt';

  if ($('btn-mute')) {
    $('btn-mute').dataset.state = Game.save.settings.muted ? 'muted' : 'unmuted';
  }

  bindMenu();
  bindSettings();
  bindKeyboard();
  bindTouch();

  window.addEventListener('resize', resizeCanvas);

  updateMenu();
  renderShop();
  renderRanking();
  startLoading();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

})();
