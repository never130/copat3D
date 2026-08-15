"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/#ejes", label: "Ejes" },
  { href: "/agenda", label: "Agenda" },
  { href: "/#talentos", label: "Fábrica de Talentos" },
  { href: "/#empresas", label: "Empresas" },
  { href: "/#contacto", label: "Contacto" },
];

/**
 * El navbar vive sobre dos fondos distintos y necesita dos tratamientos:
 *
 * - overlay: flotando sobre el magenta del hero → todo en blanco.
 * - sólido:  ya pasó el hero, o es una página interior → superficie del tema.
 *
 * Los contenedores flotantes (píldora del menú y botón de tema) comparten
 * un único set de clases para que no diverjan: antes tenían opacidades de
 * borde y de fondo distintas y se notaba el desfasaje.
 */
export function Navbar() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  // Derivado, no almacenado: el navbar vive en el layout y no se remonta al
  // navegar, así que guardar `solid` en estado quedaría desactualizado.
  const solid = !overHero || pastHero;

  useEffect(() => {
    if (!overHero) return;

    const onScroll = () =>
      setPastHero(window.scrollY > window.innerHeight * 0.82);

    // rAF en vez de llamada directa: cubre la restauración de scroll al
    // recargar a mitad de página sin hacer setState en el cuerpo del efecto.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [overHero]);

  // Fuente única de verdad de las superficies flotantes del navbar.
  const chip = solid
    ? "border-border bg-surface-2/80"
    : "border-white/20 bg-white/10";

  return (
    <header
      // Sin borde inferior: la píldora del menú ya tiene el suyo y los dos
      // juntos leen como un doble trazo.
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-surface/80 backdrop-blur-xl" : ""
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-[padding] duration-300 ${
          solid ? "py-2.5" : "py-4"
        }`}
      >
        <Link
          href="/"
          className={`flex items-center gap-2.5 transition-colors duration-300 ${
            solid ? "text-fg" : "text-white"
          }`}
          aria-label="COPAT 3D — inicio"
        >
          <Logo className="size-9" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            COPAT 3D
          </span>
        </Link>

        <ul
          className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md transition-colors duration-300 lg:flex ${chip}`}
        >
          {LINKS.map((link) => {
            const active = link.href === pathname;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    solid
                      ? active
                        ? "bg-magenta text-white"
                        : "text-muted hover:bg-surface hover:text-fg"
                      : active
                        ? "text-magenta-deep bg-white"
                        : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle chipClassName={chip} solid={solid} />
          <Link
            href="/registro"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-[1.03] ${
              solid ? "bg-magenta text-white" : "text-magenta-deep bg-white"
            }`}
          >
            Inscribirme
          </Link>
        </div>
      </nav>
    </header>
  );
}
