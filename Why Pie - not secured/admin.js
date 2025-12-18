// admin.js - Complete Admin Dashboard with Order Analytics, Menu Management, and Account Management
class AdminManager {
    constructor() {
        this.currentEditingId = null;
        this.currentEditingAccountId = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadOrders();
        this.loadAccounts();
        this.startRealTimeUpdates();
    }

    checkAuth() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (!isLoggedIn || !currentUser || currentUser.role !== 'admin') {
            window.location.href = 'admin-login.html';
            return;
        }
        
        document.getElementById('user-name').textContent = currentUser.name || 'Admin';
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('add-item-form').addEventListener('submit', (e) => this.addMenuItem(e));
        document.getElementById('edit-item-form').addEventListener('submit', (e) => this.updateMenuItem(e));
        document.getElementById('add-account-form').addEventListener('submit', (e) => this.addAccount(e));
        document.getElementById('edit-account-form').addEventListener('submit', (e) => this.updateAccount(e));

        // Image upload preview
        document.getElementById('item-image').addEventListener('change', (e) => this.previewImage(e, 'image-preview'));
        document.getElementById('edit-item-image').addEventListener('change', (e) => this.previewImage(e, 'edit-image-preview'));

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    // Order Management Methods
    loadOrders() {
        try {
            const orders = JSON.parse(localStorage.getItem('customerOrders')) || [];
            this.displayOrders(orders);
            this.updateOrderStats(orders);
            this.updateAnalytics(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
            this.displayOrders([]);
        }
    }

    displayOrders(orders) {
        const completedOrders = orders.filter(order => order.status === 'completed');
        this.renderOrderList('completed-orders-list', completedOrders, 'completed');
    }

    renderOrderList(containerId, orders, status) {
        const container = document.getElementById(containerId);
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No ${status} orders found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Order #${order.id}</h4>
                        <p class="order-meta">
                            Customer: ${order.customerName || order.deliveryAddress?.fullName || 'N/A'}<br>
                            Date: ${new Date(order.date).toLocaleDateString()}<br>
                            Phone: ${order.phone || order.deliveryAddress?.phone || 'N/A'}
                            ${order.deliveryAddress ? `<br>Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.barangay}, ${order.deliveryAddress.municipality}` : ''}
                        </p>
                    </div>
                    <span class="order-status status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">Total: ₱${order.total.toFixed(2)}</div>
                    <div class="order-actions">
                        <button class="btn btn-outline" onclick="adminManager.viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewOrderDetails(orderId) {
        const orders = JSON.parse(localStorage.getItem('customerOrders')) || [];
        const order = orders.find(order => order.id === orderId);
        
        if (order) {
            const itemsList = order.items.map(item => 
                `${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}`
            ).join('\n');
            
            alert(`Order Details:\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: ₱${order.total}\n\nItems:\n${itemsList}`);
        }
    }

    updateOrderStats(orders) {
        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => order.status === 'completed').length;
        
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('delivered-orders').textContent = completedOrders;
    }

    // Analytics Methods
    updateAnalytics(orders) {
        this.updateRevenueStats(orders);
        this.renderRevenueChart(orders);
        this.renderTopProducts(orders);
    }

