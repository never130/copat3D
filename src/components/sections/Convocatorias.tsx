import Link from "next/link";
import {
  WireCube,
  WireIcosahedron,
  WireMargins,
} from "@/components/shapes/wire";
import { ACENTOS } from "@/components/ui/acentos";
import { Capas } from "@/components/ui/Capas";
import { Tarjeta3D } from "@/components/ui/Tarjeta3D";
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
 * Las tarjetas son hermanas de las de eje y comparten TODO su tratamiento
 * —inclinación, luz que sigue al puntero, número gigante, capas apiladas,
 * plato de impresora—, porque viven en la misma página, una sección abajo:
 * cualquier diferencia se lee como inconsistencia y no como jerarquía. La
 * única diferencia deliberada es que estas son un enlace, y lo señalan con
 * la flecha del pie.
 *
 * Por eso el `.sheet` va en el envoltorio y no en la tarjeta: la animación
 * de entrada y la inclinación se pelearían por `transform` (trampa 6). Es la
 * misma estructura que usa `Ejes`.
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
        {/* Sin "ya trabajan": el formulario está dirigido a quienes usan
            "o desean incorporar" fabricación digital, así que ese "ya"
            dejaba afuera a parte del público convocado. */}
        <p className="text-muted mt-5 text-lg">
          Un concurso para escuelas secundarias de toda la provincia y un
          registro para emprendedores fueguinos que trabajan con fabricación
          digital o quieren incorporarla.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {CONVOCATORIAS.map((c, i) => {
          const a = ACENTOS[c.color];
          return (
            <div
              key={c.id}
              className="sheet"
              style={{ "--sheet-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <Tarjeta3D>
                <Link
                  href="/convocatorias"
                  // Sin clases `transition-*` de Tailwind: las transiciones de
                  // esta tarjeta se declaran en `.tarjeta-3d > *` de
                  // globals.css, que al estar fuera de `@layer` le gana igual
                  // a las utilidades (trampa 10).
                  style={
                    {
                      "--luz-color": a.luz,
                      "--glow": a.glow,
                      "--borde-activo": a.borde,
                    } as React.CSSProperties
                  }
                  className="tarjeta-eje group border-border bg-surface relative block h-full overflow-hidden rounded-3xl rounded-br-none border pt-8 pr-8 pb-10 pl-8 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_var(--glow)]"
                >
                  <span
                    className="luz-tarjeta pointer-events-none absolute inset-0"
                    aria-hidden="true"
                  />

                  {/* Número sangrando fuera del recorte, corrido en sentido
                      CONTRARIO a la inclinación: ese desfase entre planos es
                      lo que se lee como profundidad. */}
                  <span
                    className={`num-tarjeta font-display pointer-events-none absolute -top-6 -right-2 text-[8rem] leading-none font-black ${a.text} opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.16]`}
                    style={{
                      translate:
                        "calc(var(--ry, 0deg) / 1deg * -1.1px) calc(var(--rx, 0deg) / 1deg * 1.1px)",
                    }}
                    aria-hidden="true"
                  >
                    {c.numero}
                  </span>

                  <div className="relative">
                    <p className="text-accent-text font-mono text-xs font-bold tracking-[0.2em]">
                      CONVOCATORIA {c.numero}
                    </p>
                    <h3 className="mt-3 max-w-[15ch] text-2xl">{c.titulo}</h3>
                    <p className="text-muted mt-3 max-w-[42ch] leading-relaxed">
                      {c.detalle}
                    </p>

                    {/* El estado es lo que decide si alguien se apura: va
                        destacado y no como una línea más de texto. Es el
                        equivalente a los chips de tema de las tarjetas de
                        eje, con el acento en el borde en vez del relleno. */}
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

                    {/* La flecha es la única diferencia deliberada con las
                        tarjetas de eje: estas sí llevan a algún lado. */}
                    <span className="text-accent-text mt-7 flex items-center gap-2 text-sm font-bold">
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
                  </div>

                  <Capas color={a.bg} />

                  {/* Plato de la impresora, en el borde inferior como en las
                      tarjetas de eje. */}
                  <span
                    className={`plato-tarjeta absolute inset-x-0 bottom-0 h-[3px] ${a.bg} origin-left scale-x-[0.18] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100`}
                    aria-hidden="true"
                  />
                </Link>
              </Tarjeta3D>
            </div>
          );
        })}
      </div>
    </section>
  );
}
