# Cine-Stream – Netflix-Lite Media Discovery App (Sprint 8)

## About the Project
Cine-Stream is a Netflix-lite **Single Page Application (SPA)** built using **Vanilla JavaScript**.

The main goal of this project is to understand **frontend performance optimization**, **on-demand data loading**, and **API request throttling** while working with large datasets.

In this app, users can browse popular movies, search movies, scroll infinitely without pagination, save favorites, and explore AI-assisted movie recommendations — all without reloading the browser.

---

## Data Used
All movie data is fetched from **The Movie Database (TMDB) API**:

https://developer.themoviedb.org/

For development and testing purposes, a mock data fallback is implemented when API keys are unavailable.

---

## Technologies Used
- HTML5  
- CSS3 (CSS Grid, Responsive Design)  
- Vanilla JavaScript (ES6+)  
- Fetch API  
- Intersection Observer API  
- Local Storage  
- Hash-based Routing  

> No frontend frameworks (React, Vue, etc.) were used.

---

## Project Features (Sprint 8)

### 1. Popular Movies Listing
- Popular movies are fetched from the TMDB API
- Movies are displayed in a responsive CSS Grid
- Each movie card shows:
  - Poster
  - Title
  - Release Year
  - Rating
- Loading, error, and empty states are handled properly

---

### 2. Search Functionality
- Users can search movies using a search input
- Search results are fetched from TMDB Search API
- Results are rendered dynamically without page reload

---

### 3. Debounced Search Optimization
- Search input uses **500ms debounce**
- API calls are not triggered on every keystroke
- Requests are made only after the user stops typing
- This significantly reduces unnecessary network calls

---

### 4. Infinite Scroll Implementation
- Traditional pagination is completely removed
- Infinite scrolling is implemented using **Intersection Observer**
- When the user reaches the bottom of the page:
  - Next page of movies is fetched
  - New movies are appended to the existing DOM
- This prevents DOM re-rendering and improves performance

---

### 5. Favorites Feature (State Persistence)
- Each movie card has a **Heart** button
- Users can add or remove movies from favorites
- Favorites are stored in `localStorage`
- A dedicated route `/favorites` displays saved movies
- Favorites persist even after page refresh

---

### 6. Client-Side Routing
- Hash-based routing is implemented
- Available routes:
  - `#/home` → Popular movies & search view
  - `#/favorites` → Saved favorite movies
- Page transitions happen without full reload

---

### 7. Image & Asset Optimization
- Movie posters use native lazy loading:
  - `loading="lazy"`
- Images are loaded only when they enter the viewport
- Optimized image size (`w342`) is used for better performance

---

### 8. AI Mood Matcher (Optional – Phase 3)
- Users can enter a mood or sentence (e.g. *“I feel sad but want action”*)
- AI converts the input into a **single movie title**
- That title is searched silently in TMDB
- The matching movie is rendered in the UI

---

