import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap del sitio. Son cuatro URLs: no hace falta generarlo dinámicamente
 * mientras no haya contenido por base de datos.
 *
 * `/privacidad` todavía no existe (es bloqueante para publicar el formulario,
 * ver docs/04) y por eso no figura acá: listar una URL que devuelve 404
 * perjudica el rastreo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();

  return [
    { url: SITE_URL, lastModified: hoy, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/agenda`,
      lastModified: hoy,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/registro`,
      lastModified: hoy,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
