/**
 * Main Application Module
 * Handles user session management and global functionality
 */

// User session management
const UserSession = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('userLoggedIn') === 'true';
    },
    
    // Get current user data
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem('currentUser')) || null;
    },
    
    // Login user
    login: function(userData) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.updateUI();
    },
    
    // Logout user
    logout: function() {
        localStorage.setItem('userLoggedIn', 'false');
        localStorage.removeItem('currentUser');
        this.updateUI();
        // Redirect to home page if not already there
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    },
    
    // Update UI based on login status
    updateUI: function() {
        const loginButtons = document.querySelectorAll('.login-btn');
        const signupButtons = document.querySelectorAll('.signup-btn');
        const profileMenus = document.querySelectorAll('.profile-menu');
        const userNameElements = document.querySelectorAll('.user-name');
        
        if (this.isLoggedIn()) {
            // Hide login/signup buttons
            loginButtons.forEach(btn => btn.style.display = 'none');
            signupButtons.forEach(btn => btn.style.display = 'none');
            
            // Show profile menu
            profileMenus.forEach(menu => {
                menu.style.display = 'block';
                // Update user name in profile menu
                const user = this.getCurrentUser();
                if (user) {
                    const nameElement = menu.querySelector('.user-name');
                    if (nameElement) {
                        nameElement.textContent = user.firstName;
                    }
                    // Update profile image
                    const imgElement = menu.querySelector('img');
                    if (imgElement) {
                        imgElement.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0065ff&color=fff`;
                    }
                }
            });
        } else {
            // Show login/signup buttons
            loginButtons.forEach(btn => btn.style.display = 'inline-block');
            signupButtons.forEach(btn => btn.style.display = 'inline-block');
            
            // Hide profile menu
            profileMenus.forEach(menu => menu.style.display = 'none');
        }
    }
};

/**
 * CineApp - Main JavaScript File
 * Provides global functionality used across multiple pages
 */

// Show notification helper function
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    
    let bgColor, iconClass;
    switch(type) {
        case 'success':
            bgColor = 'success';
            iconClass = 'check-circle';
            break;
        case 'error':
        case 'danger':
            bgColor = 'danger';
            iconClass = 'exclamation-circle';
            break;
        case 'warning':
            bgColor = 'warning';
            iconClass = 'exclamation-triangle';
            break;
        case 'info':
        default:
            bgColor = 'info';
            iconClass = 'info-circle';
            break;
    }
    
    notification.className = `alert alert-${bgColor} notification`;
    notification.style.cssText = `
        margin-bottom: 10px;
        min-width: 300px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        animation: slide-in 0.3s forwards;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${iconClass} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.animation = 'slide-out 0.3s forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update cart count in the navbar
function updateCartCount() {
    const cartBadge = document.querySelector('.notification-badge, .cart-count');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Format currency
function formatCurrency(amount) {
    return `Rs ${parseFloat(amount).toFixed(2)}`;
}

// Format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return dateString;
    }
}

// Initialize back to top button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        });
        
        backToTop.style.opacity = '0';
        backToTop.style.transition = 'opacity 0.3s, transform 0.3s';
        backToTop.style.pointerEvents = 'none';
    }
}

// Create an observer for animation on scroll
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.fade-in, .slide-up, .slide-right, .slide-left, .zoom-in');
    
    if (animateElements.length > 0) {
        const observerOptions = {
            threshold: 0.2
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Add animation keyframes if not already present
function addAnimationKeyframes() {
    if (!document.getElementById('animation-keyframes')) {
        const style = document.createElement('style');
        style.id = 'animation-keyframes';
        style.textContent = `
            @keyframes slide-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slide-out {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes zoom-in {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-20px); }
                60% { transform: translateY(-10px); }
            }
            
            .fade-in {
                opacity: 0;
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .slide-right {
                opacity: 0;
                transform: translateX(-50px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .slide-left {
                opacity: 0;
                transform: translateX(50px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .slide-up {
                opacity: 0;
                transform: translateY(50px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .zoom-in {
                opacity: 0;
                transform: scale(0.8);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .fade-in.active, .slide-right.active, .slide-left.active, .slide-up.active, .zoom-in.active {
                opacity: 1;
                transform: translate(0) scale(1);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all common functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initBackToTop();
    initScrollAnimations();
    addAnimationKeyframes();
    
    // Handle preloader if it exists
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 500);
    }
    
    // Initialize navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Global event delegation for common interactive elements
    document.body.addEventListener('click', function(e) {
        // Back to top functionality
        if (e.target.closest('.back-to-top')) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});

// Export functions for use in other scripts
window.showNotification = showNotification;
window.updateCartCount = updateCartCount;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;

// Make UserSession globally available
window.UserSession = UserSession;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add notification styles
    addAnimationKeyframes();
    
    // Update UI based on login status
    UserSession.updateUI();
    
    // Setup logout functionality
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            UserSession.logout();
            showNotification('You have been logged out successfully');
        });
    });
});
