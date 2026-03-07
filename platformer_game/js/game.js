import { GRAVITY, GameState } from "./config.js";
import { Player } from "./entities/player.js";
import { Platform } from "./entities/platform.js";
import { CheckPoint } from "./entities/checkpoint.js";
import { Coin } from "./entities/coin.js";
import { Enemy } from "./entities/enemy.js";
import { MovingPlatform } from "./entities/movingPlatform.js";
import { ParticleSystem } from "./particleSystem.js";
import { loadLevelData } from "./levels.js";

export class Game {
  constructor({
    canvas,
    startScreen,
    checkpointScreen,
    checkpointMessage,
    hud,
    hudState,
    hudScore,
    hudLevel,
    hudCoins,
    hudHealth,
    pauseBtn,
    gameControls,
    gameOverScreen,
    gameOverMessage,
    soundManager,
  }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.startScreen = startScreen;
    this.checkpointScreen = checkpointScreen;
    this.checkpointMessage = checkpointMessage;
    this.hud = hud;
    this.hudState = hudState;
    this.hudScore = hudScore;
    this.hudLevel = hudLevel;
    this.hudCoins = hudCoins;
    this.hudHealth = hudHealth;
    this.pauseBtn = pauseBtn;
    this.gameOverScreen = gameOverScreen;
    this.gameOverMessage = gameOverMessage;
    this.gameControls = gameControls;
    this.soundManager = soundManager;

    this.gravity = GRAVITY;
    this.currentState = GameState.START;

    this.animationFrameId = null;
    this.score = 0;
    this.currentLevelIndex = 0;
    this.levels = [];

    this.player = null;
    this.platforms = [];
    this.movingPlatforms = [];
    this.checkpoints = [];
    this.coins = [];
    this.enemies = [];
    this.coinsCollected = 0;
    this.totalCoinsInLevel = 0;
    this.health = 3;
    this.maxHealth = 3;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.particleSystem = new ParticleSystem();

    this.keys = {
      rightKey: { pressed: false },
      leftKey: { pressed: false },
    };

    this.isCheckpointCollisionDetectionActive = true;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.animate = this.animate.bind(this);
  }

  proportionalSize(size) {
    return window.innerHeight < 500
      ? Math.ceil((size / 500) * window.innerHeight)
      : size;
  }

  updateHud() {
    this.hudState.textContent = `State: ${this.currentState}`;
    this.hudScore.textContent = `Score: ${this.score}`;
    this.hudLevel.textContent = `Level: ${this.currentLevelIndex + 1}`;
    this.hudCoins.textContent = `Coins: ${this.coinsCollected}/${this.totalCoinsInLevel}`;
    this.hudHealth.textContent = `Health: ${this.health}`;
  }

  setGameState(nextState) {
    this.currentState = nextState;
    this.pauseBtn.textContent =
      this.currentState === GameState.PAUSED ? "Resume" : "Pause";
    this.updateHud();
  }

  getActiveLevel() {
    return this.levels[this.currentLevelIndex];
  }

  async loadLevels() {
    this.levels = await loadLevelData();
  }

  buildWorld() {
    const activeLevel = this.getActiveLevel();

    this.player = new Player(this.proportionalSize.bind(this));

    this.platforms = activeLevel.platforms.map(
      (platform) =>
        new Platform(
          platform.x,
          this.proportionalSize(platform.y),
          this.proportionalSize.bind(this)
        )
    );

    this.movingPlatforms = (activeLevel.movingPlatforms || []).map(
      (mp) =>
        new MovingPlatform(
          mp.x,
          this.proportionalSize(mp.y),
          this.proportionalSize.bind(this),
          mp.targetX,
          mp.speed
        )
    );

    this.checkpoints = activeLevel.checkpoints.map(
      (checkpoint) =>
        new CheckPoint(
          checkpoint.x,
          this.proportionalSize(checkpoint.y),
          this.proportionalSize.bind(this)
        )
    );

    this.coins = (activeLevel.coins || []).map(
      (coin) =>
        new Coin(
          coin.x,
          this.proportionalSize(coin.y),
          this.proportionalSize.bind(this)
        )
    );
    this.coinsCollected = 0;
    this.totalCoinsInLevel = this.coins.length;

    this.enemies = (activeLevel.enemies || []).map(
      (enemy) =>
        new Enemy(
          enemy.x,
          this.proportionalSize(enemy.y),
          this.proportionalSize.bind(this)
        )
    );

    this.isCheckpointCollisionDetectionActive = true;
    this.keys.leftKey.pressed = false;
    this.keys.rightKey.pressed = false;
    this.checkpointScreen.style.display = "none";

    this.updateHud();
  }

  drawScene() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.platforms.forEach((platform) => {
      platform.draw(this.ctx);
    });

    this.movingPlatforms.forEach((platform) => {
      platform.draw(this.ctx);
    });

