/** Escapa texto antes de interpolarlo en el HTML de un mail.
 *
 * Lo usan las dos Server Actions que arman mails a mano con datos que
 * escribe el visitante (contacto y registro): sin esto, un nombre o mensaje
 * con `<script>` o etiquetas sueltas rompe o altera el correo que llega del
 * otro lado. Un solo lugar para esto, no una copia por acción — así una
 * corrección (agregar `'` al set de caracteres, por ejemplo) se aplica una
 * vez y no se olvida en la segunda copia. */
export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
