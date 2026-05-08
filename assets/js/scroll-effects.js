const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 24) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const revealItems = document.querySelectorAll('.glass-card, .section-cta, .page-hero');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });

revealItems.forEach(item => observer.observe(item));
