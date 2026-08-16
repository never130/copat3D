import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Inscripción",
  description:
    "Inscribite gratis a COPAT 3D. 2 y 3 de octubre de 2026, Ushuaia, Tierra del Fuego. Modalidad presencial y virtual.",
};

export default function RegistroPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Entrada gratuita"
        titulo="Inscripción"
        bajada="Participá de forma presencial en Ushuaia o seguí las charlas en vivo desde donde estés."
      />

      <NavbarSentinel />

      <div className="mx-auto max-w-2xl px-5 py-20">
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
          Tus datos se tratarán conforme a la Ley 25.326 de Protección de Datos
          Personales.
        </p>
      </div>
    </main>
  );
}
