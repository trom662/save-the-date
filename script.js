// Event date: December 21, 2025
const eventDate = new Date('2025-12-21T18:00:00').getTime();

// Update countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p class="countdown-label">Die Veranstaltung hat bereits stattgefunden!</p>';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Initialize countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP functionality
document.getElementById('rsvp-button').addEventListener('click', function() {
    const message = document.getElementById('rsvp-message');
    message.textContent = 'Vielen Dank für Ihre Zusage!';
    message.classList.remove('hidden');
    this.disabled = true;
    this.style.opacity = '0.6';
    this.style.cursor = 'not-allowed';
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateCountdown };
}
