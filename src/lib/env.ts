/**
 * Lectura de variables de entorno del servidor.
 *
 * No se validan al importar el módulo, y es deliberado: si esto tirara al
 * cargarse, **el build entero se cae** cuando Vercel construye sin tener
 * todavía cargadas las variables, o cuando alguien clona el repo y corre
 * `npm run build` sin `.env.local`. Es la misma familia de problema que la
 * trampa 3 de AGENTS.md.
 *
 * En su lugar cada acción pide lo que necesita en tiempo de ejecución y falla
 * ahí, con un mensaje que se puede mostrar. Una página que no manda mails
 * sigue funcionando aunque falte `RESEND_API_KEY`.
 */

/** Lee una variable obligatoria. `trim()` porque un valor pegado con un salto
 *  de línea en el panel de Vercel es indistinguible a simple vista. */
function requerida(nombre: string): string {
  const valor = process.env[nombre]?.trim();

  // `!valor` y no `=== undefined`: un ARG de Docker sin valor define la
  // variable como cadena vacía, que para nuestros fines es "no está".
  if (!valor) {
    throw new Error(
      `Falta la variable de entorno ${nombre}. Ver .env.example y docs/05-infraestructura-deploy.md`,
    );
  }
  return valor;
}

export function envResend() {
  return {
    apiKey: requerida("RESEND_API_KEY"),
    /** Destinatario institucional de los formularios. */
    destinatario: requerida("CONTACT_TO"),
    /**
     * Remitente. Resend exige un dominio verificado; hasta que estén cargados
     * SPF/DKIM/DMARC (checklist de docs/05) el único remitente que funciona es
     * el de prueba de Resend, así que ese es el default.
     */
    remitente:
      process.env.RESEND_FROM?.trim() || "COPAT 3D <onboarding@resend.dev>",
  };
}
