/**
 * Authentication Module
 * Handles login, signup, password validation, and form submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Common elements and functionality for both login and signup pages
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.closest('.form-floating').querySelector('input');
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });
    
    // Login Form Functionality
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                console.log('Sending login request to:', `${API_BASE_URL}/api/auth/login`);
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);

                if (response.ok && data.token) {
                    // Store the JWT token
                    localStorage.setItem('token', data.token);
                    
                    // Store user information
                    localStorage.setItem('userLoggedIn', 'true');
                    localStorage.setItem('currentUser', JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email
                    }));
                    
                    // Update UI
                    if (window.UserSession) {
                        window.UserSession.updateUI();
                    }
                    
                    // Redirect to home page
                    window.location.href = 'index.html';
                } else {
                    const alertElement = document.getElementById('loginAlert');
                    alertElement.textContent = data.message || 'Invalid email or password';
                    alertElement.classList.remove('d-none');
                    alertElement.classList.add('alert-danger');
                }
            } catch (error) {
                console.error('Detailed error:', error);
                const alertElement = document.getElementById('loginAlert');
                alertElement.textContent = 'An error occurred during login. Please try again.';
                alertElement.classList.remove('d-none');
                alertElement.classList.add('alert-danger');
            }
        });
    }
    
    // Signup Form Functionality
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const passwordStrength = document.querySelector('.password-strength');
        
        // Show password strength meter when password field is focused
        if (passwordInput && passwordStrength) {
            passwordInput.addEventListener('focus', function() {
                passwordStrength.classList.remove('d-none');
            });
            
            // Update password strength meter on input
            passwordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }
        
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                console.log('Sending signup request to:', `${API_BASE_URL}/api/auth/signup`);
                const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);

                if (response.ok) {
                    const alertElement = document.getElementById('signupAlert');
                    alertElement.classList.remove('alert-danger');
                    alertElement.classList.add('alert-success');
                    alertElement.textContent = data.message;
                    alertElement.classList.remove('d-none');
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    const alertElement = document.getElementById('signupAlert');
                    alertElement.textContent = data.message || 'An error occurred during signup';
                    alertElement.classList.remove('d-none');
                    alertElement.classList.add('alert-danger');
                }
            } catch (error) {
                console.error('Detailed error:', error);
                const alertElement = document.getElementById('signupAlert');
                alertElement.textContent = 'An error occurred during signup. Please try again.';
                alertElement.classList.remove('d-none');
                alertElement.classList.add('alert-danger');
            }
        });
    }
    
    // Helper Functions
    
    // Email validation
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Set invalid state for form field
    function setInvalid(element, message) {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        
        // Find the feedback element (different structure between regular inputs and floating labels)
        let feedbackElement;
        if (element.closest('.form-floating')) {
            feedbackElement = element.closest('.form-floating').nextElementSibling;
            if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement = element.closest('.form-floating').querySelector('.invalid-feedback');
            }
        } else {
            feedbackElement = element.nextElementSibling;
        }
        
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement.textContent = message;
        }
    }
    
    // Set valid state for form field
    function setValid(element) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    }
    
    // Password strength meter
    function updatePasswordStrength(password) {
        const progressBar = document.querySelector('.password-strength .progress-bar');
        const strengthText = document.querySelector('.password-strength .strength-text');
        
        // Calculate password strength
        let strength = 0;
        if (password.match(/[a-z]+/)) strength += 1;
        if (password.match(/[A-Z]+/)) strength += 1;
        if (password.match(/[0-9]+/)) strength += 1;
        if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;
        if (password.length >= 8) strength += 1;
        
        // Update progress bar
        const widthPercentage = (strength / 5) * 100;
        progressBar.style.width = `${widthPercentage}%`;
        
        // Update color based on strength
        if (strength <= 2) {
            progressBar.className = 'progress-bar bg-danger';
            strengthText.textContent = 'Weak';
        } else if (strength <= 3) {
            progressBar.className = 'progress-bar bg-warning';
            strengthText.textContent = 'Medium';
        } else {
            progressBar.className = 'progress-bar bg-success';
            strengthText.textContent = 'Strong';
        }
    }
});

// Update the API base URL
const API_BASE_URL = 'http://localhost:8081';
