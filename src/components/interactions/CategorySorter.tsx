'use client';

import React, { useState } from 'react';
import { InteractionConclusion } from './InteractionConclusion';
import { SplitSquareVertical, CheckCircle2, RotateCcw } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
}

export interface CategoryItem {
  id: string;
  text: string;
  correctCategoryId: string;
}

export interface CategorySorterProps {
  categories: Category[];
  items: CategoryItem[];
  instruction?: string;
  onComplete: (assigned: Record<string, string>) => void;
  conclusionCopy?: string;
  onNext?: () => void;
  nextLabel?: string;
}

export function CategorySorter({
  categories,
  items,
  instruction = 'Clasifica cada tarjeta asignándola a la categoría correspondiente:',
  onComplete,
  conclusionCopy = 'Has clasificado correctamente todas las tensiones y oportunidades.',
  onNext,
  nextLabel,
}: CategorySorterProps) {
  // item.id -> category.id
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAssign = (itemId: string, categoryId: string) => {
    const next = { ...assignments, [itemId]: categoryId };
    setAssignments(next);

    // Comprobar si todos están asignados y correctos
    if (Object.keys(next).length === items.length) {
      const allCorrect = items.every((it) => next[it.id] === it.correctCategoryId);
      if (allCorrect) {
        setIsCompleted(true);
        onComplete(next);
      }
    }
  };

  const handleReset = () => {
    setAssignments({});
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-xl bg-earth-900/50 border border-canopy-700/60 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-river-400">
            <SplitSquareVertical className="w-4 h-4" />
            <span>{instruction}</span>
          </div>
          {Object.keys(assignments).length > 0 && !isCompleted && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-earth-300 hover:text-earth-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar asignaciones</span>
            </button>
          )}
        </div>

        {/* Columnas de Categorías con sus elementos asignados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((cat) => {
            const assignedItems = items.filter((it) => assignments[it.id] === cat.id);

            return (
              <div
                key={cat.id}
                className="rounded-xl border border-canopy-700 bg-canopy-950/70 p-5 flex flex-col min-h-[160px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-canopy-800">
                  <h4 className="font-serif font-semibold text-earth-100 text-base">
                    {cat.label}
                  </h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-canopy-800 text-river-300">
                    {assignedItems.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  {assignedItems.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-earth-400 italic py-6">
                      Sin elementos clasificados aquí aún.
                    </div>
                  ) : (
                    assignedItems.map((it) => {
                      const isCorrect = it.correctCategoryId === cat.id;
                      return (
                        <div
                          key={it.id}
                          className={`p-3 rounded-lg text-sm border flex items-start justify-between gap-2 ${
                            isCorrect
                              ? 'bg-river-950/80 border-river-400/40 text-earth-100'
                              : 'bg-editorial-accent/20 border-editorial-accent text-earth-100'
                          }`}
                        >
                          <span className="leading-snug">{it.text}</span>
                          {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-river-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lista de Fichas pendientes / controles accesibles por botón */}
        <div className="space-y-4 pt-4 border-t border-canopy-800">
          <h4 className="text-xs font-mono uppercase tracking-wider text-earth-300">
            Tarjetas para clasificar (Selecciona la categoría destino):
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => {
              const currentCategory = assignments[item.id];
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-canopy-900/60 border border-canopy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <span className="text-sm font-serif text-earth-100 flex-1">
                    {item.text}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {categories.map((cat) => {
                      const isSelected = currentCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleAssign(item.id, cat.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ${
                            isSelected
                              ? 'bg-river-600 text-white font-semibold shadow-sm'
                              : 'bg-canopy-800 text-earth-200 hover:bg-canopy-700'
                          }`}
                        >
                          → {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isCompleted && (
        <InteractionConclusion
          title="Clasificación Completada"
          copy={conclusionCopy}
          onContinue={onNext}
          transitionLabel={nextLabel}
        />
      )}
    </div>
  );
}
