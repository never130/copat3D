# 06 — Roadmap

**Hoy: 23 de agosto de 2026 · Evento: 2 y 3 de octubre · Quedan 40 días (~5.5 semanas).**

## Principio de priorización

El orden **no** va de lo visual a lo funcional, sino al revés: primero lo que convierte (formularios), después lo que impresiona (hero, animaciones). Motivo: si el calendario se comprime, es preferible llegar con un sitio sobrio que registra inscriptos, que con un hero espectacular y un formulario roto.

Excepción: el **sistema de diseño** va temprano porque todo lo demás se construye encima.

> ✅ **El 23/8 el proyecto se puso al día con este principio.** Hasta ese día lo visual estaba terminado y lo que convierte en cero; en una sola jornada se resolvió el registro completo —base, mail, panel de administración, check-in— y quedó en producción. Lo que falta hoy es contenido de terceros (agenda, speakers) y QA, no funcionalidad.

## Dónde estamos parados

**Terminado:**

- [x] Scaffold Next.js 16 + Tailwind v4 + Docker
- [x] Sistema de diseño: tokens, paleta, dark/light
- [x] Sistema de figuras 3D SVG + parallax del hero
- [x] Transición de hoja entre rutas y al scrollear
- [x] Navbar, Footer y estructura de secciones
- [x] Landing: hero, ejes temáticos, sede con mapa, sponsors
- [x] Logo oficial de COPAT 3D (arte de la AIF)
- [x] Carrousel con logos reales: Gobierno TDF, AIF, Buena Mezcla, Rayuela
- [x] Ruta `/agenda` (contenido placeholder — ver "Sin empezar")
- [x] SEO: metadata, Open Graph, sitemap, robots, favicon, JSON-LD de evento
- [x] Formulario de contacto → Resend, verificado en producción
- [x] Página `/privacidad` — sección de inscriptos agregada el 23/8, sigue como borrador técnico hasta validación legal formal
- [x] Deploy en Vercel, región `gru1` (San Pablo) igual que Neon
- [x] Documentación `docs/01` a `docs/06`
- [x] **DNS propio**: `copat3d.com.ar` delegado, proxeado por Cloudflare, SSL Full (strict)
- [x] **Registro completo**: formulario real, Neon (San Pablo), código de reserva, mail de confirmación con diseño de marca y QR
- [x] Dominio verificado en Resend (DKIM/SPF/MX) — los mails salen de `no-responder@copat3d.com.ar`, no del remitente de prueba
- [x] **Panel `/admin`**: protegido con contraseña, buscador, marcado de asistencia, export a CSV
- [x] Registro **en producción** en `copat3d.com.ar/registro`, con la AIF ya confirmando el texto de consentimiento

**Sin empezar:**

- [ ] Agenda real y speakers (`src/content/` solo tiene `ejes.ts` y `sede.ts`)
- [ ] Logos de sponsors que faltan
- [ ] Sección "Sumate como empresa" con niveles de sponsoreo

## Lo que bloquea, y a quién le toca

De los siete pedidos originales, **queda uno solo abierto formalmente.**

