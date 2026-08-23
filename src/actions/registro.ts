"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { generarCodigoReserva, getPool } from "@/lib/db";
import { envResend } from "@/lib/env";
import { escaparHtml } from "@/lib/html";
import { crearLimitador } from "@/lib/rate-limit";
import { REGISTRO_HABILITADO } from "@/lib/site";
import {
  EDAD_MINIMA,
  calcularEdad,
  erroresPorCampo,
  esquemaRegistro,
} from "@/lib/validation";

/** Lo que la Server Action le devuelve al formulario. */
export type EstadoRegistro = {
  ok: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
  /** Presente solo cuando la inscripción se guardó. Es lo que se muestra en
   *  pantalla y lo que ya viaja por mail: la persona lo necesita para el
   *  día del evento, así que también queda en la respuesta por si el mail
   *  no llega. */
  codigoReserva?: string;
  /** Distingue el caso "sos menor de edad" del resto de los errores: la UI
   *  lo pinta como aviso informativo, no como un campo mal completado. */
  menorDeEdad?: boolean;
};

// Más generoso que el de contacto (3 cada 10 min): acá varias personas de
// una misma casa u oficina —misma IP pública— pueden estar anotándose a la
// vez, y el DNI único ya evita que una sola persona cargue de más.
const superaLimite = crearLimitador(10 * 60 * 1000, 5);

