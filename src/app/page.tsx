import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
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
}: {
  id: string;
  titulo: string;
  texto: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
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
          />
          <Sponsors />
          <Proximamente
            id="contacto"
            titulo="Contacto"
            texto="Escribinos a copat3d@aif.gob.ar mientras habilitamos el formulario."
          />
        </div>
      </div>
    </main>
  );
}
