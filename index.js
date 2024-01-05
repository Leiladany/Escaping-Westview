const myCanvas = document.querySelector('canvas');
const ctx = myCanvas.getContext('2d');
myCanvas.style.border = '8px solid #911717';

const backImg = new Image()
backImg.src = './Images/Background/newback.jpg'

const backImg2 = new Image()
backImg2.src = './Images/Background/newback.jpg'

const player = new Image()
player.src = './Images/Wanda/WandaPresent.png'

const spell = new Image()
spell.src = './Images/Fireballs/Purple.png'

let backsound = new Audio('./Sound/backsound.mp3')
backsound.volume = 0.1
let evilL = new Audio('./Sound/evilL.mp3')
evilL.volume = 0.1

let backgroundy = 0
let backgroundy2 = -myCanvas.width

let backgroundx = 0; // Change from backgroundy to backgroundx
let playX = 70;
let playY = 200;
let playSpeed = 2.3;

let isMoveLeft = false;
let isMoveRight = false;
let isMoveUp = false;
let isMoveDown = false;
let isNotMove = true;

let startTime = 0;
let score = 0;
let intervalId = 0;
let spellSpeed = 4;
let lastSpeedIncreaseTime = 0;

let spellMove1 = [];
let spellMove2 = [];
let spellMove3 = [];
let spellMove4 = [];
let spellMove5 = [];

let startBtn = document.getElementById('start-button');
let restartBtn = document.getElementById('restart');
let gameOver = document.querySelector("#gameOver");

function checkCollision(obst1, obst2) {
  const distx = obst1.x - (obst2.x + 23);
  const disty = obst1.y - obst2.y;
  const distance = Math.sqrt(distx * distx + disty * disty);
  return distance < obst1.radius + obst2.radius;
}

function initializeSpells() {
  spellMove1 = [{ x: myCanvas.width, y: getRandomY() }];
  spellMove2 = [{ x: myCanvas.width + 1800, y: getRandomY() }];
  spellMove3 = [{ x: myCanvas.width + 2400, y: getRandomY() }];
  spellMove4 = [{ x: myCanvas.width + 1000, y: getRandomY() }];
  spellMove5 = [{ x: myCanvas.width + 1000, y: getRandomY() }];
}

function getRandomY() {
  return Math.floor(Math.random() * myCanvas.height);
}

function updateScore() {
  score = Math.floor((Date.now() - startTime) / 1000); // Score is in seconds
}

function increaseSpeed() {
  if (score - lastSpeedIncreaseTime >= 10) {
    lastSpeedIncreaseTime = score;
    spellSpeed += 2; // Increase spell speed every 10 seconds
  }
}

function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  // Draw the background multiple times
  ctx.drawImage(backImg, backgroundy, 0, myCanvas.width, myCanvas.height);
  ctx.drawImage(backImg2, backgroundy2, 0, myCanvas.width, myCanvas.height);

  // Move the background
  backgroundx -= 2;
  backgroundy += 2;
  backgroundy2 += 2;

  // Reset background position if it goes beyond the canvas
  if (backgroundx <= -myCanvas.width) {
    backgroundx = 0;
  }

  if (backgroundy > myCanvas.width) {
    backgroundy = -myCanvas.width;
  }

  if (backgroundy2 > myCanvas.width) {
    backgroundy2 = -myCanvas.width;
  }

    // Draw the player
    ctx.drawImage(player, playX, playY, 125, 125);

  updateScore();
  increaseSpeed();

  // Draw and update spells
  for (let i = 0; i < 5; i++) {
    const currentSpellMove = eval(`spellMove${i + 1}`);
    const currentSpell = currentSpellMove[0];

    ctx.drawImage(spell, currentSpell.x, currentSpell.y, 120, 120);
    currentSpell.x -= spellSpeed + i;

    if (currentSpell.x < -200) {
      currentSpellMove[0] = { x: myCanvas.width, y: getRandomY() };
    }

    const obst1 = { radius: 30, x: playX, y: playY };
    const obst2 = { radius: 70, x: currentSpell.x + 23, y: currentSpell.y };

    if (checkCollision(obst1, obst2)) {
      gameOver = true;
    }
  }

  // Handle player movement
  if (isMoveLeft && playX > -10) {
    playX -= playSpeed;
  } else if (isMoveRight && playX < 1000) {
    playX += playSpeed;
  } else if (isNotMove) {
    playX = 0;
  }

  if (isMoveUp && playY > 60) {
    playY -= playSpeed;
  } else if (isMoveDown && playY < 420) {
    playY += playSpeed;
  } else if (isNotMove) {
    playY = 170;
  }

  // Display the score
  ctx.font = "60px Georgia";
  ctx.fillStyle = "#B90F0F";
  ctx.fillText(`Time: ${score}s`, myCanvas.width / 2 - 100, myCanvas.height - 500);

  if (gameOver) {
    cancelAnimationFrame(intervalId);
    lose();
  } else {
    intervalId = requestAnimationFrame(animate);
  }
}

// Move these event listeners outside the animate function
document.addEventListener('keypress', (event) => {
  if (event.key === 'a') {
    isMoveLeft = true;
    isNotMove = false;
  } else if (event.key === 'd') {
    isMoveRight = true;
    isNotMove = false;
  } else if (event.key === 'w') {
    isMoveUp = true;
    isNotMove = false;
  } else if (event.key === 's') {
    isMoveDown = true;
    isNotMove = false;
  }
});

document.addEventListener('keyup', () => {
  isMoveLeft = false;
  isMoveRight = false;
  isMoveUp = false;
  isMoveDown = false;
});

function lose() {
  myCanvas.style.display = "none";
  startBtn.style.display = "none";
  restartBtn.style.display = "";
  document.querySelector('.gameOver').style.display = 'flex';
  backsound.pause();
  evilL.play();

  // Reset player and spells for the next game
  playX = 70;
  playY = 200;
  initializeSpells();

  // Reset game over flag
  gameOver = false;

  // Display the final score
  let Score = document.querySelector(".gameOver h2");
  Score.innerHTML = `Time: ${score}s`;
}

function restartGame() {
  // Reset background position
  backgroundx = 0;
  backgroundy = 0;
  backgroundy2 = -myCanvas.width;

  // Reset other game variables
  playX = 70;
  playY = 200;
  isMoveLeft = false;
  isMoveRight = false;
  isMoveUp = false;
  isMoveDown = false;
  isNotMove = true;
  startTime = Date.now();
  score = 0;
  spellSpeed = 4;
  lastSpeedIncreaseTime = 0;

  // Clear the canvas
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  // Show necessary elements
  myCanvas.style.display = 'block';
  startBtn.style.display = 'none';
  restartBtn.style.display = 'none';
  document.querySelector('.gameOver').style.display = 'none';

  // Start the game again
  animate();
}

function startGame() {
  initializeSpells();
  startTime = Date.now();
  animate();
  backsound.play(loop = true);
  evilL.pause();
  document.querySelector('.menu').style.display = 'none';
  canva.style.display = 'flex';
  document.querySelector('.gameOver').style.display = 'none';
}

window.addEventListener('load', () => {
  canva.style.display = 'none';
  restart.style.display = 'none';
  document.querySelector('.gameOver').style.display = 'none';

  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  document.getElementById('restart').onclick = () => {
    restartGame();
    backsound.play();
    backsound.currentTime = 0;
  };
});