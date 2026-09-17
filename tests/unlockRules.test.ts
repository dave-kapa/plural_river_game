import { describe, it, expect } from 'vitest';
import {
  computeTerritoryStatuses,
  areCreditsUnlocked,
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

  it('los créditos solo se desbloquean después de visitar los TRES afluentes del delta', () => {
    expect(areCreditsUnlocked([])).toBe(false);
    expect(areCreditsUnlocked(['evaluation-as-experience'])).toBe(false);
    expect(areCreditsUnlocked(['evaluation-as-experience', 'from-intervention-to-product'])).toBe(false);

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

  it('reconcileProgress mantiene la consistencia total del estado de travesía', () => {
    const inputState = {
      ...INITIAL_PROGRESS,
      entryCompleted: true,
      territoryStatus: {
        'territorio-1': 'completed' as const,
        'territorio-2': 'completed' as const,
        'territorio-3': 'completed' as const,
        'territorio-4': 'completed' as const,
        'territorio-5': 'locked' as const,
      },
      visitedTributaries: [...ALL_TRIBUTARIES],
    };

    const reconciled = reconcileProgress(inputState);

    expect(reconciled.territoryStatus['territorio-5']).toBe('unlocked');
    expect(reconciled.creditsUnlocked).toBe(true);
  });
});
