/**
 * Isotipo COPAT 3D.
 *
 * Anillos concéntricos poligonales partidos por el eje vertical, con las dos
 * mitades **desfasadas media separación de anillo**. Ese escalón en la costura
 * es la lectura "capa a capa": una pieza cortada al medio donde se ven las
 * capas de impresión desplazadas.
 *
 * La geometría se genera, no se dibuja a mano: así lados, radios y desfase se
 * ajustan cambiando una constante en vez de reescribir 40 coordenadas.
 */

const LADOS = 10;
const CENTRO = 50;
/** Radios de los anillos, de afuera hacia adentro. */
const ANILLOS = [45, 33.5, 22];
/** Radio del núcleo relleno. */
const NUCLEO = 10.5;
/** Desplazamiento vertical de la mitad derecha: media separación de anillo. */
const DESFASE = 5.5;
/** Trazo apenas menor que la mitad de la separación entre anillos: a 36px del
 *  navbar, con el trazo más grueso el anillo interno y el núcleo se empastan
 *  en un solo bulto. */
const TRAZO = 5;

/** Puntos de un polígono regular. `giro` en grados; -108° deja un lado plano arriba. */
function poligono(radio: number, cy = CENTRO, giro = -108) {
  return Array.from({ length: LADOS }, (_, i) => {
    const a = ((giro + (360 / LADOS) * i) * Math.PI) / 180;
    return `${(CENTRO + radio * Math.cos(a)).toFixed(2)},${(cy + radio * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

function Mitad({ cy }: { cy: number }) {
  return (
    <>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={TRAZO}
        strokeLinejoin="round"
      >
        {ANILLOS.map((r) => (
          <polygon key={r} points={poligono(r, cy)} />
        ))}
      </g>
      <polygon points={poligono(NUCLEO, cy)} fill="currentColor" />
    </>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        {/* Mitades exactas: el corte va justo en el eje, sin separación, para
            que el escalón del desfase sea el único quiebre visible. */}
        <clipPath id="copat-izq">
          <rect x="0" y="0" width={CENTRO} height="100" />
        </clipPath>
        <clipPath id="copat-der">
          <rect x={CENTRO} y="0" width={CENTRO} height="100" />
        </clipPath>
      </defs>

      <g clipPath="url(#copat-izq)">
        <Mitad cy={CENTRO - DESFASE / 2} />
      </g>
      <g clipPath="url(#copat-der)">
        <Mitad cy={CENTRO + DESFASE / 2} />
      </g>
    </svg>
  );
}
