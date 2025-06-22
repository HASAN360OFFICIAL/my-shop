// এখানে আমরা আমাদের দোকানের প্রোডাক্ট ডেটা রাখব
const products = [
    {
        id: 1,
        name: "স্মার্টফোন X1",
        description: "নতুন মডেলের স্মার্টফোন, দারুণ ক্যামেরা ও ব্যাটারি লাইফ!",
        price: 25000,
        imageUrl: "https://via.placeholder.com/280x200/007bff/FFFFFF?text=Smartphone" // একটা ডামি ছবি
    },
    {
        id: 2,
        name: "ওয়্যারলেস হেডফোন",
        description: "উন্নত মানের সাউন্ড এবং আরামদায়ক ডিজাইন।",
        price: 3500,
        imageUrl: "https://via.placeholder.com/280x200/28a745/FFFFFF?text=Headphone" // আরেকটা ডামি ছবি
    },
    {
        id: 3,
        name: "গেমিং ল্যাপটপ",
        description: "শক্তিশালী প্রসেসর ও গ্রাফিক্স কার্ড সহ গেমিং ল্যাপটপ।",
        price: 85000,
        imageUrl: "https://via.placeholder.com/280x200/ffc107/333333?text=Gaming+Laptop" // আরেকটা ডামি ছবি
    }
];

// HTML-এর যেখানে প্রোডাক্টগুলো দেখানো হবে, সেই কন্টেইনারটা ধরছি
const productContainer = document.getElementById('product-container');

// প্রতিটি প্রোডাক্টের জন্য কার্ড তৈরি করি
products.forEach(product => {
    // একটা div তৈরি করি, যেটা হবে একটা প্রোডাক্ট কার্ড
    const productCard = document.createElement('div');
    productCard.classList.add('product-card'); // CSS ক্লাস যোগ করি

    // প্রোডাক্ট কার্ডের ভেতরের HTML কনটেন্ট তৈরি করি
    productCard.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">৳${product.price}</p>
        <button>কার্টে যোগ করুন</button>
    `;

    // তৈরি করা কার্ডটা মূল কন্টেইনারের মধ্যে যোগ করি
    productContainer.appendChild(productCard);
});

// ভবিষ্যতে আমরা এই বাটনগুলোতে ক্লিক করলে কার্টে যোগ করার ফাংশনালিটি যোগ করব!
const addToCartButtons = document.querySelectorAll('.product-card button');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('এখনো কার্টে যোগ করার ফাংশনালটা তৈরি হয়নি, মামা!');
    });
});