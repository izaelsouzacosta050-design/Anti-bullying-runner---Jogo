"use strict";

const SAVE_KEY = "ABR_SAVE";
const RANK_KEY = "ABR_RANKING";

const Game = {
    version: "3.0",
    started: false,
    paused: false,
    language: "pt",
    theme: "themeBlue",
    playerName: "Jogador",
    coins: 0,
    gems: 0,
    xp: 0,
    lives: 3,
    distance: 0,
    record: 0,
    level: 1,
    score: 0,
    shield: 0,
    jetpack: 0,
    magnet: 0,
    selectedHero: "Padrão",
    selectedOutfit: "azul",
    musicVolume: 70,
    sfxVolume: 70,
    totalCoins: 0,
    totalGems: 0
};

const $ = (id) => document.getElementById(id);

const loadingScreen = $("loadingScreen");
const loadingProgress = $("loadingProgress");
const loadingText = $("loadingText");
const mainMenu = $("mainMenu");
const gameContainer = $("gameContainer");
const playerNameInput = $("playerName");
const playButton = $("playButton");
const shopButton = $("shopButton");
const heroesButton = $("heroesButton");
const leaderboardButton = $("leaderboardButton");
const settingsButton = $("settingsButton");
const creditsButton = $("creditsButton");
const skinsButton = $("skinsButton");
const missionsButton = $("missionsButton");
const shopMenu = $("shopMenu");
const heroesMenu = $("heroesMenu");
const settingsMenu = $("settingsMenu");
const leaderboard = $("leaderboard");
const questionModal = $("questionModal");
const gameOverModal = $("gameOver");
const languageSelect = $("language");
const themeSelect = $("theme");
const musicVolumeInput = $("musicVolume");
const sfxVolumeInput = $("sfxVolume");
const fullscreenToggle = $("fullscreenToggle");
const pauseButton = $("pauseButton");
const closeButtons = document.querySelectorAll(".closeWindow");
const answerButtons = document.querySelectorAll(".answer");
const shopItems = $("shopItems");
const heroesGrid = $("heroesGrid");
const leaderboardBody = $("leaderboardBody");
const coinValue = $("coinValue");
const gemValue = $("gemValue");
const xpValue = $("xpValue");
const lifeValue = $("lifeValue");
const distanceValue = $("distanceValue");
const recordValue = $("recordValue");
const shieldCounter = $("shieldCounter");
const jetpackCounter = $("jetpackCounter");
const magnetCounter = $("magnetCounter");
const finalScore = $("finalScore");
const finalDistance = $("finalDistance");
const finalCoins = $("finalCoins");
const playAgainButton = $("playAgain");
const backMenuButton = $("backMenu");
const questionText = $("questionText");

const canvas = $("gameCanvas");
const ctx = canvas.getContext("2d");

const questions = [
    {
        question: "O que fazer ao ver alguém sofrendo bullying?",
        answers: ["Ignorar", "Apoiar e procurar ajuda", "Filmar e postar"],
        correct: 1
    },
    {
        question: "Uma atitude correta é:",
        answers: ["Incentivar apelidos", "Respeitar diferenças", "Espalhar rumores"],
        correct: 1
    },
    {
        question: "Se alguém estiver triste por exclusão social, você deve:",
        answers: ["Zoar mais", "Acolher e incluir", "Fingir que não viu"],
        correct: 1
    },
    {
        question: "Bullying virtual deve ser:",
        answers: ["Compartilhado", "Denunciado", "Escondido"],
        correct: 1
    }
];

const heroes = [
    {
        name: "Padrão",
        desc: "Equilibrado e atento.",
        price: 0,
        unlocked: true,
        body: "#0b69ff",
        hair: "#2b1d16",
        skin: "#f2c29a"
    },
    {
        name: "Luz",
        desc: "Ganha mais XP nas respostas certas.",
        price: 120,
        unlocked: false,
        body: "#ffd633",
        hair: "#5a381e",
        skin: "#f0c6a1"
    },
    {
        name: "Escudo",
        desc: "Mais firme sob pressão.",
        price: 180,
        unlocked: false,
        body: "#34d058",
        hair: "#20140d",
        skin: "#dca982"
    },
    {
        name: "Veloz",
        desc: "Visual leve e ágil.",
        price: 220,
        unlocked: false,
        body: "#845ef7",
        hair: "#442515",
        skin: "#f1bf95"
    }
];

const outfits = [
    { name: "Roupa Azul", price: 0, id: "azul", color: "#0b69ff", unlocked: true },
    { name: "Roupa Dourada", price: 90, id: "dourada", color: "#e0a800", unlocked: false },
    { name: "Roupa Verde", price: 90, id: "verde", color: "#2ca24c", unlocked: false },
    { name: "Roupa Roxa", price: 90, id: "roxa", color: "#6f42c1", unlocked: false }
];

