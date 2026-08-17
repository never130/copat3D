import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  WireIcosahedron,
  WireMargins,
  WirePrism,
} from "@/components/shapes/wire";

export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Cronograma de charlas, talleres y demostraciones en vivo de COPAT 3D. 2 y 3 de octubre de 2026, Ushuaia, Tierra del Fuego.",
  alternates: { canonical: "/agenda" },
};

const DIAS = [
  { fecha: "Jueves 2 de octubre", detalle: "Apertura, ejes de salud e industria" },
  { fecha: "Viernes 3 de octubre", detalle: "Construcción, talento y cierre" },
];

export default function AgendaPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Dos días · Presenciales"
        titulo="Agenda"
        bajada="Charlas, talleres y demostraciones en vivo en Ushuaia, Tierra del Fuego."
      />

      <NavbarSentinel />

      {/* El overflow-x-clip va en un envoltorio de ancho completo, NO en el
          contenedor `max-w-7xl`: las figuras se posicionan fuera de la caja
          de ese contenedor, así que si el clip estuviera ahí las recortaría
          a todas. Esta página no vive dentro de .paper-page, que es quien
          cumple ese rol en la portada. */}
      <div className="overflow-x-clip">
        <div className="relative mx-auto max-w-7xl px-5 py-20">
          <WireMargins className="hidden sm:block">
            <WireIcosahedron
              size={132}
              tono="coral"
              className="absolute top-[10%] -left-36"
            />
            <WirePrism
              size={110}
              tono="sky"
              className="absolute bottom-[12%] -right-32"
            />
          </WireMargins>

          {/* Mobile: en la banda de padding, sangrando por el borde */}
          <WireMargins className="sm:hidden">
            <WirePrism
              size={88}
              tono="sky"
              className="absolute top-2 -right-8 opacity-70"
            />
          </WireMargins>

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
      </div>
    </main>
  );
}
