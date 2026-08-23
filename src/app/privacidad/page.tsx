import type { Metadata } from "next";
import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { PageHeader } from "@/components/layout/PageHeader";
import { EVENTO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata COPAT 3D los datos personales de quienes visitan el sitio y escriben por el formulario de contacto. Ley 25.326.",
  alternates: { canonical: "/privacidad" },
};

/**
 * ⚠️ BORRADOR TÉCNICO — REQUIERE VALIDACIÓN DEL ÁREA LEGAL DE LA AIF.
 *
 * Cubre la estructura que exige la Ley 25.326 y describe **lo que el sitio
 * hace hoy**: formulario de contacto, mapa embebido, y —desde el 23/8/2026—
 * el registro de inscriptos, con los datos confirmados por gestión (sin
 * cesión a sponsors, sin registro individual de menores). Es la sección que
 * `docs/04-datos-y-legales.md` exige agregar antes de recolectar el primer
 * dato real, y ya está agregada.
 *
 * No publicar como definitivo sin que legales lo revise. Ver
 * docs/04-datos-y-legales.md
 */

/** Fecha de la última revisión del texto. Constante y no `new Date()`: con la
 *  fecha calculada, la página diría "actualizada hoy" para siempre, aunque el
 *  texto lleve meses sin tocarse. */
