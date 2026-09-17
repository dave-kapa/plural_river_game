export interface EntryData {
  title: string;
  subtitle: string;
  leadParagraphs: string[];
  journeyQuestionsTitle: string;
  journeyQuestions: string[];
  entryConcept: {
    title: string;
    body: string;
  };
  invitation: string;
  ctaText: string;
  ctaSecondaryText: string;
}

export const ENTRY_DATA: EntryData = {
  title: 'El cambio es un ecosistema',
  subtitle: 'Plural × Gameful Design — Documento maestro de travesía fluvial',
  leadParagraphs: [
    'Plural ya sabe identificar qué comportamientos transformar, qué barreras los sostienen y qué ayudas pueden impulsar el cambio.',
    'Esta travesía explora qué nueva capacidad aparece cuando esas ayudas también se diseñan como experiencias motivacionales, participativas y medibles.',
    'No se trata de agregar juegos al final de una intervención.',
    'Se trata de explorar cómo una mirada gameful puede ampliar lo que Plural ya hace: convertir estrategias de cambio en sistemas que las personas puedan recorrer, experimentar y sostener.',
  ],
  journeyQuestionsTitle: 'A lo largo del río encontraremos cinco preguntas:',
  journeyQuestions: [
    '¿Qué cambia al incorporar una mirada gameful?',
    '¿Qué puede resolver?',
    '¿Qué permite diseñar?',
    '¿Cómo vive dentro del Método Plural?',
    '¿Dónde comenzamos?',
  ],
  entryConcept: {
    title: 'El cambio es un ecosistema',
    body: 'El cambio no ocurre en una sola persona ni depende de una única decisión. Ocurre dentro de un ecosistema de motivaciones, relaciones, reglas, recursos, oportunidades y significados.',
  },
  invitation: 'Exploremos qué sucede cuando también diseñamos ese ecosistema como experiencia.',
  ctaText: 'Comenzar la travesía',
  ctaSecondaryText: 'Continuar desde aquí',
};