    updateRevenueStats(orders) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];

        const todayRevenue = orders
            .filter(order => order.status === 'completed' && order.date.startsWith(today))
            .reduce((sum, order) => sum + order.total, 0);

        const weekRevenue = orders
            .filter(order => order.status === 'completed' && order.date >= weekAgo)
            .reduce((sum, order) => sum + order.total, 0);

        const monthRevenue = orders
            .filter(order => order.status === 'completed' && order.date >= monthAgo)
            .reduce((sum, order) => sum + order.total, 0);

        const totalRevenue = orders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0);

        document.getElementById('today-revenue').textContent = `₱${todayRevenue.toLocaleString()}`;
        document.getElementById('week-revenue').textContent = `₱${weekRevenue.toLocaleString()}`;
        document.getElementById('month-revenue').textContent = `₱${monthRevenue.toLocaleString()}`;
        document.getElementById('total-revenue-analytics').textContent = `₱${totalRevenue.toLocaleString()}`;
        document.getElementById('total-revenue').textContent = `₱${totalRevenue.toLocaleString()}`;
    }

    renderRevenueChart(orders) {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (window.revenueChartInstance) {
            window.revenueChartInstance.destroy();
        }
        
        // Group orders by date for the last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
        
        const revenueByDay = last7Days.map(date => {
            const dayOrders = orders.filter(order => 
                order.status === 'completed' && order.date.startsWith(date)
            );
            return dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        });
        
        try {
            window.revenueChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: last7Days.map(date => {
                        const d = new Date(date);
                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }),
                    datasets: [{
                        label: 'Daily Revenue',
                        data: revenueByDay,
                        borderColor: '#8B4513',
                        backgroundColor: 'rgba(139, 69, 19, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Revenue: ₱${context.raw.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₱' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error rendering chart:', error);
        }
    }

    renderTopProducts(orders) {
        const container = document.getElementById('top-products');
        const menuItems = getAllMenuItems();
        
        // Calculate product sales
        const productSales = {};
        orders.forEach(order => {
            if (order.status === 'completed') {
                order.items.forEach(item => {
                    const productName = item.name;
                    if (!productSales[productName]) {
                        productSales[productName] = 0;
                    }
                    productSales[productName] += item.quantity || 1;
                });
            }
        });
        
        // Create array of products with sales data
        const productsWithSales = Object.entries(productSales).map(([name, sales]) => {
            const menuItem = menuItems.find(item => item.name === name);
            return {
                name,
                sales,
                price: menuItem?.price || 0,
                category: menuItem?.category || 'unknown'
            };
        });
        
        // Sort by sales (descending)
        productsWithSales.sort((a, b) => b.sales - a.sales);
        
        // Display top 5 products
        if (productsWithSales.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No sales data available</p></div>';
            document.getElementById('best-seller').textContent = '-';
            document.getElementById('top-category').textContent = '-';
            return;
        }
        
        container.innerHTML = productsWithSales.slice(0, 5).map((product, index) => `
            <li class="top-product-item">
                <div class="product-info">
                    <span class="product-rank">${index + 1}</span>
                    <div>
                        <strong>${product.name}</strong>
                        <p>${product.category || 'unknown'} • ₱${product.price || '0'}</p>
                    </div>
                </div>
                <span class="product-sales">${product.sales} sold</span>
            </li>
        `).join('');
        
        // Update best seller and top category
        if (productsWithSales.length > 0) {
            document.getElementById('best-seller').textContent = productsWithSales[0].name;
            
            // Calculate category performance
            const categorySales = {};
            productsWithSales.forEach(product => {
                const category = product.category || 'unknown';
                if (!categorySales[category]) {
                    categorySales[category] = 0;
                }
                categorySales[category] += product.sales;
            });
            
            const topCategory = Object.keys(categorySales).reduce((a, b) => 
                categorySales[a] > categorySales[b] ? a : b, 'None'
            );
            document.getElementById('top-category').textContent = topCategory.charAt(0).toUpperCase() + topCategory.slice(1);
        }
    }

    // Menu Management Methods
    loadDashboardData() {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const menuItems = getAllMenuItems();
            
            this.updateStats(users, menuItems);
            this.displayMenuItems(menuItems);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    updateStats(users, menuItems) {
        document.getElementById('total-users').textContent = users.length || 0;
        document.getElementById('total-items').textContent = menuItems.length || 0;
    }

    displayMenuItems(menuItems) {
        const container = document.getElementById('menu-items-list');
        
        if (!menuItems || menuItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <h3>No Menu Items</h3>
                    <p>Add some menu items to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = menuItems.map((item) => `
            <div class="menu-item" data-item-id="${item.id}">
                <div class="menu-item-details">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                        <div>
                            <strong>${item.name}</strong>
                            <p>${item.category} • ₱${item.price}</p>
                            <small>${item.description}</small>
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-edit" onclick="adminManager.editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete" onclick="adminManager.deleteMenuItem(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    previewImage(event, previewId) {
        const file = event.target.files[0];
        const preview = document.getElementById(previewId);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    }

    showAddItemModal() {
        this.showModal('add-item-modal');
        // Reset form
        document.getElementById('add-item-form').reset();
        document.getElementById('image-preview').innerHTML = '<i class="fas fa-image" style="color: #ccc; font-size: 2rem;"></i>';
    }

    addMenuItem(e) {
        e.preventDefault();
        
        try {
            const fileInput = document.getElementById('item-image');
            const file = fileInput.files[0];
            
            if (!file) {
                this.showNotification('Please select an image', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const itemData = {
                    name: document.getElementById('item-name').value.trim(),
                    price: parseFloat(document.getElementById('item-price').value),
                    category: document.getElementById('item-category').value,
                    description: document.getElementById('item-description').value.trim(),
                    image: e.target.result // Base64 image
                };

                // Validate required fields
                if (!itemData.name || !itemData.price || !itemData.description) {
                    this.showNotification('Please fill in all required fields', 'error');
                    return;
                }

                addMenuItem(itemData);
                this.showNotification('Menu item added successfully!');
                this.closeModal('add-item-modal');
                this.loadDashboardData();
                document.getElementById('add-item-form').reset();
                document.getElementById('image-preview').innerHTML = '<i class="fas fa-image" style="color: #ccc; font-size: 2rem;"></i>';
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error adding menu item:', error);
            this.showNotification('Error adding menu item', 'error');
        }
    }

    editMenuItem(itemId) {
        try {
            console.log('Editing item ID:', itemId);
            const item = getMenuItem(itemId);
            console.log('Found item:', item);
            
            if (item) {
                this.currentEditingId = itemId;
                document.getElementById('edit-item-id').value = item.id;
                document.getElementById('edit-item-name').value = item.name;
                document.getElementById('edit-item-price').value = item.price;
                document.getElementById('edit-item-category').value = item.category;
                document.getElementById('edit-item-description').value = item.description;
                
                // Set current image preview
                const preview = document.getElementById('edit-image-preview');
                preview.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
                
                this.showModal('edit-item-modal');
            } else {
                this.showNotification('Menu item not found', 'error');
            }
        } catch (error) {
            console.error('Error editing menu item:', error);
            this.showNotification('Error loading menu item', 'error');
        }
    }

    updateMenuItem(e) {
        e.preventDefault();
        
        try {
            const fileInput = document.getElementById('edit-item-image');
            const file = fileInput.files[0];
            
            const updatedData = {
                name: document.getElementById('edit-item-name').value.trim(),
                price: parseFloat(document.getElementById('edit-item-price').value),
                category: document.getElementById('edit-item-category').value,
                description: document.getElementById('edit-item-description').value.trim()
            };

            // Validate required fields
            if (!updatedData.name || !updatedData.price || !updatedData.description) {
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }

            // If new image is selected, read it as base64
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    updatedData.image = e.target.result;
                    this.finalizeMenuItemUpdate(updatedData);
                };
                reader.readAsDataURL(file);
            } else {
                // Keep existing image
                const currentItem = getMenuItem(this.currentEditingId);
                if (currentItem) {
                    updatedData.image = currentItem.image;
                    this.finalizeMenuItemUpdate(updatedData);
                } else {
                    this.showNotification('Menu item not found', 'error');
                    return;
                }
            }
        } catch (error) {
            console.error('Error updating menu item:', error);
            this.showNotification('Error updating menu item', 'error');
        }
    }

    finalizeMenuItemUpdate(updatedData) {
        if (updateMenuItem(this.currentEditingId, updatedData)) {
            this.showNotification('Menu item updated successfully!');
            this.closeModal('edit-item-modal');
            this.loadDashboardData();
        } else {
            this.showNotification('Error updating menu item', 'error');
        }
    }

    deleteMenuItem(itemId) {
        if (!confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('Deleting item ID:', itemId);
            if (deleteMenuItem(itemId)) {
                this.showNotification('Menu item deleted successfully!');
                this.loadDashboardData();
            } else {
                this.showNotification('Error deleting menu item', 'error');
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
            this.showNotification('Error deleting menu item', 'error');
        }
    }

    // Account Management Methods
    loadAccounts() {
        try {
            const accounts = JSON.parse(localStorage.getItem('users')) || [];
            this.displayAccounts(accounts);
        } catch (error) {
            console.error('Error loading accounts:', error);
            this.displayAccounts([]);
        }
    }

    displayAccounts(accounts) {
        const container = document.getElementById('accounts-list');
        
        if (!accounts || accounts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Accounts</h3>
                    <p>Add some accounts to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = accounts.map((account) => `
            <div class="account-item" data-account-id="${account.id}">
                <div class="account-item-details">
                    <strong>${account.name}</strong>
                    <p>${account.email} • <span class="user-role-badge role-${account.role}">${account.role}</span></p>
                    <small>Created: ${new Date(account.createdAt).toLocaleDateString()}</small>
                </div>
                <div class="account-actions">
                    <button class="btn btn-edit" onclick="adminManager.editAccount('${account.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete" onclick="adminManager.deleteAccount('${account.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    showAddAccountModal() {
        this.showModal('add-account-modal');
    }

    addAccount(e) {
        e.preventDefault();
        
        try {
            const accountData = {
                name: document.getElementById('account-name').value.trim(),
                email: document.getElementById('account-email').value.trim(),
                password: document.getElementById('account-password').value,
                role: document.getElementById('account-role').value
            };

            // Validate required fields
            if (!accountData.name || !accountData.email || !accountData.password) {
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(accountData.email)) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }

            this.saveAccount(accountData);
            this.showNotification('Account added successfully!');
            this.closeModal('add-account-modal');
            this.loadAccounts();
            document.getElementById('add-account-form').reset();
        } catch (error) {
            console.error('Error adding account:', error);
            this.showNotification('Error adding account', 'error');
        }
    }

    editAccount(accountId) {
        try {
            const accounts = JSON.parse(localStorage.getItem('users')) || [];
            const account = accounts.find(acc => acc.id == accountId);
            
            if (account) {
                this.currentEditingAccountId = accountId;
                document.getElementById('edit-account-id').value = account.id;
                document.getElementById('edit-account-name').value = account.name;
                document.getElementById('edit-account-email').value = account.email;
                document.getElementById('edit-account-role').value = account.role;
                
                this.showModal('edit-account-modal');
            } else {
                this.showNotification('Account not found', 'error');
            }
        } catch (error) {
            console.error('Error editing account:', error);
            this.showNotification('Error loading account', 'error');
        }
    }

    updateAccount(e) {
        e.preventDefault();
        
        try {
            const accounts = JSON.parse(localStorage.getItem('users')) || [];
            const accountIndex = accounts.findIndex(acc => acc.id == this.currentEditingAccountId);
            
            if (accountIndex !== -1) {
                const updatedAccount = {
                    ...accounts[accountIndex],
                    name: document.getElementById('edit-account-name').value.trim(),
                    email: document.getElementById('edit-account-email').value.trim(),
                    role: document.getElementById('edit-account-role').value
                };

                // Validate required fields
                if (!updatedAccount.name || !updatedAccount.email) {
                    this.showNotification('Please fill in all required fields', 'error');
                    return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(updatedAccount.email)) {
                    this.showNotification('Please enter a valid email address', 'error');
                    return;
                }

                // Update password only if provided
                const newPassword = document.getElementById('edit-account-password').value;
                if (newPassword) {
                    updatedAccount.password = newPassword;
                }

                accounts[accountIndex] = updatedAccount;
                localStorage.setItem('users', JSON.stringify(accounts));
                
                this.showNotification('Account updated successfully!');
                this.closeModal('edit-account-modal');
                this.loadAccounts();
            } else {
                this.showNotification('Account not found', 'error');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            this.showNotification('Error updating account', 'error');
        }
    }

    deleteAccount(accountId) {
        if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
            return;
        }

        try {
            const accounts = JSON.parse(localStorage.getItem('users')) || [];
            const updatedAccounts = accounts.filter(acc => acc.id != accountId);
            
            localStorage.setItem('users', JSON.stringify(updatedAccounts));
            this.showNotification('Account deleted successfully!');
            this.loadAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
            this.showNotification('Error deleting account', 'error');
        }
    }

    saveAccount(accountData) {
        const accounts = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        const existingAccount = accounts.find(acc => acc.email === accountData.email);
        if (existingAccount) {
            this.showNotification('An account with this email already exists', 'error');
            throw new Error('Email already exists');
        }

        const newAccount = {
            id: Date.now(),
            ...accountData,
            createdAt: new Date().toISOString(),
            status: accountData.role === 'staff' ? 'pending' : 'active'
        };
        
        accounts.push(newAccount);
        localStorage.setItem('users', JSON.stringify(accounts));
        return newAccount;
    }

    // Utility Methods
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startRealTimeUpdates() {
        // Check for updates every 5 seconds
        setInterval(() => {
            this.loadOrders();
            this.loadDashboardData();
        }, 5000);
    }

    logout() {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'admin-login.html';
    }
}

// Initialize admin manager when DOM is loaded
let adminManager;
document.addEventListener('DOMContentLoaded', function() {
    adminManager = new AdminManager();
});