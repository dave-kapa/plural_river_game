'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { OFFICIAL_JOURNAL_ENTRIES, MASTER_PRESENTATION_PARAGRAPH, MASTER_PRACTICAL_CONTINUATION } from '@/data/journal';
import { BookMarked, X, Check, Copy, Sparkles, Feather } from 'lucide-react';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';

export function JournalModal() {
  const { isJournalOpen, closeJournal, progress, explorerName } = useProgression();
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isJournalOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeJournal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isJournalOpen, closeJournal]);

  if (!isJournalOpen) return null;

  const entriesList = Object.values(OFFICIAL_JOURNAL_ENTRIES).sort((a, b) => a.order - b.order);
  const collectedCount = entriesList.filter(
    (entry) => Boolean(progress.journalEntries[entry.territoryId])
  ).length;

  const allCollected = collectedCount === entriesList.length;

  const assembledText = allCollected
    ? `${MASTER_PRESENTATION_PARAGRAPH.join('\n\n')}\n\n${MASTER_PRACTICAL_CONTINUATION}`
    : entriesList
        .filter((entry) => Boolean(progress.journalEntries[entry.territoryId]))
        .map((entry) => progress.journalEntries[entry.territoryId])
        .join('\n\n');

  const handleCopy = () => {
    if (!assembledText) return;
    navigator.clipboard.writeText(assembledText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-canopy-950 border border-river-700/60 p-6 md:p-8 shadow-2xl text-earth-100 space-y-6"
      >
        <div className="flex items-start justify-between border-b border-canopy-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-editorial-accent/20 text-editorial-accent border border-editorial-accent/30">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-editorial-accent">
                {explorerName ? `Cuaderno de Navegación de ${explorerName}` : 'Memoria de la Travesía'}
              </span>
              <h2 id="journal-modal-title" className="font-serif font-bold text-xl text-earth-50">
                {explorerName ? `Bitácora Fluvial • ${explorerName}` : 'Bitácora Fluvial'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={closeJournal}
            aria-label="Cerrar bitácora"
            className="text-earth-400 hover:text-earth-100 p-1.5 rounded-lg border border-canopy-800 hover:border-canopy-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-earth-300 font-sans leading-relaxed">
          {explorerName ? `Cada territorio explorado aporta una premisa nuclear a tu Bitácora, ${explorerName}. ` : 'Cada territorio explorado aporta una premisa nuclear a la Bitácora. '}
          Al completar la travesía, estas frases ensamblan el argumento institucional de Plural sobre la capacidad gameful.
        </p>

        {/* Lista de frases por territorio */}
        <div className="space-y-4">
          {entriesList.map((entry) => {
            const hasDiscovered = Boolean(progress.journalEntries[entry.territoryId]);

            return (
              <div
                key={entry.territoryId}
                className={`p-4 rounded-xl border transition-all ${
                  hasDiscovered
                    ? 'bg-canopy-900/60 border-river-600/40 text-earth-100'
                    : 'bg-canopy-950/40 border-canopy-900 text-earth-400/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-river-300">
                    Territorio {entry.order}: {entry.territoryTitle}
                  </span>
                  {hasDiscovered ? (
                    <span className="text-[10px] font-mono text-river-300 bg-river-950 px-2 py-0.5 rounded border border-river-700 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Registrado</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-earth-400/60">
                      Por descubrir
                    </span>
                  )}
                </div>

                <p className="font-serif text-sm sm:text-base leading-relaxed italic">
                  {hasDiscovered ? formatQuotation(entry.phrase, explorerName) : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Ensamblaje si hay entradas recogidas */}
        {collectedCount > 0 && (
          <div className="pt-4 border-t border-canopy-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-editorial-gold">
                <Feather className="w-4 h-4" />
                <span>Párrafo Ensamblado ({collectedCount} de 5 fragmentos)</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-canopy-900 hover:bg-river-900 text-xs font-mono text-earth-200 hover:text-earth-50 border border-canopy-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-river-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado al portapapeles' : 'Copiar texto'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-river-950/60 border border-river-700/50 font-serif text-sm sm:text-base leading-relaxed text-earth-100 italic">
              {assembledText}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={closeJournal}
            className="px-5 py-2 rounded-lg bg-canopy-900 hover:bg-canopy-800 text-earth-200 text-xs font-medium border border-canopy-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
