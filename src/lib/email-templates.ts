import { SEDE } from "@/content/sede";
import { escaparHtml } from "@/lib/html";

/**
 * Plantillas de mail HTML.
 *
 * Todo el CSS va **inline**, elemento por elemento: un `<style>` en el
 * `<head>` funciona en algunos clientes de correo y se recorta en otros
 * (Gmail, sobre todo, en ciertos contextos), así que la única forma
 * confiable de que el diseño llegue igual a todos lados es no depender de
 * eso. Es más verboso que escribir una hoja de estilos, pero es lo que
 * funciona en la práctica para mail.
 *
 * Sin fuentes web: los clientes de correo no las cargan de forma confiable
 * (mismo motivo que layout.tsx usa una pila de sistema como respaldo). Va
 * una pila de fuentes de sistema, no Inter Tight.
 *
 * Paleta oscura fija, no adaptable al tema del cliente de correo: "modo
 * oscuro por defecto, identidad neón sobre fondo profundo" (AGENTS.md) es
 * la marca del sitio entero, no solo del navegador. Los valores son los
 * mismos que `.dark` en globals.css — un solo lugar donde vive la paleta,
 * copiado acá y no reinventado.
 */

const FUENTE =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const COLOR = {
  bg: "#0b0410",
  tarjeta: "#170a1e",
  tarjetaSuave: "#21102a", // --surface-2
  borde: "#2a1f30", // aproximación sólida de --border (blanco al 9%) sobre este fondo
  texto: "#ffffff",
  muted: "#a899b0",
  acento: "#ffc629", // --accent-text en modo oscuro: el magenta puro no llega a AA sobre fondo oscuro para texto chico
  magenta: "#ff2d8f",
} as const;

function envoltorio(contenido: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.bg};padding:32px 16px;font-family:${FUENTE}">
  <tr>
    <td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:${COLOR.tarjeta};border-radius:20px;overflow:hidden;border:1px solid ${COLOR.borde}">
        <tr>
          <td style="height:6px;line-height:6px;font-size:0;background:linear-gradient(90deg, ${COLOR.acento}, ${COLOR.magenta})">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:32px 28px 8px">
            <p style="margin:0;font-family:${FUENTE};font-weight:800;font-size:15px;letter-spacing:0.06em;color:${COLOR.acento};text-transform:uppercase">
              COPAT 3D
            </p>
          </td>
        </tr>
        ${contenido}
        <tr>
          <td style="padding:22px 28px 28px;border-top:1px solid ${COLOR.borde}">
            <p style="margin:0;font-family:${FUENTE};font-size:12px;line-height:1.6;color:${COLOR.muted}">
              Tus datos se tratan conforme a la Ley 25.326.
              <a href="https://copat3d.com.ar/privacidad" style="color:${COLOR.acento}">Política de privacidad</a>.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}

export function plantillaConfirmacionRegistro({
  nombreApellido,
  codigo,
  conQr,
}: {
  nombreApellido: string;
  codigo: string;
  /** El QR se adjunta como inline attachment (cid:) desde la Server
   *  Action, no se genera acá: esta función solo arma el HTML. */
  conQr: boolean;
}) {
  const nombreEscapado = escaparHtml(nombreApellido);

  const cuerpo = `
        <tr>
          <td style="padding:8px 28px 4px">
            <h1 style="margin:0;font-family:${FUENTE};font-weight:800;font-size:24px;line-height:1.25;color:${COLOR.texto}">
              ¡Gracias por inscribirte, ${nombreEscapado}!
            </h1>
            <p style="margin:12px 0 0;font-family:${FUENTE};font-size:15px;line-height:1.6;color:${COLOR.muted}">
              Guardá este mail: vas a necesitar el código de reserva para
              acreditarte el día del evento.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px 8px" align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${COLOR.tarjetaSuave};border:1px solid ${COLOR.borde};border-radius:16px">
              <tr>
                <td style="padding:24px;text-align:center">
                  <p style="margin:0;font-family:${FUENTE};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${COLOR.muted}">
                    Tu código de reserva
                  </p>
                  <p style="margin:8px 0 0;font-family:${FUENTE};font-weight:800;font-size:32px;letter-spacing:0.1em;color:${COLOR.acento}">
                    ${codigo}
                  </p>
                  ${
                    conQr
                      ? // Fondo blanco fijo alrededor del QR aunque el mail sea oscuro:
                        // un QR se lee por su contraste blanco/negro, invertirlo o
                        // dejarlo transparente sobre fondo oscuro arriesga que algún
                        // lector no lo reconozca.
                        `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px auto 0;background:#ffffff;border-radius:12px">
                          <tr>
                            <td style="padding:12px">
                              <img src="cid:qr-reserva" width="160" height="160" alt="Código QR con tu código de reserva" style="display:block" />
                            </td>
                          </tr>
                        </table>`
                      : ""
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 4px">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:6px 0;font-family:${FUENTE};font-size:14px;color:${COLOR.muted};width:90px">Cuándo</td>
                <td style="padding:6px 0;font-family:${FUENTE};font-size:14px;color:${COLOR.texto};font-weight:600">2 y 3 de octubre de 2026</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-family:${FUENTE};font-size:14px;color:${COLOR.muted}">Dónde</td>
                <td style="padding:6px 0;font-family:${FUENTE};font-size:14px;color:${COLOR.texto};font-weight:600">${SEDE.nombre}, ${SEDE.calle}, ${SEDE.ciudad}</td>
              </tr>
            </table>
          </td>
        </tr>`;

  const html = envoltorio(cuerpo);

  const text = `¡Gracias por inscribirte a COPAT 3D, ${nombreApellido}!

Tu código de reserva es: ${codigo}
Guardalo: te lo vamos a pedir para acreditarte el día del evento.

Cuándo: 2 y 3 de octubre de 2026
Dónde: ${SEDE.nombre}, ${SEDE.calle}, ${SEDE.ciudad}

Tus datos se tratan conforme a la Ley 25.326. Más información en
copat3d.com.ar/privacidad`;

  return { html, text };
}
