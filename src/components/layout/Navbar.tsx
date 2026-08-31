"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AGENDA_CONFIRMADA } from "@/content/agenda";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

/** "Agenda" solo aparece en el menú cuando la página tiene contenido real
 *  que mostrar: mismo interruptor que usa /agenda para decidir entre el
 *  cronograma y el placeholder (ver src/content/agenda.ts). Sin esto, el
 *  link llevaba a una página que decía "Próximamente" — más confuso que
 *  simplemente no mostrarlo todavía. */
const LINKS = [
  { href: "/#ejes", label: "Ejes" },
  // "Convocatorias" y no "Inscripción": esa palabra ya la usa /registro (la
  // inscripción individual para asistir al evento) y el botón "Inscribirme".
  // Repetirla acá, para el concurso de secundarios y el registro de
  // emprendedores, iba a leerse como si fuera lo mismo.
  //
  // Apunta al ANCLA de la portada, no a /convocatorias: los otros cuatro
  // items del menú son anclas de la home, y este estaba en el medio de la
  // lista siendo el único que cambiaba de página. La sección resume y manda
  // a /convocatorias, que sigue existiendo como destino compartible.
  { href: "/#convocatorias", label: "Convocatorias" },
  ...(AGENDA_CONFIRMADA ? [{ href: "/agenda", label: "Agenda" }] : []),
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
 * Los contenedores flotantes (píldora del menú, botón de tema, hamburguesa)
 * comparten un único set de clases para que no diverjan.
 */
/** Alto del navbar en estado overlay, más un margen. Es el punto donde se
 *  considera que la cabecera magenta ya pasó por debajo.
 *
 *  Medido: **78px** (`py-4` = 32 + el hijo más alto = 46). Ojo con cuál es ese
 *  hijo: **no es el logo** (36px) sino la píldora del menú de escritorio
 *  —`py-1.5` sobre links que ya traen `py-1.5` y su propio borde—. Agrandar el
 *  logo no mueve el alto hasta pasar los 46px; cambiar el padding de la
 *  píldora sí, y en silencio.
 *
 *  Con un umbral menor al alto real, el cambio a sólido se dispara cuando el
 *  contenido todavía está tapado por el propio navbar. Hoy el margen es de
 *  apenas 2px: si tocás cualquiera de esos paddings, volvé a medir. */
const LINEA_NAVBAR = 80;

export function Navbar() {
  const pathname = usePathname();
  const [pasoCabecera, setPasoCabecera] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Con el menú abierto el fondo sobra: el panel ya cubre toda la pantalla.
  const solid = pasoCabecera && !menuAbierto;
  const enBlanco = !solid;

  useEffect(() => {
    const centinela = document.querySelector("[data-navbar-sentinel]");

    // Página sin cabecera magenta: el navbar va sólido desde el arranque.
    // El rAF evita hacer setState en el cuerpo del efecto (trampa 4).
    if (!centinela) {
      const raf = requestAnimationFrame(() => setPasoCabecera(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entrada]) => {
        // `boundingClientRect.top` y no `isIntersecting`: este último es
        // falso tanto cuando el centinela quedó arriba como cuando todavía
        // está más abajo de la pantalla, y son estados opuestos.
        setPasoCabecera(entrada.boundingClientRect.top <= LINEA_NAVBAR);
      },
      { rootMargin: `-${LINEA_NAVBAR}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(centinela);
    return () => observer.disconnect();
  }, [pathname]);

  // Escape para cerrar y bloqueo del scroll de fondo mientras el menú está
  // abierto: sin esto la página sigue scrolleando detrás del panel.
  useEffect(() => {
    if (!menuAbierto) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAbierto(false);
    };
    const overflowPrevio = document.body.style.overflow;

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowPrevio;
    };
  }, [menuAbierto]);

  // Fuente única de verdad de las superficies flotantes del navbar.
  const chip = enBlanco
    ? "border-white/20 bg-white/10"
    : "border-border bg-surface-2/80";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {solid && <div className="navbar-bg" aria-hidden="true" />}

        <nav
          className={`relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-[padding] duration-300 ${
            solid ? "py-2.5" : "py-4"
          }`}
        >
          <Link
            href="/"
            onClick={() => setMenuAbierto(false)}
            className={`flex items-center transition-colors duration-300 ${
              enBlanco ? "text-white" : "text-fg"
            }`}
            aria-label="COPAT 3D - inicio"
          >
            {/* El wordmark ya trae "COPAT 3D" dibujado: no repetirlo en texto. */}
            <Logo className="h-9 w-auto" />
          </Link>

          <ul
            className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md transition-colors duration-300 lg:flex ${chip}`}
          >
            {LINKS.map((link) => {
              const activo = link.href === pathname;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={activo ? "page" : undefined}
                    className={`block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                      enBlanco
                        ? activo
                          ? "text-canvas-ink bg-white"
                          : "text-white/90 hover:bg-white/15 hover:text-white"
                        : activo
                          ? "bg-magenta text-white"
                          : "text-muted hover:bg-surface hover:text-fg"
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
              onClick={() => setMenuAbierto(false)}
              className={`hidden rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-[1.03] sm:block ${
                enBlanco ? "text-canvas-ink bg-white" : "bg-magenta text-white"
              }`}
            >
              Inscribirme
            </Link>

            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-expanded={menuAbierto}
              aria-controls="menu-movil"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              className={`grid size-10 place-items-center rounded-full border backdrop-blur-md transition-colors duration-300 lg:hidden ${chip} ${
                enBlanco ? "text-white" : "text-fg"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuAbierto ? (
                  <path d="M5 5l14 14M19 5L5 19" />
                ) : (
                  <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {menuAbierto && (
        <div
          id="menu-movil"
          className="menu-movil hero-gradient grain fixed inset-0 z-40 flex flex-col justify-center px-7 pt-24 pb-10 lg:hidden"
        >
          <nav aria-label="Navegación principal">
            <ul>
              {LINKS.map((link, i) => (
                <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuAbierto(false)}
                    className="font-display block border-b border-white/15 py-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/registro"
            onClick={() => setMenuAbierto(false)}
            className="text-magenta-deep mt-9 block rounded-full bg-white px-8 py-4 text-center text-base font-bold"
          >
            Inscribirme gratis
          </Link>

          <p className="mt-7 text-center text-sm text-white/80">
            2 y 3 de octubre · Ushuaia, Tierra del Fuego
          </p>
        </div>
      )}
    </>
  );
}
