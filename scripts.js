/**
 * Save The Date - JavaScript
 * Countdown, Navigation, Lightbox & Smooth Interactions
 */

// ================================================
// GLOBAL CONSTANTS
// ================================================
const MUSIC_STORAGE_KEY = 'savethedate_music_enabled';

// Global variable for login sound
let currentLoginSound = null;

// Google Apps Script Deployment URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwY8nuOUIhwjR8nIbsxIJvoQKGRUppGLKQ_AH5pkIYaEtO8m1dtdVh1Nw1o3KXrSwoqLg/exec';

// Gästeliste für Autocomplete
const guestList = [
    'Barbara', 'Edmund', 'Tina', 'Lukas', 'Jessi', 'Mayla', 'Nami', 'Birgit Karl', 'Harald Karl',
    'Sabrina Gora', 'Robert Gora', 'Emily Gora', 'Leonie Gora', 'Collin Gora', 'Anna', 'Luis',
    'Ellen', 'Matthias', 'Roxy', 'Fabi Prietzel', 'Chris Scherf', 'Regina Scherf',
    'Christoph Schuessler', 'Camilla Pazzini', 'Christian Boelling', 'Kathrin Schneider',
    'Martin Reszt', 'Lara Reszt', 'Andre', 'Olga', 'Georg', 'Nicole', 'Philipp Roll',
    'Robert Maier', 'Kai Häffner', 'Patrick Tschürtz', 'Thorsten Sommer', 'Jakob Huebler',
    'Luisa', 'Jascha', 'Sidney', 'Jonas', 'Johanna', 'Matze', 'Frieda', 'Dani', 'Hannes',
    'Nele', 'Verena', 'Rosalie', 'Elena', 'Alex', 'Alisa', 'Lena', 'Michi', 'Julia', 'Max',
    'Aline', 'Jan', 'Paul', 'Basti', 'Milena', 'Emilia', 'Gabi', 'Reinhold', 'Angela',
    'Stefan', 'Frank', 'Levi', 'Walter', 'Andrea', 'Julian', 'Annelise', 'Reinhard',
    'Michaela', 'Michael', 'Magdalena', 'Harald', 'Elvira', 'Kelvin', 'Christian Rößner',
    'Nadine Rößner', 'Markus Rößner', 'Kerstin Rößner', 'Patsi', 'Nils', 'Annika',
    'Christine', 'Dominik', 'Bine', 'Tine', 'Tanja', 'Kevin', 'Kim', 'Clayton', 'Coco',
    'Rafael', 'Pohli', 'Tom', 'Richy'
];

// Guard gegen mehrfaches Survey-Initialisieren
let surveyInitialized = false;

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
    assetsPath: './assets/',
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
 * Gallery Carousel Controller
 */
