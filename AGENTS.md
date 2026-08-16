<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# COPAT 3D — guía para agentes

Sitio del **Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada**.
2 y 3 de octubre de 2026 · Ushuaia, Tierra del Fuego · Organiza la AIF (organismo público provincial).

**Idioma: todo en español rioplatense** — código, comentarios, documentación, commits y copy del sitio. Usar *vos*, no *tú*.

## Lo más importante que tenés que saber

1. **Hay una fecha dura.** El evento es el 2 de octubre de 2026 y no se mueve. Ante cualquier duda entre "más completo" y "llega a tiempo", gana llegar a tiempo. Ver [docs/06-roadmap.md](docs/06-roadmap.md).
2. **Se recolectan datos personales para un organismo público.** El formulario de registro **no se puede publicar** hasta cerrar el checklist de [docs/04-datos-y-legales.md](docs/04-datos-y-legales.md). Esto es bloqueante legal, no una recomendación.
3. **El sitio tiene que verse bien con contenido incompleto.** Los bloques "Próximamente" son diseño intencional, no pendientes olvidados.
4. **Leé `docs/` antes de tocar.** Cada decisión no obvia está documentada con su motivo. Si algo parece raro, probablemente hay una razón escrita.

## Estado actual

| Área | Estado |
|---|---|
| Sistema de diseño (paleta, tipografía, dark/light) | ✅ Hecho |
| Figuras 3D SVG + parallax del hero | ✅ Hecho |
| Transición de hoja entre rutas y al scrollear | ✅ Hecho |
| Landing: hero, ejes, sponsors, placeholders | ✅ Hecho |
| Rutas `/agenda` y `/registro` (contenido placeholder) | ✅ Hecho |
| Docker (dev + producción) | ✅ Verificado corriendo |
| Documentación `docs/01` a `docs/06` | ✅ Hecho |
| Formulario de registro | ⛔ Bloqueado por legales |
| Formulario de contacto → Resend | ❌ Pendiente |
| Base de datos (Neon) | ❌ Pendiente |
| Página `/privacidad` | ❌ Pendiente (bloqueante para publicar) |
| Agenda real, speakers, logos de sponsors | ❌ Falta contenido de terceros |
| DNS en NIC.ar → Cloudflare | ❌ Pendiente (tarda 24-48hs, urgente) |

## Comandos

```bash
npm run dev      # desarrollo (http://localhost:3000)
npm run build    # build de producción (standalone solo con DOCKER_BUILD=1)
npm run lint     # ESLint — incluye reglas del React Compiler
docker compose up                  # dev + Postgres local
docker build -t copat3d .          # imagen de producción
```

Correr **siempre `npm run lint` y `npm run build`** antes de dar algo por terminado. El build corre TypeScript.

## Dónde está cada cosa

```
src/
├── app/
│   ├── layout.tsx        Fuentes, metadata, ThemeProvider, Navbar y Footer
│   ├── template.tsx      Transición de hoja + monta SheetMotion
│   ├── globals.css       Tokens de diseño y todas las animaciones
│   ├── page.tsx          Landing
│   ├── agenda/ registro/ Rutas interiores
│   └── api/health/       Healthcheck para Docker
├── components/
│   ├── SheetMotion.tsx   IntersectionObserver del pase de hojas
│   ├── shapes/           Figuras 3D en SVG + ShapeField del hero
│   ├── sections/         Hero, Ejes, Sponsors
│   └── layout/           Navbar, Footer, Logo, ThemeToggle, PageHeader
└── content/              Contenido del evento en TS tipado (NO hay CMS)
docs/                     Documentación del proyecto (leer antes de tocar)
```

**El contenido vive en `src/content/` como TypeScript**, no en un CMS. Fue una decisión explícita: un solo evento, ~30 charlas, y un CMS agregaría infraestructura y un punto de falla a cambio de comodidad que se usa cinco veces.

## Las tres escalas de la hoja

La metáfora de "capa a capa" se aplica en tres tamaños, y los tres usan el mismo canto de luz amarillo→magenta para que se lean como el mismo material:

