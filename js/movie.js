/**
 * Movie Detail Page Module
 * Handles movie detail page functionality including showtimes and booking flow
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const movieBackdrop = document.getElementById('movieBackdrop');
    const moviePoster = document.getElementById('moviePoster');
    const dateItems = document.querySelectorAll('.date-item');
    const datePrev = document.getElementById('datePrev');
    const dateNext = document.getElementById('dateNext');
    const theatreTabs = document.querySelectorAll('.theatre-tab');
    const timeSlots = document.querySelectorAll('.time-slot');
    const trailerModal = document.getElementById('trailerModal');
    const trailerPlaceholder = document.getElementById('trailerPlaceholder');
    const continueButton = document.getElementById('continueButton');
    
    // Selected booking info
    const bookingInfo = {
        movieId: 1,
        movieTitle: document.querySelector('.movie-title')?.textContent || 'Nelum Kuluna',
        date: '2025-04-16',
        time: '14:40',
        format: '2D',
        theater: 'Malabe Theater Hall',
        price: 1000,
        seats: []
    };
    
    // Update booking summary
    updateBookingSummary();
    
    // Get elements for booking summary
    const summaryDate = document.querySelector('.summary-info-item:nth-child(1) .info-value');
    const summaryTime = document.querySelector('.summary-info-item:nth-child(2) .info-value');
    const summaryFormat = document.querySelector('.summary-info-item:nth-child(3) .info-value');
    const summaryPrice = document.querySelector('.summary-info-item:nth-child(4) .info-value');
    
    // Load dynamic background
    if (movieBackdrop) {
        movieBackdrop.style.backgroundImage = "url('https://source.unsplash.com/random/1920x1080/?movie,dark')";
    }
    
    // Event Listeners
    
    // Date selection
    if (dateItems.length) {
        dateItems.forEach(item => {
            item.addEventListener('click', function() {
                dateItems.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                
                // Update booking info
                bookingInfo.date = this.dataset.date || '2025-04-16';
                updateBookingSummary();
            });
        });
    }
    
    // Date navigation
    if (datePrev && dateNext) {
        const dateList = document.getElementById('dateList');
        if (dateList) {
            datePrev.addEventListener('click', () => {
                dateList.scrollBy({ left: -100, behavior: 'smooth' });
            });
            
            dateNext.addEventListener('click', () => {
                dateList.scrollBy({ left: 100, behavior: 'smooth' });
            });
        }
    }
    
    // Theatre tabs
    if (theatreTabs.length) {
        theatreTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                theatreTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const target = tab.dataset.target;
                document.querySelectorAll('.theatre-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(target).classList.add('active');
                
                // Update booking info
                bookingInfo.format = tab.textContent.trim();
                
                // Update price based on format
                if (target === 'format2d') {
                    bookingInfo.price = 1000;
                } else if (target === 'format3d') {
                    bookingInfo.price = 1500;
                } else if (target === 'formatImax') {
                    bookingInfo.price = 2000;
                } else if (target === 'formatDolby') {
                    bookingInfo.price = 2000;
                }
                
                updateBookingSummary();
                
                // Update tab indicator position
                const tabIndicator = document.querySelector('.theatre-tab-indicator');
                if (tabIndicator) {
                    const tabRect = tab.getBoundingClientRect();
                    const tabsRect = tab.parentElement.getBoundingClientRect();
                    tabIndicator.style.left = `${tabRect.left - tabsRect.left}px`;
                    tabIndicator.style.width = `${tabRect.width}px`;
                }
            });
        });
    }
    
    // Time slot selection
    if (timeSlots.length) {
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                // Deselect all in the current format section
                const parentSection = this.closest('.theatre-content');
                parentSection.querySelectorAll('.time-slot').forEach(s => {
                    s.classList.remove('active');
                });
                
                // Select clicked slot
                this.classList.add('active');
                
                // Update booking info
                bookingInfo.time = this.querySelector('.time-value').textContent;
                updateBookingSummary();
            });
        });
    }
    
    // Checkout button
    if (continueButton) {
        continueButton.addEventListener('click', function(e) {
            // If the button is an anchor tag (<a>), prevent default navigation
            if (this.tagName.toLowerCase() === 'a') {
                e.preventDefault();
            }
            
            // Get movie information
            const movieTitle = document.querySelector('.movie-title')?.textContent || bookingInfo.movieTitle;
            const moviePosterElem = document.querySelector('#moviePoster img');
            const movieImage = moviePosterElem ? moviePosterElem.src : 
                'https://source.unsplash.com/random/400x600/?movie,poster,drama';
            
            // Format date display
            const dateText = document.querySelector('#summaryDate .info-value')?.textContent || 
                             document.querySelector('#summaryDate')?.textContent || 
                             formatDate(bookingInfo.date);
            
            // Save booking info to localStorage for seat selection page
            const selectedBooking = {
                movieId: bookingInfo.movieId,
                title: movieTitle,
                date: dateText,
                time: bookingInfo.time,
                format: bookingInfo.format,
                theater: bookingInfo.theater,
                price: bookingInfo.price,
                image: movieImage
            };
            
            localStorage.setItem('selectedBooking', JSON.stringify(selectedBooking));
            
            // Redirect to seat selection page
            window.location.href = 'seat-selection.html';
        });
    }
    
    // Functions
    
    // Update booking summary
    function updateBookingSummary() {
        if (summaryDate) {
            summaryDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDate(bookingInfo.date)}`;
        }
        
        if (summaryTime) {
            summaryTime.innerHTML = `<i class="far fa-clock"></i> ${bookingInfo.time}`;
        }
        
        if (summaryFormat) {
            summaryFormat.innerHTML = `<i class="fas fa-film"></i> ${bookingInfo.format}`;
        }
        
        if (summaryPrice) {
            summaryPrice.innerHTML = `<i class="fas fa-tag"></i> Rs ${bookingInfo.price.toFixed(2)}`;
        }
        
        // Update total
        const summaryTotal = document.querySelector('.summary-total .text-end');
        if (summaryTotal) {
            const total = bookingInfo.price * Math.max(1, bookingInfo.seats.length);
            summaryTotal.textContent = `Rs ${total.toFixed(2)}`;
        }
    }
    
    // Format date
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const day = date.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (e) {
            return dateString;
        }
    }
});
