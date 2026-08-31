/**
 * Sede del congreso.
 * Ver docs/03-arquitectura.md — el contenido vive versionado en TS, no en un CMS.
 */

export type Servicio = {
  id: string;
  titulo: string;
  detalle: string;
};

export const SEDE = {
  nombre: "Fábrica de Talentos",
  calle: "Av. Maipú 1255",
  ciudad: "Ushuaia",
  provincia: "Tierra del Fuego",
  /** Dirección completa, tal como se manda a Google Maps. */
  direccion: "Av. Maipú 1255, Ushuaia, Tierra del Fuego, Argentina",
} as const;

export const SERVICIOS: Servicio[] = [
  {
    id: "wifi",
    titulo: "Wifi gratuito",
    detalle: "En todo el predio",
  },
  {
    id: "estacionamiento",
    titulo: "Estacionamiento",
    detalle: "Disponible en la sede",
  },
  {
    id: "accesibilidad",
    titulo: "Accesibilidad",
    detalle: "Acceso para personas con movilidad reducida",
  },
];
