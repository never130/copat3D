"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registrarInscripcion, type EstadoRegistro } from "@/actions/registro";
import { EJES } from "@/content/ejes";
import { LIMITES_REGISTRO, PROVINCIAS } from "@/lib/validation";

const ESTADO_INICIAL: EstadoRegistro = { ok: false };

/** Mismas clases que el formulario de contacto: si divergen, un input queda
 *  con otro foco o con otro borde y se nota enseguida. */
const CAMPO =
  "border-border bg-bg text-fg placeholder:text-muted/70 hover:border-muted/40 focus:border-magenta focus:ring-magenta/30 w-full rounded-xl border px-4 py-3 outline-none transition-colors duration-200 focus:ring-2";

function Boton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-magenta mt-2 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {pending ? "Enviando…" : "Confirmar inscripción"}
    </button>
  );
}

function MensajeError({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="text-accent-text mt-1.5 text-sm font-medium">
      {texto}
    </p>
  );
}

/** Panel de éxito: reemplaza el formulario entero. El código de reserva es
 *  lo único que la persona necesita el día del evento, así que va grande y
 *  fácil de recortar en una captura de pantalla. */
function PanelExito({ estado }: { estado: EstadoRegistro }) {
  return (
    <div
      role="status"
      className="border-border bg-surface rounded-3xl rounded-br-none border p-8 text-center sm:p-12"
    >
      <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
        Inscripción confirmada
      </p>
      <h3 className="font-display mt-3 text-2xl font-bold">
        {estado.mensaje}
      </h3>

      {estado.codigoReserva && (
        <>
          <p className="text-muted mt-6 text-sm">Tu código de reserva</p>
          {/* text-accent-text: mismo token que usa el resto del sitio para
              acento sobre superficie clara/oscura con contraste AA (trampa 8
              de AGENTS.md) — no un color de marca puesto a mano. */}
          <p className="font-display text-accent-text mt-1 text-4xl font-black tracking-[0.15em]">
            {estado.codigoReserva}
          </p>
          <p className="text-muted mx-auto mt-4 max-w-sm text-sm leading-relaxed">
            Te lo mandamos también por correo. Vas a necesitarlo para
            acreditarte el 2 de octubre.
          </p>
        </>
      )}
    </div>
  );
}

