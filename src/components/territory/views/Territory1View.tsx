'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';
import { DISCOVERY_REGISTRY } from '@/lib/progression/discoveryRegistry';
import { TerritoryProgressDualTracker } from '../TerritoryProgressDualTracker';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';
import {
  Compass,
  CheckCircle2,
  BookOpen,
  Eye,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Layers,
  Check,
  ChevronDown,
} from 'lucide-react';
import { LianaVineBorders } from '@/components/borders/ThematicBorders';

const DISC_MAP: Record<string, string> = {
  'ciencias del comportamiento': 't1:disc:ciencias-del-comportamiento',
  'psicología': 't1:disc:psicologia',
  'neurociencia cognitiva': 't1:disc:neurociencia-cognitiva',
  'experiencia de usuario': 't1:disc:experiencia-de-usuario',
  'narrativa': 't1:disc:narrativa',
  'diseño de juegos': 't1:disc:diseno-de-juegos',
};

const DISTRACTORS_DATA: Record<string, { label: string; feedback: string }> = {
  'desarrollo de software': {
    label: 'desarrollo de software',
    feedback: 'El desarrollo de software es un medio tecnológico valioso para implementar soluciones, pero no es una de las disciplinas fundacionales de diseño que articulan la mirada gameful.',
  },
  'mecanismos de manipulación sensorial': {
    label: 'mecanismos de manipulación sensorial',
    feedback: 'La mirada gameful busca agencia deliberada, aprendizaje significativo y propósito ético, descartando de plano mecanismos de manipulación sensorial o condicionamiento coercitivo.',
  },
  'sistemas de premios y castigos': {
    label: 'sistemas de premios y castigos',
    feedback: 'Los sistemas de premios y castigos corresponden a esquemas de condicionamiento conductual extrínseco. La mirada gameful se fundamenta en la motivación intrínseca, la autonomía y la agencia significativa, no en recompensas coercitivas.',
  },
  'tecnologías de realidad virtual y aumentada': {
    label: 'tecnologías de realidad virtual y aumentada',
    feedback: 'La realidad virtual y aumentada son soportes tecnológicos de inmersión perceptual, pero no constituyen las bases conceptuales ni metodológicas sobre las que se diseña un sistema motivacional gameful.',
  },
};

const ALL_DISCIPLINE_CARDS = [
  { name: 'ciencias del comportamiento', isDistractor: false },
  { name: 'desarrollo de software', isDistractor: true },
  { name: 'psicología', isDistractor: false },
  { name: 'sistemas de premios y castigos', isDistractor: true },
  { name: 'neurociencia cognitiva', isDistractor: false },
  { name: 'experiencia de usuario', isDistractor: false },
  { name: 'mecanismos de manipulación sensorial', isDistractor: true },
  { name: 'narrativa', isDistractor: false },
  { name: 'tecnologías de realidad virtual y aumentada', isDistractor: true },
  { name: 'diseño de juegos', isDistractor: false },
];

function getShuffledPurposeOptions(): typeof PURPOSE_OPTIONS {
  const options = [...PURPOSE_OPTIONS];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  // Garantizar que la opción correcta nunca quede de primera:
  // Si por azar queda en el primer puesto, se intercambia con el segundo o tercero
  if (options[0].id === 'correct') {
    const target = Math.random() < 0.5 ? 1 : 2;
    [options[0], options[target]] = [options[target], options[0]];
  }
  return options;
}

const PURPOSE_OPTIONS = [
  {
    id: 'distractor-games',
    text: 'hacer que cualquier tarea o proceso parezca un videojuego comercial',
    isCorrect: false,
    feedback: 'La gamificación no busca maquillar procesos para que parezcan videojuegos, sino diseñar las condiciones bajo las cuales una persona participa, decide, aprende y actúa con propósito.',
  },
  {
    id: 'correct',
    text: 'construir sistemas motivacionales y de aprendizaje',
    isCorrect: true,
  },
  {
    id: 'distractor-rewards',
    text: 'introducir medallas y rankings para acelerar entregables de equipo',
    isCorrect: false,
    feedback: 'Las tablas de puntos son una capa cosmética externa que no constituye el propósito arquitectónico de la disciplina.',
  },
];

const FALSE_ROUTE_ARCHETYPES: Record<string, { category: string; badge: string; id: string }> = {
  'Hacer videojuegos.': { category: 'Capa cosmética superficial', badge: 'Cosmética', id: 't1:discard:cosmetics' },
  'Convertir todo en competencia.': { category: 'Puntos, medallas y rankings', badge: 'Mecánicas', id: 't1:discard:points' },
  'Poner puntos, medallas y rankings.': { category: 'Puntos, medallas y rankings', badge: 'Mecánicas', id: 't1:discard:points' },
  'Premiar cualquier acción.': { category: 'Puntos, medallas y rankings', badge: 'Mecánicas', id: 't1:discard:points' },
  'Disfrazar una obligación con entretenimiento.': { category: 'Capa cosmética superficial', badge: 'Cosmética', id: 't1:discard:cosmetics' },
  'Digitalizar por digitalizar.': { category: 'Capa cosmética superficial', badge: 'Cosmética', id: 't1:discard:cosmetics' },
  'Reemplazar el contenido con una historia.': { category: 'Capa cosmética superficial', badge: 'Cosmética', id: 't1:discard:cosmetics' },
  'Manipular a las personas para que hagan algo que no las beneficia.': { category: 'Coerción o manipulación', badge: 'Coerción', id: 't1:discard:coercion' },
};

