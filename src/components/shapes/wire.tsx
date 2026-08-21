/**
 * Figuras wireframe — versión de contorno de los sólidos de la marca.
 *
 * No son las figuras rellenas sin relleno: un wireframe real muestra también
 * las **aristas ocultas** (acá punteadas), que es exactamente lo que le da la
 * lectura de plano CAD / modelado 3D. Las figuras rellenas solo tienen las
 * caras visibles, así que necesitan geometría propia.
 *
 * No tienen movimiento continuo, a propósito: viven al costado del contenido
 * mientras se lee, y algo que se mueve ahí distrae. Las que flotan sin parar
 * son las del hero.
 *
 * Sí se **dibujan una vez** al entrar en pantalla, con el trazo avanzando como
 * el cabezal de una impresora —la metáfora de la marca—. Es un gesto de una
 * sola vía: termina y queda quieto, así que no compite con la lectura. El
 * disparador es el mismo `.sheet-in` del pase de hojas.
 *
 * Usan `currentColor`, así que el color se controla desde el padre con
 * utilidades `text-*`.
 */

export type WireTono =
  | "coral"
  | "sky"
  | "yellow"
  | "green"
  | "lilac"
  /** Sobre el magenta del hero, donde los acentos no contrastan. */
  | "blanco"
  /** Marca de agua: puede quedar detrás de texto sin comprometer la lectura. */
  | "filigrana";

/**
 * Color de trazo según el modo.
 *
 * Los acentos de la marca son pasteles claros: sobre `--bg` oscuro al 25% se
 * leen bien, pero sobre el fondo claro quedan prácticamente invisibles. En
 * modo claro se usa el tono profundo de cada color y bastante más opacidad.
 *
 * Va acá y no en cada llamada: son 13 usos repartidos en cuatro archivos, y
 * repetir el par `dark:` en cada uno garantiza que tarde o temprano alguno
 * quede desactualizado.
 */
const TONOS: Record<WireTono, string> = {
  coral: "text-copat-coral-deep/55 dark:text-copat-coral/32",
  sky: "text-copat-sky-deep/55 dark:text-copat-sky/25",
  yellow: "text-copat-yellow-deep/55 dark:text-copat-yellow/25",
  green: "text-copat-green-deep/55 dark:text-copat-green/25",
  lilac: "text-copat-lilac-deep/55 dark:text-copat-lilac/32",
  blanco: "text-white/30",
  filigrana: "text-white/[0.10]",
};

type WireProps = {
  size?: number;
  className?: string;
  tono?: WireTono;
};

/** Compone el color del tono con las clases de posición del llamador. */
const cls = (tono: WireTono, className?: string) =>
  `${TONOS[tono]}${className ? ` ${className}` : ""}`;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

/** Trazo de aristas ocultas: punteado y más tenue. */
const oculta = { strokeDasharray: "3 4", opacity: 0.5 };

/** Cubo isométrico — la figura más legible como wireframe. */
export function WireCube({ tono = "sky", size = 120, className }: WireProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cls(tono, className)}
      aria-hidden="true"
      {...base}
    >
      {/* Cara superior */}
      <path d="M50 12 L86 33 L50 54 L14 33 Z" />
      {/* Aristas verticales visibles */}
      <path d="M86 33 V67 M50 54 V88 M14 33 V67" />
      {/* Base visible */}
      <path d="M14 67 L50 88 L86 67" />
      {/* Vértice trasero y sus aristas: lo que hace que se lea como wireframe */}
      <path d="M50 12 V46 M50 46 L86 67 M50 46 L14 67" {...oculta} />
    </svg>
  );
}

/** Icosaedro — la figura protagonista del afiche, en contorno. */
export function WireIcosahedron({ tono = "coral", size = 130, className }: WireProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={cls(tono, className)}
      aria-hidden="true"
      {...base}
    >
      {/* Silueta hexagonal */}
      <path d="M60 8 L105 34 L105 86 L60 112 L15 86 L15 34 Z" />
      {/* Cara central */}
      <path d="M60 40 L78 72 L42 72 Z" />
      {/* Triangulación visible: de cada vértice exterior al interior */}
      <path d="M60 8 L60 40 M105 34 L60 40 M105 34 L78 72 M105 86 L78 72 M60 112 L78 72 M60 112 L42 72 M15 86 L42 72 M15 34 L42 72 M15 34 L60 40" />
    </svg>
  );
}

