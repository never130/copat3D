import Link from "next/link";
import {
  WireCube,
  WireIcosahedron,
  WireMargins,
} from "@/components/shapes/wire";
import { ACENTOS } from "@/components/ui/acentos";
import { CONVOCATORIAS } from "@/content/convocatorias";

/**
 * Resumen de las convocatorias en la portada.
 *
 * Existe por una razón concreta: la inscripción del concurso de secundarios
 * cierra el 7 de septiembre, y hasta ahora eso solo se veía entrando a
 * `/convocatorias` desde el navbar. Quien llegaba a la portada scrolleaba
 * hero → ejes → sede → empresas → contacto sin enterarse nunca de que había
 * un concurso con fecha de vencimiento.
 *
 * Es un RESUMEN, no una copia: cada tarjeta muestra lo mínimo para decidir
 * si te interesa —qué es y hasta cuándo— y manda a `/convocatorias`, que
 * tiene la ficha completa y las bases. Si esta sección creciera hasta
 * repetir esos datos, la página dejaría de tener sentido.
 *
 * Las tarjetas no usan `Tarjeta3D` ni el hover con `transform` de las de eje:
 * son un enlace entero, y el `.sheet` que las anima ya ocupa `transform`
 * durante 0.7s (trampa 6). El hover se señala con el borde y con la barra de
 * acento, que es lo que la trampa recomienda.
 */
export function Convocatorias() {
  return (
    <section
      id="convocatorias"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <WireMargins className="hidden sm:block">
        <WireCube
          size={128}
          tono="lilac"
          className="absolute top-[12%] -left-36"
        />
        <WireIcosahedron
          size={116}
          tono="green"
          className="absolute bottom-[10%] -right-32"
        />
      </WireMargins>

      <WireMargins className="sm:hidden">
        <WireCube
          size={86}
          tono="lilac"
          className="absolute top-3 -right-8 opacity-70"
        />
      </WireMargins>

      <div className="sheet sheet-print max-w-2xl">
        <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
          Convocatorias abiertas
        </p>
        <h2 className="titulo-impreso mt-4 text-[clamp(2rem,6vw,3.5rem)]">
          También podés venir a presentar tu proyecto
        </h2>
        <p className="text-muted mt-5 text-lg">
          Un concurso para escuelas secundarias de toda la provincia y un
          registro para emprendedores fueguinos que ya trabajan con
          fabricación digital.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {CONVOCATORIAS.map((c, i) => {
          const a = ACENTOS[c.color];
          return (
            <Link
              key={c.id}
              href="/convocatorias"
              style={
                {
                  "--sheet-delay": `${i * 90}ms`,
                  "--borde-activo": a.borde,
                } as React.CSSProperties
              }
              className="sheet tarjeta-eje group border-border bg-surface relative flex flex-col overflow-hidden rounded-3xl rounded-br-none border p-8 sm:p-10"
            >
              {/* La barra de acento va ARRIBA y no abajo como en las tarjetas
                  de eje: acá el pie lo ocupa el "Ver la convocatoria", y dos
                  elementos de acento en el mismo borde se estorban. */}
              <span
                className={`absolute inset-x-0 top-0 h-[3px] ${a.bg} origin-left scale-x-[0.18] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100`}
                aria-hidden="true"
              />

              <p className="text-accent-text font-mono text-xs font-bold tracking-[0.2em]">
                CONVOCATORIA {c.numero}
              </p>
              <h3 className="mt-3 text-2xl sm:text-3xl">{c.titulo}</h3>
              <p className="text-muted mt-4 text-lg leading-relaxed">
                {c.detalle}
              </p>

              {/* El estado es lo que decide si alguien se apura: va destacado
                  y no como una línea más de texto. */}
              <span
                className="text-fg mt-6 inline-flex w-fit items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold"
                style={{ borderColor: a.borde }}
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${a.bg}`}
                  aria-hidden="true"
                />
                {c.estado}
              </span>

              <span className="text-accent-text mt-8 inline-flex items-center gap-2 text-sm font-bold">
                Ver la convocatoria
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
