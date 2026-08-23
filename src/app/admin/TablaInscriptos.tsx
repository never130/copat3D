"use client";

import { useState, useTransition } from "react";
import { marcarAsistencia } from "@/actions/admin";
import { EJES } from "@/content/ejes";
import type { InscriptoFila } from "@/lib/db";

const TITULO_EJE = new Map(EJES.map((eje) => [eje.id, eje.titulo]));

const CELDA = "px-4 py-3 text-sm whitespace-nowrap";

/**
 * Tabla + buscador + marcado de asistencia.
 *
 * El estado de asistencia se actualiza localmente en cuanto la Server
 * Action confirma el cambio (no antes, no es optimista de verdad): con dos
 * personas trabajando la puerta a la vez y el panel abierto en dos
 * celulares, cada uno ve su propio marcado al toque pero no el del otro
 * hasta que recargue la página. Para el tamaño de este evento —un par de
 * personas en la puerta, no una cola de cajeros— no vale la pena la
 * complejidad de sincronizar en vivo entre pestañas.
 */
export function TablaInscriptos({
  inscriptosIniciales,
}: {
  inscriptosIniciales: InscriptoFila[];
}) {
  const [inscriptos, setInscriptos] = useState(inscriptosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [codigoEnCurso, setCodigoEnCurso] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  const termino = busqueda.trim().toLowerCase();
  const filtrados = termino
    ? inscriptos.filter(
        (i) =>
          i.codigo_reserva.toLowerCase().includes(termino) ||
          i.nombre_apellido.toLowerCase().includes(termino) ||
          i.dni.includes(termino),
      )
    : inscriptos;

  function alternar(codigo: string) {
    setCodigoEnCurso(codigo);
    setMensaje(null);
    iniciarTransicion(async () => {
      const resultado = await marcarAsistencia(codigo);
      setMensaje(resultado.mensaje);
      if (resultado.ok && resultado.asistio !== undefined) {
        setInscriptos((prev) =>
          prev.map((fila) =>
            fila.codigo_reserva === codigo
              ? { ...fila, asistio: resultado.asistio! }
              : fila,
          ),
        );
      }
      setCodigoEnCurso(null);
    });
  }

  const asistieron = inscriptos.filter((i) => i.asistio).length;

  return (
    <>
      {/* El total y el contador de asistencia viven acá, no en el Server
          Component del padre: si quedaran allá, se calcularían con los datos
          del primer render y nunca reflejarían un marcado hecho después sin
          recargar la página. */}
      <p className="text-muted mt-2">
        {inscriptos.length} {inscriptos.length === 1 ? "inscripto" : "inscriptos"} en
        total · {asistieron} con asistencia marcada.
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por código, nombre o DNI…"
          className="border-border bg-surface text-fg placeholder:text-muted/70 focus:border-magenta w-full max-w-sm rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors"
        />
        {termino && (
          <span className="text-muted text-sm">
            {filtrados.length} de {inscriptos.length}
          </span>
        )}
      </div>

      {/* `role="status"` para que un lector de pantalla anuncie el resultado
          del marcado sin que alguien tenga que ir a buscarlo. */}
      {mensaje && (
        <p role="status" className="text-accent-text mt-2 text-sm font-medium">
          {mensaje}
        </p>
      )}

      <div className="border-border bg-surface mt-4 overflow-x-auto rounded-2xl border">
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
              <th className={CELDA}>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((fila) => (
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
                <td className={CELDA}>
                  <button
                    type="button"
                    onClick={() => alternar(fila.codigo_reserva)}
                    disabled={pendiente && codigoEnCurso === fila.codigo_reserva}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:cursor-wait disabled:opacity-60 ${
                      fila.asistio
                        ? "bg-copat-green-deep/15 text-copat-green-deep dark:bg-copat-green/15 dark:text-copat-green"
                        : "border-border text-muted border hover:border-magenta/40"
                    }`}
                  >
                    {pendiente && codigoEnCurso === fila.codigo_reserva
                      ? "…"
                      : fila.asistio
                        ? "✓ Asistió"
                        : "Marcar"}
                  </button>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan={10} className="text-muted px-4 py-12 text-center">
                  {inscriptos.length === 0
                    ? "Todavía no hay inscriptos."
                    : "Ningún inscripto coincide con la búsqueda."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
