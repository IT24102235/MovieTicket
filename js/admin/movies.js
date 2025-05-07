/**
 * Admin Movies Management
 * Handles CRUD operations for movies including listing, creating, updating, and deleting movies
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initUI();
    
    // Load movie data
    loadMovies();
    
    // Event listeners
    setupEventListeners();
});

// Sample movie data for demonstration
const sampleMovies = [
    {
        id: 1,
        title: "Avatar 2: Way of Water",
        director: "James Cameron",
        releaseDate: "2022-12-16",
        duration: 192,
        rating: 4.8,
        status: "now-showing",
        genres: ["sci-fi", "action", "adventure"],
        cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
        description: "Jake Sully lives with his newfound family formed on the planet of Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their planet.",
        trailerLink: "https://www.youtube.com/watch?v=d9MyW72ELq0",
        price: 12.99,
        featured: true,
        poster: "https://via.placeholder.com/300x450?text=Avatar+2"
    },
    {
        id: 2,
        title: "Oppenheimer",
        director: "Christopher Nolan",
        releaseDate: "2023-07-21",
        duration: 180,
        rating: 4.7,
        status: "now-showing",
        genres: ["biography", "drama", "history"],
        cast: "Cillian Murphy, Emily Blunt, Matt Damon",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        trailerLink: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        price: 11.99,
        featured: false,
        poster: "https://via.placeholder.com/300x450?text=Oppenheimer"
    },
    {
        id: 3,
        title: "Dune: Part Two",
        director: "Denis Villeneuve",
        releaseDate: "2024-03-01",
        duration: 165,
        rating: 4.6,
        status: "now-showing",
        genres: ["sci-fi", "adventure", "drama"],
        cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
        description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        trailerLink: "https://www.youtube.com/watch?v=Way9Dexny3w",
        price: 12.99,
        featured: true,
        poster: "https://via.placeholder.com/300x450?text=Dune+2"
    },
    {
        id: 4,
        title: "Deadpool & Wolverine",
        director: "Shawn Levy",
        releaseDate: "2024-07-26",
        duration: 127,
        rating: 0,
        status: "coming-soon",
        genres: ["action", "comedy", "adventure"],
        cast: "Ryan Reynolds, Hugh Jackman",
        description: "Deadpool and Wolverine join forces for an epic adventure that will change the Marvel Cinematic Universe forever.",
        trailerLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 14.99,
        featured: false,
        poster: "https://via.placeholder.com/300x450?text=Deadpool+3"
    },
    {
        id: 5,
        title: "Joker: Folie à Deux",
        director: "Todd Phillips",
        releaseDate: "2024-10-04",
        duration: 140,
        rating: 0,
        status: "coming-soon",
        genres: ["crime", "drama", "thriller"],
        cast: "Joaquin Phoenix, Lady Gaga",
        description: "A sequel to the acclaimed 2019 film, focusing on Arthur Fleck's continued evolution into the iconic Batman villain.",
        trailerLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 13.99,
        featured: false,
        poster: "https://via.placeholder.com/300x450?text=Joker+2"
    }
];

// Initialize UI components like modal, select2, etc.
function initUI() {
    // Initialize Select2 for multi-select dropdowns
    if ($.fn.select2) {
        $('#genres').select2({
            placeholder: "Select genres",
            closeOnSelect: false,
            tags: true
        });
    }
    
    // Initialize popovers and tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize poster upload preview
    const posterUpload = document.getElementById('posterUpload');
    const posterInput = document.getElementById('posterInput');
    const posterPreview = document.getElementById('posterPreview');
    const posterPreviewContainer = document.getElementById('posterPreviewContainer');
    
    if (posterUpload && posterInput && posterPreview) {
        posterUpload.addEventListener('click', function() {
            posterInput.click();
        });
        
        posterInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    posterPreview.src = e.target.result;
                    posterPreview.classList.remove('d-none');
                    posterPreviewContainer.classList.add('d-none');
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// Load movies data and populate the table
function loadMovies() {
    const tableBody = document.getElementById('moviesList');
    const emptyState = document.getElementById('emptyMoviesState');
    const loadingState = document.getElementById('loadingState');
    
    if (tableBody && emptyState && loadingState) {
        // In a real app, this would be an AJAX call to the server
        setTimeout(() => {
            // Hide loading state
            loadingState.classList.add('d-none');
            
            if (sampleMovies.length === 0) {
                // Show empty state if no movies
                emptyState.classList.remove('d-none');
                return;
            }
            
            // Clear existing rows
            tableBody.innerHTML = '';
            
            // Add movies to table
            sampleMovies.forEach(movie => {
                const row = createMovieRow(movie);
                tableBody.appendChild(row);
            });
            
            // Set up row event listeners
            setupRowEventListeners();
        }, 1000); // Simulate network delay
    }
}

// Create a table row for a movie
function createMovieRow(movie) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', movie.id);
    
    // Format status badge
    let statusBadge;
    if (movie.status === 'now-showing') {
        statusBadge = '<span class="badge bg-success">Now Showing</span>';
    } else if (movie.status === 'coming-soon') {
        statusBadge = '<span class="badge bg-primary">Coming Soon</span>';
    } else {
        statusBadge = '<span class="badge bg-secondary">Archived</span>';
    }
    
    // Format release date
    const releaseDate = new Date(movie.status === 'coming-soon' ? movie.releaseDate : movie.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Format duration
    const hours = Math.floor(movie.duration / 60);
    const minutes = movie.duration % 60;
    const formattedDuration = `${hours}h ${minutes}m`;
    
    // Format genres
    const genreBadges = movie.genres.map(genre => {
        return `<span class="badge bg-light-primary text-primary me-1">${genre.charAt(0).toUpperCase() + genre.slice(1)}</span>`;
    }).join('');
    
    // Create row HTML
    row.innerHTML = `
        <td>
            <div class="form-check">
                <input class="form-check-input movie-checkbox" type="checkbox">
            </div>
        </td>
        <td>
            <div class="d-flex align-items-center">
                <div class="movie-poster me-3">
                    <img src="${movie.poster}" alt="${movie.title}" class="rounded">
                </div>
                <div>
                    <h6 class="mb-0">${movie.title}</h6>
                    <small class="text-muted">${movie.director}</small>
                </div>
            </div>
        </td>
        <td>${releaseDate}</td>
        <td>${formattedDuration}</td>
        <td>${genreBadges}</td>
        <td>${statusBadge}</td>
        <td>
            <div class="d-flex align-items-center">
                <i class="fas fa-star text-warning me-1"></i>
                <span>${movie.rating > 0 ? movie.rating : 'N/A'}</span>
            </div>
        </td>
        <td>
            <div class="d-flex">
                <button class="btn btn-sm btn-info me-1 view-movie-btn" data-bs-toggle="tooltip" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary me-1 edit-movie-btn" data-bs-toggle="tooltip" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-movie-btn" data-bs-toggle="tooltip" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Set up event listeners for the page
function setupEventListeners() {
    // Add new movie button
    const addMovieBtn = document.getElementById('addMovieBtn');
    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', function() {
            // Reset form for new movie
            resetMovieForm();
            // Set modal title for adding
            document.getElementById('movieModalTitle').textContent = 'Add New Movie';
        });
    }
    
    // Save movie button
    const saveMovieBtn = document.getElementById('saveMovieBtn');
    if (saveMovieBtn) {
        saveMovieBtn.addEventListener('click', saveMovie);
    }
    
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllMovies');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.movie-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchMovies');
    if (searchInput) {
        searchInput.addEventListener('input', filterMovies);
    }
    
    // Filter functionality
    const filterStatus = document.getElementById('filterStatus');
    const filterGenre = document.getElementById('filterGenre');
    if (filterStatus) filterStatus.addEventListener('change', filterMovies);
    if (filterGenre) filterGenre.addEventListener('change', filterMovies);
    
    // Reset filters
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (filterStatus) filterStatus.value = 'all';
            if (filterGenre) filterGenre.value = 'all';
            filterMovies();
        });
    }
    
    // Delete confirmation button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteMovie);
    }
    
    // Edit movie from view modal
    const editMovieFromViewBtn = document.getElementById('editMovieFromViewBtn');
    if (editMovieFromViewBtn) {
        editMovieFromViewBtn.addEventListener('click', function() {
            // Get movie ID from hidden field
            const movieId = document.getElementById('deleteMovieId').value;
            // Hide view modal and prepare edit modal
            const viewMovieModal = bootstrap.Modal.getInstance(document.getElementById('viewMovieModal'));
            viewMovieModal.hide();
            // Set up edit modal
            prepareEditModal(movieId);
            // Show edit modal
            const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
            movieModal.show();
        });
    }
}

// Set up event listeners for table rows
function setupRowEventListeners() {
    // View movie button
    const viewBtns = document.querySelectorAll('.view-movie-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const movieId = this.closest('tr').getAttribute('data-id');
            viewMovie(movieId);
        });
    });
    
    // Edit movie button
    const editBtns = document.querySelectorAll('.edit-movie-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const movieId = this.closest('tr').getAttribute('data-id');
            prepareEditModal(movieId);
        });
    });
    
    // Delete movie button
    const deleteBtns = document.querySelectorAll('.delete-movie-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const movieId = this.closest('tr').getAttribute('data-id');
            const movie = sampleMovies.find(m => m.id == movieId);
            
            if (movie) {
                document.getElementById('deleteMovieTitle').textContent = movie.title;
                document.getElementById('deleteMovieId').value = movieId;
                
                const deleteModal = new bootstrap.Modal(document.getElementById('deleteMovieModal'));
                deleteModal.show();
            }
        });
    });
}

// Filter movies based on search and filter criteria
function filterMovies() {
    const searchValue = document.getElementById('searchMovies').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const genreFilter = document.getElementById('filterGenre').value;
    
    const rows = document.querySelectorAll('#moviesList tr');
    
    rows.forEach(row => {
        const movieId = row.getAttribute('data-id');
        const movie = sampleMovies.find(m => m.id == movieId);
        
        if (!movie) return;
        
        let matchesSearch = true;
        let matchesStatus = true;
        let matchesGenre = true;
        
        // Check search
        if (searchValue !== '') {
            matchesSearch = movie.title.toLowerCase().includes(searchValue) || 
                            movie.director.toLowerCase().includes(searchValue);
        }
        
        // Check status
        if (statusFilter !== 'all') {
            matchesStatus = movie.status === statusFilter;
        }
        
        // Check genre
        if (genreFilter !== 'all') {
            matchesGenre = movie.genres.includes(genreFilter);
        }
        
        // Show/hide row based on combined filters
        if (matchesSearch && matchesStatus && matchesGenre) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Check if there are any visible rows
    const visibleRows = document.querySelectorAll('#moviesList tr[style=""]');
    const emptyState = document.getElementById('emptyMoviesState');
    const table = document.getElementById('moviesTable');
    
    if (visibleRows.length === 0) {
        if (table) table.classList.add('d-none');
        if (emptyState) emptyState.classList.remove('d-none');
    } else {
        if (table) table.classList.remove('d-none');
        if (emptyState) emptyState.classList.add('d-none');
    }
}

// View movie details
function viewMovie(movieId) {
    const movie = sampleMovies.find(m => m.id == movieId);
    
    if (movie) {
        // Populate movie details in view modal
        document.getElementById('viewMovieTitle').textContent = movie.title;
        document.getElementById('viewMoviePoster').src = movie.poster;
        document.getElementById('viewMovieDescription').textContent = movie.description;
        document.getElementById('viewMovieDirector').textContent = movie.director;
        
        // Format release date
        const releaseDate = new Date(movie.releaseDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('viewMovieReleaseDate').textContent = releaseDate;
        
        // Format duration
        const hours = Math.floor(movie.duration / 60);
        const minutes = movie.duration % 60;
        document.getElementById('viewMovieDuration').textContent = `${hours}h ${minutes}m (${movie.duration} min)`;
        
        // Format rating
        if (movie.rating > 0) {
            document.getElementById('viewMovieRating').innerHTML = `
                <i class="fas fa-star text-warning"></i>
                <span>${movie.rating}</span>
            `;
        } else {
            document.getElementById('viewMovieRating').textContent = 'Not rated yet';
        }
        
        // Format cast
        document.getElementById('viewMovieCast').textContent = movie.cast || 'Cast information not available';
        
        // Format status
        let statusBadge;
        if (movie.status === 'now-showing') {
            statusBadge = '<span class="badge bg-success">Now Showing</span>';
        } else if (movie.status === 'coming-soon') {
            statusBadge = '<span class="badge bg-primary">Coming Soon</span>';
        } else {
            statusBadge = '<span class="badge bg-secondary">Archived</span>';
        }
        document.getElementById('viewMovieStatus').innerHTML = statusBadge;
        
        // Format price
        document.getElementById('viewMoviePrice').textContent = `$${movie.price.toFixed(2)}`;
        
        // Format trailer link
        const trailerContainer = document.getElementById('viewMovieTrailerContainer');
        const trailerLink = document.getElementById('viewMovieTrailer');
        
        if (movie.trailerLink) {
            trailerLink.href = movie.trailerLink;
            trailerContainer.classList.remove('d-none');
        } else {
            trailerContainer.classList.add('d-none');
        }
        
        // Format genres
        const genreBadges = movie.genres.map(genre => {
            return `<span class="badge bg-light-primary text-primary me-1">${genre.charAt(0).toUpperCase() + genre.slice(1)}</span>`;
        }).join('');
        document.getElementById('viewMovieGenres').innerHTML = genreBadges;
        
        // Set movie ID for edit action
        document.getElementById('deleteMovieId').value = movieId;
        
        // Show modal
        const viewModal = new bootstrap.Modal(document.getElementById('viewMovieModal'));
        viewModal.show();
    }
}

// Prepare edit modal with movie data
function prepareEditModal(movieId) {
    const movie = sampleMovies.find(m => m.id == movieId);
    
    if (movie) {
        // Set form values
        document.getElementById('movieId').value = movie.id;
        document.getElementById('title').value = movie.title;
        document.getElementById('director').value = movie.director;
        document.getElementById('releaseDate').value = movie.releaseDate;
        document.getElementById('duration').value = movie.duration;
        document.getElementById('rating').value = movie.rating || '';
        document.getElementById('status').value = movie.status;
        document.getElementById('description').value = movie.description;
        document.getElementById('trailerLink').value = movie.trailerLink || '';
        document.getElementById('price').value = movie.price;
        document.getElementById('featured').checked = movie.featured;
        
        // Set movie poster preview
        const posterPreview = document.getElementById('posterPreview');
        const posterPreviewContainer = document.getElementById('posterPreviewContainer');
        if (posterPreview && posterPreviewContainer) {
            posterPreview.src = movie.poster;
            posterPreview.classList.remove('d-none');
            posterPreviewContainer.classList.add('d-none');
        }
        
        // Set genres (Select2)
        if ($.fn.select2) {
            $('#genres').val(movie.genres).trigger('change');
        } else {
            // Fallback for plain select
            const genresSelect = document.getElementById('genres');
            if (genresSelect) {
                Array.from(genresSelect.options).forEach(option => {
                    option.selected = movie.genres.includes(option.value);
                });
            }
        }
        
        // Set modal title
        document.getElementById('movieModalTitle').textContent = 'Edit Movie: ' + movie.title;
        
        // Show modal
        const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
        movieModal.show();
    }
}

// Reset movie form for adding new movie
function resetMovieForm() {
    document.getElementById('movieForm').reset();
    document.getElementById('movieId').value = '';
    
    // Reset poster preview
    const posterPreview = document.getElementById('posterPreview');
    const posterPreviewContainer = document.getElementById('posterPreviewContainer');
    if (posterPreview && posterPreviewContainer) {
        posterPreview.classList.add('d-none');
        posterPreviewContainer.classList.remove('d-none');
    }
    
    // Reset genres (Select2)
    if ($.fn.select2) {
        $('#genres').val([]).trigger('change');
    }
}

// Save movie (add new or update existing)
function saveMovie() {
    // Get form values
    const movieId = document.getElementById('movieId').value;
    const title = document.getElementById('title').value;
    const director = document.getElementById('director').value;
    const releaseDate = document.getElementById('releaseDate').value;
    const duration = parseInt(document.getElementById('duration').value);
    const rating = parseFloat(document.getElementById('rating').value) || 0;
    const status = document.getElementById('status').value;
    const description = document.getElementById('description').value;
    const trailerLink = document.getElementById('trailerLink').value;
    const price = parseFloat(document.getElementById('price').value);
    const featured = document.getElementById('featured').checked;
    
    // Get genres
    let genres = [];
    if ($.fn.select2) {
        genres = $('#genres').val();
    } else {
        // Fallback for plain select
        const genresSelect = document.getElementById('genres');
        if (genresSelect) {
            genres = Array.from(genresSelect.selectedOptions).map(option => option.value);
        }
    }
    
    // Get poster
    const posterInput = document.getElementById('posterInput');
    let poster = 'https://via.placeholder.com/300x450?text=' + encodeURIComponent(title);
    
    // Validate form
    if (!title || !releaseDate || !duration || !status || !description || !price || genres.length === 0) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }
    
    // Create movie object
    const movieData = {
        title,
        director,
        releaseDate,
        duration,
        rating,
        status,
        genres,
        description,
        trailerLink,
        price,
        featured,
        poster
    };
    
    // Simulate loading state
    const saveButton = document.getElementById('saveMovieBtn');
    const originalText = saveButton.innerHTML;
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving...';
    
    setTimeout(() => {
        if (movieId) {
            // Update existing movie
            updateMovie(movieId, movieData);
        } else {
            // Add new movie
            addMovie(movieData);
        }
        
        // Hide modal
        const movieModal = bootstrap.Modal.getInstance(document.getElementById('movieModal'));
        movieModal.hide();
        
        // Reset button state
        saveButton.disabled = false;
        saveButton.innerHTML = originalText;
    }, 1000);
}

// Add new movie
function addMovie(movieData) {
    // In a real app, this would be an AJAX call to the server
    // For demo, we'll just add to the sample data
    
    // Generate new ID (would be done by server in real app)
    const newId = Math.max(...sampleMovies.map(m => m.id), 0) + 1;
    
    // Add ID to movie data
    movieData.id = newId;
    
    // Add to sample data
    sampleMovies.push(movieData);
    
    // Reload movies table
    loadMovies();
    
    // Show success message
    showAlert(`Movie "${movieData.title}" has been added successfully.`, 'success');
}

// Update existing movie
function updateMovie(movieId, movieData) {
    // In a real app, this would be an AJAX call to the server
    // For demo, we'll just update the sample data
    
    const index = sampleMovies.findIndex(m => m.id == movieId);
    
    if (index !== -1) {
        // Keep the ID and poster (unless changed)
        movieData.id = sampleMovies[index].id;
        if (!movieData.poster) {
            movieData.poster = sampleMovies[index].poster;
        }
        
        // Update the movie
        sampleMovies[index] = movieData;
        
        // Reload movies table
        loadMovies();
        
        // Show success message
        showAlert(`Movie "${movieData.title}" has been updated successfully.`, 'success');
    }
}

// Delete movie
function deleteMovie() {
    const movieId = document.getElementById('deleteMovieId').value;
    
    if (movieId) {
        // In a real app, this would be an AJAX call to the server
        // For demo, we'll just remove from the sample data
        
        const index = sampleMovies.findIndex(m => m.id == movieId);
        
        if (index !== -1) {
            const movieTitle = sampleMovies[index].title;
            
            // Remove the movie
            sampleMovies.splice(index, 1);
            
            // Reload movies table
            loadMovies();
            
            // Hide modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteMovieModal'));
            deleteModal.hide();
            
            // Show success message
            showAlert(`Movie "${movieTitle}" has been deleted successfully.`, 'success');
        }
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    
    if (alertContainer) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show alert-animate`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alertContainer.removeChild(alert);
            }, 300);
        }, 5000);
    }
}