const storeData = {
    personagens: [
        { name: "Luz", price: 120, type: "hero", icon: "🧍" },
        { name: "Escudo", price: 180, type: "hero", icon: "🛡" },
        { name: "Veloz", price: 220, type: "hero", icon: "⚡" }
    ],
    roupas: [
        { name: "Roupa Dourada", price: 90, type: "outfit", id: "dourada", icon: "👕" },
        { name: "Roupa Verde", price: 90, type: "outfit", id: "verde", icon: "🦺" },
        { name: "Roupa Roxa", price: 90, type: "outfit", id: "roxa", icon: "🧥" }
    ],
    powerups: [
        { name: "Escudo", price: 50, type: "shield", icon: "🛡" },
        { name: "Jetpack", price: 70, type: "jetpack", icon: "🚀" },
        { name: "Ímã", price: 65, type: "magnet", icon: "🧲" }
    ],
    temas: [
        { name: "Tema Azul", price: 40, type: "themeBlue", icon: "🔵" },
        { name: "Tema Roxo", price: 40, type: "themePurple", icon: "🟣" },
        { name: "Tema Verde", price: 40, type: "themeGreen", icon: "🟢" },
        { name: "Tema Laranja", price: 40, type: "themeOrange", icon: "🟠" }
    ]
};

const AudioEngine = {
    ctx: null,
    master: null,
    music: null,
    started: false,
    musicNodes: [],

    init() {
        if (this.started) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;

        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.music = this.ctx.createGain();

        this.master.gain.value = 0.9;
        this.music.gain.value = Game.musicVolume / 100;

        this.music.connect(this.master);
        this.master.connect(this.ctx.destination);

        this.started = true;
        this.startMenuMusic();
    },

    async resume() {
        if (!this.started) this.init();
        if (!this.ctx) return;
        if (this.ctx.state === "suspended") {
            await this.ctx.resume();
        }
    },

    setVolumes() {
        if (!this.started || !this.ctx) return;
        this.music.gain.value = Game.musicVolume / 100;
    },

    tone(freq, duration, type = "sine", volume = 0.1) {
        if (!this.started || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0;

        osc.connect(gain);
        gain.connect(this.master);

        const now = this.ctx.currentTime;
        const finalVol = volume * (Game.sfxVolume / 100);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(finalVol, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.start(now);
        osc.stop(now + duration + 0.02);
    },

    beepSequence(notes, baseType = "triangle", volume = 0.05, gap = 0.18) {
        if (!this.started || !this.ctx) return;

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = baseType;
            osc.frequency.value = freq;

            const start = this.ctx.currentTime + i * gap;
            const end = start + 0.14;

            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.linearRampToValueAtTime(volume * (Game.musicVolume / 100), start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, end);

            osc.connect(gain);
            gain.connect(this.music);
            osc.start(start);
            osc.stop(end + 0.02);

            this.musicNodes.push(osc, gain);
        });
    },

    startMenuMusic() {
        if (!this.started) return;
        this.stopMusicLoop();

        this.menuLoop = setInterval(() => {
            this.beepSequence([392, 523, 587, 523], "triangle", 0.035, 0.22);
        }, 1200);
    },

    startGameMusic() {
        if (!this.started) return;
        this.stopMusicLoop();

        this.gameLoop = setInterval(() => {
            this.beepSequence([220, 277, 330, 440, 330, 277], "sawtooth", 0.03, 0.15);
        }, 1000);
    },

    stopMusicLoop() {
        clearInterval(this.menuLoop);
        clearInterval(this.gameLoop);
    },

    coin() { this.tone(880, 0.12, "triangle", 0.09); },
    jump() { this.tone(520, 0.16, "square", 0.08); },
    hit() { this.tone(160, 0.25, "sawtooth", 0.11); },
    power() { this.tone(740, 0.18, "triangle", 0.09); },
    question() { this.tone(620, 0.22, "sine", 0.08); },
    gameOver() {
        this.tone(280, 0.18, "sawtooth", 0.08);
        setTimeout(() => this.tone(220, 0.25, "sawtooth", 0.08), 120);
        setTimeout(() => this.tone(160, 0.35, "sawtooth", 0.08), 260);
    }
};

function setAudioVolume() {
    AudioEngine.setVolumes();
}

function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
        ...Game,
        heroes,
        outfits
    }));
}

function loadGame() {
    const save = localStorage.getItem(SAVE_KEY);
    if (!save) return;

    try {
        const data = JSON.parse(save);
        Object.assign(Game, data);

        if (Array.isArray(data.heroes)) {
            data.heroes.forEach(savedHero => {
                const found = heroes.find(h => h.name === savedHero.name);
                if (found) found.unlocked = savedHero.unlocked;
            });
        }

        if (Array.isArray(data.outfits)) {
            data.outfits.forEach(savedOutfit => {
                const found = outfits.find(o => o.id === savedOutfit.id);
                if (found) found.unlocked = savedOutfit.unlocked;
            });
        }
    } catch (error) {
        console.error("Erro ao carregar save:", error);
    }
}

