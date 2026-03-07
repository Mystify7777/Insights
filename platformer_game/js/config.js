export const GRAVITY = 0.5;

export const GameState = {
  START: "START",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  LEVEL_COMPLETE: "LEVEL_COMPLETE",
  GAME_OVER: "GAME_OVER",
};

export const LEVEL_PATHS = ["./levels/level1.json", "./levels/level2.json"];

export const FALLBACK_LEVELS = [
  {
    name: "Level 1",
    platforms: [
      { x: 500, y: 450 },
      { x: 700, y: 400 },
      { x: 850, y: 350 },
      { x: 900, y: 350 },
      { x: 1050, y: 150 },
      { x: 2500, y: 450 },
      { x: 2900, y: 400 },
      { x: 3150, y: 350 },
      { x: 3900, y: 450 },
      { x: 4200, y: 400 },
      { x: 4400, y: 200 },
      { x: 4700, y: 150 }
    ],
    checkpoints: [
      { x: 1170, y: 80 },
      { x: 2900, y: 330 },
      { x: 4800, y: 80 }
    ],
    coins: [
      { x: 730, y: 360 },
      { x: 1080, y: 110 },
      { x: 2550, y: 410 },
      { x: 3180, y: 310 },
      { x: 4440, y: 160 },
      { x: 4750, y: 110 }
    ],
    enemies: [
      { x: 800, y: 360 },
      { x: 2600, y: 410 },
      { x: 4300, y: 360 }
    ],
    movingPlatforms: [
      { x: 1400, y: 300, targetX: 1700, speed: 2 },
      { x: 3400, y: 280, targetX: 3700, speed: 1.5 }
    ]
  },
  {
    name: "Level 2",
    platforms: [
      { x: 450, y: 440 },
      { x: 620, y: 360 },
      { x: 860, y: 300 },
      { x: 1140, y: 240 },
      { x: 1460, y: 300 },
      { x: 1820, y: 360 },
      { x: 2260, y: 430 },
      { x: 2750, y: 380 },
      { x: 3150, y: 280 },
      { x: 3550, y: 210 },
      { x: 3900, y: 270 },
      { x: 4350, y: 330 },
      { x: 4700, y: 220 }
    ],
    checkpoints: [
      { x: 1200, y: 170 },
      { x: 3000, y: 220 },
      { x: 4820, y: 150 }
    ],
    coins: [
      { x: 650, y: 320 },
      { x: 1180, y: 200 },
      { x: 1490, y: 260 },
      { x: 2300, y: 390 },
      { x: 3580, y: 170 },
      { x: 4720, y: 180 }
    ],
    enemies: [
      { x: 900, y: 260 },
      { x: 1900, y: 320 },
      { x: 2850, y: 340 },
      { x: 3650, y: 170 }
    ],
    movingPlatforms: [
      { x: 1650, y: 180, targetX: 2000, speed: 2 },
      { x: 2500, y: 220, targetX: 2700, speed: 1.5 },
      { x: 4050, y: 150, targetX: 4250, speed: 1.8 }
    ]
  }
];
