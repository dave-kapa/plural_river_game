import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageProgressionRepository } from '../src/lib/persistence/localStorageRepo';
import { SupabaseProgressionRepository } from '../src/lib/persistence/supabaseRepo';
import { InteractionEvent } from '../src/lib/persistence/types';
import { reconcileProgress } from '../src/lib/progression/unlockRules';

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number { return Object.keys(this.store).length; }
  clear(): void { this.store = {}; }
  getItem(key: string): string | null { return this.store[key] ?? null; }
  key(index: number): string | null { return Object.keys(this.store)[index] ?? null; }
  removeItem(key: string): void { delete this.store[key]; }
  setItem(key: string, value: string): void { this.store[key] = String(value); }
}

describe('Traza de Interacción, Estado Autoritativo y Restauración Honesta', () => {
  let mockStorage: MockStorage;
  let repo: LocalStorageProgressionRepository;

  beforeEach(() => {
    mockStorage = new MockStorage();
    (global as any).window = {
      localStorage: mockStorage,
    };
    repo = new LocalStorageProgressionRepository();
  });

  describe('1. Modelo e Idempotencia de Eventos vs Descubrimiento', () => {
    it('genera eventos con timestamp y campos requeridos', async () => {
      const event: InteractionEvent = {
        eventName: 'lens_explored',
        territoryId: 'territorio-1',
        targetId: 'lens-behavior',
        sessionId: 'sess_test_123',
        occurredAt: new Date().toISOString(),
        metadata: { source: 'test' },
      };

      await repo.recordInteractionEvent(event);
      const events = await repo.getInteractionEvents();
      expect(events.length).toBe(1);
      expect(events[0].eventName).toBe('lens_explored');
      expect(events[0].targetId).toBe('lens-behavior');
      expect(events[0].sessionId).toBe('sess_test_123');
      expect(events[0].occurredAt).toBeDefined();
    });

    it('la repetición de eventos NO duplica elementos en discoveredItems', async () => {
      // Registrar 3 veces el mismo evento de lente
      for (let i = 0; i < 3; i++) {
        await repo.recordInteractionEvent({
          eventName: 'lens_explored',
          territoryId: 'territorio-1',
          targetId: 'lens-behavior',
          occurredAt: new Date().toISOString(),
        });
      }

      // Los eventos son 3
      const events = await repo.getInteractionEvents();
      expect(events.length).toBe(3);

      // Pero discoveredItems se mantiene único
      await repo.registerDiscoveredItems(['t1:lens:lens-behavior']);
      await repo.registerDiscoveredItems(['t1:lens:lens-behavior']);
      await repo.registerDiscoveredItems(['t1:lens:lens-behavior']);

      const progress = await repo.getProgress();
      const occurrences = progress.discoveredItems.filter((id) => id === 't1:lens:lens-behavior').length;
      expect(occurrences).toBe(1);
    });

    it('eventos de telemetría pura (journal_opened, pitch_copied) no alteran el HUD', async () => {
      const initialProgress = await repo.getProgress();
      const initialHUD = initialProgress.globalDiscoveryPercent;

      await repo.recordInteractionEvent({
        eventName: 'journal_opened',
        occurredAt: new Date().toISOString(),
      });
      await repo.recordInteractionEvent({
        eventName: 'pitch_copied',
        metadata: { length: 150 },
        occurredAt: new Date().toISOString(),
      });

      const events = await repo.getInteractionEvents();
      expect(events.length).toBe(2);

      const afterProgress = await repo.getProgress();
      expect(afterProgress.globalDiscoveryPercent).toBe(initialHUD);
      expect(afterProgress.discoveredItems).toEqual([]);
    });
  });

  describe('2. Detección Explícita de Errores de Supabase y Fallback', () => {
    it('activa el fallback a localStorage cuando Supabase reporta un error explícito', async () => {
      // Mock de Supabase Client con error
      const mockSupabaseClient: any = {
        auth: {
          getSession: async () => ({ data: null, error: { message: 'Network offline' } }),
          signInAnonymously: async () => ({ data: null, error: { message: 'Anonymous auth disabled' } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: { message: 'DB Error' } }),
            }),
          }),
          upsert: async () => ({ error: { message: 'Failed to write' } }),
          insert: async () => ({ error: { message: 'Failed to insert' } }),
        }),
      };

      const supabaseRepo = new SupabaseProgressionRepository(mockSupabaseClient);

      // Operación de progreso debe recurrir al fallback sin lanzar excepción
      const progress = await supabaseRepo.markEntryCompleted();
      expect(progress.entryCompleted).toBe(true);

      // Evento debe guardarse en el fallback
      await supabaseRepo.recordInteractionEvent({
        eventName: 'test_event_error_recovery',
        occurredAt: new Date().toISOString(),
      });

      const events = await supabaseRepo.getInteractionEvents();
      expect(events.length).toBe(1);
      expect(events[0].eventName).toBe('test_event_error_recovery');
    });
  });

  describe('3. Estado Autoritativo y Persistencia tras Recarga', () => {
    it('secuencia: completar entrada -> registrar descubrimiento -> no hay regresión', async () => {
      // 1. Completar entrada
      await repo.markEntryCompleted();
      let state = await repo.getProgress();
      expect(state.entryCompleted).toBe(true);
      expect(state.territoryStatus['territorio-1']).toBe('unlocked');

      // 2. Registrar descubrimiento en T1
      await repo.registerDiscoveredItems(['t1:lens:lens-behavior', 't1:disc:diseno-de-juegos']);
      state = await repo.getProgress();

      // 3. Verificar que entryCompleted sigue en true y T1 no vuelve a bloquearse
      expect(state.entryCompleted).toBe(true);
      expect(state.territoryStatus['territorio-1']).toBe('unlocked');
      expect(state.discoveredItems).toContain('t1:lens:lens-behavior');
      expect(state.discoveredItems).toContain('t1:disc:diseno-de-juegos');

      // 4. Simular recarga creando nueva instancia del repositorio leyendo del mismo storage
      const reloadedRepo = new LocalStorageProgressionRepository();
      const reloadedState = await reloadedRepo.getProgress();

      expect(reloadedState.entryCompleted).toBe(true);
      expect(reloadedState.territoryStatus['territorio-1']).toBe('unlocked');
      expect(reloadedState.discoveredItems).toContain('t1:lens:lens-behavior');
      expect(reloadedState.discoveredItems).toContain('t1:disc:diseno-de-juegos');
    });
  });

  describe('4. Restauración Honesta del Estado', () => {
    it('T1 completado con 3 lentes NO debe inflarse al 100% ni revelar el 4to lente', () => {
      // Usuario completó T1 cumpliendo el umbral esencial: 3 lentes explorados de 4
      const exploredLenses = ['lens-behavior', 'lens-experience', 'lens-impact'];
      const discoveredItems = [
        't1:disc:diseno-de-juegos',
        't1:disc:ciencias-del-comportamiento',
        't1:disc:psicologia-cognitiva-social',
        't1:disc:narrativa-transmedia',
        't1:disc:diseno-de-sistemas',
        't1:disc:tecnologia-creatividad',
        't1:definition:built',
        't1:lens:lens-behavior',
        't1:lens:lens-experience',
        't1:lens:lens-impact',
      ];

      // Simulamos la lógica de inicialización honesta de T1
      const fourLenses = [
        { id: 'lens-behavior' },
        { id: 'lens-experience' },
        { id: 'lens-impact' },
        { id: 'lens-system' },
      ];

      const restoredLenses = fourLenses
        .filter((l) => discoveredItems.includes('t1:lens:' + l.id))
        .map((l) => l.id);

      expect(restoredLenses.length).toBe(3);
      expect(restoredLenses).not.toContain('lens-system');

      // Comprobar que T1 tiene porcentaje < 100% a pesar de estar completed
      const progress = reconcileProgress({
        entryCompleted: true,
        territoryStatus: { 'territorio-1': 'completed' },
        territoryInteractions: { 'territorio-1': { exploredLenses } },
        visitedTributaries: [],
        journalEntries: {},
        creditsUnlocked: false,
        discoveredItems,
        lastVisitedRoute: '/territorios/territorio-1',
        updatedAt: new Date().toISOString(),
      });

      expect(progress.territoryStatus['territorio-1']).toBe('completed');
      expect(progress.territoryDiscoveryPercent['territorio-1']).toBeLessThan(100);
      expect(progress.fullDiscoveryReached).toBe(false);
    });

    it('T3 completado con 4 zonas NO debe autocompletar las 7 zonas', () => {
      const exploredZones = ['zone-roots', 'zone-trunk', 'zone-branches', 'zone-canopy'];
      const discoveredItems = [
        't3:zone:zone-roots',
        't3:zone:zone-trunk',
        't3:zone:zone-branches',
        't3:zone:zone-canopy',
      ];

      const all7Zones = [
        { id: 'zone-roots' },
        { id: 'zone-trunk' },
        { id: 'zone-branches' },
        { id: 'zone-canopy' },
        { id: 'zone-ecosystem' },
        { id: 'zone-symbiosis' },
        { id: 'zone-resilience' },
      ];

      const restoredZones = all7Zones
        .filter((z) => discoveredItems.includes('t3:zone:' + z.id))
        .map((z) => z.id);

      expect(restoredZones.length).toBe(4);
      expect(restoredZones).toEqual(exploredZones);

      const progress = reconcileProgress({
        entryCompleted: true,
        territoryStatus: { 'territorio-3': 'completed' },
        territoryInteractions: { 'territorio-3': { exploredZones } },
        visitedTributaries: [],
        journalEntries: {},
        creditsUnlocked: false,
        discoveredItems,
        lastVisitedRoute: '/territorios/territorio-3',
        updatedAt: new Date().toISOString(),
      });

      expect(progress.territoryStatus['territorio-3']).toBe('completed');
      expect(progress.territoryDiscoveryPercent['territorio-3']).toBeLessThan(100);
    });

    it('T4 completado con 3 espacios de análisis NO debe autocompletar el 4to espacio', () => {
      const exploredSpaces = ['space-already-does', 'space-could-incorporate', 'space-could-transform'];
      const discoveredItems = [
        't4:phase:0', 't4:phase:1', 't4:phase:2', 't4:phase:3', 't4:phase:4',
        't4:space:space-already-does',
        't4:space:space-could-incorporate',
        't4:space:space-could-transform',
      ];

      const all4Spaces = [
        { id: 'space-already-does' },
        { id: 'space-could-incorporate' },
        { id: 'space-could-transform' },
        { id: 'space-systemic-impact' },
      ];

      const restoredSpaces = all4Spaces
        .filter((s) => discoveredItems.includes('t4:space:' + s.id))
        .map((s) => s.id);

      expect(restoredSpaces.length).toBe(3);
      expect(restoredSpaces).not.toContain('space-systemic-impact');

      const progress = reconcileProgress({
        entryCompleted: true,
        territoryStatus: { 'territorio-4': 'completed' },
        territoryInteractions: { 'territorio-4': { exploredSpaces } },
        visitedTributaries: [],
        journalEntries: {},
        creditsUnlocked: false,
        discoveredItems,
        lastVisitedRoute: '/territorios/territorio-4',
        updatedAt: new Date().toISOString(),
      });

      expect(progress.territoryStatus['territorio-4']).toBe('completed');
      expect(progress.territoryDiscoveryPercent['territorio-4']).toBeLessThan(100);
    });
  });

  describe('5. Aislamiento entre usuarios', () => {
    it('dos usuarios diferentes mantienen progresos y eventos aislados', async () => {
      const storeUserA: Record<string, any> = {};
      const storeUserB: Record<string, any> = {};

      const createMockClient = (userId: string, targetStore: Record<string, any>) => ({
        auth: {
          getSession: async () => ({ data: { session: { user: { id: userId } } }, error: null }),
          signInAnonymously: async () => ({ data: { user: { id: userId } }, error: null }),
        },
        from: (table: string) => ({
          select: () => ({
            eq: (_col: string, val: string) => ({
              maybeSingle: async () => ({ data: targetStore[table + '_' + val] || null, error: null }),
              order: () => ({
                limit: async () => ({ data: targetStore['events_' + val] || [], error: null }),
              }),
            }),
          }),
          upsert: async (row: any) => {
            targetStore[table + '_' + row.user_id] = row;
            return { error: null };
          },
          insert: async (row: any) => {
            const key = 'events_' + row.user_id;
            if (!targetStore[key]) {
              targetStore[key] = [];
            }
            targetStore[key].push(row);
            return { error: null };
          },
        }),
      });

      const clientA = createMockClient('user-aaa-111', storeUserA);
      const clientB = createMockClient('user-bbb-222', storeUserB);

      const repoA = new SupabaseProgressionRepository(clientA as any);
      const repoB = new SupabaseProgressionRepository(clientB as any);

      // Usuario A completa entrada y registra evento
      await repoA.markEntryCompleted();
      await repoA.recordInteractionEvent({
        eventName: 'lens_explored',
        targetId: 'lens-behavior',
        occurredAt: new Date().toISOString(),
      });

      // Usuario B no ha hecho nada
      const progressB = await repoB.getProgress();
      expect(progressB.entryCompleted).toBe(false);

      const eventsB = await repoB.getInteractionEvents();
      expect(eventsB.length).toBe(0);

      // Usuario A sí tiene entrada completada
      const progressA = await repoA.getProgress();
      expect(progressA.entryCompleted).toBe(true);

      const eventsA = await repoA.getInteractionEvents();
      expect(eventsA.length).toBe(1);
    });
  });
});
