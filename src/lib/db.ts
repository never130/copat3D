import { Pool } from "pg";
import { envDb } from "@/lib/env";

/**
 * Pool de conexión a Postgres, cacheado en `globalThis`.
 *
 * En desarrollo, Next.js recarga los módulos en cada cambio de archivo
 * (Fast Refresh). Sin este cacheo, cada recarga crearía un `Pool` nuevo sin
 * cerrar el anterior y el Postgres local terminaría rechazando conexiones
 * por agotamiento. En producción (una instancia serverless por invocación)
 * el cacheo no cambia nada, pero tampoco molesta.
 *
 * Igual que `env.ts`, el `Pool` no se crea al importar el módulo: se arma la
 * primera vez que `getPool()` se llama de verdad, así una página que no toca
 * la base no se cae por faltar `DATABASE_URL`.
 */
const global_ = globalThis as unknown as { poolCopat3d?: Pool };

export function getPool(): Pool {
  if (!global_.poolCopat3d) {
    const { connectionString } = envDb();
    global_.poolCopat3d = new Pool({ connectionString });
  }
  return global_.poolCopat3d;
}

/** Código de reserva corto y legible en voz alta (ej. `COPAT-7K2M`).
 *
 * Alfabeto sin `0/O/1/I/L`: son los caracteres que alguien confunde al
 * dictarlo por teléfono o al leerlo en una pantalla chica. 4 caracteres de
 * ese alfabeto dan 32⁴ ≈ 1M de combinaciones — de sobra para un evento de
 * este tamaño, y la columna igual tiene UNIQUE por si alguna vez choca. */
const ALFABETO = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generarCodigoReserva(): string {
  let codigo = "";
  for (let i = 0; i < 4; i++) {
    codigo += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return `COPAT-${codigo}`;
}

/** Una fila de la lista de inscriptos, tal como la necesita el panel
 *  (`/admin`) y su exportación a CSV — un solo lugar para esta consulta
 *  evita que las dos vistas terminen mostrando datos distintos. */
export type InscriptoFila = {
  codigo_reserva: string;
  nombre_apellido: string;
  dni: string;
  fecha_nacimiento: string;
  email: string;
  ciudad: string;
  provincia: string;
  interes: string | null;
  creado: string;
};

export async function obtenerInscriptos(): Promise<InscriptoFila[]> {
  const pool = getPool();
  // Fechas formateadas del lado de SQL, no armadas con `Date` en JS: es la
  // misma trampa de huso horario que calcularEdad() en validation.ts —
  // `new Date("2008-08-22")` puede leerse un día antes en huso Argentina.
  // `to_char` evita el problema de raíz.
  const { rows } = await pool.query<InscriptoFila>(
    `SELECT
       codigo_reserva,
       nombre_apellido,
       dni,
       to_char(fecha_nacimiento, 'DD/MM/YYYY') AS fecha_nacimiento,
       email,
       ciudad,
       provincia,
       interes,
       to_char(created_at AT TIME ZONE 'America/Argentina/Ushuaia', 'DD/MM/YYYY HH24:MI') AS creado
     FROM inscripciones
     ORDER BY created_at DESC`,
  );
  return rows;
}
