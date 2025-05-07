/**
 * CineApp - Cart JavaScript File
 * Handles the shopping cart functionality
 */

// Add an item to the cart
function addToCart(item) {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.title === item.title && 
        cartItem.date === item.date && 
        cartItem.time === item.time &&
        JSON.stringify(cartItem.seats) === JSON.stringify(item.seats)
    );
    
    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item to cart
        cart.push(item);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in the UI
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    
    return cart;
}

// Remove an item from the cart
function removeFromCart(index) {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Remove item by index
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in the UI
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
    }
    
    return cart;
}

// Update item quantity in the cart
function updateCartItemQuantity(index, quantity) {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update quantity if index is valid
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = quantity;
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in the UI
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
    }
    
    return cart;
}

// Calculate cart total
function calculateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Clear the entire cart
function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Update cart count in the UI
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count when page loads
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
});

// Export cart functions for use in other scripts
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.calculateCartTotal = calculateCartTotal;
window.clearCart = clearCart;
