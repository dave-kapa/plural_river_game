export interface TerritoryData {
  id: string;
  number: number;
  narrativeTitle: string;
  functionalQuestion: string;
  functionStatement: string;
  opening: string;
  activationQuestion?: string;
  journalPhrase: string;
  conclusionCopy: string;
  completionCondition: string;
  // Contenido detallado específico por territorio
  specificContent: any;
}

export const TERRITORIES_DATA: Record<string, TerritoryData> = {
  'territorio-1': {
    id: 'territorio-1',
    number: 1,
    narrativeTitle: 'El nacimiento de una nueva corriente',
    functionalQuestion: '¿Qué cambia al incorporar una mirada gameful?',
    functionStatement: 'Definir la capacidad, ampliar la comprensión de gamificación y fijar los principios doctrinales.',
    opening:
      'Plural ya trabaja con comportamientos, barreras, motivaciones, contextos y experiencias. La mirada gameful no sustituye ese conocimiento. Introduce una capacidad adicional: diseñar cómo las personas entran en una experiencia, comprenden su propósito, toman decisiones, reciben feedback, encuentran diferentes caminos, aprenden, progresan y conectan lo vivido con el mundo real.',
    activationQuestion: '¿Qué conocimientos deben encontrarse para construir esta capacidad?',
    journalPhrase:
      'La gamificación instala la capacidad de diseñar sistemas motivacionales y experienciales orientados al comportamiento y al impacto significativo.',
    conclusionCopy:
      'La gamificación instala la capacidad de diseñar sistemas motivacionales y experienciales orientados al comportamiento y al impacto significativo. No reemplaza lo que Plural ya sabe hacer. Abre una nueva manera de convertir ese conocimiento en experiencias que las personas puedan recorrer, decidir, compartir y sostener.',
    completionCondition: 'Construir la definición disciplinar y explorar los cuatro lentes de diseño.',
    specificContent: {
      definitionDisciplines: [
        'ciencias del comportamiento',
        'psicología',
        'neurociencia cognitiva',
        'experiencia de usuario',
        'narrativa',
        'diseño de juegos',
      ],
      definitionPurpose: 'construir sistemas motivacionales y de aprendizaje',
      definitionFull:
        'La gamificación es una disciplina de diseño que integra conocimientos de las ciencias del comportamiento, la psicología, la neurociencia cognitiva, la experiencia de usuario, la narrativa y el diseño de juegos para construir sistemas motivacionales y de aprendizaje. Su propósito no es hacer que todo parezca un juego: es diseñar deliberadamente las condiciones bajo las cuales una persona participa, decide, aprende, coopera, persiste y actúa.',
      valueCriteria: [
        'La integración de paradigmas conceptuales basados en evidencia, convertidos en principios y reglas de diseño.',
        'La pertinencia de esas reglas frente al comportamiento, las personas y el contexto.',
        'El propósito para el cual se utiliza y quién se beneficia.',
        'La calidad de su prototipado, prueba e iteración.',
        'Y las consecuencias éticas, experienciales y sistémicas que produce.',
      ],
      fourLenses: [
        {
          id: 'lens-behavior',
          title: 'Behavior — Comportamiento',
          question: '¿Qué acciones concretas queremos favorecer?',
          lead: 'El punto de partida no es “hacer algo divertido”. Es comprender qué comportamientos observables y significativos queremos hacer posibles y qué condiciones pueden ayudar a que ocurran.',
          body: 'El comportamiento debe conectarse con el propósito del proyecto y no limitarse a completar actividades dentro de la experiencia.',
        },
        {
          id: 'lens-experience',
          title: 'Experience — Experiencia',
          question: '¿Cómo queremos que se sienta recorrer el sistema?',
          lead: 'La experiencia emocional no es decoración. Curiosidad, confianza, tensión, satisfacción, pertenencia, autonomía o sensación de progreso pueden transformar la manera como una persona se relaciona con una intervención.',
          body: 'Una experiencia emocionalmente positiva no significa que todas las personas deban divertirse de la misma manera. Diseñar motivación implica reconocer diversidad de intereses, capacidades, necesidades y formas de participar.',
        },
        {
          id: 'lens-impact',
          title: 'Meaningful Impact — Impacto significativo',
          question: '¿Qué valor debe permanecer cuando la experiencia termine?',
          lead: 'Participar, completar actividades o permanecer dentro de un sistema no constituye por sí mismo un impacto. Lo importante es que la experiencia contribuya a algo valioso para las personas, las comunidades y el propósito del proyecto.',
          body: 'Engagement es una condición que puede ayudar. No es el resultado final.',
        },
        {
          id: 'lens-systemic',
          title: 'Mirada sistémica',
          question: '¿Qué condiciones del mundo real rodean la experiencia?',
          lead: 'Las personas no actúan en el vacío. Existen normas sociales, relaciones, recursos, infraestructura, incentivos, restricciones, desigualdades y mecanismos reales de recompensa o coerción.',
          body: 'Una arquitectura motivacional responsable debe reconocer ese sistema y evitar diseñar como si todo dependiera de la voluntad individual.',
        },
      ],
      playfulVsGameful: {
        playful: {
          title: 'Playful',
          description:
            'Hace una experiencia más ligera, expresiva, curiosa o entretenida. Puede utilizar humor, ilustración, exploración, sorpresa o actividades lúdicas.',
        },
        gameful: {
          title: 'Gameful',
          description:
            'Organiza una experiencia como un sistema. Articula propósito, objetivos, reglas, decisiones, agencia, retos, consecuencias, feedback, progresión, relaciones y ciclos de participación.',
        },
        synthesis:
          'Una experiencia puede ser playful sin ser gameful. También puede ser profundamente gameful sin parecer un videojuego.',
      },
      whatItIsNot: [
        'Hacer videojuegos.',
        'Convertir todo en competencia.',
        'Poner puntos, medallas y rankings.',
        'Premiar cualquier acción.',
        'Disfrazar una obligación con entretenimiento.',
        'Digitalizar por digitalizar.',
        'Reemplazar el contenido con una historia.',
        'Manipular a las personas para que hagan algo que no las beneficia.',
      ],
      doctrinalPrinciples: [
        {
          title: 'Diseñar con la motivación, no contra ella',
          description: 'La intención no es forzar una conducta. Es construir condiciones que permitan una participación autónoma, comprensible y significativa.',
        },
        {
          title: 'Una meta no exige un único camino',
          description: 'Un sistema puede orientar hacia un propósito común y permitir distintas decisiones, estrategias, ritmos o misiones.',
        },
        {
          title: 'La experiencia se diseña y se aprende',
          description: 'Un sistema no queda resuelto en el papel. Debe prototiparse, observarse, probarse y ajustarse a partir de lo que las personas realmente hacen.',
        },
        {
          title: 'La transformación debe ser voluntaria',
          description: 'El propósito no es obtener obediencia ni hacer más tolerable una obligación. Es crear condiciones para una transformación voluntaria que contribuya al bienestar individual y colectivo.',
        },
        {
          title: 'Lo digital es una posibilidad, no el punto de partida',
          description: 'Gamification-first, digital-when-useful. Primero se diseña la arquitectura motivacional y experiencial. Después se decide si debe vivir en un taller, un servicio, un objeto, una herramienta, un chatbot, una plataforma o una combinación de formatos.',
        },
        {
          title: 'La disciplina no es inherentemente buena o mala',
          description: 'Su valor depende de para qué se utiliza, en beneficio de quién, qué comprensión tiene del contexto, qué comportamientos favorece y qué consecuencias produce.',
        },
      ],
    },
  },

  'territorio-2': {
    id: 'territorio-2',
    number: 2,
    narrativeTitle: 'Las fuerzas que mueven el cauce',
    functionalQuestion: '¿Qué puede resolver?',
    functionStatement: 'Responder qué beneficios aporta y qué necesidades de Plural puede ayudar a resolver.',
    opening:
      'Una mirada gameful no resuelve todos los problemas de una intervención. Su valor aparece cuando necesitamos diseñar cómo las personas participan, experimentan, practican, deciden, progresan y producen evidencia a través del tiempo. Para Plural existen tres puertas de entrada inmediatas: escalabilidad, medición e innovación. Al recorrerlas aparecen otras capacidades igualmente relevantes.',
    journalPhrase:
      'Puede ampliar la escalabilidad, integrar mejor la medición, abrir nuevas formas de innovación y convertir la participación en una experiencia motivante, compartida y sostenida a través del tiempo.',
    conclusionCopy:
      'La mirada gameful puede ampliar la escalabilidad, integrar mejor la medición, abrir nuevas formas de innovación y convertir la participación en una experiencia motivante, compartida y sostenida a través del tiempo. No resuelve el cambio por sí sola. Amplía la capacidad de diseñar cómo ese cambio se experimenta.',
    completionCondition: 'Explorar las tres fuerzas inmediatas y descubrir las capacidades adicionales.',
    specificContent: {
      threeForces: [
        {
          id: 'force-scale',
          title: 'Escalabilidad',
          shortIdea: 'Llegar a más personas sin perder la intención ni la calidad de la experiencia.',
          copyBrief: 'Escalar es aumentar alcance y fidelidad sin borrar el contexto.',
          description:
            'Escalar no significa solamente aumentar cobertura. También significa mantener la calidad cuando crecen los territorios, participantes, facilitadores, momentos de implementación y complejidad operativa.',
          points: [
            'Codificar parte de la experiencia en reglas, secuencias y feedback.',
            'Reducir dependencias operativas y la necesidad de una facilitación intensiva.',
            'Ofrecer mayor consistencia entre implementaciones diversas.',
            'Convertir conocimiento tácito en herramientas replicables.',
            'Acompañar a participantes más allá de un encuentro puntual.',
            'Adaptar una experiencia sin perder su intención central.',
          ],
          distinction:
            'Replicar una experiencia no significa aplicar exactamente lo mismo en todas partes. Significa preservar su propósito mientras se adapta responsablemente al contexto.',
        },
        {
          id: 'force-measure',
          title: 'Medición',
          shortIdea: 'Producir evidencia dentro del recorrido sin romper innecesariamente la experiencia.',
          copyBrief: 'La medición puede habitar el journey sin confundirse con la evaluación de impacto.',
          description:
            'Muchas intervenciones separan la experiencia de su evaluación: primero ocurre el taller o servicio, y después una encuesta anuncia “ahora te estamos evaluando”. Una arquitectura gameful puede integrar parte de la evidencia dentro del recorrido.',
          points: [
            'Observar qué decisiones toma una persona y qué rutas prefiere.',
            'Identificar dónde solicita ayuda y qué estrategias prueba.',
            'Registrar cuánto persiste, qué errores repite y cómo coopera.',
            'Detectar cuándo abandona y cómo cambia su actuación frente a nuevas situaciones.',
            'Integrar preguntas explícitas con mayor naturalidad en el flujo cuando sean necesarias.',
          ],
          distinction:
            'Medición dentro de la experiencia no es lo mismo que evaluación de impacto. La gamificación puede mejorar la experiencia de medición, aumentar tasas de respuesta y generar datos comportamentales. Pero no reemplaza un diseño experimental, un RCT, una evaluación pre/post ni un estudio cualitativo para determinar impacto.',
        },
        {
          id: 'force-innovation',
          title: 'Innovación',
          shortIdea: 'Diseñar otras formas de participar, decidir y relacionarse con el problema.',
          copyBrief: 'Innovar es transformar la experiencia y sus reglas, no solamente su apariencia.',
          description:
            'Innovar no es agregar tecnología ni hacer que una intervención se vea diferente. Una arquitectura gameful permite modificar temporalmente las reglas bajo las cuales se vive una situación.',
          points: [
            'Introducir roles, recursos limitados, decisiones y consecuencias.',
            'Fomentar cooperación, gestionar incertidumbre e incorporar información gradual.',
            'Explorar restricciones y perspectivas diferentes.',
            'Hacer visibles relaciones y dependencias que normalmente permanecen ocultas.',
            'Convertir ideas abstractas en experiencias vivibles.',
          ],
          distinction:
            'La innovación no está en el formato. Está en diseñar otras formas de participar, decidir y relacionarse con el problema.',
        },
      ],
      unlockNotice:
        'Escalabilidad, medición e innovación son las entradas más inmediatas. Pero la corriente mueve algo más.',
      additionalCapacities: [
        {
          id: 'cap-emotional',
          title: 'Experiencia emocionalmente positiva',
          shortIdea: 'Pasar de una tarea u obligación a una experiencia que pueda producir curiosidad, disfrute, satisfacción o propósito.',
          copyBrief: 'Una experiencia positiva no trivializa el propósito; puede crear mejores condiciones para acercarse a él.',
          body: 'Muchas intervenciones se sienten como un requisito que debe soportarse. Una mirada gameful diseña para que participar produzca curiosidad, dominio, pertenencia o satisfacción. No todas las personas disfrutan las mismas cosas: se trata de ofrecer distintas fuentes de valor y participación.',
        },
        {
          id: 'cap-motivation-arch',
          title: 'Arquitectura motivacional',
          shortIdea: 'Organizar cómo diferentes personas encuentran razones, información y caminos para actuar.',
          copyBrief: 'Una arquitectura motivacional no consiste en añadir incentivos. Consiste en organizar cómo diferentes personas encuentran razones, información y caminos para actuar.',
          dimensions: [
            { name: 'Cómo comienza la participación', text: 'Qué motivadores adquieren relevancia y qué significado dan a los comportamientos.' },
            { name: 'Qué opciones existen', text: 'Qué variedad de elecciones puede ofrecerse para motivaciones y estilos distintos.' },
            { name: 'Qué tan difícil resulta cada reto', text: 'Construcción de curvas de tensión y aprendizaje para evitar apatía o frustración.' },
            { name: 'Cómo y cuándo aparece el feedback', text: 'Informar sobre progreso, dominio, impacto, relación, descubrimiento o contribución.' },
            { name: 'Qué señales hacen visible el avance', text: 'El progreso representa mejora de destrezas, autonomía o comprensión, no mera acumulación.' },
            { name: 'Qué ocurre después de una decisión', text: 'Cómo el comportamiento modifica el sistema, consume recursos o abre posibilidades.' },
            { name: 'Por qué vale la pena continuar', text: 'Articulación de misiones principales y secundarias hacia el objetivo general.' },
            { name: 'Convergencia y divergencia', text: 'Misión compartida compatible con que las personas exploren trayectorias y ritmos diferentes.' },
          ],
        },
        {
          id: 'cap-shared-exp',
          title: 'Experiencia compartida',
          shortIdea: 'Diseñar no solo para individuos, sino también para relaciones, comunidades y acción colectiva.',
          copyBrief: 'Lo gameful no solo puede motivar individuos. También puede diseñar formas de actuar colectivamente.',
          body: 'Una capa de juego crea un círculo mágico con reglas, roles y significados compartidos. Las personas pueden ensayar nuevas formas de colaborar, coordinar recursos, construir acuerdos y asumir perspectivas ajenas.',
        },
        {
          id: 'cap-time-journey',
          title: 'Experiencia a través del tiempo',
          shortIdea: 'Transformar una colección de actividades en un recorrido con ritmo, aprendizaje y continuidad.',
          copyBrief: 'Diseñar la secuencia transforma actividades separadas en una experiencia con continuidad.',
          body: 'Permite diseñar ciclos de tensión y resolución, pausas, curvas de dificultad, andamiaje pedagógico (scaffolding), feedback oportuno y preparación para retos posteriores.',
        },
        {
          id: 'cap-safe-learning',
          title: 'Aprendizaje y ensayo seguro: el error como principal fuente de aprendizaje',
          shortIdea: 'Crear condiciones para probar, equivocarse, comprender y volver a actuar sin producir daño.',
          copyBrief: 'Cuando equivocarse no produce daño y sí produce información, el error puede convertirse en la principal fuente de aprendizaje.',
          body: 'En un entorno seguro, el error no es un fallo que deba castigarse; revela cómo funciona el sistema, expone supuestos y permite calibrar la siguiente decisión.',
        },
        {
          id: 'cap-persistence',
          title: 'Persistencia',
          shortIdea: 'Diseñar lo que ocurre después del primer contacto.',
          copyBrief: 'El cambio necesita un recorrido, no solamente un momento memorable.',
          body: 'Extiende el acompañamiento tras el encuentro inicial mediante ciclos de práctica, recordatorios con sentido, compromisos comunitarios y nuevas oportunidades de participación.',
        },
      ],
      changeScales: {
        title: 'El cambio cambia de escala',
        copyIntegrator: 'El cambio no viaja únicamente desde la persona hacia el sistema. Las personas transforman relaciones y colectivos; los colectivos pueden modificar sistemas; y los sistemas delimitan las posibilidades de acción de personas y comunidades.',
        layers: [
          { name: 'Persona', focus: 'Comportamientos, capacidades, motivaciones, emociones, hábitos, creencias e identidad.', question: '¿Qué puede hacer una persona y qué condiciones influyen en su actuación?' },
          { name: 'Relaciones y comunidad', focus: 'Normas sociales, vínculos, cuidado, cooperación, recursos compartidos, pertenencia y capacidad instalada.', question: '¿Qué comportamientos se sostienen o transforman mediante nuestras relaciones?' },
          { name: 'Acción colectiva', focus: 'Coordinación, acuerdos, identidades compartidas, distribución de roles, movilización y capacidad para actuar como grupo.', question: '¿Qué podemos hacer juntos que ninguna persona podría conseguir por separado?' },
          { name: 'Cultura y sistema', focus: 'Narrativas culturales, infraestructura, instituciones, normas formales, políticas y relaciones de poder.', question: '¿Qué reglas y condiciones estructurales hacen posibles, difíciles o inviables determinados comportamientos?' },
        ],
      },
    },
  },

  'territorio-3': {
    id: 'territorio-3',
    number: 3,
    narrativeTitle: 'Diseñar un ecosistema vivo',
    functionalQuestion: '¿Qué permite diseñar?',
    functionStatement: 'Mostrar los componentes específicos de una arquitectura gameful y los contextos en los que puede aplicarse.',
    opening:
      'Una experiencia gameful no surge de agregar una mecánica aislada. Puntos sin propósito, una narrativa sin decisiones o un reto sin feedback pueden llamar la atención, pero no constituyen por sí solos una arquitectura motivacional. El valor aparece cuando distintos componentes trabajan juntos dentro de un sistema coherente.',
    journalPhrase:
      'Puede aplicarse en intervenciones presenciales, digitales o híbridas donde sea necesario favorecer comportamientos, mejorar la experiencia, desarrollar capacidades o producir impacto significativo.',
    conclusionCopy:
      'Una arquitectura gameful articula propósito, reglas, agencia, decisiones, retos, feedback, progresión, relaciones y ciclos de participación dentro de un sistema coherente. Su valor no está en utilizar todos los componentes ni en hacerlos visibles. Está en elegir y conectar aquellos que ayudan a transformar comportamiento, experiencia e impacto. Primero diseñamos el sistema. Después elegimos el formato.',
    completionCondition: 'Explorar las zonas del ecosistema y sus componentes constitutivos.',
    specificContent: {
      zones: [
        {
          id: 'zone-roots',
          name: 'Las raíces: propósito e impacto',
          metaphor: 'Fundamento que nutre todo el sistema',
          components: [
            { name: 'Propósito', definition: 'La razón por la que el sistema existe. Define qué cambio valioso busca hacer posible y para quién. Sin propósito, las mecánicas pueden generar actividad sin producir significado.' },
            { name: 'Comportamientos', definition: 'Las acciones observables que queremos favorecer dentro y fuera de la experiencia. Permiten conectar lo que una persona hace en el sistema con la intención real de cambio.' },
            { name: 'Impacto significativo', definition: 'El valor que debería permanecer cuando termina la interacción. Evita confundir participación, tiempo de uso o finalización con bienestar o transformación.' },
          ],
        },
        {
          id: 'zone-bed',
          name: 'El cauce: estructura y dirección',
          metaphor: 'Reglas y límites que canalizan la energía',
          components: [
            { name: 'Objetivos', definition: 'Indican qué se intenta lograr. Un buen objetivo hace comprensible la dirección sin eliminar necesariamente la exploración.' },
            { name: 'Reglas', definition: 'Definen qué puede hacerse, qué no puede hacerse y cómo funciona el sistema. Las reglas producen posibilidades, restricciones y relaciones. No son simples instrucciones.' },
            { name: 'Roles', definition: 'Determinan desde qué posición participa cada persona y qué responsabilidades, capacidades o perspectivas puede asumir.' },
            { name: 'Recursos', definition: 'Elementos que pueden obtenerse, utilizarse, compartirse, protegerse, transformarse o intercambiarse. Hacen visibles prioridades, tensiones y decisiones.' },
            { name: 'Restricciones', definition: 'Limitan las acciones disponibles. Una restricción bien diseñada puede estimular creatividad, cooperación o reflexión. Una restricción arbitraria solo produce frustración.' },
          ],
        },
        {
          id: 'zone-branches',
          name: 'Las ramas: agencia y decisión',
          metaphor: 'Bifurcaciones donde las personas eligen su rumbo',
          components: [
            { name: 'Agencia', definition: 'Capacidad de tomar decisiones que tengan sentido y produzcan alguna diferencia dentro del sistema. Elegir entre opciones idénticas no constituye verdadera agencia.' },
            { name: 'Decisiones', definition: 'Momentos en que una persona valora alternativas, consecuencias, recursos o necesidades. Permiten pasar de recibir información a actuar sobre ella.' },
            { name: 'Trayectorias alternativas', definition: 'Diferentes maneras de avanzar hacia una misma intención, reconociendo distintas capacidades, motivaciones y estrategias.' },
            { name: 'Misiones principales y secundarias', definition: 'La misión principal conserva el propósito compartido; las secundarias permiten explorar intereses o caminos particulares sin perder la dirección.' },
          ],
        },
        {
          id: 'zone-leaves',
          name: 'Las hojas: experiencia y motivación',
          metaphor: 'Intercambio vivo de estímulos, retos y retroalimentación',
          components: [
            { name: 'Retos', definition: 'Crean una distancia significativa entre el estado actual y lo que se intenta lograr. Deben movilizar sin provocar abandono inevitable.' },
            { name: 'Dificultad progresiva', definition: 'Ajusta la complejidad a medida que crecen la comprensión y las capacidades, evitando exigir desempeño antes de enseñar.' },
            { name: 'Scaffolding', definition: 'Apoyos temporales que permiten realizar algo que aún no se logra de manera autónoma, retirándose conforme aumenta el dominio.' },
            { name: 'Feedback', definition: 'Informa sobre qué ocurrió tras una acción, qué significa y qué puede hacerse a continuación (progreso, dominio, impacto, relación).' },
            { name: 'Consecuencias', definition: 'Muestran cómo una decisión transforma el estado del sistema, consume recursos o abre y cierra posibilidades. Dan peso real a las elecciones.' },
            { name: 'Progresión', definition: 'Hace perceptible el aprendizaje y la autonomía desarrollada. Progresar no es acumular puntos: es ganar dominio, criterio y relación.' },
            { name: 'Emociones', definition: 'Curiosidad, tensión, confianza, sorpresa o empatía no son adornos; emergen de la interacción entre reglas, decisiones y significado.' },
          ],
        },
        {
          id: 'zone-canopy',
          name: 'La copa: historia, descubrimiento y tiempo',
          metaphor: 'Atmósfera que envuelve la experiencia en el tiempo',
          components: [
            { name: 'Narrativa', definition: 'Ofrece contexto y significado a las acciones. Ayuda a comprender por qué una decisión importa y a conectar momentos separados.' },
            { name: 'Descubrimiento', definition: 'Permite que parte del contenido y las consecuencias se revelen durante el recorrido, transformando la información en algo que se explora.' },
            { name: 'Incertidumbre', definition: 'Hace que no todas las consecuencias sean previsibles. Con criterio, produce atención y adaptación; sin criterio, destruye confianza.' },
            { name: 'Ciclos de participación', definition: 'Organizan bucles vivos: actuar → recibir feedback → comprender → ajustar → volver a actuar.' },
          ],
        },
        {
          id: 'zone-collective',
          name: 'El ecosistema: relaciones y acción colectiva',
          metaphor: 'Interacciones entre múltiples actores del entorno',
          components: [
            { name: 'Cooperación', definition: 'Permite que las personas dependan de capacidades o recursos complementarios para lograr lo que no alcanzarían en soledad.' },
            { name: 'Competencia', definition: 'Comparación por resultados o recursos. No es obligatoria; solo se utiliza cuando contribuye al propósito sin fracturar el tejido social.' },
            { name: 'Relaciones', definition: 'Definen cómo las acciones de una persona afectan las posibilidades de otras, visibilizando interdependencias sistémicas.' },
            { name: 'Normas sociales', definition: 'Muestran qué hacen otros y qué se considera aceptable, diseñándose con cautela para no normalizar conductas indeseables.' },
            { name: 'Experiencia compartida', definition: 'Construcción conjunta de recuerdos, acuerdos, identidades y significados colectivos.' },
          ],
        },
        {
          id: 'zone-traces',
          name: 'Las huellas: evidencia y transferencia',
          metaphor: 'Impacto que perdura tras el fin de la travesía',
          components: [
            { name: 'Medición integrada', definition: 'Decisiones, rutas, intentos y cooperación producen datos formativos durante la experiencia bajo estrictos criterios éticos.' },
            { name: 'Reflexión', definition: 'Pausa estructurada para conectar lo vivido con su significado profundo; sin reflexión, la experiencia intensa no genera comprensión.' },
            { name: 'Transferencia', definition: 'Puente entre lo vivido en el sistema y lo que la persona hará fuera de él. Concluye haciendo visible el siguiente comportamiento en la realidad.' },
          ],
        },
      ],
      whereItLives: {
        title: '¿Dónde puede vivir esta capacidad?',
        habitats: [
          'Intervenciones presenciales',
          'Programas comunitarios',
          'Talleres y facilitaciones',
          'Procesos educativos y de formación',
          'Herramientas para facilitadores',
          'Campañas de cambio social',
          'Sistemas de evaluación de aprendizajes',
          'Experiencias organizacionales',
          'Servicios públicos y privados',
          'Kits y dispositivos análogos',
          'Chatbots y agentes conversacionales',
          'Experiencias con inteligencia artificial',
          'Plataformas digitales',
          'Productos híbridos',
          'Recorridos que combinan varios formatos',
        ],
        distinction:
          'El formato no define si existe gamificación. Una hoja de papel puede formar parte de un sistema gameful. Una aplicación digital puede no contener ninguna arquitectura motivacional significativa.',
        applicationPrinciple:
          'Primero preguntamos: ¿qué comportamiento buscamos favorecer?, ¿qué experiencia necesitamos crear?, ¿qué impacto importa?, ¿qué sistema rodea a las personas? Después decidimos qué componentes y qué formato resultan pertinentes.',
      },
    },
  },

  'territorio-4': {
    id: 'territorio-4',
    number: 4,
    narrativeTitle: 'La confluencia',
    functionalQuestion: '¿Cómo vive dentro del Método Plural?',
    functionStatement:
      'Mostrar que gameful design es una lente transversal y distinguir lo que Plural ya hace, dónde existe alineación, qué capacidad nueva aparece y qué no resuelve.',
    opening:
      'Plural no necesita reemplazar su método para incorporar una mirada gameful. El Método Plural define un punto de partida, identifica un comportamiento deseable como punto de llegada, comprende las barreras entre ambos, encuentra ayudas que pueden convertirse en oportunidades de cambio, diseña y prototipa acciones, pilota y evalúa, ajusta, implementa, monitorea y comunica el cambio. La oportunidad no consiste en añadir una sexta etapa. Consiste en integrar una lente transversal que amplíe la manera como las ayudas se convierten en un camino que puede recorrerse: una experiencia con reglas, decisiones, feedback, progresión, relaciones y evidencia.',
    journalPhrase:
      'Dentro del Método Plural funciona como una lente transversal que transforma ayudas en experiencias con agencia, decisiones, feedback, progresión, relaciones y evidencia, sin sustituir el diagnóstico, la ética ni la evaluación de impacto.',
    conclusionCopy:
      'Gamificación no es una sexta etapa ni un apéndice del Método Plural. Es una lente transversal cuya mayor potencia aparece al convertir ayudas en experiencias y acompañar su pilotaje, medición, implementación y escalamiento. El Método Plural determina qué cambio importa, en qué contexto, qué comportamientos están involucrados, qué barreras los sostienen y qué ayudas pueden movilizarlos. La mirada gameful amplía cómo esas ayudas se convierten en experiencias: estructura motivación, agencia, decisiones, feedback, progresión, relaciones y evidencia. Plural no necesita cambiar su método para incorporar esta capacidad. Puede integrarla dentro de lo que ya hace y ampliar el tipo de soluciones que produce.',
    completionCondition: 'Construir el mapa de integración y examinar los cuatro espacios de análisis.',
    specificContent: {
      tableRows: [
        {
          phase: 'Alistar',
          pluralCore: 'Comprender contexto, problema, participantes, alcance y condiciones éticas.',
          gamefulLens: 'Definir la experiencia buscada, los riesgos motivacionales y qué significa éxito dentro y fuera del sistema.',
          alignment: 'Una arquitectura gameful también necesita definir para quién existe el sistema, qué propósito persigue, cuáles son sus límites y qué consecuencias serían aceptables.',
          addedValue: 'Definir la experiencia que se quiere producir, identificar riesgos motivacionales, establecer qué significa éxito dentro y fuera del sistema, anticipar diferentes formas de participación y acordar criterios éticos para reglas, recompensas, datos e influencia.',
          guidingQuestion: '¿Qué experiencia sería coherente con el cambio buscado y con el bienestar de quienes participarán?',
        },
        {
          phase: 'Diagnosticar y analizar',
          pluralCore: 'Identificar comportamientos, actores, barreras, ayudas y factores del ecosistema.',
          gamefulLens: 'Mapear experiencia, motivaciones diversas, agencia, fricciones, recompensas reales y posibles trayectorias.',
          alignment: 'Gameful design también investiga capacidades, motivaciones, relaciones, contexto, fricciones, oportunidades y comportamientos reales.',
          addedValue: 'Mapear la experiencia actual, identificar fuentes diversas de motivación, comprender dónde existe o falta agencia, reconocer recompensas y castigos del mundo real, identificar momentos de tensión, abandono o satisfacción, explorar distintos caminos hacia una misma meta y detectar qué factores pueden convertirse en decisiones, retos, feedback o práctica.',
          guidingQuestion: '¿Cómo viven actualmente las personas este comportamiento y qué condiciones podrían hacer posible otro recorrido?',
        },
        {
          phase: 'Diseñar y prototipar',
          pluralCore: 'Transformar ayudas en acciones pertinentes, co-crearlas y probarlas.',
          gamefulLens: 'Articular reglas, roles, decisiones, retos, feedback, consecuencias, progresión, narrativa y relaciones.',
          alignment: 'Ambas aproximaciones reconocen que una solución debe diseñarse desde las personas, probarse antes de implementarse, observarse en uso y ajustarse a partir de la experiencia real.',
          addedValue: 'Las ayudas pueden convertirse en una arquitectura compuesta por objetivos, reglas, roles, agencia, decisiones, recursos, retos, feedback, consecuencias, progresión, narrativa, cooperación, ciclos y trayectorias alternativas. La divergencia y convergencia del método pueden trasladarse a la experiencia: diferentes personas exploran trayectorias y estrategias distintas sin perder un propósito compartido.',
          guidingQuestion: '¿Cómo convertimos estas ayudas en un sistema que las personas puedan comprender, recorrer, decidir y experimentar?',
        },
        {
          phase: 'Pilotear y evaluar',
          pluralCore: 'Probar si la acción conduce al comportamiento deseable, evaluar y ajustar.',
          gamefulLens: 'Integrar evidencia en la experiencia, observar interacción y ajustar dificultad, feedback o progresión.',
          alignment: 'Los sistemas gameful también se desarrollan mediante prototipado, playtesting, observación, iteración y aprendizaje a partir de comportamientos emergentes.',
          addedValue: 'Capturar evidencia dentro de la interacción, observar decisiones, rutas, tiempos, intentos y abandonos, evaluar experiencia y motivación además de finalización, detectar estrategias no anticipadas, integrar preguntas sin romper innecesariamente el flujo y ajustar dificultad, feedback o progresión. Esto complementa, pero no sustituye, la estrategia de evaluación de impacto.',
          guidingQuestion: '¿Qué revela la manera como las personas recorren la experiencia y qué necesitamos evaluar por otros medios?',
        },
        {
          phase: 'Implementar, monitorear y comunicar',
          pluralCore: 'Ejecutar, acompañar, monitorear, adaptar y comunicar el cambio.',
          gamefulLens: 'Aumentar fidelidad, sostener ciclos de participación, adaptar recorridos y convertir intervenciones en sistemas replicables.',
          alignment: 'Una arquitectura gameful debe observarse como un sistema vivo que cambia con las personas, el contexto, el tiempo y los usos no previstos.',
          addedValue: 'Codificar elementos esenciales de la experiencia, aumentar fidelidad entre implementaciones, sostener ciclos de participación, adaptar recorridos, mantener feedback a través del tiempo, convertir una intervención en una herramienta replicable y explorar cuándo lo digital permite persistencia, personalización o escala.',
          guidingQuestion: '¿Qué debe permanecer estable, qué debe adaptarse y qué puede convertirse en una capacidad replicable?',
        },
      ],
      fourSpaces: [
        {
          id: 'space-already-does',
          title: 'Espacio 1. Lo que Plural ya hace',
          copyBrief: 'Gameful design no reemplaza ni renombra las capacidades que Plural ya posee.',
          content:
            'La gamificación no introduce en Plural pensamiento sistémico, ciencias del comportamiento, investigación contextual, definición de conductas, co-creación, diseño centrado en la experiencia, prototipado, iteración, evaluación, reflexión ética ni orientación al bienestar colectivo. Estas capacidades ya forman parte del Método Plural. Atribuírselas a gamificación reduciría el valor de lo que Plural ha construido y debilitaría la integración.',
        },
        {
          id: 'space-alignment',
          title: 'Espacio 2. Donde existe alineación',
          copyBrief: 'La integración es posible porque las dos aproximaciones comparten una lógica contextual, experiencial e iterativa.',
          content:
            'Las dos aproximaciones comparten atención al comportamiento, interés por la motivación, comprensión del contexto, cuidado de la experiencia, diseño centrado en personas, experimentación, iteración y reconocimiento de que forma y fondo son inseparables. Esa compatibilidad permite que gameful design entre en el método sin imponer una lógica ajena.',
        },
        {
          id: 'space-new-capacity',
          title: 'Espacio 3. Donde aparece una capacidad nueva',
          copyBrief: 'La nueva capacidad no está en diagnosticar otro problema, sino en diseñar de otra manera cómo las personas recorren la solución.',
          content:
            'La mirada gameful agrega capacidad para organizar motivación a través del tiempo, diseñar agencia y trayectorias múltiples, articular reglas, decisiones y consecuencias, ofrecer feedback y progresión, crear experiencias compartidas, permitir ensayo seguro, integrar parte de la medición en el recorrido, sostener ciclos de participación, codificar la experiencia y transformar intervenciones valiosas en sistemas replicables.',
        },
        {
          id: 'space-limits',
          title: 'Espacio 4. Lo que no resuelve',
          copyBrief: 'Una experiencia puede apoyar el cambio; no puede sustituir las condiciones materiales, culturales, institucionales y políticas que lo hacen posible.',
          content:
            'Gamificación no sustituye recursos inexistentes, infraestructura insuficiente, capacidad institucional, transformaciones jurídicas, cambios de política, protección frente a riesgos reales, redistribución del poder, intervención sobre violencias estructurales ni una metodología rigurosa de evaluación de impacto. Puede ayudar a hacer visibles algunos de estos sistemas, practicar respuestas, coordinar actores, explorar alternativas y acompañar comportamientos. Pero no debe convertir problemas estructurales en responsabilidades individuales, premiar superficialmente conductas sensibles, utilizar coerción disfrazada de motivación, convertir problemas sociales en entretenimiento ni confundir engagement con impacto.',
        },
      ],
      frameworksSecondary: {
        title: 'Tres marcos para mirar el cambio (Capa de profundización)',
        clarification: 'Este contenido permanece en una capa secundaria para enriquecer la mirada analítica.',
        frames: [
          { name: 'i-frame — Marco individual', text: 'Se concentra en las decisiones, capacidades y comportamientos de las personas dentro de un sistema dado.' },
          { name: 'c-frame — Marco comunitario o colectivo', text: 'Observa cómo las comunidades y actores colectivos se coordinan, construyen capacidad, sostienen acciones y pueden conectar comportamientos individuales con transformaciones más amplias.' },
          { name: 's-frame — Marco sistémico', text: 'Interviene sobre reglas, instituciones, infraestructura, políticas, incentivos estructurales y relaciones de poder.' },
        ],
        integration: 'Una intervención responsable no tiene que escoger uno y olvidar los demás. Debe comprender cómo interactúan. Un sistema gameful puede permitir práctica individual, organizar cooperación, hacer visibles interdependencias y apoyar acción colectiva. Pero no debe presentar una experiencia individual como sustituto de cambios culturales, materiales, institucionales o políticos.',
      },
      vbgExample: {
        title: 'Una pista ya presente en Plural (Ejemplo de aplicación situado)',
        notice: 'Este caso está claramente identificado como un ejemplo de aplicación, no como la definición universal del Método Plural.',
        body: 'En la aplicación del método a VBG (Violencias Basadas en Género), cuidado y derechos sexuales y reproductivos aparecen una metáfora de recorrido, ruedas comportamentales, mapas del cambio, historias, escenarios, elecciones y actividades participativas. Estos recursos muestran que Plural ya trabaja con experiencias lúdicas y narrativas. No constituyen necesariamente una arquitectura gameful completa: la nueva capacidad consistiría en articular propósito, reglas, agencia, decisiones, consecuencias, feedback, progresión, relaciones y evidencia como partes de un mismo sistema.',
      },
    },
  },

  'territorio-5': {
    id: 'territorio-5',
    number: 5,
    narrativeTitle: 'Donde el río se abre',
    functionalQuestion: '¿Dónde comenzamos?',
    functionStatement: 'Abrir la conversación sobre proyectos reales, no presentar soluciones prefabricadas.',
    opening:
      'No necesitamos inventar un proyecto sin contexto ni decidir ahora cuál es la solución. Podemos comenzar identificando una necesidad existente, formulando buenas preguntas y construyendo un primer piloto del cual aprender. En este punto el río se abre en tres afluentes. Cada uno representa una manera diferente de comenzar a trabajar juntos: mejorar la experiencia de medición; convertir una intervención valiosa en un producto; o formular nuevas oportunidades.',
    journalPhrase:
      'Podemos comenzar mejorando la experiencia de medición, convirtiendo una intervención validada en un producto replicable o incorporando esta capacidad desde la formulación de nuevas oportunidades.',
    conclusionCopy:
      'No necesitamos comenzar con una solución grande ni definitiva. Podemos identificar una necesidad real, elegir un primer afluente, diseñar un piloto acotado y aprender juntos. En esta parte del río nos encontramos. Desde aquí, decidimos cómo continuar.',
    completionCondition: 'Explorar los tres afluentes del delta.',
    specificContent: {
      tributariesList: [
        'evaluation-as-experience',
        'from-intervention-to-product',
        'new-horizons',
      ],
    },
  },
};
