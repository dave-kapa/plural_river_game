import { TerritoryStatus, TraversalProgress } from '../persistence/types';
import {
  computeAllTerritoryDiscoveries,
  computeGlobalDiscoveryPercent,
  isFullDiscoveryReached,
} from './discoveryRegistry';

export const ALL_TRIBUTARIES = [
  'evaluation-as-experience',
  'from-intervention-to-product',
  'new-horizons',
] as const;

export type TributaryId = (typeof ALL_TRIBUTARIES)[number];

/**
 * Calcula el estado de desbloqueo de cada territorio en base al progreso actual.
 * Respeta la jerarquía no lineal del río:
 * - Territorio 1: desbloqueado si entryCompleted es true.
 * - Territorio 2 y 3: desbloqueados si Territorio 1 está 'completed'.
 * - Territorio 4: desbloqueado ÚNICAMENTE si Territorio 2 y 3 están 'completed'.
 * - Territorio 5: desbloqueado si Territorio 4 está 'completed'.
 */
export function computeTerritoryStatuses(
  entryCompleted: boolean,
  currentStatuses: Record<string, TerritoryStatus>,
  visitedTributaries: string[] = []
): Record<string, TerritoryStatus> {
  const next: Record<string, TerritoryStatus> = { ...currentStatuses };

  // Territorio 1: El manantial del río.
  // Nunca debe revertirse a 'locked' si ya fue completado o visitado.
  if (next['territorio-1'] === 'completed') {
    // Se preserva 'completed'
  } else if (entryCompleted || next['territorio-1'] === 'visited' || next['territorio-1'] === 'unlocked') {
    next['territorio-1'] = next['territorio-1'] === 'visited' ? 'visited' : 'unlocked';
  } else {
    next['territorio-1'] = 'locked';
  }

  // Si cualquiera de los territorios posteriores ya fue visitado o completado,
  // Territorio 1 está indiscutiblemente completado
  const hasProgressedPastT1 =
    next['territorio-2'] === 'completed' ||
    next['territorio-2'] === 'visited' ||
    next['territorio-3'] === 'completed' ||
    next['territorio-3'] === 'visited' ||
    next['territorio-4'] === 'completed' ||
    next['territorio-4'] === 'visited' ||
    next['territorio-5'] === 'completed' ||
    next['territorio-5'] === 'visited';

  if (hasProgressedPastT1) {
    next['territorio-1'] = 'completed';
  }

  const t1Completed = next['territorio-1'] === 'completed';

  // Territorio 2 y 3: Se desbloquean al completar Territorio 1
  if (t1Completed) {
    if (!next['territorio-2'] || next['territorio-2'] === 'locked') {
      next['territorio-2'] = 'unlocked';
    }
    if (!next['territorio-3'] || next['territorio-3'] === 'locked') {
      next['territorio-3'] = 'unlocked';
    }
  } else {
    if (next['territorio-2'] !== 'completed' && next['territorio-2'] !== 'visited') next['territorio-2'] = 'locked';
    if (next['territorio-3'] !== 'completed' && next['territorio-3'] !== 'visited') next['territorio-3'] = 'locked';
  }

  const t2Completed = next['territorio-2'] === 'completed';
  const t3Completed = next['territorio-3'] === 'completed';

  // Territorio 4: Requiere que AMBOS 2 y 3 estén completados
  if (t2Completed && t3Completed) {
    if (!next['territorio-4'] || next['territorio-4'] === 'locked') {
      next['territorio-4'] = 'unlocked';
    }
  } else {
    if (next['territorio-4'] !== 'completed' && next['territorio-4'] !== 'visited') next['territorio-4'] = 'locked';
  }

  const t4Completed = next['territorio-4'] === 'completed';

  // Territorio 5: Requiere Territorio 4 completado
  if (t4Completed) {
    if (!next['territorio-5'] || next['territorio-5'] === 'locked') {
      next['territorio-5'] = 'unlocked';
    }
  } else {
    if (next['territorio-5'] !== 'completed' && next['territorio-5'] !== 'visited') next['territorio-5'] = 'locked';
  }

  // Si los 3 afluentes finales han sido explorados y registrados, Territorio 5 se completa autoritativamente
  const allTributariesVisited = ALL_TRIBUTARIES.every((trib) => visitedTributaries.includes(trib));
  if (allTributariesVisited && (next['territorio-5'] === 'visited' || next['territorio-5'] === 'unlocked' || next['territorio-5'] === 'completed')) {
    next['territorio-5'] = 'completed';
  }

  return next;
}

