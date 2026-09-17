'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
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
} from 'lucide-react';

const DISC_MAP: Record<string, string> = {
  'Diseño de juegos': 't1:disc:diseno-de-juegos',
  'Ciencias del comportamiento': 't1:disc:ciencias-del-comportamiento',
  'Psicología cognitiva y social': 't1:disc:psicologia-cognitiva-social',
  'Narrativa transmedia': 't1:disc:narrativa-transmedia',
  'Diseño de sistemas': 't1:disc:diseno-de-sistemas',
  'Tecnología y creatividad': 't1:disc:tecnologia-creatividad',
};

export function Territory1View() {
  const data = TERRITORIES_DATA['territorio-1'];
  const content = data.specificContent;
  const { progress, saveTerritoryProgress, registerDiscoveredItems, trackInteraction } = useProgression();

  const isAlreadyCompleted = progress.territoryStatus['territorio-1'] === 'completed';
  const t1Interactions = progress.territoryInteractions['territorio-1'] || {};

  // Paso 1: Selección de disciplinas para construir la definición
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(
    isAlreadyCompleted
      ? content.definitionDisciplines
      : (t1Interactions.selectedDisciplines || [])
  );
  const [definitionBuilt, setDefinitionBuilt] = useState<boolean>(
    isAlreadyCompleted || !!t1Interactions.definitionBuilt
  );

  // Paso 2: Lentes explorados (Honest State Restoration)
  const initialExploredLenses = t1Interactions.exploredLenses && t1Interactions.exploredLenses.length > 0
    ? t1Interactions.exploredLenses
    : (isAlreadyCompleted
        ? content.fourLenses.filter((l: any) => progress.discoveredItems.includes(`t1:lens:${l.id}`)).map((l: any) => l.id)
        : ['lens-behavior']);

  const [activeLensId, setActiveLensId] = useState<string>(
    initialExploredLenses[0] || 'lens-behavior'
  );
  const [exploredLenses, setExploredLenses] = useState<string[]>(
    initialExploredLenses.length > 0 ? initialExploredLenses : ['lens-behavior']
  );

  // Paso 3: Tarjetas de "lo que gamificación no es" descartadas
  const [discardedNot, setDiscardedNot] = useState<string[]>(
    t1Interactions.discardedNot || []
  );

  // Registrar lente inicial al montar
  React.useEffect(() => {
    registerDiscoveredItems('t1:lens:lens-behavior');
  }, [registerDiscoveredItems]);

  const toggleDiscipline = async (disc: string) => {
    if (definitionBuilt) return;
    const isAdding = !selectedDisciplines.includes(disc);
    const next = isAdding
      ? [...selectedDisciplines, disc]
      : selectedDisciplines.filter((d) => d !== disc);
    setSelectedDisciplines(next);

    if (isAdding) {
      if (DISC_MAP[disc]) {
        await registerDiscoveredItems(DISC_MAP[disc]);
      }
      await trackInteraction({
        eventName: 'discipline_selected',
        territoryId: 'territorio-1',
        targetId: disc,
      });
    }
  };

  const canBuildDefinition = selectedDisciplines.length === content.definitionDisciplines.length;

  const handleBuildDefinition = async () => {
    if (!canBuildDefinition) return;
    setDefinitionBuilt(true);
    await registerDiscoveredItems('t1:definition:built');
    await trackInteraction({
      eventName: 'definition_built',
      territoryId: 'territorio-1',
    });

    // Progreso esencial: definición construida Y al menos 3 lentes
    if (exploredLenses.length >= 3 && !isAlreadyCompleted) {
      await saveTerritoryProgress(
        'territorio-1',
        'completed',
        { definitionBuilt: true, selectedDisciplines, exploredLenses, discardedNot },
        data.journalPhrase
      );
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-1',
      });
    }
  };

  const handleSelectLens = async (lensId: string) => {
    setActiveLensId(lensId);
    const nextExplored = Array.from(new Set([...exploredLenses, lensId]));
    setExploredLenses(nextExplored);
    await registerDiscoveredItems(`t1:lens:${lensId}`);
    await trackInteraction({
      eventName: 'lens_explored',
      territoryId: 'territorio-1',
      targetId: lensId,
    });

    // Si ya se construyó la definición y se alcanzan 3 o más lentes, marcar completado
    if (definitionBuilt && nextExplored.length >= 3 && !isAlreadyCompleted) {
      await saveTerritoryProgress(
        'territorio-1',
        'completed',
        { definitionBuilt: true, selectedDisciplines, exploredLenses: nextExplored, discardedNot },
        data.journalPhrase
      );
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-1',
      });
    }
  };

  const isCompleted = isAlreadyCompleted || (definitionBuilt && exploredLenses.length >= 3);

  const handleToggleDiscard = async (item: string) => {
    const isCurrentlyDiscarded = discardedNot.includes(item);
    const nextDiscarded = isCurrentlyDiscarded
      ? discardedNot.filter((i) => i !== item)
      : [...discardedNot, item];
    setDiscardedNot(nextDiscarded);

    if (!isCurrentlyDiscarded) {
      await trackInteraction({
        eventName: 'false_route_discarded',
        territoryId: 'territorio-1',
        targetId: item,
      });

      if (item.toLowerCase().includes('puntos')) {
        await registerDiscoveredItems('t1:discard:points');
      } else if (item.toLowerCase().includes('manipular')) {
        await registerDiscoveredItems('t1:discard:coercion');
      } else {
        await registerDiscoveredItems('t1:discard:cosmetics');
      }
    }
  };

  React.useEffect(() => {
    if (definitionBuilt) {
      registerDiscoveredItems('t1:concept:playful-vs-gameful');
    }
  }, [definitionBuilt, registerDiscoveredItems]);

  const activeLens = content.fourLenses.find((l: any) => l.id === activeLensId) || content.fourLenses[0];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Cabecera del Territorio */}
      <header className="space-y-4 border-b border-canopy-800 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-river-400">
            <Compass className="w-4 h-4 text-editorial-accent" />
            <span>Territorio 1 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
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

      {/* SECCIÓN 1: Construcción de la Definición */}
      <section aria-labelledby="definition-builder-title" className="space-y-6">
        <div className="p-6 md:p-8 rounded-2xl bg-canopy-950/80 border border-canopy-700/60 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between gap-2 border-b border-canopy-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-river-400">
              <Sparkles className="w-4 h-4" />
              <span>{data.activationQuestion}</span>
            </div>
            <span className="text-xs font-mono text-earth-300">
              {selectedDisciplines.length} de {content.definitionDisciplines.length} disciplinas
            </span>
          </div>

          <p className="text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
            Construye la definición articulando los campos de conocimiento que confluyen en esta capacidad:
          </p>

          {/* Chips de disciplinas */}
          <div className="flex flex-wrap gap-2.5">
            {content.definitionDisciplines.map((disc: string) => {
              const isSelected = selectedDisciplines.includes(disc);
              return (
                <button
                  key={disc}
                  type="button"
                  onClick={() => toggleDiscipline(disc)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                    isSelected
                      ? 'bg-river-900 border border-river-400 text-earth-50 shadow-sm'
                      : 'bg-canopy-900 border border-canopy-800 text-earth-300 hover:border-canopy-600'
                  }`}
                >
                  {isSelected ? `✓ ${disc}` : `+ ${disc}`}
                </button>
              );
            })}
          </div>

          {!definitionBuilt && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-earth-400">
                {!canBuildDefinition
                  ? `Selecciona las ${content.definitionDisciplines.length - selectedDisciplines.length} disciplinas faltantes para articular la definición.`
                  : 'Las 6 disciplinas han sido seleccionadas. Lista para articular.'}
              </span>
              <button
                type="button"
                disabled={!canBuildDefinition}
                onClick={handleBuildDefinition}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                  canBuildDefinition
                    ? 'bg-editorial-accent hover:bg-editorial-accent/90 text-white cursor-pointer shadow-md'
                    : 'bg-canopy-900 border border-canopy-800 text-earth-500 cursor-not-allowed opacity-60'
                }`}
              >
                Articular definición integrada
              </button>
            </div>
          )}

          {/* Revelación de la definición completa y criterios de valor */}
          {definitionBuilt && (
            <div className="mt-6 pt-6 border-t border-canopy-800 space-y-6 animate-in fade-in duration-500">
              <div className="p-5 rounded-xl bg-river-950/70 border border-river-600/50 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-river-300 font-semibold block">
                  Definición Canónica
                </span>
                <p className="text-base sm:text-lg font-serif text-earth-100 leading-relaxed">
                  {content.definitionFull}
                </p>
              </div>

              {/* Criterios de valor */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-earth-300">
                  Como cualquier disciplina de diseño, su valor depende de:
                </h4>
                <ul className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-earth-200">
                  {content.valueCriteria.map((crit: string, idx: number) => (
                    <li key={idx} className="p-3 rounded-lg bg-canopy-900/50 border border-canopy-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-river-400 shrink-0 mt-0.5" />
                      <span>{crit}</span>
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
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Perspectivas de Creación
            </span>
            <h2 id="four-lenses-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
              Cuatro lentes para diseñar
            </h2>
            <p className="text-sm text-earth-300 mt-1">
              Explora cada uno de los cuatro lentes para examinar cómo se conectan el comportamiento, la experiencia, el impacto y el sistema.
            </p>
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
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                    isActive
                      ? 'bg-river-900/90 border-river-400 text-earth-50 ring-1 ring-river-400'
                      : isExplored
                      ? 'bg-canopy-900/60 border-canopy-700 text-earth-200 hover:border-river-500'
                      : 'bg-canopy-950/40 border-canopy-800 text-earth-300 hover:border-canopy-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-river-300">
                      {isExplored ? '✓ Explorado' : 'Por explorar'}
                    </span>
                    <h3 className="font-serif font-semibold text-sm sm:text-base leading-snug">
                      {lens.title}
                    </h3>
                  </div>
                  <span className="text-xs text-earth-400 mt-2 block font-mono">
                    Ver enfoque →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel de detalle del lente activo */}
          {activeLens && (
            <div className="p-6 md:p-8 rounded-2xl bg-canopy-950/80 border border-canopy-700 space-y-4">
              <div className="flex items-center justify-between border-b border-canopy-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-river-300">
                  Lente: {activeLens.title}
                </span>
                <span className="text-xs font-serif italic text-editorial-gold font-medium">
                  {activeLens.question}
                </span>
              </div>

              <p className="text-base text-earth-100 font-serif leading-relaxed">
                {activeLens.lead}
              </p>

              <p className="text-sm text-earth-300 font-sans leading-relaxed">
                {activeLens.body}
              </p>
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN 3: Profundización conceptual y doctrinal */}
      {definitionBuilt && (
        <section aria-labelledby="deepening-title" className="space-y-8 border-t border-canopy-800 pt-8 animate-in fade-in duration-500">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Claridad Conceptual & Doctrina
            </span>
            <h2 id="deepening-title" className="text-2xl font-serif font-bold text-earth-50 mt-1">
              Matices y Principios Doctrinales
            </h2>
          </div>

          {/* Playful vs Gameful */}
          <div className="p-6 rounded-2xl bg-canopy-900/50 border border-canopy-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-earth-100">
              Playful no es lo mismo que gameful
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-canopy-950 border border-canopy-800 space-y-1.5">
                <span className="text-xs font-mono uppercase text-editorial-accent font-semibold">
                  {content.playfulVsGameful.playful.title}
                </span>
                <p className="text-xs sm:text-sm text-earth-300 leading-relaxed">
                  {content.playfulVsGameful.playful.description}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-canopy-950 border border-canopy-800 space-y-1.5">
                <span className="text-xs font-mono uppercase text-river-300 font-semibold">
                  {content.playfulVsGameful.gameful.title}
                </span>
                <p className="text-xs sm:text-sm text-earth-300 leading-relaxed">
                  {content.playfulVsGameful.gameful.description}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-earth-200 pt-1">
              “{content.playfulVsGameful.synthesis}”
            </p>
          </div>

          {/* Lo que gamificación no significa (Rutas descartables) */}
          <div className="p-6 rounded-2xl bg-canopy-950/60 border border-canopy-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-earth-300">
              <AlertOctagon className="w-4 h-4 text-editorial-accent" />
              <span>Lo que gamificación NO significa (falsas rutas que descartamos):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {content.whatItIsNot.map((item: string, idx: number) => {
                const isDiscarded = discardedNot.includes(item);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleDiscard(item)}
                    className={`p-3 rounded-lg text-xs text-left border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                      isDiscarded
                        ? 'bg-editorial-accent/20 border-editorial-accent/50 text-earth-300 line-through opacity-70'
                        : 'bg-canopy-900 border-canopy-800 text-earth-200 hover:border-canopy-700'
                    }`}
                  >
                    <span>{isDiscarded ? `✕ ${item}` : item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Principios Doctrinales */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-earth-100">
              Principios Doctrinales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.doctrinalPrinciples.map((principle: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-canopy-950 border border-canopy-800 space-y-2"
                >
                  <h4 className="font-serif font-semibold text-earth-100 text-base">
                    {principle.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-earth-300 font-sans leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
        className="mt-12 pt-8 border-t border-canopy-800 space-y-6"
      >
        <div className="p-6 rounded-2xl bg-canopy-900/60 border border-canopy-700/60 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
            Bifurcación del Río
          </span>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-earth-50">
            Una nueva corriente puede explorarse desde dos orillas:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              href="/territorios/territorio-2"
              className="p-5 rounded-xl bg-canopy-950 border border-canopy-700 hover:border-river-400 transition-all flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              <div>
                <span className="text-xs font-mono uppercase text-river-300 mb-1 block">
                  Opción A
                </span>
                <h4 className="font-serif font-bold text-base text-earth-50 group-hover:text-river-200">
                  ¿Qué necesidades puede ayudarnos a resolver?
                </h4>
                <p className="text-xs text-earth-300 mt-2">
                  Explorar las fuerzas que esta capacidad puede movilizar en el cauce.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-river-300 font-medium mt-4">
                <span>Ir al Territorio 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/territorios/territorio-3"
              className="p-5 rounded-xl bg-canopy-950 border border-canopy-700 hover:border-river-400 transition-all flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              <div>
                <span className="text-xs font-mono uppercase text-river-300 mb-1 block">
                  Opción B
                </span>
                <h4 className="font-serif font-bold text-base text-earth-50 group-hover:text-river-200">
                  ¿Qué nuevas experiencias permite diseñar?
                </h4>
                <p className="text-xs text-earth-300 mt-2">
                  Explorar los componentes que hacen posible una arquitectura gameful.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-river-300 font-medium mt-4">
                <span>Ir al Territorio 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <p className="text-xs font-mono text-earth-300 pt-2 text-center">
            Puedes comenzar por cualquiera de las dos. Ambas corrientes volverán a encontrarse en la confluencia.
          </p>
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
