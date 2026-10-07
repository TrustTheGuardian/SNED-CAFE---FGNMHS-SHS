/**
 * SNED CAFE - App Logic
 * Single Page Application, Vanilla JS, LocalStorage State
 */

// --- 1. Data Structure ---

const products = [
    // Beverages
    {
        id: 'b1',
        name: 'Iced Caramel Macchiato',
        category: 'beverages',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67efca?auto=format&fit=crop&w=600&q=80',
        description: 'A refreshing blend of espresso, milk, and vanilla syrup, poured over ice and topped with a sweet caramel drizzle.'
    },
    {
        id: 'b2',
        name: 'Classic Cold Brew',
        category: 'beverages',
        price: 100.00,
        image: 'https://images.unsplash.com/photo-1461023058943-07cb14a601dc?auto=format&fit=crop&w=600&q=80',
        description: 'Smooth, bold, and slow-steeped for 18 hours to perfection. A crisp and deeply flavorful coffee experience.'
    },
    {
        id: 'b3',
        name: 'Matcha Green Tea Latte',
        category: 'beverages',
        price: 140.00,
        image: 'https://images.unsplash.com/photo-1536514072410-5019a3c69182?auto=format&fit=crop&w=600&q=80',
        description: 'Premium matcha green tea blended with creamy milk. Earthy, slightly sweet, and utterly satisfying.'
    },
    {
        id: 'b4',
        name: 'Hot Cappuccino',
        category: 'beverages',
        price: 110.00,
        image: 'https://images.unsplash.com/photo-1534687941688-641fcbb1a498?auto=format&fit=crop&w=600&q=80',
        description: 'Rich espresso balanced with steamed milk and a thick layer of foam. A comforting classic.'
    },
    // Pastries
    {
        id: 'p1',
        name: 'Butter Croissant',
        category: 'pastries',
        price: 75.00,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        description: 'Flaky, buttery, and baked fresh daily. Perfect for pairing with your morning coffee.'
    },
    {
        id: 'p2',
        name: 'Blueberry Muffin',
        category: 'pastries',
        price: 85.00,
        image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80',
        description: 'Moist and tender muffin bursting with real blueberries and topped with a streusel crumb.'
    },
    {
        id: 'p3',
        name: 'Chocolate Chip Cookie',
        category: 'pastries',
        price: 50.00,
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
        description: 'Chewy on the inside, crispy on the outside, packed with rich chocolate chips.'
    },
    {
        id: 'p4',
        name: 'Fudgy Brownie',
        category: 'pastries',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80',
        description: 'Decadent, dense chocolate brownie that melts in your mouth.'
    }
];

// --- 2. State Management ---

let cart = JSON.parse(localStorage.getItem('snedCafeCart')) || [];

function saveCart() {
    localStorage.setItem('snedCafeCart', JSON.stringify(cart));
}

// Format currency
const formatCurrency = (amount) => {
    return '₱' + amount.toFixed(2);
};

// --- 3. DOM Elements ---

const views = document.querySelectorAll('.view-section');
const navTabs = document.querySelectorAll('.nav-tab');

const beveragesGrid = document.getElementById('beverages-grid');
const pastriesGrid = document.getElementById('pastries-grid');

const floatingCartBtn = document.getElementById('floating-cart-btn');
const cartBadge = document.getElementById('cart-badge');
const cartTotalPreview = document.getElementById('cart-total-preview');

const cartOverlay = document.getElementById('cart-overlay');
const cartPanel = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

const receiptModal = document.getElementById('receipt-modal');
const receiptOrderNo = document.getElementById('receipt-order-no');
const receiptDate = document.getElementById('receipt-date');
const receiptItemsContainer = document.getElementById('receipt-items-container');
const receiptTotalAmount = document.getElementById('receipt-total-amount');
const newOrderBtn = document.getElementById('new-order-btn');
const savePdfBtn = document.getElementById('save-pdf-btn');

const contactForm = document.getElementById('contact-form');
const toastContainer = document.getElementById('toast-container');

// Hero Slider Elements
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

// Product Modal Elements
const productModal = document.getElementById('product-modal');
const closeProductModalBtn = document.getElementById('close-product-modal-btn');
const detailImg = document.getElementById('detail-img');
const detailName = document.getElementById('detail-name');
const detailPrice = document.getElementById('detail-price');
const detailDesc = document.getElementById('detail-desc');
const detailAddBtn = document.getElementById('detail-add-btn');

