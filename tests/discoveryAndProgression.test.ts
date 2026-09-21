import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeTerritoryDiscoveryPercent,
  computeAllTerritoryDiscoveries,
  computeGlobalDiscoveryPercent,
  isFullDiscoveryReached,
  DISCOVERY_REGISTRY,
  TOTAL_ITEMS_PER_TERRITORY,
} from '../src/lib/progression/discoveryRegistry';
import { reconcileProgress, computeTerritoryStatuses, areCreditsUnlocked } from '../src/lib/progression/unlockRules';
import { INITIAL_PROGRESS } from '../src/lib/persistence/types';
import { LocalStorageProgressionRepository } from '../src/lib/persistence/localStorageRepo';

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number { return Object.keys(this.store).length; }
  clear(): void { this.store = {}; }
  getItem(key: string): string | null { return this.store[key] ?? null; }
  key(index: number): string | null { return Object.keys(this.store)[index] ?? null; }
  removeItem(key: string): void { delete this.store[key]; }
  setItem(key: string, value: string): void { this.store[key] = String(value); }
}

describe('Reglas de Progreso Esencial vs. Descubrimiento Total (HUD)', () => {
  let repo: LocalStorageProgressionRepository;

  beforeEach(() => {
    (global as any).window = { localStorage: new MockStorage() };
    repo = new LocalStorageProgressionRepository();
  });

  describe('1. Separación de conceptos: Progreso Esencial vs. Descubrimiento Total', () => {
    it('completar el progreso esencial de un territorio NO equivale a descubrirlo al 100%', () => {
      // T1 completado con los requisitos mínimos esenciales:
      // 6 disciplinas + definición + 3 de 4 lentes = 10 elementos descubiertos de 15 totales
      const minimalT1Items = [
        't1:disc:ciencias-del-comportamiento',
        't1:disc:psicologia',
        't1:disc:neurociencia-cognitiva',
        't1:disc:experiencia-de-usuario',
        't1:disc:narrativa',
        't1:disc:diseno-de-juegos',
        't1:definition:built',
        't1:lens:lens-behavior',
        't1:lens:lens-experience',
        't1:lens:lens-impact',
      ];

      const t1DiscoveryPercent = computeTerritoryDiscoveryPercent('territorio-1', minimalT1Items);
      const globalDiscoveryPercent = computeGlobalDiscoveryPercent(minimalT1Items);

      // Progreso esencial está satisfecho (10 de 15 items = 67%)
      expect(t1DiscoveryPercent).toBe(67);
      expect(t1DiscoveryPercent).toBeLessThan(100);
      expect(globalDiscoveryPercent).toBe(13); // 67 / 5 = 13.4 -> 13%

      // La reconciliación confirma que el territorio puede marcarse 'completed' sin tener el 100% de descubrimiento
      const state = reconcileProgress({
        ...INITIAL_PROGRESS,
        entryCompleted: true,
        territoryStatus: {
          ...INITIAL_PROGRESS.territoryStatus,
          'territorio-1': 'completed',
        },
        discoveredItems: minimalT1Items,
      });

      expect(state.territoryStatus['territorio-1']).toBe('completed');
      expect(state.territoryStatus['territorio-2']).toBe('unlocked');
      expect(state.territoryStatus['territorio-3']).toBe('unlocked');
      expect(state.territoryDiscoveryPercent['territorio-1']).toBe(67);
      expect(state.globalDiscoveryPercent).toBe(13);
      expect(state.fullDiscoveryReached).toBe(false);
    });
  });

  describe('2. Umbrales por Territorio', () => {
    it('Territorio 1: requiere definición construida y al menos 3 lentes para progreso esencial', () => {
      // 2 lentes no deben bastar para considerar T1 completado
      const hasDefinition = true;
      const twoLenses = ['lens-behavior', 'lens-experience'];
      const meetsT1Essential2Lenses = hasDefinition && twoLenses.length >= 3;
      expect(meetsT1Essential2Lenses).toBe(false);

      // 3 lentes sí cumplen el umbral esencial
      const threeLenses = ['lens-behavior', 'lens-experience', 'lens-impact'];
      const meetsT1Essential3Lenses = hasDefinition && threeLenses.length >= 3;
      expect(meetsT1Essential3Lenses).toBe(true);

      // El 4to lente y las tarjetas de descarte aumentan el descubrimiento sin bloquear
      const itemsWith4thLens = [
        ...DISCOVERY_REGISTRY['territorio-1'].map((i) => i.id),
      ];
      expect(computeTerritoryDiscoveryPercent('territorio-1', itemsWith4thLens)).toBe(100);
    });

    it('Territorio 2: requiere las 3 fuerzas principales para avanzar; capacidades adicionales son voluntarias', () => {
      // 2 fuerzas no completan el núcleo
      const twoForces = ['force-scale', 'force-measure'];
      expect(twoForces.length >= 3).toBe(false);

      // 3 fuerzas completan el núcleo
      const threeForces = ['force-scale', 'force-measure', 'force-innovation'];
      expect(threeForces.length >= 3).toBe(true);

      // Con solo las 3 fuerzas, el descubrimiento de T2 es 23% (3/13) pero es suficiente para avanzar
      const forceItemIds = threeForces.map((f) => `t2:force:${f}`);
      expect(computeTerritoryDiscoveryPercent('territorio-2', forceItemIds)).toBe(23);

      // Descubrir capacidades adicionales eleva el porcentaje sin ser una barrera
      const moreItems = [
        ...forceItemIds,
        't2:capacity:cap-emotional',
        't2:capacity:cap-motivation-arch',
      ];
      expect(computeTerritoryDiscoveryPercent('territorio-2', moreItems)).toBe(38);
    });

    it('Territorio 3: 4 de las 7 zonas completan el progreso esencial sin requerir 31 componentes', () => {
      const fourZones = ['zone-roots', 'zone-bed', 'zone-branches', 'zone-leaves'];
      expect(fourZones.length >= 4).toBe(true);

      const zoneItemIds = fourZones.map((z) => `t3:zone:${z}`);
      const t3PercentWith4Zones = computeTerritoryDiscoveryPercent('territorio-3', zoneItemIds);

      // 4 de 39 elementos = 10%
      expect(t3PercentWith4Zones).toBe(10);
      expect(t3PercentWith4Zones).toBeLessThan(100);

      // Abrir componentes individuales incrementa voluntariamente el % de T3
      const withComponents = [
        ...zoneItemIds,
        't3:comp:proposito',
        't3:comp:comportamientos',
        't3:comp:impacto-significativo',
      ];
      expect(computeTerritoryDiscoveryPercent('territorio-3', withComponents)).toBe(18);

      // Completar todos los componentes permite llegar al 100%
      const allT3Items = DISCOVERY_REGISTRY['territorio-3'].map((i) => i.id);
      expect(computeTerritoryDiscoveryPercent('territorio-3', allT3Items)).toBe(100);
    });

    it('Territorio 4: requiere tabla completa y al menos 3 espacios para progreso esencial', () => {
      // 5 fases + 2 espacios NO debe completar T4
      const tableComplete = 5;
      const twoSpaces = ['space-already-does', 'space-alignment'];
      const meetsT4Essential2Spaces = tableComplete >= 5 && twoSpaces.length >= 3;
      expect(meetsT4Essential2Spaces).toBe(false);

      // 5 fases + 3 espacios SÍ completa T4
      const threeSpaces = ['space-already-does', 'space-alignment', 'space-new-capacity'];
      const meetsT4Essential3Spaces = tableComplete >= 5 && threeSpaces.length >= 3;
      expect(meetsT4Essential3Spaces).toBe(true);

      // El 4to espacio, ics-frame y VBG aportan al descubrimiento sin bloquear
      const t4EssentialItems = [
        't4:phase:0',
        't4:phase:1',
        't4:phase:2',
        't4:phase:3',
        't4:phase:4',
        't4:space:space-already-does',
        't4:space:space-alignment',
        't4:space:space-new-capacity',
      ];
      expect(computeTerritoryDiscoveryPercent('territorio-4', t4EssentialItems)).toBe(73); // 8 de 11 = 73%

      const allT4Items = DISCOVERY_REGISTRY['territorio-4'].map((i) => i.id);
      expect(computeTerritoryDiscoveryPercent('territorio-4', allT4Items)).toBe(100);
    });

    it('Territorio 5 y Afluentes: requiere registro explícito y al menos 1 afluente dentro de travesía legítima para desbloquear créditos', async () => {
      // 1. Visitar un afluente sin registrarlo no debe guardarse en visitedTributaries
      const initial = await repo.getProgress();
      expect(initial.visitedTributaries).toHaveLength(0);
      expect(areCreditsUnlocked(initial.visitedTributaries)).toBe(false);

      // 2. Registro explícito de cada afluente
      await repo.markTributaryVisited('evaluation-as-experience');
      await repo.registerDiscoveredItems(['t5:tributary:evaluation-as-experience']);

      let state = await repo.getProgress();
      expect(state.visitedTributaries).toEqual(['evaluation-as-experience']);
      expect(state.discoveredItems).toContain('t5:tributary:evaluation-as-experience');
      expect(areCreditsUnlocked(state.visitedTributaries, state.territoryStatus)).toBe(false);

      // 3. Registrar el 2do afluente
      await repo.markTributaryVisited('from-intervention-to-product');
      state = await repo.getProgress();
      expect(state.visitedTributaries).toHaveLength(2);
      expect(areCreditsUnlocked(state.visitedTributaries, state.territoryStatus)).toBe(false);

      // 4. Registrar el 3er afluente en travesía nueva (sin T4) no abre créditos
      await repo.markTributaryVisited('new-horizons');
      state = await repo.getProgress();
      expect(state.visitedTributaries).toHaveLength(3);
      expect(state.creditsUnlocked).toBe(false);

      // 5. En travesía legítimamente habilitada (T4 completado y T5 habilitado), se abren los créditos
      await repo.saveTerritoryProgress('territorio-4', 'completed');
      state = await repo.getProgress();
      expect(state.territoryStatus['territorio-4']).toBe('completed');
      expect(state.territoryStatus['territorio-5']).toBe('completed');
      expect(areCreditsUnlocked(state.visitedTributaries, state.territoryStatus)).toBe(true);
      expect(state.creditsUnlocked).toBe(true);
    });
  });

  describe('3. Propiedades Matemáticas del HUD de Descubrimiento', () => {
    it('cada uno de los 5 territorios tiene el mismo peso global (20% cada uno)', () => {
      // Si el Territorio 3 (con 39 items) está al 100% y los otros 4 al 0%:
      const allT3Items = DISCOVERY_REGISTRY['territorio-3'].map((i) => i.id);
      const discoveries = computeAllTerritoryDiscoveries(allT3Items);

      expect(discoveries['territorio-1']).toBe(0);
      expect(discoveries['territorio-2']).toBe(0);
      expect(discoveries['territorio-3']).toBe(100);
      expect(discoveries['territorio-4']).toBe(0);
      expect(discoveries['territorio-5']).toBe(0);

      // El global es exactamente 20% (100 / 5)
      const globalPercentT3Only = computeGlobalDiscoveryPercent(allT3Items);
      expect(globalPercentT3Only).toBe(20);

      // Si en cambio el Territorio 5 (con solo 8 items) está al 100%:
      const allT5Items = DISCOVERY_REGISTRY['territorio-5'].map((i) => i.id);
      const globalPercentT5Only = computeGlobalDiscoveryPercent(allT5Items);

      // También debe ser exactamente 20% (100 / 5)
      expect(globalPercentT5Only).toBe(20);
    });

    it('el porcentaje nunca supera el 100%', () => {
      const allItemsAcrossAllTerritories = Object.values(DISCOVERY_REGISTRY)
        .flatMap((list) => list.map((item) => item.id));

      // Agregar duplicados e identificadores extra
      const inflatedItems = [
        ...allItemsAcrossAllTerritories,
        ...allItemsAcrossAllTerritories,
        'non_existent_item_1',
        'non_existent_item_2',
      ];

      const globalPercent = computeGlobalDiscoveryPercent(inflatedItems);
      expect(globalPercent).toBe(100);
      expect(isFullDiscoveryReached(inflatedItems)).toBe(true);
    });

    it('el porcentaje nunca disminuye al revisitar o registrar ítems ya descubiertos (idempotencia)', async () => {
      await repo.registerDiscoveredItems(['t1:lens:lens-behavior', 't1:lens:lens-experience']);
      let state = await repo.getProgress();
      const percent1 = state.globalDiscoveryPercent;

      // Re-registrar los mismos ítems
      await repo.registerDiscoveredItems(['t1:lens:lens-behavior']);
      state = await repo.getProgress();
      const percent2 = state.globalDiscoveryPercent;

      expect(percent2).toBe(percent1);
      expect(state.discoveredItems.filter((i) => i === 't1:lens:lens-behavior')).toHaveLength(1);
    });

    it('fullDiscoveryReached se activa cuando el descubrimiento global alcanza el 100%', () => {
      const allItems = Object.values(DISCOVERY_REGISTRY)
        .flatMap((list) => list.map((item) => item.id));

      const reconciled = reconcileProgress({
        ...INITIAL_PROGRESS,
        discoveredItems: allItems,
      });

      expect(reconciled.globalDiscoveryPercent).toBe(100);
      expect(reconciled.fullDiscoveryReached).toBe(true);
    });

    it('territorio-1 progresa limpiamente de 6/15 a 15/15 (100%) con todas las interacciones', async () => {
      // 1. Paso inicial: solo 6 disciplinas seleccionadas
      const sixDisciplines = [
        't1:disc:ciencias-del-comportamiento',
        't1:disc:psicologia',
        't1:disc:neurociencia-cognitiva',
        't1:disc:experiencia-de-usuario',
        't1:disc:narrativa',
        't1:disc:diseno-de-juegos',
      ];
      await repo.registerDiscoveredItems(sixDisciplines);
      let state = await repo.getProgress();
      let t1Count = state.discoveredItems.filter((id) => id.startsWith('t1:')).length;
      expect(t1Count).toBe(6);
      expect(state.territoryDiscoveryPercent['territorio-1']).toBe(40); // 6/15 = 40%

      // 2. Articular definición canónica + distinción conceptual
      await repo.registerDiscoveredItems(['t1:definition:built', 't1:concept:playful-vs-gameful']);
      state = await repo.getProgress();
      t1Count = state.discoveredItems.filter((id) => id.startsWith('t1:')).length;
      expect(t1Count).toBe(8); // 8 de 15
      expect(state.territoryDiscoveryPercent['territorio-1']).toBe(53); // 8/15 = 53%

      // 3. Explorar los 4 lentes
      const fourLenses = [
        't1:lens:lens-behavior',
        't1:lens:lens-experience',
        't1:lens:lens-impact',
        't1:lens:lens-systemic',
      ];
      await repo.registerDiscoveredItems(fourLenses);
      state = await repo.getProgress();
      t1Count = state.discoveredItems.filter((id) => id.startsWith('t1:')).length;
      expect(t1Count).toBe(12); // 12 de 15
      expect(state.territoryDiscoveryPercent['territorio-1']).toBe(80); // 12/15 = 80%

      // 4. Descartar los 3 arquetipos de falsas rutas
      const threeDiscards = [
        't1:discard:points',
        't1:discard:cosmetics',
        't1:discard:coercion',
      ];
      await repo.registerDiscoveredItems(threeDiscards);
      state = await repo.getProgress();
      t1Count = state.discoveredItems.filter((id) => id.startsWith('t1:')).length;
      expect(t1Count).toBe(15); // 15 de 15
      expect(state.territoryDiscoveryPercent['territorio-1']).toBe(100); // 15/15 = 100%!
    });
  });
});