| Escala | Clase | Dónde | Mecanismo |
|---|---|---|---|
| Página entera | `.paper-page` | Todo el contenido tras el hero, en la portada | Hero `sticky`, la hoja se desliza encima |
| Vista | `.paper` | Cambio de ruta | `template.tsx`, remontado por Next |
| Bloque | `.sheet` | Encabezados, tarjetas, CTA | IntersectionObserver + transición |

`.paper-page` **no se subdivide**: la gracia es que pase una página completa sobre el hero, no cada sección por su cuenta.

El patrón es el que se conoce como **sticky reveal** o *scroll stacking*: un elemento fijo al que la capa siguiente le pasa por encima.

Dos condiciones para que el sticky del hero funcione:

1. **Ningún ancestro con `overflow: hidden` ni `height` fija.** Si alguna vez deja de pegarse, buscá ahí primero.
2. **El hero tiene que entrar en el viewport.** Si es más alto, queda pegado y su parte inferior se vuelve inalcanzable. Con `pt-28/pb-16` medía 698px contra los 667 de un iPhone SE; el padding chico en mobile (`pt-24 pb-12`) existe por eso, no por estética. Al agregarle contenido al hero, **medí en 375×667 antes de dar por terminado**.

## Navbar

- **El estado blanco/sólido lo decide `<NavbarSentinel />`**, no la posición de scroll. El centinela marca dónde termina la cabecera magenta y empieza el contenido; el navbar lo observa. Medir contra `window.innerHeight` solo servía para el hero: el `PageHeader` de las páginas interiores mide ~250px, así que en `/agenda` y `/registro` el navbar quedaba oscuro sobre el magenta.
- El centinela va **fuera** de la cabecera, al inicio del contenido. El hero es `sticky` y nunca se va de pantalla, así que uno colocado adentro jamás cruzaría el borde superior. **Toda página nueva con cabecera magenta tiene que incluirlo**; si falta, el navbar arranca sólido.
- El fondo va en `.navbar-bg`, una capa aparte, para poder desvanecerlo hacia abajo con `mask-image`. Si la máscara se aplicara al `<header>`, también se desvanecerían el logo y los links.
- El menú móvil (`lg:hidden`) bloquea el scroll del body mientras está abierto, cierra con `Escape` y al navegar, y expone `aria-expanded` / `aria-controls`. **No lo cierres con un efecto sobre `pathname`**: sería `setState` en el cuerpo de un efecto, que el React Compiler rechaza (trampa 4). Se cierra con `onClick` en cada link.
- El botón "Inscribirme" del header se oculta en `<sm` porque compite con la hamburguesa; en mobile el CTA vive dentro del menú.

## ⚠️ Trampas conocidas

Todas son bugs que ya ocurrieron en este proyecto. No las reintroduzcas.

### 0. Auditar solapes exige hit-testing, no solo geometría

El hero es `sticky`: **sigue existiendo en el viewport detrás de `.paper-page` aunque no se vea**. Comparar rectángulos a secas da falsos positivos — el texto oculto del hero "choca" con figuras de secciones que están mucho más abajo.

Cualquier chequeo de solapes tiene que filtrar con `document.elementFromPoint()` en el centro del elemento y verificar que sea realmente el que está arriba. Está resuelto así en `wire.mjs`.

### 1. `.sheet` va en bloques, nunca en una `<section>` entera

Una sección mide ~1200px contra un viewport de 900. Su borde superior cruza el umbral del observer mientras el usuario todavía mira la sección anterior, la transición se completa **fuera de pantalla** y el efecto es invisible aunque funcione perfecto.

Poné `.sheet` en unidades **más chicas que el viewport** (encabezado, tarjeta, CTA). Si un bloque es más alto que la pantalla, se la ponés a sus hijos.

### 2. Nada `position: fixed` dentro de `template.tsx`

`.paper` anima `transform`, y **un ancestro con transform convierte a sus descendientes `fixed` en `absolute`**. Por eso Navbar y Footer viven en `layout.tsx`, fuera del template. El fotograma final de `paper-in` usa `transform: none` (no `scale(1)`) justamente para dejar de ser bloque contenedor.

Si agregás algo fijo o sticky, va en el layout.

