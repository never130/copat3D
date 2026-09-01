import type { Metadata } from "next";
import { cupoTotal } from "@/lib/cupo";
import { obtenerInscriptos } from "@/lib/db";
import { TablaInscriptos } from "./TablaInscriptos";

// El panel no es contenido del sitio: no debe indexarse ni salir en el
// sitemap. La protección real la da el proxy (Basic Auth); esto es solo
// para que Google no lo liste igual si alguna vez lo encuentra.
export const metadata: Metadata = {
  title: "Panel de inscriptos",
  robots: { index: false, follow: false },
};

// El panel se genera en cada visita, nunca cacheado: los datos cambian con
// cada inscripción nueva y este no es un contenido que tenga sentido servir
// desde caché.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const inscriptos = await obtenerInscriptos();
  const cupo = cupoTotal();
  const libres = Math.max(cupo - inscriptos.length, 0);

  // pt-28 y no py-12: el navbar es `fixed` y mide 78px, así que con 48px de
  // padding el <h1> y el botón de descarga quedaban debajo de él — tapados e
  // inclickeables. El resto de las páginas interiores reserva ese espacio con
  // el pt-32 de PageHeader; acá no hay PageHeader (es un panel interno, no
  // lleva la cabecera de marca) así que va a mano.
  return (
    <main className="flex-1 px-5 pt-28 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Inscriptos — COPAT 3D
            </h1>
            {/* El cupo se ve acá porque es la información que decide si hay
                que ampliarlo. El total sale de REGISTRO_CUPO: para pasar de
                300 a 500 se cambia esa variable en Vercel, sin tocar código. */}
            <p className="text-muted mt-2 text-sm">
              <span className="text-fg font-semibold">
                {inscriptos.length} de {cupo}
              </span>{" "}
              lugares ocupados ·{" "}
              {libres > 0 ? `quedan ${libres}` : "cupo agotado"}
            </p>
          </div>
          <a
            href="/admin/export"
            className="bg-magenta inline-block rounded-full px-6 py-3 font-bold text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            Descargar CSV
          </a>
        </div>

        <TablaInscriptos inscriptosIniciales={inscriptos} />
      </div>
    </main>
  );
}
