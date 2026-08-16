import { Plus, Zigzag } from "@/components/shapes";

/**
 * Carrousel infinito de empresas y sponsors.
 *
 * El track duplica la lista y se desplaza -50%: al llegar al final está
 * exactamente donde empezó, así el loop es continuo sin salto.
 * Diseñado para verse bien con 4 logos o con 20 (ver docs/06-roadmap.md).
 */

// Placeholders hasta que lleguen los logos reales (semana 4 del roadmap).
const EMPRESAS = [
  "Gobierno de Tierra del Fuego",
  "AIF",
  "Fábrica de Talentos",
  "UNTDF",
  "UTN",
  "Polos Creativos",
  "Parque Industrial Río Grande",
  "INTI",
];

export function Sponsors() {
  const track = [...EMPRESAS, ...EMPRESAS];

  return (
    <section
      id="empresas"
      className="scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="sheet sheet-print max-w-2xl">
          <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
            Acompañan
          </p>
          <h2 className="mt-4 text-[clamp(2rem,6vw,3.5rem)]">
            Empresas e instituciones que construyen el ecosistema
          </h2>
        </div>
      </div>

      {/* La marquesina se frena al pasar el mouse para poder leer los
          nombres. La regla vive en globals.css junto a .marquee-track. */}
      <div className="sheet marquee-mask mt-14 flex overflow-hidden">
        <div className="marquee-track flex gap-4">
          {track.map((nombre, i) => (
            <div
              key={`${nombre}-${i}`}
              className="border-border bg-surface text-muted hover:text-fg hover:border-magenta/40 relative grid h-24 w-56 shrink-0 place-items-center rounded-2xl rounded-br-none border px-6 text-center text-sm font-semibold transition-colors duration-300"
              // Solo la primera mitad se anuncia: la segunda es duplicado visual.
              aria-hidden={i >= EMPRESAS.length}
            >
              <span className="bg-magenta/50 absolute inset-x-6 bottom-0 h-px" />
              {nombre}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-5">
        <div className="sheet hero-gradient grain relative overflow-hidden rounded-[2rem] rounded-tr-none px-8 py-16 text-center sm:px-14">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Zigzag
              color="yellow"
              size={86}
              className="anim-sway absolute top-[14%] left-[6%] opacity-90"
            />
            <Plus
              color="lilac"
              size={58}
              className="anim-float-spin absolute right-[8%] bottom-[16%] opacity-85"
            />
          </div>

          <div className="relative z-10">
            <h3 className="text-[clamp(1.5rem,4vw,2.75rem)] text-white">
              ¿Tu empresa quiere ser parte?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Sumate como sponsor y conectá con el entramado industrial,
              educativo y sanitario de toda la Patagonia austral.
            </p>
            <a
              href="#contacto"
              className="text-magenta-deep mt-9 inline-block rounded-full bg-white px-8 py-4 font-bold transition-transform duration-200 hover:scale-[1.04]"
            >
              Quiero ser sponsor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
