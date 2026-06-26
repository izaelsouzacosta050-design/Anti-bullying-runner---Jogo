"use strict";

/*======================================================
ANTI-BULLYING RUNNER V2.0 ULTRA
SCRIPT COMPLETO
======================================================*/

const SAVE_KEY = "ABR_SAVE";
const RANK_KEY = "ABR_RANKING";

const Game = {
    version: "2.0 Ultra",
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
    musicVolume: 70,
    sfxVolume: 70
};

/*======================================================
ELEMENTOS
======================================================*/

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

const menuMusic = $("menuMusic");
const gameMusic = $("gameMusic");
const coinSound = $("coinSound");
const jumpSound = $("jumpSound");
const hitSound = $("hitSound");
const powerSound = $("powerSound");
const questionSound = $("questionSound");
const gameOverSound = $("gameOverSound");

/*======================================================
CANVAS
======================================================*/

const canvas = $("gameCanvas");
const ctx = canvas.getContext("2d");

/*======================================================
DADOS
======================================================*/

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
        desc: "Equilibrado e pronto para ajudar.",
        price: 0,
        unlocked: true,
        img: "assets/characters/default.png"
    },
    {
        name: "Luz",
        desc: "Ganha mais XP nas respostas certas.",
        price: 120,
        unlocked: false,
        img: "assets/characters/default.png"
    },
    {
        name: "Escudo",
        desc: "Mais foco e resistência.",
        price: 180,
        unlocked: false,
        img: "assets/characters/default.png"
    },
    {
        name: "Veloz",
        desc: "Mais ágil nas pistas.",
        price: 220,
        unlocked: false,
        img: "assets/characters/default.png"
    }
];

const storeData = {
    personagens: [
        { name: "Luz", price: 120, type: "hero" },
        { name: "Escudo", price: 180, type: "hero" },
        { name: "Veloz", price: 220, type: "hero" }
    ],
    vestes: [
        { name: "Capa Azul", price: 60, type: "cosmetic" },
        { name: "Roupa Dourada", price: 90, type: "cosmetic" }
    ],
    powerups: [
        { name: "Escudo", price: 50, type: "shield" },
        { name: "Jetpack", price: 70, type: "jetpack" },
        { name: "Ímã", price: 65, type: "magnet" }
    ],
    temas: [
        { name: "Tema Azul", price: 40, type: "themeBlue" },
        { name: "Tema Roxo", price: 40, type: "themePurple" },
        { name: "Tema Verde", price: 40, type: "themeGreen" }
    ]
};

/*======================================================
AUDIO
======================================================*/

function setAudioVolume() {
    const music = Game.musicVolume / 100;
    const sfx = Game.sfxVolume / 100;

    if (menuMusic) menuMusic.volume = music;
    if (gameMusic) gameMusic.volume = music;

    [coinSound, jumpSound, hitSound, powerSound, questionSound, gameOverSound].forEach(audio => {
        if (audio) audio.volume = sfx;
    });
}

function safePlay(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

/*======================================================
SAVE / LOAD
======================================================*/

function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
        ...Game,
        heroes
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
                if (found) {
                    found.unlocked = savedHero.unlocked;
                }
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

/*======================================================
INTERFACE
======================================================*/

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
    }, 15);
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

/*======================================================
JOGO
======================================================*/

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateLanes();
    resetPlayerPosition();
}

window.addEventListener("resize", resizeCanvas);

const lanes = [];

function updateLanes() {
    lanes[0] = canvas.width * 0.30;
    lanes[1] = canvas.width * 0.50;
    lanes[2] = canvas.width * 0.70;
}

const player = {
    x: 0,
    y: 0,
    width: 80,
    height: 120,
    lane: 1,
    targetLane: 1,
    speed: 13,
    jump: false,
    slide: false,
    jumpForce: 0,
    gravity: 1,
    ground: 0,
    sprite: new Image(),
    invulnerableTimer: 0,
    magnetTimer: 0,
    jetpackTimer: 0,
    shieldTimer: 0
};

player.sprite.src = "assets/characters/default.png";

function resetPlayerPosition() {
    player.x = lanes[1] || canvas.width * 0.5;
    player.ground = canvas.height - 180;
    player.y = player.ground;
}

resizeCanvas();

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.code] = true;

    if (e.code === "Escape") {
        togglePause();
    }
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
    safePlay(jumpSound);
}

function slide() {
    if (!Game.started || Game.paused) return;
    if (player.slide || player.jump) return;

    player.slide = true;
    slideTimer = 35;
}

