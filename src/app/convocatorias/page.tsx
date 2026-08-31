import type { Metadata } from "next";
import Link from "next/link";
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
type Enlace = { texto: string; href?: string; interno?: boolean };

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
                    enlace.href && enlace.interno ? (
                      <Link
                        key={enlace.texto}
                        href={enlace.href}
                        className="border-border hover:border-magenta/50 hover:text-accent-text inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-colors duration-200"
                      >
                        {enlace.texto}
                      </Link>
                    ) : enlace.href ? (
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
