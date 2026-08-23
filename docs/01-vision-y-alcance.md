# 01 — Visión y Alcance

## Evento

| Dato | Valor |
|---|---|
| Nombre | **COPAT 3D** |
| Bajada | Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada |
| Slogan | *Diseñando el futuro capa a capa* |
| Fechas | 2 y 3 de octubre de 2026 |
| Sede | Fábrica de Talentos — Ushuaia, Tierra del Fuego |
| Organiza | AIF (Agencia de Innovación de Fuego) |
| Contacto | copat3d@aif.gob.ar |
| Dominio | copat3d.com.ar |

## Objetivo del sitio

No es un sitio institucional: es un **embudo de conversión** con tres audiencias y tres acciones distintas.

| Audiencia | Acción que queremos | Métrica de éxito |
|---|---|---|
| Asistente (público general, estudiantes) | Registrarse al congreso | N° de inscriptos |
| Empresa / Sponsor | Contactar para sumarse | N° de leads B2B |
| Prensa / Instituciones | Descargar info, contactar | Cobertura y difusión |

Todo lo demás (agenda, ejes, speakers) existe para **dar razones** de ejecutar una de esas tres acciones. Si una sección no empuja a registro, sponsoreo o contacto, es candidata a recorte.

## Posicionamiento

> Innovación y soberanía tecnológica desde el Fin del Mundo hacia el futuro industrial.

El diferencial de COPAT 3D no es "otro congreso de impresión 3D": es el **único congreso de fabricación digital de la Patagonia austral**, con respaldo estatal provincial y vínculo directo con el entramado industrial fueguino. Ese ángulo territorial es el activo de marketing más fuerte y debe leerse en el hero, no enterrado en un "Sobre nosotros".

## Ejes temáticos

1. **Salud y Bioimpresión** — prótesis, biomateriales, modelado médico y planificación quirúrgica.
2. **Infraestructura y Construcción** — hábitat en clima extremo, sustentabilidad, hormigón 3D.
3. **Industria 4.0** — repuestos on-demand, aeronáutica, electrónica, metalmecánica y automatización.
4. **Polos Creativos y Fábrica de Talentos** — formación provincial, robótica, startups locales.

## Alcance MVP (lo que sale al aire)

- [x] Landing con identidad visual COPAT 3D (dark/light)
- [x] Hero con sistema de figuras 3D animadas
- [ ] Ejes temáticos
- [ ] Agenda por día con filtros por eje y modalidad
- [ ] Formulario de registro de asistentes (con consentimiento Ley 25.326)
- [ ] Formulario de contacto → copat3d@aif.gob.ar
- [ ] Carrousel de empresas y sponsors
- [ ] SEO, Open Graph, favicon, sitemap
- [ ] Responsive completo + accesibilidad AA

## Fuera de alcance (v2, post-evento o si sobra tiempo)

Decisiones explícitas de recorte, con su motivo:

| Descartado del MVP | Motivo |
|---|---|
| Sincronización bidireccional con API de Eventbrite | Alto costo de integración y debugging para beneficio marginal. Se resuelve con enlace/embed. Ver [03-arquitectura](03-arquitectura.md). |
| Motor WebGL (React Three Fiber) con física por figura | Semanas de ajuste fino + costo de performance en mobile. Se logra el mismo impacto visual con SVG + CSS. **Medido (ago/2026):** R3F con drei agrega 261 KB gzip sobre los 247 KB que pesa hoy el sitio entero — lo más que duplica. Y como el arte de marca es facetado plano, se vería casi igual pero con un loop de render permanente. Ver [02-design-system](02-design-system.md). |
| Panel de administración de contenido (CMS) | Con un solo evento y contenido acotado, el contenido vive en archivos versionados. |
| Login / cuentas de usuario | El registro no requiere sesión persistente. |
| Streaming propio | Se delega en plataforma externa (YouTube / Meet). |

## Restricción dominante: el calendario

Hoy es **20 de agosto de 2026**. El evento es el **2 de octubre**. Son **6 semanas**, y en ese plazo no solo hay que programar: hay que **cargar contenido real** (speakers confirmados, agenda definitiva, logos de sponsors) que depende de terceros y llega tarde por naturaleza.

Consecuencia de diseño: **el sitio debe funcionar y verse bien con contenido incompleto**. Estados como "Agenda en construcción" o "Speakers próximamente" son parte del diseño, no un error.

Ver [06-roadmap](06-roadmap.md) para el plan semanal.

## Decisiones abiertas (requieren confirmación de la AIF)

| # | Decisión | Por qué bloquea |
|---|---|---|
| ~~1~~ | ~~¿El registro necesita base de datos propia o alcanza Eventbrite?~~ | ✅ **Resuelta el 18/8/2026: base propia.** Ver [03-arquitectura](03-arquitectura.md). |
| ~~2~~ | ~~Texto legal de consentimiento de datos personales~~ | ✅ **Resuelta el 23/8/2026: publicado**, confirmado por gestión. Ver [04-datos-y-legales](04-datos-y-legales.md). |
| 3 | ¿La AIF tiene licencia web de Helvetica Now Display? | Es una fuente paga. Ver [02-design-system](02-design-system.md). |
| ~~4~~ | ~~Titularidad del dominio y acceso a NIC.ar~~ | ✅ **Resuelta el 23/8/2026: dominio delegado y en vivo.** Ver [05-infraestructura](05-infraestructura-deploy.md). |
