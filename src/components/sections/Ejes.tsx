import {
  WireCube,
  WireIcosahedron,
  WireMargins,
  WireOctahedron,
  WirePrism,
} from "@/components/shapes/wire";
import { ACENTOS } from "@/components/ui/acentos";
import { Capas } from "@/components/ui/Capas";
import { Tarjeta3D } from "@/components/ui/Tarjeta3D";
import { EJES } from "@/content/ejes";

/**
 * Las tarjetas no usan la caja genérica de borde parejo: la identidad del
 * congreso es "capa a capa", así que cada una se lee como una pieza apoyada
 * sobre una base de color —el plato de la impresora— con las capas apiladas
 * a un costado. El número gigante sangra fuera del recorte, como en el arte
 * original del afiche.
 */
/* Los acentos viven en `@/components/ui/acentos`: los comparten estas
   tarjetas y las de /convocatorias. */

export function Ejes() {
  return (
    <section
      id="ejes"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      {/* Márgenes laterales: solo asoman cuando el viewport supera el
          max-w-7xl del contenido. En mobile quedan fuera de pantalla. */}
      <WireMargins className="hidden sm:block">
        <WireIcosahedron
          size={140}
          tono="coral"
          className="absolute top-[5%] -left-36"
        />
        <WirePrism
          size={112}
          tono="green"
          className="absolute top-[16%] -right-32"
        />
        <WireCube
          size={120}
          tono="sky"
          className="absolute top-[52%] -right-32"
        />
        <WireOctahedron
          size={118}
          tono="lilac"
          className="absolute bottom-[8%] -left-32"
        />
      </WireMargins>

      {/* Mobile: van en las bandas de padding vertical de la sección (py-24),
          que es el único espacio realmente libre en pantallas angostas, y
          sangran por el borde para no invadir la columna de texto. */}
      <WireMargins className="sm:hidden">
        <WirePrism
          size={86}
          tono="green"
          className="absolute top-4 -right-8 opacity-70"
        />
        <WireOctahedron
          size={92}
          tono="lilac"
          className="absolute -bottom-2 -left-8 opacity-70"
        />
      </WireMargins>

      <div className="sheet sheet-print max-w-2xl">
        <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
          Ejes temáticos
        </p>
        <h2 className="titulo-impreso mt-4 text-[clamp(2rem,6vw,3.5rem)]">
          Cuatro frentes donde la fabricación digital ya está trabajando
        </h2>
        <p className="text-muted mt-5 text-lg">
          Dos días de charlas, demostraciones en vivo y networking entre
          industria, salud, construcción y educación.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {EJES.map((eje, i) => {
          const a = ACENTOS[eje.color];
          return (
            // El .sheet va en el envoltorio y no en la tarjeta: así la
            // animación de entrada y el hover no se pelean por `transform`.
            <div
              key={eje.id}
              className="sheet"
              style={{ "--sheet-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <Tarjeta3D>
                <article
                  // Sin clases `transition-*` de Tailwind: las transiciones de
                  // esta tarjeta se declaran en `.tarjeta-3d > *` de globals.css,
                  // que al estar fuera de `@layer` le gana igual a las utilidades
                  // (trampa 10). Tenerlas en los dos lados dejaba la mitad sin
                  // efecto en silencio.
                  style={
                    {
                      "--luz-color": a.luz,
                      "--glow": a.glow,
                      "--borde-activo": a.borde,
                    } as React.CSSProperties
                  }
                  className="tarjeta-eje group border-border bg-surface relative h-full overflow-hidden rounded-3xl rounded-br-none border pt-8 pr-8 pb-10 pl-8 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_var(--glow)]"
                >
                  {/* Luz que sigue al puntero, con el acento del eje */}
                  <span
                    className="luz-tarjeta pointer-events-none absolute inset-0"
                    aria-hidden="true"
                  />

                  {/* Número sangrando fuera del recorte, como en el afiche.
                    Se corre en sentido CONTRARIO a la inclinación: ese desfase
                    entre planos es lo que se lee como profundidad. No puede
                    hacerse con `translateZ` porque el `overflow-hidden` de la
                    tarjeta —que es el que recorta el número— fuerza a aplanar
                    el contexto 3D. */}
                  <span
                    className={`num-tarjeta font-display pointer-events-none absolute -top-6 -right-2 text-[8rem] leading-none font-black ${a.text} opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.16]`}
                    style={{
                      translate:
                        "calc(var(--ry, 0deg) / 1deg * -1.1px) calc(var(--rx, 0deg) / 1deg * 1.1px)",
                    }}
                    aria-hidden="true"
                  >
                    {eje.numero}
                  </span>

                  <div className="relative">
                    <p
                      className={`font-mono text-xs font-bold tracking-[0.2em] ${a.text}`}
                    >
                      EJE {eje.numero}
                    </p>
                    <h3 className="mt-3 max-w-[15ch] text-2xl">{eje.titulo}</h3>
                    <p className="text-muted mt-3 max-w-[42ch] leading-relaxed">
                      {eje.descripcion}
                    </p>
                    <ul className="mt-6 flex max-w-[38ch] flex-wrap gap-2">
                      {eje.temas.map((tema, j) => (
                        <li
                          key={tema}
                          // Los chips NO llevan hover propio: no son clickeables, y darles
                          // uno prometería una interacción que no existe. Se encienden
                          // escalonados cuando el mouse pasa por la TARJETA, como una
                          // capa más que termina de imprimirse.
                          style={
                            {
                              "--chip-delay": `${j * 55}ms`,
                            } as React.CSSProperties
                          }
                          className="chip-tema border-border bg-surface-2 text-muted rounded-full border px-3 py-1.5 text-xs font-medium"
                        >
                          {tema}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Capas color={a.bg} />

                  {/* Plato de la impresora: la base de color sobre la que se
                    apoya la pieza. Crece de un lado al pasar el mouse. */}
                  <span
                    className={`plato-tarjeta absolute inset-x-0 bottom-0 h-[3px] ${a.bg} origin-left scale-x-[0.18] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100`}
                    aria-hidden="true"
                  />
                </article>
              </Tarjeta3D>
            </div>
          );
        })}
      </div>
    </section>
  );
}
