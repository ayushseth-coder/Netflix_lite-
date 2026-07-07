/**
 * Netflix-Lite SPA Configuration
 * Contains API keys, base URLs, and configuration settings.
 * DO NOT hard-code secrets directly in application logic files.
 */

export const CONFIG = {
  // Replace these placeholders with your actual API keys
  TMDB_API_KEY: '730cee13f06bd6f03133b25050ae2eee',
  GEMINI_API_KEY: 'AQ.Ab8RN6IVrMbS8Q7X6Ea-GPjKldl2F5CdEDciNCglCTFt87uCcQ',

  // API Base URLs
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // Image Sizes
  POSTER_SIZE: 'w342',      // Used for catalog grid posters
  BACKDROP_SIZE: 'w1280',   // Used for hero background header

  // Gemini REST Endpoint configuration
  GEMINI_MODEL: 'gemini-1.5-flash',
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

  // Mock Mode override - can be set to true to force mockup behavior for offline use
  FORCE_MOCK_DATA: false
};
