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
 * Los tres links que pasó la AIF por WhatsApp eran de EDICIÓN (`.../edit`),
 * no públicos. Verificado uno por uno (31/8/2026) probando la variante
 * pública de cada uno (`/viewform` en los Forms, `/preview` en el Doc):
 *
 * - Emprendedores (Form): responde el formulario real. Público, se usa tal
 *   cual con `/viewform`.
 * - Secundarios (Form) y Bases y condiciones (Doc): las dos devuelven
 *   401 Unauthorized. No es un problema de la URL — el archivo está
 *   compartido solo para personas puntuales, no para "cualquiera con el
 *   enlace". Hace falta que la AIF cambie el permiso de acceso (o mande el
 *   PDF de las bases para alojarlo directo acá, más robusto a largo plazo
 *   que depender de que ese permiso no cambie).
 *
 * Cada `enlace` sin `href` se renderiza inerte ("Muy pronto"), igual que
 * hacía toda la tarjeta antes de tener el primer link confirmado.
 */
type Enlace = { texto: string; href?: string };

const CONVOCATORIAS: {
  id: string;
  titulo: string;
  detalle: string;
  enlaces: Enlace[];
}[] = [
  {
    id: "secundarios",
    titulo: "Concurso de Secundarios",
    detalle:
      "Certamen para estudiantes de escuelas secundarias de Tierra del Fuego, en el marco de COPAT 3D.",
    enlaces: [{ texto: "Bases y condiciones" }, { texto: "Inscribirme" }],
  },
  {
    id: "emprendedores",
    titulo: "Registro de Emprendedores",
    detalle:
      "Espacio para presentar proyectos y emprendimientos vinculados a la fabricación digital.",
    enlaces: [
      {
        texto: "Inscribirme",
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

                <div className="mt-8 flex flex-wrap gap-3">
                  {c.enlaces.map((enlace) =>
                    enlace.href ? (
                      <a
                        key={enlace.texto}
                        href={enlace.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-border hover:border-magenta/50 hover:text-accent-text inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-colors duration-200"
                      >
                        {enlace.texto}
                        <FlechaExterna />
                      </a>
                    ) : (
                      // `span` inerte y no `a`/`button`: todavía no hay link
                      // público al que apuntar (ver comentario arriba). Un
                      // CTA que no lleva a ningún lado es peor que ausente.
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
              </article>
            ))}
          </div>

          <p className="sheet text-muted mt-10 text-center">
            Las bases y condiciones y el formulario del concurso de
            secundarios se publican en cuanto la Agencia habilite el acceso.
          </p>
        </div>
      </div>
    </main>
  );
}
