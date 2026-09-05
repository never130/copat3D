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
| SEO: metadata, sitemap, robots, JSON-LD, favicon, Open Graph | ✅ Hecho |
| Documentación `docs/01` a `docs/06` | ✅ Hecho |
| Formulario de registro | ✅ Construido y verificado de punta a punta — **apagado en Production** detrás de `NEXT_PUBLIC_REGISTRO_ABIERTO`, ver [src/lib/site.ts](src/lib/site.ts) |
| Formulario de contacto → Resend | ✅ Hecho y verificado en producción |
| Base de datos (Neon, San Pablo) | ✅ Conectada, migrada, probada — [db/schema.sql](db/schema.sql) |
| Dominio `copat3d.com.ar` verificado en Resend (DKIM/SPF/MX) | ✅ Hecho — los mails salen de `no-responder@copat3d.com.ar` |
| Región de Vercel/Neon | ✅ Las dos en San Pablo (`gru1` / `sa-east-1`), ver [docs/05](docs/05-infraestructura-deploy.md) |
| Página `/privacidad` | ⚠️ Borrador publicable — **requiere validación de legales de la AIF** |
| Sección de sede con mapa de Google | ✅ Hecho (ver nota de privacidad en [docs/04](docs/04-datos-y-legales.md)) |
| Logo oficial de COPAT 3D (arte de la AIF) | ✅ Hecho |
| Logos en el carrousel: Gobierno TDF, AIF, Buena Mezcla, Rayuela | ✅ Hecho |
| Agenda real, speakers, logos del resto de sponsors | ❌ Falta contenido de terceros |
| DNS: `copat3d.com.ar` en Cloudflare, proxeado, SSL Full (strict) | ✅ Hecho y verificado en vivo |

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

### 0.b Las figuras del hero solo caben en las bandas LATERALES

El bloque de texto del hero mide ~510px de alto. En una ventana de 900px deja 219px arriba y 171px abajo; **en una de 700px no deja nada**. Las bandas superior e inferior no son espacio confiable: cualquier figura ahí choca en cuanto la ventana es baja.

Dos cosas más al posicionar:

- **Una figura que rota tiene una caja de colisión de hasta 1.41× su tamaño.** Un icosaedro de 132 con `anim-float-spin` necesita 187px libres. Es la causa de choques que "no se explican" mirando los porcentajes.
- **El ancho del `<h1>` manda sobre el margen lateral.** Con `15vw` medía 722px en una ventana de 1024 y dejaba 151px por lado, insuficiente. Está en `12vw`, que arriba de ~1467px no cambia nada porque el clamp ya topeaba en `11rem`.

Al mover figuras del hero, correr `figuras-hero.mjs`: mide holgura contra el texto **y entre figuras rellenas** (que se pisen entre sí se lee como error, no como profundidad), en 7 combinaciones de ancho × alto.

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

**Y el mismo problema existe en notebook, que es donde nadie lo busca.** La notebook es ANCHA pero BAJA: un 1366×768 deja ~625px de viewport y un 1920×1080 al 150% de escalado de Windows deja ~590. Con el espaciado `sm:` fijo el hero medía 675px, así que no entraba — y como es `sticky top-0`, un hero más alto que la ventana **queda pegado arriba y su parte inferior no se puede ver nunca**: los dos botones y el indicador de scroll quedaban cortados. Por eso el espaciado `sm:` va en `svh` con `clamp()` y no en valores fijos; los máximos son los de siempre, o sea que en 1920×1080 no cambia nada.

Los dos paddings del hero **no son simétricos**, y no es un descuido: cada uno reserva algo concreto.

- `pt` (mínimo 5rem) reserva los **78px del navbar fijo**. No puede bajar de ahí.
- `pb` (4.5rem) reserva los **63px del indicador de scroll**. El indicador es `absolute` y no ocupa lugar en el flujo, pero el bloque de texto se **centra** en la caja de padding: si `pb` se achica, el texto BAJA y se le monta encima. A 1280×593 llegaron a quedar 1px.

**Piso de soporte en alto: 560px.** Abajo de eso el indicador se oculta —no hay lugar para navbar + texto + indicador— y el hero puede pasarse unos pocos píxeles. Es más bajo que cualquier notebook; el caso real es un celular acostado.

