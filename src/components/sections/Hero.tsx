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
    <section className="hero-gradient grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-16">
      <ShapeField />

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="mb-6 font-mono text-xs font-medium tracking-[0.25em] text-white/85 uppercase">
          Fin del Mundo · Tierra del Fuego
        </p>

        <h1 className="font-display text-[clamp(3.5rem,15vw,11rem)] leading-[0.85] font-black text-white">
          COPAT&nbsp;3D
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-base text-white/90 sm:text-lg">
          Congreso Patagónico de Impresión 3D, Fabricación Digital e Innovación
          Aplicada
        </p>

        <p className="font-display mt-8 text-[clamp(1.25rem,3.6vw,2.25rem)] font-bold text-white italic">
          Diseñando el futuro capa a capa
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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

        <div className="mt-11 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/registro"
            className="text-magenta-deep rounded-full bg-white px-8 py-4 text-base font-bold transition-transform duration-200 hover:scale-[1.03]"
          >
            Inscribirme gratis
          </Link>
          <a
            href="#empresas"
            className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold text-white transition-colors duration-200 hover:bg-white/15"
          >
            Sumar mi empresa
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/70">
        <svg viewBox="0 0 24 40" className="anim-bob h-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="1" y="1" width="22" height="38" rx="11" />
          <path d="M12 9v6" />
        </svg>
      </div>
    </section>
  );
}
