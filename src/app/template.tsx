import { SheetMotion } from "@/components/SheetMotion";

/**
 * Transición de hoja entre vistas.
 *
 * A diferencia de layout.tsx, Next remonta template.tsx en cada navegación,
 * así que la animación de entrada se dispara sola en cada cambio de ruta y
 * SheetMotion vuelve a observar las secciones de la vista nueva.
 *
 * Se eligió esta vía y no la View Transitions API de React porque
 * <ViewTransition> todavía no existe en React 19.2 estable ni hay flag
 * experimental en Next 16.3 — solo está en canary. Esto funciona en todos
 * los navegadores hoy y degrada solo a un fade si hay reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper relative flex min-h-full flex-1 flex-col">
      <SheetMotion />
      {children}
    </div>
  );
}
