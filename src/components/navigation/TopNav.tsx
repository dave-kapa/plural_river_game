'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useAudio } from '@/lib/audio/AudioContext';
import { ProgressBar } from './ProgressBar';
import { ResetTraversalModal } from './ResetTraversalModal';
import { JournalModal } from '@/components/journal/JournalModal';
import { ExplorerNameModal } from '@/components/home/ExplorerNameModal';
import { Map, RotateCcw, Compass, Award, BookMarked, Volume2, VolumeX, User } from 'lucide-react';

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { progress, resetProgress, areCreditsUnlocked, openJournal, explorerName, setExplorerName } = useProgression();
  const { isMuted, toggleMute } = useAudio();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

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
              className="flex items-center gap-2 text-earth-100 hover:text-river-300 font-serif font-semibold text-sm md:text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 rounded-md py-1 px-1.5 shrink-0 whitespace-nowrap"
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

            {/* Chip de Explorador */}
            {explorerName && (
              <button
                type="button"
                onClick={() => setIsNameModalOpen(true)}
                title={`Explorador: ${explorerName} (clic para cambiar)`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest-900/80 hover:bg-forest-850 text-xs font-mono text-solar-300 border border-solar-500/40 hover:border-solar-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-solar-400"
              >
                <User className="w-3.5 h-3.5 text-solar-400" />
                <span className="hidden lg:inline text-earth-300">Explorador:</span>
                <span className="font-semibold text-solar-200 max-w-[110px] truncate">{explorerName}</span>
              </button>
            )}

            {/* Botón de Audio de Fondo (Mute / Unmute) */}
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? 'Activar sonido de fondo' : 'Silenciar sonido de fondo'}
              aria-label={isMuted ? 'Activar sonido de fondo' : 'Silenciar sonido de fondo'}
              className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                isMuted
                  ? 'bg-forest-900/70 text-earth-400 border-forest-800 hover:text-earth-200 hover:border-forest-700'
                  : 'bg-river-950/80 text-solar-400 border-solar-500/50 hover:bg-river-900 hover:border-solar-400 shadow-[0_0_10px_rgba(238,186,67,0.2)]'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

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

      <ExplorerNameModal
        isOpen={isNameModalOpen}
        initialName={explorerName}
        onSave={(name) => {
          setExplorerName(name);
          setIsNameModalOpen(false);
        }}
        onClose={() => setIsNameModalOpen(false)}
      />

      <JournalModal />
    </>
  );
}
