export interface TributaryData {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  purpose: string;
  projectsToApply: string[];
  exploringQuestions: string[];
  possibleStartingPoint: string;
  tributaryCopy: string;
}

export const TRIBUTARIES_DATA: Record<string, TributaryData> = {
  'evaluation-as-experience': {
    id: 'evaluation-as-experience',
    title: 'Evaluation as Experience',
    subtitle: 'Integrar la medición sin romper innecesariamente el recorrido',
    excerpt: 'Integrar la medición formativa sin romper innecesariamente el recorrido de la experiencia.',
    purpose:
      'Plural ya evalúa sus intervenciones. La oportunidad consiste en explorar cuándo una parte de la evidencia puede producirse dentro de la experiencia y cuándo sigue siendo necesario preguntar o medir por otros medios.',
    projectsToApply: [
      'Talleres presenciales y remotos',
      'Procesos formativos y de desarrollo de capacidades',
      'Programas comunitarios de mediano y largo plazo',
      'Experiencias facilitadas',
      'Herramientas pedagógicas',
      'Chatbots y agentes conversacionales',
      'Campañas de cambio de comportamiento',
      'Productos y plataformas digitales',
      'Pilotos experimentales',
      'Intervenciones que hoy utilizan encuestas o instrumentos separados del recorrido',
    ],
    exploringQuestions: [
      '¿En qué proyectos la evaluación interrumpe actualmente la experiencia?',
      '¿Qué información necesita obtener Plural?',
      '¿Qué comportamientos pueden observarse directamente?',
      '¿Qué decisiones, rutas o interacciones podrían producir evidencia?',
      '¿Qué preguntas deben seguir siendo explícitas?',
      '¿Cómo integrarlas sin ocultar el propósito de la medición?',
      '¿Qué datos serían útiles y cuáles solo generarían ruido?',
      '¿Qué límites éticos y de privacidad debemos cuidar?',
      '¿Cómo se conectaría esta evidencia con la evaluación de impacto?',
      '¿Existe un proyecto actual donde podamos ensayar una primera integración?',
    ],
    possibleStartingPoint:
      'Seleccionar una intervención existente, mapear su recorrido de evaluación y rediseñar uno de sus momentos para que produzca evidencia sin romper innecesariamente el flujo.',
    tributaryCopy:
      'La gamificación no reemplaza la evaluación de impacto. Puede ayudar a diseñar una mejor experiencia de medición y nuevas maneras de observar lo que ocurre durante la intervención.',
  },

  'from-intervention-to-product': {
    id: 'from-intervention-to-product',
    title: 'From Intervention to Product',
    subtitle: 'Convertir una experiencia validada en algo replicable',
    excerpt: 'Identificar qué produce el valor de una intervención y diseñarla como un sistema replicable y adaptable.',
    purpose:
      'Plural ya ha creado experiencias, herramientas y metodologías que han demostrado valor. La oportunidad consiste en identificar cuáles contienen una lógica que merece persistir, replicarse, adaptarse o llegar a nuevos contextos. Productizar no significa necesariamente crear una aplicación: puede significar construir un sistema facilitado, un kit, una herramienta, una experiencia híbrida, un chatbot, una plataforma, una licencia metodológica o un servicio recurrente.',
    projectsToApply: [
      'Intervenciones implementadas con resultados valiosos',
      'Experiencias que dependen demasiado de una persona facilitadora',
      'Herramientas que podrían utilizar otras organizaciones con autonomía',
      'Metodologías que hoy viven en documentos o materiales dispersos',
      'Procesos que podrían acompañar a las personas durante más tiempo',
      'Proyectos cuyo valor podría continuar después del contrato inicial',
    ],
    exploringQuestions: [
      '¿Qué experiencias de Plural vale la pena preservar o ampliar?',
      '¿Qué parte de su valor está en la metodología?',
      '¿Qué depende de las personas que facilitan?',
      '¿Qué elementos deben permanecer constantes para conservar fidelidad?',
      '¿Qué debe adaptarse a cada contexto?',
      '¿Quién utilizaría el producto?',
      '¿Qué problema resolvería para esa persona u organización?',
      '¿Qué experiencia debería ofrecer?',
      '¿Qué datos necesitaría producir?',
      '¿Qué parte podría ser análoga, digital o híbrida?',
      '¿Quién lo mantendría y actualizaría?',
      '¿Cuál sería la versión mínima que podríamos pilotear?',
    ],
    possibleStartingPoint:
      'Elegir una intervención que Plural considere especialmente valiosa y separar su propósito, componentes esenciales, experiencia, dependencias operativas y aquello que podría convertirse en un sistema replicable.',
    tributaryCopy:
      'Productizar no es digitalizar una intervención. Es identificar qué produce su valor y diseñar una manera responsable de hacerlo persistente, replicable y adaptable.',
  },

  'new-horizons': {
    id: 'new-horizons',
    title: 'New Horizons',
    subtitle: 'Buscar conjuntamente nuevos proyectos y oportunidades',
    excerpt: 'Incorporar la mirada gameful desde la formulación estratégica de nuevas propuestas y alianzas.',
    purpose:
      'Plural identifica convocatorias, alianzas y proyectos donde puede aportar su experiencia. La mirada gameful puede convertirse en una capacidad adicional para formular propuestas, diferenciar la oferta de Plural y abordar problemas que requieran algo más que una intervención informativa. No se trata de mencionar gamificación en todas las propuestas, sino de reconocer cuándo puede mejorar genuinamente la solución.',
    projectsToApply: [
      'Cambiar o sostener comportamientos a través del tiempo',
      'Mejorar la experiencia de participación ciudadana y comunitaria',
      'Desarrollar capacidades mediante práctica deliberada y ciclos',
      'Trabajar con motivaciones diversas y heterogéneas',
      'Coordinar acciones colectivas y gobernanza compartida',
      'Hacer visibles sistemas, incentivos y consecuencias complejas',
      'Integrar medición formativa en tiempo real',
      'Mantener acompañamiento y soporte más allá del taller inicial',
      'Aumentar la fidelidad de implementación en territorios diversos',
      'Escalar una experiencia preservando su intención central',
      'Crear un producto o servicio replicable',
    ],
    exploringQuestions: [
      '¿Qué oportunidades está buscando Plural actualmente?',
      '¿En cuáles la experiencia y la motivación son parte central del problema?',
      '¿Qué convocatorias valoran escalabilidad, medición, innovación o participación?',
      '¿Qué nuevas soluciones podría ofrecer Plural al incorporar esta capacidad?',
      '¿En qué momento de la formulación debería entrar la mirada gameful?',
      '¿Cómo debería aparecer en un pitch, una propuesta o un presupuesto?',
      '¿Qué puede prometerse responsablemente?',
      '¿Qué capacidades tendría Plural internamente y cuáles requerirían colaboración?',
      '¿Qué evidencia necesitaría una propuesta para sustentar el enfoque?',
      '¿Cuál podría ser el primer proyecto formulado conjuntamente?',
    ],
    possibleStartingPoint:
      'Revisar una oportunidad concreta y construir juntos el problema, la conducta o experiencia que se quiere transformar, el valor que agregaría una arquitectura gameful, su alcance, sus entregables y la forma adecuada de incluirla en la propuesta.',
    tributaryCopy:
      'La nueva capacidad también puede comenzar antes de que exista un proyecto: en la manera como Plural identifica oportunidades, formula soluciones y presenta lo que ahora puede hacer.',
  },
};

