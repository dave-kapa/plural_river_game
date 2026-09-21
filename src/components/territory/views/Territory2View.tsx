'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';
import { TerritoryProgressDualTracker } from '../TerritoryProgressDualTracker';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';
import {
  Compass,
  CheckCircle2,
  TrendingUp,
  LineChart,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronDown,
  AlertOctagon,
} from 'lucide-react';

export function Territory2View() {
  const data = TERRITORIES_DATA['territorio-2'];
  const content = data.specificContent;
  const { progress, saveTerritoryProgress, isTerritoryCompleted, registerDiscoveredItems, trackInteraction, explorerName } = useProgression();
  const { getTerritoryBg } = useVisualSet();

  const isAlreadyCompleted = progress.territoryStatus['territorio-2'] === 'completed';
  const t2Interactions = progress.territoryInteractions['territorio-2'] || {};

  // Paso 1: Exploración de las 3 fuerzas (Honest State Restoration: sin atribución ficticia)
  const initialExploredForces = Array.isArray(t2Interactions.exploredForces) && t2Interactions.exploredForces.length > 0
    ? t2Interactions.exploredForces
    : [];

  // El detalle de las fuerzas debe estar oculto de entrada, solo aparece al hacer clic en alguna
  const [activeForceId, setActiveForceId] = useState<string | null>(null);
  const [exploredForces, setExploredForces] = useState<string[]>(initialExploredForces);
  const exploredForcesRef = useRef<string[]>(initialExploredForces);

  // Paso 2: Acordeón de capacidades adicionales con indicador tipo bombillo
  const [expandedCapacityId, setExpandedCapacityId] = useState<string | null>(null);
  const initialExploredCapacities = Array.isArray(t2Interactions.exploredCapacities) && t2Interactions.exploredCapacities.length > 0
    ? t2Interactions.exploredCapacities
    : [];
  const [exploredCapacities, setExploredCapacities] = useState<string[]>(initialExploredCapacities);
  const exploredCapacitiesRef = useRef<string[]>(initialExploredCapacities);

  // Paso 3: Escalas de cambio con tarjetas volteables (flip cards)
  const initialExploredScales = t2Interactions.exploredScales || [];
  const [exploredScales, setExploredScales] = useState<string[]>(initialExploredScales);
  const exploredScalesRef = useRef<string[]>(initialExploredScales);
  const [flippedScales, setFlippedScales] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (t2Interactions.exploredForces && t2Interactions.exploredForces.length > 0) {
      exploredForcesRef.current = t2Interactions.exploredForces;
      setExploredForces(t2Interactions.exploredForces);
    }
    if (t2Interactions.exploredCapacities && t2Interactions.exploredCapacities.length > 0) {
      exploredCapacitiesRef.current = t2Interactions.exploredCapacities;
      setExploredCapacities(t2Interactions.exploredCapacities);
    }
    if (t2Interactions.exploredScales && t2Interactions.exploredScales.length > 0) {
      exploredScalesRef.current = t2Interactions.exploredScales;
      setExploredScales(t2Interactions.exploredScales);
    }
  }, [t2Interactions.exploredForces, t2Interactions.exploredCapacities, t2Interactions.exploredScales]);

  const toggleScaleFlip = (scaleKey: string) => {
    const willBeFlipped = !flippedScales[scaleKey];
    setFlippedScales((prev) => ({ ...prev, [scaleKey]: willBeFlipped }));
    if (willBeFlipped) {
      handleExploreScale(scaleKey);
    }
  };

  const handleSelectForce = async (forceId: string) => {
    setActiveForceId(forceId);
    const nextExplored = Array.from(new Set([...exploredForcesRef.current, forceId]));
    exploredForcesRef.current = nextExplored;
    setExploredForces(nextExplored);
    await registerDiscoveredItems(`t2:force:${forceId}`);
    await trackInteraction({
      eventName: 'force_discovered',
      territoryId: 'territorio-2',
      targetId: forceId,
    });

    const isNowComplete = nextExplored.length >= 3;
    await saveTerritoryProgress(
      'territorio-2',
      isNowComplete || isAlreadyCompleted ? 'completed' : 'visited',
      {
        ...t2Interactions,
        exploredForces: nextExplored,
        activeForceId: forceId,
      },
      isNowComplete ? data.journalPhrase : undefined
    );

    if (isNowComplete && !isAlreadyCompleted) {
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-2',
      });
    }
  };

  const allThreeForcesDiscovered = exploredForces.length >= 3 || exploredForcesRef.current.length >= 3;
  const isEssentialComplete = allThreeForcesDiscovered;
  const isCompleted = isAlreadyCompleted || allThreeForcesDiscovered;

  const handleToggleCapacity = async (capId: string) => {
    const isOpening = expandedCapacityId !== capId;
    setExpandedCapacityId(isOpening ? capId : null);
    if (isOpening) {
      await registerDiscoveredItems(`t2:capacity:${capId}`);
      await trackInteraction({
        eventName: 'capacity_opened',
        territoryId: 'territorio-2',
        targetId: capId,
      });
      const nextCapacities = Array.from(new Set([...exploredCapacitiesRef.current, capId]));
      exploredCapacitiesRef.current = nextCapacities;
      setExploredCapacities(nextCapacities);
      const isNowComplete = exploredForcesRef.current.length >= 3 || isAlreadyCompleted;
      await saveTerritoryProgress(
        'territorio-2',
        isNowComplete ? 'completed' : 'visited',
        {
          ...t2Interactions,
          exploredForces: exploredForcesRef.current,
          exploredCapacities: nextCapacities,
          exploredScales: exploredScalesRef.current,
        }
      );
    }
  };

  const handleExploreScale = async (scaleKey: string) => {
    const nextScales = Array.from(new Set([...exploredScalesRef.current, scaleKey]));
    exploredScalesRef.current = nextScales;
    setExploredScales(nextScales);
    await registerDiscoveredItems(`t2:scale:${scaleKey}`);
    await trackInteraction({
      eventName: 'scale_explored',
      territoryId: 'territorio-2',
      targetId: scaleKey,
    });
    const isNowComplete = exploredForcesRef.current.length >= 3 || isAlreadyCompleted;
    await saveTerritoryProgress(
      'territorio-2',
      isNowComplete ? 'completed' : 'visited',
      {
        ...t2Interactions,
        exploredForces: exploredForcesRef.current,
        exploredCapacities: exploredCapacitiesRef.current,
        exploredScales: nextScales,
      }
    );
  };

  const isTerritory3Completed = isTerritoryCompleted('territorio-3');
  const activeForce = activeForceId
    ? content.threeForces.find((f: any) => f.id === activeForceId) || null
    : null;
  const bgUrl = getTerritoryBg('territorio-2');
  const t2DiscoveredCount = (progress.discoveredItems || []).filter((id) => id.startsWith('t2:')).length;

  const getForceIcon = (id: string) => {
    switch (id) {
      case 'force-scale':
        return <TrendingUp className="w-4 h-4 text-water-400" />;
      case 'force-measure':
        return <LineChart className="w-4 h-4 text-water-400" />;
      case 'force-innovation':
        return <Lightbulb className="w-4 h-4 text-water-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-water-400" />;
    }
  };

  return (
    <div className="relative w-full overflow-x-clip" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      {/* Fondo atmosférico en proporción de pantalla con opacidad calibrada (punto medio de legibilidad) */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* Filtro atmosférico en punto medio: profundidad equilibrada para proteger la lectura */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-forest-950/55 via-forest-950/70 to-forest-950/85 pointer-events-none" />

      {/* SEGUNDA LÍNEA DEL HUD: Barra de progreso sticky del territorio */}
      <TerritoryProgressDualTracker
        territoryId="territorio-2"
        territoryTitle="Territorio 2: ¿Qué puede resolver?"
        essentialTitle="Hitos Esenciales de Navegación"
        essentialItems={[
          {
            id: 'forces',
            label: `Explorar las 3 fuerzas principales que mueven el cauce (${exploredForces.length}/3 exploradas)`,
            isDone: exploredForces.length >= 3,
          },
        ]}
        isEssentialComplete={isEssentialComplete}
        discoveryItemsCount={t2DiscoveredCount}
        discoveryTotalCount={13}
        discoveryPercent={progress.territoryDiscoveryPercent['territorio-2'] || 0}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-12">
        {/* Cabecera del Territorio */}
        <header className="space-y-4 border-b border-forest-800 pb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-water-300">
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Territorio 2 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
            </div>
            <span className="text-xs font-mono text-earth-300">
              {data.functionStatement}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-earth-50 tracking-tight leading-tight">
            {data.narrativeTitle}
          </h1>

          <div className="p-4 rounded-xl bg-forest-900/90 border-l-4 border-solar-500 text-earth-100 shadow-md">
            <span className="block text-xs font-mono uppercase tracking-wider text-water-300 mb-1">
              Pregunta Funcional:
            </span>
            <p className="text-lg md:text-xl font-serif italic text-earth-50">
              {formatQuotation(data.functionalQuestion, explorerName)}
            </p>
          </div>

          <p className="text-base sm:text-lg text-earth-200 font-sans leading-relaxed pt-2">
            {data.opening}
          </p>
        </header>

        {isAlreadyCompleted && !allThreeForcesDiscovered && (
          <div className="p-4 rounded-xl bg-forest-950/80 border border-solar-500/40 text-earth-200 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 text-solar-400 font-mono uppercase font-bold text-xs">
              <AlertOctagon className="w-4 h-4" />
              <span>Hito disponible para re-exploración</span>
            </div>
            <p>
              Este territorio figura como completado en tu travesía previa, pero las 3 fuerzas del cauce no cuentan con interacción documentada en este dispositivo. Puedes explorarlas activamente para registrar sus conceptos en la bitácora sin reiniciar tu avance general.
            </p>
          </div>
        )}

        {/* SECCIÓN 1: Tres fuerzas principales */}
        <section aria-labelledby="three-forces-title" className="space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
              Puertas de Entrada Inmediatas
            </span>
            <h2 id="three-forces-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
              Tres fuerzas que mueven el cauce
            </h2>
            <p className="text-sm text-earth-300 mt-1">
              Explora las tres fuerzas principales para desbloquear las capacidades transversales que emergen en la corriente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.threeForces.map((force: any) => {
              const isActive = force.id === activeForceId;
              const isDiscovered = exploredForces.includes(force.id);

              return (
                <button
                  key={force.id}
                  type="button"
                  onClick={() => handleSelectForce(force.id)}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 ${
                    isActive
                      ? 'bg-forest-900 border-water-400 text-earth-50 shadow-lg ring-1 ring-water-400/50'
                      : isDiscovered
                      ? 'bg-forest-950/70 border-jade-600/40 text-earth-200 hover:border-water-400/60'
                      : 'bg-forest-950/40 border-forest-800 text-earth-300 hover:border-forest-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {getForceIcon(force.id)}
                      <span className={`text-[10px] font-mono ${isDiscovered ? 'text-water-300' : 'text-earth-400'}`}>
                        {isDiscovered ? '✓ Descubierta' : 'Por explorar'}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-earth-50 mb-1">
                      {force.title}
                    </h3>
                    <p className="text-xs text-earth-300 line-clamp-2">
                      {force.shortIdea}
                    </p>
                  </div>
                  <span className="text-xs text-water-400 font-mono mt-4 block">
                    Examinar fuerza →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel de detalle de la fuerza activa: Superficie Editorial Pergamino de Alto Contraste con Borde de Papiro */}
          {activeForce && (
            <div className="border-burnt-papyrus p-6 md:p-8 rounded-2xl text-parchment-ink shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-300/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-forest-900 text-water-300">
                    {getForceIcon(activeForce.id)}
                  </div>
                  <span className="font-serif font-bold text-xl text-parchment-ink">
                    {activeForce.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-800 font-semibold uppercase tracking-wider">
                  {activeForce.copyBrief}
                </span>
              </div>

              <p className="text-sm sm:text-base text-parchment-muted font-sans leading-relaxed">
                {activeForce.description}
              </p>

              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-parchment-ink font-bold">
                  Aportes clave al Método Plural:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  {activeForce.points.map((pt: string, idx: number) => (
                    <li key={idx} className="p-3 rounded-lg bg-parchment-200/70 border border-parchment-300 text-parchment-ink flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-parchment-200/90 border border-parchment-300 text-xs sm:text-sm text-parchment-ink">
                <strong className="font-mono text-emerald-900 block mb-1">Distinción fundamental:</strong>
                <p>{activeForce.distinction}</p>
              </div>
            </div>
          )}
        </section>

        {/* SECCIÓN 2: Desbloqueo de Capacidades Adicionales */}
        {allThreeForcesDiscovered && (
          <section aria-labelledby="additional-capacities-title" className="space-y-6 pt-6 border-t border-forest-800 animate-in fade-in duration-500">
            <div className="p-5 rounded-2xl bg-forest-900/90 border border-jade-600/50 shadow-md">
              <span className="text-xs font-mono uppercase tracking-widest text-water-300 block mb-1">
                Desbloqueo de Corriente
              </span>
              <p className="text-base sm:text-lg font-serif italic text-earth-100">
                {formatQuotation(content.unlockNotice, explorerName)}
              </p>
            </div>

            <div>
              <h2 id="additional-capacities-title" className="text-2xl font-serif font-bold text-earth-50">
                Capacidades Adicionales
              </h2>
              <p className="text-xs sm:text-sm text-earth-300 mt-1">
                Selecciona cada capacidad para profundizar en su lógica experiencial.
              </p>
            </div>

            <div className="space-y-3">
              {content.additionalCapacities.map((cap: any) => {
                const isOpen = expandedCapacityId === cap.id;
                const isCapExplored =
                  exploredCapacities.includes(cap.id) ||
                  (progress.discoveredItems || []).includes(`t2:capacity:${cap.id}`);

                return (
                  <div
                    key={cap.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'bg-forest-950 border-water-400/60 shadow-md ring-1 ring-water-400/30'
                        : 'bg-forest-950/60 border-forest-800 hover:border-forest-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCapacity(cap.id)}
                      aria-expanded={isOpen}
                      className="w-full p-5 text-left flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 group"
                    >
                      <div>
                        <div className="flex items-center gap-2.5">
                          <Lightbulb
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isCapExplored
                                ? 'text-solar-400 fill-solar-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                                : 'text-earth-600 group-hover:text-earth-400'
                            }`}
                            aria-label={isCapExplored ? 'Capacidad desplegada' : 'Sin desplegar'}
                          />
                          <h3 className="font-serif font-bold text-earth-100 text-base">
                            {cap.title}
                          </h3>
                        </div>
                        <p className="text-xs text-water-300 mt-1 font-serif italic pl-6.5">
                          {cap.copyBrief}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-earth-400 transition-transform duration-300 shrink-0 mt-1 ${
                          isOpen ? 'rotate-180 text-water-400' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-forest-800/60 space-y-4 text-xs sm:text-sm text-earth-200 animate-in fade-in duration-300">
                        {cap.body && <p className="leading-relaxed">{cap.body}</p>}

                        {cap.dimensions && (
                          <div className="space-y-2 pt-2">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-water-300 block">
                              Dimensiones de la arquitectura motivacional:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {cap.dimensions.map((dim: any, idx: number) => (
                                <div key={idx} className="p-3 rounded-lg bg-forest-900/60 border border-forest-800">
                                  <span className="font-serif font-semibold text-earth-100 block mb-0.5">
                                    {dim.name}
                                  </span>
                                  <span className="text-xs text-earth-300 leading-snug">
                                    {dim.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECCIÓN 3: El cambio cambia de escala */}
        {allThreeForcesDiscovered && (
          <section aria-labelledby="change-scale-title" className="space-y-6 pt-6 border-t border-forest-800 animate-in fade-in duration-500">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
                Perspectiva Sistémica
              </span>
              <h2 id="change-scale-title" className="text-2xl font-serif font-bold text-earth-50 mt-1">
                {content.changeScales.title}
              </h2>
              <p className="text-xs sm:text-sm text-earth-200 mt-2 font-serif italic p-3 rounded-xl bg-forest-900/60 border border-forest-800">
                {formatQuotation(content.changeScales.copyIntegrator, explorerName)}
              </p>
            </div>

            {/* 4 Tarjetas en fila con animación de volteo 3D (flip card) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.changeScales.layers.map((layer: any, idx: number) => {
                const scaleKey = layer.name
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');
                const isDiscovered =
                  exploredScales.includes(scaleKey) ||
                  (progress.discoveredItems || []).includes(`t2:scale:${scaleKey}`);
                const isFlipped = Boolean(flippedScales[scaleKey]);

                return (
                  <div key={idx} className="flip-card-container h-80 w-full">
                    <div
                      className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}
                      onClick={() => toggleScaleFlip(scaleKey)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleScaleFlip(scaleKey);
                        }
                      }}
                      aria-label={`Escala 0${idx + 1}: ${layer.name}. Haz clic para voltear la tarjeta.`}
                    >
                      {/* CARA FRONTAL: Sólo 01 - Persona, etc. */}
                      <div className="flip-card-front p-6 bg-forest-950/90 border border-forest-800 hover:border-water-400/60 shadow-xl flex flex-col justify-between items-center text-center transition-all cursor-pointer group select-none">
                        <div className="w-full flex items-center justify-between text-xs font-mono">
                          <span className="text-water-400 font-bold tracking-widest">
                            0{idx + 1}
                          </span>
                          {isDiscovered ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-jade-400 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>En bitácora</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-earth-500 font-mono">Por explorar</span>
                          )}
                        </div>

                        <div className="my-auto space-y-3">
                          <div className="w-12 h-12 mx-auto rounded-full bg-forest-900 border border-forest-700/80 flex items-center justify-center text-solar-400 group-hover:border-solar-400/80 transition-colors shadow-inner">
                            <Layers className="w-5 h-5" />
                          </div>
                          <h3 className="font-serif font-bold text-lg text-earth-50 leading-snug">
                            0{idx + 1} — {layer.name}
                          </h3>
                        </div>

                        <div className="w-full pt-3 border-t border-forest-800/80 flex items-center justify-center gap-1.5 text-xs font-mono text-water-300 group-hover:text-water-200">
                          <span>Explorar escala</span>
                          <span className="text-sm">↻</span>
                        </div>
                      </div>

                      {/* CARA TRASERA: Revela el texto y la pregunta de la escala */}
                      <div className="flip-card-back p-5 bg-forest-900 border border-jade-500/70 shadow-2xl flex flex-col justify-between text-left cursor-pointer overflow-y-auto select-none">
                        <div className="flex items-center justify-between border-b border-forest-800 pb-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-water-300 font-bold">
                            0{idx + 1} — {layer.name}
                          </span>
                          <span className="text-[10px] font-mono text-solar-400 hover:underline flex items-center gap-0.5">
                            <span>Volver</span>
                            <span>↺</span>
                          </span>
                        </div>

                        <div className="my-2 space-y-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-earth-400 block">
                            Foco experiencial:
                          </span>
                          <p className="text-xs text-earth-200 leading-relaxed font-sans">
                            {layer.focus}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-forest-800 text-xs font-serif italic text-solar-300 bg-forest-950/70 p-2.5 rounded-lg">
                          {formatQuotation(layer.question, explorerName)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Conclusión e integración a la Bitácora */}
        {isCompleted && (
          <InteractionConclusion
            title="Fuerzas y Capacidades Registradas en la Bitácora"
            copy={data.conclusionCopy}
          />
        )}

        {/* Navegación según el estado de la otra corriente */}
        <nav
          aria-label="Navegación tras el Territorio 2"
          className="mt-12 pt-8 border-t border-forest-800 space-y-6"
        >
          <div className="p-6 rounded-2xl bg-forest-900/70 border border-forest-700/60 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-water-300">
              Estado de la Corriente
            </span>

            {!isCompleted ? (
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-earth-50">
                  Corriente en exploración
                </h3>
                <p className="text-sm text-earth-200">
                  {explorerName ? `${explorerName}, explora ` : 'Explora '}las 3 fuerzas principales ({exploredForces.length}/3) para completar este territorio.
                </p>
              </div>
            ) : !isTerritory3Completed ? (
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-earth-50">
                  {explorerName ? `¡Bien navegado, ${explorerName}! Ya conocemos las fuerzas que esta capacidad puede movilizar.` : 'Ya conocemos las fuerzas que esta capacidad puede movilizar.'}
                </h3>
                <p className="text-sm text-earth-200">
                  Crucemos hacia la otra corriente y descubramos de qué está hecho un sistema gameful.
                </p>
                <div className="pt-2">
                  <Link
                    href="/territorios/territorio-3"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-400 text-white font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-md"
                  >
                    <span>Explorar qué permite diseñar (Territorio 3)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-earth-50">
                  {explorerName ? `Las dos corrientes están completas, ${explorerName}.` : 'Las dos corrientes están completas.'}
                </h3>
                <p className="text-sm text-earth-200">
                  Es momento de observar dónde vuelven a encontrarse: dentro del Método Plural.
                </p>
                <div className="pt-2">
                  <Link
                    href="/territorios/territorio-4"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-solar-500 hover:bg-solar-400 text-forest-950 font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-md"
                  >
                    <span>Avanzar hacia la confluencia (Territorio 4)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-900 hover:bg-forest-850 text-earth-200 text-xs font-medium border border-forest-700 transition-colors"
            >
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Volver al río</span>
            </Link>
          </div>
        </nav>
      </article>
    </div>
  );
}
