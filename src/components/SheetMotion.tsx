"use client";

import { useEffect } from "react";

/**
 * Pase de hojas al scrollear.
 *
 * Observa cada `.sheet` y le conmuta dos clases:
 *   .sheet-in    → a la vista, apoyada
 *   .sheet-past  → ya pasó hacia arriba, la siguiente la cubre
 *
 * Va montado en template.tsx para que se re-enganche en cada navegación,
 * ya que las secciones cambian con la ruta.
 */
export function SheetMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const sheets = Array.from(
      document.querySelectorAll<HTMLElement>(".sheet"),
    );
    if (sheets.length === 0) return;

    const alto = window.innerHeight;

    // Estado inicial calculado antes de activar .js-sheets: si se activara
    // primero, todo saltaría a opacidad 0 y recién después el observer lo
    // corregiría, con un parpadeo visible en lo que ya está en pantalla.
    for (const el of sheets) {
      const caja = el.getBoundingClientRect();
      const visible = caja.top < alto * 0.9 && caja.bottom > alto * 0.1;
      el.classList.toggle("sheet-in", visible);
      el.classList.toggle("sheet-past", !visible && caja.top < 0);
    }

    root.classList.add("js-sheets");

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const salioPorArriba = entrada.boundingClientRect.top < 0;
          entrada.target.classList.toggle("sheet-in", entrada.isIntersecting);
          entrada.target.classList.toggle(
            "sheet-past",
            !entrada.isIntersecting && salioPorArriba,
          );
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );

    for (const el of sheets) observer.observe(el);

    return () => {
      observer.disconnect();
      root.classList.remove("js-sheets");
    };
  }, []);

  return null;
}