function getRanking() {
    try {
        return JSON.parse(localStorage.getItem(RANK_KEY)) || [];
    } catch {
        return [];
    }
}

function saveRanking(score) {
    const ranking = getRanking();
    ranking.push({
        name: Game.playerName || "Jogador",
        record: Math.floor(score)
    });
    ranking.sort((a, b) => b.record - a.record);
    localStorage.setItem(RANK_KEY, JSON.stringify(ranking.slice(0, 10)));
}

function renderRanking() {
    const ranking = getRanking();
    leaderboardBody.innerHTML = "";

    if (!ranking.length) {
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="3">Sem registros ainda</td>
            </tr>
        `;
        return;
    }

    ranking.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.record}</td>
        `;
        leaderboardBody.appendChild(tr);
    });
}

function getSelectedHero() {
    return heroes.find(h => h.name === Game.selectedHero) || heroes[0];
}

function getSelectedOutfit() {
    return outfits.find(o => o.id === Game.selectedOutfit) || outfits[0];
}

function updateInterface() {
    playerNameInput.value = Game.playerName;
    document.body.className = Game.theme;
    languageSelect.value = Game.language;
    musicVolumeInput.value = Game.musicVolume;
    sfxVolumeInput.value = Game.sfxVolume;

    const themeMapReverse = {
        themeBlue: "Azul",
        themeDark: "Escuro",
        themeLight: "Claro",
        themeGreen: "Verde",
        themePurple: "Roxo",
        themeOrange: "Laranja"
    };

    themeSelect.value = themeMapReverse[Game.theme] || "Azul";
    setAudioVolume();
    renderHeroes();
    renderShop("personagens");
    renderRanking();
    updateHUD();
}

function loadingAnimation() {
    let value = 0;

    const timer = setInterval(() => {
        value++;
        loadingProgress.style.width = value + "%";
        loadingText.innerText = "Carregando " + value + "%";

        if (value >= 100) {
            clearInterval(timer);
            loadingScreen.style.display = "none";
            mainMenu.style.display = "flex";
        }
    }, 16);
}

function openWindow(windowElement) {
    closeAllWindows();
    Game.paused = true;
    windowElement.style.display = "block";
}

function closeAllWindows() {
    [shopMenu, heroesMenu, settingsMenu, leaderboard, questionModal, gameOverModal].forEach(el => {
        if (el) el.style.display = "none";
    });

    if (Game.started && gameContainer.style.display === "block") {
        Game.paused = false;
    }
}

const lanes = [];
const player = {
    x: 0,
    y: 0,
    width: 68,
    height: 118,
    lane: 1,
    targetLane: 1,
    jump: false,
    slide: false,
    jumpForce: 0,
    gravity: 1,
    ground: 0,
    invulnerableTimer: 0,
    magnetTimer: 0,
    jetpackTimer: 0,
    shieldTimer: 0,
    runCycle: 0
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateLanes();
    resetPlayerPosition();
}

window.addEventListener("resize", resizeCanvas);

function updateLanes() {
    lanes[0] = canvas.width * 0.34;
    lanes[1] = canvas.width * 0.50;
    lanes[2] = canvas.width * 0.66;
}

function resetPlayerPosition() {
    player.x = lanes[1] || canvas.width * 0.5;
    player.ground = canvas.height - 165;
    player.y = player.ground;
}

resizeCanvas();

const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "Escape") togglePause();
});
window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

let slideTimer = 0;

function jump() {
    if (!Game.started || Game.paused) return;
    if (player.jump || player.jetpackTimer > 0) return;

    player.jump = true;
    player.jumpForce = -22;
    AudioEngine.jump();
}

function slide() {
    if (!Game.started || Game.paused) return;
    if (player.slide || player.jump) return;

    player.slide = true;
    slideTimer = 32;
}

function activatePower() {
    if (!Game.started || Game.paused) return;

    if (Game.shield > 0 && player.shieldTimer <= 0) {
        Game.shield--;
        player.shieldTimer = 300;
        player.invulnerableTimer = 300;
        AudioEngine.power();
        return;
    }

    if (Game.jetpack > 0 && player.jetpackTimer <= 0) {
        Game.jetpack--;
        player.jetpackTimer = 220;
        AudioEngine.power();
        return;
    }

    if (Game.magnet > 0 && player.magnetTimer <= 0) {
        Game.magnet--;
        player.magnetTimer = 300;
        AudioEngine.power();
    }
}

function controls() {
    if (keys["ArrowLeft"]) player.targetLane = 0;
    if (keys["ArrowRight"]) player.targetLane = 2;
    if (keys["ArrowUp"]) jump();
    if (keys["ArrowDown"]) slide();
    if (keys["Space"]) activatePower();
}

