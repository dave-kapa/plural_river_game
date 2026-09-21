import {
  ProgressionRepository,
  TraversalProgress,
  TerritoryStatus,
  INITIAL_PROGRESS,
} from './types';
import { reconcileProgress } from '../progression/unlockRules';

const STORAGE_KEY = 'plural_gameful_river_progress_v1';
const EVENTS_STORAGE_KEY = 'plural_gameful_river_events_v1';
const MAX_LOCAL_EVENTS = 100;

export class LocalStorageProgressionRepository implements ProgressionRepository {
  private queue: Promise<any> = Promise.resolve();

  private getStorage(): Storage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    return null;
  }

  private readRaw(): TraversalProgress {
    const storage = this.getStorage();
    if (!storage) {
      return { ...INITIAL_PROGRESS };
    }

    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...INITIAL_PROGRESS };
      }
      const parsed: TraversalProgress = JSON.parse(raw);
      return reconcileProgress(parsed);
    } catch (e) {
      console.error('Error reading progression from localStorage:', e);
      return { ...INITIAL_PROGRESS };
    }
  }

  private persist(progress: TraversalProgress): void {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progression to localStorage:', e);
    }
  }

  private enqueue<T>(op: () => T | Promise<T>): Promise<T> {
    const next = this.queue.then(() => op());
    this.queue = next.catch(() => {});
    return next;
  }

  async getProgress(): Promise<TraversalProgress> {
    return this.enqueue(() => this.readRaw());
  }

  async markEntryCompleted(): Promise<TraversalProgress> {
    return this.enqueue(() => {
      const current = this.readRaw();
      const updated: TraversalProgress = reconcileProgress({
        ...current,
        entryCompleted: true,
        lastVisitedRoute: '/mapa',
      });
      this.persist(updated);
      return updated;
    });
  }

  async saveTerritoryProgress(
    territoryId: string,
    status: TerritoryStatus,
    interactionState?: Record<string, any>,
    journalPhrase?: string
  ): Promise<TraversalProgress> {
    return this.enqueue(() => {
      const current = this.readRaw();

      const nextStatuses = { ...current.territoryStatus };
      if (nextStatuses[territoryId] !== 'completed' || status === 'completed') {
        nextStatuses[territoryId] = status;
      }

      const nextInteractions = { ...current.territoryInteractions };
      if (interactionState) {
        nextInteractions[territoryId] = {
          ...(nextInteractions[territoryId] || {}),
          ...interactionState,
        };
      }

      const nextJournal = { ...current.journalEntries };
      if (journalPhrase) {
        nextJournal[territoryId] = journalPhrase;
      }

      const updated: TraversalProgress = reconcileProgress({
        ...current,
        territoryStatus: nextStatuses,
        territoryInteractions: nextInteractions,
        journalEntries: nextJournal,
        lastVisitedRoute: `/territorios/${territoryId}`,
      });

      this.persist(updated);
      return updated;
    });
  }

  async saveJournalPhrase(territoryId: string, phrase: string): Promise<TraversalProgress> {
    return this.enqueue(() => {
      const current = this.readRaw();
      const updated: TraversalProgress = reconcileProgress({
        ...current,
        journalEntries: {
          ...current.journalEntries,
          [territoryId]: phrase,
        },
      });
      this.persist(updated);
      return updated;
    });
  }

  async markTributaryVisited(tributaryId: string): Promise<TraversalProgress> {
    return this.enqueue(() => {
      const current = this.readRaw();
      const set = new Set(current.visitedTributaries);
      set.add(tributaryId);

      const updated: TraversalProgress = reconcileProgress({
        ...current,
        visitedTributaries: Array.from(set),
        lastVisitedRoute: `/afluentes/${tributaryId}`,
      });

      this.persist(updated);
      return updated;
    });
  }

  async registerDiscoveredItems(itemIds: string[]): Promise<TraversalProgress> {
    return this.enqueue(() => {
      const current = this.readRaw();
      const set = new Set(current.discoveredItems || []);
      let added = false;
      for (const id of itemIds) {
        if (!set.has(id)) {
          set.add(id);
          added = true;
        }
      }
      if (!added) {
        return current;
      }
      const updated = reconcileProgress({
        ...current,
        discoveredItems: Array.from(set),
      });
      this.persist(updated);
      return updated;
    });
  }

  async recordInteractionEvent(event: import('./types').InteractionEvent): Promise<void> {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      const raw = storage.getItem(EVENTS_STORAGE_KEY);
      const list: import('./types').InteractionEvent[] = raw ? JSON.parse(raw) : [];
      list.unshift(event);
      if (list.length > MAX_LOCAL_EVENTS) {
        list.length = MAX_LOCAL_EVENTS;
      }
      storage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving event to localStorage:', e);
    }
  }

  async getInteractionEvents(limit = 50): Promise<import('./types').InteractionEvent[]> {
    const storage = this.getStorage();
    if (!storage) return [];
    try {
      const raw = storage.getItem(EVENTS_STORAGE_KEY);
      if (!raw) return [];
      const list: import('./types').InteractionEvent[] = JSON.parse(raw);
      return list.slice(0, limit);
    } catch (e) {
      console.error('Error reading events from localStorage:', e);
      return [];
    }
  }

  async setLastVisited(route: string): Promise<void> {
    return this.enqueue(() => {
      const current = this.readRaw();
      current.lastVisitedRoute = route;
      this.persist(current);
    });
  }

  async resetProgress(): Promise<TraversalProgress> {
    return this.enqueue(() => {
      const storage = this.getStorage();
      if (storage) {
        storage.removeItem(STORAGE_KEY);
        storage.removeItem(EVENTS_STORAGE_KEY);
      }
      return { ...INITIAL_PROGRESS };
    });
  }
}
