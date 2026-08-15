/**
 * Figuras 3D del sistema visual COPAT 3D.
 *
 * Implementadas como SVG facetado (no WebGL): el arte original ya es un
 * render de caras planas, así que tres tonos por figura reproducen la misma
 * lectura a ~2 KB en lugar de ~600 KB de runtime 3D.
 * Ver docs/02-design-system.md
 */

type Tones = { light: string; base: string; dark: string };

const TONES = {
  coral: { light: "#F2A79E", base: "#E8897F", dark: "#C96A61" },
  yellow: { light: "#FFD75E", base: "#FFC629", dark: "#E0A400" },
  green: { light: "#9AD46A", base: "#7DC142", dark: "#5D9A2C" },
  lilac: { light: "#C99BF0", base: "#B57BE8", dark: "#9358CC" },
  sky: { light: "#93CDEE", base: "#6FB9E4", dark: "#4E97C4" },
} satisfies Record<string, Tones>;

export type ShapeColor = keyof typeof TONES;

type ShapeProps = {
  color?: ShapeColor;
  className?: string;
  size?: number;
};

/** Icosaedro facetado — la figura protagonista del arte original. */
export function Icosahedron({ color = "coral", className, size = 120 }: ShapeProps) {
  const t = TONES[color];
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Anillo exterior de caras */}
      <polygon points="60,8 105,34 60,40" fill={t.light} />
      <polygon points="105,34 105,86 78,72 60,40" fill={t.base} />
      <polygon points="105,86 60,112 78,72" fill={t.dark} />
      <polygon points="60,112 15,86 42,72 78,72" fill={t.dark} />
      <polygon points="15,86 15,34 60,40 42,72" fill={t.base} />
      <polygon points="15,34 60,8 60,40" fill={t.light} />
      {/* Cara central */}
      <polygon points="60,40 78,72 42,72" fill={t.light} opacity="0.9" />
    </svg>
  );
}

/** Zigzag extruido — cinta plegada. */
export function Zigzag({ color = "yellow", className, size = 110 }: ShapeProps) {
  const t = TONES[color];
  const d = "M10 48 L32 20 L54 48 L76 20 L98 48";
  return (
    <svg
      viewBox="0 0 108 76"
      width={size}
      height={(size * 76) / 108}
      className={className}
      aria-hidden="true"
    >
      {/* Cara lateral (extrusión) */}
      <path
        d={d}
        stroke={t.dark}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        transform="translate(3,7)"
      />
      {/* Cara frontal */}
      <path
        d={d}
        stroke={t.base}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Brillo superior */}
      <path
        d={d}
        stroke={t.light}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.75"
        transform="translate(-1.5,-4)"
      />
    </svg>
  );
}

/** Cruz / signo "+" tridimensional. */
export function Plus({ color = "lilac", className, size = 90 }: ShapeProps) {
  const t = TONES[color];
  const pts =
    "39,14 61,14 61,39 86,39 86,61 61,61 61,86 39,86 39,61 14,61 14,39 39,39";
  return (
    <svg
      viewBox="0 0 104 104"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <polygon points={pts} fill={t.dark} transform="translate(8,10)" />
      <polygon points={pts} fill={t.base} />
      <polygon
        points="39,14 61,14 61,39 86,39 86,49 51,49 51,14"
        fill={t.light}
        opacity="0.65"
      />
    </svg>
  );
}

/** Pirámide / tetraedro con dos caras visibles. */
export function Pyramid({ color = "sky", className, size = 100 }: ShapeProps) {
  const t = TONES[color];
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <polygon points="50,8 8,70 50,90" fill={t.light} />
      <polygon points="50,8 92,70 50,90" fill={t.base} />
      <polygon points="8,70 50,90 92,70" fill={t.dark} opacity="0.55" />
    </svg>
  );
}

/** Trípode "Y" — pieza mecánica de tres brazos a 120°. */
export function Tripod({ color = "yellow", className, size = 100 }: ShapeProps) {
  const t = TONES[color];
  const d = "M50 50 L50 12 M50 50 L83 69 M50 50 L17 69";
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d={d}
        stroke={t.dark}
        strokeWidth="19"
        strokeLinecap="round"
        fill="none"
        transform="translate(3,7)"
      />
      <path
        d={d}
        stroke={t.base}
        strokeWidth="19"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="50" cy="50" r="7" fill={t.light} opacity="0.8" />
    </svg>
  );
}

/* ============================================================
   Elementos gráficos lineales (blancos) del arte original.
   Decorativos: nunca deben quedar detrás de texto.
   ============================================================ */

export function DotGrid({
  className,
  cols = 5,
  rows = 5,
}: {
  className?: string;
  cols?: number;
  rows?: number;
}) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={6 + c * 12} cy={6 + r * 12} r="2.5" />
        )),
      )}
    </svg>
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 16" className={className} aria-hidden="true">
      <path
        d="M2 8 Q 9 1, 16 8 T 30 8 T 44 8 T 58 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Arc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 34" className={className} aria-hidden="true">
      <path
        d="M4 30 A 26 26 0 0 1 56 30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Brace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 60" className={className} aria-hidden="true">
      <path
        d="M14 2 C 6 2, 12 26, 4 30 C 12 34, 6 58, 14 58"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Cross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3 V21 M3 12 H21"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TriangleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 20" className={className} aria-hidden="true">
      <path
        d="M12 17 L3 3 H21 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
