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
 * Aviso de las convocatorias en la portada.
 *
 * Existe por una razón concreta: la inscripción del concurso de secundarios
 * cierra el 7 de septiembre, y hasta ahora eso solo se veía entrando a
 * `/convocatorias` desde el navbar. Quien llegaba a la portada scrolleaba
 * hero → ejes → sede → empresas → contacto sin enterarse nunca de que había
 * un concurso con fecha de vencimiento.
 *
 * **Es UNA tarjeta, no dos.** Antes eran dos con el mismo tratamiento que las
 * de `/convocatorias`, y quedaba redundante: la misma información repetida a
 * un clic de distancia. Ahora las dos convocatorias conviven adentro de una
 * sola pieza que entera es el enlace a la página.
 *
 * Lo que NO se puede recortar es el `estado` de cada una: es el dato por el
 * que la sección existe. Un botón genérico dejaría la fecha de cierre otra
 * vez escondida detrás de un clic, que es justo el problema que vino a
 * resolver.
 *
 * Dos detalles de implementación que no son obvios:
 *
 * - El CTA es un `<span>` con aspecto de botón y no un `<a>`: la tarjeta
 *   entera ya es un enlace, y anidar un `<a>` dentro de otro es HTML
 *   inválido —el navegador rompe el árbol y el interno deja de funcionar—.
 * - El acento de la tarjeta es el magenta de marca y no uno de `ACENTOS`:
 *   cubre las dos convocatorias, así que tomar el verde o el lila de una de
 *   ellas sería arbitrario. Cada una conserva el suyo en su punto y en su
 *   chip.
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

      {/* El .sheet va en el envoltorio y no en la tarjeta: la animación de
          entrada y la inclinación se pelearían por `transform` (trampa 6).
          Misma estructura que usa Ejes. */}
      <div className="sheet mt-14">
        <Tarjeta3D>
          <Link
            href="/convocatorias"
            // Sin clases `transition-*` de Tailwind: las transiciones de esta
            // tarjeta se declaran en `.tarjeta-3d > *` de globals.css, que al
            // estar fuera de `@layer` le gana igual a las utilidades
            // (trampa 10).
            style={
              {
                "--luz-color":
                  "color-mix(in srgb, var(--color-magenta) 15%, transparent)",
                "--glow":
                  "color-mix(in srgb, var(--color-magenta) 26%, var(--paper-shadow))",
                "--borde-activo":
                  "color-mix(in srgb, var(--color-magenta) 45%, transparent)",
              } as React.CSSProperties
            }
            className="tarjeta-eje group border-border bg-surface relative block overflow-hidden rounded-3xl rounded-br-none border pt-8 pr-8 pb-10 pl-8 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_var(--glow)] sm:pt-10 sm:pr-10 sm:pl-10"
          >
            <span
              className="luz-tarjeta pointer-events-none absolute inset-0"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
                {CONVOCATORIAS.map((c, i) => {
                  const a = ACENTOS[c.color];
                  return (
                    <div
                      key={c.id}
                      // El filete divisorio solo desde `sm`: apiladas en
                      // mobile, una línea vertical no separa nada.
                      className={
                        i > 0 ? "sm:border-border sm:border-l sm:pl-10" : ""
                      }
                    >
                      <span className="flex items-center gap-3">
                        {/* `size-3` y no `size-2.5`: las utilidades `size-*`
                            con decimales no se generan en este proyecto y el
                            punto quedaba en 0×0, o sea invisible. */}
                        <span
                          className={`size-3 shrink-0 rounded-full ${a.bg}`}
                          aria-hidden="true"
                        />
                        <span className="text-accent-text font-mono text-xs font-bold tracking-[0.2em]">
                          CONVOCATORIA {c.numero}
                        </span>
                      </span>

                      <h3 className="mt-4 text-2xl">{c.titulo}</h3>

                      <span
                        className="text-fg mt-4 inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold"
                        style={{ borderColor: a.borde }}
                      >
                        {c.estado}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* `<span>` con aspecto de botón, NO un `<a>`: la tarjeta entera
                  ya es el enlace y anidar dos `<a>` es HTML inválido. */}
              <div className="border-border mt-9 border-t pt-8">
                <span className="bg-magenta group-hover:bg-magenta-bright inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-bold text-white transition-colors duration-200">
                  Ver las convocatorias
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
            </div>

            <Capas color="bg-magenta" />

            {/* Plato de la impresora, en el borde inferior como en las
                tarjetas de eje. */}
            <span
              className="plato-tarjeta bg-magenta absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-[0.18] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              aria-hidden="true"
            />
          </Link>
        </Tarjeta3D>
      </div>
    </section>
  );
}