// --- 4. Core Functions ---

// Hero Slider Logic
function startHeroSlider() {
    setInterval(() => {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }, 4000);
}

// Navigation Handler
function setupNavigation() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            navTabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            // Add active class to clicked tab and corresponding view
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Render Products
function renderProducts() {
    const beverages = products.filter(p => p.category === 'beverages');
    const pastries = products.filter(p => p.category === 'pastries');

    const createCard = (product) => `
        <div class="product-card" onclick="openProductModal('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatCurrency(product.price)}</p>
                <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">
                    <i class="ph ph-plus-circle"></i> Add to Cart
                </button>
            </div>
        </div>
    `;

    beveragesGrid.innerHTML = beverages.map(createCard).join('');
    pastriesGrid.innerHTML = pastries.map(createCard).join('');
}

// Product Modal Logic
window.openProductModal = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    detailImg.src = product.image;
    detailImg.alt = product.name;
    detailName.textContent = product.name;
    detailPrice.textContent = formatCurrency(product.price);
    detailDesc.textContent = product.description;
    
    // Set up add to cart button in modal
    detailAddBtn.onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };

    productModal.classList.add('open');
};

function closeProductModal() {
    productModal.classList.remove('open');
}

closeProductModalBtn.addEventListener('click', closeProductModal);
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
});

// Cart Logic
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart`);
};

window.changeQuantity = function(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart();
        updateCartUI();
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

function updateCartUI() {
    // Update Badge & Preview
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartBadge.textContent = totalItems;
    cartTotalPreview.textContent = formatCurrency(totalPrice);
    
    // Hide floating btn if empty
    floatingCartBtn.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update Cart Panel
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')"><i class="ph ph-trash"></i></button>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    cartSubtotalEl.textContent = formatCurrency(totalPrice);
    cartTotalEl.textContent = formatCurrency(totalPrice);
}

// Cart Panel Toggles
function openCart() {
    cartOverlay.classList.add('open');
    cartPanel.classList.add('open');
}

function closeCart() {
    cartOverlay.classList.remove('open');
    cartPanel.classList.remove('open');
}

// Checkout & Receipt
function handleCheckout() {
    if (cart.length === 0) return;
    
    // Generate receipt data
    const orderNo = Math.floor(100000 + Math.random() * 900000);
    const date = new Date().toLocaleString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    });
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Populate receipt UI
    receiptOrderNo.textContent = orderNo;
    receiptDate.textContent = date;
    
    receiptItemsContainer.innerHTML = cart.map(item => `
        <div class="receipt-item-row">
            <span class="receipt-item-qty">${item.quantity}x</span>
            <span class="receipt-item-name">${item.name}</span>
            <span class="receipt-item-price">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');
    
    receiptTotalAmount.textContent = formatCurrency(totalPrice);
    
    // Clear cart and show receipt
    cart = [];
    saveCart();
    updateCartUI();
    
    closeCart();
    receiptModal.classList.add('open');
}

function startNewOrder() {
    receiptModal.classList.remove('open');
    // Navigate to menu if not already there
    document.querySelector('.nav-tab[data-target="menu-view"]').click();
}

function saveReceiptAsPDF() {
    const element = document.querySelector('.receipt-card');
    
    // Temporarily hide buttons for the PDF
    const actions = element.querySelector('.receipt-actions');
    actions.style.display = 'none';

    const opt = {
        margin:       1,
        filename:     `SNED_CAFE_Receipt_${receiptOrderNo.textContent}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        // Restore buttons after PDF is generated
        actions.style.display = 'flex';
    });
}

// Forms & Toast
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent successfully! We will get back to you soon.');
    contactForm.reset();
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger reflow
    void toast.offsetWidth;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 5. Event Listeners & Initialization ---

floatingCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', handleCheckout);
newOrderBtn.addEventListener('click', startNewOrder);
savePdfBtn.addEventListener('click', saveReceiptAsPDF);

// Init
function init() {
    setupNavigation();
    renderProducts();
    updateCartUI();
    startHeroSlider();
}

// Run on load
document.addEventListener('DOMContentLoaded', init);
