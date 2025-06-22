// অ্যাডমিন প্যানেলের জন্য প্রোডাক্ট ডেটা (localStorage থেকে লোড হবে)
// Note: এই ডেটা `script.js` থেকে আলাদা থাকবে, কারণ ব্যাকএন্ড ছাড়া sync রাখা সম্ভব নয়।
let products = JSON.parse(localStorage.getItem('adminProducts')) || [
    // ডিফল্ট প্রোডাক্ট যদি localStorage এ কিছু না থাকে
    {
        id: 1,
        name: "HSN স্মার্টফোন X1 প্রো",
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
        name: "HSN ওয়্যারলেস হেডফোন প্রো",
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

// অ্যাডমিন ইউজার ডেটা (localStorage থেকে লোড বা ডিফল্ট)
let adminUser = JSON.parse(localStorage.getItem('adminUser')) || {
    username: "admin",
    password: "123" // তোর পাসওয়ার্ড! এটা পরিবর্তন করিস!
};

// দোকানের তথ্য (localStorage থেকে লোড বা ডিফল্ট)
let shopInfo = JSON.parse(localStorage.getItem('shopInfo')) || {
    description: "HSN একটি জোশ অনলাইন দোকান, যেখানে আপনি সেরা জিনিস কিনতে পারবেন। আমরা সবসময় চেষ্টা করি সেরা প্রোডাক্ট দিতে।",
    established: "২০২৫",
    owner: "[তোর নাম]", // তোর নাম এখানে দে
    address: "[তোর দোকানের ঠিকানা]" // তোর দোকানের ঠিকানা এখানে দে
};

// যোগাযোগের তথ্য (localStorage থেকে লোড বা ডিফল্ট)
let contactInfo = JSON.parse(localStorage.getItem('contactInfo')) || {
    facebookProfile: "https://www.facebook.com/your-profile", // তোর ফেসবুক প্রোফাইল লিঙ্ক
    facebookPage: "https://www.facebook.com/your-page",   // তোর ফেসবুক পেজ লিঙ্ক
    whatsAppNumber: "+8801XXXXXXXXX" // তোর হোয়াটসঅ্যাপ নম্বর এখানে দে
};


// DOM এলিমেন্টগুলো ধরছি (লগইনের জন্য)
const loginSection = document.getElementById('login-section');
const adminDashboard = document.getElementById('admin-dashboard');
const adminLoginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');

// DOM এলিমেন্টগুলো ধরছি (দোকানের তথ্য এডিটের জন্য)
const adminInfoForm = document.getElementById('admin-info-form');
const adminShopDescription = document.getElementById('adminShopDescription');
const adminShopEstablished = document.getElementById('adminShopEstablished');
const adminShopOwner = document.getElementById('adminShopOwner');
const adminShopAddress = document.getElementById('adminShopAddress');
const infoSaveMessage = document.getElementById('info-save-message');

// DOM এলিমেন্টগুলো ধরছি (যোগাযোগ এডিটের জন্য)
const adminContactForm = document.getElementById('admin-contact-form');
const adminFacebookProfile = document.getElementById('adminFacebookProfile');
const adminFacebookPage = document.getElementById('adminFacebookPage');
const adminWhatsAppNumber = document.getElementById('adminWhatsAppNumber');
const contactSaveMessage = document.getElementById('contact-save-message');

// DOM এলিমেন্টগুলো ধরছি (ইউজার সেটিংসের জন্য)
const adminUserSettingsForm = document.getElementById('admin-user-settings-form');
const adminCurrentUsername = document.getElementById('adminCurrentUsername');
const adminNewUsername = document.getElementById('adminNewUsername');
const adminOldPassword = document.getElementById('adminOldPassword');
const adminNewPassword = document.getElementById('adminNewPassword');
const userSaveMessage = document.getElementById('user-save-message');
const userErrorMessage = document.getElementById('user-error-message');


// DOM এলিমেন্টগুলো ধরছি (অর্ডার ম্যানেজমেন্টের জন্য)
const adminOrderContainer = document.getElementById('admin-order-container');


// --- লগইন ফাংশনালিটি ---
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === adminUser.username && password === adminUser.password) {
        loginSection.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        displayAdminOrders(); // লগইন করার পর অর্ডার দেখাবে
        loadAdminSettings(); // লগইন করার পর সেটিংস লোড করবে
    } else {
        loginError.classList.remove('hidden');
    }
});

// --- সেটিংস ম্যানেজমেন্ট (দোকানের তথ্য, যোগাযোগ, ইউজার) ---

// সেটিংস ডেটা লোকালস্টোরেজে সেভ করি
function saveSettingsToLocalStorage() {
    localStorage.setItem('shopInfo', JSON.stringify(shopInfo));
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
}

