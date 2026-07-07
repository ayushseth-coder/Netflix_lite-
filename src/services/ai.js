import { CONFIG } from '../config/config.js';
import { tmdbService, MOCK_MOVIES } from './tmdb.js';

// Helper to check if Gemini API key is configured
const isGeminiConfigured = () => {
  return (
    CONFIG.GEMINI_API_KEY &&
    CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE' &&
    CONFIG.GEMINI_API_KEY.trim() !== ''
  );
};

export const aiService = {
  /**
   * Recommends a single movie matching the user's input mood phrase,
   * queries TMDB for it, and returns the movie details object.
   * 
   * @param {string} moodPhrase - The user's input mood description.
   * @returns {Promise<Object|null>} - The movie object matching the recommendation, or null.
   */
  async getMovieByMood(moodPhrase) {
    if (!moodPhrase || moodPhrase.trim() === '') {
      return null;
    }

    let recommendedTitle = '';

    if (CONFIG.FORCE_MOCK_DATA || !isGeminiConfigured()) {
      console.warn("AI Service: Gemini Key not configured or FORCE_MOCK_DATA is true. Using fallback mock mood resolver.");
      recommendedTitle = this._getMockMoodRecommendation(moodPhrase);
    } else {
      try {
        const url = `${CONFIG.GEMINI_BASE_URL}/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
        
        // Strict prompt engineering to force Gemini to output ONLY the title string
        const systemPrompt = `You are a movie recommendation assistant. The user's mood/situation is: "${moodPhrase}". 
Suggest exactly ONE movie that matches this mood. 
You MUST respond with ONLY the raw movie title, and absolutely nothing else. 
Do NOT include quotes, bold text, markdown formatting, greetings, or explanations. 
For example, if you recommend Inception, reply exactly: Inception`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt
                  }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          const rawText = data.candidates[0].content.parts[0].text;
          // Clean up the text: remove newlines and enclosing quotes if any
          recommendedTitle = rawText.replace(/['"\n\r]/g, '').trim();
          console.log(`AI Service: Gemini recommended movie title: "${recommendedTitle}"`);
        } else {
          throw new Error('Unexpected API response structure');
        }
      } catch (error) {
        console.error("AI Service: Gemini request failed. Falling back to mock mood resolver.", error);
        recommendedTitle = this._getMockMoodRecommendation(moodPhrase);
      }
    }

    if (!recommendedTitle) {
      return null;
    }

    // Pass the title silently to the TMDB Search API
    try {
      console.log(`AI Service: Silently searching TMDB for "${recommendedTitle}"`);
      const searchResult = await tmdbService.searchMovies(recommendedTitle, 1);
      
      if (searchResult.results && searchResult.results.length > 0) {
        // Return the first/best match
        return searchResult.results[0];
      } else {
        console.warn(`AI Service: TMDB search returned 0 results for "${recommendedTitle}".`);
        return null;
      }
    } catch (e) {
      console.error(`AI Service: TMDB search failed for recommendation "${recommendedTitle}"`, e);
      return null;
    }
  },

  /**
   * Fallback mock recommender for local/offline testing.
   * Matches keywords in user's prompt to make a smart suggestion from the mock database.
   */
  _getMockMoodRecommendation(moodPhrase) {
    const text = moodPhrase.toLowerCase();
    
    // Check keyword patterns and map to mock database titles
    if (text.includes('sad') && text.includes('action')) {
      return 'Gladiator'; // Sad but action
    }
    if (text.includes('sad') || text.includes('cry') || text.includes('blue')) {
      return 'Inside Out 2';
    }
    if (text.includes('happy') || text.includes('fun') || text.includes('laugh') || text.includes('cheer')) {
      return 'Barbie';
    }
    if (text.includes('action') || text.includes('fight') || text.includes('explosion') || text.includes('superhero')) {
      return 'Deadpool & Wolverine';
    }
    if (text.includes('sci-fi') || text.includes('space') || text.includes('future') || text.includes('robot')) {
      return 'Interstellar';
    }
    if (text.includes('mind') || text.includes('dream') || text.includes('complex') || text.includes('smart')) {
      return 'Inception';
    }
    if (text.includes('scared') || text.includes('horror') || text.includes('creepy') || text.includes('dark')) {
      return 'Joker';
    }
    if (text.includes('love') || text.includes('romance') || text.includes('romantic')) {
      return 'La La Land';
    }
    if (text.includes('anime') || text.includes('cartoon') || text.includes('animation')) {
      return 'Spirited Away';
    }
    if (text.includes('adventure') || text.includes('epic') || text.includes('magic') || text.includes('ring')) {
      return 'The Lord of the Rings: The Fellowship of the Ring';
    }

    // Default to a random high-quality movie from the mock database
    const randomIndex = Math.floor(Math.random() * MOCK_MOVIES.length);
    return MOCK_MOVIES[randomIndex].title;
  }
};
