"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { envResend } from "@/lib/env";
import { escaparHtml } from "@/lib/html";
import { crearLimitador } from "@/lib/rate-limit";
import { erroresPorCampo, esquemaContacto } from "@/lib/validation";

/** Lo que la Server Action le devuelve al formulario. */
export type EstadoContacto = {
  ok: boolean;
  /** Mensaje general (éxito o falla que no es de un campo puntual). */
  mensaje?: string;
  /** Errores por campo, para pintarlos al lado de cada input. */
  errores?: Record<string, string>;
};

/* ------------------------------------------------------------------ *
 * Límite de envíos
 * ------------------------------------------------------------------ */

const VENTANA_MS = 10 * 60 * 1000; // 10 minutos
const MAX_POR_VENTANA = 3;

// El honeypot del esquema cubre el grueso del spam automatizado; ver
// `src/lib/rate-limit.ts` para el porqué de este límite y sus límites.
const superaLimite = crearLimitador(VENTANA_MS, MAX_POR_VENTANA);

/* ------------------------------------------------------------------ */

export async function enviarContacto(
  _previo: EstadoContacto,
  datos: FormData,
): Promise<EstadoContacto> {
  const analizado = esquemaContacto.safeParse({
    nombre: datos.get("nombre"),
    email: datos.get("email"),
    asunto: datos.get("asunto"),
    mensaje: datos.get("mensaje"),
    sitioWeb: datos.get("sitioWeb"),
  });

  if (!analizado.success) {
    return {
      ok: false,
      mensaje: "Revisá los datos marcados.",
      errores: erroresPorCampo(analizado.error),
    };
  }

  const { nombre, email, asunto, mensaje, sitioWeb } = analizado.data;

  // Honeypot: un humano no puede haber completado este campo. Se responde
  // como si hubiera salido bien —si le avisáramos al bot que lo detectamos,
  // la próxima vuelve sin llenarlo.
  // `.trim()`: si el campo trajera solo un espacio suelto y lo tomáramos por
  // bot, estaríamos tirando a la basura el mensaje de una persona real sin que
  // se entere. Solo cuenta como trampa si tiene contenido de verdad.
  if (sitioWeb?.trim()) {
    return { ok: true, mensaje: "¡Gracias! Te vamos a responder a la brevedad." };
  }

  const cabeceras = await headers();
  // `x-forwarded-for` puede traer una cadena de proxies; la primera es la real.
  const ip = cabeceras.get("x-forwarded-for")?.split(",")[0]?.trim() || "sin-ip";

  if (superaLimite(ip)) {
    return {
      ok: false,
      mensaje:
        "Recibimos varios mensajes tuyos recién. Esperá unos minutos antes de volver a escribir.",
    };
  }

  try {
    const { apiKey, destinatario, remitente } = envResend();
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: remitente,
      to: destinatario,
      // Así la AIF responde con "Responder" y le llega a la persona, en vez
      // de contestarle a la casilla del remitente técnico.
      replyTo: email,
      subject: `[Web COPAT 3D] ${asunto}`,
      html: `
        <h2>Nuevo mensaje desde copat3d.com.ar</h2>
        <p><strong>Nombre:</strong> ${escaparHtml(nombre)}</p>
        <p><strong>Correo:</strong> ${escaparHtml(email)}</p>
        <p><strong>Asunto:</strong> ${escaparHtml(asunto)}</p>
        <hr />
        <p style="white-space:pre-wrap">${escaparHtml(mensaje)}</p>
      `,
      text: `Nuevo mensaje desde copat3d.com.ar

Nombre: ${nombre}
Correo: ${email}
Asunto: ${asunto}

${mensaje}`,
    });

    if (error) {
      // El detalle va al log del servidor, no a la pantalla: puede incluir
      // información de la cuenta de Resend.
      console.error("Resend rechazó el envío:", error);
      return {
        ok: false,
        mensaje:
          "No pudimos enviar el mensaje. Escribinos directamente a copat3d@aif.gob.ar.",
      };
    }

    return { ok: true, mensaje: "¡Gracias! Te vamos a responder a la brevedad." };
  } catch (e) {
    console.error("Falló el envío de contacto:", e);
    return {
      ok: false,
      mensaje:
        "No pudimos enviar el mensaje. Escribinos directamente a copat3d@aif.gob.ar.",
    };
  }
}
