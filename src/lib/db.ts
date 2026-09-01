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

/** Clave del lock de cupo. Es un número arbitrario pero FIJO: dos procesos
 *  solo se serializan entre sí si piden exactamente la misma clave. */
const LOCK_CUPO = 30_2026;

export type ValoresInscripcion = {
  codigo: string;
  nombreApellido: string;
  dni: string;
  fechaNacimiento: string;
  email: string;
  ciudad: string;
  provincia: string;
  interes: string | null;
  consentimientoAt: Date;
};

/**
 * Guarda una inscripción solo si todavía queda cupo. Devuelve `false` si el
 * evento ya está lleno; los errores de base (DNI repetido, choque de código)
 * siguen saliendo como excepción para que los maneje quien llama.
 *
 * **Por qué una transacción con lock y no un `SELECT COUNT(*)` seguido de un
 * `INSERT`:** entre esas dos consultas hay una ventana en la que otro pedido
 * puede insertar. Con dos personas enviando el formulario a la vez —lo
 * esperable apenas se difunde la convocatoria— las dos leen 299 y quedan 301
 * inscriptos. No es un caso teórico: es exactamente lo que pasa cuando el
 * cupo está por agotarse, que es cuando el límite importa.
 *
 * `pg_advisory_xact_lock` serializa a todos los que estén intentando
 * anotarse: el segundo espera a que el primero termine y recién ahí cuenta.
 * El lock se libera solo al cerrar la transacción (COMMIT o ROLLBACK), así
 * que no puede quedar tomado si algo falla en el medio.
 *
 * El conteo va DENTRO del propio INSERT (`WHERE (SELECT COUNT(*)...) < $10`)
 * y no en una consulta aparte, así no hay dos números que puedan diferir.
 * `rowCount === 0` significa "no entró porque no había lugar".
 */
export async function insertarInscripcionSiHayCupo(
  v: ValoresInscripcion,
  cupo: number,
): Promise<boolean> {
  const pool = getPool();
  // `connect()` y no `pool.query()`: una transacción necesita que todas las
  // sentencias vayan por la MISMA conexión, y el pool puede repartir cada
  // query a una distinta.
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [LOCK_CUPO]);

    // Casts explícitos: en un `INSERT ... SELECT` Postgres no siempre infiere
    // el tipo de los parámetros desde las columnas destino, y `interes` puede
    // llegar en null, que sin cast falla con "could not determine data type".
    const res = await client.query(
      `INSERT INTO inscripciones
         (codigo_reserva, nombre_apellido, dni, fecha_nacimiento, email,
          ciudad, provincia, interes, consentimiento, consentimiento_at)
       SELECT $1::text, $2::text, $3::text, $4::date, $5::text,
              $6::text, $7::text, $8::text, true, $9::timestamptz
       WHERE (SELECT COUNT(*) FROM inscripciones) < $10::int`,
      [
        v.codigo,
        v.nombreApellido,
        v.dni,
        v.fechaNacimiento,
        v.email,
        v.ciudad,
        v.provincia,
        v.interes,
        v.consentimientoAt,
        cupo,
      ],
    );

    if (res.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // El ROLLBACK puede fallar si la conexión ya se cortó; que eso no tape
    // el error real, que es el que quien llama necesita ver.
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
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
  asistio: boolean;
  asistio_en: string | null;
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
       asistio,
       to_char(asistio_at AT TIME ZONE 'America/Argentina/Ushuaia', 'DD/MM/YYYY HH24:MI') AS asistio_en,
       to_char(created_at AT TIME ZONE 'America/Argentina/Ushuaia', 'DD/MM/YYYY HH24:MI') AS creado
     FROM inscripciones
     ORDER BY created_at DESC`,
  );
  return rows;
}

/** Marca o desmarca la asistencia de un inscripto por su código de reserva.
 *  Devuelve la fila actualizada, o `null` si el código no existe — el panel
 *  lo usa para avisar "código no encontrado" en vez de fallar en silencio.
 *
 *  Recibe el valor deseado en vez de invertir el actual (`NOT asistio`): con
 *  dos personas acreditando en la puerta desde dos celulares, la lista de
 *  cada una puede estar desactualizada, y un toggle ciego hace que el
 *  segundo toque de "Marcar" DESMARQUE a alguien que ya entró. Con el valor
 *  explícito, marcar dos veces deja el mismo resultado. */
export async function fijarAsistencia(
  codigo: string,
  asistio: boolean,
): Promise<{ nombre_apellido: string; asistio: boolean } | null> {
  const pool = getPool();
  const { rows } = await pool.query<{ nombre_apellido: string; asistio: boolean }>(
    `UPDATE inscripciones
       SET asistio = $2,
           -- Solo se pisa la marca de tiempo si el estado cambia: si alguien
           -- vuelve a tocar "Marcar" sobre un asistente ya acreditado, se
           -- conserva la hora del ingreso real.
           asistio_at = CASE
             WHEN $2 AND NOT asistio THEN now()
             WHEN NOT $2 THEN NULL
             ELSE asistio_at
           END
     WHERE codigo_reserva = $1
     RETURNING nombre_apellido, asistio`,
    [codigo, asistio],
  );
  return rows[0] ?? null;
}
