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

(() => {
    const statusHost = document.querySelector("[data-form-status]");

    if (!statusHost) {
        return;
    }

    const url = new URL(window.location.href);
    const status = url.searchParams.get("status");
    const messages = {
        success: "Diagn&oacute;stico enviado com sucesso. A JV Digital entrar&aacute; em contato em breve.",
        error: "N&atilde;o foi poss&iacute;vel enviar agora. Tente novamente ou fale conosco pelo WhatsApp."
    };

    if (!status || !messages[status]) {
        return;
    }

    statusHost.innerHTML = messages[status];
    statusHost.hidden = false;
    statusHost.classList.add(status === "success" ? "form-status--success" : "form-status--error");
    statusHost.setAttribute("role", status === "success" ? "status" : "alert");
    statusHost.setAttribute("tabindex", "-1");
    statusHost.focus();

    url.searchParams.delete("status");

    if (window.history.replaceState) {
        const cleanSearch = url.searchParams.toString();
        const cleanUrl = `${url.pathname}${cleanSearch ? `?${cleanSearch}` : ""}${url.hash}`;
        window.history.replaceState({}, document.title, cleanUrl);
    }
})();