export interface CollaborationModality {
  id: string;
  title: string;
  description: string;
}

export const DELTA_ENCOUNTER_DATA = {
  title: 'En esta parte del río nos encontramos',
  lead: 'Hemos recorrido qué cambia al incorporar una mirada gameful, qué problemas puede ayudar a resolver, qué permite diseñar y cómo puede vivir dentro del Método Plural. A partir de aquí no existe una única ruta correcta. Podemos comenzar mejorando la experiencia de medición de un proyecto existente, transformando una intervención valiosa en un producto replicable o formulando conjuntamente una nueva oportunidad.',
  meetingQuestion: '¿Cuál de estos afluentes conecta mejor con las necesidades y oportunidades que Plural tiene hoy?',
  modalitiesTitle: 'Formas posibles de trabajar juntos',
  modalities: [
    {
      id: 'mod-1',
      title: 'Participación parcial y transversal',
      description: 'Incorporar esta capacidad de forma recurrente en proyectos internos o externos de Plural. Puede incluir formulación, diagnóstico, diseño, prototipado, acompañamiento, implementación y evaluación de diferentes iniciativas.',
    },
    {
      id: 'mod-2',
      title: 'Colaboración por proyecto',
      description: 'Definir un proyecto con alcance, presupuesto, entregables, responsabilidades y cronograma específicos. Puede utilizarse para proyectos externos o iniciativas internas.',
    },
    {
      id: 'mod-3',
      title: 'Consultoría por horas o bolsa de acompañamiento',
      description: 'Acompañar decisiones puntuales, revisar propuestas, facilitar sesiones, evaluar diseños o asesorar equipos cuando la necesidad no exige participación continua.',
    },
    {
      id: 'mod-4',
      title: 'Co-diseño de un piloto',
      description: 'Seleccionar una oportunidad acotada para probar la colaboración, materializar la capacidad, producir aprendizaje y evaluar qué modalidad de trabajo resulta más adecuada después.',
    },
  ] as CollaborationModality[],
  clarification: 'No son caminos cerrados. Son puntos de partida para encontrar una forma de colaboración que responda a las necesidades de Plural y a las condiciones de cada proyecto.',
  closureCopy: 'No necesitamos comenzar con una solución grande ni definitiva. Podemos identificar una necesidad real, elegir un primer afluente, diseñar un piloto acotado y aprender juntos. En esta parte del río nos encontramos. Desde aquí, decidimos cómo continuar.',
  journalPhrase: 'Podemos comenzar mejorando la experiencia de medición, convirtiendo una intervención validada en un producto replicable o incorporando esta capacidad desde la formulación de nuevas oportunidades.',
};
