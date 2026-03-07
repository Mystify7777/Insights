export class Coin {
  constructor(x, y, proportionalSize) {
    this.position = {
      x,
      y,
    };
    this.size = proportionalSize(18);
    this.collected = false;
  }

  draw(ctx) {
    if (this.collected) {
      return;
    }

    ctx.fillStyle = "#ffcf40";
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size / 2,
      this.position.y + this.size / 2,
      this.size / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  claim() {
    this.collected = true;
  }
}
