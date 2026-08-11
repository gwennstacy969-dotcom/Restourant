// ============================================================
// CATERING 2W — Modern Interactive Features
// ============================================================

const API_BASE = 'http://localhost:3000/api';

// ===== LOADER =====
window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
    }, 500);
});

// ===== DARK MODE TOGGLE =====
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
}

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
    if (backToTop) {
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Active nav link based on scroll
    updateActiveNav();
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

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

// Old Typing Animation and Hero Particles were removed in Phase 3

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

// Old menu filter logic was removed here in favor of Phase 3 filter.

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

// ===== ORDER FORM & POPUP MODAL =====
const orderModal = document.getElementById('order-modal');
const orderModalClose = document.getElementById('order-modal-close');
const orderForm = document.getElementById('order-form');
const packageSelect = document.getElementById('order-package');
const qtyInput = document.getElementById('order-qty');
const orderTotal = document.getElementById('order-total');
const totalDisplay = document.getElementById('total-display');

const packagePrices = { 1: 10000, 2: 15000, 3: 20000, 4: 25000 };

function openOrderModal(packageId = null) {
    if (packageId) {
        packageSelect.value = packageId;
    }
    updateTotal();
    if (orderModal) {
        orderModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeOrderModal() {
    if (orderModal) {
        orderModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

if (orderModalClose) {
    orderModalClose.addEventListener('click', closeOrderModal);
}

if (orderModal) {
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) closeOrderModal();
    });
}

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
        openOrderModal(pkgId);
    });
});

// Handle all open-order-btn clicks (Navbar, Promo, Menu Modal, etc)
document.querySelectorAll('.open-order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const menuModal = document.getElementById('menu-item-modal');
        if (menuModal && !menuModal.classList.contains('hidden')) {
            menuModal.classList.add('hidden');
        }
        openOrderModal();
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
            closeOrderModal();
        } else {
            showToast('error', result.message || 'Gagal membuat pesanan');
        }
    } catch (err) {
        // Fallback: jika server belum jalan, arahkan ke WhatsApp
        const waMessage = `Halo Catering 2W, saya mau pesan:\n\nNama: ${formData.customer_name}\nHP: ${formData.customer_phone}\nPaket: ${document.getElementById('order-package').selectedOptions[0]?.text || '-'}\nJumlah: ${formData.quantity}\nTanggal: ${formData.event_date || '-'}\nAlamat: ${formData.delivery_address || '-'}\nCatatan: ${formData.notes || '-'}`;
        
        showToast('info', 'Server belum aktif. Mengarahkan ke WhatsApp...');
        closeOrderModal();
        
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
    { text: '📝 Form Pemesanan', category: 'Pesan', action: 'order' },
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
    } else if (item.action === 'order') {
        openOrderModal();
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
if (searchBtn) {
    searchBtn.addEventListener('click', togglePalette);
}

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

// ===== GALLERY LIGHTBOX =====
const galleryLightbox = document.getElementById('gallery-lightbox');
const lightboxVisual = document.getElementById('lightbox-visual');
const lightboxCaption = document.getElementById('lightbox-caption');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const visual = item.querySelector('.gallery-visual');
        const emoji = item.querySelector('.gallery-emoji').textContent;
        const gradient = visual.style.getPropertyValue('--gradient');
        const caption = item.dataset.caption;

        lightboxVisual.style.background = gradient;
        lightboxVisual.innerHTML = `<span class="gallery-emoji">${emoji}</span>`;
        lightboxCaption.textContent = caption;

        galleryLightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
const lightboxClose = document.querySelector('.lightbox-close');
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

galleryLightbox.addEventListener('click', (e) => {
    if (e.target === galleryLightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !galleryLightbox.classList.contains('hidden')) {
        closeLightbox();
    }
});

function closeLightbox() {
    galleryLightbox.classList.add('hidden');
    document.body.style.overflow = '';
}

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(other => {
            other.classList.remove('active');
        });

        // Toggle current
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== RE-OBSERVE NEW REVEAL ELEMENTS =====
// New sections added dynamically need to be observed
document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
});

// ===== UPDATED SEARCH DATA (append new entries) =====
searchData.push(
    { text: '🖼️ Galeri Makanan', category: 'Galeri', action: 'scroll', target: '#gallery' },
    { text: '❓ FAQ — Tanya Jawab', category: 'Info', action: 'scroll', target: '#faq' },
    { text: '🗺️ Lokasi & Jam Buka', category: 'Info', action: 'scroll', target: '#lokasi' },
    { text: '🎉 Promo Diskon 10%', category: 'Promo', action: 'scroll', target: '#promo' },
    { text: '🏆 Kenapa Pilih Kami', category: 'Info', action: 'scroll', target: '#why-us' }
);

