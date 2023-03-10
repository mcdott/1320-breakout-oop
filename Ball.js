class Ball {
  constructor(x = 0, y = 0, dx = 2, dy = -2, radius = 10, color = 'red') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.PI2 = Math.PI * 2;
  }

  // Moves the ball by updating positional x and y values
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  // Draws the ball on the screen
  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
