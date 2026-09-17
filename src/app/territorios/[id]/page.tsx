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
import { Lock, ArrowLeft } from 'lucide-react';

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
    isTerritoryUnlocked,
    setLastVisited,
  } = useProgression();

  useEffect(() => {
    if (territory && isTerritoryUnlocked(id)) {
      setLastVisited(`/territorios/${id}`);
      // Si el territorio no estaba aún completado ni visitado, marcarlo como visitado
      if (progress.territoryStatus[id] === 'unlocked') {
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
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-canopy-900 border border-canopy-700 mx-auto flex items-center justify-center text-earth-400">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-earth-50">Territorio bloqueado</h1>
        <p className="text-sm text-earth-300 font-sans leading-relaxed">
          Este tramo del río se abrirá cuando hayas recorrido las corrientes anteriores.
        </p>
        <div>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-editorial-accent text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al río</span>
          </Link>
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
