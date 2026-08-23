# syntax=docker/dockerfile:1

# ==========================================================================
# COPAT 3D — build multi-stage
# Ver docs/05-infraestructura-deploy.md
# ==========================================================================

FROM node:24-alpine AS base
WORKDIR /app
# Next.js standalone necesita libc6-compat en Alpine
RUN apk add --no-cache libc6-compat


# --------------------------------------------------------------------------
# deps — instala dependencias en una capa cacheable
# --------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci


# --------------------------------------------------------------------------
# dev — usada por docker-compose para desarrollo con hot-reload
# --------------------------------------------------------------------------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]


# --------------------------------------------------------------------------
# builder — compila la aplicación
# --------------------------------------------------------------------------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
# Activa `output: "standalone"` en next.config.ts. Sin esta variable el
# build produce un .next normal, no el que espera el stage `runner` de abajo.
ENV DOCKER_BUILD=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* se inlinea en el bundle en build time, no en runtime.
# Los ARG llevan default: sin valor, el ENV quedaría en cadena vacía y el
# build fallaría al construir la URL base de la metadata.
ARG NEXT_PUBLIC_SITE_URL=https://copat3d.com.ar
# Default vacío = apagado: sin --build-arg explícito, el registro no se
# habilita en la imagen. Ver src/lib/site.ts.
ARG NEXT_PUBLIC_REGISTRO_ABIERTO=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_REGISTRO_ABIERTO=$NEXT_PUBLIC_REGISTRO_ABIERTO
# Requiere red: next/font descarga las tipografías de Google en el build
RUN npm run build


# --------------------------------------------------------------------------
# runner — imagen final, mínima y sin privilegios
# --------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# La salida standalone ya trae el mínimo de node_modules que necesita
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
