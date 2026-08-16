import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import {
  WireCube,
  WireMargins,
  WireOctahedron,
  WirePlus,
  WirePrism,
  WirePyramid,
} from "@/components/shapes/wire";
import { Ejes } from "@/components/sections/Ejes";
import { Hero } from "@/components/sections/Hero";
import { Sponsors } from "@/components/sections/Sponsors";

/**
 * Placeholder de secciones pendientes. El sitio debe verse bien con contenido
 * incompleto (ver docs/01-vision-y-alcance.md), así que en vez del borde
 * punteado genérico —que lee como "roto"— se usa el patrón de capas de una
 * pieza a medio imprimir: comunica "en construcción" con el lenguaje de la
 * marca en lugar de con un placeholder de wireframe.
 */
function Proximamente({
  id,
  titulo,
  texto,
  figura,
}: {
  id: string;
  titulo: string;
  texto: string;
  /** Figura wireframe del margen. Se alterna entre secciones para que no
   *  se repita la misma pieza al scrollear. */
  figura: "piramide" | "cruz";
}) {
  return (
    <section
      id={id}
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24"
    >
      {/* Mobile: en las bandas de padding, sangrando por el borde */}
      <WireMargins className="sm:hidden">
        {figura === "piramide" ? (
          <WirePyramid
            size={84}
            tono="yellow"
            className="absolute top-3 -right-8 opacity-70"
          />
        ) : (
          <WireOctahedron
            size={88}
            tono="lilac"
            className="absolute top-3 -left-8 opacity-70"
          />
        )}
      </WireMargins>

      <WireMargins className="hidden sm:block">
        {figura === "piramide" ? (
          <>
            <WirePyramid
              size={118}
              tono="yellow"
              className="absolute top-[14%] -right-32"
            />
            <WirePrism
              size={106}
              tono="sky"
              className="absolute bottom-[14%] -left-32"
            />
          </>
        ) : (
          <>
            <WirePlus
              size={104}
              tono="lilac"
              className="absolute top-[18%] -left-32"
            />
            <WireOctahedron
              size={112}
              tono="coral"
              className="absolute right-[-8rem] bottom-[16%]"
            />
            <WireCube
              size={92}
              tono="green"
              className="absolute top-[6%] -right-28"
            />
          </>
        )}
      </WireMargins>

      <div className="sheet sheet-print border-border bg-surface relative overflow-hidden rounded-[2rem] rounded-bl-none border p-14 text-center">
        <div
          className="text-fg pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, currentColor 0 1px, transparent 1px 9px)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <h2 className="text-[clamp(1.75rem,5vw,2.75rem)]">{titulo}</h2>
          <p className="text-muted mx-auto mt-4 max-w-md">{texto}</p>
          <span className="bg-copat-yellow text-magenta-deep mt-7 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
            Próximamente
          </span>
        </div>

        {/* Última capa impresa: el frente de avance de la pieza */}
        <span
          className="bg-copat-yellow/70 absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-[0.35]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <div className="relative">
        <Hero />

        {/* Todo el contenido posterior es UNA hoja que se desliza sobre el
            hero fijo. No dividir en varias: la gracia del efecto es que
            pase una página entera, no cada sección por separado. */}
        <div className="paper-page">
          <NavbarSentinel />
          <Ejes />
          <Proximamente
            id="talentos"
            titulo="Fábrica de Talentos"
            texto="La sede del congreso y el motor de formación técnica de la provincia."
            figura="piramide"
          />
          <Sponsors />
          <Proximamente
            id="contacto"
            titulo="Contacto"
            texto="Escribinos a copat3d@aif.gob.ar mientras habilitamos el formulario."
            figura="cruz"
          />
        </div>
      </div>
    </main>
  );
}
