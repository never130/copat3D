import Link from "next/link";
import { ShapeField } from "@/components/shapes/ShapeField";

function Chip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    // Padding y texto más chicos en mobile: los dos chips juntos ("2 y 3 de
    // octubre" + "Ushuaia, Tierra del Fuego") no entraban en una fila hasta
    // los 412px de ancho —envolvían en TODOS los anchos móviles comunes—, lo
    // que agregaba una fila de alto no contemplada en el ajuste de espaciado
    // vertical de la trampa 14.
    <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm">
      <span className="text-white/80">{icon}</span>
      {children}
    </div>
  );
}

export function Hero() {
  return (
    // sticky + z-0: el hero se queda apoyado al fondo mientras el resto de
    // la página se desliza por encima.
    //
    // El padding chico en mobile no es estético: con pt-28/pb-16 el hero
    // medía 698px contra los 667 de un iPhone SE y no entraba, lo que dejaba
    // su parte inferior inalcanzable al quedar pegado. Con pt-24/pb-12 entra
    // y el efecto funciona en todos los tamaños.
    //
    // Arriba de sm el espaciado va en svh y no en valores fijos: la notebook
    // es ANCHA pero BAJA (1366×768 deja ~625px de viewport, y 1920×1080 al
    // 150% de escalado deja ~590), así que los `sm:` fijos daban un hero de
    // 675px que tampoco entraba — el mismo bug que en mobile pero por el lado
    // que nadie mira. Los máximos de cada clamp son los valores de antes: en
    // una ventana de 1080px de alto no cambia absolutamente nada.
    //
    // Los dos paddings NO son simétricos ni fluidos, y no es un descuido:
    // cada uno reserva algo concreto. Arriba, los 78px del navbar fijo (por
    // eso el mínimo del clamp es 5rem y no puede bajar). Abajo, los 63px del
    // indicador de scroll, que está en `absolute` y no ocupa lugar en el
    // flujo: como el bloque de texto se centra en la caja de padding, si pb
    // se achica el texto BAJA y se le monta encima. A 1280×593 quedaban 1px.
    //
    // Abajo de 560px de alto el indicador se oculta (ver más abajo), así que
    // reservarle lugar sería regalar 72px que ahí no sobran: pb vuelve al
    // valor de mobile.
    <section className="brand-canvas sticky top-0 z-0 flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-9 sm:pt-[clamp(5rem,11svh,7rem)] sm:pb-18 sm:[@media(max-height:560px)]:pb-9">
      <ShapeField />

      {/* Realce detrás del wordmark: blanco tipo "luz suave" en claro,
          coral en oscuro (ver globals.css). No es el mismo color en los dos
          modos — un coral sobre magenta se pierde por falta de contraste de
          tono, no alcanzaba con la opacidad. */}
      <div className="hero-glow" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <p
          className="hero-rise mb-3 font-mono text-xs font-medium tracking-[0.25em] text-white/85 uppercase sm:mb-[clamp(0.75rem,2.4svh,1.5rem)]"
          style={{ "--hero-delay": "0ms" } as React.CSSProperties}
        >
          Fin del Mundo · Tierra del Fuego AeIAS
        </p>

        {/* 12vw y no 15vw: a 15vw el título medía 722px de ancho en una
            ventana de 1024 y dejaba 151px de margen lateral, insuficiente
            para las figuras. Arriba de ~1467px no cambia nada porque el
            clamp ya topeaba en 11rem; solo alivia el rango apretado. */}
        <h1
          className="hero-rise font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] font-black text-white"
          style={{ "--hero-delay": "90ms" } as React.CSSProperties}
        >
          COPAT&nbsp;3D
        </h1>

        <p
          className="hero-rise mt-3 max-w-2xl text-balance text-base text-white/90 sm:mt-[clamp(0.75rem,2.4svh,1.5rem)] sm:text-lg"
          style={{ "--hero-delay": "180ms" } as React.CSSProperties}
        >
          Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación
          Aplicada
        </p>

        {/* "capa a capa" en amarillo: es el acento de marca con mejor
            contraste sobre el lienzo en los dos modos (medido: 3.7:1 en
            claro, 13:1 en oscuro — coral no llega a 3:1 en claro). */}
        <p
          className="hero-rise font-display mt-4 text-[clamp(1.25rem,3.6vw,2.25rem)] font-bold text-white italic sm:mt-[clamp(1rem,3.2svh,2rem)]"
          style={{ "--hero-delay": "260ms" } as React.CSSProperties}
        >
          Diseñando el futuro{" "}
          <span className="text-copat-yellow not-italic">capa a capa</span>
        </p>

        <div
          className="hero-rise mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-[clamp(1.5rem,4svh,2.5rem)] sm:gap-3"
          style={{ "--hero-delay": "340ms" } as React.CSSProperties}
        >
          <Chip
            icon={
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            }
          >
            2 y 3 de octubre
          </Chip>
          <Chip
            icon={
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          >
            Ushuaia, Tierra del Fuego
          </Chip>
        </div>

        <div
          className="hero-rise mt-6 flex flex-col gap-3 sm:mt-[clamp(1.5rem,4.4svh,2.75rem)] sm:flex-row"
          style={{ "--hero-delay": "420ms" } as React.CSSProperties}
        >
          <Link
            href="/registro"
            className="text-canvas-ink rounded-full bg-white px-8 py-4 text-base font-bold transition-transform duration-200 hover:scale-[1.03]"
          >
            Quiero mi entrada
          </Link>
          <a
            href="#empresas"
            className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold text-white transition-colors duration-200 hover:bg-white/15"
          >
            Sumá tu empresa
          </a>
        </div>
      </div>

      {/* Indicador de scroll. Antes era el contorno de un mouse, que no se
          entendía a ese tamaño y encima no significa nada en un celular.
          Un chevron con la acción escrita se lee en cualquier dispositivo.

          Por debajo de 560px de alto se oculta: ahí el navbar (78px) más el
          bloque de texto ya no dejan lugar para los 63px del indicador, y
          prefiere desaparecer antes que pisar los botones. Son ventanas más
          bajas que cualquier notebook (la más chica, 1080p al 150%, da 590);
          el caso real es un celular acostado. */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/75 [@media(max-height:560px)]:hidden">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
          Seguí bajando
        </span>
        <svg
          viewBox="0 0 24 14"
          className="anim-nudge w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 3l9 8 9-8" />
        </svg>
      </div>
    </section>
  );
}
