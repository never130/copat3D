import type { Metadata } from "next";
import Link from "next/link";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";
import { WireCube, WireMargins, WirePrism } from "@/components/shapes/wire";
import { ACENTOS, type Acento } from "@/components/ui/acentos";
import { Tarjeta3D } from "@/components/ui/Tarjeta3D";

export const metadata: Metadata = {
  title: "Convocatorias",
  description:
    "Concurso para escuelas secundarias y registro de emprendedores en el marco de COPAT 3D. Ushuaia, Tierra del Fuego.",
  alternates: { canonical: "/convocatorias" },
};

/**
 * Las dos convocatorias abiertas por la AIF en paralelo al congreso. No es
 * lo mismo que /registro: esa es la inscripción individual para asistir al
 * evento, esta página es para presentarse a un concurso o registrar un
 * proyecto. Por eso el nombre distinto —"Convocatorias" y no
 * "Inscripción"— tanto en el navbar como acá: compartir el mismo rótulo
 * con /registro iba a leerse como si fueran la misma cosa.
 *
 * Las tarjetas usan el mismo lenguaje que las de eje —inclinación 3D, luz que
 * sigue al puntero, plato de impresora, número gigante— porque son el mismo
 * tipo de objeto en la página: un bloque con identidad propia al que se entra.
 * Los `datos` no son decorado: son lo que la gente necesita saber ANTES de
 * abrir el formulario (a quién apunta, qué hay que llevar, hasta cuándo,
 * cuánto se lleva el ganador), y salen del PDF de bases y de los textos de
 * los formularios.
 *
 * Los tres links que pasó la AIF por WhatsApp eran de EDICIÓN (`.../edit`),
 * no públicos. Verificado uno por uno (31/8/2026) probando la variante
 * pública de cada uno (`/viewform` en los Forms, `/preview` en el Doc):
 *
 * - Emprendedores (Form): responde el formulario real. Público, se usa tal
 *   cual con `/viewform`.
 * - Secundarios (Form): devuelve 401 Unauthorized — sigue compartido solo
 *   para personas puntuales, no para "cualquiera con el enlace". Se publica
 *   igual a pedido expreso, ver la nota en su `enlace`.
 * - Bases y condiciones (Doc): mismo 401, pero acá SÍ hay solución — Maribel
 *   mandó el texto completo por WhatsApp y está alojado en
 *   `/bases-secundarios` (ruta PLANA, no anidada bajo esta — ver trampa 21
 *   de AGENTS.md). No depende de que Google Docs mantenga ese permiso
 *   abierto.
 *
 * `interno` usa `next/link` en vez de una etiqueta `<a>` con
 * `target="_blank"`: es contenido propio del sitio, no un destino externo.
 * Un `enlace` sin `href` se renderiza inerte ("Muy pronto") — hoy no queda
 * ninguno, pero la rama se conserva para la próxima convocatoria que se
 * anuncie antes de tener su formulario.
 */
type Enlace = {
  texto: string;
  href?: string;
  interno?: boolean;
  /** El CTA que la persona vino a apretar. Uno solo por tarjeta. */
  principal?: boolean;
};

type Convocatoria = {
  id: string;
  numero: string;
  titulo: string;
  detalle: string;
  color: Acento;
  datos: { rotulo: string; valor: string }[];
  enlaces: Enlace[];
};

