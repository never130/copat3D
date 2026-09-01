import Link from "next/link";
import {
  WireCube,
  WireIcosahedron,
  WireMargins,
} from "@/components/shapes/wire";
import { ACENTOS } from "@/components/ui/acentos";
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

      {/* Un botón y una línea de estado, sin caja alrededor. Es la tercera
          versión de este bloque y la más chica: el contenido son dos nombres
          y dos fechas, y cualquier contenedor que se le pusiera encima
          quedaba vacío. La invitación la hace el botón; el contexto ya lo
          dio la bajada de arriba. */}
      <div className="sheet mt-10 flex flex-wrap items-center gap-x-7 gap-y-5">
        <Link
          href="/convocatorias"
          className="bg-magenta hover:bg-magenta-bright inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-lg font-bold text-white transition-[background-color,transform] duration-200 hover:scale-[1.03]"
        >
          Quiero participar
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>

        {/* Los plazos van acá y no adentro de la página: son el dato por el
            que existe esta sección. Salen de `estado` en vez de escribirse a
            mano, para que las fechas vivan en un solo lugar.

            Se listan LAS DOS aunque solo una tenga fecha de cierre: mostrar
            únicamente la de colegios desbalanceaba la sección, porque el
            título de arriba anuncia dos convocatorias y abajo aparecía una
            sola. Cada una va con su nombre, si no el plazo de una se leería
            como si aplicara a las dos. */}
        <ul className="space-y-2">
          {CONVOCATORIAS.map((c) => (
            <li
              key={c.id}
              className="text-muted flex items-center gap-2.5 text-sm"
            >
              <span
                className={`size-3 shrink-0 rounded-full ${ACENTOS[c.color].bg}`}
                aria-hidden="true"
              />
              <span>
                <span className="text-fg font-semibold">{c.titulo}</span>:{" "}
                {c.estado.toLowerCase()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
