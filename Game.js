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
    this.gameWon = false;
    this.gameWonMessage = document.getElementById('game-won-message-overlay');
    this.gameOverMessage = document.getElementById('game-over-message-overlay');
    this.winPlayAgainButton = document.getElementById('win-play-again-button');
    this.losePlayAgainButton = document.getElementById('lose-play-again-button');

    this.ball = new Ball(0, 0, 2, -2, this.ballRadius, this.objectPrimaryColor);
    // eslint-disable-next-line max-len
    this.paddle = new Paddle(this.paddleXStart, this.paddleYStart, this.paddleWidth, this.paddleHeight, this.objectPrimaryColor);
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

    this.scoreText = new GameText('Score:', 8, 20);
    this.livesText = new GameText('Lives: ', this.canvas.width - 65, 20);

    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();
    this.winPlayAgainButton.addEventListener('click', () => {
      this.gameWon = false;
      this.setup();
      this.draw();
      this.gameWonMessage.style.display = 'none';
    });
    this.losePlayAgainButton.addEventListener('click', () => {
      this.gameWon = false;
      this.setup();
      this.draw();
      this.gameOverMessage.style.display = 'none';
    });
    this.draw();
  }

  // Set ball, paddle, brick status, and lives game staring positions/values
  // Set up listeners for keyboard and mouse events
  setup() {
    this.livesText.value = 3;
    this.resetBallAndPaddle();
    this.resetBricksStatus();

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
  }

  resetBricksStatus() {
    for (let c = 0; c < this.columns; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        this.bricks[c][r].status = 1;
      }
    }
  }

  resetBallAndPaddle() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.ball.dx = 2;
    this.dy = -2;
    this.paddleX = this.paddleXStart;
  }

  // Detect when the edge of the ball hits the edge of a brick
  // Display message that player has won when all bricks have been hit
  collisionDetection() {
    if (this.gameWon) return;
    for (let c = 0; c < this.bricks.columns; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        if (brick.status === 1) {
          // Calculate the closest point on the rectangle to the center of the circle
          let closestX = this.ball.x;
          let closestY = this.ball.y;
          if (closestX < brick.x) {
            closestX = brick.x;
          } else if (closestX > brick.x + this.brickWidth) {
            closestX = brick.x + this.brickWidth;
          }
          if (closestY < brick.y) {
            closestY = brick.y;
          } else if (closestY > brick.y + this.brickHeight) {
            closestY = brick.y + this.brickHeight;
          }
          // Check if the distance between the center of the circle and the closest point
          // on the rectangle is less than the radius of the circle
          const distance = Math.sqrt((this.ball.x - closestX) ** 2 + (this.ball.y - closestY) ** 2);
          if (distance < this.ball.radius) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreText.value += 1;
            // If the score is equal to the number of bricks i.e. all brick have been hit,
            // display the game won message
            if (this.scoreText.value === this.bricks.rows * this.bricks.columns) {
              this.gameWon = true;
              this.gameWonMessage.style.display = 'block';
            }
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
        // Rebound off the this.paddle
        this.ball.dy = -this.ball.dy;
      } else {
        // Lose one life
        this.livesText.value -= 1;
        // If there are no remaining lives, display game over message
        if (this.livesText.value < 1) {
          this.gameOverMessage.style.display = 'block';
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
    if (!this.gameWon) {
      requestAnimationFrame(this.draw.bind(this));
    }
  }
}
