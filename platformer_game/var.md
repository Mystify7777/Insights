<!-- This file contains the list of all the class, variables and methods used in the project with their purpose clearly mentioned and where they are defined like an index page to make it easier to keep track of things. -->

# Core Components Index

## index.html

- Loads `./js/main.js` as ES module entrypoint.
- Defines game UI shells (`start-screen`, `checkpoint-screen`, HUD, controls, canvas).

## js/main.js

### DOM References
- `startBtn`: Starts gameplay from the start screen.
- `pauseBtn`: Toggles pause and resume while in-game.
- `restartBtn`: Restarts the level from the in-game controls.
- `overlayRestartBtn`: Restarts the level from the completion overlay.
- `canvas`: Main rendering surface.
- `startScreen`: Intro/start panel.
- `checkpointScreen`: Checkpoint/final message panel.
- `checkpointMessage`: Text node for checkpoint screen messages.
- `hud`, `hudState`, `hudScore`, `hudLevel`, `hudCoins`, `hudHealth`: Heads-up display and labels.
- `gameControls`: Container for in-game action buttons.
- `gameOverScreen`: Game-over overlay panel.
- `gameOverMessage`: Game-over text node.
- `gameOverRestartBtn`: Restart button on game-over screen.
- `mobileLeftBtn`, `mobileRightBtn`, `mobileJumpBtn`: On-screen touch controls.

- `game`: Single `Game` instance coordinating runtime logic.

### Event Wiring
- Click handlers for start/pause/restart controls.
- Game-over restart handler.
- Keyboard handlers for movement, jump, and pause toggle.
- Pointer handlers for touch-based hold movement and jump.

## js/game.js

### Class
- `Game`: Encapsulates game loop, state machine, world building, input handling, collision logic, and level progression.

### Core Runtime State (inside `Game`)
- `currentState`: Active game state.
- `score`: Current score.
- `currentLevelIndex`: Active level index.
- `levels`: Loaded level definitions.
- `platforms`, `checkpoints`, `coins`, `enemies`, `movingPlatforms`, `player`: Active world entities.
- `coinsCollected`: Count of collected coins in active level.
- `totalCoinsInLevel`: Total coin count in active level.
- `health`: Current player health.
- `maxHealth`: Maximum player health (default: 3).
- `isInvincible`: Invincibility flag during damage cooldown.
- `invincibilityTimer`: Frame counter for invincibility duration.
- `particleSystem`: Manages all active particle effects.
- `keys`: Input pressed-state map.
- `animationFrameId`: Animation loop tracking ID.

### Key Methods
- `start()`: Bootstraps runtime and begins animation.
- `restart()`: Resets to level 1 and score 0.
- `togglePause()`: Switches between `PLAYING` and `PAUSED`.
- `movePlayer()`: Handles movement/jump input intent.
- `loadLevels()`: Loads level data via `js/levels.js`.
- `buildWorld()`: Rebuilds entities from active level data.
- `moveToNextLevel()`: Advances level or finishes campaign.
- `animate()`: Main per-frame update/render loop.
- `handleCoinCollisions()`: Handles coin collection and scoring.
- `updateEnemies()`: Updates enemy patrol movement.
- `updateMovingPlatforms()`: Updates moving platform positions.
- `handleEnemyCollisions()`: Detects player-enemy collision, applies damage, manages invincibility.
- `gameOver()`: Triggers game-over state and displays final score.

## js/config.js

### Exports
- `GRAVITY`: Shared vertical acceleration constant.
- `GameState`: Enum-like game state object (`START`, `PLAYING`, `PAUSED`, `LEVEL_COMPLETE`, `GAME_OVER`).
- `LEVEL_PATHS`: JSON file list for level loading.
- `FALLBACK_LEVELS`: Embedded level data fallback including `coins`, `enemies`, and `movingPlatforms` arrays.

## js/levels.js

### Exports
- `loadLevelData()`: Loads JSON levels and falls back to `FALLBACK_LEVELS` if fetch fails.

## js/entities/player.js

### Class
- `Player`: Handles player physics, movement bounds, and rendering.

### Key Methods
- `draw()`: Standard player rendering.
- `drawWithInvincibility()`: Renders player with flashing effect during invincibility.
- `update()`: Physics update with invincibility-aware rendering.

## js/entities/platform.js

### Class
- `Platform`: Defines collision surfaces and rendering.

## js/entities/checkpoint.js

### Class
- `CheckPoint`: Defines checkpoint bounds, rendering, and claim behavior.

## js/entities/coin.js

### Class
- `Coin`: Defines collectible coin rendering and claim state.

## js/entities/enemy.js

### Class
- `Enemy`: Defines enemy rendering, patrol AI, and collision bounds.

## js/entities/movingPlatform.js

### Class
- `MovingPlatform`: Defines horizontally moving platforms with patrol boundaries and scroll sync.

## js/particleSystem.js

### Classes
- `Particle`: Single particle with position, velocity, color, alpha fade.
- `ParticleSystem`: Manages particle lifecycle (emit, update, draw, cleanup).