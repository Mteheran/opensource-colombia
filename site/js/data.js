// Lista de proyectos open source colombianos.
// Cada proyecto incluye descripción en los tres idiomas soportados (es, en, pt).
window.PROJECTS = [
  {
    name: "FastAPI",
    url: "https://github.com/tiangolo/fastapi",
    category: "libraries",
    creator: "Sebastián Ramírez",
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
    creator: "Sebastián Ramírez",
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
    creator: "Sebastián Ramírez",
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
    creator: "Kevin Amado (kamadorueda)",
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
    creator: "Santiago García",
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
    creator: "Miguel Teheran",
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
    creator: "Miguel Teheran",
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
    creator: "Comunidad Builker-Col",
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
    creator: "J.D. Nicholls (Proyecto26)",
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
    creator: "J.D. Nicholls (Proyecto26)",
    description: {
      es: "Cliente HTTP con soporte para promesas, diseñado para facilitar el consumo de APIs desde Unity.",
      en: "HTTP client with promise support, designed to make consuming APIs from Unity easier.",
      pt: "Cliente HTTP com suporte a promises, projetado para facilitar o consumo de APIs a partir do Unity.",
    },
  },
  {
    name: "Angular File Generator",
    url: "https://github.com/ManuelGil/vscode-angular-generator",
    category: "extensions",
    creator: "Manuel Gil",
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
    creator: "Manuel Gil",
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
    creator: "Manuel Gil",
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
    creator: "Manuel Gil",
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
    creator: "Manuel Gil",
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
    creator: "Manuel Gil",
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
    creator: "Manuel Gil",
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
    creator: "Sebastián Ramírez y el equipo de FastAPI",
    description: {
      es: "Plataforma comercial de despliegue en la nube del equipo de FastAPI. No es open source, pero es el principal patrocinador de FastAPI y de los demás proyectos open source del equipo.",
      en: "Commercial cloud deployment platform from the FastAPI team. It is not open source, but it is the main sponsor of FastAPI and the team's other open source projects.",
      pt: "Plataforma comercial de deploy na nuvem da equipe do FastAPI. Não é open source, mas é o principal patrocinador do FastAPI e dos demais projetos open source da equipe.",
    },
  },
];
