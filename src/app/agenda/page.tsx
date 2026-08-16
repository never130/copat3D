import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Cronograma de charlas, talleres y demostraciones en vivo de COPAT 3D. 2 y 3 de octubre de 2026, Ciudad Autónoma de Buenos Aires.",
};

const DIAS = [
  { fecha: "Jueves 2 de octubre", detalle: "Apertura, ejes de salud e industria" },
  { fecha: "Viernes 3 de octubre", detalle: "Construcción, talento y cierre" },
];

export default function AgendaPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Dos días · Presencial y virtual"
        titulo="Agenda"
        bajada="Charlas, talleres y demostraciones en vivo en la Fábrica de Talentos."
      />

      <NavbarSentinel />

      <div className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {DIAS.map((dia, i) => (
            <article
              key={dia.fecha}
              style={{ "--sheet-delay": `${i * 90}ms` } as React.CSSProperties}
              className="sheet border-border bg-surface rounded-3xl border p-8"
            >
              <h2 className="text-2xl">{dia.fecha}</h2>
              <p className="text-muted mt-3">{dia.detalle}</p>
              <div className="border-border mt-6 space-y-3 border-t pt-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-surface-2 h-14 animate-pulse rounded-xl"
                    style={{ animationDelay: `${i * 140}ms` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="sheet text-muted mt-10 text-center">
          Estamos cerrando el cronograma con los speakers confirmados.
          <span className="bg-copat-yellow text-magenta-deep ml-2 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
            Próximamente
          </span>
        </p>
      </div>
    </main>
  );
}
