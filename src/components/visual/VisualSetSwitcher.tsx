'use client';

import React, { useState } from 'react';
import { useVisualSet } from '@/lib/visual/VisualSetContext';
import { Layers, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function VisualSetSwitcher() {
  const { visualSet, setVisualSet } = useVisualSet();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      aria-label="Selector de serie visual"
      className="fixed bottom-4 right-4 z-50 select-none print:hidden"
    >
      <div className="bg-forest-950/90 backdrop-blur-md border border-jade-600/40 rounded-xl shadow-2xl p-2 text-xs font-mono text-earth-200 transition-all">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-forest-850 text-water-300 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400"
            title="Cambiar serie visual (A/B)"
          >
            <Layers className="w-3.5 h-3.5 text-solar-400" />
            <span className="uppercase tracking-wider">
              {visualSet === 'set-a' ? 'Serie A (Cartográfica)' : 'Serie B (Inmersiva)'}
            </span>
            {isOpen ? <ChevronDown className="w-3 h-3 text-earth-400" /> : <ChevronUp className="w-3 h-3 text-earth-400" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-2 pt-2 border-t border-forest-800 space-y-1 animate-in fade-in duration-200">
            <div className="px-2 py-1 text-[10px] text-earth-400 font-sans">
              Alternador A/B de fondos atmosféricos:
            </div>
            <button
              type="button"
              onClick={() => {
                setVisualSet('set-a');
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center justify-between transition-colors ${
                visualSet === 'set-a'
                  ? 'bg-jade-600/40 text-earth-50 font-bold border border-jade-500/50'
                  : 'hover:bg-forest-850 text-earth-300'
              }`}
            >
              <span>Serie A: Perspectiva cartográfica aérea</span>
              {visualSet === 'set-a' && <Sparkles className="w-3 h-3 text-solar-300" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setVisualSet('set-b');
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center justify-between transition-colors ${
                visualSet === 'set-b'
                  ? 'bg-water-700/50 text-earth-50 font-bold border border-water-400/50'
                  : 'hover:bg-forest-850 text-earth-300'
              }`}
            >
              <span>Serie B: Perspectiva inmersiva desde el río</span>
              {visualSet === 'set-b' && <Sparkles className="w-3 h-3 text-solar-300" />}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
