"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enviarContacto, type EstadoContacto } from "@/actions/contacto";
import { WireMargins, WirePlus, WirePyramid } from "@/components/shapes/wire";
import { LIMITES } from "@/lib/validation";
import { EVENTO } from "@/lib/site";

const ESTADO_INICIAL: EstadoContacto = { ok: false };

/** Clases compartidas de los campos: si divergen, un input queda con otro
 *  foco o con otro borde y se nota enseguida. */
const CAMPO =
  "border-border bg-bg text-fg placeholder:text-muted/70 focus:border-magenta focus:ring-magenta/30 w-full rounded-xl border px-4 py-3 outline-none transition-colors duration-200 focus:ring-2";

/** Íconos del panel lateral. Mismo tratamiento que los servicios de la sede:
 *  el relleno vive solo en el ícono, la fila va sin caja propia. */
const ICONOS = {
  correo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3.5 7.5 8.5 6 8.5-6" />
    </>
  ),
  organiza: (
    <>
      <path d="M4 21V7l8-4 8 4v14" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  sede: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  cuando: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </>
  ),
};

function Boton() {
  // `useFormStatus` tiene que leerse desde un hijo del <form>, no desde el
  // mismo componente que lo renderiza: en el padre siempre devuelve false.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-magenta mt-7 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {pending ? "Enviando…" : "Enviar mensaje"}
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

function Dato({
  icono,
  etiqueta,
  children,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="bg-surface-2 text-accent-text grid size-11 shrink-0 place-items-center rounded-xl">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icono}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="text-muted block text-sm">{etiqueta}</span>
        <span className="mt-0.5 block font-semibold break-words">
          {children}
        </span>
      </span>
    </div>
  );
}

export function Contacto() {
  const [estado, accion] = useActionState(enviarContacto, ESTADO_INICIAL);
  const e = estado.errores ?? {};

  return (
    <section
      id="contacto"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <WireMargins className="hidden sm:block">
        <WirePlus
          size={104}
          tono="lilac"
          className="absolute top-[18%] -left-32"
        />
        <WirePyramid
          size={112}
          tono="yellow"
          className="absolute right-[-8rem] bottom-[16%]"
        />
      </WireMargins>

      <WireMargins className="sm:hidden">
        <WirePlus
          size={84}
          tono="lilac"
          className="absolute top-3 -left-8 opacity-70"
        />
      </WireMargins>

      <div className="sheet sheet-print max-w-2xl">
        <p className="text-accent-text font-mono text-xs font-medium tracking-[0.25em] uppercase">
          Contacto
        </p>
        <h2 className="mt-4 text-[clamp(2rem,6vw,3.5rem)]">Escribinos</h2>
        {/* Sin el correo acá: está en el panel de la derecha. Repetirlo en los
            dos lugares obliga a mantener dos copias del mismo dato y le resta
            peso al panel, que queda como un apéndice en vez de la referencia. */}
        <p className="text-muted mt-5 text-lg">
          ¿Querés participar, auspiciar el congreso o proponer una charla?
          Contanos de qué se trata y te respondemos a la brevedad.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-8">
        {/* El formulario va sobre una superficie propia y los campos sobre
            `--bg`: sin ese contraste, los inputs se confundían con el fondo de
            la sección y el bloque no se leía como una zona donde se hace algo,
            sino como más texto suelto.

            `noValidate`: la validación del navegador muestra burbujas nativas
            que no siguen la identidad ni se traducen bien. Los mismos límites
            se revalidan en el servidor con el esquema de `lib/validation.ts`. */}
        <form
          action={accion}
          noValidate
          className="sheet border-border bg-surface relative rounded-3xl rounded-br-none border p-6 sm:p-9"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="mb-2 block font-semibold">
                Nombre y apellido
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                maxLength={LIMITES.nombre}
                autoComplete="name"
                aria-invalid={!!e.nombre}
                aria-describedby={e.nombre ? "err-nombre" : undefined}
                className={CAMPO}
              />
              <MensajeError id="err-nombre" texto={e.nombre} />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block font-semibold">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={LIMITES.email}
                autoComplete="email"
                aria-invalid={!!e.email}
                aria-describedby={e.email ? "err-email" : undefined}
                className={CAMPO}
              />
              <MensajeError id="err-email" texto={e.email} />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="asunto" className="mb-2 block font-semibold">
              Asunto
            </label>
            <input
              id="asunto"
              name="asunto"
              type="text"
              maxLength={LIMITES.asunto}
              aria-invalid={!!e.asunto}
              aria-describedby={e.asunto ? "err-asunto" : undefined}
              className={CAMPO}
            />
            <MensajeError id="err-asunto" texto={e.asunto} />
          </div>

          <div className="mt-5">
            <label htmlFor="mensaje" className="mb-2 block font-semibold">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={6}
              maxLength={LIMITES.mensaje}
              aria-invalid={!!e.mensaje}
              aria-describedby={e.mensaje ? "err-mensaje" : undefined}
              className={`${CAMPO} resize-y`}
            />
            <MensajeError id="err-mensaje" texto={e.mensaje} />
          </div>

          {/* Honeypot. Fuera de pantalla en vez de `display:none` porque
              algunos bots saltean lo que está oculto; `aria-hidden` para que
              no lo anuncie un lector de pantalla y `tabIndex={-1}` para que
              nadie caiga adentro tabulando. */}
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

          {/* `role="status"` para que el lector de pantalla anuncie el
              resultado: sin esto, quien no ve la pantalla no se entera de si
              el mensaje salió o falló. */}
          {estado.mensaje && (
            <p
              role="status"
              className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                estado.ok
                  ? "border-copat-green-deep/50 text-copat-green-deep dark:text-copat-green"
                  : "border-magenta/50 text-accent-text"
              }`}
            >
              {estado.mensaje}
            </p>
          )}

          <p className="text-muted mt-6 text-sm leading-relaxed">
            Usamos tus datos únicamente para responderte. Ver la{" "}
            <a
              href="/privacidad"
              className="hover:text-fg underline underline-offset-4"
            >
              política de privacidad
            </a>
            .
          </p>
        </form>

        <aside className="sheet border-border bg-surface rounded-3xl rounded-tl-none border p-6 sm:p-9">
          <h3 className="font-display text-xl font-bold">Otros canales</h3>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Si preferís escribir desde tu propio correo, también llegás.
          </p>

          <div className="mt-7 space-y-6">
            <Dato icono={ICONOS.correo} etiqueta="Correo">
              <a
                href={`mailto:${EVENTO.email}`}
                className="hover:text-accent-text transition-colors"
              >
                {EVENTO.email}
              </a>
            </Dato>
            <Dato icono={ICONOS.organiza} etiqueta="Organiza">
              {EVENTO.organiza}
            </Dato>
            <Dato icono={ICONOS.sede} etiqueta="Sede">
              {EVENTO.sede} · {EVENTO.ciudad}
            </Dato>
            <Dato icono={ICONOS.cuando} etiqueta="Cuándo">
              2 y 3 de octubre de 2026
            </Dato>
          </div>
        </aside>
      </div>
    </section>
  );
}
