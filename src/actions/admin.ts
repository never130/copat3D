"use server";

import { headers } from "next/headers";
import { alternarAsistencia } from "@/lib/db";
import { verificarAuthAdmin } from "@/lib/admin-auth";

export type EstadoAsistencia = {
  ok: boolean;
  mensaje: string;
  nombre?: string;
  asistio?: boolean;
};

export async function marcarAsistencia(codigo: string): Promise<EstadoAsistencia> {
  // Defensa en profundidad: el proxy ya protege /admin, pero una Server
  // Function no es una ruta aparte en esa cadena — ver el comentario en
  // src/lib/admin-auth.ts. Sin esto, alguien que arme el POST a mano sin
  // pasar por el navegador (y por lo tanto sin el diálogo de Basic Auth)
  // podría marcar asistencia sin credenciales.
  const cabeceras = await headers();
  if (!verificarAuthAdmin(cabeceras.get("authorization"))) {
    return { ok: false, mensaje: "No autorizado." };
  }

  const normalizado = codigo.trim().toUpperCase();
  if (!normalizado) {
    return { ok: false, mensaje: "Escribí un código." };
  }

  try {
    const resultado = await alternarAsistencia(normalizado);
    if (!resultado) {
      return { ok: false, mensaje: `No existe ninguna inscripción con el código ${normalizado}.` };
    }
    return {
      ok: true,
      mensaje: resultado.asistio
        ? `Asistencia marcada: ${resultado.nombre_apellido}.`
        : `Asistencia desmarcada: ${resultado.nombre_apellido}.`,
      nombre: resultado.nombre_apellido,
      asistio: resultado.asistio,
    };
  } catch (error) {
    console.error("Error al marcar asistencia:", error);
    return { ok: false, mensaje: "Falló la conexión con la base. Probá de nuevo." };
  }
}
