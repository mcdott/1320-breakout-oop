class Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(x = 0, y = 0, width = 10, height = 0, color = 'red') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  // Moves the sprite by updating positional x and y values
  moveBy(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  // Moves the sprite to an (x, y) position
  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Draws the sprite on the screen
  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Sprite;