function activatePower() {
    if (!Game.started || Game.paused) return;

    if (Game.shield > 0 && player.shieldTimer <= 0) {
        Game.shield--;
        player.shieldTimer = 300;
        player.invulnerableTimer = 300;
        safePlay(powerSound);
        return;
    }

    if (Game.jetpack > 0 && player.jetpackTimer <= 0) {
        Game.jetpack--;
        player.jetpackTimer = 220;
        safePlay(powerSound);
        return;
    }

    if (Game.magnet > 0 && player.magnetTimer <= 0) {
        Game.magnet--;
        player.magnetTimer = 300;
        safePlay(powerSound);
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
    player.x += (lanes[player.targetLane] - player.x) * 0.20;

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
        if (slideTimer <= 0) {
            player.slide = false;
        }
    }

    if (player.invulnerableTimer > 0) player.invulnerableTimer--;
    if (player.magnetTimer > 0) player.magnetTimer--;
    if (player.jetpackTimer > 0) {
        player.jetpackTimer--;
        player.y = Math.max(160, player.y - 4);
    } else if (!player.jump && player.y < player.ground) {
        player.y += 6;
        if (player.y > player.ground) player.y = player.ground;
    }

    if (player.shieldTimer > 0) player.shieldTimer--;
}

function drawPlayer() {
    let h = player.height;

    if (player.slide) h = 70;

    const x = player.x - player.width / 2;
    const y = player.y - h;

    if (player.sprite.complete && player.sprite.naturalWidth > 0) {
        ctx.drawImage(player.sprite, x, y, player.width, h);
    } else {
        ctx.fillStyle = player.invulnerableTimer > 0 ? "#ffd633" : "#0b69ff";
        ctx.fillRect(x, y, player.width, h);
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 15, y + 20, 12, 12);
        ctx.fillRect(x + 50, y + 20, 12, 12);
    }

    if (player.shieldTimer > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,212,255,.9)";
        ctx.lineWidth = 6;
        ctx.arc(player.x, player.y - h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();
    }
}

let backgroundOffset = 0;

function drawBackground() {
    backgroundOffset += gameSpeed;

    ctx.fillStyle = "#7bd2ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 5; i++) {
        const cloudX = (i * 280 + (backgroundOffset * 0.2)) % (canvas.width + 300) - 150;
        const cloudY = 70 + i * 40;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 28, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, cloudY + 5, 24, 0, Math.PI * 2);
        ctx.arc(cloudX - 24, cloudY + 8, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = "#5dbb63";
    ctx.fillRect(0, canvas.height - 140, canvas.width, 140);

    ctx.fillStyle = "#5f5f5f";
    ctx.fillRect(canvas.width * 0.18, 0, canvas.width * 0.64, canvas.height);

    ctx.strokeStyle = "#ffffff88";
    ctx.lineWidth = 8;

    for (let i = 0; i < 18; i++) {
        const y = (backgroundOffset + i * 90) % (canvas.height + 100) - 60;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.50 - 5, y);
        ctx.lineTo(canvas.width * 0.50 + 5, y + 45);
        ctx.stroke();
    }
}

/*======================================================
OBJETOS
======================================================*/

const obstacles = [];
const coins = [];
const gems = [];
const powerUps = [];

let gameSpeed = 8;
let spawnTimer = 0;
let questionCooldown = 500;
let scoreTick = 0;

function randomLane() {
    return Math.floor(Math.random() * 3);
}

function spawnObstacle() {
    obstacles.push({
        lane: randomLane(),
        y: -140,
        width: 70,
        height: Math.random() > 0.5 ? 90 : 60,
        type: Math.random() > 0.5 ? "cone" : "barrier"
    });
}

function spawnCoin() {
    coins.push({
        lane: randomLane(),
        y: -60,
        radius: 18
    });
}

function spawnGem() {
    gems.push({
        lane: randomLane(),
        y: -60,
        radius: 16
    });
}

function spawnPowerUp() {
    const types = ["shield", "jetpack", "magnet"];
    powerUps.push({
        lane: randomLane(),
        y: -60,
        radius: 20,
        type: types[Math.floor(Math.random() * types.length)]
    });
}

function updateObjects() {
    spawnTimer--;

    if (spawnTimer <= 0) {
        const rand = Math.random();

        if (rand < 0.45) spawnObstacle();
        else if (rand < 0.78) spawnCoin();
        else if (rand < 0.90) spawnGem();
        else spawnPowerUp();

        spawnTimer = Math.max(20, 70 - Math.floor(Game.distance / 60));
    }

    const speedBoost = Math.min(8, Math.floor(Game.distance / 120));
    gameSpeed = 8 + speedBoost;

    moveList(obstacles, gameSpeed + 2);
    moveList(coins, gameSpeed);
    moveList(gems, gameSpeed);
    moveList(powerUps, gameSpeed);

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

function drawObstacles() {
    obstacles.forEach(item => {
        const x = laneX(item.lane) - item.width / 2;

        ctx.fillStyle = item.type === "cone" ? "#ff922b" : "#ff4d4d";
        ctx.fillRect(x, item.y, item.width, item.height);

        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 10, item.y + 10, item.width - 20, 8);
    });
}

