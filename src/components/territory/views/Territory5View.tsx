'use client';

import React from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { TRIBUTARIES_DATA, DELTA_ENCOUNTER_DATA } from '@/data/tributaries';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';
import { TerritoryProgressDualTracker } from '../TerritoryProgressDualTracker';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Award,
  Users,
} from 'lucide-react';

export function Territory5View() {
  const data = TERRITORIES_DATA['territorio-5'];
  const { progress, areCreditsUnlocked, saveTerritoryProgress, registerDiscoveredItems, trackInteraction, explorerName } = useProgression();
  const { getTerritoryBg } = useVisualSet();

  const visitedTributaries = progress.visitedTributaries || [];
  const allTributaryKeys = Object.keys(TRIBUTARIES_DATA);
  const allVisited = allTributaryKeys.every((k) => visitedTributaries.includes(k));

  const t5Interactions = progress.territoryInteractions['territorio-5'] || {};
  const [convergenceRegistered, setConvergenceRegistered] = React.useState<boolean>(
    t5Interactions.convergenceRegistered || progress.discoveredItems.includes('t5:encounter:convergence')
  );
  const [exploredModalities, setExploredModalities] = React.useState<string[]>(
    t5Interactions.exploredModalities ||
      DELTA_ENCOUNTER_DATA.modalities
        .filter((m: any) => progress.discoveredItems.includes(`t5:modality:${m.id}`))
        .map((m: any) => m.id)
  );

  // Guardar automáticamente como completado si se han visitado los 3 afluentes
  React.useEffect(() => {
    if (allVisited && progress.territoryStatus['territorio-5'] !== 'completed') {
      saveTerritoryProgress(
        'territorio-5',
        'completed',
        {
          ...t5Interactions,
          allVisited: true,
          convergenceRegistered,
          exploredModalities,
        },
        data.journalPhrase
      );
      trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-5',
      });
    }
  }, [allVisited, progress.territoryStatus, saveTerritoryProgress, data.journalPhrase, trackInteraction, t5Interactions, convergenceRegistered, exploredModalities]);

  const handleRegisterConvergence = async () => {
    setConvergenceRegistered(true);
    await registerDiscoveredItems('t5:encounter:convergence');
    await trackInteraction({
      eventName: 'delta_convergence_registered',
      territoryId: 'territorio-5',
    });
    const isNowComplete = allVisited || progress.territoryStatus['territorio-5'] === 'completed';
    await saveTerritoryProgress(
      'territorio-5',
      isNowComplete ? 'completed' : 'visited',
      {
        ...t5Interactions,
        allVisited,
        convergenceRegistered: true,
        exploredModalities,
      },
      isNowComplete ? data.journalPhrase : undefined
    );
  };

  const handleExploreModality = async (modId: string) => {
    const nextMods = Array.from(new Set([...exploredModalities, modId]));
    setExploredModalities(nextMods);
    await registerDiscoveredItems(`t5:modality:${modId}`);
    await trackInteraction({
      eventName: 'modality_explored',
      territoryId: 'territorio-5',
      targetId: modId,
    });
    const isNowComplete = allVisited || progress.territoryStatus['territorio-5'] === 'completed';
    await saveTerritoryProgress(
      'territorio-5',
      isNowComplete ? 'completed' : 'visited',
      {
        ...t5Interactions,
        allVisited,
        convergenceRegistered,
        exploredModalities: nextMods,
      },
      isNowComplete ? data.journalPhrase : undefined
    );
  };

  const bgUrl = getTerritoryBg('territorio-5');
  const t5DiscoveredCount = (progress.discoveredItems || []).filter((id) => id.startsWith('t5:')).length;

  return (
    <div className="relative w-full overflow-x-clip" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      {/* Fondo atmosférico en proporción de pantalla con opacidad calibrada (punto medio de legibilidad) */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* Filtro atmosférico en punto medio: profundidad equilibrada para proteger la lectura */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-forest-950/55 via-forest-950/70 to-forest-950/85 pointer-events-none" />

      {/* Línea 2 del HUD: Barra/Pestaña de Progreso y Faltante Fija en Scroll */}
      <TerritoryProgressDualTracker
        territoryId="territorio-5"
        territoryTitle="Territorio 5: El Delta y Nuevos Horizontes"
        essentialTitle="Hitos Esenciales de Navegación"
        essentialItems={[
          {
            id: 'tributaries',
            label: `Explorar los 3 afluentes divergentes (${visitedTributaries.length}/3 explorados)`,
            isDone: allVisited,
          },
        ]}
        isEssentialComplete={allVisited}
        discoveryItemsCount={t5DiscoveredCount}
        discoveryTotalCount={8}
        discoveryPercent={progress.territoryDiscoveryPercent['territorio-5'] || 0}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
        {/* Cabecera del Territorio */}
        <header className="space-y-4 border-b border-forest-800 pb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-water-300">
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Territorio 5 — {allVisited ? '✓ Recorrido' : 'En curso'}</span>
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

        {/* SECCIÓN 1: Los Tres Afluentes */}
        <section aria-labelledby="tributaries-title" className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
                El Delta
              </span>
              <h2 id="tributaries-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
                Tres afluentes divergentes
              </h2>
            </div>
            <span className="text-xs font-mono text-earth-300">
              {visitedTributaries.length} de {allTributaryKeys.length} afluentes explorados
            </span>
          </div>

          <p className="text-sm text-earth-300">
            Explora los tres afluentes en cualquier orden. Cada uno contiene su propósito, proyectos a los que aplica, preguntas de indagación y un punto de partida concreto.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {allTributaryKeys.map((key) => {
              const trib = TRIBUTARIES_DATA[key];
              const isVisited = visitedTributaries.includes(key);

              return (
                <div
                  key={key}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isVisited
                      ? 'bg-forest-900/90 border-water-400/60 shadow-lg ring-1 ring-water-400/30'
                      : 'bg-forest-950/60 border-forest-800 hover:border-water-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-solar-400 font-semibold">
                        Afluente
                      </span>
                      {isVisited && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-water-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-jade-400" />
                          <span>Explorado</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-earth-50 text-lg mb-2">
                      {trib.title}
                    </h3>

                    <p className="text-xs font-serif italic text-water-300 mb-3">
                      {trib.subtitle}
                    </p>

                    <p className="text-xs font-sans text-earth-300 leading-relaxed">
                      {trib.purpose}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-forest-800/80 mt-4">
                    <Link
                      href={`/afluentes/${key}`}
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-earth-100 text-xs font-medium border border-forest-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400"
                    >
                      <span>{isVisited ? 'Revisitar afluente' : 'Explorar preguntas y proyectos'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-water-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECCIÓN 2: En esta parte del río nos encontramos (Al visitar los 3 afluentes) */}
        {allVisited && (
          <section aria-labelledby="encounter-title" className="space-y-8 pt-8 border-t border-forest-800 animate-in fade-in duration-500">
            {/* Superficie Editorial Pergamino de Alto Contraste */}
            <div className="p-6 md:p-8 rounded-2xl bg-parchment-100 text-parchment-ink border border-parchment-300 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-300/80 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold">
                  Convergencia del Delta
                </span>
                {!convergenceRegistered ? (
                  <button
                    type="button"
                    onClick={handleRegisterConvergence}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Integrar a bitácora</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-emerald-800 font-semibold">✓ En bitácora</span>
                )}
              </div>
              <h2 id="encounter-title" className="text-2xl sm:text-3xl font-serif font-bold text-parchment-ink">
                {DELTA_ENCOUNTER_DATA.title}
              </h2>
              <p className="text-sm sm:text-base text-parchment-muted font-sans leading-relaxed">
                {DELTA_ENCOUNTER_DATA.lead}
              </p>

              <div className="p-4 rounded-xl bg-parchment-200/90 border-l-4 border-solar-500 text-parchment-ink text-base sm:text-lg font-serif italic">
                {formatQuotation(DELTA_ENCOUNTER_DATA.meetingQuestion, explorerName)}
              </div>
            </div>

            {/* Formas posibles de trabajar juntos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-earth-100">
                  {DELTA_ENCOUNTER_DATA.modalitiesTitle}
                </h3>
                <span className="text-xs font-mono text-water-300">
                  {exploredModalities.length} de {DELTA_ENCOUNTER_DATA.modalities.length} modalidades exploradas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DELTA_ENCOUNTER_DATA.modalities.map((mod: any) => {
                  const isExplored = exploredModalities.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleExploreModality(mod.id)}
                      className={`p-5 rounded-xl border text-left transition-all space-y-2 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 cursor-pointer ${
                        isExplored
                          ? 'bg-forest-950 border-jade-600/50 text-earth-100'
                          : 'bg-forest-950/60 border-forest-800 text-earth-300 hover:border-water-400/50 hover:bg-forest-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-earth-100 text-base">
                          {mod.title}
                        </h4>
                        <span className={`text-[10px] font-mono ${isExplored ? 'text-water-300' : 'text-earth-400'}`}>
                          {isExplored ? '✓ En bitácora' : 'Explorar modalidad'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-earth-300 font-sans leading-relaxed">
                        {mod.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-earth-400 italic pt-1">
                {DELTA_ENCOUNTER_DATA.clarification}
              </p>
            </div>
          </section>
        )}

        {/* Conclusión e integración a la Bitácora */}
        {allVisited && (
          <InteractionConclusion
            title="Delta Fluvial Registrado en la Bitácora"
            copy={DELTA_ENCOUNTER_DATA.closureCopy}
          />
        )}

        {/* Navegación final hacia los créditos */}
        <nav
          aria-label="Navegación tras el Territorio 5"
          className="mt-12 pt-8 border-t border-forest-800 space-y-6"
        >
          <div className="p-6 rounded-2xl bg-forest-900/70 border border-forest-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-earth-50">
                {allVisited ? 'Desembocadura alcanzada' : 'Delta en exploración'}
              </h3>
              <p className="text-xs sm:text-sm text-earth-300">
                {allVisited
                  ? (explorerName ? `Todos los afluentes han sido recorridos por ${explorerName}. Los créditos y el epílogo están listos.` : 'Todos los afluentes han sido recorridos. La sección de créditos y el epílogo están listos.')
                  : (explorerName ? `${explorerName}, explora los tres afluentes para desbloquear los créditos de la travesía.` : 'Explora los tres afluentes para desbloquear los créditos de la travesía.')}
              </p>
            </div>

            {areCreditsUnlocked ? (
              <Link
                href="/creditos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-solar-500 text-forest-950 font-bold text-sm hover:bg-solar-400 shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shrink-0"
              >
                <Award className="w-4 h-4" />
                <span>Acceder a los Créditos de la Travesía</span>
              </Link>
            ) : (
              <Link
                href="/mapa"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-900 text-earth-200 text-xs font-medium border border-forest-700"
              >
                <Compass className="w-4 h-4 text-solar-400" />
                <span>Volver al río</span>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </div>
  );
}
