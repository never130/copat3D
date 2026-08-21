import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="text-accent-text dark:text-white">
            {/* El wordmark ya trae "COPAT 3D" dibujado: no repetirlo en texto. */}
            <Logo className="h-10 w-auto" />
          </div>
          <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
            Congreso Patagónico de Impresión 3D, Fabricación Digital e
            Innovación Aplicada. Organizado por la Agencia de Innovación
            Fueguina.
          </p>
          <p className="font-display mt-5 text-lg font-bold italic">
            Diseñando el futuro capa a capa
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold tracking-wide uppercase">
            El congreso
          </h4>
          {/* Los links van en bloque con padding propio: como texto suelto
              medían 17px de alto, por debajo de los 24px que pide la WCAG
              2.5.8 (AA) para un objetivo táctil que no es texto dentro de una
              oración. Con `py-2.5` quedan en ~37px.

              El `-my-2.5` de la lista devuelve el espacio que agrega el
              padding, para que el pie no se estire. */}
          <ul className="text-muted mt-4 -my-2.5 space-y-0 text-sm">
            <li>
              <a
                href="#ejes"
                className="hover:text-fg block py-2.5 transition-colors"
              >
                Ejes temáticos
              </a>
            </li>
            <li>
              <a
                href="#agenda"
                className="hover:text-fg block py-2.5 transition-colors"
              >
                Agenda
              </a>
            </li>
            <li>
              <a
                href="#empresas"
                className="hover:text-fg block py-2.5 transition-colors"
              >
                Empresas
              </a>
            </li>
            <li>
              <a
                href="#registro"
                className="hover:text-fg block py-2.5 transition-colors"
              >
                Inscripción
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold tracking-wide uppercase">
            Contacto
          </h4>
          <ul className="text-muted mt-4 -my-2.5 space-y-0 text-sm">
            <li>
              <a
                href="mailto:copat3d@aif.gob.ar"
                className="hover:text-fg block py-2.5 transition-colors"
              >
                copat3d@aif.gob.ar
              </a>
            </li>
            <li className="py-2.5">Ushuaia, Tierra del Fuego</li>
            <li className="py-2.5">2 y 3 de octubre de 2026</li>
            <li>
              <Link
                href="/privacidad"
                className="hover:text-fg block py-2.5 transition-colors"
              >
                Política de privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-border text-muted border-t px-5 py-6 text-center text-xs">
        © {new Date().getFullYear()} COPAT 3D · Agencia de Innovación Fueguina ·
        Gobierno de Tierra del Fuego AeIAS
      </div>
    </footer>
  );
}