Y al ajustar el hero, **volvé a medir las figuras**: mover el bloque de texto cambia todas las holguras. Las que están en la banda superior fueron las primeras en chocar (trampa 0.b), y las dos que caen dentro del ancho del wordmark terminaron con `solo-alto`.

### 15. Figuras de margen: `overflow-x: clip`, nunca `hidden`

Las wireframe de `WireMargins` se posicionan **fuera** de la caja del contenido (`-left-32` / `-right-32`), así que el ancestro necesita recortar o generan scroll horizontal.

Tiene que ser `overflow-x: clip` (está en `.paper-page`). **`hidden` crea un contenedor de scroll y rompe el `sticky` del hero** — el efecto de hoja sobre el hero deja de funcionar.

El posicionamiento con offsets negativos es **auto-limitante y no necesita breakpoints**: solo asoman cuando el viewport supera el `max-w-7xl` del contenido. Verificado: 0 figuras a la vista en 360/768/1280px, 4 en 1440px y arriba, 0 solapes con texto y sin scroll horizontal en ningún ancho.

Al agregar una figura nueva de margen, corré `wire.mjs` (o equivalente): mide justamente esas tres cosas.

### 16. Los acentos de la marca son pasteles: no sirven como color de trazo en modo claro

Coral `#E8897F`, celeste `#6FB9E4`, etc. son colores **claros**. Sobre `--bg` oscuro con poca opacidad se leen bien; sobre el fondo claro quedan prácticamente blancos e invisibles. Fue un bug real con las figuras wireframe.

Para eso existen los tokens `--color-copat-*-deep` (los mismos tonos que ya usan las caras oscuras de las figuras rellenas). El mapa `TONOS` de `wire.tsx` es la fuente única: define el par claro/oscuro de cada acento en un solo lugar, en vez de repetir variantes `dark:` en los 13 lugares de uso.

Contraste medido contra el fondo: **1.5 a 2.12 en ambos modos**. Para decoración no hace falta 4.5:1, pero por debajo de ~1.25:1 el trazo es imperceptible.

> Al medir contraste desde Playwright, **Tailwind v4 emite los colores como `oklab(...)` con alpha** y parsearlos con una regex da resultados falsos (daban 1.01 en todo). Hay que dejar que el navegador haga la mezcla: pintar fondo y color en un `<canvas>` de 1×1 y leer el píxel. Además `next-themes` usa `defaultTheme` con un valor concreto (`"light"` desde el 5/9/2026, antes `"dark"`) y no `"system"`, así que **ignora la preferencia del sistema operativo por completo** para cualquier visitante sin tema guardado — confirmado en el código fuente de la librería, no solo observado: con un string literal en `defaultTheme`, nunca llega a evaluar `matchMedia("(prefers-color-scheme: dark)")`. Por eso `colorScheme` de Playwright no cambia el tema — para probar el modo que NO es el default hay que fijar `localStorage.theme` con `addInitScript`.

### 17. Helvetica Now Display es paga

Es de Monotype y requiere licencia web. El sitio usa **Inter Tight** como sustituto libre. No la sirvas desde un CDN ni la copies de otro sitio. Si aparece la licencia, se cambia en `layout.tsx` y en `--font-display`.

### 18. Cada logo de sponsor necesita el fondo que pide su arte

El logo de Gobierno de Tierra del Fuego (`gobierno-tdf.svg`) es **enteramente
blanco** (una sola clase CSS, `fill: #fff`, sin ningún otro color en el
archivo): pensado para fondo oscuro. El de la AIF (`aif-blanco.svg`) es mixto
— el emblema circular es a color (degradados naranja→celeste, un teal sólido),
pero el wordmark "AIF" es blanco puro igual que el de Gobierno.

Por decisión explícita (31/8/2026, Ever Loza) todas las tarjetas del
carrousel van en blanco, sin ningún color de marca de por medio — se probó
primero un zócalo magenta solo detrás del logo, pero se pidió sacarlo también
por completo. Como blanco sobre blanco es directamente invisible, la solución
quedó en **variantes oscuras de los dos archivos**: `gobierno-tdf-oscuro.svg`
y `aif-oscuro.svg`, generadas cambiando el único `fill: #fff` de cada uno por
el ink del tema claro (`#12060f`, mismo valor que `--fg` en `:root`). El resto
del arte —incluidos los degradados de color del emblema de la AIF— queda
intacto: el cambio es una sola línea dentro del bloque `<style>` de cada SVG,
no un filtro CSS aplicado en el navegador (un `invert()` habría invertido
también el emblema a color de la AIF, con un resultado fuera de marca).

