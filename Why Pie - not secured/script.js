// ===================== Global Variables & Constants =====================
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let map;
let deliveryAddress = {};
let selectedPaymentMethod = '';

// Store location coordinates (Mabini, Batangas)
const storeLocation = {
  lat: 13.7365,
  lng: 120.9365,
  name: "Why Pie? Bake Good And Treat",
  address: "123 Pie Street, Mabini, Batangas 4202"
};

// Menu data
const menuData = [
  {
    id: 1,
    name: "Buko Langka Pie",
    price: 250,
    category: "fruit",
    image: "buko-pie-langka.jpg",
    description: "A delightful combination of young coconut and jackfruit in a flaky crust."
  },
  {
    id: 2,
    name: "Apple Pie",
    price: 280,
    category: "fruit",
    image: "apple-pie.jpeg",
    description: "Classic apple pie with a perfect balance of sweet and tart."
  },
  {
    id: 3,
    name: "Egg Pie",
    price: 220,
    category: "cream",
    image: "Egg-Pie.webp",
    description: "Rich and creamy Filipino-style egg pie with a smooth custard filling."
  },
  {
    id: 4,
    name: "Buko Pie Classic",
    price: 240,
    category: "fruit",
    image: "BUKO_PIE classic.jpg",
    description: "Our original buko pie made with fresh young coconut."
  },
  {
    id: 5,
    name: "Pumpkin Pie",
    price: 260,
    category: "special",
    image: "Pumpkin-Pie.jpg",
    description: "Seasonal favorite with smooth spiced pumpkin filling."
  },
  {
    id: 6,
    name: "Ube Pie",
    price: 270,
    category: "special",
    image: "ube-pie.jpg",
    description: "Filipino favorite made with purple yam and creamy filling."
  },
  {
    id: 7,
    name: "Mango Cream Pie",
    price: 290,
    category: "cream",
    image: "Mango-Pie.jpg",
    description: "Creamy pie with fresh mango chunks and light whipped cream."
  },
  {
    id: 8,
    name: "Blueberry Pie",
    price: 300,
    category: "fruit",
    image: "Blueberry-Pie.jpg",
    description: "Bursting with fresh blueberries in a buttery crust."
  }
];

