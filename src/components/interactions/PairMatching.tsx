'use client';

import React, { useState } from 'react';
import { InteractionConclusion } from './InteractionConclusion';
import { Link2, Check, RotateCcw } from 'lucide-react';

export interface PairItem {
  id: string;
  leftText: string;
  rightText: string;
}

export interface PairMatchingProps {
  pairs: PairItem[];
  instruction?: string;
  onComplete: (matches: Record<string, string>) => void;
  conclusionCopy?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export function PairMatching({
  pairs,
  instruction = 'Empareja cada concepto de la izquierda con su contraparte de la derecha:',
  onComplete,
  conclusionCopy = 'Has establecido las conexiones correctas entre elementos.',
  onNext,
  nextLabel,
}: PairMatchingProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId
  const [completed, setCompleted] = useState(false);

  // Mezclar columna derecha aleatoriamente una sola vez
  const [shuffledRights] = useState(() =>
    [...pairs].sort(() => Math.random() - 0.5).map((p) => ({ id: p.id, text: p.rightText }))
  );

  const handleSelectLeft = (id: string) => {
    if (matches[id]) return; // ya emparejado
    setSelectedLeft(id === selectedLeft ? null : id);
  };

  const handleSelectRight = (rightId: string) => {
    if (!selectedLeft) return;

    // Comprobar si rightId ya está asignado a otro left
    const alreadyUsed = Object.values(matches).includes(rightId);
    if (alreadyUsed) return;

    const newMatches = { ...matches, [selectedLeft]: rightId };
    setMatches(newMatches);
    setSelectedLeft(null);

    // Verificar si todos los pares están completos
    if (Object.keys(newMatches).length === pairs.length) {
      const allCorrect = Object.entries(newMatches).every(([leftId, rId]) => leftId === rId);
      if (allCorrect) {
        setCompleted(true);
        onComplete(newMatches);
      }
    }
  };

  const handleReset = () => {
    setMatches({});
    setSelectedLeft(null);
    setCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-river-400">
            <Link2 className="w-4 h-4" />
            <span>{instruction}</span>
          </div>
          {Object.keys(matches).length > 0 && !completed && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-earth-300 hover:text-earth-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar emparejamientos</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-earth-300 mb-2">
              Premisa / Desafío
            </h4>
            {pairs.map((item) => {
              const isMatched = Boolean(matches[item.id]);
              const isSelected = selectedLeft === item.id;
              const isCorrect = matches[item.id] === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLeft(item.id)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-lg text-left text-sm transition-all border flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                    isSelected
                      ? 'bg-river-900 border-river-400 text-earth-50 shadow-md ring-1 ring-river-400'
                      : isMatched
                      ? isCorrect
                        ? 'bg-canopy-900/60 border-river-500/50 text-river-200 cursor-default'
                        : 'bg-editorial-accent/20 border-editorial-accent text-earth-200'
                      : 'bg-canopy-900/40 border-canopy-800 text-earth-100 hover:border-canopy-600'
                  }`}
                >
                  <span className="font-serif">{item.leftText}</span>
                  {isMatched && <Check className="w-4 h-4 text-river-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Columna Derecha */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-earth-300 mb-2">
              Respuesta / Articulación
            </h4>
            {shuffledRights.map((item) => {
              const matchedLeftId = Object.keys(matches).find((lId) => matches[lId] === item.id);
              const isMatched = Boolean(matchedLeftId);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectRight(item.id)}
                  disabled={isMatched || !selectedLeft}
                  className={`w-full p-4 rounded-lg text-left text-sm transition-all border flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                    isMatched
                      ? 'bg-canopy-900/60 border-river-500/50 text-river-200 cursor-default'
                      : selectedLeft
                      ? 'bg-canopy-900/80 border-river-400/60 text-earth-100 hover:bg-river-950/80 hover:border-river-400 cursor-pointer animate-pulse-subtle'
                      : 'bg-canopy-900/30 border-canopy-800/60 text-earth-300 cursor-not-allowed'
                  }`}
                >
                  <span className="font-serif">{item.text}</span>
                  {isMatched && <Check className="w-4 h-4 text-river-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {completed && (
        <InteractionConclusion
          title="Emparejamiento Exitoso"
          copy={conclusionCopy}
          onContinue={onNext}
          transitionLabel={nextLabel}
        />
      )}
    </div>
  );
}
