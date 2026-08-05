// Metadatos de categoría: color (claro/oscuro) y monograma del ícono.
// Las etiquetas de texto viven en js/i18n.js (categories / categoriesShort).
window.CATEGORIES = {
  libraries: { color: "#1b4db1", colorDark: "#8fb6ee", glyph: "{}" },
  apis: { color: "#0e7c66", colorDark: "#5fc9ad", glyph: "</>" },
  mobile: { color: "#7a3bb5", colorDark: "#c3a0ea", glyph: "[]" },
  games: { color: "#c8102e", colorDark: "#ff8b98", glyph: "▷" },
  extensions: { color: "#b3630b", colorDark: "#e8ab5c", glyph: "+" },
  services: { color: "#4a4f5c", colorDark: "#a8b0c0", glyph: "≈" },
  recursos: { color: "#0b6a8f", colorDark: "#6fc2e0", glyph: "#" },
};

// Lista de proyectos open source colombianos.
// Cada proyecto incluye descripción en los tres idiomas soportados (es, en, pt),
// tags (sin traducir) y un creador normalizado { name, github, area }.
(function () {
  // Creadores canónicos. El handle de GitHub se deriva de las URLs de sus
  // proyectos; "area" es el texto corto de la vista Creadores (sin traducir,
  // igual que los tags).
  const C = {
    sebastian: { name: "Sebastián Ramírez", github: "tiangolo", area: "Python, APIs, CLI" },
    kevin: { name: "Kevin Amado", github: "kamadorueda", area: "Nix, DevOps" },
    santiago: { name: "Santiago García", github: "santigarcor", area: "Laravel, PHP" },
    miguel: { name: "Miguel Teheran", github: "Mteheran", area: "APIs, UI, open data" },
    builker: { name: "Comunidad Builker-Col", github: "builker-col", area: "Ciencia de datos" },
    jd: { name: "J.D. Nicholls", github: "proyecto26", area: "React Native, Unity" },
    angel: { name: "Angel Leonardo y Cro128", github: "ADVAD1D", area: "Godot, videojuegos" },
    manuel: { name: "Manuel Gil", github: "ManuelGil", area: "Extensiones VS Code" },
    john: { name: "John Guerra", github: "john-guerra", area: "Datos geográficos" },
  };

  window.PROJECTS = [
    {
      name: "FastAPI",
      url: "https://github.com/tiangolo/fastapi",
      category: "libraries",
      creator: C.sebastian,
      tags: ["Python", "OpenAPI"],
      featured: true,
      description: {
        es: "Framework web de alto rendimiento para construir APIs con Python 3.7+ basado en estándares modernos (OpenAPI, JSON Schema).",
        en: "High-performance web framework for building APIs with Python 3.7+ based on modern standards (OpenAPI, JSON Schema).",
        pt: "Framework web de alto desempenho para construir APIs com Python 3.7+ baseado em padrões modernos (OpenAPI, JSON Schema).",
      },
    },
    {
      name: "SQLModel",
      url: "https://github.com/tiangolo/sqlmodel",
      category: "libraries",
      creator: C.sebastian,
      tags: ["Python", "Pydantic"],
      description: {
        es: "Biblioteca que combina SQLAlchemy y Pydantic para definir modelos de base de datos con tipado en Python.",
        en: "Library that combines SQLAlchemy and Pydantic to define database models with type hints in Python.",
        pt: "Biblioteca que combina SQLAlchemy e Pydantic para definir modelos de banco de dados com tipagem em Python.",
      },
    },
    {
      name: "Typer",
      url: "https://github.com/tiangolo/typer",
      category: "libraries",
      creator: C.sebastian,
      tags: ["Python", "CLI"],
      featured: true,
      description: {
        es: "Herramienta para construir interfaces de línea de comandos (CLI) usando Python moderno.",
        en: "Tool for building command-line interfaces (CLI) using modern Python.",
        pt: "Ferramenta para construir interfaces de linha de comando (CLI) usando Python moderno.",
      },
    },
    {
      name: "Alejandra",
      url: "https://github.com/kamadorueda/alejandra",
      category: "libraries",
      creator: C.kevin,
      tags: ["Nix"],
      description: {
        es: "Formateador de código Nix que garantiza un estilo de código consistente y automatizable.",
        en: "Nix code formatter that guarantees a consistent and automatable code style.",
        pt: "Formatador de código Nix que garante um estilo de código consistente e automatizável.",
      },
    },
    {
      name: "Laratrust",
      url: "https://github.com/santigarcor/laratrust",
      category: "libraries",
      creator: C.santiago,
      tags: ["Laravel", "PHP"],
      description: {
        es: "Gestión de roles y permisos para Laravel.",
        en: "Role and permission management for Laravel.",
        pt: "Gerenciamento de papéis e permissões para Laravel.",
      },
    },
    {
      name: "Colombia Icons",
      url: "https://github.com/Mteheran/colombia-icons",
      category: "libraries",
      creator: C.miguel,
      tags: ["React", "Angular", "Blazor"],
      description: {
        es: "Librería de íconos SVG de estilo lineal inspirados en la cultura, naturaleza y tradiciones de Colombia, disponible para React, Angular y Blazor.",
        en: "Line-style SVG icon library inspired by Colombian culture, nature and traditions, available for React, Angular and Blazor.",
        pt: "Biblioteca de ícones SVG de estilo linear inspirados na cultura, natureza e tradições da Colômbia, disponível para React, Angular e Blazor.",
      },
    },
    {
      name: "API-Colombia",
      url: "https://github.com/miguel-teheran/colombia-api",
      category: "apis",
      creator: C.miguel,
      tags: ["REST", "Open Data"],
      featured: true,
      description: {
        es: "API REST que expone datos públicos y turísticos de Colombia (departamentos, ciudades, platos típicos, parques).",
        en: "REST API that exposes public and tourist data of Colombia (departments, cities, typical dishes, parks).",
        pt: "API REST que expõe dados públicos e turísticos da Colômbia (departamentos, cidades, pratos típicos, parques).",
      },
    },
    {
      name: "Bogotá Apartments",
      url: "https://github.com/builker-col/bogota-apartments",
      category: "apis",
      creator: C.builker,
      tags: ["Scraping", "Datos"],
      description: {
        es: "Proyecto de scraping y análisis de datos sobre el mercado de apartamentos en Bogotá.",
        en: "Scraping and data analysis project about the apartment market in Bogotá.",
        pt: "Projeto de scraping e análise de dados sobre o mercado de apartamentos em Bogotá.",
      },
    },
    {
      name: "React Native InAppBrowser",
      url: "https://github.com/proyecto26/react-native-inappbrowser",
      category: "mobile",
      creator: C.jd,
      tags: ["React Native"],
      description: {
        es: "Plugin para abrir navegadores embebidos dentro de apps React Native, útil para pagos, OAuth, etc.",
        en: "Plugin to open embedded browsers inside React Native apps, useful for payments, OAuth, etc.",
        pt: "Plugin para abrir navegadores embutidos dentro de apps React Native, útil para pagamentos, OAuth, etc.",
      },
    },
    {
      name: "RestClient for Unity",
      url: "https://github.com/proyecto26/RestClient",
      category: "mobile",
      creator: C.jd,
      tags: ["Unity", "HTTP"],
      description: {
        es: "Cliente HTTP con soporte para promesas, diseñado para facilitar el consumo de APIs desde Unity.",
        en: "HTTP client with promise support, designed to make consuming APIs from Unity easier.",
        pt: "Cliente HTTP com suporte a promises, projetado para facilitar o consumo de APIs a partir do Unity.",
      },
    },
    {
      name: "ADVAD",
      url: "https://github.com/ADVAD1D/ADVAD1D",
      category: "games",
      creator: C.angel,
      tags: ["Godot"],
      description: {
        es: "Videojuego de naves 2D estilo arcade retro (shader CRT) desarrollado en Godot Engine, con progresión por fases y 20 naves seleccionables.",
        en: "Retro arcade-style 2D spaceship shooter (CRT shader) built with the Godot Engine, featuring phase-based progression and 20 selectable ships.",
        pt: "Jogo de naves 2D estilo arcade retrô (shader CRT) desenvolvido na Godot Engine, com progressão por fases e 20 naves selecionáveis.",
      },
    },
    {
      name: "Angular File Generator",
      url: "https://github.com/ManuelGil/vscode-angular-generator",
      category: "extensions",
      creator: C.manuel,
      tags: ["VS Code", "Angular"],
      description: {
        es: "Extensión de VS Code para generar archivos Angular con pocos clics, basada en Angular CLI y sus schematics.",
        en: "VS Code extension to generate Angular files in a few clicks, based on Angular CLI and its schematics.",
        pt: "Extensão do VS Code para gerar arquivos Angular com poucos cliques, baseada no Angular CLI e seus schematics.",
      },
    },
    {
      name: "JSON Flow",
      url: "https://github.com/ManuelGil/vscode-json-flow",
      category: "extensions",
      creator: C.manuel,
      tags: ["VS Code", "JSON"],
      description: {
        es: "Transforma archivos JSON en gráficos interactivos basados en nodos directamente en VS Code.",
        en: "Transforms JSON files into interactive node-based graphs directly in VS Code.",
        pt: "Transforma arquivos JSON em gráficos interativos baseados em nós diretamente no VS Code.",
      },
    },
    {
      name: "Astro File Generator",
      url: "https://github.com/ManuelGil/vscode-astro-generator",
      category: "extensions",
      creator: C.manuel,
      tags: ["VS Code", "Astro"],
      description: {
        es: "Extensión de VS Code para generar archivos Astro automáticamente basados en plantillas.",
        en: "VS Code extension to automatically generate Astro files based on templates.",
        pt: "Extensão do VS Code para gerar arquivos Astro automaticamente com base em modelos.",
      },
    },
    {
      name: "Mustache Snippets",
      url: "https://github.com/ManuelGil/vscode-mustache-snippets",
      category: "extensions",
      creator: C.manuel,
      tags: ["VS Code", "Mustache"],
      description: {
        es: "Soporte para el motor de plantillas Mustache en VS Code con resaltado de sintaxis y autocompletado.",
        en: "Support for the Mustache template engine in VS Code with syntax highlighting and autocompletion.",
        pt: "Suporte para o motor de templates Mustache no VS Code com realce de sintaxe e autocompletar.",
      },
    },
    {
      name: "Moodle Snippets",
      url: "https://github.com/ManuelGil/vscode-moodle-snippets",
      category: "extensions",
      creator: C.manuel,
      tags: ["VS Code", "Moodle"],
      description: {
        es: "Snippets de Moodle para archivos PHP, XML y Mustache, con comandos para crear nuevos archivos.",
        en: "Moodle snippets for PHP, XML and Mustache files, with commands to create new files.",
        pt: "Snippets de Moodle para arquivos PHP, XML e Mustache, com comandos para criar novos arquivos.",
      },
    },
    {
      name: "Next.js File Generator",
      url: "https://github.com/ManuelGil/vscode-nextjs-generator",
      category: "extensions",
      creator: C.manuel,
      tags: ["VS Code", "Next.js"],
      description: {
        es: "Extensión de VS Code para generar archivos de proyectos T3 Stack: Next.js, NextAuth, Prisma, tRPC y más.",
        en: "VS Code extension to generate T3 Stack project files: Next.js, NextAuth, Prisma, tRPC and more.",
        pt: "Extensão do VS Code para gerar arquivos de projetos T3 Stack: Next.js, NextAuth, Prisma, tRPC e mais.",
      },
    },
    {
      name: "Auto Barrel",
      url: "https://github.com/ManuelGil/vscode-auto-barrel",
      category: "extensions",
      creator: C.manuel,
      tags: ["VS Code", "TypeScript"],
      description: {
        es: "Extensión de VS Code para crear y mantener archivos barrel (index.ts) en proyectos TypeScript/JavaScript.",
        en: "VS Code extension to create and maintain barrel files (index.ts) in TypeScript/JavaScript projects.",
        pt: "Extensão do VS Code para criar e manter arquivos barrel (index.ts) em projetos TypeScript/JavaScript.",
      },
    },
    {
      name: "FastAPI Cloud",
      url: "https://fastapicloud.com",
      category: "services",
      creator: C.sebastian,
      tags: ["Python", "PaaS"],
      description: {
        es: "Plataforma comercial de despliegue en la nube del equipo de FastAPI. No es open source, pero es el principal patrocinador de FastAPI y de los demás proyectos open source del equipo.",
        en: "Commercial cloud deployment platform from the FastAPI team. It is not open source, but it is the main sponsor of FastAPI and the team's other open source projects.",
        pt: "Plataforma comercial de deploy na nuvem da equipe do FastAPI. Não é open source, mas é o principal patrocinador do FastAPI e dos demais projetos open source da equipe.",
      },
    },
    {
      name: "GeoJson de Colombia",
      url: "https://gist.github.com/john-guerra/43c7656821069d00dcbc",
      category: "recursos",
      creator: C.john,
      tags: ["GeoJSON", "D3.js"],
      description: {
        es: "Archivo GeoJSON con los límites geográficos de los departamentos de Colombia, listo para usar en mapas y visualizaciones con D3.js, Power BI, Metabase y otras herramientas.",
        en: "GeoJSON file with the geographic boundaries of Colombia's departments, ready to use in maps and visualizations with D3.js, Power BI, Metabase and other tools.",
        pt: "Arquivo GeoJSON com os limites geográficos dos departamentos da Colômbia, pronto para usar em mapas e visualizações com D3.js, Power BI, Metabase e outras ferramentas.",
      },
    },
  ];
})();