    this.checkpoints.forEach((checkpoint) => {
      checkpoint.draw(this.ctx);
    });

    this.coins.forEach((coin) => {
      coin.draw(this.ctx);
    });

    this.enemies.forEach((enemy) => {
      enemy.draw(this.ctx);
    });

    this.particleSystem.draw(this.ctx);
  }

  handleCoinCollisions() {
    this.coins.forEach((coin) => {
      if (coin.collected) {
        return;
      }

      const horizontalOverlap =
        this.player.position.x < coin.position.x + coin.size &&
        this.player.position.x + this.player.width > coin.position.x;
      const verticalOverlap =
        this.player.position.y < coin.position.y + coin.size &&
        this.player.position.y + this.player.height > coin.position.y;

      if (horizontalOverlap && verticalOverlap) {
        coin.claim();
        this.coinsCollected += 1;
        this.score += 25;
        this.particleSystem.emit(coin.position.x + coin.size / 2, coin.position.y + coin.size / 2, 10, "#ffcf40");
        this.soundManager.play("coin");
        this.updateHud();
      }
    });
  }

  updateEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
  }

  updateMovingPlatforms() {
    this.movingPlatforms.forEach((platform) => {
      platform.update();
    });
  }

  handleEnemyCollisions() {
    if (this.isInvincible) {
      this.invincibilityTimer--;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
      }
      return;
    }

    this.enemies.forEach((enemy) => {
      const horizontalOverlap =
        this.player.position.x < enemy.position.x + enemy.width &&
        this.player.position.x + this.player.width > enemy.position.x;
      const verticalOverlap =
        this.player.position.y < enemy.position.y + enemy.height &&
        this.player.position.y + this.player.height > enemy.position.y;

      if (horizontalOverlap && verticalOverlap) {
        this.health -= 1;
        this.soundManager.play("damage");
        this.updateHud();

        if (this.health <= 0) {
          this.gameOver();
        } else {
          // Grant invincibility frames after taking damage
          this.isInvincible = true;
          this.invincibilityTimer = 60; // ~1 second at 60fps
        }
      }
    });
  }

  gameOver() {
    this.setGameState(GameState.GAME_OVER);
    this.isCheckpointCollisionDetectionActive = false;
    this.soundManager.stopBgm();
    this.soundManager.play("gameOver");
    this.gameOverScreen.style.display = "block";
    this.gameOverMessage.textContent = `Game Over! Final Score: ${this.score}`;
  }

  handlePlatformCollisions() {
    const allPlatforms = [...this.platforms, ...this.movingPlatforms];

    allPlatforms.forEach((platform) => {
      const collisionDetectionRules = [
        this.player.position.y + this.player.height <= platform.position.y,
        this.player.position.y + this.player.height + this.player.velocity.y >=
          platform.position.y,
        this.player.position.x >= platform.position.x - this.player.width / 2,
        this.player.position.x <=
          platform.position.x + platform.width - this.player.width / 3,
      ];

      if (collisionDetectionRules.every((rule) => rule)) {
        this.player.velocity.y = 0;
        return;
      }

      const platformDetectionRules = [
        this.player.position.x >= platform.position.x - this.player.width / 2,
        this.player.position.x <=
          platform.position.x + platform.width - this.player.width / 3,
        this.player.position.y + this.player.height >= platform.position.y,
        this.player.position.y <= platform.position.y + platform.height,
      ];

      if (platformDetectionRules.every((rule) => rule)) {
        this.player.position.y = platform.position.y + this.player.height;
        this.player.velocity.y = this.gravity;
      }
    });
  }

  handleCheckpointCollisions() {
    this.checkpoints.forEach((checkpoint, index, checkpoints) => {
      const checkpointDetectionRules = [
        this.player.position.x >= checkpoint.position.x,
        this.player.position.y >= checkpoint.position.y,
        this.player.position.y + this.player.height <=
          checkpoint.position.y + checkpoint.height,
        this.isCheckpointCollisionDetectionActive,
        this.player.position.x - this.player.width <=
          checkpoint.position.x - checkpoint.width + this.player.width * 0.9,
        index === 0 || checkpoints[index - 1].claimed === true,
      ];

      if (checkpointDetectionRules.every((rule) => rule)) {
        checkpoint.claim();
        this.score += 100;
        this.particleSystem.emit(checkpoint.position.x + checkpoint.width / 2, checkpoint.position.y + checkpoint.height / 2, 15, "#f1be32");
        this.soundManager.play("checkpoint");
        this.updateHud();

        if (index === checkpoints.length - 1) {
          this.setGameState(GameState.LEVEL_COMPLETE);
          this.showCheckpointScreen(`${this.getActiveLevel().name} complete!`);

          setTimeout(() => {
            if (this.currentState === GameState.LEVEL_COMPLETE) {
              this.moveToNextLevel();
            }
          }, 1200);
        } else if (
          this.player.position.x >= checkpoint.position.x &&
          this.player.position.x <= checkpoint.position.x + 40
        ) {
          this.showCheckpointScreen("You reached a checkpoint!");
        }
      }
    });
  }

  movePlayer(key, xVelocity, isPressed) {
    if (this.currentState !== GameState.PLAYING) {
      if (key === "ArrowLeft") {
        this.keys.leftKey.pressed = false;
      }
      if (key === "ArrowRight") {
        this.keys.rightKey.pressed = false;
      }
      return;
    }

    if (!this.isCheckpointCollisionDetectionActive) {
      this.player.velocity.x = 0;
      this.player.velocity.y = 0;
      return;
    }

    switch (key) {
      case "ArrowLeft":
        this.keys.leftKey.pressed = isPressed;
        if (xVelocity === 0) {
          this.player.velocity.x = xVelocity;
        }
        this.player.velocity.x -= xVelocity;
        break;
      case "ArrowUp":
      case " ":
      case "Spacebar":
        this.player.velocity.y -= 8;
        this.soundManager.play("jump");
        break;
      case "ArrowRight":
        this.keys.rightKey.pressed = isPressed;
        if (xVelocity === 0) {
          this.player.velocity.x = xVelocity;
        }
        this.player.velocity.x += xVelocity;
        break;
      default:
        break;
    }
  }

  togglePause() {
    if (this.currentState === GameState.PLAYING) {
      this.setGameState(GameState.PAUSED);
      this.soundManager.stopBgm();
      return;
    }

    if (this.currentState === GameState.PAUSED) {
      this.setGameState(GameState.PLAYING);
      this.soundManager.startBgm();
    }
  }

  restart() {
    this.currentLevelIndex = 0;
    this.score = 0;
    this.health = this.maxHealth;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.gameOverScreen.style.display = "none";
    this.buildWorld();
    this.setGameState(GameState.PLAYING);
    this.soundManager.startBgm();
  }

  async start() {
    await this.loadLevels();

    this.canvas.style.display = "block";
    this.startScreen.style.display = "none";
    this.hud.style.display = "block";
    this.gameControls.style.display = "flex";

    this.currentLevelIndex = 0;
    this.score = 0;
    this.health = this.maxHealth;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.buildWorld();
    this.setGameState(GameState.PLAYING);
    this.soundManager.startBgm();

    if (!this.animationFrameId) {
      this.animate();
    }
  }

  showCheckpointScreen(message) {
    this.checkpointScreen.style.display = "block";
    this.checkpointMessage.textContent = message;

    if (this.currentState === GameState.PLAYING) {
      setTimeout(() => {
        this.checkpointScreen.style.display = "none";
      }, 2000);
    }
  }

  moveToNextLevel() {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex += 1;
      this.buildWorld();
      this.setGameState(GameState.PLAYING);
      this.showCheckpointScreen(`Now playing ${this.getActiveLevel().name}`);
      return;
    }

    this.isCheckpointCollisionDetectionActive = false;
    this.setGameState(GameState.LEVEL_COMPLETE);
    this.soundManager.stopBgm();
    this.showCheckpointScreen("You cleared all levels! Press Play Again to restart.");
    this.movePlayer("ArrowRight", 0, false);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    this.drawScene();

    if (!this.player) {
      return;
    }

    if (this.currentState !== GameState.PLAYING) {
      this.player.drawWithInvincibility(this.ctx, this.isInvincible, this.invincibilityTimer);
      return;
    }

    this.player.update(this.ctx, this.canvas, this.gravity, this.isInvincible, this.invincibilityTimer);

    if (
      this.keys.rightKey.pressed &&
      this.player.position.x < this.proportionalSize(400)
    ) {
      this.player.velocity.x = 5;
    } else if (
      this.keys.leftKey.pressed &&
      this.player.position.x > this.proportionalSize(100)
    ) {
      this.player.velocity.x = -5;
    } else {
      this.player.velocity.x = 0;

      if (this.keys.rightKey.pressed && this.isCheckpointCollisionDetectionActive) {
        this.platforms.forEach((platform) => {
          platform.position.x -= 5;
        });

        this.movingPlatforms.forEach((platform) => {
          platform.scroll(-5);
        });

        this.checkpoints.forEach((checkpoint) => {
          checkpoint.position.x -= 5;
        });
      } else if (
        this.keys.leftKey.pressed &&
        this.isCheckpointCollisionDetectionActive
      ) {
        this.platforms.forEach((platform) => {
          platform.position.x += 5;
        });

        this.movingPlatforms.forEach((platform) => {
          platform.scroll(5);
        });

        this.checkpoints.forEach((checkpoint) => {
          checkpoint.position.x += 5;
        });
      }
    }

    this.handlePlatformCollisions();
    this.handleCoinCollisions();
    this.updateMovingPlatforms();
    this.particleSystem.update();
    this.updateEnemies();
    this.handleEnemyCollisions();
    this.handleCheckpointCollisions();
  }
}
