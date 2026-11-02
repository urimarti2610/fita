# Proyecto: herramientas de lectura para TDAH y dislexia (nombre provisional: `fita`)

Este documento es el encargo completo para Claude Code. Léelo entero antes de empezar.

## 1. Qué construimos

Un conjunto de herramientas **libres, gratuitas y open source** que ayudan a leer a personas con TDAH y dislexia. La función principal es destacar el inicio de cada palabra (por ejemplo en negrita) para guiar la vista. Funciona **donde la persona ya lee**: en la web, en sus ebooks y, más adelante, en el móvil.

Piezas de la primera versión:

1. **Núcleo** (`packages/core`): librería TypeScript que decide qué parte de cada palabra se destaca.
2. **Extensión de navegador** (`apps/extension`): Chrome, Edge y Firefox (incluido Firefox para Android). Botón para activar y desactivar.
3. **Web** (`apps/web`): landing page en **Astro**, con demo en vivo y conversor de ebooks que funciona en el navegador.

El nombre `fita` es provisional. Úsalo solo a través de una constante o configuración central (`packages/core/src/brand.ts` y `apps/*/brand.*`) para poder cambiarlo en un minuto.

## 2. Reglas que no se rompen

1. **Todo en el cliente.** Ningún servidor, backend, base de datos, función serverless ni API propia. La web es estática (GitHub Pages). Los archivos del usuario nunca salen de su dispositivo.
2. **Sin límites.** Ni de palabras, ni de tamaño de archivo, ni de número de usos, ni de idiomas, ni funciones de pago. Nada de cuentas ni registro. El único límite aceptable es la memoria del dispositivo, y el código debe estar pensado para no agotarla (procesar por partes, ver §5 y §6).
3. **Privacidad total.** Sin analítica, sin cookies, sin telemetría, sin fuentes ni scripts de CDNs externos (todo empaquetado). Permisos mínimos en la extensión.
4. **GitHub público.** Todo el código, la documentación y las decisiones viven en un repositorio público.
5. **Legal.**
   - Nunca usar el nombre "Bionic Reading", ni el logo, ni la palabra "bionic", ni compararnos con ellos por su nombre en textos, código, metadatos o tiendas. Es una marca registrada.
   - Hablar del producto como "ayudas de lectura", "énfasis de palabras", "puntos de anclaje".
   - Ofrecer varios estilos de énfasis (negrita, color, subrayado suave, opacidad del resto de la palabra), no solo uno.
   - No prometer "leer más rápido". Prometer "leer más cómodo, a tu manera". Los estudios no muestran mejora media de velocidad.
6. **Accesibilidad.** El texto procesado debe seguir leyéndose bien con lectores de pantalla, ser usable solo con teclado, tener buen contraste y funcionar en modo oscuro.

## 3. Stack y estructura

- Monorepo con **pnpm workspaces**. Node 22 LTS.
- **TypeScript** estricto en todo.
- Tests con **Vitest** (+ **happy-dom** para tests de DOM). Tests E2E con **Playwright**.
- Extensión empaquetada con **esbuild**.
- Web con **Astro** (versión estable más reciente), salida 100 % estática.
- Lectura y escritura de EPUB con **JSZip**.
- Lint y formato: **Biome** (una sola herramienta, sin configuración extensa).

```
/
├─ CLAUDE.md                 ← este documento
├─ README.md                 ← en inglés, con secciones resumidas en español y catalán
├─ LICENSE                   ← MPL-2.0
├─ CONTRIBUTING.md
├─ CODE_OF_CONDUCT.md
├─ PRIVACY.md                ← "no recogemos ningún dato", explicado en llano
├─ packages/
│  └─ core/                  ← librería; publicable en npm más adelante
├─ apps/
│  ├─ extension/             ← MV3, build para chrome/ y firefox/
│  └─ web/                   ← Astro: landing, demo, conversor
└─ .github/workflows/        ← CI, despliegue de la web, release de la extensión
```

## 4. Núcleo (`packages/core`)

### API pública

```ts
type EmphasisOptions = {
  strength: number; // 0.2–0.7: fracción de la palabra a destacar. Por defecto 0.4
  minWordLength: number; // palabras más cortas: se destaca 1 grafema. Por defecto 1
  every: number; // destacar 1 de cada N palabras. Por defecto 1 (todas)
  skipNumbers: boolean; // por defecto true
  locale?: string; // BCP-47; si falta, autodetectar o usar el del documento
};

type Span = { text: string; emphasis: boolean };

function emphasize(text: string, options?: Partial<EmphasisOptions>): Span[];
function toHTML(text: string, options?: Partial<EmphasisOptions>, tag?: string): string; // escapa HTML
function applyToElement(root: Element, options?: Partial<EmphasisOptions>): Controller; // DOM
// Controller: { stop(): void; undo(): void; update(options): void }
```

### Algoritmo