function drawCoins() {
    coins.forEach(item => {
        const x = laneX(item.lane);
        ctx.beginPath();
        ctx.fillStyle = "#ffd633";
        ctx.arc(x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();

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

/*======================================================
COLISÃO
======================================================*/

function getPlayerRect() {
    const h = player.slide ? 70 : player.height;
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

        if (player.magnetTimer > 0) {
            if (x < player.x) item.lane = Math.min(2, player.targetLane);
            else item.lane = Math.max(0, player.targetLane);
        }

        if (circleRectCollision(x, item.y, item.radius, p)) {
            Game.coins += 1;
            Game.score += 5;
            safePlay(coinSound);
            coins.splice(i, 1);
        }
    }

    for (let i = gems.length - 1; i >= 0; i--) {
        const item = gems[i];
        const x = laneX(item.lane);

        if (circleRectCollision(x, item.y, item.radius, p)) {
            Game.gems += 1;
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
            safePlay(powerSound);
            powerUps.splice(i, 1);
        }
    }
}

function hitObstacle() {
    if (player.invulnerableTimer > 0) return;

    Game.lives -= 1;
    player.invulnerableTimer = 90;
    safePlay(hitSound);

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

/*======================================================
PERGUNTAS
======================================================*/

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
    safePlay(questionSound);
}

function answerQuestion(index) {
    if (!currentQuestion) return;

    if (index === currentQuestion.correct) {
        Game.xp += 10;
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

/*======================================================
HUD / SCORE
======================================================*/

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

    if (questionCooldown > 0) {
        questionCooldown--;
    }
}

/*======================================================
LOJA / HERÓIS
======================================================*/

function renderHeroes() {
    heroesGrid.innerHTML = "";

    heroes.forEach(hero => {
        const card = document.createElement("div");
        card.className = "heroCard";

        card.innerHTML = `
            <img src="${hero.img}" alt="${hero.name}">
            <h3>${hero.name}</h3>
            <p>${hero.desc}</p>
            <p>${hero.unlocked ? "Desbloqueado" : "Preço: " + hero.price + " moedas"}</p>
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
            player.sprite.src = hero.img;
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
            <img src="assets/ui/default-avatar.png" alt="${item.name}">
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
    }

    saveGame();
    updateHUD();
    renderHeroes();
}

/*======================================================
PARTIDA
======================================================*/

function resetRunState() {
    Game.started = true;
    Game.paused = false;
    Game.lives = 3;
    Game.distance = 0;
    Game.score = 0;
    Game.xp = 0;
    Game.gems = 0;
    Game.coins = 0;

    player.targetLane = 1;
    player.jump = false;
    player.slide = false;
    player.jumpForce = 0;
    player.invulnerableTimer = 0;
    player.magnetTimer = 0;
    player.jetpackTimer = 0;
    player.shieldTimer = 0;

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

function startGame() {
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
    finalCoins.innerText = Game.coins;

    saveRanking(Game.record);
    renderRanking();
    saveGame();

    gameOverModal.style.display = "block";
    safePlay(gameOverSound);
}

function goToMenu() {
    Game.started = false;
    Game.paused = false;
    gameContainer.style.display = "none";
    closeAllWindows();
    mainMenu.style.display = "flex";
    saveGame();
}

function togglePause() {
    if (!Game.started) return;
    Game.paused = !Game.paused;
    pauseButton.innerText = Game.paused ? "CONTINUAR" : "PAUSE";
}

/*======================================================
FULLSCREEN
======================================================*/

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

/*======================================================
MOBILE
======================================================*/

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

/*======================================================
EVENTOS
======================================================*/

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
        alert("Anti-Bullying Runner V2.0 Ultra\nProjeto educativo.");
    });
}

if (skinsButton) {
    skinsButton.addEventListener("click", () => {
        alert("Sistema de vestes integrado na loja.");
    });
}

if (missionsButton) {
    missionsButton.addEventListener("click", () => {
        alert("Missões em breve: responda perguntas e colete moedas.");
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
    setAudioVolume();
    saveGame();
});

fullscreenToggle.addEventListener("change", function () {
    setFullscreen(this.checked);
});

playAgainButton.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    gameContainer.style.display = "block";
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

/*======================================================
GAME LOOP
======================================================*/

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

/*======================================================
INICIAR
======================================================*/

window.addEventListener("load", () => {
    loadGame();
    updateInterface();
    loadingAnimation();
    gameLoop();
});
