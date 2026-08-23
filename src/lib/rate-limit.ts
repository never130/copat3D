/**
 * Límite de envíos por ventana de tiempo, en memoria.
 *
 * ⚠️ **Esto es un badén, no un portón.** En Vercel cada instancia serverless
 * tiene su propia memoria y se recicla, así que el contador ni se comparte
 * entre instancias ni sobrevive a un arranque en frío. Frena el reenvío
 * accidental y al script perezoso; no frena a alguien decidido.
 *
 * Para un límite real hace falta un almacén compartido (Upstash Redis es lo
 * habitual con Vercel). Es un servicio más y una cuenta más, así que queda
 * como decisión a tomar, no algo que se agrega por cuenta propia.
 *
 * Cada Server Action que lo usa crea SU PROPIO limitador (una llamada a
 * `crearLimitador`, guardada en una constante de módulo): así el formulario
 * de contacto y el de registro cuentan por separado, y enviar uno no consume
 * el margen del otro.
 */
export function crearLimitador(ventanaMs: number, maxPorVentana: number) {
  const envios = new Map<string, number[]>();

  return function superaLimite(clave: string): boolean {
    const ahora = Date.now();
    const previos = (envios.get(clave) ?? []).filter(
      (t) => ahora - t < ventanaMs,
    );

    if (previos.length >= maxPorVentana) {
      envios.set(clave, previos);
      return true;
    }

    previos.push(ahora);
    envios.set(clave, previos);

    // Poda: sin esto el Map crece sin techo mientras viva la instancia.
    if (envios.size > 500) {
      for (const [k, v] of envios) {
        if (v.every((t) => ahora - t >= ventanaMs)) envios.delete(k);
      }
    }
    return false;
  };
}
