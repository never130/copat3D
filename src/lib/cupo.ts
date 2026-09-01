import { getPool } from "@/lib/db";

/**
 * Cupo de la inscripción individual al congreso.
 *
 * Arranca en 300 con la idea de ampliarlo a 500 según cómo venga la demanda
 * (decisión de gestión, 31/8/2026), así que el número vive en una variable de
 * entorno: subirlo tiene que ser un cambio de configuración en Vercel, no un
 * commit.
 */

/** Valor si la variable no está definida, vacía o mal escrita. */
const CUPO_POR_DEFECTO = 300;

/**
 * Lee `REGISTRO_CUPO` con la guarda de la trampa 3 de AGENTS.md: la variable
 * puede llegar como **cadena vacía** —campo vacío en el panel de Vercel, o un
 * ARG de Docker sin valor—, y `Number("")` es **0**, no NaN. Sin este control,
 * una variable vacía dejaría el cupo en cero y rechazaría a todo el mundo con
 * "agotado" sin que nadie entienda por qué.
 *
 * Solo se acepta un entero positivo; cualquier otra cosa cae al valor por
 * defecto, que es el lado seguro (el evento se hace igual con 300).
 *
 * No es `NEXT_PUBLIC_`: el navegador no necesita saber el número, y la única
 * comprobación que manda es la del servidor.
 */
export function cupoTotal(): number {
  const n = Number(process.env.REGISTRO_CUPO);
  return Number.isInteger(n) && n > 0 ? n : CUPO_POR_DEFECTO;
}

/**
 * A partir de cuántos lugares libres se avisa en la página.
 *
 * Antes de ese umbral no se muestra nada: con 12 inscriptos sobre 300, poner
 * "quedan 288 lugares" comunica que el evento está vacío y desalienta, que es
 * lo contrario de lo que se busca.
 */
export const UMBRAL_AVISO = 50;

export type EstadoCupo = {
  total: number;
  ocupados: number;
  disponibles: number;
  agotado: boolean;
  /** Si conviene mostrar el contador: solo cuando ya queda poco. */
  avisar: boolean;
};

/**
 * Estado del cupo para la UI.
 *
 * Es solo informativo: quien decide de verdad si entra una inscripción más es
 * el `INSERT` condicional de `registrarInscripcion`, que corre serializado. Lo
 * que se muestre acá puede estar unos segundos desactualizado sin consecuencia
 * —a lo sumo alguien completa el formulario y recibe el aviso de agotado—,
 * mientras que confiar en este número para guardar sí permitiría pasarse.
 */
export async function estadoCupo(): Promise<EstadoCupo> {
  const total = cupoTotal();
  const pool = getPool();
  const { rows } = await pool.query<{ n: string }>(
    "SELECT COUNT(*)::int AS n FROM inscripciones",
  );

  // `COUNT(*)::int` ya vuelve como número, pero el driver tipa los enteros
  // grandes como string: el Number() cubre los dos casos.
  const ocupados = Number(rows[0]?.n ?? 0);
  const disponibles = Math.max(total - ocupados, 0);

  return {
    total,
    ocupados,
    disponibles,
    agotado: disponibles === 0,
    avisar: disponibles > 0 && disponibles <= UMBRAL_AVISO,
  };
}
