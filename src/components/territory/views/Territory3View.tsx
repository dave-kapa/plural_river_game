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
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  Lightbulb,
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
  const { progress, saveTerritoryProgress, isTerritoryCompleted, registerDiscoveredItems, trackInteraction, explorerName } = useProgression();
  const { getTerritoryBg } = useVisualSet();

  const isAlreadyCompleted = progress.territoryStatus['territorio-3'] === 'completed';
  const t3Interactions = progress.territoryInteractions['territorio-3'] || {};

  // Zona activa y Zonas exploradas (Honest State Restoration)
  const initialExploredZones = t3Interactions.exploredZones && t3Interactions.exploredZones.length > 0
    ? t3Interactions.exploredZones
    : [];

  // Por solicitud de diseño: ninguna zona abierta por defecto, solo al hacer clic en ella
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [exploredZones, setExploredZones] = useState<string[]>(initialExploredZones);
  const exploredZonesRef = useRef<string[]>(initialExploredZones);

  // Componente seleccionado dentro de la zona
  const [activeComponentName, setActiveComponentName] = useState<string | null>(null);
  const initialExploredComponents = t3Interactions.exploredComponents || [];
  const [exploredComponents, setExploredComponents] = useState<string[]>(initialExploredComponents);
  const exploredComponentsRef = useRef<string[]>(initialExploredComponents);

  // Mecánica de cocos: Total 30 cocos a repartir entre componentes (3=necesario, 2=ideal, 1=interesante, 0=prescindible)
  const TOTAL_COCOS = 30;
  const initialCocoAssignments = t3Interactions.cocoAssignments || {};
  const [cocoAssignments, setCocoAssignments] = useState<Record<string, number>>(initialCocoAssignments);
  const cocoAssignmentsRef = useRef<Record<string, number>>(initialCocoAssignments);
  const [cocoFeedback, setCocoFeedback] = useState<string | null>(null);

  const totalAssignedCocos = Object.values(cocoAssignments).reduce((sum, val) => sum + (val || 0), 0);
  const remainingCocos = Math.max(0, TOTAL_COCOS - totalAssignedCocos);

  const [exploredHabitats, setExploredHabitats] = useState<boolean>(
    t3Interactions.exploredHabitats || progress.discoveredItems.includes('t3:habitats:where-it-lives')
  );

  useEffect(() => {
    if (t3Interactions.exploredZones && t3Interactions.exploredZones.length > 0) {
      exploredZonesRef.current = t3Interactions.exploredZones;
      setExploredZones(t3Interactions.exploredZones);
    }
    if (t3Interactions.exploredComponents && t3Interactions.exploredComponents.length > 0) {
      exploredComponentsRef.current = t3Interactions.exploredComponents;
      setExploredComponents(t3Interactions.exploredComponents);
    }
    if (t3Interactions.cocoAssignments) {
      cocoAssignmentsRef.current = t3Interactions.cocoAssignments;
      setCocoAssignments(t3Interactions.cocoAssignments);
    }
  }, [t3Interactions.exploredZones, t3Interactions.exploredComponents, t3Interactions.cocoAssignments]);

  const handleSelectZone = async (zoneId: string) => {
    setActiveZoneId(zoneId);
    setActiveComponentName(null);
    const nextExplored = Array.from(new Set([...exploredZonesRef.current, zoneId]));
    exploredZonesRef.current = nextExplored;
    setExploredZones(nextExplored);
    await registerDiscoveredItems(`t3:zone:${zoneId}`);
    await trackInteraction({
      eventName: 'zone_explored',
      territoryId: 'territorio-3',
      targetId: zoneId,
    });

    const isNowComplete = nextExplored.length >= 4;
    await saveTerritoryProgress(
      'territorio-3',
      isNowComplete || isAlreadyCompleted ? 'completed' : 'visited',
      {
        ...t3Interactions,
        exploredZones: nextExplored,
        exploredComponents: exploredComponentsRef.current,
        cocoAssignments: cocoAssignmentsRef.current,
        activeZoneId: zoneId,
      },
      isNowComplete ? data.journalPhrase : undefined
    );

    if (isNowComplete && !isAlreadyCompleted) {
      await trackInteraction({
        eventName: 'territory_completed',
        territoryId: 'territorio-3',
      });
    }
  };

  const handleSelectComponent = async (compName: string) => {
    const isCompSelected = activeComponentName === compName;
    setActiveComponentName(isCompSelected ? null : compName);
    const compId = toComponentId(compName);
    const wasAlreadyExplored = exploredComponentsRef.current.includes(compName) || (progress.discoveredItems || []).includes(compId);

    if (!wasAlreadyExplored) {
      await registerDiscoveredItems(compId);
      await trackInteraction({
        eventName: 'component_opened',
        territoryId: 'territorio-3',
        targetId: compName,
      });
      const nextComponents = Array.from(new Set([...exploredComponentsRef.current, compName]));
      exploredComponentsRef.current = nextComponents;
      setExploredComponents(nextComponents);
      const isNowComplete = exploredZonesRef.current.length >= 4 || isAlreadyCompleted;
      await saveTerritoryProgress(
        'territorio-3',
        isNowComplete ? 'completed' : 'visited',
        {
          ...t3Interactions,
          exploredZones: exploredZonesRef.current,
          exploredComponents: nextComponents,
          cocoAssignments: cocoAssignmentsRef.current,
        }
      );
    }
  };

  const handleAssignCocos = async (compName: string, amount: number) => {
    const currentAmount = cocoAssignmentsRef.current[compName] ?? 0;
    const delta = amount - currentAmount;
    if (delta > 0 && remainingCocos < delta) {
      setCocoFeedback(`¡Límite de ${TOTAL_COCOS} cocos alcanzado! Reduce en otro componente para asignar más cocos aquí.`);
      setTimeout(() => setCocoFeedback(null), 3500);
      return;
    }
    const nextAssignments = {
      ...cocoAssignmentsRef.current,
      [compName]: amount,
    };
    cocoAssignmentsRef.current = nextAssignments;
    setCocoAssignments(nextAssignments);

    await saveTerritoryProgress(
      'territorio-3',
      isCompleted ? 'completed' : 'visited',
      {
        ...t3Interactions,
        exploredZones: exploredZonesRef.current,
        exploredComponents: exploredComponentsRef.current,
        cocoAssignments: nextAssignments,
      }
    );

    await trackInteraction({
      eventName: 'cocos_assigned',
      territoryId: 'territorio-3',
      targetId: compName,
      metadata: {
        amount,
        remaining: TOTAL_COCOS - Object.values(nextAssignments).reduce((a, b) => a + b, 0),
      },
    });
  };

  const handleExploreHabitats = async () => {
    setExploredHabitats(true);
    await registerDiscoveredItems('t3:habitats:where-it-lives');
    await trackInteraction({
      eventName: 'habitats_explored',
      territoryId: 'territorio-3',
    });
    const isNowComplete = exploredZonesRef.current.length >= 4 || isAlreadyCompleted;
    await saveTerritoryProgress(
      'territorio-3',
      isNowComplete ? 'completed' : 'visited',
      {
        ...t3Interactions,
        exploredZones: exploredZonesRef.current,
        exploredHabitats: true,
      }
    );
  };

  const isCompleted = isAlreadyCompleted || exploredZones.length >= 4 || exploredZonesRef.current.length >= 4;
  const isTerritory2Completed = isTerritoryCompleted('territorio-2');

  const activeZone = activeZoneId
    ? content.zones.find((z: any) => z.id === activeZoneId) || null
    : null;
  const selectedCompObj = (activeComponentName && activeZone)
    ? activeZone.components.find((c: any) => c.name === activeComponentName)
    : null;

  const bgUrl = getTerritoryBg('territorio-3');
  const t3DiscoveredCount = (progress.discoveredItems || []).filter((id) => id.startsWith('t3:')).length;

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
        territoryId="territorio-3"
        territoryTitle="Territorio 3: ¿Qué permite diseñar?"
        essentialTitle="Hitos Esenciales de Navegación"
        essentialItems={[
          {
            id: 'zones',
            label: `Explorar al menos 4 zonas del ecosistema vivo (${exploredZones.length}/4 exploradas)`,
            isDone: exploredZones.length >= 4,
          },
        ]}
        isEssentialComplete={isCompleted}
        discoveryItemsCount={t3DiscoveredCount}
        discoveryTotalCount={39}
        discoveryPercent={progress.territoryDiscoveryPercent['territorio-3'] || 0}
      />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-12">
        {/* Cabecera del Territorio */}
        <header className="space-y-4 border-b border-forest-800 pb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-water-300">
              <Compass className="w-4 h-4 text-solar-400" />
              <span>Territorio 3 — {isCompleted ? '✓ Recorrido' : 'En curso'}</span>
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

        {/* SECCIÓN 1: Zonas del Ecosistema */}
        <section aria-labelledby="ecosystem-zones-title" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
                Anatomía de la Arquitectura &middot; Priorización de Componentes
              </span>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <h2 id="ecosystem-zones-title" className="text-2xl sm:text-3xl font-serif font-bold text-earth-50">
                  Zonas del ecosistema vivo
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 border border-solar-500/60 text-solar-300 font-mono text-xs font-semibold shadow-sm">
                  🥥 {remainingCocos} cocos disponibles ({totalAssignedCocos}/30 asignados)
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-earth-300">
              {exploredZones.length} de {content.zones.length} zonas exploradas
            </span>
          </div>

          {/* Guía de la Mecánica de Cocos */}
          <div className="p-4 rounded-xl bg-forest-900/60 border border-forest-800 text-xs text-earth-200 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-solar-300 font-serif font-semibold">
              <span>🥥 Distribución de Recursos (30 Cocos):</span>
              <span className="text-earth-300 font-sans font-normal text-xs">
                Asigna cocos libremente según la relevancia de cada componente para tu propuesta:
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-lg bg-forest-950/70 border border-forest-800 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-solar-500/20 text-solar-300 font-mono font-bold text-xs">3</span>
                <span className="text-earth-200">Necesario</span>
              </div>
              <div className="p-2 rounded-lg bg-forest-950/70 border border-forest-800 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-water-500/20 text-water-300 font-mono font-bold text-xs">2</span>
                <span className="text-earth-200">Ideal</span>
              </div>
              <div className="p-2 rounded-lg bg-forest-950/70 border border-forest-800 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-jade-500/20 text-jade-300 font-mono font-bold text-xs">1</span>
                <span className="text-earth-200">Interesante</span>
              </div>
              <div className="p-2 rounded-lg bg-forest-950/70 border border-forest-800 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-earth-800/40 text-earth-400 font-mono font-bold text-xs">0</span>
                <span className="text-earth-300">Prescindible</span>
              </div>
            </div>
            {cocoFeedback && (
              <p className="text-xs font-mono text-amber-300 bg-amber-950/70 p-2 rounded border border-amber-800/70 animate-in fade-in">
                ⚠️ {cocoFeedback}
              </p>
            )}
          </div>

          <p className="text-sm text-earth-300">
            Navega las distintas zonas del ecosistema para conocer los componentes constitutivos de un sistema gameful.
          </p>

          {/* Botones de navegación por zonas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {content.zones.map((zone: any, idx: number) => {
              const isActive = zone.id === activeZoneId;
              const isExplored = exploredZones.includes(zone.id);
              const zoneCocos = (zone.components || []).reduce(
                (acc: number, c: any) => acc + (cocoAssignments[c.name] || 0),
                0
              );

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleSelectZone(zone.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 ${
                    isActive
                      ? 'bg-forest-900 border-water-400 text-earth-50 shadow-md ring-1 ring-water-400/50'
                      : isExplored
                      ? 'bg-forest-950/70 border-jade-600/40 text-earth-200 hover:border-water-500/50'
                      : 'bg-forest-950/40 border-forest-800 text-earth-400 hover:border-forest-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-water-300">0{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      {zoneCocos > 0 && (
                        <span className="text-[10px] font-mono text-solar-300 font-semibold" title={`${zoneCocos} cocos asignados`}>
                          🥥{zoneCocos}
                        </span>
                      )}
                      {isExplored && <CheckCircle2 className="w-3 h-3 text-jade-400 shrink-0" />}
                    </div>
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
            <div className="p-6 md:p-8 rounded-2xl bg-forest-950/85 border border-jade-600/40 backdrop-blur-sm space-y-6 shadow-xl animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest-800 pb-3">
                <div>
                  <span className="text-[11px] font-mono uppercase text-water-300 tracking-wider">
                    Estrato activo
                  </span>
                  <h3 className="font-serif font-bold text-xl text-earth-50 mt-0.5">
                    {activeZone.name}
                  </h3>
                </div>
                <span className="text-xs font-serif italic text-solar-300">
                  {formatQuotation(activeZone.metaphor, explorerName)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-earth-300">
                Haz clic en un componente para desplegar su definición y asigna cocos según su prioridad:
              </p>

              {/* Panel Pergamino de Componente Seleccionado si está activo */}
              {selectedCompObj && (
                <div className="p-5 md:p-6 rounded-xl bg-parchment-100 text-parchment-ink border border-parchment-300 shadow-md space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
                      Componente arquitectónico activo
                    </span>
                    <span className="text-xs font-mono text-parchment-muted">
                      Zona: {activeZone.name.split(':')[0]}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xl text-parchment-ink">
                    {selectedCompObj.name}
                  </h4>
                  <p className="text-sm text-parchment-ink font-sans leading-relaxed">
                    {selectedCompObj.definition}
                  </p>
                </div>
              )}

              {/* Componentes de la zona */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeZone.components.map((comp: any) => {
                  const isCompSelected = activeComponentName === comp.name;
                  const compId = toComponentId(comp.name);
                  const isExplored =
                    exploredComponents.includes(comp.name) ||
                    (progress.discoveredItems || []).includes(compId);
                  const assigned = cocoAssignments[comp.name] ?? 0;

                  return (
                    <div
                      key={comp.name}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCompSelected
                          ? 'bg-forest-900 border-water-400 shadow-md ring-1 ring-water-400/40'
                          : 'bg-forest-900/40 border-forest-800 hover:border-forest-700'
                      }`}
                    >
                      {/* Botón con sólo el título y el indicador tipo bombillo */}
                      <button
                        type="button"
                        onClick={() => handleSelectComponent(comp.name)}
                        className="w-full text-left flex items-center justify-between gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Lightbulb
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isExplored
                                ? 'text-solar-400 fill-solar-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                                : 'text-earth-600 group-hover:text-earth-400'
                            }`}
                            aria-label={isExplored ? 'Explorado' : 'Sin explorar'}
                          />
                          <h4 className="font-serif font-semibold text-sm sm:text-base text-earth-100 truncate">
                            {comp.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-water-400 shrink-0">
                          {isCompSelected ? 'Ocultar' : 'Ver definición'}
                        </span>
                      </button>

                      {/* Selector de asignación de cocos */}
                      <div className="mt-3 pt-2.5 border-t border-forest-800/80 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-mono text-earth-300">
                          Prioridad:
                        </span>
                        <div className="inline-flex rounded-lg bg-forest-950 p-0.5 border border-forest-800">
                          {[
                            { val: 0, label: '0 Prescindible', short: '0' },
                            { val: 1, label: '1 Interesante', short: '1' },
                            { val: 2, label: '2 Ideal', short: '2' },
                            { val: 3, label: '3 Necesario', short: '3' },
                          ].map((opt) => {
                            const isOptActive = assigned === opt.val;
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                title={opt.label}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignCocos(comp.name, opt.val);
                                }}
                                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                                  isOptActive
                                    ? opt.val === 3
                                      ? 'bg-solar-500 text-forest-950 font-bold shadow-sm'
                                      : opt.val === 2
                                      ? 'bg-water-500 text-forest-950 font-bold shadow-sm'
                                      : opt.val === 1
                                      ? 'bg-jade-500 text-forest-950 font-bold shadow-sm'
                                      : 'bg-earth-700 text-earth-200 font-bold'
                                    : 'text-earth-400 hover:text-earth-200 hover:bg-forest-900'
                                }`}
                              >
                                {opt.short} {opt.val > 0 ? '🥥' : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* SECCIÓN 2: ¿Dónde puede vivir esta capacidad? */}
        {exploredZones.length >= 3 && (
          <section aria-labelledby="where-it-lives-title" className="space-y-6 pt-6 border-t border-forest-800 animate-in fade-in duration-500">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-solar-400 font-semibold">
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
                <div key={idx} className="p-3 rounded-lg bg-forest-950 border border-forest-800 text-xs text-earth-200 font-sans flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-water-400 shrink-0" />
                  <span>{habitat}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-parchment-100 text-parchment-ink border border-parchment-300 shadow-md space-y-2">
                <span className="text-xs font-mono uppercase text-emerald-800 font-bold block">
                  Distinción Clave
                </span>
                <p className="text-xs sm:text-sm text-parchment-ink leading-relaxed font-serif">
                  {content.whereItLives.distinction}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-forest-900/80 border border-jade-600/50 space-y-2">
                <span className="text-xs font-mono uppercase text-water-300 font-semibold block">
                  Principio de Aplicación
                </span>
                <p className="text-xs sm:text-sm text-earth-200 leading-relaxed">
                  {content.whereItLives.applicationPrinciple}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-forest-900/60 border border-forest-800 mt-3">
              <span className="text-xs text-earth-300">
                {exploredHabitats ? '✓ Hábitats y formatos registrados en la bitácora' : 'Registra la diversidad de formatos donde habita la experiencia'}
              </span>
              {!exploredHabitats && (
                <button
                  type="button"
                  onClick={handleExploreHabitats}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-water-500 hover:bg-water-400 text-forest-950 font-bold text-xs shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explorar e integrar a la bitácora</span>
                </button>
              )}
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
                  {explorerName ? `${explorerName}, explora ` : 'Explora '}al menos 4 zonas del ecosistema ({exploredZones.length}/4) para completar este territorio.
                </p>
              </div>
            ) : !isTerritory2Completed ? (
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-earth-50">
                  {explorerName ? `¡Gran trabajo, ${explorerName}! Ya abrimos la arquitectura de diseño.` : 'Ya abrimos la arquitectura de diseño.'}
                </h3>
                <p className="text-sm text-earth-200">
                  Sigamos la otra corriente y exploremos qué necesidades puede ayudar a resolver.
                </p>
                <div className="pt-2">
                  <Link
                    href="/territorios/territorio-2"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-400 text-white font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 shadow-md"
                  >
                    <span>Explorar qué puede resolver (Territorio 2)</span>
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
                  Sigamos hasta la confluencia con el Método Plural.
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
