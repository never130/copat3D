"use client";

import { useTheme } from "next-themes";

/**
 * El tema real no se conoce durante el render del servidor, así que en lugar
 * de esperar al montaje (que causa parpadeo y un render en cascada) se
 * renderizan ambos íconos y CSS decide cuál se ve según la clase .dark que
 * next-themes escribe en <html> antes de la hidratación. Cero estado.
 *
 * `chipClassName` llega del navbar para que el botón y la píldora del menú
 * compartan exactamente la misma superficie y borde; `solid` solo define el
 * color del ícono y el hover.
 */
export function ThemeToggle({
  solid = false,
  chipClassName = "",
}: {
  solid?: boolean;
  chipClassName?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Cambiar entre modo claro y oscuro"
      className={`grid size-10 place-items-center rounded-full border backdrop-blur-md transition-colors duration-300 ${chipClassName} ${
        solid ? "text-fg hover:bg-surface" : "text-white hover:bg-white/20"
      }`}
    >
      {/* Modo oscuro activo → ofrecemos el sol */}
      <svg
        viewBox="0 0 24 24"
        className="hidden size-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>

      {/* Modo claro activo → ofrecemos la luna */}
      <svg
        viewBox="0 0 24 24"
        className="size-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
