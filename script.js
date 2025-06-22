// প্রোডাক্ট ডেটা (আগের মতোই) - HSN হিসেবে তোর নিজস্ব কিছু প্রোডাক্ট যোগ করতে পারিস
const products = [
    {
        id: 1,
        name: "HSN স্মার্টফোন X1 প্রো",
        description: "নতুন মডেলের স্মার্টফোন, দারুণ ক্যামেরা ও ব্যাটারি লাইফ।",
        price: 25000,
        imageUrl: "https://via.placeholder.com/280x220/007bff/FFFFFF?text=Smartphone+X1",
        category: "ইলেকট্রনিক্স",
        rating: 4.5,
        stock: 10,
        featured: true
    },
    {
        id: 2,
        name: "HSN ওয়্যারলেস হেডফোন প্রো",
        description: "উন্নত মানের সাউন্ড এবং আরামদায়ক ডিজাইন, নয়েজ ক্যান্সেলিং।",
        price: 3500,
        imageUrl: "https://via.placeholder.com/280x220/28a745/FFFFFF?text=Headphone+Pro",
        category: "অডিও",
        rating: 4.2,
        stock: 5,
        featured: true
    },
    {
        id: 3,
        name: "HSN আলট্রা গেমিং ল্যাপটপ",
        description: "শক্তিশালী প্রসেসর ও গ্রাফিক্স কার্ড সহ আলট্রা গেমিং ল্যাপটপ।",
        price: 85000,
        imageUrl: "https://via.placeholder.com/280x220/ffc107/333333?text=Gaming+Laptop",
        category: "কম্পিউটার",
        rating: 4.8,
        stock: 2,
        featured: true
    },
    {
        id: 4,
        name: "HSN স্মার্টওয়াচ ভিআর",
        description: "হৃদস্পন্দন ও ঘুম ট্র্যাকিং সহ মাল্টি-ফাংশনাল স্মার্টওয়াচ।",
        price: 7000,
        imageUrl: "https://via.placeholder.com/280x220/6c757d/FFFFFF?text=Smartwatch",
        category: "ওয়্যারলেস গ্যাজেটস",
        rating: 4.0,
        stock: 0,
        featured: false
    },
    {
        id: 5,
        name: "HSN ৪কে আলট্রা এইচডি টিভি",
        description: "বিশাল স্ক্রিন এবং ক্রিস্টাল ক্লিয়ার পিকচার কোয়ালিটি।",
        price: 60000,
        imageUrl: "https://via.placeholder.com/280x220/17a2b8/FFFFFF?text=4K+TV",
        category: "ইলেকট্রনিক্স",
        rating: 4.7,
        stock: 7,
        featured: false
    }
];

// কাস্টমাইজযোগ্য ডেলিভারি চার্জ
const DELIVERY_CHARGE_PER_ITEM = 120; // প্রতিটা প্রোডাক্টের জন্য 120 টাকা ডেলিভারি চার্জ

// কার্ট ডেটা (localStorage থেকে লোড বা খালি অ্যারে)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// অর্ডারের ডেটা (localStorage থেকে লোad বা খালি অ্যারে)
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM এলিমেন্টগুলো ধরছি
const cartCountElement = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-button');

// Checkout Modal elements
const checkoutModal = document.createElement('div');
checkoutModal.classList.add('modal');
checkoutModal.id = 'checkout-modal';
document.body.appendChild(checkoutModal);

