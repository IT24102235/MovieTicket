/**
 * Admin Food & Beverages Management
 * Handles CRUD operations for food items including listing, creating, updating, and deleting
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initUI();
    
    // Load food items data
    loadFoodItems();
    
    // Event listeners
    setupEventListeners();
});

// Sample food items data for demonstration
const sampleFoodItems = [
    {
        id: 1,
        name: "Large Popcorn",
        category: "popcorn",
        description: "Freshly popped, buttery popcorn served in a large bucket - perfect for sharing!",
        price: 7.99,
        stockStatus: "in-stock",
        quantity: 250,
        image: "https://via.placeholder.com/200x200?text=Large+Popcorn",
        featured: true,
        allergyInfo: "Contains dairy (butter)"
    },
    {
        id: 2,
        name: "Nachos with Cheese",
        category: "snacks",
        description: "Crispy corn tortilla chips served with warm cheese sauce and jalapeños.",
        price: 6.99,
        stockStatus: "in-stock",
        quantity: 150,
        image: "https://via.placeholder.com/200x200?text=Nachos",
        featured: true,
        allergyInfo: "Contains dairy, gluten"
    },
    {
        id: 3,
        name: "Large Soda",
        category: "drinks",
        description: "Refreshing 32oz soda of your choice with free refills during the movie.",
        price: 4.99,
        stockStatus: "in-stock",
        quantity: 300,
        image: "https://via.placeholder.com/200x200?text=Soda",
        featured: true,
        allergyInfo: ""
    },
    {
        id: 4,
        name: "Movie Combo (Large)",
        category: "combos",
        description: "Large popcorn, 2 large sodas, and a candy of your choice. The perfect movie companion!",
        price: 15.99,
        stockStatus: "in-stock",
        quantity: 200,
        image: "https://via.placeholder.com/200x200?text=Movie+Combo",
        featured: true,
        allergyInfo: "Varies by selection"
    },
    {
        id: 5,
        name: "Chocolate Covered Pretzels",
        category: "snacks",
        description: "Crunchy pretzels covered in premium chocolate. A sweet and salty treat!",
        price: 5.99,
        stockStatus: "low-stock",
        quantity: 25,
        image: "https://via.placeholder.com/200x200?text=Chocolate+Pretzels",
        featured: false,
        allergyInfo: "Contains gluten, dairy, may contain nuts"
    },
    {
        id: 6,
        name: "Hot Dog",
        category: "snacks",
        description: "Juicy hot dog served in a warm bun with condiments of your choice.",
        price: 5.49,
        stockStatus: "out-of-stock",
        quantity: 0,
        image: "https://via.placeholder.com/200x200?text=Hot+Dog",
        featured: false,
        allergyInfo: "Contains gluten"
    }
];

// Initialize UI components
function initUI() {
    // Image upload preview
    const foodImageUpload = document.getElementById('foodImageUpload');
    const foodImageInput = document.getElementById('foodImageInput');
    const foodImagePreview = document.getElementById('foodImagePreview');
    const foodImagePreviewContainer = document.getElementById('foodImagePreviewContainer');
    
    if (foodImageUpload && foodImageInput && foodImagePreview) {
        foodImageUpload.addEventListener('click', function() {
            foodImageInput.click();
        });
        
        foodImageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    foodImagePreview.src = e.target.result;
                    foodImagePreview.classList.remove('d-none');
                    foodImagePreviewContainer.classList.add('d-none');
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize tooltips for the grid view buttons
    initializeGridViewButtons();
}

// Load food items data and populate the table
function loadFoodItems() {
    const tableBody = document.getElementById('foodList');
    const emptyState = document.getElementById('emptyFoodState');
    const loadingState = document.getElementById('loadingState');
    
    if (tableBody && emptyState && loadingState) {
        // In a real app, this would be an AJAX call to the server
        setTimeout(() => {
            // Hide loading state
            loadingState.classList.add('d-none');
            
            if (sampleFoodItems.length === 0) {
                // Show empty state if no items
                emptyState.classList.remove('d-none');
                return;
            }
            
            // Clear existing rows
            tableBody.innerHTML = '';
            
            // Add food items to table
            sampleFoodItems.forEach(item => {
                const row = createFoodItemRow(item);
                tableBody.appendChild(row);
            });
            
            // Set up row event listeners
            setupRowEventListeners();
        }, 1000); // Simulate network delay
    }

    // Also update the grid view with items
    updateFoodItemsGrid();
}

// Create a table row for a food item
function createFoodItemRow(item) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', item.id);
    
    // Format status badge
    let statusBadge;
    if (item.stockStatus === 'in-stock') {
        statusBadge = '<span class="badge bg-success">In Stock</span>';
    } else if (item.stockStatus === 'low-stock') {
        statusBadge = '<span class="badge bg-warning">Low Stock</span>';
    } else {
        statusBadge = '<span class="badge bg-danger">Out of Stock</span>';
    }
    
    // Create row HTML
    row.innerHTML = `
        <td>
            <div class="form-check">
                <input class="form-check-input food-checkbox" type="checkbox">
            </div>
        </td>
        <td>
            <div class="d-flex align-items-center">
                <div class="food-image me-3">
                    <img src="${item.image}" alt="${item.name}" class="rounded">
                </div>
                <div>
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">${item.description.substring(0, 40)}${item.description.length > 40 ? '...' : ''}</small>
                </div>
            </div>
        </td>
        <td>
            <span class="badge bg-light-primary text-primary">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${statusBadge}</td>
        <td>${item.quantity}</td>
        <td>
            <div class="d-flex">
                <button class="btn btn-sm btn-info me-1 view-food-btn" data-bs-toggle="tooltip" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary me-1 edit-food-btn" data-bs-toggle="tooltip" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-food-btn" data-bs-toggle="tooltip" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Set up event listeners for the page
function setupEventListeners() {
    // Add new food item button
    const addFoodBtn = document.getElementById('addFoodBtn');
    if (addFoodBtn) {
        addFoodBtn.addEventListener('click', function() {
            // Reset form for new item
            resetFoodForm();
            // Set modal title for adding
            document.getElementById('foodModalTitle').textContent = 'Add New Food/Beverage Item';
        });
    }
    
    // Save food item button
    const saveFoodBtn = document.getElementById('saveFoodBtn');
    if (saveFoodBtn) {
        saveFoodBtn.addEventListener('click', saveFoodItem);
    }
    
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllFood');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.food-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchFood');
    if (searchInput) {
        searchInput.addEventListener('input', filterFoodItems);
    }
    
    // Filter functionality
    const filterCategory = document.getElementById('filterCategory');
    const filterAvailability = document.getElementById('filterAvailability');
    if (filterCategory) filterCategory.addEventListener('change', filterFoodItems);
    if (filterAvailability) filterAvailability.addEventListener('change', filterFoodItems);
    
    // Reset filters
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (filterCategory) filterCategory.value = 'all';
            if (filterAvailability) filterAvailability.value = 'all';
            filterFoodItems();
        });
    }
    
    // Delete confirmation button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteFoodItem);
    }
    
    // Edit food item from view modal
    const editFoodFromViewBtn = document.getElementById('editFoodFromViewBtn');
    if (editFoodFromViewBtn) {
        editFoodFromViewBtn.addEventListener('click', function() {
            // Get food ID from hidden field
            const foodId = document.getElementById('deleteFoodId').value;
            // Hide view modal and prepare edit modal
            const viewFoodModal = bootstrap.Modal.getInstance(document.getElementById('viewFoodModal'));
            viewFoodModal.hide();
            // Set up edit modal
            prepareEditModal(foodId);
            // Show edit modal
            const foodModal = new bootstrap.Modal(document.getElementById('foodModal'));
            foodModal.show();
        });
    }

    // Also set up grid view buttons
    setupGridViewEventListeners();
}

// Set up event listeners for table rows
function setupRowEventListeners() {
    // View food item button
    const viewBtns = document.querySelectorAll('.view-food-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const foodId = this.closest('tr').getAttribute('data-id');
            viewFoodItem(foodId);
        });
    });
    
    // Edit food item button
    const editBtns = document.querySelectorAll('.edit-food-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const foodId = this.closest('tr').getAttribute('data-id');
            prepareEditModal(foodId);
        });
    });
    
    // Delete food item button
    const deleteBtns = document.querySelectorAll('.delete-food-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const foodId = this.closest('tr').getAttribute('data-id');
            const foodItem = sampleFoodItems.find(item => item.id == foodId);
            
            if (foodItem) {
                document.getElementById('deleteFoodTitle').textContent = foodItem.name;
                document.getElementById('deleteFoodId').value = foodId;
                
                const deleteModal = new bootstrap.Modal(document.getElementById('deleteFoodModal'));
                deleteModal.show();
            }
        });
    });
}

// Filter food items based on search and filter criteria
function filterFoodItems() {
    const searchValue = document.getElementById('searchFood').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const availabilityFilter = document.getElementById('filterAvailability').value;
    
    const rows = document.querySelectorAll('#foodList tr');
    
    rows.forEach(row => {
        const foodId = row.getAttribute('data-id');
        const foodItem = sampleFoodItems.find(item => item.id == foodId);
        
        if (!foodItem) return;
        
        let matchesSearch = true;
        let matchesCategory = true;
        let matchesAvailability = true;
        
        // Check search
        if (searchValue !== '') {
            matchesSearch = foodItem.name.toLowerCase().includes(searchValue) || 
                           foodItem.description.toLowerCase().includes(searchValue);
        }
        
        // Check category
        if (categoryFilter !== 'all') {
            matchesCategory = foodItem.category === categoryFilter;
        }
        
        // Check availability
        if (availabilityFilter !== 'all') {
            matchesAvailability = foodItem.stockStatus === availabilityFilter;
        }
        
        // Show/hide row based on combined filters
        if (matchesSearch && matchesCategory && matchesAvailability) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Check if there are any visible rows
    const visibleRows = document.querySelectorAll('#foodList tr[style=""]');
    const emptyState = document.getElementById('emptyFoodState');
    const table = document.getElementById('foodTable');
    
    if (visibleRows.length === 0) {
        if (table) table.classList.add('d-none');
        if (emptyState) emptyState.classList.remove('d-none');
    } else {
        if (table) table.classList.remove('d-none');
        if (emptyState) emptyState.classList.add('d-none');
    }
}

// View food item details
function viewFoodItem(foodId) {
    const foodItem = sampleFoodItems.find(item => item.id == foodId);
    
    if (foodItem) {
        // Populate food details in view modal
        document.getElementById('viewFoodTitle').textContent = foodItem.name;
        document.getElementById('viewFoodImage').src = foodItem.image;
        document.getElementById('viewFoodDescription').textContent = foodItem.description;
        document.getElementById('viewFoodCategory').textContent = foodItem.category.charAt(0).toUpperCase() + foodItem.category.slice(1);
        document.getElementById('viewFoodPrice').textContent = `$${foodItem.price.toFixed(2)}`;
        
        // Format stock status
        let statusBadge;
        if (foodItem.stockStatus === 'in-stock') {
            statusBadge = '<span class="badge bg-success">In Stock</span>';
        } else if (foodItem.stockStatus === 'low-stock') {
            statusBadge = '<span class="badge bg-warning">Low Stock</span>';
        } else {
            statusBadge = '<span class="badge bg-danger">Out of Stock</span>';
        }
        document.getElementById('viewFoodStatus').innerHTML = statusBadge;
        
        document.getElementById('viewFoodQuantity').textContent = foodItem.quantity;
        document.getElementById('viewFoodAllergy').textContent = foodItem.allergyInfo || 'No allergy information available';
        document.getElementById('viewFoodFeatured').textContent = foodItem.featured ? 'Yes' : 'No';
        
        // Set food ID for edit action
        document.getElementById('deleteFoodId').value = foodId;
        
        // Show modal
        const viewModal = new bootstrap.Modal(document.getElementById('viewFoodModal'));
        viewModal.show();
    }
}

// Prepare edit modal with food item data
function prepareEditModal(foodId) {
    const foodItem = sampleFoodItems.find(item => item.id == foodId);
    
    if (foodItem) {
        // Set form values
        document.getElementById('foodId').value = foodItem.id;
        document.getElementById('name').value = foodItem.name;
        document.getElementById('category').value = foodItem.category;
        document.getElementById('price').value = foodItem.price;
        document.getElementById('stockStatus').value = foodItem.stockStatus;
        document.getElementById('quantity').value = foodItem.quantity;
        document.getElementById('description').value = foodItem.description;
        document.getElementById('allergyInfo').value = foodItem.allergyInfo || '';
        document.getElementById('featured').checked = foodItem.featured;
        
        // Set food image preview
        const imagePreview = document.getElementById('foodImagePreview');
        const imagePreviewContainer = document.getElementById('foodImagePreviewContainer');
        if (imagePreview && imagePreviewContainer) {
            imagePreview.src = foodItem.image;
            imagePreview.classList.remove('d-none');
            imagePreviewContainer.classList.add('d-none');
        }
        
        // Set modal title
        document.getElementById('foodModalTitle').textContent = 'Edit Item: ' + foodItem.name;
        
        // Show modal
        const foodModal = new bootstrap.Modal(document.getElementById('foodModal'));
        foodModal.show();
    }
}

// Reset food form for adding new item
function resetFoodForm() {
    document.getElementById('foodForm').reset();
    document.getElementById('foodId').value = '';
    
    // Reset image preview
    const imagePreview = document.getElementById('foodImagePreview');
    const imagePreviewContainer = document.getElementById('foodImagePreviewContainer');
    if (imagePreview && imagePreviewContainer) {
        imagePreview.classList.add('d-none');
        imagePreviewContainer.classList.remove('d-none');
    }
}

// Save food item (add new or update existing)
function saveFoodItem() {
    // Get form values
    const foodId = document.getElementById('foodId').value;
    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);
    const stockStatus = document.getElementById('stockStatus').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const description = document.getElementById('description').value;
    const allergyInfo = document.getElementById('allergyInfo').value;
    const featured = document.getElementById('featured').checked;
    
    // Get image
    const imageInput = document.getElementById('foodImageInput');
    let image = 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(name);
    
    // Validate form
    if (!name || !category || !price || !stockStatus || quantity === undefined || !description) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }
    
    // Create food item object
    const foodData = {
        name,
        category,
        price,
        stockStatus,
        quantity,
        description,
        allergyInfo,
        featured,
        image
    };
    
    // Simulate loading state
    const saveButton = document.getElementById('saveFoodBtn');
    const originalText = saveButton.innerHTML;
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Saving...';
    
    setTimeout(() => {
        if (foodId) {
            // Update existing food item
            updateFoodItem(foodId, foodData);
        } else {
            // Add new food item
            addFoodItem(foodData);
        }
        
        // Hide modal
        const foodModal = bootstrap.Modal.getInstance(document.getElementById('foodModal'));
        foodModal.hide();
        
        // Update the grid view
        updateFoodItemsGrid();
        
        // Reset button state
        saveButton.disabled = false;
        saveButton.innerHTML = originalText;
    }, 1000);
}

// Add new food item
function addFoodItem(foodData) {
    // In a real app, this would be an AJAX call to the server
    // For demo, we'll just add to the sample data
    
    // Generate new ID (would be done by server in real app)
    const newId = Math.max(...sampleFoodItems.map(item => item.id), 0) + 1;
    
    // Add ID to food data
    foodData.id = newId;
    
    // Add to sample data
    sampleFoodItems.push(foodData);
    
    // Reload food items table
    loadFoodItems();
    
    // Reload food items grid
    updateFoodItemsGrid();
    
    // Show success message
    showAlert(`"${foodData.name}" has been added successfully.`, 'success');
}

// Update existing food item
function updateFoodItem(foodId, foodData) {
    // In a real app, this would be an AJAX call to the server
    // For demo, we'll just update the sample data
    
    const index = sampleFoodItems.findIndex(item => item.id == foodId);
    
    if (index !== -1) {
        // Keep the ID and image (unless changed)
        foodData.id = sampleFoodItems[index].id;
        if (!foodData.image) {
            foodData.image = sampleFoodItems[index].image;
        }
        
        // Update the food item
        sampleFoodItems[index] = foodData;
        
        // Reload food items table
        loadFoodItems();
        
        // Reload food items grid
        updateFoodItemsGrid();
        
        // Show success message
        showAlert(`"${foodData.name}" has been updated successfully.`, 'success');
    }
}

// Delete food item
function deleteFoodItem() {
    const foodId = document.getElementById('deleteFoodId').value;
    
    if (foodId) {
        // In a real app, this would be an AJAX call to the server
        // For demo, we'll just remove from the sample data
        
        const index = sampleFoodItems.findIndex(item => item.id == foodId);
        
        if (index !== -1) {
            const foodName = sampleFoodItems[index].name;
            
            // Remove the food item
            sampleFoodItems.splice(index, 1);
            
            // Reload food items table
            loadFoodItems();
            
            // Reload food items grid
            updateFoodItemsGrid();
            
            // Hide modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteFoodModal'));
            deleteModal.hide();
            
            // Show success message
            showAlert(`"${foodName}" has been deleted successfully.`, 'success');
        }
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    
    if (alertContainer) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show alert-animate`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alertContainer.removeChild(alert);
            }, 300);
        }, 5000);
    }
}

// Initialize grid view buttons with tooltips and event handlers
function initializeGridViewButtons() {
    const viewBtns = document.querySelectorAll('#foodGrid .view-food-btn');
    const editBtns = document.querySelectorAll('#foodGrid .edit-food-btn');
    const deleteBtns = document.querySelectorAll('#foodGrid .delete-food-btn');
    
    viewBtns.forEach(btn => {
        new bootstrap.Tooltip(btn);
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const cardElement = this.closest('.card');
            const foodName = cardElement.querySelector('.card-title').textContent;
            const foodItem = sampleFoodItems.find(item => item.name === foodName);
            if (foodItem) {
                viewFoodItem(foodItem.id);
            }
        });
    });
    
    editBtns.forEach(btn => {
        new bootstrap.Tooltip(btn);
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const cardElement = this.closest('.card');
            const foodName = cardElement.querySelector('.card-title').textContent;
            const foodItem = sampleFoodItems.find(item => item.name === foodName);
            if (foodItem) {
                prepareEditModal(foodItem.id);
            }
        });
    });
    
    deleteBtns.forEach(btn => {
        new bootstrap.Tooltip(btn);
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const cardElement = this.closest('.card');
            const foodName = cardElement.querySelector('.card-title').textContent;
            const foodItem = sampleFoodItems.find(item => item.name === foodName);
            if (foodItem) {
                document.getElementById('deleteFoodTitle').textContent = foodItem.name;
                document.getElementById('deleteFoodId').value = foodItem.id;
                const deleteModal = new bootstrap.Modal(document.getElementById('deleteFoodModal'));
                deleteModal.show();
            }
        });
    });
}

// Update food items in the grid view based on data
function updateFoodItemsGrid() {
    const foodGrid = document.getElementById('foodGrid');
    if (!foodGrid) return;
    
    // Clear existing items except the "Add New Item" card
    const addNewCard = foodGrid.querySelector('.border-dashed');
    foodGrid.innerHTML = '';
    
    if (sampleFoodItems.length === 0) {
        const emptyState = document.getElementById('emptyFoodState');
        if (emptyState) emptyState.classList.remove('d-none');
        return;
    }
    
    // Add food items to grid
    sampleFoodItems.forEach(item => {
        const foodCard = createFoodItemCard(item);
        foodGrid.appendChild(foodCard);
    });
    
    // Add the "Add New Item" card back
    if (addNewCard) {
        foodGrid.appendChild(addNewCard);
    }
    
    // Set up event listeners for the newly created cards
    initializeGridViewButtons();
}

// Create a card element for a food item
function createFoodItemCard(item) {
    // Format status badge
    let statusBadge;
    if (item.stockStatus === 'in-stock') {
        statusBadge = '<span class="position-absolute top-0 end-0 m-3 badge bg-success rounded-pill">In Stock</span>';
    } else if (item.stockStatus === 'low-stock') {
        statusBadge = '<span class="position-absolute top-0 end-0 m-3 badge bg-warning rounded-pill">Low Stock</span>';
    } else {
        statusBadge = '<span class="position-absolute top-0 end-0 m-3 badge bg-danger rounded-pill">Out of Stock</span>';
    }
    
    // Format category badge
    let categoryBadge;
    switch (item.category) {
        case 'popcorn':
            categoryBadge = '<span class="badge bg-primary-subtle text-primary">Popcorn</span>';
            break;
        case 'drinks':
            categoryBadge = '<span class="badge bg-info-subtle text-info">Drinks</span>';
            break;
        case 'snacks':
            categoryBadge = '<span class="badge bg-warning-subtle text-warning">Snacks</span>';
            break;
        case 'combos':
            categoryBadge = '<span class="badge bg-success-subtle text-success">Combos</span>';
            break;
        default:
            categoryBadge = '<span class="badge bg-secondary-subtle text-secondary">Other</span>';
    }
    
    const col = document.createElement('div');
    col.className = 'col-xl-3 col-md-4 col-sm-6 mb-4';
    col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 rounded-4" data-id="${item.id}">
            <div class="position-relative">
                <img src="${item.image}" class="card-img-top rounded-top-4" alt="${item.name}">
                ${statusBadge}
            </div>
            <div class="card-body p-4">
                <div class="mb-2">
                    ${categoryBadge}
                </div>
                <h5 class="card-title fw-bold mb-1">${item.name}</h5>
                <p class="card-text text-muted mb-3">${item.description.substring(0, 60)}${item.description.length > 60 ? '...' : ''}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0 text-primary">$${item.price.toFixed(2)}</h5>
                    <span class="badge ${item.quantity <= 25 ? 'bg-warning text-dark' : 'bg-light text-dark'}">Qty: ${item.quantity}</span>
                </div>
            </div>
            <div class="card-footer bg-white border-0 p-3 pt-0">
                <div class="d-flex justify-content-between">
                    <button class="btn btn-icon btn-sm btn-info view-food-btn" data-bs-toggle="tooltip" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-sm btn-primary edit-food-btn" data-bs-toggle="tooltip" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-sm btn-danger delete-food-btn" data-bs-toggle="tooltip" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Set up event listeners for grid view buttons
function setupGridViewEventListeners() {
    // Add new item card (the dashed card)
    const addNewCard = document.querySelector('.card.border-dashed');
    if (addNewCard) {
        addNewCard.addEventListener('click', function() {
            resetFoodForm();
            const foodModal = new bootstrap.Modal(document.getElementById('foodModal'));
            foodModal.show();
        });
    }
}
