'use client';

import React from 'react';
import { TERRITORIES_DATA } from '@/data/territories';
import { TerritoryNode } from './TerritoryNode';
import { TributariesBranch } from './TributariesBranch';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { useVisualSet } from '@/lib/visual/VisualSetContext';

export function RiverMap() {
  const { progress, areCreditsUnlocked } = useProgression();
  const { getMapBg } = useVisualSet();

  // Estados de territorios
  const t1Status = progress.territoryStatus['territorio-1'] || 'unlocked';
  const t2Status = progress.territoryStatus['territorio-2'] || 'locked';
  const t3Status = progress.territoryStatus['territorio-3'] || 'locked';
  const t4Status = progress.territoryStatus['territorio-4'] || 'locked';
  const t5Status = progress.territoryStatus['territorio-5'] || 'locked';

  const t1Completed = t1Status === 'completed';
  const t2Completed = t2Status === 'completed';
  const t3Completed = t3Status === 'completed';
  const t4Completed = t4Status === 'completed';

  const mapBgUrl = getMapBg();

  return (
    <section aria-label="Mapa cartográfico del río" className="w-full space-y-12">
      {/* Contenedor del mapa fluvial con fondo atmosférico y trazado SVG */}
      <div className="relative w-full min-h-[820px] md:min-h-[880px] rounded-3xl bg-forest-950 border-2 border-jade-600/40 shadow-2xl overflow-hidden p-4 sm:p-8">
        {/* Capa de fondo con ilustración cartográfica en punto medio de legibilidad */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url(${mapBgUrl})` }}
        />

        {/* Gradiente de profundidad en punto medio para proteger la lectura de nodos */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-transparent to-forest-950/70 pointer-events-none" />

        {/* Capa de trazados fluviales orgánicos en SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradiente para cauces activos con agua turquesa luminosa */}
            <linearGradient id="riverFlowGradientActive" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5ce1e6" />
              <stop offset="50%" stopColor="#26b4d6" />
              <stop offset="100%" stopColor="#1e88a8" />
            </linearGradient>

            {/* Gradiente para lecho profundo de río */}
            <linearGradient id="riverBedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0c3542" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#134759" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0c3542" stopOpacity="0.9" />
            </linearGradient>

            {/* Gradiente para cauces secos/bloqueados */}
            <linearGradient id="riverBedGradientLocked" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0e2820" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#071510" stopOpacity="0.3" />
            </linearGradient>

            {/* Filtro de resplandor para corrientes desbloqueadas */}
            <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ============================================================
              1. LECHO PROFUNDO DEL RÍO (ANCHO Y ORGÁNICO)
              ============================================================ */}

          {/* Lecho T1 -> T2 (Bifurcación izquierda) */}
          <path
            d="M 500 150 C 440 220, 360 280, 280 380"
            fill="none"
            stroke={t1Completed ? "url(#riverBedGradient)" : "url(#riverBedGradientLocked)"}
            strokeWidth={t1Completed ? "26" : "12"}
            strokeLinecap="round"
          />

          {/* Lecho T1 -> T3 (Bifurcación derecha) */}
          <path
            d="M 500 150 C 560 220, 640 280, 720 380"
            fill="none"
            stroke={t1Completed ? "url(#riverBedGradient)" : "url(#riverBedGradientLocked)"}
            strokeWidth={t1Completed ? "26" : "12"}
            strokeLinecap="round"
          />

          {/* Lecho T2 -> T4 (Confluencia izquierda) */}
          <path
            d="M 280 430 C 330 530, 420 570, 500 630"
            fill="none"
            stroke={t2Completed ? "url(#riverBedGradient)" : "url(#riverBedGradientLocked)"}
            strokeWidth={t2Completed ? "26" : "12"}
            strokeLinecap="round"
          />

          {/* Lecho T3 -> T4 (Confluencia derecha) */}
          <path
            d="M 720 430 C 670 530, 580 570, 500 630"
            fill="none"
            stroke={t3Completed ? "url(#riverBedGradient)" : "url(#riverBedGradientLocked)"}
            strokeWidth={t3Completed ? "26" : "12"}
            strokeLinecap="round"
          />

          {/* Lecho T4 -> T5 (Cauce principal ancho hacia el Delta) */}
          <path
            d="M 500 680 C 500 730, 500 790, 500 860"
            fill="none"
            stroke={t4Completed ? "url(#riverBedGradient)" : "url(#riverBedGradientLocked)"}
            strokeWidth={t4Completed ? "32" : "14"}
            strokeLinecap="round"
          />

          {/* ============================================================
              2. CORRIENTE SUPERFICIAL LUMINOSA (AGUA FLUIDA)
              ============================================================ */}

          {/* Corriente T1 -> T2 */}
          {t1Completed && (
            <path
              d="M 500 150 C 440 220, 360 280, 280 380"
              fill="none"
              stroke="url(#riverFlowGradientActive)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="16 8"
              filter="url(#riverGlow)"
              className="animate-river-flow"
            />
          )}

          {/* Corriente T1 -> T3 */}
          {t1Completed && (
            <path
              d="M 500 150 C 560 220, 640 280, 720 380"
              fill="none"
              stroke="url(#riverFlowGradientActive)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="16 8"
              filter="url(#riverGlow)"
              className="animate-river-flow"
            />
          )}

          {/* Corriente T2 -> T4 */}
          {t2Completed && (
            <path
              d="M 280 430 C 330 530, 420 570, 500 630"
              fill="none"
              stroke="url(#riverFlowGradientActive)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="16 8"
              filter="url(#riverGlow)"
              className="animate-river-flow"
            />
          )}

          {/* Corriente T3 -> T4 */}
          {t3Completed && (
            <path
              d="M 720 430 C 670 530, 580 570, 500 630"
              fill="none"
              stroke="url(#riverFlowGradientActive)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="16 8"
              filter="url(#riverGlow)"
              className="animate-river-flow"
            />
          )}

          {/* Corriente T4 -> T5 */}
          {t4Completed && (
            <path
              d="M 500 680 C 500 730, 500 790, 500 860"
              fill="none"
              stroke="url(#riverFlowGradientActive)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="20 10"
              filter="url(#riverGlow)"
              className="animate-river-flow"
            />
          )}
        </svg>

        {/* Nodos de Territorios superpuestos en coordenadas relativas */}
        {/* Territorio 1: Naciente */}
        <TerritoryNode
          id="territorio-1"
          number={1}
          title={TERRITORIES_DATA['territorio-1'].narrativeTitle}
          functionalQuestion={TERRITORIES_DATA['territorio-1'].functionalQuestion}
          status={t1Status}
          x={50}
          y={15}
        />

        {/* Territorio 2: Bifurcación izquierda */}
        <TerritoryNode
          id="territorio-2"
          number={2}
          title={TERRITORIES_DATA['territorio-2'].narrativeTitle}
          functionalQuestion={TERRITORIES_DATA['territorio-2'].functionalQuestion}
          status={t2Status}
          x={30}
          y={38}
        />

        {/* Territorio 3: Bifurcación derecha */}
        <TerritoryNode
          id="territorio-3"
          number={3}
          title={TERRITORIES_DATA['territorio-3'].narrativeTitle}
          functionalQuestion={TERRITORIES_DATA['territorio-3'].functionalQuestion}
          status={t3Status}
          x={70}
          y={38}
        />

        {/* Territorio 4: Confluencia */}
        <TerritoryNode
          id="territorio-4"
          number={4}
          title={TERRITORIES_DATA['territorio-4'].narrativeTitle}
          functionalQuestion={TERRITORIES_DATA['territorio-4'].functionalQuestion}
          status={t4Status}
          x={50}
          y={63}
        />

        {/* Territorio 5: Delta inicial */}
        <TerritoryNode
          id="territorio-5"
          number={5}
          title={TERRITORIES_DATA['territorio-5'].narrativeTitle}
          functionalQuestion={TERRITORIES_DATA['territorio-5'].functionalQuestion}
          status={t5Status}
          x={50}
          y={86}
        />
      </div>

      {/* Sección final de Afluentes y Créditos */}
      <TributariesBranch
        isTerritory5Unlocked={t5Status === 'unlocked' || t5Status === 'visited' || t5Status === 'completed'}
        visitedTributaries={progress.visitedTributaries}
        creditsUnlocked={areCreditsUnlocked}
      />
    </section>
  );
}
