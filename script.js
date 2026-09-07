// --- Mobile Navigation Toggle ---
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    // Toggle aria-expanded for accessibility
    let expanded = mobileToggle.getAttribute('aria-expanded') === 'true' || false;
    mobileToggle.setAttribute('aria-expanded', !expanded);
});

// Close mobile menu when a link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        mobileToggle.setAttribute('aria-expanded', false);
    });
});

// --- Sticky Nav Shadow on Scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Scroll Reveal Animation ---
// Uses IntersectionObserver to trigger fade-in animations when elements enter the viewport
const fadeElements = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Stop observing once it has appeared
        }
    });
}, appearOptions);

fadeElements.forEach(element => {
    appearOnScroll.observe(element);
});
