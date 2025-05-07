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
            profileMenus.forEach(menu => menu.style.display = 'block');
            
            // Update user name
            const user = this.getCurrentUser();
            if (user && userNameElements) {
                userNameElements.forEach(element => element.textContent = user.firstName || user.email);
            }
        } else {
            // Show login/signup buttons
            loginButtons.forEach(btn => btn.style.display = 'inline-block');
            signupButtons.forEach(btn => btn.style.display = 'inline-block');
            
            // Hide profile menu
            profileMenus.forEach(menu => menu.style.display = 'none');
        }
    }
};

// Global notification system
function showNotification(message, type = 'success', duration = 3000) {
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
    notification.className = `alert alert-${type} notification`;
    notification.style.cssText = `
        margin-bottom: 10px;
        min-width: 300px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        animation: slide-in 0.3s forwards;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
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
    }, duration);
}

// Add CSS animations for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add notification styles
    addNotificationStyles();
    
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

// Make functions globally available
window.UserSession = UserSession;
window.showNotification = showNotification;
