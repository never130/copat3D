import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Sitemap del sitio. Son pocas URLs: no hace falta generarlo dinámicamente
 * mientras no haya contenido por base de datos.
 *
 * Solo se listan rutas que existen: una URL que devuelve 404 perjudica el
 * rastreo.
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
    {
      // Prioridad baja a propósito: tiene que ser accesible e indexable, pero
      // no compite por posicionamiento con las páginas del congreso.
      url: `${SITE_URL}/privacidad`,
      lastModified: hoy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
