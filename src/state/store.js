/**
 * Store - Application State Management
 * Holds app-wide reactive state, handles LocalStorage persistence for Favorites,
 * and notifies listeners of state updates.
 */

class Store {
  constructor() {
    this.state = {
      movies: [],            // List of movies rendered in the active grid
      currentPage: 1,        // Current page for infinite scroll pagination
      hasMore: true,         // Tracks if more pages exist to load
      isLoading: false,      // Loading state indicator
      searchQuery: '',       // Active search term
      activeRoute: '#/home', // Active navigation route
      favorites: this._loadFavorites(), // List of user's favorite movie objects
      aiResult: null         // Holds the single movie result from Gemini Mood Matcher
    };

    this.listeners = new Set();
  }

  // Load favorites from local storage
  _loadFavorites() {
    try {
      const saved = localStorage.getItem('netflix_lite_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error reading favorites from localStorage:', e);
      return [];
    }
  }

  // Save favorites to local storage
  _saveFavorites() {
    try {
      localStorage.setItem('netflix_lite_favorites', JSON.stringify(this.state.favorites));
      this.triggerUpdate('favorites', this.state.favorites);
    } catch (e) {
      console.error('Error writing favorites to localStorage:', e);
    }
  }

  // Get current state
  getState() {
    return this.state;
  }

  // Update specific state keys and notify listeners
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.triggerUpdate('state', this.state);
  }

  // Add listener for state changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Trigger all listeners when state changes
  triggerUpdate(event, data) {
    this.listeners.forEach(callback => callback(event, data));
  }

  // Check if a movie is favorited
  isFavorite(movieId) {
    return this.state.favorites.some(movie => movie.id === Number(movieId));
  }

  // Toggle favorite status of a movie
  toggleFavorite(movie) {
    const index = this.state.favorites.findIndex(m => m.id === movie.id);
    if (index === -1) {
      // Add to favorites (store full movie object)
      this.state.favorites.push(movie);
      console.log(`Added "${movie.title}" to favorites.`);
    } else {
      // Remove from favorites
      this.state.favorites.splice(index, 1);
      console.log(`Removed "${movie.title}" from favorites.`);
    }
    this._saveFavorites();
  }

  // Reset pagination state when switching searches or tabs
  resetPagination() {
    this.setState({
      movies: [],
      currentPage: 1,
      hasMore: true,
      isLoading: false,
      aiResult: null
    });
  }
}

// Export a single instance to be used across the application
export const store = new Store();
