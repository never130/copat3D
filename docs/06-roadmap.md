# 06 — Roadmap

**Hoy: 15 de agosto de 2026 · Evento: 2 y 3 de octubre de 2026 · Disponible: ~7 semanas**

## Principio de priorización

El orden **no** va de lo visual a lo funcional, sino al revés: primero lo que convierte (formularios), después lo que impresiona (hero, animaciones). Motivo: si el calendario se comprime, es preferible llegar con un sitio sobrio que registra inscriptos, que con un hero espectacular y un formulario roto.

Excepción: el **sistema de diseño** va temprano porque todo lo demás se construye encima.

## Plan semanal

### Semana 1 · 18–24 ago — Fundaciones y desbloqueo

El objetivo real de esta semana es **destrabar lo que depende de terceros**, porque tiene los tiempos de espera más largos.

- [ ] ⛔ Reunión con la AIF: decidir registro nativo vs. Eventbrite ([03](03-arquitectura.md))
- [ ] ⛔ Pedir a legales el texto de consentimiento de datos ([04](04-datos-y-legales.md))
- [ ] ⏱️ Iniciar delegación DNS en NIC.ar → Cloudflare (tarda 24-48hs) ([05](05-infraestructura-deploy.md))
- [ ] Confirmar licencia de Helvetica Now Display ([02](02-design-system.md))
- [x] Scaffold Next.js + Tailwind v4 + Docker
- [x] Sistema de diseño: tokens, paleta, dark/light
- [x] Sistema de figuras 3D SVG
- [ ] Navbar + Footer + estructura de secciones

### Semana 2 · 25–31 ago — Conversión

- [ ] Formulario de registro completo con validación Zod
- [ ] Server Action + tabla en Neon
- [ ] Formulario de contacto → Resend → copat3d@aif.gob.ar
- [ ] Mail de confirmación al inscripto
- [ ] Página `/privacidad`
- [ ] Rate limiting en ambos formularios
- [ ] Deploy inicial a Vercel (staging, dominio `.vercel.app`)

**Hito:** al cerrar la semana 2, una persona puede inscribirse de punta a punta. Todo lo que sigue es mejora.

### Semana 3 · 1–7 sep — Contenido estructural

- [ ] Hero definitivo con figuras 3D y parallax
- [ ] Sección de ejes temáticos
- [ ] Sección de agenda con filtros por día / eje / modalidad
- [ ] Sección de impacto territorial (métricas del evento)
- [ ] Datos de contenido en `src/content/` (con placeholders donde falte info)

### Semana 4 · 8–14 sep — Empresas y sponsors

- [ ] Carrousel infinito de logos
- [ ] Sección "Sumate como empresa" con propuesta de valor por nivel de sponsoreo
- [ ] Sección Fábrica de Talentos
- [ ] Perseguir logos e info de sponsors ← *esto depende de terceros, arrancarlo antes*

### Semana 5 · 15–21 sep — Contenido real y pulido

- [ ] Cargar agenda definitiva y speakers confirmados
- [ ] Fotos y bios de speakers
- [ ] SEO: metadata, Open Graph, sitemap, robots
- [ ] Microinteracciones y animaciones de entrada
- [ ] Revisión de textos (redacción institucional)

### Semana 6 · 22–28 sep — QA

- [ ] Testing en dispositivos reales (Android e iOS)
- [ ] Auditoría de accesibilidad (contraste, foco, teclado, lectores de pantalla)
- [ ] Lighthouse ≥ 90 en Performance y Accesibilidad
- [ ] Prueba de carga del formulario
- [ ] Checklist completo de [05-infraestructura](05-infraestructura-deploy.md)
- [ ] Dominio productivo apuntando y SSL verificado

### Semana 7 · 29 sep–1 oct — Freeze

- [ ] **Congelamiento de features.** Solo correcciones críticas
- [ ] Backup de la base de inscriptos
- [ ] Difusión: material para redes con la identidad del sitio
- [ ] Guardia definida para los días 2 y 3

### 2–3 oct — Evento

- [ ] Monitoreo activo
- [ ] Actualización de agenda en vivo si hay cambios

## Post-evento (v2)

- Galería de fotos y videos del congreso
- Grabaciones de las charlas
- Página de la edición 2027 con el formulario de "avisame"
- Anonimización de datos según política de retención ([04](04-datos-y-legales.md))

## Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| El contenido (speakers, agenda) llega tarde | **Alta** | Medio | Diseñar estados "próximamente" desde el día uno; no bloquear el deploy esperando contenido |
| Legales demora el texto de consentimiento | Media | **Alto** | Pedirlo en semana 1; tener el formulario listo y publicarlo detrás de ese texto |
| El DNS no propaga a tiempo | Baja | **Alto** | Iniciarlo en semana 1, no en la 6 |
| Alcance creciente ("agreguemos un blog…") | **Alta** | Alto | [01-visión](01-vision-y-alcance.md) fija el alcance; todo pedido nuevo entra a v2 por defecto |
| Pico de tráfico el día del anuncio | Media | Bajo | Cloudflare cachea; Vercel escala solo |
| Logos de sponsors sin llegar | Media | Bajo | Grilla que se ve bien con 4 o con 20 logos |
