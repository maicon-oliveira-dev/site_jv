const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");

const handleHeaderScroll = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("scrolled", window.scrollY > 18);
};

handleHeaderScroll();
window.addEventListener("scroll", handleHeaderScroll, { passive: true });

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${index * 45}ms`);
        observer.observe(item);
    });
} else {
    revealItems.forEach((item) => {
        item.classList.add("is-visible");
    });
}
