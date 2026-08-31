import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export const metadata: Metadata = {
  title: "Bases y condiciones — Concurso de Secundarios",
  description:
    "Bases y condiciones del Concurso de Proyectos de Impresión 3D para nivel secundario, en el marco de COPAT 3D. Ushuaia, Tierra del Fuego.",
  alternates: { canonical: "/bases-secundarios" },
};

/**
 * Texto oficial que mandó la AIF por WhatsApp (PDF "COPAT3D_Bases_y_
 * Condiciones.pdf", 31/8/2026), alojado acá en vez de linkeado al Google Doc
 * original: ese Doc devuelve 401 Unauthorized para cualquiera sin acceso de
 * editor (verificado con WebFetch) y depender de que ese permiso se abra —y
 * se mantenga abierto— es más frágil que tener el texto en el sitio. Es
 * contenido público e informativo, no recolecta ningún dato, así que no pasa
 * por el checklist de docs/04-datos-y-legales.md (ese es para lo que junta
 * datos personales).
 *
 * **Se maqueta como el PDF, no como una página más del sitio.** No lleva
 * `PageHeader` magenta: la cabecera es la del documento (logo + rótulo +
 * filete), igual que el original, y todo vive dentro de una hoja blanca
 * (`.doc-hoja`, ver globals.css) que se lee como el papel impreso en los dos
 * modos. Sin `NavbarSentinel` a propósito — sin cabecera magenta el navbar
 * arranca sólido solo, que es lo que corresponde acá.
 *
 * Si la AIF manda una versión corregida del PDF, el texto se actualiza acá a
 * mano — no hay automatismo con el documento original.
 *
 * Ruta PLANA (`/bases-secundarios`, no `/convocatorias/bases-secundarios`):
 * ver trampa 21 de AGENTS.md. Anidarla bajo /convocatorias dejaba las
 * secciones invisibles para siempre al llegar por navegación interna —el
 * template.tsx raíz no se remonta entre rutas que comparten el primer
 * segmento, así que SheetMotion nunca observaba el contenido nuevo.
 */
const ULTIMA_ACTUALIZACION = "31 de agosto de 2026";

const ROTULO = "Concurso de Proyectos de Impresión 3D · Nivel secundario";

const CRONOGRAMA = [
  {
    fecha: "1 al 7 de septiembre",
    instancia: "Inscripción de equipos mediante formulario en línea.",
  },
  {
    fecha: "8 al 20 de septiembre",
    instancia: "Presentación del proyecto (MVP).",
  },
  {
    fecha: "21 al 25 de septiembre",
    instancia: "Etapa de revisión técnica y selección por parte del jurado.",
  },
  { fecha: "29 de septiembre", instancia: "Anuncio oficial de los ganadores." },
];

/**
 * Sección numerada, con el número volcado a la izquierda como en el PDF.
 *
 * La grilla `[2.25rem_1fr]` mantiene el cuerpo alineado con el título en vez
 * de arrancar bajo el número, que es lo que le da al documento su aire de
 * texto formal. En mobile el número se achica pero la sangría se conserva:
 * perderla haría que las listas y los párrafos se confundan entre secciones.
 */
