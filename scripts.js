/**
 * Save The Date - JavaScript
 * Countdown, Navigation, Lightbox & Smooth Interactions
 */

// ================================================
// GLOBAL CONSTANTS
// ================================================
const MUSIC_STORAGE_KEY = 'savethedate_music_enabled';

// ================================================
// COUNTDOWN TIMER
// ================================================

/**
 * Initialize countdown to wedding date
 * @param {string} targetDate - ISO date string for the wedding
 */
function initCountdown(targetDate) {
    const countdownDate = new Date(targetDate).getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        console.warn('Countdown elements not found');
        return;
    }
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        if (distance < 0) {
            // Wedding day has arrived!
            daysEl.textContent = '🎉';
            hoursEl.textContent = '🤘';
            minutesEl.textContent = '💍';
            secondsEl.textContent = '🎸';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(3, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}


// ================================================
// MOBILE NAVIGATION
// ================================================

function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuBtn || !mobileMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        
        // Update icon
        const icon = menuBtn.querySelector('svg path');
        if (icon) {
            if (isExpanded) {
                // Show hamburger
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            } else {
                // Show X
                icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
        }
    });
    
    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
            const icon = menuBtn.querySelector('svg path');
            if (icon) {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });
    });
}


// ================================================
// SMOOTH SCROLL
// ================================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, '', href);
            }
        });
    });
}


// ================================================
// LIGHTBOX
// ================================================

function openLightbox(imageSrc, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (!lightbox || !lightboxImg || !lightboxCaption) {
        console.warn('Lightbox elements not found');
        return;
    }
    
    lightboxImg.src = imageSrc;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    lightbox.focus();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}


// ================================================
// NAVBAR SCROLL EFFECT
// ================================================

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
        
        lastScroll = currentScroll;
    });
}


// ================================================
// ACTIVE SECTION HIGHLIGHTING
// ================================================

function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function highlightActive() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-metal-red');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-metal-red');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActive);
    highlightActive(); // Initial check
}


// ================================================
// INITIALIZE EVERYTHING
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Wedding date: September 19, 2026 at 15:00
    initCountdown('2026-09-19T15:00:00');
    
    initMobileNav();
    initSmoothScroll();
    initLightbox();
    initNavbarScroll();
    initActiveSection();
    initLoginSystem();
    initBackgroundMusic();
    
    // Check if user already entered (skip overlay)
    if (sessionStorage.getItem('site_entered') === 'true') {
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) overlay.style.display = 'none';
    }
    
    console.log('🤘 Save The Date loaded successfully!');
});


// ================================================
// WELCOME OVERLAY & MUSIC START
// ================================================

function enterSite() {
    const overlay = document.getElementById('welcome-overlay');
    const audio = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');
    
    // Hide overlay with fade
    if (overlay) {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }
    
    // Start music immediately
    if (audio) {
        audio.play().then(() => {
            localStorage.setItem(MUSIC_STORAGE_KEY, 'true');
            if (musicIcon) musicIcon.textContent = '🔊';
            console.log('🎵 Music started!');
        }).catch(err => {
            console.log('Audio play failed:', err);
        });
    }
    
    // Remember that user entered
    sessionStorage.setItem('site_entered', 'true');
}

// Make enterSite globally available
window.enterSite = enterSite;


// ================================================
// ADD TO CALENDAR (ICS Download)
// ================================================

/**
 * Detect if user is on iOS device
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Generate and download ICS file for the wedding date
 * Handles iOS differently to open directly in Calendar app
 */
function downloadICS() {
    const eventTitle = 'Hochzeit von Kathrin & Tobi';
    const eventDate = '20260919'; // YYYYMMDD format
    const eventLocation = 'to be announced';
    const eventDescription = 'Save the Date!';
    
    // ICS file content (all-day event)
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Save The Date//Kathrin & Tobi//DE',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${eventDate}`,
        `DTEND;VALUE=DATE:${eventDate}`,
        `SUMMARY:${eventTitle}`,
        `DESCRIPTION:${eventDescription}`,
        `LOCATION:${eventLocation}`,
        `UID:hochzeit-kathrin-tobi-2026@savethedate`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    if (isIOS()) {
        // iOS: Create a Blob with proper filename and use webcal-style approach
        // Using a base64 data URL with proper MIME type for iOS Calendar
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link that iOS Safari can handle
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Hochzeit-Kathrin-Tobi.ics');
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // For iOS, we need to use window.open instead of click
        // This triggers the native calendar import dialog
        window.open(url, '_blank');
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 1000);
        
        console.log('📅 ICS opened for iOS Calendar!');
    } else {
        // Desktop: Normal download with attachment
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Hochzeit-Kathrin-Tobi-2026.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('📅 ICS file downloaded!');
    }
}

// Make downloadICS globally available
window.downloadICS = downloadICS;


// Make lightbox functions globally available
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;


// ================================================
// ADMIN LOGIN SYSTEM
// Two-stage visibility: 
// - Stage 1 (Guest): Only Hero + Countdown (days only) + Coming Soon
// - Stage 2 (Admin): Full content visible
// ================================================

const ADMIN_CREDENTIALS = {
    username: 'bromag',
    password: 'admin'
};

const STORAGE_KEY = 'savethedate_admin_logged_in';

/**
 * Check if user is logged in (from localStorage)
 */
function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
}

/**
 * Update page visibility based on login state
 */
