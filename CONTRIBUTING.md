# 🤝 Guía de contribución

¡Gracias por tu interés en **Proyectos Open Source Colombianos**! 🇨🇴
Este repositorio es un **directorio curado** de proyectos open source colombianos
(bibliotecas, APIs, herramientas, extensiones y servicios) con dos caras: los
**READMEs** (`README.md` en español y `README.en.md` en inglés) y un **sitio web
estático** en `site/`.

Toda contribución es bienvenida: agregar un proyecto, corregir datos, mejorar el
sitio, traducir o reportar un problema.

> 📖 Para el detalle técnico de cómo está construido el proyecto, consulta
> [`AGENTS.md`](AGENTS.md).

---

## 📌 Regla clave: el catálogo vive en tres archivos

El listado de proyectos está descrito **en tres lugares que deben mantenerse
sincronizados**:

1. `README.md` — catálogo en **español** (fuente editorial).
2. `README.en.md` — catálogo en **inglés** (espejo del anterior).
3. `site/js/data.js` — los mismos datos para el **sitio web**.

⚠️ Cuando agregues, edites o elimines un proyecto, **los tres deben actualizarse
a la vez** para no quedar desincronizados.

---

## ➕ Agregar un proyecto al directorio

El proyecto debe ser: de **código abierto**, **gratuito**, con **actividad
reciente** y **relevante** para desarrolladores o comunidades. (La sección
*Servicios y Proveedores* admite proyectos comerciales relevantes, indicando
**explícitamente** que no son open source.)

### 1. `README.md` (español) y `README.en.md` (inglés)

Añade el bloque en la sección/categoría correcta, siguiendo **exactamente** este
formato:

```markdown
### 🔹 [Nombre del proyecto](https://url-del-proyecto)
- **Descripción:** Una frase clara de qué es y para qué sirve.
- **Categoría:** Etiqueta corta de la categoría.
- **Creador:** Nombre de la persona o comunidad.
```

En `README.en.md` las etiquetas van en inglés (`Description`, `Category`,
`Creator`) y el contenido traducido.

### 2. `site/js/data.js`

Añade el objeto del proyecto con una `category` válida y la descripción en los
**tres idiomas**:

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

### 3. Actualiza los totales

En **ambos** READMEs, actualiza a mano la línea
`📊 Totales: N proyectos · M categorías`. (En el sitio los totales se calculan
solos.)

### Categorías válidas

| Emoji | Sección                                 | `category` en `data.js` |
| ----- | --------------------------------------- | ----------------------- |
| 📚    | Bibliotecas y Frameworks                | `libraries`             |
| 🛰️    | APIs y Datos Abiertos                   | `apis`                  |
| 📱    | Desarrollo Móvil, Juegos y Herramientas | `mobile`                |
| 🎮    | Videojuegos                             | `games`                 |
| 🧩    | Extensiones y Utilidades                | `extensions`            |
| ☁️    | Servicios y Proveedores                 | `services`              |

> 💡 Verifica los datos (URL, creador, descripción) contra la fuente oficial
> (repositorio o sitio) antes de escribirlos.

---

## 🖥️ Ejecutar el sitio localmente

El sitio necesita servirse por HTTP (abrirlo como `file://` **no** carga bien el
CSS/JS relativo). Desde la carpeta `site/`:

```bash
cd site && python3 -m http.server 8899
```

Luego abre `http://localhost:8899/` y comprueba que el proyecto aparece, se
**busca** y se **filtra** correctamente en los **tres idiomas** (ES/EN/PT) y en
ambos temas (claro/oscuro).

---

## 🔀 Enviar tu contribución (Pull Request)

1. Haz **fork** del repositorio y crea una rama descriptiva
   (`git checkout -b agrega-proyecto-x`).
2. Realiza tus cambios respetando la **sincronía de los tres archivos**.
3. Prueba el sitio localmente.
4. Haz commit y abre un **Pull Request** hacia `main` describiendo qué agregas o
   cambias.

---

## 🌟 Reconocimiento de contribuidores (All Contributors)

Este proyecto usa la especificación
[All Contributors](https://allcontributors.org/) para reconocer **todo** tipo de
aportes, no solo código (documentación, diseño, traducción, ideas, etc.).

Cuando tu contribución se integre, para añadirte a la tabla comenta en el issue o
PR correspondiente:

```
@all-contributors please add @tu-usuario for code, doc
```

El bot abrirá un PR actualizando la tabla de contribuidores en ambos READMEs
automáticamente. Consulta los tipos de contribución en la
[tabla de emojis](https://allcontributors.org/docs/en/emoji-key) (por ejemplo:
`code` 💻, `doc` 📖, `design` 🎨, `content` 🖋, `translation` 🌍, `ideas` 🤔).

---

## 🐛 Reportar problemas

¿Encontraste un enlace roto, un dato desactualizado o un error en el sitio? Abre
un [issue](https://github.com/Mteheran/opensource-colombia/issues) describiendo
el problema con el mayor detalle posible.

---

¡Gracias por ayudar a dar visibilidad al talento open source colombiano! 🇨🇴💙
