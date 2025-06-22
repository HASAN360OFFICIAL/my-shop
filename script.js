// প্রোডাক্ট ডেটা (আগের মতোই)
const products = [
    {
        id: 1,
        name: "স্মার্টফোন X1 প্রো",
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
        name: "ওয়্যারলেস হেডফোন প্রো",
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
        name: "আলট্রা গেমিং ল্যাপটপ",
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
        name: "স্মার্টওয়াচ ভিআর",
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
        name: "৪কে আলট্রা এইচডি টিভি",
        description: "বিশাল স্ক্রিন এবং ক্রিস্টাল ক্লিয়ার পিকচার কোয়ালিটি।",
        price: 60000,
        imageUrl: "https://via.placeholder.com/280x220/17a2b8/FFFFFF?text=4K+TV",
        category: "ইলেকট্রনিক্স",
        rating: 4.7,
        stock: 7,
        featured: false
    }
];

// কার্ট ডেটা (localStorage থেকে লোড বা খালি অ্যারে)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// অর্ডারের ডেটা (localStorage থেকে লোড বা খালি অ্যারে)
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM এলিমেন্টগুলো ধরছি
const cartCountElement = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-button');

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
    if (featuredProductContainer) { // চেক করি এলিমেন্টটা আছে কিনা (শুধু index.html এ থাকবে)
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
    if (productContainer) { // চেক করি এলিমেন্টটা আছে কিনা (শুধু products.html এ থাকবে)
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
        saveCartToLocalStorage(); // কার্ট সেভ করি
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
function generateOrder() {
    if (cart.length === 0) {
        alert('অর্ডার করার জন্য কার্টে কোনো প্রোডাক্ট নেই!');
        return;
    }

    const orderId = 'ORD-' + Math.floor(Math.random() * 100000); // সিম্পল আইডি
    const orderDate = new Date().toLocaleString('bn-BD');
    const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
    }));
    const orderTotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const newOrder = {
        id: orderId,
        date: orderDate,
        items: orderItems,
        total: orderTotal,
        status: 'Pending' // নতুন অর্ডার Pending থাকবে
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders)); // অর্ডার সেভ করি

    cart = []; // কার্ট খালি করি
    saveCartToLocalStorage(); // খালি কার্ট সেভ করি
    updateCartCount(); // কার্ট কাউন্টার আপডেট করি

    alert(`অর্ডার সফল হয়েছে! আপনার অর্ডার আইডি: ${orderId}\nআমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`);
}

// কার্ট বাটন ক্লিক করলে কি হবে (আগের মতোই, কিন্তু অর্ডার জেনারেট অপশন যোগ করা হয়েছে)
cartButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('তোর কার্ট একদম খালি, মামা! কিছু কেনাকাটা কর!');
    } else {
        let cartSummary = "তোর কার্টে যা আছে:\n";
        cart.forEach(item => {
            cartSummary += `- ${item.name} x ${item.quantity} (৳${(item.price * item.quantity).toLocaleString('bn-BD')})\n`;
        });
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartSummary += `\nমোট: ৳${totalPrice.toLocaleString('bn-BD')}\n\n`;
        cartSummary += `এখন কি অর্ডার করতে চাস?`;

        if (confirm(cartSummary)) {
            generateOrder();
        }
    }
});

// ওয়েবসাইট লোড হওয়ার সাথে সাথেই প্রোডাক্টগুলো ডিসপ্লে করি
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // কার্ট কাউন্টার আপডেট করি

    // কারেন্ট পেজ অনুযায়ী প্রোডাক্ট ডিসপ্লে করি
    if (window.location.pathname.includes('index.html')) {
        displayFeaturedProducts();
    } else if (window.location.pathname.includes('products.html')) {
        displayAllProducts();
    }
});
