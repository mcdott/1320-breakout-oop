import Sprite from './Sprite.js';
import Ball from './Ball.js';
import Bricks from './Bricks.js';
import GameText from './GameText.js';

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.ballRadius = 10;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.brickRowCount = 3;
    this.brickColumnCount = 5;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;
    this.paddleXStart = (this.canvas.width - this.paddleWidth) / 2;
    this.paddleYStart = this.canvas.height - this.paddleHeight;
    this.objectPrimaryColor = '#0095DD';
    this.gameOverMessage = 'Game Over';
    this.gameWonMessage = 'You win! Congratulations!';

    this.ball = new Ball(0, 0, 2, -2, this.ballRadius, this.objectPrimaryColor);
    // eslint-disable-next-line max-len
    this.paddle = new Sprite(this.paddleXStart, this.paddleYStart, this.paddleWidth, this.paddleHeight, this.objectPrimaryColor);
    this.bricks = new Bricks({
      columns: this.brickColumnCount,
      rows: this.brickRowCount,
      width: this.brickWidth,
      height: this.brickHeight,
      padding: this.brickPadding,
      offsetLeft: this.brickOffsetLeft,
      offsetTop: this.brickOffsetTop,
      color: this.objectPrimaryColor,
    });

    this.scoreText = new GameText('Score:', 8, 20, this.objectPrimaryColor);
    this.livesText = new GameText('Lives: ', this.canvas.width - 65, 20, this.objectPrimaryColor);

    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();
    this.draw();
  }

  // Set ball, paddle, and lives game staring positions/values
  // Set up listeners for keyboard and mouse events
  setup() {
    this.livesText.value = 3;
    this.resetBallAndPaddle();

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
  }

  resetBallAndPaddle() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.ball.dx = 2;
    this.dy = -2;
    this.paddleX = this.paddleXStart;
  }

  // Determine if the edge of the ball hits the edge of a brick
  rectangleCollision(brick) {
    let collision = false;
    const ballRight = this.ball.x + this.ball.radius;
    const ballLeft = this.ball.x - this.ball.radius;
    const ballTop = this.ball.y - this.ball.radius;
    const ballBottom = this.ball.y + this.ball.radius;
    const brickRight = brick.x + brick.width;
    const brickLeft = brick.x;
    const brickTop = brick.y;
    const brickBottom = brick.y + brick.height;

    if (ballRight > brickLeft && ballLeft < brickRight && ballTop < brickBottom
      && ballBottom > brickTop) {
      collision = true;
    }
    return collision;
  }

  // Display message that player has won when all bricks have been hit
  collisionDetection() {
    for (let i = 0; i < this.bricks.bricks.length; i += 1) {
      const brick = this.bricks.bricks[i];
      if (brick.status === 1) {
        if (this.rectangleCollision(brick)) {
          this.ball.dy = -this.ball.dy;
          brick.status = 0;
          this.scoreText.value += 1;
          if (this.scoreText.value === this.bricks.length) {
            // eslint-disable-next-line no-alert
            alert(this.gameWonMessage);
            document.location.reload();
          }
        }
      }
    }
  }

  movePaddle() {
    if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  // Rebound when the ball hits the edges of the canvas or the paddle
  // Keep track of lives and display message at end of game
  collisionWithCanvasEdgesAndPaddle() {
    // Rebound the ball off the left and right sides of the canvas
    if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius
          || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    // Rebound the this.ball off the top of the canvas, hit the paddle,
    // or hit the bottom of the canvas
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      // rebound off the top
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      // Reach the bottom
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        // Rebound off the paddle
        this.ball.dy = -this.ball.dy;
      } else {
        // lose one life
        this.livesText.value -= 1;
        if (this.livesText.value < 1) {
          // Game over
          // eslint-disable-next-line no-alert
          alert(this.gameOverMessage);
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
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, this.paddleYStart);
    }
  }

  // Game loop
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Call helper functions
    this.bricks.render(this.ctx);
    this.ball.render(this.ctx);
    this.paddle.render(this.ctx);
    this.scoreText.render(this.ctx);
    this.livesText.render(this.ctx);
    this.collisionDetection();
    this.ball.move();
    this.movePaddle();
    this.collisionWithCanvasEdgesAndPaddle();

    // redraw the screen
    requestAnimationFrame(this.draw.bind(this));
  }
}

export default Game;
