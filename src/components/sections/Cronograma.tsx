import {
  AGENDA,
  iniciales,
  type Actividad,
  type DiaAgenda,
} from "@/content/agenda";
import { EJES } from "@/content/ejes";

/** Acento por eje, resuelto una vez. Los nombres de clase van completos y no
 *  armados por concatenación: Tailwind escanea texto literal, y una clase
 *  construida como `text-${color}` nunca se genera. */
const ACENTO: Record<string, { texto: string; punto: string }> = {
  "copat-coral": { texto: "text-copat-coral", punto: "bg-copat-coral" },
  "copat-sky": { texto: "text-copat-sky", punto: "bg-copat-sky" },
  "copat-yellow": { texto: "text-copat-yellow", punto: "bg-copat-yellow" },
  "copat-green": { texto: "text-copat-green", punto: "bg-copat-green" },
};

const EJE_POR_ID = new Map(EJES.map((eje) => [eje.id, eje]));

function FilaActividad({ actividad }: { actividad: Actividad }) {
  const eje = actividad.ejeId ? EJE_POR_ID.get(actividad.ejeId) : undefined;
  const acento = eje ? ACENTO[eje.color] : undefined;

  return (
    <li className="border-border relative border-t py-5 first:border-t-0 first:pt-0">
      {/* El horario arriba en mobile y en columna propia desde sm: a 360px,
          una columna fija de horario deja al título en ~50 caracteres de
          ancho y todo se parte en cuatro renglones. */}
      <div className="flex flex-col gap-x-5 gap-y-1 sm:flex-row">
        <p className="text-muted font-mono text-xs tabular-nums sm:w-24 sm:shrink-0 sm:pt-1">
          {actividad.desde}–{actividad.hasta}
        </p>

        <div className="min-w-0 flex-1">
          {eje && acento && (
            <p
              className={`${acento.texto} mb-1 flex items-center gap-1.5 font-mono text-[0.65rem] font-medium tracking-[0.15em] uppercase`}
            >
              <span
                className={`${acento.punto} inline-block size-1.5 rounded-full`}
                aria-hidden="true"
              />
              {eje.titulo}
            </p>
          )}

          <h3 className="font-display text-lg leading-snug font-bold">
            {actividad.titulo}
          </h3>

          {actividad.descripcion && (
            <p className="text-muted mt-1.5 text-sm leading-relaxed">
              {actividad.descripcion}
            </p>
          )}

          {actividad.orador && (
            <div className="mt-3 flex items-center gap-3">
              {actividad.orador.foto ? (
                /* Mismo criterio que los logos de sponsors: son pocas
                   imágenes, de tamaño conocido y servidas desde public/, así
                   que no se gana nada pasándolas por el optimizador. */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={actividad.orador.foto}
                  alt=""
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  className="bg-surface-2 text-muted grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold"
                  aria-hidden="true"
                >
                  {iniciales(actividad.orador.nombre)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {actividad.orador.nombre}
                </span>
                <span className="text-muted block text-xs">
                  {actividad.orador.cargo}
                </span>
              </span>
            </div>
          )}

          {actividad.sala && (
            <p className="text-muted mt-2 text-xs">{actividad.sala}</p>
          )}
        </div>
      </div>
    </li>
  );
}

function ColumnaDia({ dia, indice }: { dia: DiaAgenda; indice: number }) {
  return (
    <article
      style={{ "--sheet-delay": `${indice * 90}ms` } as React.CSSProperties}
      className="sheet border-border bg-surface rounded-3xl border p-6 sm:p-8"
    >
      <h2 className="text-2xl">{dia.etiqueta}</h2>
      <p className="text-muted mt-2 text-sm">{dia.resumen}</p>

      <ul className="border-border mt-6 border-t pt-6">
        {dia.actividades.map((actividad) => (
          <FilaActividad key={actividad.id} actividad={actividad} />
        ))}
      </ul>
    </article>
  );
}

export function Cronograma() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {AGENDA.map((dia, i) => (
        <ColumnaDia key={dia.id} dia={dia} indice={i} />
      ))}
    </div>
  );
}
