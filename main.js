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
const paddleYStart = canvas.height - paddleHeight;
const PI2 = Math.PI * 2;
const objectPrimaryColor = '#0095DD';
const gameOverMessage = 'Game Over';
const gameWonMessage = 'You win! Congratulations!';

let rightPressed = false;
let leftPressed = false;
let brickCounter = 0;

class Ball {
  constructor(x = 0, y = 0, dx = 2, dy = -2, radius = 10, color = 'red') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

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

class Bricks {
  constructor(columns, rows) {
    this.columns = columns;
    this.rows = rows;
    this.bricks = [];
    this.init();
  }

  init() {
    for (let c = 0; c < this.columns; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        this.bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight, objectPrimaryColor);
      }
      for (let r = 0; r < brickRowCount; r += 1) {
        // this.bricks[c][r].points = (r + 1) * 10;
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.columns; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (brick.status === 1) {
          brick.render(ctx);
        }
      }
    }
  }
}

const bricks = new Bricks(brickColumnCount, brickRowCount);
// TODO score, lives, game

class Paddle {
  constructor(x, y, width, height, color = 'red') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

const paddle = new Paddle(paddleXStart, paddleYStart, paddleWidth, paddleHeight, objectPrimaryColor)

class GameText {
  constructor(text, x, y, color, font = '16px Arial') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.value = 0;
    this.font = font;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.text} ${this.value}`, this.x, this.y);
  }
}

const scoreText = new GameText('Score:', 8, 20);
const livesText = new GameText('Lives: ', canvas.width - 65, 20);
livesText.value = 3;

class Game {
  constructor() {

  }
  
  render(ctx) {
  
  }
}
const ball = new Ball(0, 0, 2, -2, ballRadius, objectPrimaryColor);

function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddleX = paddleXStart;
}

resetBallAndPaddle();

ctx.fillStyle = 'gray';
ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

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
    paddle.moveTo(relativeX - paddle.width / 2, paddleYStart);
  }
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function collisionDetection() {
  for (let c = 0; c < bricks.columns; c += 1) {
    for (let r = 0; r < bricks.rows; r += 1) {
      const brick = bricks.bricks[c][r];
      if (brick.status === 1) {
        if (
          ball.x > brick.x
          && ball.x < brick.x + brickWidth
          && ball.y > brick.y
          && ball.y < brick.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          scoreText.value += 1;
          if (scoreText.value === bricks.rows * bricks.columns) {
            // eslint-disable-next-line no-alert
            alert(gameWonMessage);
            document.location.reload();
          }
        }
      }
    }
  }
}

function movePaddle() {
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.moveBy(7, 0);
  } else if (leftPressed && paddle.x > 0) {
    paddle.moveBy(-7, 0);
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
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      // Rebound off the paddle
      ball.dy = -ball.dy;
    } else {
      // lose one life
      livesText.value -= 1;
      if (livesText.value < 1) {
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
  bricks.render(ctx);
  ball.render(ctx);
  paddle.render(ctx);
  scoreText.render(ctx);
  livesText.render(ctx);
  collisionDetection();
  ball.move();
  movePaddle();
  collisionWithCanvasEdgesAndPaddle();

  requestAnimationFrame(draw);
}

draw();
