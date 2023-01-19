// import Brick from './Brick';

// eslint-disable-next-line max-classes-per-file
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const paddleXStart = (canvas.width - paddleWidth) / 2;
const PI2 = Math.PI * 2;
const objectPrimaryColor = '#0095DD';
const gameOverMessage = 'Game Over';
const gameWonMessage = 'You win! Congratulations!';

let rightPressed = false;
let leftPressed = false;
let score = 0;
let brickCounter = 0;
let lives = 3;

class Ball {
  constructor(x = 0, y = 0, dx = 2, dy = -2, radius = 10, color = 'red') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

const bricks = [];

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.status = 1;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    // if (c === 0) {
    //   ctx.fillStyle = 'blue';
    // } else if (c === 1) {
    //   ctx.fillStyle = 'purple';
    // } else if (c === 2) {
    //   ctx.fillStyle = 'pink';
    // } else if (c === 3) {
    //   ctx.fillStyle = 'orange';
    // } else if (c === 4) {
    //   ctx.fillStyle = 'yellow';
    // }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// paddle, score, lives, game

const ball = new Ball(0, 0, 2, -2, ballRadius, objectPrimaryColor);
let paddleX;

function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddleX = paddleXStart;
}

resetBallAndPaddle();

function initializeBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight, objectPrimaryColor);
    }
    for (let r = 0; r < brickRowCount; r += 1) {
      bricks[c][r].points = (r + 1) * 10;
    }
  }
}

initializeBricks();

ctx.fillStyle = 'gray';
ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = objectPrimaryColor;
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for (let r = 0; r < brickRowCount; r += 1) {
    for (let c = 0; c < brickColumnCount; c += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        brick.render(ctx);
      }
    }
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ball.x > brick.x
          && ball.x < brick.x + brickWidth
          && ball.y > brick.y
          && ball.y < brick.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += brick.points;
          brickCounter += 1;
          if (brickCounter === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert(gameWonMessage);
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = objectPrimaryColor;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = objectPrimaryColor;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// function resetBallAndPaddle() {
//   ball.x = canvas.width / 2;
//   ball.y = canvas.height - 30;
//   ball.dx = 2;
//   ball.dy = -2;
//   paddleX = paddleXStart;
// }

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function movePaddle() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function collisionWithCanvasEdgesAndPaddle() {
// Rebound the ball off the left and right sides of the canvas
  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }

  // Rebound the ball off the top of the canvas, hit the paddle, or hit the bottom of the canvas
  if (ball.y + ball.dy < ballRadius) {
    // rebound off the top
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    // Reach the bottom
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      // Rebound off the paddle
      ball.dy = -ball.dy;
    } else {
      // lose one life
      lives -= 1;
      if (!lives) {
        // Game over
        // eslint-disable-next-line no-alert
        alert(gameOverMessage);
        document.location.reload();
      } else {
        // Start over after ball hits the bottom
        resetBallAndPaddle();
      }
    }
  }
}

// ?******
ctx.fillStyle = 'gray';
ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Call helper functions
  drawBricks();
  ball.render(ctx);
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  moveBall();
  movePaddle();
  collisionWithCanvasEdgesAndPaddle();

  requestAnimationFrame(draw);
}

draw();
