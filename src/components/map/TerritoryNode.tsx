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
    if (isCompleted) return 'Territorio recorrido';
    if (isVisited) return 'Territorio en curso';
    if (isAvailable) return 'Territorio disponible';
    return 'Territorio bloqueado';
  };

  const content = (
    <div className="flex flex-col items-center group relative text-center">
      {/* Círculo de la estación del río */}
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
          isCompleted
            ? 'bg-river-900 border-river-300 text-river-100 shadow-[0_0_20px_rgba(69,150,156,0.5)] ring-2 ring-river-400/40'
            : isAvailable
            ? 'bg-canopy-900 border-river-400 text-earth-100 shadow-md ring-2 ring-river-400/30 hover:scale-105 animate-pulse-subtle'
            : 'bg-canopy-950 border-canopy-800 text-canopy-700 opacity-60 cursor-not-allowed'
        }`}
      >
        {isCompleted ? (
          <Check className="w-6 h-6 text-river-300" />
        ) : isLocked ? (
          <Lock className="w-5 h-5 text-earth-400/60" />
        ) : (
          <span className="font-serif font-bold text-lg md:text-xl text-earth-50">
            {number}
          </span>
        )}

        {/* Indicador de corriente activa */}
        {isAvailable && !isCompleted && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-river-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-river-500"></span>
          </span>
        )}
      </div>

      {/* Cartel editorial de la estación */}
      <div className="mt-3 max-w-[200px] md:max-w-[220px]">
        <span className="block text-[10px] font-mono uppercase tracking-widest text-river-400/90 mb-0.5">
          {getStatusLabel()}
        </span>
        <h3 className="font-serif font-semibold text-sm md:text-base text-earth-100 leading-tight">
          {title}
        </h3>
        <p className="hidden md:block text-[11px] text-earth-300/80 font-sans mt-1 line-clamp-2">
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
