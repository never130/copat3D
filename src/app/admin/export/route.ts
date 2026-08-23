import { obtenerInscriptos } from "@/lib/db";

/** Prepara un valor para una celda CSV.
 *
 *  Dos cosas, no una:
 *
 *  1. **Neutraliza fórmulas.** Excel interpreta como fórmula toda celda que
 *     arranque con `= + - @` (y con tab o retorno de carro). Alguien que se
 *     inscriba con el nombre `=HYPERLINK(...)` conseguiría que su fórmula
 *     corra en la máquina de quien abra el export, con acceso a las celdas
 *     de al lado — o sea al DNI y correo de otros inscriptos. Se antepone un
 *     apóstrofo, que Excel lee como "esto es texto" y no muestra.
 *  2. **Escapa según CSV.** Comillas dobles duplicadas y el campo entre
 *     comillas si contiene coma, comilla o salto de línea. `\r` incluido: el
 *     archivo une filas con `\r\n`, así que un `\r` suelto en un dato
 *     partiría la fila al medio. */
function celda(valor: string): string {
  const neutralizado = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;

  if (/["\n\r,]/.test(neutralizado)) {
    return `"${neutralizado.replace(/"/g, '""')}"`;
  }
  return neutralizado;
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