function updatePlayer() {
    player.x += (lanes[player.targetLane] - player.x) * 0.22;
    player.runCycle += 0.22;

    if (player.jump) {
        player.jumpForce += player.gravity;
        player.y += player.jumpForce;

        if (player.y >= player.ground) {
            player.y = player.ground;
            player.jump = false;
            player.jumpForce = 0;
        }
    }

    if (player.slide) {
        slideTimer--;
        if (slideTimer <= 0) player.slide = false;
    }

    if (player.invulnerableTimer > 0) player.invulnerableTimer--;
    if (player.magnetTimer > 0) player.magnetTimer--;

    if (player.jetpackTimer > 0) {
        player.jetpackTimer--;
        player.y = Math.max(170, player.y - 4);
    } else if (!player.jump && player.y < player.ground) {
        player.y += 7;
        if (player.y > player.ground) player.y = player.ground;
    }

    if (player.shieldTimer > 0) player.shieldTimer--;
}

function roundedRect(x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    if (fill) ctx.fill();
}

function drawPlayer() {
    const hero = getSelectedHero();
    const outfit = getSelectedOutfit();
    const skin = hero.skin;
    const hair = hero.hair;
    const cloth = outfit.color || hero.body;

    const h = player.slide ? 72 : player.height;
    const x = player.x;
    const y = player.y - h;

    const legSwing = Math.sin(player.runCycle * 8) * 8;
    const armSwing = Math.sin(player.runCycle * 8 + Math.PI) * 7;

    if (player.shieldTimer > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,212,255,.9)";
        ctx.lineWidth = 6;
        ctx.arc(player.x, player.y - h / 2, 58, 0, Math.PI * 2);
        ctx.stroke();
    }

    if (player.jetpackTimer > 0) {
        ctx.fillStyle = "#888";
        roundedRect(x - 28, y + 36, 14, 28, 4, true);
        roundedRect(x + 14, y + 36, 14, 28, 4, true);

        ctx.fillStyle = "#ff922b";
        ctx.beginPath();
        ctx.moveTo(x - 21, y + 64);
        ctx.lineTo(x - 12, y + 88 + Math.sin(player.runCycle * 12) * 6);
        ctx.lineTo(x - 5, y + 64);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 21, y + 64);
        ctx.lineTo(x + 12, y + 88 + Math.sin(player.runCycle * 12 + 1) * 6);
        ctx.lineTo(x + 5, y + 64);
        ctx.fill();
    }

    ctx.strokeStyle = skin;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    if (!player.slide) {
        ctx.beginPath();
        ctx.moveTo(x - 12, y + 78);
        ctx.lineTo(x - 14 - legSwing * 0.4, y + 108);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 12, y + 78);
        ctx.lineTo(x + 14 + legSwing * 0.4, y + 108);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 20, y + 42);
        ctx.lineTo(x - 30 - armSwing * 0.45, y + 68);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 20, y + 42);
        ctx.lineTo(x + 30 + armSwing * 0.45, y + 68);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(x - 22, y + 52);
        ctx.lineTo(x - 4, y + 66);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 22, y + 52);
        ctx.lineTo(x + 40, y + 64);
        ctx.stroke();
    }

    ctx.fillStyle = cloth;
    roundedRect(x - 22, y + 28, 44, 58, 12, true);

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(x, y + 16, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.arc(x, y + 11, 17, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(x - 5, y + 15, 1.8, 0, Math.PI * 2);
    ctx.arc(x + 5, y + 15, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#8c5a3c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y + 20, 5, 0.2, 2.9);
    ctx.stroke();

    if (player.invulnerableTimer > 0) {
        ctx.strokeStyle = "rgba(255,214,51,.85)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y + 48, 36, 0, Math.PI * 2);
        ctx.stroke();
    }
}

let backgroundOffset = 0;

function drawBackground() {
    backgroundOffset += gameSpeed;

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, "#72cfff");
    sky.addColorStop(0.55, "#b8ecff");
    sky.addColorStop(1, "#d9f7ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,.95)";
    for (let i = 0; i < 6; i++) {
        const cloudX = (i * 260 + (backgroundOffset * 0.18)) % (canvas.width + 320) - 160;
        const cloudY = 70 + i * 28;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
        ctx.arc(cloudX + 24, cloudY + 6, 20, 0, Math.PI * 2);
        ctx.arc(cloudX - 24, cloudY + 6, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = "#63b95d";
    ctx.fillRect(0, canvas.height - 145, canvas.width, 145);

    ctx.fillStyle = "#7aa36f";
    for (let i = 0; i < 10; i++) {
        const tx = (i * 170 + backgroundOffset * 0.4) % (canvas.width + 120) - 60;
        ctx.beginPath();
        ctx.arc(tx, canvas.height - 155, 26, Math.PI, 0);
        ctx.fill();
    }

    const roadLeft = canvas.width * 0.22;
    const roadWidth = canvas.width * 0.56;

    ctx.fillStyle = "#52565d";
    ctx.fillRect(roadLeft, 0, roadWidth, canvas.height);

    ctx.fillStyle = "#30343a";
    ctx.fillRect(roadLeft + 8, 0, roadWidth - 16, canvas.height);

    ctx.fillStyle = "#d6d6d6";
    ctx.fillRect(roadLeft, 0, 8, canvas.height);
    ctx.fillRect(roadLeft + roadWidth - 8, 0, 8, canvas.height);

    ctx.strokeStyle = "#ffffffaa";
    ctx.lineWidth = 8;

    for (let i = 0; i < 16; i++) {
        const y = (backgroundOffset + i * 100) % (canvas.height + 120) - 60;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.50, y);
        ctx.lineTo(canvas.width * 0.50, y + 52);
        ctx.stroke();
    }

    ctx.strokeStyle = "#ffffff55";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.42, 0);
    ctx.lineTo(canvas.width * 0.42, canvas.height);
    ctx.moveTo(canvas.width * 0.58, 0);
    ctx.lineTo(canvas.width * 0.58, canvas.height);
    ctx.stroke();
}

const obstacles = [];
const coins = [];
const gems = [];
const powerUps = [];

let gameSpeed = 8;
let spawnTimer = 0;
let questionCooldown = 500;
let scoreTick = 0;
let currentRunCoins = 0;
let currentRunGems = 0;

function randomLane() {
    return Math.floor(Math.random() * 3);
}

function spawnObstacle() {
    const types = ["cone", "barrier", "trash"];
    const type = types[Math.floor(Math.random() * types.length)];

    let width = 70;
    let height = 90;

    if (type === "cone") {
        width = 46;
        height = 62;
    } else if (type === "barrier") {
        width = 96;
        height = 58;
    } else if (type === "trash") {
        width = 58;
        height = 74;
    }

    obstacles.push({
        lane: randomLane(),
        y: -140,
        width,
        height,
        type
    });
}

function spawnCoin() {
    coins.push({
        lane: randomLane(),
        y: -60,
        radius: 16
    });
}

function spawnGem() {
    gems.push({
        lane: randomLane(),
        y: -60,
        radius: 15
    });
}

function spawnPowerUp() {
    const types = ["shield", "jetpack", "magnet"];
    powerUps.push({
        lane: randomLane(),
        y: -60,
        radius: 18,
        type: types[Math.floor(Math.random() * types.length)]
    });
}

function updateObjects() {
    spawnTimer--;

    if (spawnTimer <= 0) {
        const rand = Math.random();

        if (rand < 0.42) spawnObstacle();
        else if (rand < 0.76) spawnCoin();
        else if (rand < 0.88) spawnGem();
        else spawnPowerUp();

        spawnTimer = Math.max(18, 64 - Math.floor(Game.distance / 55));
    }

    const speedBoost = Math.min(8, Math.floor(Game.distance / 110));
    gameSpeed = 8 + speedBoost;

    moveList(obstacles, gameSpeed + 2);
    moveList(coins, gameSpeed);
    moveList(gems, gameSpeed);
    moveList(powerUps, gameSpeed);

    if (player.magnetTimer > 0) {
        coins.forEach(item => {
            const targetX = lanes[player.targetLane];
            const itemX = lanes[item.lane];
            if (Math.abs(itemX - targetX) > 8) {
                item.lane = player.targetLane;
            }
            if (item.y > player.y - 180) {
                item.y += 4;
            }
        });
    }

    removeOffscreen(obstacles, 180);
    removeOffscreen(coins, 100);
    removeOffscreen(gems, 100);
    removeOffscreen(powerUps, 100);
}

function moveList(list, speed) {
    list.forEach(item => {
        item.y += speed;
    });
}

function removeOffscreen(list, extra) {
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].y > canvas.height + extra) {
            list.splice(i, 1);
        }
    }
}

