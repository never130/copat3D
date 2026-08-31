/**
 * Acentos de tarjeta, compartidos por las tarjetas de eje y las de
 * convocatoria.
 *
 * `borde`, `glow` y `luz` no son clases sino COLORES: se inyectan como custom
 * properties. Dos motivos, los mismos por los que nacieron en `Ejes.tsx`:
 * Tailwind no puede generar una utilidad por cada mezcla, y sobre todo hacen
 * falta en DOS estados —el hover del escritorio y el estado por defecto en
 * táctil, donde no hay hover posible—. Como clase de Tailwind solo servirían
 * para uno de los dos.
 *
 * `text` y `bg` SÍ son clases, y van escritas completas: Tailwind escanea el
 * código como texto plano, así que una clase armada por interpolación
 * (`text-${nombre}`) nunca aparecería en el CSS final.
 *
 * `text` se usa sobre elementos DECORATIVOS (el número gigante de fondo, al
 * 7% de opacidad). Para texto real usá `text-accent-text`, el token con
 * contraste garantizado en los dos modos: los acentos de marca son pasteles y
 * sobre fondo claro no llegan al mínimo legible (trampas 8 y 16).
 */
export type Acento =
  | "copat-coral"
  | "copat-sky"
  | "copat-yellow"
  | "copat-green"
  | "copat-lilac";

/** Las tres mezclas de color, que sí viajan como valores y no como clases. */
function mezclas(nombre: Acento) {
  return {
    borde: `color-mix(in srgb, var(--color-${nombre}) 45%, transparent)`,
    glow: `color-mix(in srgb, var(--color-${nombre}) 26%, var(--paper-shadow))`,
    luz: `color-mix(in srgb, var(--color-${nombre}) 15%, transparent)`,
  };
}

export const ACENTOS = {
  "copat-coral": {
    text: "text-copat-coral",
    bg: "bg-copat-coral",
    ...mezclas("copat-coral"),
  },
  "copat-sky": {
    text: "text-copat-sky",
    bg: "bg-copat-sky",
    ...mezclas("copat-sky"),
  },
  "copat-yellow": {
    text: "text-copat-yellow",
    bg: "bg-copat-yellow",
    ...mezclas("copat-yellow"),
  },
  "copat-green": {
    text: "text-copat-green",
    bg: "bg-copat-green",
    ...mezclas("copat-green"),
  },
  "copat-lilac": {
    text: "text-copat-lilac",
    bg: "bg-copat-lilac",
    ...mezclas("copat-lilac"),
  },
} as const satisfies Record<
  Acento,
  { text: string; bg: string; borde: string; glow: string; luz: string }
>;
