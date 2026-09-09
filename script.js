// --- Animated Digital Background (node network) ---
(function () {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, nodes, dpr;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const density = 16000; // px^2 per node — tweak for more/fewer nodes
        const count = Math.max(24, Math.round((width * height) / density));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            r: Math.random() * 1.5 + 0.8,
        }));
    }

    function tick() {
        ctx.clearRect(0, 0, width, height);

        if (!reduceMotion) {
            nodes.forEach((n) => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x <= 0 || n.x >= width) n.vx *= -1;
                if (n.y <= 0 || n.y >= height) n.vy *= -1;
            });
        }

        const linkDist = Math.min(width, height) * 0.16;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDist) {
                    const alpha = (1 - dist / linkDist) * 0.25;
                    ctx.strokeStyle = `rgba(4, 156, 209, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        nodes.forEach((n) => {
            ctx.fillStyle = 'rgba(4, 156, 209, 0.55)';
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        });

        if (!reduceMotion) requestAnimationFrame(tick);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            if (reduceMotion) tick();
        }, 150);
    });

    resize();
    tick();
})();

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
