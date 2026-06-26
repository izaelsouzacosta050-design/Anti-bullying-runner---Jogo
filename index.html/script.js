(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const SAVE_KEY = "anti_runner_ultra_v31";

  const DEFAULT_SAVE = {
    player: {
      name: "",
      level: 1,
      xp: 0,
      coins: 0,
      gems: 0,
      avatar: "🧑"
    },
    stats: {
      bestScore: 0,
      runs: 0
    },
    settings: {
      music: 70,
      sfx: 80,
      theme: "arcade",
      muted: false
    },
    unlocks: {
      skins: ["default"],
      themes: ["arcade"],
      powerups: []
    },
    equipped: {
      skin: "default",
      shield: false,
      magnet: false,
      speed: false
    },
    ranking: []
  };

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return deepClone(DEFAULT_SAVE);
      const parsed = JSON.parse(raw);

      return {
        ...deepClone(DEFAULT_SAVE),
        ...parsed,
        player: { ...deepClone(DEFAULT_SAVE).player, ...(parsed.player || {}) },
        stats: { ...deepClone(DEFAULT_SAVE).stats, ...(parsed.stats || {}) },
        settings: { ...deepClone(DEFAULT_SAVE).settings, ...(parsed.settings || {}) },
        unlocks: {
          ...deepClone(DEFAULT_SAVE).unlocks,
          ...(parsed.unlocks || {}),
          skins: Array.isArray(parsed.unlocks?.skins) ? parsed.unlocks.skins : ["default"],
          themes: Array.isArray(parsed.unlocks?.themes) ? parsed.unlocks.themes : ["arcade"],
          powerups: Array.isArray(parsed.unlocks?.powerups) ? parsed.unlocks.powerups : []
        },
        equipped: { ...deepClone(DEFAULT_SAVE).equipped, ...(parsed.equipped || {}) },
        ranking: Array.isArray(parsed.ranking) ? parsed.ranking : []
      };
    } catch {
      return deepClone(DEFAULT_SAVE);
    }
  }

  const Game = {
    save: loadSave(),
    screen: "loading",
    running: false,
    paused: false,
    over: false,
    questionActive: false,
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
    elapsed: 0,
    lastTime: 0,
    invulnerableTimer: 0,
    pendingQuizObstacle: null
  };

  function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(Game.save));
  }

  const LANES = [-140, 0, 140];

  const Player = {
    targetLane: 1,
    x: 0,
    y: 0,
    vy: 0,
    width: 56,
    height: 92,
    jumpForce: -20,
    gravity: 1.08,
    jumping: false,
    sliding: false,
    slideTimer: 0,
    color: "#00e5ff"
  };

  const Obstacles = [];
  const Coins = [];
  const Gems = [];

  const SHOP = {
    skins: [
      { id: "default", icon: "🧑", name: "Classico", desc: "Visual padrao do corredor.", price: 0 },
      { id: "guardian", icon: "🛡️", name: "Guardiao", desc: "Visual protetor e firme.", price: 120 },
      { id: "runner", icon: "⚡", name: "Ultra Runner", desc: "Visual veloz e brilhante.", price: 250 },
      { id: "ninja", icon: "🥷", name: "Ninja", desc: "Roupa agil e discreta.", price: 320 },
      { id: "astronauta", icon: "🧑‍🚀", name: "Astronauta", desc: "Veste espacial futurista.", price: 380 },
      { id: "mago", icon: "🧙", name: "Mago", desc: "Veste mistica com brilho.", price: 420 },
      { id: "super", icon: "🦸", name: "Heroi", desc: "Capa e postura de coragem.", price: 500 }
    ],
    powerups: [
      { id: "shield", icon: "🛡️", name: "Escudo", desc: "Evita um dano por partida.", price: 80 },
      { id: "speed", icon: "⚡", name: "Arranque", desc: "Comeca a corrida um pouco mais rapido.", price: 100 },
      { id: "magnet", icon: "🧲", name: "Ima", desc: "Atrai moedas proximas automaticamente.", price: 110 }
    ],
    themes: [
      { id: "arcade", icon: "🎮", name: "Arcade", desc: "Tema padrao.", price: 0 },
      { id: "forest", icon: "🌲", name: "Floresta", desc: "Tema verde e calmo.", price: 180 },
      { id: "ocean", icon: "🌊", name: "Oceano", desc: "Tema azul e fluido.", price: 220 },
      { id: "sunset", icon: "🌇", name: "Por do Sol", desc: "Tema quente e vibrante.", price: 300 }
    ]
  };

  const QUIZ = [
    {
      question: "Se voce ver alguem sofrendo bullying na escola, qual atitude e melhor?",
      options: [
        "Ignorar para nao se envolver",
        "Ajudar com respeito e procurar um adulto de confianca",
        "Filmar e postar na internet"
      ],
      correct: 1,
      explanation: "A atitude correta e apoiar a pessoa e buscar ajuda responsavel."
    },
    {
      question: "Bullying acontece apenas na escola?",
      options: [
        "Nao, pode acontecer em varios lugares, inclusive online",
        "Sim, so acontece em sala de aula",
        "So acontece entre desconhecidos"
      ],
      correct: 0,
      explanation: "Bullying pode acontecer na escola, na rua, em grupos, no esporte e na internet."
    },
    {
      question: "Chamar alguem por apelidos humilhantes e brincadeira sempre?",
      options: [
        "Sim, se todo mundo rir",
        "Nao, pode machucar e ser bullying",
        "Sim, se for so uma vez"
      ],
      correct: 1,
      explanation: "Se machuca, humilha ou exclui, nao e brincadeira saudavel."
    },
    {
      question: "O que fazer se voce estiver sofrendo bullying?",
      options: [
        "Guardar tudo sozinho",
        "Responder com mais agressao",
        "Contar a um adulto de confianca e buscar apoio"
      ],
      correct: 2,
      explanation: "Buscar ajuda e a melhor forma de se proteger."
    },
    {
      question: "Espalhar boatos sobre alguem e um tipo de bullying?",
      options: [
        "Sim",
        "Nao",
        "So se for na internet"
      ],
      correct: 0,
      explanation: "Boatos e humilhacoes repetidas podem ser bullying."
    },
    {
      question: "Excluir alguem de proposito do grupo para machucar e:",
      options: [
        "Algo normal",
        "Uma forma de bullying",
        "Uma piada sem importancia"
      ],
      correct: 1,
      explanation: "Exclusao intencional tambem pode ser bullying."
    },
    {
      question: "Se um colega sofre ofensas online, o melhor e:",
      options: [
        "Compartilhar para avisar mais gente",
        "Apoiar a pessoa e avisar um adulto responsavel",
        "Entrar na brincadeira"
      ],
      correct: 1,
      explanation: "No cyberbullying, apoiar e procurar ajuda e a atitude correta."
    },
    {
      question: "Respeito entre colegas significa:",
      options: [
        "Tratar os outros com dignidade mesmo nas diferencas",
        "Zoar quem e diferente",
        "Ficar em silencio quando alguem humilha outro"
      ],
      correct: 0,
      explanation: "Respeito e aceitar diferencas sem humilhar."
    }
  ];

  const screenIds = ["loading", "menu", "howto", "shop", "settings", "ranking", "game"];

  function showToast(message) {
    const toast = $("toast-message");
    const text = $("toast-message-text");
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 1600);
  }

  function showScreen(name) {
    screenIds.forEach((id) => {
      const el = $("screen-" + id);
      if (!el) return;
      el.classList.add("hidden");
      el.classList.remove("active");
    });

    const target = $("screen-" + name);
    if (target) {
      target.classList.remove("hidden");
      target.classList.add("active");
    }

    Game.screen = name;
    toggleToolbar();
  }

  function toggleToolbar() {
    const toolbar = $("global-toolbar");
    if (!toolbar) return;
    if (Game.screen === "game") toolbar.classList.add("hidden");
    else toolbar.classList.remove("hidden");
  }

  function applyTheme() {
    document.body.dataset.theme = Game.save.settings.theme || "arcade";
    syncThemeButtons();
  }

  function syncThemeButtons() {
    $$("#theme-options .settings-option").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === Game.save.settings.theme);
    });
  }

  function updateXPBars() {
    const xp = Game.save.player.xp;
    const level = Game.save.player.level;
    const need = level * 100;
    const pct = clamp((xp / need) * 100, 0, 100);

    if ($("menu-xp-fill")) $("menu-xp-fill").style.width = pct + "%";
    if ($("menu-xp-label")) $("menu-xp-label").textContent = `${Math.floor(xp)} / ${need} XP`;
    if ($("hud-xp-fill")) $("hud-xp-fill").style.width = pct + "%";
  }

  function updateLives() {
    $$(".heart").forEach((heart, i) => {
      heart.classList.toggle("lost", i >= Game.lives);
    });
  }

  function updateHUD() {
    if ($("hud-score")) $("hud-score").textContent = Math.floor(Game.score);
    if ($("hud-level")) $("hud-level").textContent = Game.save.player.level;
    if ($("hud-coins")) $("hud-coins").textContent = Game.coins;
    if ($("hud-gems")) $("hud-gems").textContent = Game.gems;
    updateLives();
    updateXPBars();
  }

  function getEquippedSkin() {
    return SHOP.skins.find((s) => s.id === Game.save.equipped.skin) || SHOP.skins[0];
  }

  function updateMenu() {
    const skin = getEquippedSkin();
    if ($("menu-player-name")) $("menu-player-name").textContent = Game.save.player.name || "Jogador";
    if ($("menu-player-level")) $("menu-player-level").textContent = `Nivel ${Game.save.player.level}`;
    if ($("menu-player-avatar")) $("menu-player-avatar").textContent = skin.icon || "🧑";
    if ($("shop-coins-amount")) $("shop-coins-amount").textContent = Game.save.player.coins;
    if ($("shop-gems-amount")) $("shop-gems-amount").textContent = Game.save.player.gems;
    if ($("menu-coins-amount")) $("menu-coins-amount").textContent = Game.save.player.coins;
    if ($("menu-gems-amount")) $("menu-gems-amount").textContent = Game.save.player.gems;
    if ($("input-player-name")) $("input-player-name").value = Game.save.player.name || "";
    if ($("slider-music")) $("slider-music").value = Game.save.settings.music;
    if ($("slider-sfx")) $("slider-sfx").value = Game.save.settings.sfx;
    updateXPBars();
    updateHUD();
    syncThemeButtons();
  }

  function openMenu() {
    updateMenu();
    renderRanking();
    renderShop();
    showScreen("menu");
  }

  function startLoading() {
    let pct = 0;
    const fill = $("loading-bar-fill");
    const text = $("loading-bar-percent");
    const status = $("loading-status");
    const progress = $("loading-progressbar");

    const messages = [
      "Carregando recursos...",
      "Preparando pistas...",
      "Criando desafios...",
      "Organizando perguntas educativas...",
      "Finalizando..."
    ];

    const timer = setInterval(() => {
      pct += 5;
      if (fill) fill.style.width = pct + "%";
      if (text) text.textContent = pct + "%";
      if (progress) progress.setAttribute("aria-valuenow", String(pct));
      const idx = Math.min(messages.length - 1, Math.floor(pct / 20));
      if (status) status.textContent = messages[idx];

      if (pct >= 100) {
        clearInterval(timer);
        if (!Game.save.player.name) $("modal-login")?.classList.remove("hidden");
        else openMenu();
      }
    }, 35);
  }

  function confirmLogin() {
    const input = $("input-login-name");
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      showToast("Digite um nome.");
      return;
    }
    Game.save.player.name = name;
    saveGame();
    $("modal-login")?.classList.add("hidden");
    openMenu();
  }

  function savePlayerName() {
    const input = $("input-player-name");
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      showToast("Digite um nome valido.");
      return;
    }
    Game.save.player.name = name;
    saveGame();
    updateMenu();
    showToast("Nome salvo.");
  }

  function bindSettings() {
    $("btn-save-name")?.addEventListener("click", savePlayerName);

    $("slider-music")?.addEventListener("input", (e) => {
      Game.save.settings.music = Number(e.target.value);
      saveGame();
    });

    $("slider-sfx")?.addEventListener("input", (e) => {
      Game.save.settings.sfx = Number(e.target.value);
      saveGame();
    });

    $$("#theme-options .settings-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;
        const unlocked = Game.save.unlocks.themes.includes(theme);
        if (!unlocked) {
          showToast("Compre esse tema na loja primeiro.");
          return;
        }
        Game.save.settings.theme = theme;
        applyTheme();
        saveGame();
        updateMenu();
        showToast("Tema aplicado.");
      });
    });

    $("btn-reset-data")?.addEventListener("click", () => {
      if (confirm("Apagar todo o progresso salvo?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
      }
    });
  }

  function initCanvas() {
    Game.canvas = $("game-canvas");
    if (!Game.canvas) return;
    Game.ctx = Game.canvas.getContext("2d");
    resizeCanvas();
  }

  function resizeCanvas() {
    if (!Game.canvas) return;
    const app = $("app");
    const rect = app ? app.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    Game.width = Math.floor(rect.width);
    Game.height = Math.floor(rect.height);
    Game.groundY = Game.height - 160;
    Game.canvas.width = Game.width;
    Game.canvas.height = Game.height;
  }

  function resetPlayer() {
    Player.targetLane = 1;
    Player.x = 0;
    Player.y = 0;
    Player.vy = 0;
    Player.jumping = false;
    Player.sliding = false;
    Player.slideTimer = 0;

    const skin = Game.save.equipped.skin;
    if (skin === "guardian") Player.color = "#9be7ff";
    else if (skin === "runner") Player.color = "#ffe600";
    else if (skin === "ninja") Player.color = "#c0c7d1";
    else if (skin === "astronauta") Player.color = "#ffffff";
    else if (skin === "mago") Player.color = "#b57cff";
    else if (skin === "super") Player.color = "#ff5e7e";
    else Player.color = "#00e5ff";
  }

  function resetRun() {
    Game.score = 0;
    Game.coins = 0;
    Game.gems = 0;
    Game.speed = Game.save.equipped.speed ? 1.18 : 1;
    Game.lives = 3;
    Game.over = false;
    Game.paused = false;
    Game.questionActive = false;
    Game.elapsed = 0;
    Game.lastTime = 0;
    Game.invulnerableTimer = 0;
    Game.pendingQuizObstacle = null;

    Obstacles.length = 0;
    Coins.length = 0;
    Gems.length = 0;

    resetPlayer();
    updateHUD();
    $("modal-gameover")?.classList.add("hidden");
    $("modal-pause")?.classList.add("hidden");
    $("modal-quiz")?.classList.add("hidden");
  }

  function startGame() {
    initCanvas();
    resizeCanvas();
    resetRun();
    Game.running = true;
    showScreen("game");
    startLoop();
  }

  function pauseGame() {
    if (!Game.running || Game.over || Game.questionActive) return;
    Game.paused = true;
    $("modal-pause")?.classList.remove("hidden");
  }

  function resumeGame() {
    if (!Game.running || Game.over) return;
    Game.paused = false;
    $("modal-pause")?.classList.add("hidden");
    startLoop();
  }

  function exitToMenu() {
    Game.running = false;
    Game.paused = false;
    Game.questionActive = false;
    cancelAnimationFrame(Game.loopId);
    $("modal-pause")?.classList.add("hidden");
    $("modal-gameover")?.classList.add("hidden");
    $("modal-quiz")?.classList.add("hidden");
    openMenu();
  }

  function moveLeft() {
    if (!Game.running || Game.paused || Game.questionActive) return;
    Player.targetLane = Math.max(0, Player.targetLane - 1);
  }

  function moveRight() {
    if (!Game.running || Game.paused || Game.questionActive) return;
    Player.targetLane = Math.min(2, Player.targetLane + 1);
  }

  function jump() {
    if (!Game.running || Game.paused || Game.questionActive) return;
    if (Player.jumping) return;
    Player.jumping = true;
    Player.vy = Player.jumpForce;
  }

  function slide() {
    if (!Game.running || Game.paused || Game.questionActive) return;
    if (Player.sliding) return;
    Player.sliding = true;
    Player.slideTimer = 28;
  }

  function updatePlayer() {
    Player.x += (LANES[Player.targetLane] - Player.x) * 0.2;
    Player.vy += Player.gravity;
    Player.y += Player.vy;

    if (Player.y > 0) {
      Player.y = 0;
      Player.vy = 0;
      Player.jumping = false;
    }

    if (Player.slideTimer > 0) Player.slideTimer--;
    else Player.sliding = false;
  }

  function laneBusyAtSpawn(lane) {
    return Obstacles.some((o) => o.lane === lane && o.z < 180);
  }

  function spawnObstacle() {
    const p = 0.025 + Game.speed * 0.003;
    if (Math.random() >= p) return;

    const lane = Math.floor(Math.random() * 3);
    if (laneBusyAtSpawn(lane)) return;

    const typeRoll = Math.random();

    if (typeRoll < 0.35) {
      Obstacles.push({
        id: crypto.randomUUID(),
        type: "barreira",
        lane,
        z: -140,
        w: 84,
        h: 76,
        asked: false
      });
      return;
    }

    if (typeRoll < 0.68) {
      Obstacles.push({
        id: crypto.randomUUID(),
        type: "humano",
        lane,
        z: -130,
        w: 56,
        h: 98,
        asked: false
      });
      return;
    }

    Obstacles.push({
      id: crypto.randomUUID(),
      type: "trem",
      lane,
      z: -260,
      w: 124,
      h: 218,
      asked: false
    });
  }

  function spawnCoin() {
    if (Math.random() < 0.034) {
      Coins.push({
        lane: Math.floor(Math.random() * 3),
        z: -40
      });
    }
  }

  function spawnGem() {
    if (Math.random() < 0.0065) {
      Gems.push({
        lane: Math.floor(Math.random() * 3),
        z: -50
      });
    }
  }

  function playerScreenY() {
    return Game.groundY - Player.height + Player.y;
  }

  function hitLane(lane) {
    return lane === Player.targetLane;
  }

  function damage() {
    if (Game.over || Game.invulnerableTimer > 0) return;

    if (Game.save.equipped.shield) {
      Game.save.equipped.shield = false;
      Game.invulnerableTimer = 45;
      saveGame();
      showToast("Escudo protegeu voce.");
      return;
    }

    Game.lives--;
    Game.invulnerableTimer = 45;
    updateLives();

    if (Game.lives <= 0) gameOver();
  }

  function checkObstacleCollision(o) {
    if (!hitLane(o.lane)) return false;

    const py = playerScreenY();
    const ph = Player.sliding ? 56 : Player.height;
    const playerTop = py + (Player.height - ph);
    const playerBottom = py + Player.height;

    const obsTop = o.z;
    const obsBottom = o.z + o.h;

    if (o.type === "barreira") {
      if (Player.jumping && playerBottom < obsTop + 20) return false;
      return obsBottom > playerTop && obsTop < playerBottom;
    }

    if (o.type === "humano") {
      return obsBottom > playerTop + 8 && obsTop < playerBottom - 8;
    }

    if (o.type === "trem") {
      return obsBottom > playerTop && obsTop < playerBottom;
    }

    return false;
  }

  function checkItemCollision(item) {
    const laneMatch = hitLane(item.lane);
    const py = playerScreenY();

    if (Game.save.equipped.magnet && Math.abs(item.lane - Player.targetLane) <= 1 && item.z > py - 140 && item.z < py + 160) {
      return true;
    }

    if (!laneMatch) return false;
    return item.z > py - 30 && item.z < py + 100;
  }

  function triggerQuizForObstacle(obstacle) {
    if (!obstacle || Game.questionActive || Game.over) return;
    Game.questionActive = true;
    Game.pendingQuizObstacle = obstacle;
    askQuestion();
  }

  function updateObstacles() {
    for (let i = Obstacles.length - 1; i >= 0; i--) {
      const o = Obstacles[i];
      const speedFactor = o.type === "trem" ? 13 : 10;
      o.z += speedFactor * Game.speed;

      if (checkObstacleCollision(o)) {
        if (o.type === "trem" || o.type === "barreira") {
          if (!o.asked) {
            o.asked = true;
            triggerQuizForObstacle(o);
          }
          continue;
        }

        Obstacles.splice(i, 1);
        damage();
        continue;
      }

      if (o.z > Game.height + 240) Obstacles.splice(i, 1);
    }
  }

  function updateCoins() {
    for (let i = Coins.length - 1; i >= 0; i--) {
      const c = Coins[i];
      c.z += 10 * Game.speed;

      if (checkItemCollision(c)) {
        Coins.splice(i, 1);
        Game.coins++;
        Game.score += 5;
        continue;
      }

      if (c.z > Game.height + 80) Coins.splice(i, 1);
    }
  }

  function updateGems() {
    for (let i = Gems.length - 1; i >= 0; i--) {
      const g = Gems[i];
      g.z += 10 * Game.speed;

      if (checkItemCollision(g)) {
        Gems.splice(i, 1);
        Game.gems++;
        Game.score += 20;
        continue;
      }

      if (g.z > Game.height + 80) Gems.splice(i, 1);
    }
  }

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
    const toast = $("toast-levelup");
    const text = $("toast-levelup-text");
    if (text) text.textContent = `Nivel ${Game.save.player.level}`;
    if (toast) {
      toast.classList.remove("hidden");
      clearTimeout(showLevelUp._timer);
      showLevelUp._timer = setTimeout(() => toast.classList.add("hidden"), 2200);
    }
  }

  function saveRanking() {
    Game.save.ranking.push({
      name: Game.save.player.name || "Jogador",
      score: Math.floor(Game.score),
      level: Game.save.player.level
    });

    Game.save.ranking.sort((a, b) => b.score - a.score);
    Game.save.ranking = Game.save.ranking.slice(0, 20);
    saveGame();
  }

  function renderRanking() {
    const list = $("ranking-list");
    const empty = $("ranking-empty");
    if (!list) return;

    list.innerHTML = "";
    const ranking = Game.save.ranking || [];

    if (!ranking.length) empty?.classList.remove("hidden");
    else empty?.classList.add("hidden");

    ranking.forEach((p, i) => {
      const tpl = $("template-ranking-row");
      if (!tpl) return;
      const row = tpl.content.firstElementChild.cloneNode(true);
      row.querySelector(".ranking-position").textContent = i + 1;
      row.querySelector(".ranking-name").textContent = p.name;
      row.querySelector(".ranking-level").textContent = "Nv " + p.level;
      row.querySelector(".ranking-score").textContent = p.score;
      list.appendChild(row);
    });

    if ($("podium-1-name")) $("podium-1-name").textContent = ranking[0]?.name || "-";
    if ($("podium-1-score")) $("podium-1-score").textContent = ranking[0]?.score || "0";
    if ($("podium-2-name")) $("podium-2-name").textContent = ranking[1]?.name || "-";
    if ($("podium-2-score")) $("podium-2-score").textContent = ranking[1]?.score || "0";
    if ($("podium-3-name")) $("podium-3-name").textContent = ranking[2]?.name || "-";
    if ($("podium-3-score")) $("podium-3-score").textContent = ranking[2]?.score || "0";
  }

  function getShopButtonState(type, item) {
    if (type === "skins") {
      const owned = Game.save.unlocks.skins.includes(item.id);
      const equipped = Game.save.equipped.skin === item.id;
      if (equipped) return { label: "Equipado", disabled: false };
      if (owned) return { label: "Equipar", disabled: false };
      return { label: `🪙 ${item.price}`, disabled: Game.save.player.coins < item.price };
    }

    if (type === "themes") {
      const owned = Game.save.unlocks.themes.includes(item.id);
      const active = Game.save.settings.theme === item.id;
      if (active) return { label: "Ativo", disabled: false };
      if (owned) return { label: "Usar", disabled: false };
      return { label: `🪙 ${item.price}`, disabled: Game.save.player.coins < item.price };
    }

    if (type === "powerups") {
      const owned = Game.save.unlocks.powerups.includes(item.id);
      const equipped = item.id === "shield"
        ? Game.save.equipped.shield
        : item.id === "speed"
        ? Game.save.equipped.speed
        : Game.save.equipped.magnet;

      if (equipped) return { label: "Ativo", disabled: false };
      if (owned) return { label: "Ativar", disabled: false };
      return { label: `🪙 ${item.price}`, disabled: Game.save.player.coins < item.price };
    }

    return { label: `🪙 ${item.price}`, disabled: false };
  }

  function renderShopCategory(type) {
    const grid = $("shop-grid-" + type);
    const tpl = $("template-shop-card");
    if (!grid || !tpl) return;

    grid.innerHTML = "";

    SHOP[type].forEach((item) => {
      const card = tpl.content.firstElementChild.cloneNode(true);
      card.querySelector(".shop-card-icon").textContent = item.icon;
      card.querySelector(".shop-card-name").textContent = item.name;
      card.querySelector(".shop-card-desc").textContent = item.desc || "";

      const btn = card.querySelector(".shop-card-buy");
      const state = getShopButtonState(type, item);
      btn.innerHTML = `<span>${state.label}</span>`;
      if (state.disabled) btn.classList.add("disabled");
      else btn.classList.remove("disabled");

      btn.addEventListener("click", () => buyItem(type, item));
      grid.appendChild(card);
    });
  }

  function renderShop() {
    renderShopCategory("skins");
    renderShopCategory("powerups");
    renderShopCategory("themes");
  }

  function buyItem(type, item) {
    if (type === "skins") {
      const owned = Game.save.unlocks.skins.includes(item.id);
      if (!owned) {
        if (Game.save.player.coins < item.price) {
          showToast("Moedas insuficientes.");
          return;
        }
        Game.save.player.coins -= item.price;
        Game.save.unlocks.skins.push(item.id);
      }
      Game.save.equipped.skin = item.id;
      saveGame();
      updateMenu();
      renderShop();
      showToast("Skin equipada.");
      return;
    }

    if (type === "themes") {
      const owned = Game.save.unlocks.themes.includes(item.id);
      if (!owned) {
        if (Game.save.player.coins < item.price) {
          showToast("Moedas insuficientes.");
          return;
        }
        Game.save.player.coins -= item.price;
        Game.save.unlocks.themes.push(item.id);
      }
      Game.save.settings.theme = item.id;
      applyTheme();
      saveGame();
      updateMenu();
      renderShop();
      showToast("Tema aplicado.");
      return;
    }

    if (type === "powerups") {
      const owned = Game.save.unlocks.powerups.includes(item.id);
      if (!owned) {
        if (Game.save.player.coins < item.price) {
          showToast("Moedas insuficientes.");
          return;
        }
        Game.save.player.coins -= item.price;
        Game.save.unlocks.powerups.push(item.id);
      }

      if (item.id === "shield") Game.save.equipped.shield = true;
      if (item.id === "speed") Game.save.equipped.speed = !Game.save.equipped.speed;
      if (item.id === "magnet") Game.save.equipped.magnet = !Game.save.equipped.magnet;

      saveGame();
      updateMenu();
      renderShop();
      showToast("Power-up atualizado.");
    }
  }

  function askQuestion() {
    if (!Game.running || Game.over || !Game.questionActive) return;

    const modal = $("modal-quiz");
    const qText = $("quiz-question");
    const optionsWrap = $("quiz-options");
    const feedback = $("quiz-feedback");

    if (!modal || !qText || !optionsWrap || !feedback) return;

    const q = QUIZ[Math.floor(Math.random() * QUIZ.length)];
    qText.textContent = q.question;
    optionsWrap.innerHTML = "";
    feedback.textContent = "";
    Game.currentQuestion = q;

    q.options.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = option;
      btn.addEventListener("click", () => answerQuestion(q, index, btn));
      optionsWrap.appendChild(btn);
    });

    modal.classList.remove("hidden");
  }

  function answerQuestion(question, selectedIndex, selectedButton) {
    const options = $$("#quiz-options .quiz-option");
    options.forEach((btn, i) => {
      btn.disabled = true;
      if (i === question.correct) btn.classList.add("correct");
    });

    const feedback = $("quiz-feedback");

    if (selectedIndex === question.correct) {
      selectedButton.classList.add("correct");
      Game.score += 50;
      Game.coins += 6;
      if (feedback) feedback.textContent = "Resposta correta. " + question.explanation;
    } else {
      selectedButton.classList.add("wrong");
      if (feedback) feedback.textContent = "Resposta incorreta. " + question.explanation;
      damage();
    }

    if (Game.pendingQuizObstacle) {
      const idx = Obstacles.findIndex((o) => o.id === Game.pendingQuizObstacle.id);
      if (idx >= 0) Obstacles.splice(idx, 1);
    }

    updateHUD();

    setTimeout(() => {
      $("modal-quiz")?.classList.add("hidden");
      Game.questionActive = false;
      Game.pendingQuizObstacle = null;

      if (!Game.over) {
        startLoop();
      }
    }, 850);
  }

  function gameOver() {
    Game.running = false;
    Game.over = true;
    cancelAnimationFrame(Game.loopId);

    const earnedXP = Math.floor(Game.score / 18);

    Game.save.player.coins += Game.coins;
    Game.save.player.gems += Game.gems;
    Game.save.stats.runs += 1;

    if (Game.score > Game.save.stats.bestScore) {
      Game.save.stats.bestScore = Math.floor(Game.score);
      $("gameover-newrecord")?.classList.remove("hidden");
    } else {
      $("gameover-newrecord")?.classList.add("hidden");
    }

    addXP(earnedXP);
    saveRanking();
    saveGame();

    if ($("gameover-score")) $("gameover-score").textContent = Math.floor(Game.score);
    if ($("gameover-xp")) $("gameover-xp").textContent = earnedXP;
    if ($("gameover-coins")) $("gameover-coins").textContent = Game.coins;
    if ($("gameover-gems")) $("gameover-gems").textContent = Game.gems;

    $("modal-gameover")?.classList.remove("hidden");
    updateMenu();
  }

  function drawBackground() {
    const ctx = Game.ctx;
    const w = Game.width;
    const h = Game.height;
    const cx = w / 2;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--bg-deep");
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--bg-mid");
    ctx.fillRect(0, h - 180, w, 180);

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 4;

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + LANES[i], 0);
      ctx.lineTo(cx + LANES[i], h - 140);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let y = 60; y < h - 140; y += 55) {
      ctx.fillRect(cx - 180, y, 360, 3);
    }
  }

  function drawPlayer() {
    const ctx = Game.ctx;
    const cx = Game.width / 2;
    const height = Player.sliding ? 56 : Player.height;
    const x = cx + Player.x - Player.width / 2;
    const y = Game.groundY - height + Player.y;

    if (Game.invulnerableTimer > 0 && Math.floor(Game.invulnerableTimer / 4) % 2 === 0) {
      return;
    }

    ctx.fillStyle = Player.color;
    ctx.beginPath();
    ctx.ellipse(x + Player.width / 2, y + height / 2 + 8, 24, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffe0bd";
    ctx.beginPath();
    ctx.arc(x + Player.width / 2, y + 18, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10131f";
    ctx.beginPath();
    ctx.arc(x + Player.width / 2 - 4, y + 16, 1.4, 0, Math.PI * 2);
    ctx.arc(x + Player.width / 2 + 4, y + 16, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#10131f";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x + Player.width / 2, y + 21, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();

    ctx.strokeStyle = Player.color;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 42);
    ctx.lineTo(x + 8, y + 64);
    ctx.moveTo(x + Player.width - 18, y + 42);
    ctx.lineTo(x + Player.width - 8, y + 64);
    ctx.moveTo(x + 24, y + height - 10);
    ctx.lineTo(x + 18, y + height + 18);
    ctx.moveTo(x + Player.width - 24, y + height - 10);
    ctx.lineTo(x + Player.width - 18, y + height + 18);
    ctx.stroke();

    if (Game.save.equipped.shield) {
      ctx.strokeStyle = "#7afcff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + Player.width / 2, y + height / 2, Math.max(Player.width, height) * 0.62, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawBarrier(o, x, y) {
    const ctx = Game.ctx;

    ctx.fillStyle = "#ff9f6e";
    ctx.beginPath();
    ctx.moveTo(x + 10, y + o.h);
    ctx.quadraticCurveTo(x + 6, y + o.h * 0.55, x + 18, y + 10);
    ctx.quadraticCurveTo(x + o.w / 2, y - 10, x + o.w - 18, y + 10);
    ctx.quadraticCurveTo(x + o.w - 6, y + o.h * 0.55, x + o.w - 10, y + o.h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#fff4de";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 18);
    ctx.lineTo(x + o.w - 18, y + o.h - 18);
    ctx.moveTo(x + o.w - 18, y + 18);
    ctx.lineTo(x + 18, y + o.h - 18);
    ctx.stroke();
  }

  function drawHuman(o, x, y) {
    const ctx = Game.ctx;

    ctx.fillStyle = "#ffe0bd";
    ctx.beginPath();
    ctx.arc(x + o.w / 2, y + 16, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4fc3f7";
    ctx.beginPath();
    ctx.ellipse(x + o.w / 2, y + 52, 18, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#223";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + o.w / 2 - 10, y + 44);
    ctx.lineTo(x + 10, y + 66);
    ctx.moveTo(x + o.w / 2 + 10, y + 44);
    ctx.lineTo(x + o.w - 10, y + 66);
    ctx.moveTo(x + o.w / 2 - 6, y + 72);
    ctx.lineTo(x + o.w / 2 - 12, y + o.h - 6);
    ctx.moveTo(x + o.w / 2 + 6, y + 72);
    ctx.lineTo(x + o.w / 2 + 12, y + o.h - 6);
    ctx.stroke();
  }

  function drawTrain(o, x, y) {
    const ctx = Game.ctx;
    const r = 24;

    ctx.fillStyle = "#cc2d6f";
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + o.w - r, y);
    ctx.quadraticCurveTo(x + o.w, y, x + o.w, y + r);
    ctx.lineTo(x + o.w, y + o.h - 30);
    ctx.quadraticCurveTo(x + o.w, y + o.h, x + o.w - 22, y + o.h);
    ctx.lineTo(x + 22, y + o.h);
    ctx.quadraticCurveTo(x, y + o.h, x, y + o.h - 30);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#8ef5ff";
    ctx.beginPath();
    ctx.roundRect(x + 18, y + 18, o.w - 36, 42, 14);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x + 24, y + 72, o.w - 48, 68, 12);
    ctx.fill();

    ctx.fillStyle = "#c3165b";
    ctx.fillRect(x + 30, y + 80, o.w - 60, 12);
    ctx.fillRect(x + 30, y + 100, o.w - 60, 12);

    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(x + 24, y + o.h - 16, 10, 0, Math.PI * 2);
    ctx.arc(x + o.w - 24, y + o.h - 16, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffe600";
    ctx.beginPath();
    ctx.arc(x + o.w / 2, y + o.h - 34, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawObstacle(o) {
    const cx = Game.width / 2;
    const x = cx + LANES[o.lane] - o.w / 2;
    const y = o.z;

    if (o.type === "barreira") {
      drawBarrier(o, x, y);
      return;
    }

    if (o.type === "humano") {
      drawHuman(o, x, y);
      return;
    }

    if (o.type === "trem") {
      drawTrain(o, x, y);
    }
  }

  function drawObstacles() {
    Obstacles.forEach(drawObstacle);
  }

  function drawCoins() {
    const ctx = Game.ctx;
    const cx = Game.width / 2;
    ctx.font = "26px sans-serif";

    Coins.forEach((c) => {
      ctx.fillText("🪙", cx + LANES[c.lane] - 13, c.z);
    });
  }

  function drawGems() {
    const ctx = Game.ctx;
    const cx = Game.width / 2;
    ctx.font = "26px sans-serif";

    Gems.forEach((g) => {
      ctx.fillText("💎", cx + LANES[g.lane] - 13, g.z);
    });
  }

  function draw() {
    drawBackground();
    drawPlayer();
    drawObstacles();
    drawCoins();
    drawGems();
  }

  function update() {
    if (Game.questionActive) return;

    if (Game.invulnerableTimer > 0) Game.invulnerableTimer--;

    updatePlayer();
    spawnObstacle();
    spawnCoin();
    spawnGem();
    updateObstacles();
    updateCoins();
    updateGems();

    Game.score += 0.75 * Game.speed;
    Game.speed = Math.min(Game.speed + 0.00055, 2.8);

    updateHUD();
  }

  function loop(timestamp) {
    if (!Game.running || Game.paused || Game.over || Game.questionActive) return;

    Game.lastTime = timestamp;
    update();
    draw();

    if (Game.running && !Game.paused && !Game.over && !Game.questionActive) {
      Game.loopId = requestAnimationFrame(loop);
    }
  }

  function startLoop() {
    cancelAnimationFrame(Game.loopId);
    Game.lastTime = 0;
    Game.loopId = requestAnimationFrame(loop);
  }

  function bindKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape" && Game.running && !Game.over) {
        if (Game.paused) resumeGame();
        else pauseGame();
        return;
      }

      if (!Game.running || Game.paused || Game.questionActive) return;

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          moveLeft();
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight();
          break;
        case "ArrowUp":
        case "KeyW":
        case "Space":
          e.preventDefault();
          jump();
          break;
        case "ArrowDown":
        case "KeyS":
          slide();
          break;
      }
    });
  }

  function bindTouch() {
    const layer = $("touch-swipe-layer");
    if (!layer) return;

    let sx = 0;
    let sy = 0;

    layer.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
    }, { passive: true });

    layer.addEventListener("touchend", (e) => {
      if (!Game.running || Game.paused || Game.questionActive) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 35) moveRight();
        if (dx < -35) moveLeft();
      } else {
        if (dy < -35) jump();
        if (dy > 35) slide();
      }
    }, { passive: true });
  }

  function bindMenu() {
    $("btn-play")?.addEventListener("click", startGame);
    $("btn-howto")?.addEventListener("click", () => showScreen("howto"));
    $("btn-shop")?.addEventListener("click", () => {
      renderShop();
      showScreen("shop");
    });
    $("btn-settings")?.addEventListener("click", () => showScreen("settings"));
    $("btn-ranking")?.addEventListener("click", () => {
      renderRanking();
      showScreen("ranking");
    });

    $$(".btn-back").forEach((btn) => btn.addEventListener("click", openMenu));

    $("btn-login-confirm")?.addEventListener("click", confirmLogin);
    $("input-login-name")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirmLogin();
    });

    $("btn-edit-name")?.addEventListener("click", () => showScreen("settings"));

    $("btn-pause")?.addEventListener("click", pauseGame);
    $("btn-resume")?.addEventListener("click", resumeGame);
    $("btn-restart")?.addEventListener("click", startGame);
    $("btn-pause-exit")?.addEventListener("click", exitToMenu);

    $("btn-gameover-retry")?.addEventListener("click", startGame);
    $("btn-gameover-menu")?.addEventListener("click", () => {
      $("modal-gameover")?.classList.add("hidden");
      openMenu();
    });

    $$(".shop-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".shop-tab").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });

        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        $$(".shop-panel").forEach((panel) => panel.classList.remove("active"));
        const panel = $("panel-" + tab.dataset.tab);
        if (panel) panel.classList.add("active");
      });
    });

    $("btn-mute")?.addEventListener("click", () => {
      Game.save.settings.muted = !Game.save.settings.muted;
      $("btn-mute").dataset.state = Game.save.settings.muted ? "muted" : "unmuted";
      saveGame();
      showToast(Game.save.settings.muted ? "Audio silenciado." : "Audio ativado.");
    });

    $("btn-fullscreen")?.addEventListener("click", async () => {
      const root = document.documentElement;
      if (!document.fullscreenElement) {
        try {
          await root.requestFullscreen();
        } catch (_) {}
      } else {
        try {
          await document.exitFullscreen();
        } catch (_) {}
      }
    });
  }

  function boot() {
    applyTheme();

    if ($("btn-mute")) {
      $("btn-mute").dataset.state = Game.save.settings.muted ? "muted" : "unmuted";
    }

    bindMenu();
    bindSettings();
    bindKeyboard();
    bindTouch();

    window.addEventListener("resize", resizeCanvas);

    updateMenu();
    renderShop();
    renderRanking();
    startLoading();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
