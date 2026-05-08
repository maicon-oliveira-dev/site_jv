const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!mainNav.contains(target) && !menuToggle.contains(target)) {
            mainNav.classList.remove('open');
            menuToggle.classList.remove('open');
        }
    });
}
