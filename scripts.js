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
// LIGHTBOX (Legacy - kept for backward compatibility)
// ================================================

function openLightbox(imageSrc, caption) {
    // Legacy function - now handled by PhotoSwipe
    console.log('Legacy openLightbox called - PhotoSwipe handles this now');
}

function closeLightbox() {
    // Legacy function - now handled by PhotoSwipe
}

function initLightbox() {
    // Legacy function - PhotoSwipe initializes itself
}


// ================================================
// DYNAMIC GALLERY LOADER
// ================================================

const GALLERY_CONFIG = {
    manifestPath: 'assets/gallery.json',
    assetsPath: 'assets/',
    maxProbeImages: 30,
    consecutiveFailsToStop: 5,
    cacheKey: 'gallery_images_cache',
    cacheDuration: 24 * 60 * 60 * 1000 // 24 hours in ms
};

/**
 * Load gallery data from manifest or via probing
 */
async function loadGalleryData() {
    // Try manifest first
    try {
        const response = await fetch(GALLERY_CONFIG.manifestPath);
        if (response.ok) {
            const data = await response.json();
            console.log('📸 Gallery loaded from manifest:', data.length, 'images');
            return data;
        }
    } catch (e) {
        console.log('No manifest found, falling back to probing...');
    }
    
    // Check cache
    const cached = getCachedGallery();
    if (cached) {
        console.log('📸 Gallery loaded from cache:', cached.length, 'images');
        return cached;
    }
    
    // Probe for images
    const images = await probeGalleryImages();
    cacheGallery(images);
    return images;
}

/**
 * Get cached gallery data if not expired
 */
function getCachedGallery() {
    try {
        const cached = localStorage.getItem(GALLERY_CONFIG.cacheKey);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > GALLERY_CONFIG.cacheDuration;
        
        return isExpired ? null : data;
    } catch (e) {
        return null;
    }
}

/**
 * Cache gallery data with timestamp
 */
function cacheGallery(data) {
    try {
        localStorage.setItem(GALLERY_CONFIG.cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Could not cache gallery data');
    }
}

/**
 * Probe for gallery images sequentially
 */
async function probeGalleryImages() {
    const images = [];
    let consecutiveFails = 0;
    
    for (let i = 1; i <= GALLERY_CONFIG.maxProbeImages; i++) {
        // Try common extensions
        const extensions = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp'];
        let found = false;
        
        for (const ext of extensions) {
            const filename = `gallery-${i}.${ext}`;
            const exists = await checkImageExists(GALLERY_CONFIG.assetsPath + filename);
            
            if (exists) {
                images.push({ file: filename, caption: `Bild ${i}` });
                consecutiveFails = 0;
                found = true;
                break;
            }
        }
        
        if (!found) {
            consecutiveFails++;
            if (consecutiveFails >= GALLERY_CONFIG.consecutiveFailsToStop) {
                console.log(`Stopping probe after ${consecutiveFails} consecutive fails at image ${i}`);
                break;
            }
        }
    }
    
    console.log('📸 Gallery probed:', images.length, 'images found');
    return images;
}

/**
 * Check if an image URL exists (HEAD request)
 */
function checkImageExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

/**
 * Render gallery items to the grid
 */
function renderGallery(images) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    
    // Remove loading state
    const loading = document.getElementById('gallery-loading');
    if (loading) loading.remove();
    
    if (images.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-metal-light/60">Keine Bilder gefunden.</p>
            </div>
        `;
        return;
    }
    
    // Build gallery HTML
    const html = images.map((img, index) => {
        const src = GALLERY_CONFIG.assetsPath + img.file;
        const caption = img.caption || `Bild ${index + 1}`;
        
        return `
            <a href="${src}" 
               class="gallery-item" 
               data-pswp-width="1200" 
               data-pswp-height="800"
               data-caption="${escapeHtml(caption)}"
               aria-label="Bild vergrößern: ${escapeHtml(caption)}">
                <img src="${src}" 
                     alt="${escapeHtml(caption)}" 
                     class="gallery-img" 
                     loading="lazy">
                <div class="gallery-overlay">
                    <span class="text-white text-lg">🔍 Vergrößern</span>
                </div>
            </a>
        `;
    }).join('');
    
    grid.innerHTML = html;
    
    // Get actual image dimensions for PhotoSwipe
    updateImageDimensions();
    
    // Initialize PhotoSwipe
    if (typeof window.initPhotoSwipe === 'function') {
        window.initPhotoSwipe();
    }
}

/**
 * Update data-pswp-width/height with actual image dimensions
 */
function updateImageDimensions() {
    const links = document.querySelectorAll('#gallery-grid a');
    
    links.forEach(link => {
        const img = link.querySelector('img');
        if (img) {
            // Use naturalWidth/Height once loaded
            if (img.complete && img.naturalWidth) {
                link.dataset.pswpWidth = img.naturalWidth;
                link.dataset.pswpHeight = img.naturalHeight;
            } else {
                img.addEventListener('load', () => {
                    link.dataset.pswpWidth = img.naturalWidth;
                    link.dataset.pswpHeight = img.naturalHeight;
                });
            }
        }
    });
}

/**
 * Escape HTML for safe attribute insertion
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Initialize dynamic gallery
 */
async function initDynamicGallery() {
    try {
        const images = await loadGalleryData();
        renderGallery(images);
    } catch (error) {
        console.error('Failed to load gallery:', error);
        const grid = document.getElementById('gallery-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-metal-red">Fehler beim Laden der Galerie.</p>
                </div>
            `;
        }
    }
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
    initDynamicGallery(); // Load dynamic gallery with PhotoSwipe
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
 * Detect if user is on Chrome on iOS (CriOS)
 */
