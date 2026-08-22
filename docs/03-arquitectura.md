# 03 — Arquitectura

## Stack

| Capa | Elección | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 | SSR para SEO, Server Actions para formularios sin API propia |
| Lenguaje | TypeScript (strict) | Validación de tipos en formularios con datos sensibles |
| Estilos | Tailwind CSS v4 | Config CSS-first, sin `tailwind.config.js` |
| Tema | `next-themes` | Dark/light con persistencia y sin flash (FOUC) |
| Animación | CSS nativo + Motion (solo donde CSS no llega) | Minimizar JS en el critical path |
| Figuras 3D | SVG inline + CSS | Ver [02-design-system](02-design-system.md) |
| Base de datos | Neon Postgres (serverless) | Capa free suficiente; sin servidor que mantener |
| Email | Resend | 3.000/mes gratis; envío desde Server Action |
| Hosting | Vercel | Integración nativa con Next.js |
| DNS / CDN / WAF | Cloudflare | Ver [05-infraestructura](05-infraestructura-deploy.md) |
| Contenedores | Docker + Compose | Paridad de entorno y build reproducible |

## Estructura de carpetas

```
src/
├── app/
│   ├── layout.tsx              # Fuentes, ThemeProvider, metadata global
│   ├── page.tsx                # Landing (composición de secciones)
│   ├── globals.css             # Design tokens + utilidades
│   ├── registro/               # Página de registro
│   ├── agenda/                 # Agenda completa
│   └── api/health/             # Healthcheck para Docker
├── components/
│   ├── shapes/                 # Figuras SVG 3D + campo de figuras
│   ├── sections/               # Hero, Ejes, Agenda, Sponsors, Contacto
│   ├── ui/                     # Botones, inputs, cards (primitivas)
│   └── layout/                 # Navbar, Footer, ThemeToggle
├── content/                    # Contenido versionado (no CMS)
│   ├── agenda.ts               # Charlas por día
│   ├── ejes.ts                 # Ejes temáticos
│   └── sponsors.ts             # Empresas y logos
├── lib/
│   ├── validation.ts           # Esquemas Zod (DNI, email, fecha)
│   ├── db.ts                   # Cliente Neon
│   └── env.ts                  # Validación de variables de entorno
└── actions/
    ├── registro.ts             # Server Action de inscripción
    └── contacto.ts             # Server Action de contacto
```

**El contenido vive en `src/content/` como TypeScript tipado**, no en un CMS. Con un solo evento y ~30 charlas, un CMS agrega infraestructura, costo y un punto de falla más, a cambio de una comodidad de edición que se usa cinco veces. Editar un `.ts` versionado deja historial en git y valida tipos en build.

## Flujo de datos

```
[ Visitante ]
     │
     ├── GET  ──► Vercel Edge (páginas estáticas + ISR)
     │
     ├── Registro ──► Server Action ──► Zod ──► Neon Postgres
     │                                   └────► Resend (mail de confirmación)
     │
     └── Contacto ──► Server Action ──► Zod ──► Resend ──► copat3d@aif.gob.ar
```

No hay API REST propia. Las Server Actions de Next.js cubren ambos formularios: menos superficie, menos código, CSRF resuelto por el framework.

## Decisión: registro nativo vs. Eventbrite

> ✅ **Resuelta el 18 de agosto de 2026: opción A, base propia.** Eventbrite se
> miró como referencia del flujo, no como plataforma a contratar. La tabla de
> abajo queda como registro de por qué, no como pregunta abierta.

| Opción | Implica | Cuándo elegirla |
|---|---|---|
| **A. Nativo (implementado)** | Form propio → Neon. Control total de los datos, métricas provinciales, export CSV. Requiere resolver acreditación en puerta a mano o con QR propio. | La AIF quiere la base de contactos para networking y estadística provincial. |
| **B. Solo Eventbrite** | Embed del widget. Cero backend, QR y check-in resueltos. Los datos quedan en una plataforma externa (EE.UU.). | Solo importa gestionar el acceso el día del evento. |
| **C. Dual sincronizado** | Ambos + webhooks. **Descartada para el MVP**: el costo de integración y debugging no se justifica en el plazo que queda. | Nunca, en este plazo. |

### El flujo, tal como quedó definido

1. La persona completa el formulario en el sitio.
2. El sistema emite un **código de reserva**.
3. El código le llega por **correo**.
4. La AIF procesa los datos después.

**Sin pasarela de pago**: la inscripción es gratuita. Es el flujo de Eventbrite
sin Eventbrite, que fue exactamente el pedido.

⚠️ **Nada de esto está construido todavía.** Hasta que se escriba, `/registro`
es una página placeholder, no hay capa de datos en `src/lib/` y la única Server
Action que existe es la del formulario de contacto. Este documento describe el
diseño acordado, no el estado del código.

Tres piezas que el flujo agrega y no estaban en el modelo original:

- **El código de reserva.** Corto y legible en voz alta (tipo `COPAT-7K2M`), no un
  UUID: alguien lo va a tener que dictar por teléfono o buscar en una lista.
- **El mail al inscripto.** Distinto del de contacto: va al visitante, no a la
  AIF, así que el dominio verificado en Resend deja de ser un lujo.
- **La salida de los datos.** "Después procesamos los datos" necesita una vía
  concreta y con acceso limitado. Es una decisión abierta, ver [04](04-datos-y-legales.md).

## Modelo de datos

```sql
CREATE TABLE inscripciones (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_apellido TEXT        NOT NULL,
  dni            TEXT         NOT NULL UNIQUE,
  fecha_nacimiento DATE       NOT NULL,
  email          TEXT         NOT NULL,
  ciudad         TEXT         NOT NULL,
  provincia      TEXT         NOT NULL,
  modalidad      TEXT         NOT NULL CHECK (modalidad IN ('presencial','virtual')),
  interes        TEXT,
  consentimiento BOOLEAN      NOT NULL,   -- Ley 25.326, ver doc 04
  consentimiento_at TIMESTAMPTZ NOT NULL,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

`dni UNIQUE` evita inscripciones duplicadas. `consentimiento_at` guarda **cuándo** se prestó el consentimiento, que es lo que exige la ley — no alcanza con un booleano suelto.

## Validación

Zod en `lib/validation.ts`, compartido entre cliente y servidor. **La validación de servidor es la que cuenta**: la de cliente es solo UX.

Reglas no obvias:
- **DNI argentino**: 7–8 dígitos, sin puntos. Normalizar quitando separadores antes de guardar.
- **Fecha de nacimiento**: entre 1900 y hoy. Si el evento tiene restricción de edad, validarla acá.
- **Email**: validación de formato + normalización a minúsculas para evitar duplicados por mayúsculas.

## Variables de entorno

```bash
DATABASE_URL=            # Neon connection string
RESEND_API_KEY=          # API key de Resend
CONTACT_TO=copat3d@aif.gob.ar
NEXT_PUBLIC_SITE_URL=https://copat3d.com.ar
NEXT_PUBLIC_EVENTBRITE_URL=   # Enlace público al evento
```

Validadas al arranque en `lib/env.ts`: si falta una, el build falla con un mensaje claro en vez de romper en runtime con el sitio ya publicado.
