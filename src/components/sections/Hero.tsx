import Link from "next/link";
import { ShapeField } from "@/components/shapes/ShapeField";

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
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
    <section className="brand-canvas sticky top-0 z-0 flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-9 sm:pt-28 sm:pb-16">
      <ShapeField />

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="mb-3 font-mono text-xs font-medium tracking-[0.25em] text-white/85 uppercase sm:mb-6">
          Fin del Mundo · Tierra del Fuego AeIAS
        </p>

        <h1 className="font-display text-[clamp(3.5rem,15vw,11rem)] leading-[0.85] font-black text-white">
          COPAT&nbsp;3D
        </h1>

        <p className="mt-3 max-w-2xl text-balance text-base text-white/90 sm:mt-6 sm:text-lg">
          Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación
          Aplicada
        </p>

        <p className="font-display mt-4 text-[clamp(1.25rem,3.6vw,2.25rem)] font-bold text-white italic sm:mt-8">
          Diseñando el futuro capa a capa
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          <Chip
            icon={
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            }
          >
            2 y 3 de octubre
          </Chip>
          <Chip
            icon={
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          >
            Ushuaia, Tierra del Fuego
          </Chip>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:mt-11 sm:flex-row">
          <Link
            href="/registro"
            className="text-magenta-deep rounded-full bg-white px-8 py-4 text-base font-bold transition-transform duration-200 hover:scale-[1.03]"
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
          Un chevron con la acción escrita se lee en cualquier dispositivo. */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/75">
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
