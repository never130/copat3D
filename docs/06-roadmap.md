# 06 — Roadmap

**Hoy: 20 de agosto de 2026 · Evento: 2 y 3 de octubre · Quedan 43 días (6 semanas).**

## Principio de priorización

El orden **no** va de lo visual a lo funcional, sino al revés: primero lo que convierte (formularios), después lo que impresiona (hero, animaciones). Motivo: si el calendario se comprime, es preferible llegar con un sitio sobrio que registra inscriptos, que con un hero espectacular y un formulario roto.

Excepción: el **sistema de diseño** va temprano porque todo lo demás se construye encima.

> ⚠️ **Hoy el proyecto está invertido respecto de este principio.** Lo visual está terminado y adelantado; lo que convierte está en cero. Ver el balance de abajo.

## Dónde estamos parados

**Terminado** — más de lo que este punto del calendario pedía:

- [x] Scaffold Next.js 16 + Tailwind v4 + Docker
- [x] Sistema de diseño: tokens, paleta, dark/light
- [x] Sistema de figuras 3D SVG + parallax del hero
- [x] Transición de hoja entre rutas y al scrollear
- [x] Navbar, Footer y estructura de secciones
- [x] Landing: hero, ejes temáticos, sede con mapa, sponsors
- [x] Logo oficial de COPAT 3D (arte de la AIF)
- [x] Carrousel con logos reales: Gobierno TDF, AIF, Buena Mezcla, Rayuela
- [x] Rutas `/agenda` y `/registro` con contenido placeholder
- [x] SEO: metadata, Open Graph, sitemap, robots, favicon, JSON-LD de evento
- [x] Formulario de contacto → Resend (código completo y probado)
- [x] Página `/privacidad` (borrador técnico)
- [x] Deploy en Vercel
- [x] Documentación `docs/01` a `docs/06`

**Sin empezar** — es la mitad que convierte:

- [ ] Formulario de registro
- [ ] Base de datos (Neon) y Server Action de inscripción
- [ ] Mail de confirmación al inscripto
- [ ] Agenda real y speakers

## Lo que bloquea, y a quién le toca

Nada de esto lo puede destrabar el equipo técnico solo. **Son cinco pedidos concretos para la AIF y uno de gestión.**

