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

  init() {
    for (let c = 0; c < this.columns; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = c * (this.width + this.padding) + this.offsetLeft;
        const brickY = r * (this.height + this.padding) + this.offsetTop;
        // eslint-disable-next-line max-len
        this.bricks[c][r] = new Brick(brickX, brickY, this.width, this.height, this.color);
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