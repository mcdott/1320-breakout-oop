import Sprite from './Sprite.js';

class Ball extends Sprite {
  constructor(x = 0, y = 0, dx = 2, dy = -1, radius = 10, color = 'red') {
    super(x, y, radius * 2, radius * 2, color); // radius * 2 is the circle "width" and "height"
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.PI2 = Math.PI * 2;
  }

  // Moves the ball by updating positional x and y values
  move() {
    this.moveBy(this.dx, this.dy);
  }

  // Draws the ball on the screen (overides render method in Sprite)
  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Ball;
