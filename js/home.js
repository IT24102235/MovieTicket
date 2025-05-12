document.addEventListener('DOMContentLoaded', function() {
    // Load featured movies
    fetch('/api/home/featured')
        .then(response => response.json())
        .then(movies => {
            const featuredSection = document.querySelector('.featured-section');
            if (movies.length > 0) {
                const featuredMovie = movies[0];
                updateFeaturedMovie(featuredMovie);
            }
        });

    // Load now showing movies
    fetch('/api/home/now-showing')
        .then(response => response.json())
        .then(movies => {
            const nowShowingSection = document.querySelector('#nowShowingMovies');
            movies.forEach(movie => {
                nowShowingSection.appendChild(createMovieCard(movie));
            });
        });

    // Load hero content
    fetch('/api/home/hero-content')
        .then(response => response.json())
        .then(content => {
            updateHeroSection(content);
        });

    // Load FAQs
    fetch('/api/home/faqs')
        .then(response => response.json())
        .then(faqs => {
            const faqSection = document.querySelector('#faqAccordion');
            faqs.forEach((faq, index) => {
                faqSection.appendChild(createFAQItem(faq, index));
            });
        });
});

function updateFeaturedMovie(movie) {
    document.querySelector('.featured-title span').textContent = movie.title;
    document.querySelector('.featured-text').textContent = movie.description;
    document.querySelector('.featured-section img').src = movie.posterUrl;
    // Update other movie details...
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'col-lg-3 col-md-6 fade-in';
    card.innerHTML = `
        <div class="movie-card">
            <a href="#" class="bookmark-btn"><i class="far fa-bookmark"></i></a>
            <img src="${movie.posterUrl}" alt="${movie.title}" class="img-fluid">
            <div class="movie-info">
                <div class="rating-stars">
                    ${generateStarRating(movie.rating)}
                    <span class="ms-1">${movie.rating}</span>
                </div>
                <h5 class="movie-title">${movie.title}</h5>
                <div class="mb-2">
                    ${movie.genres.map(genre => `<span class="badge badge-info">${genre}</span>`).join(' ')}
                </div>
                <div class="movie-meta">
                    <span><i class="far fa-clock me-1"></i> ${movie.duration} min</span>
                    <a href="movie.html?id=${movie.id}" class="btn btn-sm btn-primary">Book Now</a>
                </div>
            </div>
        </div>
    `;
    return card;
}

function updateHeroSection(content) {
    document.querySelector('.hero-title').textContent = content.title;
    document.querySelector('.hero-text').textContent = content.subtitle;
    document.querySelector('.hero-bg-video').src = content.backgroundImage;
}

function createFAQItem(faq, index) {
    const item = document.createElement('div');
    item.className = 'accordion-item mb-3 border rounded-4 overflow-hidden';
    item.innerHTML = `
        <h2 class="accordion-header">
            <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#faq${index}">
                ${faq.question}
            </button>
        </h2>
        <div id="faq${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
                ${faq.answer}
            </div>
        </div>
    `;
    return item;
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
} 