// ===================== Batangas Barangays Data =====================
const batangasBarangays = {
    "Mabini": [
        "Anilao", "Bagalangit", "Bulacan", "Calamias", "Estrella", "Gasang", 
        "Laurel", "Ligaya", "Mainaga", "Mainit", "Majuben", "Malimatoc I", 
        "Malimatoc II", "Nag-Iba", "Pilahan", "Poblacion", "Pulang Lupa", 
        "Pulong Anahao", "Pulong Balibaguhan", "Pulong Niogan", "Saguing", 
        "Sampaguita", "San Francisco", "San Jose", "San Juan", "San Teodoro", 
        "Santa Ana", "Santa Mesa", "Santo Niño", "Santo Tomas", "Solo", 
        "Talaga", "Talaga Proper"
    ],
    "Bauan": [
        "Alagao", "Aplaya", "As-Is", "Bagong Silang", "Baguilawa", "Balayong", 
        "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Bolo", 
        "Colvo", "Cupang", "Durungao", "Gulibay", "Inicbulan", "Locloc", 
        "Magalang-Galang", "Malindig", "Manalupong", "Manghinao", "New Danglayan", 
        "Orense", "Pitugo", "Rizal", "Sampaguita", "San Andres", "San Miguel", 
        "San Pedro", "San Roque", "San Teodoro", "San Vicente", "Santa Maria", 
        "Santa Rita", "Santo Domingo", "Sinala"
    ],
    "San Pascual": [
        "Alalum", "Antipolo", "Balimbing", "Banaba", "Bayanan", "Danglayan", 
        "Del Pilar", "Gelerang kawayan", "Ilat", "Kaingin", "Laurel", "Mataas na Lupa", 
        "Natunuan", "Padre Castillo", "Palsara", "Pila", "Poblacion", "Pulong niogan", 
        "San Antonio", "San Mariano", "San Mateo", "Santa Elena", "Santo Niño"
    ],
    "Lipa City": [
        "Antipolo", "Anilao", "Bagong Pook", "Balintawak", "Banaybanay", "Bolbok", 
        "Bugas", "Bulacnin", "Calamias", "Cumba", "Dagatan", "Duhatan", "Halang", 
        "Marawoy", "Mataas na Lupa", "Pagolingin Bata", "Pagolingin East", 
        "Pagolingin West", "Pangao", "Pinagkawitan", "Poblacion", "Quezon", 
        "Rizal", "Sabang", "Sampaolo", "San Benito", "San Carlos", "San Francisco", 
        "San Guillermo", "San Jose", "San Lucas", "San Salvador", "Santo Niño", 
        "Santo Toribio", "Talaga", "Tambo", "Tanguay", "Tibig"
    ],
    "Batangas City": [
        "Alangilan", "Balagtas", "Balete", "Banga", "Bilog-bilog", "Bolbok", 
        "Calicanto", "Cuta", "Dela Paz", "Dela Paz Pulot Aplaya", "Dela Paz Pulot Itaas", 
        "Gulod Itaas", "Gulod Labac", "Haligue", "Ilijan", "Kumintang Ibaba", 
        "Kumintang Ilaya", "Libjo", "Liponpon", "Maapaz", "Mahabang Dahilig", 
        "Mahabang Parang", "Malalim", "Malibayo", "Malitam", "Maruclap", 
        "Munting Solo", "Pallocan", "Palsara", "Pila", "Pinamucan", "Sampaga", 
        "San Agapito", "San Agustin", "San Isidro", "San Jose Sico", "San Miguel", 
        "San Pedro", "Santa Clara", "Santa Rita", "Santo Domingo", "Santo Niño", 
        "Simlong", "Sirang Lupa", "Sorosoro", "Tabangao Aplaya", "Tabangao Ambulong", 
        "Talahib", "Talahib Pandayan", "Talumpok", "Tinga", "Tulo", "Wawa"
    ],
    "Calatagan": [
        "Baha", "Balibago", "Balitoc", "Barangay 1", "Barangay 2", "Barangay 3", 
        "Barangay 4", "Bigaa", "Bucal", "Carlosa", "Carretunan", "Encarnacion", 
        "Gulod", "Hukay", "Lucsuhin", "Lugo", "Mabacong", "Paraiso", "Quilitisan", 
        "Real", "Sambungan", "Santa Ana", "Talibayog", "Tanagan", "Upi"
    ],
    "Taal": [
        "Apacay", "Balisong", "Bihis", "Bolbok", "Buli", "Butong", "Carasuche", 
        "Cawit", "Caysasay", "Cuba", "Gahol", "Halang", "Iba", "Ilog", "Imamawo", 
        "Ipil", "Laguile", "Latag", "Luntal", "Mahabang Lodlod", "Niogan", 
        "Pansol", "Poblacion", "Pook", "Seiran", "Sinala", "Tatlong Maria", 
        "Tierra Alta"
    ],
    "Tanauan": [
        "Altura Bata", "Altura Matanda", "Altura South", "Ambulong", "Banadero", 
        "Bagbag", "Bagumbayan", "Balele", "Banjo East", "Banjo West", "Bilog-bilog", 
        "Boot", "Cale", "Darasa", "Gonzales", "Hidalgo", "Janopol", "Janopol Oriental", 
        "Laurel", "Luyos", "Mabini", "Malaking Pulo", "Maria Paz", "Maugat", 
        "Montaña", "Natatas", "Pagaspas", "Pantay Bata", "Pantay Matanda", 
        "Poblacion Barangay 1", "Poblacion Barangay 2", "Poblacion Barangay 3", 
        "Poblacion Barangay 4", "Poblacion Barangay 5", "Poblacion Barangay 6", 
        "Poblacion Barangay 7", "Sala", "Sambat", "San Jose", "Santol", "Santor", 
        "Sulpoc", "Suplang", "Talaga", "Tinurik", "Trapiche", "Ulango", "Wawa"
    ],
    "Laurel": [
        "As-Is", "Balakilong", "Berinayan", "Bugaan East", "Bugaan West", 
        "Buso-buso", "Dayap Itaas", "Gulod", "J. Leviste", "Molinete", 
        "Niyugan", "Paliparan", "San Gabriel", "San Gregorio", "Santa Maria", 
        "Ticub"
    ],
    "Nasugbu": [
        "Aga", "Balaytigui", "Banilad", "Barangay 1", "Barangay 2", "Barangay 3", 
        "Barangay 4", "Barangay 5", "Barangay 6", "Barangay 7", "Barangay 8", 
        "Barangay 9", "Barangay 10", "Barangay 11", "Barangay 12", "Bilaran", 
        "Bucana", "Bulihan", "Camandag", "Catandaan", "Kaylaway", "Kayrilaw", 
        "Cogunan", "Dayap", "Latang", "Looc", "Lumbangan", "Malapad Na Bato", 
        "Mataas Na Pulo", "Maulo", "Munting Indang", "Natipuan", "Pantalan", 
        "Papaya", "Putat", "Reparo", "Talon", "Tumalim", "Utod", "Wawa"
    ],
    "Balayan": [
        "Baclaran", "Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", 
        "Barangay 5", "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", 
        "Barangay 10", "Barangay 11", "Barangay 12", "Calan", "Calamias", 
        "Caloocan", "Calzada", "Canda", "Carenahan", "Caybunga", "Cayponce", 
        "Dalig", "Dao", "Dilao", "Duhatan", "Durungao", "Gimalas", "Lanatan", 
        "Langgangan", "Lucban Putol", "Lucban Pook", "Magabe", "Malalay", 
        "Munting Tubig", "Navotas", "Patugo", "Palikpikan", "Pooc", "Sambat", 
        "Sampaga", "San Juan", "Santo Niño", "Sukol", "Tactac", "Taludtud", 
        "Tanggoy", "Tilain", "Tomas"
    ],
    "Calaca": [
        "Baclas", "Bagong Tubig", "Balanhoy", "Bisaya", "Cahil", "Calantas", 
        "Coral Ni Bacal", "Dacanlao", "Dila", "Loma", "Luya", "Majuba", 
        "Makina", "Matipok", "Munting Coral", "Niyugan", "Pantay", "Puting Bato", 
        "Quisumbing", "Salong", "San Rafael", "Talisay", "Tamarong"
    ],
    "Lemery": [
        "Anak-Dagat", "Anak-Niya", "Apacay", "Arumahan", "Ayao-iyao", "Bagong Pook", 
        "Bagong Sikat", "Balanga", "Bukal", "Cahilan I", "Cahilan II", "Dayapan", 
        "Dita", "Gulod", "Lucky", "Maguihan", "Mahabang Dahilig", "Mahayahay", 
        "Maigsing Dahilig", "Maligaya", "Mahabang Lodlod", "Mal-lomot", "Mataas Na Bayan", 
        "Matingain I", "Matingain II", "Mayasang", "Niugan", "Nonong Casto", 
        "Palanas", "Payapa Ibaba", "Payapa Ilaya", "Rizal", "Sinala", "Sinisian", 
        "Solo", "Tubigan", "Wawa"
    ],
    "other": [
        "Other Barangay"
    ]
};

