export interface JournalEntryConfig {
  territoryId: string;
  order: number;
  territoryTitle: string;
  phrase: string;
}

export const OFFICIAL_JOURNAL_ENTRIES: Record<string, JournalEntryConfig> = {
  'territorio-1': {
    territoryId: 'territorio-1',
    order: 1,
    territoryTitle: 'El nacimiento de una nueva corriente',
    phrase:
      'La gamificación instala la capacidad de diseñar sistemas motivacionales y experienciales orientados al comportamiento y al impacto significativo.',
  },
  'territorio-2': {
    territoryId: 'territorio-2',
    order: 2,
    territoryTitle: 'Las fuerzas que mueven el cauce',
    phrase:
      'Puede ampliar la escalabilidad, integrar mejor la medición, abrir nuevas formas de innovación y convertir la participación en una experiencia motivante, compartida y sostenida a través del tiempo.',
  },
  'territorio-3': {
    territoryId: 'territorio-3',
    order: 3,
    territoryTitle: 'Diseñar un ecosistema vivo',
    phrase:
      'Puede aplicarse en intervenciones presenciales, digitales o híbridas donde sea necesario favorecer comportamientos, mejorar la experiencia, desarrollar capacidades o producir impacto significativo.',
  },
  'territorio-4': {
    territoryId: 'territorio-4',
    order: 4,
    territoryTitle: 'La confluencia',
    phrase:
      'Dentro del Método Plural funciona como una lente transversal que transforma ayudas en experiencias con agencia, decisiones, feedback, progresión, relaciones y evidencia, sin sustituir el diagnóstico, la ética ni la evaluación de impacto.',
  },
  'territorio-5': {
    territoryId: 'territorio-5',
    order: 5,
    territoryTitle: 'Donde el río se abre',
    phrase:
      'Podemos comenzar mejorando la experiencia de medición, convirtiendo una intervención validada en un producto replicable o incorporando esta capacidad desde la formulación de nuevas oportunidades.',
  },
};

export const MASTER_PRESENTATION_PARAGRAPH = [
  'La gamificación instala la capacidad de diseñar sistemas motivacionales y experienciales orientados al comportamiento y al impacto significativo.',
  'Puede ampliar la escalabilidad, integrar mejor la medición, abrir nuevas formas de innovación y convertir la participación en una experiencia motivante, compartida y sostenida a través del tiempo.',
  'Puede aplicarse en intervenciones presenciales, digitales o híbridas donde sea necesario favorecer comportamientos, mejorar la experiencia, desarrollar capacidades o producir impacto significativo.',
  'Dentro del Método Plural funciona como una lente transversal que transforma ayudas en experiencias con agencia, decisiones, feedback, progresión, relaciones y evidencia, sin sustituir el diagnóstico, la ética ni la evaluación de impacto.',
];

export const MASTER_PRACTICAL_CONTINUATION =
  'Podemos comenzar mejorando la experiencia de medición, convirtiendo una intervención validada en un producto replicable o incorporando esta capacidad desde la formulación de nuevas oportunidades.';

export const MASTER_FINAL_COPY = {
  highlight: 'Plural ya sabe identificar qué cambio importa y diseñar intervenciones pertinentes para hacerlo posible.',
  narrative: 'La mirada gameful puede ampliar cómo esas intervenciones se experimentan, se miden, se sostienen, se replican y se convierten en nuevas soluciones. La oportunidad no es agregar gamificación a Plural. Es construir juntos una nueva capacidad dentro de Plural.',
  actionPrompt: 'Conversemos sobre el primer afluente.',
};