const CONVOCATORIAS: Convocatoria[] = [
  {
    id: "secundarios",
    numero: "01",
    titulo: "Concurso de Secundarios",
    detalle:
      "Equipos de escuelas secundarias que diseñan y fabrican un proyecto con impacto real en su comunidad.",
    color: "copat-green",
    datos: [
      { rotulo: "Quiénes", valor: "Escuelas de Río Grande, Ushuaia y Tolhuin" },
      { rotulo: "Equipo", valor: "7 estudiantes y 1 docente responsable" },
      { rotulo: "Inscripción", valor: "Del 31 de agosto al 7 de septiembre" },
      { rotulo: "Premio", valor: "$1.500.000 + insumos, uno por ciudad" },
    ],
    enlaces: [
      {
        texto: "Bases y condiciones",
        // Ruta PLANA (no /convocatorias/bases-secundarios): ver trampa 21
        // de AGENTS.md — anidarla bajo /convocatorias rompía el pase de
        // hojas al llegar por navegación interna.
        href: "/bases-secundarios",
        interno: true,
      },
      {
        texto: "Inscribirme",
        principal: true,
        // ⚠️ Publicado a pedido expreso (31/8/2026) aunque el Form todavía
        // devuelve 401: sigue compartido solo para personas puntuales, no
        // para "cualquiera con el enlace". Va con `/viewform` y NO con el
        // `/edit` que mandó la AIF, que son dos cosas distintas: con
        // `/viewform` quien no tenga acceso ve la pantalla de "solicitar
        // acceso" de Google y el link empieza a funcionar solo en cuanto
        // cambien el permiso; con `/edit` habría caído en el EDITOR del
        // formulario, pudiendo alterar las preguntas del concurso.
        href: "https://docs.google.com/forms/d/1N-e6iysCyvojYqatUm0Clf71kIxsIbCQn3ukSx6hges/viewform",
      },
    ],
  },
  {
    id: "emprendedores",
    numero: "02",
    titulo: "Registro de Emprendedores",
    detalle:
      "Emprendimientos, pymes y startups fueguinas que ya trabajan con impresión 3D y fabricación digital.",
    color: "copat-lilac",
    datos: [
      {
        rotulo: "Quiénes",
        valor: "Emprendedores, comercios y startups de la provincia",
      },
      { rotulo: "Qué ofrece", valor: "Stand propio o charla durante el congreso" },
      { rotulo: "Cuándo", valor: "2 y 3 de octubre, en la Fábrica de Talentos" },
    ],
    enlaces: [
      {
        texto: "Inscribirme",
        principal: true,
        href: "https://docs.google.com/forms/d/1oHEk1RPvxKd558CdlhAuoD1NhN38FC168V2FjQPLYY4/viewform",
      },
    ],
  },
];

function FlechaExterna() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

/** Clases del CTA. El principal va relleno para que se distinga del
 *  secundario de un vistazo: con los dos delineados la tarjeta se leía plana
 *  y no quedaba claro cuál era la acción esperada. */
function clasesCta(principal?: boolean) {
  const base =
    "inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors duration-200";
  return principal
    ? `${base} bg-magenta hover:bg-magenta-bright text-white`
    : `${base} border-border hover:border-magenta/50 hover:text-accent-text border`;
}

