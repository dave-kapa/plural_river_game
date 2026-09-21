import { SupabaseClient } from '@supabase/supabase-js';
import {
  ProgressionRepository,
  TraversalProgress,
  TerritoryStatus,
  InteractionEvent,
  INITIAL_PROGRESS,
} from './types';
import { reconcileProgress } from '../progression/unlockRules';
import { LocalStorageProgressionRepository } from './localStorageRepo';

export class SupabaseProgressionRepository implements ProgressionRepository {
  private fallbackRepo = new LocalStorageProgressionRepository();

  constructor(private client: SupabaseClient) {}

  private async getUserId(): Promise<string | null> {
    try {
      const { data: sessionData, error: sessionError } = await this.client.auth.getSession();
      if (sessionError) {
        console.warn('Supabase getSession error, falling back:', sessionError.message);
      } else if (sessionData?.session?.user?.id) {
        return sessionData.session.user.id;
      }

      const { data: authData, error: authError } = await this.client.auth.signInAnonymously();
      if (authError) {
        console.warn('Anonymous sign-in error on Supabase, falling back to local storage:', authError.message);
        return null;
      }
      return authData?.user?.id ?? null;
    } catch (err) {
      console.warn('Supabase auth exception, falling back:', err);
      return null;
    }
  }

  async getProgress(): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.getProgress();
    }

    try {
      const { data: traversalState, error: stateError } = await this.client
        .from('user_traversal_state')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (stateError) {
        console.warn('Error fetching user_traversal_state from Supabase:', stateError.message);
        return this.fallbackRepo.getProgress();
      }

      const { data: progressRows, error: progressError } = await this.client
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) {
        console.warn('Error fetching user_progress from Supabase:', progressError.message);
        return this.fallbackRepo.getProgress();
      }

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

      const reconciled = reconcileProgress(merged);
      return reconciled;
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
      const { error } = await this.client.from('user_traversal_state').upsert(
        {
          user_id: userId,
          entry_completed: true,
          last_visited_route: '/mapa',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.warn('Error in markEntryCompleted on Supabase:', error.message);
        return this.fallbackRepo.markEntryCompleted();
      }

      // Synchronize fallback repository
      await this.fallbackRepo.markEntryCompleted();
      return this.getProgress();
    } catch (e) {
      console.error('Exception in markEntryCompleted on Supabase:', e);
      return this.fallbackRepo.markEntryCompleted();
    }
  }

  async saveTerritoryProgress(
    territoryId: string,
    status: TerritoryStatus,
    interactionState?: Record<string, any>,
    journalPhrase?: string
  ): Promise<TraversalProgress> {
    // Primero aseguramos la persistencia en el repositorio local de respaldo
    await this.fallbackRepo.saveTerritoryProgress(territoryId, status, interactionState, journalPhrase);

    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.getProgress();
    }

    try {
      const { error: progressError } = await this.client.from('user_progress').upsert(
        {
          user_id: userId,
          territory_id: territoryId,
          status,
          interaction_state: interactionState ?? {},
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id, territory_id' }
      );

      if (progressError) {
        console.warn('Error saving user_progress in Supabase:', progressError.message);
        return this.fallbackRepo.getProgress();
      }

      const current = await this.getProgress();
      const nextJournal = { ...current.journalEntries };
      if (journalPhrase) {
        nextJournal[territoryId] = journalPhrase;
      }

      const { error: stateError } = await this.client.from('user_traversal_state').upsert(
        {
          user_id: userId,
          journal_entries: nextJournal,
          last_visited_route: `/territorios/${territoryId}`,
          discovered_items: current.discoveredItems || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (stateError) {
        console.warn('Error saving user_traversal_state in Supabase:', stateError.message);
        return this.fallbackRepo.getProgress();
      }

      return this.getProgress();
    } catch (e) {
      console.error('Exception saving territory progress in Supabase:', e);
      return this.fallbackRepo.getProgress();
    }
  }

  async saveJournalPhrase(territoryId: string, phrase: string): Promise<TraversalProgress> {
    await this.fallbackRepo.saveJournalPhrase(territoryId, phrase);

    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.getProgress();
    }

    try {
      const current = await this.getProgress();
      const nextJournal = { ...current.journalEntries, [territoryId]: phrase };

      const { error } = await this.client.from('user_traversal_state').upsert(
        {
          user_id: userId,
          journal_entries: nextJournal,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.warn('Error saving journal phrase in Supabase:', error.message);
        return this.fallbackRepo.getProgress();
      }

      return this.getProgress();
    } catch (e) {
      console.error('Exception saving journal phrase in Supabase:', e);
      return this.fallbackRepo.getProgress();
    }
  }

  async markTributaryVisited(tributaryId: string): Promise<TraversalProgress> {
    await this.fallbackRepo.markTributaryVisited(tributaryId);

    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.getProgress();
    }

    try {
      const current = await this.getProgress();
      const updatedList = Array.from(new Set([...current.visitedTributaries, tributaryId]));

      const { error } = await this.client.from('user_traversal_state').upsert(
        {
          user_id: userId,
          visited_tributaries: updatedList,
          last_visited_route: `/afluentes/${tributaryId}`,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.warn('Error marking tributary visited in Supabase:', error.message);
        return this.fallbackRepo.getProgress();
      }

      return this.getProgress();
    } catch (e) {
      console.error('Exception marking tributary visited in Supabase:', e);
      return this.fallbackRepo.getProgress();
    }
  }

  async registerDiscoveredItems(itemIds: string[]): Promise<TraversalProgress> {
    await this.fallbackRepo.registerDiscoveredItems(itemIds);

    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.getProgress();
    }

    try {
      const current = await this.getProgress();
      const set = new Set(current.discoveredItems || []);
      for (const id of itemIds) {
        set.add(id);
      }
      const updatedList = Array.from(set);

      const { error } = await this.client.from('user_traversal_state').upsert(
        {
          user_id: userId,
          discovered_items: updatedList,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.warn('Error registering discovered items in Supabase:', error.message);
        return this.fallbackRepo.getProgress();
      }

      return this.getProgress();
    } catch (e) {
      console.error('Exception registering discovered items in Supabase:', e);
      return this.fallbackRepo.getProgress();
    }
  }

  async recordInteractionEvent(event: InteractionEvent): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.recordInteractionEvent(event);
    }

    try {
      const { error } = await this.client.from('interaction_events').insert({
        user_id: userId,
        event_name: event.eventName,
        territory_id: event.territoryId || null,
        target_id: event.targetId || null,
        session_id: event.sessionId || null,
        metadata: event.metadata || {},
        occurred_at: event.occurredAt || new Date().toISOString(),
      });

      if (error) {
        console.warn('Error saving interaction event to Supabase, falling back to local storage:', error.message);
        await this.fallbackRepo.recordInteractionEvent(event);
        return;
      }

      await this.fallbackRepo.recordInteractionEvent(event);
    } catch (e) {
      console.error('Exception in recordInteractionEvent on Supabase:', e);
      await this.fallbackRepo.recordInteractionEvent(event);
    }
  }

  async getInteractionEvents(limit = 50): Promise<InteractionEvent[]> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.getInteractionEvents(limit);
    }

    try {
      const { data, error } = await this.client
        .from('interaction_events')
        .select('*')
        .eq('user_id', userId)
        .order('occurred_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Error fetching interaction events from Supabase:', error.message);
        return this.fallbackRepo.getInteractionEvents(limit);
      }

      if (!data) {
        return [];
      }

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        eventName: row.event_name,
        territoryId: row.territory_id ?? undefined,
        targetId: row.target_id ?? undefined,
        sessionId: row.session_id ?? undefined,
        metadata: row.metadata ?? {},
        occurredAt: row.occurred_at,
      }));
    } catch (e) {
      console.error('Exception in getInteractionEvents on Supabase:', e);
      return this.fallbackRepo.getInteractionEvents(limit);
    }
  }

  async setLastVisited(route: string): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.setLastVisited(route);
    }

    try {
      const { error } = await this.client.from('user_traversal_state').upsert({
        user_id: userId,
        last_visited_route: route,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Error setting last visited route in Supabase:', error.message);
      }
      await this.fallbackRepo.setLastVisited(route);
    } catch (e) {
      console.error('Exception setting last visited route in Supabase:', e);
      await this.fallbackRepo.setLastVisited(route);
    }
  }

  async resetProgress(): Promise<TraversalProgress> {
    const userId = await this.getUserId();
    if (!userId) {
      return this.fallbackRepo.resetProgress();
    }

    try {
      const { error: progressError } = await this.client.from('user_progress').delete().eq('user_id', userId);
      if (progressError) {
        console.warn('Error deleting user_progress in Supabase:', progressError.message);
      }

      const { error: stateError } = await this.client.from('user_traversal_state').delete().eq('user_id', userId);
      if (stateError) {
        console.warn('Error deleting user_traversal_state in Supabase:', stateError.message);
      }

      await this.fallbackRepo.resetProgress();
      return { ...INITIAL_PROGRESS };
    } catch (e) {
      console.error('Exception resetting progress in Supabase:', e);
      return this.fallbackRepo.resetProgress();
    }
  }
}

