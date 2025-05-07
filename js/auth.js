/**
 * Authentication Module
 * Handles login, signup, password validation, and form submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Common elements and functionality for both login and signup pages
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });
    
    // Login Form Functionality
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            
            // Add form validation
            let isValid = true;
            if (!validateEmail(email)) {
                setInvalid(document.getElementById('email'), 'Please enter a valid email address');
                isValid = false;
            } else {
                setValid(document.getElementById('email'));
            }
            
            if (password.trim() === '') {
                setInvalid(document.getElementById('password'), 'Please enter your password');
                isValid = false;
            } else {
                setValid(document.getElementById('password'));
            }
            
            if (isValid) {
                // For demonstration purposes we'll simulate a successful login
                // In a real application, you would send this data to the server for authentication
                
                // Simulate API call with loading state
                const loginButton = loginForm.querySelector('button[type="submit"]');
                const originalText = loginButton.innerHTML;
                
                loginButton.disabled = true;
                loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
                
                setTimeout(() => {
                    // In a real app, you would validate credentials against a backend
                    // For demo purposes, we'll accept any credentials
                    
                    // Create user data
                    const userData = {
                        email: email,
                        firstName: email.split('@')[0], // Extract name from email for demo
                        lastName: '',
                        rememberMe: rememberMe
                    };
                    
                    // Login user
                    window.UserSession.login(userData);
                    
                    // Show success notification
                    window.showNotification('Login successful! Welcome back.', 'success');
                    
                    // Redirect to home page or previous page
                    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
                    window.location.href = returnUrl || 'index.html';
                    
                }, 1500);
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
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsConditions = document.getElementById('termsConditions').checked;
            
            // Add form validation
            let isValid = true;
            
            // Validate first name
            if (firstName.trim() === '') {
                setInvalid(document.getElementById('firstName'), 'Please enter your first name');
                isValid = false;
            } else {
                setValid(document.getElementById('firstName'));
            }
            
            // Validate last name
            if (lastName.trim() === '') {
                setInvalid(document.getElementById('lastName'), 'Please enter your last name');
                isValid = false;
            } else {
                setValid(document.getElementById('lastName'));
            }
            
            // Validate email
            if (!validateEmail(email)) {
                setInvalid(document.getElementById('email'), 'Please enter a valid email address');
                isValid = false;
            } else {
                setValid(document.getElementById('email'));
            }
            
            // Validate password
            if (password.trim() === '') {
                setInvalid(passwordInput, 'Please create a password');
                isValid = false;
            } else if (password.length < 8) {
                setInvalid(passwordInput, 'Password must be at least 8 characters');
                isValid = false;
            } else {
                setValid(passwordInput);
            }
            
            // Validate password confirmation
            if (confirmPassword !== password) {
                setInvalid(confirmPasswordInput, 'Passwords do not match');
                isValid = false;
            } else {
                setValid(confirmPasswordInput);
            }
            
            // Validate terms and conditions
            if (!termsConditions) {
                document.getElementById('termsConditions').nextElementSibling.nextElementSibling.style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('termsConditions').nextElementSibling.nextElementSibling.style.display = 'none';
            }
            
            if (isValid) {
                // For demonstration purposes we'll simulate a successful registration
                
                // Simulate API call with loading state
                const signupButton = signupForm.querySelector('button[type="submit"]');
                const originalText = signupButton.innerHTML;
                
                signupButton.disabled = true;
                signupButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';
                
                setTimeout(() => {
                    // Simulate successful signup
                    
                    // Create user data
                    const userData = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email
                    };
                    
                    // Store in localStorage for demo purposes
                    localStorage.setItem('registeredUser', JSON.stringify(userData));
                    
                    // Show success message
                    const signupAlert = document.getElementById('signupAlert');
                    signupAlert.classList.remove('d-none');
                    signupAlert.textContent = 'Account created successfully! Redirecting to login...';
                    
                    // Automatically log in the user
                    window.UserSession.login(userData);
                    
                    // Show success notification
                    window.showNotification('Account created successfully!', 'success');
                    
                    // Redirect to home page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 1500);
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
        const feedbackElement = element.nextElementSibling;
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
