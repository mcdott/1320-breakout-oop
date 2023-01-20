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