const galleryCarousel = {
    images: [],
    currentIndex: 0,
    touchInitialized: false,
    
    init(images) {
        this.images = images;
        this.currentIndex = 0;
        this.render();
        this.updatePositions();
        this.setupKeyboardNav();
        this.attachTouchEvents();
    },
    
    render() {
        const container = document.getElementById('gallery-slides');
        if (!container) return;
        
        const html = this.images.map((img, index) => {
            const src = GALLERY_CONFIG.assetsPath + img.file + '?t=' + Date.now();
            const caption = img.caption || `Bild ${index + 1}`;
            
            return `
                <a href="${src}" 
                   class="gallery-slide"
                   data-index="${index}"
                   data-pswp-width="1200" 
                   data-pswp-height="800"
                   data-caption="${escapeHtml(caption)}"
                   aria-label="Bild vergrößern: ${escapeHtml(caption)}"
                   onclick="galleryCarousel.handleClick(event, ${index})">
                    <img src="${src}" 
                         alt="${escapeHtml(caption)}" 
                         loading="lazy">
                </a>
            `;
        }).join('');
        
        container.innerHTML = html;
        
        // Get actual dimensions for PhotoSwipe
        this.updateImageDimensions();
    },
    
    updateImageDimensions() {
        const slides = document.querySelectorAll('.gallery-slide');
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                if (img.complete && img.naturalWidth) {
                    slide.dataset.pswpWidth = img.naturalWidth;
                    slide.dataset.pswpHeight = img.naturalHeight;
                } else {
                    img.addEventListener('load', () => {
                        slide.dataset.pswpWidth = img.naturalWidth;
                        slide.dataset.pswpHeight = img.naturalHeight;
                    });
                }
            }
        });
    },
    
    updatePositions() {
        const slides = document.querySelectorAll('.gallery-slide');
        const total = this.images.length;
        
        slides.forEach((slide, index) => {
            // Calculate position relative to current
            let position = index - this.currentIndex;
            
            // Handle wrapping for infinite carousel feel
            if (position > total / 2) position -= total;
            if (position < -total / 2) position += total;
            
            // Clamp to visible range (-2 to 2)
            if (position < -2 || position > 2) {
                slide.classList.add('hidden-slide');
                slide.dataset.position = position > 0 ? '3' : '-3';
            } else {
                slide.classList.remove('hidden-slide');
                slide.dataset.position = position.toString();
            }
        });
        
        // Update caption and counter
        this.updateCaption();
    },
    
    updateCaption() {
        const captionEl = document.getElementById('gallery-caption-text');
        const counterEl = document.getElementById('gallery-counter');
        
        if (captionEl && this.images[this.currentIndex]) {
            captionEl.textContent = this.images[this.currentIndex].caption || `Bild ${this.currentIndex + 1}`;
        }
        
        if (counterEl) {
            counterEl.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updatePositions();
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updatePositions();
    },
    
    goTo(index) {
        this.currentIndex = index;
        this.updatePositions();
    },
    
    handleClick(event, index) {
        event.preventDefault();
        
        // If clicking on center slide, open PhotoSwipe
        if (index === this.currentIndex) {
            this.openLightbox();
            return;
        }
        
        // Otherwise navigate to that slide
        this.goTo(index);
    },
    
    openLightbox() {
        const lightbox = window.photoSwipeLightbox;
        if (!lightbox) {
            console.error('PhotoSwipe lightbox not initialized');
            return;
        }
        
        // Use loadAndOpen with the current index
        lightbox.loadAndOpen(this.currentIndex);
    },
    
    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Only if gallery is in viewport and lightbox not open
            const gallery = document.getElementById('gallery');
            if (!gallery) return;
            
            // Don't interfere with PhotoSwipe navigation
            if (window.photoSwipeLightbox?.pswp) return;
            
            const rect = gallery.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                }
            }
        });
    },

    attachTouchEvents() {
        if (this.touchInitialized) return;
        const slidesWrapper = document.getElementById('gallery-slides');
        if (!slidesWrapper) return;

        const swipeThreshold = 45;
        const horizontalActivation = 12;
        const verticalTolerance = 16;
        let startX = 0;
        let startY = 0;
        let isTracking = false;
        let isSwiping = false;

        const cancelTracking = () => {
            isTracking = false;
            isSwiping = false;
        };

        const onTouchStart = (event) => {
            if (event.touches.length !== 1) return;
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isTracking = true;
            isSwiping = false;
        };

        const onTouchMove = (event) => {
            if (!isTracking) return;
            if (event.touches.length !== 1) return;

            const touch = event.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            const horizontalDistance = Math.abs(deltaX);
            const verticalDistance = Math.abs(deltaY);

            if (!isSwiping) {
                if (verticalDistance > horizontalDistance && verticalDistance > verticalTolerance) {
                    cancelTracking();
                    return;
                }
                if (horizontalDistance > horizontalActivation) {
                    isSwiping = true;
                }
            }

            if (isSwiping && horizontalDistance > 5) {
                event.preventDefault();
            }
        };

        const onTouchEnd = (event) => {
            if (!isTracking) return;

            const touch = event.changedTouches?.[0];
            if (!touch) return;

            const diffX = touch.clientX - startX;
            if (!isSwiping || Math.abs(diffX) < swipeThreshold) {
                cancelTracking();
                return;
            }

            if (diffX > 0) {
                this.prev();
            } else {
                this.next();
            }

            cancelTracking();
        };

        slidesWrapper.addEventListener('touchstart', onTouchStart, { passive: true });
        slidesWrapper.addEventListener('touchmove', onTouchMove, { passive: false });
        slidesWrapper.addEventListener('touchend', onTouchEnd, { passive: true });
        slidesWrapper.addEventListener('touchcancel', cancelTracking, { passive: true });

        this.touchInitialized = true;
    }
};

// Make globally available
window.galleryCarousel = galleryCarousel;

/**
 * Render gallery carousel
 */
