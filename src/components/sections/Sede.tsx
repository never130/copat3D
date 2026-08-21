import {
  WireMargins,
  WireOctahedron,
  WirePrism,
} from "@/components/shapes/wire";
import { SEDE, SERVICIOS } from "@/content/sede";

/** Íconos de los servicios. Van acá y no en `content/` porque son
 *  presentación, no contenido editable. */
const ICONOS: Record<string, React.ReactNode> = {
  direccion: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  wifi: (
    <>
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <path d="M12 19.5h.01" />
    </>
  ),
  estacionamiento: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9.5 17V7.5h3a3 3 0 0 1 0 6h-3" />
    </>
  ),
  accesibilidad: (
    <>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M11 8.5v5h4" />
      <path d="M15.5 19a5 5 0 1 1-4.2-7.4" />
    </>
  ),
  catering: (
    <>
      <path d="M6 3v8a2.5 2.5 0 0 0 5 0V3" />
      <path d="M8.5 11v10" />
      <path d="M17.5 3c-1.5 1.5-2 3.5-2 6s.5 3 2 3 2-.5 2-3-.5-4.5-2-6Z" />
      <path d="M17.5 12v9" />
    </>
  ),
};

/**
 * Sede del congreso, con mapa embebido.
 *
 * El mapa usa el embed público de Google (sin clave de API). Dos cuidados:
 *
 * - `loading="lazy"`: un iframe de mapas es de lo más pesado de la página y
 *   está muy abajo. Sin esto, se descarga aunque nadie llegue a verlo.
 * - En modo oscuro se filtra para que no quede un rectángulo blanco brillante
 *   en medio del fondo negro. Ver `.mapa-sede` en globals.css.
 */
export function Sede() {
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    SEDE.direccion,
  )}&output=embed`;
  const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    SEDE.direccion,
  )}`;

  return (
    <section
      id="talentos"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <WireMargins className="hidden sm:block">
        <WireOctahedron
          size={126}
          tono="sky"
          className="absolute top-[12%] -left-34"
        />
        <WirePrism
          size={108}
          tono="coral"
          className="absolute bottom-[16%] -right-32"
        />
      </WireMargins>

      <WireMargins className="sm:hidden">
        <WirePrism
          size={84}
          tono="coral"
          className="absolute top-3 -right-8 opacity-70"
        />
      </WireMargins>

      <div className="sheet sheet-print max-w-2xl">
        <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
          La sede
        </p>
        <h2 className="titulo-impreso mt-4 text-[clamp(2rem,6vw,3.5rem)]">
          {SEDE.nombre}
        </h2>
        <p className="text-muted mt-5 text-lg">
          El polo de formación técnica de la provincia, y el lugar donde vas a
          pasar los dos días del congreso.
        </p>
      </div>

      {/* `items-center` y no el estiramiento por defecto: la columna de datos
          es más baja que el mapa, y alineada arriba dejaba un hueco muerto
          debajo. Centrada, las dos columnas se leen como un bloque. */}
      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-10">
        <div className="sheet">
          {/* La dirección sale del párrafo y pasa a bloque propio: es el dato
              que la gente viene a buscar en esta sección. */}
          <div className="flex items-start gap-4">
            <span className="bg-magenta grid size-11 shrink-0 place-items-center rounded-xl text-white">
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ICONOS.direccion}
              </svg>
            </span>
            <span>
              <span className="font-display block text-xl font-bold">
                {SEDE.calle}
              </span>
              <span className="text-muted mt-0.5 block text-sm">
                {SEDE.ciudad}, {SEDE.provincia}
              </span>
            </span>
          </div>

          <hr className="border-border my-7" />

          <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-1">
            {SERVICIOS.map((servicio, i) => (
              <li
                key={servicio.id}
                style={
                  { "--sheet-delay": `${i * 70}ms` } as React.CSSProperties
                }
                // Sin borde ni fondo propio: la fila se apoya directo sobre el
                // fondo de la sección, y el único relleno queda en el ícono.
                className="flex items-start gap-4 py-1.5"
              >
                <span className="bg-surface-2 text-accent-text grid size-11 shrink-0 place-items-center rounded-xl">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ICONOS[servicio.id]}
                  </svg>
                </span>
                <span>
                  <span className="block font-semibold">{servicio.titulo}</span>
                  <span className="text-muted mt-0.5 block text-sm">
                    {servicio.detalle}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* Acá y no flotando sobre el mapa: encima del embed tapaba los
              controles de Google y quedaba pisando la tarjeta del lugar. */}
          <a
            href={mapaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border hover:border-magenta/50 hover:text-accent-text mt-8 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-colors duration-200"
          >
            Cómo llegar
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>

        {/* Sin inclinación 3D, a diferencia del resto de las tarjetas: el mapa
            es interactivo —se arrastra y se hace zoom— y torcerlo mientras
            alguien lo usa estorba. Responde con borde y sombra, que señalan
            lo mismo sin meterse en el gesto. */}
        <div className="sheet border-border bg-surface hover:border-magenta/40 overflow-hidden rounded-3xl rounded-tl-none border transition-[border-color,box-shadow] duration-300 hover:shadow-[0_22px_44px_-22px_var(--paper-shadow)]">
          <iframe
            src={mapaSrc}
            title={`Mapa de ubicación: ${SEDE.nombre}, ${SEDE.direccion}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="mapa-sede block h-[340px] w-full border-0 lg:h-[480px]"
          />
        </div>
      </div>
    </section>
  );
}
