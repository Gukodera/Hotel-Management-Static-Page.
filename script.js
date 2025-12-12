document.addEventListener('DOMContentLoaded', () => {
    // Navigation Active State
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.section-title, .card, .hero-content, .testimonial-card');

    // Add reveal class initially
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Check User Auth State
    checkAuthState();

    // Booking Form Logic
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        setupBookingForm();
    }

    // Login Form Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            // Check for admin login
            if (email.toLowerCase().includes('admin')) {
                localStorage.setItem('user', JSON.stringify({ email: email, name: 'Admin Staff', role: 'admin' }));
                alert('Admin Login successful!');
                window.location.href = 'dashboard.html';
                return;
            }

            // Simulate user login
            localStorage.setItem('user', JSON.stringify({ email: email, name: 'User' }));
            alert('Login successful!');
            window.location.href = 'index.html';
        });
    }

    // Register Form Logic
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            // Simulate register
            localStorage.setItem('user', JSON.stringify({ email: email, name: name }));
            alert('Registration successful! You are now logged in.');
            window.location.href = 'index.html';
        });
    }
});

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authArea = document.getElementById('user-auth-area');
    if (authArea) {
        if (user) {
            authArea.innerHTML = `
                <div class="user-menu">
                    <div class="user-avatar" onclick="toggleUserDropdown(event)">${user.name.charAt(0).toUpperCase()}</div>
                    <div class="user-dropdown" id="user-dropdown">
                        <div class="user-dropdown-header">
                            <div class="user-dropdown-avatar">${user.name.charAt(0).toUpperCase()}</div>
                            <div>
                                <div class="user-dropdown-name">${user.name}</div>
                                <div class="user-dropdown-email">${user.email || ''}</div>
                            </div>
                        </div>
                        <div class="user-dropdown-divider"></div>
                        <a href="profile.html" class="user-dropdown-item">
                            <i class="fas fa-user"></i> My Profile
                        </a>
                        <a href="#" onclick="logout(); return false;" class="user-dropdown-item">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            `;
        } else {
            authArea.innerHTML = `<a href="login.html" class="btn-secondary">Login</a>`;
        }
    }
}

function toggleUserDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown && !event.target.closest('.user-menu')) {
        dropdown.classList.remove('show');
    }
});

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.reload();
    }
}

function setupBookingForm() {
    const roomSelect = document.getElementById('room-type');
    const checkIn = document.getElementById('check-in');
    const checkOut = document.getElementById('check-out');
    const guestsInput = document.getElementById('guests');
    const summaryRoom = document.getElementById('summary-room');
    const summaryNights = document.getElementById('summary-nights');
    const summaryGuests = document.getElementById('summary-guests');
    const summaryTotal = document.getElementById('summary-total');

    // Pre-select room from URL param
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
        roomSelect.value = roomParam;
    }

    // Set min dates
    const today = new Date().toISOString().split('T')[0];
    checkIn.min = today;
    checkOut.min = today;

    function updateSummary() {
        const roomOption = roomSelect.options[roomSelect.selectedIndex];
        const price = roomOption.value ? parseInt(roomOption.getAttribute('data-price')) : 0;
        // Get text but remove the price part in parenthesis if present
        const roomName = roomOption.text.split('(')[0].trim();

        const d1 = new Date(checkIn.value);
        const d2 = new Date(checkOut.value);

        let nights = 0;
        if (checkIn.value && checkOut.value && d2 > d1) {
            const timeDiff = Math.abs(d2 - d1);
            nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        }

        const total = price * nights;

        summaryRoom.textContent = roomName || '-';
        summaryNights.textContent = nights > 0 ? nights + ' nights' : '0 nights';
        if (summaryGuests) summaryGuests.textContent = guestsInput.value;

        if (nights === 0 && price > 0) {
            summaryTotal.textContent = '₱' + price.toLocaleString();
        } else if (nights === 0 && price === 0) {
            summaryTotal.textContent = '₱0';
        } else {
            summaryTotal.textContent = '₱' + total.toLocaleString();
        }
    }

    roomSelect.addEventListener('change', updateSummary);
    checkIn.addEventListener('change', updateSummary);
    checkOut.addEventListener('change', updateSummary);
    if (guestsInput) guestsInput.addEventListener('input', updateSummary);

    // Initial update
    updateSummary();

    // Form Submission
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const paymentMethod = document.getElementById('selected-payment').value;
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        const roomOption = roomSelect.options[roomSelect.selectedIndex];
        const totalAmount = document.getElementById('summary-total').textContent;

        const bookingData = {
            refNumber: 'WR-' + Date.now().toString().slice(-8),
            fullname: document.getElementById('fullname').value,
            roomName: roomOption.text.split('(')[0],
            checkIn: checkIn.value,
            checkOut: checkOut.value,
            guests: guestsInput ? guestsInput.value : '2',
            totalAmount: totalAmount,
            paymentMethod: paymentMethod === 'gcash' ? 'GCash' : 'Maya',
            transactionId: 'TXN' + Math.floor(Math.random() * 1000000000)
        };

        localStorage.setItem('lastBooking', JSON.stringify(bookingData));
        window.location.href = 'confirmation.html';
    });
}

function selectPayment(method) {
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    const selected = document.querySelector(`.payment-method[onclick="selectPayment('${method}')"]`);
    if (selected) selected.classList.add('selected');
    document.getElementById('selected-payment').value = method;
}

// ===== Image Slider Functionality =====
let currentSlide = 0;
let slideInterval;

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!slides.length || !dotsContainer) return;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Start auto-slide
    startAutoSlide();
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    if (!slides.length) return;

    // Remove active class
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Update current slide
    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    // Add active class
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Reset auto-slide timer
    resetAutoSlide();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    if (!slides.length) return;

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    resetAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Initialize slider when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
} else {
    initSlider();
}

// ===== Leaflet Map Initialization =====
function initMap() {
    const mapElement = document.getElementById('resort-map');

    if (!mapElement) return;

    // Initialize map centered on Palawan, Philippines (approximate coordinates)
    const map = L.map('resort-map').setView([9.8349, 118.7384], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #c5a059; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #0f3c35; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); margin-top: 8px; text-align: center; color: white; font-size: 18px;"><i class="fas fa-hotel"></i></div></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });

    // Add marker for the resort
    const marker = L.marker([7.464653946521008, 125.81119597300903], { icon: customIcon }).addTo(map);

    marker.bindPopup(`
        <div style="text-align: center; font-family: 'Poppins', sans-serif;">
            <h3 style="color: #0f3c35; margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">GoldenRidge Resort</h3>
            <p style="margin: 0.5rem 0; color: #666;">Paradise Island, Tagum City</p>
            <p style="margin: 0.5rem 0; color: #c5a059; font-weight: 600;">Your Luxury Escape</p>
            <a href="booking.html" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; background: #0f3c35; color: white; text-decoration: none; border-radius: 5px; font-size: 0.9rem;">Book Now</a>
        </div>
    `).openPopup();

    // Add a circle to show the resort area
    L.circle([9.8349, 118.7384], {
        color: '#c5a059',
        fillColor: '#c5a059',
        fillOpacity: 0.2,
        radius: 500
    }).addTo(map);
}

// Initialize map when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}