function laneX(lane) {
    return lanes[lane];
}

function drawObstacle(item) {
    const x = laneX(item.lane) - item.width / 2;
    const y = item.y;

    if (item.type === "cone") {
        ctx.fillStyle = "#ff7a1a";
        ctx.beginPath();
        ctx.moveTo(x + item.width / 2, y);
        ctx.lineTo(x + item.width, y + item.height);
        ctx.lineTo(x, y + item.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 9, y + 28, item.width - 18, 7);
        ctx.fillRect(x + 14, y + 41, item.width - 28, 6);
    }

    if (item.type === "barrier") {
        ctx.fillStyle = "#d94141";
        roundedRect(x, y + 16, item.width, item.height - 16, 8, true);

        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.translate(x + 16 + i * 18, y + 22);
            ctx.rotate(-0.7);
            ctx.fillRect(0, 0, 10, item.height - 20);
            ctx.restore();
        }

        ctx.fillStyle = "#444";
        ctx.fillRect(x + 8, y + item.height - 8, 12, 8);
        ctx.fillRect(x + item.width - 20, y + item.height - 8, 12, 8);
    }

    if (item.type === "trash") {
        ctx.fillStyle = "#2f475d";
        roundedRect(x + 6, y + 12, item.width - 12, item.height - 12, 10, true);
        ctx.fillStyle = "#415e79";
        ctx.fillRect(x + 2, y + 4, item.width - 4, 14);
        ctx.fillStyle = "#7f9bb1";
        ctx.fillRect(x + 16, y + 24, 4, item.height - 30);
        ctx.fillRect(x + 28, y + 24, 4, item.height - 30);
        ctx.fillRect(x + 40, y + 24, 4, item.height - 30);
    }
}