// ===================== Initialization =====================
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  setupEventListeners();
});

function initializePage() {
  updateUserNav();
  updateCartCount();
  
  // Initialize components based on current page
  if (document.querySelector('.slider')) {
    initializeSlider();
  }
  
  if (document.getElementById('menu-grid')) {
    renderMenu();
    setupMenuFilters();
  }
  
  if (document.getElementById('store-map')) {
    initializeMap();
  }
  
  // Initialize GSAP animations
  if (typeof gsap !== 'undefined') {
    initializeAnimations();
  }
  
  // Initialize scroll reveal
  initializeScrollReveal();
  
  // Initialize form validation
  setupAddressFormValidation();
}

function setupEventListeners() {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Logout button event listener
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logoutUser();
    });
  }
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  
  // Smooth scrolling for anchor links (index.html only)
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }
  
  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Thank you for your message! We will get back to you soon.', 'success');
      this.reset();
    });
  }

  // Add event listener for cart icon
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      openCartModal();
    });
  }
}

// ===================== Scroll Reveal Animation =====================
function initializeScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        
        if (entry.target.classList.contains('reveal-stagger')) {
          const children = entry.target.querySelectorAll('.reveal-element');
          children.forEach((child, index) => {
            child.style.setProperty('--stagger-index', index);
          });
        }
        
        observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove('reveal-visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal-element').forEach(element => {
    observer.observe(element);
  });
}

// ===================== Slider Functions =====================
function initializeSlider() {
  const cards = document.querySelectorAll(".card");
  const dotsContainer = document.querySelector(".slider-dots");
  
  if (cards.length === 0) return;
  
  let currentIndex = 0;
  let slideInterval;

  // Create dots if they don't exist
  if (!dotsContainer) {
    const newDotsContainer = document.createElement('div');
    newDotsContainer.className = 'slider-dots';
    document.querySelector('.slider').appendChild(newDotsContainer);
    
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
        resetSliderInterval();
      });
      newDotsContainer.appendChild(dot);
    });
  }

  function showSlide(index) {
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });

    // Update dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    const details = cards[index].querySelector(".details");
    if (details && typeof gsap !== 'undefined') {
      gsap.fromTo(details,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    showSlide(currentIndex);
  }

  function resetSliderInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
  }

  function startSlider() {
    showSlide(currentIndex);
    resetSliderInterval();
  }

  startSlider();
}

