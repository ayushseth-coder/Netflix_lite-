import { store } from './state/store.js';
import { tmdbService } from './services/tmdb.js';
import { aiService } from './services/ai.js';
import { renderer } from './ui/renderer.js';
import { router } from './ui/router.js';
import { debounce } from './utils/debounce.js';
import { createInfiniteScrollObserver } from './utils/observer.js';

// DOM Elements
const searchInput = document.getElementById('search-input');
const moodInput = document.getElementById('mood-input');
const moodForm = document.getElementById('mood-form');
const moodLoading = document.getElementById('mood-loading');
const moviesGrid = document.getElementById('movies-grid');
const sentinel = document.getElementById('sentinel');
const spotlightContainer = document.getElementById('mood-spotlight-container');

/**
 * Loads the initial page of popular movies on startup
 */
async function loadInitialMovies() {
  store.resetPagination();
  store.setState({ isLoading: true });
  
  renderer.renderSkeletons(moviesGrid, 12);
  
  try {
    const data = await tmdbService.getPopularMovies(1);
    store.setState({
      movies: data.results,
      currentPage: 1,
      hasMore: 1 < data.total_pages,
      isLoading: false
    });
    
    renderer.renderMovieGrid(data.results, moviesGrid, false);
  } catch (error) {
    console.error("Main: Initial movies load failed.", error);
    store.setState({ isLoading: false });
    renderer.renderErrorState(moviesGrid, "Failed to load popular movies. Please check your connection.", () => {
      loadInitialMovies();
    });
  }
}

/**
 * Loads the next page of movies (Popular or Search) and appends to the grid
 */
async function loadMoreMovies() {
  const state = store.getState();
  
  // Guard clause against duplicate runs or exhaustion
  if (state.isLoading || !state.hasMore || state.activeRoute !== '#/home') {
    return;
  }
  
  store.setState({ isLoading: true });
  
  // Render loading skeletons at the bottom of the grid
  renderer.renderSkeletons(moviesGrid, 4, true);
  
  const nextPage = state.currentPage + 1;
  const isSearch = state.searchQuery && state.searchQuery.trim() !== '';
  
  try {
    let data;
    if (isSearch) {
      data = await tmdbService.searchMovies(state.searchQuery, nextPage);
    } else {
      data = await tmdbService.getPopularMovies(nextPage);
    }
    
    // Clean up loading skeletons
    renderer.removeAppendedSkeletons(moviesGrid);
    
    const newMovies = data.results || [];
    const mergedMovies = [...state.movies, ...newMovies];
    
    store.setState({
      movies: mergedMovies,
      currentPage: nextPage,
      hasMore: nextPage < data.total_pages,
      isLoading: false
    });
    
    // Render and append ONLY the new cards to the existing layout
    renderer.renderMovieGrid(newMovies, moviesGrid, true);
  } catch (error) {
    console.error("Main: Failed to load more pages.", error);
    renderer.removeAppendedSkeletons(moviesGrid);
    store.setState({ isLoading: false });
  }
}

/**
 * Handles debounced search inputs
 */
const handleSearch = debounce(async (query) => {
  store.setState({ searchQuery: query });
  store.resetPagination();
  store.setState({ isLoading: true });
  
  renderer.renderSkeletons(moviesGrid, 12);
  
  // Clear any existing mood recommendations to prevent layout conflicts
  store.setState({ aiResult: null });
  renderer.renderAIMoodSpotlight(null, spotlightContainer);

  try {
    let data;
    if (query && query.trim() !== '') {
      data = await tmdbService.searchMovies(query, 1);
    } else {
      data = await tmdbService.getPopularMovies(1);
    }
    
    store.setState({
      movies: data.results,
      currentPage: 1,
      hasMore: 1 < data.total_pages,
      isLoading: false
    });
    
    if (data.results && data.results.length > 0) {
      renderer.renderMovieGrid(data.results, moviesGrid, false);
    } else {
      renderer.renderEmptyState(moviesGrid, `No results found for "${query}". Try searching another title.`);
    }
  } catch (error) {
    console.error("Main: Search query request failed.", error);
    store.setState({ isLoading: false });
    renderer.renderErrorState(moviesGrid, "An error occurred while searching. Please try again.", () => {
      handleSearch(query);
    });
  }
}, 500);

/**
 * Handles the AI Mood Matcher form submission
 */
async function handleMoodSubmit(e) {
  e.preventDefault();
  
  const moodValue = moodInput.value ? moodInput.value.trim() : '';
  if (!moodValue) return;
  
  // Show loading indicator
  moodLoading.classList.add('active');
  
  // Temporarily disable form elements during load
  const submitBtn = moodForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  moodInput.disabled = true;

  try {
    // Call Gemini API and search TMDB silently (handled inside service)
    const matchedMovie = await aiService.getMovieByMood(moodValue);
    
    // Save inside store
    store.setState({ aiResult: matchedMovie });
    
    if (matchedMovie) {
      // Render the spotlight banner prominently (completely hiding raw AI outputs)
      renderer.renderAIMoodSpotlight(matchedMovie, spotlightContainer);
      
      // Smooth scroll to the spotlight banner
      spotlightContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Display alert banner in the spot container if no matches found
      spotlightContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔮</div>
          <p class="empty-message">The Mood Matcher couldn't find a perfect movie for: "${moodValue}". Try typing a different feeling!</p>
          <button class="spotlight-clear-btn" style="margin-top: 10px;" onclick="this.parentElement.parentElement.innerHTML=''; document.getElementById('mood-spotlight-container').classList.remove('active')">Dismiss</button>
        </div>
      `;
      spotlightContainer.classList.add('active');
    }
  } catch (err) {
    console.error("Main: Mood Matcher failed.", err);
  } finally {
    // Hide loading indicator & restore form fields
    moodLoading.classList.remove('active');
    submitBtn.disabled = false;
    moodInput.disabled = false;
    
    // Clear input
    moodInput.value = '';
  }
}

// Wire up Application Event Listeners
function initializeApp() {
  // Initialize SPA routing
  router.init();
  
  // Setup Search Input event
  searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  // Setup AI Mood Matcher Form submission
  moodForm.addEventListener('submit', handleMoodSubmit);

  // Setup Infinite Scroll Intersection Observer on the Sentinel Loader Div
  createInfiniteScrollObserver(sentinel, () => {
    loadMoreMovies();
  });

  // Load Popular Movies Page 1
  loadInitialMovies();
}

// Bootstrap once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
