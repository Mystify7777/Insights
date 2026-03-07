export class Particle {
  constructor(x, y, color = "#ffcf40") {
    this.position = {
      x,
      y,
    };
    this.velocity = {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4 - 2,
    };
    this.size = Math.random() * 4 + 2;
    this.color = color;
    this.alpha = 1;
    this.decay = 0.02;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y += 0.15; // gravity effect
    this.alpha -= this.decay;
  }

  isDead() {
    return this.alpha <= 0;
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count = 8, color = "#ffcf40") {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  update() {
    this.particles = this.particles.filter((particle) => {
      particle.update();
      return !particle.isDead();
    });
  }

  draw(ctx) {
    this.particles.forEach((particle) => {
      particle.draw(ctx);
    });
  }
}
