import { describe, it, expect } from 'vitest';
import {
  computeTerritoryStatuses,
  areCreditsUnlocked,
  isTributaryAccessible,
  reconcileProgress,
  ALL_TRIBUTARIES,
} from '../src/lib/progression/unlockRules';
import { INITIAL_PROGRESS } from '../src/lib/persistence/types';

describe('Reglas de Desbloqueo Fluvial (unlockRules)', () => {
  it('inicialmente todos los territorios deben estar bloqueados si la entrada no se ha completado', () => {
    const statuses = computeTerritoryStatuses(false, INITIAL_PROGRESS.territoryStatus);

    expect(statuses['territorio-1']).toBe('locked');
    expect(statuses['territorio-2']).toBe('locked');
    expect(statuses['territorio-3']).toBe('locked');
    expect(statuses['territorio-4']).toBe('locked');
    expect(statuses['territorio-5']).toBe('locked');
  });

  it('al completar la entrada, el Territorio 1 se desbloquea', () => {
    const statuses = computeTerritoryStatuses(true, INITIAL_PROGRESS.territoryStatus);

    expect(statuses['territorio-1']).toBe('unlocked');
    expect(statuses['territorio-2']).toBe('locked');
    expect(statuses['territorio-3']).toBe('locked');
    expect(statuses['territorio-4']).toBe('locked');
    expect(statuses['territorio-5']).toBe('locked');
  });

  it('al completar el Territorio 1, se desbloquean AMBOS Territorio 2 y 3 en paralelo', () => {
    const initialStatuses = {
      ...INITIAL_PROGRESS.territoryStatus,
      'territorio-1': 'completed' as const,
    };
    const statuses = computeTerritoryStatuses(true, initialStatuses);

    expect(statuses['territorio-1']).toBe('completed');
    expect(statuses['territorio-2']).toBe('unlocked');
    expect(statuses['territorio-3']).toBe('unlocked');
    expect(statuses['territorio-4']).toBe('locked');
  });

  it('si Territorio 1 está completed, nunca se revierte a locked aunque entryCompleted sea false y desbloquea T2 y T3', () => {
    const initialStatuses = {
      ...INITIAL_PROGRESS.territoryStatus,
      'territorio-1': 'completed' as const,
    };
    const statuses = computeTerritoryStatuses(false, initialStatuses);

    expect(statuses['territorio-1']).toBe('completed');
    expect(statuses['territorio-2']).toBe('unlocked');
    expect(statuses['territorio-3']).toBe('unlocked');
  });

  it('un territorio visitado (p. ej. Territorio 2) nunca se revierte a locked y preserva Territorio 1 como completed', () => {
    const statuses = computeTerritoryStatuses(false, {
      ...INITIAL_PROGRESS.territoryStatus,
      'territorio-2': 'visited' as const,
    });

    expect(statuses['territorio-1']).toBe('completed');
    expect(statuses['territorio-2']).toBe('visited');
    expect(statuses['territorio-3']).toBe('unlocked');
  });

  it('permite recorrer primero el Territorio 2 y luego el 3, manteniendo T4 bloqueado hasta que ambos estén completados', () => {
    // 1. Completar T2 primero
    const step1 = computeTerritoryStatuses(true, {
      ...INITIAL_PROGRESS.territoryStatus,
      'territorio-1': 'completed',
      'territorio-2': 'completed',
      'territorio-3': 'unlocked',
    });

    expect(step1['territorio-2']).toBe('completed');
    expect(step1['territorio-3']).toBe('unlocked');
    expect(step1['territorio-4']).toBe('locked'); // T4 sigue bloqueado

    // 2. Completar T3 después
    const step2 = computeTerritoryStatuses(true, {
      ...step1,
      'territorio-3': 'completed',
    });

    expect(step2['territorio-4']).toBe('unlocked'); // Ahora T4 se desbloquea
  });

  it('permite recorrer primero el Territorio 3 y luego el 2 (orden inverso)', () => {
    // 1. Completar T3 primero
    const step1 = computeTerritoryStatuses(true, {
      ...INITIAL_PROGRESS.territoryStatus,
      'territorio-1': 'completed',
      'territorio-3': 'completed',
      'territorio-2': 'unlocked',
    });

    expect(step1['territorio-3']).toBe('completed');
    expect(step1['territorio-2']).toBe('unlocked');
    expect(step1['territorio-4']).toBe('locked'); // T4 sigue bloqueado

    // 2. Completar T2 después
    const step2 = computeTerritoryStatuses(true, {
      ...step1,
      'territorio-2': 'completed',
    });

    expect(step2['territorio-4']).toBe('unlocked'); // T4 se desbloquea
  });

  it('el Territorio 5 se desbloquea únicamente al completar el Territorio 4', () => {
    const preT4 = computeTerritoryStatuses(true, {
      'territorio-1': 'completed',
      'territorio-2': 'completed',
      'territorio-3': 'completed',
      'territorio-4': 'unlocked',
      'territorio-5': 'locked',
    });

    expect(preT4['territorio-5']).toBe('locked');

    const postT4 = computeTerritoryStatuses(true, {
      ...preT4,
      'territorio-4': 'completed',
    });

    expect(postT4['territorio-5']).toBe('unlocked');
  });

  it('los créditos se desbloquean tras visitar al menos un afluente del delta', () => {
    expect(areCreditsUnlocked([])).toBe(false);
    expect(areCreditsUnlocked(['evaluation-as-experience'])).toBe(true);
    expect(areCreditsUnlocked(['evaluation-as-experience', 'from-intervention-to-product'])).toBe(true);

    // Cuando los 3 están presentes
    expect(
      areCreditsUnlocked([
        'evaluation-as-experience',
        'from-intervention-to-product',
        'new-horizons',
      ])
    ).toBe(true);

    // En cualquier orden de visita
    expect(
      areCreditsUnlocked([
        'new-horizons',
        'evaluation-as-experience',
        'from-intervention-to-product',
      ])
    ).toBe(true);
  });

  it('bloquea el desbloqueo de créditos si los 3 afluentes se visitan en una travesía nueva sin completar T4', () => {
    const newTraversalStatuses = {
      'territorio-1': 'unlocked' as const,
      'territorio-2': 'locked' as const,
      'territorio-3': 'locked' as const,
      'territorio-4': 'locked' as const,
      'territorio-5': 'locked' as const,
    };

    const unlocked = areCreditsUnlocked([...ALL_TRIBUTARIES], newTraversalStatuses);
    expect(unlocked).toBe(false);

    const reconciled = reconcileProgress({
      ...INITIAL_PROGRESS,
      entryCompleted: true,
      territoryStatus: newTraversalStatuses,
      visitedTributaries: [...ALL_TRIBUTARIES],
    });

    expect(reconciled.creditsUnlocked).toBe(false);
    expect(reconciled.territoryStatus['territorio-5']).not.toBe('completed');
  });

  it('permite desbloquear créditos cuando se visitan los 3 afluentes tras completar legítimamente T4 y habilitar T5', () => {
    const legitTraversalStatuses = {
      'territorio-1': 'completed' as const,
      'territorio-2': 'completed' as const,
      'territorio-3': 'completed' as const,
      'territorio-4': 'completed' as const,
      'territorio-5': 'unlocked' as const,
    };

    const unlocked = areCreditsUnlocked([...ALL_TRIBUTARIES], legitTraversalStatuses);
    expect(unlocked).toBe(true);

    const reconciled = reconcileProgress({
      ...INITIAL_PROGRESS,
      entryCompleted: true,
      territoryStatus: legitTraversalStatuses,
      visitedTributaries: [...ALL_TRIBUTARIES],
    });

    expect(reconciled.creditsUnlocked).toBe(true);
    expect(reconciled.territoryStatus['territorio-5']).toBe('completed');
    expect(reconciled.journalEntries['territorio-5']).toBeDefined();
  });

  it('restaura honestamente estados completed antiguos sin inventar descubrimientos ni reiniciar el progreso', () => {
    const legacyState = {
      ...INITIAL_PROGRESS,
      entryCompleted: true,
      territoryStatus: {
        'territorio-1': 'completed' as const,
        'territorio-2': 'completed' as const,
        'territorio-3': 'completed' as const,
        'territorio-4': 'completed' as const,
        'territorio-5': 'locked' as const,
      },
      territoryInteractions: {},
      discoveredItems: [],
      visitedTributaries: [],
    };

    const reconciled = reconcileProgress(legacyState);

    // 1. Conserva el progreso previo sin borrarlo ni reiniciarlo
    expect(reconciled.territoryStatus['territorio-1']).toBe('completed');
    expect(reconciled.territoryStatus['territorio-2']).toBe('completed');
    expect(reconciled.territoryStatus['territorio-3']).toBe('completed');
    expect(reconciled.territoryStatus['territorio-4']).toBe('completed');

    // 2. La bitácora cuenta ÚNICAMENTE descubrimientos respaldados por acciones reales
    expect(reconciled.discoveredItems).toHaveLength(0);
    expect(reconciled.globalDiscoveryPercent).toBe(0);
    expect(reconciled.territoryDiscoveryPercent['territorio-1']).toBe(0);
    expect(reconciled.territoryDiscoveryPercent['territorio-2']).toBe(0);
    expect(reconciled.territoryDiscoveryPercent['territorio-4']).toBe(0);
  });

  it('determina con precisión la accesibilidad a la ruta /afluentes/[id] (bloqueado en travesía nueva, habilitado tras T4)', () => {
    // 1. Sin parámetros o travesía fresca: no accesible
    expect(isTributaryAccessible(undefined)).toBe(false);
    expect(
      isTributaryAccessible({
        'territorio-1': 'unlocked',
        'territorio-2': 'locked',
        'territorio-3': 'locked',
        'territorio-4': 'locked',
        'territorio-5': 'locked',
      })
    ).toBe(false);

    // 2. T1 a T3 completados, pero T4 en curso/no completado: no accesible
    expect(
      isTributaryAccessible({
        'territorio-1': 'completed',
        'territorio-2': 'completed',
        'territorio-3': 'completed',
        'territorio-4': 'unlocked',
        'territorio-5': 'locked',
      })
    ).toBe(false);

    // 3. T4 completado y T5 habilitado ('unlocked'): legítimamente accesible sin exigir T5 completado previamente
    expect(
      isTributaryAccessible({
        'territorio-1': 'completed',
        'territorio-2': 'completed',
        'territorio-3': 'completed',
        'territorio-4': 'completed',
        'territorio-5': 'unlocked',
      })
    ).toBe(true);

    // 4. T4 completado y T5 en 'visited': accesible
    expect(
      isTributaryAccessible({
        'territorio-1': 'completed',
        'territorio-2': 'completed',
        'territorio-3': 'completed',
        'territorio-4': 'completed',
        'territorio-5': 'visited',
      })
    ).toBe(true);
  });
});


