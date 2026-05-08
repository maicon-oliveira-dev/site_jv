(() => {
    const body = document.body;
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (!body || !menuToggle || !mainNav) {
        return;
    }

    const mobileQuery = window.matchMedia("(max-width: 900px)");
    let isOpen = false;

    const isMobileViewport = () => mobileQuery.matches;

    const syncAccessibility = () => {
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu principal" : "Abrir menu principal");

        if (isMobileViewport()) {
            mainNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
            return;
        }

        mainNav.removeAttribute("aria-hidden");
    };

    const closeMenu = () => {
        isOpen = false;
        mainNav.classList.remove("open");
        menuToggle.classList.remove("open");
        body.classList.remove("menu-open");
        syncAccessibility();
    };

    const openMenu = () => {
        if (!isMobileViewport()) {
            return;
        }

        isOpen = true;
        mainNav.classList.add("open");
        menuToggle.classList.add("open");
        body.classList.add("menu-open");
        syncAccessibility();
    };

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
            return;
        }

        openMenu();
    };

    const syncViewportState = () => {
        if (!isMobileViewport()) {
            closeMenu();
            return;
        }

        syncAccessibility();
    };

    menuToggle.addEventListener("click", (event) => {
        if (!isMobileViewport()) {
            return;
        }

        event.preventDefault();
        toggleMenu();
    });

    mainNav.addEventListener("click", (event) => {
        if (event.target === mainNav) {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!isOpen) {
            return;
        }

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

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", syncViewportState);
    } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(syncViewportState);
    }

    syncViewportState();
})();
