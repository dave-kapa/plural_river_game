'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { InteractionConclusion } from '@/components/interactions/InteractionConclusion';
import {
  Compass,
  CheckCircle2,
  TreeDeciduous,
  GitBranch,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

function toComponentId(name: string): string {
  const clean = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `t3:comp:${clean}`;
}

export function Territory3View() {
  const data = TERRITORIES_DATA['territorio-3'];
  const content = data.specificContent;
  const { progress, saveTerritoryProgress, isTerritoryCompleted, registerDiscoveredItems, trackInteraction } = useProgression();

  const isAlreadyCompleted = progress.territoryStatus['territorio-3'] === 'completed';
  const t3Interactions = progress.territoryInteractions['territorio-3'] || {};

  // Zona activa y Zonas exploradas (Honest State Restoration)
  const initialExploredZones = t3Interactions.exploredZones && t3Interactions.exploredZones.length > 0
    ? t3Interactions.exploredZones
    : (isAlreadyCompleted
        ? content.zones.filter((z: any) => progress.discoveredItems.includes(`t3:zone:${z.id}`)).map((z: any) => z.id)
        : ['zone-roots']);

  const [activeZoneId, setActiveZoneId] = useState<string>(
    initialExploredZones[0] || 'zone-roots'
  );
  const [exploredZones, setExploredZones] = useState<string[]>(
    initialExploredZones.length > 0 ? initialExploredZones : ['zone-roots']
  );

  // Componente seleccionado dentro de la zona
  const [activeComponentName, setActiveComponentName] = useState<string | null>(null);

  // Registrar zona inicial al montar
  React.useEffect(() => {
    registerDiscoveredItems('t3:zone:zone-roots');
  }, [registerDiscoveredItems]);

  const handleSelectZone = async (zoneId: string) => {
    setActiveZoneId(zoneId);
    setActiveComponentName(null);
    const nextExplored = Array.from(new Set([...exploredZones, zoneId]));
    setExploredZones(nextExplored);
    await registerDiscoveredItems(`t3:zone:${zoneId}`);
    await trackInteraction({
      eventName: 'zone_explored',
      territoryId: 'territorio-3',
      targetId: zoneId,
    });

    // Progreso esencial: 4 de las 7 zonas exploradas
    if (nextExplored.length >= 4 && !isAlreadyCompleted) {
      await saveTerritoryProgress(
        'territorio-3',
        'completed',
        { exploredZones: nextExplored },
        data.journalPhrase
      );
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-3',
      });
    }
  };

  const handleSelectComponent = async (compName: string) => {
    const isCompSelected = activeComponentName === compName;
    setActiveComponentName(isCompSelected ? null : compName);
    if (!isCompSelected) {
      await registerDiscoveredItems(toComponentId(compName));
      await trackInteraction({
        eventName: 'component_opened',
        territoryId: 'territorio-3',
        targetId: compName,
      });
    }
  };

  const isCompleted = isAlreadyCompleted || exploredZones.length >= 4;
  const isTerritory2Completed = isTerritoryCompleted('territorio-2');

  // Registrar hábitats y formatos cuando se revela la sección
  React.useEffect(() => {
    if (exploredZones.length >= 3) {
      registerDiscoveredItems('t3:habitats:where-it-lives');
    }
  }, [exploredZones.length, registerDiscoveredItems]);

  const activeZone = content.zones.find((z: any) => z.id === activeZoneId) || content.zones[0];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Cabecera del Territorio */}
      <header className="space-y-4 border-b border-canopy-800 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-river-400">
            <Compass className="w-4 h-4 text-editorial-accent" />
            <span>Territorio 3 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
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

      {/* SECCIÓN 1: Zonas del Ecosistema */}
      <section aria-labelledby="ecosystem-zones-title" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Anatomía de la Arquitectura
            </span>
            <h2 id="ecosystem-zones-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50 mt-1">
              Zonas del ecosistema vivo
            </h2>
          </div>
          <span className="text-xs font-mono text-earth-300">
            {exploredZones.length} de {content.zones.length} zonas exploradas
          </span>
        </div>

        <p className="text-sm text-earth-300">
          Navega las distintas zonas del ecosistema para conocer los componentes constitutivos de un sistema gameful.
        </p>

        {/* Botones de navegación por zonas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {content.zones.map((zone: any, idx: number) => {
            const isActive = zone.id === activeZoneId;
            const isExplored = exploredZones.includes(zone.id);

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelectZone(zone.id)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                  isActive
                    ? 'bg-river-900 border-river-400 text-earth-50 ring-1 ring-river-400'
                    : isExplored
                    ? 'bg-canopy-900/70 border-canopy-700 text-earth-200 hover:border-river-500'
                    : 'bg-canopy-950/40 border-canopy-800 text-earth-400 hover:border-canopy-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono text-river-300">0{idx + 1}</span>
                  {isExplored && <CheckCircle2 className="w-3 h-3 text-river-400 shrink-0" />}
                </div>
                <span className="font-serif text-xs font-medium leading-tight">
                  {zone.name.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel de la zona activa y sus componentes */}
        {activeZone && (
          <div className="p-6 md:p-8 rounded-2xl bg-canopy-950/80 border border-canopy-700 space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-canopy-800 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-river-300 tracking-wider">
                  Estrato activo
                </span>
                <h3 className="font-serif font-bold text-xl text-earth-50 mt-0.5">
                  {activeZone.name}
                </h3>
              </div>
              <span className="text-xs font-serif italic text-editorial-gold">
                “{activeZone.metaphor}”
              </span>
            </div>

            <p className="text-xs sm:text-sm text-earth-300">
              Selecciona un componente para leer su definición y rol dentro de la arquitectura:
            </p>

            {/* Componentes de la zona */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeZone.components.map((comp: any) => {
                const isCompSelected = activeComponentName === comp.name;

                return (
                  <button
                    key={comp.name}
                    type="button"
                    onClick={() => handleSelectComponent(comp.name)}
                    className={`p-4 rounded-xl text-left border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                      isCompSelected
                        ? 'bg-river-950 border-river-400 text-earth-50 shadow-md ring-1 ring-river-400/40'
                        : 'bg-canopy-900/50 border-canopy-800 text-earth-200 hover:border-canopy-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-serif font-semibold text-sm sm:text-base text-earth-100">
                        {comp.name}
                      </h4>
                      <span className="text-[10px] font-mono text-river-400">
                        {isCompSelected ? 'Ocultar' : 'Ver detalle'}
                      </span>
                    </div>
                    <p className="text-xs text-earth-300 leading-relaxed">
                      {comp.definition}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: ¿Dónde puede vivir esta capacidad? */}
      {exploredZones.length >= 3 && (
        <section aria-labelledby="where-it-lives-title" className="space-y-6 pt-6 border-t border-canopy-800 animate-in fade-in duration-500">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
              Hábitats & Formatos
            </span>
            <h2 id="where-it-lives-title" className="text-2xl font-serif font-bold text-earth-50 mt-1">
              {content.whereItLives.title}
            </h2>
            <p className="text-xs sm:text-sm text-earth-300 mt-1">
              La capacidad gameful no depende de un único soporte ni se restringe a lo digital.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {content.whereItLives.habitats.map((habitat: string, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-canopy-950 border border-canopy-800 text-xs text-earth-200 font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-river-400 shrink-0" />
                <span>{habitat}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl bg-canopy-900/60 border border-canopy-800 space-y-2">
              <span className="text-xs font-mono uppercase text-editorial-accent font-semibold block">
                Distinción Clave
              </span>
              <p className="text-xs sm:text-sm text-earth-200 leading-relaxed font-serif">
                {content.whereItLives.distinction}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-river-950/60 border border-river-700/60 space-y-2">
              <span className="text-xs font-mono uppercase text-river-300 font-semibold block">
                Principio de Aplicación
              </span>
              <p className="text-xs sm:text-sm text-earth-200 leading-relaxed">
                {content.whereItLives.applicationPrinciple}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Conclusión e integración a la Bitácora */}
      {isCompleted && (
        <InteractionConclusion
          title="Ecosistema Vivo Registrado en la Bitácora"
          copy={data.conclusionCopy}
        />
      )}

      {/* Navegación según el estado de la otra corriente */}
      <nav
        aria-label="Navegación tras el Territorio 3"
        className="mt-12 pt-8 border-t border-canopy-800 space-y-6"
      >
        <div className="p-6 rounded-2xl bg-canopy-900/60 border border-canopy-700/60 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-editorial-accent">
            Estado de la Corriente
          </span>

          {!isTerritory2Completed ? (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-earth-50">
                Ya abrimos la arquitectura de diseño.
              </h3>
              <p className="text-sm text-earth-200">
                Sigamos la otra corriente y exploremos qué necesidades puede ayudar a resolver.
              </p>
              <div className="pt-2">
                <Link
                  href="/territorios/territorio-2"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-editorial-accent hover:bg-editorial-accent/90 text-white font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
                >
                  <span>Explorar qué puede resolver (Territorio 2)</span>
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
                Sigamos hasta la confluencia con el Método Plural.
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
