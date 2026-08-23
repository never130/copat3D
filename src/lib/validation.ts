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

/* ============================================================
   REGISTRO DE INSCRIPCIÓN
   Ver docs/03-arquitectura.md (modelo de datos) y docs/04-datos-y-legales.md
   (por qué estos campos exactos). DNI y fecha de nacimiento COMPLETA son
   decisión de gestión, no la recomendación técnica original — ver AGENTS.md,
   sección "Ya decidido".
   ============================================================ */

export const LIMITES_REGISTRO = {
  nombreApellido: 100,
  email: 120,
  ciudad: 80,
} as const;

/** Provincias argentinas (23 + CABA), orden alfabético. Único lugar donde
 *  vive la lista: el <select> del formulario la recorre, no la copia. */
export const PROVINCIAS = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Ciudad Autónoma de Buenos Aires",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  "Tucumán",
] as const;

/** Edad mínima para inscribirse por cuenta propia. La política real para
 *  menores (D5, aún abierta — ver docs/04) puede reemplazar este bloqueo
 *  por un flujo institucional; hasta entonces, no se guarda en la base un
 *  registro cuyo consentimiento no sería legalmente válido. */
export const EDAD_MINIMA = 18;

/**
 * ⚠️ `new Date("2008-08-22")` parsea la fecha como medianoche **UTC**, pero
 * `.getDate()`/`.getMonth()`/`.getFullYear()` la leen de vuelta en el huso
 * horario **local** del servidor. En Argentina (UTC−3, el huso de este
 * mismo proyecto) esa medianoche UTC cae a las 21hs del día anterior en
 * hora local: `new Date("2008-08-22").getDate()` devuelve **21**, no 22.
 *
 * El efecto es correr el cumpleaños un día para atrás — alguien que cumple
 * 18 el 22 de agosto queda calculado como ya mayor el 21. Como esta función
 * es el único freno para no guardar el consentimiento de un menor (Ley
 * 25.326, D5 en docs/04-datos-y-legales.md), el bug dejaba pasar a alguien
 * de 17 años un día antes de tiempo.
 *
 * Por eso el nacimiento se separa a mano en año/mes/día desde el string
 * ISO, sin pasar nunca por `Date` para leerlo: así no hay huso horario que
 * lo corra. Para "hoy" sí alcanza con el reloj local del servidor — no hace
 * falta exactitud al segundo, solo saber si ya pasó el cumpleaños en el día
 * de hoy.
 */
export function calcularEdad(fechaISO: string): number {
  const [anioNac, mesNac, diaNac] = fechaISO.split("-").map(Number);
  const hoy = new Date();
  const mesHoy = hoy.getMonth() + 1; // getMonth() es 0-indexado; mesNac no.

  let edad = hoy.getFullYear() - anioNac;
  if (mesHoy < mesNac || (mesHoy === mesNac && hoy.getDate() < diaNac)) {
    edad--;
  }
  return edad;
}

export const esquemaRegistro = z.object({
  nombreApellido: z
    .string()
    .trim()
    .min(3, "Escribí tu nombre completo.")
    .max(
      LIMITES_REGISTRO.nombreApellido,
      `Máximo ${LIMITES_REGISTRO.nombreApellido} caracteres.`,
    ),

  // Se aceptan puntos y espacios (como la gente lo escribe a mano) y se
  // limpian antes de validar el largo real. 6 dígitos cubre DNI viejos;
  // 8 es el largo actual.
  dni: z
    .string()
    .trim()
    .transform((valor) => valor.replace(/[.\s]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{6,8}$/, "El DNI va sin puntos, solo los números."),
    ),

  fechaNacimiento: z.iso
    .date("Ingresá una fecha válida.")
    .refine((valor) => new Date(valor) <= new Date(), {
      message: "La fecha no puede ser futura.",
    })
    .refine(
      (valor) => new Date(valor).getFullYear() >= new Date().getFullYear() - 110,
      { message: "Revisá el año: parece un error de tipeo." },
    ),

  email: z
    .string()
    .trim()
    .min(1, "Escribí tu correo.")
    .max(LIMITES_REGISTRO.email, `Máximo ${LIMITES_REGISTRO.email} caracteres.`)
    .pipe(z.email("Revisá el correo: parece que falta algo.")),

  ciudad: z
    .string()
    .trim()
    .min(2, "Escribí tu ciudad.")
    .max(LIMITES_REGISTRO.ciudad, `Máximo ${LIMITES_REGISTRO.ciudad} caracteres.`),

  provincia: z.enum(PROVINCIAS, "Seleccioná tu provincia."),

  /** Opcional: no todos llegan sabiendo qué eje les interesa más. Sin
   *  validación estricta contra los ids de `src/content/ejes.ts` porque el
   *  propio <select> ya limita las opciones; acá solo hay un techo de largo
   *  por las dudas de un POST armado a mano. */
  interes: z
    .string()
    .max(40)
    .optional()
    .transform((valor) => (valor ? valor : undefined)),

  /** El checkbox llega como `"on"` cuando está tildado, o ausente cuando no.
   *  El texto real (validado por legales) todavía no existe — ver D3 en
   *  docs/04 — así que lo que se pinta en el formulario es un borrador. Lo
   *  que se guarda no es el texto, es que la persona lo tildó y cuándo. */
  // `.nullish()` y no `.optional()`: un checkbox sin tildar no manda el
  // campo, y `FormData.get()` devuelve `null` para una clave ausente, no
  // `undefined`. `.optional()` solo cubre `undefined` — con `null` el error
  // era el genérico de Zod ("expected string, received null") en vez del
  // mensaje pensado para esto.
  consentimiento: z
    .string()
    .nullish()
    .refine(
      (valor) => valor === "on",
      "Tenés que aceptar el tratamiento de tus datos para continuar.",
    ),

  // Mismo honeypot que el formulario de contacto — ver el comentario ahí.
  sitioWeb: z.string().optional(),
});

export type DatosRegistro = z.infer<typeof esquemaRegistro>;
