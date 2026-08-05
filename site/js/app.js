// ===========================================================================
// Lógica principal: idioma, tema, búsqueda y filtro por categoría.
// ===========================================================================
(function () {
  "use strict";

  const SUPPORTED_LANGS = ["es", "en", "pt"];
  const CATEGORY_ORDER = [
    "libraries",
    "apis",
    "mobile",
    "games",
    "extensions",
    "services",
    "recursos",
  ];

  // --- Estado ------------------------------------------------------------
  const state = {
    lang: resolveInitialLang(),
    theme: resolveInitialTheme(),
    query: "",
    category: "all",
    view: resolveInitialView(),
    featured: 0,
  };

  // --- Referencias al DOM ------------------------------------------------
  const els = {
    html: document.documentElement,
    langGroup: document.getElementById("lang-group"),
    langButtons: Array.from(document.querySelectorAll(".lang-btn")),
    themeToggle: document.getElementById("theme-toggle"),
    themeIcon: document.querySelector(".theme-icon"),
    search: document.getElementById("search"),
    chips: document.getElementById("chips"),
    chipList: Array.from(document.querySelectorAll(".chip")),
    viewSwitch: document.getElementById("view-switch"),
    viewButtons: Array.from(document.querySelectorAll(".view-btn")),
    list: document.getElementById("project-list"),
    resultsCount: document.getElementById("results-count"),
    noResults: document.getElementById("no-results"),
    heroStats: document.getElementById("hero-stats"),
    featured: document.getElementById("featured"),
    featuredPanel: document.getElementById("featured-panel"),
    featuredCounter: document.getElementById("featured-counter"),
    featuredDots: document.getElementById("featured-dots"),
    featuredPrev: document.getElementById("featured-prev"),
    featuredNext: document.getElementById("featured-next"),
    creatorsList: document.getElementById("creators-list"),
    categoriesGrid: document.getElementById("categories-grid"),
    navLinks: Array.from(document.querySelectorAll(".nav-link")),
  };

  // --- Inicialización ----------------------------------------------------
  function init() {
    readUrlState(); // ?cat= y ?view= antes del primer render
    updateViewButtons();
    renderCreators(); // independiente del idioma
    applyTheme(state.theme);
    bindEvents();
    applyLanguage(state.lang); // también hace el render inicial y el eyebrow
    observeSections(); // aria-current de la nav según el scroll
  }

  // Lee el estado inicial desde la URL (?cat=, ?view=). La URL gana sobre
  // el valor recordado en localStorage cuando el parámetro está presente.
  function readUrlState() {
    const params = new URLSearchParams(location.search);
    const cat = params.get("cat");
    if (cat === "all" || CATEGORY_ORDER.includes(cat)) state.category = cat;
    const view = params.get("view");
    if (view === "list" || view === "cards") state.view = view;
  }

  // Construye la URL que refleja el estado actual (query string compartible).
  function currentUrl() {
    const params = new URLSearchParams();
    if (state.category !== "all") params.set("cat", state.category);
    if (state.view === "list") params.set("view", "list");
    const qs = params.toString();
    return location.pathname + (qs ? "?" + qs : "");
  }

  // Eyebrow del hero: "N proyectos · M categorías · K creadores",
  // derivado de los datos para no desactualizarse y traducido por idioma.
  function renderHeroStats(t) {
    if (!els.heroStats) return;
    const projects = window.PROJECTS.length;
    const categories = new Set(window.PROJECTS.map((p) => p.category)).size;
    const creators = new Set(window.PROJECTS.map((p) => p.creator.name)).size;
    els.heroStats.textContent =
      projects +
      " " +
      t.statProjects +
      " · " +
      categories +
      " " +
      t.statCategories +
      " · " +
      creators +
      " " +
      t.statCreators;
  }

  function bindEvents() {
    els.langButtons.forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });

    els.themeToggle.addEventListener("click", toggleTheme);

    els.search.addEventListener("input", (e) => {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });

    // Chips de categoría: son enlaces reales (funcionan sin JS). Con JS
    // interceptamos el clic simple para filtrar sin recargar.
    els.chips.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return; // deja abrir en pestaña nueva
      e.preventDefault();
      setCategory(chip.dataset.cat);
    });

    // Conmutador de vista tarjetas / lista.
    els.viewSwitch.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-btn");
      if (btn) setView(btn.dataset.view);
    });

    // Tarjetas de la sección Categorías.
    if (els.categoriesGrid) bindCategoryCards();

    // Carrusel de destacados (sin autoplay). Flechas del teclado con foco dentro.
    if (els.featured) {
      els.featuredPrev.addEventListener("click", () =>
        setFeatured(state.featured - 1)
      );
      els.featuredNext.addEventListener("click", () =>
        setFeatured(state.featured + 1)
      );
      els.featuredDots.addEventListener("click", (e) => {
        const dot = e.target.closest(".featured-dot");
        if (dot) setFeatured(Number(dot.dataset.index));
      });
      els.featured.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setFeatured(state.featured - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setFeatured(state.featured + 1);
        }
      });
    }

    // Atajos de teclado del buscador: "/" enfoca, "Esc" limpia.
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !isEditableTarget(e.target)) {
        e.preventDefault();
        els.search.focus();
      } else if (e.key === "Escape" && document.activeElement === els.search) {
        els.search.value = "";
        state.query = "";
        render();
        els.search.blur();
      }
    });
  }

  // ¿El foco está en un campo editable? Evita capturar "/" mientras se escribe.
  function isEditableTarget(node) {
    if (!node) return false;
    const tag = node.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      node.isContentEditable === true
    );
  }

  // --- Idioma ------------------------------------------------------------
  function resolveInitialLang() {
    const stored = safeGet("oscol-lang");
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(nav) ? nav : "es";
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    state.lang = lang;
    safeSet("oscol-lang", lang);
    applyLanguage(lang);
  }

  function applyLanguage(lang) {
    const t = window.I18N[lang];
    els.html.setAttribute("lang", t.htmlLang);

    // Texto de nodos con data-i18n
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (t[key] != null) node.textContent = t[key];
    });

    // Atributos con data-i18n-attr="attr:key"
    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
      node
        .getAttribute("data-i18n-attr")
        .split(",")
        .forEach((pair) => {
          const [attr, key] = pair.split(":").map((s) => s.trim());
          if (t[key] != null) node.setAttribute(attr, t[key]);
        });
    });

    // Botones de idioma
    els.langButtons.forEach((btn) => {
      btn.setAttribute(
        "aria-pressed",
        String(btn.dataset.lang === lang)
      );
    });

    // Etiquetas accesibles de controles
    els.search.setAttribute("aria-label", t.searchLabel);
    els.langGroup.setAttribute("aria-label", t.languageLabel);
    els.themeToggle.setAttribute("aria-label", t.themeToggle);

    // Etiqueta de cada chip (nombre corto de la categoría)
    els.chipList.forEach((chip) => {
      const key = chip.dataset.cat;
      chip.textContent = t.categoriesShort[key] || key;
    });

    updateChips();
    renderHeroStats(t);
    renderFeatured(t);
    renderCategories(t);
    updateThemeLabel();
    render();
  }

  // --- Filtro por categoría (chips) --------------------------------------
  function setCategory(cat) {
    state.category = cat === "all" || CATEGORY_ORDER.includes(cat) ? cat : "all";
    updateChips();
    history.replaceState(null, "", currentUrl());
    render();
  }

  function updateChips() {
    els.chipList.forEach((chip) => {
      const active = chip.dataset.cat === state.category;
      chip.classList.toggle("is-active", active);
      if (active) chip.setAttribute("aria-current", "page");
      else chip.removeAttribute("aria-current");
    });
  }

  function clearFilters() {
    state.category = "all";
    state.query = "";
    els.search.value = "";
    updateChips();
    history.replaceState(null, "", currentUrl());
    render();
  }

  // --- Vista (tarjetas / lista) ------------------------------------------
  function resolveInitialView() {
    return safeGet("oscol-view") === "list" ? "list" : "cards";
  }

  function setView(view) {
    state.view = view === "list" ? "list" : "cards";
    safeSet("oscol-view", state.view);
    updateViewButtons();
    history.replaceState(null, "", currentUrl());
    render();
  }

  function updateViewButtons() {
    els.viewButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.view === state.view));
    });
  }

  // --- Carrusel de destacados (sin autoplay) -----------------------------
  function getFeatured() {
    return window.PROJECTS.filter((p) => p.featured);
  }

  function setFeatured(i) {
    const n = getFeatured().length || 1;
    state.featured = ((i % n) + n) % n; // wrap-around
    renderFeatured(window.I18N[state.lang]);
  }

  function renderFeatured(t) {
    if (!els.featuredPanel) return;
    const list = getFeatured();
    if (!list.length) return;
    const n = list.length;
    const i = ((state.featured % n) + n) % n;
    const p = list[i];

    const cat = document.createElement("div");
    cat.className = "featured-cat";
    const icon = document.createElement("span");
    icon.className = "featured-cat-icon";
    icon.setAttribute("aria-hidden", "true");
    const meta = window.CATEGORIES[p.category];
    icon.textContent = meta ? meta.glyph : "";
    icon.style.color = "var(--cat-" + p.category + ")";
    const catLabel = document.createElement("span");
    catLabel.className = "featured-cat-label";
    catLabel.textContent = t.categoriesShort[p.category] || p.category;
    cat.append(icon, catLabel);

    const h2 = document.createElement("h2");
    h2.className = "featured-name";
    h2.appendChild(buildProjectLink(p, t));

    const desc = document.createElement("p");
    desc.className = "featured-desc";
    desc.textContent = p.description[state.lang] || p.description.es;

    const tags = buildTagList(p, 3);
    tags.classList.add("featured-tags");

    const by = document.createElement("p");
    by.className = "featured-by";
    const byLink = document.createElement("a");
    byLink.href = "https://github.com/" + p.creator.github;
    byLink.target = "_blank";
    byLink.rel = "noopener noreferrer";
    byLink.textContent = p.creator.name;
    by.append(t.byLabel + " ", byLink);

    els.featuredPanel.innerHTML = "";
    els.featuredPanel.append(cat, h2, desc, tags, by);

    els.featuredCounter.textContent = i + 1 + " / " + n;

    els.featuredDots.innerHTML = "";
    list.forEach((proj, k) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "featured-dot";
      dot.dataset.index = String(k);
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", proj.name);
      dot.setAttribute("aria-selected", String(k === i));
      els.featuredDots.appendChild(dot);
    });
  }

  // --- Tema --------------------------------------------------------------
  function resolveInitialTheme() {
    const stored = safeGet("oscol-theme");
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function toggleTheme() {
    applyTheme(state.theme === "dark" ? "light" : "dark");
    safeSet("oscol-theme", state.theme);
  }

  function applyTheme(theme) {
    state.theme = theme;
    els.html.setAttribute("data-theme", theme);
    els.themeIcon.textContent = theme === "dark" ? "◑" : "◐";
    els.themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    updateThemeLabel();
  }

  function updateThemeLabel() {
    const t = window.I18N[state.lang];
    if (!t) return;
    const label = state.theme === "dark" ? t.themeToLight : t.themeToDark;
    els.themeToggle.setAttribute("aria-label", label);
    els.themeToggle.setAttribute("title", label);
  }

  // --- Render ------------------------------------------------------------
  function getFilteredProjects() {
    const q = state.query;
    return window.PROJECTS.filter((p) => {
      if (state.category !== "all" && p.category !== state.category)
        return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.creator.name,
        (p.tags || []).join(" "),
        p.description[state.lang] || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function render() {
    const t = window.I18N[state.lang];
    const results = getFilteredProjects();

    els.list.className = state.view === "list" ? "project-list" : "project-grid";
    els.list.innerHTML = "";
    const build = state.view === "list" ? buildRow : buildCard;
    results.forEach((p) => els.list.appendChild(build(p, t)));

    els.resultsCount.textContent = t.resultsCount(results.length);

    const empty = results.length === 0;
    els.noResults.hidden = !empty;
    els.list.hidden = empty;
    if (empty) renderNoResults(t);
  }

  function renderNoResults(t) {
    els.noResults.innerHTML = "";
    const msg = document.createElement("p");
    msg.className = "no-results-msg";
    msg.textContent = t.noResults;
    const clear = document.createElement("a");
    clear.className = "clear-filters";
    clear.href = "?cat=all";
    clear.textContent = t.clearFilters;
    clear.addEventListener("click", (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      e.preventDefault();
      clearFilters();
    });
    els.noResults.append(msg, clear);
  }

  function buildCard(p, t) {
    const li = document.createElement("li");
    li.className = "project-card";

    const top = document.createElement("div");
    top.className = "card-top";
    top.append(buildCategoryIcon(p), buildCategoryLabel(p, t));

    const h3 = document.createElement("h3");
    h3.className = "project-name";
    h3.appendChild(buildProjectLink(p, t));

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = p.description[state.lang] || p.description.es;

    li.append(top, h3, desc, buildTagList(p, 3), buildCreatorMeta(p, t));
    return li;
  }

  // --- Piezas reutilizables de tarjeta / fila ----------------------------
  function buildCategoryIcon(p) {
    const icon = document.createElement("span");
    icon.className = "cat-icon";
    icon.setAttribute("aria-hidden", "true");
    const meta = window.CATEGORIES[p.category];
    icon.textContent = meta ? meta.glyph : "";
    icon.style.color = "var(--cat-" + p.category + ")";
    return icon;
  }

  function buildCategoryLabel(p, t) {
    const label = document.createElement("span");
    label.className = "cat-label";
    label.textContent = t.categoriesShort[p.category] || p.category;
    return label;
  }

  function buildProjectLink(p, t) {
    const a = document.createElement("a");
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = p.name;
    a.setAttribute("aria-label", p.name + " — " + t.visitProject);
    return a;
  }

  function buildTagList(p, max) {
    const ul = document.createElement("ul");
    ul.className = "tag-list";
    (p.tags || []).slice(0, max).forEach((tag) => {
      const li = document.createElement("li");
      li.className = "tag";
      li.textContent = tag;
      ul.appendChild(li);
    });
    return ul;
  }

  function buildCreatorMeta(p, t) {
    const meta = document.createElement("p");
    meta.className = "project-meta";
    const name = document.createElement("strong");
    name.textContent = p.creator.name;
    meta.append(t.byLabel + " ", name);
    return meta;
  }

  // Fila de la vista lista (mismos datos que la tarjeta, en columnas).
  function buildRow(p, t) {
    const li = document.createElement("li");
    li.className = "project-row";

    const main = document.createElement("div");
    main.className = "row-main";
    const h3 = document.createElement("h3");
    h3.className = "row-name";
    h3.appendChild(buildProjectLink(p, t));
    const desc = document.createElement("p");
    desc.className = "row-desc";
    desc.textContent = p.description[state.lang] || p.description.es;
    main.append(h3, desc);

    const creator = document.createElement("span");
    creator.className = "row-creator";
    const name = document.createElement("strong");
    name.textContent = p.creator.name;
    creator.appendChild(name);

    li.append(
      buildCategoryIcon(p),
      main,
      buildCategoryLabel(p, t),
      buildTagList(p, 2),
      creator
    );
    return li;
  }

  // --- Creadores ---------------------------------------------------------
  // Se derivan de los datos agrupando por creador; orden por número de
  // proyectos (desc), con la primera aparición como desempate. Contenido
  // independiente del idioma, así que se renderiza una sola vez.
  function renderCreators() {
    if (!els.creatorsList) return;
    const map = new Map();
    window.PROJECTS.forEach((p, idx) => {
      const key = p.creator.name;
      if (!map.has(key))
        map.set(key, { creator: p.creator, count: 0, order: idx });
      map.get(key).count += 1;
    });
    const creators = Array.from(map.values()).sort((a, b) =>
      b.count !== a.count ? b.count - a.count : a.order - b.order
    );

    els.creatorsList.innerHTML = "";
    creators.forEach((c, i) => {
      const li = document.createElement("li");
      li.className = "creator-row";

      const rank = document.createElement("span");
      rank.className = "creator-rank";
      rank.setAttribute("aria-hidden", "true");
      rank.textContent = String(i + 1).padStart(2, "0");

      const info = document.createElement("span");
      const link = document.createElement("a");
      link.className = "creator-name";
      link.href = "https://github.com/" + c.creator.github;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = c.creator.name;
      const area = document.createElement("span");
      area.className = "creator-area";
      area.textContent = c.creator.area;
      info.append(link, area);

      const count = document.createElement("span");
      count.className = "creator-count";
      count.textContent = String(c.count);

      li.append(rank, info, count);
      els.creatorsList.appendChild(li);
    });
  }

  // --- Categorías --------------------------------------------------------
  function renderCategories(t) {
    if (!els.categoriesGrid) return;
    els.categoriesGrid.innerHTML = "";
    CATEGORY_ORDER.forEach((key) => {
      const count = window.PROJECTS.filter((p) => p.category === key).length;

      const card = document.createElement("a");
      card.className = "category-card";
      card.href = "?cat=" + key;

      const bar = document.createElement("span");
      bar.className = "category-bar";
      bar.setAttribute("aria-hidden", "true");
      bar.style.background = "var(--cat-" + key + ")";

      const info = document.createElement("span");
      const name = document.createElement("span");
      name.className = "category-name";
      name.textContent = t.categories[key];
      const cnt = document.createElement("span");
      cnt.className = "category-count";
      cnt.textContent = t.projectCount(count);
      info.append(name, cnt);

      card.append(bar, info);
      els.categoriesGrid.appendChild(card);
    });
  }

  // Al hacer clic en una tarjeta de categoría, filtra sin recargar.
  function bindCategoryCards() {
    els.categoriesGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".category-card");
      if (!card) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const url = new URL(card.href);
      const cat = new URLSearchParams(url.search).get("cat");
      e.preventDefault();
      setCategory(cat);
      if (els.list) els.list.scrollIntoView({ block: "start" });
    });
  }

  // --- Navegación por secciones (aria-current) ---------------------------
  function observeSections() {
    if (!("IntersectionObserver" in window)) return;
    const byHref = {};
    els.navLinks.forEach((l) => {
      byHref[l.getAttribute("href")] = l;
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = byHref["#" + entry.target.id];
          if (!link) return;
          els.navLinks.forEach((l) => l.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "page");
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    ["proyectos", "creadores", "categorias", "contribuir"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  // --- Utilidades de almacenamiento seguro -------------------------------
  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }
  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      /* almacenamiento no disponible */
    }
  }

  // --- Arranque ----------------------------------------------------------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
