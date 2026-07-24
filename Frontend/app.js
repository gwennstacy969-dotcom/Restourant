// ============================================================
// CATERING 2W — Modern Interactive Features
// ============================================================

const API_BASE = 'http://localhost:3000/api';

// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 800);
});

// ===== DARK MODE TOGGLE =====
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Navbar shrink
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link based on scroll
    updateActiveNav();
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== ACTIVE NAV LINK TRACKING =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== MOBILE NAV TOGGLE =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('main-nav');
let navOverlay = null;

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    
    if (isOpen) {
        // Create overlay
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay active';
        document.body.appendChild(navOverlay);
        navOverlay.addEventListener('click', closeMenu);
        document.body.style.overflow = 'hidden';
    } else {
        closeMenu();
    }
});

function closeMenu() {
    mainNav.classList.remove('open');
    if (navOverlay) {
        navOverlay.remove();
        navOverlay = null;
    }
    document.body.style.overflow = '';
}

// Close on nav link click (mobile)
mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ===== TYPING ANIMATION =====
const typedTextEl = document.getElementById('typed-text');
const phrases = [
    'Nggak Pake Ribet!',
    'Harga Bersahabat!',
    'Rasa Premium!',
    'Selalu Fresh!',
    'Bisa Custom!'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimeout;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 300;
    }

    typeTimeout = setTimeout(typeEffect, speed);
}

typeEffect();

// ===== HERO FLOATING PARTICLES =====
const particlesContainer = document.getElementById('hero-particles');
const foodEmojis = ['🍚', '🍙', '🍗', '🍢', '🥟', '☕', '🍖', '🍲', '🌶️', '🍳', '🍤', '🍌'];

function createParticle() {
    const particle = document.createElement('span');
    particle.className = 'food-particle';
    particle.textContent = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    particle.style.animationDuration = (Math.random() * 10 + 12) + 's';
    particle.style.animationDelay = (Math.random() * 5) + 's';
    particlesContainer.appendChild(particle);

    // Clean up after animation
    setTimeout(() => {
        if (particle.parentNode) particle.remove();
    }, 22000);
}

// Create initial batch
for (let i = 0; i < 12; i++) {
    setTimeout(createParticle, i * 800);
}

// Keep creating particles
setInterval(createParticle, 3000);

// ===== SCROLL REVEAL (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger the animation
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== ANIMATED COUNTERS =====
const counters = document.querySelectorAll('.hero-stat-number');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
            });
        }
    });
}, { threshold: 0.5 });

if (counters.length > 0) {
    counterObserver.observe(counters[0].closest('.hero-stats'));
}

function animateCounter(el, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target.toLocaleString('id-ID');
            return;
        }
        el.textContent = Math.floor(current).toLocaleString('id-ID');
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ===== MENU FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        menuCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hide');
                card.classList.add('show');
            } else {
                card.classList.add('hide');
                card.classList.remove('show');
            }
        });
    });
});

// ===== TESTIMONIAL CAROUSEL =====
const carouselTrack = document.getElementById('carousel-track');
const carouselDots = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const testimonialCards = document.querySelectorAll('.testimonial-card');

let currentSlide = 0;
let slidesPerView = 3;
let autoPlayInterval;

function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else if (window.innerWidth <= 1024) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
}

function getTotalSlides() {
    return Math.max(0, testimonialCards.length - slidesPerView);
}

function createDots() {
    carouselDots.innerHTML = '';
    const total = getTotalSlides() + 1;
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }
}

function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, getTotalSlides()));
    const cardWidth = testimonialCards[0].offsetWidth + 24; // gap
    carouselTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    
    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    if (currentSlide >= getTotalSlides()) {
        goToSlide(0);
    } else {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide <= 0) {
        goToSlide(getTotalSlides());
    } else {
        goToSlide(currentSlide - 1);
    }
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });
nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });

// Initialize carousel
updateSlidesPerView();
createDots();
startAutoPlay();