export default function ConvocatoriasPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Dos convocatorias abiertas"
        titulo="Convocatorias"
        bajada="Concurso para escuelas secundarias y registro de emprendedores, en el marco de COPAT 3D."
      />

      <NavbarSentinel />

      <div className="overflow-x-clip">
        <div className="relative mx-auto max-w-5xl px-5 py-20">
          <WireMargins className="hidden sm:block">
            <WireCube
              size={120}
              tono="sky"
              className="absolute top-[10%] -left-36"
            />
            <WirePrism
              size={104}
              tono="coral"
              className="absolute bottom-[14%] -right-32"
            />
          </WireMargins>

          <WireMargins className="sm:hidden">
            <WireCube
              size={84}
              tono="sky"
              className="absolute top-2 -right-8 opacity-70"
            />
          </WireMargins>

          <div className="grid gap-5 sm:grid-cols-2">
            {CONVOCATORIAS.map((c, i) => {
              const a = ACENTOS[c.color];
              return (
                // El .sheet va en el envoltorio y no en la tarjeta: así la
                // animación de entrada y la inclinación no se pelean por
                // `transform` (trampa 6).
                <div
                  key={c.id}
                  className="sheet"
                  style={
                    { "--sheet-delay": `${i * 90}ms` } as React.CSSProperties
                  }
                >
                  <Tarjeta3D>
                    <article
                      // Sin clases `transition-*` de Tailwind: las transiciones
                      // de esta tarjeta se declaran en `.tarjeta-3d > *` de
                      // globals.css, que al estar fuera de `@layer` le gana
                      // igual a las utilidades (trampa 10).
                      style={
                        {
                          "--luz-color": a.luz,
                          "--glow": a.glow,
                          "--borde-activo": a.borde,
                        } as React.CSSProperties
                      }
                      className="tarjeta-eje group border-border bg-surface relative flex h-full flex-col overflow-hidden rounded-3xl rounded-br-none border p-8 hover:shadow-[0_22px_44px_-22px_var(--glow)]"
                    >
                      <span
                        className="luz-tarjeta pointer-events-none absolute inset-0"
                        aria-hidden="true"
                      />

                      {/* Número sangrando fuera del recorte, como en las
                          tarjetas de eje. Se corre en sentido CONTRARIO a la
                          inclinación: ese desfase entre planos es lo que se
                          lee como profundidad. */}
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

                      <div className="relative flex flex-1 flex-col">
                        <p className="text-accent-text font-mono text-xs font-bold tracking-[0.2em]">
                          CONVOCATORIA {c.numero}
                        </p>
                        <h2 className="mt-3 text-2xl">{c.titulo}</h2>
                        <p className="text-muted mt-3 leading-relaxed">
                          {c.detalle}
                        </p>

                        {/* Los datos que definen si la convocatoria es para
                            vos, antes de abrir el formulario. */}
                        <dl className="border-border mt-7 space-y-3 border-t pt-6 text-sm">
                          {c.datos.map((dato) => (
                            <div
                              key={dato.rotulo}
                              className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-3"
                            >
                              <dt className="text-muted font-mono text-[11px] tracking-[0.12em] uppercase sm:pt-0.5">
                                {dato.rotulo}
                              </dt>
                              <dd className="text-fg">{dato.valor}</dd>
                            </div>
                          ))}
                        </dl>

                        {/* `mt-auto`: empuja los CTA al pie de la tarjeta, así
                            quedan alineados entre las dos aunque una tenga un
                            dato más que la otra. */}
                        <div className="mt-auto flex flex-wrap gap-3 pt-8">
                          {c.enlaces.map((enlace) =>
                            enlace.href && enlace.interno ? (
                              <Link
                                key={enlace.texto}
                                href={enlace.href}
                                className={clasesCta(enlace.principal)}
                              >
                                {enlace.texto}
                              </Link>
                            ) : enlace.href ? (
                              <a
                                key={enlace.texto}
                                href={enlace.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={clasesCta(enlace.principal)}
                              >
                                {enlace.texto}
                                <FlechaExterna />
                              </a>
                            ) : (
                              // `span` inerte y no `a`/`button`: un CTA que no
                              // lleva a ningún lado es peor que uno ausente.
                              <span
                                key={enlace.texto}
                                aria-disabled="true"
                                className="border-border text-muted inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold"
                              >
                                {enlace.texto}
                                <span className="bg-copat-yellow text-magenta-deep inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                                  Muy pronto
                                </span>
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Plato de la impresora: la base de color sobre la que
                          se apoya la pieza. Crece al pasar el mouse. */}
                      <span
                        className={`plato-tarjeta absolute inset-x-0 bottom-0 h-[3px] ${a.bg} origin-left scale-x-[0.18] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100`}
                        aria-hidden="true"
                      />
                    </article>
                  </Tarjeta3D>
                </div>
              );
            })}
          </div>

          <p className="sheet text-muted mt-10 text-center">
            Las inscripciones se completan en un formulario de Google. Ante
            cualquier problema para acceder, escribinos a{" "}
            <a
              href="mailto:copat3d@aif.gob.ar"
              className="text-accent-text font-semibold underline underline-offset-4"
            >
              copat3d@aif.gob.ar
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
