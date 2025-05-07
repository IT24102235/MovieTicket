/**
 * Checkout Module
 * Handles payment processing and checkout flow
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Elements
    const paymentTabs = document.querySelectorAll('.nav-tabs .nav-link');
    const paymentTabContent = document.querySelectorAll('.tab-pane');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expDate');
    const cvvInput = document.getElementById('cvv');
    const sameAsProfileCheckbox = document.getElementById('sameAsProfile');
    const billingDetailsSection = document.getElementById('billingDetails');
    const termsCheckbox = document.getElementById('termsConditions');
    const payNowButton = document.getElementById('payNowBtn');
    const secureCheckoutForm = document.getElementById('secureCheckoutForm');
    
    // Initialize review section
    initReviewSection();
    
    // Check if user is logged in
    if (window.UserSession && !window.UserSession.isLoggedIn()) {
        // Redirect to login page with return URL
        const returnUrl = encodeURIComponent(window.location.href);
        window.showNotification('Please login to continue with checkout', 'danger');
        setTimeout(() => {
            window.location.href = `login.html?returnUrl=${returnUrl}`;
        }, 2000);
    }
    
    // Event listeners
    
    // Payment method tabs
    if (paymentTabs.length) {
        paymentTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                paymentTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                paymentTabContent.forEach(content => {
                    content.classList.remove('show', 'active');
                });
                
                const targetId = this.getAttribute('data-bs-target').substring(1);
                document.getElementById(targetId).classList.add('show', 'active');
            });
        });
    }
    
    // Credit card input formatting
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Limit to 16 digits (plus spaces)
            if (value.replace(/\s/g, '').length > 16) {
                value = value.substring(0, 19);
            }
            
            this.value = value;
            
            // Show card type icon
            const cardType = detectCardType(value.replace(/\s/g, ''));
            const cardIcons = document.querySelectorAll('.card-types i');
            
            cardIcons.forEach(icon => {
                icon.style.opacity = '0.3';
            });
            
            if (cardType) {
                const activeIcon = document.querySelector(`.card-types i.fa-cc-${cardType}`);
                if (activeIcon) activeIcon.style.opacity = '1';
            }
        });
    }
    
    // Expiry date formatting (MM/YY)
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            this.value = value;
        });
    }
    
    // CVV input - only allow numbers
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }
    
    // Toggle billing details
    if (sameAsProfileCheckbox) {
        sameAsProfileCheckbox.addEventListener('change', function() {
            if (this.checked) {
                billingDetailsSection.classList.add('d-none');
            } else {
                billingDetailsSection.classList.remove('d-none');
                billingDetailsSection.classList.add('fade-slide-up');
            }
        });
    }
    
    // Form validation and submission
    if (secureCheckoutForm) {
        secureCheckoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check terms and conditions
            if (!termsCheckbox.checked) {
                termsCheckbox.nextElementSibling.nextElementSibling.style.display = 'block';
                return;
            } else {
                termsCheckbox.nextElementSibling.nextElementSibling.style.display = 'none';
            }
            
            // Validate selected payment method
            const activePaymentMethod = document.querySelector('.tab-pane.active').id;
            let isValid = true;
            
            if (activePaymentMethod === 'card-pane') {
                // Validate card details
                const savedCardSelected = document.querySelector('.saved-card-radio:checked');
                
                if (!savedCardSelected) {
                    // New card validation
                    if (!cardNumberInput.value || cardNumberInput.value.replace(/\s/g, '').length < 16) {
                        showInputError(cardNumberInput, 'Please enter a valid card number');
                        isValid = false;
                    }
                    
                    if (!expiryDateInput.value || expiryDateInput.value.length < 5) {
                        showInputError(expiryDateInput, 'Please enter a valid expiry date');
                        isValid = false;
                    }
                    
                    if (!cvvInput.value || cvvInput.value.length < 3) {
                        showInputError(cvvInput, 'Please enter a valid CVV');
                        isValid = false;
                    }
                }
            } else if (activePaymentMethod === 'banking-pane') {
                const selectedBank = document.querySelector('.bank-radio:checked');
                if (!selectedBank) {
                    window.showNotification('Please select a bank', 'danger');
                    isValid = false;
                }
            } else if (activePaymentMethod === 'mobile-pane') {
                const selectedMobile = document.querySelector('.mobile-radio:checked');
                const mobileNumber = document.getElementById('mobileNumber');
                
                if (!selectedMobile) {
                    window.showNotification('Please select a mobile payment method', 'danger');
                    isValid = false;
                }
                
                if (!mobileNumber.value || mobileNumber.value.length < 9) {
                    showInputError(mobileNumber, 'Please enter a valid mobile number');
                    isValid = false;
                }
            }
            
            if (isValid) {
                // Show processing state
                const originalText = payNowButton.innerHTML;
                payNowButton.disabled = true;
                payNowButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing Payment...';
                
                // Calculate order total
                const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                const bookingFee = 300; // Fixed booking fee
                const discount = 0; // No discount for simplicity
                const total = subtotal + bookingFee - discount;
                
                // Create order details
                const orderDetails = {
                    orderId: 'CF-' + Math.floor(100000 + Math.random() * 900000),
                    items: cart,
                    subtotal: subtotal,
                    bookingFee: bookingFee,
                    discount: discount,
                    total: total,
                    paymentMethod: activePaymentMethod,
                    date: new Date().toISOString()
                };
                
                // Save order details to localStorage
                localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
                
                // Simulate payment processing
                setTimeout(() => {
                    // Success notification
                    window.showNotification('Payment successful! Redirecting to confirmation page...', 'success');
                    
                    // Redirect to confirmation
                    setTimeout(() => {
                        window.location.href = 'confirmation.html';
                    }, 1500);
                }, 2000);
            }
        });
    }
    
    // Functions
    
    // Initialize review section
    function initReviewSection() {
        const reviewItems = document.querySelector('.review-items');
        if (!reviewItems) return;
        
        // Clear existing items
        reviewItems.innerHTML = '';
        
        if (cart.length === 0) {
            reviewItems.innerHTML = '<p class="text-center py-4">Your cart is empty</p>';
            return;
        }
        
        // Add items to review
        cart.forEach(item => {
            const subtotal = (item.price * item.quantity).toFixed(2);
            
            const itemElement = document.createElement('div');
            itemElement.className = 'review-item';
            
            itemElement.innerHTML = `
                <div class="review-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="review-item-details">
                    <h4>${item.title}</h4>
                    <div class="review-item-meta">
                        <span><i class="fas fa-calendar"></i> ${item.date}</span>
                        <span><i class="fas fa-clock"></i> ${item.time}</span>
                        <span><i class="fas fa-ticket-alt"></i> ${item.quantity} ticket${item.quantity !== 1 ? 's' : ''}</span>
                    </div>
                </div>
                <div class="review-item-price">
                    Rs ${subtotal}
                </div>
            `;
            
            reviewItems.appendChild(itemElement);
        });
        
        // Update summary
        updateSummary();
    }
    
    // Update order summary
    function updateSummary(discountPercent = 0) {
        const subtotalElement = document.querySelector('.summary-item:first-child span:last-child');
        const discountElement = document.querySelector('.summary-item:nth-child(3) span:last-child');
        const totalElement = document.querySelector('.summary-total span:last-child');
        
        if (!subtotalElement || !discountElement || !totalElement) return;
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const bookingFee = 300; // Fixed booking fee
        
        // Calculate discount
        const discount = (subtotal * (discountPercent / 100)).toFixed(2);
        
        // Calculate total
        const total = (subtotal + bookingFee - discount).toFixed(2);
        
        // Update UI
        subtotalElement.textContent = `Rs ${subtotal.toFixed(2)}`;
        discountElement.textContent = discount > 0 ? `- Rs ${discount}` : '- Rs 0.00';
        totalElement.textContent = `Rs ${total}`;
    }
    
    // Detect credit card type
    function detectCardType(cardNumber) {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/
        };
        
        for (const card in patterns) {
            if (patterns[card].test(cardNumber)) {
                return card;
            }
        }
        
        return null;
    }
    
    // Show error for input
    function showInputError(inputElement, message) {
        inputElement.classList.add('is-invalid');
        
        // Create or update error message
        let errorElement = inputElement.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        
        errorElement.textContent = message;
    }
});
