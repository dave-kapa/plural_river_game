'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type VisualSetId = 'set-a' | 'set-b';

interface VisualSetContextValue {
  visualSet: VisualSetId;
  setVisualSet: (set: VisualSetId) => void;
  toggleVisualSet: () => void;
  getTerritoryBg: (territoryId: string) => string;
  getMapBg: () => string;
  getPortadaBg: () => string;
}

const VisualSetContext = createContext<VisualSetContextValue | null>(null);

const STORAGE_KEY = 'plural_visual_set';

export function VisualSetProvider({ children }: { children: React.ReactNode }) {
  const [visualSet, setVisualSetState] = useState<VisualSetId>('set-a');

  useEffect(() => {
    try {
      // 1. Revisar URL search params
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlSet = params.get('set');
        if (urlSet === 'set-a' || urlSet === 'set-b') {
          setVisualSetState(urlSet);
          sessionStorage.setItem(STORAGE_KEY, urlSet);
          return;
        }

        // 2. Revisar sessionStorage
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved === 'set-a' || saved === 'set-b') {
          setVisualSetState(saved);
        }
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setVisualSet = useCallback((newSet: VisualSetId) => {
    setVisualSetState(newSet);
    try {
      sessionStorage.setItem(STORAGE_KEY, newSet);
    } catch {
      // Ignore
    }
  }, []);

  const toggleVisualSet = useCallback(() => {
    setVisualSetState((prev) => {
      const next = prev === 'set-a' ? 'set-b' : 'set-a';
      try {
        sessionStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const getTerritoryBg = useCallback(
    (territoryId: string) => {
      return `/assets/visual-sets/${visualSet}/${territoryId}.png`;
    },
    [visualSet]
  );

  const getMapBg = useCallback(() => {
    return `/assets/visual-sets/${visualSet}/mapa-rio.png`;
  }, [visualSet]);

  const getPortadaBg = useCallback(() => {
    return `/assets/visual-sets/portada.png`;
  }, []);

  return (
    <VisualSetContext.Provider
      value={{
        visualSet,
        setVisualSet,
        toggleVisualSet,
        getTerritoryBg,
        getMapBg,
        getPortadaBg,
      }}
    >
      {children}
    </VisualSetContext.Provider>
  );
}

export function useVisualSet() {
  const ctx = useContext(VisualSetContext);
  if (!ctx) {
    throw new Error('useVisualSet must be used within a VisualSetProvider');
  }
  return ctx;
}
