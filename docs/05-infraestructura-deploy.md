# 05 — Infraestructura y Deploy

## ¿Alcanza solo con Vercel?

**Para el frontend, sí. Para el sistema completo, no.** Vercel resuelve hosting, SSR, Server Actions, CDN y certificados, pero no persiste datos ni envía correos.

```
[ Visitante ]
      │
      ▼
[ Cloudflare ]  DNS · SSL Full (Strict) · WAF · Cache
      │
      ▼
[ Vercel ]  Next.js · Server Actions
      │
      ├──► [ Neon Postgres ]  inscripciones
      └──► [ Resend ]  ──► copat3d@aif.gob.ar
```

| Servicio | Plan | Costo | Suficiencia |
|---|---|---|---|
| Vercel | Hobby | US$ 0 | Alcanza para el lanzamiento. **Ojo:** Hobby prohíbe uso comercial — para un organismo público conviene consultar, o ir a Pro (US$20/mes) por seguridad y por los límites del día del evento |
| Neon | Free | US$ 0 | 0.5 GB — sobran para decenas de miles de inscriptos |
| Resend | Free | US$ 0 | 3.000 mails/mes, 100/día. **Verificar el límite diario** si se esperan picos de inscripción |
| Cloudflare | Free | US$ 0 | DNS, SSL y WAF básico incluidos |

## Región de las funciones de Vercel

`vercel.json` fija `"regions": ["gru1"]` (San Pablo, Brasil) — es el punto de Vercel más cercano a Argentina que existe hoy, y hasta hace poco el plan Hobby ni siquiera lo permitía elegir: quedaba fijo en Virginia (EE. UU.) por defecto.

Importa porque la latencia que pesa no es "visitante → base": el navegador nunca habla directo con Neon, habla con la función de Vercel, y esa función es la que consulta Neon. Si la función corre en Virginia y la base en San Pablo (o viceversa), cada Server Action cruza el Atlántico igual, sin importar dónde esté el visitante.

**El proyecto de Neon tiene que crearse en la misma región (`AWS South America East 1 — São Paulo`)** para que la ganancia sea real. Elegir Neon en Virginia y dejar Vercel en San Pablo (o al revés) es peor que tener las dos en el mismo lado: ahí sí se cruza el océano en cada consulta.

## Configuración de dominio: copat3d.com.ar

> ⏱️ **Empezar ya.** La delegación de nameservers en NIC.ar puede tardar **24 a 48 horas** en propagar. No dejarlo para la semana del evento.

### Paso 1 — Alta en Cloudflare

1. Crear cuenta y agregar el sitio `copat3d.com.ar`.
2. Cloudflare entrega dos nameservers (ej. `aria.ns.cloudflare.com`, `rob.ns.cloudflare.com`).

### Paso 2 — Delegar en NIC.ar

En el panel de NIC.ar → *Mis dominios* → `copat3d.com.ar` → **Delegación**, reemplazar los nameservers por los de Cloudflare. Esperar la propagación.

Verificar con:

```bash
nslookup -type=NS copat3d.com.ar
```

### Paso 3 — Registros DNS en Cloudflare

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| CNAME | `copat3d.com.ar` | `cname.vercel-dns.com` | 🔘 DNS only (gris) *al inicio* |
| CNAME | `www` | `cname.vercel-dns.com` | 🔘 DNS only (gris) *al inicio* |

> El estándar DNS no permite un CNAME en el dominio raíz, pero **Cloudflare lo resuelve con CNAME flattening automático**. Se carga como CNAME normal y funciona.

### Paso 4 — SSL

En Cloudflare → **SSL/TLS** → modo **Full (Strict)**.

> ⚠️ Si se deja en *Flexible*, se produce un bucle de redirección (`ERR_TOO_MANY_REDIRECTS`) porque Vercel ya fuerza HTTPS. Es el error más común de esta combinación.

### Paso 5 — Verificar en Vercel y activar el proxy

1. En Vercel → Project → *Domains* → agregar `copat3d.com.ar` y `www.copat3d.com.ar`.
2. Esperar a que Vercel emita el certificado (con el proxy **en gris**; si está naranja, la verificación puede fallar).
3. Una vez emitido, **pasar el proxy a naranja (Proxied)** para activar CDN, cache y protección DDoS.

### Paso 6 — Registros de email

Para que Resend pueda enviar desde `@copat3d.com.ar` sin caer en spam, agregar los registros **SPF, DKIM y DMARC** que indique el panel de Resend al verificar el dominio.

> Estos registros van siempre en **DNS only (gris)**. Un registro TXT proxeado no resuelve.

## Docker

