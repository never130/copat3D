"use client";

import { useEffect } from "react";

/**
 * Pase de hojas al scrollear.
 *
 * Observa cada `.sheet` y activa `.sheet-in` cuando entra al viewport,
 * produciendo el efecto de capa/hoja física que se apoya y asienta.
 *
 * Es de una sola vía: una vez apoyada, la hoja no vuelve a ocultarse. Volver
 * a animar al scrollear hacia arriba marea y hace que la página se sienta
 * inestable al releer.
 *
 * Dos cosas a respetar si lo tocás:
 * - El estado inicial se calcula ANTES de activar `.js-sheets`. Al revés,
 *   todo saltaría a opacidad 0 y el observer lo corregiría un frame después,
 *   con parpadeo visible en lo que ya está en pantalla.
 * - Si el script no corre, `.js-sheets` nunca se agrega y las secciones
 *   quedan visibles, en lugar de invisibles para siempre.
 *
 * `.sheet` va en bloques más chicos que el viewport, nunca en una <section>
 * entera: ver la trampa 1 de AGENTS.md.
 */
export function SheetMotion() {
  useEffect(() => {
    const root = document.documentElement;
    // Se observan también las figuras wireframe: usan el mismo `.sheet-in`
    // como disparador, así hay un solo observer para toda la página en vez
    // de dos recorriendo el DOM por separado.
    const sheets = Array.from(
      document.querySelectorAll<HTMLElement>(".sheet, .wire-dibujo"),
    );
    if (sheets.length === 0) return;

    const alto = window.innerHeight;

    // Estado inicial: lo que ya está en pantalla se marca como sheet-in
    for (const el of sheets) {
      const caja = el.getBoundingClientRect();
      const visible = caja.top < alto * 0.95 && caja.bottom > 0;
      if (visible) {
        el.classList.add("sheet-in");
      }
    }

    root.classList.add("js-sheets");

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("sheet-in");
          }
        }
      },
      // threshold 0 (no 0.05): los bloques con `sheet-print` arrancan
      // recortados y su área visible es una fracción de la caja, así que
      // exigir un porcentaje mínimo puede no alcanzarse nunca.
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    for (const el of sheets) observer.observe(el);

    return () => {
      observer.disconnect();
      root.classList.remove("js-sheets");
    };
  }, []);

  return null;
}