### 3. Variables `NEXT_PUBLIC_*` vacías rompen el build

Un `ARG` de Docker sin valor define el `ENV` como **cadena vacía**, y `??` no cubre la cadena vacía:

```ts
process.env.NEXT_PUBLIC_SITE_URL ?? "https://copat3d.com.ar"  // ❌ devuelve ""
process.env.NEXT_PUBLIC_SITE_URL || "https://copat3d.com.ar"  // ✅
```

`new URL("")` tira `ERR_INVALID_URL` y voltea el build entero. Pasa igual en Vercel si la variable existe con valor vacío. Al agregar una variable nueva: **default en el `ARG` y `||` en el código**, las dos cosas.

### 4. El React Compiler prohíbe `setState` en el cuerpo de un efecto

`useEffect(() => setX(true), [])` es error de lint. Si necesitás un valor inicial calculado del DOM, usá `requestAnimationFrame` o derivá el valor en vez de guardarlo en estado.

### 5. `suppressHydrationWarning` va en `<html>` **y** en `<body>`

Extensiones del navegador (ColorZilla escribe `cz-shortcut-listen`, Grammarly `data-gr-*`) inyectan atributos antes de que React hidrate. No es un bug de la app y no se puede evitar desde el código.

### 6. Un `.sheet` no puede tener hover con `transform`

La transición de hoja dura 0.7s sobre `transform`; un `hover:-translate-y-1` hereda esa duración y queda pesadísimo. Usá otra señal de hover (color de borde, barra de acento).

### 7. No uses `animation-timeline` para UI crítica

Solo corre en Chromium. Está bien para decoración (el parallax de las figuras del hero lo usa), pero **nunca** para algo que deje contenido ilegible si no se aplica. El navbar usa un listener de scroll por este motivo.

Además, el minificador de Tailwind v4 reescribe `animation-range` de forma difícil de auditar. El pase de hojas usa IntersectionObserver justamente por eso.

### 8. Contraste en modo claro

El magenta institucional `#E6006E` sobre fondo claro da 4.6:1 — insuficiente para texto chico. Para **texto** usá el token `--accent-text` (`#B00057` en claro, amarillo en oscuro). El magenta puro va en fondos, no en tipografía chica.

### 9. `clip-path: inset(100%)` + IntersectionObserver = deadlock

Un elemento con área visible cero hace que el observer calcule ratio 0 y **nunca** lo reporte como visible. Si la clase que lo revela depende del observer, queda oculto para siempre *porque* está oculto.

La variante `.sheet-print` arranca en `inset(72% 0 0 0)`: sigue invisible (la opacidad es 0) pero deja área para medir. El observer además usa `threshold: 0`.

Regla general: **nada que dependa del observer para aparecer puede tener área cero antes de aparecer.**

### 10. El CSS sin capa le gana a las utilidades de Tailwind

`globals.css` define reglas fuera de todo `@layer` (`.marquee-track`, `.js-sheets .sheet`, `.paper`). En la cascada, **los estilos sin capa vencen a los de cualquier capa**, sin importar la especificidad — y las utilidades de Tailwind v4 viven en `@layer utilities`.

Consecuencia práctica: una utilidad como `group-hover:[animation-play-state:paused]` sobre `.marquee-track` **no se aplica nunca**. Si necesitás modificar algo definido sin capa, la regla nueva también va sin capa, al lado de la original.

### 11. Tailwind v4 usa la propiedad `translate`, no `transform`

`-translate-y-1.5` genera `translate: 0 -0.375rem`, no una `matrix()`. Al depurar o testear un hover, mirá `getComputedStyle(el).translate`; `transform` va a decir `none` aunque el efecto esté funcionando perfecto.

### 12. `output: "standalone"` rompe el deploy en Vercel

Es para el Dockerfile: emite un servidor autocontenido para que la imagen final no necesite `node_modules` ni el código fuente. Pero **Vercel tiene su propio empaquetado serverless y `standalone` lo pisa** — el build compila y genera las páginas sin ningún error visible, y recién falla después, en el paso de empaquetado de Vercel.