1. Dividir en palabras con `Intl.Segmenter(locale, { granularity: "word" })`. Solo se procesan los segmentos con `isWordLike`. El resto (espacios, puntuación) pasa intacto.
2. Contar **grafemas**, no caracteres, con `Intl.Segmenter(..., { granularity: "grapheme" })`. Nunca partir una letra con tilde compuesta, un emoji ni una ligadura.
3. Grafemas a destacar = `max(1, round(longitud × strength))`, sin superar `longitud − 1` cuando la palabra tenga 2 o más grafemas (siempre queda al menos uno sin destacar).
4. No destacar:
   - números y palabras con dígitos (si `skipNumbers`);
   - URLs, emails, rutas y código (detectarlos a nivel de texto antes de segmentar);
   - escrituras sin espacios entre palabras: Han, Hiragana, Katakana, Thai, Lao, Khmer, Myanmar (usar `\p{Script=...}`); en esos textos el núcleo devuelve el texto sin cambios.
5. Derecha a izquierda (árabe, hebreo): trabajar en orden lógico; el inicio lógico es el correcto. No tocar la dirección del texto.
6. `every > 1`: contar solo palabras procesables.

### Tests obligatorios

Casos en español, catalán (`l·l`, `l'àvia`, `d'una`), inglés, ruso (cirílico), polaco, griego, árabe, hebreo, chino, japonés y emojis. También: números, URLs, cadena vacía, un texto de 5 MB (debe terminar sin error y en tiempo razonable) y que `toHTML` escape `<`, `>` y `&`. Pon objetivo de cobertura ≥ 90 % en el núcleo.

## 5. Aplicar a páginas web (`applyToElement`, en el núcleo)

- Recorrer nodos de texto con `TreeWalker`.
- **No tocar:** `script`, `style`, `noscript`, `textarea`, `input`, `select`, `option`, `code`, `pre`, `kbd`, `samp`, `svg`, `math`, `canvas`, `iframe`, elementos `[contenteditable]`, `[aria-hidden="true"]`, nodos ya procesados y editores de código conocidos (`.CodeMirror`, `.monaco-editor`, `.cm-editor`).
- Envolver cada nodo de texto en un elemento personalizado `<fita-w>` y las partes destacadas en `<fita-e>`. Así el CSS de la página no les afecta. Los estilos se inyectan una vez con una hoja propia (`adoptedStyleSheets` si es posible).
- **Deshacer** = sustituir cada `<fita-w>` por un nodo de texto con su `textContent` y llamar a `normalize()` en el padre. La página debe quedar idéntica a como estaba.
- **Rendimiento sin límites:** procesar por lotes (por ejemplo 300 nodos) con `requestIdleCallback` (fallback a `setTimeout`) para no bloquear la página aunque tenga cientos de miles de palabras. Priorizar lo visible con `IntersectionObserver` cuando sea útil.
- **Contenido dinámico:** `MutationObserver` para procesar lo que se añade (scroll infinito, SPAs), ignorando las mutaciones propias.
- **Lectores de pantalla:** comprobar con un test que `textContent` del contenedor no cambia y documentar la prueba manual con NVDA/VoiceOver en `docs/accessibility.md`.

## 6. Extensión (`apps/extension`)

- **Manifest V3.** Un único código fuente; el build genera `dist/chrome/` y `dist/firefox/` (Firefox necesita `background.scripts` y `browser_specific_settings.gecko.id`). Genera también los `.zip` listos para subir.
- **Activar/desactivar:**
  - clic en el botón abre un popup con un interruptor grande y visible;
  - atajo `Alt+B` (configurable desde los ajustes de atajos del navegador);
  - menú contextual "Activar en este sitio".
- **Popup** (lo justo, sin pantallas extra):
  - interruptor on/off para la pestaña actual;
  - "Siempre en este sitio" / "En todos los sitios";
  - intensidad (regulador de `strength`) con vista previa en vivo sobre la página;
  - estilo de énfasis: negrita, color, subrayado suave, atenuar el resto de la palabra;
  - "Más opciones": `every`, interlineado extra, ancho máximo de línea, modo lectura (ver abajo).
- **Modo lectura** (opcional en v1, recomendado): limpiar la página con `@mozilla/readability` y mostrar el artículo en una vista propia con el énfasis aplicado.
- **Ajustes** en `storage.sync`: globales y por sitio. Nada de servidores.
- **Permisos:** `storage`, `contextMenus`, `activeTab`, `scripting`. Para la activación automática por sitio, pedir permisos de host **opcionales** en el momento en que el usuario elige "Siempre en este sitio" o "En todos los sitios". No pedir `<all_urls>` de entrada.
- **Idiomas de la interfaz:** español, catalán e inglés, con `_locales/` (`es`, `ca`, `en`). Ningún texto escrito a mano fuera de los ficheros de traducción.
- **Indicador** en el icono (badge "ON") cuando está activa en la pestaña.

## 7. Web (`apps/web`, Astro)

