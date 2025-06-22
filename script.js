@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap'); /* Poppins ফন্ট যোগ করলাম */

:root {
    --primary-color: #007bff;
    --secondary-color: #28a745;
    --dark-color: #343a40;
    --light-color: #f8f9fa;
    --text-color: #333;
    --card-bg: #ffffff;
    --border-color: #e0e0e0;
}

body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--light-color);
    color: var(--text-color);
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
.main-header {
    background-color: var(--dark-color);
    color: #fff;
    padding: 1.2rem 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.main-header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.store-name {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
}

.main-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
}

.main-nav ul li {
    margin-left: 25px;
}

.main-nav ul li a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.main-nav ul li a:hover {
    color: var(--primary-color);
}

.cart-icon-container {
    background-color: var(--secondary-color);
    padding: 8px 12px;
    border-radius: 5px;
}

.cart-icon-container a {
    color: #fff !important; /* !important ব্যবহার করলাম যাতে ওভাররাইড হয় */
    display: flex;
    align-items: center;
    gap: 5px;
}

/* Products Section */
.products-section {
    padding: 40px 0;
}

.products-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 40px;
    color: var(--dark-color);
    position: relative;
    padding-bottom: 10px;
}

.products-section h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: var(--primary-color);
    border-radius: 2px;
}


.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* রেসপন্সিভ গ্রিড */
    gap: 30px;
    justify-content: center;
}

.product-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.08);
    overflow: hidden; /* ভেতরের ইমেজ যাতে বাইরে না যায় */
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.15);
}

.product-card img {
    max-width: 100%;
    height: 220px; /* ছবির উচ্চতা */
    object-fit: cover;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 15px;
}

.product-card-content {
    padding: 0 20px 20px; /* নিচের প্যাডিং যোগ করলাম */
}

.product-card h3 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: 10px;
    font-weight: 600;
}

.product-card p {
    font-size: 0.95rem;
    color: var(--text-color);
    margin-bottom: 10px;
}

.product-card .price {
    font-size: 1.8rem;
    color: var(--secondary-color);
    font-weight: 700;
    margin-bottom: 15px;
}

.product-card .category {
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 5px;
}

.product-card .rating {
    color: #ffc107; /* স্টার কালার */
    margin-bottom: 10px;
    font-size: 0.9rem;
}

.product-card button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 15px; /* উপরে একটু মার্জিন */
    width: 100%; /* বাটন পুরো চওড়া হবে */
}

.product-card button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

.out-of-stock {
    color: #dc3545; /* লাল রং */
    font-weight: bold;
    font-size: 0.9rem;
    margin-top: 5px;
}

/* Footer Styles */
.main-footer {
    background-color: var(--dark-color);
    color: #fff;
    text-align: center;
    padding: 1.5rem 0;
    margin-top: 40px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.main-footer p {
    margin: 0;
    font-size: 0.9rem;
}
