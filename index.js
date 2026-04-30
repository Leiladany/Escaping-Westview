const SCREEN = {
  MENU: 'menu',
  GAME: 'game',
  GAME_OVER: 'gameOver',
};

const STORAGE_KEY = 'escapingWestviewBestScore';

const ASSETS = {
  players: [
    './images/wanda/wanda-present.png',
    './images/wanda/wanda-50s.png',
  ],
  backgrounds: [
    './images/background/new-back.jpg',
    './images/background/new-back-50.jpg',
  ],
  spells: [
    './images/fireballs/purple.png',
    './images/fireballs/purple-50s.png',
  ],
};

const CONFIG = {
  obstacleCount: 5,
  difficultyInterval: 8,
  phaseDuration: 20,
  maxDeltaTime: 0.05,
  player: {
    minSize: 70,
    maxSize: 125,
    speedMin: 300,
    speedScale: 0.42,
    hitboxScale: 0.34,
  },
  spell: {
    minSize: 64,
    maxSize: 120,
    hitboxScale: 0.34,
  },
  obstacle: {
    baseSpeedMin: 185,
    baseSpeedScale: 0.24,
    speedStepMin: 36,
    speedStepScale: 0.055,
    maxSpeedMin: 560,
    maxSpeedScale: 0.72,
    spawnGapMin: 220,
    spawnGapScale: 0.35,
  },
  backgroundSpeedScale: 0.25,
};

const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const homeButton = document.getElementById('home-button');
const soundButton = document.getElementById('sound-button');
const caughtSoundButton = document.getElementById('caught-sound-button');
const scoreDisplay = document.getElementById('score-display');
const bestScoreDisplay = document.getElementById('best-score-display');
const finalTimeDisplay = document.getElementById('final-time');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const images = {
  players: [],
  backgrounds: [],
  spells: [],
};

const audio = {
  background: new Audio('./sound/back-sound.mp3'),
  lose: new Audio('./sound/evil-l.mp3'),
  muted: false,
};

audio.background.loop = true;
audio.background.volume = 0.12;
audio.lose.volume = 0.16;

const game = {
  width: 1200,
  height: 550,
};

const keyboardControls = new Set();
const pointerControls = new Set();

let state = null;
let frameId = null;
let bestScore = getStoredBestScore();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function loadAssets() {
  const [players, backgrounds, spells] = await Promise.all([
    Promise.all(ASSETS.players.map(loadImage)),
    Promise.all(ASSETS.backgrounds.map(loadImage)),
    Promise.all(ASSETS.spells.map(loadImage)),
  ]);

  images.players = players;
  images.backgrounds = backgrounds;
  images.spells = spells;
}

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.round(bounds.width || 1200));
  const height = Math.max(280, Math.round(bounds.height || 550));
  const pixelRatio = window.devicePixelRatio || 1;

  game.width = width;
  game.height = height;

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function getPlayerSize() {
  if (isMobileViewport()) {
    return clamp(game.height * 0.18, 48, 86);
  }

  return clamp(game.height * 0.23, CONFIG.player.minSize, CONFIG.player.maxSize);
}

function getSpellSize() {
  if (isMobileViewport()) {
    return clamp(game.height * 0.16, 42, 72);
  }

  return clamp(game.height * 0.22, CONFIG.spell.minSize, CONFIG.spell.maxSize);
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 680px)').matches || game.width <= 680;
}

function getPlayerSpeed() {
  return Math.max(CONFIG.player.speedMin, game.width * CONFIG.player.speedScale);
}

function getObstacleSpeed() {
  if (!state) {
    return CONFIG.obstacle.baseSpeedMin;
  }

  const level = Math.floor(state.elapsed / CONFIG.difficultyInterval);
  const baseSpeed = Math.max(
    CONFIG.obstacle.baseSpeedMin,
    game.width * CONFIG.obstacle.baseSpeedScale
  );
  const speedStep = Math.max(
    CONFIG.obstacle.speedStepMin,
    game.width * CONFIG.obstacle.speedStepScale
  );
  const maxSpeed = Math.max(
    CONFIG.obstacle.maxSpeedMin,
    game.width * CONFIG.obstacle.maxSpeedScale
  );

  return Math.min(baseSpeed + level * speedStep, maxSpeed);
}

