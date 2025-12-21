/**
 * Save The Date - JavaScript
 * Countdown, Navigation, Lightbox & Smooth Interactions
 */

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
// TIMELINE SCROLL ANIMATIONS
// ================================================

/**
 * Initialize scroll-based animations for timeline cards
 * Uses IntersectionObserver for performant reveal-on-scroll
 */
function initTimelineAnimations() {
    const timelineCards = document.querySelectorAll('[data-animate]');
    
    if (timelineCards.length === 0) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // If user prefers reduced motion, show all cards immediately
        timelineCards.forEach(card => card.classList.add('is-visible'));
        return;
    }
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -50px 0px', // trigger slightly before element is fully visible
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for multiple cards
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 150);
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineCards.forEach(card => {
        observer.observe(card);
    });
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
    initTimelineAnimations();
    
    console.log('🤘 Save The Date loaded successfully!');
});


// Make lightbox functions globally available
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
