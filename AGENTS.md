# AGENTS.md

Guía para agentes de IA y personas colaboradoras sobre cómo está construido y
cómo se mantiene el proyecto **Proyectos Open Source Colombianos**.

---

## 1. Propósito del proyecto

Este repositorio es un **directorio curado de proyectos open source colombianos**
(bibliotecas, APIs, herramientas móviles, extensiones y servicios). Tiene dos
caras:

1. **READMEs** — el listado en formato Markdown, pensado para leerse en GitHub.
   Es la fuente "editorial" del catálogo, en dos idiomas espejo:
   - `README.md` — español (fuente principal).
   - `README.en.md` — inglés (traducción espejo del anterior).
2. **`site/`** — un sitio web estático que presenta el mismo catálogo de forma
   interactiva (búsqueda, filtros, multi-idioma y modo claro/oscuro).

> ⚠️ **Regla clave:** el catálogo vive en **tres archivos** que describen lo
> mismo — `README.md`, `README.en.md` y `site/js/data.js`. Cuando se agrega,
> edita o elimina un proyecto, **los tres deben actualizarse a la vez** para no
> quedar desincronizados.
>
> 💡 Para agregar un proyecto, usa el skill **`add-project`**
> (`.claude/skills/add-project/`): automatiza este flujo, mantiene la sincronía
> y **pregunta el creador y la categoría si no se pueden determinar**. Ver la
> sección 5.

---

## 2. Estructura del repositorio

```
opensource-colombia/
├── README.md                     # Catálogo en español (fuente editorial)
├── README.en.md                  # Catálogo en inglés (espejo del README)
├── AGENTS.md                     # Este archivo
├── .claude/
│   └── skills/
│       └── add-project/
│           └── SKILL.md          # Skill: agrega un proyecto sincronizando todo
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: despliegue a GitHub Pages
└── site/                         # Sitio web estático (sin build step)
    ├── index.html                # Estructura semántica y accesible
    ├── css/
    │   └── styles.css            # Estilos + temas claro/oscuro
    └── js/
        ├── data.js               # DATOS: lista de proyectos (i18n)
        ├── i18n.js               # Textos de la interfaz (es/en/pt)
        └── app.js                # Lógica: render, tema, idioma, filtros
```

El sitio es **HTML/CSS/JS puro (vanilla)**: no hay framework, ni bundler, ni
paso de compilación. Se puede abrir con cualquier servidor de archivos estático.

---

## 3. El catálogo (`README.md` y `README.en.md`)

Se organiza en secciones por categoría. Ambos READMEs son **espejos**: tienen las
mismas secciones y proyectos, cada uno en su idioma, enlazados entre sí con un
selector de idioma al inicio (`🌐 Léelo en otros idiomas` / `🌐 Read this in
other languages`). Cada proyecto sigue **exactamente** este formato:

```markdown
### 🔹 [Nombre del proyecto](https://url-del-proyecto)
- **Descripción:** Una frase clara de qué es y para qué sirve.
- **Categoría:** Etiqueta corta de la categoría.
- **Creador:** Nombre de la persona o comunidad.
```

En `README.en.md` las etiquetas van en inglés (`Description`, `Category`,
`Creator`) y el contenido traducido.

### Secciones actuales

| Emoji | Sección                              | `category` en `data.js` |
| ----- | ------------------------------------ | ----------------------- |
| 📚    | Bibliotecas y Frameworks             | `libraries`             |
| 🛰️    | APIs y Datos Abiertos                | `apis`                  |
| 📱    | Desarrollo Móvil, Juegos y Herramientas | `mobile`             |
| 🧩    | Extensiones y Utilidades             | `extensions`            |
| ☁️    | Servicios y Proveedores              | `services`              |

> La sección **Servicios y Proveedores** puede incluir proyectos **comerciales**
> (no open source) cuando son relevantes para el ecosistema —por ejemplo, como
> patrocinadores—. En esos casos se debe **indicar explícitamente que no son
> open source** en la descripción (ver `FastAPI Cloud`).

---

## 4. El sitio web (`site/`)

### 4.1 Datos de proyectos — `site/js/data.js`

Expone un arreglo global `window.PROJECTS`. Cada proyecto es un objeto:

```js
{
  name: "Nombre del proyecto",
  url: "https://url-del-proyecto",
  category: "libraries", // libraries | apis | mobile | extensions | services
  creator: "Nombre del creador",
  description: {
    es: "Descripción en español.",
    en: "Description in English.",
    pt: "Descrição em português.",
  },
}
```

- `category` **debe** ser una de las cinco claves válidas.
- `description` **debe** incluir las tres claves de idioma: `es`, `en`, `pt`.

### 4.2 Textos de la interfaz — `site/js/i18n.js`

Expone `window.I18N` con un objeto por idioma (`es`, `en`, `pt`). Contiene todo
el texto de la UI (títulos, etiquetas, placeholders, nombres de categorías,
mensajes) y funciones como `resultsCount(n)`. Los nombres de categoría del
`<select>` y de los badges salen de `I18N[lang].categories`.

Si se agrega una **nueva categoría**, hay que actualizar:
1. `CATEGORY_ORDER` en `app.js`.
2. La clave dentro de `categories` en **cada** idioma de `i18n.js`.

