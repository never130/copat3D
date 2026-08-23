import { NextResponse, type NextRequest } from "next/server";
import { verificarAuthAdmin } from "@/lib/admin-auth";

/**
 * Portón de acceso a `/admin` — la única sección del sitio que no es
 * pública: ahí se ven los datos de inscriptos (DNI, fecha de nacimiento,
 * contacto). Ver D13 en docs/04-datos-y-legales.md: la Ley 25.326 pide
 * limitar el acceso a quien lo necesita, y esto es lo mínimo que cumple eso
 * sin construir un sistema de usuarios para dos o tres personas del
 * equipo.
 *
 * Se llama `proxy.ts` y no `middleware.ts`: Next.js 16 renombró la
 * convención (ver node_modules/next/dist/docs/.../proxy.md). Con el nombre
 * viejo el archivo queda ignorado y `/admin` se sirve sin ninguna
 * protección — no un error visible, silencioso.
 *
 * HTTP Basic Auth y no un login con sesión: no hace falta manejar cookies,
 * expiración ni CSRF para un panel interno de bajo tráfico — el navegador
 * ya resuelve el diálogo y recuerda la contraseña durante la pestaña.
 *
 * La verificación en sí vive en lib/admin-auth.ts: las Server Actions del
 * panel (marcar asistencia) la vuelven a correr por su cuenta, porque una
 * Server Function no es una ruta aparte en la cadena del proxy — confiar
 * solo en el matcher de acá sería un solo punto de falla.
 */
export function proxy(request: NextRequest) {
  const autorizado = verificarAuthAdmin(request.headers.get("authorization"));

  if (!autorizado) {
    return new NextResponse("Acceso restringido.", {
      status: 401,
      // Los valores de header HTTP son ByteString (solo Latin-1): nada de
      // tildes ni rayas largas acá, o la respuesta tira un TypeError.
      headers: { "WWW-Authenticate": 'Basic realm="COPAT 3D - Panel"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
