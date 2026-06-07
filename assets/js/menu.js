(() => {
    const body = document.body;
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (!body || !menuToggle || !mainNav) {
        return;
    }

    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const navLinks = Array.from(mainNav.querySelectorAll("a"));
    let isOpen = false;

    const isMobileViewport = () => mobileQuery.matches;

    const focusFirstLink = () => {
        const firstLink = navLinks[0];
        const applyFocus = () => {
            if (isOpen) {
                firstLink.focus({ preventScroll: true });
            }
        };

        if (!firstLink) {
            return;
        }

        window.requestAnimationFrame(applyFocus);
        window.setTimeout(applyFocus, 180);
    };

    const syncAccessibility = () => {
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu principal" : "Abrir menu principal");

        if (isMobileViewport()) {
            mainNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
            return;
        }

        mainNav.removeAttribute("aria-hidden");
    };

    const closeMenu = ({ restoreFocus = false } = {}) => {
        isOpen = false;
        mainNav.classList.remove("open");
        menuToggle.classList.remove("open");
        body.classList.remove("menu-open");
        syncAccessibility();

        if (restoreFocus) {
            menuToggle.focus();
        }
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
        focusFirstLink();
    };

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu({ restoreFocus: true });
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
            closeMenu({ restoreFocus: true });
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
            closeMenu({ restoreFocus: true });
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", syncViewportState);
    } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(syncViewportState);
    }

    syncViewportState();
})();