// ===================== Map Functions =====================
function initializeMap() {
  map = L.map('store-map').setView([storeLocation.lat, storeLocation.lng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const bakeryIcon = L.divIcon({
    html: '<div style="background: #8B4513; color: white; padding: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-store" style="font-size: 20px;"></i></div>',
    iconSize: [40, 40],
    className: 'bakery-marker'
  });

  const marker = L.marker([storeLocation.lat, storeLocation.lng], { icon: bakeryIcon })
    .addTo(map)
    .bindPopup(`
      <div style="text-align: center; padding: 10px;">
        <h3 style="margin: 0 0 10px 0; color: #8B4513; font-size: 1.2rem;">${storeLocation.name}</h3>
        <p style="margin: 0 0 15px 0; color: #666;">${storeLocation.address}</p>
        <button onclick="getDirections()" style="padding: 8px 16px; background: #8B4513; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9rem;">
          <i class="fas fa-directions"></i> Get Directions
        </button>
      </div>
    `);

  const deliveryZone = L.circle([storeLocation.lat, storeLocation.lng], {
    color: '#8B4513',
    fillColor: '#8B4513',
    fillOpacity: 0.1,
    weight: 2,
    dashArray: '5, 5',
    radius: 15000
  }).addTo(map).bindPopup('Our delivery coverage area (Batangas area)');

  marker.openPopup();
}

function getDirections() {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${storeLocation.lat},${storeLocation.lng}`;
  window.open(url, '_blank');
}

// ===================== Menu Functions =====================
function renderMenu() {
  const menuGrid = document.getElementById('menu-grid');
  if (!menuGrid) return;
  
  menuGrid.innerHTML = '';
  
  menuData.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item reveal-element';
    menuItem.setAttribute('data-category', item.category);
    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="menu-item-img">
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

// ===================== Cart Functions =====================
function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

function isUserLoggedIn() {
  return currentUser && currentUser.role === 'customer';
}

function handleAddToCart(itemId) {
  if (!isUserLoggedIn()) {
    showLoginModal();
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  if (currentUser && currentUser.role !== 'customer') {
    showNotification(
      `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}s cannot add items to cart. This feature is for customers only.`,
      'error'
    );
    return;
  }

  addToCart(itemId);
}

function addToCart(itemId) {
  const menuItem = menuData.find(item => item.id === itemId);
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
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${menuItem.name} added to cart!`);
}

