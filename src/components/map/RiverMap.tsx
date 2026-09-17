'use client';

import React from 'react';
import { TERRITORIES_DATA } from '@/data/territories';
import { TerritoryNode } from './TerritoryNode';
import { TributariesBranch } from './TributariesBranch';
import { useProgression } from '@/lib/progression/ProgressionContext';

export function RiverMap() {
  const { progress, areCreditsUnlocked } = useProgression();

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

  return (
    <section aria-label="Mapa cartográfico del río" className="w-full space-y-12">
      {/* Contenedor del mapa fluvial con SVG */}
      <div className="relative w-full min-h-[720px] md:min-h-[820px] rounded-3xl bg-canopy-950 border border-canopy-800/80 shadow-2xl overflow-hidden p-4 sm:p-8">
        {/* Fondo con capas abstractas de vegetación tropical y niebla */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="foliage-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#224c3b" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M10,40 Q40,10 70,40 Q40,70 10,40" fill="none" stroke="#2f6750" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#foliage-pattern)" />
          </svg>
        </div>

        {/* Gradiente sutil de profundidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-canopy-950 via-transparent to-canopy-950/90 pointer-events-none" />

        {/* Capa de trazados fluviales en SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradiente para cauces activos */}
            <linearGradient id="riverGradientActive" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#65b5ba" />
              <stop offset="50%" stopColor="#45969c" />
              <stop offset="100%" stopColor="#245a5e" />
            </linearGradient>

            {/* Gradiente para cauces secos/bloqueados */}
            <linearGradient id="riverGradientLocked" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#18362a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10231b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Cauce 1: De Naciente (500, 140) hacia bifurcación T2 (300, 360) y T3 (700, 360) */}
          <path
            d="M 500 160 Q 420 240 300 360"
            fill="none"
            stroke={t1Completed ? "url(#riverGradientActive)" : "url(#riverGradientLocked)"}
            strokeWidth={t1Completed ? "8" : "4"}
            strokeLinecap="round"
            strokeDasharray={t1Completed ? "12 6" : "4 4"}
            className={t1Completed ? "animate-river-flow" : ""}
          />
          <path
            d="M 500 160 Q 580 240 700 360"
            fill="none"
            stroke={t1Completed ? "url(#riverGradientActive)" : "url(#riverGradientLocked)"}
            strokeWidth={t1Completed ? "8" : "4"}
            strokeLinecap="round"
            strokeDasharray={t1Completed ? "12 6" : "4 4"}
            className={t1Completed ? "animate-river-flow" : ""}
          />

          {/* Cauces desde T2 (300, 420) y T3 (700, 420) confluyendo hacia T4 (500, 620) */}
          <path
            d="M 300 420 Q 340 540 500 620"
            fill="none"
            stroke={t2Completed ? "url(#riverGradientActive)" : "url(#riverGradientLocked)"}
            strokeWidth={t2Completed ? "8" : "4"}
            strokeLinecap="round"
            strokeDasharray={t2Completed ? "12 6" : "4 4"}
            className={t2Completed ? "animate-river-flow" : ""}
          />
          <path
            d="M 700 420 Q 660 540 500 620"
            fill="none"
            stroke={t3Completed ? "url(#riverGradientActive)" : "url(#riverGradientLocked)"}
            strokeWidth={t3Completed ? "8" : "4"}
            strokeLinecap="round"
            strokeDasharray={t3Completed ? "12 6" : "4 4"}
            className={t3Completed ? "animate-river-flow" : ""}
          />

          {/* Cauce desde T4 (500, 670) hacia Delta T5 (500, 850) */}
          <path
            d="M 500 670 L 500 850"
            fill="none"
            stroke={t4Completed ? "url(#riverGradientActive)" : "url(#riverGradientLocked)"}
            strokeWidth={t4Completed ? "10" : "4"}
            strokeLinecap="round"
            strokeDasharray={t4Completed ? "14 6" : "4 4"}
            className={t4Completed ? "animate-river-flow" : ""}
          />
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
