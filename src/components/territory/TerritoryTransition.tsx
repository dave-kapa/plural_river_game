'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Map } from 'lucide-react';

interface TerritoryTransitionProps {
  mapReturnLabel?: string;
  nextRoute?: string;
  nextLabel?: string;
  isCompleted: boolean;
}

export function TerritoryTransition({
  mapReturnLabel = 'Volver al Mapa del Río',
  nextRoute,
  nextLabel = 'Siguiente Territorio',
  isCompleted,
}: TerritoryTransitionProps) {
  return (
    <nav
      aria-label="Navegación del territorio"
      className="mt-12 pt-8 border-t border-canopy-800 flex flex-wrap items-center justify-between gap-4"
    >
      <Link
        href="/mapa"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-canopy-900/80 hover:bg-canopy-800 text-earth-200 text-sm font-medium border border-canopy-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
      >
        <Map className="w-4 h-4" />
        <span>{mapReturnLabel}</span>
      </Link>

      {nextRoute && isCompleted && (
        <Link
          href={nextRoute}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  );
}
