import { Ejes } from "@/components/sections/Ejes";
import { Hero } from "@/components/sections/Hero";
import { Sponsors } from "@/components/sections/Sponsors";

/** Placeholder de secciones pendientes — el sitio debe verse bien con
 *  contenido incompleto (ver docs/01-vision-y-alcance.md). */
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
    <section
      id={id}
      className="sheet mx-auto max-w-7xl scroll-mt-24 px-5 py-24"
    >
      <div className="border-border bg-surface rounded-3xl border border-dashed p-14 text-center">
        <h2 className="text-[clamp(1.75rem,5vw,2.75rem)]">{titulo}</h2>
        <p className="text-muted mx-auto mt-4 max-w-md">{texto}</p>
        <span className="bg-copat-yellow text-magenta-deep mt-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase">
          Próximamente
        </span>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
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
    </main>
  );
}
