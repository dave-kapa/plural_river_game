'use client';

import React, { useState } from 'react';
import { InteractionConclusion } from './InteractionConclusion';
import { Table, Check, PlusCircle } from 'lucide-react';

export interface MatrixRowStep {
  phase: string;
  pluralCore: string;
  gamefulLens: string;
}

export interface MatrixTableBuilderProps {
  steps: MatrixRowStep[];
  instruction?: string;
  onComplete: () => void;
  conclusionCopy?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export function MatrixTableBuilder({
  steps,
  instruction = 'Construye progresivamente la matriz de articulación activando cada una de las fases metodológicas:',
  onComplete,
  conclusionCopy = 'Has integrado todas las fases del Método Plural con la perspectiva gameful.',
  onNext,
  nextLabel,
}: MatrixTableBuilderProps) {
  const [revealedCount, setRevealedCount] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleRevealNext = () => {
    const nextCount = revealedCount + 1;
    setRevealedCount(nextCount);

    if (nextCount >= steps.length && !isCompleted) {
      setIsCompleted(true);
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-river-400">
            <Table className="w-4 h-4" />
            <span>{instruction}</span>
          </div>
          <span className="text-xs font-mono text-earth-300">
            {revealedCount} de {steps.length} articulaciones
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-canopy-800 rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-canopy-950 border-b border-canopy-800 text-earth-300 text-xs font-mono uppercase tracking-wider">
                <th className="p-4 w-1/4">Fase del Método</th>
                <th className="p-4 w-3/8">Núcleo Plural</th>
                <th className="p-4 w-3/8">Potenciador Gameful</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canopy-800/80">
              {steps.map((step, idx) => {
                const isVisible = idx < revealedCount;
                return (
                  <tr
                    key={idx}
                    className={`transition-all ${
                      isVisible
                        ? 'bg-canopy-900/40 text-earth-100'
                        : 'bg-canopy-950/30 text-earth-400/40 opacity-40'
                    }`}
                  >
                    <td className="p-4 font-serif font-semibold border-r border-canopy-800/60">
                      <div className="flex items-center gap-2">
                        {isVisible && <Check className="w-4 h-4 text-river-400 shrink-0" />}
                        <span>{step.phase}</span>
                      </div>
                    </td>
                    <td className="p-4 font-sans border-r border-canopy-800/60 text-xs md:text-sm">
                      {isVisible ? step.pluralCore : '••••••••••••••••••••••••••••••'}
                    </td>
                    <td className="p-4 font-sans text-xs md:text-sm text-river-200">
                      {isVisible ? step.gamefulLens : '••••••••••••••••••••••••••••••'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {revealedCount < steps.length && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleRevealNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-river-700 hover:bg-river-600 text-white font-medium text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Articular siguiente fase ({revealedCount + 1} de {steps.length})</span>
            </button>
          </div>
        )}
      </div>

      {isCompleted && (
        <InteractionConclusion
          title="Matriz Completada"
          copy={conclusionCopy}
          onContinue={onNext}
          transitionLabel={nextLabel}
        />
      )}
    </div>
  );
}
