'use client';

import React, { useEffect } from 'react';
import { RiverMap } from '@/components/map/RiverMap';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { Compass, Info, Sparkles, BookMarked } from 'lucide-react';

export default function MapPage() {
  const { progress, setLastVisited, openJournal, areCreditsUnlocked } = useProgression();

  useEffect(() => {
    setLastVisited('/mapa');
  }, [setLastVisited]);

  // Mensaje de progreso narrativo contextual según el estado
  const getProgressNarrative = () => {
    const t1 = progress.territoryStatus['territorio-1'];
    const t2 = progress.territoryStatus['territorio-2'];
    const t3 = progress.territoryStatus['territorio-3'];
    const t4 = progress.territoryStatus['territorio-4'];
    const t5 = progress.territoryStatus['territorio-5'];
    const tributariesCount = (progress.visitedTributaries || []).length;

    if (areCreditsUnlocked) {
      return 'La travesía está completa; la conversación comienza.';
    }
    if (tributariesCount > 0) {
      return 'Un nuevo afluente ha sido explorado. El río se abre hacia nuevas posibilidades.';
    }
    if (t4 === 'completed') {
      return 'El río se abre hacia nuevas posibilidades en el delta.';
    }
    if (t2 === 'completed' && t3 === 'completed') {
      return 'Las corrientes vuelven a encontrarse en la confluencia con el Método Plural.';
    }
    if (t2 === 'completed' || t3 === 'completed') {
      return 'Has completado una de las corrientes. La otra sigue esperando en la bifurcación.';
    }
    if (t1 === 'completed') {
      return 'Dos caminos están disponibles: qué puede resolver o qué permite diseñar.';
    }
    if (t1 === 'unlocked' || t1 === 'visited') {
      return 'Una nueva corriente se ha abierto en la naciente del río.';
    }
    return 'El cauce comienza a tomar forma.';
  };

  const journalCount = Object.keys(progress.journalEntries || {}).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-editorial-accent">
            <Compass className="w-4 h-4" />
            <span>Cartografía Fluvial</span>
          </div>

          <button
            type="button"
            onClick={openJournal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-canopy-900 hover:bg-river-900 border border-canopy-700 text-xs font-mono text-river-300 transition-colors"
          >
            <BookMarked className="w-3.5 h-3.5 text-editorial-accent" />
            <span>Bitácora ({journalCount}/5)</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-earth-50">
          El Curso del Río Plural
        </h1>

        {/* Estado narrativo actual */}
        <div className="p-3.5 rounded-xl bg-river-950/70 border border-river-700/60 text-xs sm:text-sm text-river-200 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-river-400 shrink-0" />
          <span className="font-serif italic font-medium">{getProgressNarrative()}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-canopy-900/50 border border-canopy-800 text-xs text-earth-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-river-400 shrink-0 mt-0.5" />
          <span>
            <strong>Navegación no lineal:</strong> Tras completar el Territorio 1, puedes recorrer los Territorios 2 y 3 en cualquier orden. El Territorio 4 requiere haber completado ambos antes de abrirse.
          </span>
        </div>
      </header>

      {/* Mapa central con estaciones y delta */}
      <RiverMap />
    </div>
  );
}
