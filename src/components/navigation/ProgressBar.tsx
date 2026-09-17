'use client';

import React from 'react';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { Waves, Sparkles, CheckCheck } from 'lucide-react';

export function ProgressBar() {
  const { progress } = useProgression();

  // Contar territorios completados
  const completedTerritoriesCount = Object.values(progress.territoryStatus).filter(
    (status) => status === 'completed'
  ).length;

  const totalTerritories = 5;
  const discoveryPercent = progress.globalDiscoveryPercent || 0;
  const isFullDiscovery = progress.fullDiscoveryReached || discoveryPercent >= 100;

  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs font-mono">
      {/* Progreso Esencial: Cauce del Río (5 territorios) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 text-river-300">
          <Waves className="w-3.5 h-3.5 text-editorial-accent" />
          <span className="hidden md:inline">Cauce:</span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((num) => {
            const status = progress.territoryStatus[`territorio-${num}`];
            const isCompleted = status === 'completed';
            const isUnlocked = status === 'unlocked' || status === 'visited';

            return (
              <div
                key={num}
                title={`Territorio ${num}: ${status || 'bloqueado'}`}
                className={`w-3.5 h-2 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-river-400 shadow-[0_0_8px_rgba(101,181,186,0.6)]'
                    : isUnlocked
                    ? 'bg-river-700/80 border border-river-400/40'
                    : 'bg-canopy-800/80'
                }`}
              />
            );
          })}
        </div>

        <span className="text-earth-300 text-[11px] hidden sm:inline">
          {completedTerritoriesCount}/{totalTerritories}
        </span>
      </div>

      <div className="h-4 w-px bg-canopy-800 hidden sm:block" />

      {/* HUD de Descubrimiento Total del Ecosistema */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
          isFullDiscovery
            ? 'bg-editorial-gold/15 border-editorial-gold/60 text-editorial-gold shadow-[0_0_10px_rgba(229,169,59,0.3)]'
            : 'bg-canopy-900/80 border-canopy-700/80 text-river-200'
        }`}
        title={`Descubrimiento ponderado por territorio: T1: ${progress.territoryDiscoveryPercent?.['territorio-1'] || 0}% | T2: ${progress.territoryDiscoveryPercent?.['territorio-2'] || 0}% | T3: ${progress.territoryDiscoveryPercent?.['territorio-3'] || 0}% | T4: ${progress.territoryDiscoveryPercent?.['territorio-4'] || 0}% | T5: ${progress.territoryDiscoveryPercent?.['territorio-5'] || 0}%`}
      >
        {isFullDiscovery ? (
          <CheckCheck className="w-3.5 h-3.5 text-editorial-gold shrink-0" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-editorial-accent shrink-0" />
        )}
        <span className="font-mono text-xs whitespace-nowrap">
          {discoveryPercent}% <span className="hidden md:inline">del ecosistema</span> descubierto
        </span>
      </div>
    </div>
  );
}
