import { NavbarSentinel } from "@/components/layout/NavbarSentinel";
import { Contacto } from "@/components/sections/Contacto";
import { Ejes } from "@/components/sections/Ejes";
import { Hero } from "@/components/sections/Hero";
import { Sede } from "@/components/sections/Sede";
import { Sponsors } from "@/components/sections/Sponsors";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="relative">
        <Hero />

        {/* Todo el contenido posterior es UNA hoja que se desliza sobre el
            hero fijo. No dividir en varias: la gracia del efecto es que
            pase una página entera, no cada sección por separado. */}
        <div className="paper-page">
          <NavbarSentinel />
          <Ejes />
          <Sede />
          <Sponsors />
          <Contacto />
        </div>
      </div>
    </main>
  );
}
