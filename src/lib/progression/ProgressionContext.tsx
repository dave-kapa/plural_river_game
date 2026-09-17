'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  TraversalProgress,
  TerritoryStatus,
  INITIAL_PROGRESS,
  ProgressionRepository,
} from '../persistence/types';
import { getProgressionRepository } from '../persistence';
import { ALL_TRIBUTARIES } from './unlockRules';

interface ProgressionContextValue {
  progress: TraversalProgress;
  isLoading: boolean;
  repository: ProgressionRepository;
  saveTerritoryProgress: (
    territoryId: string,
    status: TerritoryStatus,
    interactionState?: Record<string, any>,
    journalPhrase?: string
  ) => Promise<void>;
  saveJournalPhrase: (territoryId: string, phrase: string) => Promise<void>;
  markEntryCompleted: () => Promise<void>;
  markTributaryVisited: (tributaryId: string) => Promise<void>;
  registerDiscoveredItems: (itemIds: string | string[]) => Promise<void>;
  isItemDiscovered: (itemId: string) => boolean;
  setLastVisited: (route: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  isTerritoryUnlocked: (territoryId: string) => boolean;
  isTerritoryCompleted: (territoryId: string) => boolean;
  isTributaryVisited: (tributaryId: string) => boolean;
  areCreditsUnlocked: boolean;
  isJournalOpen: boolean;
  openJournal: () => void;
  closeJournal: () => void;
}

const ProgressionContext = createContext<ProgressionContextValue | null>(null);

export function ProgressionProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<TraversalProgress>(INITIAL_PROGRESS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const repo = useMemo(() => getProgressionRepository(), []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await repo.getProgress();
        if (isMounted) {
          setProgress(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load initial progress:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [repo]);

  const saveTerritoryProgress = useCallback(
    async (
      territoryId: string,
      status: TerritoryStatus,
      interactionState?: Record<string, any>,
      journalPhrase?: string
    ) => {
      const updated = await repo.saveTerritoryProgress(
        territoryId,
        status,
        interactionState,
        journalPhrase
      );
      setProgress(updated);
    },
    [repo]
  );

  const saveJournalPhrase = useCallback(
    async (territoryId: string, phrase: string) => {
      const updated = await repo.saveJournalPhrase(territoryId, phrase);
      setProgress(updated);
    },
    [repo]
  );

  const markEntryCompleted = useCallback(async () => {
    const updated = await repo.markEntryCompleted();
    setProgress(updated);
  }, [repo]);

  const markTributaryVisited = useCallback(
    async (tributaryId: string) => {
      const updated = await repo.markTributaryVisited(tributaryId);
      setProgress(updated);
    },
    [repo]
  );

  const setLastVisited = useCallback(
    async (route: string) => {
      await repo.setLastVisited(route);
      setProgress((prev) => ({ ...prev, lastVisitedRoute: route }));
    },
    [repo]
  );

  const resetProgress = useCallback(async () => {
    const fresh = await repo.resetProgress();
    setProgress(fresh);
  }, [repo]);

  const isTerritoryUnlocked = useCallback(
    (territoryId: string) => {
      const status = progress.territoryStatus[territoryId];
      return status === 'unlocked' || status === 'visited' || status === 'completed';
    },
    [progress.territoryStatus]
  );

  const isTerritoryCompleted = useCallback(
    (territoryId: string) => {
      return progress.territoryStatus[territoryId] === 'completed';
    },
    [progress.territoryStatus]
  );

  const isTributaryVisited = useCallback(
    (tributaryId: string) => {
      return progress.visitedTributaries.includes(tributaryId);
    },
    [progress.visitedTributaries]
  );

  const areCreditsUnlocked = useMemo(() => {
    return (
      progress.creditsUnlocked ||
      ALL_TRIBUTARIES.every((t) => progress.visitedTributaries.includes(t))
    );
  }, [progress.creditsUnlocked, progress.visitedTributaries]);

  const registerDiscoveredItems = useCallback(
    async (itemIds: string | string[]) => {
      const array = Array.isArray(itemIds) ? itemIds : [itemIds];
      const updated = await repo.registerDiscoveredItems(array);
      setProgress(updated);
    },
    [repo]
  );

  const isItemDiscovered = useCallback(
    (itemId: string) => {
      return (progress.discoveredItems || []).includes(itemId);
    },
    [progress.discoveredItems]
  );

  const openJournal = useCallback(() => setIsJournalOpen(true), []);
  const closeJournal = useCallback(() => setIsJournalOpen(false), []);

  const value: ProgressionContextValue = {
    progress,
    isLoading,
    repository: repo,
    saveTerritoryProgress,
    saveJournalPhrase,
    markEntryCompleted,
    markTributaryVisited,
    registerDiscoveredItems,
    isItemDiscovered,
    setLastVisited,
    resetProgress,
    isTerritoryUnlocked,
    isTerritoryCompleted,
    isTributaryVisited,
    areCreditsUnlocked,
    isJournalOpen,
    openJournal,
    closeJournal,
  };

  return (
    <ProgressionContext.Provider value={value}>
      {children}
    </ProgressionContext.Provider>
  );
}

export function useProgression(): ProgressionContextValue {
  const ctx = useContext(ProgressionContext);
  if (!ctx) {
    throw new Error('useProgression must be used within a ProgressionProvider');
  }
  return ctx;
}
