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
    "extensions",
    "services",
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
    category: document.getElementById("category"),
    list: document.getElementById("project-list"),
    resultsCount: document.getElementById("results-count"),
    noResults: document.getElementById("no-results"),
  };

  // --- Inicialización ----------------------------------------------------
  function init() {
    applyTheme(state.theme);
    bindEvents();
    applyLanguage(state.lang); // también hace el render inicial
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

    els.category.addEventListener("change", (e) => {
      state.category = e.target.value;
      render();
    });
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

    buildCategoryOptions(t);
    updateThemeLabel();
    render();
  }

  function buildCategoryOptions(t) {
    const current = state.category;
    els.category.innerHTML = "";
    const opts = ["all", ...CATEGORY_ORDER];
    opts.forEach((key) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = t.categories[key];
      els.category.appendChild(opt);
    });
    els.category.value = current;
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
    els.themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
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
        p.creator,
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
    els.noResults.textContent = t.noResults;
    els.list.hidden = empty;
  }

  function buildCard(p, t) {
    const li = document.createElement("li");
    li.className = "project-card";

    const top = document.createElement("div");
    top.className = "card-top";

    const h3 = document.createElement("h3");
    h3.className = "project-name";
    const a = document.createElement("a");
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = p.name;
    a.setAttribute(
      "aria-label",
      p.name + " — " + t.visitProject
    );
    h3.appendChild(a);

    const badge = document.createElement("span");
    badge.className = "category-badge";
    badge.textContent = t.categories[p.category] || p.category;

    top.append(h3, badge);

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = p.description[state.lang] || p.description.es;

    const meta = document.createElement("p");
    meta.className = "project-meta";
    const metaLabel = document.createElement("span");
    metaLabel.className = "meta-label";
    metaLabel.textContent = t.creatorLabel + ":";
    const metaValue = document.createElement("span");
    metaValue.textContent = " " + p.creator;
    meta.append("👤 ", metaLabel, metaValue);

    li.append(top, desc, meta);
    return li;
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
