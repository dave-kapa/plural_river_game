export interface CreditsData {
  title: string;
  functionalQuestion: string;
  conditionNotice: string;
  initialCopy: string;
  intersections: string[];
  authorProfile: {
    name: string;
    narrative: string[];
    focusPillars: string[];
    closingInterest: string;
  };
  finalCopy: {
    highlight: string;
    body: string;
    opportunity: string;
    callToAction: string;
  };
}

export const CREDITS_DATA: CreditsData = {
  title: 'Créditos de la Travesía',
  functionalQuestion: '¿Quién puede ayudar a incorporar esta capacidad?',
  conditionNotice: 'Se desbloquea después de visitar los tres afluentes.',
  initialCopy: 'Esta propuesta requiere conectar mundos que con frecuencia trabajan por separado:',
  intersections: [
    'Ciencias del comportamiento',
    'Psicología cognitiva y social',
    'Neurociencia cognitiva',
    'Gamificación y diseño gameful',
    'Diseño de experiencias (UX)',
    'Aprendizaje y pedagogía',
    'Facilitación participativa',
    'Tecnología e interfaces',
    'Inteligencia artificial aplicada',
    'Implementación situada',
    'Gestión y escalamiento de proyectos',
  ],
  authorProfile: {
    name: 'Dave',
    narrative: [
      'Mi recorrido profesional se ha construido precisamente en esas intersecciones.',
      'He trabajado convirtiendo conocimiento sobre comportamiento, motivación y aprendizaje en metodologías, experiencias, herramientas, procesos, intervenciones, capacidades organizacionales y productos.',
      'Mi aporte no sería llegar a Plural a sustituir su método ni a convertir cada proyecto en un juego.',
    ],
    focusPillars: [
      'Dónde una mirada gameful agrega valor real',
      'Cómo incorporarla con rigor metodológico y científico',
      'Qué debe permanecer análogo y tangible',
      'Cuándo lo digital resulta genuinamente útil (Gamification-first, digital-when-useful)',
      'Cómo prototipar, observar comportamientos emergentes y aprender',
      'Y cómo convertir esta capacidad en mejores proyectos, nuevas soluciones y oportunidades de impacto',
    ],
    closingInterest:
      'Me interesa hacerlo dentro de problemas que importan: poner el conocimiento sobre comportamiento, experiencia y motivación al servicio de causas sociales y colectivas.',
  },
  finalCopy: {
    highlight: 'Plural ya sabe identificar qué cambio importa y diseñar intervenciones pertinentes para hacerlo posible.',
    body: 'La mirada gameful puede ampliar cómo esas intervenciones se experimentan, se miden, se sostienen, se replican y se convierten en nuevas soluciones.',
    opportunity: 'La oportunidad no es agregar gamificación a Plural. Es construir juntos una nueva capacidad dentro de Plural.',
    callToAction: 'Conversemos sobre el primer afluente.',
  },
};
