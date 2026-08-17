import {
  Arc,
  Brace,
  Cross,
  DotGrid,
  Icosahedron,
  Plus,
  Pyramid,
  Squiggle,
  TriangleMark,
  Tripod,
  Zigzag,
} from "./index";
import { WireIcosahedron } from "./wire";

/**
 * Campo de figuras del hero.
 *
 * Tres planos de profundidad (back / mid / front) que se desplazan a distinta
 * velocidad con el scroll vía animation-timeline: scroll(). Sin listeners de JS.
 * Cada figura tiene un periodo primo respecto de las demás para que el conjunto
 * nunca se sincronice.
 *
 * Oculto por completo bajo `sm` (`hidden sm:block`), a propósito.
 *
 * Las posiciones están en porcentaje, pensadas para una columna de texto
 * angosta contra un viewport ancho. En mobile el texto ocupa casi todo el
 * ancho y el alto del bloque cambia según si los chips hacen wrap o el
 * texto es más largo (localización, contenido real de sponsors, etc.):
 * cualquier posición fija eventualmente vuelve a caer encima de algo. No
 * hay combinación de porcentajes que quede a salvo de forma confiable, así
 * que en vez de perseguir huecos seguros se saca el ruido entero y el
 * degradé + grano cargan el peso visual del hero en pantallas chicas.
 */
export function ShapeField() {
  return (
    <>
      <MobileWire />
      <DesktopShapes />
    </>
  );
}

/**
 * Capa móvil: wireframes en lugar de figuras rellenas.
 *
 * En un teléfono el contenido del hero ocupa casi toda la pantalla (522px de
 * 667), así que no queda hueco libre. Un contorno sí puede convivir con el
 * texto, así que va UNA sola pieza grande como marca de agua al 10% detrás
 * del título: se lee como textura, no como un objeto que estorba.
 *
 * Hubo también un par de figuras sangrando por los bordes laterales y se
 * quitaron: en 320-375px no hay forma de que despeguen del texto sin quedar
 * reducidas a un filo de 16px, que se lee como un artefacto de render. Es la
 * trampa 13 de AGENTS.md — perseguir huecos seguros acá no es confiable.
 */
function MobileWire() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden sm:hidden"
      aria-hidden="true"
    >
      <WireIcosahedron
        tono="filigrana"
        size={300}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%]"
      />
    </div>
  );
}

function DesktopShapes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
      aria-hidden="true"
    >
      {/* ---------- Plano de fondo ----------
          Sin opacidad reducida: atenuar la figura la mezcla con el fondo, y
          el fondo cambia entre modos. Al 50% el zigzag verde tiraba a marrón
          sobre el magenta y a oliva sobre el negro — dos colores distintos
          para la misma pieza. En el arte oficial todas van a color pleno en
          ambos modos; la profundidad la dan el tamaño y la velocidad de
          parallax, que no dependen del fondo. */}
      <div className="plane-back absolute inset-0">
        <Pyramid
          color="sky"
          size={62}
          className="anim-tumble absolute top-[14%] right-[8%]"
        />
        <Zigzag
          color="green"
          size={70}
          className="anim-sway-reverse absolute top-[9%] left-[22%]"
        />
        <div className="absolute top-[6%] right-[26%] text-white/85">
          <Squiggle className="w-14" />
        </div>
        <div className="absolute bottom-[16%] left-[6%] w-14 text-white/80">
          <DotGrid className="w-full" />
        </div>
      </div>

      {/* ---------- Plano medio ---------- */}
      <div className="plane-mid absolute inset-0">
        <Zigzag
          color="yellow"
          size={104}
          className="anim-sway absolute top-[11%] left-[6%]"
        />
        <Plus
          color="lilac"
          size={74}
          className="anim-float-spin absolute top-[13%] right-[19%]"
        />
        <Plus
          color="lilac"
          size={88}
          className="anim-bob absolute bottom-[22%] left-[14%]"
        />
        <Zigzag
          color="green"
          size={92}
          className="anim-sway-reverse absolute right-[16%] bottom-[18%]"
        />
        <div className="absolute top-[38%] left-[3%] w-5 text-white/85">
          <Brace className="w-full" />
        </div>
        <div className="absolute right-[6%] bottom-[38%] text-white/85">
          <Arc className="w-14" />
        </div>
        <div className="absolute bottom-[10%] right-[4%] w-14 text-white/80">
          <DotGrid className="w-full" />
        </div>
      </div>

      {/* ---------- Plano frontal ---------- */}
      <div className="plane-front absolute inset-0">
        <Icosahedron
          color="coral"
          size={132}
          className="anim-float-spin absolute top-[8%] left-[42%] drop-shadow-2xl"
        />
        <Tripod
          color="yellow"
          size={96}
          className="anim-gear absolute bottom-[12%] left-[41%] drop-shadow-xl"
        />
        <Pyramid
          color="sky"
          size={86}
          className="anim-tumble absolute top-[16%] right-[6%] drop-shadow-xl"
        />
        <div className="absolute top-[28%] left-[13%] text-white">
          <Cross className="w-4" />
        </div>
        <div className="absolute top-[58%] left-[10%] text-white">
          <TriangleMark className="w-5" />
        </div>
        <div className="absolute top-[44%] right-[11%] text-white">
          <Cross className="w-3" />
        </div>
      </div>
    </div>
  );
}
