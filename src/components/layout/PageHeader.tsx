import { Plus, Zigzag } from "@/components/shapes";

/** Cabecera compacta de las páginas interiores. Mantiene la firma magenta
 *  de la marca sin ocupar toda la pantalla como el hero de la portada. */
export function PageHeader({
  eyebrow,
  titulo,
  bajada,
}: {
  eyebrow: string;
  titulo: string;
  bajada?: string;
}) {
  return (
    <section className="brand-canvas relative overflow-hidden px-5 pt-32 pb-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Zigzag
          color="yellow"
          size={78}
          className="anim-sway absolute top-[26%] right-[7%] opacity-90"
        />
        <Plus
          color="lilac"
          size={54}
          className="anim-float-spin absolute bottom-[14%] left-[5%] opacity-80"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="font-mono text-xs font-medium tracking-[0.25em] text-white/85 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,7vw,4.5rem)] text-white">
          {titulo}
        </h1>
        {bajada && (
          <p className="mt-5 max-w-xl text-lg text-white/90">{bajada}</p>
        )}
      </div>
    </section>
  );
}
