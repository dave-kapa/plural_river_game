import { SupabaseClient } from '@supabase/supabase-js';
import {
  ProgressionRepository,
  TraversalProgress,
  TerritoryStatus,
  INITIAL_PROGRESS,
} from './types';
import { reconcileProgress } from '../progression/unlockRules';
import { LocalStorageProgressionRepository } from './localStorageRepo';

export class SupabaseProgressionRepository implements ProgressionRepository {
  private fallbackRepo = new LocalStorageProgressionRepository();

  constructor(private client: SupabaseClient) {}

  private async getUserId(): Promise<string | null> {
    try {
      const { data: sessionData } = await this.client.auth.getSession();
      if (sessionData?.session?.user?.id) {
        return sessionData.session.user.id;
      }

      const { data: authData, error } = await this.client.auth.signInAnonymously();
      if (error) {
        console.warn('Anonymous sign-in error on Supabase, falling back to local storage:', error.message);
        return null;
      }
      return authData?.user?.id ?? null;
    } catch (err) {
      console.warn('Supabase auth failed, falling back:', err);
      return null;
    }
  }

  async getProgress(): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.getProgress();
    }

    try {
      const { data: traversalState } = await this.client
        .from('user_traversal_state')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: progressRows } = await this.client
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      const territoryStatus = { ...INITIAL_PROGRESS.territoryStatus };
      const territoryInteractions: Record<string, Record<string, any>> = {};

      if (progressRows && progressRows.length > 0) {
        for (const row of progressRows) {
          territoryStatus[row.territory_id] = row.status as TerritoryStatus;
          if (row.interaction_state) {
            territoryInteractions[row.territory_id] = row.interaction_state;
          }
        }
      }

      const merged: TraversalProgress = {
        ...INITIAL_PROGRESS,
        entryCompleted: traversalState?.entry_completed ?? false,
        territoryStatus,
        territoryInteractions,
        visitedTributaries: traversalState?.visited_tributaries ?? [],
        journalEntries: traversalState?.journal_entries ?? {},
        creditsUnlocked: traversalState?.credits_unlocked ?? false,
        discoveredItems: traversalState?.discovered_items ?? [],
        lastVisitedRoute: traversalState?.last_visited_route ?? '/',
        updatedAt: traversalState?.updated_at ?? new Date().toISOString(),
      };

      return reconcileProgress(merged);
    } catch (e) {
      console.error('Error fetching Supabase progress:', e);
      return this.fallbackRepo.getProgress();
    }
  }

  async markEntryCompleted(): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.markEntryCompleted();
    }

    try {
      await this.client.from('user_traversal_state').upsert({
        user_id: userId,
        entry_completed: true,
        last_visited_route: '/mapa',
        updated_at: new Date().toISOString(),
      });
      return this.getProgress();
    } catch (e) {
      console.error('Error in markEntryCompleted on Supabase:', e);
      return this.fallbackRepo.markEntryCompleted();
    }
  }

  async saveTerritoryProgress(
    territoryId: string,
    status: TerritoryStatus,
    interactionState?: Record<string, any>,
    journalPhrase?: string
  ): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.saveTerritoryProgress(territoryId, status, interactionState, journalPhrase);
    }

    try {
      await this.client.from('user_progress').upsert({
        user_id: userId,
        territory_id: territoryId,
        status,
        interaction_state: interactionState ?? {},
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      });

      const current = await this.getProgress();
      const nextJournal = { ...current.journalEntries };
      if (journalPhrase) {
        nextJournal[territoryId] = journalPhrase;
      }

      await this.client.from('user_traversal_state').upsert({
        user_id: userId,
        journal_entries: nextJournal,
        last_visited_route: `/territorios/${territoryId}`,
        updated_at: new Date().toISOString(),
      });

      return this.getProgress();
    } catch (e) {
      console.error('Error saving territory progress in Supabase:', e);
      return this.fallbackRepo.saveTerritoryProgress(territoryId, status, interactionState, journalPhrase);
    }
  }

  async saveJournalPhrase(territoryId: string, phrase: string): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.saveJournalPhrase(territoryId, phrase);
    }

    try {
      const current = await this.getProgress();
      const nextJournal = { ...current.journalEntries, [territoryId]: phrase };

      await this.client.from('user_traversal_state').upsert({
        user_id: userId,
        journal_entries: nextJournal,
        updated_at: new Date().toISOString(),
      });

      return this.getProgress();
    } catch (e) {
      console.error('Error saving journal phrase in Supabase:', e);
      return this.fallbackRepo.saveJournalPhrase(territoryId, phrase);
    }
  }

  async markTributaryVisited(tributaryId: string): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.markTributaryVisited(tributaryId);
    }

    try {
      const current = await this.getProgress();
      const updatedList = Array.from(new Set([...current.visitedTributaries, tributaryId]));

      await this.client.from('user_traversal_state').upsert({
        user_id: userId,
        visited_tributaries: updatedList,
        last_visited_route: `/afluentes/${tributaryId}`,
        updated_at: new Date().toISOString(),
      });

      return this.getProgress();
    } catch (e) {
      console.error('Error marking tributary visited in Supabase:', e);
      return this.fallbackRepo.markTributaryVisited(tributaryId);
    }
  }

  async registerDiscoveredItems(itemIds: string[]): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.registerDiscoveredItems(itemIds);
    }

    try {
      const current = await this.getProgress();
      const set = new Set(current.discoveredItems || []);
      for (const id of itemIds) {
        set.add(id);
      }
      const updatedList = Array.from(set);

      await this.client.from('user_traversal_state').upsert({
        user_id: userId,
        discovered_items: updatedList,
        updated_at: new Date().toISOString(),
      });

      await this.fallbackRepo.registerDiscoveredItems(itemIds);
      return this.getProgress();
    } catch (e) {
      console.error('Error registering discovered items in Supabase:', e);
      return this.fallbackRepo.registerDiscoveredItems(itemIds);
    }
  }

  async setLastVisited(route: string): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.setLastVisited(route);
    }

    try {
      await this.client.from('user_traversal_state').upsert({
        user_id: userId,
        last_visited_route: route,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Error setting last visited route in Supabase:', e);
      await this.fallbackRepo.setLastVisited(route);
    }
  }

  async resetProgress(): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.resetProgress();
    }

    try {
      await this.client.from('user_progress').delete().eq('user_id', userId);
      await this.client.from('user_traversal_state').delete().eq('user_id', userId);
      await this.fallbackRepo.resetProgress();
      return { ...INITIAL_PROGRESS };
    } catch (e) {
      console.error('Error resetting progress in Supabase:', e);
      return this.fallbackRepo.resetProgress();
    }
  }
}