const ULTIMA_ACTUALIZACION = "23 de agosto de 2026";

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sheet mt-12 first:mt-0">
      <h2 className="font-display text-2xl font-bold">{titulo}</h2>
      <div className="text-muted mt-4 space-y-4 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Ley 25.326"
        titulo="Política de privacidad"
        bajada={`Cómo tratamos los datos personales de quienes visitan ${EVENTO.nombre} y se comunican con nosotros.`}
      />

      <NavbarSentinel />

      <div className="overflow-x-clip">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <p className="text-muted text-sm">
            Última actualización: {ULTIMA_ACTUALIZACION}
          </p>

          <div className="mt-12">
            <Seccion titulo="1. Quién es responsable de tus datos">
              <p>
                El responsable del tratamiento es la{" "}
                <strong className="text-fg">{EVENTO.organiza}</strong>, organismo
                del Gobierno de la Provincia de Tierra del Fuego, Antártida e
                Islas del Atlántico Sur, organizadora del congreso{" "}
                {EVENTO.nombre}.
              </p>
              <p>
                Podés contactarnos por cualquier cuestión vinculada a tus datos
                personales escribiendo a{" "}
                <a
                  href={`mailto:${EVENTO.email}`}
                  className="text-accent-text font-semibold underline underline-offset-4"
                >
                  {EVENTO.email}
                </a>
                .
              </p>
            </Seccion>

            <Seccion titulo="2. Qué datos recolectamos">
              <p>
                Depende del formulario que uses:
              </p>
              <p>
                <strong className="text-fg">Formulario de contacto:</strong>{" "}
                nombre y apellido, correo electrónico, asunto y el mensaje que
                redactás.
              </p>
              <p>
                <strong className="text-fg">Inscripción al congreso:</strong>{" "}
                nombre y apellido, DNI, fecha de nacimiento, correo
                electrónico, ciudad y provincia. El eje temático de mayor
                interés es opcional. Pedimos DNI y fecha de nacimiento
                completos —no un dato parcial ni un rango— porque son
                necesarios para la acreditación en el evento; ver la sección 5
                para cuánto tiempo se conservan.
              </p>
              <p>
                <strong className="text-fg">
                  El registro individual está reservado a mayores de 18 años.
                </strong>{" "}
                Si sos menor de edad y querés participar, escribinos a{" "}
                <a
                  href={`mailto:${EVENTO.email}`}
                  className="text-accent-text font-semibold underline underline-offset-4"
                >
                  {EVENTO.email}
                </a>{" "}
                para coordinar la inscripción a través de tu colegio o
                institución.
              </p>
              <p>
                No pedimos ni almacenamos datos sensibles, no usamos cookies de
                seguimiento propias y no creamos perfiles publicitarios.
              </p>
            </Seccion>

            <Seccion titulo="3. Para qué los usamos">
              <p>
                Únicamente para <strong className="text-fg">leer y responder
                tu consulta</strong>. No los usamos para enviarte publicidad ni
                comunicaciones que no hayas pedido.
              </p>
              <p>
                Si en el futuro quisiéramos darles otro uso, necesitaríamos
                pedirte un consentimiento nuevo y específico para eso.
              </p>
            </Seccion>

            <Seccion titulo="4. Con quién los compartimos">
              <p>
                <strong className="text-fg">No cedemos tus datos a terceros</strong>,
                ni a empresas auspiciantes ni a ninguna otra organización.
              </p>
              <p>
                Para hacer llegar tu mensaje a nuestra casilla, y para
                mandarte el código de reserva si te inscribís, usamos un
                proveedor de envío de correo (Resend). Los datos de
                inscripción se guardan en una base de datos (Neon). Los dos
                actúan únicamente como intermediarios técnicos y procesan los
                datos en servidores fuera de la Argentina. Toda la conexión
                viaja cifrada.
              </p>
              <p>
                La sección de sede incluye un mapa embebido de Google Maps. Al
                cargarse, Google puede registrar tu dirección IP y datos de tu
                navegador conforme a sus propias políticas. El mapa se carga de
                forma diferida: si no llegás a esa parte de la página, no se
                establece la conexión.
              </p>
            </Seccion>

            <Seccion titulo="5. Cuánto tiempo los conservamos">
              <p>
                Conservamos los mensajes de contacto y los datos de
                inscripción por el tiempo necesario para gestionar el
                congreso, y como máximo{" "}
                <strong className="text-fg">
                  doce meses posteriores a la realización del congreso
                </strong>
                . Cumplido ese plazo, los datos que identifican a cada persona
                se eliminan; puede conservarse información agregada sin
                identificar a nadie (por ejemplo, cuántos inscriptos hubo por
                ciudad) con fines estadísticos.
              </p>
            </Seccion>

            <Seccion titulo="6. Tus derechos">
              <p>
                Podés solicitar en cualquier momento el{" "}
                <strong className="text-fg">acceso, la rectificación, la
                actualización o la supresión</strong> de tus datos personales
                escribiendo a{" "}
                <a
                  href={`mailto:${EVENTO.email}`}
                  className="text-accent-text font-semibold underline underline-offset-4"
                >
                  {EVENTO.email}
                </a>
                . Para resguardar tus datos podemos pedirte que acredites tu
                identidad antes de responder.
              </p>

              {/* Cláusula de inclusión obligatoria (art. 14 inc. 3 y su
                  reglamentación). Va destacada y no enterrada en el cuerpo. */}
              <blockquote className="border-magenta/50 text-fg mt-6 border-l-4 pl-5 text-sm italic">
                El titular de los datos personales tiene la facultad de ejercer
                el derecho de acceso a los mismos en forma gratuita a intervalos
                no inferiores a seis meses, salvo que se acredite un interés
                legítimo al efecto conforme lo establecido en el artículo 14,
                inciso 3 de la Ley N.º 25.326.
              </blockquote>

              <p className="mt-6">
                La Agencia de Acceso a la Información Pública, en su carácter de
                autoridad de aplicación de la Ley N.º 25.326, tiene la atribución
                de atender las denuncias y reclamos que interpongan quienes
                resulten afectados en sus derechos por incumplimiento de las
                normas vigentes en materia de protección de datos personales.
              </p>
            </Seccion>

            <Seccion titulo="7. Seguridad">
              <p>
                El sitio se sirve íntegramente por conexión cifrada (HTTPS). Las
                credenciales de acceso a los servicios se guardan como variables
                de entorno y nunca en el código. El acceso a los mensajes
                recibidos queda limitado al personal de la AIF que necesita
                leerlos para responder.
              </p>
            </Seccion>

            <Seccion titulo="8. Cambios en esta política">
              <p>
                Si modificamos esta política vamos a actualizar la fecha del
                encabezado. Cuando el cambio afecte de manera sustancial cómo
                tratamos tus datos, lo vamos a informar de forma visible en el
                sitio.
              </p>
            </Seccion>
          </div>
        </div>
      </div>
    </main>
  );
}
