/**
 * Registro Declarativo de Elementos Descubribles del Ecosistema
 * Plural Gameful River
 *
 * Cada elemento cuenta con un identificador único y estable.
 * El cálculo de descubrimiento evalúa el porcentaje por territorio y luego
 * promedia los 5 territorios de manera uniforme (20% cada uno),
 * evitando que territorios con muchos componentes (como el Territorio 3 con 31)
 * dominen la métrica global.
 */

export interface DiscoverableItem {
  id: string;
  territoryId: 'territorio-1' | 'territorio-2' | 'territorio-3' | 'territorio-4' | 'territorio-5';
  label: string;
}

export const ALL_TERRITORY_IDS = [
  'territorio-1',
  'territorio-2',
  'territorio-3',
  'territorio-4',
  'territorio-5',
] as const;

export type TerritoryId = (typeof ALL_TERRITORY_IDS)[number];

export const DISCOVERY_REGISTRY: Record<TerritoryId, DiscoverableItem[]> = {
  'territorio-1': [
    // 6 disciplinas que articulan la definición
    { id: 't1:disc:ciencias-del-comportamiento', territoryId: 'territorio-1', label: 'Ciencias del comportamiento' },
    { id: 't1:disc:psicologia', territoryId: 'territorio-1', label: 'Psicología' },
    { id: 't1:disc:neurociencia-cognitiva', territoryId: 'territorio-1', label: 'Neurociencia cognitiva' },
    { id: 't1:disc:experiencia-de-usuario', territoryId: 'territorio-1', label: 'Experiencia de usuario' },
    { id: 't1:disc:narrativa', territoryId: 'territorio-1', label: 'Narrativa' },
    { id: 't1:disc:diseno-de-juegos', territoryId: 'territorio-1', label: 'Diseño de juegos' },
    // Definición canónica articulada
    { id: 't1:definition:built', territoryId: 'territorio-1', label: 'Definición integrada articulada' },
    // 4 lentes de diseño
    { id: 't1:lens:lens-behavior', territoryId: 'territorio-1', label: 'Lente: Behavior — Comportamiento' },
    { id: 't1:lens:lens-experience', territoryId: 'territorio-1', label: 'Lente: Experience — Experiencia' },
    { id: 't1:lens:lens-impact', territoryId: 'territorio-1', label: 'Lente: Meaningful Impact' },
    { id: 't1:lens:lens-systemic', territoryId: 'territorio-1', label: 'Lente: Mirada sistémica' },
    // Distinción conceptual
    { id: 't1:concept:playful-vs-gameful', territoryId: 'territorio-1', label: 'Diferencia Playful vs Gameful' },
    // 3 falsas rutas descartadas / exploradas
    { id: 't1:discard:points', territoryId: 'territorio-1', label: 'Descarte: Puntos, medallas y rankings' },
    { id: 't1:discard:cosmetics', territoryId: 'territorio-1', label: 'Descarte: Capa cosmética superficial' },
    { id: 't1:discard:coercion', territoryId: 'territorio-1', label: 'Descarte: Coerción o manipulación' },
  ],

  'territorio-2': [
    // 3 fuerzas principales
    { id: 't2:force:force-scale', territoryId: 'territorio-2', label: 'Fuerza 1: Escalabilidad' },
    { id: 't2:force:force-measure', territoryId: 'territorio-2', label: 'Fuerza 2: Medición integrada' },
    { id: 't2:force:force-innovation', territoryId: 'territorio-2', label: 'Fuerza 3: Innovación en la experiencia' },
    // 6 capacidades adicionales
    { id: 't2:capacity:cap-emotional', territoryId: 'territorio-2', label: 'Capacidad: Experiencia emocionalmente positiva' },
    { id: 't2:capacity:cap-motivation-arch', territoryId: 'territorio-2', label: 'Capacidad: Arquitectura motivacional' },
    { id: 't2:capacity:cap-shared-exp', territoryId: 'territorio-2', label: 'Capacidad: Experiencia compartida' },
    { id: 't2:capacity:cap-time-journey', territoryId: 'territorio-2', label: 'Capacidad: Experiencia a través del tiempo' },
    { id: 't2:capacity:cap-safe-learning', territoryId: 'territorio-2', label: 'Capacidad: Aprendizaje y ensayo seguro' },
    { id: 't2:capacity:cap-persistence', territoryId: 'territorio-2', label: 'Capacidad: Persistencia' },
    // 4 escalas del cambio
    { id: 't2:scale:persona', territoryId: 'territorio-2', label: 'Escala: Persona' },
    { id: 't2:scale:relaciones-y-comunidad', territoryId: 'territorio-2', label: 'Escala: Relaciones y comunidad' },
    { id: 't2:scale:accion-colectiva', territoryId: 'territorio-2', label: 'Escala: Acción colectiva' },
    { id: 't2:scale:cultura-y-sistema', territoryId: 'territorio-2', label: 'Escala: Cultura y sistema' },
  ],

  'territorio-3': [
    // 7 zonas del ecosistema
    { id: 't3:zone:zone-roots', territoryId: 'territorio-3', label: 'Zona: Las raíces (propósito e impacto)' },
    { id: 't3:zone:zone-bed', territoryId: 'territorio-3', label: 'Zona: El cauce (estructura y dirección)' },
    { id: 't3:zone:zone-branches', territoryId: 'territorio-3', label: 'Zona: Las ramas (agencia y decisión)' },
    { id: 't3:zone:zone-leaves', territoryId: 'territorio-3', label: 'Zona: Las hojas (experiencia y motivación)' },
    { id: 't3:zone:zone-canopy', territoryId: 'territorio-3', label: 'Zona: La copa (historia, descubrimiento y tiempo)' },
    { id: 't3:zone:zone-collective', territoryId: 'territorio-3', label: 'Zona: El ecosistema (relaciones y acción colectiva)' },
    { id: 't3:zone:zone-traces', territoryId: 'territorio-3', label: 'Zona: Las huellas (evidencia y transferencia)' },

    // 31 componentes arquitectónicos individuales
    { id: 't3:comp:proposito', territoryId: 'territorio-3', label: 'Componente: Propósito' },
    { id: 't3:comp:comportamientos', territoryId: 'territorio-3', label: 'Componente: Comportamientos' },
    { id: 't3:comp:impacto-significativo', territoryId: 'territorio-3', label: 'Componente: Impacto significativo' },
    { id: 't3:comp:objetivos', territoryId: 'territorio-3', label: 'Componente: Objetivos' },
    { id: 't3:comp:reglas', territoryId: 'territorio-3', label: 'Componente: Reglas' },
    { id: 't3:comp:roles', territoryId: 'territorio-3', label: 'Componente: Roles' },
    { id: 't3:comp:recursos', territoryId: 'territorio-3', label: 'Componente: Recursos' },
    { id: 't3:comp:restricciones', territoryId: 'territorio-3', label: 'Componente: Restricciones' },
    { id: 't3:comp:agencia', territoryId: 'territorio-3', label: 'Componente: Agencia' },
    { id: 't3:comp:decisiones', territoryId: 'territorio-3', label: 'Componente: Decisiones' },
    { id: 't3:comp:trayectorias-alternativas', territoryId: 'territorio-3', label: 'Componente: Trayectorias alternativas' },
    { id: 't3:comp:misiones-principales-y-secundarias', territoryId: 'territorio-3', label: 'Componente: Misiones principales y secundarias' },
    { id: 't3:comp:retos', territoryId: 'territorio-3', label: 'Componente: Retos' },
    { id: 't3:comp:dificultad-progresiva', territoryId: 'territorio-3', label: 'Componente: Dificultad progresiva' },
    { id: 't3:comp:scaffolding', territoryId: 'territorio-3', label: 'Componente: Scaffolding' },
    { id: 't3:comp:feedback', territoryId: 'territorio-3', label: 'Componente: Feedback' },
    { id: 't3:comp:consecuencias', territoryId: 'territorio-3', label: 'Componente: Consecuencias' },
    { id: 't3:comp:progresion', territoryId: 'territorio-3', label: 'Componente: Progresión' },
    { id: 't3:comp:emociones', territoryId: 'territorio-3', label: 'Componente: Emociones' },
    { id: 't3:comp:narrativa', territoryId: 'territorio-3', label: 'Componente: Narrativa' },
    { id: 't3:comp:descubrimiento', territoryId: 'territorio-3', label: 'Componente: Descubrimiento' },
    { id: 't3:comp:incertidumbre', territoryId: 'territorio-3', label: 'Componente: Incertidumbre' },
    { id: 't3:comp:ciclos-de-participacion', territoryId: 'territorio-3', label: 'Componente: Ciclos de participación' },
    { id: 't3:comp:cooperacion', territoryId: 'territorio-3', label: 'Componente: Cooperación' },
    { id: 't3:comp:competencia', territoryId: 'territorio-3', label: 'Componente: Competencia' },
    { id: 't3:comp:relaciones', territoryId: 'territorio-3', label: 'Componente: Relaciones' },
    { id: 't3:comp:normas-sociales', territoryId: 'territorio-3', label: 'Componente: Normas sociales' },
    { id: 't3:comp:experiencia-compartida', territoryId: 'territorio-3', label: 'Componente: Experiencia compartida' },
    { id: 't3:comp:medicion-integrada', territoryId: 'territorio-3', label: 'Componente: Medición integrada' },
    { id: 't3:comp:reflexion', territoryId: 'territorio-3', label: 'Componente: Reflexión' },
    { id: 't3:comp:transferencia', territoryId: 'territorio-3', label: 'Componente: Transferencia' },

    // Hábitats y formatos
    { id: 't3:habitats:where-it-lives', territoryId: 'territorio-3', label: 'Hábitats: ¿Dónde puede vivir esta capacidad?' },
  ],

  'territorio-4': [
    // 5 fases de la tabla comparativa
    { id: 't4:phase:0', territoryId: 'territorio-4', label: 'Fase 1: Diagnóstico e investigación contextual' },
    { id: 't4:phase:1', territoryId: 'territorio-4', label: 'Fase 2: Definición y co-diseño de la estrategia' },
    { id: 't4:phase:2', territoryId: 'territorio-4', label: 'Fase 3: Prototipado y pruebas de experiencia' },
    { id: 't4:phase:3', territoryId: 'territorio-4', label: 'Fase 4: Desarrollo, producción y alianzas' },
    { id: 't4:phase:4', territoryId: 'territorio-4', label: 'Fase 5: Implementar, monitorear y comunicar' },
    // 4 espacios de análisis
    { id: 't4:space:space-already-does', territoryId: 'territorio-4', label: 'Espacio 1: Lo que Plural ya hace' },
    { id: 't4:space:space-alignment', territoryId: 'territorio-4', label: 'Espacio 2: Donde existe alineación' },
    { id: 't4:space:space-new-capacity', territoryId: 'territorio-4', label: 'Espacio 3: Donde aparece una capacidad nueva' },
    { id: 't4:space:space-limits', territoryId: 'territorio-4', label: 'Espacio 4: Lo que no resuelve' },
    // Profundizaciones secundarias
    { id: 't4:framework:ics-frame', territoryId: 'territorio-4', label: 'Marco de profundización: i/c/s-frame' },
    { id: 't4:example:vbg', territoryId: 'territorio-4', label: 'Ejemplo situado de aplicación: Caso VBG' },
  ],

  'territorio-5': [
    // 3 afluentes del delta
    { id: 't5:tributary:evaluation-as-experience', territoryId: 'territorio-5', label: 'Afluente: Evaluación como experiencia' },
    { id: 't5:tributary:from-intervention-to-product', territoryId: 'territorio-5', label: 'Afluente: De intervención a producto' },
    { id: 't5:tributary:new-horizons', territoryId: 'territorio-5', label: 'Afluente: Nuevos horizontes' },
    // 4 modalidades de colaboración
    { id: 't5:modality:diagnostico', territoryId: 'territorio-5', label: 'Modalidad: Diagnóstico y exploración conjunta' },
    { id: 't5:modality:prototipo', territoryId: 'territorio-5', label: 'Modalidad: Prototipo acotado' },
    { id: 't5:modality:capacitacion', territoryId: 'territorio-5', label: 'Modalidad: Capacitación e instalación de capacidad' },
    { id: 't5:modality:integracion', territoryId: 'territorio-5', label: 'Modalidad: Integración metodológica en proyectos existentes' },
    // Convergencia del Delta
    { id: 't5:encounter:convergence', territoryId: 'territorio-5', label: 'Convergencia: En esta parte del río nos encontramos' },
  ],
};