function drawObstacles() {
    obstacles.forEach(drawObstacle);
}

function drawCoins() {
    coins.forEach(item => {
        const x = laneX(item.lane);
        ctx.beginPath();
        ctx.fillStyle = "#ffd633";
        ctx.arc(x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#b8860b";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#b8860b";
        ctx.font = "bold 18px Poppins";
        ctx.textAlign = "center";
        ctx.fillText("$", x, item.y + 6);
    });
}

function drawGems() {
    gems.forEach(item => {
        const x = laneX(item.lane);
        ctx.fillStyle = "#00d4ff";
        ctx.beginPath();
        ctx.moveTo(x, item.y - item.radius);
        ctx.lineTo(x + item.radius, item.y);
        ctx.lineTo(x, item.y + item.radius);
        ctx.lineTo(x - item.radius, item.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#baf6ff";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function drawPowerUps() {
    powerUps.forEach(item => {
        const x = laneX(item.lane);
        ctx.beginPath();

        if (item.type === "shield") ctx.fillStyle = "#00d4ff";
        if (item.type === "jetpack") ctx.fillStyle = "#845ef7";
        if (item.type === "magnet") ctx.fillStyle = "#ff4d4d";

        ctx.arc(x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Poppins";
        ctx.textAlign = "center";
        const icon = item.type === "shield" ? "S" : item.type === "jetpack" ? "J" : "M";
        ctx.fillText(icon, x, item.y + 6);
    });
}

function getPlayerRect() {
    const h = player.slide ? 72 : player.height;
    return {
        x: player.x - player.width / 2,
        y: player.y - h,
        width: player.width,
        height: h
    };
}

function rectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function circleRectCollision(circleX, circleY, radius, rect) {
    const closestX = Math.max(rect.x, Math.min(circleX, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circleY, rect.y + rect.height));
    const dx = circleX - closestX;
    const dy = circleY - closestY;
    return (dx * dx + dy * dy) < radius * radius;
}

function collectItems() {
    const p = getPlayerRect();

    for (let i = coins.length - 1; i >= 0; i--) {
        const item = coins[i];
        const x = laneX(item.lane);

        if (circleRectCollision(x, item.y, item.radius, p)) {
            Game.coins += 1;
            Game.totalCoins += 1;
            currentRunCoins += 1;
            Game.score += 5;
            AudioEngine.coin();
            coins.splice(i, 1);
        }
    }

    for (let i = gems.length - 1; i >= 0; i--) {
        const item = gems[i];
        const x = laneX(item.lane);

        if (circleRectCollision(x, item.y, item.radius, p)) {
            Game.gems += 1;
            Game.totalGems += 1;
            currentRunGems += 1;
            Game.score += 15;
            Game.xp += 3;
            gems.splice(i, 1);
        }
    }

    for (let i = powerUps.length - 1; i >= 0; i--) {
        const item = powerUps[i];
        const x = laneX(item.lane);

        if (circleRectCollision(x, item.y, item.radius, p)) {
            if (item.type === "shield") Game.shield++;
            if (item.type === "jetpack") Game.jetpack++;
            if (item.type === "magnet") Game.magnet++;

            Game.score += 10;
            AudioEngine.power();
            powerUps.splice(i, 1);
        }
    }
}

function hitObstacle() {
    if (player.invulnerableTimer > 0) return;

    Game.lives -= 1;
    player.invulnerableTimer = 90;
    AudioEngine.hit();

    if (Game.lives <= 0) {
        endGame();
        return;
    }

    maybeOpenQuestion();
}

function checkObstacleCollision() {
    const p = getPlayerRect();

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const item = obstacles[i];
        const rect = {
            x: laneX(item.lane) - item.width / 2,
            y: item.y,
            width: item.width,
            height: item.height
        };

        if (rectCollision(p, rect)) {
            obstacles.splice(i, 1);
            hitObstacle();
            break;
        }
    }
}

let currentQuestion = null;

function maybeOpenQuestion() {
    if (questionCooldown > 0) return;
    openQuestion();
}

function openQuestion() {
    Game.paused = true;
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionText.innerText = currentQuestion.question;

    answerButtons.forEach((btn, index) => {
        btn.innerText = currentQuestion.answers[index];
        btn.onclick = () => answerQuestion(index);
    });

    questionModal.style.display = "block";
    AudioEngine.question();
}

function answerQuestion(index) {
    if (!currentQuestion) return;

    const hero = getSelectedHero();

    if (index === currentQuestion.correct) {
        Game.xp += hero.name === "Luz" ? 16 : 10;
        Game.score += 30;
        Game.lives = Math.min(5, Game.lives + 1);
    } else {
        Game.score = Math.max(0, Game.score - 10);
    }

    questionModal.style.display = "none";
    currentQuestion = null;
    questionCooldown = 600;
    Game.paused = false;
    saveGame();
}

function updateHUD() {
    coinValue.innerText = Game.coins;
    gemValue.innerText = Game.gems;
    xpValue.innerText = Game.xp;
    lifeValue.innerText = Game.lives;
    distanceValue.innerText = Math.floor(Game.distance);
    recordValue.innerText = Math.floor(Game.record);
    shieldCounter.innerText = Game.shield;
    jetpackCounter.innerText = Game.jetpack;
    magnetCounter.innerText = Game.magnet;
}

function updateDistance() {
    Game.distance += 0.45;
    scoreTick += 0.3;

    if (scoreTick >= 1) {
        Game.score += 1;
        scoreTick = 0;
    }

    if (Game.distance > Game.record) {
        Game.record = Game.distance;
    }

    if (questionCooldown > 0) questionCooldown--;
}

function renderHeroes() {
    heroesGrid.innerHTML = "";

    heroes.forEach(hero => {
        const card = document.createElement("div");
        card.className = "heroCard";

        card.innerHTML = `
            <div class="heroArt" style="background:linear-gradient(180deg, ${hero.body}, #163f94)"></div>
            <h3>${hero.name}</h3>
            <p>${hero.desc}</p>
            <p>${hero.unlocked ? "Desbloqueado" : "Preço: " + hero.price + " moedas"}</p>
            <p>${Game.selectedHero === hero.name ? "Selecionado" : ""}</p>
        `;

        card.addEventListener("click", () => {
            if (!hero.unlocked) {
                if (Game.coins >= hero.price) {
                    Game.coins -= hero.price;
                    hero.unlocked = true;
                } else {
                    alert("Moedas insuficientes.");
                    return;
                }
            }

            Game.selectedHero = hero.name;
            saveGame();
            renderHeroes();
            updateHUD();
        });

        heroesGrid.appendChild(card);
    });
}

function renderShop(category) {
    shopItems.innerHTML = "";
    const items = storeData[category] || [];

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "shopCard";

        card.innerHTML = `
            <div class="shopArt">${item.icon || "✨"}</div>
            <h3>${item.name}</h3>
            <p>Preço: ${item.price} moedas</p>
            <button>Comprar</button>
        `;

        const button = card.querySelector("button");
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            buyItem(item);
        });

        shopItems.appendChild(card);
    });
}

