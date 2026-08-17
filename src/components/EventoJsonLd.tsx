import { EVENTO, SITE_URL } from "@/lib/site";

/**
 * Datos estructurados schema.org/Event.
 *
 * Es lo que permite que Google muestre fecha, sede y estado del evento
 * directamente en el resultado de búsqueda, en vez de solo un título y una
 * descripción. Para un congreso con fecha fija es de las piezas de SEO con
 * mejor relación esfuerzo/beneficio.
 *
 * `eventAttendanceMode` es presencial: la modalidad virtual se sacó del copy
 * (ver /agenda y /registro). Si vuelve a haber streaming, hay que pasarlo a
 * MixedEventAttendanceMode y agregar un VirtualLocation.
 */
export function EventoJsonLd() {
  const datos = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: EVENTO.nombreCompleto,
    alternateName: EVENTO.nombre,
    description: `${EVENTO.bajada}. ${EVENTO.slogan}.`,
    startDate: EVENTO.inicio,
    endDate: EVENTO.fin,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE_URL}/opengraph-image.jpg`],
    url: SITE_URL,
    inLanguage: "es-AR",
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: EVENTO.sede,
      address: {
        "@type": "PostalAddress",
        addressLocality: EVENTO.ciudad,
        addressRegion: EVENTO.provincia,
        addressCountry: EVENTO.pais,
      },
    },
    organizer: {
      "@type": "Organization",
      name: EVENTO.organiza,
      email: EVENTO.email,
      url: "https://aif.gob.ar",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/registro`,
      validFrom: "2026-08-01T00:00:00-03:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      // El contenido es un objeto propio, no entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