// ===== WHY-US CARD TILT EFFECT =====
document.querySelectorAll('.why-us-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 40;
        const rotateY = (centerX - x) / 40;

        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    // Calculate scroll percentage
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrolled + '%';
    }
});

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
    // Only activate if not on touch device (using CSS media query for display:none on mobile, 
    // but good to also check here to avoid unnecessary JS events)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Outline follows with slight delay using requestAnimationFrame for smoothness
        const animateCursor = () => {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;
            
            outlineX = outlineX + (distX * 0.15); // Adjust 0.15 for follow speed
            outlineY = outlineY + (distY * 0.15);
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
    }
}

// ===== MAGNETIC BUTTONS =====
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        
        // Adjust the divider (3) to change the magnetic strength
        btn.style.transform = `translate(${x / 3}px, ${y / 3}px)`;
    });
    
    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// ===== NEWSLETTER SUBMIT =====
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        if (input.value) {
            showToast('success', `Terima kasih! Email ${input.value} berhasil didaftarkan.`);
            input.value = '';
        }
    });
}

// ===== PHASE 3 ADVANCED JAVASCRIPT =====

// 1. Theme Toggle in Navbar
const navThemeToggle = document.getElementById('nav-theme-toggle');
if (navThemeToggle) {
    navThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Save preference (optional, but good practice)
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Check local storage on load
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// 2. Menu Filtering System
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from sibling buttons
        const container = btn.closest('.menu-filter-container, .filter-bar');
        if (container) {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        }
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        const targetGridId = btn.getAttribute('data-target');
        
        // If data-target is provided, filter that specific grid, otherwise filter all menu grids
        let cards;
        if (targetGridId) {
            cards = document.querySelectorAll(`#${targetGridId} .menu-card, #${targetGridId} .pricing-card`);
        } else {
            // Fallback for Angkringan
            const parentSection = btn.closest('section');
            cards = parentSection.querySelectorAll('.menu-card, .pricing-card');
        }
        
        cards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hidden-filter');
                // Small delay to allow display:block to render before opacity transition
                setTimeout(() => {
                    card.style.display = 'block';
                }, 300);
            } else {
                card.classList.add('hidden-filter');
                // Hide after transition
                setTimeout(() => {
                    if (card.classList.contains('hidden-filter')) {
                        card.style.display = 'none';
                    }
                }, 400); // matches CSS transition duration
            }
        });
    });
});

// 3. Advanced Text Reveal (Split Text)
const splitTextElements = document.querySelectorAll('.split-text');

splitTextElements.forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    
    // Split text into characters and wrap in spans
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.className = 'char';
        // Preserve spaces
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.innerText = char;
        }
        // Stagger the transition delay
        span.style.transitionDelay = `${i * 0.03}s`;
        el.appendChild(span);
    }
    
    // Add to intersection observer if not already there
    revealObserver.observe(el);
});

// ===== MENU ITEM MODAL =====
const menuItemModal = document.getElementById('menu-item-modal');
const menuModalClose = document.getElementById('menu-modal-close');
const menuModalVisual = document.getElementById('menu-modal-visual');
const menuModalTitle = document.getElementById('menu-modal-title');
const menuModalDesc = document.getElementById('menu-modal-desc');
const menuModalPrice = document.getElementById('menu-modal-price');

document.querySelectorAll('.clickable-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
        const name = tag.getAttribute('data-name');
        const desc = tag.getAttribute('data-desc');
        const price = tag.getAttribute('data-price');
        const emoji = tag.getAttribute('data-emoji');
        const gradient = tag.getAttribute('data-gradient');

        if (menuModalTitle) menuModalTitle.textContent = name;
        if (menuModalDesc) menuModalDesc.textContent = desc;
        if (menuModalPrice) menuModalPrice.textContent = price;
        
        if (menuModalVisual) {
            menuModalVisual.style.background = gradient;
            menuModalVisual.innerHTML = `<span class="gallery-emoji" style="font-size: 4rem;">${emoji}</span>`;
        }

        if (menuItemModal) {
            menuItemModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    });
});

if (menuModalClose) {
    menuModalClose.addEventListener('click', () => {
        menuItemModal.classList.add('hidden');
        document.body.style.overflow = '';
    });
}

if (menuItemModal) {
    menuItemModal.addEventListener('click', (e) => {
        if (e.target === menuItemModal) {
            menuItemModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}