export function Territory1View() {
  const data = TERRITORIES_DATA['territorio-1'];
  const content = data.specificContent;
  const { progress, saveTerritoryProgress, registerDiscoveredItems, trackInteraction, explorerName } = useProgression();
  const { getTerritoryBg } = useVisualSet();

  const isAlreadyCompleted = progress.territoryStatus['territorio-1'] === 'completed';
  const t1Interactions = progress.territoryInteractions['territorio-1'] || {};

  // Paso 1: Selección de disciplinas para construir la definición (Honest State Restoration)
  const initialSelectedDisciplines = Array.isArray(t1Interactions.selectedDisciplines) && t1Interactions.selectedDisciplines.length > 0
    ? t1Interactions.selectedDisciplines
    : [];
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(initialSelectedDisciplines);
  const selectedDisciplinesRef = useRef<string[]>(initialSelectedDisciplines);
  const [activeDistractorNotice, setActiveDistractorNotice] = useState<string | null>(null);

  // Decisión del propósito central (con distribución aleatoria garantizada de opciones)
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>(
    t1Interactions.selectedPurposeId || (t1Interactions.definitionBuilt ? 'correct' : '')
  );
  const [purposeFeedback, setPurposeFeedback] = useState<string | null>(null);
  const [shuffledPurposeOptions, setShuffledPurposeOptions] = useState<typeof PURPOSE_OPTIONS>(() => getShuffledPurposeOptions());

  useEffect(() => {
    // Distribución aleatoria de las 3 opciones cada vez que se monta
    setShuffledPurposeOptions(getShuffledPurposeOptions());
  }, []);

  const [definitionBuilt, setDefinitionBuilt] = useState<boolean>(
    Boolean(t1Interactions.definitionBuilt)
  );
  const definitionBuiltRef = useRef<boolean>(
    Boolean(t1Interactions.definitionBuilt)
  );

  // Paso 2: Lentes explorados (exploración activa requerida, sin atribución ficticia)
  const initialExploredLenses: string[] = t1Interactions.exploredLenses && t1Interactions.exploredLenses.length > 0
    ? t1Interactions.exploredLenses
    : [];

  // Comienza oculto hasta tanto no se haga clic en algún lente
  const [activeLensId, setActiveLensId] = useState<string | null>(null);
  const [exploredLenses, setExploredLenses] = useState<string[]>(
    initialExploredLenses
  );
  const exploredLensesRef = useRef<string[]>(initialExploredLenses);

  // Paso 3: Tarjetas de "lo que gamificación no es" descartadas
  const initialDiscardedNot: string[] = t1Interactions.discardedNot && t1Interactions.discardedNot.length > 0
    ? t1Interactions.discardedNot
    : [];
  const [discardedNot, setDiscardedNot] = useState<string[]>(
    initialDiscardedNot
  );
  const discardedNotRef = useRef<string[]>(initialDiscardedNot);

  // Paso 4: Principios Doctrinales desplegados en acordeón
  const [expandedPrincipleIdx, setExpandedPrincipleIdx] = useState<number | null>(null);

  // Sincronización reactiva con almacenamiento persistente
  useEffect(() => {
    const currentT1 = progress.territoryInteractions['territorio-1'] || {};
    const persistedDisciplines = currentT1.selectedDisciplines;

    if (Array.isArray(persistedDisciplines) && persistedDisciplines.length > 0) {
      setSelectedDisciplines(persistedDisciplines);
      selectedDisciplinesRef.current = persistedDisciplines;
    }

    if (currentT1.definitionBuilt) {
      if (!definitionBuiltRef.current) {
        setDefinitionBuilt(true);
        definitionBuiltRef.current = true;
        setSelectedPurposeId('correct');
      }
    }

    if (Array.isArray(currentT1.exploredLenses) && currentT1.exploredLenses.length > 0) {
      setExploredLenses(currentT1.exploredLenses);
      exploredLensesRef.current = currentT1.exploredLenses;
    }

    if (Array.isArray(currentT1.discardedNot) && currentT1.discardedNot.length > 0) {
      setDiscardedNot(currentT1.discardedNot);
      discardedNotRef.current = currentT1.discardedNot;
    }
  }, [progress.territoryInteractions, progress.territoryStatus]);

  const isCompleted = isAlreadyCompleted || (definitionBuilt && exploredLenses.length >= 3) || (definitionBuiltRef.current && exploredLensesRef.current.length >= 3);

  // RECONCILIACIÓN HONESTA DE LA BITÁCORA CONCEPTUAL
  // Registra estrictamente lo efectivamente seleccionado / explorado / descartado.
  // NUNCA infla descubrimientos al 100% de oficio.
  useEffect(() => {
    const discoveredSet = new Set(progress.discoveredItems || []);
    const missingItems: string[] = [];

    // 1. Disciplinas seleccionadas legítimamente
    for (const disc of selectedDisciplines) {
      const discId = DISC_MAP[disc];
      if (discId && !discoveredSet.has(discId)) {
        missingItems.push(discId);
      }
    }

    // 2. Definición canónica construida (+ distinción playful vs gameful)
    if (definitionBuilt) {
      if (!discoveredSet.has('t1:definition:built')) missingItems.push('t1:definition:built');
      if (!discoveredSet.has('t1:concept:playful-vs-gameful')) missingItems.push('t1:concept:playful-vs-gameful');
    }

    // 3. Lentes explorados activamente
    for (const lensId of exploredLenses) {
      const fullId = `t1:lens:${lensId}`;
      if (!discoveredSet.has(fullId)) {
        missingItems.push(fullId);
      }
    }

    // 4. Falsas rutas descartadas
    for (const item of discardedNot) {
      const meta = FALSE_ROUTE_ARCHETYPES[item];
      if (meta && !discoveredSet.has(meta.id)) {
        missingItems.push(meta.id);
      }
    }

    if (missingItems.length > 0) {
      registerDiscoveredItems(missingItems);
    }
  }, [
    selectedDisciplines,
    definitionBuilt,
    exploredLenses,
    discardedNot,
    progress.discoveredItems,
    registerDiscoveredItems,
  ]);

  const toggleDiscipline = async (disc: string) => {
    if (definitionBuilt) return; // Bloqueado tras articular

    // Si es un distractor, mostrar feedback explicativo sin penalizar ni sumar
    if (DISTRACTORS_DATA[disc]) {
      setActiveDistractorNotice(DISTRACTORS_DATA[disc].feedback);
      await trackInteraction({
        eventName: 'distractor_clicked',
        territoryId: 'territorio-1',
        targetId: disc,
      });
      return;
    }

    setActiveDistractorNotice(null);
    const isSelected = selectedDisciplinesRef.current.includes(disc);
    const isAdding = !isSelected;
    const next = isSelected
      ? selectedDisciplinesRef.current.filter((d) => d !== disc)
      : [...selectedDisciplinesRef.current, disc];

    selectedDisciplinesRef.current = next;
    setSelectedDisciplines(next);

    // Persistir selección intermedia inmediatamente
    await saveTerritoryProgress('territorio-1', isAlreadyCompleted ? 'completed' : 'visited', {
      definitionBuilt: definitionBuiltRef.current,
      selectedDisciplines: next,
      exploredLenses: exploredLensesRef.current,
      discardedNot: discardedNotRef.current,
    });

    if (isAdding && DISC_MAP[disc]) {
      await registerDiscoveredItems(DISC_MAP[disc]);
      await trackInteraction({
        eventName: 'discipline_selected',
        territoryId: 'territorio-1',
        targetId: disc,
      });
    }
  };

  const canSelectPurpose = selectedDisciplines.length === content.definitionDisciplines.length || selectedDisciplinesRef.current.length === content.definitionDisciplines.length;

  useEffect(() => {
    if (canSelectPurpose) {
      setShuffledPurposeOptions(getShuffledPurposeOptions());
    }
  }, [canSelectPurpose]);

  const handleSelectPurpose = async (optionId: string) => {
    setSelectedPurposeId(optionId);
    const option = PURPOSE_OPTIONS.find((o) => o.id === optionId);
    if (!option) return;

    if (!option.isCorrect) {
      setPurposeFeedback(option.feedback || 'Opción incorrecta.');
      await trackInteraction({
        eventName: 'purpose_distractor_selected',
        territoryId: 'territorio-1',
        targetId: optionId,
      });
      return;
    }

    setPurposeFeedback(null);
    definitionBuiltRef.current = true;
    setDefinitionBuilt(true);
    await registerDiscoveredItems(['t1:definition:built', 't1:concept:playful-vs-gameful']);
    await trackInteraction({
      eventName: 'definition_built',
      territoryId: 'territorio-1',
    });

    const willComplete = isAlreadyCompleted || exploredLensesRef.current.length >= 3;
    await saveTerritoryProgress(
      'territorio-1',
      willComplete ? 'completed' : 'visited',
      {
        definitionBuilt: true,
        selectedDisciplines: selectedDisciplinesRef.current,
        exploredLenses: exploredLensesRef.current,
        discardedNot: discardedNotRef.current,
      },
      willComplete ? data.journalPhrase : undefined
    );

    if (willComplete && !isAlreadyCompleted) {
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-1',
      });
    }
  };

  const handleSelectLens = async (lensId: string) => {
    setActiveLensId((prev) => (prev === lensId ? null : lensId));
    const nextExplored = Array.from(new Set([...exploredLensesRef.current, lensId]));
    exploredLensesRef.current = nextExplored;
    setExploredLenses(nextExplored);
    await registerDiscoveredItems(`t1:lens:${lensId}`);
    await trackInteraction({
      eventName: 'lens_explored',
      territoryId: 'territorio-1',
      targetId: lensId,
    });

    // Persistir siempre la exploración del lente
    const willComplete = isAlreadyCompleted || (definitionBuiltRef.current && nextExplored.length >= 3);
    await saveTerritoryProgress(
      'territorio-1',
      willComplete ? 'completed' : 'visited',
      {
        definitionBuilt: definitionBuiltRef.current,
        selectedDisciplines: selectedDisciplinesRef.current,
        exploredLenses: nextExplored,
        discardedNot: discardedNotRef.current,
      },
      willComplete ? data.journalPhrase : undefined
    );

    if (willComplete && !isAlreadyCompleted) {
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-1',
      });
    }
  };

  const handleToggleDiscard = async (item: string) => {
    const isCurrentlyDiscarded = discardedNotRef.current.includes(item);
    const nextDiscarded = isCurrentlyDiscarded
      ? discardedNotRef.current.filter((i) => i !== item)
      : [...discardedNotRef.current, item];
    discardedNotRef.current = nextDiscarded;
    setDiscardedNot(nextDiscarded);

    const isNowComplete = isAlreadyCompleted || (definitionBuiltRef.current && exploredLensesRef.current.length >= 3);
    await saveTerritoryProgress('territorio-1', isNowComplete ? 'completed' : 'visited', {
      definitionBuilt: definitionBuiltRef.current,
      selectedDisciplines: selectedDisciplinesRef.current,
      exploredLenses: exploredLensesRef.current,
      discardedNot: nextDiscarded,
    });

    if (!isCurrentlyDiscarded) {
      await trackInteraction({
        eventName: 'false_route_discarded',
        territoryId: 'territorio-1',
        targetId: item,
      });

      const meta = FALSE_ROUTE_ARCHETYPES[item];
      if (meta) {
        await registerDiscoveredItems(meta.id);
      }
    }
  };

  const activeLens = activeLensId
    ? content.fourLenses.find((l: any) => l.id === activeLensId) || null
    : null;
  const bgUrl = getTerritoryBg('territorio-1');
  const t1DiscoveredCount = (progress.discoveredItems || []).filter((id) => id.startsWith('t1:')).length;

  // Capas de revelación progresiva del Territorio 1
  const canShowDoctrinalNuances = exploredLenses.length >= 4;
  const canShowDoctrinalPrinciples = discardedNot.length >= 8;
  const isEssentialComplete = definitionBuilt && exploredLenses.length >= 3;

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
        territoryId="territorio-1"
        territoryTitle="Territorio 1: Naciente y Definición"
        essentialTitle="Hitos Esenciales de Navegación"
        essentialItems={[
          {
            id: 'disciplines',
            label: `Articular la definición integrada (${selectedDisciplines.length}/6 disciplinas seleccionadas)`,
            isDone: definitionBuilt,
          },
          {
            id: 'lenses',
            label: `Explorar al menos 3 lentes de diseño (llevas ${exploredLenses.length}/3 requeridos)`,
            isDone: exploredLenses.length >= 3,
          },
        ]}
        isEssentialComplete={isEssentialComplete}
        discoveryItemsCount={t1DiscoveredCount}
        discoveryTotalCount={15}
        discoveryPercent={progress.territoryDiscoveryPercent['territorio-1'] || 0}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-12">
        {/* Cabecera del Territorio */}
        <header className="space-y-4 border-b border-forest-800 pb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-water-300">
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Territorio 1 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
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

        {isAlreadyCompleted && (!definitionBuilt || exploredLenses.length < 3) && (
          <div className="p-4 rounded-xl bg-forest-950/80 border border-solar-500/40 text-earth-200 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 text-solar-400 font-mono uppercase font-bold text-xs">
              <AlertOctagon className="w-4 h-4" />
              <span>Hito disponible para re-exploración</span>
            </div>
            <p>
              Este territorio figura como completado en tu travesía previa, pero la definición y sus lentes no cuentan con interacciones documentadas en este dispositivo. Puedes explorar y construir la definición para registrar sus conceptos en la bitácora sin reiniciar tu mapa.
            </p>
          </div>
        )}

        {/* SECCIÓN 1: Construcción de la Definición */}
        <section aria-labelledby="definition-builder-title" className="space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-forest-950/85 border border-jade-600/50 backdrop-blur-sm shadow-xl space-y-6 relative overflow-visible">
            <LianaVineBorders />
            <div className="flex items-center justify-between gap-2 border-b border-forest-800 pb-3 relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-water-300">
                <Sparkles className="w-4 h-4 text-solar-400" />
                <span>{data.activationQuestion}</span>
              </div>
              <span className="text-xs font-mono text-earth-300">
                {selectedDisciplines.length} de {content.definitionDisciplines.length} disciplinas
              </span>
            </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm text-earth-200 font-sans leading-relaxed">
            <span>Identifica y selecciona las 6 disciplinas fundacionales que articulan la mirada gameful:</span>
            <span className="text-xs font-mono text-solar-300 shrink-0">✦ 6 disciplinas = +6 conceptos en bitácora</span>
          </div>

          {/* Banner de feedback contextual para distractores */}
          {activeDistractorNotice && (
            <div className="p-4 rounded-xl bg-solar-950/90 border border-solar-500/70 text-earth-100 space-y-2 animate-in fade-in duration-300 shadow-md">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-solar-400 font-bold">
                <AlertOctagon className="w-4 h-4 text-solar-400" />
                <span>Distinción de disciplina:</span>
              </div>
              <p className="text-xs sm:text-sm font-sans text-earth-200 leading-relaxed">
                {activeDistractorNotice}
              </p>
              <button
                type="button"
                onClick={() => setActiveDistractorNotice(null)}
                className="text-xs font-mono text-solar-300 hover:text-solar-200 underline pt-1 cursor-pointer"
              >
                Comprendido, buscar otra disciplina →
              </button>
            </div>
          )}

          {/* Chips de disciplinas con distractores integrados (mismo fondo verde claro y sin insignia +1 concepto) */}
          <div className="flex flex-wrap gap-2.5">
            {ALL_DISCIPLINE_CARDS.map((card) => {
              const disc = card.name;
              const isSelected = selectedDisciplines.includes(disc);
              return (
                <button
                  key={disc}
                  type="button"
                  onClick={() => toggleDiscipline(disc)}
                  className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-river-900 border border-river-400 text-earth-50 shadow-sm'
                      : 'bg-canopy-900 border border-canopy-800 text-earth-300 hover:border-canopy-600'
                  }`}
                >
                  <span>{isSelected ? `✓ ${disc}` : `+ ${disc}`}</span>
                </button>
              );
            })}
          </div>

          {!definitionBuilt && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs text-earth-400">
                <span>
                  {!canSelectPurpose
                    ? `Selecciona las ${content.definitionDisciplines.length - selectedDisciplines.length} disciplinas fundacionales faltantes para desbloquear la articulación del propósito.`
                    : 'Las 6 disciplinas fundacionales han sido seleccionadas. Ahora elige el propósito que las integra:'}
                </span>
              </div>

              {canSelectPurpose && (
                <div className="p-5 rounded-xl bg-forest-900/90 border border-jade-600/60 space-y-3 animate-in fade-in duration-300 shadow-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-solar-300 font-bold block">
                    Paso 2: ¿Cuál es el propósito central de integrar estas disciplinas?
                  </span>

                  {purposeFeedback && (
                    <div className="p-3 rounded-lg bg-coral-950/80 border border-coral-500/60 text-xs text-earth-200 font-sans">
                      {purposeFeedback}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {shuffledPurposeOptions.map((opt) => {
                      const isChosen = selectedPurposeId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectPurpose(opt.id)}
                          className={`p-3.5 rounded-lg text-left text-xs sm:text-sm font-sans transition-all flex items-center justify-between gap-3 border ${
                            isChosen && opt.isCorrect
                              ? 'bg-jade-950/80 border-jade-400 text-white font-medium'
                              : isChosen && !opt.isCorrect
                              ? 'bg-coral-950/60 border-coral-500 text-earth-200'
                              : 'bg-forest-950/70 border-forest-700 text-earth-200 hover:border-jade-500/60'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span className="text-xs font-mono text-solar-300 shrink-0">
                            {isChosen && opt.isCorrect ? '✓ Correcto' : 'Elegir →'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Revelación de la definición completa y criterios de valor */}
          {definitionBuilt && (
            <div className="mt-6 pt-6 border-t border-forest-800 space-y-6 animate-in fade-in duration-500">
              <div className="p-6 sm:p-8 rounded-2xl bg-parchment-100 border-2 border-parchment-300 text-parchment-ink shadow-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-300 pb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-forest-700 font-bold block">
                    Definición Canónica Articulada
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Registrada en bitácora conceptual</span>
                  </span>
                </div>
                <p className="text-base sm:text-lg font-serif text-parchment-ink leading-relaxed">
                  {content.definitionFull}
                </p>
              </div>

              {/* Criterios de valor */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-earth-200">
                  Como cualquier disciplina de diseño, su valor depende de:
                </h4>
                <ul className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                  {content.valueCriteria.map((crit: string, idx: number) => (
                    <li key={idx} className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300 text-parchment-ink shadow-sm flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-jade-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN 2: Cuatro lentes para diseñar */}
      {definitionBuilt && (
        <section aria-labelledby="four-lenses-title" className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-300 font-semibold">
                Perspectivas de Creación
              </span>
              <h2 id="four-lenses-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
                Cuatro lentes para diseñar
              </h2>
              <p className="text-sm text-earth-300 mt-1">
                Explora cada uno de los cuatro lentes para examinar cómo se conectan el comportamiento, la experiencia, el impacto y el sistema.
              </p>
            </div>
            <span className="text-xs font-mono text-water-300 bg-forest-900/90 border border-forest-700/80 px-3 py-1 rounded-full shrink-0">
              ✦ 4 lentes = +4 conceptos en bitácora
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {content.fourLenses.map((lens: any) => {
              const isActive = lens.id === activeLensId;
              const isExplored = exploredLenses.includes(lens.id);

              return (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => handleSelectLens(lens.id)}
                  className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 hover:scale-[1.02] shadow-md ${
                    isActive
                      ? 'bg-gradient-to-b from-water-900 to-forest-900 border-water-400 text-earth-50 ring-2 ring-water-400/50 shadow-lg'
                      : isExplored
                      ? 'bg-forest-900/80 border-jade-600/60 text-earth-100 hover:border-water-400'
                      : 'bg-forest-950/60 border-forest-800 text-earth-300 hover:border-forest-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        isExplored ? 'text-emerald-300' : 'text-solar-300'
                      }`}>
                        {isExplored ? '✓ En bitácora' : '+ Por registrar'}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm sm:text-base leading-snug">
                      {lens.title}
                    </h3>
                  </div>
                  <span className="text-xs text-solar-300 mt-3 block font-mono font-medium">
                    {isActive ? '● Recoger papiro ▲' : 'Desenrollar papiro ▼'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel de detalle del lente activo en papiro cartográfico desenrollable desde arriba */}
          {activeLens && (
            <div
              key={activeLens.id}
              className="relative overflow-hidden rounded-2xl animate-unroll-scroll origin-top shadow-2xl transition-all duration-300"
            >
              {/* Varilla superior de madera noble con remates y latón */}
              <div className="w-full h-4 bg-gradient-to-r from-[#3d240d] via-[#754a22] to-[#3d240d] rounded-t-xl border-t border-x border-[#2b1806] flex items-center justify-between px-4 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#ffd54f] to-[#b8860b] shadow-xs border border-[#ffeaa7]/60" />
                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-transparent via-[#ffd54f]/30 to-transparent" />
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#ffd54f] to-[#b8860b] shadow-xs border border-[#ffeaa7]/60" />
              </div>

              {/* Cuerpo de papiro / papel de mapa envejecido con textura cálida */}
              <div className="relative p-6 sm:p-8 md:p-10 bg-gradient-to-b from-[#faf5e7] via-[#f5ecd2] to-[#ecdfbe] border-x-2 border-[#bfa270] text-[#231a0e] space-y-5 shadow-[inset_0_0_35px_rgba(163,126,62,0.22)]">
                {/* Marca de agua náutica / brújula de fondo */}
                <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                  <Compass className="w-36 h-36 text-[#8b6528]" />
                </div>

                {/* Cabecera del papiro cartográfico */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#cbb382] pb-4 gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#7a541c] font-bold flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#9e6d24]" />
                      Carta de Navegación Fluvial — Lente de Diseño
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono bg-[#e8d7ae] text-[#543b0d] border border-[#b8954e] font-bold shadow-xs flex items-center gap-1">
                      <span>✓</span> En bitácora conceptual
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-[#8b6528] bg-[#f0e3bf]/80 px-2.5 py-1 rounded border border-[#cbb382] shrink-0 font-medium">
                    COORD. 01°N — AGENCIA FLUVIAL
                  </span>
                </div>

                {/* Pregunta clave del lente destacada como axioma de navegación */}
                <div className="relative z-10 p-4 rounded-xl bg-[#ede0be]/70 border-l-4 border-[#b86b24] shadow-xs">
                  <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#7a541c] font-bold mb-1">
                    Pregunta Cartográfica de Enfoque:
                  </span>
                  <p className="text-base sm:text-lg md:text-xl font-serif italic text-[#6e370f] font-semibold leading-snug">
                    {formatQuotation(activeLens.question, explorerName)}
                  </p>
                </div>

                {/* Título y texto de apertura */}
                <div className="relative z-10 space-y-2 pt-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#1a1208] tracking-tight">
                    {activeLens.title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#2a2012] font-serif font-medium leading-relaxed">
                    {activeLens.lead}
                  </p>
                </div>

                {/* Cuerpo explicativo doctrinal */}
                <div className="relative z-10 pt-3 border-t border-[#d8c599]/80">
                  <p className="text-sm sm:text-base text-[#382b1c] font-sans leading-relaxed">
                    {activeLens.body}
                  </p>
                </div>
              </div>

              {/* Varilla inferior de madera noble con peso y remates */}
              <div className="w-full h-3.5 sm:h-4 bg-gradient-to-r from-[#3d240d] via-[#754a22] to-[#3d240d] rounded-b-xl border-b border-x border-[#2b1806] flex items-center justify-between px-4 shadow-md">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#ffd54f] to-[#b8860b] border border-[#ffeaa7]/60" />
                <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-transparent via-[#ffd54f]/25 to-transparent" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#ffd54f] to-[#b8860b] border border-[#ffeaa7]/60" />
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN 3: Profundización conceptual y doctrinal (revelada al explorar los 4 lentes) */}
      {canShowDoctrinalNuances && (
        <section aria-labelledby="deepening-title" className="space-y-8 border-t border-forest-800 pt-8 animate-in fade-in duration-500">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-solar-300 font-semibold">
              Claridad Conceptual & Doctrina
            </span>
            <h2 id="deepening-title" className="text-2xl font-serif font-bold text-earth-50 mt-1">
              Matices y Principios Doctrinales
            </h2>
          </div>

          {/* Playful vs Gameful */}
          <div className="p-6 sm:p-8 rounded-2xl bg-forest-950/80 border border-jade-600/40 backdrop-blur-md shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-800/80 pb-3">
              <h3 className="font-serif font-bold text-lg sm:text-xl text-earth-100">
                Playful no es lo mismo que gameful
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-jade-950/80 text-jade-300 border border-jade-600/60 font-medium flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>✓ Distinción registrada en bitácora (+1 concepto)</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-forest-900/90 border border-coral-500/40 shadow-sm space-y-2">
                <span className="text-xs font-mono uppercase text-coral-300 font-bold">
                  {content.playfulVsGameful.playful.title}
                </span>
                <p className="text-xs sm:text-sm text-earth-200 leading-relaxed font-sans">
                  {content.playfulVsGameful.playful.description}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-forest-900/90 border border-water-500/40 shadow-sm space-y-2">
                <span className="text-xs font-mono uppercase text-water-300 font-bold">
                  {content.playfulVsGameful.gameful.title}
                </span>
                <p className="text-xs sm:text-sm text-earth-200 leading-relaxed font-sans">
                  {content.playfulVsGameful.gameful.description}
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base font-serif italic text-solar-300 pt-1 font-medium">
              {formatQuotation(content.playfulVsGameful.synthesis, explorerName)}
            </p>
          </div>

          {/* Lo que gamificación no significa (Rutas descartables - 8 tarjetas) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-forest-950/85 border border-forest-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-earth-200 font-semibold">
                <AlertOctagon className="w-4 h-4 text-coral-400" />
                <span>Lo que gamificación NO significa (falsas rutas que descartamos):</span>
              </div>
              <span className="text-xs font-mono text-coral-300 bg-coral-950/60 border border-coral-800 px-2.5 py-0.5 rounded-full shrink-0">
                ✦ 3 arquetipos de descarte = +3 conceptos en bitácora
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {content.whatItIsNot.map((item: string, idx: number) => {
                const isDiscarded = discardedNot.includes(item);
                const meta = FALSE_ROUTE_ARCHETYPES[item] || { category: 'Descarte', badge: 'Descarte', id: 't1:discard:cosmetics' };
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleDiscard(item)}
                    className={`p-3.5 rounded-xl text-xs text-left border transition-all flex flex-col justify-between gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-sm ${
                      isDiscarded
                        ? 'bg-coral-950/40 border-coral-500/60 text-earth-300 ring-1 ring-coral-500/30'
                        : 'bg-forest-900 border-forest-700 text-earth-100 hover:border-coral-400 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-forest-800 text-water-300 font-medium">
                        {meta.badge}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold ${isDiscarded ? 'text-emerald-400' : 'text-coral-400'}`}>
                        {isDiscarded ? '✓ Descartada' : '+ Descartar'}
                      </span>
                    </div>
                    <span className={`font-medium leading-snug ${isDiscarded ? 'line-through opacity-80' : ''}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Principios Doctrinales en Acordeón (revelados solo tras descartar las 8 falsas rutas) */}
          {canShowDoctrinalPrinciples && (
            <div className="space-y-4 pt-4 border-t border-forest-800 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-solar-300 font-semibold block">
                    Doctrina Profunda
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-earth-100">
                    Principios Doctrinales
                  </h3>
                </div>
                <span className="text-xs font-mono text-earth-400">
                  Desplegable (no suma descubrimientos)
                </span>
              </div>
              <div className="space-y-2.5">
                {content.doctrinalPrinciples.map((principle: any, idx: number) => {
                  const isExpanded = expandedPrincipleIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-forest-700 bg-forest-900/80 overflow-hidden shadow-sm transition-all hover:border-forest-600"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedPrincipleIdx(isExpanded ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-earth-100 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 cursor-pointer"
                      >
                        <span className="font-serif font-bold text-sm sm:text-base">
                          {principle.title}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-solar-400 shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-earth-200 font-sans leading-relaxed border-t border-forest-800/80 bg-forest-950/60 animate-in fade-in duration-200">
                          {principle.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Conclusión e integración a la Bitácora */}
      {isCompleted && (
        <InteractionConclusion
          title="Premisa Nuclear Registrada en la Bitácora"
          copy={data.conclusionCopy}
        />
      )}

      {/* Navegación y Transición No Lineal hacia T2 u T3 */}
      <nav
        aria-label="Navegación tras el Territorio 1"
        className="mt-12 pt-8 border-t border-forest-800 space-y-6"
      >
        <div className="p-6 sm:p-8 rounded-2xl bg-forest-950/85 border border-jade-600/50 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-solar-300 font-semibold">
              Bifurcación del Río
            </span>
            <span className="text-xs font-mono text-earth-400">
              {isCompleted ? '✓ Corrientes abiertas' : 'Corrientes bloqueadas'}
            </span>
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-earth-50">
            Una nueva corriente puede explorarse desde dos orillas:
          </h3>

          {!isCompleted && (
            <div className="p-5 rounded-xl bg-solar-950/60 border border-solar-700/80 text-solar-200 text-xs sm:text-sm space-y-3">
              <span className="font-semibold block text-solar-300">
                Hitos esenciales pendientes para desbloquear el Territorio 2 y 3:
              </span>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-2">
                  {definitionBuilt ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : (
                    <span className="text-solar-400">○</span>
                  )}
                  <span className={definitionBuilt ? 'text-earth-300 line-through' : 'text-earth-100'}>
                    Articular la definición integrada ({selectedDisciplines.length}/6 disciplinas seleccionadas)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {exploredLenses.length >= 3 ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : (
                    <span className="text-solar-400">○</span>
                  )}
                  <span className={exploredLenses.length >= 3 ? 'text-earth-300 line-through' : 'text-earth-100'}>
                    Explorar al menos 3 de los 4 lentes (llevas {exploredLenses.length} de 3 requeridos)
                  </span>
                </li>
              </ul>

            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {isCompleted ? (
              <Link
                href="/territorios/territorio-2"
                className="p-5 rounded-xl bg-forest-900 border border-jade-600/60 hover:border-water-400 transition-all flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-md hover:scale-[1.02]"
              >
                <div>
                  <span className="text-xs font-mono uppercase text-water-300 mb-1 block font-semibold">
                    Opción A
                  </span>
                  <h4 className="font-serif font-bold text-base text-earth-50 group-hover:text-water-200">
                    ¿Qué necesidades puede ayudarnos a resolver?
                  </h4>
                  <p className="text-xs text-earth-300 mt-2">
                    Explorar las fuerzas que esta capacidad puede movilizar en el cauce.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-water-300 font-medium mt-4">
                  <span>Ir al Territorio 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ) : (
              <div
                className="p-5 rounded-xl bg-forest-950/40 border border-forest-800 opacity-60 flex flex-col justify-between cursor-not-allowed select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase text-earth-400">
                      Opción A
                    </span>
                    <span className="text-[11px] font-mono text-solar-400 flex items-center gap-1">
                      Bloqueado
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-earth-300">
                    ¿Qué necesidades puede ayudarnos a resolver?
                  </h4>
                  <p className="text-xs text-earth-400 mt-2">
                    Se abrirá al completar los hitos esenciales de este territorio.
                  </p>
                </div>
              </div>
            )}

            {isCompleted ? (
              <Link
                href="/territorios/territorio-3"
                className="p-5 rounded-xl bg-forest-900 border border-jade-600/60 hover:border-water-400 transition-all flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-md hover:scale-[1.02]"
              >
                <div>
                  <span className="text-xs font-mono uppercase text-water-300 mb-1 block font-semibold">
                    Opción B
                  </span>
                  <h4 className="font-serif font-bold text-base text-earth-50 group-hover:text-water-200">
                    ¿Qué nuevas experiencias permite diseñar?
                  </h4>
                  <p className="text-xs text-earth-300 mt-2">
                    Explorar los componentes que hacen posible una arquitectura gameful.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-water-300 font-medium mt-4">
                  <span>Ir al Territorio 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ) : (
              <div
                className="p-5 rounded-xl bg-forest-950/40 border border-forest-800 opacity-60 flex flex-col justify-between cursor-not-allowed select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase text-earth-400">
                      Opción B
                    </span>
                    <span className="text-[11px] font-mono text-solar-400 flex items-center gap-1">
                      Bloqueado
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-earth-300">
                    ¿Qué nuevas experiencias permite diseñar?
                  </h4>
                  <p className="text-xs text-earth-400 mt-2">
                    Se abrirá al completar los hitos esenciales de este territorio.
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs font-mono text-earth-300 pt-2 text-center">
            {isCompleted
              ? (explorerName ? `¡Excelente travesía, ${explorerName}! Puedes comenzar por cualquiera de las dos. Ambas corrientes volverán a encontrarse en la confluencia.` : 'Puedes comenzar por cualquiera de las dos. Ambas corrientes volverán a encontrarse en la confluencia.')
              : (explorerName ? `${explorerName}, completa los hitos pendientes arriba para navegar hacia cualquiera de las dos corrientes.` : 'Completa los hitos pendientes arriba para navegar hacia cualquiera de las dos corrientes.')}
          </p>

          {/* Barra de estado de Bitácora Conceptual */}
          <div className="p-4 rounded-xl bg-forest-900/60 border border-forest-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-water-400 shrink-0" />
              <span className="text-earth-200">
                {explorerName ? `Bitácora de ${explorerName}: ` : 'Bitácora Conceptual de este territorio: '}
                <strong className={t1DiscoveredCount === 15 ? 'text-emerald-300 font-mono' : 'text-solar-300 font-mono'}>
                  {t1DiscoveredCount} de 15 conceptos ({progress.territoryDiscoveryPercent['territorio-1'] || 0}%)
                </strong>
                {t1DiscoveredCount === 15 && (
                  <span className="ml-2 text-emerald-400 font-medium">✓ 100% alcanzado</span>
                )}
              </span>
            </div>
            <span className="text-[11px] font-mono text-earth-400">
              {15 - t1DiscoveredCount > 0 ? `Faltan ${15 - t1DiscoveredCount} conceptos opcionales` : 'Exploración completa'}
            </span>
          </div>
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
