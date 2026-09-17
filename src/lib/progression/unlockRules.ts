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
  currentStatuses: Record<string, TerritoryStatus>
): Record<string, TerritoryStatus> {
  const next: Record<string, TerritoryStatus> = { ...currentStatuses };

  // Territorio 1
  if (entryCompleted) {
    if (!next['territorio-1'] || next['territorio-1'] === 'locked') {
      next['territorio-1'] = 'unlocked';
    }
  } else {
    next['territorio-1'] = 'locked';
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
    if (next['territorio-2'] !== 'completed') next['territorio-2'] = 'locked';
    if (next['territorio-3'] !== 'completed') next['territorio-3'] = 'locked';
  }

  const t2Completed = next['territorio-2'] === 'completed';
  const t3Completed = next['territorio-3'] === 'completed';

  // Territorio 4: Requiere que AMBOS 2 y 3 estén completados
  if (t2Completed && t3Completed) {
    if (!next['territorio-4'] || next['territorio-4'] === 'locked') {
      next['territorio-4'] = 'unlocked';
    }
  } else {
    if (next['territorio-4'] !== 'completed') next['territorio-4'] = 'locked';
  }

  const t4Completed = next['territorio-4'] === 'completed';

  // Territorio 5: Requiere Territorio 4 completado
  if (t4Completed) {
    if (!next['territorio-5'] || next['territorio-5'] === 'locked') {
      next['territorio-5'] = 'unlocked';
    }
  } else {
    if (next['territorio-5'] !== 'completed') next['territorio-5'] = 'locked';
  }

  return next;
}

/**
 * Determina si los créditos están desbloqueados.
 * Requiere haber visitado los 3 afluentes finales y tener el Territorio 5 completado o visitado.
 */
export function areCreditsUnlocked(
  visitedTributaries: string[]
): boolean {
  return ALL_TRIBUTARIES.every((trib) => visitedTributaries.includes(trib));
}

/**
 * Evalúa y reconcilia el progreso completo asegurando consistencia matemática y narrativa.
 */
export function reconcileProgress(progress: TraversalProgress): TraversalProgress {
  const recalculatedStatuses = computeTerritoryStatuses(
    progress.entryCompleted,
    progress.territoryStatus
  );

  const creditsUnlocked = areCreditsUnlocked(progress.visitedTributaries || []);

  const discoveredItems = Array.from(new Set(progress.discoveredItems || []));
  const territoryDiscoveryPercent = computeAllTerritoryDiscoveries(discoveredItems);
  const globalDiscoveryPercent = computeGlobalDiscoveryPercent(discoveredItems);
  const fullDiscoveryReached =
    Boolean(progress.fullDiscoveryReached) || isFullDiscoveryReached(discoveredItems);

  return {
    ...progress,
    territoryStatus: recalculatedStatuses,
    visitedTributaries: progress.visitedTributaries || [],
    journalEntries: progress.journalEntries || {},
    territoryInteractions: progress.territoryInteractions || {},
    creditsUnlocked,
    discoveredItems,
    territoryDiscoveryPercent,
    globalDiscoveryPercent,
    fullDiscoveryReached,
    updatedAt: new Date().toISOString(),
  };
}
