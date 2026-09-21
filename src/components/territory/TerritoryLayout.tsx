'use client';

import React from 'react';
import { TerritoryData } from '@/data/territories';
import { TerritoryTransition } from './TerritoryTransition';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { formatQuotation } from '@/lib/explorer/quotePersonalizer';
import { Compass, Sparkles, User } from 'lucide-react';

interface TerritoryLayoutProps {
  territory: TerritoryData;
  isCompleted: boolean;
  nextRoute?: string;
  nextLabel?: string;
  children: React.ReactNode;
}

export function TerritoryLayout({
  territory,
  isCompleted,
  nextRoute,
  nextLabel = 'Siguiente Territorio',
  children,
}: TerritoryLayoutProps) {
  const { explorerName } = useProgression();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Cabecera del Territorio */}
      <header className="space-y-4 border-b border-canopy-800 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-river-400">
            <Compass className="w-4 h-4 text-editorial-accent" />
            <span>
              Territorio {territory.number} de 5 — {isCompleted ? '✓ Recorrido' : 'En curso'}
            </span>
          </div>
          <span className="text-xs font-mono text-earth-300">
            {explorerName ? `Explorador: ${explorerName} • ` : ''}
            {territory.functionStatement}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-earth-50 tracking-tight leading-tight">
          {territory.narrativeTitle}
        </h1>

        <div className="p-4 rounded-xl bg-canopy-900/80 border-l-4 border-editorial-accent text-earth-100">
          <span className="block text-xs font-mono uppercase tracking-wider text-river-300 mb-1">
            Pregunta Funcional:
          </span>
          <p className="text-lg md:text-xl font-serif italic text-earth-100">
            {formatQuotation(territory.functionalQuestion, explorerName)}
          </p>
        </div>

        <p className="text-base sm:text-lg text-earth-200 font-sans leading-relaxed pt-2">
          {territory.opening}
        </p>
      </header>

      {/* Contenido / Interacciones del Territorio */}
      <div className="space-y-8">{children}</div>

      {/* Navegación y Transición */}
      <TerritoryTransition
        mapReturnLabel="Volver al río"
        nextRoute={nextRoute}
        nextLabel={nextLabel}
        isCompleted={isCompleted}
      />
    </article>
  );
}
