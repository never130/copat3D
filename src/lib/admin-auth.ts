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
    decodificado = atob(cabeceraAuthorization.slice(6));
  } catch {
    return false;
  }

  const [, intento] = decodificado.split(":");
  return intento === clave;
}
