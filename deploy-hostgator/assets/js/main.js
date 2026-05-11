document.documentElement.classList.add("motion-ready");

const body = document.body;
const preloader = document.getElementById("jv-preloader");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

if (preloader && body) {
    body.classList.add("is-loading");
    body.classList.remove("site-loaded");
}

document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");
    }
});

(() => {
    if (!preloader || !body) {
        return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const exitDelay = reducedMotionQuery.matches ? 120 : 900;
    const cleanupDelay = reducedMotionQuery.matches ? 180 : 900;
    let finished = false;
    let loadTimer = 0;
    let fallbackTimer = 0;

    const finishPreloader = () => {
        if (finished) {
            return;
        }

        finished = true;
        window.clearTimeout(loadTimer);
        window.clearTimeout(fallbackTimer);

        body.classList.remove("is-loading");
        body.classList.add("site-loaded");
        preloader.classList.add("jv-preloader--exit");

        window.setTimeout(() => {
            preloader.setAttribute("aria-hidden", "true");
            preloader.remove();
        }, cleanupDelay);
    };

    const scheduleFinish = () => {
        if (finished || loadTimer) {
            return;
        }

        loadTimer = window.setTimeout(finishPreloader, exitDelay);
    };

    if (document.readyState === "complete") {
        scheduleFinish();
    } else {
        window.addEventListener("load", scheduleFinish, { once: true });
    }

    fallbackTimer = window.setTimeout(finishPreloader, reducedMotionQuery.matches ? 2500 : 3000);
})();
