'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ENTRY_DATA } from '@/data/entry';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';
import { GamefulWelcomeCover } from '@/components/home/GamefulWelcomeCover';
import { InitialGamefulLoadingScreen } from '@/components/home/InitialGamefulLoadingScreen';
import { RiverDescentLoadingScreen } from '@/components/home/RiverDescentLoadingScreen';
import { ManifestoTypewriter } from '@/components/home/ManifestoTypewriter';
import { LianaVineBorders } from '@/components/home/LianaVineBorders';
import { ExplorerNameModal } from '@/components/home/ExplorerNameModal';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';
import { Compass, ArrowRight, Layers, HelpCircle, BookOpen, Sparkles, User } from 'lucide-react';

export default function EntryPage() {
  const router = useRouter();
  const { progress, markEntryCompleted, explorerName, setExplorerName } = useProgression();
  const { getTerritoryBg } = useVisualSet();
  const conceptualRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  const [showInitialLoading, setShowInitialLoading] = useState<boolean>(true);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [isTransitioningToRiver, setIsTransitioningToRiver] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isManifestoVisible, setIsManifestoVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!manifestoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsManifestoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(manifestoRef.current);
    return () => observer.disconnect();
  }, [isMounted, showInitialLoading]);

  const handleInitialLoadingComplete = useCallback(() => {
    setShowInitialLoading(false);
    setShowNameModal(true);
  }, []);

  const handleScrollToConceptual = () => {
    setIsManifestoVisible(true);
    if (conceptualRef.current) {
      conceptualRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartTraversal = () => {
    setIsTransitioningToRiver(true);
  };

  const handleRiverDescentComplete = useCallback(async () => {
    await markEntryCompleted();
    router.push('/mapa');
  }, [markEntryCompleted, router]);

  const hasStarted = progress.entryCompleted;

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* 0. PANTALLA DE CARGA INICIAL (10s, Serie A al azar, barra destacada, 5 frases) */}
      {isMounted && showInitialLoading && (
        <InitialGamefulLoadingScreen onComplete={handleInitialLoadingComplete} />
      )}

      {/* MODAL DE BIENVENIDA Y NOMBRE DE EXPLORADOR (Apenas termina la carga) */}
      <ExplorerNameModal
        isOpen={!showInitialLoading && showNameModal}
        initialName={explorerName}
        onSave={(name) => {
          setExplorerName(name);
          setShowNameModal(false);
        }}
        onClose={() => setShowNameModal(false)}
      />

      {/* PANTALLA DE CARGA AL COMENZAR TRAVESÍA (5s, Serie B en bucle cada 2s) */}
      {isTransitioningToRiver && (
        <RiverDescentLoadingScreen onComplete={handleRiverDescentComplete} />
      )}

      {/* 1. PORTADA TIPO VIDEOJUEGO DE PANTALLA COMPLETA */}
      <GamefulWelcomeCover onEnterClicked={handleScrollToConceptual} />

      {/* 2. ENTRADA CONCEPTUAL EDITORIAL COMPLETA (PRESERVADA Y ENRIQUECIDA) */}
      <div
        ref={conceptualRef}
        id="entrada-conceptual"
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-16"
      >
        {/* Hero Editorial: Panel de lectura en pergamino cálido */}
        <section aria-labelledby="entry-title" className="space-y-6">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900 border border-jade-600/50 text-water-300 text-xs font-mono uppercase tracking-widest shadow-sm">
              <Compass className="w-3.5 h-3.5 text-solar-400" />
              <span>Pórtico Conceptual de la Travesía</span>
            </div>

            {explorerName && (
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-solar-500/10 border border-solar-400/30 text-solar-300 text-xs font-mono">
                  <User className="w-3.5 h-3.5 text-solar-400" />
                  <span>Bitácora activa de navegación: <strong className="text-solar-200">{explorerName}</strong></span>
                </div>
              </div>
            )}

            <h2
              id="entry-title"
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-earth-50 tracking-tight leading-tight"
            >
              {ENTRY_DATA.title}
            </h2>

            <p className="text-sm sm:text-base font-mono text-water-300">
              {ENTRY_DATA.subtitle}
            </p>
          </div>

          {/* Panel de lectura principal: Manifiesto con efecto typewriter secuencial y controles */}
          <div ref={manifestoRef}>
            <ManifestoTypewriter
              paragraphs={ENTRY_DATA.leadParagraphs}
              startTrigger={isManifestoVisible}
            />
          </div>
        </section>

        {/* Las Cinco Preguntas del Recorrido (Fichas manipulables / Estaciones) con marco de lianas y hojas */}
        <section
          aria-labelledby="journey-questions-title"
          className="relative p-6 sm:p-8 rounded-2xl bg-forest-900/95 border-2 border-jade-600/50 backdrop-blur-md shadow-2xl space-y-5"
        >
          {/* Marco botánico experimental de lianas y hojas en tonos jade */}
          <LianaVineBorders />

          <div className="relative z-10 flex items-center justify-between border-b border-forest-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-solar-300 tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <h3 id="journey-questions-title" className="font-semibold">
                {ENTRY_DATA.journeyQuestionsTitle}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-earth-300/80">
              5 Estaciones del Cauce
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-3.5 pt-2">
            {ENTRY_DATA.journeyQuestions.map((q, idx) => {
              const territoryId = `territorio-${idx + 1}`;
              const bgUrl = getTerritoryBg(territoryId);
              return (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-2xl border-burnt-papyrus-card text-parchment-ink transition-all group flex items-center justify-between gap-3 sm:gap-6"
                >
                  {/* Recuadro de miniatura a la izquierda con degradé (Serie A o B según selección activa) */}
                  <div className="relative h-12 sm:h-14 w-24 sm:w-32 rounded-lg overflow-hidden shrink-0 border border-jade-600/40 shadow-inner bg-forest-950">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${bgUrl})` }}
                    />
                    {/* Degradé lateral similar al sub HUD */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0b2f28]/40 to-[#0b2f28]/90" />
                    <div className="absolute inset-0 flex items-center px-2">
                      <span className="text-[11px] font-mono font-bold text-solar-300 drop-shadow uppercase tracking-wider bg-forest-950/70 px-1.5 py-0.5 rounded border border-solar-400/40">
                        T{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Texto de la pregunta centrado */}
                  <div className="flex-1 text-center font-serif text-sm sm:text-base md:text-lg text-parchment-ink font-semibold leading-snug px-2">
                    {q}
                  </div>

                  {/* Espaciador simétrico a la derecha con indicador de estación */}
                  <div className="w-24 sm:w-32 shrink-0 hidden sm:flex items-center justify-end px-2">
                    <span className="w-7 h-7 rounded-full bg-forest-900 text-water-300 text-xs font-mono font-bold flex items-center justify-center border border-jade-600/60 group-hover:bg-coral-500 group-hover:text-white group-hover:border-coral-400 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Idea de entrada e Invitación: Formato oficial de contenedor de énfasis con borde oro */}
        <div
          role="status"
          aria-live="polite"
          className="border-metallic-gold"
        >
          <div className="border-metallic-gold-inner p-6 md:p-8 bg-gradient-to-r from-forest-900/95 via-water-950/90 to-forest-900/95 backdrop-blur-md text-earth-100 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-solar-500/20 p-2.5 text-solar-300 border border-solar-500/40 shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6 text-solar-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-solar-300 font-bold bg-solar-950/60 px-2.5 py-0.5 rounded border border-solar-500/30">
                    {explorerName ? `Idea de Entrada • ${explorerName}` : 'Idea de Entrada'}
                  </span>
                </div>
                <p className="text-base sm:text-lg text-earth-100 font-serif leading-relaxed">
                  {ENTRY_DATA.entryConcept.body}
                </p>
                <p className="text-earth-200 leading-relaxed font-serif text-base sm:text-lg italic pt-1 font-medium">
                  {formatQuotation(ENTRY_DATA.invitation, explorerName)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones de Entrada y Continuación */}
        <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleStartTraversal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-xl bg-gradient-to-r from-coral-500 via-coral-400 to-solar-500 hover:from-coral-600 hover:to-solar-400 text-white font-serif font-bold text-base sm:text-lg shadow-xl hover:shadow-coral-500/30 transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-water-300"
          >
            <span>{ENTRY_DATA.ctaText}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {hasStarted && (
            <Link
              href={progress.lastVisitedRoute || '/mapa'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-forest-900/90 hover:bg-forest-850 text-earth-200 font-medium text-sm border border-jade-600/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400"
            >
              <Layers className="w-4 h-4 text-water-300" />
              <span>{ENTRY_DATA.ctaSecondaryText}</span>
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}