| # | Qué falta | Quién | Qué frena si no llega | Estado |
|---|---|---|---|---|
| ~~1~~ | ✅ **Delegar DNS en NIC.ar → Cloudflare** | Gestión | — | **Resuelto el 23/8.** Dominio en vivo, proxeado, SSL Full (strict), y dominio verificado en Resend (DKIM/SPF/MX) — los mails ya salen de `no-responder@copat3d.com.ar` |
| 2 | 🟡 **Texto legal de consentimiento** | Legales AIF | Nada en la práctica: gestión ya dio el visto bueno el 23/8 y el registro está publicado | El texto está cargado y funcionando; falta solo si en el proceso interno de la AIF hace falta una revisión más formal — administrativo, no técnico |
| ~~3~~ | ✅ **Registro propio vs. Eventbrite** | AIF | — | **Resuelta el 18/8: base propia**, con el flujo de Eventbrite copiado (código de reserva + mail). Ver [03](03-arquitectura.md) |
| ~~4~~ | ✅ **¿Se ceden datos a sponsors?** | AIF | — | **Resuelta el 23/8: no se ceden.** Ver [04](04-datos-y-legales.md) §2 |
| ~~5~~ | ✅ **¿Fecha de nacimiento exacta o rango etario?** | AIF | — | **Resuelta: fecha completa** (decisión de gestión, no la recomendación técnica). Ver [04](04-datos-y-legales.md) |
| ~~6~~ | ✅ **¿El DNI es necesario?** | AIF | — | **Resuelta: sí, siempre** |
| ~~7~~ | ✅ **¿Cómo se inscriben los menores de edad?** | AIF + Legales | — | **Resuelta el 23/8: solo mayores de 18 se auto-registran**, implementado en el bloqueo de edad de `registro.ts`. Ver [04](04-datos-y-legales.md) §4 |

Pendientes menores, sin fecha crítica:

- **Base registrada ante la AAIP** — confirmar si una inscripción existente de la AIF ya la cubre, o hay que dar de alta una nueva.
- **Plazo de retención de datos** — `/privacidad` usa el default recomendado (12 meses), nunca lo confirmó explícitamente la AIF.
- **¿Límite de envíos con almacén compartido?** El de los dos formularios es en memoria: frena el reenvío accidental, no a un atacante decidido. Un límite real necesita Upstash Redis, que es un servicio y una cuenta más.

## Plan semanal

### 23 de agosto — Todo lo de las dos semanas siguientes, en un día

Lo que estaba planeado para el 24/8 al 6/9 se completó el mismo 23/8, apenas la AIF dio el visto bueno al texto de consentimiento:

- [x] ~~Iniciar delegación DNS~~ — propagó y quedó verificado en vivo
- [x] ~~Reunión con la AIF por las decisiones 2, 4 y 7~~ — las tres resueltas
- [x] ~~Cargar `RESEND_API_KEY` en Vercel~~
- [x] ~~Verificar el dominio en Resend~~ — llega a la bandeja principal, no a spam
- [x] ~~Tabla en Neon + Server Action de inscripción con validación Zod~~
- [x] ~~Mail de confirmación al inscripto~~ — con diseño de marca y QR
- [x] ~~`/privacidad` actualizada con la sección de datos de inscripción~~ — antes de recibir el primer registro real
- [x] ~~Arrancar y publicar el formulario de registro~~ — **en producción**, probado de punta a punta contra Neon + Resend reales
- [x] Panel `/admin` con check-in — no estaba planeado para esta etapa, se adelantó junto con lo anterior

**Hito alcanzado, dos semanas antes de lo previsto:** una persona ya puede inscribirse de punta a punta en `copat3d.com.ar`.

Sigue pendiente, sin fecha crítica: límite de envíos con almacén compartido (Upstash Redis) en los dos formularios.

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
- [x] ~~Dominio productivo apuntando y SSL verificado~~ — hecho el 23/8, semanas antes de lo previsto
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
| ~~El DNS no se delega a tiempo~~ | — | — | **Resuelto el 23/8.** Ya no es un riesgo |
| ~~La AIF demora el texto de consentimiento~~ | — | — | **Resuelto el 23/8.** Registro construido, probado y publicado; queda solo si la AIF necesita un paso administrativo interno más formal |
| El contenido (speakers, agenda) llega tarde | **Alta** | Medio | Los estados "próximamente" ya están diseñados; no bloquear el deploy esperando contenido |
| Alcance creciente ("agreguemos un blog…") | Media | Alto | [01-visión](01-vision-y-alcance.md) fija el alcance; todo pedido nuevo entra a v2 por defecto |
| Pico de tráfico el día del anuncio | Media | Bajo | Cloudflare cachea; Vercel escala solo |
| Logos de sponsors sin llegar | Baja | Bajo | El carrousel ya se ve bien con 4 logos reales y el resto en placeholder |