// ===================== Authentication Functions =====================
function updateUserNav() {
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
      
      if (dashboardLink) {
        dashboardLink.style.display = 'block';
        dashboardLink.innerHTML = `
          <a href="${getDashboardLink(currentUser.role)}" class="btn btn-outline">
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
}

function getDashboardLink(role) {
  switch(role) {
    case 'admin': return 'admin-dashboard.html';
    case 'staff': return 'staff-dashboard.html';
    case 'customer': return 'customer-dashboard.html';
    default: return 'index.html';
  }
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('customerLoggedIn');
  localStorage.removeItem('cart');
  currentUser = null;
  cart = [];
  updateUserNav();
  updateCartCount();
  window.location.href = 'index.html';
}

// ===================== Modal Functions =====================
function showLoginModal() {
  const loginModal = document.getElementById('login-modal');
  if (loginModal) {
    loginModal.style.display = 'flex';
  }
}

function closeLoginModal() {
  const loginModal = document.getElementById('login-modal');
  if (loginModal) {
    loginModal.style.display = 'none';
  }
}

function closeModal() {
  const successModal = document.getElementById('success-modal');
  if (successModal) {
    successModal.classList.remove('active');
  }
}

// ===================== Notification System =====================
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
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
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ===================== Cart Modal Functions =====================
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    renderCartModal();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function renderCartModal() {
    const cartItemsContainer = document.getElementById('cart-modal-items');
    const cartTotalElement = document.getElementById('cart-modal-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalElement.textContent = '0';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.6';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const menuItem = menuData.find(menuItem => menuItem.id === item.id);
        if (!menuItem) return;

        const itemTotal = menuItem.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <img src="${menuItem.image}" alt="${menuItem.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${menuItem.name}</h4>
                        <p class="cart-item-price">₱${menuItem.price}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCartModal(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });

    cartTotalElement.textContent = total.toFixed(2);
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCartModal(itemId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartModal();
            updateCartCount();
        }
    }
}

function removeFromCartModal(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartModal();
    updateCartCount();
    showToast('Item removed from cart');
}

// ===================== Checkout Flow Functions =====================
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    closeCartModal();
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.classList.add('active');
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.classList.remove('active');
}

function showAddressForm() {
    closeCheckoutModal();
    const addressModal = document.getElementById('address-modal');
    addressModal.classList.add('active');
    
    populateAddressForm();
}

function closeAddressModal() {
    const addressModal = document.getElementById('address-modal');
    addressModal.classList.remove('active');
}

// ===================== Enhanced Address Functions =====================
function saveAddressAndProceed() {
    console.log("Continue to Payment button clicked!");
    
    // Get the button and show loading state
    const continueBtn = document.getElementById('continue-payment-btn');
    const originalText = continueBtn.innerHTML;
    continueBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    continueBtn.disabled = true;

    // Validate form - removed house-details from required fields
    const requiredFields = ['full-name', 'phone', 'municipality', 'barangay', 'street'];
    let isValid = true;
    let firstInvalidField = null;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            input.style.borderColor = '#f44336';
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
        } else {
            input.style.borderColor = '';
        }
    });

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    const phoneRegex = /^(09|\+639)\d{9}$/;
    if (phoneInput.value.trim() && !phoneRegex.test(phoneInput.value.trim())) {
        phoneInput.style.borderColor = '#f44336';
        isValid = false;
        showToast('Please enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXXX)', 'error');
        if (!firstInvalidField) firstInvalidField = phoneInput;
    }

    if (!isValid) {
        // Reset button state
        continueBtn.innerHTML = originalText;
        continueBtn.disabled = false;
        
        // Show error message
        showToast('Please fill in all required fields correctly', 'error');
        
        // Scroll to first invalid field
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
        return;
    }

    // Save complete address data - removed houseDetails
    deliveryAddress = {
        fullName: document.getElementById('full-name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        municipality: document.getElementById('municipality').value,
        barangay: document.getElementById('barangay').value,
        street: document.getElementById('street').value.trim(),
        landmark: document.getElementById('landmark').value.trim(),
        completeAddress: `${document.getElementById('street').value.trim()}, ${document.getElementById('barangay').value}, ${document.getElementById('municipality').value}, Batangas${document.getElementById('landmark').value.trim() ? ` (Near ${document.getElementById('landmark').value.trim()})` : ''}`
    };

    // Save address to user profile for future orders
    saveAddressToProfile(deliveryAddress);

    // Simulate processing delay for better UX
    setTimeout(() => {
        closeAddressModal();
        showPaymentOptions();
        
        // Reset button state
        continueBtn.innerHTML = originalText;
        continueBtn.disabled = false;
        
        showToast('Address saved successfully!', 'success');
    }, 1000);
}

function showPaymentOptions() {
    console.log("Showing payment options...");
    const paymentModal = document.getElementById('payment-modal');
    if (paymentModal) {
        paymentModal.classList.add('active');
        
        // Add animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(paymentModal.querySelector('.modal-content'),
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    }
}

// Enhanced payment method selection
function selectPaymentMethod(method) {
    console.log("Payment method selected:", method);
    selectedPaymentMethod = method;
    const methodNames = {
        'gcash': 'GCash',
        'paymaya': 'PayMaya',
        'cod': 'Cash on Delivery'
    };
    
    // Update confirmation message
    document.getElementById('payment-confirm-message').textContent = 
        `Are you sure you want to pay using ${methodNames[method]}?`;
    
    closePaymentModal();
    
    // Show payment confirmation with animation
    const paymentConfirmModal = document.getElementById('payment-confirm-modal');
    paymentConfirmModal.classList.add('active');
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(paymentConfirmModal.querySelector('.modal-content'),
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
    }
}

// Enhanced process payment function
function processPayment() {
    console.log("Processing payment...");
    
    // Show loading state
    const confirmBtn = document.querySelector('#payment-confirm-modal .btn-primary');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    confirmBtn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        // Process payment and generate receipt
        const receipt = generateMinimizedReceipt();
        document.getElementById('receipt-content').innerHTML = receipt;
        
        closePaymentConfirmModal();
        
        // Show success modal with animation
        const orderSuccessModal = document.getElementById('order-success-modal');
        orderSuccessModal.classList.add('active');
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(orderSuccessModal.querySelector('.modal-content'),
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
            );
        }

        // Save order to localStorage
        saveOrder();
        
        // Clear cart after successful payment
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Reset button
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
        
        console.log("Payment processed successfully!");
        
    }, 2000);
}

// Enhanced form validation and user experience
function setupAddressFormValidation() {
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        // Real-time validation
        const inputs = addressForm.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(244, 67, 54)') {
                    validateField(this);
                }
            });
        });
        
        // Enter key support
        addressForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveAddressAndProceed();
            }
        });
    }
}

function validateField(field) {
    if (!field.value.trim()) {
        field.style.borderColor = '#f44336';
        return false;
    }
    
    // Phone number validation
    if (field.id === 'phone') {
        const phoneRegex = /^(09|\+639)\d{9}$/;
        if (!phoneRegex.test(field.value.trim())) {
            field.style.borderColor = '#f44336';
            return false;
        }
    }
    
    field.style.borderColor = '';
    return true;
}

// Enhanced address form population
function populateAddressForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.address) {
        const address = currentUser.address;
        
        if (address.fullName) {
            document.getElementById('full-name').value = address.fullName;
        }
        if (address.phone) {
            document.getElementById('phone').value = address.phone;
        }
        if (address.municipality) {
            document.getElementById('municipality').value = address.municipality;
            updateBarangays();
            setTimeout(() => {
                if (address.barangay) {
                    document.getElementById('barangay').value = address.barangay;
                }
            }, 100);
        }
        if (address.street) {
            document.getElementById('street').value = address.street;
        }
        if (address.landmark) {
            document.getElementById('landmark').value = address.landmark;
        }
        
        // Show success message if form was pre-filled
        setTimeout(() => {
            showToast('Your previous address has been loaded', 'success');
        }, 500);
    } else if (currentUser) {
        // Pre-fill with user data if available
        if (currentUser.name) {
            document.getElementById('full-name').value = currentUser.name;
        }
        if (currentUser.phone) {
            document.getElementById('phone').value = currentUser.phone;
        }
    }
}

// Enhanced barangay update function
function updateBarangays() {
    const municipality = document.getElementById('municipality').value;
    const barangaySelect = document.getElementById('barangay');
    
    // Save current selection if any
    const currentBarangay = barangaySelect.value;
    
    // Clear and repopulate
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    
    if (municipality && batangasBarangays[municipality]) {
        batangasBarangays[municipality].forEach(barangay => {
            const option = document.createElement('option');
            option.value = barangay;
            option.textContent = barangay;
            barangaySelect.appendChild(option);
        });
        
        // Restore previous selection if still available
        if (currentBarangay && batangasBarangays[municipality].includes(currentBarangay)) {
            barangaySelect.value = currentBarangay;
        }
    }
}

function saveAddressToProfile(address) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.address = address;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    paymentModal.classList.remove('active');
}

function closePaymentConfirmModal() {
    const paymentConfirmModal = document.getElementById('payment-confirm-modal');
    paymentConfirmModal.classList.remove('active');
}

function closeOrderSuccessModal() {
    const orderSuccessModal = document.getElementById('order-success-modal');
    orderSuccessModal.classList.remove('active');
}

function continueShopping() {
    closeOrderSuccessModal();
    window.location.href = '#menu';
}

function saveOrder() {
    const total = cart.reduce((sum, item) => {
        const menuItem = menuData.find(menuItem => menuItem.id === item.id);
        return sum + (menuItem.price * item.quantity);
    }, 0);
    
    const order = {
        id: 'WHYPIE' + Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: total,
        shippingFee: total < 500 ? 50 : 0,
        paymentMethod: selectedPaymentMethod,
        deliveryAddress: deliveryAddress,
        status: 'pending',
        customerEmail: currentUser.email
    };
    
    const orders = JSON.parse(localStorage.getItem('customerOrders')) || [];
    orders.push(order);
    localStorage.setItem('customerOrders', JSON.stringify(orders));
}

function generateMinimizedReceipt() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest' };
    const orderNumber = 'WHYPIE' + Date.now().toString().slice(-6);
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const menuItem = menuData.find(menuItem => menuItem.id === item.id);
        if (menuItem) {
            const itemTotal = menuItem.price * item.quantity;
            total += itemTotal;
            itemsHTML += `
                <div class="receipt-item">
                    <span>${menuItem.name} x ${item.quantity}</span>
                    <span>₱${itemTotal.toFixed(2)}</span>
                </div>
            `;
        }
    });
    
    const shippingFee = total < 500 ? 50 : 0;
    const grandTotal = total + shippingFee;
    
    let receiptHTML = `
        <div class="minimized-receipt">
            <div class="receipt-header">
                <div class="receipt-logo">
                    <i class="fas fa-pie-chart"></i>
                    <h3>Why Pie?</h3>
                </div>
                <p class="receipt-tagline">Bake Good And Treat</p>
                <p class="receipt-order-number">Order #${orderNumber}</p>
                <p class="receipt-date">${new Date().toLocaleDateString('en-PH', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</p>
            </div>
            
            <div class="receipt-divider"></div>
            
            <div class="receipt-summary">
                <h4 class="receipt-section-title">Order Summary</h4>
                ${itemsHTML}
                <div class="receipt-item receipt-subtotal">
                    <span>Subtotal</span>
                    <span>₱${total.toFixed(2)}</span>
                </div>
                <div class="receipt-item">
                    <span>Shipping Fee</span>
                    <span>₱${shippingFee.toFixed(2)}</span>
                </div>
                <div class="receipt-total">
                    <span>Total Amount</span>
                    <span>₱${grandTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="receipt-divider"></div>
            
            <div class="receipt-delivery">
                <h4 class="receipt-section-title">Batangas Delivery Information</h4>
                <div class="delivery-info">
                    <p><strong>${deliveryAddress.fullName}</strong></p>
                    <p>📞 ${deliveryAddress.phone}</p>
                    <p>📍 ${deliveryAddress.completeAddress}</p>
                    <p class="delivery-area">🚚 Delivery Area: ${deliveryAddress.municipality}, Batangas</p>
                    <p class="payment-method">💳 Payment Method: ${selectedPaymentMethod.toUpperCase()}</p>
                </div>
            </div>
            
            <div class="receipt-divider"></div>
            
            <div class="receipt-footer">
                <div class="receipt-thankyou">
                    <p>Thank you for your order!</p>
                    <p>We'll contact you for delivery updates.</p>
                </div>
                <div class="receipt-contact">
                    <p>Why Pie? Bake Good And Treat</p>
                    <p>📞 (63) 927-482-1298</p>
                    <p>📍 Mabini, Batangas</p>
                </div>
                <div class="receipt-note">
                    <p><em>Please keep this receipt for your reference</em></p>
                </div>
            </div>
        </div>
    `;
    
    return receiptHTML;
}

// ===================== Toast Notification =====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ===================== Animation Functions =====================
function initializeAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.utils.toArray('section').forEach(section => {
            gsap.fromTo(section, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        gsap.utils.toArray('.menu-item').forEach((item, i) => {
            gsap.fromTo(item,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }
}

// ===================== Print Receipt Function =====================
function printReceipt() {
    const receiptContent = document.getElementById('receipt-content').innerHTML;
    
    const printWindow = window.open('', '_blank', 'width=650,height=800,top=50,left=50');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt - Why Pie?</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', Arial, sans-serif;
                    background: white;
                    color: #000;
                    line-height: 1.5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 25px;
                }
                
                .print-receipt-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                }
                
                .minimized-receipt {
                    background: white;
                    border: 3px solid #8B4513;
                    border-radius: 12px;
                    padding: 25px;
                    max-width: 420px;
                    width: 100%;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                    margin: 0 auto;
                    position: relative;
                    overflow: hidden;
                }
                
                .receipt-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #8B4513;
                    background: linear-gradient(135deg, #8B4513, #A0522D);
                    color: white;
                    margin: -25px -25px 20px -25px;
                    padding: 25px;
                    border-radius: 8px 8px 0 0;
                }
                
                .receipt-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 8px;
                }
                
                .receipt-logo i {
                    font-size: 28px;
                    color: #FFD700;
                }
                
                .receipt-logo h3 {
                    color: white;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                }
                
                .receipt-tagline {
                    font-size: 14px;
                    color: #FFD700;
                    margin: 0 0 12px 0;
                    font-weight: 500;
                }
                
                .receipt-order-number {
                    font-size: 13px;
                    color: #FFF8DC;
                    margin: 5px 0;
                    font-weight: 500;
                }
                
                .receipt-date {
                    font-size: 12px;
                    color: #FFF8DC;
                    margin: 5px 0 0 0;
                }
                
                .receipt-divider {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #8B4513, transparent);
                    margin: 18px 0;
                    border: none;
                }
                
                .receipt-section-title {
                    color: #8B4513;
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    font-weight: 600;
                    text-align: center;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #E8D6C3;
                }
                
                .receipt-summary {
                    margin-bottom: 20px;
                }
                
                .receipt-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px dashed #E8D6C3;
                    font-size: 13px;
                }
                
                .receipt-subtotal {
                    border-bottom: 2px solid #D2691E;
                    font-weight: 600;
                    padding-top: 12px;
                }
                
                .receipt-total {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 0;
                    border-top: 3px double #8B4513;
                    font-weight: 700;
                    font-size: 16px;
                    color: #8B4513;
                    background: #FFF8F0;
                    margin-top: 10px;
                    padding: 15px;
                    border-radius: 6px;
                }
                
                .receipt-delivery {
                    background: linear-gradient(135deg, #FFF8F0, #FFF0E0);
                    padding: 18px;
                    border-radius: 8px;
                    margin-top: 15px;
                    border-left: 4px solid #D2691E;
                    box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
                }
                
                .delivery-info p {
                    margin: 8px 0;
                    font-size: 13px;
                    color: #5D4037;
                    line-height: 1.4;
                }
                
                .payment-method {
                    background: #8B4513;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    margin-top: 12px !important;
                    font-weight: 600;
                    text-align: center;
                }
                
                .receipt-footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 2px solid #E8D6C3;
                }
                
                .receipt-thankyou {
                    margin-bottom: 15px;
                }
                
                .receipt-thankyou p {
                    margin: 5px 0;
                    font-size: 14px;
                    color: #8B4513;
                    font-weight: 500;
                }
                
                .receipt-contact {
                    background: #F5F5F5;
                    padding: 12px;
                    border-radius: 6px;
                    margin: 12px 0;
                }
                
                .receipt-contact p {
                    margin: 4px 0;
                    font-size: 11px;
                    color: #666;
                }
                
                .receipt-note {
                    margin-top: 15px;
                }
                
                .receipt-note p {
                    font-size: 10px;
                    color: #888;
                    font-style: italic;
                }
                
                @media print {
                    body {
                        margin: 0;
                        padding: 15px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: white !important;
                    }
                    
                    .print-receipt-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                    }
                    
                    .minimized-receipt {
                        border: 3px solid #000;
                        box-shadow: none;
                        margin: 0 auto;
                        page-break-inside: avoid;
                        max-width: 400px;
                    }
                    
                    .receipt-header {
                        background: #f0f0f0 !important;
                        color: #000 !important;
                        border-bottom: 2px solid #000;
                    }
                    
                    .receipt-logo h3,
                    .receipt-section-title,
                    .receipt-total {
                        color: #000 !important;
                    }
                    
                    .receipt-tagline,
                    .receipt-order-number,
                    .receipt-date {
                        color: #666 !important;
                    }
                    
                    .receipt-delivery {
                        background: #f9f9f9 !important;
                        border: 1px solid #ddd !important;
                        border-left: 4px solid #666 !important;
                    }
                    
                    .payment-method {
                        background: #333 !important;
                        color: white !important;
                    }
                    
                    @page {
                        margin: 0.8cm;
                        size: auto;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-receipt-container">
                ${receiptContent}
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
                
                window.onafterprint = function() {
                    setTimeout(function() {
                        window.close();
                    }, 1000);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Make functions globally available
window.handleAddToCart = handleAddToCart;
window.closeModal = closeModal;
window.getDirections = getDirections;
window.closeLoginModal = closeLoginModal;
window.showLoginModal = showLoginModal;
window.logoutUser = logoutUser;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCartModal = removeFromCartModal;
window.proceedToCheckout = proceedToCheckout;
window.closeCheckoutModal = closeCheckoutModal;
window.showAddressForm = showAddressForm;
window.closeAddressModal = closeAddressModal;
window.saveAddressAndProceed = saveAddressAndProceed;
window.showPaymentOptions = showPaymentOptions;
window.closePaymentModal = closePaymentModal;
window.selectPaymentMethod = selectPaymentMethod;
window.closePaymentConfirmModal = closePaymentConfirmModal;
window.processPayment = processPayment;
window.closeOrderSuccessModal = closeOrderSuccessModal;
window.continueShopping = continueShopping;
window.printReceipt = printReceipt;
window.showToast = showToast;
window.updateBarangays = updateBarangays;