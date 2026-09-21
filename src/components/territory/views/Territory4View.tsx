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
  Table,
  Check,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  HelpCircle,
  AlertOctagon,
} from 'lucide-react';

const PHASE_DECISIONS = [
  {
    phaseIndex: 0,
    phaseName: 'Alistar',
    question: 'En la fase Alistar, ¿cuál es el propósito de integrar la perspectiva gameful?',
    options: [
      {
        id: 'distractor',
        text: 'Definir recompensas y puntos de inmediato para motivar al equipo desde el día uno.',
        isCorrect: false,
        feedback: 'No es momento de diseñar premios; primero se deben acordar preguntas rectoras, ética y alcances del sistema.',
      },
      {
        id: 'correct',
        text: 'Alinear el propósito del proyecto, acuerdos éticos y condiciones para un diseño motivacional significativo.',
        isCorrect: true,
        feedback: '¡Correcto! Alistar sienta las bases éticas y de alineación antes de cualquier mecánica o intervención.',
      },
    ],
  },
  {
    phaseIndex: 1,
    phaseName: 'Investigar y empatizar',
    question: 'Durante Investigar y empatizar, ¿qué buscamos capturar con esta lente?',
    options: [
      {
        id: 'distractor',
        text: 'Asumir que a todas las personas les motiva competir y rankear sus resultados.',
        isCorrect: false,
        feedback: 'La lente gameful no sustituye la investigación profunda; investiga motivaciones, fricciones y vivencias reales.',
      },
      {
        id: 'correct',
        text: 'Mapear la experiencia real, fuentes diversas de motivación, puntos de fricción y agencia disponible.',
        isCorrect: true,
        feedback: 'Exacto: Permite comprender dónde existe o falta agencia y qué tensiones reales enfrentan las personas.',
      },
    ],
  },
  {
    phaseIndex: 2,
    phaseName: 'Diseñar y prototipar',
    question: 'En Diseñar y prototipar, ¿cómo se transforman las ayudas encontradas?',
    options: [
      {
        id: 'correct',
        text: 'Transformar las ayudas en una arquitectura con reglas, roles, decisiones, retos, feedback y progresión.',
        isCorrect: true,
        feedback: 'Muy bien: Las ayudas dejan de ser indicaciones pasivas y se convierten en un sistema vivo que puede recorrerse.',
      },
      {
        id: 'distractor',
        text: 'Incorporar niveles y puntos sobre las actividades existentes sin alterar su estructura.',
        isCorrect: false,
        feedback: 'Poner puntos sobre una mala experiencia solo hace más visible su deficiencia. Se requiere reestructurar la interacción.',
      },
    ],
  },
  {
    phaseIndex: 3,
    phaseName: 'Pilotear y evaluar',
    question: 'Al Pilotear y evaluar, ¿qué evidencia clave aporta la interacción?',
    options: [
      {
        id: 'distractor',
        text: 'Medir únicamente el tiempo de permanencia y declarar éxito si la retención es alta.',
        isCorrect: false,
        feedback: 'El tiempo de uso no equivale a transformación. Una persona puede permanecer enganchada sin aprender ni cambiar.',
      },
      {
        id: 'correct',
        text: 'Capturar evidencia dentro de la interacción (decisiones, rutas, abandonos) para calibrar la experiencia.',
        isCorrect: true,
        feedback: 'Correcto: Observar cómo deciden, dónde piden ayuda y qué estrategias prueban complementa la evaluación de impacto.',
      },
    ],
  },
  {
    phaseIndex: 4,
    phaseName: 'Implementar, monitorear y comunicar',
    question: 'En Implementar, monitorear y comunicar, ¿cuál es el rol de un sistema gameful?',
    options: [
      {
        id: 'correct',
        text: 'Aumentar fidelidad de la experiencia, sostener ciclos de participación y convertirla en una capacidad replicable.',
        isCorrect: true,
        feedback: 'Excelente: Codificar la experiencia permite que mantenga su potencia y significado en múltiples implementaciones.',
      },
      {
        id: 'distractor',
        text: 'Automatizar todo el proceso mediante una aplicación móvil para prescindir del equipo facilitador.',
        isCorrect: false,
        feedback: 'La tecnología o el formato no garantizan fidelidad ni impacto; la clave es la consistencia del sistema motivacional.',
      },
    ],
  },
];

