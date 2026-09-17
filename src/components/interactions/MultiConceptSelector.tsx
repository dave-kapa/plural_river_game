'use client';

import React, { useState } from 'react';
import { InteractionConclusion } from './InteractionConclusion';
import { Check, Layers } from 'lucide-react';

export interface ConceptItem {
  id: string;
  label: string;
  description: string;
  isRelevant: boolean;
}

export interface MultiConceptSelectorProps {
  concepts: ConceptItem[];
  instruction?: string;
  onComplete: (selectedIds: string[]) => void;
  conclusionCopy?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export function MultiConceptSelector({
  concepts,
  instruction = 'Selecciona todos los conceptos afines a la mirada gameful:',
  onComplete,
  conclusionCopy = 'Has identificado los conceptos clave.',
  onNext,
  nextLabel,
}: MultiConceptSelectorProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleConcept = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleValidate = () => {
    // Todos los relevantes seleccionados y ninguno no relevante
    const relevantIds = concepts.filter((c) => c.isRelevant).map((c) => c.id);
    const hasAllRelevant = relevantIds.every((id) => selected.includes(id));
    const hasNoIrrelevant = selected.every((id) => relevantIds.includes(id));

    if (hasAllRelevant && hasNoIrrelevant) {
      setSubmitted(true);
      onComplete(selected);
    } else {
      // Si falta alguno, dar retroalimentación sutil
      alert('Revisa tu selección: algunos conceptos seleccionados no corresponden, o faltan conceptos clave.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-river-400">
          <Layers className="w-4 h-4" />
          <span>{instruction}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map((concept) => {
            const isChecked = selected.includes(concept.id);
            return (
              <button
                key={concept.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleConcept(concept.id)}
                className={`p-4 rounded-lg text-left transition-all border flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                  isChecked
                    ? 'bg-river-900/80 border-river-400 text-earth-50 shadow-md'
                    : 'bg-canopy-900/40 border-canopy-800 text-earth-200 hover:border-canopy-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-river-500 border-river-400 text-white'
                      : 'border-canopy-600 bg-canopy-950'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="font-serif font-medium text-base mb-1">{concept.label}</div>
                  <div className="text-xs text-earth-300 leading-relaxed">{concept.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {!submitted && (
          <div className="mt-6 pt-4 border-t border-canopy-800 flex justify-end">
            <button
              type="button"
              onClick={handleValidate}
              disabled={selected.length === 0}
              className="px-5 py-2 rounded-lg bg-editorial-accent hover:bg-editorial-accent/90 disabled:opacity-50 text-white font-medium text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              Confirmar Selección
            </button>
          </div>
        )}
      </div>

      {submitted && (
        <InteractionConclusion
          title="Conceptos Validados"
          copy={conclusionCopy}
          onContinue={onNext}
          transitionLabel={nextLabel}
        />
      )}
    </div>
  );
}
