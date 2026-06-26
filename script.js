/*======================================================
ANTI-BULLYING RUNNER V2.0 ULTRA
SCRIPT.JS
PARTE 1
======================================================*/

"use strict";

/*======================================================
ESTADO GLOBAL
======================================================*/

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

    level: 1

};

/*======================================================
ELEMENTOS
======================================================*/

const loadingScreen = document.getElementById("loadingScreen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingText = document.getElementById("loadingText");

const mainMenu = document.getElementById("mainMenu");
const gameContainer = document.getElementById("gameContainer");

const playerNameInput = document.getElementById("playerName");

const playButton = document.getElementById("playButton");
const shopButton = document.getElementById("shopButton");
const heroesButton = document.getElementById("heroesButton");
const leaderboardButton = document.getElementById("leaderboardButton");
const settingsButton = document.getElementById("settingsButton");

const shopMenu = document.getElementById("shopMenu");
const heroesMenu = document.getElementById("heroesMenu");
const settingsMenu = document.getElementById("settingsMenu");
const leaderboard = document.getElementById("leaderboard");

const languageSelect = document.getElementById("language");
const themeSelect = document.getElementById("theme");

const closeButtons = document.querySelectorAll(".closeWindow");

/*======================================================
SALVAR
======================================================*/

function saveGame() {

    localStorage.setItem(

        "ABR_SAVE",

        JSON.stringify(Game)

    );

}

/*======================================================
CARREGAR
======================================================*/

function loadGame() {

    const save = localStorage.getItem("ABR_SAVE");

    if (!save) return;

    const data = JSON.parse(save);

    Object.assign(Game, data);

}

/*======================================================
ATUALIZAR CAMPOS
======================================================*/

function updateInterface() {

    playerNameInput.value = Game.playerName;

    document.body.className = Game.theme;

}

/*======================================================
LOADING
======================================================*/

function loadingAnimation() {

    let value = 0;

    const timer = setInterval(() => {

        value++;

        loadingProgress.style.width = value + "%";

        loadingText.innerText =

            "Carregando " + value + "%";

        if (value >= 100) {

            clearInterval(timer);

            loadingScreen.style.display = "none";

            mainMenu.style.display = "flex";

        }

    }, 20);

}

/*======================================================
ABRIR JANELA
======================================================*/

function openWindow(windowElement) {

    windowElement.style.display = "block";

}

/*======================================================
FECHAR JANELAS
======================================================*/

function closeAllWindows() {

    shopMenu.style.display = "none";

    heroesMenu.style.display = "none";

    settingsMenu.style.display = "none";

    leaderboard.style.display = "none";

}

/*======================================================
MENU
======================================================*/

playButton.onclick = () => {

    mainMenu.style.display = "none";

    gameContainer.style.display = "block";

    Game.started = true;

    saveGame();

    console.log("Iniciar corrida");

};

shopButton.onclick = () => {

    closeAllWindows();

    openWindow(shopMenu);

};

heroesButton.onclick = () => {

    closeAllWindows();

    openWindow(heroesMenu);

};

leaderboardButton.onclick = () => {

    closeAllWindows();

    openWindow(leaderboard);

};

settingsButton.onclick = () => {

    closeAllWindows();

    openWindow(settingsMenu);

};

/*======================================================
BOTÕES FECHAR
======================================================*/

closeButtons.forEach(button => {

    button.onclick = closeAllWindows;

});

/*======================================================
NOME
======================================================*/

playerNameInput.addEventListener(

    "input",

    function () {

        Game.playerName = this.value.trim() || "Jogador";

        saveGame();

    }

);

/*======================================================
IDIOMA
======================================================*/

languageSelect.addEventListener(

    "change",

    function () {

        Game.language = this.value;

        saveGame();

        console.log("Idioma:", Game.language);

    }

);

/*======================================================
TEMA
======================================================*/

themeSelect.addEventListener(

    "change",

    function () {

        const map = {

            "Azul": "themeBlue",

            "Escuro": "themeDark",

            "Claro": "themeLight",

            "Verde": "themeGreen",

            "Roxo": "themePurple",

            "Laranja": "themeOrange"

        };

        Game.theme = map[this.value] || "themeBlue";

        document.body.className = Game.theme;

        saveGame();

    }

);

/*======================================================
INICIAR
======================================================*/

window.addEventListener(

    "load",

    () => {

        loadGame();

        updateInterface();

        loadingAnimation();

    }

);
/*======================================================
SCRIPT.JS
PARTE 2
ENGINE BÁSICA
======================================================*/

/*======================================================
CANVAS
======================================================*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/*======================================================
HUD
======================================================*/

const coinValue = document.getElementById("coinValue");
const gemValue = document.getElementById("gemValue");
const xpValue = document.getElementById("xpValue");
const lifeValue = document.getElementById("lifeValue");
const distanceValue = document.getElementById("distanceValue");
const recordValue = document.getElementById("recordValue");

/*======================================================
TAMANHO
======================================================*/

function resizeCanvas(){

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

}

window.addEventListener("resize",resizeCanvas);

resizeCanvas();

/*======================================================
PISTAS
======================================================*/

const lanes=[];

function updateLanes(){

    lanes[0]=canvas.width*0.30;
    lanes[1]=canvas.width*0.50;
    lanes[2]=canvas.width*0.70;

}

updateLanes();

window.addEventListener("resize",updateLanes);

/*======================================================
JOGADOR
======================================================*/

const player={

x:0,

y:0,

width:80,

height:120,

lane:1,

targetLane:1,

speed:13,

jump:false,

slide:false,

jumpForce:0,

gravity:1,

ground:0,

sprite:new Image()

};

player.sprite.src="assets/characters/default.png";

/*======================================================
POSIÇÃO
======================================================*/

function resetPlayer(){

player.x=lanes[1];

player.ground=canvas.height-180;

player.y=player.ground;

}

resetPlayer();

/*======================================================
CONTROLES
======================================================*/

const keys={};

window.addEventListener("keydown",(e)=>{

keys[e.code]=true;

});

window.addEventListener("keyup",(e)=>{

keys[e.code]=false;

});

/*======================================================
MOVIMENTO
======================================================*/

function controls(){

if(keys["ArrowLeft"]){

player.targetLane=0;

}

if(keys["ArrowRight"]){

player.targetLane=2;

}

if(keys["ArrowUp"]){

jump();

}

if(keys["ArrowDown"]){

slide();

}

if(keys["Space"]){

activatePower();

}

}

/*======================================================
PULO
======================================================*/

function jump(){

if(player.jump) return;

player.jump=true;

player.jumpForce=-22;

}

/*======================================================
DESLIZAR
======================================================*/

let slideTimer=0;

function slide(){

if(player.slide) return;

player.slide=true;

slideTimer=35;

}

/*======================================================
PODER
======================================================*/

function activatePower(){

console.log("Power");

}

/*======================================================
ATUALIZA JOGADOR
======================================================*/

function updatePlayer(){

player.x+=(lanes[player.targetLane]-player.x)*0.20;

if(player.jump){

player.jumpForce+=player.gravity;

player.y+=player.jumpForce;

if(player.y>=player.ground){

player.y=player.ground;

player.jump=false;

player.jumpForce=0;

}

}

if(player.slide){

slideTimer--;

if(slideTimer<=0){

player.slide=false;

}

}

}

/*======================================================
DESENHAR
======================================================*/

function drawPlayer(){

let h=player.height;

if(player.slide){

h=70;

}

ctx.drawImage(

player.sprite,

player.x-player.width/2,

player.y-h,

player.width,

h

);

}

/*======================================================
FUNDO
======================================================*/

let backgroundOffset=0;

function drawBackground(){

backgroundOffset+=6;

ctx.fillStyle="#7bd2ff";

ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="#8fd66d";

ctx.fillRect(0,canvas.height-120,canvas.width,120);

for(let i=0;i<80;i++){

ctx.fillStyle="#666";

ctx.fillRect(

0,

(backgroundOffset+i*100)%canvas.height,

canvas.width,

6

);

}

}

/*======================================================
HUD
======================================================*/

function updateHUD(){

coinValue.innerText=Game.coins;

gemValue.innerText=Game.gems;

xpValue.innerText=Game.xp;

lifeValue.innerText=Game.lives;

distanceValue.innerText=Math.floor(Game.distance);

recordValue.innerText=Math.floor(Game.record);

}

/*======================================================
DISTÂNCIA
======================================================*/

function updateDistance(){

Game.distance+=0.45;

if(Game.distance>Game.record){

Game.record=Game.distance;

}

}

/*======================================================
LOOP
======================================================*/

function gameLoop(){

if(Game.started){

controls();

updatePlayer();

updateDistance();

updateHUD();

drawBackground();

drawPlayer();

}

requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);
