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
    list: document.getElementById("project-list"),
    resultsCount: document.getElementById("results-count"),
    noResults: document.getElementById("no-results"),
    heroStats: document.getElementById("hero-stats"),
  };

  // --- Inicialización ----------------------------------------------------
  function init() {
    readUrlState(); // ?cat= antes del primer render
    applyTheme(state.theme);
    bindEvents();
    applyLanguage(state.lang); // también hace el render inicial y el eyebrow
  }

  // Lee el estado inicial desde la URL (?cat=).
  function readUrlState() {
    const params = new URLSearchParams(location.search);
    const cat = params.get("cat");
    if (cat === "all" || CATEGORY_ORDER.includes(cat)) state.category = cat;
  }

  // Construye la URL que refleja el estado actual (query string compartible).
  function currentUrl() {
    const params = new URLSearchParams();
    if (state.category !== "all") params.set("cat", state.category);
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

    els.list.innerHTML = "";
    results.forEach((p) => els.list.appendChild(buildCard(p, t)));

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