| # | Qué falta | Quién | Qué frena si no llega | Cuándo se vuelve crítico |
|---|---|---|---|---|
| 1 | ⏱️ **Delegar DNS en NIC.ar → Cloudflare** | Gestión | Dominio productivo **y** el envío de correo (Resend necesita verificar el dominio con SPF/DKIM/DMARC) | **Ya.** Propaga en 24-48hs y recién después se verifica el dominio |
| 2 | ⛔ **Texto legal de consentimiento** | Legales AIF | Publicar el formulario de registro | Semana del 31/8 |
| 3 | ⛔ **Registro propio vs. Eventbrite** | AIF | Toda la mitad de backend: base, Server Action, mail | **Ya.** Es lo que más trabajo destraba |
| 4 | **¿Se ceden datos a sponsors?** | AIF | Cambia el texto del consentimiento (va junto con #2) | Semana del 31/8 |
| 5 | **¿Fecha de nacimiento exacta o rango etario?** | AIF | Diseño del formulario. Se recomienda **rango**: mismo valor estadístico, mucho menos riesgo legal | Semana del 31/8 |
| 6 | **¿El DNI es necesario?** | AIF | Solo se justifica si hay control de acceso en puerta | Semana del 31/8 |

Dos pendientes menores que también son decisión, no tarea:

- **Validación de `/privacidad`** por legales de la AIF. Está escrita y publicable, pero es un borrador técnico.
- **¿Límite de envíos con almacén compartido?** El del formulario de contacto es en memoria: frena el reenvío accidental, no a un atacante decidido. Un límite real necesita Upstash Redis, que es un servicio y una cuenta más.

## Plan semanal

### Semana del 24–30 ago — Destrabar y conversión

- [ ] ⏱️ Iniciar delegación DNS (si no salió antes, es lo primero del lunes)
- [ ] ⛔ Reunión con la AIF por las decisiones 2 a 6
- [ ] Cargar `RESEND_API_KEY` en Vercel
- [ ] Verificar el dominio en Resend y probar que el contacto llegue de verdad a `copat3d@aif.gob.ar` (revisar spam)
- [ ] Arrancar el formulario de registro con la opción que defina la AIF

### Semana del 31 ago–6 sep — Registro de punta a punta

- [ ] Tabla en Neon + Server Action de inscripción con validación Zod
- [ ] Mail de confirmación al inscripto
- [ ] `/privacidad` actualizada con la sección de datos de inscripción, **antes** de recolectar el primer dato
- [ ] Límite de envíos en ambos formularios

**Hito:** al cerrar esta semana una persona puede inscribirse de punta a punta. Todo lo que sigue es mejora.

### Semana del 7–13 sep — Contenido de terceros

- [ ] Perseguir agenda definitiva y speakers confirmados ← *depende de terceros, empezar a pedirlo ya*
- [ ] Cargar la agenda en `src/content/`
- [ ] Fotos y bios de speakers
- [ ] Perseguir los logos de sponsors que faltan

### Semana del 14–20 sep — Pulido

- [ ] Sección "Sumate como empresa" con propuesta por nivel de sponsoreo
- [ ] Filtros de la agenda por día / eje / modalidad
- [ ] Revisión de textos (redacción institucional)
- [ ] Analítica configurada (Vercel Analytics o Plausible)

### Semana del 21–27 sep — QA

- [ ] Testing en dispositivos reales (Android e iOS), no solo DevTools
- [ ] Auditoría de accesibilidad: contraste, foco, teclado, lectores de pantalla
- [ ] Lighthouse ≥ 90 en Performance y Accesibilidad
- [ ] Prueba de carga del formulario
- [ ] Checklist completo de [05-infraestructura](05-infraestructura-deploy.md)
- [ ] Dominio productivo apuntando y SSL verificado
- [ ] Verificar la preview real al compartir en WhatsApp y LinkedIn
- [ ] Revalidar el JSON-LD en la prueba de resultados enriquecidos de Google

### Semana del 28 sep–1 oct — Freeze

- [ ] **Congelamiento de features.** Solo correcciones críticas
- [ ] Backup de la base de inscriptos (export CSV)
- [ ] Verificado el límite diario de envío de Resend
- [ ] Difusión: material para redes con la identidad del sitio
- [ ] Guardia definida para los días 2 y 3

### 2–3 oct — Evento

- [ ] Monitoreo activo
- [ ] Actualización de agenda en vivo si hay cambios

## Post-evento (v2)

- Galería de fotos y videos del congreso
- Grabaciones de las charlas
- Página de la edición 2027 con formulario de "avisame"
- Anonimización de datos según política de retención ([04](04-datos-y-legales.md))
- **Figuras en WebGL.** Evaluado y descartado para esta edición: R3F con drei agrega 261 KB gzip sobre los 247 KB que pesa hoy el sitio entero, y el arte de marca es facetado plano, así que se vería casi igual pero con un loop de render permanente. Si algún día se hace, OGL (13,5 KB) antes que R3F.

## Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| **El DNS no se delega a tiempo** | **Alta** | **Alto** | Es el único ítem con espera externa que no se puede comprimir, y ahora además bloquea el correo. Iniciarlo ya |
| **La AIF demora las decisiones de registro** | **Alta** | **Alto** | Cada semana de demora se come una de las cuatro que quedan para construirlo y probarlo. Si llega la semana del 7/9 sin respuesta, ir a Eventbrite por descarte |
| El contenido (speakers, agenda) llega tarde | **Alta** | Medio | Los estados "próximamente" ya están diseñados; no bloquear el deploy esperando contenido |
| Legales demora el texto de consentimiento | Media | **Alto** | El formulario se puede tener listo y publicarlo detrás de ese texto |
| Alcance creciente ("agreguemos un blog…") | Media | Alto | [01-visión](01-vision-y-alcance.md) fija el alcance; todo pedido nuevo entra a v2 por defecto |
| Pico de tráfico el día del anuncio | Media | Bajo | Cloudflare cachea; Vercel escala solo |
| Logos de sponsors sin llegar | Baja | Bajo | El carrousel ya se ve bien con 4 logos reales y el resto en placeholder |
