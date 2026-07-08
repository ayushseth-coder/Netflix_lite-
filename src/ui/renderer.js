import { CONFIG } from '../config/config.js';
import { store } from '../state/store.js';

// SVG Heart Icons
const HEART_OUTLINE = `
  <svg class="heart-icon outline" viewBox="0 0 24 24" width="22" height="22">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`;

const HEART_SOLID = `
  <svg class="heart-icon solid" viewBox="0 0 24 24" width="22" height="22">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`;

export const renderer = {
  /**
   * Generates HTML for a single movie card
   * @param {Object} movie - Movie data object from TMDB
   * @returns {string} - HTML string
   */
  createMovieCardHtml(movie) {
    const isFav = store.isFavorite(movie.id);
    const heartSvg = isFav ? HEART_SOLID : HEART_OUTLINE;
    const favClass = isFav ? 'favorited' : '';
    
    // Format year
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    
    // Format rating
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

    // Image URL with fallback
    let posterUrl = '';
    let hasPoster = false;
    if (movie.poster_path) {
      posterUrl = `${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.POSTER_SIZE}${movie.poster_path}`;
      hasPoster = true;
    }

    // Dynamic premium vector SVG placeholder to draw when TMDB images fail to load locally (e.g. adblocker)
    const displayTitle = movie.title.length > 22 ? movie.title.substring(0, 19) + '...' : movie.title;
    const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="%23181818"/><rect x="15" y="15" width="270" height="420" rx="8" fill="none" stroke="%232e2e2e" stroke-width="2"/><text x="150" y="170" dominant-baseline="middle" text-anchor="middle" fill="%23E50914" font-family="system-ui,sans-serif" font-size="48" font-weight="bold">🎬</text><text x="150" y="250" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="system-ui,sans-serif" font-size="16" font-weight="bold">${encodeURIComponent(displayTitle)}</text></svg>`;

    return `
      <div class="movie-card" data-id="${movie.id}">
        <div class="poster-wrapper">
          ${hasPoster 
            ? `<img 
                 class="movie-poster" 
                 src="${posterUrl}" 
                 alt="${movie.title}" 
                 loading="lazy" 
                 onload="this.classList.add('loaded')" 
                 onerror="this.onerror=null; this.src='${fallbackSvg}'; this.classList.add('loaded');"
               />`
            : `<div class="poster-placeholder">
                 <div class="placeholder-icon">🎬</div>
                 <div class="placeholder-title">${movie.title}</div>
               </div>`
          }
          <button class="favorite-toggle ${favClass}" data-movie-id="${movie.id}" aria-label="Add to favorites">
            ${heartSvg}
          </button>
          <div class="card-overlay">
            <div class="overlay-meta">
              <span class="rating-badge">⭐ ${rating}</span>
              <span class="year-badge">${year}</span>
            </div>
            <p class="overlay-overview">${movie.overview ? movie.overview.substring(0, 80) + '...' : 'No description available.'}</p>
          </div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
          <div class="movie-metadata">
            <span class="rating">★ ${rating}</span>
            <span class="dot">•</span>
            <span class="year">${year}</span>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Renders the movie list into a container.
   * Supports appending new cards for infinite scroll without redrawing existing nodes.
   * 
   * @param {Array} movies - Array of movie objects
   * @param {HTMLElement} container - Target DOM grid container
   * @param {boolean} append - True to append elements, false to replace
   */
  renderMovieGrid(movies, container, append = false) {
    if (!container) return;

    if (!append) {
      container.innerHTML = '';
    }

    if (!movies || movies.length === 0) {
      if (!append) {
        this.renderEmptyState(container, 'No movies found.');
      }
      return;
    }

    const tempDiv = document.createElement('div');
    const cardsHtml = movies.map(movie => this.createMovieCardHtml(movie)).join('');
    tempDiv.innerHTML = cardsHtml;

    // Append child elements individually to preserve existing DOM state and minimize layouts
    while (tempDiv.firstChild) {
      container.appendChild(tempDiv.firstChild);
    }

    // Attach event listeners for favorite toggle buttons
    this.attachFavoriteListeners(container);
  },

  /**
   * Attaches event listeners to all favorite buttons in a container
   */
  attachFavoriteListeners(container) {
    const buttons = container.querySelectorAll('.favorite-toggle');
    buttons.forEach(button => {
      // Avoid attaching multiple listeners by cloning or checking status
      if (button.dataset.listenerAttached) return;
      button.dataset.listenerAttached = 'true';

      button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const movieId = button.dataset.movieId;
        const movieCard = button.closest('.movie-card');
        
        // Find the movie object in current state
        const state = store.getState();
        let movie = state.movies.find(m => m.id === Number(movieId));
        
        // If not found in primary list, check AI result
        if (!movie && state.aiResult && state.aiResult.id === Number(movieId)) {
          movie = state.aiResult;
        }

        // If still not found, check favorites list (useful when removing from favorites page)
        if (!movie) {
          movie = state.favorites.find(m => m.id === Number(movieId));
        }

        if (movie) {
          store.toggleFavorite(movie);
          
          // Reactively update the button icon
          const isFav = store.isFavorite(movieId);
          button.classList.toggle('favorited', isFav);
          button.innerHTML = isFav ? HEART_SOLID : HEART_OUTLINE;

          // If we are currently on the favorites page, we should remove the card from the UI
          if (state.activeRoute === '#/favorites' && !isFav) {
            movieCard.style.opacity = '0';
            movieCard.style.transform = 'scale(0.8)';
            setTimeout(() => {
              movieCard.remove();
              if (container.children.length === 0) {
                this.renderEmptyState(container, 'You haven\'t added any favorites yet. Go to browse and click the ❤️ icon on your favorite movies!');
              }
            }, 300);
          }
        }
      });
    });
  },

  /**
   * Renders loading skeletons inside a container
   */
  renderSkeletons(container, count = 10, append = false) {
    if (!container) return;

    const skeletonsHtml = Array(count).fill(0).map(() => `
      <div class="movie-card skeleton-card">
        <div class="poster-wrapper skeleton-animation"></div>
        <div class="movie-info">
          <div class="skeleton-title skeleton-animation"></div>
          <div class="skeleton-meta skeleton-animation"></div>
        </div>
      </div>
    `).join('');

    if (append) {
      const temp = document.createElement('div');
      temp.innerHTML = skeletonsHtml;
      
      // Mark as skeleton wrapper to clean up later
      const skeletonWrapper = document.createElement('div');
      skeletonWrapper.className = 'skeleton-group';
      skeletonWrapper.innerHTML = skeletonsHtml;
      container.appendChild(skeletonWrapper);
    } else {
      container.innerHTML = skeletonsHtml;
    }
  },

  /**
   * Removes any appended skeleton loaders (used after infinite scroll fetch completes)
   */
  removeAppendedSkeletons(container) {
    if (!container) return;
    const skeletonGroups = container.querySelectorAll('.skeleton-group');
    skeletonGroups.forEach(g => g.remove());
  },

  /**
   * Renders empty state instructions
   */
  renderEmptyState(container, message) {
    if (!container) return;
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p class="empty-message">${message}</p>
      </div>
    `;
  },

  /**
   * Renders error state with retry callback
   */
  renderErrorState(container, message, onRetry) {
    if (!container) return;
    container.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-message">${message}</p>
        ${onRetry ? `<button class="retry-btn" id="retry-btn">Try Again</button>` : ''}
      </div>
    `;

    if (onRetry) {
      const btn = container.querySelector('#retry-btn');
      if (btn) {
        btn.addEventListener('click', onRetry);
      }
    }
  },

  /**
   * Renders the single AI Mood Matcher recommendation as a premium Featured Spotlight banner
   * @param {Object} movie - Movie details object
   * @param {HTMLElement} wrapper - Container element for the spotlight banner
   */
  renderAIMoodSpotlight(movie, wrapper) {
    if (!wrapper) return;
    
    if (!movie) {
      wrapper.innerHTML = '';
      wrapper.classList.remove('active');
      return;
    }

    wrapper.classList.add('active');
    
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
    const isFav = store.isFavorite(movie.id);
    const heartSvg = isFav ? HEART_SOLID : HEART_OUTLINE;
    const favClass = isFav ? 'favorited' : '';

    const backdropUrl = movie.backdrop_path 
      ? `${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.BACKDROP_SIZE}${movie.backdrop_path}`
      : '';
    
    const posterUrl = movie.poster_path
      ? `${CONFIG.TMDB_IMAGE_BASE_URL}/${CONFIG.POSTER_SIZE}${movie.poster_path}`
      : '';

    // Fallback banner poster in case of blockages
    const displayTitle = movie.title.length > 22 ? movie.title.substring(0, 19) + '...' : movie.title;
    const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="%23181818"/><rect x="15" y="15" width="270" height="420" rx="8" fill="none" stroke="%232e2e2e" stroke-width="2"/><text x="150" y="170" dominant-baseline="middle" text-anchor="middle" fill="%23E50914" font-family="system-ui,sans-serif" font-size="48" font-weight="bold">🎬</text><text x="150" y="250" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="system-ui,sans-serif" font-size="16" font-weight="bold">${encodeURIComponent(displayTitle)}</text></svg>`;

    wrapper.innerHTML = `
      <div class="mood-spotlight-banner" style="background-image: linear-gradient(to right, rgba(20, 20, 20, 0.95) 30%, rgba(20, 20, 20, 0.4) 70%, rgba(20, 20, 20, 0.95) 100%), url('${backdropUrl}')">
        <div class="spotlight-content">
          <div class="spotlight-badge">🔮 AI MOOD MATCH</div>
          <h2 class="spotlight-title">${movie.title}</h2>
          <div class="spotlight-meta">
            <span class="rating">★ ${rating} Rating</span>
            <span class="year">${year}</span>
          </div>
          <p class="spotlight-overview">${movie.overview || 'No overview description available for this recommendation.'}</p>
          <div class="spotlight-actions">
            <button class="spotlight-fav-btn ${favClass}" data-movie-id="${movie.id}">
              <span class="icon">${heartSvg}</span>
              <span class="text">${isFav ? 'In Favorites' : 'Add to Favorites'}</span>
            </button>
            <button class="spotlight-clear-btn" id="spotlight-clear-btn">Dismiss</button>
          </div>
        </div>
        ${posterUrl ? `
          <div class="spotlight-poster-container">
            <img 
              class="spotlight-poster" 
              src="${posterUrl}" 
              alt="${movie.title}" 
              loading="lazy" 
              onerror="this.onerror=null; this.src='${fallbackSvg}';"
            />
          </div>
        ` : ''}
      </div>
    `;

    // Attach listener for favorite button inside spotlight banner
    const favBtn = wrapper.querySelector('.spotlight-fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        store.toggleFavorite(movie);
        const updatedIsFav = store.isFavorite(movie.id);
        favBtn.classList.toggle('favorited', updatedIsFav);
        favBtn.querySelector('.icon').innerHTML = updatedIsFav ? HEART_SOLID : HEART_OUTLINE;
        favBtn.querySelector('.text').textContent = updatedIsFav ? 'In Favorites' : 'Add to Favorites';
        
        // Also update the card if it exists in the main grid
        const mainGridCardBtn = document.querySelector(`.movie-card[data-id="${movie.id}"] .favorite-toggle`);
        if (mainGridCardBtn) {
          mainGridCardBtn.classList.toggle('favorited', updatedIsFav);
          mainGridCardBtn.innerHTML = updatedIsFav ? HEART_SOLID : HEART_OUTLINE;
        }
      });
    }

    // Attach listener to dismiss spotlight banner
    const clearBtn = wrapper.querySelector('#spotlight-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        store.setState({ aiResult: null });
        this.renderAIMoodSpotlight(null, wrapper);
      });
    }
  }
};
