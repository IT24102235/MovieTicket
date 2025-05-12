/**
 * Login functionality for CineApp
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // In a real application, you would validate credentials against your backend
            // For demo purposes, we'll accept any login with proper format
            
            if (email && password && password.length >= 6) {
                // Create a user object with the login information
                const user = {
                    id: Math.floor(Math.random() * 1000),
                    name: email.split('@')[0].split('.').map(name => 
                        name.charAt(0).toUpperCase() + name.slice(1)
                    ).join(' '),
                    email: email,
                    avatar: null
                };
                
                // Save user in localStorage (in production, use proper auth tokens)
                localStorage.setItem('user', JSON.stringify(user));
                
                // Set flag to show welcome message
                sessionStorage.setItem('justLoggedIn', 'true');
                
                // Redirect to homepage
                window.location.href = 'index.html';
            } else {
                // Show error
                const errorElement = document.querySelector('.login-error') || 
                    document.createElement('div');
                
                errorElement.className = 'alert alert-danger login-error mt-3';
                errorElement.textContent = 'Invalid email or password. Password must be at least 6 characters.';
                
                if (!document.querySelector('.login-error')) {
                    loginForm.appendChild(errorElement);
                }
            }
        });
    }
    
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && window.location.pathname.includes('login.html')) {
        // Redirect already logged in users away from login page
        window.location.href = 'index.html';
    }
});
