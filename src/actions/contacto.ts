"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { envResend } from "@/lib/env";
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

/**
 * Contador en memoria del proceso.
 *
 * ⚠️ **Esto es un badén, no un portón.** En Vercel cada instancia serverless
 * tiene su propia memoria y se recicla, así que el contador ni se comparte
 * entre instancias ni sobrevive a un arranque en frío. Frena el reenvío
 * accidental y al script perezoso; no frena a alguien decidido.
 *
 * Para un límite real hace falta un almacén compartido (Upstash Redis es lo
 * habitual con Vercel). Es un servicio más y una cuenta más, así que queda
 * como decisión a tomar, no algo que agrego por mi cuenta. Mientras tanto, el
 * honeypot del esquema cubre el grueso del spam automatizado.
 */
const envios = new Map<string, number[]>();

function superaLimite(clave: string): boolean {
  const ahora = Date.now();
  const previos = (envios.get(clave) ?? []).filter((t) => ahora - t < VENTANA_MS);

  if (previos.length >= MAX_POR_VENTANA) {
    envios.set(clave, previos);
    return true;
  }

  previos.push(ahora);
  envios.set(clave, previos);

  // Poda: sin esto el Map crece sin techo mientras viva la instancia.
  if (envios.size > 500) {
    for (const [k, v] of envios) {
      if (v.every((t) => ahora - t >= VENTANA_MS)) envios.delete(k);
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */

/** Escapa el contenido del visitante antes de interpolarlo en el HTML del
 *  mail. Sin esto, un mensaje con `<script>` o con etiquetas sueltas rompe o
 *  altera el correo que le llega a la AIF. */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
        <p><strong>Nombre:</strong> ${escapar(nombre)}</p>
        <p><strong>Correo:</strong> ${escapar(email)}</p>
        <p><strong>Asunto:</strong> ${escapar(asunto)}</p>
        <hr />
        <p style="white-space:pre-wrap">${escapar(mensaje)}</p>
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
