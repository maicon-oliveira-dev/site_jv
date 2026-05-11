const spotlightPanels = document.querySelectorAll("[data-spotlight]");

spotlightPanels.forEach((panel) => {
    const resetSpotlight = () => {
        panel.style.setProperty("--pointer-x", "50%");
        panel.style.setProperty("--pointer-y", "50%");
    };

    panel.addEventListener("pointermove", (event) => {
        const bounds = panel.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;

        panel.style.setProperty("--pointer-x", `${x}%`);
        panel.style.setProperty("--pointer-y", `${y}%`);
    });

    panel.addEventListener("pointerleave", resetSpotlight);
    resetSpotlight();
});
