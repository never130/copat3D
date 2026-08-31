/**
 * Ejes temáticos del congreso.
 * El contenido vive versionado en TypeScript, no en un CMS.
 * Ver docs/03-arquitectura.md
 */

export type Eje = {
  id: string;
  numero: string;
  titulo: string;
  descripcion: string;
  temas: string[];
  /** Acento del sistema de diseño. Uno por eje, sin repetir. */
  color: "copat-coral" | "copat-sky" | "copat-yellow" | "copat-green";
};

export const EJES: Eje[] = [
  {
    id: "salud",
    numero: "01",
    titulo: "Salud y Bioimpresión",
    descripcion:
      "Cómo la fabricación aditiva está cambiando la práctica médica, desde la planificación quirúrgica hasta los biomateriales.",
    temas: ["Prótesis a medida", "Biomateriales", "Modelado anatómico", "Planificación quirúrgica"],
    color: "copat-coral",
  },
  {
    id: "infraestructura",
    numero: "02",
    titulo: "Infraestructura y Construcción",
    descripcion:
      "Construir en el clima más exigente del país. Hábitat austral, eficiencia energética y hormigón impreso.",
    temas: ["Hábitat en clima extremo", "Hormigón 3D", "Sustentabilidad", "Vivienda social"],
    color: "copat-sky",
  },
  {
    id: "industria",
    numero: "03",
    titulo: "Industria 4.0",
    descripcion:
      "Manufactura distribuida, repuestos bajo demanda y automatización aplicada al entramado productivo fueguino.",
    temas: ["Repuestos on-demand", "Aeronáutica", "Electrónica", "Metalmecánica"],
    color: "copat-yellow",
  },
  {
    id: "talentos",
    numero: "04",
    titulo: "Educación y Formación",
    descripcion:
      "Formar el talento técnico que la provincia necesita: robótica educativa, diseño digital y el camino de los Polos Creativos hacia el primer emprendimiento.",
    temas: ["Formación técnica", "Robótica educativa", "Startups locales", "Diseño digital"],
    color: "copat-green",
  },
];
