"use client";

import { useRef } from "react";

/** Inclinación máxima en grados. Deliberadamente chica: pasados los ~8° la
 *  tarjeta se deforma tanto que el texto se lee torcido, y lo que era una
 *  señal de profundidad pasa a ser un obstáculo para leer. */
const GRADOS = 6;

/**
 * Envoltorio que inclina su contenido siguiendo al puntero, con una luz que
 * se mueve con él.
 *
 * Tres decisiones que no son obvias:
 *
 * - **No usa estado de React.** Un `useState` por cada `pointermove` dispara
 *   un re-render por frame. Acá se escriben custom properties directo en el
 *   nodo, que el compositor resuelve sin tocar React. Además evita la trampa
 *   4 (el React Compiler rechaza `setState` en el cuerpo de un efecto).
 * - **Actualiza dentro de `requestAnimationFrame`.** `pointermove` dispara
 *   más seguido que los frames de pantalla; sin esto se calcula de más y se
 *   pinta lo mismo.
 * - **La inclinación va acá y no en la tarjeta.** El `.sheet` que la envuelve
 *   anima `transform` durante 0.7s para el pase de hoja; un hover que use la
 *   misma propiedad hereda esa duración y queda pesadísimo (trampa 6).
 */
export function Tarjeta3D({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pendiente = useRef<number | null>(null);
  const ultimo = useRef({ x: 0, y: 0 });

  function aplicar() {
    pendiente.current = null;
    const nodo = ref.current;
    if (!nodo) return;

    const caja = nodo.getBoundingClientRect();
    if (!caja.width || !caja.height) return;

    // Posición del puntero dentro de la tarjeta, de 0 a 1.
    const px = (ultimo.current.x - caja.left) / caja.width;
    const py = (ultimo.current.y - caja.top) / caja.height;

    // El eje X se invierte: si el puntero está arriba, la tarjeta tiene que
    // inclinarse hacia atrás por arriba, no hacia adelante.
    nodo.style.setProperty("--ry", `${(px - 0.5) * 2 * GRADOS}deg`);
    nodo.style.setProperty("--rx", `${(0.5 - py) * 2 * GRADOS}deg`);
    nodo.style.setProperty("--mx", `${px * 100}%`);
    nodo.style.setProperty("--my", `${py * 100}%`);
  }

  return (
    <div
      ref={ref}
      className={`tarjeta-3d ${className}`}
      onPointerMove={(e) => {
        // Solo punteros finos: en una pantalla táctil el "hover" ocurre
        // recién al tocar, así que la tarjeta se inclinaría justo cuando el
        // dedo la tapa. No aporta nada y confunde.
        if (e.pointerType !== "mouse") return;
        ultimo.current = { x: e.clientX, y: e.clientY };
        if (pendiente.current === null) {
          pendiente.current = requestAnimationFrame(aplicar);
        }
        ref.current?.setAttribute("data-siguiendo", "true");
      }}
      onPointerLeave={() => {
        if (pendiente.current !== null) {
          cancelAnimationFrame(pendiente.current);
          pendiente.current = null;
        }
        const nodo = ref.current;
        if (!nodo) return;
        // Al soltar vuelve sola. El atributo se saca primero para que la
        // vuelta use la transición larga en vez del seguimiento inmediato.
        nodo.removeAttribute("data-siguiendo");
        nodo.style.setProperty("--rx", "0deg");
        nodo.style.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </div>
  );
}
