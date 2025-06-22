// অ্যাডমিন প্যানেলের জন্য প্রোডাক্ট ডেটা (localStorage থেকে লোড হবে)
// Note: এই ডেটা `script.js` থেকে আলাদা থাকবে, কারণ ব্যাকএন্ড ছাড়া sync রাখা সম্ভব নয়।
let products = JSON.parse(localStorage.getItem('adminProducts')) || [
    // ডিফল্ট প্রোডাক্ট যদি localStorage এ কিছু না থাকে
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
];

// অ্যাডমিন প্যানেলের জন্য অর্ডার ডেটা (localStorage থেকে লোড হবে)
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM এলিমেন্টগুলো ধরছি (লগইনের জন্য)
const loginSection = document.getElementById('login-section');
const adminDashboard = document.getElementById('admin-dashboard');
const adminLoginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');

// DOM এলিমেন্টগুলো ধরছি (প্রোডাক্ট ম্যানেজমেন্টের জন্য)
const productForm = document.getElementById('product-form');
const adminProductContainer = document.getElementById('admin-product-container');
const submitButton = document.getElementById('submitButton');
const clearFormButton = document.getElementById('clearFormButton');

// DOM এলিমেন্টগুলো ধরছি (অর্ডার ম্যানেজমেন্টের জন্য)
const adminOrderContainer = document.getElementById('admin-order-container');

let editingProductId = null; // কোন প্রোডাক্ট এডিট হচ্ছে তা ট্র্যাক করার জন্য

// --- লগইন ফাংশনালিটি ---
const ADMIN_USERNAME = "admin"; // তোর ইউজারনেম
const ADMIN_PASSWORD = "123"; // তোর পাসওয়ার্ড (এটা ডামি, বাস্তব সার্ভারে এভাবে রাখবি না!)

adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        loginSection.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        displayAdminProducts(); // লগইন করার পর প্রোডাক্ট দেখাবে
        displayAdminOrders(); // লগইন করার পর অর্ডার দেখাবে
    } else {
        loginError.classList.remove('hidden');
    }
});

// --- প্রোডাক্ট ম্যানেজমেন্ট ফাংশনালিটি ---
function saveProductsToLocalStorage() {
    localStorage.setItem('adminProducts', JSON.stringify(products));
}

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
                <p>ফিচার্ড: ${product.featured ? 'হ্যাঁ' : 'না'}</p>
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
    e.preventDefault();

    const formData = new FormData(productForm);
    const productData = {
        id: editingProductId ? parseInt(formData.get('id')) : generateProductId(),
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        imageUrl: formData.get('imageUrl'),
        category: formData.get('category'),
        rating: parseFloat(formData.get('rating')),
        stock: parseInt(formData.get('stock')),
        featured: formData.get('featured') === 'on'
    };

    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = productData;
            alert('প্রোডাক্ট সফলভাবে আপডেট হয়েছে!');
        }
        editingProductId = null;
        submitButton.textContent = 'প্রোডাক্ট যোগ করুন';
    } else {
        products.push(productData);
        alert('নতুন প্রোডাক্ট যোগ হয়েছে!');
    }

    saveProductsToLocalStorage(); // প্রোডাক্ট সেভ করি
    productForm.reset();
    document.getElementById('productId').value = '';
    displayAdminProducts();
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
        
        editingProductId = id;
        submitButton.textContent = 'প্রোডাক্ট আপডেট করুন';
    }
}

// প্রোডাক্ট ডিলিট করার ফাংশন
function deleteProduct(id) {
    if (confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলিট করতে চান?')) {
        products = products.filter(product => product.id !== id);
        alert('প্রোডাক্ট ডিলিট হয়েছে!');
        saveProductsToLocalStorage(); // প্রোডাক্ট সেভ করি
        displayAdminProducts();
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

// --- অর্ডার ম্যানেজমেন্ট ফাংশনালিটি ---
function saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function displayAdminOrders() {
    adminOrderContainer.innerHTML = '';
    if (orders.length === 0) {
        adminOrderContainer.innerHTML = '<p style="text-align: center; color: #6c757d;">এখনো কোনো অর্ডার নেই।</p>';
        return;
    }

    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item-admin');
        
        const orderItemsHtml = order.items.map(item => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <img src="${item.imageUrl}" alt="${item.name}" class="order-product-img">
                <span>${item.name} x ${item.quantity} (৳${(item.price * item.quantity).toLocaleString('bn-BD')})</span>
            </div>
        `).join('');

        orderItem.innerHTML = `
            <div class="order-info-admin">
                <h3>অর্ডার আইডি: ${order.id}</h3>
                <p>তারিখ: ${order.date}</p>
                <p>মোট মূল্য: ৳${order.total.toLocaleString('bn-BD')}</p>
                <p>স্ট্যাটাস: <strong>${order.status}</strong></p>
                <div style="margin-top: 10px; border-top: 1px dashed #eee; padding-top: 10px;">
                    <h4>প্রোডাক্টস:</h4>
                    ${orderItemsHtml}
                </div>
            </div>
            <div class="order-actions-admin">
                <button class="complete-btn" data-id="${order.id}" ${order.status === 'Completed' ? 'disabled' : ''}>${order.status === 'Completed' ? 'সম্পন্ন হয়েছে' : 'সম্পন্ন করুন'}</button>
                <button class="delete-btn" data-id="${order.id}">ডিলিট করুন</button>
            </div>
        `;
        adminOrderContainer.appendChild(orderItem);
    });

    // অর্ডার বাটনে ইভেন্ট লিসেনার যোগ করি
    document.querySelectorAll('.order-item-admin .complete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            updateOrderStatus(id, 'Completed');
        });
    });

    document.querySelectorAll('.order-item-admin .delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deleteOrder(id);
        });
    });
}

// অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrdersToLocalStorage();
        displayAdminOrders(); // লিস্ট রিফ্রেশ করি
        alert(`অর্ডার ${orderId} এর স্ট্যাটাস '${newStatus}' এ আপডেট হয়েছে!`);
    }
}

// অর্ডার ডিলিট করার ফাংশন
function deleteOrder(orderId) {
    if (confirm(`আপনি কি নিশ্চিত যে অর্ডার ${orderId} ডিলিট করতে চান?`)) {
        orders = orders.filter(order => order.id !== orderId);
        saveOrdersToLocalStorage();
        displayAdminOrders();
        alert(`অর্ডার ${orderId} ডিলিট হয়েছে!`);
    }
}

// পেজ লোড হওয়ার সাথে সাথেই সবকিছু ইনিশিয়েট করি
document.addEventListener('DOMContentLoaded', () => {
    // লগইন পেজ প্রাথমিকভাবে থাকবে, লগইন হলে ড্যাশবোর্ড দেখাবে
    // এখানে কোনো কোড লেখা নেই, কারণ CSS এবং HTML এ hidden ক্লাস ব্যবহার করা হয়েছে।
    // login-script.js এ login-form এর submit event এ login সফল হলে এই logic add করতে হবে
});
