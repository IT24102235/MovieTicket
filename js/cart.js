/**
 * Cart Module
 * Handles shopping cart functionality for movie tickets
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or use empty array if not exists
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Elements
    const cartItemsElement = document.getElementById('cartItems');
    const emptyCartElement = document.getElementById('emptyCart');
    const cartItemCountElement = document.getElementById('cartItemCount');
    const cartCountBadge = document.querySelector('.cart-count');
    const clearCartButton = document.getElementById('clearCart');
    const promoCodeInput = document.getElementById('promoCode');
    const applyPromoButton = document.getElementById('applyPromo');
    
    // Initialize cart UI on page load
    updateCartUI();
    
    // Event Listeners
    
    // Remove item from cart
    if (cartItemsElement) {
        cartItemsElement.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-remove-item') || e.target.closest('.btn-remove-item')) {
                const button = e.target.classList.contains('btn-remove-item') ? e.target : e.target.closest('.btn-remove-item');
                const cartItem = button.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                
                // Add removing animation
                cartItem.style.transition = 'all 0.3s ease';
                cartItem.style.opacity = '0';
                cartItem.style.maxHeight = '0';
                cartItem.style.overflow = 'hidden';
                
                setTimeout(() => {
                    // Remove from cart array
                    cart = cart.filter(item => item.id.toString() !== itemId);
                    
                    // Update localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Update UI
                    updateCartUI();
                    
                    // Show notification
                    showNotification('Item removed from cart', 'success');
                }, 300);
            }
        });
    }
    
    // Clear cart
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function() {
            if (cart.length === 0) return;
            
            // Confirm before clearing
            if (confirm('Are you sure you want to clear your cart?')) {
                // Animation for clearing cart
                const cartItems = document.querySelectorAll('.cart-item');
                cartItems.forEach(item => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.maxHeight = '0';
                    item.style.overflow = 'hidden';
                });
                
                setTimeout(() => {
                    // Clear cart array
                    cart = [];
                    
                    // Update localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Update UI
                    updateCartUI();
                    
                    // Show notification
                    showNotification('Cart cleared successfully', 'success');
                }, 300);
            }
        });
    }
    
    // Apply promo code
    if (applyPromoButton) {
        applyPromoButton.addEventListener('click', function() {
            const promoCode = promoCodeInput.value.trim();
            
            if (!promoCode) {
                showNotification('Please enter a promo code', 'error');
                return;
            }
            
            // Check if valid promo code (this would normally be a server check)
            if (promoCode.toUpperCase() === 'DISCOUNT20') {
                // Apply discount
                updateSummary(20); // 20% discount
                promoCodeInput.disabled = true;
                applyPromoButton.disabled = true;
                showNotification('Promo code applied successfully!', 'success');
            } else {
                showNotification('Invalid promo code', 'error');
            }
        });
    }
    
    // Functions
    
    // Update cart UI
    function updateCartUI() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            if (totalItems === 0) {
                cartCountBadge.classList.add('d-none');
            } else {
                cartCountBadge.classList.remove('d-none');
            }
        }
        
        if (cartItemCountElement) {
            cartItemCountElement.textContent = `(${totalItems} item${totalItems !== 1 ? 's' : ''})`;
        }
        
        // Show empty cart or items
        if (cartItemsElement && emptyCartElement) {
            if (cart.length === 0) {
                cartItemsElement.classList.add('d-none');
                emptyCartElement.classList.remove('d-none');
                if (clearCartButton) clearCartButton.classList.add('d-none');
            } else {
                renderCartItems();
                cartItemsElement.classList.remove('d-none');
                emptyCartElement.classList.add('d-none');
                if (clearCartButton) clearCartButton.classList.remove('d-none');
            }
        }
        
        // Update summary
        updateSummary();
    }
    
    // Render cart items
    function renderCartItems() {
        if (!cartItemsElement) return;
        
        cartItemsElement.innerHTML = '';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.id = item.id;
            
            const subtotal = (item.price * item.quantity).toFixed(2);
            
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <div class="cart-item-meta">
                        <span><i class="fas fa-calendar me-1"></i> ${item.date}</span>
                        <span><i class="fas fa-clock me-1"></i> ${item.time}</span>
                        <span><i class="fas fa-film me-1"></i> ${item.format}</span>
                    </div>
                    <div class="cart-item-location">
                        <i class="fas fa-map-marker-alt"></i> ${item.theater}
                    </div>
                    <div class="cart-item-seats">
                        <span class="seats-label">Seats:</span>
                        <div class="seats-container">
                            ${item.seats.map(seat => `<span class="seat-tag">${seat}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="cart-item-price">
                    <div class="ticket-count">${item.quantity} × ${item.price.toFixed(2)}</div>
                    <div class="price-amount">Rs ${subtotal}</div>
                    <button class="btn-remove-item"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            cartItemsElement.appendChild(itemElement);
        });
    }
    
    // Update order summary
    function updateSummary(discountPercent = 0) {
        const subtotalElement = document.querySelector('.summary-items .summary-item:first-child span:last-child');
        const discountElement = document.querySelector('.summary-items .summary-item:nth-child(3) span:last-child');
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
    
    // Notification function
    function showNotification(message, type) {
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
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} notification`;
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
        }, 3000);
    }
    
    // Add sample items to cart for demonstration (remove in production)
    function addSampleItems() {
        if (cart.length === 0) {
            const sampleItems = [
                {
                    id: 1,
                    title: 'Dune: Part Two',
                    date: 'Tuesday, March 15, 2024',
                    time: '7:30 PM',
                    format: 'IMAX 2D',
                    theater: 'CineWorld Colombo City Centre',
                    seats: ['G14', 'G15'],
                    quantity: 2,
                    price: 1500,
                    image: 'https://source.unsplash.com/random/400x600/?movie,poster,1'
                },
                {
                    id: 2,
                    title: 'Godzilla x Kong: The New Empire',
                    date: 'Thursday, March 17, 2024',
                    time: '8:00 PM',
                    format: '3D',
                    theater: 'Liberty by Scope Cinemas',
                    seats: ['J8'],
                    quantity: 1,
                    price: 1200,
                    image: 'https://source.unsplash.com/random/400x600/?movie,poster,2'
                },
                {
                    id: 3,
                    title: 'Deadpool & Wolverine',
                    date: 'Friday, March 18, 2024',
                    time: '6:15 PM',
                    format: '2D',
                    theater: 'Savoy Cinemas',
                    seats: ['C4', 'C5', 'C6'],
                    quantity: 3,
                    price: 800,
                    image: 'https://source.unsplash.com/random/400x600/?movie,poster,5'
                }
            ];
            
            cart = sampleItems;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        }
    }
    
    // For demo purposes, add sample items
    if (window.location.pathname.includes('cart.html')) {
        addSampleItems();
    }
    
    // Add to cart function for use in product pages
    window.addToCart = function(movieData) {
        // Check if item already in cart
        const existingItemIndex = cart.findIndex(item => 
            item.id === movieData.id && 
            item.date === movieData.date && 
            item.time === movieData.time &&
            item.format === movieData.format
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart[existingItemIndex].quantity += movieData.quantity;
            cart[existingItemIndex].seats = [...cart[existingItemIndex].seats, ...movieData.seats];
        } else {
            // Add new item
            cart.push(movieData);
        }
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI
        if (cartCountBadge) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountBadge.textContent = totalItems;
            cartCountBadge.classList.remove('d-none');
            
            // Add animation
            cartCountBadge.classList.add('pop-animation');
            setTimeout(() => {
                cartCountBadge.classList.remove('pop-animation');
            }, 300);
        }
        
        return true;
    };
});
