export class MovingPlatform {
  constructor(x, y, proportionalSize, targetX, speed = 2) {
    this.position = {
      x,
      y,
    };
    this.startX = x;
    this.targetX = targetX;
    this.speed = speed;
    this.width = 200;
    this.height = proportionalSize(40);
    this.direction = 1; // 1 for right, -1 for left
  }

  draw(ctx) {
    ctx.fillStyle = "#8b9dc3";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x += this.speed * this.direction;

    // Reverse direction when reaching boundaries
    if (this.direction === 1 && this.position.x >= this.targetX) {
      this.direction = -1;
    } else if (this.direction === -1 && this.position.x <= this.startX) {
      this.direction = 1;
    }
  }

  // Adjust position during world scrolling
  scroll(deltaX) {
    this.position.x += deltaX;
    this.startX += deltaX;
    this.targetX += deltaX;
  }
}
