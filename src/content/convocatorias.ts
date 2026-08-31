/**
 * Convocatorias abiertas por la AIF en paralelo al congreso.
 *
 * El contenido vive versionado en TypeScript, no en un CMS.
 * Ver docs/03-arquitectura.md
 *
 * Lo consumen tres lugares, y por eso vive acá y no dentro de una página:
 * la sección de la portada (resumen), `/convocatorias` (detalle) y
 * `/bases-secundarios` (el cronograma del concurso).
 */

import type { Acento } from "@/components/ui/acentos";

export type Enlace = {
  texto: string;
  href?: string;
  /** Ruta propia del sitio: se navega con `next/link`, no con `<a target>`. */
  interno?: boolean;
  /** El CTA que la persona vino a apretar. Uno solo por convocatoria. */
  principal?: boolean;
};

export type Convocatoria = {
  id: string;
  numero: string;
  titulo: string;
  detalle: string;
  /**
   * Estado en una línea, para la portada: es lo que decide si alguien se
   * apura o no. Va separado de `datos` porque en la home se muestra solo
   * esto, sin la ficha completa.
   */
  estado: string;
  color: Acento;
  /** Lo que hay que saber ANTES de abrir el formulario. */
  datos: { rotulo: string; valor: string }[];
  enlaces: Enlace[];
};

/**
 * Cronograma de "Diseñando el Futuro — Capa a Capa", transcrito palabra por
 * palabra del PDF de bases (punto 7). Vive acá y no dentro de
 * `/bases-secundarios` porque lo muestran las dos páginas: el documento
 * formal y el resumen de `/convocatorias`.
 *
 * ⚠️ EL PDF SE CONTRADICE CON LA FECHA DE INICIO DE LA INSCRIPCIÓN, y las dos
 * versiones están publicadas en el sitio porque las dos son fieles al
 * original:
 *
 * - Punto 5 ("Inscripción"): "del 31 de agosto al 7 de septiembre de 2026".
 *   Es la que sale en los `datos` de la convocatoria y en el punto 5 de
 *   /bases-secundarios.
 * - Punto 7 (este cronograma): "1 al 7 de septiembre".
 *
 * Difieren en el arranque: 31 de agosto contra 1 de septiembre. El cierre —7
 * de septiembre— sí coincide en los dos lados, así que el estado que se
 * muestra en la portada no está en duda.
 *
 * NO unificar por cuenta propia: hay que preguntarle a la AIF cuál vale.
 * Mientras tanto se transcribe lo que dice el documento oficial en cada
 * punto, que es lo defendible si alguien reclama por la fecha.
 */
export const CRONOGRAMA_SECUNDARIOS = [
  {
    fecha: "1 al 7 de septiembre",
    instancia: "Inscripción de equipos mediante formulario en línea.",
  },
  {
    fecha: "8 al 20 de septiembre",
    instancia: "Presentación del proyecto (MVP).",
  },
  {
    fecha: "21 al 25 de septiembre",
    instancia: "Etapa de revisión técnica y selección por parte del jurado.",
  },
  { fecha: "29 de septiembre", instancia: "Anuncio oficial de los ganadores." },
];

export const CONVOCATORIAS: Convocatoria[] = [
  {
    id: "secundarios",
    numero: "01",
    // Nombre de fantasía del concurso (31/8/2026). El nombre formal que usa
    // el PDF de bases es "Concurso de Proyectos de Impresión 3D · Nivel
    // Secundario", y ahí se conserva: el documento es el que vale si alguien
    // reclama, así que no se le cambia el encabezado.
    //
    // ⚠️ Colisiona con el eslogan de la marca —"Diseñando el futuro capa a
    // capa", en el pie de todas las páginas—, así que el mismo texto nombra
    // dos cosas distintas en el sitio.
    titulo: "Diseñando el Futuro - Capa a Capa",
    detalle:
      "Equipos de colegios secundarios que diseñan y fabrican un proyecto con impacto real en su comunidad.",
    estado: "Inscripción abierta hasta el 7 de septiembre",
    color: "copat-green",
    datos: [
      { rotulo: "Quiénes", valor: "Colegios de Río Grande, Ushuaia y Tolhuin" },
      { rotulo: "Equipo", valor: "7 estudiantes y 1 docente responsable" },
      { rotulo: "Inscripción", valor: "Del 31 de agosto al 7 de septiembre" },
      { rotulo: "Premio", valor: "$1.500.000 + insumos, uno por ciudad" },
    ],
    enlaces: [
      {
        texto: "Bases y condiciones",
        // Ruta PLANA (no /convocatorias/bases-secundarios): ver trampa 21 de
        // AGENTS.md — anidarla bajo /convocatorias rompía el pase de hojas al
        // llegar por navegación interna.
        href: "/bases-secundarios",
        interno: true,
      },
      {
        texto: "Inscribirme",
        principal: true,
        // ⚠️ Publicado a pedido expreso (31/8/2026) aunque el Form todavía
        // devuelve 401: sigue compartido solo para personas puntuales, no
        // para "cualquiera con el enlace". Va con `/viewform` y NO con el
        // `/edit` que mandó la AIF, que son dos cosas distintas: con
        // `/viewform` quien no tenga acceso ve la pantalla de "solicitar
        // acceso" de Google y el link empieza a funcionar solo en cuanto
        // cambien el permiso; con `/edit` habría caído en el EDITOR del
        // formulario, pudiendo alterar las preguntas del concurso.
        href: "https://docs.google.com/forms/d/1N-e6iysCyvojYqatUm0Clf71kIxsIbCQn3ukSx6hges/viewform",
      },
    ],
  },
  {
    id: "emprendedores",
    numero: "02",
    titulo: "Registro de Emprendedores",
    // "o quieren incorporarlas" no es relleno: el formulario dice
    // literalmente "que utilizan O DESEAN INCORPORAR" esas tecnologías.
    // Decir "que ya trabajan con" dejaba afuera a quien está por arrancar,
    // que es parte del público que la convocatoria busca.
    detalle:
      "Emprendimientos, pymes y startups fueguinas que trabajan con impresión 3D y fabricación digital, o que quieren incorporarlas.",
    // Sin fecha de cierre: ni el formulario ni lo que mandó la AIF la
    // fijan. No se inventa una.
    estado: "Inscripción abierta",
    color: "copat-lilac",
    datos: [
      {
        rotulo: "Quiénes",
        valor: "Emprendedores, pymes, startups y creadores fueguinos",
      },
      {
        // "Posibilidad de" y no "Stand propio ...": el formulario habla de
        // "ser SELECCIONADO para contar con tu propio stand / charla". No
        // está garantizado y no se puede prometer como si lo estuviera.
        rotulo: "Qué ofrece",
        valor: "Posibilidad de stand propio o charla en el congreso",
      },
      { rotulo: "Cuándo", valor: "2 y 3 de octubre, en la Fábrica de Talentos" },
    ],
    enlaces: [
      {
        texto: "Inscribirme",
        principal: true,
        href: "https://docs.google.com/forms/d/1oHEk1RPvxKd558CdlhAuoD1NhN38FC168V2FjQPLYY4/viewform",
      },
    ],
  },
];
