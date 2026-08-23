import type { Metadata } from "next";
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

  return (
    <main className="flex-1 px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Inscriptos — COPAT 3D
            </h1>
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
