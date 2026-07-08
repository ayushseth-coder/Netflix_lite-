import { store } from '../state/store.js';
import { renderer } from './renderer.js';

export const router = {
  // Routes mapping
  routes: {
    '#/home': 'home',
    '#/favorites': 'favorites'
  },

  /**
   * Initializes the router and registers event listeners
   */
  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('load', () => this.handleRouting());
    
    // Set default route if no hash is present
    if (!window.location.hash) {
      window.location.hash = '#/home';
    }
  },

  /**
   * Dispatches routes based on the current hash location
   */
  handleRouting() {
    const hash = window.location.hash || '#/home';
    store.setState({ activeRoute: hash });

    // Handle normalizations (e.g. '#' or '#/' redirects to '#/home')
    if (hash === '#' || hash === '#/') {
      window.location.hash = '#/home';
      return;
    }

    const viewName = this.routes[hash] || 'home';
    this.toggleViews(viewName);
    
    // Trigger route-specific view initialization
    if (viewName === 'home') {
      this.initHomeView();
    } else if (viewName === 'favorites') {
      this.initFavoritesView();
    }
  },

  /**
   * Toggles CSS classes to switch active view panels
   */
  toggleViews(activeView) {
    const browsePanel = document.getElementById('browse-view');
    const favoritesPanel = document.getElementById('favorites-view');
    
    const homeNavLink = document.getElementById('nav-home');
    const favNavLink = document.getElementById('nav-favorites');

    if (activeView === 'home') {
      if (browsePanel) browsePanel.classList.add('active');
      if (favoritesPanel) favoritesPanel.classList.remove('active');
      
      if (homeNavLink) homeNavLink.classList.add('active');
      if (favNavLink) favNavLink.classList.remove('active');
      
      // Show/hide sub-headers
      const subHeader = document.querySelector('.sub-header-container');
      if (subHeader) subHeader.style.display = 'flex';
    } else if (activeView === 'favorites') {
      if (browsePanel) browsePanel.classList.remove('active');
      if (favoritesPanel) favoritesPanel.classList.add('active');
      
      if (homeNavLink) homeNavLink.classList.remove('active');
      if (favNavLink) favNavLink.classList.add('active');

      const subHeader = document.querySelector('.sub-header-container');
      if (subHeader) subHeader.style.display = 'none';
    }
  },

  /**
   * Logic for rendering the Home page view (browse/search)
   */
  initHomeView() {
    const state = store.getState();
    const movieGrid = document.getElementById('movies-grid');
    
    if (state.movies.length > 0) {
      renderer.renderMovieGrid(state.movies, movieGrid, false);
    }
    
    // Handle spotlight state persistence
    const spotlightContainer = document.getElementById('mood-spotlight-container');
    if (state.aiResult) {
      renderer.renderAIMoodSpotlight(state.aiResult, spotlightContainer);
    } else {
      renderer.renderAIMoodSpotlight(null, spotlightContainer);
    }
  },

  /**
   * Logic for rendering the Favorites page view
   */
  initFavoritesView() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const state = store.getState();
    
    if (state.favorites.length === 0) {
      renderer.renderEmptyState(
        favoritesGrid, 
        'You haven\'t added any favorites yet. Go to browse and click the ❤️ icon on your favorite movies!'
      );
    } else {
      renderer.renderMovieGrid(state.favorites, favoritesGrid, false);
    }
  }
};
