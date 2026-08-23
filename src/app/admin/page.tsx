import type { Metadata } from "next";
import { obtenerInscriptos } from "@/lib/db";
import { EJES } from "@/content/ejes";

// El panel no es contenido del sitio: no debe indexarse ni salir en el
// sitemap. La protección real la da el middleware (Basic Auth); esto es
// solo para que Google no lo liste igual si alguna vez lo encuentra.
export const metadata: Metadata = {
  title: "Panel de inscriptos",
  robots: { index: false, follow: false },
};

// El panel se genera en cada visita, nunca cacheado: los datos cambian con
// cada inscripción nueva y este no es un contenido que tenga sentido servir
// desde caché.
export const dynamic = "force-dynamic";

const TITULO_EJE = new Map(EJES.map((eje) => [eje.id, eje.titulo]));

const CELDA = "px-4 py-3 text-sm whitespace-nowrap";

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
            <p className="text-muted mt-2">
              {inscriptos.length}{" "}
              {inscriptos.length === 1 ? "inscripto" : "inscriptos"} en total.
            </p>
          </div>
          <a
            href="/admin/export"
            className="bg-magenta inline-block rounded-full px-6 py-3 font-bold text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            Descargar CSV
          </a>
        </div>

        <div className="border-border bg-surface mt-8 overflow-x-auto rounded-2xl border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-border text-muted border-b text-left text-xs font-semibold tracking-wide uppercase">
                <th className={CELDA}>Código</th>
                <th className={CELDA}>Nombre y apellido</th>
                <th className={CELDA}>DNI</th>
                <th className={CELDA}>Nacimiento</th>
                <th className={CELDA}>Correo</th>
                <th className={CELDA}>Ciudad</th>
                <th className={CELDA}>Provincia</th>
                <th className={CELDA}>Eje de interés</th>
                <th className={CELDA}>Inscripto el</th>
              </tr>
            </thead>
            <tbody>
              {inscriptos.map((fila) => (
                <tr
                  key={fila.codigo_reserva}
                  className="border-border hover:bg-surface-2 border-b last:border-0"
                >
                  <td className={`${CELDA} text-accent-text font-mono font-semibold`}>
                    {fila.codigo_reserva}
                  </td>
                  <td className={CELDA}>{fila.nombre_apellido}</td>
                  <td className={CELDA}>{fila.dni}</td>
                  <td className={CELDA}>{fila.fecha_nacimiento}</td>
                  <td className={CELDA}>{fila.email}</td>
                  <td className={CELDA}>{fila.ciudad}</td>
                  <td className={CELDA}>{fila.provincia}</td>
                  <td className={CELDA}>
                    {fila.interes ? (TITULO_EJE.get(fila.interes) ?? fila.interes) : "—"}
                  </td>
                  <td className={`${CELDA} text-muted`}>{fila.creado}</td>
                </tr>
              ))}

              {inscriptos.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-muted px-4 py-12 text-center">
                    Todavía no hay inscriptos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
