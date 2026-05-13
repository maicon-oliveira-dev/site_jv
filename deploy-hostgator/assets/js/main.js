document.documentElement.classList.add("motion-ready");

const body = document.body;
const preloader = document.getElementById("jv-preloader");
const normalizePath = (path) => {
    const normalizedPath = path
        .replace(/index\.html$/i, "")
        .replace(/\.html$/i, "")
        .replace(/\/+$/, "");

    return normalizedPath === "" ? "/" : normalizedPath;
};

const currentPage = normalizePath(window.location.pathname);

if (preloader && body) {
    body.classList.add("is-loading");
    body.classList.remove("site-loaded");
}

document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) {
        return;
    }

    const linkUrl = new URL(href, window.location.origin);

    if (normalizePath(linkUrl.pathname) === currentPage) {
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
    const whatsappAfterSuccessUrl = "https://wa.me/5547997699364?text=Ol%C3%A1%2C%20JV%20Digital%21%20Enviei%20o%20formul%C3%A1rio%20de%20diagn%C3%B3stico%20e%20gostaria%20de%20falar%20com%20um%20especialista.";

    if (!statusHost) {
        return;
    }

    const url = new URL(window.location.href);
    const status = url.searchParams.get("status");
    const messages = {
        success: {
            tone: "success",
            html: `
                <strong class="form-status__title">Diagn&oacute;stico enviado com sucesso. A JV Digital recebeu suas informa&ccedil;&otilde;es.</strong>
                <p class="form-status__text">Agora, se quiser acelerar o atendimento, fale com um especialista pelo WhatsApp.</p>
                <a class="btn btn-ghost form-status__cta" href="${whatsappAfterSuccessUrl}" target="_blank" rel="noopener noreferrer" aria-label="Falar com especialista da JV Digital pelo WhatsApp ap&oacute;s enviar o diagn&oacute;stico">Falar com especialista</a>
            `
        },
        error: {
            tone: "error",
            html: "<strong class=\"form-status__title\">N&atilde;o foi poss&iacute;vel enviar agora. Revise os dados e tente novamente.</strong>"
        }
    };

    if (!status || !messages[status]) {
        return;
    }

    const message = messages[status];

    statusHost.innerHTML = message.html;
    statusHost.hidden = false;
    statusHost.classList.remove("form-status--success", "form-status--error");
    statusHost.classList.add(message.tone === "success" ? "form-status--success" : "form-status--error");
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
