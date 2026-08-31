import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";
import { WireCube, WireMargins, WirePrism } from "@/components/shapes/wire";

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
 * Los links reales (bases y condiciones, y los dos formularios) todavía no
 * están cargados: los que pasó la AIF por WhatsApp son de EDICIÓN
 * (`.../edit`), no públicos — publicarlos tal cual dejaría que cualquier
 * visitante intente abrir el editor del documento o del formulario en vez
 * de completarlo. Mismo patrón que /agenda mientras no hay contenido
 * confirmado: la tarjeta ya existe, el botón queda inerte con un aviso,
 * hasta reemplazar `href` por el link público correcto.
 */
const CONVOCATORIAS = [
  {
    id: "secundarios",
    titulo: "Concurso de Secundarios",
    detalle:
      "Certamen para estudiantes de escuelas secundarias de Tierra del Fuego, en el marco de COPAT 3D.",
  },
  {
    id: "emprendedores",
    titulo: "Registro de Emprendedores",
    detalle:
      "Espacio para presentar proyectos y emprendimientos vinculados a la fabricación digital.",
  },
];

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
            {CONVOCATORIAS.map((c, i) => (
              <article
                key={c.id}
                style={
                  { "--sheet-delay": `${i * 90}ms` } as React.CSSProperties
                }
                className="sheet border-border bg-surface flex h-full flex-col rounded-3xl border p-8"
              >
                <h2 className="text-2xl">{c.titulo}</h2>
                <p className="text-muted mt-3 flex-1">{c.detalle}</p>

                {/* `span` inerte y no `a`/`button`: todavía no hay link
                    público al que apuntar (ver comentario arriba). Un CTA
                    que no lleva a ningún lado es peor que uno ausente. */}
                <span
                  aria-disabled="true"
                  className="border-border text-muted mt-8 inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold"
                >
                  Muy pronto
                  <span className="bg-copat-yellow text-magenta-deep inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                    En camino
                  </span>
                </span>
              </article>
            ))}
          </div>

          <p className="sheet text-muted mt-10 text-center">
            Las bases y condiciones y los formularios de inscripción se
            publican en cuanto estén disponibles.
          </p>
        </div>
      </div>
    </main>
  );
}