export function Territory4View() {
  const data = TERRITORIES_DATA['territorio-4'];
  const content = data.specificContent;
  const { progress, saveTerritoryProgress, registerDiscoveredItems, trackInteraction, explorerName } = useProgression();
  const { getTerritoryBg } = useVisualSet();

  const isAlreadyCompleted = progress.territoryStatus['territorio-4'] === 'completed';
  const t4Interactions = progress.territoryInteractions['territorio-4'] || {};

  // Paso 1: Construcción de la tabla (Honest State Restoration: sin atribución ficticia)
  const initialRevealedPhasesCount = typeof t4Interactions.revealedPhasesCount === 'number'
    ? t4Interactions.revealedPhasesCount
    : 0;

  const [revealedPhasesCount, setRevealedPhasesCount] = useState<number>(initialRevealedPhasesCount);
  const revealedPhasesCountRef = useRef<number>(initialRevealedPhasesCount);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(0);
  const [selectedDecisionOption, setSelectedDecisionOption] = useState<string | null>(null);
  const [decisionFeedback, setDecisionFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Paso 2: Cuatro espacios explorados (Honest State Restoration)
  const initialExploredSpaces = t4Interactions.exploredSpaces && t4Interactions.exploredSpaces.length > 0
    ? t4Interactions.exploredSpaces
    : [];

  // El detalle de los espacios debe estar oculto de entrada, solo aparece al hacer clic en alguno
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [exploredSpaces, setExploredSpaces] = useState<string[]>(initialExploredSpaces);
  const exploredSpacesRef = useRef<string[]>(initialExploredSpaces);

  // Paso 3: Profundizaciones secundarias
  const [exploredFramework, setExploredFramework] = useState<boolean>(
    t4Interactions.exploredFramework || progress.discoveredItems.includes('t4:framework:ics-frame')
  );
  const [exploredExample, setExploredExample] = useState<boolean>(
    t4Interactions.exploredExample || progress.discoveredItems.includes('t4:example:vbg')
  );

  useEffect(() => {
    if (typeof t4Interactions.revealedPhasesCount === 'number') {
      revealedPhasesCountRef.current = t4Interactions.revealedPhasesCount;
      setRevealedPhasesCount(t4Interactions.revealedPhasesCount);
    }
    if (t4Interactions.exploredSpaces && t4Interactions.exploredSpaces.length > 0) {
      exploredSpacesRef.current = t4Interactions.exploredSpaces;
      setExploredSpaces(t4Interactions.exploredSpaces);
    }
  }, [t4Interactions.revealedPhasesCount, t4Interactions.exploredSpaces]);

  const currentDecision = revealedPhasesCount < PHASE_DECISIONS.length
    ? PHASE_DECISIONS[revealedPhasesCount]
    : null;

  const handleSelectDecision = async (option: { id: string; text: string; isCorrect: boolean; feedback: string }) => {
    setSelectedDecisionOption(option.id);
    setDecisionFeedback({ text: option.feedback, isCorrect: option.isCorrect });

    if (option.isCorrect && currentDecision) {
      const nextCount = revealedPhasesCountRef.current + 1;
      revealedPhasesCountRef.current = nextCount;
      setRevealedPhasesCount(nextCount);
      setSelectedPhaseIndex(currentDecision.phaseIndex);
      await registerDiscoveredItems(`t4:phase:${currentDecision.phaseIndex}`);
      await trackInteraction({
        eventName: 'matrix_phase_articulated',
        territoryId: 'territorio-4',
        targetId: String(currentDecision.phaseIndex),
      });

      const isNowComplete = nextCount >= content.tableRows.length && exploredSpacesRef.current.length >= 3;
      await saveTerritoryProgress(
        'territorio-4',
        isNowComplete || isAlreadyCompleted ? 'completed' : 'visited',
        {
          ...t4Interactions,
          revealedPhasesCount: nextCount,
          exploredSpaces: exploredSpacesRef.current,
        },
        isNowComplete ? data.journalPhrase : undefined
      );

      if (isNowComplete && !isAlreadyCompleted) {
        await trackInteraction({
          eventName: 'territory_completed',
          territoryId: 'territorio-4',
        });
      }

      // Reset selection state for next phase
      setTimeout(() => {
        setSelectedDecisionOption(null);
        setDecisionFeedback(null);
      }, 2500);
    }
  };

  const handleSelectSpace = async (spaceId: string) => {
    setActiveSpaceId(spaceId);
    const nextExplored = Array.from(new Set([...exploredSpacesRef.current, spaceId]));
    exploredSpacesRef.current = nextExplored;
    setExploredSpaces(nextExplored);
    await registerDiscoveredItems(`t4:space:${spaceId}`);
    await trackInteraction({
      eventName: 'analysis_space_examined',
      territoryId: 'territorio-4',
      targetId: spaceId,
    });

    const isNowComplete = revealedPhasesCountRef.current >= content.tableRows.length && nextExplored.length >= 3;
    await saveTerritoryProgress(
      'territorio-4',
      isNowComplete || isAlreadyCompleted ? 'completed' : 'visited',
      {
        ...t4Interactions,
        revealedPhasesCount: revealedPhasesCountRef.current,
        exploredSpaces: nextExplored,
        activeSpaceId: spaceId,
      },
      isNowComplete ? data.journalPhrase : undefined
    );

    if (isNowComplete && !isAlreadyCompleted) {
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-4',
      });
    }
  };

  const handleExploreFramework = async () => {
    setExploredFramework(true);
    await registerDiscoveredItems('t4:framework:ics-frame');
    await trackInteraction({
      eventName: 'framework_explored',
      territoryId: 'territorio-4',
    });
    const isNowComplete = revealedPhasesCountRef.current >= content.tableRows.length && exploredSpacesRef.current.length >= 3;
    await saveTerritoryProgress(
      'territorio-4',
      isCompleted ? 'completed' : 'visited',
      {
        ...t4Interactions,
        revealedPhasesCount: revealedPhasesCountRef.current,
        exploredSpaces: exploredSpacesRef.current,
        exploredFramework: true,
      }
    );
  };

  const handleExploreExample = async () => {
    setExploredExample(true);
    await registerDiscoveredItems('t4:example:vbg');
    await trackInteraction({
      eventName: 'example_vbg_explored',
      territoryId: 'territorio-4',
    });
    const isNowComplete = revealedPhasesCountRef.current >= content.tableRows.length && exploredSpacesRef.current.length >= 3;
    await saveTerritoryProgress(
      'territorio-4',
      isCompleted ? 'completed' : 'visited',
      {
        ...t4Interactions,
        revealedPhasesCount: revealedPhasesCountRef.current,
        exploredSpaces: exploredSpacesRef.current,
        exploredExample: true,
      }
    );
  };

  const tableBuilt = revealedPhasesCount >= content.tableRows.length || revealedPhasesCountRef.current >= content.tableRows.length;
  const isEssentialComplete = tableBuilt && (exploredSpaces.length >= 3 || exploredSpacesRef.current.length >= 3);
  const isCompleted = isAlreadyCompleted || isEssentialComplete;

  const activeSpace = activeSpaceId
    ? content.fourSpaces.find((s: any) => s.id === activeSpaceId) || null
    : null;
  const selectedPhase = content.tableRows[selectedPhaseIndex] || content.tableRows[0];

  const bgUrl = getTerritoryBg('territorio-4');
  const t4DiscoveredCount = (progress.discoveredItems || []).filter((id) => id.startsWith('t4:')).length;

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
        territoryId="territorio-4"
        territoryTitle="Territorio 4: Confluencia y Método Plural"
        essentialTitle="Hitos Esenciales de Navegación"
        essentialItems={[
          {
            id: 'table',
            label: `Articular los 5 momentos de integración en la tabla (${revealedPhasesCount}/5 articulados)`,
            isDone: revealedPhasesCount >= 5,
          },
          {
            id: 'spaces',
            label: `Examinar al menos 3 espacios de análisis crítico (${exploredSpaces.length}/3 examinados)`,
            isDone: exploredSpaces.length >= 3,
          },
        ]}
        isEssentialComplete={isEssentialComplete}
        discoveryItemsCount={t4DiscoveredCount}
        discoveryTotalCount={11}
        discoveryPercent={progress.territoryDiscoveryPercent['territorio-4'] || 0}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-12">
        {/* Cabecera del Territorio */}
        <header className="space-y-4 border-b border-forest-800 pb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-water-300">
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Territorio 4 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
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

        {isAlreadyCompleted && (!tableBuilt || exploredSpaces.length < 3) && (
          <div className="p-4 rounded-xl bg-forest-950/80 border border-solar-500/40 text-earth-200 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 text-solar-400 font-mono uppercase font-bold text-xs">
              <AlertOctagon className="w-4 h-4" />
              <span>Hito disponible para re-exploración</span>
            </div>
            <p>
              Este territorio figura como completado en tu travesía previa, pero los 5 momentos metodológicos o los espacios de análisis no cuentan con interacción documentada en este dispositivo. Puedes articular la matriz activamente para registrar sus conceptos en la bitácora sin reiniciar tu avance general.
            </p>
          </div>
        )}

        {/* SECCIÓN 1: Construcción de la Tabla de Integración */}
        <section aria-labelledby="integration-table-title" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
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
          <div className="overflow-x-auto rounded-xl border border-jade-600/40 bg-forest-950/85 backdrop-blur-sm shadow-lg">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-forest-900 border-b border-forest-800 text-earth-300 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 w-1/4">Momento del Método</th>
                  <th className="p-4 w-3/8">Lo que Plural ya hace</th>
                  <th className="p-4 w-3/8 text-water-300">Lo que la mirada gameful amplía</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-800">
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
                            ? 'bg-forest-900/90 text-earth-50 cursor-pointer border-l-4 border-solar-400'
                            : 'bg-forest-950/40 text-earth-200 hover:bg-forest-900/50 cursor-pointer'
                          : 'bg-forest-950/20 text-earth-400/40 opacity-40 select-none'
                      }`}
                    >
                      <td className="p-4 font-serif font-semibold border-r border-forest-800/80">
                        <div className="flex items-center gap-2">
                          {isVisible && <Check className="w-4 h-4 text-water-400 shrink-0" />}
                          <span>{row.phase}</span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-forest-800/80">
                        {isVisible ? row.pluralCore : '••••••••••••••••••••••••••••••••••••'}
                      </td>
                      <td className="p-4 text-water-200">
                        {isVisible ? row.gamefulLens : '••••••••••••••••••••••••••••••••••••'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {currentDecision && (
            <div className="p-6 rounded-2xl bg-forest-900/90 border border-jade-600/50 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-water-300 font-semibold">
                  Articulación Activa: Momento {currentDecision.phaseIndex + 1} de {content.tableRows.length} ({currentDecision.phaseName})
                </span>
                <span className="text-xs font-mono text-solar-400">
                  Paso metodológico
                </span>
              </div>

              <h3 className="font-serif font-bold text-base sm:text-lg text-earth-50">
                {currentDecision.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {currentDecision.options.map((opt) => {
                  const isSelected = selectedDecisionOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectDecision(opt)}
                      className={`p-4 rounded-xl text-left border transition-all text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-1 ring-emerald-400'
                            : 'bg-amber-950/80 border-amber-500 text-amber-100 ring-1 ring-amber-400'
                          : 'bg-forest-950/70 border-forest-800 text-earth-200 hover:border-water-400/60 hover:bg-forest-900/60'
                      }`}
                    >
                      <span className="block font-medium">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {decisionFeedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${
                    decisionFeedback.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                      : 'bg-amber-950/80 border-amber-500/80 text-amber-200'
                  }`}
                >
                  <p>{decisionFeedback.text}</p>
                </div>
              )}
            </div>
          )}

          {/* Panel de profundización por momento seleccionado */}
          {tableBuilt && selectedPhase && (
            <div className="p-6 md:p-8 rounded-2xl bg-forest-950/90 border border-jade-600/50 space-y-4 shadow-xl animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-800 pb-3">
                <span className="font-serif font-bold text-lg text-earth-50">
                  Momento: {selectedPhase.phase}
                </span>
                <span className="text-xs font-mono text-water-300">
                  Profundización metodológica
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-forest-900/60 border border-forest-800 space-y-1.5">
                  <span className="text-xs font-mono uppercase text-solar-400 font-semibold block">
                    Donde existe alineación
                  </span>
                  <p className="text-earth-200 leading-relaxed">{selectedPhase.alignment}</p>
                </div>

                <div className="p-4 rounded-xl bg-forest-900/80 border border-jade-600/50 space-y-1.5">
                  <span className="text-xs font-mono uppercase text-water-300 font-semibold block">
                    Lo que puede agregarse
                  </span>
                  <p className="text-earth-200 leading-relaxed">{selectedPhase.addedValue}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-forest-800 flex items-center gap-2 text-xs sm:text-sm font-serif italic text-solar-300">
                <HelpCircle className="w-4 h-4 text-solar-400 shrink-0" />
                <span>Pregunta orientadora: {formatQuotation(selectedPhase.guidingQuestion, explorerName)}</span>
              </div>
            </div>
          )}
        </section>

        {/* SECCIÓN 2: Cuatro Espacios de Análisis */}
        {tableBuilt && (
          <section aria-labelledby="four-spaces-title" className="space-y-6 pt-6 border-t border-forest-800 animate-in fade-in duration-500">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
                Análisis Crítico
              </span>
              <h2 id="four-spaces-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
                Cuatro espacios de análisis
              </h2>
              <p className="text-sm text-earth-300 mt-1">
                Distingue con rigor el terreno ya propio de Plural, la compatibilidad compartida, la nueva capacidad y los límites innegociables. (Mínimo 3 requeridos para el hito)
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
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 ${
                      isActive
                        ? 'bg-forest-900 border-water-400 text-earth-50 shadow-md ring-1 ring-water-400/50'
                        : isExplored
                        ? 'bg-forest-950/70 border-jade-600/40 text-earth-200 hover:border-water-400/60'
                        : 'bg-forest-950/40 border-forest-800 text-earth-300 hover:border-forest-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-water-300 uppercase">
                        {isExplored ? '✓ Examinado' : 'Por examinar'}
                      </span>
                      <h3 className="font-serif font-bold text-sm sm:text-base leading-snug">
                        {space.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-water-400 font-mono mt-3 block">
                      Ver espacio →
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel de detalle del espacio activo: Pergamino de Alto Contraste */}
            {activeSpace && (
              <div className="p-6 md:p-8 rounded-2xl bg-parchment-100 text-parchment-ink border border-parchment-300 shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-300/80 pb-3">
                  <h3 className="font-serif font-bold text-xl text-parchment-ink">
                    {activeSpace.title}
                  </h3>
                  <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-wider">
                    {formatQuotation(activeSpace.copyBrief, explorerName)}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-parchment-muted font-sans leading-relaxed">
                  {activeSpace.content}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Mensaje orientador si faltan espacios para la profundización secundaria */}
        {tableBuilt && (exploredSpaces.length < 4 && exploredSpacesRef.current.length < 4) && (
          <div className="p-4 rounded-xl bg-forest-950/60 border border-forest-800 text-xs text-earth-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-solar-400 shrink-0" />
              <span>
                Examina los <strong>4 espacios de análisis</strong> arriba ({exploredSpaces.length}/4 examinados) para revelar los marcos de profundización secundaria.
              </span>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: Capas secundarias (Marcos & Ejemplo VBG) - Solo visible al examinar los 4 espacios */}
        {tableBuilt && (exploredSpaces.length >= 4 || exploredSpacesRef.current.length >= 4) && (
          <section aria-labelledby="secondary-layers-title" className="space-y-6 pt-6 border-t border-forest-800 animate-in fade-in duration-500">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
                Profundización Secundaria
              </span>
              <h2 id="secondary-layers-title" className="text-xl sm:text-2xl font-serif font-bold text-earth-50 mt-1">
                Marcos de análisis y pista situada en Plural
              </h2>
            </div>

            {/* Tres marcos: i-frame, c-frame, s-frame */}
            <div className="p-6 rounded-2xl bg-forest-950/80 border border-forest-800 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-earth-100">
                  {content.frameworksSecondary.title}
                </h3>
                {!exploredFramework && (
                  <button
                    type="button"
                    onClick={handleExploreFramework}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-water-500 hover:bg-water-400 text-forest-950 font-bold text-xs shadow transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Integrar a bitácora</span>
                  </button>
                )}
                {exploredFramework && (
                  <span className="text-xs font-mono text-water-300">✓ En bitácora</span>
                )}
              </div>
              <p className="text-xs text-earth-300 italic">
                {content.frameworksSecondary.clarification}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {content.frameworksSecondary.frames.map((frame: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-forest-900/60 border border-forest-800 space-y-1">
                    <span className="font-serif font-semibold text-earth-100 text-xs sm:text-sm block">
                      {frame.name}
                    </span>
                    <p className="text-xs text-earth-300 leading-relaxed font-sans">
                      {frame.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-forest-900 border border-forest-800/80 text-xs text-earth-200">
                <strong className="text-solar-300">Integración:</strong> {content.frameworksSecondary.integration}
              </div>
            </div>

            {/* Ejemplo VBG */}
            <div className="p-6 rounded-2xl bg-forest-950/80 border border-jade-600/40 space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-earth-100">
                    {content.vbgExample.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest-900 text-water-300 border border-forest-700">
                    Ejemplo situado
                  </span>
                </div>
                {!exploredExample && (
                  <button
                    type="button"
                    onClick={handleExploreExample}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-water-500 hover:bg-water-400 text-forest-950 font-bold text-xs shadow transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Integrar a bitácora</span>
                  </button>
                )}
                {exploredExample && (
                  <span className="text-xs font-mono text-water-300">✓ En bitácora</span>
                )}
              </div>
              <p className="text-xs font-mono text-solar-400 font-semibold">
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
          className="mt-12 pt-8 border-t border-forest-800 space-y-6"
        >
          <div className="p-6 rounded-2xl bg-forest-900/70 border border-forest-700/60 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-water-300">
              Hacia el Delta
            </span>

            {!isCompleted ? (
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-earth-50">
                  Confluencia en construcción
                </h3>
                <p className="text-sm text-earth-200">
                  {explorerName ? `${explorerName}, articula ` : 'Articula '}los 5 momentos en la tabla metodológica ({revealedPhasesCount}/5) y examina al menos 3 espacios de análisis ({exploredSpaces.length}/3) para abrir el paso hacia el delta fluvial.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-earth-50">
                  {explorerName ? `La integración es posible, ${explorerName}. No necesitamos comenzar diseñándolo todo.` : 'La integración es posible. No necesitamos comenzar diseñándolo todo.'}
                </h3>
                <p className="text-sm text-earth-200">
                  El río se abre ahora hacia tres maneras concretas de empezar.
                </p>

                <div className="pt-2">
                  <Link
                    href="/territorios/territorio-5"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-solar-500 hover:bg-solar-400 text-forest-950 font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-lg"
                  >
                    <span>Avanzar al Territorio 5: ¿Dónde comenzamos?</span>
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