// অ্যাডমিন ফর্মগুলো লোড করি
function loadAdminSettings() {
    // দোকানের তথ্য
    adminShopDescription.value = shopInfo.description;
    adminShopEstablished.value = shopInfo.established;
    adminShopOwner.value = shopInfo.owner;
    adminShopAddress.value = shopInfo.address;

    // যোগাযোগের তথ্য
    adminFacebookProfile.value = contactInfo.facebookProfile;
    adminFacebookPage.value = contactInfo.facebookPage;
    adminWhatsAppNumber.value = contactInfo.whatsAppNumber;

    // ইউজার সেটিংস
    adminCurrentUsername.value = adminUser.username;
    adminNewUsername.value = adminUser.username; // প্রাথমিকভাবে বর্তমান ইউজারনেম দেখাবে
    adminOldPassword.value = ''; // পাসওয়ার্ড ফিল্ড সবসময় খালি থাকবে
    adminNewPassword.value = ''; // পাসওয়ার্ড ফিল্ড সবসময় খালি থাকবে
}

// দোকানের তথ্য ফর্ম সাবমিট
adminInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    shopInfo.description = adminShopDescription.value;
    shopInfo.established = adminShopEstablished.value;
    shopInfo.owner = adminShopOwner.value;
    shopInfo.address = adminShopAddress.value;
    saveSettingsToLocalStorage(); // ডেটা সেভ করি
    infoSaveMessage.classList.remove('hidden');
    setTimeout(() => infoSaveMessage.classList.add('hidden'), 3000); // ৩ সেকেন্ড পর হাইড হবে
    alert('দোকানের তথ্য সফলভাবে সেভ হয়েছে!');
});

// যোগাযোগের তথ্য ফর্ম সাবমিট
adminContactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactInfo.facebookProfile = adminFacebookProfile.value;
    contactInfo.facebookPage = adminFacebookPage.value;
    contactInfo.whatsAppNumber = adminWhatsAppNumber.value;
    saveSettingsToLocalStorage(); // ডেটা সেভ করি
    contactSaveMessage.classList.remove('hidden');
    setTimeout(() => contactSaveMessage.classList.add('hidden'), 3000); // ৩ সেকেন্ড পর হাইড হবে
    alert('যোগাযোগের তথ্য সফলভাবে সেভ হয়েছে!');
});

// ইউজার সেটিংস ফর্ম সাবমিট
adminUserSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUsername = adminNewUsername.value;
    const oldPassword = adminOldPassword.value;
    const newPassword = adminNewPassword.value;

    userErrorMessage.classList.add('hidden'); // আগের এরর মেসেজ হাইড করি
    userSaveMessage.classList.add('hidden'); // আগের সফল মেসেজ হাইড করি

    if (oldPassword !== adminUser.password) {
        userErrorMessage.textContent = 'পুরাতন পাসওয়ার্ড ভুল!';
        userErrorMessage.classList.remove('hidden');
        return;
    }

    if (newUsername === adminUser.username && newPassword === adminUser.password) {
        userErrorMessage.textContent = 'ইউজারনেম বা পাসওয়ার্ড পরিবর্তন করতে হবে, একই রাখা যাবে না!';
        userErrorMessage.classList.remove('hidden');
        return;
    }

    adminUser.username = newUsername;
    adminUser.password = newPassword;
    saveSettingsToLocalStorage(); // ডেটা সেভ করি
    
    adminOldPassword.value = ''; // পুরনো পাসওয়ার্ড ফিল্ড খালি করি
    adminNewPassword.value = ''; // নতুন পাসওয়ার্ড ফিল্ড খালি করি
    loadAdminSettings(); // ফর্ম আপডেট করি
    userSaveMessage.classList.remove('hidden');
    setTimeout(() => userSaveMessage.classList.add('hidden'), 3000);
    alert('ইউজারনেম ও পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
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
                <p>কাস্টমার: ${order.customerInfo.name} ( ${order.customerInfo.phone} )</p>
                <p>ঠিকানা: ${order.customerInfo.address}</p>
                <p>তারিখ: ${order.date}</p>
                <p>সাবটোটাল: ৳${order.subtotal.toLocaleString('bn-BD')}</p>
                <p>ডেলিভারি চার্জ: ৳${order.totalDeliveryCharge.toLocaleString('bn-BD')}</p>
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
    // লগইন হওয়ার পর `loadAdminSettings()` কল হবে।
    // এইখানে কোনো ইনিশিয়াল লোড লজিক নেই কারণ এটি লগইন পেজ দিয়ে শুরু হবে।
});
