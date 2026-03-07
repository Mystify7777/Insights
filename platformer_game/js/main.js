import { Game } from "./game.js";
import { SoundManager } from "./audio/soundManager.js";

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const muteBtn = document.getElementById("mute-btn");
const volumeSlider = document.getElementById("volume-slider");
const overlayRestartBtn = document.getElementById("overlay-restart-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");
const hud = document.getElementById("hud");
const hudState = document.getElementById("hud-state");
const hudScore = document.getElementById("hud-score");
const hudLevel = document.getElementById("hud-level");
const hudCoins = document.getElementById("hud-coins");
const hudHealth = document.getElementById("hud-health");
const gameControls = document.getElementById("game-controls");
const mobileLeftBtn = document.getElementById("mobile-left-btn");
const mobileRightBtn = document.getElementById("mobile-right-btn");
const mobileJumpBtn = document.getElementById("mobile-jump-btn");
const gameOverScreen = document.querySelector(".game-over-screen");
const gameOverMessage = document.getElementById("game-over-message");
const gameOverRestartBtn = document.getElementById("game-over-restart-btn");
const soundManager = new SoundManager();

const game = new Game({
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
});

startBtn.addEventListener("click", async () => {
  await soundManager.unlock();
  await game.start();
});

pauseBtn.addEventListener("click", () => {
  game.togglePause();
});

restartBtn.addEventListener("click", () => {
  game.restart();
});

overlayRestartBtn.addEventListener("click", () => {
  game.restart();
});

gameOverRestartBtn.addEventListener("click", () => {
  game.restart();
});

muteBtn.addEventListener("click", () => {
  const nextMuted = !soundManager.muted;
  soundManager.setMuted(nextMuted);
  muteBtn.textContent = nextMuted ? "Unmute" : "Mute";

  if (!nextMuted) {
    soundManager.startBgm();
  } else {
    soundManager.stopBgm();
  }
});

volumeSlider.addEventListener("input", () => {
  const normalizedValue = Number(volumeSlider.value) / 100;
  soundManager.setVolume(normalizedValue);
});

const bindHoldControl = (button, key) => {
  const press = (event) => {
    event.preventDefault();
    game.movePlayer(key, 8, true);
  };

  const release = (event) => {
    event.preventDefault();
    game.movePlayer(key, 0, false);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
};

bindHoldControl(mobileLeftBtn, "ArrowLeft");
bindHoldControl(mobileRightBtn, "ArrowRight");

mobileJumpBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  game.movePlayer(" ", 8, true);
});

window.addEventListener("blur", () => {
  game.movePlayer("ArrowLeft", 0, false);
  game.movePlayer("ArrowRight", 0, false);
});

window.addEventListener("keydown", ({ key }) => {
  if (key === "m" || key === "M") {
    muteBtn.click();
    return;
  }

  if (key === "p" || key === "P" || key === "Escape") {
    game.togglePause();
    return;
  }

  game.movePlayer(key, 8, true);
});

window.addEventListener("keyup", ({ key }) => {
  game.movePlayer(key, 0, false);
});
