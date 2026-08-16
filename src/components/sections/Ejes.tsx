import {
  WireCube,
  WireIcosahedron,
  WireMargins,
  WireOctahedron,
  WirePrism,
} from "@/components/shapes/wire";
import { EJES } from "@/content/ejes";

/**
 * Las tarjetas no usan la caja genérica de borde parejo: la identidad del
 * congreso es "capa a capa", así que cada una se lee como una pieza apoyada
 * sobre una base de color —el plato de la impresora— con las capas apiladas
 * a un costado. El número gigante sangra fuera del recorte, como en el arte
 * original del afiche.
 */
const ACCENT: Record<
  string,
  { text: string; bg: string; borderHover: string; glow: string }
> = {
  "copat-coral": {
    text: "text-copat-coral",
    bg: "bg-copat-coral",
    borderHover: "group-hover:border-copat-coral/45",
    glow: "group-hover:shadow-copat-coral/20",
  },
  "copat-sky": {
    text: "text-copat-sky",
    bg: "bg-copat-sky",
    borderHover: "group-hover:border-copat-sky/45",
    glow: "group-hover:shadow-copat-sky/20",
  },
  "copat-yellow": {
    text: "text-copat-yellow",
    bg: "bg-copat-yellow",
    borderHover: "group-hover:border-copat-yellow/45",
    glow: "group-hover:shadow-copat-yellow/20",
  },
  "copat-green": {
    text: "text-copat-green",
    bg: "bg-copat-green",
    borderHover: "group-hover:border-copat-green/45",
    glow: "group-hover:shadow-copat-green/20",
  },
};

/** Capas apiladas: la firma visual de la impresión 3D. Se despliegan al pasar
 *  el mouse, de abajo hacia arriba, como si la pieza siguiera imprimiéndose. */
function Capas({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute right-7 bottom-7 flex flex-col items-end gap-[3px]"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className={`block h-[3px] rounded-full ${color} w-[var(--w)] transition-[width,opacity] duration-500 ease-[var(--ease-out-expo)] group-hover:w-[calc(var(--w)*1.7)] group-hover:opacity-100`}
          style={
            {
              "--w": `${12 + n * 7}px`,
              opacity: 0.2 + n * 0.09,
              transitionDelay: `${(4 - n) * 45}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Ejes() {
  return (
    <section
      id="ejes"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      {/* Márgenes laterales: solo asoman cuando el viewport supera el
          max-w-7xl del contenido. En mobile quedan fuera de pantalla. */}
      <WireMargins className="hidden sm:block">
        <WireIcosahedron
          size={140}
          tono="coral"
          className="absolute top-[5%] -left-36"
        />
        <WirePrism
          size={112}
          tono="green"
          className="absolute top-[16%] -right-32"
        />
        <WireCube
          size={120}
          tono="sky"
          className="absolute top-[52%] -right-32"
        />
        <WireOctahedron
          size={118}
          tono="lilac"
          className="absolute bottom-[8%] -left-32"
        />
      </WireMargins>

      {/* Mobile: van en las bandas de padding vertical de la sección (py-24),
          que es el único espacio realmente libre en pantallas angostas, y
          sangran por el borde para no invadir la columna de texto. */}
      <WireMargins className="sm:hidden">
        <WirePrism
          size={86}
          tono="green"
          className="absolute top-4 -right-8 opacity-70"
        />
        <WireOctahedron
          size={92}
          tono="lilac"
          className="absolute -bottom-2 -left-8 opacity-70"
        />
      </WireMargins>

      <div className="sheet sheet-print max-w-2xl">
        <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
          Ejes temáticos
        </p>
        <h2 className="mt-4 text-[clamp(2rem,6vw,3.5rem)]">
          Cuatro frentes donde la fabricación digital ya está trabajando
        </h2>
        <p className="text-muted mt-5 text-lg">
          Dos días de charlas, demostraciones en vivo y networking entre
          industria, salud, construcción y educación.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {EJES.map((eje, i) => {
          const a = ACCENT[eje.color];
          return (
            // El .sheet va en el envoltorio y no en la tarjeta: así la
            // animación de entrada y el hover no se pelean por `transform`.
            <div
              key={eje.id}
              className="sheet"
              style={{ "--sheet-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <article
                // `translate` y no `transform` en la lista de transición:
                // Tailwind v4 anima -translate-y con la propiedad `translate`,
                // así que declarar `transform` deja el lift SIN transición y
                // el hover salta de golpe. Ver trampa 11 de AGENTS.md.
                // Curva `ease-out` y no out-expo: la expo arranca demasiado
                // rápido y en un gesto de hover se siente brusca.
                className={`group border-border bg-surface relative h-full overflow-hidden rounded-3xl rounded-br-none border pt-8 pr-8 pb-10 pl-8 transition-[translate,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_var(--paper-shadow)] ${a.borderHover}`}
              >
                {/* Número sangrando fuera del recorte, como en el afiche */}
                <span
                  className={`font-display pointer-events-none absolute -top-6 -right-2 text-[8rem] leading-none font-black ${a.text} opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.16]`}
                  aria-hidden="true"
                >
                  {eje.numero}
                </span>

                <div className="relative">
                  <p
                    className={`font-mono text-xs font-bold tracking-[0.2em] ${a.text}`}
                  >
                    EJE {eje.numero}
                  </p>
                  <h3 className="mt-3 max-w-[15ch] text-2xl">{eje.titulo}</h3>
                  <p className="text-muted mt-3 max-w-[42ch] leading-relaxed">
                    {eje.descripcion}
                  </p>
                  <ul className="mt-6 flex max-w-[38ch] flex-wrap gap-2">
                    {eje.temas.map((tema) => (
                      <li
                        key={tema}
                        className="border-border bg-surface-2 text-muted rounded-full border px-3 py-1.5 text-xs font-medium"
                      >
                        {tema}
                      </li>
                    ))}
                  </ul>
                </div>

                <Capas color={a.bg} />

                {/* Plato de la impresora: la base de color sobre la que se
                    apoya la pieza. Crece de un lado al pasar el mouse. */}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] ${a.bg} origin-left scale-x-[0.18] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100`}
                  aria-hidden="true"
                />
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