Por eso está condicionado en `next.config.ts` a `process.env.DOCKER_BUILD`, variable que solo define el `Dockerfile`. Si el deploy en Vercel falla con el build aparentemente limpio (todo en verde y sin "Error" en el log), **este es el primer sospechoso**.

### 13. `ShapeField` no se muestra en mobile — y no lo reactives sin repensar las posiciones

Las figuras del hero están posicionadas en **porcentajes pensados para una columna de texto angosta contra un viewport ancho**. En mobile el texto ocupa casi todo el ancho, así que esos mismos porcentajes caen directo encima: el zigzag amarillo tapaba el eyebrow y el icosaedro quedaba pegado al título (bug real, reportado con captura de un iPhone).

No hay combinación de posiciones que quede a salvo de forma confiable: el alto del bloque de texto cambia según si los chips hacen wrap, la localización, o el contenido real. Por eso `ShapeField` está `hidden sm:block` — directamente ausente en mobile, sin perseguir huecos seguros. El degradé + grano cargan el peso visual ahí.

**Qué se muestra en mobile en su lugar:**

- **Hero:** una sola pieza wireframe grande como marca de agua (`tono="filigrana"`, 10% de blanco) detrás del título. Un contorno tenue puede convivir con el texto; una figura rellena no.
- **Secciones:** wireframes en las **bandas de padding vertical** (`py-24`), sangrando por el borde lateral. Es el único espacio realmente libre en pantallas angostas.

Se probó además con figuras sangrando por los bordes del hero y **se quitaron**: en 320-375px no despegan del texto sin quedar reducidas a un filo de ~16px que se lee como un artefacto de render. No insistas por ahí.

Si alguna vez se quiere reactivar el campo relleno en mobile, no reuses las posiciones de desktop: hay que diseñar un layout aparte y **medirlo con Playwright en 375×667 como mínimo** antes de darlo por bueno.

### 14. El hero tiene que entrar en 360px de ancho, no solo de alto

Mismo problema que el alto (trampa ya conocida) pero en los *paddings verticales de cada bloque*, no en el padding general de la sección: agregar contenido al hero (un chip más, una línea extra) puede hacer que la sección vuelva a superar el viewport, y como tiene `overflow-hidden`, el excedente **se recorta en silencio** — el botón "Sumar mi empresa" y el indicador de scroll quedaban parcialmente inalcanzables.

**Piso de soporte: 360px de ancho** (el mínimo real del mercado hoy; iPhone SE 1ª gen y otros de 320px están discontinuados desde 2018 y se aceptan como degradación conocida, no como bug a perseguir). Al tocar el contenido del hero, volvé a correr `hero-movil.mjs` o equivalente en 375×667 como mínimo — no alcanza con mirarlo en desktop achicando la ventana, porque `svh` se comporta distinto en un navegador de escritorio que en uno móvil real.

### 15. Figuras de margen: `overflow-x: clip`, nunca `hidden`

Las wireframe de `WireMargins` se posicionan **fuera** de la caja del contenido (`-left-32` / `-right-32`), así que el ancestro necesita recortar o generan scroll horizontal.

Tiene que ser `overflow-x: clip` (está en `.paper-page`). **`hidden` crea un contenedor de scroll y rompe el `sticky` del hero** — el efecto de hoja sobre el hero deja de funcionar.

El posicionamiento con offsets negativos es **auto-limitante y no necesita breakpoints**: solo asoman cuando el viewport supera el `max-w-7xl` del contenido. Verificado: 0 figuras a la vista en 360/768/1280px, 4 en 1440px y arriba, 0 solapes con texto y sin scroll horizontal en ningún ancho.

Al agregar una figura nueva de margen, corré `wire.mjs` (o equivalente): mide justamente esas tres cosas.

### 16. Los acentos de la marca son pasteles: no sirven como color de trazo en modo claro

Coral `#E8897F`, celeste `#6FB9E4`, etc. son colores **claros**. Sobre `--bg` oscuro con poca opacidad se leen bien; sobre el fondo claro quedan prácticamente blancos e invisibles. Fue un bug real con las figuras wireframe.

