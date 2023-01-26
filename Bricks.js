import Brick from './Brick.js';

class Bricks {
  constructor(options) {
    this.columns = options.columns;
    this.rows = options.rows;
    this.width = options.width;
    this.height = options.height;
    this.padding = options.padding;
    this.offsetLeft = options.offsetLeft;
    this.offsetTop = options.offsetTop;
    this.color = options.color;
    this.bricks = [];

    this.init();
  }

  // Initializes the array of bricks
  init() {
  //   for (let c = 0; c < this.columns; c += 1) {
  //     this.bricks[c] = [];
  //     for (let r = 0; r < this.rows; r += 1) {
  //       const brickX = c * (this.width + this.padding) + this.offsetLeft;
  //       const brickY = r * (this.height + this.padding) + this.offsetTop;
  //       // eslint-disable-next-line max-len
  //       this.bricks[c][r] = new Brick(brickX, brickY, this.width, this.height, this.color);
  //     }
  //   }
  // }

    this.bricks = [];

    // Create the bricks
    for (let i = 0; i < this.columns * this.rows; i += 1) {
      // Calculate the column of the brick (index of the array mod the number of columns)
      const column = i % this.columns;
      // Calculate the row of the brick (round down the result of index/num columns)
      const row = Math.floor(i / this.columns);

      // Calculate the x and y position of the brick
      const brickX = column * (this.width + this.padding) + this.offsetLeft;
      const brickY = row * (this.height + this.padding) + this.offsetTop;

      // Create a new brick and add it to the bricks array
      this.bricks[i] = new Brick(brickX, brickY, this.width, this.height, this.color);
    }
  }

  // Draws the rows of active bricks on the screen
  render(ctx) {
    for (let i = 0; i < this.bricks.length; i += 1) {
      const brick = this.bricks[i];
      if (brick.status === 1) {
        brick.render(ctx);
      }
    }
  }
}

export default Bricks;
