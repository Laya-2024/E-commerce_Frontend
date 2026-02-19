// Check authentication
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

document.getElementById('userName').textContent = `Hello, ${currentUser.name}`;

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [...products];

// Display products
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = filteredProducts.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="category">${p.category}</p>
            <p class="price">₹${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Filters
document.getElementById('categoryFilter').addEventListener('change', applyFilters);
document.getElementById('priceFilter').addEventListener('input', (e) => {
    document.getElementById('priceValue').textContent = `₹${e.target.value}`;
    applyFilters();
});
document.getElementById('searchFilter').addEventListener('input', applyFilters);

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = parseInt(document.getElementById('priceFilter').value);
    const search = document.getElementById('searchFilter').value.toLowerCase();
    
    filteredProducts = products.filter(p => {
        return (!category || p.category === category) &&
               (p.price <= maxPrice) &&
               (p.name.toLowerCase().includes(search));
    });
    
    displayProducts();
}

function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = 1000;
    document.getElementById('priceValue').textContent = '₹1000';
    document.getElementById('searchFilter').value = '';
    filteredProducts = [...products];
    displayProducts();
}

// Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.textContent = count;
    cartTotal.textContent = `₹${total}`;
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully! Total: ₹${total}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    toggleCart();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize
displayProducts();
updateCart();