export async function registrarInscripcion(
  _previo: EstadoRegistro,
  datos: FormData,
): Promise<EstadoRegistro> {
  // Defensa en profundidad: el botón ni se muestra con el interruptor
  // apagado (ver RegistroForm.tsx), pero un POST se puede armar a mano
  // saltándose la UI. Ver src/lib/site.ts sobre por qué está apagado.
  if (!REGISTRO_HABILITADO) {
    return {
      ok: false,
      mensaje:
        "El registro todavía no está habilitado. Escribinos a copat3d@aif.gob.ar y te avisamos apenas abra.",
    };
  }

  const analizado = esquemaRegistro.safeParse({
    nombreApellido: datos.get("nombreApellido"),
    dni: datos.get("dni"),
    fechaNacimiento: datos.get("fechaNacimiento"),
    email: datos.get("email"),
    ciudad: datos.get("ciudad"),
    provincia: datos.get("provincia"),
    interes: datos.get("interes"),
    consentimiento: datos.get("consentimiento"),
    sitioWeb: datos.get("sitioWeb"),
  });

  if (!analizado.success) {
    return {
      ok: false,
      mensaje: "Revisá los datos marcados.",
      errores: erroresPorCampo(analizado.error),
    };
  }

  const {
    nombreApellido,
    dni,
    fechaNacimiento,
    email,
    ciudad,
    provincia,
    interes,
    sitioWeb,
  } = analizado.data;

  // Honeypot: ver el comentario en src/actions/contacto.ts — misma lógica,
  // se finge éxito para no delatarle la trampa al script. Sin código de
  // reserva: inventar uno que nunca va a existir en la base es peor que no
  // mostrar ninguno, para el caso raro de que un humano —un gestor de
  // contraseñas completando todo el formulario— caiga acá por error.
  if (sitioWeb?.trim()) {
    return {
      ok: true,
      mensaje: "¡Listo! Te mandamos el código de tu reserva por correo.",
    };
  }

  const cabeceras = await headers();
  const ip = cabeceras.get("x-forwarded-for")?.split(",")[0]?.trim() || "sin-ip";

  if (superaLimite(ip)) {
    return {
      ok: false,
      mensaje:
        "Recibimos varios intentos tuyos recién. Esperá unos minutos y volvé a intentar.",
    };
  }

  // No válido por sí solo el consentimiento de un menor (Ley 25.326). La
  // política definitiva todavía está abierta —D5 en docs/04-datos-y-legales,
  // urgente desde que DNI/fecha completa dejaron de ser opcionales—, así que
  // hasta que exista un flujo institucional, no se guarda un registro cuyo
  // consentimiento no sería válido.
  if (calcularEdad(fechaNacimiento) < EDAD_MINIMA) {
    return {
      ok: false,
      menorDeEdad: true,
      mensaje:
        "Para menores de 18 años, la inscripción la gestiona el colegio o la institución. Escribinos a copat3d@aif.gob.ar y coordinamos el registro grupal.",
    };
  }

  let codigo = generarCodigoReserva();
  let reintentosCodigo = 0;

  // `consentimiento_at` en el propio servidor, no confiado al cliente: es lo
  // que hace falta poder demostrar ante la AAIP si alguna vez se pide.
  const consentimientoAt = new Date();

  for (;;) {
    try {
      // getPool() DENTRO del try: si falta DATABASE_URL, tira sincrónico
      // (ver src/lib/env.ts) y sin el try alrededor la Server Action entera
      // explota con el error crudo de Next en vez de la respuesta prolija de
      // siempre. El catch de abajo no necesita distinguir el caso: cae al
      // mensaje genérico igual que cualquier otro fallo de base.
      const pool = getPool();
      await pool.query(
        `INSERT INTO inscripciones
           (codigo_reserva, nombre_apellido, dni, fecha_nacimiento, email,
            ciudad, provincia, interes, consentimiento, consentimiento_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)`,
        [
          codigo,
          nombreApellido,
          dni,
          fechaNacimiento,
          email,
          ciudad,
          provincia,
          interes ?? null,
          consentimientoAt,
        ],
      );
      break;
    } catch (error) {
      const pgError = error as { code?: string; constraint?: string };

      if (pgError.code === "23505") {
        if (pgError.constraint?.includes("dni")) {
          return {
            ok: false,
            mensaje:
              "Ya existe una inscripción con ese DNI. Si creés que es un error, escribinos a copat3d@aif.gob.ar.",
          };
        }
        // Choque de código de reserva: es un problema nuestro (probabilidad
        // ínfima), no del visitante. Se reintenta con un código nuevo en vez
        // de devolverle un error a alguien que no hizo nada mal.
        if (pgError.constraint?.includes("codigo_reserva") && reintentosCodigo < 3) {
          reintentosCodigo++;
          codigo = generarCodigoReserva();
          continue;
        }
      }

      console.error("Error al guardar la inscripción:", error);
      return {
        ok: false,
        mensaje:
          "No pudimos guardar tu inscripción. Probá de nuevo en un momento o escribinos a copat3d@aif.gob.ar.",
      };
    }
  }

  // El mail de confirmación NO puede tirar abajo una inscripción que ya
  // quedó guardada: si Resend falla, se loguea y se sigue. El código de
  // reserva vuelve igual en la respuesta, así la persona lo tiene aunque el
  // correo no llegue.
  try {
    const { apiKey, remitente } = envResend();
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: remitente,
      to: email,
      subject: `Tu inscripción a COPAT 3D — código ${codigo}`,
      html: `
        <h2>¡Gracias por inscribirte a COPAT 3D, ${escaparHtml(nombreApellido)}!</h2>
        <p>Tu código de reserva es:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:2px">${codigo}</p>
        <p>Guardalo: te lo vamos a pedir para acreditarte el día del evento.</p>
        <hr />
        <p><strong>Cuándo:</strong> 2 y 3 de octubre de 2026</p>
        <p><strong>Dónde:</strong> Fábrica de Talentos, Ushuaia, Tierra del Fuego</p>
        <hr />
        <p style="color:#666;font-size:13px">
          Tus datos se tratan conforme a la Ley 25.326. Más información en
          copat3d.com.ar/privacidad
        </p>
      `,
      text: `¡Gracias por inscribirte a COPAT 3D, ${nombreApellido}!

Tu código de reserva es: ${codigo}
Guardalo: te lo vamos a pedir para acreditarte el día del evento.

Cuándo: 2 y 3 de octubre de 2026
Dónde: Fábrica de Talentos, Ushuaia, Tierra del Fuego

Tus datos se tratan conforme a la Ley 25.326. Más información en
copat3d.com.ar/privacidad`,
    });
  } catch (error) {
    console.error("La inscripción se guardó pero falló el mail de confirmación:", error);
  }

  return {
    ok: true,
    mensaje: "¡Listo! Te mandamos el código de tu reserva por correo.",
    codigoReserva: codigo,
  };
}
