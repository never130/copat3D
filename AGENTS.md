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
npm run build    # build de producción (salida standalone)
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

## ⚠️ Trampas conocidas

Todas son bugs que ya ocurrieron en este proyecto. No las reintroduzcas.

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

### 9. Helvetica Now Display es paga

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
