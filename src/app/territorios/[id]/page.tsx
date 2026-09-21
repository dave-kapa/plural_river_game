'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { TERRITORIES_DATA } from '@/data/territories';
import { useProgression } from '@/lib/progression/ProgressionContext';
import { Territory1View } from '@/components/territory/views/Territory1View';
import { Territory2View } from '@/components/territory/views/Territory2View';
import { Territory3View } from '@/components/territory/views/Territory3View';
import { Territory4View } from '@/components/territory/views/Territory4View';
import { Territory5View } from '@/components/territory/views/Territory5View';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface TerritoryPageProps {
  params: { id: string };
}

export default function TerritoryPage({ params }: TerritoryPageProps) {
  const { id } = params;
  const territory = TERRITORIES_DATA[id];

  const {
    progress,
    isLoading,
    saveTerritoryProgress,
    registerDiscoveredItems,
    trackInteraction,
    isTerritoryUnlocked,
    setLastVisited,
  } = useProgression();

  const visitedMarkedRef = React.useRef<Record<string, boolean>>({});
  const lastRouteRef = React.useRef<string>('');

  useEffect(() => {
    if (territory && isTerritoryUnlocked(id)) {
      const route = `/territorios/${id}`;
      if (lastRouteRef.current !== route) {
        lastRouteRef.current = route;
        setLastVisited(route);
      }
      // Si el territorio no estaba aún completado ni visitado, marcarlo como visitado una única vez
      if (progress.territoryStatus[id] === 'unlocked' && !visitedMarkedRef.current[id]) {
        visitedMarkedRef.current[id] = true;
        saveTerritoryProgress(id, 'visited');
      }
    }
  }, [id, territory, isTerritoryUnlocked, progress.territoryStatus, saveTerritoryProgress, setLastVisited]);

  if (!territory) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-6">
        <h1 className="text-2xl font-serif font-bold text-earth-50">Territorio no encontrado</h1>
        <p className="text-sm text-earth-300">Este cauce no existe en la cartografía actual.</p>
        <Link
          href="/mapa"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-river-700 text-white text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al río</span>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center text-earth-300 font-mono text-sm">
        Sondeando el cauce...
      </div>
    );
  }

  const isUnlocked = isTerritoryUnlocked(id);

  if (!isUnlocked) {
    let lockExplanation = 'Este tramo del río se abrirá cuando hayas recorrido las corrientes anteriores.';
    let returnHref = '/mapa';
    let returnLabel = 'Volver al río';

    if (id === 'territorio-2' || id === 'territorio-3') {
      lockExplanation =
        'Para abrir esta corriente de la bifurcación, necesitas completar el Territorio 1: articular la definición integrada (6 disciplinas) y explorar al menos 3 de los 4 lentes.';
      returnHref = '/territorios/territorio-1';
      returnLabel = 'Ir al Territorio 1';
    } else if (id === 'territorio-4') {
      lockExplanation =
        'La Confluencia (Territorio 4) requiere que hayas recorrido y completado tanto el Territorio 2 como el Territorio 3.';
      returnHref = '/mapa';
      returnLabel = 'Volver al mapa del río';
    } else if (id === 'territorio-5') {
      lockExplanation =
        'El Delta Fluvial (Territorio 5) se abrirá una vez hayas completado el Territorio 4.';
      returnHref = '/territorios/territorio-4';
      returnLabel = 'Ir al Territorio 4';
    }

    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-canopy-900 border border-canopy-700 mx-auto flex items-center justify-center text-amber-400">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-earth-50">Territorio bloqueado</h1>
        <p className="text-sm text-earth-300 font-sans leading-relaxed max-w-md mx-auto">
          {lockExplanation}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={returnHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-editorial-accent hover:bg-editorial-accent/90 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{returnLabel}</span>
          </Link>
          {returnHref !== '/mapa' && (
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-canopy-900 hover:bg-canopy-800 border border-canopy-700 text-earth-200 text-sm font-medium transition-colors"
            >
              <span>Ver mapa del río</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  switch (id) {
    case 'territorio-1':
      return <Territory1View />;
    case 'territorio-2':
      return <Territory2View />;
    case 'territorio-3':
      return <Territory3View />;
    case 'territorio-4':
      return <Territory4View />;
    case 'territorio-5':
      return <Territory5View />;
    default:
      return null;
  }
}
