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
  "Polo Tecnológico",
  "Parque Industrial Río Grande",
  "INTI",
];

export function Sponsors() {
  const track = [...EMPRESAS, ...EMPRESAS];

  return (
    <section
      id="empresas"
      className="sheet scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
            Acompañan
          </p>
          <h2 className="mt-4 text-[clamp(2rem,6vw,3.5rem)]">
            Empresas e instituciones que construyen el ecosistema
          </h2>
        </div>
      </div>

      <div className="marquee-mask mt-14 flex overflow-hidden">
        <div className="marquee-track flex gap-4">
          {track.map((nombre, i) => (
            <div
              key={`${nombre}-${i}`}
              className="border-border bg-surface text-muted grid h-24 w-56 shrink-0 place-items-center rounded-2xl border px-6 text-center text-sm font-semibold"
              // Solo la primera mitad se anuncia: la segunda es duplicado visual.
              aria-hidden={i >= EMPRESAS.length}
            >
              {nombre}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-5">
        <div className="hero-gradient grain relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14">
          <div className="relative z-10">
            <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] text-white">
              ¿Tu empresa quiere ser parte?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Sumate como sponsor y conectá con el entramado industrial,
              educativo y sanitario de toda la Patagonia austral.
            </p>
            <a
              href="#contacto"
              className="text-magenta-deep mt-8 inline-block rounded-full bg-white px-8 py-4 font-bold transition-transform duration-200 hover:scale-[1.03]"
            >
              Quiero ser sponsor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