### 4.3 Lógica — `site/js/app.js`

IIFE en modo estricto, sin dependencias. Responsabilidades:

- **Idioma:** detecta el idioma del navegador, permite ES/EN/PT y lo persiste en
  `localStorage` (`oscol-lang`). Actualiza el atributo `lang` del `<html>` y todo
  el texto marcado con `data-i18n` / `data-i18n-attr`.
- **Tema:** claro/oscuro; respeta `prefers-color-scheme` y persiste en
  `localStorage` (`oscol-theme`). Aplica `data-theme` en `<html>`.
- **Búsqueda:** filtra en vivo por `name`, `creator` y la descripción del idioma
  activo.
- **Filtro por categoría:** `<select>` alimentado desde `CATEGORY_ORDER`.
- **Render:** construye las tarjetas con la API del DOM (no `innerHTML` con datos)
  y actualiza el contador de resultados y el estado vacío.

### 4.4 Estilos — `site/css/styles.css`

- Variables CSS en `:root` (tema claro) y `:root[data-theme="dark"]` (oscuro).
- Rejilla responsiva de tarjetas, controles y cabecera.
- Accesibilidad: `:focus-visible`, `skip-link`, soporte de
  `prefers-reduced-motion`, contraste objetivo **AA**.

---

## 5. Cómo agregar un proyecto

### Vía recomendada: el skill `add-project`

Existe un skill dedicado en `.claude/skills/add-project/` que automatiza todo
este flujo: reúne y verifica los datos, **pregunta el creador y/o la categoría si
no puede determinarlos con certeza**, escribe la entrada en los tres archivos y
comprueba la sincronía. Se activa cuando se pide "agregar/añadir un proyecto" al
directorio, incluso dando solo el nombre o la URL. Úsalo por defecto.

> El skill es de proyecto, así que para que Claude Code lo detecte debes iniciar
> la sesión dentro de la carpeta `opensource-colombia/`.

### Checklist manual (si no se usa el skill)

1. **`README.md`** → añade el bloque en la sección/categoría correcta (en
   español), siguiendo el formato de la sección 3.
2. **`README.en.md`** → añade el mismo bloque en la sección equivalente, en
   inglés.
3. **`site/js/data.js`** → añade el objeto del proyecto con `category` válida y
   `description` en `es`, `en` y `pt`.
4. Verifica que la `category` coincida entre los **tres** archivos.
5. Prueba el sitio localmente (sección 6) y confirma que el proyecto aparece,
   se filtra y se busca correctamente en los tres idiomas.

> Para **datos de un proyecto real** (URL, creador, descripción), verifica la
> información contra la fuente oficial (repositorio/sitio) antes de escribirla.
> Si no puedes determinar con certeza el creador o la categoría, **pregunta**.

---

## 6. Ejecutar el sitio localmente

El sitio necesita servirse por HTTP (abrirlo como `file://` **no** carga bien el
CSS/JS relativo). Desde la carpeta `site/`:

```bash
cd site && python3 -m http.server 8899
```

Luego abre `http://localhost:8899/`.

Cualquier servidor estático equivalente funciona (por ejemplo `npx serve`).

---

## 7. Despliegue — `.github/workflows/deploy.yml`

- **Qué hace:** publica la carpeta `site/` en **GitHub Pages**.
- **Cuándo se ejecuta:** en cada `push` a `main` que toque `site/**` o el propio
  workflow, y también de forma manual (`workflow_dispatch`).
- **Requisito de configuración:** en GitHub → **Settings → Pages → Source:
  GitHub Actions** debe estar habilitado para que el despliegue funcione.
- Usa permisos mínimos (`pages: write`, `id-token: write`) y `concurrency` para
  evitar despliegues simultáneos.

Si cambias la carpeta de origen del sitio, actualiza la ruta `path: ./site` del
job `build`.

---

## 8. Convenciones y estilo

- **Idiomas soportados:** español (por defecto/editorial), inglés y portugués.
  Todo texto visible en el sitio debe existir en los tres.
- **Comentarios de código:** en español, acordes al resto del repositorio.
- **Sin dependencias nuevas** en el sitio salvo que sea imprescindible: se busca
  mantenerlo como HTML/CSS/JS estático y desplegable sin build.
- **Accesibilidad primero:** conserva roles ARIA, `aria-live`, foco visible,
  `skip-link` y buen contraste al hacer cambios de UI.
- **Sincronía `README.md` ↔ `README.en.md` ↔ `data.js`:** ver la regla clave de
  la sección 1.

---

## 9. Resumen para el agente

Antes de dar por terminada una tarea que toque el catálogo o el sitio:

- [ ] ¿`README.md`, `README.en.md` y `site/js/data.js` quedaron sincronizados?
- [ ] ¿La `category` usada es válida y existe en `i18n.js` (los 3 idiomas)?
- [ ] ¿Las descripciones están en `es`, `en` y `pt`?
- [ ] ¿Probaste el sitio localmente (render, búsqueda, filtro, idioma, tema)?
- [ ] Si tocaste el flujo de despliegue, ¿sigue apuntando a `./site`?
