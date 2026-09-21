'use client';

import React from 'react';
import Link from 'next/link';
import { TerritoryStatus } from '@/lib/persistence/types';
import { Lock, Check } from 'lucide-react';

interface TerritoryNodeProps {
  id: string;
  number: number;
  title: string;
  functionalQuestion: string;
  status: TerritoryStatus;
  x: number;
  y: number;
}

export function TerritoryNode({
  id,
  number,
  title,
  functionalQuestion,
  status,
  x,
  y,
}: TerritoryNodeProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isVisited = status === 'visited';
  const isAvailable = status === 'unlocked' || isVisited;

  const getStatusLabel = () => {
    if (isCompleted) return '✓ Recorrido';
    if (isVisited) return 'En curso';
    if (isAvailable) return 'Disponible para navegar';
    return 'Bloqueado';
  };

  const content = (
    <div className="flex flex-col items-center group relative text-center">
      {/* Ficha táctil manipulable de la estación fluvial */}
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative shadow-xl ${
          isCompleted
            ? 'bg-jade-600 border-jade-200 text-white shadow-[0_0_25px_rgba(45,138,110,0.7)] ring-2 ring-jade-400/60'
            : isVisited
            ? 'bg-forest-900 border-solar-400 text-solar-200 shadow-[0_0_20px_rgba(212,155,53,0.5)] ring-2 ring-solar-400/50 hover:scale-105'
            : isAvailable
            ? 'bg-forest-900 border-water-400 text-water-100 shadow-[0_0_20px_rgba(38,180,214,0.5)] ring-2 ring-water-400/60 hover:scale-105'
            : 'bg-forest-950/90 border-forest-800 text-forest-600 opacity-50 grayscale cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <Check className="w-6 h-6 text-white stroke-[2.5]" />
        ) : isLocked ? (
          <Lock className="w-5 h-5 text-earth-400/80" />
        ) : (
          <span className="font-serif font-bold text-lg md:text-xl text-earth-50">
            {number}
          </span>
        )}

        {/* Indicador sutil de corriente activa para estaciones disponibles */}
        {isAvailable && !isCompleted && !isVisited && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-water-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-water-500"></span>
          </span>
        )}

        {/* Distintivo para estación en curso */}
        {isVisited && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-solar-400 shadow-sm"></span>
          </span>
        )}
      </div>

      {/* Cartel editorial de la estación con superficie protegida de alto contraste */}
      <div className="mt-3 max-w-[190px] sm:max-w-[210px] md:max-w-[230px] p-2.5 rounded-xl bg-forest-950/85 border border-forest-800/80 backdrop-blur-md shadow-lg transition-all group-hover:border-water-500/60">
        <span
          className={`block text-[10px] font-mono uppercase tracking-widest font-semibold mb-1 ${
            isCompleted
              ? 'text-jade-300'
              : isVisited
              ? 'text-solar-300'
              : isAvailable
              ? 'text-water-300'
              : 'text-earth-400/70'
          }`}
        >
          {getStatusLabel()}
        </span>
        <h3 className="font-serif font-semibold text-xs sm:text-sm md:text-base text-earth-50 leading-tight">
          {title}
        </h3>
        <p className="hidden md:block text-[11px] text-earth-200/85 font-sans mt-1.5 leading-snug line-clamp-2">
          {functionalQuestion}
        </p>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div
        style={{ left: `${x}%`, top: `${y}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        aria-hidden="true"
      >
        {content}
      </div>
    );
  }

  return (
    <div
      style={{ left: `${x}%`, top: `${y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <Link
        href={`/territorios/${id}`}
        aria-label={`Ir al Territorio ${number}: ${title}. ${functionalQuestion}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 rounded-2xl p-2 transition-transform hover:-translate-y-0.5"
      >
        {content}
      </Link>
    </div>
  );
}
