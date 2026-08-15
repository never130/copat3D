import { EJES } from "@/content/ejes";

const ACCENT: Record<string, { text: string; bg: string; border: string }> = {
  "copat-coral": {
    text: "text-copat-coral",
    bg: "bg-copat-coral",
    border: "group-hover:border-copat-coral/50",
  },
  "copat-sky": {
    text: "text-copat-sky",
    bg: "bg-copat-sky",
    border: "group-hover:border-copat-sky/50",
  },
  "copat-yellow": {
    text: "text-copat-yellow",
    bg: "bg-copat-yellow",
    border: "group-hover:border-copat-yellow/50",
  },
  "copat-green": {
    text: "text-copat-green",
    bg: "bg-copat-green",
    border: "group-hover:border-copat-green/50",
  },
};

export function Ejes() {
  return (
    <section
      id="ejes"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <div className="sheet max-w-2xl">
        <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
          Ejes temáticos
        </p>
        <h2 className="mt-4 text-[clamp(2rem,6vw,3.5rem)]">
          Cuatro frentes donde la fabricación digital ya está trabajando
        </h2>
        <p className="text-muted mt-5 text-lg">
          Dos días de charlas, demostraciones en vivo y networking entre
          industria, salud, construcción y educación.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {EJES.map((eje, i) => {
          const a = ACCENT[eje.color];
          return (
            <article
              key={eje.id}
              // Escalonado: las tarjetas se reparten como hojas, no de golpe
              style={{ "--sheet-delay": `${i * 90}ms` } as React.CSSProperties}
              // Sin hover:-translate-y: .sheet ya transiciona `transform` a
              // 0.7s y el lift quedaría pesado. La barra de acento superior
              // es la señal de hover.
              className={`sheet group border-border bg-surface relative overflow-hidden rounded-3xl border p-8 ${a.border}`}
            >
              <div
                className={`absolute top-0 left-0 h-1 w-full ${a.bg} scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}
                style={{ transformOrigin: "left" }}
              />
              <span className={`font-display text-5xl font-black ${a.text} opacity-30`}>
                {eje.numero}
              </span>
              <h3 className="mt-4 text-2xl">{eje.titulo}</h3>
              <p className="text-muted mt-3 leading-relaxed">{eje.descripcion}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {eje.temas.map((tema) => (
                  <li
                    key={tema}
                    className="border-border bg-surface-2 rounded-full border px-3 py-1.5 text-xs font-medium"
                  >
                    {tema}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
