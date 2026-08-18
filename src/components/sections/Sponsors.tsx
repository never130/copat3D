import { Plus, Zigzag } from "@/components/shapes";

/**
 * Carrousel infinito de empresas y sponsors.
 *
 * El track duplica la lista y se desplaza -50%: al llegar al final está
 * exactamente donde empezó, así el loop es continuo sin salto.
 * Diseñado para verse bien con 4 logos o con 20 (ver docs/06-roadmap.md).
 */

type Empresa = {
  nombre: string;
  /** Ruta del logo real en `public/`. Sin esto la tarjeta cae al placeholder
   *  de texto (ver docs/06-roadmap.md: "logos de sponsors" sigue pendiente
   *  para el resto — estos dos son los únicos con arte institucional). */
  logo?: string;
};

const EMPRESAS: Empresa[] = [
  { nombre: "Gobierno de Tierra del Fuego", logo: "/logos/gobierno-tdf.svg" },
  { nombre: "AIF", logo: "/logos/aif-blanco.svg" },
  { nombre: "Fábrica de Talentos" },
  { nombre: "UNTDF" },
  { nombre: "UTN" },
  { nombre: "Polos Creativos" },
  { nombre: "Parque Industrial Río Grande" },
  { nombre: "INTI" },
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
          {track.map((empresa, i) =>
            empresa.logo ? (
              // Logo institucional real: tarjeta en magenta fijo (no según
              // tema) porque el arte de marca provisto es la versión blanca,
              // pensada para fondo oscuro — mismo recurso que .hero-gradient
              // usa en el CTA de abajo y en el menú móvil.
              <div
                key={`${empresa.nombre}-${i}`}
                className="bg-magenta-deep relative grid h-32 w-72 shrink-0 place-items-center overflow-hidden rounded-2xl rounded-br-none px-8 py-7 transition-[filter] duration-300 hover:brightness-110"
                aria-hidden={i >= EMPRESAS.length}
              >
                {/* `object-contain` sobre la caja completa y no `max-h/max-w`:
                    los lockups institucionales son muy apaisados (el de
                    Gobierno es 4:1) y con un alto máximo chico quedaban
                    diminutos, sin aprovechar el ancho disponible. */}
                <img
                  src={empresa.logo}
                  alt={empresa.nombre}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div
                key={`${empresa.nombre}-${i}`}
                className="border-border bg-surface text-muted hover:text-fg hover:border-magenta/40 relative grid h-32 w-72 shrink-0 place-items-center rounded-2xl rounded-br-none border px-6 text-center text-base font-semibold transition-colors duration-300"
                // Solo la primera mitad se anuncia: la segunda es duplicado visual.
                aria-hidden={i >= EMPRESAS.length}
              >
                <span className="bg-magenta/50 absolute inset-x-6 bottom-0 h-px" />
                {empresa.nombre}
              </div>
            ),
          )}
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