function getPhaseIndex() {
  const phases = Math.max(images.players.length, 1);
  const elapsed = state ? state.elapsed : 0;
  return Math.floor(elapsed / CONFIG.phaseDuration) % phases;
}

function getRandomSpellY() {
  const size = getSpellSize();
  const padding = Math.max(12, game.height * 0.03);
  return randomBetween(padding, Math.max(padding, game.height - size - padding));
}

function createObstacles() {
  const gap = Math.max(
    CONFIG.obstacle.spawnGapMin,
    game.width * CONFIG.obstacle.spawnGapScale
  );

  return Array.from({ length: CONFIG.obstacleCount }, (_, index) => ({
    x: game.width + gap * index + randomBetween(0, gap * 0.35),
    y: getRandomSpellY(),
    speedOffset: randomBetween(0, Math.max(18, game.width * 0.035)),
  }));
}

function createGameState() {
  const playerSize = getPlayerSize();

  return {
    status: SCREEN.GAME,
    elapsed: 0,
    score: 0,
    lastFrameTime: null,
    backgroundX: 0,
    player: {
      x: clamp(game.width * 0.07, 22, 78),
      y: (game.height - playerSize) / 2,
    },
    obstacles: createObstacles(),
  };
}

function setScreen(screen) {
  menuScreen.hidden = screen !== SCREEN.MENU;
  gameScreen.hidden = screen !== SCREEN.GAME;
  gameOverScreen.hidden = screen !== SCREEN.GAME_OVER;
}

function updateScoreDisplays() {
  const score = state ? state.score : 0;
  scoreDisplay.textContent = `${score}s`;
  bestScoreDisplay.textContent = `${bestScore}s`;
}

function getStoredBestScore() {
  try {
    const storedValue = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(storedValue) ? storedValue : 0;
  } catch {
    return 0;
  }
}

function storeBestScore(score) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // Local storage can be blocked in some browser privacy modes.
  }
}

function clearControls() {
  keyboardControls.clear();
  pointerControls.clear();
  document
    .querySelectorAll('[data-control].is-active')
    .forEach((button) => button.classList.remove('is-active'));
}

function isControlActive(control) {
  return keyboardControls.has(control) || pointerControls.has(control);
}

function updatePlayer(deltaTime) {
  const size = getPlayerSize();
  const playerSpeed = getPlayerSpeed();
  let dx = 0;
  let dy = 0;

  if (isControlActive('left')) {
    dx -= 1;
  }
  if (isControlActive('right')) {
    dx += 1;
  }
  if (isControlActive('up')) {
    dy -= 1;
  }
  if (isControlActive('down')) {
    dy += 1;
  }

  if (dx === 0 && dy === 0) {
    return;
  }

  const distance = Math.hypot(dx, dy);
  state.player.x = clamp(
    state.player.x + (dx / distance) * playerSpeed * deltaTime,
    0,
    game.width - size
  );
  state.player.y = clamp(
    state.player.y + (dy / distance) * playerSpeed * deltaTime,
    0,
    game.height - size
  );
}

function updateObstacles(deltaTime) {
  const speed = getObstacleSpeed();
  const size = getSpellSize();

  state.obstacles.forEach((obstacle) => {
    obstacle.x -= (speed + obstacle.speedOffset) * deltaTime;

    if (obstacle.x < -size) {
      const farthestX = Math.max(game.width, ...state.obstacles.map((item) => item.x));
      const gap = Math.max(
        CONFIG.obstacle.spawnGapMin,
        game.width * CONFIG.obstacle.spawnGapScale
      );

      obstacle.x = farthestX + randomBetween(gap, gap * 1.55);
      obstacle.y = getRandomSpellY();
      obstacle.speedOffset = randomBetween(0, Math.max(18, game.width * 0.035));
    }
  });
}

