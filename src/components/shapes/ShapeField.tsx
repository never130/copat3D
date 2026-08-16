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
    <div
      className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
      aria-hidden="true"
    >
      {/* ---------- Plano de fondo ---------- */}
      <div className="plane-back absolute inset-0 opacity-50">
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
        <div className="absolute top-[6%] right-[26%] text-white/70">
          <Squiggle className="w-14" />
        </div>
        <div className="absolute bottom-[16%] left-[6%] w-14 text-white/60">
          <DotGrid className="w-full" />
        </div>
      </div>

      {/* ---------- Plano medio ---------- */}
      <div className="plane-mid absolute inset-0 opacity-90">
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
        <div className="absolute top-[38%] left-[3%] w-5 text-white/70">
          <Brace className="w-full" />
        </div>
        <div className="absolute right-[6%] bottom-[38%] text-white/70">
          <Arc className="w-14" />
        </div>
        <div className="absolute bottom-[10%] right-[4%] w-14 text-white/60">
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
