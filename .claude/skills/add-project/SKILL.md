---
name: add-project
description: >-
  Agrega un nuevo proyecto al directorio Open Source Colombia manteniendo
  sincronizados los tres lugares donde vive el catálogo: README.md (español),
  README.en.md (inglés) y site/js/data.js (sitio web). Usa este skill SIEMPRE
  que el usuario pida agregar, añadir, registrar o incluir un proyecto,
  biblioteca, API, herramienta, extensión o servicio en el listado/directorio,
  aunque solo mencione el nombre o la URL del proyecto. Si falta el creador o la
  categoría, el skill los pregunta antes de escribir. También aplica cuando el
  usuario diga "agrega X al readme" o "añade este repo a la lista".
---

# Agregar un proyecto al directorio Open Source Colombia

Este directorio existe en **tres lugares que describen el mismo catálogo** y que
deben quedar siempre sincronizados. El error más común y más costoso al agregar
un proyecto es actualizar solo uno o dos de ellos, dejando el catálogo
inconsistente. Por eso el objetivo central de este skill es: **un proyecto nuevo
se refleja en los tres archivos, en la misma categoría, con datos verificados.**

Los tres lugares son:

1. `README.md` — catálogo en **español** (fuente editorial principal).
2. `README.en.md` — catálogo en **inglés** (traducción espejo del anterior).
3. `site/js/data.js` — datos del **sitio web** (con descripción en los 3 idiomas).

## Datos que necesita un proyecto

Cada proyecto se describe con cinco campos. Antes de escribir nada, asegúrate de
tenerlos todos:

- **Nombre** — cómo se llama el proyecto.
- **URL** — enlace al repositorio o sitio oficial.
- **Categoría** — una de las cinco válidas (ver tabla abajo).
- **Creador** — persona o comunidad que lo creó/mantiene.
- **Descripción** — una frase clara de qué es y para qué sirve.

### Categorías válidas

La `category` en `data.js` debe ser exactamente una de estas claves. Debe
coincidir con la sección correspondiente en ambos READMEs:

| `category`   | Sección ES (README.md)                  | Sección EN (README.en.md)               |
| ------------ | --------------------------------------- | --------------------------------------- |
| `libraries`  | 📚 Bibliotecas y Frameworks             | 📚 Libraries & Frameworks               |
| `apis`       | 🛰️ APIs y Datos Abiertos                | 🛰️ APIs & Open Data                      |
| `mobile`     | 📱 Desarrollo Móvil, Juegos y Herramientas | 📱 Mobile Development, Games & Tools  |
| `extensions` | 🧩 Extensiones y Utilidades             | 🧩 Extensions & Utilities               |
| `services`   | ☁️ Servicios y Proveedores              | ☁️ Services & Providers                 |

## Flujo de trabajo

### 1. Reúne y verifica los datos

Si el usuario dio poco (por ejemplo solo un nombre o una URL), **investiga la
fuente oficial** (repositorio en GitHub, sitio del proyecto) para completar la
descripción y confirmar el creador. No inventes datos: si algo no se puede
verificar, es mejor preguntar.

### 2. Pregunta lo que falte — regla obligatoria

**Si después de investigar no tienes con certeza el creador o la categoría, PREGUNTA
al usuario antes de escribir.** No adivines ni asumas.

- Si falta el **creador**: pregunta quién creó o mantiene el proyecto.
- Si falta o es ambigua la **categoría**: ofrece las cinco opciones de la tabla y
  pide que elija.

Puedes preguntar ambas cosas a la vez. No continúes al paso 3 hasta tenerlas.

### 3. Prepara la descripción en tres idiomas

El sitio necesita la descripción en español, inglés y portugués. Redáctalas de
forma equivalente y natural en cada idioma (no una traducción literal forzada).
Los READMEs usan solo su idioma: español en `README.md`, inglés en
`README.en.md`.

### 4. Escribe en los tres archivos

Agrega el proyecto en la sección/categoría correcta de cada archivo, respetando
el formato exacto que ya usan las demás entradas.

**`README.md`** (dentro de la sección en español correspondiente):

```markdown
### 🔹 [Nombre](https://url)
- **Descripción:** Descripción en español.
- **Categoría:** Etiqueta corta descriptiva.
- **Creador:** Nombre del creador.
```

**`README.en.md`** (dentro de la sección en inglés correspondiente):

```markdown
### 🔹 [Name](https://url)
- **Description:** Description in English.
- **Category:** Short descriptive label.
- **Creator:** Creator name.
```

**`site/js/data.js`** (un objeto dentro del arreglo `window.PROJECTS`, junto a los
demás de su categoría):

```js
{
  name: "Nombre",
  url: "https://url",
  category: "libraries", // libraries | apis | mobile | extensions | services
  creator: "Nombre del creador",
  description: {
    es: "Descripción en español.",
    en: "Description in English.",
    pt: "Descrição em português.",
  },
},
```

> Nota sobre la categoría **`services`**: puede incluir proyectos **comerciales**
> (no open source) cuando son relevantes para el ecosistema. En ese caso, deja
> **explícito en la descripción que no es open source** (por ejemplo, como
> FastAPI Cloud, que es el patrocinador de FastAPI).

### 5. Verifica la sincronía

Antes de terminar, confirma:

- [ ] El proyecto aparece en los **tres** archivos.
- [ ] La `category` de `data.js` coincide con la sección usada en ambos READMEs.
- [ ] `data.js` tiene las tres descripciones (`es`, `en`, `pt`).
- [ ] La sintaxis de `data.js` es válida (comas, llaves, comillas correctas).

Opcionalmente, para comprobar el sitio en vivo:

```bash
cd site && python3 -m http.server 8899
```

y abrir `http://localhost:8899/` para ver que el proyecto se muestra, se filtra
por su categoría y aparece en la búsqueda.

## Ejemplo de interacción

**Usuario:** "Agrega el proyecto https://github.com/foo/bar a la lista"

**Respuesta esperada:** Investigar el repositorio. Si de ahí se obtiene la
descripción pero no queda clara la categoría ni el creador, preguntar:
"¿Quién creó `bar` y en qué categoría lo ubico? (Bibliotecas, APIs, Móvil,
Extensiones o Servicios)". Con la respuesta, escribir la entrada en `README.md`,
`README.en.md` y `site/js/data.js`, y confirmar la sincronía.
