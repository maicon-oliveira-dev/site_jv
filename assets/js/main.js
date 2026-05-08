document.documentElement.classList.add("motion-ready");

const preloader = document.getElementById("jv-preloader");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");
    }
});

window.addEventListener("load", () => {
    if (!preloader) {
        return;
    }

    window.setTimeout(() => {
        document.body.classList.add("site-loaded");
    }, 900);

    window.setTimeout(() => {
        preloader.setAttribute("aria-hidden", "true");
    }, 1800);
});
