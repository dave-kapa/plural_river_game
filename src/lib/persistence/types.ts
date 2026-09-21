export type TerritoryStatus = 'locked' | 'unlocked' | 'visited' | 'completed';

export interface TraversalProgress {
  entryCompleted: boolean;
  territoryStatus: Record<string, TerritoryStatus>;
  territoryInteractions: Record<string, Record<string, any>>;
  visitedTributaries: string[];
  journalEntries: Record<string, string>; // territoryId -> conclusion phrase
  creditsUnlocked: boolean;
  discoveredItems: string[];
  territoryDiscoveryPercent: Record<string, number>;
  globalDiscoveryPercent: number;
  fullDiscoveryReached: boolean;
  lastVisitedRoute: string;
  explorerName?: string;
  updatedAt: string;
}

export const INITIAL_PROGRESS: TraversalProgress = {
  entryCompleted: false,
  territoryStatus: {
    'territorio-1': 'locked',
    'territorio-2': 'locked',
    'territorio-3': 'locked',
    'territorio-4': 'locked',
    'territorio-5': 'locked',
  },
  territoryInteractions: {},
  visitedTributaries: [],
  journalEntries: {},
  creditsUnlocked: false,
  discoveredItems: [],
  territoryDiscoveryPercent: {
    'territorio-1': 0,
    'territorio-2': 0,
    'territorio-3': 0,
    'territorio-4': 0,
    'territorio-5': 0,
  },
  globalDiscoveryPercent: 0,
  fullDiscoveryReached: false,
  lastVisitedRoute: '/',
  explorerName: '',
  updatedAt: new Date().toISOString(),
};

export interface InteractionEvent {
  id?: string;
  userId?: string;
  eventName: string;
  territoryId?: string;
  targetId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

export interface ProgressionRepository {
  getProgress(): Promise<TraversalProgress>;
  saveTerritoryProgress(
    territoryId: string,
    status: TerritoryStatus,
    interactionState?: Record<string, any>,
    journalPhrase?: string
  ): Promise<TraversalProgress>;
  markEntryCompleted(): Promise<TraversalProgress>;
  markTributaryVisited(tributaryId: string): Promise<TraversalProgress>;
  saveJournalPhrase(territoryId: string, phrase: string): Promise<TraversalProgress>;
  registerDiscoveredItems(itemIds: string[]): Promise<TraversalProgress>;
  recordInteractionEvent(event: InteractionEvent): Promise<void>;
  getInteractionEvents(limit?: number): Promise<InteractionEvent[]>;
  setLastVisited(route: string): Promise<void>;
  resetProgress(): Promise<TraversalProgress>;
}
