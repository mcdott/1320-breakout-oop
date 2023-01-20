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

class Game {
  constructor() {
    this.ball = new Ball(0, 0, 2, -2, ballRadius, objectPrimaryColor);
    // eslint-disable-next-line max-len
    this.paddle = new Paddle(paddleXStart, paddleYStart, paddleWidth, paddleHeight, objectPrimaryColor);
    this.bricks = new Bricks(brickColumnCount, brickRowCount);
    this.scoreText = new GameText('Score:', 8, 20);
    this.livesText = new GameText('Lives: ', canvas.width - 65, 20);

    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();
    this.draw();
  }

  setup() {
    this.livesText.value = 3;
    this.resetBallAndPaddle();

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
  }

  resetBallAndPaddle() {
    this.ball.x = canvas.width / 2;
    this.ball.y = canvas.height - 30;
    this.ball.dx = 2;
    this.dy = -2;
    this.paddleX = paddleXStart;
  }

  collisionDetection() {
    for (let c = 0; c < this.bricks.columns; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        if (brick.status === 1) {
          if (
            this.ball.x > brick.x
            && this.ball.x < brick.x + brickWidth
            && this.ball.y > brick.y
            && this.ball.y < brick.y + brickHeight
          ) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreText.value += 1;
            if (this.scoreText.value === this.bricks.rows * this.bricks.columns) {
              // eslint-disable-next-line no-alert
              alert(gameWonMessage);
              document.location.reload();
            }
          }
        }
      }
    }
  }

  movePaddle() {
    if (this.rightPressed && this.paddle.x < canvas.width - this.paddle.width) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  collisionWithCanvasEdgesAndPaddle() {
    // Rebound the ball off the left and right sides of the canvas
    if (this.ball.x + this.ball.dx > canvas.width - this.ball.radius
        || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    // Rebound the this.ball off the top of the canvas, hit the paddle,
    // or hit the bottom of the canvas
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      // rebound off the top
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > canvas.height - this.ball.radius) {
      // Reach the bottom
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        // Rebound off the this.paddle
        this.ball.dy = -this.ball.dy;
      } else {
        // lose one life
        this.livesText.value -= 1;
        if (this.livesText.value < 1) {
          // Game over
          // eslint-disable-next-line no-alert
          alert(gameOverMessage);
          document.location.reload();
        } else {
          // Start over after this.ball hits the bottom
          this.resetBallAndPaddle();
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, paddleYStart);
    }
  }

  // Game loop
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Call helper functions
    this.bricks.render(ctx);
    this.ball.render(ctx);
    this.paddle.render(ctx);
    this.scoreText.render(ctx);
    this.livesText.render(ctx);
    this.collisionDetection();
    this.ball.move();
    this.movePaddle();
    this.collisionWithCanvasEdgesAndPaddle();

    // redraw the screen
    requestAnimationFrame(this.draw.bind(this));
  }
}

const game = new Game();
