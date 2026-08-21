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
   *  de texto (ver docs/06-roadmap.md: los logos del resto siguen pendientes). */
  logo?: string;
  /**
   * Tratamiento de la tarjeta, que lo decide el arte del logo y no el gusto:
   *
   * - `magenta`: el arte es la versión BLANCA sobre transparente (los SVG
   *   institucionales). Necesita fondo de marca o desaparece en modo claro.
   *   Ver trampa 18 de AGENTS.md.
   * - `blanco`: el arte es tinta de color sobre blanco OPACO (los JPG de los
   *   sponsors comerciales). Al ser JPEG no hay transparencia posible, así que
   *   la única forma de que no se vea un recuadro blanco recortado es que la
   *   tarjeta sea exactamente del mismo blanco que el archivo (#FFFFFF
   *   medido en las cuatro esquinas de ambos).
   */
  fondo?: "magenta" | "blanco";
  /** Texto alternativo, cuando el nombre corto no describe al sponsor. */
  alt?: string;
  /**
   * Amplía el logo dentro de la tarjeta para compensar el margen en blanco
   * que trae incrustado el archivo. Solo tiene sentido con `fondo: "blanco"`:
   * lo que se recorta al ampliar es blanco puro, que se funde con la tarjeta.
   */
  escala?: number;
};

const EMPRESAS: Empresa[] = [
  { nombre: "Gobierno de Tierra del Fuego", logo: "/logos/gobierno-tdf.svg", fondo: "magenta" },
  { nombre: "AIF", logo: "/logos/aif-blanco.svg", fondo: "magenta" },
  {
    nombre: "Buena Mezcla",
    alt: "Buena Mezcla — Pastelería y catering gourmet",
    logo: "/logos/buena_mezcla.jpg",
    fondo: "blanco",
  },
  {
    nombre: "Rayuela",
    logo: "/logos/rayuela.jpg",
    fondo: "blanco",
    // El archivo mide 1024×683 pero la tinta ocupa apenas 840×216 centrados:
    // un 34% del alto es margen blanco arriba y otro tanto abajo. Sin ampliar,
    // el logotipo se vería a un tercio del tamaño de los demás.
    escala: 2.4,
  },
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
          {track.map((empresa, i) => {
            // Solo la primera mitad se anuncia: la segunda es duplicado visual.
            const duplicada = i >= EMPRESAS.length;
            const clave = `${empresa.nombre}-${i}`;
            const CAJA =
              "relative grid h-32 w-72 shrink-0 place-items-center overflow-hidden rounded-2xl rounded-br-none";

            if (!empresa.logo) {
              return (
                <div
                  key={clave}
                  className={`${CAJA} border-border bg-surface text-muted hover:text-fg hover:border-magenta/40 border px-6 text-center text-base font-semibold transition-colors duration-300`}
                  aria-hidden={duplicada}
                >
                  <span className="bg-magenta/50 absolute inset-x-6 bottom-0 h-px" />
                  {empresa.nombre}
                </div>
              );
            }

            const enBlanco = empresa.fondo === "blanco";

            return (
              <div
                key={clave}
                className={`${CAJA} transition-[filter] duration-300 hover:brightness-105 ${
                  enBlanco
                    ? // Blanco exacto, no `bg-surface`: el JPG trae su propio
                      // blanco opaco y cualquier otro tono deja ver el recuadro.
                      "border-border border bg-white"
                    : "bg-magenta-deep"
                }`}
                aria-hidden={duplicada}
              >
                {/* La caja interna va `absolute inset-0` para tener alto
                    DEFINIDO. Con el padding directamente en la tarjeta, el
                    alto quedaba automático y `max-h-full` no tenía contra qué
                    resolver: los SVG zafaban por no traer tamaño intrínseco,
                    pero los JPG se plantaban en su alto natural y se salían de
                    la tarjeta —Rayuela se desbordaba 227px—. */}
                <div className="absolute inset-0 flex items-center justify-center px-8 py-7">
                  {/* `max-h/max-w` y no `h-full w-full`: así el limitante es
                      el que corresponda según la proporción de cada logo, que
                      van desde 4:1 (Gobierno) hasta casi cuadrado. */}
                  <img
                    src={empresa.logo}
                    alt={empresa.alt ?? empresa.nombre}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                    style={
                      empresa.escala
                        ? { scale: String(empresa.escala) }
                        : undefined
                    }
                  />
                </div>
              </div>
            );
          })}
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
