# COPAT 3D

Sitio oficial del **Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada**.

> *Diseñando el futuro capa a capa*
> 2 y 3 de octubre de 2026 · Fábrica de Talentos, Ushuaia, Tierra del Fuego
> Organiza: Agencia de Innovación de Fuego (AIF) · copat3d@aif.gob.ar

## Documentación

Leer antes de trabajar en el proyecto. El orden importa.

| Doc | Contenido |
|---|---|
| [01 — Visión y Alcance](docs/01-vision-y-alcance.md) | Objetivo del sitio, qué entra al MVP y qué se recortó (con motivo) |
| [02 — Sistema de Diseño](docs/02-design-system.md) | Paleta, tipografía, figuras 3D, movimiento, accesibilidad |
| [03 — Arquitectura](docs/03-arquitectura.md) | Stack, estructura, flujo de datos, modelo de datos |
| [04 — Datos y Legales](docs/04-datos-y-legales.md) | ⛔ **Bloqueante.** Ley 25.326, consentimiento, minimización |
| [05 — Infraestructura y Deploy](docs/05-infraestructura-deploy.md) | Vercel, Cloudflare, DNS, Docker, checklist de lanzamiento |
| [06 — Roadmap](docs/06-roadmap.md) | Plan semana a semana hasta el evento, y riesgos |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · next-themes
Neon Postgres · Resend · Vercel · Cloudflare · Docker

## Arrancar

### Local

```bash
npm install
cp .env.example .env.local   # completar variables
npm run dev
```

→ http://localhost:3000

### Con Docker (incluye Postgres local)

```bash
docker compose up
```

Levanta la app con hot-reload en `:3000` y Postgres en `:5432`, sin tocar la base real.

### Imagen de producción

```bash
docker build -t copat3d .
docker run -p 3000:3000 --env-file .env.local copat3d
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (salida standalone) |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint |

## Estructura

```
src/
├── app/           Rutas, layout y estilos globales (design tokens)
├── components/
│   ├── shapes/    Figuras 3D en SVG facetado + campo del hero
│   ├── sections/  Hero, Ejes, Sponsors…
│   └── layout/    Navbar, Footer, Logo, ThemeToggle
├── content/       Contenido del evento en TS tipado (no hay CMS)
└── lib/           Validación, DB, entorno
docs/              Documentación del proyecto
```

## Notas para quien retome el proyecto

- **El modo oscuro es el default.** La identidad es neón sobre fondo profundo.
- **Las figuras 3D no usan WebGL.** Son SVG facetado animado con CSS: mismo impacto visual, ~2 KB por figura. El razonamiento está en [docs/02](docs/02-design-system.md).
- **La tipografía Helvetica Now Display es paga.** El sitio usa Inter Tight como sustituto libre. Si aparece la licencia, se cambia en un solo lugar.
- **El sitio tiene que verse bien con contenido incompleto.** Los bloques "Próximamente" son parte del diseño, no un pendiente olvidado.
- **No publicar el formulario de registro** sin cerrar el checklist de [docs/04](docs/04-datos-y-legales.md). Se recolecta DNI y el responsable es un organismo público.
