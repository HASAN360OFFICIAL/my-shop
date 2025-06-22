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
        stock: 10
    },
    {
        id: 2,
        name: "ওয়্যারলেস হেডফোন প্রো",
        description: "উন্নত মানের সাউন্ড এবং আরামদায়ক ডিজাইন, নয়েজ ক্যান্সেলিং।",
        price: 3500,
        imageUrl: "https://via.placeholder.com/280x220/28a745/FFFFFF?text=Headphone+Pro",
        category: "অডিও",
        rating: 4.2,
        stock: 5
    },
    {
        id: 3,
        name: "আলট্রা গেমিং ল্যাপটপ",
        description: "শক্তিশালী প্রসেসর ও গ্রাফিক্স কার্ড সহ আলট্রা গেমিং ল্যাপটপ।",
        price: 85000,
        imageUrl: "https://via.placeholder.com/280x220/ffc107/333333?text=Gaming+Laptop",
        category: "কম্পিউটার",
        rating: 4.8,
        stock: 2
    },
    {
        id: 4,
        name: "স্মার্টওয়াচ ভিআর",
        description: "হৃদস্পন্দন ও ঘুম ট্র্যাকিং সহ মাল্টি-ফাংশনাল স্মার্টওয়াচ।",
        price: 7000,
        imageUrl: "https://via.placeholder.com/280x220/6c757d/FFFFFF?text=Smartwatch",
        category: "ওয়্যারলেস গ্যাজেটস",
        rating: 4.0,
        stock: 0 // স্টক শেষ
    },
    {
        id: 5,
        name: "৪কে আলট্রা এইচডি টিভি",
        description: "বিশাল স্ক্রিন এবং ক্রিস্টাল ক্লিয়ার পিকচার কোয়ালিটি।",
        price: 60000,
        imageUrl: "https://via.placeholder.com/280x220/17a2b8/FFFFFF?text=4K+TV",
        category: "ইলেকট্রনিক্স",
        rating: 4.7,
        stock: 7
    }
];

// কার্ট ডেটা (মেমরিতে থাকবে)
let cart = [];

// DOM এলিমেন্টগুলো ধরছি
const productContainer = document.getElementById('product-container');
const cartCountElement = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-button');

// স্টার রেটিং তৈরি করার ফাংশন
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>'; // ভরা স্টার
        } else if (i - 0.5 === rating) {
            stars += '<i class="fas fa-star-half-alt"></i>'; // হাফ স্টার
        } else {
            stars += '<i class="far fa-star"></i>'; // খালি স্টার
        }
    }
    return stars;
}

// সকল প্রোডাক্ট ডিসপ্লে করার ফাংশন
function displayProducts() {
    productContainer.innerHTML = ''; // কন্টেইনার খালি করি যাতে ডুপ্লিকেট না হয়

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const inStock = product.stock > 0;
        const buttonText = inStock ? 'কার্টে যোগ করুন' : 'স্টক শেষ';
        // এখানে `disabled` অ্যাট্রিবিউট যোগ করলাম যদি স্টক না থাকে
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
        productContainer.appendChild(productCard);
    });

    // "কার্টে যোগ করুন" বাটনে ইভেন্ট লিসেনার যোগ করি
    // প্রতিটি কার্ড তৈরি হওয়ার পর সেই কার্ডের বাটনগুলো ধরতে হবে
    const addToCartButtons = document.querySelectorAll('.product-card button');
    addToCartButtons.forEach(button => {
        // শুধুমাত্র যে বাটনগুলো disabled নয়, সেগুলোতে ইভেন্ট লিসেনার যোগ করব
        if (!button.disabled) {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                addToCart(productId);
            });
        }
    });
}

// কার্টে প্রোডাক্ট যোগ করার ফাংশন
function addToCart(productId) {
    const productToAdd = products.find(p => p.id === productId);

    // প্রোডাক্ট আছে কিনা এবং স্টক আছে কিনা, দুটোই চেক করছি
    if (productToAdd && productToAdd.stock > 0) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        
        productToAdd.stock--; // স্টক কমিয়ে দিচ্ছি
        updateCartCount();
        alert(`${productToAdd.name} কার্টে যোগ করা হয়েছে!`);
        displayProducts(); // স্টক আপডেট হওয়ার পর UI রিফ্রেশ করি
    } else {
        alert('দুঃখিত, এই প্রোডাক্টের স্টক শেষ অথবা এটি আর উপলব্ধ নেই!');
    }
}

// কার্ট কাউন্টার আপডেট করার ফাংশন
function updateCartCount() {
    const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItemsInCart;
}

// কার্ট বাটন ক্লিক করলে কি হবে (এখনো শুধু অ্যালার্ট)
cartButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('তোর কার্ট একদম খালি, মামা! কিছু কেনাকাটা কর!');
    } else {
        let cartSummary = "তোর কার্টে যা আছে:\n";
        cart.forEach(item => {
            cartSummary += `- ${item.name} x ${item.quantity} (৳${(item.price * item.quantity).toLocaleString('bn-BD')})\n`;
        });
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartSummary += `\nমোট: ৳${totalPrice.toLocaleString('bn-BD')}`;
        alert(cartSummary);
    }
});

// ওয়েবসাইট লোড হওয়ার সাথে সাথেই প্রোডাক্টগুলো ডিসপ্লে করি
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount(); // পেজ লোড হওয়ার সময় কার্ট কাউন্টার ০ দেখাবে
});
