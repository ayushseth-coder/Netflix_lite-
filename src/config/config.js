/**
 * Netflix-Lite SPA Configuration
 * Defines base settings and exposes an initConfig function to
 * dynamically import env.js at startup without blocking script loading.
 */

// Default Configuration object (mutable properties)
export const CONFIG = {
  TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE',
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',

  // API Base URLs
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // Image Sizes
  POSTER_SIZE: 'w342',      // Optimized poster size
  BACKDROP_SIZE: 'w1280',   // Optimized banner size

  // Gemini REST Endpoint configuration
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

  // Mock Mode override - force mockup data for offline presentation
  FORCE_MOCK_DATA: false
};

/**
 * Asynchronously loads local environment variables from the env.js module.
 * This runs at startup and updates the CONFIG object properties dynamically.
 * Using standard ES dynamic import() bypasses browser security blocks (CORB/ORB)
 * on raw dotfiles like .env.
 */
export async function initConfig() {
  try {
    // Dynamically import env.js from the root of the server
    const envModule = await import('/env.js');
    if (envModule && envModule.ENV) {
      if (envModule.ENV.TMDB_API_KEY) {
        CONFIG.TMDB_API_KEY = envModule.ENV.TMDB_API_KEY;
      }
      if (envModule.ENV.GEMINI_API_KEY) {
        CONFIG.GEMINI_API_KEY = envModule.ENV.GEMINI_API_KEY;
      }
      console.log("Config: Loaded environment variables from env.js successfully.");
    }
  } catch (error) {
    // Fails silently, falling back to placeholders which automatically triggers Mock Mode
    console.info("Config: Local env.js not found. Running with default/placeholder settings.");
  }
}