/** Pirámide de base cuadrada en perspectiva. */
export function WirePyramid({ tono = "yellow", size = 110, className }: WireProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cls(tono, className)}
      aria-hidden="true"
      {...base}
    >
      {/* Silueta y arista frontal */}
      <path d="M50 10 L12 66 L50 86 L88 66 Z" />
      <path d="M50 10 L50 86" />
      {/* Vértice trasero de la base */}
      <path d="M50 10 L50 46 M12 66 L50 46 M88 66 L50 46" {...oculta} />
    </svg>
  );
}

/** Cruz extruida — el signo "+" del afiche, con profundidad. */
export function WirePlus({ tono = "lilac", size = 100, className }: WireProps) {
  const pts =
    "39,14 61,14 61,39 86,39 86,61 61,61 61,86 39,86 39,61 14,61 14,39 39,39";
  return (
    <svg
      viewBox="0 0 106 108"
      width={size}
      height={(size * 108) / 106}
      className={cls(tono, className)}
      aria-hidden="true"
      {...base}
    >
      <polygon points={pts} />
      {/* Cara trasera desplazada */}
      <polygon points={pts} transform="translate(9,11)" {...oculta} />
      {/* Aristas que unen ambas caras por la silueta visible */}
      <path d="M61 14 L70 25 M86 39 L95 50 M86 61 L95 72 M61 86 L70 97 M39 86 L48 97 M14 61 L23 72" />
    </svg>
  );
}

/** Octaedro — bipirámide, la silueta de rombo. */
export function WireOctahedron({ tono = "lilac", size = 115, className }: WireProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cls(tono, className)}
      aria-hidden="true"
      {...base}
    >
      {/* Silueta */}
      <path d="M50 6 L90 50 L50 94 L10 50 Z" />
      {/* Vértice frontal del ecuador */}
      <path d="M50 6 L50 64 M50 94 L50 64 M10 50 L50 64 M90 50 L50 64" />
      {/* Vértice trasero */}
      <path d="M50 6 L50 36 M50 94 L50 36 M10 50 L50 36 M90 50 L50 36" {...oculta} />
    </svg>
  );
}

/** Prisma triangular — la extrusión más reconocible de un plano CAD. */
export function WirePrism({ tono = "green", size = 115, className }: WireProps) {
  return (
    <svg
      viewBox="0 0 105 85"
      width={size}
      height={(size * 85) / 105}
      className={cls(tono, className)}
      aria-hidden="true"
      {...base}
    >
      {/* Cara frontal */}
      <path d="M20 74 L50 24 L80 74 Z" />
      {/* Aristas visibles hacia atrás */}
      <path d="M50 24 L62 10 M80 74 L92 60 M62 10 L92 60" />
      {/* Vértice trasero inferior izquierdo y sus aristas */}
      <path d="M20 74 L32 60 M32 60 L62 10 M32 60 L92 60" {...oculta} />
    </svg>
  );
}

/**
 * Contenedor de figuras wireframe en los márgenes de una sección.
 *
 * La sección padre tiene que ser `relative`. Las piezas se posicionan con
 * offsets negativos (`-left-*` / `-right-*`) para quedar FUERA de la caja del
 * contenido: así solo asoman cuando el viewport es más ancho que el
 * `max-w-7xl`, y en pantallas chicas quedan fuera de pantalla solas, sin
 * necesidad de breakpoints ni riesgo de taparle el texto a nadie.
 *
 * El ancestro necesita `overflow-x: clip` para que no generen scroll
 * horizontal (lo tiene `.paper-page`). `clip` y no `hidden`: `hidden` crearía
 * un contenedor de scroll y rompería el `sticky` del hero.
 */
export function WireMargins({
  children,
  className = "",
}: {
  children: React.ReactNode;
  /** Para separar las piezas de escritorio de las de mobile. */
  className?: string;
}) {
  return (
    // data-wire: marca el contenedor para poder auditarlo desde Playwright
    // (que no se solape con texto ni genere scroll horizontal).
    <div
      data-wire
      className={`wire-dibujo pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
