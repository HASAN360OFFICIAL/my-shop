// প্রোডাক্ট ডেটা (এটা ব্রাউজারের মেমরিতে থাকবে, পার্মানেন্ট হবে না)
// এই array টা তোর main script.js এর products array এর সাথে sync নাও থাকতে পারে।
// ডেটাবেজ ছাড়া দুটোকে sync রাখা সম্ভব নয়।
let products = [
    {
        id: 1,
        name: "স্মার্টফোন X1 প্রো",
        description: "নতুন মডেলের স্মার্টফোন, দারুণ ক্যামেরা ও ব্যাটারি লাইফ।",
        price: 25000,
        imageUrl: "https://via.placeholder.com/80x80/007bff/FFFFFF?text=P1",
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
        imageUrl: "https://via.placeholder.com/80x80/28a745/FFFFFF?text=P2",
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
        imageUrl: "https://via.placeholder.com/80x80/ffc107/333333?text=P3",
        category: "কম্পিউটার",
        rating: 4.8,
        stock: 2,
        featured: true
    }
];

// DOM এলিমেন্টগুলো ধরছি
const productForm = document.getElementById('product-form');
const adminProductContainer = document.getElementById('admin-product-container');
const submitButton = document.getElementById('submitButton');
const clearFormButton = document.getElementById('clearFormButton');

let editingProductId = null; // কোন প্রোডাক্ট এডিট হচ্ছে তা ট্র্যাক করার জন্য

// প্রোডাক্ট লিস্ট ডিসপ্লে করার ফাংশন
function displayAdminProducts() {
    adminProductContainer.innerHTML = ''; // কন্টেইনার খালি করি

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item-admin');
        productItem.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <div class="product-info-admin">
                <h3>${product.name}</h3>
                <p>আইডি: ${product.id}</p>
                <p>দাম: ৳${product.price.toLocaleString('bn-BD')}</p>
                <p>স্টক: ${product.stock}</p>
                <p>ক্যাটাগরি: ${product.category}</p>
            </div>
            <div class="product-actions-admin">
                <button class="edit-btn" data-id="${product.id}">এডিট</button>
                <button class="delete-btn" data-id="${product.id}">ডিলিট</button>
            </div>
        `;
        adminProductContainer.appendChild(productItem);
    });

    // এডিট ও ডিলিট বাটনে ইভেন্ট লিসেনার যোগ করি
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            editProduct(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            deleteProduct(id);
        });
    });
}

// ফর্ম সাবমিট হ্যান্ডলার (নতুন প্রোডাক্ট যোগ বা এডিট)
productForm.addEventListener('submit', (e) => {
    e.preventDefault(); // ফর্ম সাবমিট হওয়া থামাই

    const formData = new FormData(productForm);
    const productData = {
        id: editingProductId ? parseInt(formData.get('id')) : generateProductId(), // আইডি ম্যানেজ করি
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        imageUrl: formData.get('imageUrl'),
        category: formData.get('category'),
        rating: parseFloat(formData.get('rating')),
        stock: parseInt(formData.get('stock')),
        featured: formData.get('featured') === 'on' // checkbox এর জন্য
    };

    if (editingProductId) {
        // প্রোডাক্ট এডিট করছি
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = productData;
            alert('প্রোডাক্ট সফলভাবে আপডেট হয়েছে!');
        }
        editingProductId = null; // এডিট মোড বন্ধ করি
        submitButton.textContent = 'প্রোডাক্ট যোগ করুন'; // বাটন টেক্সট বদলাই
    } else {
        // নতুন প্রোডাক্ট যোগ করছি
        products.push(productData);
        alert('নতুন প্রোডাক্ট যোগ হয়েছে!');
    }

    productForm.reset(); // ফর্ম খালি করি
    document.getElementById('productId').value = ''; // আইডি ফিল্ডও খালি করি
    displayAdminProducts(); // লিস্ট আপডেট করি
});

// প্রোডাক্ট এডিট করার জন্য ফর্ম পূরণ করি
function editProduct(id) {
    const productToEdit = products.find(p => p.id === id);
    if (productToEdit) {
        document.getElementById('productId').value = productToEdit.id;
        document.getElementById('productName').value = productToEdit.name;
        document.getElementById('productDescription').value = productToEdit.description;
        document.getElementById('productPrice').value = productToEdit.price;
        document.getElementById('productImageUrl').value = productToEdit.imageUrl;
        document.getElementById('productCategory').value = productToEdit.category;
        document.getElementById('productRating').value = productToEdit.rating;
        document.getElementById('productStock').value = productToEdit.stock;
        document.getElementById('productFeatured').checked = productToEdit.featured;
        
        editingProductId = id; // এডিট মোড অন করি
        submitButton.textContent = 'প্রোডাক্ট আপডেট করুন'; // বাটন টেক্সট বদলাই
    }
}

// প্রোডাক্ট ডিলিট করার ফাংশন
function deleteProduct(id) {
    if (confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলিট করতে চান?')) {
        products = products.filter(product => product.id !== id);
        alert('প্রোডাক্ট ডিলিট হয়েছে!');
        displayAdminProducts();
        // যদি বর্তমানে এডিট মোডে থাকা প্রোডাক্টটি ডিলিট করা হয়
        if (editingProductId === id) {
            editingProductId = null;
            productForm.reset();
            document.getElementById('productId').value = '';
            submitButton.textContent = 'প্রোডাক্ট যোগ করুন';
        }
    }
}

// নতুন প্রোডাক্ট আইডি জেনারেট করার ফাংশন
function generateProductId() {
    if (products.length === 0) return 1;
    const maxId = Math.max(...products.map(p => p.id));
    return maxId + 1;
}

// ফর্ম পরিষ্কার করার বাটন
clearFormButton.addEventListener('click', () => {
    productForm.reset();
    document.getElementById('productId').value = '';
    editingProductId = null;
    submitButton.textContent = 'প্রোডাক্ট যোগ করুন';
});

// পেজ লোড হওয়ার সাথে সাথেই অ্যাডমিন প্রোডাক্ট লিস্ট ডিসপ্লে করি
document.addEventListener('DOMContentLoaded', () => {
    displayAdminProducts();
});