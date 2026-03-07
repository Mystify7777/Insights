export class Enemy {
  constructor(x, y, proportionalSize) {
    this.position = {
      x,
      y,
    };
    this.velocity = {
      x: 2,
      y: 0,
    };
    this.width = proportionalSize(40);
    this.height = proportionalSize(40);
    this.patrolDistance = 150;
    this.startX = x;
  }

  draw(ctx) {
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x += this.velocity.x;

    // Simple patrol behavior: reverse direction at patrol boundaries
    if (this.position.x > this.startX + this.patrolDistance) {
      this.velocity.x = -2;
    } else if (this.position.x < this.startX - this.patrolDistance) {
      this.velocity.x = 2;
    }
  }
}
