 // Sample movie data (in a real app, this would come from an API)
const moviesData = [
  {
    id: 1,
    title: "The Dark Knight",
    year: 2008,
    genre: "action",
    rating: 9.0,
    poster: "images/Posters/The Dark Knight.png", // ← Your image path
    description: "When the menace known as the Joker..."
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    genre: "sci-fi",
    rating: 8.8,
    poster: "images/Posters/Inception.png", // ← Your image path
    description: "A thief who steals corporate secrets..."
  },
  {
    id: 3,
    title: "The Hangover",
    year: 2009,
    genre: "comedy",
    rating: 7.7,
    poster: "images/Posters/The Hangover Part 1.png", // ← Your image path
    description: "Three buddies wake up from a bachelor party..."
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "drama",
    rating: 9.3,
    poster: "images/Posters/Shawshank Redemption.png",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    id: 5,
    title: "Get Out",
    year: 2017,
    genre: "horror",
    rating: 7.7,
    poster: "images/Posters/Get Out.png",
    description:
      "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
  },
  {
    id: 6,
    title: "Mad Max: Fury Road",
    year: 2015,
    genre: "action",
    rating: 8.1,
    poster: "images/Posters/Madmax.png",
    description:
      "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners.",
  },
  {
    id: 7,
    title: "Superbad",
    year: 2007,
    genre: "comedy",
    rating: 7.6,
    poster: "/images/Posters/Superbad.png",
    description:
      "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
  },
  {
    id: 8,
    title: "Parasite",
    year: 2019,
    genre: "drama",
    rating: 8.6,
    poster: "/placeholder.svg?height=350&width=250",
    description:
      "A poor family schemes to become employed by a wealthy family by infiltrating their household and posing as unrelated, highly qualified individuals.",
  },
]

// DOM Elements
const moviesGrid = document.getElementById("moviesGrid")
const filterBtns = document.querySelectorAll(".filter-btn")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const loadMoreBtn = document.getElementById("loadMoreBtn")
const modal = document.getElementById("movieModal")
const closeModal = document.querySelector(".close")
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const loadingSpinner = document.getElementById("loadingSpinner")

// State variables
let currentFilter = "all"
let currentMovies = [...moviesData]
let displayedMovies = 6

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  displayMovies(currentMovies.slice(0, displayedMovies))
  setupEventListeners()
  setupSmoothScrolling()
  setupScrollEffects()
})

// Display movies in the grid
function displayMovies(movies) {
  if (movies.length === 0) {
    moviesGrid.innerHTML = '<p class="no-movies">No movies found matching your criteria.</p>'
    return
  }

  moviesGrid.innerHTML = movies
    .map(
      (movie) => `
        <div class="movie-card" data-movie-id="${movie.id}">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.year}</span>
                    <span class="movie-rating">
                        <i class="fas fa-star"></i>
                        ${movie.rating}
                    </span>
                </div>
                <p class="movie-description">${movie.description}</p>
            </div>
        </div>
    `,
    )
    .join("")

  // Add click event listeners to movie cards
  document.querySelectorAll(".movie-card").forEach((card) => {
    card.addEventListener("click", function () {
      const movieId = Number.parseInt(this.dataset.movieId)
      openMovieModal(movieId)
    })
  })
}

// Filter movies by genre
function filterMovies(genre) {
  showLoading()

  setTimeout(() => {
    currentFilter = genre
    displayedMovies = 6

    if (genre === "all") {
      currentMovies = [...moviesData]
    } else {
      currentMovies = moviesData.filter((movie) => movie.genre === genre)
    }

    displayMovies(currentMovies.slice(0, displayedMovies))
    updateLoadMoreButton()
    hideLoading()
  }, 500)
}

// Search movies
function searchMovies(query) {
  showLoading()

  setTimeout(() => {
    const searchTerm = query.toLowerCase()
    currentMovies = moviesData.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm),
    )

    displayedMovies = 6
    displayMovies(currentMovies.slice(0, displayedMovies))
    updateLoadMoreButton()
    hideLoading()
  }, 500)
}

