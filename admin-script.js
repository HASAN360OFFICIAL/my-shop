// অ্যাডমিন প্যানেলের জন্য অর্ডার ডেটা (localStorage থেকে লোড হবে)
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// অ্যাডমিন ইউজার ডেটা (localStorage থেকে লোড বা ডিফল্ট)
// এই পাসওয়ার্ডটা তোর নিজের মতো করে নিস!
let adminUser = JSON.parse(localStorage.getItem('adminUser')) || {
    username: "admin",
    password: "123"
};

// DOM এলিমেন্টগুলো ধরছি (লগইনের জন্য)
const loginSection = document.getElementById('login-section');
const adminDashboard = document.getElementById('admin-dashboard');
const adminLoginForm = document.getElementById('admin-login-form');
const loginError = document.getElementById('login-error');

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
    } else {
        loginError.classList.remove('hidden');
    }
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
    // লগইন হওয়ার পর `displayAdminOrders()` কল হবে।
});
