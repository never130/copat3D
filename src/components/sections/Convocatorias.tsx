import Link from "next/link";
import {
  WireCube,
  WireIcosahedron,
  WireMargins,
} from "@/components/shapes/wire";
import { ACENTOS } from "@/components/ui/acentos";
import { Tarjeta3D } from "@/components/ui/Tarjeta3D";
import { CONVOCATORIAS } from "@/content/convocatorias";

/**
 * Aviso de las convocatorias en la portada.
 *
 * Existe por una razón concreta: la inscripción de "Diseñando el Futuro —
 * Capa a Capa" cierra el 7 de septiembre, y hasta ahora eso solo se veía
 * entrando a `/convocatorias` desde el navbar. Quien llegaba a la portada
 * scrolleaba hero → ejes → sede → empresas → contacto sin enterarse nunca de
 * que había un concurso con fecha de vencimiento.  
 *
 * **Es una franja, no una tarjeta con vida propia.** Pasó por dos versiones
 * peores antes de esta: dos tarjetas completas (repetían tal cual las de
 * `/convocatorias`, a un clic de distancia) y una tarjeta grande con número
 * gigante, capas y filete divisorio (con dos renglones de contenido en 1240px
 * de ancho, quedaba vacía y estirada). El contenido real son dos nombres y
 * dos fechas: lo que pedía era menos caja, no más adorno.
 *
 * De la familia de tarjetas conserva lo que funciona a esta escala —la
 * superficie, el canto recortado, la inclinación, la luz del puntero y el
 * plato de impresora—, y deja afuera lo que necesita altura para leerse.
 *
 * Lo que NO se puede recortar es el `estado` de cada una: es el dato por el
 * que la sección existe. Un botón genérico dejaría la fecha de cierre otra
 * vez escondida detrás de un clic.
 *
 * El CTA es un `<span>` con aspecto de botón y no un `<a>`: la franja entera
 * ya es un enlace, y anidar un `<a>` dentro de otro es HTML inválido.
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
          Un concurso para colegios secundarios de toda la provincia y un
          registro para emprendedores fueguinos que trabajan con fabricación
          digital o quieren incorporarla.
        </p>
      </div>

      {/* El .sheet va en el envoltorio y no en la franja: la animación de
          entrada y la inclinación se pelearían por `transform` (trampa 6). */}
      <div className="sheet mt-12">
        <Tarjeta3D>
          <Link
            href="/convocatorias"
            // Sin clases `transition-*` de Tailwind: las transiciones se
            // declaran en `.tarjeta-3d > *` de globals.css, que al estar
            // fuera de `@layer` le gana igual a las utilidades (trampa 10).
            //
            // El acento es el magenta de marca y no uno de `ACENTOS`: la
            // franja cubre las dos convocatorias, así que tomar el verde o el
            // lila de una sería arbitrario. Cada una conserva el suyo en su
            // punto.
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
            className="tarjeta-eje group border-border bg-surface relative flex flex-col gap-8 overflow-hidden rounded-3xl rounded-br-none border p-8 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_var(--glow)] sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
          >
            <span
              className="luz-tarjeta pointer-events-none absolute inset-0"
              aria-hidden="true"
            />

            <ul className="relative space-y-6">
              {CONVOCATORIAS.map((c) => {
                const a = ACENTOS[c.color];
                return (
                  <li key={c.id} className="flex gap-3">
                    {/* `size-3` y no `size-2.5`: las utilidades `size-*` con
                        decimales no se generan en este proyecto y el punto
                        quedaba en 0×0, o sea invisible. */}
                    <span
                      className={`mt-2 size-3 shrink-0 rounded-full ${a.bg}`}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="font-display block text-xl font-bold">
                        {c.titulo}
                      </span>
                      <span className="text-muted mt-1 block text-sm">
                        {c.estado}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <span className="bg-magenta group-hover:bg-magenta-bright relative inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-base font-bold text-white transition-colors duration-200">
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