// Load more movies
function loadMoreMovies() {
  showLoading()

  setTimeout(() => {
    displayedMovies += 6
    displayMovies(currentMovies.slice(0, displayedMovies))
    updateLoadMoreButton()
    hideLoading()
  }, 500)
}

// Update load more button visibility
function updateLoadMoreButton() {
  if (displayedMovies >= currentMovies.length) {
    loadMoreBtn.style.display = "none"
  } else {
    loadMoreBtn.style.display = "block"
  }
}

// Open movie modal
function openMovieModal(movieId) {
  const movie = moviesData.find((m) => m.id === movieId)
  if (!movie) return

  document.getElementById("modalImage").src = movie.poster
  document.getElementById("modalTitle").textContent = movie.title
  document.getElementById("modalYear").textContent = movie.year
  document.getElementById("modalGenre").textContent = movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)
  document.getElementById("modalRating").textContent = `★ ${movie.rating}`
  document.getElementById("modalDescription").textContent = movie.description

  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Close movie modal
function closeMovieModal() {
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

// Show loading spinner
function showLoading() {
  loadingSpinner.style.display = "flex"
}

// Hide loading spinner
function hideLoading() {
  loadingSpinner.style.display = "none"
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Filter movies
      const genre = this.dataset.filter
      filterMovies(genre)
    })
  })

  // Search functionality
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim()
    if (query) {
      searchMovies(query)
    }
  })

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const query = this.value.trim()
      if (query) {
        searchMovies(query)
      }
    }
  })

  // Load more button
  loadMoreBtn.addEventListener("click", loadMoreMovies)

  // Modal events
  closeModal.addEventListener("click", closeMovieModal)

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeMovieModal()
    }
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("active")
    this.classList.toggle("active")
  })

  // Genre cards
  document.querySelectorAll(".genre-card").forEach((card) => {
    card.addEventListener("click", function () {
      const genre = this.dataset.genre

      // Update filter and scroll to movies section
      filterBtns.forEach((btn) => {
        btn.classList.remove("active")
        if (btn.dataset.filter === genre) {
          btn.classList.add("active")
        }
      })

      filterMovies(genre)

      // Scroll to movies section
      document.getElementById("movies").scrollIntoView({
        behavior: "smooth",
      })
    })
  })

  // Navigation active state
  window.addEventListener("scroll", updateActiveNavLink)
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }

      // Close mobile menu if open
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    })
  })
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

// Setup scroll effects
function setupScrollEffects() {
  // Header background on scroll
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")
    if (window.scrollY > 100) {
      header.style.background = "rgba(10, 10, 10, 0.98)"
    } else {
      header.style.background = "rgba(10, 10, 10, 0.95)"
    }
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".movie-card, .genre-card, .about-content").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Utility function to debounce search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add debounced search
const debouncedSearch = debounce(searchMovies, 300)
searchInput.addEventListener("input", function () {
  const query = this.value.trim()
  if (query.length > 2) {
    debouncedSearch(query)
  } else if (query.length === 0) {
    filterMovies(currentFilter)
  }
})

// Add some interactive features
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effects to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Add click animation to movie cards
  document.addEventListener("click", (e) => {
    if (e.target.closest(".movie-card")) {
      const card = e.target.closest(".movie-card")
      card.style.transform = "scale(0.98)"
      setTimeout(() => {
        card.style.transform = ""
      }, 150)
    }
  })
})

// Initialize load more button state
updateLoadMoreButton()

console.log("🎬 Ambrozz MovieHub Movie Website Loaded Successfully!")
console.log("Features included:")
console.log("- Responsive design")
console.log("- Movie filtering and search")
console.log("- Interactive modals")
console.log("- Smooth scrolling navigation")
console.log("- Loading animations")
console.log("- Mobile-friendly hamburger menu")

