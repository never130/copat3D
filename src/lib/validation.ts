import { z } from "zod";

/**
 * Esquemas de validación de formularios.
 *
 * Viven acá y no dentro de cada Server Action porque el mismo esquema se usa
 * en los dos lados: el cliente lo consulta para mostrar el error antes de
 * enviar, y el servidor lo vuelve a correr sobre lo que realmente llegó.
 * La validación del cliente es comodidad; **la que cuenta es la del servidor**,
 * porque un POST se puede armar a mano.
 */

/** Límites de longitud. Explícitos para que el `maxLength` del input y el
 *  del esquema no se separen con el tiempo. */
export const LIMITES = {
  nombre: 80,
  email: 120,
  asunto: 120,
  mensaje: 2000,
} as const;

export const esquemaContacto = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Escribí tu nombre.")
    .max(LIMITES.nombre, `Máximo ${LIMITES.nombre} caracteres.`),

  email: z
    .string()
    .trim()
    .min(1, "Escribí tu correo.")
    .max(LIMITES.email, `Máximo ${LIMITES.email} caracteres.`)
    .pipe(z.email("Revisá el correo: parece que falta algo.")),

  asunto: z
    .string()
    .trim()
    .min(3, "Contanos brevemente de qué se trata.")
    .max(LIMITES.asunto, `Máximo ${LIMITES.asunto} caracteres.`),

  mensaje: z
    .string()
    .trim()
    .min(10, "Un poco más de detalle nos ayuda a responderte mejor.")
    .max(LIMITES.mensaje, `Máximo ${LIMITES.mensaje} caracteres.`),

  /**
   * Trampa para bots ("honeypot"). Es un campo oculto para las personas: si
   * viene con algo, lo llenó un script que completa todos los inputs del DOM.
   * Es la defensa antispam más barata que existe y no le pide nada al
   * visitante — a diferencia de un captcha, que además es una carga de
   * accesibilidad y manda datos a un tercero.
   *
   * **Acá NO se valida que venga vacío**, aunque sea lo tentador. Si el
   * esquema lo rechazara, la respuesta sería "revisá los datos": le estaríamos
   * avisando al bot que existe la trampa, y la próxima vuelve sin llenarla.
   * El campo se deja pasar y lo decide la acción, que finge que salió bien.
   */
  sitioWeb: z.string().optional(),
});

export type DatosContacto = z.infer<typeof esquemaContacto>;

/** Aplana los errores de Zod a `{ campo: "primer mensaje" }`, que es lo que
 *  el formulario necesita para pintar cada input. */
export function erroresPorCampo(
  error: z.ZodError,
): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const problema of error.issues) {
    const campo = String(problema.path[0] ?? "");
    if (campo && !salida[campo]) salida[campo] = problema.message;
  }
  return salida;
}
