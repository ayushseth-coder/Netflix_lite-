import { CONFIG } from '../config/config.js';

// High-fidelity mock dataset consisting of 40 movies (2 pages of 20 movies)
// with actual TMDB poster paths to ensure beautiful visual rendering even in offline/mock mode.
const MOCK_MOVIES = [
  // Page 1
  {
    id: 1022789,
    title: "Inside Out 2",
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!",
    poster_path: "/vpnVM9B62m24TCZv60RrmAa43Cl.jpg",
    backdrop_path: "/stKGOmwmOt2sw2Cr6l9zSI85XwL.jpg",
    release_date: "2024-06-11",
    vote_average: 7.6,
    genre_ids: [16, 10751, 35]
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    overview: "A listless Wade Wilson toils in civilian life. His efforts as a moral mercenary behind him, when his homeworld faces an existential threat, Wade must reluctantly suit-up again.",
    poster_path: "/8cdcl36Ex8e2E4NyqMKPEdZ6i3Y.jpg",
    backdrop_path: "/yD17BMV6zc78WigE9Z2j277GE4q.jpg",
    release_date: "2024-07-24",
    vote_average: 7.8,
    genre_ids: [28, 35, 878]
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    poster_path: "/czembDcB20etadU324NhR75l2ig.jpg",
    backdrop_path: "/xOMo8xs2eQ4n24bY24AKpIRuuu5.jpg",
    release_date: "2024-02-27",
    vote_average: 8.2,
    genre_ids: [878, 12]
  },
  {
    id: 872585,
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "/8Gxv2wS6mJ6D3a2X31km1G3jR2Y.jpg",
    backdrop_path: "/rM562Wl97uVPI7qL70Q54nK311Z.jpg",
    release_date: "2023-07-19",
    vote_average: 8.1,
    genre_ids: [18, 36]
  },
  {
    id: 346698,
    title: "Barbie",
    overview: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    poster_path: "/iuFNMSgxchqgXkOmk621rKJZLVl.jpg",
    backdrop_path: "/ctmNee2eArR727CD55EBXzi1FQa.jpg",
    release_date: "2023-07-19",
    vote_average: 7.1,
    genre_ids: [35, 12, 14]
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    poster_path: "/8Vt1tTT487j6aLNvUkrtvR16d3f.jpg",
    backdrop_path: "/4Hodj2QLXJ2rmgd07dPA4HTi6uC.jpg",
    release_date: "2023-05-31",
    vote_average: 8.4,
    genre_ids: [16, 28, 12, 878]
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2Qv0w3RhvjhY6ygoPtGhZPtC.jpg",
    backdrop_path: "/xJHokZ86CTyvFD8VmKI13SpZIL0.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    genre_ids: [12, 18, 878]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who is absolute best in the dangerous art of extraction, steals valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable.",
    poster_path: "/o0OkiMK70644YP2fR3G4P4i6U5fb.jpg",
    backdrop_path: "/s3TBrRGB1q7jYJD1wF646KnsE5h.jpg",
    release_date: "2010-07-15",
    vote_average: 8.3,
    genre_ids: [28, 878, 12]
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tWGB2XclmAEqiN5n6NWEs2dR.jpg",
    backdrop_path: "/nMKdUUepw0i7zsXcE1QgcUv25Qx.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    genre_ids: [18, 28, 80, 53]
  },
  {
    id: 603,
    title: "The Matrix",
    overview: "Set in the 22nd century, a computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster_path: "/f89U3wz6oo2eKVnEBn2w0g0C969.jpg",
    backdrop_path: "/lh5gzxic31Clf498Rh9kS3nSV38.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    genre_ids: [28, 878]
  },
  {
    id: 76600,
    title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    poster_path: "/t6z2a406V21upK0VD78j6xH6nPq.jpg",
    backdrop_path: "/s16H6tpK2ut00w2u2KTE6436RQQ.jpg",
    release_date: "2022-12-14",
    vote_average: 7.6,
    genre_ids: [878, 12, 28]
  },
  {
    id: 361743,
    title: "Top Gun: Maverick",
    overview: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
    poster_path: "/62HCn31LRSy6v67krE6P6Qf6P5q.jpg",
    backdrop_path: "/odJ45611gMinWx19xZ4w3H4t45n.jpg",
    release_date: "2022-05-24",
    vote_average: 8.2,
    genre_ids: [28, 18]
  },
  {
    id: 667538,
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    poster_path: "/w345v6tRSNq4iH4Jy61vQD45hCW.jpg",
    backdrop_path: "/2285a73L215q4twav94W63m5yOi.jpg",
    release_date: "2022-03-24",
    vote_average: 7.8,
    genre_ids: [28, 12, 878, 35]
  },
  {
    id: 634649,
    title: "Spider-Man: No Way Home",
    overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    poster_path: "/1g0dhpeiroJeew9Gv6V1YSv15IF.jpg",
    backdrop_path: "/14574aW2j10a4v19K26Qd35c18R.jpg",
    release_date: "2021-12-15",
    vote_average: 7.9,
    genre_ids: [28, 12, 878]
  },
  {
    id: 496243,
    title: "Parasite",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster_path: "/7IiTT05Z212z17nBkgTxt2E40W7.jpg",
    backdrop_path: "/hiKmq4ArQC6Fi4bCcSRl829m5iI.jpg",
    release_date: "2019-05-30",
    vote_average: 8.5,
    genre_ids: [35, 53, 18]
  },
  {
    id: 475557,
    title: "Joker",
    overview: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
    poster_path: "/udDclsv60r161w4czBBT60d17N0.jpg",
    backdrop_path: "/n6bUie0tm7g157C9qVVF4PliXnv.jpg",
    release_date: "2019-10-02",
    vote_average: 8.2,
    genre_ids: [80, 53, 18]
  },
  {
    id: 299534,
    title: "Avengers: Endgame",
    overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    poster_path: "/or06456hxclAIK1TAw4oIEepB51.jpg",
    backdrop_path: "/7RyGs54lZq14rV44rHYuOTy3n93.jpg",
    release_date: "2019-04-24",
    vote_average: 8.3,
    genre_ids: [28, 12, 878]
  },
  {
    id: 324857,
    title: "Spider-Man: Into the Spider-Verse",
    overview: "Miles Morales is juggling his life between being a high school student and being Spider-Man. However, when Wilson \"Kingpin\" Fisk uses a super collider, another Spider-Man from another dimension, Peter Parker, accidentally winds up in Miles' dimension.",
    poster_path: "/iiIKrTE4i65Wg147Bh79OIU0jQd.jpg",
    backdrop_path: "/772Q2p7LIc575lhWg6mKwt8nIsu.jpg",
    release_date: "2018-12-06",
    vote_average: 8.4,
    genre_ids: [16, 28, 12, 878]
  },
  {
    id: 76341,
    title: "Mad Max: Fury Road",
    overview: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and almost everyone is crazed fighting for the necessities of life.",
    poster_path: "/8tZYrjW5w7nU7V2XYnGYs2o2ZGw.jpg",
    backdrop_path: "/tbhSSz5B4Vst9M26955T0m2Ao4X.jpg",
    release_date: "2015-05-13",
    vote_average: 8.0,
    genre_ids: [28, 12, 878, 53]
  },
  {
    id: 98,
    title: "Gladiator",
    overview: "A combat veteran general is demoted to a slave gladiator, who rises to prominence in the colosseum to avenge the murder of his emperor and family.",
    poster_path: "/ty87ILCo6U1CFE30krgBFRLOLUp.jpg",
    backdrop_path: "/eIiK2segh20Mx7o2n38386vYTfg.jpg",
    release_date: "2000-05-01",
    vote_average: 8.2,
    genre_ids: [28, 12, 18]
  },

  // Page 2
  {
    id: 120,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring, must leave his home behind and journey to Mount Doom to destroy it.",
    poster_path: "/6oom5Q4QA1666qj4764ZRLjajlh.jpg",
    backdrop_path: "/kWYfW2wWTMK589nSRa8s6A4LTIV.jpg",
    release_date: "2001-12-18",
    vote_average: 8.4,
    genre_ids: [12, 14, 28]
  },
  {
    id: 121,
    title: "The Lord of the Rings: The Two Towers",
    overview: "Frodo and Sam discover they are being followed by the mysterious Gollum, while Aragorn, Legolas, and Gimli make a stand at Helm's Deep.",
    poster_path: "/5VT87bZ5jOWu7STJ3rrjJDw91FF.jpg",
    backdrop_path: "/goS9s2zX7vL0pWkXvAEvb6LpB8K.jpg",
    release_date: "2002-12-18",
    vote_average: 8.4,
    genre_ids: [12, 14, 28]
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the members of the broken fellowship struggle to save Gondor from Sauron's forces.",
    poster_path: "/rC54295bsR6dfKEzK6TVR3P0434.jpg",
    backdrop_path: "/lX58nkEgAxZ787ssJJA7Z2nBzGe.jpg",
    release_date: "2003-12-01",
    vote_average: 8.5,
    genre_ids: [12, 14, 28]
  },
  {
    id: 11,
    title: "Star Wars: Episode IV - A New Hope",
    overview: "Princess Leia is captured by the Galactic Empire. Luke Skywalker teams up with Han Solo and Obi-Wan Kenobi to rescue her and save the galaxy.",
    poster_path: "/6FfDcie436U1yw50oKA79avSRRz.jpg",
    backdrop_path: "/d85qd44Bjcu0j769g05Eg7J4ux7.jpg",
    release_date: "1977-05-25",
    vote_average: 8.2,
    genre_ids: [12, 28, 878]
  },
  {
    id: 1891,
    title: "Star Wars: Episode V - The Empire Strikes Back",
    overview: "The Empire hunts the rebels across the galaxy. Luke Skywalker begins his Jedi training under master Yoda, while Han Solo and Leia are chased by Darth Vader.",
    poster_path: "/nNzYY5g3gD2G2v2eL3c6b2u3x22.jpg",
    backdrop_path: "/amYk45eg7CQ2nSQ46Jv17JjEs5K.jpg",
    release_date: "1980-05-20",
    vote_average: 8.4,
    genre_ids: [12, 28, 878]
  },
  {
    id: 1892,
    title: "Star Wars: Episode VI - Return of the Jedi",
    overview: "Luke Skywalker attempts to bring his father Darth Vader back to the light side, while the Rebels launch a desperate attack on the second Death Star.",
    poster_path: "/jQD9v2nN54Bpycvy6b6Yw7nUkLh.jpg",
    backdrop_path: "/9gMDD3XvU4D1uX4YI6nFpxB6149.jpg",
    release_date: "1983-05-25",
    vote_average: 8.0,
    genre_ids: [12, 28, 878]
  },
  {
    id: 680,
    title: "Pulp Fiction",
    overview: "A burger-loving hitman, his philosophical partner, a boxer, and a gangster's wife cross paths in a series of bizarre and violent incidents.",
    poster_path: "/d5iLLZ7LiJGVEhuT6s0wV17J5EV.jpg",
    backdrop_path: "/sua7v0A786OmR208615s62ku60I.jpg",
    release_date: "1994-09-10",
    vote_average: 8.5,
    genre_ids: [53, 80]
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    poster_path: "/9cqN0w3yZ7m4z1JjveJZmJ44iA5.jpg",
    backdrop_path: "/kXfqK2UBuQQypy0446R07u20c2z.jpg",
    release_date: "1994-09-23",
    vote_average: 8.7,
    genre_ids: [18, 80]
  },
  {
    id: 550,
    title: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel male aggression into a shocking new form of therapy.",
    poster_path: "/pB8BM7m15g9t56v3eXf6t2gQ475.jpg",
    backdrop_path: "/874m6c729g5v3eXf6t2gQ475.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    genre_ids: [18, 53]
  },
  {
    id: 13,
    title: "Forrest Gump",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
    poster_path: "/arw2CVrqJ5sCKbLwtwJa0ewnzup.jpg",
    backdrop_path: "/qdIMHd4YrcoG7yY5NEfs2o2ZGw1.jpg",
    release_date: "1994-06-23",
    vote_average: 8.5,
    genre_ids: [35, 18, 10749]
  },
  {
    id: 8587,
    title: "The Lion King",
    overview: "A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. Years later, he returns to reclaim his throne.",
    poster_path: "/s0cplX6a5aQ59u2XzC5Q3A2W14Y.jpg",
    backdrop_path: "/v5fU4D1uX4YI6nFpxB6149gMDD.jpg",
    release_date: "1994-06-23",
    vote_average: 8.3,
    genre_ids: [16, 10751, 12, 18]
  },
  {
    id: 129,
    title: "Spirited Away",
    overview: "A ten-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    poster_path: "/39wmItIWsg241HaqRLH26LJgHch.jpg",
    backdrop_path: "/39wmItIWsg241HaqRLH26LJgHch.jpg",
    release_date: "2001-07-20",
    vote_average: 8.5,
    genre_ids: [16, 10751, 14]
  },
  {
    id: 149,
    title: "Princess Mononoke",
    overview: "On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.",
    poster_path: "/qG3RYlIVpTYO7x7ewz1vTYO7x7ew.jpg",
    backdrop_path: "/qG3RYlIVpTYO7x7ewz1vTYO7x7ew.jpg",
    release_date: "1997-07-12",
    vote_average: 8.3,
    genre_ids: [16, 12, 14, 28]
  },
  {
    id: 372058,
    title: "Your Name.",
    overview: "Two strangers find themselves linked in a bizarre way. When a connection is formed, will distance be the only thing to keep them apart?",
    poster_path: "/q719jB45m363aYGo8Y0crfbJcuQ.jpg",
    backdrop_path: "/q719jB45m363aYGo8Y0crfbJcuQ.jpg",
    release_date: "2016-08-26",
    vote_average: 8.5,
    genre_ids: [16, 18, 14, 10749]
  },
  {
    id: 244786,
    title: "Whiplash",
    overview: "Under the direction of a ruthless instructor, a talented young drummer begins his pursuit of perfection at any cost.",
    poster_path: "/7IiTT05Z212z17nBkgTxt2E40W7.jpg",
    backdrop_path: "/hiKmq4ArQC6Fi4bCcSRl829m5iI.jpg",
    release_date: "2014-10-10",
    vote_average: 8.4,
    genre_ids: [18, 10402]
  },
  {
    id: 313369,
    title: "La La Land",
    overview: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    poster_path: "/u7CH43c68e7j6aLNvUkrtvR16d3.jpg",
    backdrop_path: "/u7CH43c68e7j6aLNvUkrtvR16d3.jpg",
    release_date: "2016-11-29",
    vote_average: 7.9,
    genre_ids: [35, 18, 10749, 10402]
  },
  {
    id: 68718,
    title: "Django Unchained",
    overview: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
    poster_path: "/7IiTT05Z212z17nBkgTxt2E40W7.jpg",
    backdrop_path: "/hiKmq4ArQC6Fi4bCcSRl829m5iI.jpg",
    release_date: "2012-12-25",
    vote_average: 8.2,
    genre_ids: [18, 37]
  },
  {
    id: 106646,
    title: "The Wolf of Wall Street",
    overview: "A New York stockbroker refuses to cooperate in a large securities fraud case involving corruption on Wall Street and the corporate banking world.",
    poster_path: "/jQD9v2nN54Bpycvy6b6Yw7nUkLh.jpg",
    backdrop_path: "/9gMDD3XvU4D1uX4YI6nFpxB6149.jpg",
    release_date: "2013-12-25",
    vote_average: 8.0,
    genre_ids: [80, 18, 35]
  },
  {
    id: 335984,
    title: "Blade Runner 2049",
    overview: "A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    poster_path: "/gEU2Qv0w3RhvjhY6ygoPtGhZPtC.jpg",
    backdrop_path: "/xJHokZ86CTyvFD8VmKI13SpZIL0.jpg",
    release_date: "2017-10-04",
    vote_average: 7.5,
    genre_ids: [878, 53]
  },
  {
    id: 329865,
    title: "Arrival",
    overview: "Taking place after alien spacecrafts land around the world, a linguistics professor is recruited by the military to determine their intentions.",
    poster_path: "/xOMo8xs2eQ4n24bY24AKpIRuuu5.jpg",
    backdrop_path: "/xOMo8xs2eQ4n24bY24AKpIRuuu5.jpg",
    release_date: "2016-11-10",
    vote_average: 7.6,
    genre_ids: [878, 18, 9648, 53]
  }
];

