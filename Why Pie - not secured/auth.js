// ===================== Authentication System =====================

// Security code constants (only for admin now)
const ADMIN_SECURITY_CODE = "ADMIN2024";

// User data structure
const users = JSON.parse(localStorage.getItem('users')) || [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@whypie.com',
    password: 'admin123',
    role: 'admin',
    phone: '+639123456789',
    address: '123 Admin St, Mabini, Batangas',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Staff User',
    email: 'staff@whypie.com',
    password: 'staff123',
    role: 'staff',
    phone: '+639987654321',
    address: '456 Staff St, Mabini, Batangas',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    phone: '+639555555555',
    address: '789 Customer St, Mabini, Batangas',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Orders data structure
const orders = JSON.parse(localStorage.getItem('orders')) || [];
if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

// Login history data structure
const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
if (!localStorage.getItem('loginHistory')) {
  localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
}

// ===================== Session Management Functions =====================

function checkSession() {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Check if the appropriate role is logged in
    return localStorage.getItem(`${currentUser.role}LoggedIn`) === 'true';
}

function logoutAll() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('staffLoggedIn');
    localStorage.removeItem('customerLoggedIn');
}

// ===================== Authentication Functions =====================

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        if (user.role === 'staff' && user.status === 'pending') {
            return { success: false, message: 'Staff account pending administrator approval' };
        }
        
        if (user.status === 'suspended') {
            return { success: false, message: 'Account suspended. Please contact administrator.' };
        }
        
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem(`${user.role}LoggedIn`, 'true');
        
        // Record login history
        recordLoginHistory(userWithoutPassword);
        
        updateCartCount();
        return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
}

function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'User with this email already exists' };
    }
    
    const newUser = {
        id: Date.now(),
        ...userData,
        status: userData.role === 'staff' ? 'pending' : 'active',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    if (newUser.role === 'customer') {
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('customerLoggedIn', 'true');
        updateCartCount();
    }
    
    return { success: true, user: userWithoutPassword };
}

function loginWithSecurity(email, password, securityCode, requiredRole) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        if (user.role !== requiredRole) {
            return { success: false, message: `This login is for ${requiredRole}s only` };
        }
        
        // Only require security code for admin
        if (requiredRole === 'admin' && securityCode !== ADMIN_SECURITY_CODE) {
            return { success: false, message: 'Invalid admin security code' };
        }
        
        if (user.role === 'staff' && user.status === 'pending') {
            return { success: false, message: 'Staff account pending administrator approval' };
        }
        
        if (user.status === 'suspended') {
            return { success: false, message: 'Account suspended. Please contact administrator.' };
        }
        
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem(`${user.role}LoggedIn`, 'true');
        
        // Record login history
        recordLoginHistory(userWithoutPassword);
        
        updateCartCount();
        return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
}

function logoutUser() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        localStorage.removeItem(`${currentUser.role}LoggedIn`);
    }
    localStorage.removeItem('currentUser');
    
    // Redirect to appropriate login page based on current page
    const currentPage = window.location.pathname;
    if (currentPage.includes('admin')) {
        window.location.href = 'admin-login.html';
    } else if (currentPage.includes('staff')) {
        window.location.href = 'staff-login.html';
    } else {
        window.location.href = 'customer-login.html';
    }
}

// Admin-specific logout function
function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin session
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('currentUser');
        
        // Show logout notification
        showNotification('Logged out successfully!');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1000);
    }
}

// Staff-specific logout function
function logoutStaff() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear staff session
        localStorage.removeItem('staffLoggedIn');
        localStorage.removeItem('currentUser');
        
        // Show logout notification
        showNotification('Logged out successfully!');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'staff-login.html';
        }, 1000);
    }
}

// Customer-specific logout function
function logoutCustomer() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear customer session and cart
        localStorage.removeItem('customerLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        
        // Show logout notification
        showNotification('Logged out successfully!');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'customer-login.html';
        }, 1000);
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function isAuthenticated() {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    return localStorage.getItem(`${currentUser.role}LoggedIn`) === 'true';
}

function checkAuth(requiredRole) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const roleLoggedIn = localStorage.getItem(`${currentUser.role}LoggedIn`) === 'true';
    if (!roleLoggedIn) return false;
    
    if (requiredRole && currentUser.role !== requiredRole) return false;
    
    return true;
}

function requireAuth(role = null) {
    const currentUser = getCurrentUser();
    
    if (!currentUser || !isAuthenticated()) {
        if (role === 'customer') {
            window.location.href = 'customer-login.html';
        } else if (role === 'staff') {
            window.location.href = 'staff-login.html';
        } else if (role === 'admin') {
            window.location.href = 'admin-login.html';
        } else {
            window.location.href = 'customer-login.html';
        }
        return false;
    }
    
    if (role && currentUser.role !== role) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// ===================== Login History Functions =====================

function recordLoginHistory(user) {
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    const loginRecord = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        loginTime: new Date().toISOString(),
        ipAddress: 'N/A' // In a real app, you'd get this from the server
    };
    
    loginHistory.push(loginRecord);
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    
    return loginRecord;
}