// স্টার রেটিং তৈরি করার ফাংশন
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 === rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// প্রোডাক্ট কার্ড তৈরি করার ফাংশন
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    const inStock = product.stock > 0;
    const buttonText = inStock ? 'কার্টে যোগ করুন' : 'স্টক শেষ';
    const buttonDisabled = !inStock ? 'disabled' : '';

    productCard.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}">
        <div class="product-card-content">
            <p class="category">${product.category}</p>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="rating">${getStarRating(product.rating)} (${product.rating})</div>
            <p class="price">৳${product.price.toLocaleString('bn-BD')}</p>
            ${!inStock ? '<p class="out-of-stock">এই মুহূর্তে স্টক নেই</p>' : ''}
            <button data-product-id="${product.id}" ${buttonDisabled}>${buttonText}</button>
        </div>
    `;

    const addToCartButton = productCard.querySelector('button');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            addToCart(product.id);
        });
    }

    return productCard;
}

// হোমপেজের জন্য সেরা প্রোডাক্টগুলো দেখানোর ফাংশন
function displayFeaturedProducts() {
    const featuredProducts = products.filter(product => product.featured);
    const featuredProductContainer = document.getElementById('featured-product-container');
    if (featuredProductContainer) {
        featuredProductContainer.innerHTML = '';
        featuredProducts.forEach(product => {
            const productCard = createProductCard(product);
            featuredProductContainer.appendChild(productCard);
        });
    }
}

// সব প্রোডাক্ট দেখানোর ফাংশন (products.html এর জন্য)
function displayAllProducts() {
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            productContainer.appendChild(productCard);
        });
    }
}

// কার্টে প্রোডাক্ট যোগ করার ফাংশন
function addToCart(productId) {
    const productToAdd = products.find(p => p.id === productId);

    if (productToAdd && productToAdd.stock > 0) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        
        productToAdd.stock--;
        updateCartCount();
        saveCartToLocalStorage();
        alert(`${productToAdd.name} কার্টে যোগ করা হয়েছে!`);
        // যে পেজে আছি, সেই পেজের প্রোডাক্ট রিফ্রেশ করি
        if (window.location.pathname.includes('index.html')) {
            displayFeaturedProducts();
        } else if (window.location.pathname.includes('products.html')) {
            displayAllProducts();
        }
    } else {
        alert('দুঃখিত, এই প্রোডাক্টের স্টক শেষ!');
    }
}

// কার্ট কাউন্টার আপডেট করার ফাংশন
function updateCartCount() {
    const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItemsInCart;
}

// কার্ট লোকাল স্টোরেজে সেভ করার ফাংশন
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// অর্ডার জেনারেট করার ফাংশন (কার্টকে অর্ডারে রূপান্তর)
function generateOrder(customerName, customerPhone, customerAddress) {
    if (cart.length === 0) {
        alert('অর্ডার করার জন্য কার্টে কোনো প্রোডাক্ট নেই!');
        return;
    }

    const orderId = 'ORD-' + Math.floor(Math.random() * 100000);
    const orderDate = new Date().toLocaleString('bn-BD');
    const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
    }));
    let subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalDeliveryCharge = cart.length * DELIVERY_CHARGE_PER_ITEM; // প্রতিটি আইটেমের জন্য 120 টাকা ডেলিভারি চার্জ
    let orderTotal = subtotal + totalDeliveryCharge; // মোট ডেলিভারি চার্জ যোগ করি

    const newOrder = {
        id: orderId,
        date: orderDate,
        items: orderItems,
        customerInfo: {
            name: customerName,
            phone: customerPhone,
            address: customerAddress
        },
        subtotal: subtotal,
        totalDeliveryCharge: totalDeliveryCharge,
        total: orderTotal,
        status: 'Pending' // নতুন অর্ডার Pending থাকবে
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders)); // অর্ডার সেভ করি

    cart = []; // কার্ট খালি করি
    saveCartToLocalStorage(); // খালি কার্ট সেভ করি
    updateCartCount(); // কার্ট কাউন্টার আপডেট করি

    alert(`অর্ডার সফল হয়েছে! আপনার অর্ডার আইডি: ${orderId}\nমোট বিল: ৳${orderTotal.toLocaleString('bn-BD')} (ডেলিভারি চার্জ ৳${totalDeliveryCharge.toLocaleString('bn-BD')} সহ)।\nআমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`);
    checkoutModal.style.display = 'none'; // Modal বন্ধ করি
}

// কার্ট বাটন ক্লিক করলে কি হবে (Checkout Modal দেখাবে)
cartButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('তোর কার্ট একদম খালি, মামা! কিছু কেনাকাটা কর!');
        return;
    }

    // কার্ট সামারি তৈরি করি
    let cartSummaryHtml = `<h3>তোর কার্টে যা আছে:</h3>`;
    let subtotal = 0;
    cart.forEach(item => {
        const itemPrice = item.price * item.quantity;
        subtotal += itemPrice;
        cartSummaryHtml += `
            <p>${item.name} x ${item.quantity} (৳${itemPrice.toLocaleString('bn-BD')})</p>
        `;
    });

    const totalDeliveryCharge = cart.length * DELIVERY_CHARGE_PER_ITEM;
    const finalTotal = subtotal + totalDeliveryCharge;

    cartSummaryHtml += `
        <p style="border-top: 1px dashed #ccc; padding-top: 10px;">সাবটোটাল: ৳${subtotal.toLocaleString('bn-BD')}</p>
        <p>ডেলিভারি চার্জ (${cart.length} টি আইটেমের জন্য): ৳${totalDeliveryCharge.toLocaleString('bn-BD')}</p>
        <p style="font-weight: bold; font-size: 1.2rem;">মোট: ৳${finalTotal.toLocaleString('bn-BD')}</p>
    `;

    // Checkout Modal এর ভেতরের কন্টেন্ট
    checkoutModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>অর্ডার কনফার্ম করুন</h2>
            ${cartSummaryHtml}
            <form id="customer-info-form" class="customer-info-form">
                <div>
                    <label for="customerName">তোর নাম:</label>
                    <input type="text" id="customerName" name="customerName" required>
                </div>
                <div>
                    <label for="customerPhone">ফোন নম্বর:</label>
                    <input type="tel" id="customerPhone" name="customerPhone" pattern="[0-9]{11}" placeholder="১১ ডিজিটের নম্বর দিন" required>
                </div>
                <div>
                    <label for="customerAddress">ঠিকানা:</label>
                    <textarea id="customerAddress" name="customerAddress" required></textarea>
                </div>
                <button type="submit">অর্ডার নিশ্চিত করুন</button>
            </form>
        </div>
    `;
    checkoutModal.style.display = 'flex'; // Modal দেখাই

    // Modal বন্ধ করার জন্য ইভেন্ট লিসেনার
    checkoutModal.querySelector('.close-button').addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    // Modal এর বাইরে ক্লিক করলে বন্ধ হবে
    window.addEventListener('click', (event) => {
        if (event.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });

    // কাস্টমার ফর্ম সাবমিট হ্যান্ডলার
    checkoutModal.querySelector('#customer-info-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;
        generateOrder(name, phone, address);
    });
});


// --- মোবাইল মেনু টগল করার জন্য জাভাস্ক্রিপ্ট ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links'); // ul এর জন্য

    if (menuToggle && navLinks) { // নিশ্চিত করি এলিমেন্টগুলো আছে
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active'); // 'responsive' এর বদলে 'active' ক্লাস টগল করব
            // আইকন চেঞ্জ করি (বার্গার থেকে ক্রস বা উল্টো)
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // ক্রস আইকন
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // বার্গার আইকন
            }
        });

        // যখন মেনু খোলা থাকবে, মেনু আইটেমে ক্লিক করলে মেনু বন্ধ হবে
        document.querySelectorAll('.nav-links li a').forEach(item => { // nav-links এর ভেতরের a ট্যাগ
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // বাকি পেজ লোড হওয়ার সাথে সাথেই প্রোডাক্টগুলো ডিসপ্লে করি
    updateCartCount();

    // current page check and display products
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/my-shop/') {
        displayFeaturedProducts();
    } else if (window.location.pathname.includes('products.html')) {
        displayAllProducts();
    }
});