Los archivos originales (`gobierno-tdf.svg`, `aif-blanco.svg`) siguen en
`public/logos/` por si hace falta el blanco puro en algún otro lugar —no se
tocaron—; `Sponsors.tsx` usa las variantes `-oscuro`. Si el arte fuente
cambia (nueva versión enviada por la AIF), hay que regenerar las dos
variantes a mano con el mismo reemplazo.

> Los lockups institucionales son muy **apaisados** (el de Gobierno es 4:1). Con
> un `max-h` chico quedaban diminutos, sin aprovechar el ancho de la tarjeta.
> Van con `object-contain` sobre la caja completa: así el limitante es el ancho,
> que es la dimensión que sobra.


**Los JPG de sponsors comerciales son el caso inverso.** Buena Mezcla y Rayuela
son tinta de color sobre blanco, y al ser JPEG **no existe la transparencia**:
el blanco está incrustado en el archivo. Sobre la superficie del tema (oscura)
o sobre el magenta, se vería un recuadro blanco recortado.

Por eso la tarjeta va en `bg-white` **exacto**, no `bg-surface` (hoy es así
para todas, pero nació acá): se midieron las cuatro esquinas de ambos
archivos y son `#FFFFFF` puro. Con cualquier otro tono se marca el borde del
rectángulo.

Ese blanco exacto es además lo que permite el campo `escala`, que amplía el
logo para compensar el margen que trae incrustado el archivo: lo que se recorta
al ampliar es blanco puro contra tarjeta blanca, o sea invisible.

**Pero ampliar por CSS es el plan B, no el primero.** El arte que manda un
sponsor suele venir con las dos cosas juntas —margen incrustado *y* un fondo
que no es blanco puro—, y ahí la escala juega en contra: agrandar un fondo
#F7F7F7 solo agranda el recuadro gris. Pasó con el logo de Rayuela Río Grande:
1600×900 con el badge ocupando el 42% del alto y fondo #F7F7F7 uniforme.

Lo que se hace es **normalizar el archivo**, no compensarlo desde el componente:

1. Recortar a la caja de tinta (mide los píxeles, no lo hagas a ojo).
2. Pasar el fondo a #FFFFFF con un **relleno por inundación desde el borde**,
   nunca con un test de color global: el texto claro de adentro del logo puede
   estar a menos de 30 de distancia del gris de fondo y un test global le hace
   agujeros. Desde el borde no puede llegar ahí si el arte lo encierra.
3. Bajar la resolución a ~3x de lo que se muestra (la tarjeta lo pinta a 224px
   de ancho; 1228px eran 5,5x y triplicaban el peso del archivo).

Al terminar, verificá las cuatro esquinas: si no dan #FFFFFF, la tarjeta va a
mostrar el recuadro.

### 19. `h-full w-full object-contain` funciona con SVG por accidente

Las tarjetas del carrousel usaban esa combinación y andaba bien… hasta que
entró el primer JPG y se desbordó 227px fuera de la tarjeta.

El motivo: un SVG sin `width`/`height` en píxeles **no tiene tamaño
intrínseco**, así que `h-full` resuelve contra el contenedor. Un JPG sí lo
tiene, y dentro de un contenedor de alto automático —una celda de grid con
`place-items-center`— `height: 100%` no tiene contra qué resolver y el
navegador cae al alto natural del archivo.

La forma que funciona con los dos:

1. Una caja interna `absolute inset-0` sobre la tarjeta, que **sí** tiene alto
   definido porque lo hereda del `h-32` de la tarjeta.
2. `max-h-full max-w-full` en la imagen, no `h-full w-full`. Así el limitante
   lo elige la proporción de cada logo, que en este carrousel van desde 4:1
   hasta casi cuadrado.

> Al agregar un logo nuevo, medí la caja renderizada de la `<img>` contra la de
> la tarjeta. Que *parezca* bien en una captura no alcanza: el desborde puede
> quedar oculto por el `overflow-hidden` y aparecer recién con otra proporción.

### 20. `animation-timeline: none` en el reset de `prefers-reduced-motion` apaga el sitio entero

Es la trampa más cara de todas: la página quedaba **completamente en blanco** —solo el fondo, con el navbar y el footer visibles— en cualquier máquina con el movimiento reducido activado. Windows lo prende solo al entrar en ahorro de batería, así que pasaba en notebooks y no en la PC de escritorio ni en el celular. Se reportó como "en algunas pantallas no cargan los elementos".

