const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 20;
const TILE_COUNT = 20;
const TILE_SIZE = canvas.width / TILE_COUNT;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameSpeed = 100;
let gameRunning = true;

function generateFood() {
  food = {
    x: Math.floor(Math.random() * TILE_COUNT),
    y: Math.floor(Math.random() * TILE_COUNT)
  };
  for (const segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      generateFood();
      return;
    }
  }
}

function drawSnake() {
  ctx.fillStyle = '#4CAF50';
  for (const segment of snake) {
    ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = '#45a049';
    ctx.strokeRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

function drawFood() {
  ctx.fillStyle = '#f44336';
  ctx.beginPath();
  const centerX = food.x * TILE_SIZE + TILE_SIZE / 2;
  const centerY = food.y * TILE_SIZE + TILE_SIZE / 2;
  const radius = TILE_SIZE / 2;
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawScore() {
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '24px Arial';
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.font = '16px Arial';
  ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 50);
  ctx.textAlign = 'left';
}

function update() {
  if (!gameRunning) return;

  direction = { ...nextDirection };

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 || head.x >= TILE_COUNT ||
    head.y < 0 || head.y >= TILE_COUNT
  ) {
    gameRunning = false;
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameRunning = false;
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood();
    if (gameSpeed > 50) {
      gameSpeed -= 2;
    }
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  drawScore();
  if (!gameRunning) {
    drawGameOver();
  }
}

function gameLoop() {
  update();
  draw();
  if (gameRunning) {
    setTimeout(gameLoop, gameSpeed);
  }
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  nextDirection = { x: 0, y: 0 };
  score = 0;
  gameSpeed = 100;
  gameRunning = true;
  generateFood();
  gameLoop();
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning && e.key.toLowerCase() === 'r') {
    resetGame();
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) nextDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) nextDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) nextDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) nextDirection = { x: 1, y: 0 };
      break;
  }
});

generateFood();
gameLoop();