function renderGallery(images) {
    const wrapper = document.getElementById('gallery-carousel-wrapper');
    if (!wrapper) return;
    
    // Remove loading state
    const loading = document.getElementById('gallery-loading');
    if (loading) loading.remove();
    
    if (images.length === 0) {
        wrapper.innerHTML = `
            <div class="text-center py-12">
                <p class="text-metal-light/60">Keine Bilder gefunden.</p>
            </div>
        `;
        return;
    }
    
    // Show carousel elements
    const carousel = wrapper.querySelector('.gallery-carousel');
    const captionContainer = wrapper.querySelector('.gallery-caption-container');
    const hint = wrapper.querySelector('.gallery-click-hint');
    
    if (carousel) carousel.style.display = 'flex';
    if (captionContainer) captionContainer.style.display = 'flex';
    if (hint) hint.style.display = 'block';
    
    // Initialize carousel
    galleryCarousel.init(images);
    
    // Initialize PhotoSwipe for center image clicks
    if (typeof window.initPhotoSwipe === 'function') {
        setTimeout(() => {
            window.initPhotoSwipe();
        }, 100);
    }
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
    // Preload a few important assets (images + audio) to improve first paint and playback
    try { preloadImportantAssets(); } catch (e) { /* fail silently */ }
    
    // Check if user already entered (skip overlay)
    if (sessionStorage.getItem('site_entered') === 'true') {
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) overlay.style.display = 'none';
    }
    
    console.log('🤘 Save The Date loaded successfully!');
});


/**
 * Preload important images and audio via JS as a fallback to <link rel="preload">.
 * This helps on browsers that may ignore link-based preloads or when cache-busting is used.
 */
