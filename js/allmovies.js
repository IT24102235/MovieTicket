document.addEventListener('DOMContentLoaded', function() {
    loadAllMovies();
    setupEventListeners();
});

// Function to load all movies
async function loadAllMovies() {
    try {
        const response = await fetch('/api/movies');
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
        showError('Failed to load movies. Please try again later.');
    }
}

// Function to display movies in the grid
function displayMovies(movies) {
    const moviesContainer = document.getElementById('moviesContainer');
    if (!moviesContainer) return;

    // Clear existing content
    moviesContainer.innerHTML = '';

    if (movies.length === 0) {
        moviesContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No movies available at the moment.</p>
            </div>
        `;
        return;
    }

    // Create and append movie cards
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesContainer.appendChild(movieCard);
    });
}

// Function to create a movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
    card.innerHTML = `
        <div class="movie-card">
            <div class="movie-poster">
                <img src="${movie.posterUrl}" alt="${movie.title}">
                <div class="movie-overlay">
                    <div class="movie-meta-overlay">
                        <span><i class="far fa-clock"></i> ${movie.duration} min</span>
                        <span><i class="fas fa-star"></i> ${movie.rating || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-genres">
                    ${movie.genres.map(genre => `<span class="badge bg-primary me-1">${genre}</span>`).join('')}
                </div>
                <div class="movie-actions">
                    <button class="btn-book" onclick="location.href='movie.html?id=${movie.id}';">Book Now</button>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Function to show error messages
function showError(message) {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
}

// Function to setup event listeners
function setupEventListeners() {
    // Add any event listeners here
    // For example, search functionality, filters, etc.
} 