function getLoginHistory(userId = null) {
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    if (userId) {
        return loginHistory.filter(record => record.userId === userId);
    }
    
    return loginHistory;
}

function getRecentLogins(limit = 10) {
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    return loginHistory
        .sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime))
        .slice(0, limit);
}

function clearLoginHistory(userId = null) {
    let loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    if (userId) {
        loginHistory = loginHistory.filter(record => record.userId !== userId);
    } else {
        loginHistory = [];
    }
    
    localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    return { success: true };
}

// ===================== Cart Management Functions =====================

function getCart() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const userCart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
    return userCart;
}

function updateCart(updatedCart) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(updatedCart));
    updateCartCount();
}

function clearCart() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify([]));
    updateCartCount();
}

function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function addToCart(itemId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const menuData = JSON.parse(localStorage.getItem('menuData')) || [];
    const menuItem = menuData.find(item => item.id === itemId);
    
    if (!menuItem) return false;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            image: menuItem.image,
            quantity: 1
        });
    }
    
    updateCart(cart);
    return true;
}

function removeFromCart(itemId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    updateCart(updatedCart);
    return updatedCart;
}

function updateCartItemQuantity(itemId, newQuantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (newQuantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQuantity;
        }
        updateCart(cart);
    }
    
    return cart;
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = getCartItemCount();
        cartCount.textContent = totalItems;
    }
}

// ===================== User Management Functions =====================

function updateUserProfile(updatedData) {
    const currentUser = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('users'));
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user session
        const { password: _, ...userWithoutPassword } = users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'User not found' };
}

function getAllUsers() {
    const users = JSON.parse(localStorage.getItem('users'));
    return users.map(({ password, ...user }) => user); // Remove passwords
}

function getUsersByRole(role) {
    const users = JSON.parse(localStorage.getItem('users'));
    return users
        .filter(user => user.role === role)
        .map(({ password, ...user }) => user);
}

function updateUserRole(userId, newRole) {
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user session if it's the same user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const { password: _, ...userWithoutPassword } = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        }
        
        return { success: true, user: users[userIndex] };
    }
    
    return { success: false, message: 'User not found' };
}

function updateUserStatus(userId, newStatus) {
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].status = newStatus;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user session if it's the same user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            const { password: _, ...userWithoutPassword } = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        }
        
        return { success: true, user: users[userIndex] };
    }
    
    return { success: false, message: 'User not found' };
}

function approveStaffAccount(userId) {
    return updateUserStatus(userId, 'active');
}

function suspendUser(userId) {
    return updateUserStatus(userId, 'suspended');
}

function deleteUser(userId) {
    const users = JSON.parse(localStorage.getItem('users'));
    const filteredUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    
    // Log out if deleted user is current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        logoutUser();
    }
    
    return { success: true };
}

// ===================== Order Management Functions =====================

function createOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const currentUser = getCurrentUser();
    
    const newOrder = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        paymentStatus: 'pending',
        deliveryAddress: orderData.deliveryAddress || currentUser.address,
        specialInstructions: orderData.specialInstructions || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart after successful order
    clearCart();
    
    return newOrder;
}

function getOrdersByUser(userId) {
    const orders = JSON.parse(localStorage.getItem('orders'));
    return orders.filter(order => order.userId === userId);
}

function getCurrentUserOrders() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    return getOrdersByUser(currentUser.id);
}

function getAllOrders() {
    return JSON.parse(localStorage.getItem('orders'));
}

function getOrdersByStatus(status) {
    const orders = JSON.parse(localStorage.getItem('orders'));
    return orders.filter(order => order.status === status);
}

function updateOrderStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        return { success: true, order: orders[orderIndex] };
    }
    
    return { success: false, message: 'Order not found' };
}

function updatePaymentStatus(orderId, paymentStatus) {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].paymentStatus = paymentStatus;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        return { success: true, order: orders[orderIndex] };
    }
    
    return { success: false, message: 'Order not found' };
}

function deleteOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const filteredOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
    return { success: true };
}

// ===================== Menu Management Functions =====================

function getMenuItems() {
    return JSON.parse(localStorage.getItem('menuData')) || [];
}

function getAvailableMenuItems() {
    const menuData = JSON.parse(localStorage.getItem('menuData')) || [];
    return menuData.filter(item => item.available !== false);
}

