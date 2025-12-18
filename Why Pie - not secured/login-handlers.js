// Role-specific login handlers
function handleStaffLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const securityCode = document.getElementById('staff-code').value;

    const result = loginWithSecurity(email, password, securityCode, 'staff');
    if (result.success) {
        localStorage.setItem('staffLoggedIn', 'true');
        window.location.href = 'staff-dashboard.html';
    } else {
        alert(result.message);
    }
}

function handleCustomerLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = loginUser(email, password);
    if (result.success && result.user.role === 'customer') {
        localStorage.setItem('customerLoggedIn', 'true');
        window.location.href = 'customer-dashboard.html';
    } else {
        alert(result.message || 'Invalid credentials or not a customer account');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const securityCode = document.getElementById('admin-code').value;

    const result = loginWithSecurity(email, password, securityCode, 'admin');
    if (result.success) {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'admin-dashboard.html';
    } else {
        alert(result.message);
    }
}

// Common dashboard authentication check
function checkDashboardAuth(role) {
    const isLoggedIn = localStorage.getItem(`${role}LoggedIn`) === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!isLoggedIn || !currentUser || currentUser.role !== role) {
        window.location.href = `${role}-login.html`;
        return false;
    }
    
    // Update user info in navbar
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name || role.charAt(0).toUpperCase() + role.slice(1);
    }
    
    // Setup logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem(`${role}LoggedIn`);
            localStorage.removeItem('currentUser');
            window.location.href = `${role}-login.html`;
        });
    }
    
    return true;
}

// Dashboard initialization
document.addEventListener('DOMContentLoaded', function() {
    const pathname = window.location.pathname;
    if (pathname.includes('staff-dashboard')) {
        checkDashboardAuth('staff');
    } else if (pathname.includes('admin-dashboard')) {
        checkDashboardAuth('admin');
    } else if (pathname.includes('customer-dashboard')) {
        checkDashboardAuth('customer');
    }
});