/**
 * Determina si los afluentes del delta son navegables.
 * Requiere que el Territorio 4 esté completado y el Territorio 5 habilitado ('unlocked', 'visited' o 'completed').
 */
export function isTributaryAccessible(
  territoryStatuses?: Record<string, TerritoryStatus>
): boolean {
  if (!territoryStatuses) return false;
  const t4Completed = territoryStatuses['territorio-4'] === 'completed';
  const t5Status = territoryStatuses['territorio-5'];
  const t5Enabled = t5Status && t5Status !== 'locked';
  return Boolean(t4Completed && t5Enabled);
}

/**
 * Determina si los créditos están desbloqueados.
 * Requiere haber visitado al menos uno de los afluentes finales dentro de una travesía legítimamente habilitada
 * (Territorio 4 completado y Territorio 5 habilitado; no exige haber completado T5 previamente
 * ya que los afluentes son los que completan su recorrido).
 */
export function areCreditsUnlocked(
  visitedTributaries: string[] = [],
  territoryStatuses?: Record<string, TerritoryStatus>
): boolean {
  const hasVisitedAnyTributary = (visitedTributaries || []).length >= 1;
  if (!hasVisitedAnyTributary) return false;
  if (territoryStatuses) {
    return isTributaryAccessible(territoryStatuses);
  }
  return true;
}

/**
 * Evalúa y reconcilia el progreso completo asegurando consistencia matemática y narrativa.
 */
export function reconcileProgress(progress: TraversalProgress): TraversalProgress {
  // Si el usuario ya completó o visitó el Territorio 1, o tiene interacciones o descubrimientos, la entrada es completada
  const entryCompleted =
    Boolean(progress.entryCompleted) ||
    progress.territoryStatus['territorio-1'] === 'completed' ||
    progress.territoryStatus['territorio-1'] === 'visited' ||
    Object.keys(progress.territoryInteractions || {}).length > 0 ||
    (progress.discoveredItems || []).length > 0;

  const recalculatedStatuses = computeTerritoryStatuses(
    entryCompleted,
    progress.territoryStatus,
    progress.visitedTributaries || []
  );

  const creditsUnlocked = areCreditsUnlocked(
    progress.visitedTributaries || [],
    recalculatedStatuses
  );
  const nextJournalEntries: Record<string, string> = { ...(progress.journalEntries || {}) };
  if (creditsUnlocked) {
    recalculatedStatuses['territorio-5'] = 'completed';
    if (!nextJournalEntries['territorio-5']) {
      nextJournalEntries['territorio-5'] =
        'Podemos comenzar mejorando la experiencia de medición, convirtiendo una intervención validada en un producto replicable o incorporando esta capacidad desde la formulación de nuevas oportunidades.';
    }
  }

  const discoveredItems = Array.from(new Set(progress.discoveredItems || []));
  const territoryDiscoveryPercent = computeAllTerritoryDiscoveries(discoveredItems);
  const globalDiscoveryPercent = computeGlobalDiscoveryPercent(discoveredItems);
  const fullDiscoveryReached =
    Boolean(progress.fullDiscoveryReached) || isFullDiscoveryReached(discoveredItems);

  return {
    ...progress,
    entryCompleted,
    territoryStatus: recalculatedStatuses,
    visitedTributaries: progress.visitedTributaries || [],
    journalEntries: nextJournalEntries,
    territoryInteractions: progress.territoryInteractions || {},
    creditsUnlocked,
    discoveredItems,
    territoryDiscoveryPercent,
    globalDiscoveryPercent,
    fullDiscoveryReached,
    updatedAt: new Date().toISOString(),
  };
}