export function RegistroForm() {
  const [estado, accion] = useActionState(registrarInscripcion, ESTADO_INICIAL);
  const e = estado.errores ?? {};

  if (estado.ok) {
    return <PanelExito estado={estado} />;
  }

  return (
    <form
      action={accion}
      noValidate
      className="border-border bg-surface relative rounded-3xl rounded-br-none border p-6 sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombreApellido" className="mb-2 block font-semibold">
            Nombre y apellido
          </label>
          <input
            id="nombreApellido"
            name="nombreApellido"
            type="text"
            maxLength={LIMITES_REGISTRO.nombreApellido}
            autoComplete="name"
            aria-invalid={!!e.nombreApellido}
            aria-describedby={e.nombreApellido ? "err-nombreApellido" : undefined}
            className={CAMPO}
          />
          <MensajeError id="err-nombreApellido" texto={e.nombreApellido} />
        </div>

        <div>
          <label htmlFor="dni" className="mb-2 block font-semibold">
            DNI
          </label>
          <input
            id="dni"
            name="dni"
            type="text"
            inputMode="numeric"
            placeholder="Sin puntos"
            maxLength={10}
            aria-invalid={!!e.dni}
            aria-describedby={e.dni ? "err-dni" : undefined}
            className={CAMPO}
          />
          <MensajeError id="err-dni" texto={e.dni} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fechaNacimiento" className="mb-2 block font-semibold">
            Fecha de nacimiento
          </label>
          <input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            autoComplete="bday"
            max={new Date().toISOString().split("T")[0]}
            aria-invalid={!!e.fechaNacimiento}
            aria-describedby={e.fechaNacimiento ? "err-fechaNacimiento" : undefined}
            className={CAMPO}
          />
          <MensajeError id="err-fechaNacimiento" texto={e.fechaNacimiento} />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-semibold">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={LIMITES_REGISTRO.email}
            autoComplete="email"
            aria-invalid={!!e.email}
            aria-describedby={e.email ? "err-email" : undefined}
            className={CAMPO}
          />
          <MensajeError id="err-email" texto={e.email} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ciudad" className="mb-2 block font-semibold">
            Ciudad
          </label>
          <input
            id="ciudad"
            name="ciudad"
            type="text"
            maxLength={LIMITES_REGISTRO.ciudad}
            autoComplete="address-level2"
            aria-invalid={!!e.ciudad}
            aria-describedby={e.ciudad ? "err-ciudad" : undefined}
            className={CAMPO}
          />
          <MensajeError id="err-ciudad" texto={e.ciudad} />
        </div>

        <div>
          <label htmlFor="provincia" className="mb-2 block font-semibold">
            Provincia
          </label>
          <select
            id="provincia"
            name="provincia"
            defaultValue=""
            autoComplete="address-level1"
            aria-invalid={!!e.provincia}
            aria-describedby={e.provincia ? "err-provincia" : undefined}
            className={CAMPO}
          >
            <option value="" disabled>
              Seleccioná una provincia
            </option>
            {PROVINCIAS.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>
          <MensajeError id="err-provincia" texto={e.provincia} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="interes" className="mb-2 block font-semibold">
          Eje de mayor interés{" "}
          <span className="text-muted font-normal">(opcional)</span>
        </label>
        <select
          id="interes"
          name="interes"
          defaultValue=""
          className={CAMPO}
        >
          <option value="">Preferís no decir</option>
          {EJES.map((eje) => (
            <option key={eje.id} value={eje.id}>
              {eje.titulo}
            </option>
          ))}
        </select>
      </div>

      {/* ⚠️ Texto BORRADOR — pendiente de validar por legales de la AIF
          (D3 en docs/04-datos-y-legales.md). No es el texto definitivo:
          es el que permite tener el formulario listo y probado para
          publicarlo apenas ese texto cierre. */}
      <div className="border-border bg-surface-2 mt-6 rounded-xl border p-4">
        <label htmlFor="consentimiento" className="flex items-start gap-3">
          <input
            id="consentimiento"
            name="consentimiento"
            type="checkbox"
            aria-invalid={!!e.consentimiento}
            aria-describedby={
              e.consentimiento ? "err-consentimiento" : undefined
            }
            className="border-border accent-magenta mt-1 size-4 shrink-0 rounded"
          />
          <span className="text-sm leading-relaxed">
            Presto mi consentimiento libre, expreso e informado para que la
            Agencia de Innovación Fueguina (AIF) trate mis datos personales
            con la finalidad exclusiva de gestionar mi inscripción y
            acreditación al congreso COPAT 3D. Los datos no serán cedidos a
            terceros sin mi consentimiento previo. Podré ejercer mis derechos
            de acceso, rectificación y supresión conforme a la Ley 25.326
            escribiendo a copat3d@aif.gob.ar. Ver la{" "}
            <a
              href="/privacidad"
              className="hover:text-fg underline underline-offset-4"
            >
              política de privacidad
            </a>
            .
          </span>
        </label>
        <MensajeError id="err-consentimiento" texto={e.consentimiento} />
      </div>

      {/* Honeypot — mismo mecanismo que en el formulario de contacto. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="sitioWeb">No completes este campo</label>
        <input
          id="sitioWeb"
          name="sitioWeb"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Boton />

      {/* Caso especial: menor de edad. Se pinta distinto de un error de
          campo —no es un dato mal escrito, es una regla del sistema— con el
          mismo tono neutro que usan los estados "Próximamente" del sitio. */}
      {estado.mensaje && !estado.ok && (
        <p
          role="status"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            estado.menorDeEdad
              ? "border-border bg-surface-2 text-fg"
              : "border-magenta/50 text-accent-text"
          }`}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
