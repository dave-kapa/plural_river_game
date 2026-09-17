'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
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
} from 'lucide-react';

export function Territory2View() {
  const data = TERRITORIES_DATA['territorio-2'];
  const content = data.specificContent;
  const { progress, saveTerritoryProgress, isTerritoryCompleted, registerDiscoveredItems } = useProgression();

  const isAlreadyCompleted = progress.territoryStatus['territorio-2'] === 'completed';

  // Paso 1: Exploración de las 3 fuerzas
  const [activeForceId, setActiveForceId] = useState<string>('force-scale');
  const [exploredForces, setExploredForces] = useState<string[]>(
    isAlreadyCompleted ? content.threeForces.map((f: any) => f.id) : ['force-scale']
  );

  // Paso 2: Acordeón de capacidades adicionales
  const [expandedCapacityId, setExpandedCapacityId] = useState<string | null>(null);

  // Registrar fuerza inicial al montar
  React.useEffect(() => {
    registerDiscoveredItems('t2:force:force-scale');
  }, [registerDiscoveredItems]);

  const handleSelectForce = async (forceId: string) => {
    setActiveForceId(forceId);
    const nextExplored = Array.from(new Set([...exploredForces, forceId]));
    setExploredForces(nextExplored);
    await registerDiscoveredItems(`t2:force:${forceId}`);

    if (nextExplored.length >= 3 && !isAlreadyCompleted) {
      await saveTerritoryProgress(
        'territorio-2',
        'completed',
        { exploredForces: nextExplored },
        data.journalPhrase
      );
    }
  };

  const allThreeForcesDiscovered = exploredForces.length >= 3 || isAlreadyCompleted;
  const isCompleted = isAlreadyCompleted || allThreeForcesDiscovered;

  // Registrar escalas de cambio cuando se revelan tras descubrir las 3 fuerzas
  React.useEffect(() => {
    if (allThreeForcesDiscovered) {
      registerDiscoveredItems([
        't2:scale:persona',
        't2:scale:relaciones-y-comunidad',
        't2:scale:accion-colectiva',
        't2:scale:cultura-y-sistema',
      ]);
    }
  }, [allThreeForcesDiscovered, registerDiscoveredItems]);

  const handleToggleCapacity = async (capId: string) => {
    const isOpening = expandedCapacityId !== capId;
    setExpandedCapacityId(isOpening ? capId : null);
    if (isOpening) {
      await registerDiscoveredItems(`t2:capacity:${capId}`);
    }
  };

  const isTerritory3Completed = isTerritoryCompleted('territorio-3');

  const activeForce = content.threeForces.find((f: any) => f.id === activeForceId) || content.threeForces[0];

  const getForceIcon = (id: string) => {
    switch (id) {
      case 'force-scale':
        return <TrendingUp className="w-4 h-4 text-river-300" />;
      case 'force-measure':
        return <LineChart className="w-4 h-4 text-river-300" />;
      case 'force-innovation':
        return <Lightbulb className="w-4 h-4 text-river-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-river-300" />;
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Cabecera del Territorio */}
      <header className="space-y-4 border-b border-canopy-800 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-river-400">
            <Compass className="w-4 h-4 text-editorial-accent" />
            <span>Territorio 2 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
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

      {/* SECCIÓN 1: Tres fuerzas principales */}
      <section aria-labelledby="three-forces-title" className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
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
                className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                  isActive
                    ? 'bg-river-900/90 border-river-400 text-earth-50 ring-1 ring-river-400'
                    : isDiscovered
                    ? 'bg-canopy-900/60 border-canopy-700 text-earth-200 hover:border-river-500'
                    : 'bg-canopy-950/40 border-canopy-800 text-earth-300 hover:border-canopy-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {getForceIcon(force.id)}
                    <span className="text-[10px] font-mono text-river-300">
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
                <span className="text-xs text-earth-400 font-mono mt-4 block">
                  Examinar fuerza →
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel de detalle de la fuerza activa */}
        {activeForce && (
          <div className="p-6 md:p-8 rounded-2xl bg-canopy-950/90 border border-canopy-700 space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-canopy-800 pb-3">
              <div className="flex items-center gap-2">
                {getForceIcon(activeForce.id)}
                <span className="font-serif font-bold text-lg text-earth-100">
                  {activeForce.title}
                </span>
              </div>
              <span className="text-xs font-mono text-editorial-gold font-medium">
                {activeForce.copyBrief}
              </span>
            </div>

            <p className="text-sm sm:text-base text-earth-200 font-sans leading-relaxed">
              {activeForce.description}
            </p>

            <div className="space-y-2.5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-river-300">
                Aportes clave al Método Plural:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-earth-200">
                {activeForce.points.map((pt: string, idx: number) => (
                  <li key={idx} className="p-3 rounded-lg bg-canopy-900/60 border border-canopy-800/80 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-river-400 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-river-950/70 border border-river-700/60 text-xs sm:text-sm text-river-200">
              <strong className="font-mono text-river-300 block mb-1">Distinción fundamental:</strong>
              <p>{activeForce.distinction}</p>
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: Desbloqueo de Capacidades Adicionales */}
      {allThreeForcesDiscovered && (
        <section aria-labelledby="additional-capacities-title" className="space-y-6 pt-6 border-t border-canopy-800 animate-in fade-in duration-500">
          <div className="p-5 rounded-2xl bg-river-950/60 border border-river-600/50">
            <span className="text-xs font-mono uppercase tracking-widest text-river-300 block mb-1">
              Desbloqueo de Corriente
            </span>
            <p className="text-base sm:text-lg font-serif italic text-earth-100">
              “{content.unlockNotice}”
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
              return (
                <div
                  key={cap.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-canopy-950 border-river-400/60 shadow-md ring-1 ring-river-400/30'
                      : 'bg-canopy-950/60 border-canopy-800 hover:border-canopy-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleCapacity(cap.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-editorial-accent" />
                        <h3 className="font-serif font-bold text-earth-100 text-base">
                          {cap.title}
                        </h3>
                      </div>
                      <p className="text-xs text-river-300 mt-1 font-serif italic">
                        {cap.copyBrief}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-earth-400 transition-transform duration-300 shrink-0 mt-1 ${
                        isOpen ? 'rotate-180 text-river-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-canopy-800/60 space-y-4 text-xs sm:text-sm text-earth-200 animate-in fade-in duration-300">
                      {cap.body && <p className="leading-relaxed">{cap.body}</p>}

                      {cap.dimensions && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-river-300 block">
                            Dimensiones de la arquitectura motivacional:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {cap.dimensions.map((dim: any, idx: number) => (
                              <div key={idx} className="p-3 rounded-lg bg-canopy-900/60 border border-canopy-800">
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
        <section aria-labelledby="change-scale-title" className="space-y-6 pt-6 border-t border-canopy-800 animate-in fade-in duration-500">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Perspectiva Sistémica
            </span>
            <h2 id="change-scale-title" className="text-2xl font-serif font-bold text-earth-50 mt-1">
              {content.changeScales.title}
            </h2>
            <p className="text-xs sm:text-sm text-earth-200 mt-2 font-serif italic p-3 rounded-xl bg-canopy-900/40 border border-canopy-800">
              “{content.changeScales.copyIntegrator}”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.changeScales.layers.map((layer: any, idx: number) => (
              <div key={idx} className="p-5 rounded-xl bg-canopy-950 border border-canopy-800 space-y-2">
                <span className="text-xs font-mono text-river-300 font-semibold block uppercase tracking-wider">
                  0{idx + 1} — {layer.name}
                </span>
                <p className="text-xs text-earth-300 font-sans leading-relaxed">
                  {layer.focus}
                </p>
                <div className="pt-2 border-t border-canopy-900 text-xs font-serif italic text-editorial-gold">
                  {layer.question}
                </div>
              </div>
            ))}
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
        className="mt-12 pt-8 border-t border-canopy-800 space-y-6"
      >
        <div className="p-6 rounded-2xl bg-canopy-900/60 border border-canopy-700/60 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
            Estado de la Corriente
          </span>

          {!isTerritory3Completed ? (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-earth-50">
                Ya conocemos las fuerzas que esta capacidad puede movilizar.
              </h3>
              <p className="text-sm text-earth-200">
                Crucemos hacia la otra corriente y descubramos de qué está hecho un sistema gameful.
              </p>
              <div className="pt-2">
                <Link
                  href="/territorios/territorio-3"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
                >
                  <span>Explorar qué permite diseñar (Territorio 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-earth-50">
                Las dos corrientes están completas.
              </h3>
              <p className="text-sm text-earth-200">
                Es momento de observar dónde vuelven a encontrarse: dentro del Método Plural.
              </p>
              <div className="pt-2">
                <Link
                  href="/territorios/territorio-4"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
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