Para eso existen los tokens `--color-copat-*-deep` (los mismos tonos que ya usan las caras oscuras de las figuras rellenas). El mapa `TONOS` de `wire.tsx` es la fuente única: define el par claro/oscuro de cada acento en un solo lugar, en vez de repetir variantes `dark:` en los 13 lugares de uso.

Contraste medido contra el fondo: **1.5 a 2.12 en ambos modos**. Para decoración no hace falta 4.5:1, pero por debajo de ~1.25:1 el trazo es imperceptible.

> Al medir contraste desde Playwright, **Tailwind v4 emite los colores como `oklab(...)` con alpha** y parsearlos con una regex da resultados falsos (daban 1.01 en todo). Hay que dejar que el navegador haga la mezcla: pintar fondo y color en un `<canvas>` de 1×1 y leer el píxel. Además `next-themes` usa `defaultTheme="dark"`, así que `colorScheme` de Playwright no cambia el tema — hay que fijar `localStorage.theme` con `addInitScript`.

### 17. Helvetica Now Display es paga

Es de Monotype y requiere licencia web. El sitio usa **Inter Tight** como sustituto libre. No la sirvas desde un CDN ni la copies de otro sitio. Si aparece la licencia, se cambia en `layout.tsx` y en `--font-display`.

## Convenciones

- **Tailwind v4 con configuración CSS-first.** No hay `tailwind.config.js`; los tokens se definen en `@theme` dentro de `globals.css`.
- **Modo oscuro por defecto.** La identidad es neón sobre fondo profundo.
- **El degradé magenta del hero no se invierte** entre modos: es la firma de marca.
- **Server Components por defecto.** `"use client"` solo donde hace falta interactividad real.
- **Sin ORM.** Con una o dos tablas, el cliente de la base alcanza.
- **Comentarios que explican el *por qué*, no el *qué*.** El código ya dice qué hace.
- **Accesibilidad no es opcional:** contraste AA, foco visible, `<label>` reales, `prefers-reduced-motion` respetado, figuras decorativas con `aria-hidden`.

## Verificación visual

Este proyecto es fuertemente visual y **razonar sobre CSS sin observarlo lleva a diagnósticos equivocados** — ya pasó dos veces con el pase de hojas.

Si tenés que validar un efecto, medilo en un navegador real. Playwright con `channel: "msedge"` usa el Edge instalado sin descargar nada:

```js
const browser = await chromium.launch({ channel: "msedge", headless: true });
```

Sirve para leer clases, opacidad computada y posición durante el scroll. No está instalado como dependencia; instalalo fuera del repo si lo necesitás puntualmente.

## Decisiones abiertas (requieren respuesta de la AIF)

Estas bloquean trabajo. No las resuelvas por tu cuenta:

1. **¿Registro con base propia o Eventbrite?** Define la mitad del backend. Ver [docs/03-arquitectura.md](docs/03-arquitectura.md).
2. **Texto legal de consentimiento.** Sin esto no se publica el formulario.
3. **¿Se ceden datos a sponsors?** Cambia el texto del consentimiento.
4. **¿Fecha de nacimiento exacta o rango etario?** Se recomienda rango: mismo valor estadístico, mucho menos riesgo legal.
5. **¿El DNI es realmente necesario?** Solo se justifica si hay control de acceso en puerta.

## Documentación completa

| Doc | Contenido |
|---|---|
| [docs/01-vision-y-alcance.md](docs/01-vision-y-alcance.md) | Objetivo, MVP, y qué se recortó con su motivo |
| [docs/02-design-system.md](docs/02-design-system.md) | Paleta, tipografía, figuras, movimiento, accesibilidad |
| [docs/03-arquitectura.md](docs/03-arquitectura.md) | Stack, estructura, flujo de datos, modelo de datos |
| [docs/04-datos-y-legales.md](docs/04-datos-y-legales.md) | ⛔ Ley 25.326 — bloqueante |
| [docs/05-infraestructura-deploy.md](docs/05-infraestructura-deploy.md) | Vercel, Cloudflare, DNS, Docker, checklist |
| [docs/06-roadmap.md](docs/06-roadmap.md) | Plan semanal hasta el evento y riesgos |