function buyItem(item) {
    if (Game.coins < item.price) {
        alert("Moedas insuficientes.");
        return;
    }

    Game.coins -= item.price;

    if (item.type === "shield") Game.shield++;
    else if (item.type === "jetpack") Game.jetpack++;
    else if (item.type === "magnet") Game.magnet++;
    else if (item.type.startsWith("theme")) {
        Game.theme = item.type;
        document.body.className = Game.theme;
    } else if (item.type === "hero") {
        const hero = heroes.find(h => h.name === item.name);
        if (hero) hero.unlocked = true;
    } else if (item.type === "outfit") {
        const outfit = outfits.find(o => o.id === item.id);
        if (outfit) {
            outfit.unlocked = true;
            Game.selectedOutfit = outfit.id;
        }
    }

    saveGame();
    updateHUD();
    renderHeroes();
}

function resetRunState() {
    Game.started = true;
    Game.paused = false;
    Game.lives = 3;
    Game.distance = 0;
    Game.score = 0;
    Game.xp = 0;
    Game.gems = 0;
    Game.coins = Game.coins;
    currentRunCoins = 0;
    currentRunGems = 0;

    player.targetLane = 1;
    player.jump = false;
    player.slide = false;
    player.jumpForce = 0;
    player.invulnerableTimer = 0;
    player.magnetTimer = 0;
    player.jetpackTimer = 0;
    player.shieldTimer = 0;
    player.runCycle = 0;

    obstacles.length = 0;
    coins.length = 0;
    gems.length = 0;
    powerUps.length = 0;

    spawnTimer = 40;
    questionCooldown = 500;
    gameSpeed = 8;
    scoreTick = 0;

    resetPlayerPosition();
    updateHUD();
}

