document.addEventListener('DOMContentLoaded', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.setTimeout(() => {
            preloader.classList.add('hidden');
            window.setTimeout(() => preloader.remove(), 500);
        }, 850);
    }

    const fadeItems = document.querySelectorAll('.fade-up');
    fadeItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 120}ms`;
    });
});