function preloadImportantAssets() {
    const imageList = [
        'assets/design-hero.jpg',
        'assets/banner-logo2.png',
        'assets/maxi2.png',
        'assets/laika1.png',
        'assets/gallery-1.jpg'
    ];

    imageList.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Pre-create audio elements and call load()
    const audioList = [
        'assets/IWasAlive.mp3',
        'assets/tth_05-23_06-03.mp3'
    ];

    audioList.forEach(src => {
        try {
            const a = document.createElement('audio');
            a.preload = 'auto';
            a.src = src;
            // call load to hint the browser
            a.load();
        } catch (e) {
            // ignore
        }
    });
}


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
    
    // Switch to main music and start
    if (audio) {
        audio.src = 'assets/IWasAlive.mp3';
        audio.loop = false; // Disable loop for main music
        audio.play().then(() => {
            localStorage.setItem(MUSIC_STORAGE_KEY, 'true');
            if (musicIcon) musicIcon.textContent = '🔊';
            console.log('🎵 Main music started!');
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
        
        // Play sound on wrong password
        currentLoginSound = new Audio('assets/tth_05-23_06-03.mp3');
        currentLoginSound.play();
        
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
    
    // Stop login sound if playing
    if (currentLoginSound) {
        currentLoginSound.pause();
        currentLoginSound.currentTime = 0;
        currentLoginSound = null;
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
    
    // Survey SOFORT initialisieren wenn Admin eingeloggt (nicht verzögert)
    if (isLoggedIn()) {
        initSurveyForm();
    }
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
    let loopTimeout = null; // For managing the pause between loops
    
    // Set volume to 40% (reduced by 60%)
    audio.volume = 0.4;
    
    // Manual loop with 15 second pause
    audio.addEventListener('ended', () => {
        if (!audio.paused) {
            console.log('🎵 Song ended, waiting 15s before replay...');
            loopTimeout = setTimeout(() => {
                if (!audio.paused) {
                    audio.currentTime = 0;
                    audio.play().catch(err => console.log('Replay failed:', err));
                }
            }, 15000); // 15 seconds pause
        }
    });
    
    // Check if user previously enabled music
    const musicWasEnabled = localStorage.getItem(MUSIC_STORAGE_KEY) === 'true';
    
    // Pre-load audio for faster playback
    audio.load();
    
    function updateIcon() {
        musicIcon.textContent = audio.paused ? '🔇' : '🔊';
        toggleBtn.setAttribute('aria-label', audio.paused ? 'Musik einschalten' : 'Musik ausschalten');
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
        if (audio.paused) {
            audio.play().then(() => {
                localStorage.setItem(MUSIC_STORAGE_KEY, 'true');
                updateIcon();
            }).catch(err => {
                console.log('Audio playback failed:', err);
            });
        } else {
            audio.pause();
            localStorage.setItem(MUSIC_STORAGE_KEY, 'false');
            updateIcon();
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
    
    // Toggle playback on button click
    toggleBtn.addEventListener('click', () => {
        toggleMusic();
    });
    
    updateIcon();
    console.log('🎵 Background music initialized');
}


// ================================================
// SURVEY FUNCTIONS
// ================================================

/**
 * Initialize survey form (nur für eingeloggte Admins)
 */
function initSurveyForm() {
    if (surveyInitialized) {
        console.log('⚠️ Survey bereits initialisiert, überspringe...');
        return;
    }
    
    console.log('🎤 Initialisiere Umfrage-Formular...');
    
    const surveyForm = document.getElementById('survey-form');
    const nameInput = document.getElementById('name');
    
    if (!surveyForm || !nameInput) {
        console.warn('⚠️ Umfrage-Formular nicht gefunden');
        return;
    }
    
    // Autocomplete Setup
    setupAutocomplete(nameInput, 'name-suggestions', guestList);
    
    // Form Submit Handler wird via inline onsubmit in HTML aufgerufen
    // (kein addEventListener hier, um doppelte Submissions zu vermeiden)
    
    surveyInitialized = true;
    console.log('✓ Umfrage bereit!');
}

/**
 * Autocomplete Setup
 */
function setupAutocomplete(inputElement, suggestionsListId, dataList) {
    const suggestionsList = document.getElementById(suggestionsListId);
    
    if (!suggestionsList) {
        console.error('❌ Suggestions-Liste nicht gefunden:', suggestionsListId);
        return;
    }
    
    console.log('📝 Autocomplete aktiviert für:', inputElement.id);
    
    inputElement.addEventListener('input', function() {
        const value = this.value.toLowerCase().trim();
        
        if (value.length === 0) {
            suggestionsList.classList.add('hidden');
            return;
        }
        
        const filtered = dataList.filter(item => 
            item.toLowerCase().startsWith(value)
        );
        
        if (filtered.length === 0) {
            suggestionsList.classList.add('hidden');
            return;
        }
        
        // Render suggestions
        suggestionsList.innerHTML = filtered.map(item => 
            `<li onclick="selectSuggestion(this, '${inputElement.id}')">${item}</li>`
        ).join('');
        
        suggestionsList.classList.remove('hidden');
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== inputElement && !e.target.closest('.survey-suggestions')) {
            suggestionsList.classList.add('hidden');
        }
    });
}

/**
 * Select Suggestion from Autocomplete
 */
function selectSuggestion(element, inputId) {
    const inputField = document.getElementById(inputId);
    const suggestionsList = document.getElementById(inputId + '-suggestions');
    
    if (inputField) {
        inputField.value = element.textContent;
        inputField.focus();
    }
    if (suggestionsList) {
        suggestionsList.classList.add('hidden');
    }
}

/**
 * Handle Survey Submission
 */
async function handleSurveySubmit(e) {
    if (e) e.preventDefault();
    if (e) e.stopPropagation();
    
    const submitBtn = document.getElementById('survey-submit-btn');
    const submitText = document.getElementById('survey-submit-text');
    const submitSpinner = document.getElementById('survey-submit-spinner');
    const messageEl = document.getElementById('survey-message');
    
    if (!submitBtn || !messageEl) {
        console.error('❌ Submit-Elemente nicht gefunden');
        return;
    }
    
    // Disable button & show spinner
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    if (submitText) submitText.classList.add('hidden');
    if (submitSpinner) submitSpinner.classList.remove('hidden');
    messageEl.textContent = '⏳ Wird gesendet...';
    messageEl.className = 'text-metal-light/50 text-xs text-center mt-3';
    
    const formData = {
        name: document.getElementById('name')?.value.trim() || '',
        personen: document.getElementById('personen')?.value || '',
        essen: document.getElementById('essen')?.value || '',
        allergien: document.getElementById('allergien')?.value.trim() || '',
        anmerkungen: document.getElementById('anmerkungen')?.value.trim() || ''
    };
    
    const isAbsage = formData.personen === 'Absage';
    
    console.log('📤 Sende Umfrage-Daten:', formData);
    
    try {
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (isAbsage) {
            messageEl.textContent = 'Schade, dass ihr nicht könnt – danke fürs Bescheid geben. Wir stoßen auf euch an und freuen uns aufs nächste Wiedersehen!';
            messageEl.className = 'text-metal-light/80 text-xs text-center mt-3 font-semibold';
        } else {
            messageEl.textContent = '✅ Vielen Dank! Wir freuen uns riesig auf euch! 🤘';
            messageEl.className = 'text-green-500 text-xs text-center mt-3 font-semibold';
        }
        
        // Reset form
        document.getElementById('survey-form').reset();
        
    } catch(error) {
        console.error('❌ Survey-Fehler:', error);
        messageEl.textContent = '❌ Fehler beim Senden. Bitte versuche es später erneut.';
        messageEl.className = 'text-red-500 text-xs text-center mt-3 font-semibold';
    }
    
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.setAttribute('aria-busy', 'false');
    if (submitText) submitText.classList.remove('hidden');
    if (submitSpinner) submitSpinner.classList.add('hidden');
    
    return false; // Verhindert Form-Reload
}

// Make survey functions globally available
window.initSurveyForm = initSurveyForm;
window.selectSuggestion = selectSuggestion;
window.handleSurveySubmit = handleSurveySubmit;