function Seccion({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sheet mt-11 first:mt-0">
      <div className="grid grid-cols-[2.25rem_1fr] gap-x-2 sm:grid-cols-[3rem_1fr]">
        <span
          className="text-accent-text font-display text-xl font-bold"
          aria-hidden="true"
        >
          {numero}.
        </span>
        <h2 className="font-display text-fg text-xl font-bold sm:text-2xl">
          {titulo}
        </h2>
        <div className="text-muted col-start-2 mt-4 space-y-4 leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
}

/** Lista de guiones largos magenta, como las viñetas del documento. */
function Lista({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="text-accent-text shrink-0" aria-hidden="true">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function BasesSecundariosPage() {
  return (
    <main className="flex-1 px-5 pt-28 pb-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/convocatorias"
          className="text-muted hover:text-accent-text mb-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
        >
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Volver a convocatorias
        </Link>

        {/* La hoja: blanca en los dos modos, con la sombra proyectada que usa
            el resto del sitio para las capas de papel. */}
        <article className="doc-hoja rounded-3xl rounded-br-none bg-white px-6 py-10 shadow-[0_28px_60px_-30px_var(--paper-shadow)] sm:px-14 sm:py-14">
          {/* Cabecera del documento, calcada del PDF: marca a la izquierda,
              rótulo a la derecha, filete de tinta abajo. */}
          <header className="border-fg flex items-end justify-between gap-4 border-b-2 pb-5">
            <Logo className="text-accent-text h-7 w-auto sm:h-8" />
            <p className="text-accent-text font-mono text-[10px] font-medium tracking-[0.2em] uppercase">
              Bases y condiciones
            </p>
          </header>

          <div className="mt-10">
            <p className="text-accent-text font-mono text-[11px] font-medium tracking-[0.2em] uppercase">
              {ROTULO}
            </p>
            <h1 className="font-display text-fg mt-4 text-[clamp(2rem,6vw,3.25rem)] leading-[1.05] font-extrabold tracking-tight">
              Bases y condiciones
            </h1>
            <p className="text-muted mt-4 text-lg">
              En el marco del Congreso de Impresión 3D — 2 y 3 de octubre de
              2026.
            </p>
          </div>

          <div className="mt-12">
            <Seccion numero={1} titulo="Presentación">
              <p>
                La Agencia de Innovación Fueguina convoca al Concurso de
                Proyectos de Impresión 3D, destinado a estudiantes de nivel
                secundario de la provincia de Tierra del Fuego, en el marco del
                Congreso de Impresión 3D a realizarse los días 2 y 3 de octubre
                de 2026. La convocatoria busca promover el desarrollo de
                proyectos con aplicabilidad e impacto real en la comunidad,
                utilizando el diseño y la impresión 3D como herramientas de
                innovación.
              </p>
            </Seccion>

            <Seccion numero={2} titulo="Objetivos">
              <p>
                <strong className="text-fg font-semibold">
                  Objetivo general:
                </strong>{" "}
                impulsar el diseño y desarrollo de soluciones aplicables
                mediante impresión 3D por parte de estudiantes de nivel
                secundario, vinculando la tecnología con necesidades concretas
                de su entorno.
              </p>
              <p className="text-fg font-semibold">Objetivos específicos:</p>
              <Lista
                items={[
                  "Fomentar el trabajo colaborativo y la resolución de problemas reales.",
                  "Vincular los aprendizajes escolares con demandas del ámbito educativo, comunitario, sanitario o barrial.",
                  "Estimular la creatividad, la innovación y el pensamiento técnico.",
                  "Difundir la cultura del diseño y la fabricación digital en las instituciones fueguinas.",
                ]}
              />
            </Seccion>

            <Seccion numero={3} titulo="Destinatarios">
              <p>
                Podrán participar instituciones educativas de nivel secundario
                de las ciudades de Río Grande, Ushuaia y Tolhuin. Cada
                institución podrá presentar un (1) equipo de trabajo, integrado
                por siete (7) estudiantes y acompañado por un (1) docente
                responsable.
              </p>
            </Seccion>

            <Seccion numero={4} titulo="Requisitos de participación">
              <Lista
                items={[
                  "Ser una institución educativa de nivel secundario de Río Grande, Ushuaia o Tolhuin.",
                  "Conformar un equipo de siete (7) estudiantes con un docente responsable a cargo.",
                  "Declarar que la institución dispone del equipamiento necesario (impresora 3D y recursos asociados) para el desarrollo del proyecto.",
                  "Contar con el aval de la autoridad institucional.",
                  "Completar la inscripción en tiempo y forma dentro del período establecido.",
                ]}
              />
            </Seccion>

            <Seccion numero={5} titulo="Inscripción">
              <p>
                <strong className="text-fg font-semibold">Modalidad:</strong>{" "}
                formulario en línea, publicado en la web oficial de la Agencia
                de Innovación Fueguina.
              </p>
              <p>
                <strong className="text-fg font-semibold">
                  Período de inscripción:
                </strong>{" "}
                del 31 de agosto al 7 de septiembre de 2026.
              </p>
              <p>
                Al inscribirse, cada equipo deberá presentar los datos
                institucionales y la síntesis del proyecto según se detalla en
                el punto 6.
              </p>
            </Seccion>

            <Seccion numero={6} titulo="Síntesis del proyecto">
              <p>
                Cada equipo deberá presentar una síntesis de una (1) carilla que
                incluya:
              </p>
              <Lista
                items={[
                  "Nombre del proyecto.",
                  "Descripción y síntesis general de la propuesta.",
                  "Aplicabilidad: ámbito al que apunta (educativo, comunitario, sanitario, barrial u otro).",
                  "Impacto esperado de forma clara y concreta.",
                  "Confirmación del equipamiento disponible para su desarrollo.",
                ]}
              />
            </Seccion>

            <Seccion numero={7} titulo="Cronograma">
              {/* La tabla se APILA en mobile en vez de scrollear. Con las dos
                  columnas fijas su ancho mínimo era de 376px —constante, sin
                  importar el viewport— y en 360px desbordaba la página
                  entera. Para un cronograma de cuatro filas, apilar se lee
                  mejor que un scroll lateral dentro del documento. */}
              <div className="border-border overflow-hidden rounded-2xl border">
                {/* Los rótulos solo desde `sm`: apilada, cada fila ya se lee
                    como fecha + descripción y encabezarlas sobra. */}
                <div className="bg-fg hidden gap-4 px-5 py-3 sm:grid sm:grid-cols-[13rem_1fr]">
                  <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-white uppercase">
                    Fecha
                  </span>
                  <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-white uppercase">
                    Instancia
                  </span>
                </div>
                {CRONOGRAMA.map((fila, i) => (
                  <div
                    key={fila.fecha}
                    className={`grid gap-1 px-5 py-4 text-sm sm:grid-cols-[13rem_1fr] sm:gap-4 sm:text-base ${
                      i % 2 === 0 ? "bg-surface-2" : ""
                    }`}
                  >
                    <span className="text-fg font-semibold">{fila.fecha}</span>
                    <span>{fila.instancia}</span>
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion numero={8} titulo="Instancia de selección">
              <p>
                La revisión de las propuestas estará a cargo de un jurado
                especializado designado por la organización. Se enfatiza que la
                evaluación es estrictamente académica y técnica a cargo del
                jurado.
              </p>
            </Seccion>

            <Seccion numero={9} titulo="Etapa de desarrollo">
              <p>
                Entre el 8 y el 20 de septiembre de 2026, los equipos
                presentarán sus proyectos incluyendo el título y su MVP
                (Producto Mínimo Viable).
              </p>
              <p>
                Un Producto Mínimo Viable (MVP) es una versión simplificada del
                proyecto que cuenta con las funciones esenciales para demostrar
                su utilidad y viabilidad técnica. Su objetivo es validar la idea
                central y el diseño 3D propuesto sin necesidad de un desarrollo
                final exhaustivo, permitiendo al jurado comprender el potencial
                de la solución.
              </p>
            </Seccion>

            <Seccion
              numero={10}
              titulo="Presentación final y elección de ganadores"
            >
              <p>
                La presentación de los proyectos ante el jurado se realizará
                según el siguiente esquema:
              </p>
              <p>
                <strong className="text-fg font-semibold">
                  Revisión y Selección:
                </strong>{" "}
                del 21 al 25 de septiembre de 2026. El jurado analizará la
                aplicabilidad y el impacto de los MVP presentados.
              </p>
              <p>
                <strong className="text-fg font-semibold">
                  Anuncio de Ganadores:
                </strong>{" "}
                el día 29 de septiembre de 2026, a través de los canales
                oficiales.
              </p>
            </Seccion>

            <Seccion numero={11} titulo="Criterios de evaluación">
              <p>El jurado evaluará cada proyecto considerando:</p>
              <Lista
                items={[
                  "Aplicabilidad y pertinencia de la propuesta.",
                  "Impacto en la comunidad o en el ámbito destinatario.",
                  "Grado de innovación y creatividad.",
                  "Viabilidad técnica y uso del diseño y la impresión 3D.",
                  "Desarrollo de prototipo o avance demostrable.",
                  "Claridad y calidad de la presentación.",
                ]}
              />
            </Seccion>

            <Seccion numero={12} titulo="Premios">
              {/* Caja destacada del PDF: fondo rosa muy claro y filete magenta
                  a la izquierda. Es el dato que todo el mundo viene a buscar. */}
              <div className="border-magenta bg-magenta/[0.07] rounded-r-2xl border-l-4 px-6 py-5">
                <p className="text-fg leading-relaxed">
                  Se otorgará{" "}
                  <strong className="text-accent-text font-bold">
                    un (1) premio por ciudad
                  </strong>{" "}
                  —Río Grande, Ushuaia y Tolhuin—, destinado a la institución
                  ganadora, por un monto de{" "}
                  <strong className="text-accent-text font-bold">
                    $1.500.000 + insumos
                  </strong>
                  , además de participar en la primera jornada de COPAT 3D en la
                  ciudad de Ushuaia. Los tres premios son independientes entre
                  sí.
                </p>
              </div>
            </Seccion>

            <Seccion numero={13} titulo="Jurado">
              <p>
                La evaluación estará a cargo de un jurado designado por la
                Agencia de Innovación Fueguina.
              </p>
            </Seccion>

            <Seccion numero={14} titulo="Disposiciones generales">
              <Lista
                items={[
                  "La participación en el concurso implica el conocimiento y la aceptación de las presentes bases y condiciones.",
                  "Los participantes autorizan a la Agencia de Innovación Fueguina a difundir imágenes, nombres y contenidos de los proyectos con fines institucionales y de comunicación.",
                  "Toda situación no prevista en las presentes bases será resuelta por la organización.",
                ]}
              />
            </Seccion>

            <Seccion numero={15} titulo="Contacto">
              <p>
                Ante cualquier consulta, comunicarse a{" "}
                <a
                  href="mailto:copat3d@aif.gob.ar"
                  className="text-accent-text font-semibold underline underline-offset-4"
                >
                  copat3d@aif.gob.ar
                </a>
                .
              </p>
            </Seccion>
          </div>

          {/* Banda de cierre del documento, como la última página del PDF. */}
          <div className="sheet bg-fg mt-14 rounded-2xl rounded-tr-none px-6 py-6 sm:px-8">
            <p className="text-magenta font-mono text-[10px] font-medium tracking-[0.2em] uppercase">
              {ROTULO}
            </p>
            <p className="mt-2 font-semibold text-white">
              COPAT 3D — Congreso de Impresión 3D · 2 y 3 de octubre de 2026 ·{" "}
              <a
                href="mailto:copat3d@aif.gob.ar"
                className="underline underline-offset-4"
              >
                copat3d@aif.gob.ar
              </a>
            </p>
          </div>

          <p className="text-muted border-border mt-8 border-t pt-5 text-xs leading-relaxed">
            Agencia de Innovación Fueguina — Bases y condiciones sujetas a lo
            dispuesto en la sección 14 del presente documento. Última
            actualización: {ULTIMA_ACTUALIZACION}.
          </p>
        </article>
      </div>
    </main>
  );
}
