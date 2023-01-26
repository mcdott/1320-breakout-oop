import Sprite from './Sprite.js';

class GameText extends Sprite {
  constructor(text, x, y, color, font = '16px Arial') {
    super(x, y, 0, 0, color);

    this.text = text;
    this.value = 0;
    this.font = font;
  }

  // Draws text on the screen
  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.text} ${this.value}`, this.x, this.y);
  }
}

export default GameText;
