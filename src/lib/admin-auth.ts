/**
 * Verifica la cabecera `Authorization: Basic ...` contra `ADMIN_PASSWORD`.
 *
 * La usan dos lugares: `proxy.ts` (protege las páginas de `/admin`) y las
 * Server Actions del panel (marcar asistencia). No alcanza con el proxy
 * solo — la propia documentación de Next.js lo advierte: una Server
 * Function no es una ruta aparte en la cadena de ejecución del proxy, así
 * que un cambio de matcher o un refactor que mueva la función a otra ruta
 * puede sacarle la protección en silencio. Cada Server Action del panel
 * verifica esto por su cuenta, no confía en que el proxy ya la haya
 * cubierto.
 *
 * Sin `ADMIN_PASSWORD` cargada, siempre rechaza — mismo principio que
 * `REGISTRO_HABILITADO`: el default ausente cae del lado seguro.
 */
export function verificarAuthAdmin(cabeceraAuthorization: string | null): boolean {
  const clave = process.env.ADMIN_PASSWORD?.trim();
  if (!clave) return false;
  if (!cabeceraAuthorization?.startsWith("Basic ")) return false;

  let decodificado: string;
  try {
    // `atob` devuelve los bytes como Latin-1; hay que reinterpretarlos como
    // UTF-8 para que una contraseña con acentos o eñe se compare bien.
    const bytes = Uint8Array.from(atob(cabeceraAuthorization.slice(6)), (c) =>
      c.charCodeAt(0),
    );
    decodificado = new TextDecoder().decode(bytes);
  } catch {
    return false;
  }

  // `indexOf` y no `split(":")`: la contraseña puede contener dos puntos
  // —RFC 7617 solo se los prohíbe al usuario, no a la contraseña— y con
  // `split` nos quedaríamos con el primer tramo. Con una clave tipo
  // `mi:clave:larga`, comparar contra `"mi"` no coincide nunca y el panel
  // queda inaccesible para siempre, sin ningún error que lo explique.
  const separador = decodificado.indexOf(":");
  if (separador === -1) return false;
  const intento = decodificado.slice(separador + 1);

  return intento === clave;
}
