/**
 * Marca dónde termina la cabecera magenta (hero o PageHeader) y empieza el
 * contenido. El navbar lo observa para saber cuándo pasar de blanco a sólido.
 *
 * Por qué un centinela y no la posición de scroll: el hero ocupa una pantalla
 * entera pero el PageHeader de las páginas interiores mide ~250px. Medir
 * contra `window.innerHeight` funcionaba solo en la portada y dejaba el
 * navbar oscuro sobre el magenta de /agenda y /registro.
 *
 * Va SIEMPRE fuera de la cabecera, al inicio del contenido: el hero es
 * `sticky` y nunca se va de pantalla, así que un centinela adentro jamás
 * cruzaría el borde superior.
 */
export function NavbarSentinel() {
  return (
    <span
      data-navbar-sentinel
      aria-hidden="true"
      className="pointer-events-none block h-px w-full"
    />
  );
}
