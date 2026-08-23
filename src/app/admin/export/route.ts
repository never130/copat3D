import { obtenerInscriptos } from "@/lib/db";

/** Envuelve en comillas un campo si tiene coma, comilla o salto de línea;
 *  las comillas internas se duplican, que es como CSV las escapa. */
function celda(valor: string): string {
  if (/[",\n]/.test(valor)) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

const COLUMNAS = [
  "codigo_reserva",
  "nombre_apellido",
  "dni",
  "fecha_nacimiento",
  "email",
  "ciudad",
  "provincia",
  "interes",
  "creado",
  "asistio",
  "asistio_en",
] as const;

export async function GET() {
  const inscriptos = await obtenerInscriptos();

  const filas = inscriptos.map((fila) =>
    COLUMNAS.map((columna) => {
      // `asistio` es boolean, no string: el resto de las columnas pasa
      // directo por celda(), esta se traduce primero a texto legible.
      if (columna === "asistio") return celda(fila.asistio ? "Sí" : "No");
      return celda(fila[columna] ?? "");
    }).join(","),
  );

  // ﻿ (BOM UTF-8) al principio: sin esto, Excel en Windows —el que
  // probablemente use la AIF— abre el archivo asumiendo otra codificación y
  // los acentos y la Ñ quedan rotos. Con el BOM lo detecta bien solo.
  const csv = "﻿" + [COLUMNAS.join(","), ...filas].join("\r\n");

  const fecha = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscriptos-copat3d-${fecha}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
