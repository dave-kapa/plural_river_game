'use client';

import React from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { TRIBUTARIES_DATA, DELTA_ENCOUNTER_DATA } from '@/data/tributaries';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
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
  const { progress, areCreditsUnlocked, saveTerritoryProgress, registerDiscoveredItems, trackInteraction } = useProgression();

  const visitedTributaries = progress.visitedTributaries || [];
  const allTributaryKeys = Object.keys(TRIBUTARIES_DATA);
  const allVisited = allTributaryKeys.every((k) => visitedTributaries.includes(k));

  // Guardar automáticamente como completado si se han visitado los 3
  React.useEffect(() => {
    if (allVisited && progress.territoryStatus['territorio-5'] !== 'completed') {
      saveTerritoryProgress(
        'territorio-5',
        'completed',
        { allVisited: true },
        data.journalPhrase
      );
      trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-5',
      });
    }
  }, [allVisited, progress.territoryStatus, saveTerritoryProgress, data.journalPhrase, trackInteraction]);

  // Registrar modalidades de colaboración y encuentro al revelar la convergencia
  React.useEffect(() => {
    if (allVisited) {
      registerDiscoveredItems([
        't5:modality:diagnostico',
        't5:modality:prototipo',
        't5:modality:capacitacion',
        't5:modality:integracion',
        't5:encounter:convergence',
      ]);
    }
  }, [allVisited, registerDiscoveredItems]);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Cabecera del Territorio */}
      <header className="space-y-4 border-b border-canopy-800 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-river-400">
            <Compass className="w-4 h-4 text-editorial-accent" />
            <span>Territorio 5 — {allVisited ? '✓ Recorrido' : 'En curso'}</span>
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

      {/* SECCIÓN 1: Los Tres Afluentes */}
      <section aria-labelledby="tributaries-title" className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
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
                    ? 'bg-river-950/80 border-river-400/50 shadow-md ring-1 ring-river-400/30'
                    : 'bg-canopy-950/60 border-canopy-800 hover:border-river-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-editorial-accent">
                      Afluente
                    </span>
                    {isVisited && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-river-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Explorado</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-earth-50 text-lg mb-2">
                    {trib.title}
                  </h3>

                  <p className="text-xs font-serif italic text-river-300 mb-3">
                    {trib.subtitle}
                  </p>

                  <p className="text-xs font-sans text-earth-300 leading-relaxed">
                    {trib.purpose}
                  </p>
                </div>

                <div className="pt-6 border-t border-canopy-800/80 mt-4">
                  <Link
                    href={`/afluentes/${key}`}
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-canopy-900 hover:bg-river-800 text-earth-100 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
                  >
                    <span>{isVisited ? 'Revisitar afluente' : 'Explorar preguntas y proyectos'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN 2: En esta parte del río nos encontramos (Al visitar los 3 afluentes) */}
      {allVisited && (
        <section aria-labelledby="encounter-title" className="space-y-8 pt-8 border-t border-canopy-800 animate-in fade-in duration-500">
          <div className="p-6 md:p-8 rounded-2xl bg-canopy-950/90 border border-river-700/60 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-river-300">
              Convergencia del Delta
            </span>
            <h2 id="encounter-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50">
              {DELTA_ENCOUNTER_DATA.title}
            </h2>
            <p className="text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
              {DELTA_ENCOUNTER_DATA.lead}
            </p>

            <div className="p-4 rounded-xl bg-river-950 border-l-4 border-editorial-gold text-earth-100 text-base sm:text-lg font-serif italic">
              {DELTA_ENCOUNTER_DATA.meetingQuestion}
            </div>
          </div>

          {/* Formas posibles de trabajar juntos */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-earth-100">
              {DELTA_ENCOUNTER_DATA.modalitiesTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DELTA_ENCOUNTER_DATA.modalities.map((mod: any) => (
                <div key={mod.id} className="p-5 rounded-xl bg-canopy-950 border border-canopy-800 space-y-2">
                  <h4 className="font-serif font-bold text-earth-100 text-base">
                    {mod.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-earth-300 font-sans leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              ))}
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
        className="mt-12 pt-8 border-t border-canopy-800 space-y-6"
      >
        <div className="p-6 rounded-2xl bg-canopy-900/60 border border-canopy-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-earth-50">
              {allVisited ? 'Desembocadura alcanzada' : 'Delta en exploración'}
            </h3>
            <p className="text-xs sm:text-sm text-earth-300">
              {allVisited
                ? 'Todos los afluentes han sido recorridos. La sección de créditos y el epílogo están listos.'
                : 'Explora los tres afluentes para desbloquear los créditos de la travesía.'}
            </p>
          </div>

          {areCreditsUnlocked ? (
            <Link
              href="/creditos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-editorial-gold text-canopy-950 font-bold text-sm hover:brightness-110 shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Acceder a los Créditos de la Travesía</span>
            </Link>
          ) : (
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-canopy-900 text-earth-200 text-xs font-medium border border-canopy-700"
            >
              <Compass className="w-4 h-4" />
              <span>Volver al río</span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