El proyecto está containerizado para **paridad de entorno y build reproducible**, no porque el deploy lo requiera (Vercel construye desde el repositorio).

Para qué sirve concretamente acá:
- Cualquier persona del equipo levanta el proyecto sin instalar la versión correcta de Node.
- Postgres local en desarrollo, sin depender de la capa free de Neon ni tocar datos reales.
- Salida de emergencia: si la AIF exige alojar en infraestructura propia del Estado, la imagen se despliega en cualquier VPS sin reescribir nada.

### Desarrollo

```bash
docker compose up
```

Levanta la app en modo dev con hot-reload en `http://localhost:3000` y un Postgres local en `localhost:5432`.

### Producción

```bash
docker build -t copat3d .
docker run -p 3000:3000 --env-file .env.production copat3d
```

Para apuntar a otro dominio en build time:

```bash
docker build -t copat3d --build-arg NEXT_PUBLIC_SITE_URL=https://staging.copat3d.com.ar .
```

La imagen usa **multi-stage build** con la salida `standalone` de Next.js: no incluye `node_modules` de desarrollo ni el código fuente, corre como usuario no-root (`nextjs`, uid 1001) y expone un `HEALTHCHECK` contra `/api/health`.

> ⚠️ **`output: "standalone"` no puede estar activo al deployar en Vercel.** Vercel tiene su propio empaquetado serverless y esa opción lo pisa: el build compila y genera las páginas sin error visible, pero el deploy falla después, en el paso de empaquetado — un fallo silencioso y confuso porque el log previo se ve perfecto.
>
> Por eso `next.config.ts` la activa solo bajo `process.env.DOCKER_BUILD`, variable que el `Dockerfile` define antes de compilar y que Vercel nunca setea. Si el deploy en Vercel falla con el log de build en verde, revisar primero que `next.config.ts` no tenga `output: "standalone"` sin esa condición.

> **Nota:** el build descarga las fuentes de Google Fonts, por lo que **requiere red durante `docker build`**. Si se necesita build sin red, hay que auto-hospedar las fuentes en `public/fonts/`.

### ⚠️ Trampa: `NEXT_PUBLIC_*` vacías rompen el build

Un `ARG` de Docker sin valor no queda indefinido: el `ENV` que lo consume se define como **cadena vacía**. Y en JavaScript `??` **no** cubre la cadena vacía, solo `null`/`undefined`:

```ts
process.env.NEXT_PUBLIC_SITE_URL ?? "https://copat3d.com.ar"  // ❌ devuelve ""
process.env.NEXT_PUBLIC_SITE_URL || "https://copat3d.com.ar"  // ✅
```

Con `??`, `new URL("")` lanza `ERR_INVALID_URL` y **falla el build entero** al recolectar la metadata. Esto no es exclusivo de Docker: pasa igual si en el panel de Vercel se deja la variable creada pero con el valor vacío.

Por eso los `ARG` del Dockerfile llevan valor por defecto **y** el código usa `||`. Al agregar una variable nueva, respetar ambas cosas.

## Checklist de lanzamiento

**Infraestructura**
- [ ] Nameservers delegados en NIC.ar y propagados
- [ ] Registros CNAME cargados en Cloudflare
- [ ] SSL en Full (Strict)
- [ ] Dominio verificado en Vercel y certificado emitido
- [ ] Proxy pasado a naranja
- [ ] SPF, DKIM y DMARC verificados en Resend
- [ ] Variables de entorno cargadas en Vercel (production)
- [ ] Redirección `www` → apex definida

**Aplicación**
- [ ] Formularios probados end-to-end en producción
- [ ] Mail de contacto llegando a copat3d@aif.gob.ar (revisar spam)
- [ ] Página `/privacidad` publicada
- [x] Open Graph con imagen (`opengraph-image.jpg`, 1200×630, 74 KB)
- [ ] Verificar la preview real al compartir en WhatsApp y LinkedIn — **solo se puede una vez publicado**, porque los scrapers necesitan la URL pública
- [x] `sitemap.xml` y `robots.txt`
- [x] Favicon, apple-touch-icon y JSON-LD de evento
- [ ] Revalidar el JSON-LD en la [prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results) con el dominio ya activo
- [ ] Favicon COPAT 3D
- [ ] Lighthouse ≥ 90 en Performance y Accesibilidad
- [ ] Probado en mobile real, no solo en DevTools
- [ ] Analítica configurada (Vercel Analytics o Plausible)

**Contingencia del día del evento**
- [ ] Verificado el límite diario de envío de Resend
- [ ] Backup manual de la tabla de inscriptos (export CSV) antes del evento
- [ ] Contacto de alguien con acceso a Vercel/Cloudflare disponible los días 2 y 3