function hasCollision(obstacle) {
  const playerSize = getPlayerSize();
  const spellSize = getSpellSize();
  const playerRadius = playerSize * CONFIG.player.hitboxScale;
  const spellRadius = spellSize * CONFIG.spell.hitboxScale;
  const playerCenter = {
    x: state.player.x + playerSize / 2,
    y: state.player.y + playerSize / 2,
  };
  const spellCenter = {
    x: obstacle.x + spellSize / 2,
    y: obstacle.y + spellSize / 2,
  };
  const distance = Math.hypot(
    playerCenter.x - spellCenter.x,
    playerCenter.y - spellCenter.y
  );

  return distance <= playerRadius + spellRadius;
}

function update(deltaTime) {
  state.elapsed += deltaTime;
  state.score = Math.floor(state.elapsed);
  state.backgroundX -= getObstacleSpeed() * CONFIG.backgroundSpeedScale * deltaTime;

  updatePlayer(deltaTime);
  updateObstacles(deltaTime);
  updateScoreDisplays();

  if (state.obstacles.some(hasCollision)) {
    endGame();
  }
}

function drawFallbackBackground() {
  const gradient = ctx.createLinearGradient(0, 0, game.width, game.height);
  gradient.addColorStop(0, '#840001');
  gradient.addColorStop(0.5, '#000000');
  gradient.addColorStop(1, '#710AB6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, game.width, game.height);
}

function drawBackground() {
  const background = images.backgrounds[getPhaseIndex()];

  if (!background) {
    drawFallbackBackground();
    return;
  }

  while (state.backgroundX <= -game.width) {
    state.backgroundX += game.width;
  }
  while (state.backgroundX > 0) {
    state.backgroundX -= game.width;
  }

  for (let x = state.backgroundX; x < game.width; x += game.width) {
    ctx.drawImage(background, x, 0, game.width, game.height);
  }
}

function drawPlayer() {
  const size = getPlayerSize();
  const player = images.players[getPhaseIndex()];

  if (player) {
    ctx.drawImage(player, state.player.x, state.player.y, size, size);
    return;
  }

  ctx.fillStyle = '#840001';
  ctx.fillRect(state.player.x, state.player.y, size, size);
}

function drawObstacles() {
  const size = getSpellSize();
  const spell = images.spells[getPhaseIndex()];

  state.obstacles.forEach((obstacle) => {
    if (spell) {
      ctx.drawImage(spell, obstacle.x, obstacle.y, size, size);
      return;
    }

    ctx.beginPath();
    ctx.arc(obstacle.x + size / 2, obstacle.y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#710AB6';
    ctx.fill();
  });
}

function draw() {
  ctx.clearRect(0, 0, game.width, game.height);
  drawBackground();
  drawObstacles();
  drawPlayer();
}

function gameLoop(timestamp) {
  if (!state || state.status !== SCREEN.GAME) {
    return;
  }

  if (state.lastFrameTime === null) {
    state.lastFrameTime = timestamp;
  }

  const deltaTime = Math.min(
    (timestamp - state.lastFrameTime) / 1000,
    CONFIG.maxDeltaTime
  );
  state.lastFrameTime = timestamp;

  update(deltaTime);

  if (state && state.status === SCREEN.GAME) {
    draw();
    frameId = window.requestAnimationFrame(gameLoop);
  }
}

function playSound(sound) {
  if (audio.muted) {
    return;
  }

  const playRequest = sound.play();
  if (playRequest && typeof playRequest.catch === 'function') {
    playRequest.catch(() => {});
  }
}

function startBackgroundAudio() {
  audio.lose.pause();
  audio.lose.currentTime = 0;
  audio.background.loop = true;
  audio.background.currentTime = 0;
  playSound(audio.background);
}

function stopBackgroundAudio() {
  audio.background.pause();
}

function cancelGameLoop() {
  if (frameId !== null) {
    window.cancelAnimationFrame(frameId);
    frameId = null;
  }
}

function startGame() {
  cancelGameLoop();
  clearControls();
  setScreen(SCREEN.GAME);
  resizeCanvas();
  state = createGameState();
  updateScoreDisplays();
  draw();
  startBackgroundAudio();
  frameId = window.requestAnimationFrame(gameLoop);
}

function endGame() {
  if (!state || state.status !== SCREEN.GAME) {
    return;
  }

  state.status = SCREEN.GAME_OVER;
  cancelGameLoop();
  clearControls();
  stopBackgroundAudio();

  if (state.score > bestScore) {
    bestScore = state.score;
    storeBestScore(bestScore);
  }

  finalTimeDisplay.textContent = `${state.score}s`;
  updateScoreDisplays();
  audio.lose.currentTime = 0;
  playSound(audio.lose);
  setScreen(SCREEN.GAME_OVER);
}

function returnHome() {
  cancelGameLoop();
  clearControls();
  stopBackgroundAudio();
  audio.lose.pause();
  audio.lose.currentTime = 0;
  state = null;
  updateScoreDisplays();
  setScreen(SCREEN.MENU);
}

function getControlFromKey(key) {
  const normalizedKey = key.toLowerCase();

  if (normalizedKey === 'a' || key === 'ArrowLeft') {
    return 'left';
  }
  if (normalizedKey === 'd' || key === 'ArrowRight') {
    return 'right';
  }
  if (normalizedKey === 'w' || key === 'ArrowUp') {
    return 'up';
  }
  if (normalizedKey === 's' || key === 'ArrowDown') {
    return 'down';
  }

  return null;
}

function syncSoundButton() {
  [soundButton, caughtSoundButton].forEach((button) => {
    button.textContent = audio.muted ? 'Sound Off' : 'Sound On';
    button.setAttribute('aria-pressed', String(!audio.muted));
  });
}

function toggleSound() {
  audio.muted = !audio.muted;

  if (audio.muted) {
    audio.background.pause();
    audio.lose.pause();
  } else if (state && state.status === SCREEN.GAME) {
    playSound(audio.background);
  } else if (state && state.status === SCREEN.GAME_OVER) {
    playSound(audio.lose);
  }

  syncSoundButton();
}

function handleResize() {
  if (!state || state.status !== SCREEN.GAME) {
    return;
  }

  resizeCanvas();

  const playerSize = getPlayerSize();
  const spellSize = getSpellSize();

  state.player.x = clamp(state.player.x, 0, game.width - playerSize);
  state.player.y = clamp(state.player.y, 0, game.height - playerSize);
  state.obstacles.forEach((obstacle) => {
    obstacle.y = clamp(obstacle.y, 0, game.height - spellSize);
  });

  draw();
}

document.addEventListener('keydown', (event) => {
  const control = getControlFromKey(event.key);

  if (!control || !state || state.status !== SCREEN.GAME) {
    return;
  }

  event.preventDefault();
  keyboardControls.add(control);
});

document.addEventListener('keyup', (event) => {
  const control = getControlFromKey(event.key);

  if (!control) {
    return;
  }

  keyboardControls.delete(control);
});

document.querySelectorAll('[data-control]').forEach((button) => {
  const control = button.dataset.control;

  button.addEventListener('pointerdown', (event) => {
    if (!state || state.status !== SCREEN.GAME) {
      return;
    }

    event.preventDefault();
    pointerControls.add(control);
    button.classList.add('is-active');

    if (typeof button.setPointerCapture === 'function') {
      button.setPointerCapture(event.pointerId);
    }
  });

  const releaseControl = () => {
    pointerControls.delete(control);
    button.classList.remove('is-active');
  };

  button.addEventListener('pointerup', releaseControl);
  button.addEventListener('pointercancel', releaseControl);
  button.addEventListener('lostpointercapture', releaseControl);
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
homeButton.addEventListener('click', returnHome);

soundButton.addEventListener('click', () => {
  toggleSound();
});
caughtSoundButton.addEventListener('click', toggleSound);

window.addEventListener('resize', handleResize);
window.addEventListener('blur', clearControls);

setScreen(SCREEN.MENU);
syncSoundButton();
updateScoreDisplays();

startButton.disabled = true;
startButton.textContent = 'Loading...';

loadAssets().finally(() => {
  startButton.disabled = false;
  startButton.textContent = 'Start Game';
});
