'use client';

import React, { useState } from 'react';
import { Compass, BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp, Info, Check, Sparkles } from 'lucide-react';
import { DISCOVERY_REGISTRY, TerritoryId } from '@/lib/progression/discoveryRegistry';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';

export interface EssentialItem {
  id: string;
  label: string;
  isDone: boolean;
}

interface TerritoryProgressDualTrackerProps {
  territoryId?: TerritoryId;
  territoryTitle: string;
  essentialTitle: string;
  essentialItems: EssentialItem[];
  isEssentialComplete: boolean;
  discoveryItemsCount: number;
  discoveryTotalCount: number;
  discoveryPercent: number;
}

export function TerritoryProgressDualTracker({
  territoryId,
  territoryTitle,
  essentialTitle,
  essentialItems,
  isEssentialComplete,
  discoveryItemsCount,
  discoveryTotalCount,
  discoveryPercent,
}: TerritoryProgressDualTrackerProps) {
  const { progress, registerDiscoveredItems, explorerName } = useProgression();
  const { getTerritoryBg } = useVisualSet();
  const [isOpen, setIsOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const completedEssentialCount = essentialItems.filter((i) => i.isDone).length;
  const totalEssentialCount = essentialItems.length;

  const registryItems = territoryId ? DISCOVERY_REGISTRY[territoryId] || [] : [];
  const discoveredSet = new Set(progress.discoveredItems || []);
  const bgUrl = territoryId ? getTerritoryBg(territoryId) : '';
  const territoryNumber = territoryId ? territoryId.replace('territorio-', '') : '';

  const essentialPendingCount = Math.max(0, totalEssentialCount - completedEssentialCount);
  const discoveryPendingCount = Math.max(0, discoveryTotalCount - discoveryItemsCount);

  return (
    <aside
      aria-label="Segunda línea del HUD: Avance de este territorio"
      className="sticky top-16 z-30 w-full border-b border-jade-500/40 border-t border-emerald-500/20 bg-gradient-to-r from-[#06201b]/95 via-[#0b2f28]/95 to-[#072422]/95 backdrop-blur-md shadow-lg transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Barra compacta de la 2da línea del HUD */}
        <div className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* LADO IZQUIERDO: Miniatura visual con degradé e indicador de territorio */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Versión miniatura con degradé atmosférico de la imagen de fondo */}
            <div className="relative h-10 w-24 sm:w-32 rounded-lg overflow-hidden shrink-0 border border-jade-500/40 shadow-inner bg-forest-950 group">
              {bgUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${bgUrl})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-forest-900" />
              )}
              {/* Degradé lateral que funde la miniatura hacia el fondo del HUD */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0b2f28]/40 to-[#0b2f28]/95" />
              <div className="absolute inset-0 flex items-center px-2">
                <span className="text-[11px] font-mono font-bold text-solar-300 drop-shadow uppercase tracking-wider">
                  {territoryNumber ? `T${territoryNumber}` : 'T'}
                </span>
              </div>
            </div>

            {/* Identificador explícito de avance sobre este territorio */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-wider bg-solar-500/20 text-solar-300 border border-solar-500/40 font-bold shrink-0 flex items-center gap-1 shadow-sm">
                  <Compass className="w-2.5 h-2.5 text-solar-400" />
                  <span>Avance de este Territorio</span>
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold text-earth-50 truncate max-w-[200px] sm:max-w-xs">
                  {territoryTitle}
                </span>
              </div>
              <span className="text-[10px] font-mono text-earth-300 hidden sm:inline pt-0.5">
                {explorerName ? <strong className="text-solar-300 font-normal">Explorador {explorerName} • </strong> : null}
                {isEssentialComplete ? '✓ Corrientes siguientes habilitadas' : 'Completa los hitos indispensables para abrir corriente'}
              </span>
            </div>
          </div>

          {/* CENTRO: Visualización de las 2 barras de progreso (avance y faltante claros) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 flex-1 max-w-xl">
            {/* Barra 1: Hitos Esenciales (Requisito para continuar) */}
            <div className="flex-1 min-w-[140px] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono leading-tight">
                <span className="text-earth-200 flex items-center gap-1 font-medium">
                  <span className={isEssentialComplete ? 'text-emerald-400 font-bold' : 'text-solar-400'}>
                    {isEssentialComplete ? '✓' : '○'}
                  </span>
                  <span>Hitos indispensables:</span>
                </span>
                <span className="font-semibold text-earth-100">
                  {completedEssentialCount}/{totalEssentialCount}
                </span>
              </div>

              {/* Barra de progreso visual (muestra avance lleno y faltante vacío) */}
              <div
                className="w-full h-2 rounded-full bg-forest-950/90 border border-forest-800/90 overflow-hidden flex"
                title={`Hitos: ${completedEssentialCount} de ${totalEssentialCount} completados`}
              >
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isEssentialComplete
                      ? 'bg-gradient-to-r from-emerald-500 to-jade-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                      : 'bg-gradient-to-r from-solar-500 to-amber-400'
                  }`}
                  style={{
                    width: `${totalEssentialCount > 0 ? (completedEssentialCount / totalEssentialCount) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Indicador textual del faltante */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={isEssentialComplete ? 'text-emerald-300 font-medium' : 'text-solar-300'}>
                  {isEssentialComplete ? '✓ Listos para avanzar' : `Faltan ${essentialPendingCount} para abrir paso`}
                </span>
                <span className="text-earth-400/80 text-[9px]">Obligatorio</span>
              </div>
            </div>

            {/* Barra 2: Bitácora Conceptual (Descubrimiento voluntario) */}
            <div className="flex-1 min-w-[140px] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono leading-tight">
                <span className="text-earth-200 flex items-center gap-1 font-medium">
                  <BookOpen className="w-3 h-3 text-water-400 shrink-0" />
                  <span>Bitácora conceptual:</span>
                </span>
                <span className="font-semibold text-water-300">
                  {discoveryItemsCount}/{discoveryTotalCount} ({discoveryPercent}%)
                </span>
              </div>

              {/* Barra de progreso visual (muestra avance lleno y faltante vacío) */}
              <div
                className="w-full h-2 rounded-full bg-forest-950/90 border border-forest-800/90 overflow-hidden flex"
                title={`Bitácora: ${discoveryItemsCount} de ${discoveryTotalCount} conceptos descubiertos (${discoveryPercent}%)`}
              >
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    discoveryPercent === 100
                      ? 'bg-gradient-to-r from-jade-400 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                      : 'bg-gradient-to-r from-water-500 to-jade-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, discoveryPercent))}%` }}
                />
              </div>

              {/* Indicador textual del faltante */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={discoveryPercent === 100 ? 'text-emerald-300 font-medium' : 'text-earth-300'}>
                  {discoveryPercent === 100 ? '✓ 100% registrado' : `Faltan ${discoveryPendingCount} conceptos`}
                </span>
                <span className="text-earth-400/80 text-[9px]">Voluntario</span>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: Botón de despliegue de detalles */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-3.5 py-1.5 rounded-lg bg-forest-900/90 hover:bg-forest-800 border border-jade-600/50 hover:border-water-400 text-earth-100 text-xs font-mono transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-water-400 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
              aria-expanded={isOpen}
            >
              <span>{isOpen ? 'Ocultar detalles' : 'Ver detalles'}</span>
              {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-solar-300" /> : <ChevronDown className="w-3.5 h-3.5 text-solar-300" />}
            </button>
          </div>
        </div>

        {/* Panel desplegable con los dos carriles detallados */}
        {isOpen && (
          <div className="pb-5 pt-3 border-t border-forest-800/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
              {/* CARRIL 1: HITOS ESENCIALES */}
              <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-earth-100 font-semibold flex items-center gap-1.5">
                    <span>Hitos para Abrir Siguiente Corriente</span>
                  </span>
                  <span className="text-xs font-mono text-solar-300 font-bold">
                    {completedEssentialCount}/{totalEssentialCount}
                  </span>
                </div>

                <p className="text-[11px] text-earth-300 font-sans">
                  Requisitos indispensables de interacción para completar este territorio y desbloquear el cauce siguiente:
                </p>

                <ul className="space-y-1.5 text-xs font-sans">
                  {essentialItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-start gap-2 p-1.5 rounded transition-colors ${
                        item.isDone ? 'text-earth-200 bg-jade-950/30' : 'text-earth-300/80'
                      }`}
                    >
                      {item.isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-jade-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-solar-400/70 shrink-0 mt-0.5" />
                      )}
                      <span className={item.isDone ? 'font-medium text-earth-100' : ''}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CARRIL 2: REGISTRO DE LA BITÁCORA CONCEPTUAL */}
              <div className="p-4 rounded-xl bg-forest-900/80 border border-forest-700/80 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-water-300 font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-water-400" />
                      <span>Bitácora Conceptual</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-water-950/80 border border-water-700/60 text-water-300 font-medium">
                      Opcional • No bloquea el viaje
                    </span>
                  </div>

                  <p className="text-[11px] text-earth-300 font-sans leading-relaxed">
                    Inventario de conceptos y principios registrados en tu bitácora personal al interactuar con el texto:
                  </p>

                  {/* Barra de progreso con avance y faltante visible */}
                  <div
                    className="w-full h-2 rounded-full bg-forest-950 border border-forest-800 overflow-hidden"
                    role="progressbar"
                    aria-label="Porcentaje de conceptos explorados en la bitácora"
                    aria-valuenow={discoveryPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-water-600 via-water-400 to-solar-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, discoveryPercent)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-forest-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-earth-300">
                    <span>Conceptos explorados:</span>
                    <span className="text-earth-100 font-semibold">
                      {discoveryItemsCount} de {discoveryTotalCount} ({discoveryPercent}%)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {registryItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowDetail(!showDetail)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-water-300 hover:text-water-200 transition-colors cursor-pointer"
                      >
                        <span>{showDetail ? 'Ocultar lista de conceptos' : '¿Qué conceptos componen este registro?'}</span>
                        {showDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalle desplegable de conceptos específicos */}
            {showDetail && registryItems.length > 0 && (
              <div className="p-4 rounded-xl bg-forest-950/90 border border-forest-700 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs text-earth-200 border-b border-forest-800 pb-2">
                  <span className="font-semibold text-water-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Conceptos registrables en este territorio:</span>
                  </span>
                  <span className="font-mono text-[11px] text-earth-400">
                    {discoveryItemsCount} / {registryItems.length} registrados
                  </span>
                </div>
                <p className="text-[11px] text-earth-300 italic font-sans">
                  Se van registrando en tu bitácora conforme interactúas con las secciones de este territorio. No necesitas completarlos todos para continuar.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 text-xs">
                  {registryItems.map((item) => {
                    const isFound = discoveredSet.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-2 rounded-lg border flex items-center gap-2 ${
                          isFound
                            ? 'bg-jade-950/40 border-jade-600/40 text-earth-200'
                            : 'bg-forest-950/60 border-forest-800 text-earth-400/70'
                        }`}
                      >
                        {isFound ? (
                          <Check className="w-3.5 h-3.5 text-jade-400 shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-earth-500 shrink-0" />
                        )}
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