El reset global tenía, además de acortar duraciones, esto:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-timeline: none !important; }  /* ❌ */
}
```

Una animación **sin línea de tiempo tiene tiempo actual nulo: no corre nunca**. Y con relleno `both`, lo que el navegador pinta mientras tanto es su fotograma **inicial**, no el final. Como `.paper` —el contenedor de toda la vista, en `template.tsx`— entra desde `opacity: 0`, se quedaba en 0 para siempre. Lo mismo `.hero-rise` y el menú móvil. Navbar y footer se salvaban solo porque viven en `layout.tsx`, fuera del `.paper`.

Lo que queda de esto:

1. **Las animaciones atadas al scroll se anulan una por una** (`.plane-*`, `.wire-dibujo svg`), con `animation: none !important` más su propiedad de reposo. Nunca con un `animation-timeline` global.
2. **Las animaciones de entrada escriben su estado final explícito** bajo movimiento reducido, en vez de confiar en que una duración de 0.01ms las haga llegar sola. Cualquier cosa que impida que la animación corra deja el fotograma inicial, que en todas ellas es opacidad 0.
3. `animation-delay: 0s !important` también va en el reset: con relleno `both`, mientras dura el delay el elemento sigue invisible. Los 420ms escalonados del hero se veían como un parpadeo en blanco.
4. **Toda verificación visual se corre en los dos modos.** Con Playwright, `newContext({ reducedMotion: "reduce" })`. Un chequeo que solo mira el modo normal no habría visto nada de esto.

### 21. Una ruta anidada no remonta el `template.tsx` raíz — el pase de hojas se rompe en silencio

Bug real: `/convocatorias/bases-secundarios` se veía perfecto entrando por URL directa, pero **en blanco después de "Última actualización"** al llegar haciendo clic desde `/convocatorias` — todo el contenido bajo el primer bloque quedaba invisible para siempre.

La causa está en la propia doc de Next (`node_modules/next/dist/docs/.../template.md`): *"Templates receive a unique key for their own segment level. Navigations within deeper segments do not remount higher-level templates."* Este proyecto tiene un solo `template.tsx`, en la raíz de `app/`, y su key está atada al **primer segmento** de la ruta. `/convocatorias` → `/convocatorias/bases-secundarios` comparte ese primer segmento (`convocatorias`), así que Next **no remonta** el template raíz al navegar entre ellas. Como `SheetMotion` vive ahí y solo observa el DOM en su `useEffect` de montaje (trampa deliberada: así resincroniza en cada cambio de ruta, ver comentario en `template.tsx`), su observer nunca llega a registrar las secciones de la página nueva — quedan con `.sheet` pero sin `.sheet-in` para siempre, porque `.js-sheets` ya estaba puesto desde la navegación anterior.

Se reprodujo instrumentando `SheetMotion` con `console.log` en mount/cleanup: navegando por clic, el log de montaje no aparecía después del click, solo el de la página anterior. Confirmado además contra la doc: navegar `/` → `/about` (cambia el primer segmento) sí remonta; `/blog` → `/blog/first-post` (mismo primer segmento) no.

Hasta este bug, **todas** las rutas del sitio eran de un solo nivel (`/agenda`, `/registro`, `/privacidad`, `/convocatorias`...), así que el problema nunca se había manifestado — cualquier navegación cambiaba el primer segmento y el template remontaba solo. `/convocatorias/bases-secundarios` fue la primera ruta anidada del proyecto.

**La solución no es "arreglar" `SheetMotion`** (su lógica está bien, el problema es que nunca se ejecuta): es no anidar rutas bajo otras rutas de contenido. `/bases-secundarios` quedó como ruta plana, al mismo nivel que el resto — coherente con que sea la primera vez que hace falta una URL con más de un segmento.

Si en algún momento hace falta anidar de verdad (por URL, por SEO, por lo que sea), la alternativa es agregar un `template.tsx` propio en ese subdirectorio —tal como lo resuelve la doc de Next con `app/blog/template.tsx`—, sabiendo que eso monta un `SheetMotion` (y un `.paper`) **adicional y anidado** dentro del de la raíz, que hay que auditar aparte para no duplicar el efecto de pase de hojas ni romper la animación de `.paper`.

## Convenciones

- **Tailwind v4 con configuración CSS-first.** No hay `tailwind.config.js`; los tokens se definen en `@theme` dentro de `globals.css`.
- **Modo claro por defecto** (cambiado el 5/9/2026; hasta entonces era oscuro). `defaultTheme="light"` en `layout.tsx` — un string concreto, no `"system"`, así que un visitante sin preferencia guardada ve claro sin importar el modo de su sistema operativo (ver trampa 16 sobre por qué `next-themes` funciona así). El modo oscuro sigue completo y con la misma identidad neón sobre fondo profundo; solo cambió cuál se ofrece primero.
- **El lienzo de marca sí cambia entre modos**, siguiendo el arte oficial: `.brand-canvas` (hero y `PageHeader`) es magenta en claro y negro con retícula en oscuro. En cambio `.hero-gradient` es magenta **siempre** — lo usan el CTA de sponsors y el menú móvil, que deben resaltar sobre el contenido y en oscuro desaparecerían. Ver [docs/02](docs/02-design-system.md).
- **Las figuras del hero no llevan opacidad reducida.** Atenuarlas las mezcla con el fondo, y el fondo cambia entre modos: al 50% el zigzag verde tiraba a marrón sobre magenta y a oliva sobre negro. La profundidad la dan el tamaño y el parallax.
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

**Dos ejes que hay que cubrir sí o sí**, porque ahí se escondieron los dos bugs que llegaron a producción:

- **`reducedMotion: "reduce"`** además del modo normal (trampa 20).
- **Ventanas anchas y BAJAS**, no solo angostas: 1366×625 y 1280×593 son notebooks reales (trampa 14). Achicar el ancho en el escritorio no las reproduce.

## Decisiones abiertas (requieren respuesta de la AIF)

Estas bloquean trabajo. No las resuelvas por tu cuenta:

1. **Validación legal formal del texto de consentimiento.** Hay un texto cargado y confirmado por gestión (23/8/2026); falta que el área legal de la AIF lo revise antes de darlo por definitivo — sin eso no se publica el formulario.

### Ya decidido

**Registro con base propia** (18/8/2026, Azariel Castillo). Eventbrite se miró
como referencia del flujo, no como plataforma a contratar. La inscripción es
**gratuita** —sin pasarela de pago— y el flujo es: la persona completa el
formulario → el sistema emite un **código de reserva** → el código le llega por
**correo** → la AIF procesa los datos después.

**El formulario pide DNI y fecha de nacimiento completa** (decisión de
gestión, distinta de la recomendación técnica de minimizar campos que traía
este documento — ver [docs/04](docs/04-datos-y-legales.md)). El DNI se pide
siempre, no solo si hay control de acceso en puerta; la fecha va completa
(día, mes, año), no en rango.

**No se ceden datos a sponsors, y el registro individual es solo para
mayores de 18** (23/8/2026, Ever Loza). Los menores se coordinan por mail
con la AIF (inscripción institucional vía colegio); el sistema bloquea el
guardado de cualquier inscripto menor de edad — ver
[docs/04](docs/04-datos-y-legales.md) §2 y §4.

**El acceso en la puerta es con QR, y el acceso a los datos es por el panel
`/admin`** (23/8/2026, Ever Loza). El mail de confirmación incluye un QR con
el código de reserva; `/admin` (protegido con contraseña, sin repartir
credenciales de Neon) tiene buscador por código/nombre/DNI, marcado de
asistencia, y descarga a CSV. Ver `src/proxy.ts` y `src/app/admin/`.

## Documentación completa

| Doc | Contenido |
|---|---|
| [docs/01-vision-y-alcance.md](docs/01-vision-y-alcance.md) | Objetivo, MVP, y qué se recortó con su motivo |
| [docs/02-design-system.md](docs/02-design-system.md) | Paleta, tipografía, figuras, movimiento, accesibilidad |
| [docs/03-arquitectura.md](docs/03-arquitectura.md) | Stack, estructura, flujo de datos, modelo de datos |
| [docs/04-datos-y-legales.md](docs/04-datos-y-legales.md) | ⛔ Ley 25.326 — bloqueante |
| [docs/05-infraestructura-deploy.md](docs/05-infraestructura-deploy.md) | Vercel, Cloudflare, DNS, Docker, checklist |
| [docs/06-roadmap.md](docs/06-roadmap.md) | Plan semanal hasta el evento y riesgos |
