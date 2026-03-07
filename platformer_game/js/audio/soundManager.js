export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.musicGain = null;
    this.muted = false;
    this.volume = 0.4;
    this.unlocked = false;
    this.musicIntervalId = null;
    this.musicPatternIndex = 0;
    this.musicPattern = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23];
  }

  ensureAudioContext() {
    if (this.audioContext) {
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    this.audioContext = new AudioCtx();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.audioContext.destination);

    this.musicGain = this.audioContext.createGain();
    this.musicGain.gain.value = 0.15;
    this.musicGain.connect(this.masterGain);
  }

  async unlock() {
    this.ensureAudioContext();
    if (!this.audioContext) {
      return;
    }

    if (this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        return;
      }
    }

    this.unlocked = true;
  }

  setMuted(isMuted) {
    this.muted = isMuted;
    if (!this.masterGain) {
      return;
    }

    this.masterGain.gain.value = this.muted ? 0 : this.volume;
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    if (!this.masterGain || this.muted) {
      return;
    }

    this.masterGain.gain.value = this.volume;
  }

  playTone(frequency, duration = 0.1, type = "square", gainValue = 0.2) {
    if (!this.unlocked || this.muted || !this.audioContext) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  play(name) {
    switch (name) {
      case "jump":
        this.playTone(520, 0.12, "square", 0.16);
        break;
      case "coin":
        this.playTone(880, 0.08, "triangle", 0.12);
        break;
      case "checkpoint":
        this.playTone(660, 0.12, "triangle", 0.14);
        setTimeout(() => this.playTone(990, 0.12, "triangle", 0.12), 90);
        break;
      case "damage":
        this.playTone(180, 0.15, "sawtooth", 0.18);
        break;
      case "gameOver":
        this.playTone(240, 0.2, "sawtooth", 0.15);
        setTimeout(() => this.playTone(160, 0.25, "sawtooth", 0.14), 120);
        break;
      default:
        break;
    }
  }

  startBgm() {
    if (this.musicIntervalId || !this.unlocked || !this.audioContext || this.muted) {
      return;
    }

    this.musicIntervalId = setInterval(() => {
      const freq = this.musicPattern[this.musicPatternIndex % this.musicPattern.length];
      this.musicPatternIndex += 1;

      const oscillator = this.audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      const now = this.audioContext.currentTime;
      this.musicGain.gain.setValueAtTime(0.09, now);
      this.musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      oscillator.connect(this.musicGain);
      oscillator.start(now);
      oscillator.stop(now + 0.45);
    }, 500);
  }

  stopBgm() {
    if (!this.musicIntervalId) {
      return;
    }

    clearInterval(this.musicIntervalId);
    this.musicIntervalId = null;
  }
}
