const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 267;  // 400 / 1.5
const canvasHeight = 467; // 700 / 1.5

// Машинка
const carWidth = 40;   // 60 / 1.5
const carHeight = 80;  // 120 / 1.5
let carX = (canvasWidth - carWidth) / 2;
const carY = canvasHeight - carHeight - 13; // пропорционально уменьшена

const laneCount = 3;
const laneWidth = canvasWidth / laneCount;

let obstacles = [];
const obstacleWidth = 40;  // 60 / 1.5
const obstacleHeight = 67; // 100 / 1.5

// Скорости и ускорение
let obstacleSpeed = 2.7;        // 4 / 1.5
const maxObstacleSpeed = 8;     // 12 / 1.5
const speedIncrement = 0.33;    // 0.5 / 1.5

let gameOver = false;
let score = 0;

const carSpeed = 4.7;           // 7 / 1.5

let moveLeftPressed = false;
let moveRightPressed = false;

// Загрузка изображений для препятствий
const treeImg = new Image();
treeImg.src = 'https://i.imgur.com/7bKQv3V.png'; // пример дерева (с прозрачным фоном)

const otherCarImg = new Image();
otherCarImg.src = 'https://i.imgur.com/2z6gXcA.png'; // пример машины (с прозрачным фоном)

// Рисуем машинку с кабиной и колёсами (уменьшенные пропорции)
function drawCar() {
  // Корпус машины
  ctx.fillStyle = '#007700';
  ctx.fillRect(carX, carY + 20, carWidth, carHeight - 20);

  // Кабина
  ctx.fillStyle = '#004400';
  ctx.fillRect(carX + 7, carY, carWidth - 14, 27);

  // Колёса
  ctx.fillStyle = 'black';
  const wheelRadius = 8;
  // Левые колёса
  ctx.beginPath();
  ctx.ellipse(carX + 7, carY + 35, wheelRadius, wheelRadius * 0.7, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(carX + 7, carY + 65, wheelRadius, wheelRadius * 0.7, 0, 0, 2 * Math.PI);
  ctx.fill();
  // Правые колёса
  ctx.beginPath();
  ctx.ellipse(carX + carWidth - 7, carY + 35, wheelRadius, wheelRadius * 0.7, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(carX + carWidth - 7, carY + 65, wheelRadius, wheelRadius * 0.7, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Стёкла кабины
  ctx.fillStyle = '#99ccff';
  ctx.fillRect(carX + 10, carY + 4, carWidth - 20, 20);
}

// Рисуем препятствия (дерево или машина)
function drawObstacles() {
  obstacles.forEach(obs => {
    if (obs.type === 'tree') {
      ctx.drawImage(treeImg, obs.x, obs.y, obstacleWidth, obstacleHeight);
    } else if (obs.type === 'car') {
      ctx.drawImage(otherCarImg, obs.x, obs.y, obstacleWidth, obstacleHeight);
    }
  });
}

function createObstacle() {
  const lane = Math.floor(Math.random() * laneCount);
  const x = lane * laneWidth + (laneWidth - obstacleWidth) / 2;

  // Случайно выбираем тип препятствия
  const type = Math.random() < 0.5 ? 'tree' : 'car';

  obstacles.push({ x, y: -obstacleHeight, type });
}

function updateObstacles() {
  obstacles.forEach(obs => {
    obs.y += obstacleSpeed;
  });

  obstacles = obstacles.filter(obs => {
    if (obs.y > canvasHeight) {
      score++;
      return false;
    }
    return true;
  });
}

function checkCollision() {
  for (const obs of obstacles) {
    if (
      carX < obs.x + obstacleWidth &&
      carX + carWidth > obs.x &&
      carY < obs.y + obstacleHeight &&
      carY + carHeight > obs.y
    ) {
      gameOver = true;
      break;
    }
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '18px Arial';
  ctx.fillText(`Счет: ${score}`, 10, 25);
}

function updateCarPosition() {
  if (moveLeftPressed) {
    carX -= carSpeed;
    if (carX < 0) carX = 0;
  }
  if (moveRightPressed) {
    carX += carSpeed;
    if (carX > canvasWidth - carWidth) carX = canvasWidth - carWidth;
  }
}

function increaseSpeed() {
  if (obstacleSpeed < maxObstacleSpeed) {
    obstacleSpeed += speedIncrement;
  }
}

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Игра окончена!', 30, canvasHeight / 2);
    ctx.font = '22px Arial';
    ctx.fillText(`Ваш счет: ${score}`, 70, canvasHeight / 2 + 40);
    return;
  }

  clearCanvas();
  updateCarPosition();
  drawCar();
  drawObstacles();
  drawScore();
  updateObstacles();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const restartBtn = document.getElementById('restartBtn');

function preventDefault(e) {
  e.preventDefault();
}

// Используем pointer-события для быстрого отклика
leftBtn.addEventListener('pointerdown', (e) => {
  preventDefault(e);
  moveLeftPressed = true;
});
leftBtn.addEventListener('pointerup', (e) => {
  preventDefault(e);
  moveLeftPressed = false;
});
leftBtn.addEventListener('pointercancel', (e) => {
  preventDefault(e);
  moveLeftPressed = false;
});
leftBtn.addEventListener('pointerleave', (e) => {
  preventDefault(e);
  moveLeftPressed = false;
});

rightBtn.addEventListener('pointerdown', (e) => {
  preventDefault(e);
  moveRightPressed = true;
});
rightBtn.addEventListener('pointerup', (e) => {
  preventDefault(e);
  moveRightPressed = false;
});
rightBtn.addEventListener('pointercancel', (e) => {
  preventDefault(e);
  moveRightPressed = false;
});
rightBtn.addEventListener('pointerleave', (e) => {
  preventDefault(e);
  moveRightPressed = false;
});

// Управление с клавиатуры (стрелки)
window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') moveLeftPressed = true;
  if (e.code === 'ArrowRight') moveRightPressed = true;
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') moveLeftPressed = false;
  if (e.code === 'ArrowRight') moveRightPressed = false;
});

function restartGame() {
  gameOver = false;
  score = 0;
  obstacles = [];
  carX = (canvasWidth - carWidth) / 2;
  moveLeftPressed = false;
  moveRightPressed = false;
  obstacleSpeed = 2.7; // сброс скорости при рестарте
  gameLoop();
}

restartBtn.addEventListener('click', () => {
  restartGame();
});

// Создаем препятствия с интервалом
setInterval(() => {
  if (!gameOver) createObstacle();
}, 1400);

// Ускорение каждые 2 секунды
setInterval(() => {
  if (!gameOver) {
    increaseSpeed();
  }
}, 2000);

// Запускаем игру после загрузки изображений
let imagesLoaded = 0;
function onImageLoad() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    gameLoop();
  }
}
treeImg.onload = onImageLoad;
otherCarImg.onload = onImageLoad;
