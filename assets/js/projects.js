(() => {
    const projects = window.JV_PROJECTS || [];
    const escapeHtml = (value) => String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const isExternalUrl = (url) => /^https?:\/\//i.test(String(url || ""));
    const isSiteProject = (project) => Boolean(project.siteUrl || project.liveUrl)
        || /site|landing|sistema|front-end/i.test(`${project.category || ""} ${project.services?.join(" ") || ""}`);
    const projectKind = (project) => isSiteProject(project) ? "site" : "design";
    const projectExternalUrl = (project) => project.siteUrl || project.liveUrl || project.behanceUrl || project.sourceUrl || "";
    const projectUrl = (project) => projectExternalUrl(project) || `./projeto.html?id=${encodeURIComponent(project.id)}`;
    const projectLinkAttrs = (project) => isExternalUrl(projectUrl(project)) ? ' target="_blank" rel="noopener noreferrer"' : "";

    const renderVisual = (project, modifier = "") => {
        if (project.coverImage) {
            return `
                <figure class="project-visual ${modifier}">
                    <img src="${escapeHtml(project.coverImage)}" alt="${escapeHtml(project.title)}" loading="eager" decoding="async">
                </figure>
            `;
        }

        const services = (project.services || []).slice(0, 3);

        return `
            <figure class="project-visual project-visual--placeholder ${modifier}" aria-label="Capa visual do projeto ${escapeHtml(project.title)}">
                <span class="project-visual__label">${escapeHtml(project.category)}</span>
                <strong>${escapeHtml(project.title)}</strong>
                <div class="project-visual__grid" aria-hidden="true">
                    <span></span><span></span><span></span><span></span>
                </div>
                <div class="project-visual__tags" aria-hidden="true">
                    ${services.map((service) => `<span>${escapeHtml(service)}</span>`).join("")}
                </div>
            </figure>
        `;
    };

    const renderCard = (project, featured = false) => `
        <article class="project-card ${featured ? "project-card--featured" : ""}" data-project-card data-category="${escapeHtml(project.category)}" data-project-kind="${projectKind(project)}">
            <a class="project-card__link" href="${escapeHtml(projectUrl(project))}"${projectLinkAttrs(project)} aria-label="Ver projeto ${escapeHtml(project.title)}">
                ${renderVisual(project)}
                <div class="project-card__body">
                    <span class="project-card__category">${escapeHtml(project.category)}</span>
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    <span class="project-card__cta">Ver projeto</span>
                </div>
            </a>
        </article>
    `;

    const renderFeaturedProjects = () => {
        document.querySelectorAll("[data-featured-projects]").forEach((host) => {
            const limit = Number(host.dataset.limit || 4);
            host.innerHTML = projects.slice(0, limit).map((project, index) => renderCard(project, index === 0)).join("");
        });
    };

    const renderProjectGrid = () => {
        const grid = document.querySelector("[data-project-grid]");
        const filters = document.querySelector("[data-project-filters]");

        if (!grid) {
            return;
        }

        const forcedCategory = grid.dataset.category || "";
        const categories = forcedCategory
            ? []
            : ["Todos", ...Array.from(new Set(projects.map((project) => project.category)))];
        let activeCategory = forcedCategory || "Todos";

        const paintFilters = () => {
            if (!filters || forcedCategory) {
                return;
            }

            filters.innerHTML = categories.map((category) => `
                <button class="project-filter ${category === activeCategory ? "is-active" : ""}" type="button" data-filter="${escapeHtml(category)}" aria-pressed="${category === activeCategory ? "true" : "false"}">
                    ${escapeHtml(category)}
                </button>
            `).join("");
        };

        const paintGrid = () => {
            const visibleProjects = forcedCategory
                ? projects.filter((project) => project.category === forcedCategory)
                : activeCategory === "Todos"
                    ? projects
                    : projects.filter((project) => project.category === activeCategory);

            grid.innerHTML = visibleProjects.map((project, index) => renderCard(project, index === 0)).join("");
        };

        if (!forcedCategory) {
            filters?.addEventListener("click", (event) => {
                const button = event.target.closest("[data-filter]");

                if (!button) {
                    return;
                }

                activeCategory = button.dataset.filter || "Todos";
                paintFilters();
                paintGrid();
            });
        }

        paintFilters();
        paintGrid();
    };

    const renderCasePage = () => {
        const host = document.querySelector("[data-project-detail]");

        if (!host) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const project = projects.find((item) => item.id === id) || projects[0];

        if (!project) {
            host.innerHTML = `
                <section class="page-hero">
                    <div class="container">
                        <div class="section-heading">
                            <span class="section-tag">Projeto</span>
                            <h1>Projeto n&atilde;o encontrado.</h1>
                            <p>Volte para a lista de projetos e escolha outro trabalho.</p>
                            <a href="./projetos.html" class="btn btn-primary">Ver projetos</a>
                        </div>
                    </div>
                </section>
            `;
            return;
        }

        document.title = `${project.title} | Projeto JV Digital`;

        const externalUrl = projectExternalUrl(project);
        const externalLabel = project.externalLabel || (externalUrl.includes("behance.net") ? "Ver no Behance" : "Ver projeto");
        const externalButton = externalUrl ? `<a href="${escapeHtml(externalUrl)}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">${escapeHtml(externalLabel)}</a>` : "";
        const deliverables = (project.deliverables || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
        const services = (project.services || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
        const gallery = project.gallery && project.gallery.length
            ? project.gallery.map((image, index) => `
                <figure class="case-gallery__item case-gallery__item--${index + 1}">
                    <img src="${escapeHtml(image)}" alt="${escapeHtml(project.title)} - imagem ${index + 1}" loading="lazy" decoding="async">
                </figure>
            `).join("")
            : [0, 1, 2].map((_, index) => renderVisual(project, `case-gallery__item case-gallery__item--${index + 1}`)).join("");

        host.innerHTML = `
            <section class="page-hero project-case-hero">
                <div class="container hero-grid">
                    <div class="hero-copy" data-reveal>
                        <span class="section-tag">${escapeHtml(project.category)}</span>
                        <h1>${escapeHtml(project.title)}</h1>
                        <p class="lead">${escapeHtml(project.description)}</p>
                        <div class="hero-actions">
                            <a href="./contato.html#projeto" class="btn btn-primary">Quero uma presen&ccedil;a nesse n&iacute;vel</a>
                            ${externalButton}
                        </div>
                    </div>
                    <aside class="spotlight-panel hero-panel project-case-panel" data-reveal data-spotlight>
                        ${renderVisual(project, "project-visual--hero")}
                    </aside>
                </div>
            </section>

            <section class="section">
                <div class="container case-study">
                    <article class="surface-card case-study__block" data-reveal>
                        <span class="section-tag">Contexto</span>
                        <h2>O ponto de partida.</h2>
                        <p>${escapeHtml(project.problem)}</p>
                    </article>
                    <article class="surface-card case-study__block" data-reveal>
                        <span class="section-tag">Solu&ccedil;&atilde;o</span>
                        <h2>Como a JV estruturou a percep&ccedil;&atilde;o.</h2>
                        <p>${escapeHtml(project.solution)}</p>
                    </article>
                    <article class="surface-card case-study__block" data-reveal>
                        <span class="section-tag">Entregas</span>
                        <h2>O que foi constru&iacute;do.</h2>
                        <ul class="check-list">${deliverables}</ul>
                    </article>
                    <aside class="surface-card case-study__block" data-reveal>
                        <span class="section-tag">Servi&ccedil;os</span>
                        <h2>Frentes envolvidas.</h2>
                        <ul class="check-list">${services}</ul>
                    </aside>
                </div>
            </section>

            <section class="section">
                <div class="container">
                    <div class="section-heading" data-reveal>
                        <span class="section-tag">Galeria</span>
                        <h2>Visual do projeto.</h2>
                        <p>As capas abaixo funcionam como estrutura editorial at&eacute; a galeria definitiva ser inserida com os arquivos finais.</p>
                    </div>
                    <div class="case-gallery" data-reveal>${gallery}</div>
                </div>
            </section>

            <section class="section">
                <div class="container">
                    <div class="cta-panel cta-panel--page" data-reveal data-spotlight>
                        <div class="cta-panel__content">
                            <span class="section-tag">Pr&oacute;ximo passo</span>
                            <h2>Quer uma presen&ccedil;a nesse n&iacute;vel?</h2>
                            <p>Conte sua maior dor e o investimento dispon&iacute;vel para entender o melhor caminho de projeto.</p>
                        </div>
                        <div class="cta-panel__conversion">
                            <a href="./contato.html#projeto" class="btn btn-primary">Falar sobre meu projeto</a>
                            <p class="small-note">Conversa objetiva para alinhar dor, escopo e investimento.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    };

    renderFeaturedProjects();
    renderProjectGrid();
    renderCasePage();
})();