window.addEventListener('resize', () => {
    updateSlidesPerView();
    createDots();
    goToSlide(Math.min(currentSlide, getTotalSlides()));
});

// Touch support for carousel
let touchStartX = 0;
let touchEndX = 0;

carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
}, { passive: true });

carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
    startAutoPlay();
}, { passive: true });

// ===== ORDER FORM =====
const orderForm = document.getElementById('order-form');
const packageSelect = document.getElementById('order-package');
const qtyInput = document.getElementById('order-qty');
const orderTotal = document.getElementById('order-total');
const totalDisplay = document.getElementById('total-display');

const packagePrices = { 1: 10000, 2: 15000, 3: 20000, 4: 25000 };

function updateTotal() {
    const pkgId = packageSelect.value;
    const qty = parseInt(qtyInput.value) || 1;

    if (pkgId && packagePrices[pkgId]) {
        const total = packagePrices[pkgId] * qty;
        totalDisplay.textContent = 'Rp' + total.toLocaleString('id-ID');
        orderTotal.style.display = 'flex';
    } else {
        orderTotal.style.display = 'none';
    }
}

packageSelect.addEventListener('change', updateTotal);
qtyInput.addEventListener('input', updateTotal);

// Handle order button clicks from pricing cards
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pkgId = btn.dataset.package;
        packageSelect.value = pkgId;
        updateTotal();
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });
});

// Submit form
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-order-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Show loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    const formData = {
        customer_name: document.getElementById('customer-name').value,
        customer_phone: document.getElementById('customer-phone').value,
        customer_email: document.getElementById('customer-email').value,
        order_type: document.getElementById('order-type').value,
        package_id: parseInt(document.getElementById('order-package').value) || null,
        quantity: parseInt(document.getElementById('order-qty').value) || 1,
        event_date: document.getElementById('event-date').value || null,
        delivery_address: document.getElementById('delivery-address').value,
        notes: document.getElementById('order-notes').value,
        total_price: packagePrices[document.getElementById('order-package').value] 
            ? packagePrices[document.getElementById('order-package').value] * (parseInt(document.getElementById('order-qty').value) || 1)
            : 0
    };

    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showToast('success', `Pesanan berhasil dibuat! ID: #${result.data.id}. Kami akan menghubungi Anda segera.`);
            orderForm.reset();
            orderTotal.style.display = 'none';
        } else {
            showToast('error', result.message || 'Gagal membuat pesanan');
        }
    } catch (err) {
        // Fallback: jika server belum jalan, arahkan ke WhatsApp
        const waMessage = `Halo Catering 2W, saya mau pesan:\n\nNama: ${formData.customer_name}\nHP: ${formData.customer_phone}\nPaket: ${document.getElementById('order-package').selectedOptions[0]?.text || '-'}\nJumlah: ${formData.quantity}\nTanggal: ${formData.event_date || '-'}\nAlamat: ${formData.delivery_address || '-'}\nCatatan: ${formData.notes || '-'}`;
        
        showToast('info', 'Server belum aktif. Mengarahkan ke WhatsApp...');
        
        setTimeout(() => {
            window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`, '_blank');
        }, 1500);
    } finally {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// ===== TOAST NOTIFICATION SYSTEM =====
const toastContainer = document.getElementById('toast-container');

function showToast(type, message, duration = 5000) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(() => this.parentElement.remove(), 300);">✕</button>
    `;
    
    toastContainer.appendChild(toast);

    // Auto-remove
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

// ===== COMMAND PALETTE =====
const commandPalette = document.getElementById('command-palette');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
let selectedIndex = -1;

const searchData = [
    { text: '🍚 Paket Nasi Box', category: 'Menu', action: 'scroll', target: '#nasi-box' },
    { text: '🍙 Menu Angkringan', category: 'Menu', action: 'scroll', target: '#angkringan' },
    { text: '📝 Form Pemesanan', category: 'Pesan', action: 'scroll', target: '#order' },
    { text: '⭐ Testimoni Pelanggan', category: 'Review', action: 'scroll', target: '#testimonials' },
    { text: '🌗 Toggle Dark Mode', category: 'Pengaturan', action: 'theme' },
    { text: '💰 Paket Hemat — Rp10.000', category: 'Nasi Box', action: 'scroll', target: '#nasi-box' },
    { text: '⭐ Paket Standar — Rp15.000', category: 'Nasi Box', action: 'scroll', target: '#nasi-box' },
    { text: '🏆 Paket Spesial — Rp20.000', category: 'Nasi Box', action: 'scroll', target: '#nasi-box' },
    { text: '👑 Paket Premium — Rp25.000', category: 'Nasi Box', action: 'scroll', target: '#nasi-box' },
    { text: '🍙 Nasi Bakar Ayam Suwir', category: 'Angkringan', action: 'scroll', target: '#angkringan' },
    { text: '🍢 Sate Usus & Telur Puyuh', category: 'Angkringan', action: 'scroll', target: '#angkringan' },
    { text: '🥟 Gorengan — Mendoan, Bakwan', category: 'Angkringan', action: 'scroll', target: '#angkringan' },
    { text: '☕ Wedang Jahe & Susu Jahe', category: 'Angkringan', action: 'scroll', target: '#angkringan' },
    { text: '📞 Hubungi WhatsApp', category: 'Kontak', action: 'link', target: 'https://wa.me/6281234567890' },
];

function togglePalette() {
    commandPalette.classList.toggle('hidden');
    if (!commandPalette.classList.contains('hidden')) {
        searchInput.value = '';
        searchInput.focus();
        renderSearchResults(searchData);
        selectedIndex = -1;
    }
}

function renderSearchResults(items) {
    searchResults.innerHTML = items.map((item, i) => `
        <li data-index="${i}" class="${i === selectedIndex ? 'selected' : ''}">
            <span>${item.text}</span>
            <small>${item.category}</small>
        </li>
    `).join('');

    // Click handler
    searchResults.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            const idx = parseInt(li.dataset.index);
            executeSearchAction(items[idx]);
        });
    });
}

