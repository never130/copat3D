import { Plus, Zigzag } from "@/components/shapes";

/**
 * Fila fija de empresas y sponsors (sin animación: ver nota más abajo).
 * Solo se listan las que ya tienen logo real — sin placeholders de texto,
 * para no mezclar sponsors confirmados con nombres todavía en gestión
 * (ver docs/06-roadmap.md).
 */

type Empresa = {
  nombre: string;
  /** Ruta del logo en `public/`. */
  logo: string;
  /** Texto alternativo, cuando el nombre corto no describe al sponsor. */
  alt?: string;
  /**
   * Amplía el logo dentro de la tarjeta para compensar el margen en blanco
   * que trae incrustado el archivo. Pensado para los JPG de sponsors
   * comerciales, cuyo arte llega con margen blanco incrustado (ver trampa 18
   * de AGENTS.md).
   */
  escala?: number;
};

const EMPRESAS: Empresa[] = [
  {
    // Variante "-oscuro": el arte original es blanco puro sobre transparente
    // (pensado para fondo de marca). Con las tarjetas ahora en blanco, un
    // logo blanco se pierde por completo — no es tratable con fondo de color
    // porque se pidió sacar el magenta de la tarjeta. La variante cambia el
    // único `fill: #fff` del archivo por el ink del tema (`--fg` claro,
    // `#12060f`); el resto del trazo queda igual. Ver trampa 18.
    nombre: "Gobierno de Tierra del Fuego",
    logo: "/logos/gobierno-tdf-oscuro.svg",
  },
  {
    nombre: "Consejo Federal de Inversiones",
    alt: "CFI — Consejo Federal de Inversiones",
    logo: "/logos/Consejo_Federal_de_Inversiones.png",
    // PNG sin canal alfa (fondo blanco incrustado), medido #FFFFFF puro en
    // las cuatro esquinas — mismo caso que los JPG. Sin `escala`: el archivo
    // ya viene casi sin margen (97% del ancho, 82% del alto es tinta).
  },
  {
    nombre: "Buena Mezcla",
    alt: "Buena Mezcla — Pastelería y catering gourmet",
    logo: "/logos/buena_mezcla.jpg",
  },
  {
    nombre: "Rayuela",
    alt: "Rayuela Río Grande",
    logo: "/logos/rayuela.jpg",
    // Sin `escala`: el archivo viene recortado al borde del badge rojo, así
    // que `object-contain` ya lo lleva al ancho completo de la tarjeta. El
    // arte original (rayuela2.jpg, 1600×900) trae el badge centrado con 58%
    // de margen y fondo #F7F7F7 — no blanco puro. Los dos problemas se
    // resolvieron en el archivo y no acá: ampliar por CSS un fondo gris solo
    // agranda el recuadro gris. Ver trampa 18.
  },
];

export function Sponsors() {
  return (
    <section id="empresas" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="sheet sheet-print max-w-2xl">
          <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
            Acompañan
          </p>
          <h2 className="titulo-impreso mt-4 text-[clamp(2rem,6vw,3.5rem)]">
            Empresas e instituciones que construyen el ecosistema
          </h2>
        </div>
      </div>

      {/* Fila fija, sin desplazamiento automático (pedido explícito,
          31/8/2026): con solo 4 logos confirmados, la marquesina infinita
          quedaba dando vueltas sobre un set muy chico. `flex-wrap` +
          `justify-center` la sostiene centrada tanto en una fila (desktop)
          como en dos (mobile), sin depender de que haya suficientes logos
          para llenar el ancho. */}
      <div className="sheet mt-14 flex flex-wrap justify-center gap-4">
        {EMPRESAS.map((empresa) => {
          const CAJA =
            "relative grid h-32 w-72 shrink-0 place-items-center overflow-hidden rounded-2xl rounded-br-none";

          return (
            <div
              key={empresa.nombre}
              // Blanco exacto, no `bg-surface`: los JPG traen su propio
              // blanco opaco y cualquier otro tono deja ver el recuadro
              // (ver trampa 18).
              className={`${CAJA} border-border border bg-white transition-[filter] duration-300 hover:brightness-105`}
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

      <div className="mx-auto mt-16 max-w-7xl px-5">
        <div className="sheet hero-gradient grain relative overflow-hidden rounded-[2rem] rounded-tr-none px-8 py-16 text-center sm:px-14">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
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
              ¿Querés ser parte?
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
