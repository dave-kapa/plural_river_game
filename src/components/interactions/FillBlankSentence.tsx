'use client';

import React, { useState, useEffect } from 'react';
import { InteractionConclusion } from './InteractionConclusion';
import { HelpCircle } from 'lucide-react';

interface Blank {
  id: string;
  correct: string;
  options: string[];
}

interface FillBlankData {
  sentenceParts: string[];
  blanks: Blank[];
}

interface FillBlankSentenceProps {
  data: FillBlankData;
  initialAnswers?: Record<string, string>;
  onComplete: (answers: Record<string, string>) => void;
  conclusionCopy?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export function FillBlankSentence({
  data,
  initialAnswers = {},
  onComplete,
  conclusionCopy = 'Has completado la formulación de la premisa.',
  onNext,
  nextLabel,
}: FillBlankSentenceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Verificar si todos los blancos están respondidos correctamente
    const allFilled = data.blanks.every((b) => answers[b.id]);
    const allCorrect = data.blanks.every((b) => answers[b.id] === b.correct);

    if (allFilled && allCorrect && !isCompleted) {
      setIsCompleted(true);
      onComplete(answers);
    }
  }, [answers, data.blanks, isCompleted, onComplete]);

  const handleSelect = (blankId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-wider text-river-400">
          <HelpCircle className="w-4 h-4" />
          <span>Completar la premisa seleccionando los términos correctos</span>
        </div>

        <p className="text-lg md:text-xl font-serif text-earth-100 leading-loose">
          {data.sentenceParts.map((part, index) => {
            const blank = data.blanks[index];
            return (
              <React.Fragment key={index}>
                <span>{part}</span>
                {blank && (
                  <span className="inline-block mx-1.5 align-baseline">
                    <label htmlFor={`blank-${blank.id}`} className="sr-only">
                      Selecciona palabra para el espacio {index + 1}
                    </label>
                    <select
                      id={`blank-${blank.id}`}
                      value={answers[blank.id] || ''}
                      onChange={(e) => handleSelect(blank.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-md font-sans text-sm font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                        answers[blank.id] === blank.correct
                          ? 'bg-river-800 text-river-100 border border-river-400 shadow-sm'
                          : answers[blank.id]
                          ? 'bg-earth-800 text-earth-200 border border-editorial-accent'
                          : 'bg-canopy-900 text-earth-300 border border-canopy-600 hover:border-river-500'
                      }`}
                    >
                      <option value="">[ Seleccionar... ]</option>
                      {blank.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-canopy-950 text-earth-100">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </p>

        <div className="mt-6 pt-4 border-t border-canopy-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-earth-300">
          <span>Opciones seleccionables vía teclado (flechas / Enter) o mouse/touch.</span>
          {isCompleted && (
            <span className="text-river-300 font-semibold flex items-center gap-1.5">
              ✓ Premisa resuelta correctamente
            </span>
          )}
        </div>
      </div>

      {isCompleted && (
        <InteractionConclusion
          title="Perspectiva Fundacional Asimilada"
          copy={conclusionCopy}
          onContinue={onNext}
          transitionLabel={nextLabel}
        />
      )}
    </div>
  );
}
