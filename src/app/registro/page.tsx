import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  WireCube,
  WireMargins,
  WireOctahedron,
} from "@/components/shapes/wire";

export const metadata: Metadata = {
  title: "Inscripción",
  description:
    "Inscribite gratis a COPAT 3D. 2 y 3 de octubre de 2026, Ushuaia, Tierra del Fuego. Modalidad presencial.",
  alternates: { canonical: "/registro" },
};

export default function RegistroPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Entrada gratuita"
        titulo="Inscripción"
        bajada="Participá de forma presencial en Ushuaia, Tierra del Fuego."
      />

      <NavbarSentinel />

      {/* El clip va en el envoltorio de ancho completo, no en el contenedor
          `max-w-2xl`: las figuras se posicionan fuera de la caja de ese
          contenedor y quedarían recortadas. */}
      <div className="overflow-x-clip">
        <div className="relative mx-auto max-w-2xl px-5 py-20">
          <WireMargins className="hidden sm:block">
            {/* Offsets más grandes que en la portada: este contenedor es
                `max-w-2xl`, mucho más angosto, así que con -left-40 asomaba
                un borde de ~8px ya en 768px y se leía como un artefacto. */}
            <WireOctahedron
              size={120}
              tono="lilac"
              className="absolute top-[12%] left-[-14rem]"
            />
            <WireCube
              size={104}
              tono="yellow"
              className="absolute right-[-13rem] bottom-[16%]"
            />
          </WireMargins>

          {/* Mobile: en la banda de padding, sangrando por el borde */}
          <WireMargins className="sm:hidden">
            <WireOctahedron
              size={90}
              tono="lilac"
              className="absolute top-2 -left-8 opacity-70"
            />
          </WireMargins>

          <div className="sheet border-border bg-surface rounded-3xl border border-dashed p-12 text-center">
          <h2 className="text-2xl">El formulario se habilita en breve</h2>
          <p className="text-muted mx-auto mt-4 max-w-md leading-relaxed">
            Estamos terminando de definir el circuito de acreditación junto a la
            AIF. Mientras tanto podés escribirnos y te avisamos apenas se abra
            la inscripción.
          </p>
          <a
            href="mailto:copat3d@aif.gob.ar?subject=Quiero%20inscribirme%20a%20COPAT%203D"
            className="bg-magenta mt-8 inline-block rounded-full px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            Avisenme cuando abra
          </a>
        </div>

          {/* El formulario no se publica hasta cerrar el checklist legal:
              se recolecta DNI y el responsable es un organismo público.
              Ver docs/04-datos-y-legales.md */}
          <p className="text-muted mt-8 text-center text-sm">
            Tus datos se tratarán conforme a la Ley 25.326 de Protección de
            Datos Personales.
          </p>
        </div>
      </div>
    </main>
  );
}
