import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";
import { RegistroForm } from "@/components/sections/RegistroForm";
import {
  WireCube,
  WireMargins,
  WireOctahedron,
} from "@/components/shapes/wire";
import { type EstadoCupo, estadoCupo } from "@/lib/cupo";
import { REGISTRO_HABILITADO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inscripción",
  description:
    "Inscribite gratis a COPAT 3D. 2 y 3 de octubre de 2026, Ushuaia, Tierra del Fuego. Modalidad presencial.",
  alternates: { canonical: "/registro" },
};

/**
 * La página consulta el cupo, así que no puede quedar prerenderizada de una
 * vez para siempre: el número se congelaría en el del build. Con 60 segundos
 * el contador está fresco sin pegarle a la base en cada visita, y el desfase
 * no tiene consecuencia — quien decide de verdad si entra una inscripción es
 * la Server Action, no esto.
 */
export const revalidate = 60;

/**
 * Estado del cupo, o `null` si la base no responde.
 *
 * Ante un fallo de base se muestra el formulario normal en vez de un cartel
 * de error: la comprobación real la hace la Server Action al guardar, así que
 * lo peor que pasa es que alguien complete el formulario y reciba ahí el
 * aviso. Tratar la caída como "agotado" sería mucho peor — cerraría la
 * inscripción por un problema de infraestructura.
 */
async function leerCupo(): Promise<EstadoCupo | null> {
  if (!REGISTRO_HABILITADO) return null;
  try {
    return await estadoCupo();
  } catch (error) {
    console.error("No se pudo leer el estado del cupo:", error);
    return null;
  }
}

export default async function RegistroPage() {
  const cupo = await leerCupo();

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Entrada gratuita"
        titulo="Inscripción"
        bajada="Participá de forma presencial en Ushuaia, Tierra del Fuego."
      />

      <NavbarSentinel />

      {/* El clip va en el envoltorio de ancho completo, no en el contenedor
          `max-w-4xl`: las figuras se posicionan fuera de la caja de ese
          contenedor y quedarían recortadas. */}
      <div className="overflow-x-clip">
        <div className="relative mx-auto max-w-4xl px-5 py-20">
          <WireMargins className="hidden sm:block">
            {/* Offsets más grandes que en la portada: este contenedor es
                `max-w-4xl`, más angosto que el `max-w-7xl` de la portada, así
                que con offsets chicos asoma un borde y se lee como un
                artefacto. Recalibrados junto con el ancho del formulario. */}
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

          {/* El interruptor es de código (src/lib/site.ts), no de
              infraestructura: no alcanza con tocar la variable en Vercel sin
              haber cerrado antes el checklist legal de docs/04. */}
          <div className="sheet sheet-print">
            {REGISTRO_HABILITADO && cupo?.agotado ? (
              <div className="border-border bg-surface rounded-3xl border border-dashed p-12 text-center">
                <h2 className="text-2xl">Cupos agotados</h2>
                <p className="text-muted mx-auto mt-4 max-w-md leading-relaxed">
                  Se completaron los {cupo.total} lugares de la inscripción
                  individual. Escribinos y te avisamos si se liberan cupos o si
                  se amplía la capacidad.
                </p>
                <a
                  href="mailto:copat3d@aif.gob.ar?subject=Lista%20de%20espera%20COPAT%203D"
                  className="bg-magenta mt-8 inline-block rounded-full px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.03]"
                >
                  Quiero estar en lista de espera
                </a>
              </div>
            ) : REGISTRO_HABILITADO ? (
              <>
                {/* Solo cuando ya queda poco: con 12 inscriptos sobre 300,
                    anunciar los lugares libres comunica que el evento está
                    vacío. Ver UMBRAL_AVISO en src/lib/cupo.ts. */}
                {cupo?.avisar && (
                  <p className="border-copat-yellow/40 bg-copat-yellow/10 text-fg mb-6 rounded-2xl border px-5 py-4 text-center text-sm font-semibold">
                    Quedan {cupo.disponibles} de {cupo.total} lugares.
                  </p>
                )}
                <RegistroForm />
              </>
            ) : (
              <div className="border-border bg-surface rounded-3xl border border-dashed p-12 text-center">
                <h2 className="text-2xl">El formulario se habilita en breve</h2>
                <p className="text-muted mx-auto mt-4 max-w-md leading-relaxed">
                  Estamos terminando de definir el circuito de acreditación
                  junto a la AIF. Mientras tanto podés escribirnos y te
                  avisamos apenas se abra la inscripción.
                </p>
                <a
                  href="mailto:copat3d@aif.gob.ar?subject=Quiero%20inscribirme%20a%20COPAT%203D"
                  className="bg-magenta mt-8 inline-block rounded-full px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.03]"
                >
                  Avisenme cuando abra
                </a>
              </div>
            )}
          </div>

          <p className="text-muted mt-8 text-center text-sm">
            Tus datos se tratarán conforme a la Ley 25.326 de Protección de
            Datos Personales.
          </p>
        </div>
      </div>
    </main>
  );
}
