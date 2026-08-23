/**
 * Agenda del congreso: charlas, talleres y demostraciones.
 *
 * El contenido vive versionado en TypeScript, no en un CMS — ver
 * docs/03-arquitectura.md sobre por qué (un solo evento, ~30 charlas, un CMS
 * agregaría infraestructura y un punto de falla a cambio de comodidad que se
 * usa cinco veces).
 *
 * ⚠️ **Las actividades de acá abajo son de EJEMPLO.** Están para que la
 * página se pueda construir y probar antes de tener el cronograma real. Se
 * reemplazan enteras cuando la AIF confirme speakers y horarios; mientras
 * `AGENDA_CONFIRMADA` siga en `false`, la página muestra el estado
 * "Próximamente" y estos datos no se publican.
 */

import type { Eje } from "@/content/ejes";

/**
 * Interruptor de publicación de la agenda.
 *
 * En `false` la página muestra el placeholder diseñado y NO se ve ninguna
 * actividad, aunque el array de abajo tenga contenido. Es lo que permite
 * cargar el cronograma de a poco —a medida que los speakers confirman— sin
 * publicar una agenda a medio armar.
 *
 * Es una constante de código y no una variable de entorno a propósito:
 * pasarla a `true` debería ser una decisión revisada en un commit, no un
 * cambio silencioso en un panel.
 */
export const AGENDA_CONFIRMADA = false;

export type Actividad = {
  id: string;
  /** Formato 24hs, `HH:MM`. Se usa tal cual para mostrar y para ordenar:
   *  con dos dígitos siempre, el orden alfabético es el orden real. */
  desde: string;
  hasta: string;
  titulo: string;
  /** 2 o 3 líneas de qué trata. Opcional: los bloques de agenda que no son
   *  charlas (acreditación, café, cierre) no lo necesitan. */
  descripcion?: string;
  /** Eje temático, según `src/content/ejes.ts`. Opcional por lo mismo: un
   *  break no pertenece a ningún eje. */
  ejeId?: Eje["id"];
  /** Quién la da. Ausente en los bloques que no son charlas. */
  orador?: {
    nombre: string;
    /** Cargo y organización juntos, como se lee: "Investigadora, INTI". */
    cargo: string;
    /** Ruta en `public/speakers/`. Sin foto, la tarjeta muestra las
     *  iniciales sobre el acento del eje — no un ícono genérico de persona. */
    foto?: string;
    /** 1 o 2 líneas. Solo para quienes lo manden; no es obligatorio. */
    bio?: string;
  };
  /** Solo si hay actividades en paralelo. Si el congreso corre en una sola
   *  sala, se omite y la página no muestra la columna. */
  sala?: string;
};

export type DiaAgenda = {
  id: string;
  /** ISO `YYYY-MM-DD`. Sirve para ordenar y para el JSON-LD si algún día se
   *  publica cada charla como sub-evento. */
  fecha: string;
  /** Cómo se muestra: "Jueves 2 de octubre". */
  etiqueta: string;
  /** Una línea sobre el foco del día, para el encabezado de la columna. */
  resumen: string;
  actividades: Actividad[];
};

export const AGENDA: DiaAgenda[] = [
  {
    id: "dia-1",
    fecha: "2026-10-02",
    etiqueta: "Jueves 2 de octubre",
    resumen: "Apertura, ejes de salud e industria",
    actividades: [
      {
        id: "d1-acreditacion",
        desde: "08:30",
        hasta: "09:00",
        titulo: "Acreditación",
      },
      {
        id: "d1-apertura",
        desde: "09:00",
        hasta: "09:30",
        titulo: "Apertura del congreso",
        descripcion:
          "Palabras de bienvenida de las autoridades de la Agencia de Innovación Fueguina.",
      },
      {
        id: "d1-ejemplo-salud",
        desde: "09:30",
        hasta: "10:30",
        titulo: "Título de la charla de ejemplo",
        descripcion:
          "Descripción de ejemplo de dos o tres líneas sobre de qué trata la charla y qué se lleva quien la escucha.",
        ejeId: "salud",
        orador: {
          nombre: "Nombre Apellido",
          cargo: "Cargo, Organización",
        },
      },
    ],
  },
  {
    id: "dia-2",
    fecha: "2026-10-03",
    etiqueta: "Viernes 3 de octubre",
    resumen: "Construcción, talento y cierre",
    actividades: [
      {
        id: "d2-ejemplo-industria",
        desde: "09:30",
        hasta: "10:30",
        titulo: "Título de la charla de ejemplo",
        descripcion:
          "Descripción de ejemplo de dos o tres líneas sobre de qué trata la charla y qué se lleva quien la escucha.",
        ejeId: "industria",
        orador: {
          nombre: "Nombre Apellido",
          cargo: "Cargo, Organización",
        },
      },
      {
        id: "d2-cierre",
        desde: "17:00",
        hasta: "18:00",
        titulo: "Cierre y conclusiones",
      },
    ],
  },
];

/** Iniciales para el caso sin foto: "Ana María Pérez" → "AP". Toma la
 *  primera y la última palabra, no las dos primeras: con nombres compuestos
 *  ("Ana María") las dos primeras darían "AM" en vez del apellido. */
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