function updateVisibility() {
    if (isLoggedIn()) {
        document.body.classList.add('is-admin');
        updateLoginModal(true);
    } else {
        document.body.classList.remove('is-admin');
        updateLoginModal(false);
    }
}

/**
 * Update login modal content based on login state
 */
function updateLoginModal(loggedIn) {
    const loginForm = document.getElementById('login-form');
    const loggedInMessage = document.getElementById('logged-in-message');
    const loginError = document.getElementById('login-error');
    
    if (!loginForm || !loggedInMessage) return;
    
    if (loggedIn) {
        loginForm.classList.add('hidden');
        loggedInMessage.classList.remove('hidden');
    } else {
        loginForm.classList.remove('hidden');
        loggedInMessage.classList.add('hidden');
        if (loginError) loginError.classList.add('hidden');
    }
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const userInput = document.getElementById('login-user');
    const passInput = document.getElementById('login-pass');
    const loginError = document.getElementById('login-error');
    
    if (!userInput || !passInput) return;
    
    const username = userInput.value.trim();
    const password = passInput.value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Success!
        localStorage.setItem(STORAGE_KEY, 'true');
        updateVisibility();
        
        // Clear form
        userInput.value = '';
        passInput.value = '';
        
        // Close modal after short delay to show success
        setTimeout(() => {
            closeLoginModal();
        }, 500);
        
        console.log('🔓 Admin logged in');
    } else {
        // Error
        if (loginError) {
            loginError.classList.remove('hidden');
            loginError.classList.add('login-error');
        }
        
        // Shake the form
        const modalContent = document.querySelector('.login-modal-content');
        if (modalContent) {
            modalContent.style.animation = 'none';
            setTimeout(() => {
                modalContent.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
        }
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    updateVisibility();
    console.log('🔒 Admin logged out');
}

/**
 * Open login modal
 */
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input');
        if (firstInput && !isLoggedIn()) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

/**
 * Close login modal
 */
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize login system
 */
function initLoginSystem() {
    // Check login state on page load
    updateVisibility();
    
    // Setup admin login button
    const adminBtn = document.getElementById('admin-login-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', openLoginModal);
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('login-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeLoginModal();
            }
        }
    });
    
    console.log(isLoggedIn() ? '🔓 Admin session active' : '🔒 Guest mode');
}

// Make login functions globally available
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;


// ================================================
// BACKGROUND MUSIC
// ================================================

/**
 * Initialize background music with user interaction requirement
 * Also pauses when tab is not visible
 */
function initBackgroundMusic() {
    const audio = document.getElementById('bg-music');
    const toggleBtn = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    
    if (!audio || !toggleBtn || !musicIcon) return;
    
    let isPlaying = false;
    let wasPlayingBeforeHidden = false; // Track if music was playing before tab switch
    
    // Check if user previously enabled music
    const musicWasEnabled = localStorage.getItem(MUSIC_STORAGE_KEY) === 'true';
    
    // Pre-load audio for faster playback
    audio.load();
    
    function updateIcon() {
        musicIcon.textContent = isPlaying ? '🔊' : '🔇';
        toggleBtn.setAttribute('aria-label', isPlaying ? 'Musik ausschalten' : 'Musik einschalten');
    }
    
    function playMusic() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                localStorage.setItem(MUSIC_STORAGE_KEY, 'true');
                updateIcon();
            }).catch(err => {
                console.log('Audio playback failed:', err);
            });
        }
    }
    
    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            localStorage.setItem(MUSIC_STORAGE_KEY, 'false');
            updateIcon();
        } else {
            playMusic();
        }
    }
    
    // Pause music when tab becomes hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Tab is now hidden - pause if playing
            if (isPlaying) {
                wasPlayingBeforeHidden = true;
                audio.pause();
                console.log('🎵 Music paused (tab hidden)');
            }
        } else {
            // Tab is now visible - resume if was playing before
            if (wasPlayingBeforeHidden) {
                wasPlayingBeforeHidden = false;
                playMusic();
                console.log('🎵 Music resumed (tab visible)');
            }
        }
    });
    
    // Toggle button click
    toggleBtn.addEventListener('click', toggleMusic);
    
    // Try to autoplay if user previously enabled music - on ANY interaction
    if (musicWasEnabled) {
        const tryAutoplay = () => {
            playMusic();
            document.removeEventListener('click', tryAutoplay);
            document.removeEventListener('touchstart', tryAutoplay);
            document.removeEventListener('keydown', tryAutoplay);
            document.removeEventListener('scroll', tryAutoplay);
        };
        
        // Listen for any user interaction
        document.addEventListener('click', tryAutoplay, { once: true });
        document.addEventListener('touchstart', tryAutoplay, { once: true });
        document.addEventListener('keydown', tryAutoplay, { once: true });
        document.addEventListener('scroll', tryAutoplay, { once: true });
        
        // Also try immediately in case page already has focus
        setTimeout(() => {
            audio.play().then(() => {
                isPlaying = true;
                updateIcon();
                // Remove listeners if autoplay worked
                document.removeEventListener('click', tryAutoplay);
                document.removeEventListener('touchstart', tryAutoplay);
                document.removeEventListener('keydown', tryAutoplay);
                document.removeEventListener('scroll', tryAutoplay);
            }).catch(() => {
                // Autoplay blocked, waiting for interaction
            });
        }, 100);
    }
    
    updateIcon();
    console.log('🎵 Background music initialized');
}
