import Sprite from './Sprite.js';

class GameText extends Sprite {
  text: string;
  value: number;
  font: string;
  constructor(text: string, x: number, y: number, color: string, font = '16px Arial') {
    super(x, y, 0, 0, color);

    this.text = text;
    this.value = 0;
    this.font = font;
  }

  // Draws text on the screen
  render(ctx: CanvasRenderingContext2D) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.text} ${this.value}`, this.x, this.y);
  }
}

export default GameText;