// Helper to check if API key is valid (not the default placeholder)
const isApiKeyConfigured = () => {
  return (
    CONFIG.TMDB_API_KEY &&
    CONFIG.TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE' &&
    CONFIG.TMDB_API_KEY.trim() !== ''
  );
};

export const tmdbService = {
  /**
   * Fetches popular movies from TMDB or falls back to mock data
   * @param {number} page - Page number to fetch (starts at 1)
   * @returns {Promise<{results: Array, page: number, total_pages: number}>}
   */
  async getPopularMovies(page = 1) {
    if (CONFIG.FORCE_MOCK_DATA || !isApiKeyConfigured()) {
      console.warn("TMDB Service: API Key not configured or FORCE_MOCK_DATA is true. Using fallback mock data.");
      return this._getMockPopularMovies(page);
    }

    try {
      const url = `${CONFIG.TMDB_BASE_URL}/movie/popular?api_key=${CONFIG.TMDB_API_KEY}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        results: data.results,
        page: data.page,
        total_pages: data.total_pages
      };
    } catch (error) {
      console.error("TMDB Service: Fetch popular movies failed. Falling back to mock data.", error);
      return this._getMockPopularMovies(page);
    }
  },

  /**
   * Searches movies on TMDB or falls back to filtering mock data
   * @param {string} query - Search string
   * @param {number} page - Page number to fetch
   * @returns {Promise<{results: Array, page: number, total_pages: number}>}
   */
  async searchMovies(query, page = 1) {
    if (!query || query.trim() === '') {
      return { results: [], page: 1, total_pages: 1 };
    }

    if (CONFIG.FORCE_MOCK_DATA || !isApiKeyConfigured()) {
      console.warn("TMDB Service: API Key not configured or FORCE_MOCK_DATA is true. Searching inside local mock data.");
      return this._searchMockMovies(query, page);
    }

    try {
      const url = `${CONFIG.TMDB_BASE_URL}/search/movie?api_key=${CONFIG.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        results: data.results,
        page: data.page,
        total_pages: data.total_pages
      };
    } catch (error) {
      console.error(`TMDB Service: Search failed for "${query}". Falling back to mock search.`, error);
      return this._searchMockMovies(query, page);
    }
  },

  /**
   * Internal helper to serve chunked mock popular movies (20 per page)
   */
  _getMockPopularMovies(page) {
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const results = MOCK_MOVIES.slice(startIndex, endIndex);
    const totalPages = Math.ceil(MOCK_MOVIES.length / itemsPerPage);

    return new Promise((resolve) => {
      // Simulate network delay of 300ms for realistic loading animations
      setTimeout(() => {
        resolve({
          results,
          page,
          total_pages: totalPages
        });
      }, 0);
    });
  },

  /**
   * Internal helper to filter local mock movies based on query string
   */
  _searchMockMovies(query, page) {
    const lowerQuery = query.toLowerCase().trim();
    
    // Filter by title or description matching query
    const filtered = MOCK_MOVIES.filter(movie => 
      movie.title.toLowerCase().includes(lowerQuery) || 
      movie.overview.toLowerCase().includes(lowerQuery)
    );

    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const results = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          results,
          page,
          total_pages: totalPages || 1
        });
      }, 0);
    });
  }
};
export { MOCK_MOVIES };