function getMenuItemsByCategory(category) {
    const menuData = JSON.parse(localStorage.getItem('menuData')) || [];
    return menuData.filter(item => item.category === category && item.available !== false);
}

function getMenuItemById(itemId) {
    const menuData = JSON.parse(localStorage.getItem('menuData')) || [];
    return menuData.find(item => item.id === itemId);
}

function updateMenuItem(itemId, updatedData) {
    const menuData = JSON.parse(localStorage.getItem('menuData'));
    const itemIndex = menuData.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        menuData[itemIndex] = { ...menuData[itemIndex], ...updatedData };
        localStorage.setItem('menuData', JSON.stringify(menuData));
        return { success: true, item: menuData[itemIndex] };
    }
    
    return { success: false, message: 'Menu item not found' };
}

function addMenuItem(itemData) {
    const menuData = JSON.parse(localStorage.getItem('menuData'));
    const newItem = {
        id: Date.now(),
        available: true,
        ...itemData
    };
    
    menuData.push(newItem);
    localStorage.setItem('menuData', JSON.stringify(menuData));
    return { success: true, item: newItem };
}

function deleteMenuItem(itemId) {
    const menuData = JSON.parse(localStorage.getItem('menuData'));
    const filteredData = menuData.filter(item => item.id !== itemId);
    localStorage.setItem('menuData', JSON.stringify(filteredData));
    return { success: true };
}

function toggleMenuItemAvailability(itemId) {
    const menuData = JSON.parse(localStorage.getItem('menuData'));
    const itemIndex = menuData.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        menuData[itemIndex].available = !menuData[itemIndex].available;
        localStorage.setItem('menuData', JSON.stringify(menuData));
        return { success: true, item: menuData[itemIndex] };
    }
    
    return { success: false, message: 'Menu item not found' };
}

// ===================== Analytics Functions =====================

function getOrderStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const totalRevenue = orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.total, 0);
    
    const totalCustomers = users.filter(user => user.role === 'customer').length;
    const totalStaff = users.filter(user => user.role === 'staff').length;
    
    return {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        totalCustomers,
        totalStaff
    };
}

function getRecentOrders(limit = 5) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
}

function getPopularMenuItems(limit = 5) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const itemCount = {};
    
    orders.forEach(order => {
        order.items.forEach(item => {
            itemCount[item.id] = (itemCount[item.id] || 0) + item.quantity;
        });
    });
    
    const menuData = JSON.parse(localStorage.getItem('menuData')) || [];
    return Object.entries(itemCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([id, count]) => {
            const item = menuData.find(m => m.id === parseInt(id));
            return item ? { ...item, orderCount: count } : null;
        })
        .filter(Boolean);
}

// ===================== Utility Functions =====================

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function formatCurrency(amount) {
    return '₱' + amount.toFixed(2);
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-PH', options);
}

// Initialize menu data if not exists
function initializeMenuData() {
    if (!localStorage.getItem('menuData')) {
        const menuData = [
            {
                id: 1,
                name: "Buko Langka Pie",
                price: 250,
                category: "fruit",
                image: "buko-pie-langka.jpg",
                description: "A delightful combination of young coconut and jackfruit in a flaky crust.",
                available: true
            },
            {
                id: 2,
                name: "Apple Pie",
                price: 280,
                category: "fruit",
                image: "apple-pie.jpeg",
                description: "Classic apple pie with a perfect balance of sweet and tart.",
                available: true
            },
            {
                id: 3,
                name: "Egg Pie",
                price: 220,
                category: "cream",
                image: "Egg-Pie.webp",
                description: "Rich and creamy Filipino-style egg pie with a smooth custard filling.",
                available: true
            },
            {
                id: 4,
                name: "Buko Pie Classic",
                price: 240,
                category: "fruit",
                image: "BUKO_PIE classic.jpg",
                description: "Our original buko pie made with fresh young coconut.",
                available: true
            },
            {
                id: 5,
                name: "Pumpkin Pie",
                price: 260,
                category: "special",
                image: "Pumpkin-Pie.jpg",
                description: "Seasonal favorite with smooth spiced pumpkin filling.",
                available: true
            },
            {
                id: 6,
                name: "Ube Pie",
                price: 270,
                category: "special",
                image: "ube-pie.jpg",
                description: "Filipino favorite made with purple yam and creamy filling.",
                available: true
            },
            {
                id: 7,
                name: "Mango Cream Pie",
                price: 290,
                category: "cream",
                image: "mango-pie.jpg",
                description: "Creamy pie with fresh mango chunks and light whipped cream.",
                available: true
            },
            {
                id: 8,
                name: "Blueberry Pie",
                price: 300,
                category: "fruit",
                image: "blueberry-pie.jpg",
                description: "Bursting with fresh blueberries in a buttery crust.",
                available: true
            }
        ];
        localStorage.setItem('menuData', JSON.stringify(menuData));
    }
}

function initializeDefaultUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Global functions for use in HTML
window.handleAddToCart = function(itemId) {
    if (!isAuthenticated()) {
        showNotification('Please login to add items to cart', 'error');
        return;
    }
    
    if (addToCart(itemId)) {
        const menuData = JSON.parse(localStorage.getItem('menuData')) || [];
        const menuItem = menuData.find(item => item.id === itemId);
        if (menuItem) {
            showNotification(`${menuItem.name} added to cart!`, 'success');
        }
    }
};

window.showLoginModal = function() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closeLoginModal = function() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.logoutUser = logoutUser;
window.logoutAdmin = logoutAdmin;
window.logoutStaff = logoutStaff;
window.logoutCustomer = logoutCustomer;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultUsers();
    initializeMenuData();
    updateUserNav();
    updateCartCount();
});

function updateUserNav() {
    const authNav = document.getElementById('auth-nav');
    const userNav = document.getElementById('user-nav');
    const dashboardLink = document.getElementById('dashboard-link');
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');

    const currentUser = getCurrentUser();
    const isLoggedIn = currentUser && checkAuth(currentUser.role);

    if (authNav && userNav) {
        if (isLoggedIn) {
            authNav.style.display = 'none';
            userNav.style.display = 'block';
            
            if (userName) userName.textContent = currentUser.name;
            if (userRole) {
                userRole.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
            }
            
            if (dashboardLink) {
                let dashboardUrl = '';
                let dashboardText = '';
                
                switch(currentUser.role) {
                    case 'admin':
                        dashboardUrl = 'admin-dashboard.html';
                        dashboardText = 'Admin Dashboard';
                        break;
                    case 'staff':
                        dashboardUrl = 'staff-dashboard.html';
                        dashboardText = 'Staff Dashboard';
                        break;
                    case 'customer':
                        dashboardUrl = 'customer-dashboard.html';
                        dashboardText = 'My Dashboard';
                        break;
                }
                
                dashboardLink.innerHTML = `<a href="${dashboardUrl}">${dashboardText}</a>`;
            }
        } else {
            authNav.style.display = 'block';
            userNav.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
        }
    }
}

function getDashboardLink(role) {
    switch(role) {
        case 'admin': return 'admin-dashboard.html';
        case 'staff': return 'staff-dashboard.html';
        case 'customer': return 'customer-dashboard.html';
        default: return 'index.html';
    }
}

// Authentication state management
document.addEventListener('DOMContentLoaded', function() {
  initializeAuth();
});

function initializeAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  updateNavigation(currentUser);
  setupAuthEventListeners();
}

function updateNavigation(currentUser) {
  const authNav = document.getElementById('auth-nav');
  const userNav = document.getElementById('user-nav');
  const dashboardLink = document.getElementById('dashboard-link');
  const userName = document.getElementById('user-name');
  const userRole = document.getElementById('user-role');

  if (authNav && userNav) {
    if (currentUser) {
      authNav.style.display = 'none';
      userNav.style.display = 'block';
      
      if (userName) userName.textContent = currentUser.name;
      if (userRole) {
        userRole.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
      }
      
      // Update dashboard link based on role
      if (dashboardLink) {
        dashboardLink.style.display = 'block';
        dashboardLink.innerHTML = `
          <a href="${getDashboardLink(currentUser.role)}" class="dashboard-link">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </a>
        `;
      }
    } else {
      authNav.style.display = 'block';
      userNav.style.display = 'none';
      if (dashboardLink) dashboardLink.style.display = 'none';
    }
  }
  
  // Update cart count
  updateCartCount();
}

function setupAuthEventListeners() {
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const currentUser = getCurrentUser();
      if (currentUser) {
        switch(currentUser.role) {
          case 'admin':
            logoutAdmin();
            break;
          case 'staff':
            logoutStaff();
            break;
          case 'customer':
            logoutCustomer();
            break;
          default:
            logoutUser();
        }
      }
    });
  }
}

function isCustomerLoggedIn() {
  const currentUser = getCurrentUser();
  return currentUser && currentUser.role === 'customer';
}

function requireAuth(redirectUrl = 'customer-login.html') {
  if (!isCustomerLoggedIn()) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

// Make functions available globally
window.logoutUser = logoutUser;
window.logoutAdmin = logoutAdmin;
window.logoutStaff = logoutStaff;
window.logoutCustomer = logoutCustomer;
window.isCustomerLoggedIn = isCustomerLoggedIn;
window.requireAuth = requireAuth;
window.getLoginHistory = getLoginHistory;
window.getRecentLogins = getRecentLogins;
window.recordLoginHistory = recordLoginHistory;