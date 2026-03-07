export class Player {
  constructor(proportionalSize) {
    this.position = {
      x: proportionalSize(10),
      y: proportionalSize(400),
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = proportionalSize(40);
    this.height = proportionalSize(40);
  }

  draw(ctx) {
    ctx.fillStyle = "#99c9ff";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  drawWithInvincibility(ctx, isInvincible, invincibilityTimer) {
    // Flash effect during invincibility
    if (isInvincible && Math.floor(invincibilityTimer / 5) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#99c9ff";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
      ctx.restore();
    } else {
      this.draw(ctx);
    }
  }

  update(ctx, canvas, gravity, isInvincible = false, invincibilityTimer = 0) {
    this.drawWithInvincibility(ctx, isInvincible, invincibilityTimer);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = gravity;
      }
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }

    if (this.position.x < this.width) {
      this.position.x = this.width;
    }

    if (this.position.x >= canvas.width - this.width * 2) {
      this.position.x = canvas.width - this.width * 2;
    }
  }
}