function executeSearchAction(item) {
    commandPalette.classList.add('hidden');
    
    if (item.action === 'scroll') {
        document.querySelector(item.target)?.scrollIntoView({ behavior: 'smooth' });
    } else if (item.action === 'theme') {
        themeToggleBtn.click();
    } else if (item.action === 'link') {
        window.open(item.target, '_blank');
    }
}

// Search filtering
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        renderSearchResults(searchData);
        return;
    }
    const filtered = searchData.filter(item => 
        item.text.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
    selectedIndex = filtered.length > 0 ? 0 : -1;
    renderSearchResults(filtered);
});

// Keyboard navigation
searchInput.addEventListener('keydown', (e) => {
    const items = searchResults.querySelectorAll('li');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        updateSelected(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelected(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].click();
        }
    }
});

function updateSelected(items) {
    items.forEach((li, i) => {
        li.classList.toggle('selected', i === selectedIndex);
    });
    if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

// Open with button
searchBtn.addEventListener('click', togglePalette);

// Open with Ctrl+K
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
    }
    if (e.key === 'Escape' && !commandPalette.classList.contains('hidden')) {
        commandPalette.classList.add('hidden');
    }
});

// Close on overlay click
commandPalette.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
        commandPalette.classList.add('hidden');
    }
});

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== CARD 3D TILT EFFECT =====
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = card.classList.contains('popular') 
            ? `scale(1.03) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = card.classList.contains('popular') 
            ? 'scale(1.03)' 
            : '';
    });
});

// ===== INITIALIZE =====
console.log('%c🍽️ Catering 2W', 'font-size: 24px; font-weight: bold; color: #e84545;');
console.log('%cWebsite Modern by Catering 2W', 'font-size: 12px; color: #888;');