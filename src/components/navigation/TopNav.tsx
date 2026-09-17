'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { ProgressBar } from './ProgressBar';
import { ResetTraversalModal } from './ResetTraversalModal';
import { JournalModal } from '@/components/journal/JournalModal';
import { Map, RotateCcw, Compass, Award, BookMarked } from 'lucide-react';

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { progress, resetProgress, areCreditsUnlocked, openJournal } = useProgression();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const isMap = pathname === '/mapa';
  const journalEntriesCount = Object.keys(progress.journalEntries || {}).length;

  const handleResetConfirm = async () => {
    await resetProgress();
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-canopy-800/80 bg-canopy-950/85 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo / Nombre del micrositio */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-earth-100 hover:text-river-300 font-serif font-semibold text-sm md:text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 rounded-md py-1 px-1.5"
            >
              <Compass className="w-5 h-5 text-editorial-accent" />
              <span>Plural × Gameful Design</span>
            </Link>

            {/* Enlace al mapa / volver al río */}
            {progress.entryCompleted && !isMap && (
              <Link
                href="/mapa"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-river-950/80 border border-river-700 text-river-200 hover:bg-river-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Volver al río</span>
              </Link>
            )}
          </div>

          {/* Barra de progreso global, Bitácora y controles */}
          <div className="flex items-center gap-3 md:gap-5">
            {progress.entryCompleted && <ProgressBar />}

            {/* Botón para abrir la Bitácora */}
            {progress.entryCompleted && (
              <button
                type="button"
                onClick={openJournal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canopy-900 hover:bg-river-950 text-xs font-mono text-river-200 border border-river-700/60 hover:border-river-500 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
              >
                <BookMarked className="w-3.5 h-3.5 text-editorial-accent" />
                <span className="hidden sm:inline">Bitácora</span>
                {journalEntriesCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-river-700 text-[10px] flex items-center justify-center text-white">
                    {journalEntriesCount}
                  </span>
                )}
              </button>
            )}

            {areCreditsUnlocked && (
              <Link
                href="/creditos"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-canopy-900 border border-canopy-700 text-editorial-gold hover:text-earth-50 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Créditos</span>
              </Link>
            )}

            {/* Botón de reinicio */}
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              title="Reiniciar la travesía"
              className="inline-flex items-center gap-1 text-xs text-earth-400 hover:text-editorial-accent transition-colors p-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </header>

      <ResetTraversalModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
      />

      <JournalModal />
    </>
  );
}