Salida estática desplegada en GitHub Pages. Rutas con i18n de Astro: `/es/` (por defecto), `/ca/`, `/en/`. Usa la skill o guía de diseño que tengas disponible para que no parezca una plantilla. Debe ser tranquila, con mucho aire y tipografía legible.

Páginas:

1. **Inicio:** qué es, en una frase; **demo en vivo** (cuadro de texto donde se pega texto y se ve el resultado al momento, con los mismos controles que la extensión); botones de instalación (Chrome, Firefox) y enlace a GitHub; sección de privacidad ("nada sale de tu dispositivo"); preguntas frecuentes honestas, incluida "¿funciona de verdad?" con la evidencia.
2. **Convertir** (`/convertir`): arrastrar o elegir archivo y descargar el resultado.
   - Formatos v1: **EPUB, TXT, Markdown, HTML**. Salida: mismo formato que la entrada; TXT y Markdown pueden salir también como EPUB o HTML.
   - EPUB: abrir con JSZip, procesar cada documento XHTML del `spine` uno a uno con `DOMParser` (tipo `application/xhtml+xml`) y `applyToElement`, serializar con `XMLSerializer`, y volver a comprimir manteniendo `mimetype` primero y sin comprimir. Añadir el CSS del énfasis al `<head>` de cada capítulo. No tocar metadatos ni imágenes.
   - **Sin límites:** procesar en un **Web Worker** capítulo a capítulo, con barra de progreso y botón de cancelar. Liberar memoria entre capítulos. Probar con un EPUB de más de 50 MB.
   - Libros con DRM: detectar `META-INF/encryption.xml` y explicar con amabilidad que no se pueden convertir.
   - Guía breve de "Cómo pasarlo a tu Kindle / Kobo / PocketBook".
3. **Privacidad** y **Accesibilidad**: textos claros.

Rendimiento: Lighthouse ≥ 95 en todas las categorías. Sin JavaScript en páginas que no lo necesitan (islas de Astro solo para la demo y el conversor).

## 8. CI/CD (`.github/workflows`)

- `ci.yml`: en cada push y PR: instalar con pnpm, lint (Biome), typecheck, tests unitarios, build de todo, tests E2E con Playwright (incluida la extensión cargada en Chromium).
- `web.yml`: en push a `main`, build de Astro y despliegue a GitHub Pages.
- `release.yml`: al crear una etiqueta `v*`, generar los `.zip` de la extensión y adjuntarlos a la release de GitHub. **No** publicar automáticamente en las tiendas.

## 9. Orden de trabajo e hitos

Trabaja hito a hito. Al terminar cada uno: tests en verde, commit con mensaje claro y un resumen corto de lo hecho y lo pendiente.

| Hito | Contenido                             | Hecho cuando                                                                                      |
| ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 0    | Monorepo, licencia, README, CI básico | `pnpm install && pnpm test && pnpm build` funciona en limpio y en CI                              |
| 1    | Núcleo + tests (§4)                   | Todos los casos de idiomas pasan; 5 MB sin error; cobertura ≥ 90 %                                |
| 2    | `applyToElement` (§5)                 | Deshacer deja el DOM idéntico; test con página de 100.000 palabras sin bloquear                   |
| 3    | Extensión (§6)                        | Funciona en Chrome y Firefox; E2E: activar, desactivar, por sitio, `Alt+B`                        |
| 4    | Web: landing + demo (§7.1)            | Desplegada en GitHub Pages en es/ca/en; Lighthouse ≥ 95                                           |
| 5    | Conversor (§7.2)                      | EPUB de 50 MB convertido sin congelar la pestaña; el resultado abre en Calibre y pasa `epubcheck` |

Fuera de la v1 (dejar issues abiertos en GitHub con etiqueta `roadmap`): app móvil, plugin de Calibre, plugin de KOReader, conversión de DOCX y PDF, fuente OpenType con énfasis integrado, complementos para Word, LibreOffice y Google Docs, lectura en voz alta, regla/foco de línea.

## 10. Cómo trabajar

- Pregunta antes de: crear el repositorio en GitHub o hacerlo público, publicar en npm o en tiendas, o añadir cualquier dependencia que haga peticiones de red.
- Ninguna dependencia nueva sin justificarla en el mensaje de commit; preferir la plataforma web (`Intl`, `TreeWalker`, `DOMParser`) a librerías.
- Código y comentarios en inglés; textos de la interfaz siempre a través de los ficheros de traducción.
- Si una decisión de este documento choca con la realidad técnica, propón la alternativa en vez de saltártela.

## 11. Decisiones abiertas

- Nombre definitivo del proyecto (candidatos: Fita, Àncora, NDRead). Comprobar en TMview antes de elegir.
- Si se distribuye en Francia desde el principio: pendiente de consulta legal (existe una patente francesa, FR 3 052 587, sobre este tipo de énfasis).
- Titular del proyecto: Oriol Martí Collell, a título personal (puede pasar a una asociación más adelante).