function isChromeIOS() {
  return /CriOS/i.test(navigator.userAgent);
}

/**
 * Generate UTC timestamp for ICS (YYYYMMDDTHHMMSSZ)
 */
function makeTimestampUTC(date = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return date.getUTCFullYear()
    + pad(date.getUTCMonth() + 1)
    + pad(date.getUTCDate())
    + 'T'
    + pad(date.getUTCHours())
    + pad(date.getUTCMinutes())
    + pad(date.getUTCSeconds())
    + 'Z';
}

/**
 * Generate unique ID for ICS event
 */
function makeUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID() + '@savethedate.example';
  }
  // Fallback
  return 'uid-' + Date.now() + '-' + Math.floor(Math.random() * 1e6) + '@savethedate.example';
}

/**
 * Handle iOS Safari calendar import via data:text/calendar URI scheme
 * Uses encodeURIComponent to avoid special character issues
 * @param {string} summary - Event title (SUMMARY)
 * @param {string} description - Event description (DESCRIPTION)
 * @param {string} location - Event location (LOCATION)
 * @param {string} dtstart - Start date/time (DTSTART) in YYYYMMDDTHHMMSSZ or YYYYMMDD format
 * @param {string} dtend - End date/time (DTEND) in YYYYMMDDTHHMMSSZ or YYYYMMDD format
 */
function handleIOSCalendar(summary, description, location, dtstart, dtend) {
  const dtstamp = makeTimestampUTC();
  const uid = makeUID();
  
  // Determine if all-day event (no 'T' in dtstart means DATE only)
  const isAllDay = !dtstart.includes('T');
  
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Save The Date//Kathrin & Tobi//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    isAllDay ? `DTSTART;VALUE=DATE:${dtstart}` : `DTSTART:${dtstart}`,
    isAllDay ? `DTEND;VALUE=DATE:${dtend}` : `DTEND:${dtend}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  // CRLF per RFC 5545
  const icsContent = icsLines.join('\r\n');
  
  // Create data URI with proper encoding for Safari iOS
  const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
  
  // Open the data URI - Safari iOS should offer to add to Calendar
  window.location.href = dataUri;
  
  console.log('📅 iOS Safari: data URI triggered');
}

/**
 * Handle Chrome on iOS via webcal:// protocol
 * Redirects to hosted .ics file
 */
function handleChromeIOSCalendar() {
  // webcal:// URL to hosted ICS file on GitHub Pages
  const webcalUrl = 'webcal://trom662.github.io/save-the-date/assets/hochzeit-kathrin-tobi.ics';
  
  window.location.href = webcalUrl;
  
  console.log('📅 Chrome iOS: webcal:// redirect triggered');
}

/**
 * Generate and download ICS file for the wedding date
 * Chrome iOS: Uses webcal:// protocol redirect
 * Safari iOS: Uses data:text/calendar URI scheme via handleIOSCalendar
 * Desktop: Downloads ICS file normally
 */
function downloadICS() {
  // Event data (Platzhalter für spätere Anpassung)
  const eventTitle = 'Hochzeit von Kathrin & Tobi';       // SUMMARY
  const eventDescription = 'Save the Date!';              // DESCRIPTION
  const eventLocation = 'to be announced';                // LOCATION
  const eventDate = '20260919';                           // DTSTART (ganztägig)
  const eventEndDate = '20260920';                        // DTEND (ganztägig)

  // Chrome on iOS: Use webcal:// protocol
  if (isIOS() && isChromeIOS()) {
    handleChromeIOSCalendar();
    return;
  }

  // Safari on iOS: Use data:text/calendar URI scheme
  if (isIOS()) {
    handleIOSCalendar(
      eventTitle,
      eventDescription,
      eventLocation,
      eventDate,
      eventEndDate
    );
    return;
  }

  // Desktop: Normal ICS Download
  const dtstamp = makeTimestampUTC();
  const uid = makeUID();

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Save The Date//Kathrin & Tobi//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${eventDate}`,
    `DTEND;VALUE=DATE:${eventEndDate}`,
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${eventDescription}`,
    `LOCATION:${eventLocation}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  // CRLF per RFC
  const icsContent = icsLines.join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'Hochzeit-Kathrin-Tobi-2026.ics';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Revoke after delay
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  console.log('📅 ICS file download triggered (desktop).');
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
