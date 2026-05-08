const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    const closeMenu = () => {
        mainNav.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
        mainNav.classList.add("open");
        menuToggle.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.contains("open");
        if (isOpen) {
            closeMenu();
            return;
        }

        openMenu();
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Node)) {
            return;
        }

        if (!mainNav.contains(target) && !menuToggle.contains(target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    const desktopQuery = window.matchMedia("(min-width: 901px)");
    desktopQuery.addEventListener("change", (event) => {
        if (event.matches) {
            closeMenu();
        }
    });
}
