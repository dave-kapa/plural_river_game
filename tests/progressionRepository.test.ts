import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageProgressionRepository } from '../src/lib/persistence/localStorageRepo';
import { INITIAL_PROGRESS } from '../src/lib/persistence/types';
import { OFFICIAL_JOURNAL_ENTRIES, MASTER_PRESENTATION_PARAGRAPH } from '../src/data/journal';

// Mock de localStorage para entorno Node de pruebas
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('Repositorio de Persistencia (LocalStorageProgressionRepository)', () => {
  let repo: LocalStorageProgressionRepository;

  beforeEach(() => {
    const mockStorage = new MockStorage();
    (global as any).window = {
      localStorage: mockStorage,
    };
    repo = new LocalStorageProgressionRepository();
  });

  it('devuelve el progreso inicial cuando no hay datos guardados', async () => {
    const progress = await repo.getProgress();
    expect(progress.entryCompleted).toBe(false);
    expect(progress.territoryStatus['territorio-1']).toBe('locked');
    expect(progress.visitedTributaries).toEqual([]);
    expect(progress.journalEntries).toEqual({});
    expect(progress.creditsUnlocked).toBe(false);
  });

  it('registra la finalización de la entrada y desbloquea el Territorio 1', async () => {
    const updated = await repo.markEntryCompleted();
    expect(updated.entryCompleted).toBe(true);
    expect(updated.territoryStatus['territorio-1']).toBe('unlocked');
    expect(updated.lastVisitedRoute).toBe('/mapa');

    const reloaded = await repo.getProgress();
    expect(reloaded.entryCompleted).toBe(true);
    expect(reloaded.territoryStatus['territorio-1']).toBe('unlocked');
  });

  it('guarda el progreso de un territorio con su estado de interacción y frase en la Bitácora', async () => {
    await repo.markEntryCompleted();

    const interactionData = {
      definitionBuilt: true,
    };
    const phraseT1 = OFFICIAL_JOURNAL_ENTRIES['territorio-1'].phrase;

    const updated = await repo.saveTerritoryProgress(
      'territorio-1',
      'completed',
      interactionData,
      phraseT1
    );

    expect(updated.territoryStatus['territorio-1']).toBe('completed');
    expect(updated.territoryStatus['territorio-2']).toBe('unlocked');
    expect(updated.territoryStatus['territorio-3']).toBe('unlocked');
    expect(updated.territoryInteractions['territorio-1']).toEqual(interactionData);
    expect(updated.journalEntries['territorio-1']).toBe(phraseT1);

    // Verificar restauración tras lectura fresca
    const fresh = await repo.getProgress();
    expect(fresh.territoryStatus['territorio-1']).toBe('completed');
    expect(fresh.territoryInteractions['territorio-1']).toEqual(interactionData);
    expect(fresh.journalEntries['territorio-1']).toBe(phraseT1);
  });

  it('permite guardar frases de Bitácora de manera independiente', async () => {
    const phraseT2 = OFFICIAL_JOURNAL_ENTRIES['territorio-2'].phrase;
    const updated = await repo.saveJournalPhrase('territorio-2', phraseT2);

    expect(updated.journalEntries['territorio-2']).toBe(phraseT2);

    const reloaded = await repo.getProgress();
    expect(reloaded.journalEntries['territorio-2']).toBe(phraseT2);
  });

  it('registra la visita a los afluentes y solo abre créditos dentro de una travesía legítimamente habilitada', async () => {
    // 1. En una travesía nueva (sin T4 completado), registrar afluentes no abre créditos
    await repo.markTributaryVisited('evaluation-as-experience');
    await repo.markTributaryVisited('from-intervention-to-product');
    await repo.markTributaryVisited('evaluation-as-experience');

    let progress = await repo.getProgress();
    expect(progress.visitedTributaries).toHaveLength(2);
    expect(progress.visitedTributaries).toContain('evaluation-as-experience');
    expect(progress.visitedTributaries).toContain('from-intervention-to-product');
    expect(progress.creditsUnlocked).toBe(false);

    await repo.markTributaryVisited('new-horizons');
    progress = await repo.getProgress();
    expect(progress.visitedTributaries).toHaveLength(3);
    // Sin T4 completado, no se abre el epílogo
    expect(progress.creditsUnlocked).toBe(false);

    // 2. Al habilitar legítimamente la travesía (T4 completado y T5 habilitado), se abren los créditos
    await repo.saveTerritoryProgress('territorio-4', 'completed');
    const legitProgress = await repo.getProgress();
    expect(legitProgress.territoryStatus['territorio-4']).toBe('completed');
    expect(legitProgress.territoryStatus['territorio-5']).toBe('completed');
    expect(legitProgress.creditsUnlocked).toBe(true);
  });

  it('reinicia completamente la travesía devolviendo el estado y la Bitácora a los valores iniciales', async () => {
    await repo.markEntryCompleted();
    await repo.saveTerritoryProgress(
      'territorio-1',
      'completed',
      {},
      OFFICIAL_JOURNAL_ENTRIES['territorio-1'].phrase
    );
    await repo.markTributaryVisited('evaluation-as-experience');

    let current = await repo.getProgress();
    expect(current.entryCompleted).toBe(true);
    expect(current.territoryStatus['territorio-1']).toBe('completed');
    expect(Object.keys(current.journalEntries)).toHaveLength(1);

    const resetResult = await repo.resetProgress();
    expect(resetResult.entryCompleted).toBe(false);
    expect(resetResult.territoryStatus['territorio-1']).toBe('locked');
    expect(resetResult.visitedTributaries).toEqual([]);
    expect(resetResult.journalEntries).toEqual({});

    const reloaded = await repo.getProgress();
    expect(reloaded.entryCompleted).toBe(false);
    expect(reloaded.territoryStatus['territorio-1']).toBe('locked');
    expect(reloaded.journalEntries).toEqual({});
  });
});