export const TOTAL_ITEMS_PER_TERRITORY: Record<TerritoryId, number> = {
  'territorio-1': DISCOVERY_REGISTRY['territorio-1'].length,
  'territorio-2': DISCOVERY_REGISTRY['territorio-2'].length,
  'territorio-3': DISCOVERY_REGISTRY['territorio-3'].length,
  'territorio-4': DISCOVERY_REGISTRY['territorio-4'].length,
  'territorio-5': DISCOVERY_REGISTRY['territorio-5'].length,
};

export const LEGACY_DISCOVERY_MAP: Record<string, string> = {
  't1:disc:psicologia-cognitiva-social': 't1:disc:psicologia',
  't1:disc:narrativa-transmedia': 't1:disc:narrativa',
};

export function normalizeDiscoveredItems(items: string[] = []): string[] {
  const result = new Set<string>();
  for (const id of items) {
    const mapped = LEGACY_DISCOVERY_MAP[id] || id;
    result.add(mapped);
  }
  return Array.from(result);
}

export function computeTerritoryDiscoveryPercent(
  territoryId: TerritoryId,
  discoveredItems: string[] = []
): number {
  const items = DISCOVERY_REGISTRY[territoryId];
  if (!items || items.length === 0) return 0;

  const normalized = normalizeDiscoveredItems(discoveredItems);
  const discoveredSet = new Set(normalized);
  const foundCount = items.filter((item) => discoveredSet.has(item.id)).length;

  const percent = Math.round((foundCount / items.length) * 100);
  return Math.min(100, Math.max(0, percent));
}

export function computeAllTerritoryDiscoveries(
  discoveredItems: string[] = []
): Record<TerritoryId, number> {
  return {
    'territorio-1': computeTerritoryDiscoveryPercent('territorio-1', discoveredItems),
    'territorio-2': computeTerritoryDiscoveryPercent('territorio-2', discoveredItems),
    'territorio-3': computeTerritoryDiscoveryPercent('territorio-3', discoveredItems),
    'territorio-4': computeTerritoryDiscoveryPercent('territorio-4', discoveredItems),
    'territorio-5': computeTerritoryDiscoveryPercent('territorio-5', discoveredItems),
  };
}

export function computeGlobalDiscoveryPercent(
  discoveredItems: string[] = []
): number {
  const perTerritory = computeAllTerritoryDiscoveries(discoveredItems);
  const values = Object.values(perTerritory);

  if (values.length === 0) return 0;

  const sum = values.reduce((acc, curr) => acc + curr, 0);
  const average = Math.round(sum / values.length);

  return Math.min(100, Math.max(0, average));
}

export function isFullDiscoveryReached(
  discoveredItems: string[] = []
): boolean {
  return computeGlobalDiscoveryPercent(discoveredItems) === 100;
}
