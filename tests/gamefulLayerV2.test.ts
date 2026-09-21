import { describe, it, expect, beforeEach } from 'vitest';
import {
  DISCOVERY_REGISTRY,
  TOTAL_ITEMS_PER_TERRITORY,
  LEGACY_DISCOVERY_MAP,
  normalizeDiscoveredItems,
  computeTerritoryDiscoveryPercent,
  computeGlobalDiscoveryPercent,
  isFullDiscoveryReached,
} from '../src/lib/progression/discoveryRegistry';
import {
  computeTerritoryStatuses,
  reconcileProgress,
  areCreditsUnlocked,
} from '../src/lib/progression/unlockRules';
import { INITIAL_PROGRESS } from '../src/lib/persistence/types';

describe('Gameful Layer v2 - Verificación de Inconsistencias y Reglas de Progreso', () => {
  describe('Inconsistencia 1 & 2: Registro de disciplinas de T1 y normalización de IDs legados', () => {
    it('las 6 disciplinas de T1 en el registro coinciden exactamente con el documento maestro', () => {
      const t1Disciplines = DISCOVERY_REGISTRY['territorio-1']
        .filter((d) => d.id.startsWith('t1:disc:'))
        .map((d) => d.id);

      expect(t1Disciplines).toEqual([
        't1:disc:ciencias-del-comportamiento',
        't1:disc:psicologia',
        't1:disc:neurociencia-cognitiva',
        't1:disc:experiencia-de-usuario',
        't1:disc:narrativa',
        't1:disc:diseno-de-juegos',
      ]);
      expect(t1Disciplines.length).toBe(6);
    });

    it('normalizeDiscoveredItems migra IDs legados legítimos sin inventar equivalencias no demostradas', () => {
      const legacyItems = [
        't1:disc:psicologia-cognitiva-social',
        't1:disc:narrativa-transmedia',
        't1:disc:diseno-de-juegos',
        't1:disc:diseno-de-sistemas',
        't1:disc:tecnologia-creatividad',
      ];

      const normalized = normalizeDiscoveredItems(legacyItems);

      expect(normalized).toContain('t1:disc:psicologia');
      expect(normalized).toContain('t1:disc:narrativa');
      expect(normalized).toContain('t1:disc:diseno-de-juegos');
      // No inventa equivalencias no demostradas:
      expect(normalized).not.toContain('t1:disc:experiencia-de-usuario');
      expect(normalized).not.toContain('t1:disc:neurociencia-cognitiva');
      expect(new Set(normalized).size).toBe(normalized.length);
    });

    it('los totales de descubrimientos por territorio son exactos y no ficticios', () => {
      expect(TOTAL_ITEMS_PER_TERRITORY['territorio-1']).toBe(15);
      expect(TOTAL_ITEMS_PER_TERRITORY['territorio-2']).toBe(13);
      expect(TOTAL_ITEMS_PER_TERRITORY['territorio-3']).toBe(39);
      expect(TOTAL_ITEMS_PER_TERRITORY['territorio-4']).toBe(11);
      expect(TOTAL_ITEMS_PER_TERRITORY['territorio-5']).toBe(8);

      const totalGlobal = Object.values(TOTAL_ITEMS_PER_TERRITORY).reduce((a, b) => a + b, 0);
      expect(totalGlobal).toBe(86);
    });
  });

  describe('Inconsistencia 5: Condición de carrera de T5 y Créditos', () => {
    it('computeTerritoryStatuses marca territorio-5 como completed de forma inmediata y determinista al visitar los 3 afluentes', () => {
      const statuses = computeTerritoryStatuses(
        true,
        {
          'territorio-1': 'completed',
          'territorio-2': 'completed',
          'territorio-3': 'completed',
          'territorio-4': 'completed',
          'territorio-5': 'visited',
        },
        ['evaluation-as-experience', 'from-intervention-to-product', 'new-horizons']
      );

      expect(statuses['territorio-5']).toBe('completed');
    });

    it('los créditos se desbloquean inmediatamente cuando los 3 afluentes están visitados', () => {
      const unlocked = areCreditsUnlocked(
        ['evaluation-as-experience', 'from-intervention-to-product', 'new-horizons']
      );

      expect(unlocked).toBe(true);
    });

    it('los créditos NO se desbloquean si no se ha visitado ningún afluente', () => {
      const unlocked = areCreditsUnlocked([]);

      expect(unlocked).toBe(false);
    });
  });

  describe('Inconsistencia 4 & 6: Confluencia T4 e independencia de corrientes T2/T3', () => {
    it('T4 requiere tabla completa Y al menos 3 espacios para considerarse completado', () => {
      const stateIncomplete = reconcileProgress({
        ...INITIAL_PROGRESS,
        entryCompleted: true,
        territoryStatus: {
          ...INITIAL_PROGRESS.territoryStatus,
          'territorio-1': 'completed',
          'territorio-2': 'completed',
          'territorio-3': 'completed',
          'territorio-4': 'visited',
        },
        territoryInteractions: {
          'territorio-4': {
            revealedPhasesCount: 5,
            exploredSpaces: ['space-already-does', 'space-alignment'],
          },
        },
      });

      expect(stateIncomplete.territoryStatus['territorio-4']).toBe('visited');
      expect(stateIncomplete.territoryStatus['territorio-5']).toBe('locked');
    });

    it('T4 completado desbloquea T5', () => {
      const stateComplete = reconcileProgress({
        ...INITIAL_PROGRESS,
        entryCompleted: true,
        territoryStatus: {
          ...INITIAL_PROGRESS.territoryStatus,
          'territorio-1': 'completed',
          'territorio-2': 'completed',
          'territorio-3': 'completed',
          'territorio-4': 'completed',
        },
        territoryInteractions: {
          'territorio-4': {
            revealedPhasesCount: 5,
            exploredSpaces: ['space-already-does', 'space-alignment', 'space-new-capacity'],
          },
        },
      });

      expect(stateComplete.territoryStatus['territorio-4']).toBe('completed');
      expect(stateComplete.territoryStatus['territorio-5']).toBe('unlocked');
    });

    it('T2 y T3 son bifurcaciones paralelas que pueden completarse en cualquier orden', () => {
      const stateT2First = reconcileProgress({
        ...INITIAL_PROGRESS,
        entryCompleted: true,
        territoryStatus: {
          ...INITIAL_PROGRESS.territoryStatus,
          'territorio-1': 'completed',
          'territorio-2': 'completed',
          'territorio-3': 'visited',
        },
      });
      expect(stateT2First.territoryStatus['territorio-4']).toBe('locked');

      const stateT3First = reconcileProgress({
        ...INITIAL_PROGRESS,
        entryCompleted: true,
        territoryStatus: {
          ...INITIAL_PROGRESS.territoryStatus,
          'territorio-1': 'completed',
          'territorio-2': 'visited',
          'territorio-3': 'completed',
        },
      });
      expect(stateT3First.territoryStatus['territorio-4']).toBe('locked');

      const stateBoth = reconcileProgress({
        ...INITIAL_PROGRESS,
        entryCompleted: true,
        territoryStatus: {
          ...INITIAL_PROGRESS.territoryStatus,
          'territorio-1': 'completed',
          'territorio-2': 'completed',
          'territorio-3': 'completed',
        },
      });
      expect(stateBoth.territoryStatus['territorio-4']).toBe('unlocked');
    });
  });
});
