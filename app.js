/**
 * SNED CAFE - App Logic
 * Single Page Application, Vanilla JS, LocalStorage State
 */

// --- 1. Data Structure ---

const products = [
    // Beverages
    {
        id: 'b1',
        name: 'Iced Americano',
        category: 'beverages',
        price: 45.00,
        image: 'images/beverages/americano.jpg',
        description: 'A refreshing blend of espresso, milk, and vanilla syrup, poured over ice and topped with a sweet caramel drizzle.'
    },
    {
        id: 'b2',
        name: 'Iced Chocolate',
        category: 'beverages',
        price: 50.00,
        image: 'images/beverages/chocolate.jpg',
        description: 'Smooth, bold, and slow-steeped for 18 hours to perfection. A crisp and deeply flavorful coffee experience.'
    },
    {
        id: 'b3',
        name: 'Cafe Latte',
        category: 'beverages',
        price: 50.00,
        image: 'images/beverages/cafe.jpg',
        description: 'Premium matcha green tea blended with creamy milk. Earthy, slightly sweet, and utterly satisfying.'
    },
    {
        id: 'b4',
        name: 'Spanish Latte',
        category: 'beverages',
        price: 55.00,
        image: 'images/beverages/spanish.jpg',
        description: 'Rich espresso balanced with steamed milk and a thick layer of foam. A comforting classic.'
    },
    {
        id: 'b5',
        name: 'Sea Salt Latte',
        category: 'beverages',
        price: 55.00,
        image: 'images/beverages/salt.jpg',
        description: 'Rich espresso balanced with steamed milk and a thick layer of foam. A comforting classic.'
    },
    {
        id: 'b6',
        name: 'Strawberry Latte',
        category: 'beverages',
        price: 55.00,
        image: 'images/beverages/strawberry.jpg',
        description: 'Rich espresso balanced with steamed milk and a thick layer of foam. A comforting classic.'
    },
    // Pastries
    {
        id: 'p1',
        name: 'Crinkles',
        category: 'pastries',
        price: 15.00,
        image: 'images/pastries/crinkles.jpg',
        description: 'Flaky, buttery, and baked fresh daily. Perfect for pairing with your morning coffee.'
    },
    {
        id: 'p2',
        name: 'Oat Cookies',
        category: 'pastries',
        price: 15.00,
        image: 'images/pastries/cookies.jpg',
        description: 'Moist and tender muffin bursting with real blueberries and topped with a streusel crumb.'
    },
    {
        id: 'p3',
        name: 'Slice of Cake',
        category: 'pastries',
        price: 60.00,
        image: 'images/pastries/cake.jpg',
        description: 'Chewy on the inside, crispy on the outside, packed with rich chocolate chips.'
    },
    {
        id: 'p4',
        name: 'Banana Muffin',
        category: 'pastries',
        price: 20.00,
        image: 'images/pastries/banana.jpg',
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
const saveImgBtn = document.getElementById('save-img-btn');

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

// About Sliders Logic
function startAboutSliders() {
    const aboutSliders = document.querySelectorAll('.about-slider');
    aboutSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.about-slide');
        if (slides.length > 1) {
            let current = 0;
            setInterval(() => {
                slides[current].classList.remove('active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('active');
            }, 3000 + Math.random() * 2000); // randomize slightly to offset sliders
        }
    });
}

// Navigation Handler
function setupNavigation() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault(); // crucial for footer <a> links

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
window.openProductModal = function (productId) {
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
window.addToCart = function (productId) {
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

window.changeQuantity = function (productId, delta) {
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

window.removeFromCart = function (productId) {
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

    // DO NOT clear cart here yet. Wait for PDF generation or new order.
    closeCart();
    receiptModal.classList.add('open');
}

function startNewOrder() {
    // Clear cart and UI here if not already cleared by PDF save
    cart = [];
    saveCart();
    updateCartUI();

    receiptModal.classList.remove('open');
    // Navigate to menu if not already there
    document.querySelector('.nav-tab[data-target="menu-view"]').click();
}

async function saveReceiptAsImage() {
    const originalElement = document.querySelector('.receipt-card');
    if (!originalElement) return;

    const originalBtn = document.getElementById('save-img-btn');
    const originalBtnContent = originalBtn.innerHTML;

    try {
        originalBtn.innerHTML = '<i class="ph ph-spinner"></i> Saving...';
        originalBtn.disabled = true;

        // 1. Create a deep clone of the receipt
        const clone = originalElement.cloneNode(true);

        // Remove buttons from the clone
        const actions = clone.querySelector('.receipt-actions');
        if (actions) actions.remove();

        // 2. Remove any scrolling constraints from the clone
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';
        clone.style.boxShadow = 'none';
        clone.style.margin = '0';
        clone.style.width = '100%';

        // 3. Create a clean, unconstrained wrapper for the clone
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.width = '400px'; // Typical receipt width
        wrapper.style.height = 'auto'; // Let it grow as long as needed
        wrapper.style.zIndex = '-9999';
        wrapper.style.backgroundColor = '#ffffff';

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        // 4. Generate Image directly using html2canvas
        const canvas = await html2canvas(wrapper, {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: 0,
            windowWidth: 400
        });

        // Convert canvas to PNG data URL
        const imgData = canvas.toDataURL('image/png');

        // Create an invisible download link and click it
        const link = document.createElement('a');
        link.download = `SNED_CAFE_Receipt_${receiptOrderNo.textContent}.png`;
        link.href = imgData;
        link.click();

        // 5. Clean up
        document.body.removeChild(wrapper);

        // Clear cart AFTER successful generation
        cart = [];
        saveCart();
        updateCartUI();
        
        showToast('Receipt saved as image successfully!');
        
        // Optionally, automatically close the modal and start a new order
        document.getElementById('new-order-btn').click();

    } catch (error) {
        console.error('Image Generation Error:', error);
        showToast('Failed to generate receipt. Please try again.');
    } finally {
        if (originalBtn) {
            originalBtn.innerHTML = originalBtnContent;
            originalBtn.disabled = false;
        }
    }
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
saveImgBtn.addEventListener('click', saveReceiptAsImage);

// Init
function init() {
    setupNavigation();
    renderProducts();
    updateCartUI();
    startHeroSlider();
    startAboutSliders();
}

// Run on load
document.addEventListener('DOMContentLoaded', init);