async function startGame() {
    await AudioEngine.resume();
    AudioEngine.startGameMusic();

    mainMenu.style.display = "none";
    closeAllWindows();
    gameContainer.style.display = "block";
    resetRunState();
    saveGame();
}

function endGame() {
    Game.started = false;
    Game.paused = true;

    if (Game.distance >= Game.record) {
        Game.record = Game.distance;
    }

    finalScore.innerText = Math.floor(Game.score);
    finalDistance.innerText = Math.floor(Game.distance);
    finalCoins.innerText = currentRunCoins;

    saveRanking(Game.score);
    renderRanking();
    saveGame();

    gameOverModal.style.display = "block";
    AudioEngine.gameOver();
}

async function goToMenu() {
    Game.started = false;
    Game.paused = false;
    gameContainer.style.display = "none";
    closeAllWindows();
    mainMenu.style.display = "flex";
    await AudioEngine.resume();
    AudioEngine.startMenuMusic();
    saveGame();
}

function togglePause() {
    if (!Game.started) return;
    Game.paused = !Game.paused;
    pauseButton.innerText = Game.paused ? "CONTINUAR" : "PAUSE";
}

async function setFullscreen(enabled) {
    try {
        if (enabled) {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } else if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("Erro fullscreen:", error);
    }
}

document.querySelectorAll("#mobileControls button").forEach(button => {
    button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const action = button.dataset.action;

        if (action === "left") player.targetLane = 0;
        if (action === "right") player.targetLane = 2;
        if (action === "jump") jump();
        if (action === "down") slide();
        if (action === "power") activatePower();
    }, { passive: false });

    button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "left") player.targetLane = 0;
        if (action === "right") player.targetLane = 2;
        if (action === "jump") jump();
        if (action === "down") slide();
        if (action === "power") activatePower();
    });
});

playButton.addEventListener("click", startGame);

shopButton.addEventListener("click", () => {
    renderShop("personagens");
    openWindow(shopMenu);
});

heroesButton.addEventListener("click", () => {
    renderHeroes();
    openWindow(heroesMenu);
});

leaderboardButton.addEventListener("click", () => {
    renderRanking();
    openWindow(leaderboard);
});

settingsButton.addEventListener("click", () => {
    openWindow(settingsMenu);
});

if (creditsButton) {
    creditsButton.addEventListener("click", () => {
        alert("Anti-Bullying Runner\nProjeto educativo interativo.");
    });
}

if (skinsButton) {
    skinsButton.addEventListener("click", () => {
        renderShop("roupas");
        openWindow(shopMenu);
    });
}

if (missionsButton) {
    missionsButton.addEventListener("click", () => {
        alert("Missões em breve: responder desafios, proteger vidas e bater recordes.");
    });
}

pauseButton.addEventListener("click", togglePause);

closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        closeAllWindows();
        saveGame();
    });
});

playerNameInput.addEventListener("input", function () {
    Game.playerName = this.value.trim() || "Jogador";
    saveGame();
});

languageSelect.addEventListener("change", function () {
    Game.language = this.value;
    saveGame();
});

themeSelect.addEventListener("change", function () {
    const map = {
        Azul: "themeBlue",
        Escuro: "themeDark",
        Claro: "themeLight",
        Verde: "themeGreen",
        Roxo: "themePurple",
        Laranja: "themeOrange"
    };

    Game.theme = map[this.value] || "themeBlue";
    document.body.className = Game.theme;
    saveGame();
});

musicVolumeInput.addEventListener("input", function () {
    Game.musicVolume = Number(this.value);
    setAudioVolume();
    saveGame();
});

sfxVolumeInput.addEventListener("input", function () {
    Game.sfxVolume = Number(this.value);
    saveGame();
});

fullscreenToggle.addEventListener("change", function () {
    setFullscreen(this.checked);
});

playAgainButton.addEventListener("click", async () => {
    gameOverModal.style.display = "none";
    gameContainer.style.display = "block";
    await AudioEngine.resume();
    AudioEngine.startGameMusic();
    resetRunState();
});

backMenuButton.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    goToMenu();
});

document.querySelectorAll(".shopCategory").forEach(button => {
    button.addEventListener("click", () => {
        renderShop(button.dataset.category);
    });
});

function gameLoop() {
    drawBackground();

    if (Game.started && !Game.paused) {
        controls();
        updatePlayer();
        updateObjects();
        collectItems();
        checkObstacleCollision();
        updateDistance();
        updateHUD();
    }

    drawCoins();
    drawGems();
    drawPowerUps();
    drawObstacles();
    drawPlayer();

    if (Game.paused && Game.started) {
        ctx.fillStyle = "rgba(0,0,0,.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 42px Poppins";
        ctx.textAlign = "center";
        ctx.fillText("PAUSADO", canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener("load", () => {
    loadGame();
    updateInterface();
    loadingAnimation();
    gameLoop();
});

document.addEventListener("click", () => {
    AudioEngine.resume();
}, { once: true });
