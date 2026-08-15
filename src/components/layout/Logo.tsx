/**
 * Isotipo COPAT 3D: anillos concéntricos partidos al medio.
 * La mitad derecha es más pesada — la lectura "capa a capa" del slogan.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <clipPath id="copat-left">
          <rect x="0" y="0" width="30" height="64" />
        </clipPath>
        <clipPath id="copat-right">
          <rect x="34" y="0" width="30" height="64" />
        </clipPath>
      </defs>

      <g fill="none" stroke="currentColor" strokeWidth="3" clipPath="url(#copat-left)">
        <circle cx="32" cy="32" r="29" />
        <circle cx="32" cy="32" r="21" />
        <circle cx="32" cy="32" r="13" />
        <circle cx="32" cy="32" r="5" />
      </g>

      <g fill="none" stroke="currentColor" strokeWidth="6" clipPath="url(#copat-right)">
        <circle cx="32" cy="32" r="29" />
        <circle cx="32" cy="32" r="17" />
        <circle cx="32" cy="32" r="5" />
      </g>

      <rect x="29.5" y="2" width="5" height="60" fill="currentColor" />
    </svg>
  );
}
