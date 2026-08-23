/**
 * Datos del evento en un solo lugar.
 *
 * Los usan la metadata, el sitemap, el robots y el JSON-LD. Tenerlos
 * repartidos era justamente la causa de que la sede quedara desactualizada
 * en 11 archivos distintos.
 */

/**
 * `||` y no `??`: la variable puede llegar como cadena vacía —un ARG de Docker
 * sin valor, o un campo vacío en el panel de Vercel— y `??` solo cubre
 * null/undefined, con lo que `new URL("")` rompe el build entero.
 * Ver trampa 3 de AGENTS.md.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://copat3d.com.ar";

/**
 * Interruptor del formulario de registro. Apagado por defecto: recolecta
 * DNI y fecha de nacimiento de un organismo público, así que no se puede
 * publicar hasta cerrar el checklist legal de docs/04-datos-y-legales.md
 * (texto de consentimiento validado, ante todo).
 *
 * `=== "true"` y no una comparación con `!==`: así una variable ausente,
 * vacía, o con cualquier otro valor cae del lado seguro (apagado), en vez de
 * que solo `"false"` lo apague. Ver trampa 3 de AGENTS.md sobre variables
 * `NEXT_PUBLIC_*` vacías.
 *
 * El interruptor real es de código, no de infraestructura: no alcanza con
 * cambiar la variable en Vercel sin haber cerrado el checklist antes.
 */
export const REGISTRO_HABILITADO =
  process.env.NEXT_PUBLIC_REGISTRO_ABIERTO === "true";

export const EVENTO = {
  nombre: "COPAT 3D",
  nombreCompleto:
    "COPAT 3D — Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada",
  bajada:
    "Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación Aplicada",
  slogan: "Diseñando el futuro capa a capa",
  /** ISO 8601 con huso de Argentina (UTC−3). */
  inicio: "2026-10-02T09:00:00-03:00",
  fin: "2026-10-03T18:00:00-03:00",
  sede: "Fábrica de Talentos",
  ciudad: "Ushuaia",
  provincia: "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  pais: "AR",
  email: "copat3d@aif.gob.ar",
  organiza: "Agencia de Innovación Fueguina (AIF)",
} as const;
