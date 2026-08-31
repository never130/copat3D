/**
 * Capas apiladas: la firma visual de la impresión 3D.
 *
 * Se despliegan al pasar el mouse, de abajo hacia arriba, como si la pieza
 * siguiera imprimiéndose. Van en la esquina inferior derecha de la tarjeta.
 *
 * Depende de dos cosas del contexto y por eso no se puede usar suelta:
 * - un ancestro con la clase `group`, que es el que dispara el despliegue;
 * - la regla de `@media (hover: none)` en globals.css, que las muestra ya
 *   desplegadas donde no hay puntero que pueda revelarlas.
 */
export function Capas({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute right-7 bottom-7 flex flex-col items-end gap-[3px]"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className={`capa-tarjeta block h-[3px] rounded-full ${color} w-[var(--w)] transition-[width,opacity] duration-500 ease-[var(--ease-out-expo)] group-hover:w-[calc(var(--w)*1.7)] group-hover:opacity-100`}
          style={
            {
              "--w": `${12 + n * 7}px`,
              opacity: 0.2 + n * 0.09,
              transitionDelay: `${(4 - n) * 45}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
