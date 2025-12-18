// ===================== Menu Management System with Base64 Image Support =====================

// Menu data structure
let menuData = JSON.parse(localStorage.getItem('menuItems')) || [
  {
    id: 1,
    name: "Buko Langka Pie",
    price: 250,
    category: "fruit",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJ1a28gTGFuZ2thIFBpZTwvdGV4dD48L3N2Zz4=",
    description: "A delightful combination of young coconut and jackfruit in a flaky crust."
  },
  {
    id: 2,
    name: "Apple Pie",
    price: 280,
    category: "fruit",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFwcGxlIFBpZTwvdGV4dD48L3N2Zz4=",
    description: "Classic apple pie with a perfect balance of sweet and tart."
  },
  {
    id: 3,
    name: "Egg Pie",
    price: 220,
    category: "cream",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVnZyBQaWU8L3RleHQ+PC9zdmc+",
    description: "Rich and creamy Filipino-style egg pie with a smooth custard filling."
  }
];

// Save menu data to localStorage
function saveMenuData() {
  localStorage.setItem('menuItems', JSON.stringify(menuData));
  // Also update menu.json for reference
  localStorage.setItem('menu.json', JSON.stringify(menuData));
}

// Generate unique ID for new menu items
function generateMenuId() {
  const maxId = menuData.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
}

// Convert image file to Base64
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Add new menu item with image upload
async function addMenuItem(itemData) {
  try {
    const newItem = {
      id: generateMenuId(),
      name: itemData.name,
      price: parseFloat(itemData.price),
      category: itemData.category,
      image: itemData.image, // This should already be base64
      description: itemData.description
    };
    
    menuData.push(newItem);
    saveMenuData();
    
    // Update both admin dashboard and index page if they're open
    updateMenuDisplay();
    
    return newItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
}

// Update menu item
async function updateMenuItem(itemId, updatedData) {
  try {
    const itemIndex = menuData.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      menuData[itemIndex] = { ...menuData[itemIndex], ...updatedData };
      saveMenuData();
      updateMenuDisplay();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}

// Delete menu item
function deleteMenuItem(itemId) {
  const itemIndex = menuData.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    menuData.splice(itemIndex, 1);
    saveMenuData();
    updateMenuDisplay();
    return true;
  }
  return false;
}

// Get menu item by ID
function getMenuItem(itemId) {
  return menuData.find(item => item.id === itemId);
}

// Get all menu items
function getAllMenuItems() {
  return menuData;
}

// Get menu items by category
function getMenuItemsByCategory(category) {
  return menuData.filter(item => item.category === category);
}

// Get sold count for a menu item
function getSoldCount(itemName) {
  try {
    const orders = JSON.parse(localStorage.getItem('customerOrders')) || [];
    let soldCount = 0;
    
    orders.forEach(order => {
      if (order.status === 'completed') {
        order.items.forEach(item => {
          if (item.name === itemName) {
            soldCount += item.quantity || 1;
          }
        });
      }
    });
    
    return soldCount;
  } catch (error) {
    console.error('Error calculating sold count:', error);
    return 0;
  }
}

// Update menu display on index.html
function updateMenuDisplay() {
  const menuGrid = document.getElementById('menu-grid');
  
  if (menuGrid) {
    renderMenu();
  }
  
  // Also update admin dashboard if it's open
  const menuItemsList = document.getElementById('menu-items-list');
  if (menuItemsList && window.adminManager) {
    window.adminManager.displayMenuItems(menuData);
  }
}

// Render menu items (for index.html)
function renderMenu() {
  const menuGrid = document.getElementById('menu-grid');
  if (!menuGrid) return;
  
  menuGrid.innerHTML = '';
  
  if (menuData.length === 0) {
    menuGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-utensils" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
        <h3>No Menu Items Available</h3>
        <p>Check back later for our delicious pies!</p>
      </div>
    `;
    return;
  }
  
  menuData.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-category', item.category);
    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="menu-item-img" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
      <div class="menu-item-info">
        <h3>${item.name}</h3>
        <p class="menu-item-desc">${item.description}</p>
        <div class="menu-item-price">
          <span class="price">₱${item.price}</span>
          <button class="btn btn-primary add-to-cart" onclick="handleAddToCart(${item.id})">Add to Cart</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(menuItem);
  });
}

// Setup menu filters for index.html
function setupMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Initialize menu system
function initializeMenuSystem() {
  // Load menu data from localStorage
  const savedMenuData = JSON.parse(localStorage.getItem('menuItems'));
  if (savedMenuData) {
    menuData = savedMenuData;
  }
  
  // Render menu if on index page
  if (document.getElementById('menu-grid')) {
    renderMenu();
    setupMenuFilters();
  }
}

// Make functions available globally
window.addMenuItem = addMenuItem;
window.updateMenuItem = updateMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.getMenuItem = getMenuItem;
window.getAllMenuItems = getAllMenuItems;
window.getMenuItemsByCategory = getMenuItemsByCategory;
window.getSoldCount = getSoldCount;
window.initializeMenuSystem = initializeMenuSystem;
window.renderMenu = renderMenu;
window.updateMenuDisplay = updateMenuDisplay;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMenuSystem);