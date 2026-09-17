'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
import {
  Compass,
  CheckCircle2,
  Table,
  Check,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  HelpCircle,
} from 'lucide-react';

export function Territory4View() {
  const data = TERRITORIES_DATA['territorio-4'];
  const content = data.specificContent;
  const { progress, saveTerritoryProgress, registerDiscoveredItems } = useProgression();

  const isAlreadyCompleted = progress.territoryStatus['territorio-4'] === 'completed';

  // Paso 1: Construcción de la tabla (revelación de fases)
  const [revealedPhasesCount, setRevealedPhasesCount] = useState<number>(
    isAlreadyCompleted ? content.tableRows.length : 1
  );

  // Fase seleccionada para ver su desglose profundo
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(0);

  // Paso 2: Cuatro espacios explorados
  const [activeSpaceId, setActiveSpaceId] = useState<string>('space-already-does');
  const [exploredSpaces, setExploredSpaces] = useState<string[]>(
    isAlreadyCompleted ? content.fourSpaces.map((s: any) => s.id) : ['space-already-does']
  );

  // Registrar fase inicial y espacio inicial al montar
  React.useEffect(() => {
    registerDiscoveredItems(['t4:phase:0', 't4:space:space-already-does']);
  }, [registerDiscoveredItems]);

  const handleRevealNextPhase = async () => {
    const nextCount = revealedPhasesCount + 1;
    setRevealedPhasesCount(nextCount);
    if (nextCount <= content.tableRows.length) {
      await registerDiscoveredItems(`t4:phase:${nextCount - 1}`);
    }

    // Progreso esencial: toda la tabla construida Y al menos 3 espacios examinados
    if (nextCount >= content.tableRows.length) {
      if (exploredSpaces.length >= 3 && !isAlreadyCompleted) {
        await saveTerritoryProgress(
          'territorio-4',
          'completed',
          { revealedPhasesCount: nextCount, exploredSpaces },
          data.journalPhrase
        );
      }
    }
  };

  const handleSelectSpace = async (spaceId: string) => {
    setActiveSpaceId(spaceId);
    const nextExplored = Array.from(new Set([...exploredSpaces, spaceId]));
    setExploredSpaces(nextExplored);
    await registerDiscoveredItems(`t4:space:${spaceId}`);

    // Progreso esencial: toda la tabla construida Y al menos 3 espacios examinados
    if (revealedPhasesCount >= content.tableRows.length && nextExplored.length >= 3 && !isAlreadyCompleted) {
      await saveTerritoryProgress(
        'territorio-4',
        'completed',
        { revealedPhasesCount, exploredSpaces: nextExplored },
        data.journalPhrase
      );
    }
  };

  const tableBuilt = revealedPhasesCount >= content.tableRows.length || isAlreadyCompleted;
  const isCompleted = isAlreadyCompleted || (tableBuilt && exploredSpaces.length >= 3);

  // Registrar marcos secundarios y ejemplo VBG cuando se revela la tabla
  React.useEffect(() => {
    if (tableBuilt) {
      registerDiscoveredItems(['t4:framework:ics-frame', 't4:example:vbg']);
    }
  }, [tableBuilt, registerDiscoveredItems]);

  const activeSpace = content.fourSpaces.find((s: any) => s.id === activeSpaceId) || content.fourSpaces[0];
  const selectedPhase = content.tableRows[selectedPhaseIndex] || content.tableRows[0];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Cabecera del Territorio */}
      <header className="space-y-4 border-b border-canopy-800 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-river-400">
            <Compass className="w-4 h-4 text-editorial-accent" />
            <span>Territorio 4 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
          </div>
          <span className="text-xs font-mono text-earth-300">
            {data.functionStatement}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-earth-50 tracking-tight leading-tight">
          {data.narrativeTitle}
        </h1>

        <div className="p-4 rounded-xl bg-canopy-900/80 border-l-4 border-editorial-accent text-earth-100">
          <span className="block text-xs font-mono uppercase tracking-wider text-river-300 mb-1">
            Pregunta Funcional:
          </span>
          <p className="text-lg md:text-xl font-serif italic text-earth-100">
            “{data.functionalQuestion}”
          </p>
        </div>

        <p className="text-base sm:text-lg text-earth-200 font-sans leading-relaxed pt-2">
          {data.opening}
        </p>
      </header>

      {/* SECCIÓN 1: Construcción de la Tabla de Integración */}
      <section aria-labelledby="integration-table-title" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Matriz Metodológica
            </span>
            <h2 id="integration-table-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
              Tabla de integración: Método Plural × Gameful Lens
            </h2>
          </div>
          <span className="text-xs font-mono text-earth-300">
            {revealedPhasesCount} de {content.tableRows.length} momentos articulados
          </span>
        </div>

        <p className="text-sm text-earth-300">
          Articula progresivamente cómo la mirada gameful expande cada momento del método sin añadir una etapa ajena.
        </p>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto rounded-xl border border-canopy-700 bg-canopy-950/80">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-canopy-900 border-b border-canopy-800 text-earth-300 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-4 w-1/4">Momento del Método</th>
                <th className="p-4 w-3/8">Lo que Plural ya hace</th>
                <th className="p-4 w-3/8 text-river-300">Lo que la mirada gameful amplía</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canopy-800">
              {content.tableRows.map((row: any, idx: number) => {
                const isVisible = idx < revealedPhasesCount;
                const isSelected = selectedPhaseIndex === idx;

                return (
                  <tr
                    key={row.phase}
                    onClick={() => isVisible && setSelectedPhaseIndex(idx)}
                    className={`transition-all ${
                      isVisible
                        ? isSelected
                          ? 'bg-river-950/90 text-earth-50 cursor-pointer'
                          : 'bg-canopy-950/40 text-earth-200 hover:bg-canopy-900/50 cursor-pointer'
                        : 'bg-canopy-950/20 text-earth-400/40 opacity-40 select-none'
                    }`}
                  >
                    <td className="p-4 font-serif font-semibold border-r border-canopy-800/80">
                      <div className="flex items-center gap-2">
                        {isVisible && <Check className="w-4 h-4 text-river-400 shrink-0" />}
                        <span>{row.phase}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r border-canopy-800/80">
                      {isVisible ? row.pluralCore : '••••••••••••••••••••••••••••••••••••'}
                    </td>
                    <td className="p-4 text-river-200">
                      {isVisible ? row.gamefulLens : '••••••••••••••••••••••••••••••••••••'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {revealedPhasesCount < content.tableRows.length && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleRevealNextPhase}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-river-700 hover:bg-river-600 text-white font-medium text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              <Sparkles className="w-4 h-4" />
              <span>Articular siguiente momento ({revealedPhasesCount + 1} de {content.tableRows.length})</span>
            </button>
          </div>
        )}

        {/* Panel de profundización por momento seleccionado */}
        {tableBuilt && selectedPhase && (
          <div className="p-6 md:p-8 rounded-2xl bg-canopy-950 border border-river-700/60 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-canopy-800 pb-3">
              <span className="font-serif font-bold text-lg text-earth-50">
                Momento: {selectedPhase.phase}
              </span>
              <span className="text-xs font-mono text-river-300">
                Profundización metodológica
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-canopy-900/50 border border-canopy-800 space-y-1.5">
                <span className="text-xs font-mono uppercase text-editorial-accent font-semibold block">
                  Donde existe alineación
                </span>
                <p className="text-earth-200 leading-relaxed">{selectedPhase.alignment}</p>
              </div>

              <div className="p-4 rounded-xl bg-river-950/60 border border-river-700/50 space-y-1.5">
                <span className="text-xs font-mono uppercase text-river-300 font-semibold block">
                  Lo que puede agregarse
                </span>
                <p className="text-earth-200 leading-relaxed">{selectedPhase.addedValue}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-canopy-800 flex items-center gap-2 text-xs sm:text-sm font-serif italic text-editorial-gold">
              <HelpCircle className="w-4 h-4 text-editorial-gold shrink-0" />
              <span>Pregunta orientadora: “{selectedPhase.guidingQuestion}”</span>
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: Cuatro Espacios de Análisis */}
      {tableBuilt && (
        <section aria-labelledby="four-spaces-title" className="space-y-6 pt-6 border-t border-canopy-800 animate-in fade-in duration-500">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Análisis Crítico
            </span>
            <h2 id="four-spaces-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
              Cuatro espacios de análisis
            </h2>
            <p className="text-sm text-earth-300 mt-1">
              Distingue con rigor el terreno ya propio de Plural, la compatibilidad compartida, la nueva capacidad y los límites innegociables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {content.fourSpaces.map((space: any) => {
              const isActive = space.id === activeSpaceId;
              const isExplored = exploredSpaces.includes(space.id);

              return (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => handleSelectSpace(space.id)}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                    isActive
                      ? 'bg-river-900 border-river-400 text-earth-50 ring-1 ring-river-400'
                      : isExplored
                      ? 'bg-canopy-900/60 border-canopy-700 text-earth-200 hover:border-river-500'
                      : 'bg-canopy-950/40 border-canopy-800 text-earth-300 hover:border-canopy-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-river-300 uppercase">
                      {isExplored ? '✓ Examinado' : 'Por examinar'}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base leading-snug">
                      {space.title}
                    </h3>
                  </div>
                  <span className="text-[11px] text-earth-400 font-mono mt-3 block">
                    Ver espacio →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel de detalle del espacio activo */}
          {activeSpace && (
            <div className="p-6 md:p-8 rounded-2xl bg-canopy-950/90 border border-canopy-700 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-canopy-800 pb-3">
                <h3 className="font-serif font-bold text-lg text-earth-50">
                  {activeSpace.title}
                </h3>
                <span className="text-xs font-serif italic text-editorial-gold">
                  “{activeSpace.copyBrief}”
                </span>
              </div>

              <p className="text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
                {activeSpace.content}
              </p>
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN 3: Capas secundarias (Marcos & Ejemplo VBG) */}
      {tableBuilt && (
        <section aria-labelledby="secondary-layers-title" className="space-y-6 pt-6 border-t border-canopy-800 animate-in fade-in duration-500">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Profundización Secundaria
            </span>
            <h2 id="secondary-layers-title" className="text-xl sm:text-2xl font-serif font-bold text-earth-50 mt-1">
              Marcos de análisis y pista situada en Plural
            </h2>
          </div>

          {/* Tres marcos: i-frame, c-frame, s-frame */}
          <div className="p-6 rounded-2xl bg-canopy-950/70 border border-canopy-800 space-y-4">
            <h3 className="font-serif font-bold text-base sm:text-lg text-earth-100">
              {content.frameworksSecondary.title}
            </h3>
            <p className="text-xs text-earth-300 italic">
              {content.frameworksSecondary.clarification}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {content.frameworksSecondary.frames.map((frame: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-canopy-900/50 border border-canopy-800 space-y-1">
                  <span className="font-serif font-semibold text-earth-100 text-xs sm:text-sm block">
                    {frame.name}
                  </span>
                  <p className="text-xs text-earth-300 leading-relaxed font-sans">
                    {frame.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-canopy-900 border border-canopy-800/80 text-xs text-earth-200">
              <strong>Integración:</strong> {content.frameworksSecondary.integration}
            </div>
          </div>

          {/* Ejemplo VBG */}
          <div className="p-6 rounded-2xl bg-canopy-950/70 border border-river-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-earth-100">
                {content.vbgExample.title}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-river-950 text-river-300 border border-river-700">
                Ejemplo situado
              </span>
            </div>
            <p className="text-xs font-mono text-editorial-accent">
              {content.vbgExample.notice}
            </p>
            <p className="text-xs sm:text-sm text-earth-200 font-sans leading-relaxed">
              {content.vbgExample.body}
            </p>
          </div>
        </section>
      )}

      {/* Conclusión e integración a la Bitácora */}
      {isCompleted && (
        <InteractionConclusion
          title="Confluencia Registrada en la Bitácora"
          copy={data.conclusionCopy}
        />
      )}

      {/* Navegación y Transición hacia T5 */}
      <nav
        aria-label="Navegación tras el Territorio 4"
        className="mt-12 pt-8 border-t border-canopy-800 space-y-6"
      >
        <div className="p-6 rounded-2xl bg-canopy-900/60 border border-canopy-700/60 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
            Hacia el Delta
          </span>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-earth-50">
            La integración es posible. No necesitamos comenzar diseñándolo todo.
          </h3>
          <p className="text-sm text-earth-200">
            El río se abre ahora hacia tres maneras concretas de empezar.
          </p>

          <div className="pt-2">
            <Link
              href="/territorios/territorio-5"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              <span>Avanzar al Territorio 5: ¿Dónde comenzamos?</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-canopy-900 hover:bg-canopy-800 text-earth-200 text-xs font-medium border border-canopy-700 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Volver al río</span>
          </Link>
        </div>
      </nav>
    </article>
  );
}
