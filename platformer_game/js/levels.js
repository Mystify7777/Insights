import { FALLBACK_LEVELS, LEVEL_PATHS } from "./config.js";

let cachedLevels = null;

export const loadLevelData = async () => {
  if (cachedLevels) {
    return cachedLevels;
  }

  try {
    const responses = await Promise.all(LEVEL_PATHS.map((path) => fetch(path)));
    const payloads = await Promise.all(
      responses.map((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load level file: ${response.status}`);
        }
        return response.json();
      })
    );

    cachedLevels = payloads;
  } catch (error) {
    // Fallback supports opening the game from file:// without a dev server.
    cachedLevels = FALLBACK_LEVELS;
  }

  return cachedLevels;
};
