import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";

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

const CRONOGRAMA = [
  { fecha: "1 al 7 de septiembre", instancia: "Inscripción de equipos mediante formulario en línea." },
  { fecha: "8 al 20 de septiembre", instancia: "Presentación del proyecto (MVP)." },
  {
    fecha: "21 al 25 de septiembre",
    instancia: "Etapa de revisión técnica y selección por parte del jurado.",
  },
  { fecha: "29 de septiembre", instancia: "Anuncio oficial de los ganadores." },
];

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
    <section className="sheet mt-12 first:mt-0">
      <h2 className="font-display text-2xl font-bold">
        <span className="text-accent-text">{numero}.</span> {titulo}
      </h2>
      <div className="text-muted mt-4 space-y-4 leading-relaxed">{children}</div>
    </section>
  );
}

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="text-accent-text mt-1 shrink-0" aria-hidden="true">
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
    <main className="flex-1">
      <PageHeader
        eyebrow="Concurso de Proyectos de Impresión 3D · Nivel secundario"
        titulo="Bases y condiciones"
        bajada="Concurso de Secundarios, en el marco del Congreso de Impresión 3D — 2 y 3 de octubre de 2026."
      />

      <NavbarSentinel />

      <div className="overflow-x-clip">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <p className="text-muted text-sm">
            Última actualización: {ULTIMA_ACTUALIZACION}
          </p>

          <div className="mt-12">
            <Seccion numero={1} titulo="Presentación">
              <p>
                La Agencia de Innovación Fueguina convoca al Concurso de
                Proyectos de Impresión 3D, destinado a estudiantes de nivel
                secundario de la provincia de Tierra del Fuego, en el marco
                del Congreso de Impresión 3D a realizarse los días 2 y 3 de
                octubre de 2026. La convocatoria busca promover el desarrollo
                de proyectos con aplicabilidad e impacto real en la
                comunidad, utilizando el diseño y la impresión 3D como
                herramientas de innovación.
              </p>
            </Seccion>

            <Seccion numero={2} titulo="Objetivos">
              <p>
                <strong className="text-fg">Objetivo general:</strong>{" "}
                impulsar el diseño y desarrollo de soluciones aplicables
                mediante impresión 3D por parte de estudiantes de nivel
                secundario, vinculando la tecnología con necesidades
                concretas de su entorno.
              </p>
              <p>
                <strong className="text-fg">Objetivos específicos:</strong>
              </p>
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
                Podrán participar instituciones educativas de nivel
                secundario de las ciudades de Río Grande, Ushuaia y Tolhuin.
                Cada institución podrá presentar un (1) equipo de trabajo,
                integrado por siete (7) estudiantes y acompañado por un (1)
                docente responsable.
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
                <strong className="text-fg">Modalidad:</strong> formulario en
                línea, publicado en la web oficial de la Agencia de
                Innovación Fueguina.
              </p>
              <p>
                <strong className="text-fg">Período de inscripción:</strong>{" "}
                del 31 de agosto al 7 de septiembre de 2026.
              </p>
              <p>
                Al inscribirse, cada equipo deberá presentar los datos
                institucionales y la síntesis del proyecto según se detalla
                en el punto 6.
              </p>
            </Seccion>

            <Seccion numero={6} titulo="Síntesis del proyecto">
              <p>
                Cada equipo deberá presentar una síntesis de una (1) carilla
                que incluya:
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
              <div className="border-border overflow-hidden rounded-2xl border">
                {CRONOGRAMA.map((fila, i) => (
                  <div
                    key={fila.fecha}
                    className={`grid gap-1 px-5 py-4 sm:grid-cols-[13rem_1fr] sm:gap-4 ${
                      i % 2 === 1 ? "bg-surface-2" : ""
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
                especializado designado por la organización. Se enfatiza que
                la evaluación es estrictamente académica y técnica a cargo
                del jurado.
              </p>
            </Seccion>

            <Seccion numero={9} titulo="Etapa de desarrollo">
              <p>
                Entre el 8 y el 20 de septiembre de 2026, los equipos
                presentarán sus proyectos incluyendo el título y su MVP
                (Producto Mínimo Viable).
              </p>
              <p>
                Un Producto Mínimo Viable (MVP) es una versión simplificada
                del proyecto que cuenta con las funciones esenciales para
                demostrar su utilidad y viabilidad técnica. Su objetivo es
                validar la idea central y el diseño 3D propuesto sin
                necesidad de un desarrollo final exhaustivo, permitiendo al
                jurado comprender el potencial de la solución.
              </p>
            </Seccion>

            <Seccion numero={10} titulo="Presentación final y elección de ganadores">
              <p>
                La presentación de los proyectos ante el jurado se realizará
                según el siguiente esquema:
              </p>
              <p>
                <strong className="text-fg">Revisión y Selección:</strong>{" "}
                del 21 al 25 de septiembre de 2026. El jurado analizará la
                aplicabilidad y el impacto de los MVP presentados.
              </p>
              <p>
                <strong className="text-fg">Anuncio de Ganadores:</strong> el
                día 29 de septiembre de 2026, a través de los canales
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
              <div className="bg-copat-coral/10 border-copat-coral/30 rounded-2xl border p-6">
                <p className="text-fg">
                  Se otorgará un (1) premio por ciudad —Río Grande, Ushuaia y
                  Tolhuin—, destinado a la institución ganadora, por un monto
                  de <strong>$1.500.000 + insumos</strong>, además de
                  participar en la primera jornada de COPAT 3D en la ciudad
                  de Ushuaia. Los tres premios son independientes entre sí.
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

          <p className="text-muted mt-14 border-t border-border pt-6 text-xs">
            Agencia de Innovación Fueguina — Bases y condiciones sujetas a lo
            dispuesto en la sección 14 del presente documento.
          </p>
        </div>
      </div>
    </main>
  );
}
